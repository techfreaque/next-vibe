import { Text } from "ink";
import type { JSX, ReactNode } from "react";
import type { JSX, ReactNode } from "react";
import type { JSX, ReactNode } from "react";

import { useIsMcp } from "next-vibe-ui/unified/_shared/use-widget-context";

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
