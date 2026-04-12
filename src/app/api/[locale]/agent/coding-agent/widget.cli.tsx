/**
 * Coding Agent CLI Widget
 * Renders coding agent execution result for CLI and MCP platforms.
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

interface CliWidgetProps {
  field: {
    value: RunResponseOutput | null | undefined;
  };
  fieldName: string;
}

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

function renderCli(value: RunResponseOutput): string {
  const lines: string[] = [];

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
    lines.push("Coding agent is running in background.");
    lines.push(`Task ID: ${value.taskId}`);
    if (value.hint) {
      lines.push(value.hint);
    }
    return lines.join("\n");
  }

  if (value.taskId && value.durationMs === 0) {
    lines.push("Interactive coding agent session launched.");
    lines.push(`Task ID: ${value.taskId}`);
    if (value.output) {
      lines.push(value.output);
    }
    if (value.hint) {
      lines.push(value.hint);
    }
    return lines.join("\n");
  }

  lines.push("Coding agent completed successfully.");

  if (value.durationMs && value.durationMs > 0) {
    lines.push(`Duration: ${formatDuration(value.durationMs)}`);
  }

  if (value.output) {
    lines.push("");
    lines.push(value.output);
  }

  return lines.join("\n");
}

export function CodingAgentWidget({ field }: CliWidgetProps): JSX.Element {
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
      <Text wrap="truncate-end">{output}</Text>
    </Box>
  );
}

CodingAgentWidget.cliWidget = true as const;
