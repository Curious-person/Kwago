'use client';

import React, { useState } from 'react';
import { ProductManageCard } from '@/components/shop/ProductManageCard';
import { EditProductSheet } from '@/components/shop/EditProductSheet';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types/product';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';

interface ProductsGridProps {
    initialProducts: Product[];
}

export function ProductsGrid({ initialProducts }: ProductsGridProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Delete modal state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsSheetOpen(true);
    };

    const handleAddProduct = () => {
        const newProduct: Product = {
            id: `temp-${Date.now()}`,
            name: '',
            price: 0,
            condition: 'New',
            category_names: [],
            image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
        };
        setEditingProduct(newProduct);
        setIsSheetOpen(true);
    };

    const handleSave = (updatedProduct: Product) => {
        setProducts((prev) => {
            const exists = prev.some((p) => p.id === updatedProduct.id);
            if (exists) {
                return prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
            } else {
                return [...prev, updatedProduct];
            }
        });
    };

    const handleDelete = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
            setIsDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category_names ?? []).some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <ScrollReveal>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-2">
                            My Products
                        </h1>
                        <p className="text-zinc-500">
                            Manage your collectible listings and inventory.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <Input
                                placeholder="Search your products..."
                                icon={<Search size={16} />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button className="rounded-full" onClick={handleAddProduct}>
                            <Plus size={18} className="mr-2" />
                            Add Product
                        </Button>
                    </div>
                </div>
            </ScrollReveal>

            {/* Stats Bar */}
            <ScrollReveal delay={100}>
                <div className="flex gap-8 py-6 border-y border-zinc-100 overflow-x-auto scrollbar-hide">
                    <div className="min-w-[120px]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Total Items</p>
                        <p className="text-2xl font-bold text-zinc-900">{products.length}</p>
                    </div>
                    <div className="w-px bg-zinc-100 shrink-0" />
                    <div className="min-w-[120px]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Active Listings</p>
                        <p className="text-2xl font-bold text-zinc-900">{products.filter(p => p.condition === 'New').length} New</p>
                    </div>
                    <div className="w-px bg-zinc-100 shrink-0" />
                    <div className="min-w-[120px]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Inventory Value</p>
                        <p className="text-2xl font-bold text-[#0066FF]">
                            ${products.reduce((acc, p) => acc + p.price, 0).toLocaleString()}
                        </p>
                    </div>
                </div>
            </ScrollReveal>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product, idx) => (
                    <ScrollReveal key={product.id} delay={idx * 50}>
                        <ProductManageCard
                            product={product}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </ScrollReveal>
                ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="h-20 w-20 rounded-full bg-zinc-50 flex items-center justify-center mb-6">
                        <Filter size={32} className="text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">No products found</h3>
                    <p className="text-zinc-500 max-w-xs">
                        Try adjusting your search or add a new product to your collection.
                    </p>
                </div>
            )}

            <EditProductSheet
                product={editingProduct}
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                onSave={handleSave}
            />

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl p-8 border-zinc-100 shadow-none">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-zinc-900">Delete Product</DialogTitle>
                        <DialogDescription className="text-sm text-zinc-500 mt-2 leading-relaxed">
                            Are you sure you want to delete <span className="font-semibold text-zinc-900">"{productToDelete?.name}"</span>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-8 flex gap-4 w-full bg-transparent border-t-0 p-0 rounded-none sm:justify-start">
                        <Button
                            className="w-full py-3 px-6 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-none"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="w-full py-3 px-6 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 shadow-none"
                            onClick={confirmDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
