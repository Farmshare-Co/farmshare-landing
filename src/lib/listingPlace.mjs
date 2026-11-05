/**
 * Public city for a processor listing.
 *
 * `location` ("City, ST") is stored separately from `address` and `zip`.
 * It is not reverse-geocoded at render time. Geocoding the plant's lat/lng
 * often returns the nearest named place (Andersonville) even when the mailing
 * address and ZIP name a different postal city (Oglethorpe, 31068).
 *
 * When the street address itself names a city, that postal city is what the
 * public card should show. The stored location is used only when the address
 * does not name a city. A scheduling slug is not a display signal — it can
 * disagree with the postal city on purpose.
 */

const STREET = new Set(
  'street st avenue ave road rd highway hwy drive dr lane ln boulevard blvd court ct circle cir place pl trail trl way parkway pkwy route rte pike loop terrace ter square sq alley aly crossing xing point pt'.split(
    ' ',
  ),
);

const SINGLE_DIR = new Set('n s e w ne nw se sw'.split(' '));

/** "RoadAndersonville" / "349Jordan" → comma-separated (legacy joined addresses). */
export function normalizeJoinedAddress(address) {
  return String(address ?? '').replace(/([a-z0-9])([A-Z])/g, '$1, $2');
}

function isPlausibleCity(city) {
  if (!city || city.length < 2 || /^\d/.test(city)) return false;
  const tokens = city.split(/\s+/);
  if (tokens.length > 3) return false;
  return tokens.every((t) => !STREET.has(t.replace(/\./g, '').toLowerCase()));
}

/**
 * City named by a street address, or null when the address is street-only.
 * `state` (2-letter) rejects a trailing token that isn't that state.
 */
export function cityFromAddress(address, state) {
  if (!address || typeof address !== 'string') return null;
  const normalized = normalizeJoinedAddress(address).trim();
  if (!normalized) return null;
  const expected = state ? String(state).trim().toUpperCase() : null;
  const parts = normalized.split(',').map((s) => s.trim()).filter(Boolean);

  const fromStatePart = (part, cityPart) => {
    const stateZip = part.match(
      /^([A-Za-z]{2})(?:\s+\d{5}(?:-\d{4})?)?(?:\s+United States)?$/,
    );
    if (!stateZip) return null;
    const st = stateZip[1].toUpperCase();
    if (expected && st !== expected) return null;
    const city = cityPart.replace(/\s+United States$/i, '').trim();
    return isPlausibleCity(city) ? city : null;
  };

  if (parts.length >= 2) {
    for (let i = parts.length - 1; i >= 1; i--) {
      const city = fromStatePart(parts[i], parts[i - 1]);
      if (city) return city;
      const inline = parts[i].match(
        /^([A-Za-z .'-]+?)\s+([A-Za-z]{2})(?:\s+\d{5}(?:-\d{4})?)?(?:\s+United States)?$/,
      );
      if (!inline) continue;
      const st = inline[2].toUpperCase();
      if (expected && st !== expected) continue;
      const inlineCity = inline[1].trim();
      if (isPlausibleCity(inlineCity)) return inlineCity;
    }
  }

  const tail = normalized.match(/^(.*)\s+([A-Za-z]{2})(?:\s+\d{5}(?:-\d{4})?)?\s*$/);
  if (!tail) return null;
  const st = tail[2].toUpperCase();
  if (expected && st !== expected) return null;
  const tokens = tail[1].split(/\s+/).filter(Boolean);
  let cut = -1;
  for (let i = 0; i < tokens.length; i++) {
    const bare = tokens[i].replace(/\./g, '').toLowerCase();
    if (STREET.has(bare) || /^\d/.test(tokens[i])) cut = i;
  }
  const cityTokens = tokens
    .slice(cut + 1)
    .filter((t) => !SINGLE_DIR.has(t.replace(/\./g, '').toLowerCase()));
  if (!cityTokens.length) return null;
  const city = cityTokens.join(' ');
  return isPlausibleCity(city) ? city : null;
}

/** "City, ST" label for public cards, schema, and titles. */
export function displayLocation({ location = '', address = '', state = '' } = {}) {
  const stored = String(location ?? '').trim();
  const parsed = cityFromAddress(address, state);
  if (!parsed) return stored;
  const storedCity = stored.split(',')[0]?.trim() ?? '';
  if (storedCity && storedCity.toLowerCase() === parsed.toLowerCase()) return stored;
  const st = String(state ?? '').trim() || stored.split(',')[1]?.trim() || '';
  return st ? `${parsed}, ${st}` : parsed;
}

/**
 * Location to persist after an address edit. Street-only addresses leave the
 * stored city alone. Slug and partner slug are never derived from this.
 */
export function locationAfterAddressEdit(record, address) {
  const nextAddress = address == null ? record?.address : address;
  if (!cityFromAddress(nextAddress, record?.state)) {
    return String(record?.location ?? '');
  }
  return displayLocation({
    location: record?.location,
    address: nextAddress,
    state: record?.state,
  });
}
