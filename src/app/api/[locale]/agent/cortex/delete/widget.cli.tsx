/**
 * Cortex Delete Widget (CLI/MCP)
 * Confirmation display for delete operations.
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { CortexDeleteResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: CortexDeleteResponseOutput | null | undefined };
  fieldName: string;
}

export function CortexDeleteWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    const plural = v.nodesDeleted === 1 ? "node" : "nodes";

    if (isMcp) {
      return `Deleted: ${v.responsePath} (${v.nodesDeleted} ${plural})`;
    }

    return `${chalk.red("✗")} ${chalk.bold("Deleted")} ${chalk.cyan(v.responsePath)} ${chalk.dim(`${v.nodesDeleted} ${plural}`)}`;
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

CortexDeleteWidget.cliWidget = true as const;
