/**
 * The public About paragraph and the admin textarea have to be the same string.
 *
 * Visitors see processorAboutContent[slug].about whenever it is at least 100
 * characters, then a Google editorial summary, then processors.description.
 * The admin form used to seed itself from description only, and every save
 * posted that textarea. Saving an address (or reloading the stale build and
 * saving again) wrote the older description over the about text the page
 * actually renders — the edit looked like it reverted.
 */

export function displayedProse({ description, about, editorialSummary } = {}) {
  const aboutText = about ?? '';
  const descriptionText = description ?? '';
  const editorial = (editorialSummary ?? '').trim();
  if (aboutText.length >= 100) return aboutText;
  if (editorial) return editorial;
  if (descriptionText) return descriptionText;
  return aboutText;
}

/**
 * After a save, the open admin page is still the previous build. Prefer the
 * prose that was just saved while the bundle still has the text it replaced.
 * If the bundle has already caught up, or has some other text, use the bundle.
 */
export function editorProse(bundleProse, pending) {
  if (!pending || typeof pending.prose !== 'string') return bundleProse ?? '';
  const bundle = bundleProse ?? '';
  if (bundle === pending.prose) return bundle;
  if (typeof pending.replaced === 'string' && bundle === pending.replaced) return pending.prose;
  return bundle;
}

/**
 * Write the admin textarea into the about entry.
 * Empty prose deletes `about` so a cleared description cannot fall back to the
 * previous paragraph. Other keys (website, certifications) stay.
 * Returns null when the slug entry should be removed entirely.
 */
export function mergeAboutEntry(existing, description) {
  const base = existing && typeof existing === 'object' ? { ...existing } : {};
  const trimmed = description == null ? '' : String(description).trim();
  if (!trimmed) delete base.about;
  else base.about = trimmed;
  return Object.keys(base).length ? base : null;
}
