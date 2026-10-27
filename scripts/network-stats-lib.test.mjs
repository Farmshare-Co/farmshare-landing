import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertPublishable,
  countSignedPlants,
  metaDescription,
  orgDescription,
  serializeStats,
  stateCodesFrom,
} from './network-stats-lib.mjs';

test('state names and abbreviations collapse, and a dual state counts twice', () => {
  assert.deepEqual(stateCodesFrom('Idaho', ''), ['ID']);
  assert.deepEqual(stateCodesFrom('id', ''), ['ID']);
  assert.deepEqual(stateCodesFrom('', 'mt'), ['MT']);
  assert.deepEqual(stateCodesFrom('CO & KS', ''), ['CO', 'KS']);
  assert.deepEqual(stateCodesFrom('Washington DC', ''), ['DC']);
  assert.deepEqual(stateCodesFrom('Unassigned', ''), []);
  assert.deepEqual(stateCodesFrom('Unassigned', 'CO'), ['CO']);
  assert.deepEqual(stateCodesFrom('Narnia', ''), []);
  assert.deepEqual(stateCodesFrom('', ''), []);
});

test('signed plants are distinct companies, excluding churned lifecycle stages', () => {
  const counts = countSignedPlants(
    [
      { id: '1', lifecyclestage: 'customer', state: 'Idaho' },
      { id: '1', lifecyclestage: 'customer', state: 'ID' },
      { id: '2', lifecyclestage: '142222223', state: 'Montana' },
      { id: '3', lifecyclestage: '142225202', state: 'WY' },
      { id: '4', lifecyclestage: 'evangelist', state: '' },
      { id: '5', lifecyclestage: '142223971', state: 'TX' },
      { id: '6', lifecyclestage: 'lead', state: 'NE' },
    ],
    [
      { id: '6', lifecyclestage: 'opportunity', state: 'NE' },
      { id: '7', lifecyclestage: '142223971', state: 'IL' },
      { id: '2', lifecyclestage: '142222223', state: 'MT' },
    ],
  );

  assert.equal(counts.plants, 5);
  assert.equal(counts.states, 4);
  assert.equal(counts.missingState, 1);
  assert.equal(counts.addedFromDealsBeforeLifecycle, 1);
});

test('the observed HubSpot state distribution is 49 plants in 29 states', () => {
  const groups = [
    ['CO', 'customer', 5],
    ['OH', '142222223', 1],
    ['OH', 'customer', 2],
    ['WI', 'customer', 3],
    ['', '142222223', 1],
    ['', 'customer', 1],
    ['GA', 'customer', 2],
    ['ID', 'customer', 2],
    ['MT', '142222223', 1],
    ['MT', 'customer', 1],
    ['NY', '142222223', 1],
    ['NY', 'customer', 1],
    ['OK', '142222223', 1],
    ['OK', 'customer', 1],
    ['TN', 'customer', 2],
    ['UT', 'customer', 2],
    ['VT', '142222223', 2],
    ['AR', '142222223', 1],
    ['AZ', 'customer', 1],
    ['FL', 'customer', 1],
    ['IA', 'customer', 1],
    ['Idaho', 'customer', 1],
    ['IN', 'customer', 1],
    ['KY', 'customer', 1],
    ['MA', 'customer', 1],
    ['ME', '142222223', 1],
    ['MO', 'customer', 1],
    ['Montana', 'customer', 1],
    ['NC', 'customer', 1],
    ['ND', 'customer', 1],
    ['OR', 'customer', 1],
    ['PA', 'customer', 1],
    ['SD', 'customer', 1],
    ['VA', 'customer', 1],
    ['WA', '142222223', 1],
    ['WV', 'customer', 1],
    ['WY', '142225202', 1],
  ];

  const companies = [];
  let n = 0;
  for (const [state, lifecyclestage, count] of groups) {
    for (let i = 0; i < count; i += 1) {
      n += 1;
      companies.push({ id: `c${n}`, lifecyclestage, state });
    }
  }

  const counts = countSignedPlants(companies, []);
  assert.equal(counts.plants, 49);
  assert.equal(counts.states, 29);
  assert.equal(counts.missingState, 2);
});

test('a sharp drop is not publishable, and the file shape stays aggregate-only', () => {
  const next = { plants: 49, states: 29, updatedAt: '2026-10-27T00:00:00.000Z' };
  assertPublishable(next, { plants: 44, states: 28, updatedAt: '2026-09-02T00:00:00.000Z' });
  assert.throws(() => assertPublishable(
    { plants: 10, states: 5, updatedAt: '2026-10-27T00:00:00.000Z' },
    next,
  ));

  const serialized = serializeStats(next);
  assert.deepEqual(JSON.parse(serialized), next);
  assert.equal(Object.keys(JSON.parse(serialized)).join(','), 'plants,states,updatedAt');
  assert.match(metaDescription(49, 29), /49 facilities, 29 states, 10k\+ producers\./);
  assert.match(orgDescription(49, 29), /49 independent processing facilities across 29 states, serving 10k\+ producers\./);
});
