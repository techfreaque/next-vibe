import { Box } from "ink";
import type { JSX } from "react";

import type { UlProps } from "../../web/ui/ul";

export type { UlProps, UlMouseEvent } from "../../web/ui/ul";

export function Ul({ children }: UlProps): JSX.Element {
  return <Box flexDirection="column">{children}</Box>;
}

export { Ul as default };
