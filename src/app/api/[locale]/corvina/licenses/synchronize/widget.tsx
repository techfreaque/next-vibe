"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Input } from "next-vibe-ui/ui/input";
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

export function LicensesSynchronizeContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.POST>();

  const orgResourceIdValue = form.watch("orgResourceId") ?? "";
  const dryRunValue = form.watch("dryRun") ?? false;

  const orgResourceIdError = form.formState.errors.orgResourceId?.message;
  const dryRunError = form.formState.errors.dryRun?.message;

  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-sm p-2">
          <Div>{t("post.widget.success")}</Div>
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

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="space-y-1.5">
          <Label htmlFor="sync-org-resource-id">
            {t("post.orgResourceId.label")}
          </Label>
          <Input
            id="sync-org-resource-id"
            type="text"
            value={orgResourceIdValue}
            onChange={(e) =>
              form.setValue("orgResourceId", e.target.value || undefined, {
                shouldDirty: true,
              })
            }
            placeholder="exorde.connex.example"
          />
          {orgResourceIdError ? (
            <Span className="text-xs text-destructive">
              {orgResourceIdError}
            </Span>
          ) : (
            <Span className="text-xs text-muted-foreground">
              {t("post.orgResourceId.description")}
            </Span>
          )}
        </Div>

        <Div className="flex items-center gap-3">
          <Checkbox
            id="sync-dry-run"
            checked={dryRunValue}
            onCheckedChange={(v) => {
              form.setValue("dryRun", v === true, { shouldDirty: true });
            }}
          />
          <Div className="space-y-0.5">
            <Label htmlFor="sync-dry-run" className="cursor-pointer">
              {t("post.dryRun.label")}
            </Label>
            {dryRunError ? (
              <Span className="text-xs text-destructive">{dryRunError}</Span>
            ) : (
              <Span className="text-xs text-muted-foreground">
                {t("post.dryRun.description")}
              </Span>
            )}
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
          <Div className="mt-4 rounded-xl border bg-card p-4 space-y-3">
            <Div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <Span className="font-semibold text-sm">
                {t("post.widget.success")}
              </Span>
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}
