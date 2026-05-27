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

import { notFound } from 'next/navigation';
import { fetchPostBySlug, fetchRelatedProductsBySlug } from '@/lib/services/postService.server';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SmoothScroll } from '@/components/ui/SmoothScroll';
import { RelatedProductsShelf } from '@/components/blog/RelatedProductsShelf';

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [{ success, data: post }, relatedProducts] = await Promise.all([
    fetchPostBySlug(slug),
    fetchRelatedProductsBySlug(slug),
  ]);

  if (!success || !post) {
    notFound();
  }

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
              <Badge variant="category" className="mb-8">{post.category}</Badge>

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
                {post.title}
              </h1>

              <div className="flex flex-col sm:flex-row items-center gap-6 text-sm font-medium text-zinc-400">
                <div className="flex items-center gap-3 text-zinc-900">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-200">
                    <Image src={post.authorImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} alt={post.author || "Author"} width={32} height={32} />
                  </div>
                  <span>{post.author}</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-200" />
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {post.date}
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-200" />
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  {post.readTime}
                </div>
              </div>
            </header>
          </ScrollReveal>

          {/* Featured Image */}
          <ScrollReveal delay={300}>
            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-16 bg-zinc-100">
              {post.image && (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
          </ScrollReveal>

          {/* Article Body */}
          <div className="max-w-2xl mx-auto">
            <ScrollReveal>
              <article className="prose prose-zinc prose-lg max-w-none text-zinc-600 leading-relaxed">
                {post.blocks?.map((block) => {
                  switch (block.type) {
                    case 'headline':
                      return (
                        <h2 key={block.id} className="text-2xl font-bold text-zinc-900 mt-12 mb-6">
                          {block.content}
                        </h2>
                      );
                    case 'subtitle':
                      return (
                        <p key={block.id} className="text-xl text-zinc-900 font-medium mb-8 leading-relaxed">
                          {block.content}
                        </p>
                      );
                    case 'quote':
                      return (
                        <blockquote key={block.id} className="border-l-4 border-[#0066FF] pl-6 my-10 italic text-xl text-zinc-900 font-medium">
                          {block.content}
                        </blockquote>
                      );
                    case 'body':
                    default:
                      return <p key={block.id}>{block.content}</p>;
                  }
                })}
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

          {/* Related Products — only rendered when products are linked to this post */}
          {relatedProducts.length > 0 && (
            <ScrollReveal>
              <section
                className="mt-24 pt-10 border-t border-zinc-100"
                aria-labelledby="related-products-heading"
              >
                <p
                  id="related-products-heading"
                  className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-8"
                >
                  Featured in This Article
                </p>
                <RelatedProductsShelf products={relatedProducts} />
              </section>
            </ScrollReveal>
          )}

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
