/**
 * Cortex List Widget (CLI/MCP)
 * Directory listing with file/folder differentiation.
 * CLI: colored entries with icons, aligned sizes, type indicators
 * MCP: compact one-line-per-entry, parseable
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { formatBytesCli } from "../_shared/format-bytes";

import { MOUNT_WIDGET_REGISTRY } from "../mounts/widget-registry";
import type { CortexListResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: CortexListResponseOutput | null | undefined };
  fieldName: string;
}

export function CortexListWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    if (v.entries.length === 0) {
      return isMcp ? "Empty directory." : chalk.dim("Empty directory.");
    }

    if (isMcp) {
      const mcpMountLabels: Record<string, string> = {
        memories: "mem ",
        documents: "doc ",
        threads: "thrd ",
        skills: "skl ",
        tasks: "task ",
        uploads: "file ",
        searches: "srch ",
        favorites: "fav ",
        gens: "gen ",
      };
      const lines = [`${v.responsePath} (${v.total} items)`];
      for (const e of v.entries) {
        if (e.nodeType === "dir") {
          const segment = e.entryPath.replace(/^\//, "").split("/")[0];
          const label = mcpMountLabels[segment] ?? "dir ";
          const size = e.size !== null ? ` ${e.size}B` : "";
          lines.push(`  ${label} ${e.entryPath}${size}`);
        } else {
          const size = e.size !== null ? ` ${e.size}B` : "";
          lines.push(`  file ${e.entryPath}${size}`);
        }
      }
      return lines.join("\n");
    }

    // CLI: rich formatting with mount-specific icons
    const mountColors: Record<string, typeof chalk.cyan> = {
      memories: chalk.magenta,
      documents: chalk.blue,
      threads: chalk.cyan,
      skills: chalk.yellow,
      tasks: chalk.green,
      uploads: chalk.white,
      searches: chalk.gray,
      favorites: chalk.yellowBright,
      gens: chalk.magentaBright,
    };

    const maxName = Math.max(...v.entries.map((e) => e.name.length), 4);
    const lines: string[] = [
      chalk.bold(`${v.responsePath}`) + chalk.dim(` (${v.total} items)`),
      "",
    ];

    for (const e of v.entries) {
      if (e.nodeType === "dir") {
        const segment = e.entryPath.replace(/^\//, "").split("/")[0];
        const emoji = MOUNT_WIDGET_REGISTRY[`/${segment}`]?.cliEmoji ?? "📁";
        const colorFn = mountColors[segment] ?? chalk.cyan;
        const name = colorFn.bold(e.name.padEnd(maxName));
        const size = chalk.dim(formatBytesCli(e.size));
        lines.push(`  ${emoji} ${name}  ${size}`);
      } else {
        const icon = chalk.green("📄");
        const name = chalk.white(e.name.padEnd(maxName));
        const size = chalk.dim(formatBytesCli(e.size));
        lines.push(`  ${icon} ${name}  ${size}`);
      }
    }

    return lines.join("\n");
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

CortexListWidget.cliWidget = true as const;
