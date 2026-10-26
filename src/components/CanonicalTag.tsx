import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applyCanonical } from '../lib/pageMeta';

/** Every route canonicalizes to the clean non-www URL, including ?ref= and other queries. */
export default function CanonicalTag() {
  const { pathname } = useLocation();

  useEffect(() => {
    applyCanonical(pathname);
  }, [pathname]);

  return null;
}
