/**
 * Rebuild Widget (React Web)
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import {
  useWidgetForm,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

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

export function RebuildWidget(): JSX.Element {
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();
  const t = useWidgetTranslation<typeof definition.POST>();
  const value = useWidgetValue<typeof definition.POST>();

  if (!value) {
    return (
      <Div className="flex flex-col gap-4 p-4">
        {form && onSubmit && (
          <Button onClick={onSubmit} size="sm">
            {t("post.widget.runRebuild")}
          </Button>
        )}
      </Div>
    );
  }

  const steps = value.steps ?? [];
  const hasErrors = value.errors && value.errors.length > 0;
  const allOk = !hasErrors && steps.every((s) => s.ok || s.skipped);

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center justify-between">
        <Div className="flex items-center gap-2">
          <Span className="text-base font-semibold">
            {allOk
              ? t("post.widget.rebuildComplete")
              : t("post.widget.rebuildFailed")}
          </Span>
          <Badge variant={allOk ? "default" : "destructive"}>
            {allOk ? "✓" : "✗"}
          </Badge>
        </Div>
        <Span className="text-xs text-muted-foreground font-mono">
          {formatDuration(value.duration)}
        </Span>
      </Div>

      {/* Steps */}
      {steps.length > 0 && (
        <Div className="flex flex-wrap gap-2">
          {steps.map((step) => (
            <Badge
              key={step.label}
              variant={
                step.skipped ? "outline" : step.ok ? "secondary" : "destructive"
              }
              className="text-xs gap-1"
            >
              <Span>{step.skipped ? "–" : step.ok ? "✓" : "✗"}</Span>
              <Span>{step.label}</Span>
              {step.durationMs > 0 && (
                <Span className="opacity-60">
                  {formatDuration(step.durationMs)}
                </Span>
              )}
            </Badge>
          ))}
        </Div>
      )}

      {/* Errors */}
      {hasErrors && (
        <Div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 flex flex-col gap-1">
          {value.errors!.map((err, i) => (
            <P key={i} className="text-xs text-destructive font-mono">
              {err}
            </P>
          ))}
        </Div>
      )}

      {/* Re-run */}
      {form && onSubmit && (
        <Button
          onClick={onSubmit}
          variant="outline"
          size="sm"
          className="w-fit"
        >
          {t("post.widget.runAgain")}
        </Button>
      )}
    </Div>
  );
}
