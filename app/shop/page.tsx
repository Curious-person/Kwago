'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { SmoothScroll } from '@/components/ui/SmoothScroll';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Search, Filter, ShoppingBag, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Product } from '@/types/product';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/Sheet';

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsSheetOpen(true);
  };

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
                <ProductCard 
                  product={product} 
                  onViewDetails={handleViewDetails}
                />
              </ScrollReveal>
            ))}
          </div>
          
          {/* Empty State / Pagination */}
          <ScrollReveal delay={400}>
            <div className="flex flex-col items-center mt-32">
              <p className="text-zinc-400 text-sm font-medium mb-10">
                Showing {MOCK_PRODUCTS.length} of 142 collectibles
              </p>
              <Button variant="outline" className="px-12">
                Load More Items
              </Button>
            </div>
          </ScrollReveal>
        </main>

        {/* Side Panel for Details */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent>
            {selectedProduct && (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto pr-4 -mr-4 scrollbar-hide">
                  <SheetHeader className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                        {selectedProduct.category}
                      </Badge>
                      <ChevronRight size={12} className="text-zinc-300" />
                      <Badge variant={selectedProduct.condition === 'New' ? 'default' : 'secondary'} className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                        {selectedProduct.condition}
                      </Badge>
                    </div>
                    <SheetTitle>{selectedProduct.name}</SheetTitle>
                    <SheetDescription className="text-2xl font-medium text-zinc-900 mt-2">
                      ${selectedProduct.price.toLocaleString()}
                    </SheetDescription>
                  </SheetHeader>

                  <div className="relative aspect-square rounded-3xl overflow-hidden mb-10 bg-zinc-50 border border-zinc-100">
                    <Image 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name} 
                      fill 
                      className="object-cover" 
                    />
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Description</h4>
                      <p className="text-zinc-500 leading-relaxed">
                        This premium {selectedProduct.name} represents the pinnacle of collectible design. 
                        Each piece is meticulously crafted with attention to detail that satisfies even the most discerning collectors.
                        Perfect for display or as a centerpiece of your growing collection.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Condition</h4>
                        <p className="text-zinc-900 font-medium">{selectedProduct.condition}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Category</h4>
                        <p className="text-zinc-900 font-medium">{selectedProduct.category}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Key Features</h4>
                      <ul className="space-y-3">
                        {['Authentic detailed design', 'Premium materials', 'Collector grade packaging', 'Limited availability'].map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-zinc-600">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#0066FF]" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-10 mt-auto border-t border-zinc-100 flex gap-4">
                  <Button variant="primary" className="flex-1 h-14 text-base font-bold">
                    <ShoppingBag size={20} className="mr-2" />
                    Add to Collection
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
        
        <Footer />
      </div>
    </SmoothScroll>
  );
}
