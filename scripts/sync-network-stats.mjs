/**
 * Publish homepage plant and state counts from the directory's customer flags.
 *
 * The online-scheduling filter reads those same flags. This job refreshes the
 * published snapshot after a customer sync (or a manual status edit) so the
 * homepage cannot show a different count. It does not read the dashboard
 * aggregate; that number is a second source and was drifting.
 *
 * Usage: node scripts/sync-network-stats.mjs [--dry-run]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serializeStats, statsFromDirectory } from './network-stats-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const processorsFile = path.join(root, 'src/data/processors.json');
const outFile = path.join(root, 'src/data/network-stats.json');
const dryRun = process.argv.includes('--dry-run');

const processors = JSON.parse(fs.readFileSync(processorsFile, 'utf8'));
const previous = JSON.parse(fs.readFileSync(outFile, 'utf8'));
const current = statsFromDirectory(processors, previous.updatedAt);

if (previous.plants === current.plants && previous.states === current.states) {
  console.log(`Network stats unchanged: ${current.plants} plants, ${current.states} states.`);
  process.exit(0);
}

const stamped = statsFromDirectory(processors, new Date().toISOString());
if (dryRun) {
  console.log(`Dry run: ${stamped.plants} plants, ${stamped.states} states. File not written.`);
  process.exit(0);
}

fs.writeFileSync(outFile, serializeStats(stamped));
console.log(`Wrote ${stamped.plants} plants, ${stamped.states} states from directory customers.`);
