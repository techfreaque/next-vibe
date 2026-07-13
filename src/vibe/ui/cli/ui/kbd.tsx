import { Text } from "ink";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type { KbdProps } from "../../web/ui/kbd";

export type { KbdProps } from "../../web/ui/kbd";

// CLI: keyboard keys shown in brackets, bold. MCP: plain text.
export function Kbd({ children }: KbdProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Text>{children}</Text>;
  }

  return <Text bold>[{children}]</Text>;
}
