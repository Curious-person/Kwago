"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

/**
 * CategoryHeader Component
 *
 * Displays the page title "My Categories" and a "Create Category" button.
 * On mobile, also displays a floating action button.
 * Uses minimalist design with generous spacing.
 *
 * Requirements: 2.1, 3.1, 8.2, 8.3, 9.1, 9.2, 9.8, 9.9
 */
interface CategoryHeaderProps {
  onCreateClick: () => void;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  onCreateClick,
}) => {
  // Handle Enter key on buttons
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter") {
      onCreateClick();
    }
  };

  return (
    <>
      <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        {/* Title Section */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2">
            My Categories
          </h1>
          <p className="text-sm sm:text-base text-zinc-600">
            Organize your products into categories
          </p>
        </div>

        {/* Create Button - Desktop only */}
        <Button
          variant="primary"
          size="lg"
          onClick={onCreateClick}
          onKeyDown={handleKeyDown}
          className="hidden sm:inline-flex rounded-full shadow-[0_4px_0_0_#0047B3] hover:shadow-[0_4px_0_0_#0047B3] active:translate-y-[2px] active:shadow-[0_2px_0_0_#0047B3] whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:ring-offset-2"
          aria-label="Create new category"
        >
          Create Category
        </Button>
      </div>

      {/* Floating Action Button - Mobile only */}
      <Button
        variant="primary"
        size="icon"
        onClick={onCreateClick}
        onKeyDown={handleKeyDown}
        className="sm:hidden fixed bottom-6 right-6 z-40 rounded-full shadow-[0_4px_0_0_#0047B3] hover:shadow-[0_4px_0_0_#0047B3] active:translate-y-[2px] active:shadow-[0_2px_0_0_#0047B3] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:ring-offset-2"
        aria-label="Create new category"
      >
        <Plus size={24} />
      </Button>
    </>
  );
};
