import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { planCustomerSync, parseNetworkCustomers } from './customer-logos-lib.mjs';
import { statsFromDirectory } from './network-stats-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const logoFiles = fs.readdirSync(path.join(root, 'public/logos'));

const processors = JSON.parse(fs.readFileSync(new URL('../src/data/processors.json', import.meta.url), 'utf8'));
const customers = parseNetworkCustomers(
  fs.readFileSync(new URL('./fixtures/network-customers-2026-11-05.json', import.meta.url), 'utf8'),
);
const published = JSON.parse(fs.readFileSync(new URL('../src/data/network-stats.json', import.meta.url), 'utf8'));

function bySlug(rows) {
  return new Map(rows.map((row) => [row.slug, row]));
}

test('directory customers and the homepage snapshot are the 2026-11-05 feed', () => {
  const directoryCustomers = processors.filter((row) => row.status === 'customer');
  const stats = statsFromDirectory(processors, published.updatedAt);
  assert.equal(customers.length, 50);
  assert.equal(directoryCustomers.length, customers.length);
  assert.equal(stats.plants, customers.length);
  assert.equal(stats.states, new Set(customers.map((row) => row.state)).size);
  assert.equal(published.plants, stats.plants);
  assert.equal(published.states, stats.states);
  assert.equal(stats.states, 29);
});

test('reapplying the feed does not churn listings or rewrite stored content', () => {
  const plan = planCustomerSync(processors, customers, logoFiles);
  assert.equal(plan.promoted, 0);
  assert.equal(plan.demoted, 0);
  assert.deepEqual(plan.created, []);
  assert.deepEqual(plan.unmatched, []);
  assert.deepEqual(plan.ambiguous, []);
  assert.equal(plan.downloads.length, 0);

  const before = bySlug(processors);
  const preserve = ['name', 'slug', 'address', 'description', 'website', 'partnerSlug', 'phone', 'zip', 'location', 'lat', 'lng', 'hours', 'species', 'logo'];
  for (const row of plan.processors) {
    const original = before.get(row.slug);
    assert.ok(original, row.slug);
    for (const key of preserve) {
      assert.deepEqual(row[key], original[key], `${row.slug} ${key}`);
    }
    assert.equal(row.status, original.status);
    assert.equal(row.hubspotId, original.hubspotId);
  }
});

test('known exclusions stay off the customer list and duplicates keep their own ids', () => {
  const rows = bySlug(processors);
  const cataldo = rows.get('country-meats-cataldo-id');
  const florida = rows.get('country-meats-llc-fl');
  assert.equal(cataldo.status, 'prospect');
  assert.equal(cataldo.hubspotId, undefined);
  assert.equal(cataldo.state, 'ID');
  assert.equal(florida.status, 'customer');
  assert.equal(florida.state, 'FL');
  assert.equal(florida.hubspotId, '23221205291');
  assert.equal(florida.address, undefined);

  assert.equal(rows.get('q-bar-s-custom-meats-laketown-ut').status, 'prospect');
  assert.equal(rows.get('the-butchers-block-va-llc-dry-fork-va').status, 'prospect');
  assert.equal(rows.get('the-butchers-block-va-llc-dry-fork-va').address, '4655 Dry Fork Rd');
  assert.equal(rows.get('caver-meats-clyde-ny').status, 'prospect');
  assert.equal(rows.get('caver-meats-clyde-ny').hubspotId, undefined);
  assert.equal(rows.get('shale-spring-meats-ex-caver-meats-clyde-ny').status, 'customer');
  assert.equal(rows.get('shale-spring-meats-ex-caver-meats-clyde-ny').hubspotId, '20396379018');
  assert.equal(rows.get('sunnyside-meat-packers-sunnyside-wa').status, 'prospect');
  assert.equal(rows.get('sunnyside-meats-inc-durango-co').status, 'customer');
  assert.equal(rows.get('flint-packers-ga').location, 'Oglethorpe, GA');
  assert.equal(rows.get('flint-packers-ga').status, 'customer');

  for (const slug of ['stillwater-packing-co-mt', 'vera-earl-ranch-az']) {
    assert.equal(rows.get(slug).address, undefined);
    assert.equal(rows.get(slug).description, undefined);
    assert.equal(rows.get(slug).status, 'customer');
  }
});
