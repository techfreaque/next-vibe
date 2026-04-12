/**
 * Fetch URL Content CLI Widget
 * Renders fetched URL content for CLI and MCP platforms.
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useInkWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { FetchUrlContentGetResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: FetchUrlContentGetResponseOutput | null | undefined;
  };
  fieldName: string;
}

const PREVIEW_LINES = 20;

function renderCli(value: FetchUrlContentGetResponseOutput): string {
  const lines: string[] = [];

  lines.push(
    `${chalk.green("✓")} ${chalk.bold("Fetched")} ${chalk.cyan(value.fetchedUrl)}`,
  );

  if (value.statusCode !== undefined) {
    lines.push(
      `${chalk.dim("Status")}   ${chalk.yellow(String(value.statusCode))}  ${chalk.dim("Time")}  ${chalk.yellow(String(value.timeElapsed ?? 0))}ms`,
    );
  }

  if (value.truncated) {
    lines.push("");
    lines.push(
      chalk.yellow(`⚠ ${value.truncatedNote ?? "Content truncated."}`),
    );
  }

  lines.push("");
  lines.push(chalk.dim("─".repeat(60)));

  const contentLines = value.content.split("\n");
  const preview = contentLines.slice(0, PREVIEW_LINES);
  lines.push(...preview);

  if (contentLines.length > PREVIEW_LINES) {
    lines.push("");
    lines.push(
      chalk.dim(`… ${contentLines.length - PREVIEW_LINES} more lines`),
    );
  }

  return lines.join("\n");
}

function renderMcp(value: FetchUrlContentGetResponseOutput): string {
  const parts: string[] = [
    `URL: ${value.fetchedUrl}`,
    `Status: ${String(value.statusCode ?? "unknown")} | Time: ${String(value.timeElapsed ?? 0)}ms`,
  ];

  if (value.truncated && value.truncatedNote) {
    parts.push(`NOTE: ${value.truncatedNote}`);
  }

  parts.push("", value.content);

  return parts.join("\n");
}

export function FetchUrlContentWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useInkWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const value = field.value;
    if (!value) {
      return "";
    }
    return isMcp ? renderMcp(value) : renderCli(value);
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

FetchUrlContentWidget.cliWidget = true as const;
