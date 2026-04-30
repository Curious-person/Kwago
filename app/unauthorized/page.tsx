import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Access Denied',
  description: 'You do not have permission to view this page.',
  robots: { index: false, follow: false },
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
            <svg
              className="h-7 w-7 text-zinc-400"
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
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Access denied
        </h1>

        {/* Body */}
        <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
          You don&apos;t have permission to view this page. If you think this is
          a mistake, please contact the site administrator.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="
            mt-8 inline-block rounded-full bg-[#0066FF]
            px-6 py-3 text-sm font-semibold text-white
            transition-opacity hover:opacity-90
          "
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
