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
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

// ----------------------------------------------------------------
// Auth Slice
// ----------------------------------------------------------------

interface AuthSlice {
  profile: Profile | null;
  role: UserRole | null;
  isAuthLoaded: boolean;
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
  isMobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),

  // --- Auth ---
  profile: null,
  role: null,
  isAuthLoaded: false,

  setProfile: (profile) =>
    set({
      profile,
      role: profile?.role ?? null,
      isAuthLoaded: true,
    }),

  clearAuth: () =>
    set({
      profile: null,
      role: null,
      isAuthLoaded: true,
    }),

  isAuthor: () => {
    const { role } = get();
    return role === "author" || role === "admin";
  },

  isAdmin: () => get().role === "admin",
}));
