import { Text } from "ink";
import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import * as React from "react";

import type { HrProps } from "../../web/ui/hr";
import { useSeparatorLine } from "../hooks/use-separator-width";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Hr(_props: HrProps): React.JSX.Element | null {
  const isMcp = useIsMcp();
  // Hooks must run before any early return.
  const separator = useSeparatorLine();

  if (isMcp) {
    return null;
  }

  return <Text dimColor>{separator}</Text>;
}
