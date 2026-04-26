/**
 * List Windows CLI Widget
 * CLI: grouped by desktop, aligned columns - window ID, PID, size, title
 * MCP: compact one-line-per-window, AI-parseable
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { DesktopListWindowsResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: DesktopListWindowsResponseOutput | null | undefined };
  fieldName: string;
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

export function ListWindowsCliWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v?.windows?.length) {
      return isMcp ? "No windows found." : chalk.dim("No open windows found.");
    }

    const windows = v.windows;

    if (isMcp) {
      return windows
        .map(
          (w) =>
            `${w.windowId} | ${w.pid} | ${w.width}x${w.height} | desktop:${w.desktopId} | ${w.title}`,
        )
        .join("\n");
    }

    // Group by desktop
    const byDesktop = new Map<string, typeof windows>();
    for (const w of windows) {
      const key = w.desktopId === "-1" ? "sticky" : `Desktop ${w.desktopId}`;
      if (!byDesktop.has(key)) {
        byDesktop.set(key, []);
      }
      byDesktop.get(key)!.push(w);
    }

    const lines: string[] = [];
    for (const [desktop, wins] of byDesktop) {
      lines.push(chalk.bold.cyan(`\n  ${desktop}:`));
      for (const w of wins) {
        const id = chalk.dim(w.windowId.padEnd(12));
        const size = chalk.green(`${w.width}×${w.height}`.padEnd(12));
        const pid = chalk.dim(`pid:${w.pid}`.padEnd(12));
        const title = chalk.white(truncate(w.title, 50));
        lines.push(`    ${id} ${size} ${pid} ${title}`);
      }
    }

    lines.push(
      chalk.dim(
        `\n  ${windows.length} window${windows.length === 1 ? "" : "s"} total`,
      ),
    );
    return lines.join("\n");
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

ListWindowsCliWidget.cliWidget = true as const;

export { ListWindowsCliWidget as ListWindowsWidget };
