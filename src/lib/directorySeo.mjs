// Shared directory and marketing SEO copy.
// Imported by scripts/seo-build.mjs (crawlers) and the SPA (after hydration)
// so the two cannot drift. No em dashes in these strings.

export const SITE = 'https://farmshare.co';

/** Listings that are not meat processors. Kept out of pages, sitemap, and JSON-LD. */
export const EXCLUDED_SLUGS = ['shelton-s-heating-and-ac-llc-sapphire-nc'];

export const STATE_NAMES = {
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

const LEGAL_SUFFIX = /,?\s+(LLC|L\.L\.C\.|Inc\.?|Incorporated|Corp\.?|Corporation|Ltd\.?)$/i;

export function isExcludedSlug(slug) {
  return EXCLUDED_SLUGS.includes(slug);
}

export function canonicalUrl(path) {
  const raw = path && path !== '/' ? path : '/';
  const withSlash = raw.startsWith('/') ? raw : `/${raw}`;
  const clean = withSlash !== '/' && withSlash.endsWith('/') ? withSlash.slice(0, -1) : withSlash;
  return `${SITE}${clean === '/' ? '/' : clean}`;
}

/** City, ST when the record has a city. Otherwise the full state name. */
export function cityStateLabel(processor) {
  const rawCity = String(processor.location || '').split(',')[0].trim();
  const city = rawCity && !/^\d/.test(rawCity) && rawCity.toUpperCase() !== processor.state
    ? rawCity
    : '';
  if (city && processor.state) return `${city}, ${processor.state}`;
  return STATE_NAMES[processor.state] || processor.state || processor.location || '';
}

export function usesFarmshareScheduling(processor) {
  return processor.status === 'customer';
}

function joinAnd(parts) {
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
}

/**
 * Deer or venison only when the listing text says so.
 * The business name and city are removed first so "Deer Trail" does not count.
 */
export function mentionsDeer(processor, aboutText) {
  let text = [processor.description, processor.editorialSummary, aboutText, ...(processor.species || [])]
    .filter(Boolean)
    .join(' ');
  if (processor.name) text = text.split(processor.name).join(' ');
  const city = String(processor.location || '').split(',')[0].trim();
  if (city) text = text.split(city).join(' ');
  return /\b(deer|venison)\b/i.test(text);
}

export function processorTitle(processor) {
  return `${processor.name} in ${cityStateLabel(processor)} | Meat Processor`;
}

export function processorH1(processor) {
  return `${processor.name} in ${cityStateLabel(processor)}`;
}

/**
 * "[Name] in [City, ST]: hours, services, deer processing, and online booking."
 * Each clause is included only when the listing actually has that fact.
 * Customers (Farmshare scheduling) lead with "Book online."
 */
export function processorDescription(processor, aboutText) {
  const parts = [];
  if (Array.isArray(processor.hours) && processor.hours.length > 0) parts.push('hours');
  if (Array.isArray(processor.species) && processor.species.length > 0) parts.push('services');
  if (mentionsDeer(processor, aboutText)) parts.push('deer processing');
  const books = usesFarmshareScheduling(processor);
  if (books) parts.push('online booking');

  const place = `${processor.name} in ${cityStateLabel(processor)}`;
  const body = parts.length > 0
    ? `${place}: ${joinAnd(parts)}.`
    : `${place} is a custom meat processor.`;
  return books ? `Book online. ${body}` : body;
}

export function stateTitle(stateName) {
  return `Meat Processors in ${stateName} | USDA & Custom Butchers`;
}

export function stateDescription(stateName, stateProcessors, aboutBySlug) {
  const count = stateProcessors.length;
  const deer = stateProcessors.some((p) => mentionsDeer(p, aboutBySlug?.[p.slug]?.about));
  const deerClause = deer ? ', deer processing' : '';
  const plants = `${count} independent plant${count === 1 ? '' : 's'}`;
  return `Find meat processors in ${stateName}. USDA and custom butchers, with hours, services${deerClause}, and online booking where plants offer them. ${plants}.`;
}

export const HOME_TITLE = 'Farmshare | Software for Meat Processors';

export function homeDescription(stats) {
  const producers = Number(stats.producers).toLocaleString('en-US');
  return `Meat processing software and butcher shop software for independent processors. Scheduling, cut sheets, and invoicing. ${stats.facilities} facilities, ${stats.states} states, ${producers} producers.`;
}

export const FEATURES_TITLE = 'Meat Processing Software | Scheduling, Cut Sheets, and Invoicing | Farmshare';

export const FEATURES_DESCRIPTION = 'Meat processing software and butcher shop software for independent plants. Scheduling, cut sheets, and invoicing in one system.';

export const FEATURES_H1 = 'Meat Processing Software to Run a Tighter Plant';

export function directoryTitle() {
  return 'Find a Custom Meat Processor Near You | Farmshare';
}

export function directoryDescription(count) {
  return `Browse ${count} independent custom meat processors across the US. Book online with the Farmshare network or send a scheduling request to any plant in the directory.`;
}

export function speciesTitle(display) {
  return `Custom ${display} Processors Near You | Farmshare`;
}

export function speciesDescription(display, count) {
  return `Find ${count} independent ${display.toLowerCase()} processors across the US on Farmshare. Book online with network plants or send a request to any in the directory.`;
}

/** Protocol-less websites were crawled as relative links under /find-a-processor/. */
export function absoluteWebsite(raw) {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (!trimmed || trimmed === '#') return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  if (trimmed.includes(' ') || !trimmed.includes('.')) return null;
  return `https://${trimmed.replace(/^\/+/, '')}`;
}

function pushUnique(names, processorName, value) {
  if (!value) return;
  const clean = String(value).trim();
  if (!clean) return;
  if (clean.toLowerCase() === String(processorName || '').trim().toLowerCase()) return;
  if (names.some((existing) => existing.toLowerCase() === clean.toLowerCase())) return;
  names.push(clean);
}

/**
 * Other names for LocalBusiness.alternateName.
 * Uses an explicit alternateName when the record has one, plus the name with
 * a trailing legal suffix removed (LLC, Inc, Corp, Ltd). Website domains are
 * not turned into names: hyphen splits like "3-dmeats" are not brands.
 */
export function alternateNames(processor) {
  const names = [];
  const explicit = processor.alternateName;
  if (Array.isArray(explicit)) explicit.forEach((name) => pushUnique(names, processor.name, name));
  else pushUnique(names, processor.name, explicit);

  const stripped = String(processor.name || '').replace(LEGAL_SUFFIX, '').trim();
  pushUnique(names, processor.name, stripped);

  return names;
}

function partnerSchedulingSlug(processor) {
  if (Array.isArray(processor.partnerFacilities) && processor.partnerFacilities.length > 0) {
    return processor.partnerFacilities[0].slug;
  }
  return processor.partnerSlug || processor.slug;
}

export function processorJsonLd(processor, aboutText) {
  const stateName = STATE_NAMES[processor.state] || processor.state;
  const rawCity = String(processor.location || '').split(',')[0].trim();
  const city = rawCity && !/^\d/.test(rawCity) && rawCity.toUpperCase() !== processor.state
    ? rawCity
    : undefined;
  const pageUrl = canonicalUrl(`/find-a-processor/${processor.slug}`);
  const names = alternateNames(processor);
  const website = absoluteWebsite(processor.website);
  const logo = processor.logo
    ? (String(processor.logo).startsWith('/') ? `${SITE}${processor.logo}` : processor.logo)
    : null;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': pageUrl,
    name: processor.name,
    description: processorDescription(processor, aboutText),
    url: pageUrl,
    address: {
      '@type': 'PostalAddress',
      ...(processor.address ? { streetAddress: processor.address } : {}),
      ...(city ? { addressLocality: city } : {}),
      addressRegion: stateName,
      ...(processor.zip ? { postalCode: processor.zip } : {}),
      addressCountry: 'US',
    },
  };

  if (names.length === 1) ld.alternateName = names[0];
  else if (names.length > 1) ld.alternateName = names;

  if (website) ld.sameAs = website;
  if (processor.phone) ld.telephone = processor.phone;
  if (logo && /^https?:\/\//i.test(logo)) ld.image = logo;
  if (processor.lat != null && processor.lng != null) {
    ld.geo = { '@type': 'GeoCoordinates', latitude: processor.lat, longitude: processor.lng };
  }
  if (processor.rating) {
    ld.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: processor.rating,
      reviewCount: processor.userRatingCount || 1,
    };
  }
  if (usesFarmshareScheduling(processor)) {
    ld.potentialAction = {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://partners.farmshare.co/scheduling/${partnerSchedulingSlug(processor)}`,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      result: { '@type': 'Reservation', name: 'Harvest Appointment' },
    };
  }

  return ld;
}
