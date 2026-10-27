/**
 * Pure helpers for the homepage network-stat sync.
 *
 * This module must never be imported by client code. It knows HubSpot
 * pipeline and lifecycle ids. The site only imports src/data/network-stats.json,
 * which is limited to the two aggregate counts plus updatedAt.
 */

/** Post-signature company lifecycle stages. */
export const SIGNED_LIFECYCLE_STAGES = new Set([
  'customer', // Customer
  '142222223', // Onboarding
  '142225202', // Closed Won
  'evangelist', // Evangelist
]);

/** Churned companies. A historical closed-won deal does not keep them. */
export const EXCLUDED_LIFECYCLE_STAGES = new Set([
  '142223971', // Deactivated
  '142222226', // Closed Lost
]);

/**
 * New-business pipelines whose closed-won stage means a plant signed.
 * Growth & Renewal and the Customer Lifecycle pipeline are intentionally absent:
 * those stages are expansions or onboarding milestones, and HubSpot marks some
 * of them closed-won only because the stage probability is 1.
 */
export const SIGNED_DEAL_QUERIES = [
  { pipeline: '652756237', dealstage: '959773741' }, // Farmshare Deal Pipeline / Closed: Won
  { pipeline: '139919618', dealstage: '239936119' }, // All Deals (legacy) / Closed Won
];

export const PRODUCERS_LABEL = '10k+';

const STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma',
  OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

const CODE_BY_NAME = Object.fromEntries(
  Object.entries(STATE_NAMES).map(([code, name]) => [name.toLowerCase(), code]),
);

/**
 * Distinct USPS codes in a company state value.
 * `state` wins over `hsStateCode`. Blank and unrecognized values add nothing.
 * "Idaho" and "ID" are the same state. "CO & KS" is two states.
 */
function usableState(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed || /^unassigned$/i.test(trimmed)) return '';
  return trimmed;
}

export function stateCodesFrom(state, hsStateCode) {
  const raw = usableState(state) || usableState(hsStateCode);
  if (!raw) return [];

  const parts = raw.split(/\s*(?:&|\/|,|;|\band\b)\s*/i).map((part) => part.trim()).filter(Boolean);
  const codes = [];
  for (const part of parts) {
    const code = normalizeState(part);
    if (code && !codes.includes(code)) codes.push(code);
  }
  return codes;
}

function normalizeState(value) {
  const cleaned = value.trim().replace(/\./g, '').replace(/\s+/g, ' ');
  if (!cleaned || /^unassigned$/i.test(cleaned)) return null;

  const lower = cleaned.toLowerCase();
  if (lower === 'washington dc' || lower === 'washington d c' || lower === 'district of columbia') {
    return 'DC';
  }
  if (/^[a-z]{2}$/i.test(cleaned)) {
    const code = cleaned.toUpperCase();
    return STATE_NAMES[code] ? code : null;
  }
  return CODE_BY_NAME[lower] || null;
}

/**
 * @param {Array<{id: string, lifecyclestage: string, state?: string, hsStateCode?: string}>} lifecycleCompanies
 * @param {Array<{id: string, lifecyclestage: string, state?: string, hsStateCode?: string}>} dealCompanies
 */
export function countSignedPlants(lifecycleCompanies, dealCompanies) {
  const byId = new Map();

  for (const company of lifecycleCompanies) {
    if (!company?.id) continue;
    if (EXCLUDED_LIFECYCLE_STAGES.has(company.lifecyclestage)) continue;
    if (!SIGNED_LIFECYCLE_STAGES.has(company.lifecyclestage)) continue;
    byId.set(String(company.id), company);
  }

  let addedFromDealsBeforeLifecycle = 0;
  for (const company of dealCompanies) {
    if (!company?.id) continue;
    if (EXCLUDED_LIFECYCLE_STAGES.has(company.lifecyclestage)) continue;
    const id = String(company.id);
    if (byId.has(id)) continue;
    byId.set(id, company);
    addedFromDealsBeforeLifecycle += 1;
  }

  const states = new Set();
  let missingState = 0;
  for (const company of byId.values()) {
    const codes = stateCodesFrom(company.state, company.hsStateCode);
    if (codes.length === 0) missingState += 1;
    for (const code of codes) states.add(code);
  }

  return {
    plants: byId.size,
    states: states.size,
    missingState,
    addedFromDealsBeforeLifecycle,
  };
}

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
 * Refuse a sudden collapse. A partial HubSpot response should not replace
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
