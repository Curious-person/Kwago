'use client';

import React from 'react';
import Image from 'next/image';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Product } from '@/types/product';
import { Edit2, Trash2 } from 'lucide-react';

interface ProductManageCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export const ProductManageCard = ({ product, onEdit, onDelete }: ProductManageCardProps) => {
  return (
    <div className="group flex flex-col bg-white h-full border border-zinc-100 rounded-3xl overflow-hidden hover:border-zinc-200 transition-colors">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-50 border-b border-zinc-100">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          className="object-cover" 
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

      <div className="flex flex-col p-6 flex-1">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-wrap gap-1">
            {product.category_names && product.category_names.length > 0 ? (
              product.category_names.map((name, index) => (
                <span 
                  key={index}
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded"
                >
                  {name}
                </span>
              ))
            ) : (
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                {product.category}
              </p>
            )}
          </div>
          <p className="text-sm font-bold text-zinc-900">
            ${product.price.toLocaleString()}
          </p>
        </div>
        
        <h3 className="text-base font-bold text-zinc-900 mb-6 leading-tight line-clamp-2">
          {product.name}
        </h3>
        
        <div className="mt-auto flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 rounded-full h-10"
            onClick={() => onEdit(product)}
          >
            <Edit2 size={14} className="mr-2" />
            Edit
          </Button>
          <Button 
            variant="secondary" 
            size="icon"
            className="rounded-full h-10 w-10 shrink-0"
            onClick={() => onDelete?.(product)}
          >
            <Trash2 size={14} className="text-zinc-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};
