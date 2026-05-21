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

import { cn } from "@/app/api/[locale]/shared/utils";
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

const statusColors: Record<string, string> = {
  ACTIVE: "bg-success/10 text-success",
  INACTIVE: "bg-muted text-muted-foreground",
  ERROR: "bg-destructive/10 text-destructive",
};

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex items-start justify-between py-2 border-b last:border-b-0">
      <Span className="text-xs text-muted-foreground w-40 shrink-0">
        {label}
      </Span>
      <Span className="text-sm font-medium text-right flex-1 break-all">
        {value}
      </Span>
    </Div>
  );
}

function BoolToggle({
  value,
  onToggle,
  label,
  description,
}: {
  value: boolean;
  onToggle: () => void;
  label: string;
  description: string;
}): React.JSX.Element {
  return (
    <Div className="flex items-center justify-between py-2">
      <Div>
        <Span className="text-sm font-medium">{label}</Span>
        <Span className="block text-xs text-muted-foreground">
          {description}
        </Span>
      </Div>
      <Button
        type="button"
        onClick={onToggle}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors p-0 min-h-0 shadow-none",
          value ? "bg-primary" : "bg-input",
        )}
      >
        <Span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
            value ? "translate-x-4" : "translate-x-0",
          )}
        />
      </Button>
    </Div>
  );
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
      navigate(def.default.PUT, {
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
        urlPathParams: { orgId: device.orgId, deviceId: device.deviceId },
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
          {isLoading
            ? "Loading…"
            : device?.label || device?.name || t("get.title")}
        </Span>
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
        <Div className="px-4 py-3 flex flex-col gap-4">
          <Div>
            <Div className="flex items-center gap-2 mb-2">
              <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("get.widget.sections.identity")}
              </Span>
              <Span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                  statusColors[device.status.toUpperCase()] ??
                    "bg-muted text-muted-foreground",
                )}
              >
                {device.status}
              </Span>
              <Span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                  device.connected
                    ? "bg-success/10 text-success"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {device.connected
                  ? t("get.widget.badges.connected")
                  : t("get.widget.badges.disconnected")}
              </Span>
            </Div>
            <InfoRow
              label={t("get.widget.labels.name")}
              value={<Span className="font-mono">{device.name}</Span>}
            />
            <InfoRow
              label={t("get.widget.labels.label")}
              value={device.label}
            />
            {device.serialNumber && (
              <InfoRow
                label={t("get.widget.labels.serialNumber")}
                value={
                  <Span className="font-mono text-xs">
                    {device.serialNumber}
                  </Span>
                }
              />
            )}
            {device.firmwareVersion && (
              <InfoRow
                label={t("get.widget.labels.firmwareVersion")}
                value={
                  <Span className="font-mono text-xs">
                    {device.firmwareVersion}
                  </Span>
                }
              />
            )}
            {device.lastSeen && (
              <InfoRow
                label={t("get.widget.labels.lastSeen")}
                value={<Span className="text-xs">{device.lastSeen}</Span>}
              />
            )}
          </Div>

          <Div>
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
              {t("get.widget.sections.network")}
            </Span>
            <Div className="flex flex-wrap gap-2">
              <Span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                  device.vpnEnabled
                    ? "bg-success/10 text-success"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {device.vpnEnabled
                  ? t("get.widget.badges.vpnOn")
                  : t("get.widget.badges.vpnOff")}
              </Span>
              <Span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                  device.dataEnabled
                    ? "bg-success/10 text-success"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {device.dataEnabled
                  ? t("get.widget.badges.dataOn")
                  : t("get.widget.badges.dataOff")}
              </Span>
            </Div>
          </Div>
        </Div>
      )}
    </Div>
  );
}

export function DeviceUpdateContainer(): React.JSX.Element {
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PUT>();
  const form = useWidgetForm<typeof definition.PUT>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.PUT>();

  const isLoading = data === undefined;
  const device = data;

  const vpnEnabled = form.watch("vpnEnabled") ?? false;
  const dataEnabled = form.watch("dataEnabled") ?? false;
  const labelValue = form.watch("label") ?? "";

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
          {t("put.title")}
          {device && (
            <Span className="ml-1 text-muted-foreground font-normal">
              — {device.label || device.name}
            </Span>
          )}
        </Span>
      </Div>

      {isLoading ? (
        <Div className="h-48 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </Div>
      ) : (
        <Div className="px-4 py-3 flex flex-col gap-4">
          <Div>
            <Label className="block text-xs font-medium mb-1">
              {t("put.label.label")}
              <Span className="block text-xs text-muted-foreground font-normal mb-1">
                {t("put.label.description")}
              </Span>
            </Label>
            <Input
              value={labelValue}
              onChange={(e) =>
                form.setValue("label", e.target.value, { shouldDirty: true })
              }
              placeholder={t("put.label.placeholder")}
              className="w-full"
            />
          </Div>

          <Div className="divide-y border rounded-lg px-3">
            <BoolToggle
              value={vpnEnabled}
              onToggle={() =>
                form.setValue("vpnEnabled", !vpnEnabled, { shouldDirty: true })
              }
              label={t("put.vpnEnabled.label")}
              description={t("put.vpnEnabled.description")}
            />
            <BoolToggle
              value={dataEnabled}
              onToggle={() =>
                form.setValue("dataEnabled", !dataEnabled, {
                  shouldDirty: true,
                })
              }
              label={t("put.dataEnabled.label")}
              description={t("put.dataEnabled.description")}
            />
          </Div>

          <Button
            type="button"
            variant="default"
            className="w-full gap-2"
            onClick={onSubmit ?? undefined}
          >
            <Save className="h-4 w-4" />
            {t("put.submitButton.label")}
          </Button>
        </Div>
      )}
    </Div>
  );
}
