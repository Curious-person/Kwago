'use client';

import React from 'react';
import Image from 'next/image';
import { Category } from '@/lib/types/category';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Edit2, Trash2, ArrowRight } from 'lucide-react';

/**
 * CategoryCard Component
 *
 * Displays a single category with:
 * - Category name
 * - Product count badge
 * - Product image preview (up to 3 images)
 * - Action buttons (Edit, Delete, View Products)
 *
 * Requirements: 2.5, 2.6, 2.7, 2.8, 2.9, 6.1, 6.2, 6.3, 6.4, 9.8, 9.9
 */
interface CategoryCardProps {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    onViewProducts: (categoryId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = React.memo(
    ({ category, onEdit, onDelete, onViewProducts }) => {
        const displayImages = category.product_images.slice(0, 3);
        const moreCount = Math.max(0, category.product_count - 3);

        // Handle Enter key on buttons
        const handleKeyDown = (callback: () => void) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === 'Enter') {
                callback();
            }
        };

        return (
            <div className="rounded-3xl p-4 sm:p-6 border border-zinc-100 bg-white hover:border-zinc-200 transition-colors focus-within:ring-2 focus-within:ring-[#0066FF] focus-within:ring-offset-2">
                {/* Header with title and product count */}
                <div className="mb-4 sm:mb-6 flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-zinc-900 mb-2">{category.name}</h3>
                        {category.description && (
                            <p className="text-xs sm:text-sm text-zinc-600 line-clamp-2">{category.description}</p>
                        )}
                    </div>
                    <Badge variant="active" className="whitespace-nowrap flex-shrink-0">
                        {category.product_count} {category.product_count === 1 ? 'product' : 'products'}
                    </Badge>
                </div>

                {/* Product image preview */}
                <div className="mb-4 sm:mb-6">
                    {displayImages.length > 0 ? (
                        <div className="flex gap-2 sm:gap-3 items-center overflow-x-auto">
                            {displayImages.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0"
                                >
                                    <Image
                                        src={image}
                                        alt={`Product ${index + 1} in ${category.name}`}
                                        fill
                                        className="object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                            {moreCount > 0 && (
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs sm:text-sm font-bold text-zinc-600">+{moreCount}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-6 sm:py-8 text-center bg-zinc-50 rounded-xl">
                            <p className="text-xs sm:text-sm text-zinc-500">No products yet</p>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                        variant="outline"
                        size="md"
                        onClick={() => onEdit(category)}
                        onKeyDown={handleKeyDown(() => onEdit(category))}
                        className="flex-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:ring-offset-2"
                        aria-label={`Edit ${category.name} category`}
                        title="Edit category"
                    >
                        <Edit2 size={16} className="mr-2" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="md"
                        onClick={() => onDelete(category)}
                        onKeyDown={handleKeyDown(() => onDelete(category))}
                        className="flex-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:ring-offset-2"
                        aria-label={`Delete ${category.name} category`}
                        title="Delete category"
                    >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                    </Button>
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={() => onViewProducts(category.id)}
                        onKeyDown={handleKeyDown(() => onViewProducts(category.id))}
                        className="flex-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:ring-offset-2"
                        aria-label={`View products in ${category.name} category`}
                        title="View products in this category"
                    >
                        <ArrowRight size={16} className="mr-2" />
                        View
                    </Button>
                </div>
            </div>
        );
    }
);

CategoryCard.displayName = 'CategoryCard';
