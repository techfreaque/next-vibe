import { Box } from "ink";
import type { UlProps } from "next-vibe/ui/web/ui/ul";
import type { JSX } from "react";

export type { UlMouseEvent, UlProps } from "next-vibe/ui/web/ui/ul";

export function Ul({ children }: UlProps): JSX.Element {
  return <Box flexDirection="column">{children}</Box>;
}

export { Ul as default };
