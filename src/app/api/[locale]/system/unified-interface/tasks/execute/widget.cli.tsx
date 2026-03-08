/**
 * Task Execute CLI Widget
 * Renders task execution result for CLI and MCP platforms.
 * CLI: colored output with status icon, duration, timestamps
 * MCP: compact plain text
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

import { CronTaskStatus } from "../enum";
import type { TaskExecuteResponseOutput } from "./definition";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CliWidgetProps {
  field: {
    value: TaskExecuteResponseOutput | null | undefined;
  };
  fieldName: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDuration(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) {
    return "—";
  }
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}

function formatDate(s: string | null | undefined): string {
  if (!s) {
    return "—";
  }
  return s.slice(0, 19).replace("T", " ");
}

function statusIcon(status: string | null | undefined): string {
  if (status === CronTaskStatus.COMPLETED) {
    return "✓";
  }
  if (
    status === CronTaskStatus.FAILED ||
    status === CronTaskStatus.ERROR ||
    status === CronTaskStatus.TIMEOUT
  ) {
    return "✗";
  }
  return "~";
}

// ---------------------------------------------------------------------------
// Render functions
// ---------------------------------------------------------------------------

function renderCli(value: TaskExecuteResponseOutput): string {
  const lines: string[] = [];
  const isSuccess = value.success === true;
  const status = value.status;
  const icon = statusIcon(status);

  const iconColored = isSuccess ? chalk.green(icon) : chalk.red(icon);

  const header = `${iconColored} ${isSuccess ? chalk.bold.green("Task Executed Successfully") : chalk.bold.red("Task Execution Failed")}`;
  lines.push(header);
  lines.push("");

  if (value.taskName) {
    lines.push(`${chalk.dim("Task")}      ${chalk.bold(value.taskName)}`);
  }
  if (value.taskId) {
    lines.push(`${chalk.dim("ID")}        ${chalk.cyan(value.taskId)}`);
  }
  if (status) {
    const statusColored = isSuccess ? chalk.green(status) : chalk.red(status);
    lines.push(`${chalk.dim("Status")}    ${statusColored}`);
  }
  if (value.duration !== undefined && value.duration !== null) {
    lines.push(
      `${chalk.dim("Duration")}  ${chalk.yellow(formatDuration(value.duration))}`,
    );
  }
  if (value.executedAt) {
    lines.push(`${chalk.dim("Executed")}  ${formatDate(value.executedAt)}`);
  }
  if (value.message) {
    lines.push("");
    lines.push(chalk.dim(value.message));
  }

  return lines.join("\n");
}

function renderMcp(value: TaskExecuteResponseOutput): string {
  const lines: string[] = [];
  const isSuccess = value.success === true;
  const status = value.status;

  lines.push(
    isSuccess ? "Task executed successfully." : "Task execution failed.",
  );

  if (value.taskName) {
    lines.push(`Task: ${value.taskName}`);
  }
  if (value.taskId) {
    lines.push(`ID: ${value.taskId}`);
  }
  if (status) {
    lines.push(`Status: ${status}`);
  }
  if (value.duration !== undefined && value.duration !== null) {
    lines.push(`Duration: ${formatDuration(value.duration)}`);
  }
  if (value.executedAt) {
    lines.push(`Executed: ${formatDate(value.executedAt)}`);
  }
  if (value.message) {
    lines.push(`Message: ${value.message}`);
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

export function TaskExecuteContainer({ field }: CliWidgetProps): JSX.Element {
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

TaskExecuteContainer.cliWidget = true as const;
