/**
 * List Monitors CLI Widget
 * CLI: aligned table with primary highlight, unicode box drawing
 * MCP: compact one-line-per-monitor, AI-parseable
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { DesktopListMonitorsResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: DesktopListMonitorsResponseOutput | null | undefined };
  fieldName: string;
}

export function ListMonitorsCliWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v?.monitors?.length) {
      return isMcp
        ? "No monitors detected."
        : chalk.dim("No monitors detected.");
    }

    const monitors = v.monitors;

    if (isMcp) {
      return monitors
        .map((m) => {
          const primary = m.primary ? " primary" : "";
          return `${m.index}: ${m.name} ${m.width}x${m.height} pos=${m.x},${m.y}${primary}`;
        })
        .join("\n");
    }

    // CLI: box-drawing table
    const maxName = Math.max(...monitors.map((m) => m.name.length), 6);
    const lines: string[] = [];

    const header = ` #   ${"Name".padEnd(maxName)}  Resolution    Position     `;
    const divider = "─".repeat(header.length);

    lines.push(chalk.dim(`┌${divider}┐`));
    lines.push(chalk.dim("│") + chalk.bold(header) + chalk.dim("│"));
    lines.push(chalk.dim(`├${divider}┤`));

    for (const m of monitors) {
      const idxCol = chalk.dim(` #${m.index} `);
      const nameCol = m.primary
        ? chalk.cyan.bold(m.name.padEnd(maxName))
        : chalk.white(m.name.padEnd(maxName));
      const resCol = chalk.green(`${m.width}×${m.height}`.padEnd(14));
      const posCol = chalk.dim(`at ${m.x},${m.y}`.padEnd(13));
      const primaryBadge = m.primary ? chalk.cyan(" [PRIMARY]") : "          ";
      lines.push(
        `${chalk.dim("│")}${idxCol} ${nameCol}  ${resCol}${posCol}${primaryBadge}${chalk.dim("│")}`,
      );
    }

    lines.push(chalk.dim(`└${divider}┘`));
    lines.push(
      chalk.dim(
        `${monitors.length} monitor${monitors.length === 1 ? "" : "s"}. Use monitorName in take-screenshot to capture a specific screen.`,
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

ListMonitorsCliWidget.cliWidget = true as const;

export { ListMonitorsCliWidget as ListMonitorsWidget };
