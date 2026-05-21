"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import {
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
  useWidgetForm,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { CorvinaDeviceCreateResponseOutput } from "./definition";

type CreatedDevice = CorvinaDeviceCreateResponseOutput;

export function DeviceCreateContainer(): React.JSX.Element {
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.POST>();

  const created = data as CreatedDevice | undefined;
  const nameValue = form.watch("name") ?? "";
  const labelValue = form.watch("label") ?? "";

  // ── Success ──
  if (created) {
    return (
      <Div className="flex flex-col bg-background">
        <Div className="flex items-center gap-2 px-3 py-2.5 border-b">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => goBack()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Span className="font-semibold text-sm mr-auto">
            {t("post.success.title")}
          </Span>
        </Div>

        <Div className="p-6 flex flex-col items-center gap-5">
          {/* Success icon */}
          <Div className="relative">
            <Div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center">
              <Server className="h-7 w-7 text-success" />
            </Div>
            <Div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success flex items-center justify-center border-2 border-background">
              <Check className="h-3 w-3 text-white" />
            </Div>
          </Div>

          {/* Device name */}
          <Div className="text-center">
            <Span className="font-bold text-base block">
              {created.labelResult ?? created.nameResult}
            </Span>
            <Span className="text-sm text-muted-foreground block mt-1">
              {t("post.widget.registeredSuccessfully")}
            </Span>
          </Div>

          {/* Details */}
          <Div className="w-full rounded-2xl border bg-card overflow-hidden">
            <Div className="flex items-center justify-between px-4 py-3 border-b">
              <Span className="text-xs text-muted-foreground">
                {t("post.response.deviceId")}
              </Span>
              <Span className="text-xs font-mono font-semibold">
                {created.deviceId}
              </Span>
            </Div>
            <Div className="flex items-center justify-between px-4 py-3 border-b last:border-b-0">
              <Span className="text-xs text-muted-foreground">
                {t("post.response.name")}
              </Span>
              <Span className="text-xs font-mono font-medium">
                {created.nameResult}
              </Span>
            </Div>
            {created.labelResult && (
              <Div className="flex items-center justify-between px-4 py-3">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.label")}
                </Span>
                <Span className="text-xs font-medium">
                  {created.labelResult}
                </Span>
              </Div>
            )}
          </Div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => goBack()}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("post.widget.backToDevices")}
          </Button>
        </Div>
      </Div>
    );
  }

  // ── Form ──
  return (
    <Div className="flex flex-col bg-background">
      <Div className="flex items-center gap-2 px-3 py-2.5 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => goBack()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Server className="h-3.5 w-3.5 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">{t("post.title")}</Span>
      </Div>

      <Div className="p-4 flex flex-col gap-4">
        {/* Icon area */}
        <Div className="flex justify-center py-4">
          <Div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center">
            <Server className="h-7 w-7 text-primary/60" />
          </Div>
        </Div>

        {/* Form card */}
        <Div className="rounded-2xl border bg-card overflow-hidden">
          <Div className="px-4 py-3 border-b bg-muted/20">
            <Span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t("post.widget.deviceInfo")}
            </Span>
          </Div>
          <Div className="p-4 flex flex-col gap-4">
            <Div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold">
                {t("post.name.label")}
              </Label>
              <Input
                value={nameValue}
                onChange={(e) =>
                  form.setValue("name", e.target.value, { shouldDirty: true })
                }
                placeholder={t("post.name.placeholder")}
                className="font-mono"
              />
              <Span className="text-[11px] text-muted-foreground">
                {t("post.name.description")}
              </Span>
            </Div>

            <Div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold">
                {t("post.label.label")}
              </Label>
              <Input
                value={labelValue}
                onChange={(e) =>
                  form.setValue("label", e.target.value, { shouldDirty: true })
                }
                placeholder={t("post.label.placeholder")}
              />
              <Span className="text-[11px] text-muted-foreground">
                {t("post.label.description")}
              </Span>
            </Div>
          </Div>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2 h-10 text-sm font-semibold"
          onClick={onSubmit ?? undefined}
          disabled={!nameValue.trim()}
        >
          <Plus className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>
      </Div>
    </Div>
  );
}
