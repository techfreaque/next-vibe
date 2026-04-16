import * as React from "react";
import { Text } from "ink";

import type { SeparatorRootProps } from "../../web/ui/separator";
import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

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
