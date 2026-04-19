/**
 * Cortex Write Widget (CLI/MCP)
 * Confirmation display for file write operations.
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { CortexWriteResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: CortexWriteResponseOutput | null | undefined };
  fieldName: string;
}

export function CortexWriteWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    const action = v.created ? "Created" : "Updated";

    if (isMcp) {
      return `${action}: ${v.responsePath} (${v.size}B)`;
    }

    const icon = v.created ? chalk.green("✓") : chalk.yellow("✓");
    return `${icon} ${chalk.bold(action)} ${chalk.cyan(v.responsePath)} ${chalk.dim(`${v.size}B`)}`;
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

CortexWriteWidget.cliWidget = true as const;
