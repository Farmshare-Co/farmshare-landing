import { canonicalUrl } from './directorySeo.mjs';

function setMeta(attr: 'name' | 'property', key: string, content: string | undefined) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

/** Title, description, and a query-free canonical on the preferred host. */
export function applyPageMeta(opts: {
  title: string;
  description?: string;
  path: string;
  noindex?: boolean;
}) {
  const url = canonicalUrl(opts.path);
  document.title = opts.title;
  setMeta('name', 'title', opts.title);
  setMeta('name', 'description', opts.description);
  setMeta('property', 'og:title', opts.title);
  setMeta('property', 'og:description', opts.description);
  setMeta('property', 'og:url', url);
  setMeta('property', 'twitter:title', opts.title);
  setMeta('property', 'twitter:description', opts.description);
  setMeta('property', 'twitter:url', url);
  setCanonical(url);
  setMeta('name', 'robots', opts.noindex ? 'noindex, follow' : 'index, follow');
}

/** Canonical for routes that set their own title elsewhere. Ignores query strings. */
export function applyCanonical(path: string) {
  const url = canonicalUrl(path);
  setCanonical(url);
  setMeta('property', 'og:url', url);
  setMeta('property', 'twitter:url', url);
}
