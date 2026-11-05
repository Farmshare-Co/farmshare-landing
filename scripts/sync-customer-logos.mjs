/**
 * Pull active customers from the Farmshare dashboard and update
 * src/data/processors.json plus missing files in public/logos.
 *
 * GET https://farmshare-dashboard.vercel.app/api/network-customers
 * returns [{ hubspotId, name, state, domain, logoUrl }].
 *
 * A 307 to /login, or a 404, is a no-op: this script exits without writing.
 * A 200 applies the feed. Listing name, slug, address, and about text are
 * left as stored. Customers the feed does not know are marked prospect.
 * The homepage plant count is rewritten from the resulting customer flags.
 * This script does not push. The GitHub workflow opens a pull request.
 *
 * Records are matched on hubspotId, then on normalized name. Existing files
 * in public/logos are never overwritten. logoLocked: true keeps the current
 * logo. An empty feed, or a feed that matches fewer than half of the current
 * customers, is refused.
 *
 * Usage: node scripts/sync-customer-logos.mjs [--dry-run]
 *
 * Optional: DASHBOARD_NETWORK_CUSTOMERS_URL
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_DASHBOARD_CUSTOMERS_URL,
  runCustomerLogoSync,
} from './customer-logos-lib.mjs';
import { serializeStats, statsFromDirectory } from './network-stats-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const processorsFile = path.join(root, 'src/data/processors.json');
const statsFile = path.join(root, 'src/data/network-stats.json');
const logoDir = path.join(root, 'public/logos');
const dryRun = process.argv.includes('--dry-run');
const url = process.env.DASHBOARD_NETWORK_CUSTOMERS_URL || DEFAULT_DASHBOARD_CUSTOMERS_URL;

const SAFE_FILENAME = /^[a-z0-9-]+\.(png|jpg|webp|gif|svg|avif)$/;

function logoPath(filename) {
  if (!SAFE_FILENAME.test(filename)) {
    throw new Error('refusing to write an unexpected logo filename');
  }
  const full = path.resolve(logoDir, filename);
  if (path.dirname(full) !== path.resolve(logoDir)) {
    throw new Error('refusing to write a logo outside public/logos');
  }
  return full;
}

const result = await runCustomerLogoSync({
  url,
  dryRun,
  log: (message) => console.log(message),
  readProcessors() {
    return JSON.parse(fs.readFileSync(processorsFile, 'utf8'));
  },
  writeProcessors(processors) {
    fs.writeFileSync(processorsFile, `${JSON.stringify(processors, null, 2)}\n`);
    const previous = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
    const stats = statsFromDirectory(processors, new Date().toISOString());
    if (previous.plants === stats.plants && previous.states === stats.states) return;
    fs.writeFileSync(statsFile, serializeStats(stats));
  },
  listLogoFiles() {
    try {
      return fs.readdirSync(logoDir).filter((name) => !name.startsWith('.'));
    } catch (error) {
      if (error && error.code === 'ENOENT') return [];
      throw error;
    }
  },
  fileExists(filename) {
    return fs.existsSync(logoPath(filename));
  },
  writeLogoFile(filename, bytes) {
    const full = logoPath(filename);
    if (fs.existsSync(full)) return;
    fs.mkdirSync(logoDir, { recursive: true });
    fs.writeFileSync(full, bytes);
  },
});

if (!result.changed) {
  process.exit(0);
}
