/**
 * Journey Variants Widget
 * Admin UI for viewing and managing email journey variant registrations.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import {
  useWidgetContext,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

type GetResponseOutput = typeof definition.GET.types.ResponseOutput;

interface CustomWidgetProps {
  field: {
    value: GetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

export function JourneyVariantsWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = field.value;
  const items = data?.items ?? [];

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2">
        <GitBranch className="h-5 w-5 text-muted-foreground" />
        <Span className="font-semibold text-base mr-auto">
          {t("widget.title")}
        </Span>
        <Span className="text-sm text-muted-foreground">
          {data?.total ?? 0} {t("get.response.total")}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => endpointMutations?.read?.refetch?.()}
          title={t("widget.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* Empty state */}
      {items.length === 0 && (
        <Div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">
          {t("widget.noVariants")}
        </Div>
      )}

      {/* Variant list */}
      {items.length > 0 && (
        <Div className="flex flex-col gap-2">
          {items.map((item) => (
            <Div
              key={item.id}
              className="rounded-lg border bg-card p-4 flex flex-col gap-2"
            >
              <Div className="flex items-center gap-2 flex-wrap">
                <Span className="font-mono text-sm font-semibold">
                  {item.variantKey}
                </Span>
                <Span className="text-sm text-muted-foreground">
                  {item.displayName}
                </Span>
                <Badge
                  variant={item.active ? "default" : "secondary"}
                  className="ml-auto"
                >
                  {item.active
                    ? t("widget.activeLabel")
                    : t("widget.inactiveLabel")}
                </Badge>
              </Div>

              <Div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <Span>
                  {t("widget.weightLabel")}: <strong>{item.weight}</strong>
                </Span>
                {item.campaignType && (
                  <Span>
                    {t("widget.campaignTypeLabel")}:{" "}
                    <strong>{item.campaignType}</strong>
                  </Span>
                )}
                {item.sourceFilePath && (
                  <Span>
                    {t("widget.sourceFileLabel")}:{" "}
                    <code className="text-xs">{item.sourceFilePath}</code>
                  </Span>
                )}
              </Div>

              {item.description && (
                <Span className="text-xs text-muted-foreground">
                  {item.description}
                </Span>
              )}

              {item.checkErrors.length > 0 && (
                <Div className="rounded bg-destructive/10 p-2">
                  <Span className="text-xs text-destructive font-semibold">
                    Check errors:
                  </Span>
                  {item.checkErrors.map((err, i) => (
                    <Span key={i} className="text-xs text-destructive block">
                      {err}
                    </Span>
                  ))}
                </Div>
              )}
            </Div>
          ))}
        </Div>
      )}
    </Div>
  );
}
