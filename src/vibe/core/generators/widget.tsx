// oxlint-disable oxlint-plugin-i18n/no-literal-string -- Inline endpoint: this
// widget renders literal copy by design (see definition.ts, createEndpoint from
// core/definition/create). There is no scope to translate against.
"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Div } from "next-vibe/ui/components/div";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { CheckCircle2 } from "next-vibe/ui/components/icons/CheckCircle2";
import { CircleDashed } from "next-vibe/ui/components/icons/CircleDashed";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Minus } from "next-vibe/ui/components/icons/Minus";
import { SkipForward } from "next-vibe/ui/components/icons/SkipForward";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { XCircle } from "next-vibe/ui/components/icons/XCircle";
import { Zap } from "next-vibe/ui/components/icons/Zap";
import { Pre } from "next-vibe/ui/components/pre";
import { Span } from "next-vibe/ui/components/span";

import { Platform } from "../../platforms/platforms";
import {
  useIsMcp,
  useWidgetEndpointMutations,
  useWidgetPlatform,
  useWidgetValue,
} from "../../unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "../../unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "../../unified-ui/widgets/interactive/submit-button/widget";
import type definition from "./definition";

// ── Phase list (progress) ─────────────────────────────────────

interface GenPhase {
  id: string;
  status: "pending" | "running" | "done" | "failed" | "skipped";
  summary?: string;
  durationMs?: number;
}

/** Inline icon sizing — ignored by the CLI icons, sizes the SVG on web. */
const ICON_SIZE = "inline h-4 w-4";

/**
 * Live status of the generators. Rendered from `phases`, which arrives via the
 * "gen-progress" event before the request resolves.
 *
 * Hidden on MCP entirely: an agent wants the result, not a progress animation,
 * and every wasted line is wasted context.
 *
 * The CLI fast renderer has NO layout engine (`gap`/`width` are ignored), so
 * columns are aligned with padEnd and explicit spaces, never gap utilities.
 */
function GenPhaseList({
  phases,
}: {
  phases: GenPhase[] | null | undefined;
}): React.JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp || !Array.isArray(phases) || phases.length === 0) {
    return <></>;
  }

  const keyWidth = Math.max(...phases.map((phase) => phase.id.length));

  return (
    <Div className="mb-2">
      {phases.map((phase) => {
        const done = phase.status === "done";
        const skipped = phase.status === "skipped";
        const failed = phase.status === "failed";
        const markerClass = failed
          ? "text-destructive"
          : done
            ? "text-success"
            : skipped
              ? "text-muted-foreground"
              : "text-primary";

        const detail = failed
          ? (phase.summary ?? "failed")
          : done
            ? (phase.summary ?? "done")
            : skipped
              ? "cached"
              : phase.status;

        return (
          <Div key={phase.id} className="flex">
            {/* Icons inherit colour from the wrapping Span: ink Text inherits
                from its parent, and Lucide SVGs use currentColor. */}
            <Span className={markerClass}>
              {failed ? (
                <XCircle className={ICON_SIZE} />
              ) : done ? (
                <CheckCircle className={ICON_SIZE} />
              ) : skipped ? (
                <Minus className={ICON_SIZE} />
              ) : (
                <CircleDashed className={ICON_SIZE} />
              )}
            </Span>
            <Span>{` ${phase.id.padEnd(keyWidth + 2)}`}</Span>
            <Span
              className={failed ? "text-destructive" : "text-muted-foreground"}
            >
              {/* Trailing space, not just padEnd: a long summary exceeds the
                  pad width, so padding alone would let the duration collide
                  with the text. */}
              {`${detail} `.padEnd(15)}
            </Span>
            {phase.durationMs !== undefined && (
              <Span className="text-muted-foreground">
                {`${(phase.durationMs / 1000).toFixed(1)}s`}
              </Span>
            )}
          </Div>
        );
      })}
    </Div>
  );
}

export function GenerateAllWidget(): React.JSX.Element {
  const value = useWidgetValue<typeof definition.POST>();
  const platform = useWidgetPlatform();
  const endpointMutations = useWidgetEndpointMutations();

  const stats = value?.generationStats;
  const output = value?.output;
  const hasResult = value !== null && value !== undefined;
  const isLoading = endpointMutations?.read?.isLoading ?? false;

  // ── CLI / MCP ─────────────────────────────────────────────
  if (platform === Platform.CLI || platform === Platform.MCP) {
    // While generators are in flight, the phase rows ARE the whole UI. The
    // "gen-progress" events repaint this frame; the final response lands with
    // isComplete: true and flows into the summary below.
    if (value?.isComplete === false) {
      return <GenPhaseList phases={value.phases} />;
    }
    if (!hasResult || !stats) {
      return (
        <Div>
          <Span>No output yet. Run generation to see results.</Span>
        </Div>
      );
    }
    const hasPhases = Array.isArray(value.phases) && value.phases.length > 0;
    return (
      <Div>
        <GenPhaseList phases={value.phases} />
        <Span>
          {`Total: ${String(stats.totalGenerators)}  Generated: ${String(stats.generatorsRun)}  Unchanged: ${String(stats.generatorsSkipped)}`}
        </Span>
        {/* The raw output lines say exactly what the phase rows already show —
            only render them when there are no phase rows (MCP, older data). */}
        {!hasPhases && output && (
          <Div>
            <Span> </Span>
            <Span>{output}</Span>
          </Div>
        )}
      </Div>
    );
  }

  // ── Web ───────────────────────────────────────────────────
  return (
    <Div className="flex flex-col gap-5 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2 pb-3 border-b">
        <Sparkles className="h-5 w-5 text-violet-500 dark:text-violet-400" />
        <Span className="font-semibold text-base">Code Generation</Span>
      </Div>

      {/* Form */}
      <Div className="flex flex-col gap-3">
        <FormAlertWidget field={{}} />
        <SubmitButtonWidget
          field={{
            text: "Run generators",
            loadingText: "Running...",
            icon: "sparkles",
            variant: "primary",
          }}
        />
      </Div>

      {/* Loading — the "gen-progress" events merge phases into the cache, so
          the rows update live while the request is still in flight. */}
      {(isLoading || value?.isComplete === false) && (
        <Div className="flex flex-col gap-2 py-2">
          <Div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <Span className="text-sm">Running...</Span>
          </Div>
          <GenPhaseList phases={value?.phases} />
        </Div>
      )}

      {/* Results */}
      {hasResult && !isLoading && stats && (
        <Div className="flex flex-col gap-4">
          <GenPhaseList phases={value.phases} />
          {/* Stats grid */}
          <Div className="grid grid-cols-3 gap-3">
            <Div className="flex flex-col gap-1 rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
              <Span className="text-xs text-muted-foreground">Total</Span>
              <Span className="text-2xl font-bold tabular-nums">
                {String(stats.totalGenerators)}
              </Span>
            </Div>
            <Div className="flex flex-col gap-1 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3">
              <Div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                <Span className="text-xs text-emerald-700 dark:text-emerald-400">
                  Generated
                </Span>
              </Div>
              <Span className="text-2xl font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
                {String(stats.generatorsRun)}
              </Span>
            </Div>
            <Div className="flex flex-col gap-1 rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
              <Div className="flex items-center gap-1">
                <SkipForward className="h-3 w-3 text-muted-foreground" />
                <Span className="text-xs text-muted-foreground">Unchanged</Span>
              </Div>
              <Span className="text-2xl font-bold tabular-nums text-muted-foreground">
                {String(stats.generatorsSkipped)}
              </Span>
            </Div>
          </Div>

          {/* Status badge */}
          {stats.functionalGeneratorsCompleted && (
            <Div className="flex items-center gap-2">
              <Badge
                variant="default"
                className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 gap-1"
              >
                <CheckCircle2 className="h-3 w-3" />
                Success
              </Badge>
              <Span className="text-xs text-muted-foreground">
                {stats.outputDirectory}
              </Span>
            </Div>
          )}

          {/* Log output */}
          {output && (
            <Div className="flex flex-col gap-2">
              <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Generator log
              </Span>
              <Pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-foreground/80 bg-muted/40 rounded-lg border border-border/50 p-3 max-h-64 overflow-y-auto">
                {output}
              </Pre>
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}
