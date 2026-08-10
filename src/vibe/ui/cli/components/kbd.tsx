import { Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type { KbdProps } from "../../web/components/kbd";

export type { KbdProps } from "../../web/components/kbd";

// CLI: keyboard keys shown in brackets, bold. MCP: plain text.
export function Kbd({ children }: KbdProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Text>{children}</Text>;
  }

  return <Text bold>[{children}]</Text>;
}
