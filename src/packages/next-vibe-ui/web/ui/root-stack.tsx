import type { ReactElement } from "react";

// Cross-platform props interface
export interface RootStackProps {
  children?: ReactElement;
}

/**
 * Platform-agnostic RootStack component (Web implementation)
 * Web doesn't use Stack - just pass through children
 */
export function RootStack({ children }: RootStackProps): ReactElement | null {
  return children as ReactElement | null;
}
