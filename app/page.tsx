import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Newsletter } from '@/components/layout/Newsletter';
import { HeroPost } from '@/components/blog/HeroPost';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { PostCard } from '@/components/blog/PostCard';
import { Button } from '@/components/ui/Button';

const POSTS = [
  {
    title: "Finding Silence in Architecture",
    excerpt: "How physical spaces influence our mental clarity and why minimalist design is more than just aesthetics.",
    category: "Design",
    date: "Oct 21, 2024",
    image: "https://images.unsplash.com/photo-1518005020250-685949320299?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "The Future of Calm UI",
    excerpt: "Designing interfaces that respect human attention rather than competing for every single second of it.",
    category: "Technology",
    date: "Oct 19, 2024",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Stoicism in the Modern Age",
    excerpt: "Practical ancient wisdom for navigating the complexities and stresses of the twenty-first century.",
    category: "Philosophy",
    date: "Oct 15, 2024",
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "The Power of Essentialism",
    excerpt: "Why doing fewer things better is the secret to high performance and lasting personal satisfaction.",
    category: "Productivity",
    date: "Oct 12, 2024",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Deep Work and Creative Flow",
    excerpt: "The neurobiology of focus and how to enter a state of flow to produce your best creative work.",
    category: "Creativity",
    date: "Oct 08, 2024",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Slow Travel Manifesto",
    excerpt: "Moving through the world with curiosity and patience instead of rushing through bucket lists.",
    category: "Lifestyle",
    date: "Oct 05, 2024",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full pb-20">
        {/* Hero Section */}
        <HeroPost />
        
        {/* Category Filter */}
        <CategoryFilter />
        
        {/* Post Grid */}
        <section className="px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {POSTS.map((post, idx) => (
              <PostCard key={idx} {...post} />
            ))}
          </div>
          
          <div className="flex justify-center mt-20">
            <Button variant="outline" className="px-10">Load More Articles</Button>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
}
