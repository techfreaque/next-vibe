"use client";

import { useEffect, useState } from "react";

/**
 * Options for the useMediaQuery hook
 */
interface MediaQueryOptions {
  defaultValue?: boolean;
}

/**
 * Custom hook for responsive design
 * Tracks if a media query matches the current viewport
 *
 * @param query - CSS media query string to match against
 * @param options - Configuration options
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(
  query: string,
  options: MediaQueryOptions = {},
): boolean {
  const { defaultValue = false } = options;

  const [matches, setMatches] = useState<boolean>(defaultValue);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    // Create media query list
    const mediaQueryList = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQueryList.matches);

    // Define callback
    const listener = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };

    // Add listener
    mediaQueryList.addEventListener("change", listener);

    // Clean up
    return (): void => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]);

  // Return defaultValue if not mounted yet (SSR)
  return mounted ? matches : defaultValue;
}

/**
 * Predefined hook for touch devices
 * Detects actual touch capability rather than screen width
 * Works on touch PCs, tablets, and mobile devices
 * @returns Boolean indicating if the device supports touch
 */
export function useIsMobile(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    // Check for touch support using modern API
    const hasTouchPoints = navigator.maxTouchPoints > 0;

    // Fallback for older browsers
    const hasTouchStart = "ontouchstart" in window;

    setIsTouchDevice(hasTouchPoints || hasTouchStart);
  }, []);

  return isTouchDevice;
}

/**
 * Predefined hook for tablet devices
 * @returns Boolean indicating if the current viewport is tablet-sized
 */
export function useIsTablet(): boolean {
  // eslint-disable-next-line i18next/no-literal-string
  return useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
}

/**
 * Predefined hook for desktop devices
 * @returns Boolean indicating if the current viewport is desktop-sized
 */
export function useIsDesktop(): boolean {
  // eslint-disable-next-line i18next/no-literal-string
  return useMediaQuery("(min-width: 1024px)");
}

/**
 * Predefined hook for large desktop devices
 * @returns Boolean indicating if the current viewport is large-desktop-sized
 */
export function useIsLargeDesktop(): boolean {
  // eslint-disable-next-line i18next/no-literal-string
  return useMediaQuery("(min-width: 1280px)");
}

/**
 * Predefined hook for dark mode preference
 * @returns Boolean indicating if the user prefers dark mode
 */
export function usePrefersDarkMode(): boolean {
  // eslint-disable-next-line i18next/no-literal-string
  return useMediaQuery("(prefers-color-scheme: dark)");
}

/**
 * Predefined hook for reduced motion preference
 * @returns Boolean indicating if the user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  // eslint-disable-next-line i18next/no-literal-string
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
