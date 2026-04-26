import { create } from 'zustand';

interface JournalState {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  isSearchOpen: boolean;
  toggleSearch: () => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  activeCategory: 'All Posts',
  setActiveCategory: (category) => set({ activeCategory: category }),
  isSearchOpen: false,
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
}));
