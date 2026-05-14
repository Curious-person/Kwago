'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

/**
 * CategoryHeader Component
 *
 * Displays the page title "My Categories" and a "Create Category" button.
 * Uses minimalist design with generous spacing.
 *
 * Requirements: 2.1, 3.1, 9.1, 9.2, 9.8, 9.9
 */
interface CategoryHeaderProps {
    onCreateClick: () => void;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ onCreateClick }) => {
    return (
        <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            {/* Title Section */}
            <div>
                <h1 className="text-4xl font-bold text-zinc-900 mb-2">My Categories</h1>
                <p className="text-zinc-600">Organize your products into categories</p>
            </div>

            {/* Create Button */}
            <Button
                variant="primary"
                size="lg"
                onClick={onCreateClick}
                className="rounded-full shadow-[0_4px_0_0_#0047B3] hover:shadow-[0_4px_0_0_#0047B3] active:translate-y-[2px] active:shadow-[0_2px_0_0_#0047B3] whitespace-nowrap"
            >
                Create Category
            </Button>
        </div>
    );
};
