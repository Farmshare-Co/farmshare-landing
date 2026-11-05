import networkStats from '../data/network-stats.json';
import processors from '../data/processors.json';

/**
 * Homepage network figures.
 *
 * plants and states are the directory records marked customer. That is the
 * same set as the "Online scheduling only" filter: every Farmshare customer
 * in the current snapshot, with no separate scheduling-link check.
 * src/data/network-stats.json publishes that snapshot and must match it.
 * producers is the static label "10k+".
 *
 * These sentences are also filled into index.html by the Vite plugin in
 * vite.config.ts, which imports this module. Keep the wording here.
 */

const PRODUCERS_LABEL = '10k+';

function assertAggregates(value: unknown): { plants: number; states: number } {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('network-stats.json must be an object of aggregate counts');
  }
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  if (keys.join(',') !== 'plants,states,updatedAt') {
    throw new Error('network-stats.json must contain only plants, states, and updatedAt');
  }
  const { plants, states } = record;
  if (!Number.isInteger(plants) || !Number.isInteger(states) || (plants as number) < 1 || (states as number) < 1) {
    throw new Error('network-stats.json plants and states must be positive integers');
  }
  return { plants: plants as number, states: states as number };
}

const published = assertAggregates(networkStats);
const customers = (processors as { status?: string; state?: string }[]).filter((processor) => processor.status === 'customer');
const directoryStates = new Set(
  customers.map((processor) => (processor.state || '').trim()).filter((state) => /^[A-Z]{2}$/.test(state)),
);
if (published.plants !== customers.length || published.states !== directoryStates.size) {
  throw new Error(
    `network-stats.json is ${published.plants} plants / ${published.states} states, ` +
    `but the directory has ${customers.length} customers in ${directoryStates.size} states`,
  );
}

export const NETWORK_STATS = {
  plants: published.plants,
  states: published.states,
  producersLabel: PRODUCERS_LABEL,
} as const;

export const NETWORK_META_DESCRIPTION =
  `Many plants, one network. Farmshare is the coordination layer for independent meat processing: ` +
  `${NETWORK_STATS.plants} facilities, ${NETWORK_STATS.states} states, ${NETWORK_STATS.producersLabel} producers.`;

export const NETWORK_ORG_DESCRIPTION =
  `Farmshare is the coordination layer for independent meat processing: software and network infrastructure for ` +
  `${NETWORK_STATS.plants} independent processing facilities across ${NETWORK_STATS.states} states, serving ${NETWORK_STATS.producersLabel} producers.`;
