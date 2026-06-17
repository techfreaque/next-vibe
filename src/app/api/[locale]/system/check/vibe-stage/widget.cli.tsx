/**
 * Vibe Stage CLI/MCP Widget
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import {
  useWidgetLocale,
  useWidgetPlatform,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";

import type { VibeStageResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

// ── Config ────────────────────────────────────────────────────

/** Max files to show before collapsing into a count */
const MAX_SHOW = 30;

/** Strip common path prefix so output is scannable */
function shortenPath(p: string): string {
  return p
    .replace(/^src\/app\/api\/\[locale\]\//, "api/")
    .replace(/^src\/app\/\[locale\]\//, "app/");
}

// ── Props ─────────────────────────────────────────────────────

interface CliWidgetProps {
  field: {
    value: VibeStageResponseOutput | null | undefined;
  };
  fieldName: string;
}

// ── Component ─────────────────────────────────────────────────

export function VibeStageWidget({ field }: CliWidgetProps): JSX.Element {
  const value = field.value;
  const platform = useWidgetPlatform();
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const isMcp = platform === Platform.MCP;

  if (!value) {
    return <Box />;
  }

  const staged = value.staged ?? [];
  const skipped = value.skipped ?? [];
  const isDryRun = !!value.message;
  const isEmpty = staged.length === 0 && skipped.length === 0;

  // ── MCP: compact, no ANSI ──────────────────────────────────
  if (isMcp) {
    if (isEmpty) {
      return (
        <Box>
          <Text>{t("response.noChanges")}</Text>
        </Box>
      );
    }

    const lines: string[] = [];

    if (isDryRun) {
      lines.push(`[DRY RUN] ${value.message}`);
      lines.push("");
    }

    lines.push(
      `${String(staged.length)} ${t("widget.stagedCount")}, ${String(skipped.length)} ${t("widget.skippedCount")}`,
    );

    if (staged.length > 0) {
      lines.push("");
      lines.push(`${t("widget.staged")}:`);
      for (const f of staged) {
        lines.push(`+ ${f}`);
      }
    }

    if (skipped.length > 0) {
      lines.push("");
      lines.push(`${t("widget.skipped")}:`);
      for (const f of skipped) {
        lines.push(`! ${f}`);
      }
    }

    return (
      <Box flexDirection="column">
        <Text wrap="truncate-end">{lines.join("\n")}</Text>
      </Box>
    );
  }

  // ── CLI: colored, human-readable ──────────────────────────
  if (isEmpty) {
    return (
      <Box flexDirection="column" marginTop={1}>
        <Text color="yellow">{t("widget.noChanges")}</Text>
        <Text dimColor>{t("widget.noChangesHint")}</Text>
      </Box>
    );
  }

  const renderFileList = (files: string[], prefix: string): string => {
    const shown = files.slice(0, MAX_SHOW);
    const rest = files.length - shown.length;
    const lines = shown.map(
      (f) =>
        `  ${prefix === "+" ? chalk.green(prefix) : chalk.yellow(prefix)} ${chalk.dim(shortenPath(f))}`,
    );
    if (rest > 0) {
      lines.push(`  ${chalk.dim(`... and ${String(rest)} more`)}`);
    }
    return lines.join("\n");
  };

  const parts: string[] = [];

  if (isDryRun) {
    parts.push(
      `${chalk.blue.bold("◆ DRY RUN")}${chalk.blue(` — ${value.message ?? t("widget.dryRunNote")}`)}`,
    );
    parts.push("");
  }

  // Summary line
  const stagedStr =
    staged.length > 0
      ? chalk.green.bold(`${String(staged.length)} ${t("widget.stagedCount")}`)
      : chalk.dim(`0 ${t("widget.stagedCount")}`);
  const skippedStr =
    skipped.length > 0
      ? chalk.yellow.bold(
          `${String(skipped.length)} ${t("widget.skippedCount")}`,
        )
      : chalk.dim(`0 ${t("widget.skippedCount")}`);
  parts.push(`${stagedStr}  ${skippedStr}`);

  if (staged.length > 0) {
    parts.push("");
    parts.push(chalk.green(`${t("widget.staged")}:`));
    parts.push(renderFileList(staged, "+"));
  }

  if (skipped.length > 0) {
    parts.push("");
    parts.push(chalk.yellow(`${t("widget.skipped")}:`));
    parts.push(renderFileList(skipped, "!"));
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text wrap="wrap">{parts.join("\n")}</Text>
    </Box>
  );
}

VibeStageWidget.cliWidget = true as const;
