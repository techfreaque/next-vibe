"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
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

function formatDate(val: string | Date | null | undefined): string {
  if (!val) {
    return "—";
  }
  if (val instanceof Date) {
    return val.toLocaleDateString();
  }
  return new Date(val).toLocaleDateString();
}

export function DeviceLicenseMigrateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.POST>();

  const isMcp = platform === Platform.MCP;
  const isCli = platform === Platform.CLI;
  const isCompact = isCli || isMcp;

  const oldActivationKeyIdValue = form.watch("oldActivationKeyId");
  const newRealmValue = form.watch("newRealm") ?? "";

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-sm p-2">
          {`migrated to realm:${result.logicalId}`}
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
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="grid grid-cols-2 gap-4">
          <Div className="space-y-1.5">
            <Label htmlFor="migrate-old-key-id">
              {t("post.oldActivationKeyId.label")}
            </Label>
            <Input
              id="migrate-old-key-id"
              type="number"
              value={oldActivationKeyIdValue}
              onChange={(e) => {
                form.setValue("oldActivationKeyId", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.oldActivationKeyId.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.oldActivationKeyId.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="migrate-new-realm">
              {t("post.newRealm.label")}
            </Label>
            <Input
              id="migrate-new-realm"
              type="text"
              value={newRealmValue}
              onChange={(e) => {
                form.setValue("newRealm", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.newRealm.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.newRealm.description")}
            </Span>
          </Div>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
        >
          <ArrowRight className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>

        {result !== null && result !== undefined && (
          <Div className="rounded-xl border bg-card p-4 space-y-3">
            <Span className="font-semibold text-sm text-success block">
              {result.logicalId}
            </Span>
            <Div className="grid grid-cols-2 gap-2 text-sm">
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.serialNumber")}
                </Span>
                <Span className="font-mono">{result.serialNumber ?? "—"}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.clientName")}
                </Span>
                <Span>{result.clientName ?? "—"}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.activationKey")}
                </Span>
                <Span className="font-mono">{result.activationKey ?? "—"}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.activationDate")}
                </Span>
                <Span>{formatDate(result.activationDate)}</Span>
              </Div>
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}
