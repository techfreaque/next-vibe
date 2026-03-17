/**
 * Rebuild Widget (CLI/MCP)
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useInkWidgetPlatform,
  useInkWidgetResponseOnly,
  useInkWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { RebuildResponseOutput } from "./definition";
import type endpoints from "./definition";

interface CliWidgetProps {
  field: {
    value: RebuildResponseOutput | null | undefined;
  };
  fieldName: string;
}

function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60_000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  const m = Math.floor(ms / 60_000);
  const s = Math.round((ms % 60_000) / 1000);
  return `${m}m ${s}s`;
}

export function RebuildWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useInkWidgetPlatform();
  const responseOnly = useInkWidgetResponseOnly();
  const t = useInkWidgetTranslation<typeof endpoints.POST>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  const durationStr = formatDuration(value.duration);
  const steps = value.steps ?? [];
  const hasErrors = value.errors && value.errors.length > 0;
  const allOk = !hasErrors && steps.every((s) => s.ok || s.skipped);

  // ── MCP: compact plain text ──────────────────────────────────────────────
  if (isMcp) {
    const lines: string[] = [
      allOk
        ? `${t("post.widget.rebuildComplete")} (${durationStr})`
        : `${t("post.widget.rebuildFailed")} (${durationStr})`,
    ];
    for (const step of steps) {
      const icon = step.skipped ? "-" : step.ok ? "ok" : "FAILED";
      const dur =
        step.durationMs > 0 ? ` (${formatDuration(step.durationMs)})` : "";
      lines.push(`  ${icon}  ${step.label}${dur}`);
    }
    if (hasErrors) {
      lines.push("");
      for (const err of value.errors!) {
        lines.push(`  ERROR: ${err}`);
      }
    }
    return (
      <Box flexDirection="column">
        <Text wrap="end">{lines.join("\n")}</Text>
      </Box>
    );
  }

  // ── CLI: colored output ──────────────────────────────────────────────────
  const skippedLabel = t("post.widget.skipped");
  const stepLines = steps.map((step) => {
    const dur =
      step.durationMs > 0
        ? chalk.dim(` (${formatDuration(step.durationMs)})`)
        : "";
    if (step.skipped) {
      return `  ${chalk.dim("-")} ${chalk.dim(`${step.label} (${skippedLabel})`)}${dur}`;
    }
    return step.ok
      ? `  ${chalk.green("✓")} ${chalk.white(step.label)}${dur}`
      : `  ${chalk.red("✗")} ${chalk.red(step.label)}${dur}`;
  });

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={1}>
        <Text bold color={allOk ? "green" : "red"}>
          {allOk
            ? t("post.widget.rebuildComplete")
            : t("post.widget.rebuildFailed")}
        </Text>
        <Text dimColor>({durationStr})</Text>
      </Box>

      {steps.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text wrap="end">{stepLines.join("\n")}</Text>
        </Box>
      )}

      {hasErrors && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold color="red">
            {t("post.widget.errors")}
          </Text>
          {value.errors!.map((err, i) => (
            <Text key={i} color="red" wrap="end">
              {"  "}
              {err}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
}

RebuildWidget.cliWidget = true as const;
