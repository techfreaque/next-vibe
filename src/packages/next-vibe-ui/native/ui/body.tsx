import type { BodyProps } from "next-vibe-ui/ui/body";
import type React from "react";

/**
 * Platform-agnostic Body wrapper component (Native implementation)
 * Native doesn't have body concept - just pass through children
 */
export function Body({ children }: BodyProps): React.JSX.Element {
  return <>{children}</>;
}
