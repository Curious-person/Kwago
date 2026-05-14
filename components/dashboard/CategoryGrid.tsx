'use client';

import React from 'react';
import { Category } from '@/lib/types/category';
import { CategoryCard } from '@/components/dashboard/CategoryCard';
import { Button } from '@/components/ui/Button';

/**
 * CategoryGrid Component
 *
 * Displays categories in a responsive grid layout.
 * Supports 1 column (mobile), 2 columns (tablet), 3 columns (desktop).
 * Shows empty state when no categories exist.
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 7.1, 7.2, 8.1, 9.8
 */
interface CategoryGridProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    onViewProducts: (categoryId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
    categories,
    onEdit,
    onDelete,
    onViewProducts,
}) => {
    // Empty state
    if (categories.length === 0) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-zinc-900 mb-4">No categories yet</h2>
                <p className="text-zinc-600 mb-8">Create your first category to get started.</p>
            </div>
        );
    }

    // Grid layout: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(category => (
                <CategoryCard
                    key={category.id}
                    category={category}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewProducts={onViewProducts}
                />
            ))}
        </div>
    );
};
