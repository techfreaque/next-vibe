import { Text } from "ink";
import type { HrProps } from "next-vibe/ui/web/ui/hr";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";
import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Hr(_props: HrProps): React.JSX.Element | null {
  const isMcp = useIsMcp();

  if (isMcp) {
    return null;
  }

  return <Text dimColor>{"─".repeat(60)}</Text>;
}
