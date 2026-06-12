"use client";

import { useEffect, useState } from "react";

export interface WindowSize {
  width: number;
  height: number;
}

/**
 * Returns current window dimensions and updates on resize.
 * Web implementation uses window.innerWidth/innerHeight + resize listener.
 */
export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  useEffect(() => {
    // Set actual size on mount (SSR may have used defaults)
    setSize({ width: window.innerWidth, height: window.innerHeight });
    const onResize = (): void => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", onResize);
    return (): void => window.removeEventListener("resize", onResize);
  }, []);

  return size;
}
