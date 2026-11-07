/**
 * Sidebar Collapsed State Store
 * Zustand store for sidebar collapsed state, persisted to localStorage.
 *
 * Replaces the previous useState-based hook so that multiple components
 * (SidebarWrapper, TopBar) can share the same collapsed state without context.
 */

"use client";

import type { EndpointLogger } from "next-vibe/logger/types";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { getScreenWidth } from "next-vibe/ui/lib/screen";
import { getLocalItem, setLocalItem } from "next-vibe/ui/lib/storage";
import { useEffect } from "react";
import { create } from "zustand";

const STORAGE_KEY = "sidebar-collapsed";
const MOBILE_BREAKPOINT = 930; // px

interface SidebarState {
  collapsed: boolean;
  /** Whether the storage/screen-size check has started */
  initialized: boolean;
  /** Whether the storage/screen-size check has completed */
  ready: boolean;
  /** Toggle or set collapsed state. Persists to storage. */
  setCollapsed: (collapsed: boolean) => void;
  /** Load initial state from storage or screen size. Called once on mount. */
  initialize: (logger: EndpointLogger) => void;
}

const useSidebarStore = create<SidebarState>((set, get) => ({
  collapsed: false,
  initialized: false,
  ready: false,

  setCollapsed: (collapsed): void => {
    set({ collapsed, ready: true });
    setLocalItem(STORAGE_KEY, String(collapsed));
  },

  initialize: (logger): void => {
    if (get().initialized) {
      return;
    }
    // Synchronous read on mount: state and UI agree before anyone can tap the toggle
    const stored = getLocalItem(STORAGE_KEY);
    set({
      initialized: true,
      ready: true,
      collapsed:
        stored !== null
          ? stored === "true"
          : getScreenWidth(logger) < MOBILE_BREAKPOINT,
    });
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

  // Initialize client-side only (idempotent). Calling this during render ran
  // it on the server too: getScreenWidth() warned on every SSR, and the
  // storage read mutated the module-level zustand store during server
  // rendering — server-held state that leaks across requests. Storage and
  // screen size only exist in the browser, so the effect is the correct home;
  // both sides render the `collapsed: false` default until it lands.
  useEffect(() => {
    initialize(logger);
  }, [initialize, logger]);

  return [collapsed, setCollapsed];
}

/**
 * True once the persisted / screen-size state has loaded.
 * Mobile overlays wait for this so the sidebar never flashes open on load.
 */
export function useSidebarInitialized(): boolean {
  return useSidebarStore((s) => s.initialized && s.ready);
}
