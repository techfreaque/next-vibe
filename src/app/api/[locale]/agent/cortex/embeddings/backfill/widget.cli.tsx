/**
 * Cortex Backfill Widget (CLI/MCP)
 * Embedding backfill result display.
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { CortexBackfillResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: CortexBackfillResponseOutput | null | undefined };
  fieldName: string;
}

export function CortexBackfillWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    if (isMcp) {
      return `Backfill complete: ${v.processed} embedded, ${v.failed} failed, ${v.skipped} skipped`;
    }

    const parts = [
      chalk.green(`${v.processed} embedded`),
      v.failed > 0 ? chalk.red(`${v.failed} failed`) : null,
      v.skipped > 0 ? chalk.yellow(`${v.skipped} skipped`) : null,
    ].filter(Boolean);

    return `${chalk.bold("Backfill")} ${parts.join(", ")}`;
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

CortexBackfillWidget.cliWidget = true as const;
