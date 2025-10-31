import type { ReactNode } from "react";

// Cross-platform props interface
export interface HtmlProps {
  lang?: string;
  children: ReactNode;
  suppressHydrationWarning?: boolean;
}

/**
 * Platform-agnostic HTML wrapper component (Native implementation)
 * Native doesn't have html concept - just pass through children
 */
export function Html({ children }: HtmlProps): React.JSX.Element {
  return <>{children}</>;
}
