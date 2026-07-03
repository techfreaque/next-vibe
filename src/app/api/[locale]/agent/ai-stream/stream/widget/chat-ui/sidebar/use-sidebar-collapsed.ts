/**
 * Sidebar Collapsed State Store
 * Zustand store for sidebar collapsed state, persisted to localStorage.
 *
 * Replaces the previous useState-based hook so that multiple components
 * (SidebarWrapper, TopBar) can share the same collapsed state without context.
 */

"use client";

import type { EndpointLogger } from "next-vibe/logger/types";
import { getScreenWidth } from "next-vibe/ui/lib/screen";
import { storage } from "next-vibe/ui/lib/storage";
import { create } from "zustand";

import { useLogger } from "@/hooks/use-logger";

const STORAGE_KEY = "sidebar-collapsed";
const MOBILE_BREAKPOINT = 930; // px

interface SidebarState {
  collapsed: boolean;
  /** Whether storage/screen-size check has completed */
  initialized: boolean;
  /** Toggle or set collapsed state. Persists to storage. */
  setCollapsed: (collapsed: boolean) => void;
  /** Load initial state from storage or screen size. Called once on mount. */
  initialize: (logger: EndpointLogger) => void;
}

const useSidebarStore = create<SidebarState>((set, get) => ({
  collapsed: false,
  initialized: false,

  setCollapsed: (collapsed): void => {
    set({ collapsed });
    void storage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
  },

  initialize: (logger): void => {
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
          set({ collapsed: getScreenWidth(logger) < MOBILE_BREAKPOINT });
        }
      } catch {
        set({ collapsed: getScreenWidth(logger) < MOBILE_BREAKPOINT });
      }
    })();
  },
}));

/**
 * Convenience hook - returns [collapsed, setCollapsed] tuple.
 * Initializes the store on first call.
 * Compatible with the previous useSidebarCollapsed() API.
 */
export function useSidebarCollapsed(): [boolean, (collapsed: boolean) => void] {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const setCollapsed = useSidebarStore((s) => s.setCollapsed);
  const initialize = useSidebarStore((s) => s.initialize);
  const logger = useLogger();

  // Initialize on first render (idempotent)
  initialize(logger);

  return [collapsed, setCollapsed];
}
