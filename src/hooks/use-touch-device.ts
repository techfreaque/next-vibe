"use client";

import { useEffect } from "react";
import { create } from "zustand";

import { platform } from "@/config/env-client";

/**
 * Touch Device Store
 * Centralized touch device detection that runs once and shares state
 */
interface TouchDeviceStore {
  isTouch: boolean;
  isInitialized: boolean;
  initialize: () => void;
}

const useTouchDeviceStore = create<TouchDeviceStore>((set, get) => ({
  isTouch: false,
  isInitialized: false,

  initialize: (): void => {
    // Only initialize once
    if (get().isInitialized) {
      return;
    }

    // React Native is always touch
    if (platform.isReactNative) {
      set({ isTouch: true, isInitialized: true });
      return;
    }

    // Browser environment - check touch support
    if (typeof window === "undefined") {
      return; // Skip during SSR
    }

    const checkTouch = (): void => {
      // Multiple checks for better compatibility
      const hasTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        ("msMaxTouchPoints" in navigator &&
          (navigator as Navigator & { msMaxTouchPoints: number })
            .msMaxTouchPoints > 0);

      set({ isTouch: hasTouch, isInitialized: true });
    };

    checkTouch();

    // Re-check on resize (for 2-in-1 devices that can switch modes)
    const handleResize = (): void => {
      checkTouch();
    };

    window.addEventListener("resize", handleResize);

    // Note: We don't clean up the event listener because this is a singleton store
    // that persists for the lifetime of the app
  },
}));

/**
 * Detects if the device supports touch input
 * This works on any screen size - tablets, 2-in-1 laptops, phones, etc.
 *
 * Uses a centralized store so the check only runs once, no matter how many
 * components call this hook.
 *
 * @returns true if the device supports touch input
 */
export function useTouchDevice(): boolean {
  const isTouch = useTouchDeviceStore((state) => state.isTouch);
  const initialize = useTouchDeviceStore((state) => state.initialize);

  // Initialize on first mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return isTouch;
}
