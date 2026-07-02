import type { JSX } from "react";

import type { DetailsProps } from "../../web/ui/details";

export type { DetailsProps } from "../../web/ui/details";

// CLI: always expanded (no toggle) - render children, ignore open/closed state
export function Details({ children, open }: DetailsProps): JSX.Element {
  void open;
  return <>{children}</>;
}
