"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Tag } from "next-vibe-ui/ui/icons/Tag";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type {
  CorvinaDeviceTagsResponseOutput,
  CorvinaDeviceTagsUrlVariablesOutput,
} from "./definition";

type DeviceTag = CorvinaDeviceTagsResponseOutput["tags"][number];

function TagRow({
  tag,
  onEdit,
}: {
  tag: DeviceTag;
  onEdit: (tag: DeviceTag) => void;
}): React.JSX.Element {
  const ts =
    tag.latestTimestamp !== null && tag.latestTimestamp !== undefined
      ? new Date(tag.latestTimestamp).toLocaleString()
      : null;

  return (
    <Div className="flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0 group">
      <Div className="flex-1 min-w-0">
        <Span className="text-xs font-mono text-muted-foreground block truncate">
          {tag.modelPath}
        </Span>
        <Div className="flex items-center gap-2 mt-0.5">
          <Span className="text-sm font-medium font-mono">
            {tag.latestValue ?? (
              <Span className="text-muted-foreground italic text-xs">
                no data
              </Span>
            )}
          </Span>
          {ts && <Span className="text-xs text-muted-foreground">{ts}</Span>}
        </Div>
      </Div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 shrink-0"
        onClick={() => onEdit(tag)}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
    </Div>
  );
}

export function DeviceTagsContainer(): React.JSX.Element {
  const { pop: goBack, push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();

  const tags = data?.tags ?? [];
  const total = data?.total ?? 0;
  const isLoading = data === undefined;

  const orgId =
    (form.watch("orgId") as CorvinaDeviceTagsUrlVariablesOutput["orgId"]) ?? 0;
  const deviceId =
    (form.watch(
      "deviceId",
    ) as CorvinaDeviceTagsUrlVariablesOutput["deviceId"]) ?? "";

  const handleEdit = useCallback(
    (tag: DeviceTag): void => {
      void (async (): Promise<void> => {
        const def = await import("./definition");
        navigate(def.default.POST, {
          urlPathParams: { orgId, deviceId },
          data: { modelPath: tag.modelPath, v: tag.latestValue ?? "" },
        });
      })();
    },
    [navigate, orgId, deviceId],
  );

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => goBack()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Tag className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
          {total > 0 && (
            <Span className="ml-2 text-xs text-muted-foreground font-normal">
              ({total})
            </Span>
          )}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(500px,calc(100dvh-200px))]">
        {isLoading ? (
          <Div className="h-48 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Div>
        ) : tags.length === 0 ? (
          <Div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Tag className="h-8 w-8 opacity-30" />
            <Span className="text-sm">{t("get.widget.noTagsFound")}</Span>
          </Div>
        ) : (
          tags.map((tag) => (
            <TagRow key={tag.modelPath} tag={tag} onEdit={handleEdit} />
          ))
        )}
      </Div>
    </Div>
  );
}

export function TagUpdateContainer(): React.JSX.Element {
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.POST>();

  const modelPath = form.watch("modelPath") ?? "";
  const vValue = form.watch("v") ?? "";
  const succeeded = data !== undefined;

  if (succeeded) {
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
            {t("post.widget.successTitle")}
          </Span>
        </Div>
        <Div className="px-4 py-8 flex flex-col items-center gap-3 text-center">
          <Div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
            <Check className="h-5 w-5 text-success" />
          </Div>
          <Span className="text-sm text-muted-foreground">
            {t("post.widget.successDescription")}
          </Span>
          <Span className="text-xs font-mono text-muted-foreground">
            {modelPath}
          </Span>
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
        <Div className="rounded-md bg-muted/50 px-3 py-2">
          <Span className="text-xs text-muted-foreground block mb-0.5">
            {t("post.modelPath.label")}
          </Span>
          <Span className="text-sm font-mono break-all">{modelPath}</Span>
        </Div>

        <Div>
          <Label className="block text-xs font-medium mb-1">
            {t("post.v.label")}
            <Span className="block text-xs text-muted-foreground font-normal mb-1">
              {t("post.v.description")}
            </Span>
          </Label>
          <Input
            value={vValue}
            onChange={(e) =>
              form.setValue("v", e.target.value, { shouldDirty: true })
            }
            placeholder={t("post.v.placeholder")}
            className="w-full font-mono"
          />
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
          disabled={!vValue || !modelPath}
        >
          <Save className="h-4 w-4" />
          {t("post.widget.submitButton")}
        </Button>
      </Div>
    </Div>
  );
}
