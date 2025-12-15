"use client";

import { useEffect, useState } from "react";

import { platform } from "@/config/env-client";

/**
 * Detects if the device supports touch input
 * This works on any screen size - tablets, 2-in-1 laptops, phones, etc.
 *
 * @returns true if the device supports touch input
 */
export function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (platform.isReactNative) {
      setIsTouch(true);
      return;
    }
    // Check if touch is supported
    const checkTouch = (): void => {
      // Multiple checks for better compatibility
      const hasTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        ("msMaxTouchPoints" in navigator &&
          (navigator as Navigator & { msMaxTouchPoints: number })
            .msMaxTouchPoints > 0);

      setIsTouch(hasTouch);
    };

    checkTouch();

    // Re-check on resize (for 2-in-1 devices that can switch modes)
    window.addEventListener("resize", checkTouch);
    return (): void => window.removeEventListener("resize", checkTouch);
  }, []);

  return isTouch;
}

/**
 * CSS class helper for touch-aware opacity transitions
 * Use this to make elements visible on touch devices but hover-only on pointer devices
 *
 * @param alwaysVisibleOnTouch - If true, element is always visible on touch devices
 * @returns CSS classes for touch-aware visibility
 */
export function getTouchAwareClasses(alwaysVisibleOnTouch = true): string {
  if (typeof window === "undefined") {
    return ""; // SSR
  }

  const isTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    ("msMaxTouchPoints" in navigator &&
      (navigator as Navigator & { msMaxTouchPoints: number }).msMaxTouchPoints >
        0);

  if (isTouch && alwaysVisibleOnTouch) {
    // On touch devices: always visible but slightly transparent for better UX
    // eslint-disable-next-line i18next/no-literal-string -- CSS class names, not user-facing text
    return "opacity-70 active:opacity-100";
  }
    // On pointer devices: hidden until hover
    // eslint-disable-next-line i18next/no-literal-string -- CSS class names, not user-facing text
    return "opacity-0 group-hover:opacity-100 focus-within:opacity-100";
  
}
