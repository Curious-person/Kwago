import { create } from "zustand";
import { Profile, UserRole } from "../types";

// ----------------------------------------------------------------
// Journal Slice
// ----------------------------------------------------------------

interface JournalSlice {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  isSearchOpen: boolean;
  toggleSearch: () => void;
}

// ----------------------------------------------------------------
// Auth Slice
// ----------------------------------------------------------------

interface AuthSlice {
  profile: Profile | null;
  role: UserRole | null;
  setProfile: (profile: Profile | null) => void;
  clearAuth: () => void;
  isAuthor: () => boolean;
  isAdmin: () => boolean;
}

// ----------------------------------------------------------------
// Combined Store
// ----------------------------------------------------------------

type StoreState = JournalSlice & AuthSlice;

export const useJournalStore = create<StoreState>((set, get) => ({
  // --- Journal ---
  activeCategory: "All Posts",
  setActiveCategory: (category) => set({ activeCategory: category }),
  isSearchOpen: false,
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  // --- Auth ---
  profile: null,
  role: null,

  setProfile: (profile) =>
    set({
      profile,
      role: profile?.role ?? null,
    }),

  clearAuth: () =>
    set({
      profile: null,
      role: null,
    }),

  isAuthor: () => {
    const { role } = get();
    return role === "author" || role === "admin";
  },

  isAdmin: () => get().role === "admin",
}));
