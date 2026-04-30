'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      {/* Wordmark */}
      <div className="mb-10 text-center">
        <Link href="/" className="inline-block">
          <span className="text-2xl font-bold tracking-tight text-zinc-900">
            Kwago
          </span>
        </Link>
        <h1 className="mt-6 text-3xl font-bold text-zinc-900 tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Sign in to your collector account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-700"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="
              w-full rounded-full border border-zinc-200 bg-white
              px-5 py-3 text-sm text-zinc-900 placeholder:text-zinc-400
              outline-none transition-colors
              focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10
            "
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="
              w-full rounded-full border border-zinc-200 bg-white
              px-5 py-3 text-sm text-zinc-900 placeholder:text-zinc-400
              outline-none transition-colors
              focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10
            "
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="
            mt-2 w-full rounded-full bg-[#0066FF] px-6 py-3
            text-sm font-semibold text-white transition-opacity
            hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      {/* Footer link */}
      <p className="mt-8 text-center text-sm text-zinc-500">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-[#0066FF] hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
