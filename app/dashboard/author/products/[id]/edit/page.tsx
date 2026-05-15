'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Image as ImageIcon, Tag, DollarSign, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { Product } from '@/types/product';
import { fetchProductById, updateProduct } from '@/lib/services/productService';
import { MultiSelect, Option } from '@/components/ui/MultiSelect';
import { fetchCategories } from '@/app/dashboard/author/categories/actions';
import { Category } from '@/lib/types/category';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [formData, setFormData] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<Option[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    // Fetch product on mount
    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            setError(null);

            // Fetch categories and product in parallel
            const [productResponse, categoriesResponse] = await Promise.all([
                fetchProductById(productId),
                fetchCategories()
            ]);

            if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
                setAvailableCategories(
                    categoriesResponse.data.map((cat) => ({
                        label: cat.name,
                        value: cat.id,
                    }))
                );
            }
            setIsLoadingCategories(false);

            if (!productResponse.success) {
                setError(productResponse.error.message);
                setIsLoading(false);
                return;
            }

            setFormData(productResponse.data);
            setIsLoading(false);
        }

        loadData();
    }, [productId]);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                        <Loader2 size={24} className="text-zinc-400 animate-spin" />
                    </div>
                    <p className="text-zinc-500">Loading product...</p>
                </div>
            </div>
        );
    }

    // Error state (product not found or fetch failed)
    if (error || !formData) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={24} className="text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-2">Failed to Load Product</h2>
                    <p className="text-zinc-500 mb-6">{error || 'Product not found'}</p>
                    <Button onClick={() => router.push('/dashboard/author/products')}>
                        Back to Products
                    </Button>
                </div>
            </div>
        );
    }

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

        // Client-side validation
        if (!formData.name.trim()) {
            setSaveError('Product name is required');
            return;
        }
        if (formData.price <= 0) {
            setSaveError('Price must be greater than 0');
            return;
        }
        if (!formData.category_ids || formData.category_ids.length === 0) {
            setSaveError('At least one category is required');
            return;
        }
        if (!formData.image.trim()) {
            setSaveError('Image URL is required');
            return;
        }

        setIsSaving(true);
        setSaveError(null);

        const response = await updateProduct(productId, {
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

        // Success - update form data with saved product and show modal
        setFormData(response.data);
        setIsSaving(false);
        setIsPublishModalOpen(true);
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-8">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/dashboard/author/products')}
                        className="rounded-full"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
                            Edit Product
                        </h1>
                        <p className="text-zinc-500 text-sm">
                            Update the product details below.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="secondary" onClick={() => router.push('/dashboard/author/products')} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Error Display */}
                    {saveError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle size={16} className="text-red-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-red-900 mb-1">Failed to update product</p>
                                    <p className="text-sm text-red-700">{saveError}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Image Upload */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                Product Image
                            </label>
                            <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-50 border border-zinc-100 group">
                                <img
                                    src={formData.image}
                                    alt={formData.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ImageIcon size={24} className="text-white" />
                                </div>
                            </div>
                            <Input
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="Image URL"
                                className="bg-zinc-50"
                                disabled={isSaving}
                            />
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    Product Name
                                </label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Marvel Legends Iron Man Mark LXXXV"
                                    className="text-xl font-bold py-6 px-6"
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
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                            placeholder="29.99"
                                            className="pl-10 h-12"
                                            disabled={isSaving}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                        Condition
                                    </label>
                                    <div
                                        className={`h-12 flex items-center justify-between px-4 bg-zinc-100 rounded-full transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-zinc-200'
                                            }`}
                                        onClick={isSaving ? undefined : handleConditionToggle}
                                    >
                                        <span className="text-sm font-bold text-zinc-900">{formData.condition}</span>
                                        <Badge variant={formData.condition === 'New' ? 'default' : 'secondary'} className="rounded-full h-6 px-3">
                                            Toggle
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    Categories
                                </label>
                                <MultiSelect
                                    options={availableCategories}
                                    selected={formData.category_ids || []}
                                    onChange={(selected) => setFormData({ ...formData, category_ids: selected })}
                                    placeholder="Select product categories..."
                                    disabled={isSaving || isLoadingCategories}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Add a detailed description of your product..."
                                    className="w-full min-h-[120px] px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent resize-y disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSaving}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-10">
                    <section className="bg-zinc-50 p-6 rounded-[24px] border border-zinc-100">
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Quick Preview</h3>
                        <div className="space-y-4">
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-200">
                                <img
                                    src={formData.image}
                                    alt={formData.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="space-y-2">
                                <Badge variant="secondary" className="text-xs">
                                    {formData.category_ids && formData.category_ids.length > 0 
                                        ? availableCategories.find(c => c.value === formData.category_ids![0])?.label
                                        : 'Uncategorized'}
                                    {formData.category_ids && formData.category_ids.length > 1 && ` +${formData.category_ids.length - 1}`}
                                </Badge>
                                <h4 className="font-bold text-zinc-900 leading-tight line-clamp-2 text-lg">
                                    {formData.name}
                                </h4>
                                <p className="text-2xl font-bold text-[#0066FF]">
                                    ${formData.price.toFixed(2)}
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${formData.condition === 'New' ? 'bg-[#0066FF]' : 'bg-zinc-400'}`} />
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{formData.condition}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <Dialog open={isPublishModalOpen} onOpenChange={setIsPublishModalOpen}>
                <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none bg-white rounded-[32px] shadow-2xl">
                    <div className="p-8 space-y-8">
                        <div className="space-y-4">
                            <div className="w-14 h-14 rounded-2xl bg-[#0066FF]/5 flex items-center justify-center mb-6 ring-1 ring-[#0066FF]/10">
                                <CheckCircle2 className="text-[#0066FF]" size={28} />
                            </div>
                            <DialogTitle className="text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
                                Product Updated Successfully
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 text-sm leading-relaxed">
                                Your collectible has been updated in your inventory.
                            </DialogDescription>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl">
                                <div className="w-8 h-8 rounded-full bg-[#0066FF] flex items-center justify-center shrink-0">
                                    <CheckCircle2 size={14} className="text-white" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Product Details</p>
                                    <p className="text-sm font-medium text-zinc-600">{formData.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-zinc-50/50 border-t border-zinc-100 flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setIsPublishModalOpen(false)}
                            className="flex-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all font-bold uppercase tracking-widest text-[10px]"
                        >
                            Done
                        </Button>
                        <Button
                            onClick={() => router.push('/dashboard/author/products')}
                            className="flex-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-200 transition-all font-bold uppercase tracking-widest text-[10px]"
                        >
                            View Products
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
