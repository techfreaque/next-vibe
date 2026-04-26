/**
 * Click CLI Widget
 * CLI: green checkmark, coordinates, button type, double-click indicator
 * MCP: compact one-liner
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { DesktopClickResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: DesktopClickResponseOutput | null | undefined };
  fieldName: string;
  /**
   * The request data is not in the response type, but we can pass it as
   * additional context via fieldName convention. We'll parse what we can
   * from the response and keep it simple.
   */
}

export function ClickCliWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    if (!v.success) {
      const msg = v.error ?? "Click failed";
      return isMcp ? `error: ${msg}` : chalk.red(`✗ ${msg}`);
    }

    return isMcp ? "clicked: ok" : `${chalk.green("✓")} Click executed`;
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

ClickCliWidget.cliWidget = true as const;

export { ClickCliWidget as ClickWidget };
