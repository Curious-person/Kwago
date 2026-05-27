'use client';

import React from 'react';
import { Badge } from '../ui/Badge';
import { useJournalStore } from '@/lib/store';

const categories = [
  'All Posts', 'Productivity', 'Design', 'Philosophy', 'Technology'
];

export const CategoryFilter = () => {
  const { activeCategory, setActiveCategory } = useJournalStore();

  return (
    <div className="flex flex-wrap items-center gap-3 py-8 px-8 border-b border-zinc-100">
      <span className="text-sm font-medium text-zinc-400 mr-2">Browse:</span>
      {categories.map((cat) => (
        <Badge
          key={cat}
          variant={activeCategory === cat ? 'active' : 'secondary'}
          onClick={() => setActiveCategory(cat)}
          className="px-5 py-2 text-sm"
        >
          {cat}
        </Badge>
      ))}
    </div>
  );
};
