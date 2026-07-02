"use client";

import { GitBranch, Loader2, PackageSearch } from "lucide-react";
import { Platform } from "next-vibe/core/definition/platform";
import { Badge } from "next-vibe/ui/web/ui/badge";
import { Div } from "next-vibe/ui/web/ui/div";
import { Span } from "next-vibe/ui/web/ui/span";
import {
  useWidgetEndpointMutations,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";

import type definition from "./definition";

// ── Types mirrored from the response shape ──────────────────

type ViolationKind = "out-of-package" | "cross-package" | "reverse-direction";

interface Entry {
  path: string;
  imports: string[];
  importedBy: string[];
  importCount: number;
  importedByCount: number;
  isUnused: boolean;
  sourcePackage?: string;
  targetPackage?: string;
  violationKind?: ViolationKind;
  offenders?: string[];
  moveTo?: string;
  moveNote?: string;
  moveKind?: "reorganize" | "relocate";
  symbol?: string;
  symbolKind?: string;
  symbolOwner?: string;
}

interface Group {
  package: string;
  violationCount: number;
  entries: Entry[];
}

/** The strongly-typed translation function for this endpoint's scope. */
type TFn = ReturnType<typeof useWidgetTranslation<typeof definition.POST>>;

/** Raw entry as it arrives from the response schema (fields may be null). */
interface RawEntry {
  path: string;
  imports?: string[] | null;
  importedBy?: string[] | null;
  importCount?: number | null;
  importedByCount?: number | null;
  isUnused?: boolean | null;
  sourcePackage?: string | null;
  targetPackage?: string | null;
  violationKind?: ViolationKind | null;
  offenders?: string[] | null;
  moveTo?: string | null;
  moveNote?: string | null;
  moveKind?: "reorganize" | "relocate" | null;
  symbol?: string | null;
  symbolKind?: string | null;
  symbolOwner?: string | null;
}

interface RawGroup {
  package: string;
  violationCount: number;
  entries?: RawEntry[] | null;
}

function normEntry(e: RawEntry): Entry {
  return {
    path: e.path,
    imports: e.imports ?? [],
    importedBy: e.importedBy ?? [],
    importCount: e.importCount ?? 0,
    importedByCount: e.importedByCount ?? 0,
    isUnused: e.isUnused ?? false,
    sourcePackage: e.sourcePackage ?? undefined,
    targetPackage: e.targetPackage ?? undefined,
    violationKind: e.violationKind ?? undefined,
    offenders: e.offenders ?? undefined,
    moveTo: e.moveTo ?? undefined,
    moveNote: e.moveNote ?? undefined,
    moveKind: e.moveKind ?? undefined,
    symbol: e.symbol ?? undefined,
    symbolKind: e.symbolKind ?? undefined,
    symbolOwner: e.symbolOwner ?? undefined,
  };
}

function normGroup(g: RawGroup): Group {
  return {
    package: g.package,
    violationCount: g.violationCount,
    entries: (g.entries ?? []).map(normEntry),
  };
}

// ── Sigil maps (shared CLI + web) ───────────────────────────

const KIND_SIGIL: Record<ViolationKind, string> = {
  "out-of-package": "↑",
  "cross-package": "✗",
  "reverse-direction": "⇄",
};

const KIND_SIGIL_CLASS: Record<ViolationKind, string> = {
  "out-of-package":
    "text-amber-600 dark:text-amber-400 font-mono text-xs font-bold w-4 shrink-0",
  "cross-package":
    "text-red-600 dark:text-red-400 font-mono text-xs font-bold w-4 shrink-0",
  "reverse-direction":
    "text-fuchsia-600 dark:text-fuchsia-400 font-mono text-xs font-bold w-4 shrink-0",
};

const KIND_BADGE_CLASS: Record<ViolationKind, string> = {
  "out-of-package":
    "text-xs shrink-0 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-0",
  "cross-package":
    "text-xs shrink-0 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-0",
  "reverse-direction":
    "text-xs shrink-0 bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 border-0",
};

const HOT_THRESHOLD = 10;

function kindSigil(kind: ViolationKind | undefined, count: number): string {
  if (!kind) {
    return count >= HOT_THRESHOLD ? "★" : "·";
  }
  return KIND_SIGIL[kind];
}

function shortPath(path: string): string {
  // Drop the common "src/" prefix and collapse the [locale] segment for density.
  return path
    .replace(/^src\//, "")
    .replace("app/api/[locale]/", "")
    .replace("packages/next-vibe/ui/web/", "nvui/");
}

// ── Web sub-components ──────────────────────────────────────

function StatBadge({
  label,
  value,
  variant = "neutral",
}: {
  label: string;
  value: number;
  variant?: "neutral" | "warn" | "success" | "danger";
}): React.JSX.Element {
  const valueCls =
    variant === "warn"
      ? "text-amber-600 dark:text-amber-400"
      : variant === "danger"
        ? "text-red-600 dark:text-red-400"
        : variant === "success"
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-foreground";
  const badgeCls =
    variant === "warn"
      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-0"
      : variant === "danger"
        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-0"
        : variant === "success"
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-0"
          : "bg-muted text-muted-foreground border-0";

  return (
    <Div className="flex flex-col items-center gap-0.5">
      <Span className={`text-lg font-bold tabular-nums ${valueCls}`}>
        {String(value)}
      </Span>
      <Badge variant="outline" className={`text-xs ${badgeCls}`}>
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

function ViolationRow({ entry }: { entry: Entry }): React.JSX.Element {
  const kind = entry.violationKind;
  return (
    <Div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/40 border border-border/50">
      <Span
        className={
          kind
            ? KIND_SIGIL_CLASS[kind]
            : "text-purple-500 dark:text-purple-400 font-mono text-xs font-bold w-4 shrink-0"
        }
      >
        {kindSigil(kind, entry.importedByCount)}
      </Span>
      <Span className="font-mono text-xs text-foreground/90 flex-1 break-all">
        {shortPath(entry.path)}
      </Span>
      <Badge
        variant="outline"
        className="text-xs shrink-0 bg-muted text-muted-foreground border-0 tabular-nums"
      >
        {String(entry.importedByCount)}
      </Badge>
      {kind && (
        <Badge variant="default" className={KIND_BADGE_CLASS[kind]}>
          {kind}
        </Badge>
      )}
    </Div>
  );
}

function PackageCard({
  group,
  packageHeaderLabel,
}: {
  group: Group;
  packageHeaderLabel: string;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-2">
      <Div className="flex items-center gap-2">
        <PackageSearch className="h-4 w-4 text-muted-foreground" />
        <Span className="text-sm font-semibold">
          {packageHeaderLabel}{" "}
          <Span className="font-mono text-foreground">{group.package}</Span>{" "}
          <Span className="text-muted-foreground font-normal tabular-nums">
            ({String(group.violationCount)})
          </Span>
        </Span>
      </Div>
      <Div className="flex flex-col gap-1">
        {group.entries.map((e) => (
          <ViolationRow key={`${group.package}:${e.path}`} entry={e} />
        ))}
      </Div>
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

// ── CLI text builders ───────────────────────────────────────

function pad(s: string, n: number): string {
  return s.padEnd(n);
}

function buildBoundaryLines(
  groups: Group[],
  violations: { total: number },
  isMcp: boolean,
  t: TFn,
): string[] {
  const lines: string[] = [];
  if (groups.length === 0) {
    lines.push(t("response.boundaries.cleanState"));
    return lines;
  }
  for (const g of groups) {
    if (isMcp) {
      lines.push(`# ${g.package} (${String(g.violationCount)})`);
      for (const e of g.entries) {
        lines.push(
          `${kindSigil(e.violationKind, e.importedByCount)} ${String(e.importedByCount)} ${shortPath(e.path)}`,
        );
      }
      continue;
    }
    lines.push("");
    lines.push(
      `▸ ${g.package}  (${String(g.violationCount)} ${t("response.boundaries.colCount")})`,
    );
    lines.push(
      `  ${pad("", 2)}  ${pad(t("response.boundaries.colCount"), 6)}  ${t("response.boundaries.colTarget")}`,
    );
    lines.push(`  ${"─".repeat(2)}  ${"─".repeat(6)}  ${"─".repeat(40)}`);
    for (const e of g.entries) {
      lines.push(
        `  ${pad(kindSigil(e.violationKind, e.importedByCount), 2)}  ${String(e.importedByCount).padStart(6)}  ${shortPath(e.path)}`,
      );
    }
  }
  if (!isMcp) {
    lines.push("");
    lines.push(
      `${t("response.boundaries.legendTitle")}: ↑ ${t("response.boundaries.legendOut")}  ✗ ${t("response.boundaries.legendCross")}  ⇄ ${t("response.boundaries.legendReverse")}  ★ ${t("response.boundaries.legendHot")}`,
    );
    lines.push(
      `${String(violations.total)} ${t("response.boundaries.violationsAcross")} ${String(groups.length)} ${t("response.boundaries.packagesWord")}`,
    );
  }
  return lines;
}

function buildLayerLines(entries: Entry[], isMcp: boolean, t: TFn): string[] {
  if (entries.length === 0) {
    return [t("response.layers.cleanState")];
  }
  const lines: string[] = [];
  for (const e of entries) {
    const src = e.offenders?.[0] ?? "";
    const sigil = kindSigil(e.violationKind, e.importedByCount);
    if (isMcp) {
      lines.push(`${sigil} ${shortPath(src)} → ${shortPath(e.path)}`);
    } else {
      lines.push(
        `${sigil}  ${e.sourcePackage ?? "?"} → ${e.targetPackage ?? "?"}`,
      );
      lines.push(`   ${shortPath(src)}`);
      lines.push(`   ${t("response.layers.edge")} ${shortPath(e.path)}`);
    }
  }
  return lines;
}

function buildSharedCandidateLines(
  entries: Entry[],
  isMcp: boolean,
  t: TFn,
): string[] {
  if (entries.length === 0) {
    return [t("response.sharedCandidates.emptyState")];
  }
  const lines: string[] = [];
  if (!isMcp) {
    lines.push(
      `${pad(t("response.sharedCandidates.colCount"), 9)}  ${t("response.sharedCandidates.colPath")}`,
    );
    lines.push(`${"─".repeat(9)}  ${"─".repeat(50)}`);
  }
  for (const e of entries) {
    lines.push(
      isMcp
        ? `${String(e.importedByCount)} ${shortPath(e.path)}`
        : `${String(e.importedByCount).padStart(9)}  ${shortPath(e.path)}`,
    );
  }
  return lines;
}

function buildImporterLines(entries: Entry[], isMcp: boolean): string[] {
  const lines: string[] = [];
  for (const e of entries) {
    lines.push(
      isMcp
        ? `${String(e.importedByCount)} ${e.path}`
        : `  ${String(e.importedByCount).padStart(5)}  ${e.path}`,
    );
  }
  return lines;
}

function buildNeedsMoveLines(
  entries: Entry[],
  isMcp: boolean,
  t: TFn,
): string[] {
  if (entries.length === 0) {
    return [t("response.needsMove.emptyState")];
  }
  const lines: string[] = [];
  // Category headers so the two issue kinds are visually separated. colocate
  // (→) = "move next to its consumers"; promote (↗) = "shared, lift into vibe".
  let currentKind: string | null = null;
  for (const e of entries) {
    const kind = e.moveKind === "relocate" ? "↗" : "→";
    if (kind !== currentKind && !isMcp) {
      currentKind = kind;
      lines.push("");
      lines.push(
        kind === "→"
          ? "▸ COLOCATE — used from one folder, move next to consumers"
          : "▸ PROMOTE — shared across domains, lift into vibe",
      );
      lines.push(`${"─".repeat(6)}  ${"─".repeat(60)}`);
    }
    const count = String(e.importedByCount).padStart(5);
    const note = e.moveNote ? `  (${e.moveNote})` : "";
    lines.push(
      isMcp
        ? `${kind} ${String(e.importedByCount)} ${shortPath(e.path)} → ${e.moveTo ?? "?"}`
        : `${kind} ${count}  ${shortPath(e.path)}\n         → ${e.moveTo ?? "?"}${note}`,
    );
  }
  return lines;
}

/**
 * The all-in-one report: TODO sections (COLOCATE / PROMOTE / DEAD FILE / DEAD
 * SYMBOL), each rendered as a header + its entries. Move entries show the
 * suggested target + used-by note; dead-symbol entries show the symbol.
 */
function buildReportLines(groups: Group[], isMcp: boolean): string[] {
  if (groups.length === 0) {
    return ["✓ nothing to do — no relocation or dead-code findings in scope"];
  }
  const lines: string[] = [];
  for (const g of groups) {
    lines.push("");
    lines.push(isMcp ? `# ${g.package}` : `▸ ${g.package}`);
    if (!isMcp) {
      lines.push(`${"─".repeat(6)}  ${"─".repeat(60)}`);
    }
    for (const e of g.entries) {
      if (e.symbol) {
        // dead file / dead symbol
        const owner = e.symbolOwner ? `${e.symbolOwner}.` : "";
        const label =
          e.symbolKind === "file"
            ? shortPath(e.path)
            : `${owner}${e.symbol}  [${e.symbolKind ?? "?"}]  ${shortPath(e.path)}`;
        lines.push(isMcp ? `- ${label}` : `  ✗  ${label}`);
      } else {
        // colocate / promote
        const count = String(e.importedByCount).padStart(5);
        const note = e.moveNote ? `  (${e.moveNote})` : "";
        lines.push(
          isMcp
            ? `- ${String(e.importedByCount)} ${shortPath(e.path)} → ${e.moveTo ?? "?"}`
            : `  ${count}  ${shortPath(e.path)}\n         → ${e.moveTo ?? "?"}${note}`,
        );
      }
    }
  }
  return lines;
}

function buildCrossDomainLines(
  entries: Entry[],
  isMcp: boolean,
  t: TFn,
): string[] {
  if (entries.length === 0) {
    return [t("response.crossDomain.emptyState")];
  }
  const lines: string[] = [];
  if (!isMcp) {
    lines.push(
      `${pad(t("response.crossDomain.colCount"), 6)}  ${t("response.crossDomain.colTarget")}`,
    );
    lines.push(`${"─".repeat(6)}  ${"─".repeat(50)}`);
  }
  for (const e of entries) {
    lines.push(
      isMcp
        ? `${String(e.importedByCount)} ${shortPath(e.path)}`
        : `${String(e.importedByCount).padStart(6)}  ${shortPath(e.path)}  (${e.moveNote ?? ""})`,
    );
  }
  return lines;
}

function buildUnusedSymbolLines(
  entries: Entry[],
  isMcp: boolean,
  t: TFn,
): string[] {
  if (entries.length === 0) {
    return [t("response.unusedSymbols.emptyState")];
  }
  const lines: string[] = [];
  if (!isMcp) {
    lines.push(
      `${pad(t("response.unusedSymbols.colKind"), 14)}  ${pad(t("response.unusedSymbols.colSymbol"), 28)}  ${t("response.unusedSymbols.colPath")}`,
    );
    lines.push(`${"─".repeat(14)}  ${"─".repeat(28)}  ${"─".repeat(40)}`);
  }
  for (const e of entries) {
    const sym = e.symbolOwner
      ? `${e.symbolOwner}.${e.symbol ?? ""}`
      : (e.symbol ?? "");
    const flag = e.importedByCount === 0 ? "✗" : "·"; // ✗ dead, · single-use
    lines.push(
      isMcp
        ? `${flag} ${e.symbolKind ?? ""} ${sym} ${shortPath(e.path)}`
        : `${flag} ${pad(e.symbolKind ?? "", 12)}  ${pad(sym, 28)}  ${shortPath(e.path)}`,
    );
  }
  return lines;
}

// ── Main widget ─────────────────────────────────────────────

export function VibeDepsWidget(): React.JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const platform = useWidgetPlatform();
  const endpointMutations = useWidgetEndpointMutations();

  const entries: Entry[] = (data?.entries ?? []).map(normEntry);
  const groups: Group[] = (data?.groups ?? []).map(normGroup);
  const view = data?.view ?? "files";
  const violations = data?.violations ?? {
    outOfPackage: 0,
    crossPackage: 0,
    reverseDirection: 0,
    total: 0,
  };
  const totalFiles = data?.totalFiles ?? 0;
  const totalEdges = data?.totalEdges ?? 0;
  const unusedCount = data?.unusedCount ?? 0;
  const hasResult = data !== null && data !== undefined;
  const isLoading = endpointMutations?.read?.isLoading ?? false;

  const isReport = view === "report";
  const isBoundary = view === "boundaries";
  const isLayers = view === "layers";
  const isShared = view === "shared-candidates";
  const isImporters = view === "importers";
  const isNeedsMove = view === "needs-move";
  const isUnusedSymbols = view === "unused-symbols";
  const isCrossDomain = view === "cross-domain";

  // ── CLI / MCP ─────────────────────────────────────────────
  if (platform === Platform.CLI || platform === Platform.MCP) {
    const isMcp = platform === Platform.MCP;

    if (!hasResult) {
      if (isMcp) {
        return (
          <Div>
            <Span>{t("title")}</Span>
          </Div>
        );
      }
      return (
        <Div>
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "title", icon: "git-branch", variant: "primary" }}
          />
        </Div>
      );
    }

    const lines: string[] = [];

    // Header line — boundary modes lead with the violation summary.
    if (isBoundary || isLayers) {
      lines.push(
        `out:${String(violations.outOfPackage)} cross:${String(violations.crossPackage)} reverse:${String(violations.reverseDirection)}  (${String(totalFiles)} files)`,
      );
    } else {
      lines.push(
        `${String(totalFiles)} files  ${String(totalEdges)} edges  ${String(unusedCount)} unused`,
      );
    }
    lines.push("");

    if (isReport) {
      lines.push(...buildReportLines(groups, isMcp));
    } else if (isBoundary) {
      lines.push(...buildBoundaryLines(groups, violations, isMcp, t));
    } else if (isLayers) {
      lines.push(...buildLayerLines(entries, isMcp, t));
    } else if (isShared) {
      lines.push(...buildSharedCandidateLines(entries, isMcp, t));
    } else if (isImporters) {
      lines.push(...buildImporterLines(entries, isMcp));
    } else if (isNeedsMove) {
      lines.push(...buildNeedsMoveLines(entries, isMcp, t));
    } else if (isUnusedSymbols) {
      lines.push(...buildUnusedSymbolLines(entries, isMcp, t));
    } else if (isCrossDomain) {
      lines.push(...buildCrossDomainLines(entries, isMcp, t));
    } else if (entries.length === 0) {
      lines.push(t("response.entries.emptyState.description"));
    } else {
      // files / categories / unused
      lines.push(`${pad("", 6)}  ${pad("in", 5)}  ${pad("out", 5)}  path`);
      lines.push(
        `${"─".repeat(6)}  ${"─".repeat(5)}  ${"─".repeat(5)}  ${"─".repeat(40)}`,
      );
      for (const e of entries) {
        const sigil = e.isUnused ? "!" : e.importedByCount > 50 ? "★" : " ";
        lines.push(
          `${pad(sigil, 6)}  ${String(e.importedByCount).padStart(5)}  ${String(e.importCount).padStart(5)}  ${e.path}`,
        );
      }
      if (!isMcp) {
        lines.push("");
        lines.push(
          `! = no importers  ★ = hot (50+ importers)  in = used by  out = imports`,
        );
      }
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
  const headerTitle = isBoundary
    ? t("response.boundaries.title")
    : isLayers
      ? t("response.layers.title")
      : isShared
        ? t("response.sharedCandidates.title")
        : isImporters
          ? t("response.importers.title")
          : isNeedsMove
            ? t("response.needsMove.title")
            : isUnusedSymbols
              ? t("response.unusedSymbols.title")
              : isCrossDomain
                ? t("response.crossDomain.title")
                : t("title");

  return (
    <Div className="flex flex-col gap-6">
      {/* Header */}
      <Div className="flex flex-col gap-1">
        <Div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-muted-foreground" />
          <Span className="text-lg font-semibold">{headerTitle}</Span>
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
          {/* Stats row — boundary/layer modes show the violation summary */}
          <Div className="flex items-start py-3 px-4 rounded-lg bg-muted/30 border border-border/50">
            {isBoundary || isLayers ? (
              <>
                <Div className="flex-1 flex justify-center">
                  <StatBadge
                    label={t("response.violations.outOfPackage")}
                    value={violations.outOfPackage}
                    variant="warn"
                  />
                </Div>
                <Div className="w-px self-stretch bg-border/50" />
                <Div className="flex-1 flex justify-center">
                  <StatBadge
                    label={t("response.violations.crossPackage")}
                    value={violations.crossPackage}
                    variant="danger"
                  />
                </Div>
                <Div className="w-px self-stretch bg-border/50" />
                <Div className="flex-1 flex justify-center">
                  <StatBadge
                    label={t("response.violations.reverseDirection")}
                    value={violations.reverseDirection}
                    variant="danger"
                  />
                </Div>
                <Div className="w-px self-stretch bg-border/50" />
                <Div className="flex-1 flex justify-center">
                  <StatBadge
                    label={t("response.violations.total")}
                    value={violations.total}
                    variant="neutral"
                  />
                </Div>
              </>
            ) : (
              <>
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
              </>
            )}
          </Div>

          {/* Body by view */}
          {isBoundary ? (
            groups.length === 0 ? (
              <EmptyState label={t("response.boundaries.cleanState")} />
            ) : (
              <Div className="flex flex-col gap-5">
                {groups.map((g) => (
                  <PackageCard
                    key={g.package}
                    group={g}
                    packageHeaderLabel={t("response.boundaries.packageHeader")}
                  />
                ))}
              </Div>
            )
          ) : isLayers ? (
            entries.length === 0 ? (
              <EmptyState label={t("response.layers.cleanState")} />
            ) : (
              <Div className="flex flex-col gap-1">
                {entries.map((e, i) => (
                  <ViolationRow key={`${e.path}:${i}`} entry={e} />
                ))}
              </Div>
            )
          ) : isShared ? (
            entries.length === 0 ? (
              <EmptyState label={t("response.sharedCandidates.emptyState")} />
            ) : (
              <Div className="flex flex-col gap-1">
                {entries.map((e) => (
                  <EntryCard
                    key={e.path}
                    path={e.path}
                    importCount={e.importCount}
                    importedByCount={e.importedByCount}
                    isUnused={false}
                    importedBy={[]}
                    importedByLabel={t("response.entries.importedBy")}
                  />
                ))}
              </Div>
            )
          ) : entries.length === 0 ? (
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
