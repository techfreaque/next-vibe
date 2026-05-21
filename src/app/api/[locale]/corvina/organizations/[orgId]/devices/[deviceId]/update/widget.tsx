"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Cpu } from "next-vibe-ui/ui/icons/Cpu";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

export function DeviceUpdateContainer(): React.JSX.Element {
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();
  const form = useWidgetForm<typeof definition.PATCH>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.PATCH>();

  const saved = data !== undefined;

  const labelValue = form.watch("label") ?? "";
  const descriptionValue = form.watch("description") ?? "";
  const serialNumberValue = form.watch("serialNumber") ?? "";

  if (saved) {
    return (
      <Div className="flex flex-col min-h-0 bg-background">
        <Div className="flex items-center gap-2 px-3 py-2.5 border-b shrink-0 bg-background">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 shrink-0"
            onClick={() => goBack()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Span className="font-semibold text-sm mr-auto">
            {t("patch.success.title")}
          </Span>
        </Div>
        <Div className="p-6 flex flex-col items-center gap-5">
          <Div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
            <Check className="h-7 w-7 text-success" />
          </Div>
          <Div className="text-center">
            <Span className="block font-bold text-base">
              {data.labelResult}
            </Span>
            <Span className="block text-sm text-muted-foreground mt-1">
              {t("patch.success.description")}
            </Span>
          </Div>
          {(data.hwId ?? data.orgResourceId) && (
            <Div className="w-full rounded-2xl border bg-card overflow-hidden">
              {data.hwId && (
                <Div className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0">
                  <Cpu className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <Span className="text-xs font-mono font-medium ml-auto">
                    {data.hwId}
                  </Span>
                </Div>
              )}
              {data.orgResourceId && (
                <Div className="flex items-center gap-3 px-4 py-3">
                  <Server className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <Span className="text-xs font-mono font-medium ml-auto truncate max-w-[160px]">
                    {data.orgResourceId}
                  </Span>
                </Div>
              )}
            </Div>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => goBack()}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("patch.widget.successTitle")}
          </Button>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0 bg-background">
      <Div className="flex items-center gap-2 px-3 py-2.5 border-b shrink-0 bg-background">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 shrink-0"
          onClick={() => goBack()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Server className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Span className="font-semibold text-sm mr-auto">
          {t("patch.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto flex-1 max-h-[min(600px,calc(100dvh-120px))] p-4 flex flex-col gap-3">
        <Div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/20">
            <Span className="text-muted-foreground">
              <Server className="h-3.5 w-3.5" />
            </Span>
            <Span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("patch.label.label")}
            </Span>
          </Div>
          <Div className="p-4 flex flex-col gap-4">
            <Div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold">
                {t("patch.label.label")}
              </Label>
              <Input
                value={labelValue}
                onChange={(e) =>
                  form.setValue("label", e.target.value, { shouldDirty: true })
                }
                placeholder={t("patch.label.placeholder")}
              />
            </Div>

            <Div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold">
                {t("patch.descriptionField.label")}
              </Label>
              <Input
                value={descriptionValue}
                onChange={(e) =>
                  form.setValue("description", e.target.value, {
                    shouldDirty: true,
                  })
                }
                placeholder={t("patch.descriptionField.placeholder")}
              />
            </Div>

            <Div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold">
                {t("patch.serialNumber.label")}
              </Label>
              <Input
                value={serialNumberValue}
                onChange={(e) =>
                  form.setValue("serialNumber", e.target.value, {
                    shouldDirty: true,
                  })
                }
                placeholder={t("patch.serialNumber.placeholder")}
                className="font-mono"
              />
            </Div>
          </Div>
        </Div>

        <Button
          type="button"
          variant="default"
          size="sm"
          className="w-full gap-2 h-10 text-sm font-semibold"
          onClick={onSubmit ?? undefined}
        >
          <Save className="h-4 w-4" />
          {t("patch.title")}
        </Button>
      </Div>
    </Div>
  );
}
