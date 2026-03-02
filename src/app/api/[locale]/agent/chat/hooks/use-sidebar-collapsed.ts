/**
 * Sidebar Collapsed State Store
 * Zustand store for sidebar collapsed state, persisted to localStorage.
 *
 * Replaces the previous useState-based hook so that multiple components
 * (SidebarWrapper, TopBar) can share the same collapsed state without context.
 */

"use client";

import { storage } from "next-vibe-ui/lib/storage";
import { create } from "zustand";

const STORAGE_KEY = "sidebar-collapsed";
const MOBILE_BREAKPOINT = 930; // px

interface SidebarState {
  collapsed: boolean;
  /** Whether storage/screen-size check has completed */
  initialized: boolean;
  /** Toggle or set collapsed state. Persists to storage. */
  setCollapsed: (collapsed: boolean) => void;
  /** Load initial state from storage or screen size. Called once on mount. */
  initialize: () => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  collapsed: false,
  initialized: false,

  setCollapsed: (collapsed): void => {
    set({ collapsed });
    void storage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
  },

  initialize: (): void => {
    if (get().initialized) {
      return;
    }
    set({ initialized: true });

    void (async (): Promise<void> => {
      try {
        const stored = await storage.getItem(STORAGE_KEY);
        if (stored !== null) {
          set({ collapsed: JSON.parse(stored) as boolean });
        } else {
          set({ collapsed: window.innerWidth < MOBILE_BREAKPOINT });
        }
      } catch {
        set({ collapsed: window.innerWidth < MOBILE_BREAKPOINT });
      }
    })();
  },
}));

/**
 * Convenience hook — returns [collapsed, setCollapsed] tuple.
 * Initializes the store on first call.
 * Compatible with the previous useSidebarCollapsed() API.
 */
export function useSidebarCollapsed(): [boolean, (collapsed: boolean) => void] {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const setCollapsed = useSidebarStore((s) => s.setCollapsed);
  const initialize = useSidebarStore((s) => s.initialize);

  // Initialize on first render (idempotent)
  if (typeof window !== "undefined") {
    initialize();
  }

  return [collapsed, setCollapsed];
}
