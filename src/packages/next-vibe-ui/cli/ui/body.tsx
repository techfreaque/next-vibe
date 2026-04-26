import type { JSX } from "react";

import type { BodyProps } from "../../web/ui/body";

export type { BodyProps } from "../../web/ui/body";

// CLI: no HTML body wrapper — passthrough children
export function Body({ children }: BodyProps): JSX.Element {
  return <>{children}</>;
}
