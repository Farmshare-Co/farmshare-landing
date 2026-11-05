import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  cityFromAddress,
  displayLocation,
  locationAfterAddressEdit,
} from '../src/lib/listingPlace.mjs';
import { displayedProse, editorProse, mergeAboutEntry } from '../src/lib/listingProse.mjs';

const FLINT_ADDRESS = '834 Georgia Highway 26 W Oglethorpe GA';

test('Flint Packers public city follows the Oglethorpe address, not Andersonville', () => {
  const label = displayLocation({
    location: 'Andersonville, GA',
    address: FLINT_ADDRESS,
    state: 'GA',
  });
  assert.equal(cityFromAddress(FLINT_ADDRESS, 'GA'), 'Oglethorpe');
  assert.equal(label, 'Oglethorpe, GA');
  // The partner scheduling slug is not a display input. Andersonville in
  // flint-packers-andersonville-ga must not pull the card back.
  assert.equal(
    displayLocation({ location: 'Andersonville, GA', address: FLINT_ADDRESS, state: 'GA' }),
    'Oglethorpe, GA',
  );
});

test('the postal city in the address wins over a different stored city', () => {
  assert.equal(
    displayLocation({
      location: 'Andersonville, GA',
      address: 'Andersonville Road, Oglethorpe, GA 31068',
      state: 'GA',
    }),
    'Oglethorpe, GA',
  );
  assert.equal(
    displayLocation({
      location: 'oglethorpe, GA',
      address: FLINT_ADDRESS,
      state: 'GA',
    }),
    'oglethorpe, GA',
  );
});

test('street-only addresses keep the stored city', () => {
  assert.equal(cityFromAddress('11253 Upper Patterson Creek Road', 'WV'), null);
  assert.equal(
    displayLocation({
      location: 'Burlington, WV',
      address: '11253 Upper Patterson Creek Road',
      state: 'WV',
    }),
    'Burlington, WV',
  );
});

test('comma-separated and legacy joined addresses parse the postal city', () => {
  assert.equal(cityFromAddress('123 Main St, Springfield, IL 62701', 'IL'), 'Springfield');
  assert.equal(
    cityFromAddress('2998 Englishville RoadAndersonville, GA 31711 United States', 'GA'),
    'Andersonville',
  );
  assert.equal(
    cityFromAddress('Box 349Jordan, MT 59337 United States', 'MT'),
    'Jordan',
  );
  assert.equal(
    displayLocation({
      location: 'Jordan, MT',
      address: 'Box 349Jordan, MT 59337 United States',
      state: 'MT',
    }),
    'Jordan, MT',
  );
});

test('address edits persist the postal city and do not invent one', () => {
  assert.equal(
    locationAfterAddressEdit(
      { location: 'Andersonville, GA', state: 'GA', address: '2998 Englishville Road' },
      FLINT_ADDRESS,
    ),
    'Oglethorpe, GA',
  );
  assert.equal(
    locationAfterAddressEdit(
      { location: 'Burlington, WV', state: 'WV' },
      '11253 Upper Patterson Creek Road',
    ),
    'Burlington, WV',
  );
});

test('stored location matches the city named in the address for every listing', () => {
  const processors = JSON.parse(fs.readFileSync(new URL('../src/data/processors.json', import.meta.url), 'utf8'));
  const drifted = processors.filter((p) => {
    const shown = displayLocation(p);
    return shown && p.location && shown.toLowerCase() !== String(p.location).toLowerCase();
  });
  assert.deepEqual(drifted.map((p) => p.slug), []);
});

test('directory data for Flint Packers stores Oglethorpe and keeps the scheduling slug', () => {
  const processors = JSON.parse(fs.readFileSync(new URL('../src/data/processors.json', import.meta.url), 'utf8'));
  const flint = processors.find((p) => p.slug === 'flint-packers-ga');
  assert.ok(flint);
  assert.equal(flint.location, 'Oglethorpe, GA');
  assert.equal(flint.address, FLINT_ADDRESS);
  assert.equal(flint.zip, '31068');
  assert.equal(flint.partnerSlug, 'flint-packers-andersonville-ga');
  assert.equal(displayLocation(flint), 'Oglethorpe, GA');
});

test('public prose prefers a long about, which is what the editor must seed', () => {
  const about = 'A'.repeat(120);
  const previous = 'Older description the admin form used to show on its own.';
  assert.equal(displayedProse({ description: previous, about }), about);
  assert.equal(displayedProse({ description: previous, about: 'short tagline' }), previous);
  assert.equal(
    displayedProse({ description: '', about: 'short', editorialSummary: 'From Google' }),
    'From Google',
  );
});

test('saving a new description replaces the about text visitors see', () => {
  const oldAbout = `Start-up cattle and hog processor in Oglethorpe, GA. ${'x'.repeat(80)}`;
  const edited =
    'Flint Packers, LLC is a regional resource for high-quality custom meat processing and packaging services.';
  const merged = mergeAboutEntry({ about: oldAbout, website: 'flintpackers.com' }, edited);
  assert.equal(merged.about, edited);
  assert.equal(merged.website, 'flintpackers.com');
  assert.equal(displayedProse({ description: edited, about: merged.about }), edited);
});

test('clearing the description removes about so the previous paragraph cannot come back', () => {
  const old = 'y'.repeat(140);
  const merged = mergeAboutEntry({ about: old, website: 'flintpackers.com' }, '   ');
  assert.equal(merged.about, undefined);
  assert.equal(merged.website, 'flintpackers.com');
  assert.equal(displayedProse({ description: '', about: merged.about }), '');
  assert.equal(mergeAboutEntry({ about: old }, ''), null);
});

test('a stale admin bundle does not overwrite a description that just saved', () => {
  const stale = 'Start-up cattle and hog processor in Oglethorpe, GA.';
  const saved = 'Flint Packers, LLC is a regional resource.';
  const pending = { prose: saved, replaced: stale };
  assert.equal(editorProse(stale, pending), saved);
  assert.equal(editorProse(saved, pending), saved);
  assert.equal(editorProse('A newer edit from someone else', pending), 'A newer edit from someone else');
  assert.equal(editorProse(stale, null), stale);
});
