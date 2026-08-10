import { Box, Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type { ActionCardProps } from "../../web/components/action-card";

export type { ActionCardProps } from "../../web/components/action-card";

export function ActionCard({
  title,
  description,
}: ActionCardProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return (
      <Text>
        {title}
        {description ? ` - ${description}` : ""}
      </Text>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold>{title}</Text>
      {description ? <Text dimColor>{description}</Text> : null}
    </Box>
  );
}
