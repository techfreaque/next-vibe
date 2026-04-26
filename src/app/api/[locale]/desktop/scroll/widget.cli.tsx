/**
 * Scroll CLI Widget
 * CLI: directional arrow with amount + position
 * MCP: compact one-liner
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { DesktopScrollResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: DesktopScrollResponseOutput | null | undefined };
  fieldName: string;
}

const directionArrow: Record<string, string> = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

export function ScrollCliWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    if (!v.success) {
      const msg = v.error ?? "Scroll failed";
      return isMcp ? `error: ${msg}` : chalk.red(`✗ ${msg}`);
    }

    return isMcp ? "scrolled: ok" : `${chalk.cyan("↕")} Scrolled`;
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

// Keep directionArrow exported for potential reuse
export { directionArrow };

ScrollCliWidget.cliWidget = true as const;

export { ScrollCliWidget as ScrollWidget };
