/**
 * Sidebar Collapsed State Hook
 * Manages sidebar collapsed state independently from chat settings
 * Uses zustand with async storage
 */

import { storage } from "next-vibe-ui/lib/storage";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "sidebar-collapsed";
const MOBILE_BREAKPOINT = 930; // px

/**
 * Get initial collapsed state based on screen size
 * Returns true (collapsed) for mobile, false (open) for desktop
 */
const getInitialCollapsedState = (): boolean => {
  if (typeof window === "undefined") {
    // SSR: default to false (open)
    return false;
  }
  // Client: check if mobile
  return window.innerWidth < MOBILE_BREAKPOINT;
};

/**
 * Hook for managing sidebar collapsed state
 * - Initial state: false (not collapsed) for SSR
 * - Initial loaded state: collapsed for mobile, open for desktop
 * - Only saves when user explicitly changes it (not on initial load)
 */
export function useSidebarCollapsed(): [boolean, (collapsed: boolean) => void] {
  // Initialize state based on screen size (client-side only)
  const [collapsed, setCollapsed] = useState<boolean>(getInitialCollapsedState);

  // Track if user has explicitly changed the state
  const hasUserChanged = useRef(false);

  // Load state from storage on mount
  useEffect(() => {
    const loadState = async (): Promise<void> => {
      try {
        const stored = await storage.getItem(STORAGE_KEY);

        if (stored !== null) {
          // User has a saved preference - use it
          const savedCollapsed = JSON.parse(stored) as boolean;
          setCollapsed(savedCollapsed);
        }
        // If no stored preference, keep the initial state (already set based on screen size)
      } catch {
        // If storage fails, keep the initial state
      }
    };

    void loadState();
  }, []);

  // Create a wrapper function that saves to storage
  const setSidebarCollapsed = (newCollapsed: boolean): void => {
    // Mark that user has changed it
    hasUserChanged.current = true;

    // Save to storage (fire and forget)
    void storage.setItem(STORAGE_KEY, JSON.stringify(newCollapsed));

    // Update state
    setCollapsed(newCollapsed);
  };

  return [collapsed, setSidebarCollapsed];
}
