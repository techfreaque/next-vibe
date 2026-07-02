import { Box, Text } from "ink";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type { LoadingBlockProps } from "../../web/ui/loading-block";

export type {
  LoadingBlockProps,
  LoadingBlockSize,
} from "../../web/ui/loading-block";

const SPINNER_DOT = "\u25CF";

export function LoadingBlock({ message }: LoadingBlockProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Text>{message ?? "Loading..."}</Text>;
  }

  return (
    <Box gap={1}>
      <Text color="cyan">{SPINNER_DOT}</Text>
      <Text dimColor>{message ?? "Loading..."}</Text>
    </Box>
  );
}
LoadingBlock.displayName = "LoadingBlock";
