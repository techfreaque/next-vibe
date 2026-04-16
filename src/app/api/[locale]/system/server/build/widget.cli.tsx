/**
 * Build Widget (CLI/MCP)
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { BuildResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: BuildResponseOutput | null | undefined;
  };
  fieldName: string;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  const m = Math.floor(ms / 60_000);
  const s = Math.round((ms % 60_000) / 1000);
  return `${m}m ${s}s`;
}

export function BuildResultWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  const durationStr = formatDuration(value.duration);
  const steps = value.steps ?? [];
  const hasErrors = value.errors && value.errors.length > 0;

  // ── MCP: compact plain text ──────────────────────────────────────────────
  if (isMcp) {
    const lines: string[] = [
      value.success
        ? `✓ Build complete (${durationStr})`
        : `✗ Build FAILED (${durationStr})`,
    ];
    for (const step of steps) {
      const icon = step.skipped ? "–" : step.ok ? "✓" : "✗";
      const suffix = step.skipped ? " (skipped)" : "";
      lines.push(`  ${icon} ${step.label}${suffix}`);
    }
    if (hasErrors) {
      for (const err of value.errors!) {
        lines.push(`  ERROR: ${err}`);
      }
    }
    return (
      <Box flexDirection="column">
        <Text wrap="truncate-end">{lines.join("\n")}</Text>
      </Box>
    );
  }

  // ── CLI: colored output ──────────────────────────────────────────────────
  const stepLines = steps.map((step) => {
    if (step.skipped) {
      return `  ${chalk.dim("–")} ${chalk.dim(step.label + " (skipped)")}`;
    }
    return step.ok
      ? `  ${chalk.green("✓")} ${chalk.white(step.label)}`
      : `  ${chalk.red("✗")} ${chalk.red(step.label)}`;
  });

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={1}>
        <Text bold color={value.success ? "green" : "red"}>
          {value.success ? "✅ Build complete" : "❌ Build failed"}
        </Text>
        <Text dimColor>({durationStr})</Text>
      </Box>

      {steps.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text wrap="truncate-end">{stepLines.join("\n")}</Text>
        </Box>
      )}

      {hasErrors && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold color="red">
            Errors:
          </Text>
          {value.errors!.map((err, i) => (
            <Text key={i} color="red" wrap="truncate-end">
              {"  "}
              {err}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
}

BuildResultWidget.cliWidget = true as const;
