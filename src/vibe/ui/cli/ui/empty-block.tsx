import { Box, Text } from "ink";
import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type { EmptyBlockProps } from "../../web/ui/empty-block";

export type {
  EmptyBlockAction,
  EmptyBlockProps,
} from "../../web/ui/empty-block";

export function EmptyBlock({ title, message }: EmptyBlockProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return (
      <Text>
        {title}
        {message ? ` - ${message}` : ""}
      </Text>
    );
  }

  return (
    <Box flexDirection="column" gap={0} paddingY={1}>
      <Text dimColor>{title}</Text>
      {message ? <Text dimColor> {message}</Text> : null}
    </Box>
  );
}
EmptyBlock.displayName = "EmptyBlock";
