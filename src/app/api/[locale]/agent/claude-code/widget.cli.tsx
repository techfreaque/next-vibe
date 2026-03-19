/**
 * Claude Code CLI Widget
 * Renders Claude Code execution result for CLI and MCP platforms.
 * CLI: colored output with status icon, duration, output block
 * MCP: compact plain text
 *
 * NOTE: Failures use fail() at the API level, so any value received here is success.
 * States:
 *   - Escalated: taskId present + output empty → running in background
 *   - Interactive: taskId present + durationMs === 0 + output non-empty → terminal launched
 *   - Normal: output returned synchronously
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useInkWidgetLocale,
  useInkWidgetPlatform,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { RunResponseOutput } from "./definition";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CliWidgetProps {
  field: {
    value: RunResponseOutput | null | undefined;
  };
  fieldName: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDuration(ms: number | null | undefined): string {
  if (ms === null || ms === undefined || ms === 0) {
    return "—";
  }
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60_000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  return `${Math.floor(ms / 60_000)}m ${Math.round((ms % 60_000) / 1000)}s`;
}

// ---------------------------------------------------------------------------
// Render functions
// ---------------------------------------------------------------------------

function renderCli(value: RunResponseOutput): string {
  const lines: string[] = [];

  // Escalated: running in background
  if (value.taskId && !value.output) {
    lines.push(
      `${chalk.blue("⟳")} ${chalk.bold.blue("Running in background")}`,
    );
    lines.push("");
    lines.push(`${chalk.dim("Task ID")}   ${chalk.cyan(value.taskId)}`);
    if (value.hint) {
      lines.push("");
      lines.push(chalk.dim(value.hint));
    }
    return lines.join("\n");
  }

  // Interactive session launched: taskId + durationMs === 0 signals it was opened in terminal
  if (value.taskId && value.durationMs === 0) {
    lines.push(
      `${chalk.magenta("◆")} ${chalk.bold.magenta("Interactive session launched")}`,
    );
    lines.push("");
    lines.push(`${chalk.dim("Task ID")}   ${chalk.cyan(value.taskId)}`);
    if (value.output) {
      lines.push(chalk.dim(value.output));
    }
    if (value.hint) {
      lines.push("");
      lines.push(chalk.dim(value.hint));
    }
    return lines.join("\n");
  }

  if (value.durationMs && value.durationMs > 0) {
    lines.push(
      `${chalk.dim("Duration")}   ${chalk.yellow(formatDuration(value.durationMs))}`,
    );
  }

  if (value.output) {
    lines.push(chalk.dim("─".repeat(40)));
    lines.push(value.output);
  }

  return lines.join("\n");
}

function renderMcp(value: RunResponseOutput): string {
  const lines: string[] = [];

  if (value.taskId && !value.output) {
    lines.push("Claude Code is running in background.");
    lines.push(`Task ID: ${value.taskId}`);
    if (value.hint) {
      lines.push(value.hint);
    }
    return lines.join("\n");
  }

  if (value.taskId && value.durationMs === 0) {
    lines.push("Interactive Claude Code session launched.");
    lines.push(`Task ID: ${value.taskId}`);
    if (value.output) {
      lines.push(value.output);
    }
    if (value.hint) {
      lines.push(value.hint);
    }
    return lines.join("\n");
  }

  lines.push("Claude Code completed successfully.");

  if (value.durationMs && value.durationMs > 0) {
    lines.push(`Duration: ${formatDuration(value.durationMs)}`);
  }

  if (value.output) {
    lines.push("");
    lines.push(value.output);
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

export function ClaudeCodeWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useInkWidgetPlatform();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const locale = useInkWidgetLocale();
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
      <Text wrap="end">{output}</Text>
    </Box>
  );
}

ClaudeCodeWidget.cliWidget = true as const;
