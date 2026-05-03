import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { SmoothScroll } from '@/components/ui/SmoothScroll';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Product } from '@/types/product';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Marvel Legends Series Iron Man Mark LXXXV',
    price: 24.99,
    condition: 'New',
    category: 'Marvel Legends',
    image: 'https://images.unsplash.com/photo-1531279554141-7dfdb443c375?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'The Lord of the Rings: Witch-King of Angmar Statue',
    price: 499.00,
    condition: 'New',
    category: 'Weta Workshop',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Spider-Man: Across the Spider-Verse Gwen Stacy',
    price: 19.99,
    condition: 'Used',
    category: 'Marvel Legends',
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Balrog, Flame of Udûn Statue',
    price: 899.00,
    condition: 'New',
    category: 'Weta Workshop',
    image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Captain America Shield Prop Replica',
    price: 149.00,
    condition: 'New',
    category: 'Props',
    image: 'https://images.unsplash.com/photo-1626278664285-f7c8a8107e93?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Wolverine (Astonishing X-Men) Retro Figure',
    price: 34.99,
    condition: 'Used',
    category: 'Marvel Legends',
    image: 'https://images.unsplash.com/photo-1591117207239-788db8ec6c3b?q=80&w=800&auto=format&fit=crop'
  }
];

export default function ShopPage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        
        <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-20">
          {/* Header Section */}
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
                  Collector&apos;s Shop
                </h1>
                <p className="text-zinc-500 text-lg max-w-lg">
                  Curated high-end collectibles, statues, and action figures for serious fans.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-64">
                  <Input 
                    placeholder="Search collectibles..." 
                    icon={<Search size={16} />}
                  />
                </div>
                <button className="h-10 w-10 flex items-center justify-center rounded-full border border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <Filter size={18} className="text-zinc-500" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {MOCK_PRODUCTS.map((product, idx) => (
              <ScrollReveal key={product.id} delay={idx * 50}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
          
          {/* Empty State / Pagination */}
          <ScrollReveal delay={400}>
            <div className="mt-32 pt-16 border-t border-zinc-50 text-center">
              <p className="text-zinc-400 text-sm font-medium mb-8">
                Showing {MOCK_PRODUCTS.length} of 142 collectibles
              </p>
              <button className="text-[#0066FF] font-bold text-sm uppercase tracking-widest hover:underline underline-offset-8">
                Load More Items
              </button>
            </div>
          </ScrollReveal>
        </main>
        
        <Footer />
      </div>
    </SmoothScroll>
  );
}
