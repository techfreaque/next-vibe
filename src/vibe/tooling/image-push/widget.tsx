/**
 * Image Push Widget
 * Handles web, CLI, MCP, and AI-tool rendering in one file via next-vibe-ui
 * primitives - see docs/patterns/widget.md ("Legacy: widget.cli.tsx").
 */

"use client";

import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { Pre } from "next-vibe/ui/ui/pre";
import { Span } from "next-vibe/ui/ui/span";
import { WidgetShell } from "next-vibe/ui/ui/widget-shell";
import type { JSX } from "react";

import {
  useWidgetOnSubmit,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "../../unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "../../unified-ui/widgets/interactive/form-alert/widget";
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ImagePushResultWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const responseOnly = useWidgetResponseOnly();
  const value = useWidgetValue<typeof definition.POST>();

  if (!value) {
    return (
      <WidgetShell>
        {!responseOnly && <FormAlertWidget field={{}} />}
        {!responseOnly && onSubmit && (
          <Button onClick={onSubmit} size="sm">
            {t("post.form.submit")}
          </Button>
        )}
      </WidgetShell>
    );
  }

  return (
    <WidgetShell>
      <Div className="flex items-center justify-between">
        <Div className="flex items-center gap-2">
          <Span className="text-base font-semibold">
            {t("post.success.title")}
          </Span>
          <Badge>✓</Badge>
        </Div>
        <Span className="text-xs text-muted-foreground font-mono">
          {formatDuration(value.duration)}
        </Span>
      </Div>

      <Div className="flex flex-col gap-1">
        <Span className="text-sm font-mono">{value.resolvedImage}</Span>
        <Div className="flex flex-wrap gap-2">
          {value.tags.map((tagName) => (
            <Badge key={tagName} variant="secondary" className="text-xs">
              {tagName}
            </Badge>
          ))}
        </Div>
      </Div>

      <Pre className="text-xs font-mono whitespace-pre-wrap bg-muted/50 rounded-md p-3">
        {value.output}
      </Pre>

      {!responseOnly && onSubmit && (
        <Button
          onClick={onSubmit}
          variant="outline"
          size="sm"
          className="w-fit"
        >
          {t("post.form.runAgain")}
        </Button>
      )}
    </WidgetShell>
  );
}
