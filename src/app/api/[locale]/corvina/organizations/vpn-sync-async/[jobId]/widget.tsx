"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

export function OrganizationsVpnSyncAsyncJobContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const result = useWidgetValue<typeof definition.GET>();

  const isMcp = platform === Platform.MCP;
  const isCli = platform === Platform.CLI;
  const isCompact = isCli || isMcp;

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-sm p-2">
          {`job ${result.id ?? result.jobId}: status=${result.status ?? "unknown"} org=${result.orgResourceId ?? "none"}`}
        </Div>
      );
    }
    return <Div />;
  }

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            pop();
          }}
          title={t("get.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Search className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(600px,calc(100dvh-200px))] p-4">
        {result !== null && result !== undefined ? (
          <Div className="rounded-xl border bg-card p-4 space-y-3">
            <Div className="grid grid-cols-2 gap-2 text-sm">
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("get.response.id")}
                </Span>
                <Span className="font-mono">{result.id ?? "—"}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("get.response.status")}
                </Span>
                <Span className="font-mono font-semibold">
                  {result.status ?? "—"}
                </Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("get.response.orgResourceId")}
                </Span>
                <Span className="font-mono">{result.orgResourceId ?? "—"}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("get.response.rootOrgResourceId")}
                </Span>
                <Span className="font-mono">
                  {result.rootOrgResourceId ?? "—"}
                </Span>
              </Div>
              {result.error !== null && result.error !== undefined && (
                <Div className="col-span-2 flex flex-col gap-0.5">
                  <Span className="text-xs text-muted-foreground">
                    {t("get.response.error")}
                  </Span>
                  <Span className="text-destructive text-xs">
                    {result.error}
                  </Span>
                </Div>
              )}
            </Div>
          </Div>
        ) : (
          <Div />
        )}
      </Div>
    </Div>
  );
}
