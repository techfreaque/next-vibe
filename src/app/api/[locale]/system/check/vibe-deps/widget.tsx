"use client";

import { GitBranch, Loader2, PackageSearch } from "lucide-react";
import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import {
  useWidgetEndpointMutations,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";

import type definition from "./definition";

// ── Web sub-components ──────────────────────────────────────

function StatBadge({
  label,
  value,
  variant = "neutral",
}: {
  label: string;
  value: number;
  variant?: "neutral" | "warn" | "success";
}): React.JSX.Element {
  const cls =
    variant === "warn"
      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-0"
      : variant === "success"
        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-0"
        : "bg-muted text-muted-foreground border-0";

  return (
    <Div className="flex flex-col items-center gap-0.5">
      <Span
        className={`text-lg font-bold tabular-nums ${variant === "warn" ? "text-amber-600 dark:text-amber-400" : variant === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}
      >
        {String(value)}
      </Span>
      <Badge variant="outline" className={`text-xs ${cls}`}>
        {label}
      </Badge>
    </Div>
  );
}

function EntryCard({
  path,
  importCount,
  importedByCount,
  isUnused,
  importedBy,
  importedByLabel,
}: {
  path: string;
  importCount: number;
  importedByCount: number;
  isUnused: boolean;
  importedBy: string[];
  importedByLabel: string;
}): React.JSX.Element {
  const sigil = isUnused ? "!" : importedByCount > 50 ? "★" : "·";
  const sigilClass = isUnused
    ? "text-amber-500 dark:text-amber-400"
    : importedByCount > 50
      ? "text-purple-500 dark:text-purple-400"
      : "text-emerald-500 dark:text-emerald-400";

  return (
    <Div className="flex flex-col gap-2 px-3 py-2.5 rounded-md bg-muted/40 border border-border/50">
      <Div className="flex items-center gap-2">
        <Span
          className={`font-mono text-xs font-bold w-3 shrink-0 ${sigilClass}`}
        >
          {sigil}
        </Span>
        <Span className="font-mono text-xs text-foreground/90 flex-1 break-all">
          {path}
        </Span>
        <Div className="flex items-center gap-2 shrink-0">
          <Span className="text-xs text-muted-foreground">
            <Span className="font-semibold text-foreground tabular-nums">
              {String(importedByCount)}
            </Span>{" "}
            in
          </Span>
          <Span className="text-xs text-muted-foreground">
            <Span className="font-semibold text-foreground tabular-nums">
              {String(importCount)}
            </Span>{" "}
            out
          </Span>
        </Div>
      </Div>

      {importedBy.length > 0 && importedBy.length <= 5 && (
        <Div className="flex flex-col gap-0.5 pl-5">
          {importedBy.map((dep) => (
            <Span
              key={dep}
              className="font-mono text-xs text-muted-foreground/70"
            >
              {importedByLabel} {dep}
            </Span>
          ))}
        </Div>
      )}
    </Div>
  );
}

function EmptyState({ label }: { label: string }): React.JSX.Element {
  return (
    <Div className="py-12 flex flex-col items-center gap-3 border border-dashed rounded-lg text-center">
      <PackageSearch className="h-8 w-8 text-muted-foreground/50" />
      <Span className="text-sm font-medium text-muted-foreground">{label}</Span>
    </Div>
  );
}

// ── Main widget ─────────────────────────────────────────────

export function VibeDepsWidget(): React.JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const platform = useWidgetPlatform();
  const endpointMutations = useWidgetEndpointMutations();

  const entries = data?.entries ?? [];
  const totalFiles = data?.totalFiles ?? 0;
  const totalEdges = data?.totalEdges ?? 0;
  const unusedCount = data?.unusedCount ?? 0;
  const hasResult = data !== null && data !== undefined;
  const isLoading = endpointMutations?.read?.isLoading ?? false;

  // ── CLI ───────────────────────────────────────────────────
  if (platform === Platform.CLI) {
    if (!hasResult) {
      return (
        <Div>
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "title", icon: "git-branch", variant: "primary" }}
          />
        </Div>
      );
    }

    const lines: string[] = [];

    // Header
    lines.push(
      `${String(totalFiles)} files  ${String(totalEdges)} edges  ${String(unusedCount)} unused`,
    );
    lines.push("");

    if (entries.length === 0) {
      lines.push(t("response.entries.emptyState.description"));
    } else {
      // Column header
      lines.push(
        `${"".padEnd(6)}  ${"in".padEnd(5)}  ${"out".padEnd(5)}  path`,
      );
      lines.push(
        `${"─".repeat(6)}  ${"─".repeat(5)}  ${"─".repeat(5)}  ${"─".repeat(40)}`,
      );
      for (const e of entries) {
        const sigil = e.isUnused ? "!" : e.importedByCount > 50 ? "★" : " ";
        const inCol = String(e.importedByCount).padStart(5);
        const outCol = String(e.importCount).padStart(5);
        lines.push(`${sigil.padEnd(6)}  ${inCol}  ${outCol}  ${e.path}`);
      }
      lines.push("");
      lines.push(
        `! = no importers  ★ = hot (50+ importers)  in = used by  out = imports`,
      );
    }

    return (
      <Div>
        {lines.map((line, i) => (
          <Span key={i}>{line || " "}</Span>
        ))}
      </Div>
    );
  }

  // ── MCP ───────────────────────────────────────────────────
  if (platform === Platform.MCP) {
    if (!hasResult) {
      return (
        <Div>
          <Span>{t("title")}</Span>
        </Div>
      );
    }

    const lines: string[] = [
      `files:${String(totalFiles)} edges:${String(totalEdges)} unused:${String(unusedCount)}`,
    ];

    for (const e of entries) {
      const sigil = e.isUnused ? "!" : e.importedByCount > 50 ? "★" : " ";
      lines.push(
        `${sigil} in:${String(e.importedByCount)} out:${String(e.importCount)} ${e.path}`,
      );
    }

    return (
      <Div>
        {lines.map((line, i) => (
          <Span key={i}>{line}</Span>
        ))}
      </Div>
    );
  }

  // ── Web ───────────────────────────────────────────────────
  return (
    <Div className="flex flex-col gap-6">
      {/* Header */}
      <Div className="flex flex-col gap-1">
        <Div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-muted-foreground" />
          <Span className="text-lg font-semibold">{t("title")}</Span>
        </Div>
        <Span className="text-sm text-muted-foreground">
          {t("container.description")}
        </Span>
      </Div>

      {/* Form */}
      <Div className="flex flex-col gap-3">
        <FormAlertWidget field={{}} />
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "title", icon: "git-branch", variant: "primary" }}
        />
      </Div>

      {/* Loading */}
      {isLoading && (
        <Div className="flex items-center gap-2 text-muted-foreground py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <Span className="text-sm">{t("response.success")}</Span>
        </Div>
      )}

      {/* Results */}
      {hasResult && !isLoading && (
        <Div className="flex flex-col gap-5">
          {/* Stats row */}
          <Div className="flex items-start py-3 px-4 rounded-lg bg-muted/30 border border-border/50">
            <Div className="flex-1 flex justify-center">
              <StatBadge
                label={t("response.summary.totalFiles")}
                value={totalFiles}
                variant="neutral"
              />
            </Div>
            <Div className="w-px self-stretch bg-border/50" />
            <Div className="flex-1 flex justify-center">
              <StatBadge
                label={t("response.summary.totalEdges")}
                value={totalEdges}
                variant="success"
              />
            </Div>
            <Div className="w-px self-stretch bg-border/50" />
            <Div className="flex-1 flex justify-center">
              <StatBadge
                label={t("response.summary.unusedCount")}
                value={unusedCount}
                variant="warn"
              />
            </Div>
          </Div>

          {/* Entry list */}
          {entries.length === 0 ? (
            <EmptyState label={t("response.entries.emptyState.description")} />
          ) : (
            <Div className="flex flex-col gap-1">
              {entries.map((e) => (
                <EntryCard
                  key={e.path}
                  path={e.path}
                  importCount={e.importCount}
                  importedByCount={e.importedByCount}
                  isUnused={e.isUnused}
                  importedBy={e.importedBy}
                  importedByLabel={t("response.entries.importedBy")}
                />
              ))}
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}
