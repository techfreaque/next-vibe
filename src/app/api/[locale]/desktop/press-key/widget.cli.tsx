/**
 * Press Key CLI Widget
 * CLI: green checkmark + key combo display, repeat count if >1
 * MCP: compact one-liner
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { DesktopPressKeyResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: DesktopPressKeyResponseOutput | null | undefined };
  fieldName: string;
}

export function PressKeyCliWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    if (!v.success) {
      const msg = v.error ?? "Key press failed";
      return isMcp ? `error: ${msg}` : chalk.red(`✗ ${msg}`);
    }

    return isMcp ? "key: ok" : `${chalk.green("✓")} Key pressed`;
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

PressKeyCliWidget.cliWidget = true as const;

export { PressKeyCliWidget as PressKeyWidget };
