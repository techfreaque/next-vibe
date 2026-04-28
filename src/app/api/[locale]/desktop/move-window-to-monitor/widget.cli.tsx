import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { DesktopMoveWindowToMonitorResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: DesktopMoveWindowToMonitorResponseOutput | null | undefined };
  fieldName: string;
}

export function MoveWindowToMonitorCliWidget({
  field,
}: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    if (!v.success) {
      const msg = v.error ?? "Move failed";
      return isMcp ? `error: ${msg}` : chalk.red(`✗ ${msg}`);
    }

    const win = v.windowTitle ? `"${v.windowTitle}"` : "window";
    const mon = v.movedTo ?? "monitor";

    return isMcp
      ? `moved: ${win} → ${mon}`
      : `${chalk.green("✓")} ${win} moved to ${chalk.cyan(mon)}`;
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

MoveWindowToMonitorCliWidget.cliWidget = true as const;

export { MoveWindowToMonitorCliWidget as MoveWindowToMonitorWidget };
