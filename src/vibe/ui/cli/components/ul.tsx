import { Box } from "ink";
import type { JSX } from "react";

import type { UlProps } from "../../web/components/ul";

export type { UlMouseEvent, UlProps } from "../../web/components/ul";

export function Ul({ children }: UlProps): JSX.Element {
  return <Box flexDirection="column">{children}</Box>;
}

export { Ul as default };
