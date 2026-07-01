import type { SummaryProps } from "next-vibe/ui/web/ui/summary";
import type { JSX } from "react";

export type { SummaryProps } from "next-vibe/ui/web/ui/summary";

// CLI: always expanded (no toggle) - render children as-is
export function Summary({ children }: SummaryProps): JSX.Element {
  return <>{children}</>;
}
