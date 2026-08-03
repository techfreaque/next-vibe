import { Box, Text } from "ink";
import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import * as React from "react";

import type { TrProps } from "../../web/ui/tr";
import { useSeparatorLine } from "../hooks/use-separator-width";
import { parseClassesToBoxProps } from "./tailwind-to-ink";

export type { TrProps } from "../../web/ui/tr";

const CELL_DIVIDER = " | ";

export function Tr({ className, children }: TrProps): JSX.Element {
  const isMcp = useIsMcp();
  const boxProps = parseClassesToBoxProps(className);
  const separator = useSeparatorLine();

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
        <Text dimColor>{separator}</Text>
      </Box>
    </Box>
  );
}
