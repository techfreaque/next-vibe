/**
 * Shared Ink CLI components for code quality check widgets
 * Used by all check route widget.cli.ts files (oxlint, lint, typecheck, vibe-check)
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";
import terminalLink from "terminal-link";

import { scopedTranslation as unifiedInterfaceScopedTranslation } from "@/app/api/[locale]/system/unified-interface/i18n";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useInkWidgetLocale,
  useInkWidgetPlatform,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";
import { CliIcon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/cli-icons";

export interface CodeQualityItem {
  file: string;
  line?: number;
  column?: number;
  rule?: string;
  severity: "error" | "warning" | "info";
  message: string;
}

export interface FileStats {
  file: string;
  errors: number;
  warnings: number;
  total: number;
}

/**
 * Shared result shape for all code quality check responses.
 * Used by .cli.tsx widgets to avoid circular deps with definition.ts.
 * All check definitions produce this exact shape via their Zod schemas.
 */
export interface CodeQualityCheckResult {
  items: CodeQualityItem[] | null;
  files: FileStats[] | null;
  totalIssues: number;
  totalFiles: number;
  totalErrors?: number;
  displayedIssues?: number;
  displayedFiles?: number;
  editorUriSchema?: string;
}

function sortBySeverity(items: CodeQualityItem[]): CodeQualityItem[] {
  const severityOrder = { error: 0, warning: 1, info: 2 };
  return [...items].toSorted(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );
}

// ── Issue List ──────────────────────────────────────────────

export function CodeQualityIssueListCli({
  items,
  editorUriScheme,
}: {
  items: CodeQualityItem[] | null | undefined;
  editorUriScheme?: string;
}): JSX.Element {
  const locale = useInkWidgetLocale();
  const platform = useInkWidgetPlatform();
  const { t } = unifiedInterfaceScopedTranslation.scopedT(locale);
  const scheme = editorUriScheme || "vscode://file/";

  const groupedItems = useMemo(() => {
    const groups = new Map<string, CodeQualityItem[]>();
    if (!items) {
      return groups;
    }
    for (const item of items) {
      const existing = groups.get(item.file) || [];
      existing.push(item);
      groups.set(item.file, existing);
    }
    return groups;
  }, [items]);

  // MCP: plain text, no chalk/terminal-links
  if (platform === Platform.MCP) {
    if (!items || items.length === 0) {
      return <Text>{t("widgets.codeQualityList.noIssues")}</Text>;
    }
    const mcpLines: string[] = [];
    for (const [file, fileItems] of groupedItems.entries()) {
      const sorted = sortBySeverity(fileItems);
      mcpLines.push(
        `● ${file} (${fileItems.length} item${fileItems.length !== 1 ? "s" : ""})`,
      );
      for (const item of sorted) {
        const icon =
          item.severity === "error"
            ? "❌"
            : item.severity === "warning"
              ? "⚠️ "
              : "ℹ️ ";
        mcpLines.push(
          `  ${item.line ?? 1}:${item.column ?? 1} ${icon} ${item.severity} ${item.message}${item.rule ? ` [${item.rule}]` : ""}`,
        );
      }
      mcpLines.push("");
    }
    return (
      <Box flexDirection="column">
        <Text wrap="end">{mcpLines.join("\n")}</Text>
      </Box>
    );
  }

  // CLI: colored output with terminal links
  if (!items || items.length === 0) {
    return (
      <Box>
        <CliIcon icon="check-circle" color="green" />
        <Text color="green"> {t("widgets.codeQualityList.noIssues")}</Text>
      </Box>
    );
  }

  const outputLines: string[] = [];
  for (const [file, fileItems] of groupedItems.entries()) {
    const sorted = sortBySeverity(fileItems);
    outputLines.push(
      chalk.bold(
        `● ${chalk.underline(chalk.blue(file))} ${chalk.dim(`(${fileItems.length} item${fileItems.length !== 1 ? "s" : ""})`)}`,
      ),
    );
    for (const item of sorted) {
      const severityColor =
        item.severity === "error"
          ? chalk.red
          : item.severity === "warning"
            ? chalk.yellow
            : chalk.blue;
      const icon =
        item.severity === "error"
          ? "❌"
          : item.severity === "warning"
            ? "⚠️ "
            : "ℹ️ ";
      const absolutePath = item.file.startsWith("/")
        ? item.file
        : `${process.cwd()}/${item.file}`;
      const editorUrl = `${scheme}${absolutePath}:${item.line || 1}:${item.column || 1}`;
      const lineDisplay = `${item.line || 1}:${item.column || 1}`;
      const pathLineDisplay = `${item.file}:${item.line || 1}:${item.column || 1}`;
      const hyperlink = process.stdout.isTTY
        ? terminalLink(lineDisplay, editorUrl, {
            fallback: () => pathLineDisplay,
          })
        : pathLineDisplay;
      outputLines.push(
        `  ${chalk.blue(hyperlink)} ${severityColor(`${icon} ${item.severity}`)} ${item.message}${item.rule ? ` [${item.rule}]` : ""}`,
      );
    }
    outputLines.push("");
  }

  return (
    <Box flexDirection="column">
      <Text wrap="end">{outputLines.join("\n")}</Text>
    </Box>
  );
}

// ── Files List ──────────────────────────────────────────────

export function CodeQualityFilesListCli({
  files,
}: {
  files: FileStats[] | null | undefined;
}): JSX.Element {
  const locale = useInkWidgetLocale();
  const { t } = unifiedInterfaceScopedTranslation.scopedT(locale);

  const fileLines = useMemo(() => {
    if (!files || files.length === 0) {
      return [];
    }
    const lines: string[] = [];
    for (const fileEntry of files) {
      const parts = [`  ${chalk.blue(chalk.underline(fileEntry.file))}`];
      if (fileEntry.errors > 0) {
        parts.push(
          chalk.red(
            `${fileEntry.errors} error${fileEntry.errors !== 1 ? "s" : ""}`,
          ),
        );
      }
      if (fileEntry.warnings > 0) {
        parts.push(
          chalk.yellow(
            `${fileEntry.warnings} warning${fileEntry.warnings !== 1 ? "s" : ""}`,
          ),
        );
      }
      if (
        fileEntry.errors === 0 &&
        fileEntry.warnings === 0 &&
        fileEntry.total > 0
      ) {
        parts.push(
          chalk.dim(
            `${fileEntry.total} issue${fileEntry.total !== 1 ? "s" : ""}`,
          ),
        );
      }
      lines.push(parts.join(" "));
    }
    return lines;
  }, [files]);

  if (!files || files.length === 0) {
    return <Box />;
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold>{t("widgets.codeQualityFiles.affectedFiles")}</Text>
      <Text>{fileLines.join("\n")}</Text>
    </Box>
  );
}

// ── Summary ─────────────────────────────────────────────────

export function CodeQualitySummaryCli({
  totalIssues,
  totalFiles,
  totalErrors,
  displayedIssues,
  displayedFiles,
}: {
  totalIssues: number;
  totalFiles: number;
  totalErrors?: number;
  displayedIssues?: number;
  displayedFiles?: number;
}): JSX.Element {
  const locale = useInkWidgetLocale();
  const platform = useInkWidgetPlatform();
  const { t: globalT } = unifiedInterfaceScopedTranslation.scopedT(locale);

  // No summary needed when there are no issues
  if (totalIssues === 0 && totalFiles === 0) {
    return <Box />;
  }

  const filesDisplay =
    displayedFiles !== undefined && displayedFiles < totalFiles
      ? `${displayedFiles} ${globalT("widgets.codeQualitySummary.of")} ${totalFiles}`
      : String(totalFiles);

  const issuesDisplay =
    displayedIssues !== undefined && displayedIssues < totalIssues
      ? `${displayedIssues} ${globalT("widgets.codeQualitySummary.of")} ${totalIssues}`
      : String(totalIssues);

  if (platform === Platform.MCP) {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text>{globalT("widgets.codeQualitySummary.summary")}</Text>
        {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Separator */}
        <Text>──────────────────────────────────────────────────</Text>
        <Box flexDirection="column">
          <Text>
            {globalT("widgets.codeQualitySummary.files")}: {filesDisplay}
          </Text>
          <Text>
            {globalT("widgets.codeQualitySummary.issues")}: {issuesDisplay}
          </Text>
          {totalErrors !== undefined && totalErrors > 0 && (
            <Text>
              {globalT("widgets.codeQualitySummary.errors")}: {totalErrors}
            </Text>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1} paddingX={1}>
      <Box>
        <CliIcon icon="bar-chart" />
        <Text bold> {globalT("widgets.codeQualitySummary.summary")}</Text>
      </Box>
      {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Separator */}
      <Text>──────────────────────────────────────────────────</Text>
      <Box flexDirection="column">
        <Box>
          <CliIcon icon="folder" />
          <Text>
            {" "}
            {globalT("widgets.codeQualitySummary.files")}: {filesDisplay}
          </Text>
        </Box>
        <Box>
          <CliIcon icon="alert" />
          <Text>
            {"  "}
            {globalT("widgets.codeQualitySummary.issues")}: {issuesDisplay}
          </Text>
        </Box>
        {totalErrors !== undefined && totalErrors > 0 && (
          <Box>
            <CliIcon icon="x-circle" color="red" />
            <Text color="red">
              {" "}
              {globalT("widgets.codeQualitySummary.errors")}: {totalErrors}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
