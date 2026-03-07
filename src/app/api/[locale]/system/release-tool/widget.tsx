/**
 * Release Tool Widget (React Web)
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
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { ReleaseResponseType } from "./definition";

interface CustomWidgetProps {
  field: {
    value: ReleaseResponseType | null | undefined;
  };
  fieldName: string;
}

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

export function ReleaseResultWidget({ field }: CustomWidgetProps): JSX.Element {
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();
  const t = useWidgetTranslation<typeof definition.POST>();
  const value = field.value;

  if (!value) {
    return (
      <Div className="flex flex-col gap-4 p-4">
        {form && onSubmit && (
          <Button onClick={onSubmit} size="sm">
            {t("widget.runRelease")}
          </Button>
        )}
      </Div>
    );
  }

  const hasErrors = value.errors && value.errors.length > 0;
  const hasWarnings = value.warnings && value.warnings.length > 0;
  const packages = value.packagesProcessed ?? [];
  const published = value.publishedPackages ?? [];

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center justify-between">
        <Div className="flex items-center gap-2">
          <Span className="text-base font-semibold">
            {value.success ? t("widget.complete") : t("widget.failed")}
          </Span>
          <Badge variant={value.success ? "default" : "destructive"}>
            {value.success ? "\u2713" : "\u2717"}
          </Badge>
        </Div>
        {value.duration !== undefined && (
          <Span className="text-xs text-muted-foreground font-mono">
            {formatDuration(value.duration)}
          </Span>
        )}
      </Div>

      {/* Packages */}
      {packages.length > 0 && (
        <Div className="flex flex-col gap-1">
          {packages.map((pkg) => (
            <Div key={pkg.name} className="flex items-center gap-2">
              <Badge
                variant={
                  pkg.status === "success"
                    ? "secondary"
                    : pkg.status === "skipped"
                      ? "outline"
                      : "destructive"
                }
                className="text-xs gap-1"
              >
                <Span>
                  {pkg.status === "success"
                    ? "\u2713"
                    : pkg.status === "skipped"
                      ? "\u2013"
                      : "\u2717"}
                </Span>
                <Span>{pkg.name}</Span>
                {pkg.version !== undefined && <Span>{`v${pkg.version}`}</Span>}
              </Badge>
              {pkg.message !== undefined && (
                <Span className="text-xs text-muted-foreground">
                  {pkg.message}
                </Span>
              )}
            </Div>
          ))}
        </Div>
      )}

      {/* Published packages */}
      {published.length > 0 && (
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-muted-foreground">
            {`${t("widget.published")} (${published.length.toString()})`}
          </Span>
          {published.map((pkg) => (
            <Div key={`${pkg.name}-${pkg.registry}`} className="flex gap-2">
              <Badge variant="secondary" className="text-xs">
                {pkg.registry}
              </Badge>
              <Span className="text-xs font-mono">
                {`${pkg.name}@${pkg.version}`}
              </Span>
            </Div>
          ))}
        </Div>
      )}

      {/* Warnings */}
      {hasWarnings && (
        <Div className="rounded-md bg-yellow-500/10 border border-yellow-500/20 p-3 flex flex-col gap-1">
          {value.warnings!.map((w, i) => (
            <P key={i} className="text-xs text-yellow-700 dark:text-yellow-400">
              {w}
            </P>
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
          {t("widget.runAgain")}
        </Button>
      )}
    </Div>
  );
}
