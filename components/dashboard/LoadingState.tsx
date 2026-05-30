"use client";

import React from "react";

/**
 * LoadingState Component
 *
 * Displays skeleton cards while categories are loading.
 * Uses animated placeholder cards to indicate loading state.
 *
 * Requirements: 7.3, 7.4
 */
interface LoadingStateProps {
  count?: number; // Number of skeleton cards to display
}

export const LoadingState: React.FC<LoadingStateProps> = ({ count = 3 }) => {
  return (
    <div className="flex-1 p-8">
      <div className="animate-pulse space-y-8">
        {/* Header skeleton */}
        <div className="h-12 bg-zinc-200 rounded-full w-48"></div>

        {/* Grid of skeleton cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-zinc-100 bg-white p-6 space-y-4"
            >
              {/* Category name skeleton */}
              <div className="h-6 bg-zinc-200 rounded-full w-3/4"></div>

              {/* Product count skeleton */}
              <div className="h-4 bg-zinc-200 rounded-full w-1/3"></div>

              {/* Product images skeleton */}
              <div className="flex gap-2 pt-4">
                <div className="h-16 w-16 bg-zinc-200 rounded-xl flex-shrink-0"></div>
                <div className="h-16 w-16 bg-zinc-200 rounded-xl flex-shrink-0"></div>
                <div className="h-16 w-16 bg-zinc-200 rounded-xl flex-shrink-0"></div>
              </div>

              {/* Action buttons skeleton */}
              <div className="flex gap-2 pt-4">
                <div className="h-10 bg-zinc-200 rounded-full flex-1"></div>
                <div className="h-10 bg-zinc-200 rounded-full flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
