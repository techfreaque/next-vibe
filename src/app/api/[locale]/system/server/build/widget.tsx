/**
 * Build Widget (React Web)
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
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

interface CustomWidgetProps {
  field: {
    value: typeof definition.POST.types.ResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  const m = Math.floor(ms / 60_000);
  const s = Math.round((ms % 60_000) / 1000);
  return `${m}m ${s}s`;
}

export function BuildResultWidget({ field }: CustomWidgetProps): JSX.Element {
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();
  const value = field.value;

  if (!value) {
    return (
      <Div className="flex flex-col gap-4 p-4">
        {form && onSubmit && (
          <Button onClick={onSubmit} size="sm">
            Run Build
          </Button>
        )}
      </Div>
    );
  }

  const hasErrors = value.errors && value.errors.length > 0;

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center justify-between">
        <Div className="flex items-center gap-2">
          <Span className="text-base font-semibold">
            {value.success ? "Build complete" : "Build failed"}
          </Span>
          <Badge variant={value.success ? "default" : "destructive"}>
            {value.success ? "✓" : "✗"}
          </Badge>
        </Div>
        <Span className="text-xs text-muted-foreground font-mono">
          {formatDuration(value.duration)}
        </Span>
      </Div>

      {/* Steps */}
      {value.steps && value.steps.length > 0 && (
        <Div className="flex flex-wrap gap-2">
          {value.steps.map((step) => (
            <Badge
              key={step.label}
              variant={
                step.skipped ? "outline" : step.ok ? "secondary" : "destructive"
              }
              className="text-xs gap-1"
            >
              <Span>{step.skipped ? "–" : step.ok ? "✓" : "✗"}</Span>
              <Span>{step.label}</Span>
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
          Run again
        </Button>
      )}
    </Div>
  );
}
