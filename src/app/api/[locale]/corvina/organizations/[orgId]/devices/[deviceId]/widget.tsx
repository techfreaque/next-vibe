"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Tag } from "next-vibe-ui/ui/icons/Tag";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import {
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
  useWidgetForm,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { CorvinaDeviceGetResponseOutput } from "./definition";

type Device = CorvinaDeviceGetResponseOutput;

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex items-start justify-between py-2 border-b last:border-b-0">
      <Span className="text-xs text-muted-foreground w-36 shrink-0">
        {label}
      </Span>
      <Span className="text-sm font-medium text-right flex-1 break-all">
        {value}
      </Span>
    </Div>
  );
}

function SectionHeader({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2 mt-4 first:mt-0">
      {children}
    </Span>
  );
}

function formatTimestamp(ts: Date | string | null | undefined): string {
  if (!ts) {
    return "—";
  }
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

export function DeviceDetailContainer(): React.JSX.Element {
  const { push: navigate, pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const device = data as Device | undefined;
  const isLoading = data === undefined;

  const handleEdit = useCallback((): void => {
    if (!device) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("./definition");
      navigate(def.default.PATCH, {
        urlPathParams: { orgId: device.orgId, deviceId: device.deviceId },
      });
    })();
  }, [navigate, device]);

  const handleTags = useCallback((): void => {
    if (!device) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../[deviceId]/tags/definition");
      navigate(def.default.GET, {
        urlPathParams: { orgId: device.orgId, deviceId: device.hwId },
      });
    })();
  }, [navigate, device]);

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
          {isLoading ? "Loading…" : device?.label || t("get.title")}
        </Span>
        {device && device.connected !== null && (
          <Span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              device.connected
                ? "bg-success/10 text-success"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {device.connected
              ? t("get.widget.labels.online")
              : t("get.widget.labels.offline")}
          </Span>
        )}
        {device && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleTags}
            className="gap-1"
          >
            <Tag className="h-3.5 w-3.5" />
            {t("get.widget.tags")}
          </Button>
        )}
        {device && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="gap-1"
          >
            <Pencil className="h-3.5 w-3.5" />
            {t("get.widget.edit")}
          </Button>
        )}
      </Div>

      {isLoading ? (
        <Div className="h-48 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </Div>
      ) : !device ? null : (
        <Div className="px-4 py-3">
          <SectionHeader>{t("get.widget.sections.identity")}</SectionHeader>
          <InfoRow label={t("get.widget.labels.label")} value={device.label} />
          <InfoRow
            label={t("get.widget.labels.hwId")}
            value={<Span className="font-mono text-xs">{device.hwId}</Span>}
          />
          {device.orgResourceId && (
            <InfoRow
              label={t("get.widget.labels.orgResourceId")}
              value={
                <Span className="font-mono text-xs">
                  {device.orgResourceId}
                </Span>
              }
            />
          )}
          {device.groups.length > 0 && (
            <InfoRow
              label={t("get.widget.labels.groups")}
              value={device.groups.join(", ")}
            />
          )}

          <SectionHeader>{t("get.widget.sections.connectivity")}</SectionHeader>
          <InfoRow
            label={t("get.widget.labels.connected")}
            value={
              device.connected === null ? (
                <Span className="text-muted-foreground">—</Span>
              ) : (
                <Span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    device.connected
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {device.connected
                    ? t("get.widget.labels.online")
                    : t("get.widget.labels.offline")}
                </Span>
              )
            }
          />
          <InfoRow
            label={t("get.widget.labels.lastConnection")}
            value={formatTimestamp(device.lastConnection)}
          />
          <InfoRow
            label={t("get.widget.labels.lastDisconnection")}
            value={formatTimestamp(device.lastDisconnection)}
          />
          <InfoRow
            label={t("get.widget.labels.firstRegistration")}
            value={formatTimestamp(device.firstRegistration)}
          />
          {device.lastSeenIp && (
            <InfoRow
              label={t("get.widget.labels.lastSeenIp")}
              value={
                <Span className="font-mono text-xs">{device.lastSeenIp}</Span>
              }
            />
          )}
        </Div>
      )}
    </Div>
  );
}

export function DeviceUpdateContainer(): React.JSX.Element {
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();
  const form = useWidgetForm<typeof definition.PATCH>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.PATCH>();

  const device = data;
  const labelValue = form.watch("label") ?? "";
  const descriptionValue = form.watch("description") ?? "";
  const serialNumberValue = form.watch("serialNumber") ?? "";

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
          {t("patch.title")}
          {device && (
            <Span className="ml-1 text-muted-foreground font-normal">
              — {device.label}
            </Span>
          )}
        </Span>
      </Div>

      <Div className="px-4 py-3 flex flex-col gap-4">
        <Div>
          <Label className="block text-xs font-medium mb-1">
            {t("patch.label.label")}
            <Span className="block text-xs text-muted-foreground font-normal mb-1">
              {t("patch.label.description")}
            </Span>
          </Label>
          <Input
            value={labelValue}
            onChange={(e) =>
              form.setValue("label", e.target.value, { shouldDirty: true })
            }
            placeholder={t("patch.label.placeholder")}
            className="w-full"
          />
        </Div>

        <Div>
          <Label className="block text-xs font-medium mb-1">
            {t("patch.description.label")}
            <Span className="block text-xs text-muted-foreground font-normal mb-1">
              {t("patch.description.description")}
            </Span>
          </Label>
          <Input
            value={descriptionValue}
            onChange={(e) =>
              form.setValue("description", e.target.value, {
                shouldDirty: true,
              })
            }
            placeholder={t("patch.description.placeholder")}
            className="w-full"
          />
        </Div>

        <Div>
          <Label className="block text-xs font-medium mb-1">
            {t("patch.serialNumber.label")}
            <Span className="block text-xs text-muted-foreground font-normal mb-1">
              {t("patch.serialNumber.description")}
            </Span>
          </Label>
          <Input
            value={serialNumberValue}
            onChange={(e) =>
              form.setValue("serialNumber", e.target.value, {
                shouldDirty: true,
              })
            }
            placeholder={t("patch.serialNumber.placeholder")}
            className="w-full"
          />
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
        >
          <Save className="h-4 w-4" />
          {t("patch.submitButton.label")}
        </Button>
      </Div>
    </Div>
  );
}
