/**
 * Bottom Sheet Expanded State Hook
 * Manages bottom sheet (credits/account section) expanded state
 * Uses localStorage with async storage for persistence
 */

import { storage } from "next-vibe-ui/lib/storage";
import { useEffect, useState } from "react";

const STORAGE_KEY = "chat-bottom-sheet-expanded";

/**
 * Hook for managing bottom sheet expanded state
 * - Initial state: false (collapsed) for SSR
 * - Persists user preference to localStorage
 */
export function useBottomSheetExpanded(): [boolean, (expanded: boolean) => void] {
  // Initialize state - default to collapsed
  const [expanded, setExpanded] = useState<boolean>(false);

  // Load state from storage on mount
  useEffect(() => {
    const loadState = async (): Promise<void> => {
      try {
        const stored = await storage.getItem(STORAGE_KEY);

        if (stored !== null) {
          // User has a saved preference - use it
          const savedExpanded = JSON.parse(stored) as boolean;
          setExpanded(savedExpanded);
        }
        // If no stored preference, keep the initial state (collapsed)
      } catch {
        // If storage fails, keep the initial state
      }
    };

    void loadState();
  }, []);

  // Create a wrapper function that saves to storage
  const setBottomSheetExpanded = (newExpanded: boolean): void => {
    // Save to storage (fire and forget)
    void storage.setItem(STORAGE_KEY, JSON.stringify(newExpanded));

    // Update state
    setExpanded(newExpanded);
  };

  return [expanded, setBottomSheetExpanded];
}
