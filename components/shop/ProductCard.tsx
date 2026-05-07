'use client';

import React from 'react';
import Image from 'next/image';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  return (
    <div className="group flex flex-col bg-white h-full">
      <div className="relative aspect-square rounded-3xl overflow-hidden mb-6 bg-zinc-50 border border-zinc-100">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute top-4 left-4">
          <Badge 
            variant={product.condition === 'New' ? 'default' : 'secondary'}
            className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
          >
            {product.condition}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
          {product.category}
        </p>
        <h3 className="text-xl font-bold text-zinc-900 mb-2 leading-tight group-hover:text-[#0066FF] transition-colors line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>
        <p className="text-lg font-medium text-zinc-900 mb-6">
          ${product.price.toLocaleString()}
        </p>
        
        <div className="mt-auto">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onViewDetails?.(product)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};
