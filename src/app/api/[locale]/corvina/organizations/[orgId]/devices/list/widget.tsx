"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { CorvinaDeviceStatusValue } from "../enums";
import { CorvinaDeviceStatus } from "../enums";
import type definition from "./definition";
import type { CorvinaDevicesListResponseOutput } from "./definition";

type Device = CorvinaDevicesListResponseOutput["devices"][number];

const SEP = "·";

const STATUS_COLORS: Record<typeof CorvinaDeviceStatusValue, string> = {
  [CorvinaDeviceStatus.ACTIVE]: "bg-success/10 text-success",
  [CorvinaDeviceStatus.INACTIVE]: "bg-muted text-muted-foreground",
  [CorvinaDeviceStatus.ERROR]: "bg-destructive/10 text-destructive",
  [CorvinaDeviceStatus.UNKNOWN]: "bg-muted text-muted-foreground",
};

function DeviceRow({
  device,
  t,
  onClick,
}: {
  device: Device;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  onClick: (device: Device) => void;
}): React.JSX.Element {
  return (
    <Div
      className="group flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-accent cursor-pointer transition-colors"
      onClick={() => onClick(device)}
    >
      <Div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Server className="h-4 w-4 text-primary" />
      </Div>
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm">
            {device.label || device.name}
          </Span>
          <Span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              STATUS_COLORS[device.status],
            )}
          >
            {t(device.status)}
          </Span>
        </Div>
        <Div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <Span className="font-mono">{device.name}</Span>
          {device.serialNumber && (
            <>
              <Span>{SEP}</Span>
              <Span>{device.serialNumber}</Span>
            </>
          )}
        </Div>
      </Div>
      <Div className="flex items-center gap-2 shrink-0">
        <Span
          className={cn(
            "inline-flex w-2 h-2 rounded-full",
            device.connected ? "bg-success" : "bg-muted-foreground/30",
          )}
        />
        <Span className="text-xs text-muted-foreground">
          {device.connected
            ? t("get.widget.connected")
            : t("get.widget.disconnected")}
        </Span>
      </Div>
    </Div>
  );
}

export function DeviceListContainer(): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const { push: navigate, pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();

  const orgId = form.watch("orgId") ?? 0;
  const devices = data?.devices ?? [];
  const total = data?.total ?? 0;
  const isLoading = data === undefined;

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleDeviceClick = useCallback(
    (device: Device): void => {
      void (async (): Promise<void> => {
        const detail = await import("../[deviceId]/definition");
        navigate(detail.default.GET, {
          urlPathParams: { orgId, deviceId: device.id },
        });
      })();
    },
    [navigate, orgId],
  );

  const handleCreate = useCallback((): void => {
    void (async (): Promise<void> => {
      const create = await import("../create/definition");
      navigate(create.default.POST, { urlPathParams: { orgId } });
    })();
  }, [navigate, orgId]);

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
        <Server className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.title")}
          {total > 0 && (
            <Span className="ml-2 text-xs text-muted-foreground font-normal">
              ({total})
            </Span>
          )}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCreate}
          title="Add device"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))]">
        {isLoading ? (
          <Div className="h-48 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Div>
        ) : devices.length === 0 ? (
          <Div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Server className="h-8 w-8 opacity-30" />
            <Span className="text-sm">{t("get.widget.noDevicesFound")}</Span>
          </Div>
        ) : (
          devices.map((device) => (
            <DeviceRow
              key={device.id}
              device={device}
              t={t}
              onClick={handleDeviceClick}
            />
          ))
        )}
      </Div>
    </Div>
  );
}
