import type { ReactElement,ReactNode } from "react";

// Cross-platform props interface
export interface RootStackProps {
  children?: ReactNode;
}

/**
 * Platform-agnostic RootStack component (Web implementation)
 * Web doesn't use Stack - just pass through children
 */
export function RootStack({ children }: RootStackProps): ReactElement {
  return <>{children}</>;
}
