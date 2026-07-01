import type { DetailsProps } from "next-vibe/ui/web/ui/details";
import type { JSX } from "react";

export type { DetailsProps } from "next-vibe/ui/web/ui/details";

// CLI: always expanded (no toggle) - render children, ignore open/closed state
export function Details({ children, open }: DetailsProps): JSX.Element {
  void open;
  return <>{children}</>;
}
