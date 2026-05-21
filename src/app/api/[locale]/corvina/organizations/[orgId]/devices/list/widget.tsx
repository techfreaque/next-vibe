"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { SubscriptionStatusType } from "@/app/api/[locale]/corvina/device-licenses/subscription/definition";

import type definition from "./definition";
import type { CorvinaDevicesListResponseOutput } from "./definition";

type Device = CorvinaDevicesListResponseOutput["devices"][number];

function SubscriptionBadge({
  status,
  daysUntilExpiry,
}: {
  status: SubscriptionStatusType | null | undefined;
  daysUntilExpiry: number | null | undefined;
}): React.JSX.Element | null {
  if (!status || status === "no_subscription") {
    return null;
  }
  const labels: Record<SubscriptionStatusType, string> = {
    trial: "trial",
    active: "active",
    expiring_soon: `exp ${daysUntilExpiry ?? "?"}d`,
    expired: "expired",
    no_subscription: "",
  };
  const classNames: Record<SubscriptionStatusType, string> = {
    trial: "text-xs font-semibold text-success",
    active: "text-xs font-semibold text-success",
    expiring_soon: "text-xs font-semibold text-warning",
    expired: "text-xs font-semibold text-destructive",
    no_subscription: "",
  };
  return <Span className={classNames[status]}>{labels[status]}</Span>;
}

function DeviceRow({
  device,
  onClick,
  onSubscription,
}: {
  device: Device;
  onClick: (device: Device) => void;
  onSubscription: (device: Device) => void;
}): React.JSX.Element {
  return (
    <Div
      className="group flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-accent cursor-pointer transition-colors"
      onClick={() => onClick(device)}
    >
      <Div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center relative">
        <Server className="h-4 w-4 text-primary" />
        {device.connected !== null && (
          <Span
            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${
              device.connected ? "bg-success" : "bg-muted-foreground"
            }`}
          />
        )}
      </Div>
      <Div className="flex-1 min-w-0">
        <Span className="font-semibold text-sm block truncate">
          {device.label}
        </Span>
        <Span className="font-mono text-xs text-muted-foreground block truncate">
          {device.hwId}
        </Span>
      </Div>
      <Span
        onClick={(e) => {
          e.stopPropagation();
          onSubscription(device);
        }}
        className="shrink-0 cursor-pointer"
      >
        {device.subscriptionStatus &&
        device.subscriptionStatus !== "no_subscription" ? (
          <SubscriptionBadge
            status={device.subscriptionStatus}
            daysUntilExpiry={device.daysUntilExpiry}
          />
        ) : (
          <Span className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors">
            —
          </Span>
        )}
      </Span>
    </Div>
  );
}

export function DeviceListContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { endpointMutations } = useWidgetContext();
  const { push: navigate, pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();

  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

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

  const handleSubscriptionClick = useCallback(
    (device: Device): void => {
      void (async (): Promise<void> => {
        const def =
          await import("../../../../device-licenses/subscription/definition");
        navigate(def.default.GET, { data: { logicalId: device.hwId } });
      })();
    },
    [navigate],
  );

  if (isCompact) {
    if (!data) {
      return <Div />;
    }
    return (
      <Div className="font-mono text-sm p-2">
        <Div className="font-semibold mb-1">
          {t("get.widget.title")} ({devices.length}/{total})
          {isMcp && ` — pass orgId to filter`}
        </Div>
        {devices.length === 0 ? (
          <Div className="text-muted-foreground">
            {t("get.widget.noDevicesFound")}
          </Div>
        ) : (
          devices.map((device) => (
            <Div key={device.id} className="py-1 font-mono text-sm">
              <Span className="font-semibold">{device.label}</Span>
              <Span className="ml-2 text-muted-foreground">{device.hwId}</Span>
              <Span className="ml-2 text-muted-foreground">
                {device.subscriptionStatus
                  ? `sub:${device.subscriptionStatus}`
                  : "sub:none"}
              </Span>
            </Div>
          ))
        )}
      </Div>
    );
  }

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
          {t("get.widget.title")}
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
              onClick={handleDeviceClick}
              onSubscription={handleSubscriptionClick}
            />
          ))
        )}
      </Div>
    </Div>
  );
}
