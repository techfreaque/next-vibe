import type { RefObject } from "react";

export interface ElementSize {
  width: number;
  height: number;
}

/**
 * CLI: ResizeObserver doesn't exist in terminal. Returns the default size.
 */
export function useResizeObserver(
  // eslint-disable-next-line no-unused-vars
  _ref: RefObject<Element | null>,
  defaultSize: ElementSize = { width: 0, height: 0 },
): ElementSize {
  return defaultSize;
}
