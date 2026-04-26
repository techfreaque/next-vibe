"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { H3, H4 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import {
  useWidgetLocale,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import { scopedTranslation } from "./i18n";

export function ModelPricesWidget(): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const value = useWidgetValue<typeof definition.GET>();

  if (!value) {
    return <Div />;
  }

  const { summary, providerResults, failures, updates } = value;

  return (
    <Div className="space-y-6 p-4">
      {/* Summary */}
      <Div className="flex gap-4 items-center flex-wrap">
        <Badge variant="outline">{summary.totalProviders} providers</Badge>
        <Badge variant="outline">{summary.totalModels} found</Badge>
        <Badge variant={summary.modelsUpdated > 0 ? "default" : "secondary"}>
          {summary.modelsUpdated} updated
        </Badge>
        <Badge variant={summary.fileUpdated ? "default" : "secondary"}>
          {summary.fileUpdated ? "written" : "no changes"}
        </Badge>
      </Div>

      {/* Provider results */}
      <Div>
        <H4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t("get.response.providerResults.title")}
        </H4>
        <Div className="space-y-1">
          {providerResults.map((r) => (
            <Div key={r.provider} className="flex gap-3 items-center text-sm">
              <Badge
                variant="outline"
                className="w-36 justify-center shrink-0 text-xs"
              >
                {r.provider}
              </Badge>
              <Span className="text-muted-foreground text-xs">
                {r.modelsFound}{" "}
                {t("get.response.providerResults.model.modelsFound")}
              </Span>
              <Span className="text-xs">
                {r.modelsUpdated}{" "}
                {t("get.response.providerResults.model.modelsUpdated")}
              </Span>
              {r.error !== undefined && r.error !== null && (
                <Span className="text-destructive text-xs ml-auto truncate">
                  {r.error}
                </Span>
              )}
            </Div>
          ))}
        </Div>
      </Div>

      {/* Failures */}
      {failures.length > 0 && (
        <Div>
          <H3 className="mb-2 text-sm font-semibold text-destructive">
            {t("get.response.failures.title")} ({failures.length})
          </H3>
          <Div className="space-y-2">
            {failures.map((f) => (
              <Div
                key={`${f.provider}-${f.modelId}`}
                className="text-sm border-l-2 border-destructive pl-3 py-0.5"
              >
                <Div className="flex gap-2 items-center">
                  <Badge variant="destructive" className="text-xs">
                    {f.provider}
                  </Badge>
                  <Span className="font-mono text-xs">{f.modelId}</Span>
                </Div>
                <Div className="text-muted-foreground text-xs mt-0.5">
                  {f.reason}
                </Div>
              </Div>
            ))}
          </Div>
        </Div>
      )}

      {/* Updates */}
      {updates.length > 0 && (
        <Div>
          <H4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("get.response.updates.title")} ({updates.length})
          </H4>
          <Div className="space-y-1">
            {updates.map((u) => (
              <Div
                key={`${u.provider}-${u.modelId}`}
                className="flex gap-3 items-center text-sm"
              >
                <Badge variant="outline" className="text-xs shrink-0">
                  {u.provider}
                </Badge>
                <Span className="flex-1 truncate text-xs">{u.name}</Span>
                <Span className="text-muted-foreground font-mono text-xs">
                  {u.field}
                </Span>
                <Span className="font-semibold tabular-nums text-xs">
                  {u.value}
                </Span>
              </Div>
            ))}
          </Div>
        </Div>
      )}
    </Div>
  );
}
