import type { ReactElement } from "react";

import type { RootStackProps } from "../../web/components/root-stack";

export type { RootStackProps } from "../../web/components/root-stack";

// CLI: passthrough - no stack navigation in terminal
export function RootStack({ children }: RootStackProps): ReactElement | null {
  return children as ReactElement | null;
}
