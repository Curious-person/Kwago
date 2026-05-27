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
import { updateProduct, createProduct as createProductService } from '@/lib/services/productService';
import { Loader2, AlertCircle, DollarSign, Image as ImageIcon, Tag, AlignLeft } from 'lucide-react';
import { MultiSelect, Option } from '@/components/ui/MultiSelect';
import { fetchCategories } from '@/app/dashboard/author/categories/actions';

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
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Option[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const response = await fetchCategories();
      if (response.success && Array.isArray(response.data)) {
        setCategories(
          response.data.map((cat) => ({
            label: cat.name,
            value: cat.id,
          }))
        );
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setSaveError(null);
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

  const handleSave = async () => {
    if (!formData) return;

    setIsSaving(true);
    setSaveError(null);

    const isNew = formData.id.startsWith('temp-');

    const response = isNew
      ? await createProductService({
        name: formData.name,
        price: formData.price,
        condition: formData.condition,
        image: formData.image,
        category_ids: formData.category_ids || [],
        description: formData.description,
      })
      : await updateProduct(formData.id, {
        name: formData.name,
        price: formData.price,
        condition: formData.condition,
        image: formData.image,
        category_ids: formData.category_ids || [],
        description: formData.description,
      });

    if (!response.success) {
      setSaveError(response.error.message);
      setIsSaving(false);
      return;
    }

    // Success - call parent callback with updated product
    onSave(response.data);
    setIsSaving(false);
    onOpenChange(false);
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
          {/* Error Display */}
          {saveError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-900 mb-1">Failed to save changes</p>
                  <p className="text-sm text-red-700">{saveError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Image Preview */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Product Image
            </label>
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-50 border border-zinc-100 group">
              <Image
                src={formData.image}
                alt={formData.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ImageIcon size={24} className="text-white" />
              </div>
            </div>
            <Input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="bg-zinc-50"
              disabled={isSaving}
            />
          </div>

          {/* Basic Info */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Categories
              </label>
              <MultiSelect
                options={categories}
                selected={formData.category_ids || []}
                onChange={(selected) => setFormData({ ...formData, category_ids: selected })}
                placeholder="Select product categories..."
                disabled={isSaving}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Price ($)
                </label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="29.99"
                    className="pl-10"
                    disabled={isSaving}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Condition
                </label>
                <div
                  className={`h-10 flex items-center justify-between px-4 bg-zinc-100 rounded-full transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-zinc-200'
                    }`}
                  onClick={isSaving ? undefined : handleConditionToggle}
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
                Product Name
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Marvel Legends Iron Man"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <AlignLeft size={12} />
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add a detailed description..."
                className="w-full min-h-[120px] px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent resize-y disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-zinc-100">
          <Button onClick={handleSave} className="w-full h-14 text-base font-bold" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
