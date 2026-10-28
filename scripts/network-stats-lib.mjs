/**
 * Pure helpers for the homepage network-stat sync.
 *
 * The site only imports src/data/network-stats.json. This module parses the
 * Farmshare dashboard's public aggregate and refuses anything else. It must
 * not be imported by client code.
 */

export const PRODUCERS_LABEL = '10k+';

export const DEFAULT_DASHBOARD_STATS_URL = 'https://farmshare-dashboard.vercel.app/api/network-stats';

export function metaDescription(plants, states) {
  return (
    `Many plants, one network. Farmshare is the coordination layer for independent meat processing: ` +
    `${plants} facilities, ${states} states, ${PRODUCERS_LABEL} producers.`
  );
}

export function orgDescription(plants, states) {
  return (
    `Farmshare is the coordination layer for independent meat processing: software and network infrastructure for ` +
    `${plants} independent processing facilities across ${states} states, serving ${PRODUCERS_LABEL} producers.`
  );
}

export function assertAggregate(stats) {
  if (!stats || typeof stats !== 'object' || Array.isArray(stats)) {
    throw new Error('network stats must be an object');
  }
  const keys = Object.keys(stats).sort();
  if (keys.join(',') !== 'plants,states,updatedAt') {
    throw new Error('network stats must contain only plants, states, and updatedAt');
  }
  if (!Number.isInteger(stats.plants) || stats.plants < 1) {
    throw new Error('plants must be a positive integer');
  }
  if (!Number.isInteger(stats.states) || stats.states < 1) {
    throw new Error('states must be a positive integer');
  }
  if (typeof stats.updatedAt !== 'string' || stats.updatedAt.length === 0 || stats.updatedAt.length > 40) {
    throw new Error('updatedAt must be a short timestamp string');
  }
  if (stats.states > stats.plants) {
    throw new Error('states cannot exceed plants');
  }
  if (stats.states > 51) {
    throw new Error('states cannot exceed 50 states plus DC');
  }
}

/**
 * Accept only the public aggregate. A payload that includes names, ids, or
 * any other field is rejected and is not included in the error.
 */
export function parseDashboardAggregate(payload) {
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (!trimmed.startsWith('{')) {
      throw new Error('dashboard response was not a JSON object');
    }
    try {
      payload = JSON.parse(trimmed);
    } catch {
      throw new Error('dashboard response was not valid JSON');
    }
  }
  assertAggregate(payload);
  return {
    plants: payload.plants,
    states: payload.states,
    updatedAt: payload.updatedAt,
  };
}

/**
 * Refuse a sudden collapse. A partial dashboard response should not replace
 * the published homepage figures.
 */
export function assertPublishable(next, previous) {
  assertAggregate(next);
  if (!previous) return;
  assertAggregate(previous);
  if (next.plants < previous.plants * 0.5) {
    throw new Error(`refusing to publish plant count ${next.plants}; previous published count was ${previous.plants}`);
  }
}

export function serializeStats(stats) {
  assertAggregate(stats);
  return `${JSON.stringify({ plants: stats.plants, states: stats.states, updatedAt: stats.updatedAt }, null, 2)}\n`;
}
