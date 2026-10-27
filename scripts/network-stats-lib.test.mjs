import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertPublishable,
  metaDescription,
  orgDescription,
  parseDashboardAggregate,
  serializeStats,
} from './network-stats-lib.mjs';

const dashboard = { plants: 44, states: 28, updatedAt: '2026-09-02T15:39:26.000Z' };

test('a dashboard aggregate of plants, states, and updatedAt is accepted', () => {
  assert.deepEqual(parseDashboardAggregate(JSON.stringify(dashboard)), dashboard);
  assert.deepEqual(parseDashboardAggregate(dashboard), dashboard);
});

test('a payload with customer names or extra fields is rejected', () => {
  assert.throws(() => parseDashboardAggregate({
    plants: 44,
    states: 28,
    updatedAt: '2026-09-02T15:39:26.000Z',
    customers: ['Example Plant'],
  }));
  assert.throws(() => parseDashboardAggregate([
    { name: 'Example Plant', state: 'MT' },
  ]));
  assert.throws(() => parseDashboardAggregate('<html>login</html>'));
  assert.throws(() => parseDashboardAggregate({ plants: '44', states: 28, updatedAt: '2026-09-02T15:39:26.000Z' }));
});

test('a sharp drop is not publishable, and the file shape stays aggregate-only', () => {
  assertPublishable(dashboard, { plants: 40, states: 26, updatedAt: '2026-08-01T00:00:00.000Z' });
  assert.throws(() => assertPublishable(
    { plants: 10, states: 5, updatedAt: '2026-10-27T00:00:00.000Z' },
    dashboard,
  ));

  const serialized = serializeStats(dashboard);
  assert.deepEqual(JSON.parse(serialized), dashboard);
  assert.equal(Object.keys(JSON.parse(serialized)).join(','), 'plants,states,updatedAt');
  assert.match(metaDescription(44, 28), /44 facilities, 28 states, 10k\+ producers\./);
  assert.match(orgDescription(44, 28), /44 independent processing facilities across 28 states, serving 10k\+ producers\./);
});
