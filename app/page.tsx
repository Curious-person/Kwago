import React from "react";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Newsletter } from "@/components/layout/Newsletter";
import { HeroPost } from "@/components/blog/HeroPost";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { PostCard } from "@/components/blog/PostCard";
import { AuthTestModal } from "@/components/layout/AuthTestModal";
import { Button } from "@/components/ui/Button";
import { getUserRole } from "@/lib/auth";
import { fetchPublishedPosts } from "@/lib/services/postService.server";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default async function Home() {
  const role = await getUserRole();

  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  if (role === "author") {
    redirect("/dashboard/author/posts");
  }

  const postsResult = await fetchPublishedPosts(7);
  const posts = postsResult.success && postsResult.data ? postsResult.data : [];

  const heroPost = posts.length > 0 ? posts[0] : null;
  const gridPosts = posts.length > 0 ? posts.slice(1) : [];

  let heroExcerpt = "";
  let heroSlug = "";
  if (heroPost) {
    const heroExcerptBlock = heroPost.blocks.find((b) => b.type === "body");
    heroExcerpt = heroExcerptBlock ? heroExcerptBlock.content : "";
    heroSlug = heroPost.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto w-full pb-20">
          <div className="flex justify-center pt-8 pb-4">
            <AuthTestModal />
          </div>

          {/* Hero Section */}
          {heroPost && (
            <ScrollReveal>
              <HeroPost
                title={heroPost.title}
                excerpt={heroExcerpt}
                slug={heroSlug}
                date={heroPost.date}
                readTime={heroPost.readTime}
                image={heroPost.image}
                author={heroPost.author}
                authorImage={heroPost.authorImage}
              />
            </ScrollReveal>
          )}

          {/* Category Filter */}
          <ScrollReveal delay={100}>
            <CategoryFilter />
          </ScrollReveal>

          {/* Post Grid */}
          <section className="px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {gridPosts.map((post, idx) => {
                const excerptBlock = post.blocks.find((b) => b.type === "body");
                const excerpt = excerptBlock ? excerptBlock.content : "";
                return (
                  <ScrollReveal key={post.id || idx} delay={idx * 50}>
                    <PostCard
                      title={post.title}
                      excerpt={excerpt}
                      category={post.category}
                      date={post.date}
                      image={post.image}
                    />
                  </ScrollReveal>
                );
              })}
            </div>

            <ScrollReveal>
              <div className="flex justify-center mt-20">
                <Button variant="outline" className="px-10">
                  Load More Articles
                </Button>
              </div>
            </ScrollReveal>
          </section>

          {/* Newsletter Section */}
          <ScrollReveal>
            <Newsletter />
          </ScrollReveal>
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
