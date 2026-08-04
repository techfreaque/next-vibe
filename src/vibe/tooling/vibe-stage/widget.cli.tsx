/**
 * Vibe Stage CLI/MCP Widget
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "../../platforms/platforms";
import {
  useWidgetLocale,
  useWidgetPlatform,
} from "../../unified-ui/_shared/use-widget-context";
import type { VibeStageResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

// ── Config ────────────────────────────────────────────────────

/** Max files to show before collapsing into a count */
const MAX_SHOW = 30;

/** Strip common path prefix so output is scannable */
function shortenPath(p: string): string {
  return p
    .replace(/^src\/vibe\//, "vibe/")
    .replace(/^src\/_pages\//, "pages/")
    .replace(/^src\//, "");
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
  const partiallyStaged = value.partiallyStaged ?? [];
  const renamed = value.renamed ?? [];
  const deleted = value.deleted ?? [];
  const isDryRun = !!value.message;
  const isEmpty =
    staged.length === 0 &&
    skipped.length === 0 &&
    partiallyStaged.length === 0 &&
    renamed.length === 0 &&
    deleted.length === 0;

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

    if (partiallyStaged.length > 0) {
      lines.push("");
      lines.push(`${t("widget.partiallyStaged")}:`);
      for (const f of partiallyStaged) {
        lines.push(`~ ${f}`);
      }
    }

    if (renamed.length > 0) {
      lines.push("");
      lines.push(`${t("widget.renamed")}:`);
      for (const f of renamed) {
        lines.push(`» ${f}`);
      }
    }

    if (deleted.length > 0) {
      lines.push("");
      lines.push(`${t("widget.deleted")}:`);
      for (const f of deleted) {
        lines.push(`- ${f}`);
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

  const colorFor = (prefix: string): ((s: string) => string) => {
    switch (prefix) {
      case "+":
        return chalk.green;
      case "~":
        return chalk.blue;
      case "»":
        return chalk.magenta;
      case "-":
        return chalk.red;
      default:
        return chalk.yellow;
    }
  };

  const renderFileList = (files: string[], prefix: string): string => {
    const shown = files.slice(0, MAX_SHOW);
    const rest = files.length - shown.length;
    const paint = colorFor(prefix);
    // Rename entries are "old -> new" — shorten both sides, keep the arrow.
    const shortenEntry = (f: string): string =>
      f.includes(" -> ")
        ? f
            .split(" -> ")
            .map((p) => shortenPath(p))
            .join(" -> ")
        : shortenPath(f);
    const lines = shown.map(
      (f) => `  ${paint(prefix)} ${chalk.dim(shortenEntry(f))}`,
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
  const summaryExtra: string[] = [];
  if (partiallyStaged.length > 0) {
    summaryExtra.push(
      chalk.blue.bold(
        `${String(partiallyStaged.length)} ${t("widget.partiallyStaged_count")}`,
      ),
    );
  }
  if (renamed.length > 0) {
    summaryExtra.push(
      chalk.magenta.bold(
        `${String(renamed.length)} ${t("widget.renamedCount")}`,
      ),
    );
  }
  if (deleted.length > 0) {
    summaryExtra.push(
      chalk.red.bold(`${String(deleted.length)} ${t("widget.deletedCount")}`),
    );
  }
  parts.push(
    [stagedStr, ...summaryExtra, skippedStr].filter(Boolean).join("  "),
  );

  if (staged.length > 0) {
    parts.push("");
    parts.push(chalk.green(`${t("widget.staged")}:`));
    parts.push(renderFileList(staged, "+"));
  }

  if (partiallyStaged.length > 0) {
    parts.push("");
    parts.push(chalk.blue(`${t("widget.partiallyStaged")}:`));
    parts.push(renderFileList(partiallyStaged, "~"));
  }

  if (renamed.length > 0) {
    parts.push("");
    parts.push(chalk.magenta(`${t("widget.renamed")}:`));
    parts.push(renderFileList(renamed, "»"));
  }

  if (deleted.length > 0) {
    parts.push("");
    parts.push(chalk.red(`${t("widget.deleted")}:`));
    parts.push(renderFileList(deleted, "-"));
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
