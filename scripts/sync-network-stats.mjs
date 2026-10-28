/**
 * Pull active-customer counts from the Farmshare dashboard and write
 * src/data/network-stats.json.
 *
 * The dashboard response and the file are only { plants, states, updatedAt }.
 * Customer names are never written or logged. No HubSpot token and no
 * Supabase service-role key are read.
 *
 * Usage: node scripts/sync-network-stats.mjs [--dry-run]
 *
 * Optional: DASHBOARD_NETWORK_STATS_URL (defaults to the production aggregate).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_DASHBOARD_STATS_URL,
  assertPublishable,
  parseDashboardAggregate,
  serializeStats,
} from './network-stats-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outFile = path.join(root, 'src/data/network-stats.json');
const dryRun = process.argv.includes('--dry-run');
const url = process.env.DASHBOARD_NETWORK_STATS_URL || DEFAULT_DASHBOARD_STATS_URL;

function readPrevious() {
  try {
    return JSON.parse(fs.readFileSync(outFile, 'utf8'));
  } catch (error) {
    if (error && error.code === 'ENOENT') return null;
    throw error;
  }
}

async function fetchAggregate() {
  const res = await fetch(url, {
    method: 'GET',
    redirect: 'manual',
    headers: { Accept: 'application/json' },
  });

  if (res.status >= 300 && res.status < 400) {
    throw new Error(
      `Dashboard aggregate redirected with status ${res.status}. ` +
      'The public /api/network-stats route is not available yet.',
    );
  }
  if (!res.ok) {
    throw new Error(`Dashboard aggregate failed with status ${res.status}.`);
  }

  const text = await res.text();
  let stats;
  try {
    stats = parseDashboardAggregate(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'invalid aggregate';
    throw new Error(`Dashboard aggregate was rejected (${message}). Response body was not logged.`);
  }
  return stats;
}

const previous = readPrevious();
const next = await fetchAggregate();
assertPublishable(next, previous);

if (
  previous &&
  previous.plants === next.plants &&
  previous.states === next.states
) {
  console.log(`Network stats unchanged: ${next.plants} plants, ${next.states} states.`);
  process.exit(0);
}

const serialized = serializeStats(next);
if (dryRun) {
  console.log(`Dry run: ${next.plants} plants, ${next.states} states. File not written.`);
  process.exit(0);
}

fs.writeFileSync(outFile, serialized);
console.log(`Wrote ${next.plants} plants, ${next.states} states.`);
