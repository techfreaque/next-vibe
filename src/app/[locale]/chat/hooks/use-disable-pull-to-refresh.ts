"use client";

import { useEffect } from "react";

// Prevent pull-to-refresh on mobile browsers
function preventPullToRefresh(e: TouchEvent): void {
  // Only prevent if we're at the top of the page
  const scrollableElement = document.documentElement || document.body;
  if (scrollableElement.scrollTop === 0) {
    e.preventDefault();
  }
}

/**
 * Hook to disable pull-to-refresh behavior on mobile browsers
 * This prevents the annoying browser refresh when users try to scroll up at the top of the page
 */
export function useDisablePullToRefresh(): void {
  useEffect(() => {
    // Add event listener with passive: false to allow preventDefault
    document.addEventListener("touchstart", preventPullToRefresh, {
      passive: false,
    });

    // Also prevent overscroll behavior via CSS
    document.body.style.overscrollBehavior = "none";

    return (): void => {
      document.removeEventListener("touchstart", preventPullToRefresh);
      document.body.style.overscrollBehavior = "";
    };
  }, []);
}

