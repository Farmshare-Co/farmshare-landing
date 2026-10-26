// Post-build SEO step:
//   1. Generate per-route HTML files in dist/<route>/index.html with route-specific
//      <title>, <meta>, canonical, OG/Twitter, and JSON-LD structured data.
//      Vercel serves these directly when the URL hits, before the SPA fallback.
//   2. Regenerate dist/sitemap.xml + public/sitemap.xml from current processors.json
//      with today's lastmod, including state pages, every processor page,
//      species sub-routes, and core marketing pages.
//
// Run via `npm run build` → vite build → this script.
// Copy for titles and descriptions lives in src/lib/directorySeo.mjs so the
// prerender and the SPA stay on the same strings.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITE,
  STATE_NAMES,
  canonicalUrl,
  isExcludedSlug,
  processorTitle,
  processorDescription,
  processorJsonLd,
  stateTitle,
  stateDescription,
  directoryTitle,
  directoryDescription,
  speciesTitle,
  speciesDescription,
  FEATURES_TITLE,
  FEATURES_DESCRIPTION,
  HOME_TITLE,
} from '../src/lib/directorySeo.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.resolve(root, 'dist');
const publicDir = path.resolve(root, 'public');

const SPECIES = ['beef', 'hog', 'lamb', 'goat', 'bison', 'veal'];

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function stateSlug(stateAbbr) {
  return STATE_NAMES[stateAbbr]?.toLowerCase().replace(/\s+/g, '-');
}

function clip(str, n) {
  if (!str) return str;
  return str.length > n ? str.slice(0, n - 1).trimEnd() + '…' : str;
}

const processors = JSON.parse(fs.readFileSync(path.join(root, 'src/data/processors.json'), 'utf-8'));
const aboutBySlug = JSON.parse(fs.readFileSync(path.join(root, 'src/data/processorAboutContent.json'), 'utf-8'));
const today = new Date().toISOString().slice(0, 10);

function publishedProcessors() {
  return processors.filter((p) => !isExcludedSlug(p.slug));
}

function buildRoutes() {
  const routes = [];
  const listed = publishedProcessors();

  routes.push({
    path: '/mission',
    title: 'Our Mission | Farmshare',
    description: 'Four companies control 85% of beef processing in America. Their advantage is not quality. It is scale and intelligence. Farmshare is building both for independent processors.',
    priority: 0.8,
  });

  // Quiet press page. Prerendered so a shared link previews correctly, but
  // marked noindex and deliberately kept out of the sitemap and site nav.
  routes.push({
    path: '/newsroom',
    title: 'Newsroom | Farmshare',
    description: 'Company information and press contact for Farmshare, the coordination layer for independent meat processing.',
    noindex: true,
  });

  routes.push({
    path: '/features',
    title: FEATURES_TITLE,
    description: FEATURES_DESCRIPTION,
    priority: 0.8,
  });

  routes.push({
    path: '/find-a-processor',
    title: directoryTitle(),
    description: directoryDescription(listed.length),
    priority: 0.9,
    structured: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Custom Meat Processor Directory',
      description: 'Nationwide directory of independent custom meat processors offering online scheduling through Farmshare.',
      numberOfItems: listed.length,
    },
    schemaId: 'directory-schema',
  });

  routes.push({
    path: '/buy-beef',
    title: 'Buy Local Beef: Quarters, Halves, Wholes | Farmshare',
    description:
      'Buy local beef by the quarter, half, or whole, direct from the farm. Farmshare connects you with an independent processor near you. Pork, lamb, and goat too.',
    priority: 0.7,
  });

  routes.push({
    path: '/release-notes',
    title: 'Release Notes | Farmshare',
    description: 'Recent product updates from the Farmshare team: new features, improvements, and fixes for independent meat processors.',
    priority: 0.5,
  });

  routes.push({
    path: '/privacy',
    title: 'Privacy Policy | Farmshare',
    description: 'How Farmshare collects, uses, and shares information from people who use the meat processing software and the processor directory.',
    priority: 0.3,
  });

  routes.push({
    path: '/terms',
    title: 'Terms of Service | Farmshare',
    description: 'Terms of service for Farmshare meat processing software, the processor directory, and related services.',
    priority: 0.3,
  });

  routes.push({
    path: '/service-agreement',
    title: 'Service Agreement | Farmshare',
    description: 'Farmshare service agreement for meat processors using scheduling, cut sheets, and invoicing.',
    priority: 0.3,
  });

  const states = [...new Set(listed.map((p) => p.state))].filter((s) => STATE_NAMES[s]);
  for (const stateAbbr of states.sort()) {
    const stateName = STATE_NAMES[stateAbbr];
    const slug = stateSlug(stateAbbr);
    const inState = listed.filter((p) => p.state === stateAbbr);
    if (inState.length === 0) continue;

    routes.push({
      path: `/find-a-processor/${slug}`,
      title: stateTitle(stateName),
      description: clip(stateDescription(stateName, inState, aboutBySlug), 300),
      priority: 0.7,
      changefreq: 'weekly',
      schemaId: 'state-schema',
      structured: {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Meat Processors in ${stateName}`,
        description: stateDescription(stateName, inState, aboutBySlug),
        numberOfItems: inState.length,
        itemListElement: inState.slice(0, 50).map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'LocalBusiness',
            name: p.name,
            ...(p.alternateName ? { alternateName: p.alternateName } : {}),
            address: {
              '@type': 'PostalAddress',
              addressLocality: p.location.split(',')[0].trim(),
              addressRegion: stateName,
              addressCountry: 'US',
            },
            url: canonicalUrl(`/find-a-processor/${p.slug}`),
          },
        })),
      },
    });
  }

  for (const sp of SPECIES) {
    const display = sp[0].toUpperCase() + sp.slice(1);
    const speciesProcessors = listed.filter((p) => p.species && p.species.includes(display));
    if (speciesProcessors.length === 0) continue;
    routes.push({
      path: `/find-a-processor/species/${sp}`,
      title: speciesTitle(display),
      description: speciesDescription(display, speciesProcessors.length),
      priority: 0.7,
      changefreq: 'weekly',
    });
  }

  for (const p of listed) {
    if (p.businessStatus === 'CLOSED_PERMANENTLY') continue;
    const aboutText = aboutBySlug[p.slug]?.about;
    const isCustomer = p.status === 'customer';
    const logo = p.logo && String(p.logo).startsWith('http') ? p.logo : null;

    routes.push({
      path: `/find-a-processor/${p.slug}`,
      title: processorTitle(p),
      description: clip(processorDescription(p, aboutText), 300),
      image: logo,
      priority: isCustomer ? 0.8 : 0.6,
      changefreq: 'monthly',
      schemaId: 'processor-schema',
      structured: processorJsonLd(p, aboutText),
    });
  }

  return routes;
}

function customizeHtml(template, route) {
  const url = canonicalUrl(route.path);
  let html = template;

  const replacements = [
    [/<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`],
    [/<meta name="title" content="[^"]*"\s*\/?>/i, `<meta name="title" content="${escapeHtml(route.title)}" />`],
    [/<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeHtml(route.description)}" />`],
    [/<link rel="canonical" href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${url}" />`],
    [/<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(route.title)}" />`],
    [/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(route.description)}" />`],
    [/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${url}" />`],
    [/<meta property="twitter:title" content="[^"]*"\s*\/?>/i, `<meta property="twitter:title" content="${escapeHtml(route.title)}" />`],
    [/<meta property="twitter:description" content="[^"]*"\s*\/?>/i, `<meta property="twitter:description" content="${escapeHtml(route.description)}" />`],
    [/<meta property="twitter:url" content="[^"]*"\s*\/?>/i, `<meta property="twitter:url" content="${url}" />`],
  ];

  for (const [re, val] of replacements) {
    html = html.replace(re, val);
  }

  if (!html.includes('rel="canonical"')) {
    html = html.replace('</head>', `    <link rel="canonical" href="${url}" />\n  </head>`);
  }

  if (route.noindex) {
    html = html.replace(/<meta name="robots" content="[^"]*"\s*\/?>/i, '<meta name="robots" content="noindex, follow" />');
  }

  if (route.image) {
    html = html.replace(/<meta property="og:image" content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${escapeHtml(route.image)}" />`);
    html = html.replace(/<meta property="twitter:image" content="[^"]*"\s*\/?>/i, `<meta property="twitter:image" content="${escapeHtml(route.image)}" />`);
  }

  if (route.structured) {
    const ldJson = JSON.stringify(route.structured).replace(/</g, '\\u003c');
    const idAttr = route.schemaId ? ` id="${route.schemaId}"` : '';
    html = html.replace('</head>', `    <script type="application/ld+json"${idAttr}>${ldJson}</script>\n  </head>`);
  }

  return html;
}

function writePrerenderedRoute(template, route) {
  const html = customizeHtml(template, route);
  const outDir = path.join(distDir, route.path);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
}

function writeSitemap(routes) {
  const urls = [
    { loc: canonicalUrl('/'), lastmod: today, changefreq: 'weekly', priority: 1.0 },
    ...routes.filter((r) => !r.noindex).map((r) => ({
      loc: canonicalUrl(r.path),
      lastmod: today,
      changefreq: r.changefreq || 'monthly',
      priority: r.priority ?? 0.5,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml);
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  return urls.length;
}

function assertCopy() {
  const sample = {
    name: 'Beaverhead Meats',
    location: 'Dillon, MT',
    state: 'MT',
    species: ['Beef', 'Hog', 'Lamb'],
    status: 'customer',
    hours: ['Monday: 9:00 AM to 6:00 PM'],
    slug: 'beaverhead-meats-dillon-mt',
    description: 'Custom processing of domestic and wild game animals.',
  };
  const title = processorTitle(sample);
  const description = processorDescription(sample);
  if (title !== 'Beaverhead Meats in Dillon, MT | Meat Processor') {
    throw new Error(`unexpected processor title: ${title}`);
  }
  if (!description.startsWith('Book online. Beaverhead Meats in Dillon, MT:')) {
    throw new Error(`unexpected processor description: ${description}`);
  }
  if (description.includes('deer') || description.includes('—')) {
    throw new Error(`processor description invented a fact or used an em dash: ${description}`);
  }
  const deer = processorDescription(
    { ...sample, status: 'prospect', description: 'Seasonal deer processing.' },
    '',
  );
  if (!deer.includes('deer processing') || deer.startsWith('Book online')) {
    throw new Error(`unexpected deer description: ${deer}`);
  }
  if (stateTitle('Montana') !== 'Meat Processors in Montana | USDA & Custom Butchers') {
    throw new Error('unexpected state title');
  }
  if (FEATURES_TITLE.startsWith('Meat Processing Software') === false || FEATURES_DESCRIPTION.includes('—')) {
    throw new Error('features copy drifted');
  }
  if (HOME_TITLE !== 'Farmshare | The Coordination Layer for Independent Meat' || /processors/i.test(HOME_TITLE)) {
    throw new Error(`homepage title must stay free of "Processors": ${HOME_TITLE}`);
  }
}

function main() {
  if (!fs.existsSync(distDir)) {
    console.error('seo-build: dist/ does not exist; run `vite build` first.');
    process.exit(1);
  }

  assertCopy();

  const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
  const routes = buildRoutes();

  for (const slug of ['shelton-s-heating-and-ac-llc-sapphire-nc', 'beaverheadmeats.com']) {
    if (routes.some((r) => r.path === `/find-a-processor/${slug}`)) {
      throw new Error(`seo-build: junk path was prerendered: ${slug}`);
    }
  }
  if (routes.some((r) => r.noindex && r.path !== '/newsroom')) {
    // noindex routes must stay out of the sitemap. writeSitemap filters them.
  }
  if (routes.filter((r) => !r.noindex).some((r) => r.path.startsWith('/seller'))) {
    throw new Error('seo-build: seller pages must not be in the sitemap');
  }

  let written = 0;
  for (const route of routes) {
    if (route.path === '/' || !route.path) continue;
    writePrerenderedRoute(template, route);
    written++;
  }

  const totalSitemap = writeSitemap(routes);
  const sitemap = fs.readFileSync(path.join(publicDir, 'sitemap.xml'), 'utf-8');
  if (sitemap.includes('www.farmshare.co') || sitemap.includes('shelton-s-heating') || sitemap.includes('beaverheadmeats.com') || sitemap.includes('/seller')) {
    throw new Error('seo-build: sitemap contains a host or junk URL that should not be indexed');
  }
  if (!sitemap.startsWith('<?xml') || !sitemap.includes(`${SITE}/features`)) {
    throw new Error('seo-build: sitemap missing the preferred host');
  }

  console.log(`seo-build: wrote ${written} prerendered routes + sitemap.xml (${totalSitemap} URLs)`);
}

main();
