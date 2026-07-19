/**
 * Type Text CLI Widget
 * CLI: green checkmark, quoted text preview (max 60 chars), window target if set
 * MCP: compact with text preview
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import { Platform } from "next-vibe/platforms/platforms";
import { useWidgetPlatform } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useMemo } from "react";

import type { DesktopTypeTextResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: DesktopTypeTextResponseOutput | null | undefined };
  fieldName: string;
}

export function TypeTextCliWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    if (!v.success) {
      const msg = v.error ?? "Type failed";
      return isMcp ? `error: ${msg}` : chalk.red(`✗ ${msg}`);
    }

    return isMcp ? "typed: ok" : `${chalk.green("✓")} Text typed`;
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

TypeTextCliWidget.cliWidget = true as const;

export { TypeTextCliWidget as TypeTextWidget };
