import React from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContactForm } from '@/components/layout/ContactForm';
import { Globe, Camera, Code2, Rss } from 'lucide-react';

const SOCIAL_LINKS = [
  { title: "Twitter", icon: <Globe size={20} />, link: "#" },
  { title: "Instagram", icon: <Camera size={20} />, link: "#" },
  { title: "GitHub", icon: <Code2 size={20} />, link: "#" },
  { title: "RSS", icon: <Rss size={20} />, link: "#" },
];

import { SmoothScroll } from '@/components/ui/SmoothScroll';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export default function AboutPage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        
        <main className="flex-1 max-w-4xl mx-auto w-full px-8 py-20">
          {/* Hero Section */}
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
              <div className="w-64 h-64 bg-zinc-900 rounded-3xl flex flex-col items-center justify-center text-center p-6 shrink-0 overflow-hidden relative">
                <div className="w-24 h-24 bg-zinc-800 rounded-full mb-4 flex items-center justify-center">
                  <Image 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" 
                    alt="Profile" 
                    width={96} 
                    height={96} 
                    className="rounded-full object-cover"
                  />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 leading-tight">
                  About Profile<br />Safe for Work
                </p>
              </div>
              
              <div className="flex flex-col gap-6">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
                  Writing for clarity.
                </h1>
                <p className="text-zinc-500 text-lg leading-relaxed max-w-lg">
                  A space dedicated to the intersection of technology, philosophy, and minimalist living.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Narrative Content */}
          <div className="flex flex-col gap-8 text-zinc-600 text-lg leading-relaxed mb-24">
            <ScrollReveal delay={100}>
              <p>
                Hi, I&apos;m the creator behind Journal. This project started as a personal quest to find a 
                digital space that didn&apos;t feel noisy. In an era of infinite scroll and algorithm-driven feeds, 
                I wanted to build a sanctuary for long-form thought and systematic observation.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p>
                With a background in software design and a passion for stoic philosophy, I spend my days 
                exploring how we can use modern tools to enhance—<span className="text-zinc-900 font-medium italic underline decoration-[#0066FF] underline-offset-4">not</span> distract from—our human experience. My 
                writing focuses on building sustainable habits, the ethics of AI, and the quiet joy of craft.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <p>
                When I&apos;m not writing, you&apos;ll likely find me in a local coffee shop with a physical notebook, or hiking 
                through the nearby pine forests. I believe the best ideas often arrive when we step away from the 
                screen.
              </p>
            </ScrollReveal>
          </div>

          {/* Social Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
            {SOCIAL_LINKS.map((social, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <a 
                  href={social.link}
                  className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white border border-zinc-100 hover:bg-[#F9FAFB] transition-all group h-full"
                >
                  <div className="mb-4 text-zinc-400 group-hover:text-[#0066FF] transition-colors">
                    {social.icon}
                  </div>
                  <span className="text-sm font-bold text-zinc-900">{social.title}</span>
                </a>
              </ScrollReveal>
            ))}
          </div>

          {/* Contact Form Section */}
          <ScrollReveal>
            <section className="bg-white border border-zinc-100 rounded-[32px] p-8 md:p-12">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">Say Hello</h2>
                <p className="text-zinc-500 mb-10 leading-relaxed">
                  I&apos;m always open to collaborations or just a friendly chat about design and life.
                </p>
                
                <ContactForm />
              </div>
            </section>
          </ScrollReveal>
        </main>
        
        <Footer />
      </div>
    </SmoothScroll>
  );
}
