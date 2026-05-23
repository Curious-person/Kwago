"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/types/product';

export function ProductReviewManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, product_categories(category_id, categories(name))')
      .eq('status', 'ai-approved')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data as unknown as Product[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns = React.useMemo<ColumnDef<Product>[]>(() => [
    {
      header: 'Photo',
      accessorKey: 'image',
      headerClassName: 'w-[100px]',
      cell: (row) => (
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
          <Image src={row.image} alt={row.name} fill className="object-cover" />
        </div>
      )
    },
    {
      header: 'Product Details',
      filterable: true,
      filterValue: (row) => `${row.name}`,
      cell: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-zinc-900 line-clamp-1">{row.name}</span>
          <span className="text-xs text-zinc-400">${row.price.toFixed(2)} • {row.condition}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      filterable: true,
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'ai-approved' && (
            <Badge variant="outline" className="font-medium text-xs rounded-full px-3 text-blue-600 border-blue-200 bg-blue-50">
              Pending Admin
            </Badge>
          )}
        </div>
      )
    }
  ], []);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search products..."
            icon={<Search size={16} />}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-zinc-500 text-sm">Loading queue...</div>
      ) : (
        <DataTable columns={columns} data={products} itemsPerPage={10} />
      )}
    </div>
  );
}
