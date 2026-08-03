// oxlint-disable oxlint-plugin-i18n/no-literal-string -- Inline endpoint: this
// widget renders literal copy by design (see definition.ts, createEndpoint from
// core/definition/create). There is no scope to translate against.
"use client";

import { Platform } from "../../platforms/platforms";
import { Badge } from "next-vibe/ui/ui/badge";
import { Div } from "next-vibe/ui/ui/div";
import { CheckCircle2 } from "next-vibe/ui/ui/icons/CheckCircle2";
import { Loader2 } from "next-vibe/ui/ui/icons/Loader2";
import { SkipForward } from "next-vibe/ui/ui/icons/SkipForward";
import { Sparkles } from "next-vibe/ui/ui/icons/Sparkles";
import { Zap } from "next-vibe/ui/ui/icons/Zap";
import { Pre } from "next-vibe/ui/ui/pre";
import { Span } from "next-vibe/ui/ui/span";
import {
  useWidgetEndpointMutations,
  useWidgetPlatform,
  useWidgetValue,
} from "../../unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "../../unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "../../unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

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
    if (!hasResult || !stats) {
      return (
        <Div>
          <Span>No output yet. Run generation to see results.</Span>
        </Div>
      );
    }
    const lines = [
      `Total: ${String(stats.totalGenerators)}  Generated: ${String(stats.generatorsRun)}  Unchanged: ${String(stats.generatorsSkipped)}`,
    ];
    if (output) {
      lines.push("", output);
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

      {/* Loading */}
      {isLoading && (
        <Div className="flex items-center gap-2 text-muted-foreground py-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <Span className="text-sm">Running...</Span>
        </Div>
      )}

      {/* Results */}
      {hasResult && !isLoading && stats && (
        <Div className="flex flex-col gap-4">
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
