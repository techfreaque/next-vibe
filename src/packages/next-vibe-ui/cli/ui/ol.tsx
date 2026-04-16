import { Box } from "ink";
import type { JSX } from "react";

import type { OlProps } from "../../web/ui/ol";

export type { OlProps, OlMouseEvent } from "../../web/ui/ol";

export function Ol({ children }: OlProps): JSX.Element {
  return <Box flexDirection="column">{children}</Box>;
}

export { Ol as default };
