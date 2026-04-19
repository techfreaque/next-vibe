/**
 * Cortex Edit Widget (CLI/MCP)
 * Confirmation display for file edit operations.
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { CortexEditResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: CortexEditResponseOutput | null | undefined };
  fieldName: string;
}

export function CortexEditWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    if (isMcp) {
      return `Edited: ${v.responsePath} (${v.replacements} replacements, ${v.size}B)`;
    }

    return `${chalk.green("✓")} ${chalk.bold("Edited")} ${chalk.cyan(v.responsePath)} ${chalk.dim(`${v.replacements} replacements, ${v.size}B`)}`;
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

CortexEditWidget.cliWidget = true as const;
