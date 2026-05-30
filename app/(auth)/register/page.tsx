"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

type ViewState = "form" | "check-email";

export default function RegisterPage() {
  const [view, setView] = useState<ViewState>("form");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setView("check-email");
  }

  if (view === "check-email") {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
            <svg
              className="h-7 w-7 text-[#0066FF]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 17.25V6.75M21.75 6.75a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 6.75m19.5 0l-9.75 6.75L2.25 6.75"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Check your email
        </h1>
        <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
          We sent a confirmation link to{" "}
          <span className="font-medium text-zinc-700">{email}</span>.
          <br />
          Click it to activate your account.
        </p>

        <Button
          variant="outline"
          onClick={() => (window.location.href = "/login")}
          size="lg"
          className="mt-8"
        >
          Back to sign in
        </Button>
      </div>
    );
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
          Create an account
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Join the collector community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Display Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="display-name"
            className="block text-sm font-medium text-zinc-700"
          >
            Display name
          </label>
          <input
            id="display-name"
            type="text"
            autoComplete="name"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your collector name"
            className="
              w-full rounded-full border border-zinc-200 bg-white
              px-5 py-3 text-sm text-zinc-900 placeholder:text-zinc-400
              outline-none transition-colors
              focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10
            "
          />
        </div>

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
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            className="
              w-full rounded-full border border-zinc-200 bg-white
              px-5 py-3 text-sm text-zinc-900 placeholder:text-zinc-400
              outline-none transition-colors
              focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10
            "
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="mt-2 w-full"
        >
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      {/* Footer link */}
      <p className="mt-8 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#0066FF] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
