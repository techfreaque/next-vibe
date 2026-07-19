/**
 * Cortex Mkdir Widget (CLI/MCP)
 * Confirmation display for directory creation.
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import { Platform } from "next-vibe/platforms/platforms";
import { useWidgetPlatform } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useMemo } from "react";

import type { CortexMkdirResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: CortexMkdirResponseOutput | null | undefined };
  fieldName: string;
}

export function CortexMkdirWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    if (isMcp) {
      return `Created folder: ${v.responsePath}${v.created ? " (new)" : ""}`;
    }

    const icon = v.created ? chalk.green("✓") : chalk.yellow("✓");
    return `${icon} ${chalk.bold("Created")} ${chalk.cyan(v.responsePath)}`;
  }, [field.value, isMcp]);

  if (!output) {
    return <Box />;
  }

  return (
    <Box flexDirection="column">
      <Text wrap="truncate-end">{output}</Text>
    </Box>
  );
}

CortexMkdirWidget.cliWidget = true as const;
