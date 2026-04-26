import React from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Beaker, Book, Globe, LineChart, PenTool, Cpu, Zap, Heart } from 'lucide-react';

const INTERESTS = [
  { title: "Literature", count: 24, icon: <Book size={18} /> },
  { title: "Science", count: 18, icon: <Beaker size={18} /> },
  { title: "Economics", count: 31, icon: <LineChart size={18} /> },
  { title: "Society", count: 42, icon: <Globe size={18} /> },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-20">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
            Explore Topics
          </h1>
          <p className="text-zinc-500 text-lg">
            Dive into curated thoughts on design, technology, and intentional living.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-32">
          {/* Design & Systems - Large Card */}
          <div className="md:col-span-8 flex flex-col group cursor-pointer">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-zinc-100">
              <Image 
                src="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop" 
                alt="Design" 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <PenTool size={16} className="text-[#0066FF]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-100 px-2 py-1 rounded">142 Articles</span>
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 group-hover:text-[#0066FF] transition-colors">Design & Systems</h2>
              <p className="text-zinc-500 text-sm max-w-md">
                Exploring the intersection of utility, aesthetics, and human-centered digital experiences.
              </p>
            </div>
          </div>

          {/* Technology - Medium Card */}
          <div className="md:col-span-4 flex flex-col group cursor-pointer">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-zinc-100">
              <Image 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop" 
                alt="Technology" 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <div className="flex flex-col items-start gap-3">
              <Cpu size={16} className="text-[#0066FF]" />
              <h2 className="text-2xl font-bold text-zinc-900 group-hover:text-[#0066FF] transition-colors">Technology</h2>
              <p className="text-zinc-500 text-sm">
                The future of software, AI, and the tools that shape our world.
              </p>
            </div>
          </div>

          {/* Lifestyle - Medium Card */}
          <div className="md:col-span-4 flex flex-col group cursor-pointer">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-zinc-100">
              <Image 
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop" 
                alt="Lifestyle" 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <div className="flex flex-col items-start gap-3">
              <Heart size={16} className="text-[#0066FF]" />
              <h2 className="text-2xl font-bold text-zinc-900 group-hover:text-[#0066FF] transition-colors">Lifestyle</h2>
              <p className="text-zinc-500 text-sm">
                Mindfulness, productivity, and the art of slowing down in a fast world.
              </p>
            </div>
          </div>

          {/* Productivity - Vertical Card */}
          <div className="md:col-span-8 flex flex-col md:flex-row gap-8 group cursor-pointer border border-zinc-100 rounded-2xl p-4 transition-all hover:bg-zinc-50">
            <div className="relative aspect-[4/5] md:w-1/2 rounded-xl overflow-hidden bg-zinc-100">
              <Image 
                src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop" 
                alt="Productivity" 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <div className="md:w-1/2 flex flex-col justify-center items-start gap-4 pr-8">
              <Zap size={20} className="text-[#0066FF]" />
              <h2 className="text-3xl font-bold text-zinc-900 group-hover:text-[#0066FF] transition-colors">Productivity</h2>
              <p className="text-zinc-500 text-base leading-relaxed">
                Frameworks and mental models to help you do your best work with less friction.
              </p>
              <div className="flex gap-2 mt-2">
                <span className="text-[10px] font-bold bg-[#E6F0FF] text-[#0066FF] px-3 py-1 rounded-full uppercase tracking-wider">Focus</span>
                <span className="text-[10px] font-bold bg-[#E6F0FF] text-[#0066FF] px-3 py-1 rounded-full uppercase tracking-wider">Workflow</span>
              </div>
            </div>
          </div>
        </div>

        {/* Other Interests */}
        <section>
          <h3 className="text-2xl font-bold text-zinc-900 mb-10">Other Interests</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INTERESTS.map((interest, idx) => (
              <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-[#F9FAFB] hover:bg-zinc-100 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#0066FF] group-hover:scale-110 transition-transform">
                  {interest.icon}
                </div>
                <div>
                  <p className="font-bold text-zinc-900 text-sm">{interest.title}</p>
                  <p className="text-zinc-400 text-[11px] font-medium uppercase tracking-tight">{interest.count} articles</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
