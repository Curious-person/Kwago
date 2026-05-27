import React from 'react';
import Image from 'next/image';
import { ProductSalesData } from '@/types/sales';
import { Button } from '@/components/ui/Button';
import { PackageOpen, RefreshCw, MoreVertical, Edit3 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SaleManageCardProps {
  saleData: ProductSalesData;
  onUpdateStatus: (saleData: ProductSalesData) => void;
  onRestock: (saleData: ProductSalesData) => void;
}

export function SaleManageCard({ saleData, onUpdateStatus, onRestock }: SaleManageCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-zinc-100 text-zinc-800';
    }
  };

  const isLowStock = saleData.stockRemaining <= 5 && saleData.status !== 'Out of Stock';

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl p-4 border border-zinc-200 shadow-none hover:border-zinc-300 transition-all duration-300">
      
      {/* Header section with image and product name */}
      <div className="flex gap-4 mb-4">
        <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100">
          <Image
            src={saleData.product.image}
            alt={saleData.product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
            Product Analytics
          </p>
          <h3 className="font-bold text-zinc-900 line-clamp-2 text-sm">
            {saleData.product.name}
          </h3>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-zinc-100" />
            }>
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4 text-zinc-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] rounded-2xl border-zinc-100 shadow-sm">
              <DropdownMenuItem 
                onClick={() => onUpdateStatus(saleData)}
                className="text-sm cursor-pointer rounded-xl hover:bg-zinc-50"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Update Status
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onRestock(saleData)}
                className="text-sm cursor-pointer rounded-xl hover:bg-zinc-50"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Restock
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2 mb-4 bg-zinc-50 rounded-2xl p-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">Revenue</p>
          <p className="font-semibold text-zinc-900">${saleData.totalRevenue.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">Units Sold</p>
          <p className="font-semibold text-zinc-900">{saleData.totalUnitsSold}</p>
        </div>
      </div>

      {/* Footer tags */}
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(saleData.status)}`}>
          {saleData.status}
        </span>
        
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
          isLowStock ? 'bg-red-50 text-red-600' : saleData.status === 'Out of Stock' ? 'bg-zinc-100 text-zinc-400' : 'bg-zinc-100 text-zinc-600'
        }`}>
          <PackageOpen size={12} />
          {saleData.stockRemaining} in stock
        </div>
      </div>

    </div>
  );
}
