'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types/product';

const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=800&auto=format&fit=crop';

interface RelatedProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

/**
 * RelatedProductCard
 *
 * Editorial card variant for the "Featured in This Article" shelf on blog posts.
 * Triggers the shared ProductDetailSheet on click instead of navigating away.
 *
 * Differences from ProductCard (shop grid):
 *  - Wider image ratio (4/3) for an editorial feel
 *  - Shows only the first category
 *  - CTA is "Shop Now →" (ghost style)
 */
export function RelatedProductCard({ product, onViewDetails }: RelatedProductCardProps) {
  const primaryCategory =
    product.category_names && product.category_names.length > 0
      ? product.category_names[0]
      : 'Uncategorized';

  return (
    <div
      className="group flex flex-col bg-white cursor-pointer"
      onClick={() => onViewDetails(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onViewDetails(product);
      }}
      aria-label={`View details for ${product.name}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-zinc-50 border border-zinc-100">
        <Image
          src={product.image || DEFAULT_PRODUCT_IMAGE}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge
            variant={product.condition === 'New' ? 'default' : 'secondary'}
            className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
          >
            {product.condition}
          </Badge>
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
          {primaryCategory}
        </p>
        <h3 className="text-base font-bold text-zinc-900 mb-1.5 leading-snug group-hover:text-[#0066FF] transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm font-medium text-zinc-900 mb-5">
          ${product.price.toLocaleString()}
        </p>

        <div className="mt-auto">
          <Button
            variant="ghost"
            className="px-0 text-[#0066FF] font-bold text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
            onClick={(e) => {
              e.stopPropagation(); // card click already handles this, just prevent double fire
              onViewDetails(product);
            }}
          >
            Shop Now
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
