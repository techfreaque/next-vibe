/**
 * Focus Window CLI Widget
 * CLI: green checkmark + what was focused
 * MCP: compact one-liner
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import { Platform } from "next-vibe/platforms/platforms";
import { useWidgetPlatform } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useMemo } from "react";

import type { DesktopFocusWindowResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: DesktopFocusWindowResponseOutput | null | undefined };
  fieldName: string;
}

export function FocusWindowCliWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    if (!v.success) {
      const msg = v.error ?? "Focus failed";
      return isMcp ? `error: ${msg}` : chalk.red(`✗ ${msg}`);
    }

    return isMcp ? "focused: ok" : `${chalk.green("✓")} Window focused`;
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

FocusWindowCliWidget.cliWidget = true as const;

export { FocusWindowCliWidget as FocusWindowWidget };
