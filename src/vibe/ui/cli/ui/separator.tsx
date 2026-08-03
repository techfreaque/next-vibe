import { Text } from "ink";
import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import * as React from "react";

import type { SeparatorRootProps } from "../../web/ui/separator";
import { useSeparatorLine } from "../hooks/use-separator-width";

export function Separator({
  orientation = "horizontal",
}: SeparatorRootProps): React.JSX.Element | null {
  const isMcp = useIsMcp();
  // Hooks must run before any early return.
  const horizontalBar = useSeparatorLine(); // ────

  if (isMcp) {
    return null;
  }

  const verticalBar = "|"; // |

  if (orientation === "vertical") {
    return <Text dimColor>{verticalBar}</Text>;
  }

  return <Text dimColor>{horizontalBar}</Text>;
}
