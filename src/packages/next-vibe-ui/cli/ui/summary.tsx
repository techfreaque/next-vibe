import type { JSX } from "react";

import type { SummaryProps } from "../../web/ui/summary";

export type { SummaryProps } from "../../web/ui/summary";

// CLI: always expanded (no toggle) — render children as-is
export function Summary({ children }: SummaryProps): JSX.Element {
  return <>{children}</>;
}
