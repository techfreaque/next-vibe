/**
 * Vibe Stage Widget
 *
 * Displays the result of the auto-stage operation across all platforms:
 * - Web: rich result cards with staged/skipped file lists, submit form
 * - CLI: inline list with +/! prefixes, full data expanded
 * - MCP: compact one-line-per-file format
 */

"use client";

import {
  CheckCircle2,
  GitBranch,
  GitMerge,
  Loader2,
  SkipForward,
} from "lucide-react";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";
import {
  useWidgetEndpointMutations,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";

import type definition from "./definition";

// ============================================================
// Sub-components
// ============================================================

type FileRowVariant = "staged" | "partial" | "skipped";

const FILE_ROW_SIGIL: Record<FileRowVariant, string> = {
  staged: "+",
  partial: "~",
  skipped: "!",
};

const FILE_ROW_SIGIL_CLASS: Record<FileRowVariant, string> = {
  staged:
    "text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold w-4 shrink-0",
  partial:
    "text-blue-600 dark:text-blue-400 font-mono text-xs font-bold w-4 shrink-0",
  skipped:
    "text-amber-600 dark:text-amber-400 font-mono text-xs font-bold w-4 shrink-0",
};

const FILE_ROW_BADGE_CLASS: Record<FileRowVariant, string> = {
  staged:
    "text-xs shrink-0 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-0",
  partial:
    "text-xs shrink-0 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-0",
  skipped:
    "text-xs shrink-0 border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400",
};

function FileRow({
  path,
  variant,
  label,
}: {
  path: string;
  variant: FileRowVariant;
  label: string;
}): React.JSX.Element {
  return (
    <Div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/40 border border-border/50">
      <Span className={FILE_ROW_SIGIL_CLASS[variant]}>
        {FILE_ROW_SIGIL[variant]}
      </Span>
      <Span className="font-mono text-xs text-foreground/80 flex-1 break-all">
        {path}
      </Span>
      <Badge
        variant={variant === "skipped" ? "outline" : "default"}
        className={FILE_ROW_BADGE_CLASS[variant]}
      >
        {label}
      </Badge>
    </Div>
  );
}

function FileSection({
  title,
  files,
  variant,
  fileLabel,
  icon,
}: {
  title: string;
  files: string[];
  variant: FileRowVariant;
  fileLabel: string;
  icon: React.ReactNode;
}): React.JSX.Element {
  if (files.length === 0) {
    return <Div />;
  }
  return (
    <Div className="flex flex-col gap-2">
      <Div className="flex items-center gap-2">
        {icon}
        <Span className="text-sm font-semibold">
          {title}{" "}
          <Span className="text-muted-foreground font-normal">
            ({String(files.length)})
          </Span>
        </Span>
      </Div>
      <Div className="flex flex-col gap-1">
        {files.map((f) => (
          <FileRow key={f} path={f} variant={variant} label={fileLabel} />
        ))}
      </Div>
    </Div>
  );
}

function EmptyState({ hint }: { hint: string }): React.JSX.Element {
  return (
    <Div className="py-12 flex flex-col items-center gap-3 border border-dashed rounded-lg text-center">
      <GitBranch className="h-8 w-8 text-muted-foreground/50" />
      <Span className="text-sm font-medium text-muted-foreground">{hint}</Span>
    </Div>
  );
}

// ============================================================
// Main widget
// ============================================================

export function VibeStageWidget(): React.JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const platform = useWidgetPlatform();
  const { canGoBack, pop } = useWidgetNavigation();
  const endpointMutations = useWidgetEndpointMutations();

  const staged = data?.staged ?? [];
  const partiallyStaged = data?.partiallyStaged ?? [];
  const skipped = data?.skipped ?? [];
  const hasResult = data !== null && data !== undefined;
  const isEmpty =
    hasResult &&
    staged.length === 0 &&
    partiallyStaged.length === 0 &&
    skipped.length === 0;
  const isDryRun = hasResult && !!data.message?.includes("Dry run");
  const isLoading = endpointMutations?.read?.isLoading ?? false;

  // ── CLI / MCP ────────────────────────────────────────────
  if (platform === Platform.CLI || platform === Platform.MCP) {
    const isMcp = platform === Platform.MCP;

    if (!hasResult) {
      return (
        <Div>
          <Span>{t("widget.loading")}</Span>
        </Div>
      );
    }

    if (isEmpty) {
      return (
        <Div>
          <Span>{t("widget.noChanges")}</Span>
        </Div>
      );
    }

    const lines: string[] = [];

    if (isDryRun) {
      lines.push(`[${t("widget.dryRunBadge")}] ${t("widget.dryRunNote")}`);
      lines.push("");
    }

    if (staged.length > 0) {
      if (!isMcp) {
        lines.push(
          `${t("widget.staged")} (${String(staged.length)} ${t("widget.stagedCount")}):`,
        );
      }
      for (const f of staged) {
        lines.push(isMcp ? `+ ${f}` : `  + ${f}`);
      }
    }

    if (partiallyStaged.length > 0) {
      if (!isMcp && staged.length > 0) {
        lines.push("");
      }
      if (!isMcp) {
        lines.push(
          `${t("widget.partiallyStaged")} (${String(partiallyStaged.length)} ${t("widget.partiallyStaged_count")}):`,
        );
      }
      for (const f of partiallyStaged) {
        lines.push(isMcp ? `~ ${f}` : `  ~ ${f}`);
      }
    }

    if (skipped.length > 0) {
      if (!isMcp && (staged.length > 0 || partiallyStaged.length > 0)) {
        lines.push("");
      }
      if (!isMcp) {
        lines.push(
          `${t("widget.skipped")} (${String(skipped.length)} ${t("widget.skippedCount")}):`,
        );
      }
      for (const f of skipped) {
        lines.push(isMcp ? `! ${f}` : `  ! ${f}`);
      }
    }

    if (!isMcp) {
      lines.push("");
      const parts = [
        `${String(staged.length)} ${t("widget.stagedCount")}`,
        ...(partiallyStaged.length > 0
          ? [
              `${String(partiallyStaged.length)} ${t("widget.partiallyStaged_count")}`,
            ]
          : []),
        `${String(skipped.length)} ${t("widget.skippedCount")}`,
      ];
      lines.push(parts.join(", "));
    }

    return (
      <Div>
        {lines.map((line, i) => (
          <Span key={i}>{line || " "}</Span>
        ))}
      </Div>
    );
  }

  // ── Web ───────────────────────────────────────────────────
  return (
    <Div className="flex flex-col gap-6">
      {/* Back button */}
      {canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => pop()}
          className="self-start -ml-1"
        >
          {t("widget.title")}
        </Button>
      )}

      {/* Header */}
      <Div className="flex flex-col gap-1">
        <Div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-muted-foreground" />
          <Span className="text-lg font-semibold">{t("widget.title")}</Span>
        </Div>
        <Span className="text-sm text-muted-foreground">
          {t("widget.subtitle")}
        </Span>
      </Div>

      {/* Form */}
      <Div className="flex flex-col gap-3">
        <FormAlertWidget field={{}} />
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            text: "widget.submit",
            icon: "git-branch",
            variant: "primary",
          }}
        />
      </Div>

      {/* Loading state */}
      {isLoading && (
        <Div className="flex items-center gap-2 text-muted-foreground py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <Span className="text-sm">{t("widget.loading")}</Span>
        </Div>
      )}

      {/* Results */}
      {hasResult && !isLoading && (
        <Div className="flex flex-col gap-5">
          {/* Dry run notice */}
          {isDryRun && (
            <Div className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <Badge
                variant="outline"
                className="text-xs border-blue-400 text-blue-700 dark:border-blue-600 dark:text-blue-400"
              >
                {t("widget.dryRunBadge")}
              </Badge>
              <Span className="text-sm text-blue-700 dark:text-blue-400">
                {t("widget.dryRunNote")}
              </Span>
            </Div>
          )}

          {/* Empty state */}
          {isEmpty && <EmptyState hint={t("widget.noChangesHint")} />}

          {/* Staged files */}
          <FileSection
            title={t("widget.staged")}
            files={staged}
            variant="staged"
            fileLabel={t("widget.cleanFile")}
            icon={
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            }
          />

          {/* Partially staged files */}
          <FileSection
            title={t("widget.partiallyStaged")}
            files={partiallyStaged}
            variant="partial"
            fileLabel={t("widget.partialFile")}
            icon={
              <GitMerge className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            }
          />

          {/* Skipped files */}
          <FileSection
            title={t("widget.skipped")}
            files={skipped}
            variant="skipped"
            fileLabel={t("widget.violationsFile")}
            icon={
              <SkipForward className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            }
          />

          {/* Summary footer */}
          {!isEmpty && (
            <Div className="flex items-center gap-3 pt-2 border-t border-border flex-wrap">
              <Span className="text-xs text-muted-foreground">
                <Span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {String(staged.length)}
                </Span>{" "}
                {t("widget.stagedCount")}
              </Span>
              {partiallyStaged.length > 0 && (
                <Span className="text-xs text-muted-foreground">
                  <Span className="font-semibold text-blue-600 dark:text-blue-400">
                    {String(partiallyStaged.length)}
                  </Span>{" "}
                  {t("widget.partiallyStaged_count")}
                </Span>
              )}
              {skipped.length > 0 && (
                <Span className="text-xs text-muted-foreground">
                  <Span className="font-semibold text-amber-600 dark:text-amber-400">
                    {String(skipped.length)}
                  </Span>{" "}
                  {t("widget.skippedCount")}
                </Span>
              )}
              {!isDryRun &&
                (staged.length > 0 || partiallyStaged.length > 0) && (
                  <Badge
                    variant="default"
                    className="ml-auto text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-0"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {t("success.title")}
                  </Badge>
                )}
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}
