import * as React from "react";
import { Text } from "ink";

import type { HrProps } from "../../web/ui/hr";
import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Hr(_props: HrProps): React.JSX.Element | null {
  const isMcp = useIsMcp();

  if (isMcp) {
    return null;
  }

  return <Text dimColor>{"─".repeat(60)}</Text>;
}
