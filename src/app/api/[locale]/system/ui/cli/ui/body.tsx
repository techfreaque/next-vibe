import type { BodyProps } from "next-vibe/ui/web/ui/body";
import type { JSX } from "react";

export type { BodyProps } from "next-vibe/ui/web/ui/body";

// CLI: no HTML body wrapper - passthrough children
export function Body({ children }: BodyProps): JSX.Element {
  return <>{children}</>;
}
