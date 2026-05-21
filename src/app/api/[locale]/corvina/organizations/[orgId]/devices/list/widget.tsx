"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Calendar } from "next-vibe-ui/ui/icons/Calendar";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { Wifi } from "next-vibe-ui/ui/icons/Wifi";
import { WifiOff } from "next-vibe-ui/ui/icons/WifiOff";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type definition from "./definition";
import type { CorvinaDevicesListResponseOutput } from "./definition";

type Device = CorvinaDevicesListResponseOutput["devices"][number];

// ── Helpers ───────────────────────────────────────────────────────────────────

function shortDate(ts: Date | string | null | undefined): string {
  if (!ts) {
    return "—";
  }
  const d = new Date(ts);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function daysFromNow(ts: Date | string | null | undefined): string {
  if (!ts) {
    return "—";
  }
  const ms = new Date(ts).getTime() - Date.now();
  const days = Math.ceil(ms / 86_400_000);
  if (days < 0) {
    return `${Math.abs(days)}d ago`;
  }
  if (days === 0) {
    return "today";
  }
  return `in ${days}d`;
}

type SubscriptionStatusType =
  | "trial"
  | "active"
  | "expiring_soon"
  | "expired"
  | "no_subscription";

const SUB_CONFIG: Record<
  SubscriptionStatusType,
  {
    bg: string;
    text: string;
    dot: string;
    label: (d?: number | null) => string;
  } | null
> = {
  trial: {
    bg: "bg-primary/10",
    text: "text-primary",
    dot: "bg-primary",
    label: () => "Trial",
  },
  active: {
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success",
    label: () => "Active",
  },
  expiring_soon: {
    bg: "bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
    label: (d) => `${d ?? "?"}d left`,
  },
  expired: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    dot: "bg-destructive",
    label: () => "Expired",
  },
  no_subscription: null,
};

// ── Device card ───────────────────────────────────────────────────────────────

function DeviceCard({
  device,
  onClick,
  onSubscription,
  t,
}: {
  device: Device;
  onClick: (d: Device) => void;
  onSubscription: (d: Device) => void;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
}): React.JSX.Element {
  const isOnline = device.connected === true;
  const isOffline = device.connected === false;
  const hasStatus = device.connected !== null;
  const subCfg = device.subscriptionStatus
    ? SUB_CONFIG[device.subscriptionStatus]
    : null;

  return (
    <Div
      className={cn(
        "group flex flex-col rounded-2xl border overflow-hidden cursor-pointer",
        "transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 active:shadow-sm active:translate-y-0",
        isOnline ? "border-success/25" : "border-border",
      )}
      onClick={() => onClick(device)}
    >
      {/* Status bar */}
      <Div
        className={cn(
          "h-1 w-full shrink-0",
          isOnline
            ? "bg-gradient-to-r from-success to-success/50"
            : isOffline
              ? "bg-muted/40"
              : "bg-transparent",
        )}
      />

      <Div className="p-3.5 flex flex-col gap-3 bg-card flex-1">
        {/* Top: icon + name + status */}
        <Div className="flex items-start gap-2.5">
          {/* Icon */}
          <Div
            className={cn(
              "w-9 h-9 rounded-xl shrink-0 flex items-center justify-center relative",
              isOnline ? "bg-success/10" : "bg-muted/50",
            )}
          >
            <Server
              className={cn(
                "h-4 w-4",
                isOnline ? "text-success" : "text-muted-foreground/50",
              )}
            />
            {hasStatus && (
              <Span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background",
                  isOnline ? "bg-success" : "bg-muted-foreground/40",
                )}
              />
            )}
          </Div>

          {/* Name + hwId */}
          <Div className="flex-1 min-w-0">
            <Span className="font-semibold text-sm block truncate leading-tight">
              {device.label}
            </Span>
            <Span className="font-mono text-[10px] text-muted-foreground block truncate">
              {device.hwId}
            </Span>
          </Div>

          {/* Online/offline pill */}
          {hasStatus && (
            <Span
              className={cn(
                "shrink-0 flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none",
                isOnline
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {isOnline ? (
                <Wifi className="h-2.5 w-2.5" />
              ) : (
                <WifiOff className="h-2.5 w-2.5" />
              )}
            </Span>
          )}
        </Div>

        {/* Middle: groups + orgResourceId */}
        {(device.orgResourceId ?? device.groups.length > 0) && (
          <Div className="flex flex-wrap gap-1">
            {device.orgResourceId && (
              <Span className="text-[10px] font-mono bg-muted/60 text-muted-foreground px-1.5 py-0.5 rounded-md truncate max-w-full">
                {device.orgResourceId}
              </Span>
            )}
            {device.groups.slice(0, 2).map((g) => (
              <Span
                key={g}
                className="text-[10px] font-mono bg-primary/6 text-primary/80 px-1.5 py-0.5 rounded-md"
              >
                {g}
              </Span>
            ))}
            {device.groups.length > 2 && (
              <Span className="text-[10px] text-muted-foreground px-1 py-0.5">
                +{device.groups.length - 2}
              </Span>
            )}
          </Div>
        )}

        {/* Bottom: subscription + dates */}
        <Div className="flex flex-col gap-1.5 pt-2 border-t border-border/40 mt-auto">
          <Div className="flex items-center justify-between">
            {/* Subscription badge */}
            {subCfg ? (
              <Span
                className={cn(
                  "text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded-md",
                  subCfg.bg,
                  subCfg.text,
                )}
              >
                <Span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    subCfg.dot,
                  )}
                />
                {subCfg.label(device.daysUntilExpiry)}
              </Span>
            ) : (
              <Span className="text-[10px] text-muted-foreground/30">
                {t("get.widget.noSub")}
              </Span>
            )}
            {/* ID chip */}
            <Span className="text-[10px] font-mono text-muted-foreground/40">
              #{device.id}
            </Span>
          </Div>

          {/* Dates row */}
          {(device.trialStartDate ?? device.subscriptionEndDate) && (
            <Div className="flex items-center gap-3 flex-wrap">
              {device.trialStartDate && (
                <Span className="flex items-center gap-1 text-[9px] text-muted-foreground/50">
                  <Clock className="h-2.5 w-2.5 shrink-0" />
                  <Span className="font-mono">
                    {shortDate(device.trialStartDate)}
                  </Span>
                </Span>
              )}
              {device.subscriptionEndDate && (
                <Span
                  className={cn(
                    "flex items-center gap-1 text-[9px] font-mono",
                    device.daysUntilExpiry !== null &&
                      device.daysUntilExpiry !== undefined &&
                      device.daysUntilExpiry <= 7
                      ? "text-destructive/70"
                      : "text-muted-foreground/50",
                  )}
                >
                  <Clock className="h-2.5 w-2.5 shrink-0" />
                  {daysFromNow(device.subscriptionEndDate)}
                </Span>
              )}
            </Div>
          )}

          {/* Subscription action */}
          <Button
            type="button"
            variant={
              !device.subscriptionStatus ||
              device.subscriptionStatus === "no_subscription" ||
              device.subscriptionStatus === "expired"
                ? "default"
                : "outline"
            }
            size="sm"
            className="w-full h-7 gap-1.5 text-[11px] font-semibold mt-1"
            onClick={(e) => {
              e.stopPropagation();
              onSubscription(device);
            }}
          >
            <Calendar className="h-3 w-3" />
            {t("get.widget.manageSubscription")}
          </Button>
        </Div>
      </Div>
    </Div>
  );
}

// ── Stats strip ────────────────────────────────────────────────────────────────

function StatsStrip({
  devices,
  total,
  t,
}: {
  devices: Device[];
  total: number;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
}): React.JSX.Element | null {
  if (devices.length === 0) {
    return null;
  }
  const online = devices.filter((d) => d.connected === true).length;
  const subscribed = devices.filter(
    (d) =>
      d.subscriptionStatus &&
      d.subscriptionStatus !== "no_subscription" &&
      d.subscriptionStatus !== "expired",
  ).length;
  return (
    <Div className="flex items-center gap-4 px-4 py-2 bg-muted/20 border-b text-[11px] text-muted-foreground">
      <Span className="flex items-center gap-1.5">
        <Span className="w-1.5 h-1.5 rounded-full bg-success" />
        {online} {t("get.widget.onlineCount")}
      </Span>
      <Span className="flex items-center gap-1.5">
        <Span className="w-1.5 h-1.5 rounded-full bg-primary" />
        {subscribed} {t("get.widget.subscribedCount")}
      </Span>
      <Span className="ml-auto opacity-50">
        {devices.length}/{total}
      </Span>
    </Div>
  );
}

// ── Main container ─────────────────────────────────────────────────────────────

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
        const def = await import("../[deviceId]/definition");
        navigate(def.default.GET, {
          urlPathParams: { orgId, deviceId: device.hwId },
        });
      })();
    },
    [navigate, orgId],
  );

  const handleCreate = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../create/definition");
      navigate(def.default.POST, { urlPathParams: { orgId } });
    })();
  }, [navigate, orgId]);

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

  // ── Compact ──
  if (isCompact) {
    if (!data) {
      return <Div />;
    }
    return (
      <Div className="flex-col">
        <Div>{`${t("get.widget.title")} (${devices.length}/${total})`}</Div>
        {devices.length === 0 ? (
          <Div>{t("get.widget.noDevicesFound")}</Div>
        ) : (
          devices.map((d) => {
            const subText =
              d.subscriptionStatus && d.subscriptionStatus !== "no_subscription"
                ? ` [${SUB_CONFIG[d.subscriptionStatus]?.label(d.daysUntilExpiry) ?? d.subscriptionStatus}]`
                : "";
            const dateText = d.subscriptionEndDate
              ? ` ${daysFromNow(d.subscriptionEndDate)}`
              : "";
            return (
              <Div key={d.id}>
                {`${d.connected ? "●" : "○"} ${d.label} · ${d.hwId}${subText}${dateText}`}
              </Div>
            );
          })
        )}
      </Div>
    );
  }

  // ── Web ──
  return (
    <Div className="flex flex-col min-h-0">
      {/* Header */}
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
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
        <Span className="font-bold text-sm mr-auto">
          {t("get.widget.title")}
          {total > 0 && (
            <Span className="ml-1.5 text-xs font-normal text-muted-foreground">
              {total}
            </Span>
          )}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="h-7 gap-1.5 px-3"
          onClick={handleCreate}
        >
          <Plus className="h-3.5 w-3.5" />
          <Span className="text-xs font-semibold">{t("get.widget.add")}</Span>
        </Button>
      </Div>

      {/* Stats */}
      {!isLoading && <StatsStrip devices={devices} total={total} t={t} />}

      {/* Content */}
      <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-160px))]">
        {isLoading ? (
          <Div className="h-52 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <Span className="text-xs text-muted-foreground">
              {t("get.widget.loading")}
            </Span>
          </Div>
        ) : devices.length === 0 ? (
          <Div className="h-52 flex flex-col items-center justify-center gap-4 px-8">
            <Div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              <Server className="h-6 w-6 text-muted-foreground/30" />
            </Div>
            <Div className="text-center">
              <Span className="font-semibold text-sm block">
                {t("get.widget.noDevicesFound")}
              </Span>
              <Span className="text-xs text-muted-foreground block mt-1">
                {t("get.widget.noDevicesHint")}
              </Span>
            </Div>
            <Button
              type="button"
              variant="default"
              size="sm"
              className="gap-1.5"
              onClick={handleCreate}
            >
              <Plus className="h-3.5 w-3.5" />
              {t("get.widget.registerDevice")}
            </Button>
          </Div>
        ) : (
          <Div className="p-3 grid grid-cols-2 gap-2.5">
            {devices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onClick={handleDeviceClick}
                onSubscription={handleSubscriptionClick}
                t={t}
              />
            ))}
          </Div>
        )}
      </Div>
    </Div>
  );
}
