import { Box, Text } from "ink";
import { parseClassesToBoxProps } from "next-vibe/ui/cli/utils/tailwind-to-ink";
import type { TrProps } from "next-vibe/ui/web/ui/tr";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import * as React from "react";

export type { TrProps } from "next-vibe/ui/web/ui/tr";

const SEPARATOR = "\u2500".repeat(60);
const CELL_DIVIDER = " | ";

export function Tr({ className, children }: TrProps): JSX.Element {
  const isMcp = useIsMcp();
  const boxProps = parseClassesToBoxProps(className);

  if (isMcp) {
    const cells: React.ReactNode[] = [];
    React.Children.forEach(children, (child, i) => {
      if (i > 0) {
        cells.push(<Text key={`sep-${i}`}>{CELL_DIVIDER}</Text>);
      }
      cells.push(child);
    });
    return (
      <Box flexDirection="row" {...boxProps}>
        {cells}
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box flexDirection="row" gap={2} {...boxProps}>
        {children}
      </Box>
      <Box>
        <Text dimColor>{SEPARATOR}</Text>
      </Box>
    </Box>
  );
}
