import type { ReactElement } from "react";

import type { RootStackProps } from "../../web/ui/root-stack";

export type { RootStackProps } from "../../web/ui/root-stack";

// CLI: passthrough — no stack navigation in terminal
export function RootStack({ children }: RootStackProps): ReactElement | null {
  return children as ReactElement | null;
}
