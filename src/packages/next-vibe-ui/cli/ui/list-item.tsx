import { Box, Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "next-vibe-ui/unified/_shared/use-widget-context";
import type { ListItemProps } from "../../web/ui/list-item";

export type { ListItemProps } from "../../web/ui/list-item";

export function ListItem({
  title,
  subtitle,
  badges,
  meta,
}: ListItemProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return (
      <Box gap={1}>
        <Text>
          {"\u2022"} {title}
          {subtitle ? ` \u2014 ${subtitle}` : ""}
        </Text>
        {badges}
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingLeft={1}>
      <Box gap={1}>
        <Text>{"\u2022"}</Text>
        <Text bold>{title}</Text>
        {badges}
      </Box>
      {subtitle ? (
        <Box paddingLeft={2}>
          <Text dimColor>{subtitle}</Text>
        </Box>
      ) : null}
      {meta ? (
        <Box paddingLeft={2} gap={2}>
          {meta}
        </Box>
      ) : null}
    </Box>
  );
}
ListItem.displayName = "ListItem";
