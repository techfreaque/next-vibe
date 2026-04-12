/**
 * Shared React web components for code quality check widgets
 * Used by all check route widget.tsx files (oxlint, lint, typecheck, vibe-check)
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { ExternalLink } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { H3 } from "next-vibe-ui/ui/typography";
import { useMemo } from "react";

import { scopedTranslation as unifiedInterfaceScopedTranslation } from "@/app/api/[locale]/system/unified-interface/i18n";
import { useWidgetLocale } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

interface CodeQualityItem {
  file: string;
  line?: number;
  column?: number;
  rule?: string;
  severity: "error" | "warning" | "info";
  message: string;
}

interface FileStats {
  file: string;
  errors: number;
  warnings: number;
  total: number;
}

// ── Issue List ──────────────────────────────────────────────

export function CodeQualityIssueList({
  items,
  editorUriScheme,
}: {
  items: CodeQualityItem[] | null | undefined;
  editorUriScheme?: string;
}): React.JSX.Element {
  const locale = useWidgetLocale();
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

  if (!items || items.length === 0) {
    return (
      <Div className="text-success">
        {t("widgets.codeQualityList.noIssues")}
      </Div>
    );
  }

  return (
    <Div className="space-y-4">
      {[...groupedItems.entries()].map(([file, fileItems]) => (
        <Div key={file} className="space-y-2">
          <Div className="font-bold">
            {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Visual marker */}
            <Span className="text-primary underline">● {file}</Span>
            <Span className="ml-2 text-gray-500">
              ({fileItems.length} item{fileItems.length !== 1 ? "s" : ""})
            </Span>
          </Div>
          <Div className="ml-4 space-y-1">
            {fileItems.map((item, idx) => {
              const severityColor =
                item.severity === "error"
                  ? "text-destructive"
                  : item.severity === "warning"
                    ? "text-warning"
                    : "text-primary";

              const icon =
                item.severity === "error"
                  ? "❌"
                  : item.severity === "warning"
                    ? "⚠️"
                    : "ℹ️";

              const absolutePath = item.file.startsWith("/")
                ? item.file
                : `${process.cwd()}/${item.file}`;
              const editorUrl = `${scheme}${absolutePath}:${item.line || 1}:${item.column || 1}`;

              return (
                <Div key={idx} className="text-sm">
                  <ExternalLink
                    href={editorUrl}
                    className="text-primary hover:underline"
                  >
                    {item.line || 1}:{item.column || 1}
                  </ExternalLink>
                  <Span className={`ml-2 ${severityColor}`}>
                    {icon} {item.severity}
                  </Span>
                  <Span className="ml-2">{item.message}</Span>
                  {item.rule && (
                    <Span className="ml-1 text-gray-500">[{item.rule}]</Span>
                  )}
                </Div>
              );
            })}
          </Div>
        </Div>
      ))}
    </Div>
  );
}

// ── Files List ──────────────────────────────────────────────

export function CodeQualityFilesList({
  files,
}: {
  files: FileStats[] | null | undefined;
}): React.JSX.Element {
  const locale = useWidgetLocale();
  const { t } = unifiedInterfaceScopedTranslation.scopedT(locale);

  if (!Array.isArray(files) || files.length === 0) {
    return <></>;
  }

  return (
    <Div className="mt-4 space-y-2">
      <H3 className="text-sm font-semibold">
        {t("widgets.codeQualityFiles.affectedFiles")}
      </H3>
      <Div className="space-y-1">
        {files.map((fileEntry, idx) => (
          <Div key={idx} className="flex items-center gap-2 text-sm">
            <Span className="font-mono text-primary underline">
              {fileEntry.file}
            </Span>
            {fileEntry.errors > 0 && (
              <Span className="text-destructive">
                {fileEntry.errors} error{fileEntry.errors !== 1 ? "s" : ""}
              </Span>
            )}
            {fileEntry.warnings > 0 && (
              <Span className="text-warning">
                {fileEntry.warnings} warning
                {fileEntry.warnings !== 1 ? "s" : ""}
              </Span>
            )}
            {fileEntry.errors === 0 &&
              fileEntry.warnings === 0 &&
              fileEntry.total > 0 && (
                <Span className="text-gray-500">
                  {fileEntry.total} issue{fileEntry.total !== 1 ? "s" : ""}
                </Span>
              )}
          </Div>
        ))}
      </Div>
    </Div>
  );
}

// ── Summary ─────────────────────────────────────────────────

export function CodeQualitySummary({
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
}): React.JSX.Element {
  const locale = useWidgetLocale();
  const { t: widgetT } = unifiedInterfaceScopedTranslation.scopedT(locale);

  const filesDisplay =
    displayedFiles !== undefined && displayedFiles < totalFiles
      ? `${displayedFiles} ${widgetT("widgets.codeQualitySummary.of")} ${totalFiles}`
      : totalFiles;

  const issuesDisplay =
    displayedIssues !== undefined && displayedIssues < totalIssues
      ? `${displayedIssues} ${widgetT("widgets.codeQualitySummary.of")} ${totalIssues}`
      : totalIssues;

  return (
    <Div className="mt-4 space-y-2 rounded border p-4">
      <H3 className="text-sm font-semibold">
        {widgetT("widgets.codeQualitySummary.summary")}
      </H3>
      <Div className="border-t pt-2 text-sm">
        <Div className="space-y-1">
          <Div>
            <Span>{widgetT("widgets.codeQualitySummary.files")}: </Span>
            <Span className="font-semibold">{filesDisplay}</Span>
          </Div>
          <Div>
            <Span>{widgetT("widgets.codeQualitySummary.issues")}: </Span>
            <Span className="font-semibold">{issuesDisplay}</Span>
          </Div>
          {totalErrors !== undefined && totalErrors > 0 && (
            <Div>
              <Span>{widgetT("widgets.codeQualitySummary.errors")}: </Span>
              <Span className="font-semibold text-destructive">
                {totalErrors}
              </Span>
            </Div>
          )}
        </Div>
      </Div>
    </Div>
  );
}
