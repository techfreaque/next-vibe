import type { ReactNode } from "react";

// Cross-platform props interface
export interface HeadProps {
  children: ReactNode;
}

/**
 * Platform-agnostic Head wrapper component (Native implementation)
 * Native doesn't have head concept - just pass through children (noop)
 */
export function Head({ children: _children }: HeadProps): null {
  // Head content doesn't render on native
  return null;
}
