/**
 * Pull signed-plant counts from HubSpot and write src/data/network-stats.json.
 *
 * The file contains only { plants, states, updatedAt }. Company names, deal
 * names, and ids are never written or logged. The HubSpot token is read from
 * HUBSPOT_PRIVATE_APP_TOKEN and is never passed to Vite.
 *
 * Usage: node scripts/sync-network-stats.mjs [--dry-run]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SIGNED_DEAL_QUERIES,
  SIGNED_LIFECYCLE_STAGES,
  assertPublishable,
  countSignedPlants,
  serializeStats,
} from './network-stats-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outFile = path.join(root, 'src/data/network-stats.json');
const HS = 'https://api.hubapi.com';
const MAX_RECORDS = 2000;
const dryRun = process.argv.includes('--dry-run');

const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
if (!token) {
  console.error('Missing HUBSPOT_PRIVATE_APP_TOKEN. Refusing to change network-stats.json.');
  process.exit(1);
}

async function hs(pathname, body) {
  const res = await fetch(`${HS}${pathname}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    // Response bodies can contain CRM records. Log the status only.
    throw new Error(`HubSpot ${pathname} failed with status ${res.status}`);
  }
  return res.json();
}

async function searchAll(objectType, body) {
  const records = [];
  let after;
  do {
    const page = await hs(`/crm/v3/objects/${objectType}/search`, {
      ...body,
      limit: 100,
      ...(after ? { after } : {}),
    });
    const batch = page.results || [];
    records.push(...batch);
    if (records.length > MAX_RECORDS) {
      throw new Error(`HubSpot ${objectType} search exceeded ${MAX_RECORDS} records. Refusing to continue.`);
    }
    after = page.paging?.next?.after;
  } while (after);
  return records;
}

function toCompany(record) {
  const properties = record.properties || {};
  return {
    id: String(record.id),
    lifecyclestage: properties.lifecyclestage || '',
    state: properties.state || '',
    hsStateCode: properties.hs_state_code || '',
  };
}

async function signedLifecycleCompanies() {
  const records = await searchAll('companies', {
    // Filter groups are OR. One group per signed stage stays within HubSpot's limit.
    filterGroups: [...SIGNED_LIFECYCLE_STAGES].map((stage) => ({
      filters: [{ propertyName: 'lifecyclestage', operator: 'EQ', value: stage }],
    })),
    properties: ['lifecyclestage', 'state', 'hs_state_code'],
  });
  return records.map(toCompany);
}

async function companyIdsForSignedDeals() {
  const deals = await searchAll('deals', {
    filterGroups: SIGNED_DEAL_QUERIES.map(({ pipeline, dealstage }) => ({
      filters: [
        { propertyName: 'pipeline', operator: 'EQ', value: pipeline },
        { propertyName: 'dealstage', operator: 'EQ', value: dealstage },
      ],
    })),
    properties: ['pipeline', 'dealstage'],
  });

  const dealIds = deals.map((deal) => String(deal.id));
  const companyIds = new Set();
  let dealsWithoutCompany = 0;

  for (let i = 0; i < dealIds.length; i += 100) {
    const inputs = dealIds.slice(i, i + 100).map((id) => ({ id }));
    const page = await hs('/crm/v4/associations/deals/companies/batch/read', { inputs });
    const seen = new Set();
    for (const row of page.results || []) {
      const fromId = String(row.from?.id || '');
      seen.add(fromId);
      const tos = row.to || [];
      if (tos.length === 0) {
        dealsWithoutCompany += 1;
        continue;
      }
      for (const to of tos) {
        const id = to.toObjectId ?? to.id;
        if (id != null) companyIds.add(String(id));
      }
    }
    for (const input of inputs) {
      if (!seen.has(input.id)) dealsWithoutCompany += 1;
    }
  }

  return { companyIds: [...companyIds], dealsWithoutCompany, dealCount: dealIds.length };
}

async function readCompanies(ids) {
  const companies = [];
  let unreadable = 0;
  for (let i = 0; i < ids.length; i += 100) {
    const inputs = ids.slice(i, i + 100).map((id) => ({ id }));
    const page = await hs('/crm/v3/objects/companies/batch/read', {
      properties: ['lifecyclestage', 'state', 'hs_state_code'],
      inputs,
    });
    companies.push(...(page.results || []).map(toCompany));
    unreadable += (page.errors || []).length;
    if ((page.numErrors || 0) > unreadable) unreadable = page.numErrors;
  }
  return { companies, unreadable };
}

function readPrevious() {
  let raw;
  try {
    raw = fs.readFileSync(outFile, 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT') return null;
    throw error;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error('Previous network-stats.json was not valid JSON. It will be replaced with aggregate counts only.');
    return null;
  }
  const keys = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? Object.keys(parsed).sort().join(',') : '';
  if (keys !== 'plants,states,updatedAt') {
    console.error('Previous network-stats.json was not an aggregate file. Replacing it with plants, states, and updatedAt only.');
    return null;
  }
  return parsed;
}

async function main() {
  const lifecycleCompanies = await signedLifecycleCompanies();
  const { companyIds, dealsWithoutCompany, dealCount } = await companyIdsForSignedDeals();
  if (dealCount > 0 && companyIds.length === 0) {
    throw new Error('Signed deals were found but none had a company association. Refusing to publish.');
  }
  const { companies: dealCompanies, unreadable } = await readCompanies(companyIds);
  if (unreadable > 0) {
    throw new Error(`HubSpot could not read ${unreadable} companies. Refusing to publish a partial count.`);
  }
  const counts = countSignedPlants(lifecycleCompanies, dealCompanies);

  console.log(`plants ${counts.plants}`);
  console.log(`states ${counts.states}`);
  console.log(`missing_state ${counts.missingState}`);
  console.log(`from_deals_before_lifecycle ${counts.addedFromDealsBeforeLifecycle}`);
  console.log(`signed_deals ${dealCount}`);
  console.log(`deals_without_company ${dealsWithoutCompany}`);
  console.log(`unreadable_companies ${unreadable}`);

  const previous = readPrevious();
  const next = {
    plants: counts.plants,
    states: counts.states,
    updatedAt: new Date().toISOString(),
  };
  assertPublishable(next, previous);

  if (previous && previous.plants === next.plants && previous.states === next.states) {
    console.log('Counts unchanged. Leaving network-stats.json in place.');
    return;
  }

  if (dryRun) {
    console.log('Dry run. Not writing network-stats.json.');
    return;
  }

  const serialized = serializeStats(next);
  const temp = `${outFile}.tmp`;
  fs.writeFileSync(temp, serialized);
  fs.renameSync(temp, outFile);
  console.log('Wrote src/data/network-stats.json');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Network stat sync failed');
  process.exit(1);
});
