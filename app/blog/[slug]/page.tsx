import React from "react";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Newsletter } from "@/components/layout/Newsletter";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";

import { notFound } from "next/navigation";
import {
  fetchPostBySlug,
  fetchRelatedProductsBySlug,
} from "@/lib/services/postService.server";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { RelatedProductsShelf } from "@/components/blog/RelatedProductsShelf";
import InteractiveArticle from "@/components/blog/InteractiveArticle";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to Journal
            </Link>
          </ScrollReveal>

          {/* Category Badge */}
          <ScrollReveal delay={100}>
            <div className="flex justify-center mb-8">
              <Badge variant="category">{post.category}</Badge>
            </div>
          </ScrollReveal>

          {/* Interactive Player & Structured Content Body */}
          <ScrollReveal delay={200}>
            <InteractiveArticle post={post} />
          </ScrollReveal>

          {/* Action Footer */}
          <div className="max-w-2xl mx-auto">
            <ScrollReveal>
              <div className="mt-20 pt-10 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Share this
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="px-4 py-2">
                      Twitter
                    </Badge>
                    <Badge variant="secondary" className="px-4 py-2">
                      LinkedIn
                    </Badge>
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
