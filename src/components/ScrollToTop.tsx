import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// How long to keep looking for a hash target before giving up and going to the
// top. On a client-side navigation the destination page has not committed yet
// when this effect first runs, so a single pass is not always enough.
const HASH_TARGET_TIMEOUT_MS = 600;
const POLL_INTERVAL_MS = 50;

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // A cross-page link that names a section should land on that section.
    // Same-page anchors (href="#platform") never reach here, since they do not
    // change the router location.
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const deadline = Date.now() + HASH_TARGET_TIMEOUT_MS;
      let timer = 0;

      const tryScroll = () => {
        const target = document.getElementById(id);
        if (target) {
          // Deliberately window.scrollTo and not scrollIntoView. The header is
          // sticky, so the target has to clear it, and `scroll-behavior: smooth`
          // in index.css would otherwise animate a full-page jump on what is
          // really a page load.
          const header = document.querySelector('header');
          const offset = header ? header.getBoundingClientRect().height : 0;
          const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
          window.scrollTo({ top: Math.max(top, 0), behavior: 'instant' });
          return;
        }
        if (Date.now() < deadline) {
          timer = window.setTimeout(tryScroll, POLL_INTERVAL_MS);
          return;
        }
        window.scrollTo(0, 0);
      };

      // setTimeout rather than requestAnimationFrame: rAF does not fire at all
      // while a tab is backgrounded, which would leave a link opened in a new
      // tab sitting at the top of the page.
      timer = window.setTimeout(tryScroll, 0);
      return () => window.clearTimeout(timer);
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
