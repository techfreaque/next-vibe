import { Box, Text } from "ink";
import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type { SectionGroupProps } from "../../web/ui/section-group";

export type { SectionGroupProps } from "../../web/ui/section-group";

export function SectionGroup({
  title,
  subtitle,
  children,
}: SectionGroupProps): JSX.Element {
  const isMcp = useIsMcp();
  const subtitleText = typeof subtitle === "string" ? subtitle : null;

  if (isMcp) {
    return (
      <Box flexDirection="column">
        <Text bold>{title}</Text>
        {subtitleText ? <Text dimColor>{subtitleText}</Text> : null}
        {children}
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={0}>
      <Text bold dimColor>
        {`\u2500\u2500 ${title} \u2500\u2500`}
      </Text>
      {subtitleText ? <Text dimColor> {subtitleText}</Text> : null}
      <Box flexDirection="column" paddingLeft={2}>
        {children}
      </Box>
    </Box>
  );
}
SectionGroup.displayName = "SectionGroup";
