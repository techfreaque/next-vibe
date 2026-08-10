import type { JSX } from "react";

import type { BodyProps } from "../../web/components/body";

export type { BodyProps } from "../../web/components/body";

// CLI: no HTML body wrapper - passthrough children
export function Body({ children }: BodyProps): JSX.Element {
  return <>{children}</>;
}
