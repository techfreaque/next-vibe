import { Box, Text } from "ink";
import type { EmptyBlockProps } from "next-vibe/ui/web/ui/empty-block";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

export type {
  EmptyBlockAction,
  EmptyBlockProps,
} from "next-vibe/ui/web/ui/empty-block";

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
