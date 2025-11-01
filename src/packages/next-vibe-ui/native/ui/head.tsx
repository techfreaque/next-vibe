// Import all public types from web version (web is source of truth)
import type { HeadProps } from "../../web/ui/head";

/**
 * Platform-agnostic Head wrapper component (Native implementation)
 * Native doesn't have head concept - just pass through children (noop)
 */
export function Head({ children: _children }: HeadProps): null {
  // Head content doesn't render on native
  return null;
}
