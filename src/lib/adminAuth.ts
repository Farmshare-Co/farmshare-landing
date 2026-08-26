import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

// Who gets into the admin tools. Default: anyone signed in with a farmshare.co
// Google account. To run a tighter list instead, set VITE_ADMIN_ALLOWED_EMAILS
// (comma-separated) in Vercel — it takes precedence over the domain check.
// The same two vars exist unprefixed on the server (api/admin/promote.ts), which
// is where the check is actually enforced. This one is for UX only.
const ALLOWED_DOMAIN = String(
  import.meta.env.VITE_ADMIN_ALLOWED_DOMAIN || 'farmshare.co'
).toLowerCase();

const ALLOWED_EMAILS = String(import.meta.env.VITE_ADMIN_ALLOWED_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export function isAllowedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const e = email.toLowerCase();
  if (ALLOWED_EMAILS.length > 0) return ALLOWED_EMAILS.includes(e);
  return e.endsWith('@' + ALLOWED_DOMAIN);
}

export function useAdminSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!cancelled) setSession(s);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const email = session?.user?.email ?? null;
  return {
    session,
    email,
    loading,
    allowed: isAllowedAdminEmail(email),
    token: session?.access_token ?? null,
  };
}

export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + window.location.pathname,
      // hd hints Google to preselect the workspace account; the real gate is
      // isAllowedAdminEmail here and the allowlist check on the API.
      queryParams: ALLOWED_EMAILS.length > 0 ? {} : { hd: ALLOWED_DOMAIN },
    },
  });
  if (error) throw error;
}

export async function signOutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}

// Headers for a call to /api/admin/*. Reads the session fresh so a token that
// refreshed mid-session doesn't go out stale.
export async function adminAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: 'Bearer ' + token } : {}),
  };
}
