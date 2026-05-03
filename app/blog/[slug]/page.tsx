import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2, Languages, Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Newsletter } from '@/components/layout/Newsletter';
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar';

// Static data for demonstration
const POST_DATA = {
  title: "The Art of Intentional Digital Consumption",
  category: "Design",
  date: "Oct 24, 2024",
  readTime: "8 min read",
  author: "Elena Vance",
  authorImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
  image: "https://images.unsplash.com/photo-1544391682-177d4c9d3ddb?q=80&w=1200&auto=format&fit=crop",
};

import { ScrollReveal } from '@/components/ui/ScrollReveal';

import { SmoothScroll } from '@/components/ui/SmoothScroll';

export default function BlogPost({ params: _params }: { params: { slug: string } }) {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white flex flex-col">
        <ReadingProgressBar />
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-8 py-16">
        {/* Navigation */}
        <ScrollReveal delay={100}>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-[#0066FF] transition-colors mb-16 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Journal
          </Link>
        </ScrollReveal>
        
        {/* Header Section */}
        <ScrollReveal delay={200}>
          <header className="flex flex-col items-center text-center mb-16">
            <Badge variant="category" className="mb-8">{POST_DATA.category}</Badge>
            
            {/* Accessibility & Language Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <div className="flex items-center gap-3 px-5 py-2 rounded-full border border-zinc-100 bg-zinc-50 text-zinc-500 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <Languages size={14} className="text-zinc-400" />
                  <button className="text-zinc-900 transition-colors">EN</button>
                  <div className="w-[1px] h-3 bg-zinc-200" />
                  <button className="hover:text-zinc-900 transition-colors">ES</button>
                  <div className="w-[1px] h-3 bg-zinc-200" />
                  <button className="hover:text-zinc-900 transition-colors">FR</button>
                </div>
              </div>
              
              <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-100 bg-zinc-50 text-zinc-500 text-xs font-semibold hover:bg-zinc-100 transition-all hover:border-zinc-200 group active:scale-95">
                <Volume2 size={14} className="text-zinc-400 group-hover:text-[#0066FF] transition-colors" />
                <span>Listen to Article</span>
              </button>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-8 leading-[1.1] max-w-3xl">
              {POST_DATA.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 text-sm font-medium text-zinc-400">
              <div className="flex items-center gap-3 text-zinc-900">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-200">
                  <Image src={POST_DATA.authorImage} alt={POST_DATA.author} width={32} height={32} />
                </div>
                <span>{POST_DATA.author}</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-200" />
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                {POST_DATA.date}
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-200" />
              <div className="flex items-center gap-2">
                <Clock size={14} />
                {POST_DATA.readTime}
              </div>
            </div>
          </header>
        </ScrollReveal>
        
        {/* Featured Image */}
        <ScrollReveal delay={300}>
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-16">
            <Image 
              src={POST_DATA.image} 
              alt={POST_DATA.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        </ScrollReveal>
        
        {/* Article Body */}
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <article className="prose prose-zinc prose-lg max-w-none text-zinc-600 leading-relaxed">
              <p className="text-xl text-zinc-900 font-medium mb-8 leading-relaxed">
                In an era of infinite scrolls, learning how to curate your digital environment is the ultimate form of self-care. Discover why less really is more for your focus.
              </p>
              
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              
              <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">The Infinite Scroll Problem</h2>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              
              <blockquote className="border-l-4 border-[#0066FF] pl-6 my-10 italic text-xl text-zinc-900 font-medium">
                &quot;The ability to stay focused will be the superpower of the 21st century.&quot;
              </blockquote>
              
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </article>
          </ScrollReveal>
          
          {/* Action Footer */}
          <ScrollReveal>
            <div className="mt-20 pt-10 border-t border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Share this</span>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="px-4 py-2">Twitter</Badge>
                  <Badge variant="secondary" className="px-4 py-2">LinkedIn</Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-zinc-400">
                <Share2 size={16} />
              </Button>
            </div>
          </ScrollReveal>
        </div>
        
        {/* Newsletter In-line */}
        <ScrollReveal>
          <div className="mt-32">
            <Newsletter />
          </div>
        </ScrollReveal>
      </main>
      
      <Footer />
    </div>
    </SmoothScroll>
  );
}
