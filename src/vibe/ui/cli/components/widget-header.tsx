import { Box, Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type { WidgetHeaderProps } from "../../web/components/widget-header";

export type { WidgetHeaderProps } from "../../web/components/widget-header";

export function WidgetHeader({
  title,
  titleAccessory,
  size = "section",
  subtitle,
  breadcrumb,
  actions,
}: WidgetHeaderProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return titleAccessory ? (
      <Box flexDirection="column">
        <Text bold>{title}</Text>
        {titleAccessory}
      </Box>
    ) : (
      <Text bold>{title}</Text>
    );
  }

  return (
    <Box flexDirection="column" gap={0}>
      {size === "page" && breadcrumb}
      <Text bold>{`\u2550\u2550\u2550 ${title} \u2550\u2550\u2550`}</Text>
      {titleAccessory}
      {size === "page" && subtitle ? <Text dimColor>{subtitle}</Text> : null}
      {actions ? <Box gap={1}>{actions}</Box> : null}
    </Box>
  );
}
WidgetHeader.displayName = "WidgetHeader";
