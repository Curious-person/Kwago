'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/Sheet';
import { Product } from '@/types/product';
import { useCollectionActions } from '@/lib/hooks/useCollection';

const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=800&auto=format&fit=crop';

interface ProductDetailSheetProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * ProductDetailSheet
 *
 * Reusable sidebar sheet for displaying full product details.
 * Used by both /shop and the blog RelatedProductsShelf.
 * Owns no state — callers control `open` and `onOpenChange`.
 */
export function ProductDetailSheet({
  product,
  open,
  onOpenChange,
}: ProductDetailSheetProps) {
  const { addToCollection } = useCollectionActions();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {product && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto pr-4 -mr-4 scrollbar-hide">
              <SheetHeader className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                  >
                    {product.category_names && product.category_names.length > 0
                      ? product.category_names[0]
                      : 'Uncategorized'}
                  </Badge>
                  <ChevronRight size={12} className="text-zinc-300" />
                  <Badge
                    variant={product.condition === 'New' ? 'default' : 'secondary'}
                    className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                  >
                    {product.condition}
                  </Badge>
                </div>
                <SheetTitle className="text-3xl font-bold leading-tight">
                  {product.name}
                </SheetTitle>
                <SheetDescription className="text-2xl font-medium text-zinc-900 mt-2">
                  ${product.price.toLocaleString()}
                </SheetDescription>
              </SheetHeader>

              <div className="relative aspect-square rounded-3xl overflow-hidden mb-10 bg-zinc-50 border border-zinc-100">
                <Image
                  src={product.image || DEFAULT_PRODUCT_IMAGE}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">
                    Description
                  </h4>
                  <p className="text-zinc-500 leading-relaxed">
                    {product.description ||
                      `This premium ${product.name} represents the pinnacle of collectible design. Each piece is meticulously crafted with attention to detail that satisfies even the most discerning collectors.`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">
                      Condition
                    </h4>
                    <p className="text-zinc-900 font-medium">{product.condition}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">
                      Categories
                    </h4>
                    <p className="text-zinc-900 font-medium">
                      {product.category_names && product.category_names.length > 0
                        ? product.category_names.join(', ')
                        : 'Uncategorized'}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">
                    Key Features
                  </h4>
                  <ul className="space-y-3">
                    {[
                      'Authentic detailed design',
                      'Premium materials',
                      'Collector grade packaging',
                      'Limited availability',
                    ].map((feature, i) => (
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
              <Button
                variant="primary"
                className="flex-1 h-14 text-base font-bold"
                onClick={() => addToCollection(product.id)}
              >
                <ShoppingBag size={20} className="mr-2" />
                Add to Collection
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
