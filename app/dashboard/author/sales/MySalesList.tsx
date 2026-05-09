'use client';

import React, { useState } from 'react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Search, Inbox, LayoutGrid, List, MoreHorizontal, Edit3, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

import { ProductSalesData, ProductSalesStatus } from '@/types/sales';
import { SaleManageCard } from '@/components/shop/SaleManageCard';
import { UpdateStatusDialog } from '@/components/shop/UpdateStatusDialog';
import { RestockSheet } from '@/components/shop/RestockSheet';

interface MySalesListProps {
  initialSales: ProductSalesData[];
}

export function MySalesList({ initialSales }: MySalesListProps) {
  const [sales, setSales] = useState<ProductSalesData[]>(initialSales);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  const [editingStatusSale, setEditingStatusSale] = useState<ProductSalesData | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const [restockingSale, setRestockingSale] = useState<ProductSalesData | null>(null);
  const [isRestockSheetOpen, setIsRestockSheetOpen] = useState(false);

  const handleUpdateStatus = (sale: ProductSalesData) => {
    setEditingStatusSale(sale);
    setIsStatusDialogOpen(true);
  };

  const saveStatusUpdate = (saleToUpdate: ProductSalesData, newStatus: ProductSalesStatus) => {
    setSales(prev => prev.map(s => 
      s.productId === saleToUpdate.productId ? { ...s, status: newStatus } : s
    ));
  };

  const handleRestock = (sale: ProductSalesData) => {
    setRestockingSale(sale);
    setIsRestockSheetOpen(true);
  };

  const saveRestock = (saleToUpdate: ProductSalesData, additionalStock: number) => {
    setSales(prev => prev.map(s => 
      s.productId === saleToUpdate.productId 
        ? { ...s, stockRemaining: s.stockRemaining + additionalStock, status: (s.stockRemaining + additionalStock) > 0 && s.status === 'Out of Stock' ? 'Active' : s.status } 
        : s
    ));
  };

  const filteredSales = sales.filter((s) => 
    s.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalRevenue, 0);
  const totalUnitsSold = sales.reduce((acc, sale) => acc + sale.totalUnitsSold, 0);

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-2">
              My Sales
            </h1>
            <p className="text-zinc-500">
              Track product performance, manage inventory, and monitor revenue.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:w-64">
              <Input 
                placeholder="Search products..." 
                icon={<Search size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex bg-zinc-50 rounded-full p-1 border border-zinc-200 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-full ${viewMode === 'grid' ? 'bg-white text-zinc-900 border border-zinc-200 shadow-none' : 'text-zinc-500 hover:text-zinc-900'}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-full ${viewMode === 'table' ? 'bg-white text-zinc-900 border border-zinc-200 shadow-none' : 'text-zinc-500 hover:text-zinc-900'}`}
                onClick={() => setViewMode('table')}
              >
                <List size={14} />
              </Button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats Bar */}
      <ScrollReveal delay={100}>
        <div className="flex gap-8 py-6 border-y border-zinc-100 overflow-x-auto scrollbar-hide">
          <div className="min-w-[120px]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Products Sold</p>
            <p className="text-2xl font-bold text-zinc-900">{sales.length}</p>
          </div>
          <div className="w-px bg-zinc-100 shrink-0" />
          <div className="min-w-[120px]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Total Units</p>
            <p className="text-2xl font-bold text-zinc-900">{totalUnitsSold}</p>
          </div>
          <div className="w-px bg-zinc-100 shrink-0" />
          <div className="min-w-[120px]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-[#0066FF]">
              ${totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* View Rendering */}
      {filteredSales.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="h-20 w-20 rounded-full bg-zinc-50 flex items-center justify-center mb-6">
            <Inbox size={32} className="text-zinc-300" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">No sales data found</h3>
          <p className="text-zinc-500 max-w-xs">
            {searchQuery ? "No products matched your search." : "You haven't tracked any sales yet."}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredSales.map((sale, idx) => (
            <ScrollReveal key={sale.productId} delay={idx * 50}>
              <SaleManageCard 
                saleData={sale}
                onUpdateStatus={handleUpdateStatus}
                onRestock={handleRestock}
              />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-zinc-100 overflow-hidden bg-white shadow-none">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="hover:bg-transparent border-zinc-100">
                <TableHead className="w-[80px] text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Photo</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Product Details</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Stats</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Status</TableHead>
                <TableHead className="text-right text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.productId} className="hover:bg-zinc-50/50 border-zinc-100 transition-colors">
                  <TableCell>
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
                      <Image
                        src={sale.product.image}
                        alt={sale.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-zinc-900 line-clamp-1">{sale.product.name}</span>
                      <span className="text-xs text-zinc-400">{sale.product.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-zinc-900">${sale.totalRevenue.toLocaleString()}</span>
                      <span className="text-xs text-zinc-400">{sale.totalUnitsSold} units sold</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5 items-start">
                      <Badge 
                        variant="secondary" 
                        className={`font-medium text-[10px] rounded-full px-2 py-0 ${
                          sale.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          sale.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {sale.status}
                      </Badge>
                      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                        Stock: {sale.stockRemaining}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-zinc-100" />
                      }>
                        <MoreHorizontal size={16} className="text-zinc-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl w-48 p-2 border-zinc-100 shadow-sm">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Options</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-zinc-100" />
                          <DropdownMenuItem 
                            className="gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-zinc-50"
                            onClick={() => handleUpdateStatus(sale)}
                          >
                            <Edit3 size={14} className="text-zinc-500" />
                            <span className="font-medium text-sm text-zinc-700">Update Status</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-zinc-50"
                            onClick={() => handleRestock(sale)}
                          >
                            <RefreshCw size={14} className="text-zinc-500" />
                            <span className="font-medium text-sm text-zinc-700">Restock</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <UpdateStatusDialog
        item={editingStatusSale}
        isOpen={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        onUpdate={saveStatusUpdate}
      />

      <RestockSheet
        item={restockingSale}
        isOpen={isRestockSheetOpen}
        onOpenChange={setIsRestockSheetOpen}
        onSave={saveRestock}
      />
    </div>
  );
}
