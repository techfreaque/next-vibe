"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

export function OrganizationsVpnSyncAsyncContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.POST>();

  const isMcp = platform === Platform.MCP;
  const isCli = platform === Platform.CLI;
  const isCompact = isCli || isMcp;

  const orgResourceIdValue = form.watch("orgResourceId") ?? "";
  const rootOrgResourceIdValue = form.watch("rootOrgResourceId") ?? "";

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-sm p-2">
          {`vpn-sync-async jobId:${result.id ?? "none"} status:${result.status ?? "unknown"}`}
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
          title={t("post.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <RefreshCw className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(600px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="grid grid-cols-2 gap-4">
          <Div className="space-y-1.5">
            <Label htmlFor="vpn-sync-async-org">
              {t("post.orgResourceId.label")}
            </Label>
            <Input
              id="vpn-sync-async-org"
              type="text"
              value={
                typeof orgResourceIdValue === "string" ? orgResourceIdValue : ""
              }
              onChange={(e) => {
                form.setValue("orgResourceId", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.orgResourceId.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.orgResourceId.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="vpn-sync-async-root-org">
              {t("post.rootOrgResourceId.label")}
            </Label>
            <Input
              id="vpn-sync-async-root-org"
              type="text"
              value={
                typeof rootOrgResourceIdValue === "string"
                  ? rootOrgResourceIdValue
                  : ""
              }
              onChange={(e) => {
                form.setValue("rootOrgResourceId", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.rootOrgResourceId.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.rootOrgResourceId.description")}
            </Span>
          </Div>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
        >
          <RefreshCw className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>

        {result !== null && result !== undefined && (
          <Div className="rounded-xl border bg-card p-4 space-y-3">
            <Span className="font-semibold text-sm text-success block">
              {t("post.success.title")}
            </Span>
            <Div className="grid grid-cols-2 gap-2 text-sm">
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.id")}
                </Span>
                <Span className="font-mono">{result.id ?? "—"}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.status")}
                </Span>
                <Span className="font-mono">{result.status ?? "—"}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.orgResourceId")}
                </Span>
                <Span className="font-mono">{result.orgResourceId ?? "—"}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.rootOrgResourceId")}
                </Span>
                <Span className="font-mono">
                  {result.rootOrgResourceId ?? "—"}
                </Span>
              </Div>
              {result.error !== null && result.error !== undefined && (
                <Div className="col-span-2 flex flex-col gap-0.5">
                  <Span className="text-xs text-muted-foreground">
                    {t("post.response.error")}
                  </Span>
                  <Span className="text-destructive text-xs">
                    {result.error}
                  </Span>
                </Div>
              )}
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}
