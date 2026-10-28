/**
 * Pull active customers from the Farmshare dashboard and update
 * src/data/processors.json plus missing files in public/logos.
 *
 * GET https://farmshare-dashboard.vercel.app/api/network-customers
 * returns [{ hubspotId, name, state, domain, logoUrl }].
 *
 * The route is not public yet. Until it is, the dashboard answers 307 to
 * /login (and a future deploy may answer 404). Both are a no-op: this script
 * exits without writing. It does not push. The GitHub workflow opens a pull
 * request when files changed.
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const processorsFile = path.join(root, 'src/data/processors.json');
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
