import { Text } from "ink";
import type { KbdProps } from "next-vibe/ui/web/ui/kbd";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

export type { KbdProps } from "next-vibe/ui/web/ui/kbd";

// CLI: keyboard keys shown in brackets, bold. MCP: plain text.
export function Kbd({ children }: KbdProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Text>{children}</Text>;
  }

  return <Text bold>[{children}]</Text>;
}
