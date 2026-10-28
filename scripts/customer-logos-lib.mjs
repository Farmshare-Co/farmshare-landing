/**
 * Pure helpers for the homepage customer-logo sync.
 *
 * scripts/sync-customer-logos.mjs is the only caller. The site does not import
 * this module. Matching is by hubspotId, then by normalized display name.
 * Logo files already in public/logos are never replaced, and a record with
 * logoLocked: true keeps whatever logo it has.
 */

export const DEFAULT_DASHBOARD_CUSTOMERS_URL =
  'https://farmshare-dashboard.vercel.app/api/network-customers';

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'webp', 'gif', 'svg', 'avif']);
const MAX_IMAGE_BYTES = 8_000_000;
const MIN_IMAGE_BYTES = 32;

/**
 * 404 means the route is not deployed. This dashboard also answers with 307
 * to /login until /api/network-customers is public, which is the same
 * not-ready condition. Either one is a no-op. Anything else non-2xx fails
 * the job so a partial response cannot rewrite customer status.
 */
export function classifyHttpStatus(status) {
  if (status === 404) return 'noop';
  if (status >= 300 && status < 400) return 'noop';
  if (status >= 200 && status < 300) return 'ok';
  return 'error';
}

export function normalizeName(name) {
  return String(name ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function isLocalLogo(logo) {
  return typeof logo === 'string' && logo.startsWith('/logos/') && !logo.includes('..');
}

export function isHttpUrl(url) {
  if (typeof url !== 'string' || url.length === 0 || url.length > 2000) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function hubspotIdOf(value) {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return '';
    return String(value);
  }
  if (typeof value !== 'string') return '';
  return value.trim();
}

export function parseNetworkCustomers(payload) {
  let data = payload;
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (!trimmed.startsWith('[')) {
      throw new Error('dashboard response was not a JSON array');
    }
    try {
      data = JSON.parse(trimmed);
    } catch {
      throw new Error('dashboard response was not valid JSON');
    }
  }
  if (!Array.isArray(data)) {
    throw new Error('network customers must be an array');
  }
  if (data.length > 5000) {
    throw new Error('network customers list is unexpectedly large');
  }
  return data.map((row, index) => {
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      throw new Error(`customer at index ${index} must be an object`);
    }
    const hubspotId = hubspotIdOf(row.hubspotId);
    const name = typeof row.name === 'string' ? row.name.trim() : '';
    if (!hubspotId || hubspotId.length > 40 || !name || name.length > 200) {
      throw new Error(`customer at index ${index} needs hubspotId and name`);
    }
    const logoUrl = typeof row.logoUrl === 'string' ? row.logoUrl.trim() : '';
    return {
      hubspotId,
      name,
      state: typeof row.state === 'string' ? row.state.trim() : '',
      domain: typeof row.domain === 'string' ? row.domain.trim() : '',
      logoUrl: isHttpUrl(logoUrl) ? logoUrl : '',
    };
  });
}

export function extensionFromMagic(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'gif';
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  if (buf.toString('ascii', 4, 8) === 'ftyp') {
    const brand = buf.toString('ascii', 8, 12);
    if (brand === 'avif' || brand === 'avis') return 'avif';
  }
  const head = buf.subarray(0, Math.min(buf.length, 300)).toString('utf8').trimStart().toLowerCase();
  if (head.startsWith('<svg') || (head.startsWith('<?xml') && head.includes('<svg'))) return 'svg';
  return null;
}

/** Return a safe extension, or null when the bytes are not a logo we can host. */
export function sniffImage(buf) {
  if (!buf || buf.length < MIN_IMAGE_BYTES || buf.length > MAX_IMAGE_BYTES) return null;
  const ext = extensionFromMagic(buf);
  if (!ext || !IMAGE_EXTENSIONS.has(ext)) return null;
  if (ext === 'svg') {
    const text = buf.toString('utf8');
    if (/<script|javascript:|on[a-z]+\s*=|<foreignobject|<iframe|<embed|<object/i.test(text)) {
      return null;
    }
  }
  return ext;
}

export function filenameForDownload(slug, ext) {
  if (typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) {
    throw new Error('refusing to write a logo for an unexpected slug');
  }
  if (!IMAGE_EXTENSIONS.has(ext)) {
    throw new Error('refusing to write an unexpected logo extension');
  }
  return `${slug}.${ext}`;
}

function fileSet(existingLogoFiles) {
  if (existingLogoFiles instanceof Set) return new Set(existingLogoFiles);
  return new Set(existingLogoFiles || []);
}

function localFilename(logo) {
  if (!isLocalLogo(logo)) return null;
  const filename = logo.slice('/logos/'.length);
  if (!filename || filename.includes('/') || filename.includes('..')) return null;
  return filename;
}

/**
 * Decide whether a matched customer needs a logo download.
 * Never returns a download when logoLocked is set or a local file is already present.
 */
export function decideLogo(processor, customer, files) {
  if (processor.logoLocked === true) return { download: null };
  const currentFile = localFilename(processor.logo);
  if (currentFile && files.has(currentFile)) return { download: null };

  const slug = processor.slug;
  if (typeof slug === 'string' && /^[a-z0-9-]+$/.test(slug)) {
    const prefix = `${slug}.`;
    const existing = [...files].filter((name) => name.startsWith(prefix)).sort();
    if (existing.length > 0) {
      return { download: null, logo: `/logos/${existing[0]}` };
    }
  }

  if (!customer || !isHttpUrl(customer.logoUrl)) return { download: null };
  if (typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) return { download: null };
  return { download: { slug, url: customer.logoUrl } };
}

/**
 * Plan status and logo updates. Does not mutate `processors` or touch disk.
 * Throws instead of demoting the directory when the feed matches fewer than
 * half of the processors already marked customer, and when the feed is empty.
 */
export function planCustomerSync(processors, customers, existingLogoFiles = []) {
  if (!Array.isArray(processors)) throw new Error('processors must be an array');
  if (!Array.isArray(customers) || customers.length === 0) {
    throw new Error('refusing to apply an empty customer list');
  }

  const files = fileSet(existingLogoFiles);
  const next = processors.map((processor) => ({ ...processor }));
  const byHubspot = new Map();
  const byName = new Map();

  for (const processor of next) {
    const id = hubspotIdOf(processor.hubspotId);
    if (id) {
      byHubspot.set(id, byHubspot.has(id) ? null : processor);
    }
    const key = normalizeName(processor.name);
    if (!key) continue;
    if (!byName.has(key)) byName.set(key, []);
    byName.get(key).push(processor);
  }

  const matched = new Set();
  const protectedFromDemotion = new Set();
  const customerByProcessor = new Map();
  const unmatched = [];
  const ambiguous = [];

  for (const customer of customers) {
    let match = null;
    if (byHubspot.has(customer.hubspotId)) {
      const hit = byHubspot.get(customer.hubspotId);
      if (!hit || matched.has(hit)) {
        ambiguous.push(customer.name);
        for (const processor of next) {
          if (hubspotIdOf(processor.hubspotId) === customer.hubspotId) {
            protectedFromDemotion.add(processor);
          }
        }
      } else {
        match = hit;
      }
    }
    if (!match && !byHubspot.has(customer.hubspotId)) {
      const candidates = (byName.get(normalizeName(customer.name)) || []).filter((processor) => {
        if (matched.has(processor)) return false;
        const id = hubspotIdOf(processor.hubspotId);
        return !id || id === customer.hubspotId;
      });
      if (candidates.length === 1) {
        match = candidates[0];
      } else if (candidates.length > 1) {
        ambiguous.push(customer.name);
        for (const processor of candidates) protectedFromDemotion.add(processor);
      } else {
        unmatched.push(customer.name);
      }
    }
    if (!match || matched.has(match)) continue;
    matched.add(match);
    customerByProcessor.set(match, customer);
  }

  const currentCustomers = next.filter((processor) => processor.status === 'customer');
  const matchedCurrent = currentCustomers.filter((processor) => matched.has(processor)).length;
  if (currentCustomers.length > 0 && matchedCurrent < currentCustomers.length * 0.5) {
    throw new Error(
      `refusing to update statuses; matched ${matchedCurrent} of ${currentCustomers.length} current customers`,
    );
  }

  const downloads = [];
  let promoted = 0;
  let demoted = 0;
  let hubspotIdsAdded = 0;

  for (const processor of next) {
    const customer = customerByProcessor.get(processor);
    if (customer) {
      if (processor.status !== 'customer') {
        processor.status = 'customer';
        promoted += 1;
      }
      if (!hubspotIdOf(processor.hubspotId)) {
        processor.hubspotId = customer.hubspotId;
        hubspotIdsAdded += 1;
      }
      const decision = decideLogo(processor, customer, files);
      if (decision.download) downloads.push(decision.download);
      if (decision.logo !== undefined && decision.logo !== processor.logo) {
        processor.logo = decision.logo;
      }
    } else if (processor.status === 'customer' && !protectedFromDemotion.has(processor)) {
      processor.status = 'prospect';
      demoted += 1;
    }
  }

  return {
    processors: next,
    downloads,
    promoted,
    demoted,
    hubspotIdsAdded,
    unmatched,
    ambiguous,
  };
}

async function fetchAndStoreLogo(job, { fetchImpl, files, fileExists, writeLogoFile }) {
  let response;
  try {
    response = await fetchImpl(job.url, {
      method: 'GET',
      redirect: 'follow',
      headers: { Accept: 'image/*,*/*;q=0.8' },
    });
  } catch {
    return null;
  }
  if (!response || !response.ok || typeof response.arrayBuffer !== 'function') return null;
  const bytes = Buffer.from(await response.arrayBuffer());
  const ext = sniffImage(bytes);
  if (!ext) return null;
  let filename;
  try {
    filename = filenameForDownload(job.slug, ext);
  } catch {
    return null;
  }
  const publicPath = `/logos/${filename}`;
  if (files.has(filename) || (fileExists && fileExists(filename))) {
    return publicPath;
  }
  writeLogoFile(filename, bytes);
  files.add(filename);
  return publicPath;
}

/**
 * Fetch the dashboard list, update customer/prospect status, and download
 * logos that are not already on disk. Callers perform the filesystem writes.
 * A not-ready endpoint returns { changed: false } and does not call
 * readProcessors or writeProcessors.
 */
export async function runCustomerLogoSync({
  url,
  fetchImpl = globalThis.fetch,
  readProcessors,
  writeProcessors,
  listLogoFiles,
  writeLogoFile,
  fileExists = () => false,
  dryRun = false,
  log = () => {},
}) {
  const response = await fetchImpl(url, {
    method: 'GET',
    redirect: 'manual',
    headers: { Accept: 'application/json' },
  });
  const kind = classifyHttpStatus(response.status);
  if (kind === 'noop') {
    log(`Customer endpoint is not available yet (HTTP ${response.status}). No changes.`);
    return { changed: false, reason: 'not-found' };
  }
  if (kind !== 'ok') {
    throw new Error(`Dashboard customers failed with status ${response.status}.`);
  }
  if (typeof response.text !== 'function') {
    throw new Error('dashboard response was not readable');
  }

  const customers = parseNetworkCustomers(await response.text());
  const original = readProcessors();
  const files = fileSet(listLogoFiles());
  const plan = planCustomerSync(original, customers, files);

  let downloaded = 0;
  if (!dryRun) {
    for (const job of plan.downloads) {
      const saved = await fetchAndStoreLogo(job, { fetchImpl, files, fileExists, writeLogoFile });
      if (!saved) {
        log(`Logo for ${job.slug} was not saved.`);
        continue;
      }
      const record = plan.processors.find((processor) => processor.slug === job.slug);
      if (record && record.logoLocked !== true && record.logo !== saved) {
        record.logo = saved;
        downloaded += 1;
      }
    }
  }

  const changed = JSON.stringify(original) !== JSON.stringify(plan.processors);
  const wouldChange = changed || plan.downloads.length > 0;
  const summary = {
    promoted: plan.promoted,
    demoted: plan.demoted,
    downloaded,
    plannedDownloads: plan.downloads.length,
    unmatched: plan.unmatched.length,
    ambiguous: plan.ambiguous.length,
  };

  if (dryRun) {
    log(
      `Dry run: ${summary.promoted} to promote, ${summary.demoted} to mark prospect, ` +
      `${summary.plannedDownloads} logos to download. File not written.`,
    );
    return { changed: false, wouldChange, reason: 'dry-run', ...summary };
  }
  if (!changed) {
    log(`Customer logos unchanged (${customers.length} dashboard customers).`);
    return { changed: false, reason: 'unchanged', ...summary };
  }

  writeProcessors(plan.processors);
  log(
    `Updated processors: ${summary.promoted} promoted, ${summary.demoted} marked prospect, ` +
    `${summary.downloaded} logos saved, ${summary.unmatched} dashboard names unmatched.`,
  );
  return { changed: true, ...summary };
}
