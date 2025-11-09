"use client";

import { useEffect } from "react";

/**
 * Hook to disable pull-to-refresh behavior on mobile browsers
 * This prevents the annoying browser refresh when users try to scroll up at the top of the page
 */
export function useDisablePullToRefresh(): void {
  useEffect(() => {
    // Also prevent overscroll behavior via CSS
    document.body.style.overscrollBehavior = "none";

    return (): void => {
      document.body.style.overscrollBehavior = "";
    };
  }, []);
}

