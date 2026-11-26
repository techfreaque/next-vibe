"use client";

import { useWindowSize } from "next-vibe/ui/hooks/use-window-size";

/** Below this width the picker opens as a bottom sheet. */
const PHONE_BREAKPOINT = 768;

export function useIsPhone(): boolean {
  const { width } = useWindowSize();
  return width < PHONE_BREAKPOINT;
}
