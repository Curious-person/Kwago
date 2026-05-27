'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { SmoothScroll } from '@/components/ui/SmoothScroll';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { ProductDetailSheet } from '@/components/shop/ProductDetailSheet';

import { fetchProducts } from '@/lib/services/productService';
import { fetchCategories } from '@/app/dashboard/author/categories/actions';
import { Category } from '@/lib/types/category';
import { MultiSelect, Option } from '@/components/ui/MultiSelect';



export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [productsResult, categoriesResult] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);

        if (productsResult.success) {
          setProducts(productsResult.data);
        }
        
        if (categoriesResult.success && categoriesResult.data) {
          setAvailableCategories(categoriesResult.data as Category[]);
        }
      } catch (error) {
        console.error('Unexpected error loading shop data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const categoryOptions: Option[] = availableCategories.map(cat => ({
    label: cat.name,
    value: cat.id
  }));

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategories = selectedCategoryIds.length === 0 || 
      (product.category_ids && product.category_ids.some(id => selectedCategoryIds.includes(id)));
    
    return matchesSearch && matchesCategories;
  });

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
              
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-full md:w-64">
                  <Input 
                    placeholder="Search collectibles..." 
                    icon={<Search size={16} />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-48">
                  <MultiSelect
                    options={categoryOptions}
                    selected={selectedCategoryIds}
                    onChange={setSelectedCategoryIds}
                    placeholder="Filters"
                    variant="count"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-zinc-100 rounded-3xl mb-6" />
                  <div className="h-4 bg-zinc-100 rounded w-1/4 mb-4" />
                  <div className="h-6 bg-zinc-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-zinc-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProducts.map((product, idx) => (
                <ScrollReveal key={product.id} delay={idx * 50}>
                  <ProductCard 
                    product={product} 
                    onViewDetails={handleViewDetails}
                  />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag size={48} className="text-zinc-200 mb-6" />
              <h3 className="text-xl font-bold text-zinc-900 mb-2">No collectibles found</h3>
              <p className="text-zinc-500 max-w-xs">
                We couldn&apos;t find any products matching your search &quot;{searchTerm}&quot; or the selected categories.
              </p>
              <Button 
                variant="ghost" 
                className="mt-4 text-[#0066FF]"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategoryIds([]);
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
          
          {/* Empty State / Pagination */}
          {!isLoading && filteredProducts.length > 0 && (
            <ScrollReveal delay={400}>
              <div className="flex flex-col items-center mt-32">
                <p className="text-zinc-400 text-sm font-medium mb-10">
                  Showing {filteredProducts.length} of {products.length} collectibles
                </p>
                {products.length > filteredProducts.length && (
                  <Button variant="outline" className="px-12">
                    Load More Items
                  </Button>
                )}
              </div>
            </ScrollReveal>
          )}
        </main>

        {/* Side Panel for Details */}
        <ProductDetailSheet
          product={selectedProduct}
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
        />
        
        <Footer />
      </div>
    </SmoothScroll>
  );
}
