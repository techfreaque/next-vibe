import type { RootStackProps } from "next-vibe/ui/web/ui/root-stack";
import type { ReactElement } from "react";

export type { RootStackProps } from "next-vibe/ui/web/ui/root-stack";

// CLI: passthrough - no stack navigation in terminal
export function RootStack({ children }: RootStackProps): ReactElement | null {
  return children as ReactElement | null;
}
