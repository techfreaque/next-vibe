"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
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

  if (created) {
    return (
      <Div className="flex flex-col gap-0">
        <Div className="flex items-center gap-2 px-4 py-3 border-b">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => goBack()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Span className="font-semibold text-sm mr-auto">
            {t("post.success.title")}
          </Span>
        </Div>
        <Div className="px-4 py-6 flex flex-col items-center gap-4">
          <Div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
            <Server className="h-5 w-5 text-success" />
          </Div>
          <Div className="w-full divide-y border rounded-lg px-4">
            <Div className="flex items-center justify-between py-2">
              <Span className="text-xs text-muted-foreground">
                {t("post.response.deviceId")}
              </Span>
              <Span className="text-sm font-mono font-medium">
                {created.deviceId}
              </Span>
            </Div>
            <Div className="flex items-center justify-between py-2">
              <Span className="text-xs text-muted-foreground">
                {t("post.response.name")}
              </Span>
              <Span className="text-sm font-mono font-medium">
                {created.nameResult}
              </Span>
            </Div>
            {created.labelResult && (
              <Div className="flex items-center justify-between py-2">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.label")}
                </Span>
                <Span className="text-sm font-medium">
                  {created.labelResult}
                </Span>
              </Div>
            )}
          </Div>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => goBack()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Span className="font-semibold text-sm mr-auto">{t("post.title")}</Span>
      </Div>

      <Div className="px-4 py-3 flex flex-col gap-4">
        <Div>
          <Label className="block text-xs font-medium mb-1">
            {t("post.name.label")}
            <Span className="block text-xs text-muted-foreground font-normal mb-1">
              {t("post.name.description")}
            </Span>
          </Label>
          <Input
            value={nameValue}
            onChange={(e) =>
              form.setValue("name", e.target.value, { shouldDirty: true })
            }
            placeholder={t("post.name.placeholder")}
            className="w-full font-mono"
          />
        </Div>

        <Div>
          <Label className="block text-xs font-medium mb-1">
            {t("post.label.label")}
            <Span className="block text-xs text-muted-foreground font-normal mb-1">
              {t("post.label.description")}
            </Span>
          </Label>
          <Input
            value={labelValue}
            onChange={(e) =>
              form.setValue("label", e.target.value, { shouldDirty: true })
            }
            placeholder={t("post.label.placeholder")}
            className="w-full"
          />
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
        >
          <Plus className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>
      </Div>
    </Div>
  );
}
