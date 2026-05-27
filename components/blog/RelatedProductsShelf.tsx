'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';
import { RelatedProductCard } from '@/components/blog/RelatedProductCard';
import { ProductDetailSheet } from '@/components/shop/ProductDetailSheet';

interface RelatedProductsShelfProps {
  products: Product[];
}

/**
 * RelatedProductsShelf
 *
 * Client boundary for the "Featured in This Article" section on blog post pages.
 * Receives server-fetched products as props and manages the product detail sheet state.
 *
 * This component must be 'use client' because the blog [slug]/page.tsx is an
 * async Server Component that cannot hold useState.
 */
export function RelatedProductsShelf({ products }: RelatedProductsShelfProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsSheetOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <RelatedProductCard
            key={product.id}
            product={product}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      <ProductDetailSheet
        product={selectedProduct}
        open={isSheetOpen}
        onOpenChange={(open) => {
          setIsSheetOpen(open);
          if (!open) setSelectedProduct(null);
        }}
      />
    </>
  );
}
