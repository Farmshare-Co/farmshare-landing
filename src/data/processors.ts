// Shared processor directory data — used across FindProcessor, ProcessorDetail, and StatePage
// Source: src/data/processors.json (900 processors — 50 customers + 850 prospects)

import processorsData from './processors.json';

export type ProcessorStatus = 'customer' | 'prospect';

export interface Processor {
  name: string;
  /** "City, ST" stored for the directory. Public pages prefer a city named in
   *  `address` when the two disagree (see displayLocation). Not reverse-geocoded. */
  location: string;
  state: string;
  species: string[];
  logo: string | null;
  slug: string;
  status: ProcessorStatus;
  /** HubSpot company id. The customer-logo sync matches this before the display name. */
  hubspotId?: string;
  /** When true, scripts/sync-customer-logos.mjs will not replace this logo. */
  logoLocked?: boolean;
  address?: string;
  zip?: string;
  phone?: string;
  website?: string;
  description?: string;
  lat?: number;
  lng?: number;
  /** Slug used by partners.farmshare.co. Differs from `slug` when the landing
   *  directory and partner admin disagree on casing, punctuation, or city. */
  partnerSlug?: string;
  /** Live booking page on partners.farmshare.co. Absent means true.
   *  `false` plants stay in the directory but offer an info request instead of a booking link. */
  hasPartnerPage?: boolean;
  /** Multi-facility customers have more than one booking page
   *  (e.g. separate USDA + Custom plants). If set, takes precedence over
   *  `partnerSlug` when rendering booking CTAs. */
  partnerFacilities?: PartnerFacility[];
  // Fields pulled from Places API (New) — populated for ~880 of 895 records.
  googleMapsUri?: string;
  rating?: number;
  userRatingCount?: number;
  /** Human-readable weekday hours, one string per day (Mon-Sun). */
  hours?: string[];
  /** Short Google-written description. Present on ~1% of records. */
  editorialSummary?: string;
  businessStatus?: 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY';
  /** Raw Google Places type tags (e.g. 'butcher_shop', 'meat_store'). */
  placeTypes?: string[];
}

export interface PartnerFacility {
  slug: string;
  label: string;
}

export const processors: Processor[] = processorsData as Processor[];

/** Returns the primary partner slug (first facility if multi, otherwise `partnerSlug`). */
export function partnerSlugFor(p: Processor): string {
  if (p.partnerFacilities && p.partnerFacilities.length > 0) {
    return p.partnerFacilities[0].slug;
  }
  return p.partnerSlug ?? p.slug;
}

/** Returns every facility this processor offers booking at. One entry for
 *  single-facility customers; two or more for multi-facility (e.g. Weimer). */
export function partnerFacilitiesFor(p: Processor): PartnerFacility[] {
  if (p.partnerFacilities && p.partnerFacilities.length > 0) return p.partnerFacilities;
  const slug = p.partnerSlug ?? p.slug;
  return [{ slug, label: '' }];
}

/** Customer with a live partners.farmshare.co booking page.
 *  `hasPartnerPage: false` is an explicit opt-out; a missing field stays bookable. */
export function showsPartnerBooking(p: Processor): boolean {
  return p.status === 'customer' && p.hasPartnerPage !== false;
}

// State abbreviation to full name lookup — all 50 states + DC
export const stateNames: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District of Columbia",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

// Reverse lookup: full name (lowercase) -> abbreviation
export const stateAbbreviations: Record<string, string> = Object.fromEntries(
  Object.entries(stateNames).map(([abbr, name]) => [name.toLowerCase(), abbr])
);

// State slug to abbreviation (e.g., "north-dakota" -> "ND")
export const stateSlugToAbbr: Record<string, string> = Object.fromEntries(
  Object.entries(stateNames).map(([abbr, name]) => [name.toLowerCase().replace(/\s+/g, '-'), abbr])
);
