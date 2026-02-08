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
 * Hook for managing sidebar collapsed state
 * - Initial state: false (not collapsed) for SSR and client (to avoid hydration mismatch)
 * - After mount: updates based on screen size and localStorage
 * - Only saves when user explicitly changes it (not on initial load)
 */
export function useSidebarCollapsed(): [boolean, (collapsed: boolean) => void] {
  // Initialize state to false on both server and client to avoid hydration mismatch
  const [collapsed, setCollapsed] = useState<boolean>(false);

  // Track if user has explicitly changed the state
  const hasUserChanged = useRef(false);

  // Load state from storage and apply screen size check on mount
  useEffect(() => {
    const loadState = async (): Promise<void> => {
      try {
        const stored = await storage.getItem(STORAGE_KEY);

        if (stored !== null) {
          // User has a saved preference - use it
          const savedCollapsed = JSON.parse(stored) as boolean;
          setCollapsed(savedCollapsed);
        } else {
          // No stored preference - check screen size
          const initialCollapsed = window.innerWidth < MOBILE_BREAKPOINT;
          setCollapsed(initialCollapsed);
        }
      } catch {
        // If storage fails, check screen size
        const initialCollapsed = window.innerWidth < MOBILE_BREAKPOINT;
        setCollapsed(initialCollapsed);
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
