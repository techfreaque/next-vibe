import type { JSX } from "react";

import type { SummaryProps } from "../../web/components/summary";

export type { SummaryProps } from "../../web/components/summary";

// CLI: always expanded (no toggle) - render children as-is
export function Summary({ children }: SummaryProps): JSX.Element {
  return <>{children}</>;
}
