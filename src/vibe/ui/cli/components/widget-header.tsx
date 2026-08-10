import { Box, Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type { WidgetHeaderProps } from "../../web/ui/widget-header";

export type { WidgetHeaderProps } from "../../web/ui/widget-header";

export function WidgetHeader({
  title,
  actions,
}: WidgetHeaderProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Text bold>{title}</Text>;
  }

  return (
    <Box flexDirection="column" gap={0}>
      <Text bold>{`\u2550\u2550\u2550 ${title} \u2550\u2550\u2550`}</Text>
      {actions ? <Box gap={1}>{actions}</Box> : null}
    </Box>
  );
}
WidgetHeader.displayName = "WidgetHeader";
