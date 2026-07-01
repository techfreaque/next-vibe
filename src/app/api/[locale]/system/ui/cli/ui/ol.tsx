import { Box } from "ink";
import type { OlProps } from "next-vibe/ui/web/ui/ol";
import type { JSX } from "react";

export type { OlMouseEvent, OlProps } from "next-vibe/ui/web/ui/ol";

export function Ol({ children }: OlProps): JSX.Element {
  return <Box flexDirection="column">{children}</Box>;
}

export { Ol as default };
