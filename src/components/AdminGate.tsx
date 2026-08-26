import type { ReactNode } from 'react';
import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useAdminSession, signInWithGoogle, signOutAdmin } from '../lib/adminAuth';

function GoogleMark() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">{children}</div>
    </div>
  );
}

/**
 * Wraps the admin routes. Requires a Google sign-in whose email passes the
 * allowlist in src/lib/adminAuth.ts. This is the front door only — every
 * write still re-checks the token server-side in api/admin/promote.ts.
 */
export default function AdminGate({ children }: { children: ReactNode }) {
  const { email, loading, allowed } = useAdminSession();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError((e as Error).message);
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream grid place-items-center text-stone-500">
        Loading…
      </div>
    );
  }

  if (!email) {
    return (
      <Shell>
        <div className="flex items-center gap-3 mb-6">
          <Lock className="h-6 w-6 text-brand-green" />
          <h1 className="text-2xl font-roca text-brand-green">Farmshare admin</h1>
        </div>
        <p className="text-stone-600 text-sm mb-6">
          Sign in with your Farmshare Google account.
        </p>
        <button
          onClick={handleSignIn}
          disabled={signingIn}
          className="w-full flex items-center justify-center gap-3 border border-stone-300 rounded-lg py-3 font-bold text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-60"
        >
          <GoogleMark />
          {signingIn ? 'Redirecting…' : 'Sign in with Google'}
        </button>
        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </Shell>
    );
  }

  if (!allowed) {
    return (
      <Shell>
        <h1 className="text-2xl font-roca text-brand-green mb-3">Not authorized</h1>
        <p className="text-stone-600 text-sm mb-6">
          <span className="font-medium">{email}</span> does not have access to the
          Farmshare admin tools. Sign in with your Farmshare account, or ask Henry to
          add you.
        </p>
        <button
          onClick={() => signOutAdmin()}
          className="w-full bg-brand-orange text-white py-3 rounded-lg font-bold hover:bg-brand-yellow transition-colors"
        >
          Sign out
        </button>
      </Shell>
    );
  }

  return <>{children}</>;
}

/** Small "signed in as … / Sign out" line for the admin page headers. */
export function AdminUserBadge({ className = '' }: { className?: string }) {
  const { email } = useAdminSession();
  if (!email) return null;
  return (
    <div className={'text-right text-sm text-stone-500 ' + className}>
      <div className="truncate max-w-[16rem]">{email}</div>
      <button
        onClick={() => signOutAdmin()}
        className="underline hover:text-stone-700"
      >
        Sign out
      </button>
    </div>
  );
}
