'use client';

import React from 'react';
import { Button } from '../ui/Button';
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
        <Button
          key={cat}
          variant={activeCategory === cat ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveCategory(cat)}
          className="text-[12px] px-4 py-2"
        >
          {cat}
        </Button>
      ))}
    </div>
  );
};
