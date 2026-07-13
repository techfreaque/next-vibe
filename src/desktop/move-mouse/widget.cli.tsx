/**
 * Move Mouse CLI Widget
 * CLI: arrow indicator with coordinates
 * MCP: compact one-liner
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import { Platform } from "next-vibe/core/definition/platform";
import { useWidgetPlatform } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useMemo } from "react";

import type { DesktopMoveMouseResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: DesktopMoveMouseResponseOutput | null | undefined };
  fieldName: string;
}

export function MoveMouseCliWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    if (!v.success) {
      const msg = v.error ?? "Mouse move failed";
      return isMcp ? `error: ${msg}` : chalk.red(`✗ ${msg}`);
    }

    return isMcp ? "moved: ok" : `${chalk.cyan("→")} Mouse moved`;
  }, [field.value, isMcp]);

  if (!output) {
    return <Box />;
  }

  return (
    <Box flexDirection="column">
      <Text wrap="wrap">{output}</Text>
    </Box>
  );
}

MoveMouseCliWidget.cliWidget = true as const;

export { MoveMouseCliWidget as MoveMouseWidget };
