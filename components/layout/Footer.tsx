import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="px-8 py-12 bg-white border-t border-zinc-100 mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-7xl mx-auto w-full">
        <div className="text-center md:text-left">
          <p className="text-sm font-bold text-zinc-900 mb-1">Journal</p>
          <p className="text-[11px] text-zinc-400 font-medium">© 2024 Minimalist Journal. Built for clarity.</p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          <Link href="/privacy" className="hover:text-zinc-600 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-zinc-600 transition-colors">Terms</Link>
          <Link href="/rss" className="hover:text-zinc-600 transition-colors">RSS Feed</Link>
          <Link href="/twitter" className="hover:text-zinc-600 transition-colors">Twitter</Link>
        </div>
      </div>
    </footer>
  );
};
