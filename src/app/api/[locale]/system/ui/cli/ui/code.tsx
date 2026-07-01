import { Text } from "ink";
import { useIsMcp } from "next-vibe-ui/unified/_shared/use-widget-context";
import type { JSX, ReactNode } from "react";

export interface CodeProps {
  children?: ReactNode;
  className?: string;
}

// CLI: cyan monospace text. MCP: plain text (no color codes for AI consumers).
export function Code({ children }: CodeProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Text>{children}</Text>;
  }

  return <Text color="cyan">{children}</Text>;
}
