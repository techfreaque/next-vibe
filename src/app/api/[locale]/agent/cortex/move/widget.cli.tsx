/**
 * Cortex Move Widget (CLI/MCP)
 * Confirmation display for move/rename operations.
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { CortexMoveResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: CortexMoveResponseOutput | null | undefined };
  fieldName: string;
}

export function CortexMoveWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    const plural = v.nodesAffected === 1 ? "node" : "nodes";

    if (isMcp) {
      return `Moved: ${v.responseFrom} → ${v.responseTo} (${v.nodesAffected} ${plural})`;
    }

    return `${chalk.green("✓")} ${chalk.bold("Moved")} ${chalk.cyan(v.responseFrom)} → ${chalk.cyan(v.responseTo)} ${chalk.dim(`${v.nodesAffected} ${plural}`)}`;
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

CortexMoveWidget.cliWidget = true as const;
