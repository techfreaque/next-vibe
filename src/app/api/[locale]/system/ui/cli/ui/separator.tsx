import { Text } from "ink";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";
import * as React from "react";

import type { SeparatorRootProps } from "../../web/ui/separator";

export function Separator({
  orientation = "horizontal",
}: SeparatorRootProps): React.JSX.Element | null {
  const isMcp = useIsMcp();

  if (isMcp) {
    return null;
  }

  const verticalBar = "\u007C"; // |
  const horizontalBar = "\u2500".repeat(60); // ────

  if (orientation === "vertical") {
    return <Text dimColor>{verticalBar}</Text>;
  }

  return <Text dimColor>{horizontalBar}</Text>;
}
