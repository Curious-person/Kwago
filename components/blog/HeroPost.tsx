import React from 'react';
import Image from 'next/image';
import { Badge } from '../ui/Badge';
import Link from 'next/link';

export const HeroPost = () => {
  return (
    <section className="grid lg:grid-cols-2 gap-12 px-8 py-16 items-center">
      <Link href="/blog/intentional-digital-consumption" className="relative aspect-[4/3] rounded-2xl overflow-hidden block group">
        <Image
          src="https://images.unsplash.com/photo-1544391682-177d4c9d3ddb?q=80&w=1200&auto=format&fit=crop"
          alt="Featured Article"
          fill
          className="object-cover"
        />
      </Link>

      <div className="flex flex-col items-start gap-6">
        <Badge variant="featured">Featured</Badge>
        <Link href="/blog/intentional-digital-consumption">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.1] hover:text-[#0066FF] transition-colors cursor-pointer">
            The Art of Intentional Digital Consumption
          </h1>
        </Link>
        <p className="text-zinc-500 text-lg leading-relaxed max-w-lg">
          In an era of infinite scrolls, learning how to curate your digital environment is the ultimate form of self-care. Discover why less really is more for your focus.
        </p>

        <div className="flex items-center gap-4 mt-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-200">
            <Image
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
              alt="Author"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div className="text-sm">
            <p className="font-bold text-zinc-900">Elena Vance</p>
            <p className="text-zinc-400 font-medium">Oct 24 • 8 min read</p>
          </div>
        </div>
      </div>
    </section>
  );
};
