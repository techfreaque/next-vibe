/**
 * Get Accessibility Tree CLI Widget
 * CLI: formatted tree with indentation, dim cyan roles, white names, truncate at 200 lines
 * MCP: return tree as-is (AI needs full detail)
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { DesktopGetAccessibilityTreeResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: DesktopGetAccessibilityTreeResponseOutput | null | undefined;
  };
  fieldName: string;
}

const MAX_CLI_LINES = 200;

/** Color roles in tree lines: `[role]` patterns → dim cyan */
function colorizeTreeLine(line: string): string {
  // Match [role] or [role 'name'] patterns
  return line.replace(/\[([^\]]+)\]/g, (match) => {
    const role = match.slice(1, -1);
    return chalk.dim.cyan(`[${role}]`);
  });
}

export function GetAccessibilityTreeCliWidget({
  field,
}: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    if (!v.success || !v.tree) {
      const msg = v.error ?? "No accessibility tree returned";
      return isMcp ? `error: ${msg}` : chalk.red(`  ✗ ${msg}`);
    }

    if (isMcp) {
      // AI gets full tree - prepend stats
      const stats: string[] = [];
      if (v.nodeCount !== null && v.nodeCount !== undefined) {
        stats.push(`nodes: ${v.nodeCount}`);
      }
      if (v.truncated) {
        stats.push("truncated: true");
      }
      return stats.length ? `${stats.join("  ")}\n${v.tree}` : v.tree;
    }

    // CLI: color-enhanced tree, truncated if too long
    const rawLines = v.tree.split("\n");
    const truncated = rawLines.length > MAX_CLI_LINES;
    const displayLines = truncated
      ? rawLines.slice(0, MAX_CLI_LINES)
      : rawLines;

    const colorized = displayLines.map(colorizeTreeLine);

    const header: string[] = [];
    if (v.nodeCount !== null && v.nodeCount !== undefined) {
      header.push(
        chalk.dim(`  ${v.nodeCount} node${v.nodeCount === 1 ? "" : "s"}`),
      );
    }
    if (v.truncated) {
      header.push(
        chalk.yellow("  ⚠ Query timed out - output may be incomplete"),
      );
    }

    const footer: string[] = [];
    if (truncated) {
      const remaining = rawLines.length - MAX_CLI_LINES;
      footer.push(
        chalk.dim(
          `  … ${remaining} more line${remaining === 1 ? "" : "s"} (use MCP for full output)`,
        ),
      );
    }

    return [...header, ...colorized, ...footer].join("\n");
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

GetAccessibilityTreeCliWidget.cliWidget = true as const;

export { GetAccessibilityTreeCliWidget as GetAccessibilityTreeWidget };
