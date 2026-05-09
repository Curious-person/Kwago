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
import { ProductSalesData } from '@/types/sales';
import Image from 'next/image';

interface RestockSheetProps {
  item: ProductSalesData | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: ProductSalesData, additionalStock: number) => void;
}

export const RestockSheet = ({
  item,
  isOpen,
  onOpenChange,
  onSave,
}: RestockSheetProps) => {
  const [additionalStock, setAdditionalStock] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setAdditionalStock(0);
    }
  }, [isOpen, item]);

  if (!item) return null;

  const handleSave = () => {
    onSave(item, additionalStock);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl">Restock Inventory</SheetTitle>
          <SheetDescription>
            Add more stock for this product. The new stock will be added to the current remaining stock.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* Item Overview */}
          <div className="flex items-center gap-4 p-4 rounded-3xl bg-zinc-50 border border-zinc-100">
            <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-white">
              <Image
                src={item.product.image}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 line-clamp-1">{item.product.name}</h4>
              <p className="text-sm text-zinc-500">Current Stock: {item.stockRemaining}</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Quantity to Add
            </label>
            <Input
              type="number"
              min="1"
              value={additionalStock === 0 ? '' : additionalStock}
              onChange={(e) => setAdditionalStock(parseInt(e.target.value) || 0)}
              placeholder="e.g. 5"
            />
          </div>

          <div className="p-4 rounded-3xl bg-blue-50 border border-blue-100">
            <p className="text-sm text-blue-900 font-medium text-center">
              New Total Stock: {item.stockRemaining + (additionalStock || 0)}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-zinc-100">
          <Button onClick={handleSave} className="w-full h-14 text-base font-bold bg-[#0066FF] hover:bg-blue-600">
            Confirm Restock
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
