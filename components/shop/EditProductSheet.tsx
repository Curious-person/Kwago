'use client';

import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/Sheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types/product';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';

interface EditProductSheetProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: Product) => void;
}

export const EditProductSheet = ({
  product,
  isOpen,
  onOpenChange,
  onSave,
}: EditProductSheetProps) => {
  const [formData, setFormData] = useState<Product | null>(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === 'price' ? parseFloat(value) || 0 : value,
      };
    });
  };

  const handleConditionToggle = () => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        condition: prev.condition === 'New' ? 'Used' : 'New',
      };
    });
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl">
            {formData.id.startsWith('temp-') ? 'Add Product' : 'Edit Product'}
          </SheetTitle>
          <SheetDescription>
            Update the product details below. All changes are saved instantly to the list.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 overflow-y-auto pr-2 -mr-2 max-h-[calc(100vh-200px)] scrollbar-hide">
          {/* Image Preview */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Product Image
            </label>
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-50 border border-zinc-100">
              <Image
                src={formData.image}
                alt={formData.name}
                fill
                className="object-cover"
              />
            </div>
            <Input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="bg-zinc-50"
            />
          </div>

          {/* Basic Info */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Product Name
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Marvel Legends Iron Man"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Price ($)
                </label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="29.99"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Condition
                </label>
                <div 
                  className="h-10 flex items-center justify-between px-4 bg-zinc-100 rounded-full cursor-pointer hover:bg-zinc-200 transition-colors"
                  onClick={handleConditionToggle}
                >
                  <span className="text-sm font-medium text-zinc-900">{formData.condition}</span>
                  <Badge variant={formData.condition === 'New' ? 'default' : 'secondary'} className="rounded-full h-5">
                    Toggle
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Category
              </label>
              <Input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Marvel Legends"
              />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-zinc-100">
          <Button onClick={handleSave} className="w-full h-14 text-base font-bold">
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
