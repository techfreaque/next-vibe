"use client";

import { debounce } from "next-vibe/shared/utils";
import { useCallback, useEffect, useState } from "react";

/**
 * Represents the scroll position state
 */
export interface ScrollPosition {
  x: number;
  y: number;
  direction: "up" | "down" | "none";
  isAtTop: boolean;
  isAtBottom: boolean;
}

/**
 * Hook to track scroll position and direction
 *
 * @param delay - Debounce delay in milliseconds
 * @returns Current scroll position information
 */
export function useScrollPosition(delay = 10): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    direction: "none",
    isAtTop: true,
    isAtBottom: false,
  });

  const handleScroll = useCallback((): void => {
    const currentY = window.scrollY;
    const currentX = window.scrollX;
    const direction =
      currentY > scrollPosition.y ? "down" : currentY < scrollPosition.y ? "up" : "none";

    const isAtTop = currentY <= 0;
    const isAtBottom = Math.ceil(window.innerHeight + currentY) >= document.body.offsetHeight;

    setScrollPosition({
      x: currentX,
      y: currentY,
      direction,
      isAtTop,
      isAtBottom,
    });
  }, [scrollPosition.y]);

  useEffect((): (() => void) => {
    const debouncedHandleScroll = debounce(handleScroll, delay);

    window.addEventListener("scroll", debouncedHandleScroll);

    // Set initial position
    handleScroll();

    return (): void => {
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [delay, handleScroll]);

  return scrollPosition;
}
