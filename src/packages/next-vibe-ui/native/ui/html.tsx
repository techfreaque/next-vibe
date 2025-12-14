import type React from "react";

// Import all public types from web version (web is source of truth)
import type { HtmlProps } from "../../web/ui/html";

/**
 * Platform-agnostic HTML wrapper component (Native implementation)
 * Native doesn't have html concept - just pass through children
 */
export function Html({ children }: HtmlProps): React.JSX.Element {
  return <>{children}</>;
}
