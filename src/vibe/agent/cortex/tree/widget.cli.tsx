/**
 * Cortex Tree Widget (CLI/MCP)
 * Renders the pre-built ASCII tree verbatim.
 * CLI: colorized tree with stats footer
 * MCP: plain tree text
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import { Platform } from "next-vibe/platforms/platforms";
import { useWidgetPlatform } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useMemo } from "react";

import type { CortexTreeResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: CortexTreeResponseOutput | null | undefined };
  fieldName: string;
}

export function CortexTreeWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    if (isMcp) {
      return `${v.tree}\n\n${v.totalFiles} files, ${v.totalDirs} folders`;
    }

    // Mount-specific colors for directories
    const mountDirColors: Record<string, typeof chalk.cyan> = {
      "memories/": chalk.magenta,
      "documents/": chalk.blue,
      "threads/": chalk.cyan,
      "skills/": chalk.yellow,
      "tasks/": chalk.green,
    };

    const colorized = v.tree
      .split("\n")
      .map((line) => {
        // Color directory names (ending with /)
        if (/\S+\/(\s|$)/.test(line)) {
          return line.replaceAll(/([^\s├│└─]+\/)/g, (m) => {
            const colorFn = mountDirColors[m] ?? chalk.cyan;
            return colorFn.bold(m);
          });
        }
        // Color file names
        return line.replaceAll(/([^\s├│└─]+\.\w+)/g, (m) => chalk.green(m));
      })
      .join("\n");

    return `${colorized}\n\n${chalk.dim(`${v.totalFiles} files, ${v.totalDirs} folders`)}`;
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

CortexTreeWidget.cliWidget = true as const;
