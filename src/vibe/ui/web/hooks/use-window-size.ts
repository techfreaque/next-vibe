"use client";

import { useSyncExternalStore } from "react";

export interface WindowSize {
  width: number;
  height: number;
}

// Defaults used during SSR and hydration
const SERVER_SIZE: WindowSize = { width: 1024, height: 768 };

let cachedSize: WindowSize = SERVER_SIZE;

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener("resize", onStoreChange);
  return (): void => window.removeEventListener("resize", onStoreChange);
}

// Returns a stable object until the window dimensions actually change
function getSnapshot(): WindowSize {
  if (
    cachedSize.width !== window.innerWidth ||
    cachedSize.height !== window.innerHeight
  ) {
    cachedSize = { width: window.innerWidth, height: window.innerHeight };
  }
  return cachedSize;
}

function getServerSnapshot(): WindowSize {
  return SERVER_SIZE;
}

/**
 * Returns current window dimensions and updates on resize.
 * Web implementation uses window.innerWidth/innerHeight + resize listener.
 */
export function useWindowSize(): WindowSize {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
