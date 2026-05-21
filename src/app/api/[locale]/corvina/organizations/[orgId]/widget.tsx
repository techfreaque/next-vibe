"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Bell } from "next-vibe-ui/ui/icons/Bell";
import { Building } from "next-vibe-ui/ui/icons/Building";
import { Calendar } from "next-vibe-ui/ui/icons/Calendar";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { ShoppingCart } from "next-vibe-ui/ui/icons/ShoppingCart";
import { Wifi } from "next-vibe-ui/ui/icons/Wifi";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo } from "react";

import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { cn } from "@/app/api/[locale]/shared/utils";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { CorvinaOrgStatus } from "../enums";
import type { CorvinaOrgStatusValue } from "../enums";
import type definition from "./definition";
import type { CorvinaOrganizationGetResponseOutput } from "./definition";
import type { CorvinaDevicesListResponseOutput } from "./devices/list/definition";
import deviceListDefinition from "./devices/list/definition";
import type { CorvinaUsersListResponseOutput } from "./users/list/definition";
import usersListDefinition from "./users/list/definition";

type Org = CorvinaOrganizationGetResponseOutput;
type Device = CorvinaDevicesListResponseOutput["devices"][number];
type OrgUser = CorvinaUsersListResponseOutput["users"][number];

// ── Configs ────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  typeof CorvinaOrgStatusValue,
  { bar: string; badge: string; dot: string; icon: string }
> = {
  [CorvinaOrgStatus.DONE]: {
    bar: "bg-gradient-to-r from-success to-success/30",
    badge: "bg-success/10 text-success",
    dot: "bg-success",
    icon: "text-success",
  },
  [CorvinaOrgStatus.NEW]: {
    bar: "bg-gradient-to-r from-primary to-primary/30",
    badge: "bg-primary/10 text-primary",
    dot: "bg-primary",
    icon: "text-primary/60",
  },
  [CorvinaOrgStatus.PROVISIONING]: {
    bar: "bg-gradient-to-r from-warning to-warning/30",
    badge: "bg-warning/10 text-warning",
    dot: "bg-warning animate-pulse",
    icon: "text-warning/60",
  },
  [CorvinaOrgStatus.DELETING]: {
    bar: "bg-gradient-to-r from-warning to-warning/30",
    badge: "bg-warning/10 text-warning",
    dot: "bg-warning",
    icon: "text-warning/60",
  },
  [CorvinaOrgStatus.DELETED]: {
    bar: "bg-muted/30",
    badge: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground/40",
    icon: "text-muted-foreground/30",
  },
};

type SubStatus =
  | "trial"
  | "active"
  | "expiring_soon"
  | "expired"
  | "no_subscription";

const SUB_CONFIG: Record<
  SubStatus,
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

// ── Shared form helpers ────────────────────────────────────────────────────────

function Toggle({
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
    <Div className="flex items-center justify-between px-4 py-3 border-b last:border-b-0">
      <Div className="flex-1 min-w-0 pr-4">
        <Span className="text-sm font-medium block">{label}</Span>
        <Span className="block text-xs text-muted-foreground mt-0.5">
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

function FormField({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold">{label}</Label>
      {children}
      {description && (
        <Span className="text-[11px] text-muted-foreground">{description}</Span>
      )}
    </Div>
  );
}

// ── Device card ────────────────────────────────────────────────────────────────

function DeviceCard({
  device,
  noSubLabel,
  onView,
  onSubscription,
  onSetPeriod,
}: {
  device: Device;
  noSubLabel: string;
  onView: (d: Device) => void;
  onSubscription: (d: Device) => void;
  onSetPeriod: (d: Device) => void;
}): React.JSX.Element {
  const isOnline = device.connected === true;
  const hasStatus = device.connected !== null && device.connected !== undefined;
  const subStatus = device.subscriptionStatus as SubStatus | undefined;
  const subCfg = subStatus ? SUB_CONFIG[subStatus] : null;
  const needsSub =
    !subStatus || subStatus === "no_subscription" || subStatus === "expired";

  return (
    <Div
      className={cn(
        "rounded-2xl border bg-card overflow-hidden",
        isOnline ? "border-success/20" : "border-border",
      )}
    >
      <Div
        className={cn("h-0.5 w-full", isOnline ? "bg-success" : "bg-muted/20")}
      />
      <Div className="px-3 py-2.5 flex items-center gap-2.5">
        <Div
          className={cn(
            "w-8 h-8 rounded-xl shrink-0 flex items-center justify-center relative",
            isOnline ? "bg-success/10" : "bg-muted/40",
          )}
        >
          <Server
            className={cn(
              "h-3.5 w-3.5",
              isOnline ? "text-success" : "text-muted-foreground/40",
            )}
          />
          {hasStatus && (
            <Span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-[1.5px] border-background",
                isOnline ? "bg-success" : "bg-muted-foreground/30",
              )}
            />
          )}
        </Div>

        <Button
          type="button"
          variant="ghost"
          className="flex-1 min-w-0 h-auto p-0 flex flex-col items-start justify-center hover:bg-transparent"
          onClick={() => onView(device)}
        >
          <Span className="font-semibold text-sm block truncate leading-tight w-full text-left">
            {device.label}
          </Span>
          <Span className="font-mono text-[10px] text-muted-foreground block truncate w-full text-left">
            {device.hwId}
          </Span>
        </Button>

        {needsSub ? (
          <Button
            type="button"
            variant="ghost"
            className="shrink-0 flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 h-auto min-h-0"
            onClick={() => onSetPeriod(device)}
          >
            <Span className="w-1.5 h-1.5 rounded-full shrink-0 bg-destructive" />
            {noSubLabel}
          </Button>
        ) : subCfg ? (
          <Span
            className={cn(
              "shrink-0 flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
              subCfg.bg,
              subCfg.text,
            )}
          >
            <Span
              className={cn("w-1.5 h-1.5 rounded-full shrink-0", subCfg.dot)}
            />
            {subCfg.label(device.daysUntilExpiry)}
          </Span>
        ) : null}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground shrink-0"
          onClick={() => onSubscription(device)}
        >
          <Calendar className="h-3.5 w-3.5" />
        </Button>
      </Div>
    </Div>
  );
}

// ── Org detail ─────────────────────────────────────────────────────────────────

export function OrgDetailContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { push: navigate, pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const { logger, user } = useWidgetContext();

  const org = data as Org | undefined;
  const isLoading = data === undefined;
  const cfg = org ? STATUS_CONFIG[org.status] : null;
  const isCompact = platform === Platform.CLI || platform === Platform.MCP;

  const endpointOptions = useMemo(
    () =>
      org
        ? {
            read: {
              urlPathParams: { orgId: org.orgId },
            },
          }
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [org?.orgId],
  );
  const deviceEndpoint = useEndpoint(
    deviceListDefinition,
    endpointOptions ?? { read: { urlPathParams: { orgId: 0 } } },
    logger,
    user,
  );
  const usersEndpoint = useEndpoint(
    usersListDefinition,
    endpointOptions
      ? {
          read: {
            urlPathParams: { orgId: endpointOptions.read.urlPathParams.orgId },
            initialState: { page: 0, pageSize: 5 },
          },
        }
      : {
          read: {
            urlPathParams: { orgId: 0 },
            initialState: { page: 0, pageSize: 5 },
          },
        },
    logger,
    user,
  );
  const devices: Device[] = useMemo(
    () =>
      deviceEndpoint.read?.response?.success
        ? deviceEndpoint.read.response.data.devices
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deviceEndpoint.read?.response],
  );
  const orgUsers: OrgUser[] = useMemo(
    () =>
      usersEndpoint.read?.response?.success
        ? usersEndpoint.read.response.data.users
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [usersEndpoint.read?.response],
  );
  const devicesLoading = !deviceEndpoint.read?.response && !!org;

  // -- online/subscription summary
  const onlineCount = useMemo(
    () => devices.filter((d) => d.connected === true).length,
    [devices],
  );
  const needsSubDevices = useMemo(
    () =>
      devices.filter(
        (d) =>
          !d.subscriptionStatus ||
          d.subscriptionStatus === "no_subscription" ||
          d.subscriptionStatus === "expired",
      ),
    [devices],
  );
  const needsSubCount = needsSubDevices.length;

  const handleEdit = useCallback((): void => {
    if (!org) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("./definition");
      navigate(def.default.PUT, { urlPathParams: { orgId: org.orgId } });
    })();
  }, [navigate, org]);

  const handleDeviceView = useCallback(
    (device: Device): void => {
      if (!org) {
        return;
      }
      void (async (): Promise<void> => {
        const def = await import("./devices/[deviceId]/definition");
        navigate(def.default.GET, {
          urlPathParams: { orgId: org.orgId, deviceId: device.hwId },
        });
      })();
    },
    [navigate, org],
  );

  const handleDeviceSubscription = useCallback(
    (device: Device): void => {
      void (async (): Promise<void> => {
        const def =
          await import("../../device-licenses/subscription/definition");
        navigate(def.default.GET, { data: { logicalId: device.hwId } });
      })();
    },
    [navigate],
  );

  const handleBulkBuy = useCallback((): void => {
    if (!needsSubDevices.length) {
      return;
    }
    void (async (): Promise<void> => {
      const def =
        await import("../../device-licenses/purchase-inquiry/definition");
      const firstUser = orgUsers.find((u) => !u.serviceAccount) ?? orgUsers[0];
      const contactName = firstUser
        ? [firstUser.firstName, firstUser.lastName].filter(Boolean).join(" ") ||
          firstUser.username
        : undefined;
      navigate(def.default.POST, {
        data: {
          logicalId: needsSubDevices.map((d) => d.hwId),
          deviceLabel: needsSubDevices.map((d) => d.label),
          orgResourceId: org?.resourceId ?? "",
          contactEmail: firstUser?.email,
          contactName: contactName ?? undefined,
        },
      });
    })();
  }, [navigate, org, orgUsers, needsSubDevices]);

  const handleSetPeriod = useCallback(
    (device: Device): void => {
      void (async (): Promise<void> => {
        const def =
          await import("../../device-licenses/subscription/definition");
        navigate(def.default.POST, {
          data: {
            logicalId: device.hwId,
            orgResourceId: org?.resourceId ?? undefined,
          },
        });
      })();
    },
    [navigate, org],
  );

  const handleDeviceCreate = useCallback((): void => {
    if (!org) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("./devices/create/definition");
      navigate(def.default.POST, { urlPathParams: { orgId: org.orgId } });
    })();
  }, [navigate, org]);

  // ── Compact ──
  if (isCompact) {
    if (!org) {
      return <Div />;
    }
    return (
      <Div className="flex-col">
        <Div>{`${t(org.status)} · ${org.label} · ${org.name}`}</Div>
        {org.resourceId && <Div>{`resourceId: ${org.resourceId}`}</Div>}
        <Div>
          {[
            org.vpnEnabled ? "vpn:on" : "vpn:off",
            org.dataEnabled ? "data:on" : "data:off",
            org.mfaRequired ? "mfa:on" : null,
            org.privateAccess ? "private" : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </Div>
        {org.hostname && <Div>{`hostname: ${org.hostname}`}</Div>}
        {devices.length > 0 && (
          <Div>{`devices: ${devices.length} (online: ${onlineCount})`}</Div>
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0 bg-background">
      {/* Top bar */}
      <Div className="flex items-center gap-2 px-3 py-2.5 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 shrink-0"
          onClick={() => goBack()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Span className="font-bold text-sm mr-auto truncate">
          {isLoading ? t("get.widget.loading") : (org?.label ?? t("get.title"))}
        </Span>
        {org && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 gap-1 px-2 text-xs shrink-0"
            onClick={handleEdit}
          >
            <Pencil className="h-3 w-3" />
            {t("get.widget.edit")}
          </Button>
        )}
      </Div>

      {isLoading ? (
        <Div className="h-52 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <Span className="text-xs text-muted-foreground">
            {t("get.widget.loading")}
          </Span>
        </Div>
      ) : !org || !cfg ? null : (
        <Div className="overflow-y-auto flex-1 max-h-[min(820px,calc(100dvh-56px))]">
          {/* ── Hero: status + summary ── */}
          <Div className={cn("h-1 w-full shrink-0", cfg.bar)} />
          <Div className="px-4 pt-4 pb-3 flex items-start gap-3">
            <Div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5",
                org.status === CorvinaOrgStatus.DONE
                  ? "bg-success/10"
                  : "bg-muted/50",
              )}
            >
              <Building className={cn("h-6 w-6", cfg.icon)} />
            </Div>
            <Div className="flex-1 min-w-0">
              <Div className="flex items-center gap-2 flex-wrap">
                <Span className="font-bold text-base leading-tight truncate">
                  {org.label}
                </Span>
                <Span
                  className={cn(
                    "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0",
                    cfg.badge,
                  )}
                >
                  <Span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                  {t(org.status)}
                </Span>
              </Div>
              <Span className="font-mono text-[11px] text-muted-foreground block truncate mt-0.5">
                {org.resourceId ?? org.name}
              </Span>
              {/* Device summary — shown once devices load */}
              {!devicesLoading && devices.length > 0 && (
                <Div className="flex items-center gap-3 mt-2">
                  <Span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        onlineCount > 0
                          ? "bg-success"
                          : "bg-muted-foreground/30",
                      )}
                    />
                    {onlineCount}/{devices.length}{" "}
                    {t("get.widget.devicesSubtitle")}
                  </Span>
                  {needsSubCount > 0 && (
                    <Span className="flex items-center gap-1 text-[11px] text-destructive/80">
                      <Bell className="h-2.5 w-2.5" />
                      {needsSubCount} {t("get.widget.deviceNoSub")}
                    </Span>
                  )}
                </Div>
              )}
            </Div>
          </Div>

          {/* ── Feature flags — compact pill row ── */}
          <Div className="px-4 pb-3 flex flex-wrap gap-1.5">
            {[
              {
                on: org.vpnEnabled,
                icon: <Wifi className="h-2.5 w-2.5" />,
                onL: t("get.widget.badges.vpnOn"),
                offL: t("get.widget.badges.vpnOff"),
              },
              {
                on: org.dataEnabled,
                icon: null,
                onL: t("get.widget.badges.dataOn"),
                offL: t("get.widget.badges.dataOff"),
              },
              {
                on: org.mfaRequired,
                icon: <Shield className="h-2.5 w-2.5" />,
                onL: t("get.widget.badges.mfaRequired"),
                offL: null,
              },
              {
                on: org.privateAccess,
                icon: null,
                onL: t("get.widget.badges.private"),
                offL: t("get.widget.badges.public"),
              },
              {
                on: org.storeEnabled,
                icon: null,
                onL: t("get.widget.badges.storeOn"),
                offL: null,
              },
            ].map(({ on, icon, onL, offL }, i) => {
              if (!on && !offL) {
                return null;
              }
              return (
                <Span
                  key={i}
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold",
                    on
                      ? "bg-success/10 text-success"
                      : "bg-muted/50 text-muted-foreground/60",
                  )}
                >
                  {on && icon}
                  {on ? onL : offL}
                </Span>
              );
            })}
            {org.dataTemporarilyDisabled && (
              <Span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-destructive/10 text-destructive">
                <Bell className="h-2.5 w-2.5" />
                {t("get.widget.badges.dataTemporarilyDisabled")}
              </Span>
            )}
          </Div>

          {/* ── Devices ── */}
          <Div className="px-4 pb-1">
            <Div className="flex items-center justify-between mb-2">
              <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("get.widget.devices")}
              </Span>
              <Div className="flex items-center gap-1.5">
                {needsSubCount > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-6 gap-1 px-2.5 text-[11px] font-semibold"
                    onClick={handleBulkBuy}
                  >
                    <ShoppingCart className="h-2.5 w-2.5" />
                    {t("get.widget.deviceBuy")} ({needsSubCount})
                  </Button>
                )}
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="h-6 gap-1 px-2.5 text-[11px] font-semibold"
                  onClick={handleDeviceCreate}
                >
                  <Plus className="h-2.5 w-2.5" />
                  {t("get.widget.deviceAdd")}
                </Button>
              </Div>
            </Div>

            {devicesLoading ? (
              <Div className="flex items-center justify-center py-8 rounded-2xl border border-dashed">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </Div>
            ) : devices.length === 0 ? (
              <Div className="flex flex-col items-center gap-2 py-8 rounded-2xl border border-dashed">
                <Server className="h-8 w-8 text-muted-foreground/15" />
                <Span className="text-xs text-muted-foreground">
                  {t("get.widget.deviceNone")}
                </Span>
              </Div>
            ) : (
              <Div className="flex flex-col gap-2">
                {devices.map((device) => (
                  <DeviceCard
                    key={device.id}
                    device={device}
                    noSubLabel={t("get.widget.deviceNoSub")}
                    onView={handleDeviceView}
                    onSubscription={handleDeviceSubscription}
                    onSetPeriod={handleSetPeriod}
                  />
                ))}
              </Div>
            )}
          </Div>

          <Div className="pb-4" />
        </Div>
      )}
    </Div>
  );
}

// ── Org update ─────────────────────────────────────────────────────────────────

export function OrgUpdateContainer(): React.JSX.Element {
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PUT>();
  const form = useWidgetForm<typeof definition.PUT>();
  const onSubmit = useWidgetOnSubmit();
  const saved = useWidgetValue<typeof definition.PUT>();

  const dataEnabled = form.watch("dataEnabled") ?? false;
  const vpnEnabled = form.watch("vpnEnabled") ?? false;
  const privateAccess = form.watch("privateAccess") ?? false;
  const allowDisablePrivateAccess =
    form.watch("allowDisablePrivateAccess") ?? false;
  const allowHostname = form.watch("allowHostname") ?? false;
  const storeEnabled = form.watch("storeEnabled") ?? false;
  const mfaRequired = form.watch("mfaRequired") ?? false;
  const labelValue = form.watch("label") ?? "";
  const hostnameValue = form.watch("hostname") ?? "";
  const ipWhitelistValue = form.watch("ipAddressesWhitelist") ?? "";

  if (saved !== undefined) {
    return (
      <Div className="flex flex-col min-h-0 bg-background">
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
          <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <Span className="font-bold text-sm mr-auto">
            {t("put.success.title")}
          </Span>
        </Div>
        <Div className="p-6 flex flex-col items-center gap-5">
          <Div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
            <Check className="h-7 w-7 text-success" />
          </Div>
          <Div className="text-center">
            <Span className="block font-bold text-base">{saved.label}</Span>
            <Span className="block text-sm text-muted-foreground mt-1">
              {t("put.success.description")}
            </Span>
          </Div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => goBack()}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("put.widget.back")}
          </Button>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0 bg-background">
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
        <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Span className="font-bold text-sm mr-auto">{t("put.title")}</Span>
      </Div>

      <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-56px))] p-4 flex flex-col gap-3">
        {/* Identity */}
        <Div className="rounded-2xl border bg-card overflow-hidden">
          <Div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/20">
            <Building className="h-3.5 w-3.5 text-muted-foreground" />
            <Span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t("put.container.title")}
            </Span>
          </Div>
          <Div className="p-4 flex flex-col gap-4">
            <FormField
              label={t("put.label.label")}
              description={t("put.label.description")}
            >
              <Input
                value={labelValue}
                onChange={(e) =>
                  form.setValue("label", e.target.value, { shouldDirty: true })
                }
                placeholder={t("put.label.placeholder")}
              />
            </FormField>
            <FormField
              label={t("put.hostname.label")}
              description={t("put.hostname.description")}
            >
              <Input
                value={hostnameValue}
                onChange={(e) =>
                  form.setValue("hostname", e.target.value || null, {
                    shouldDirty: true,
                  })
                }
                placeholder={t("put.hostname.placeholder")}
                className="font-mono"
              />
            </FormField>
            <FormField
              label={t("put.ipAddressesWhitelist.label")}
              description={t("put.ipAddressesWhitelist.description")}
            >
              <Input
                value={ipWhitelistValue}
                onChange={(e) =>
                  form.setValue(
                    "ipAddressesWhitelist",
                    e.target.value || null,
                    { shouldDirty: true },
                  )
                }
                placeholder={t("put.ipAddressesWhitelist.placeholder")}
                className="font-mono"
              />
            </FormField>
          </Div>
        </Div>

        {/* Network */}
        <Div className="rounded-2xl border bg-card overflow-hidden">
          <Div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/20">
            <Wifi className="h-3.5 w-3.5 text-muted-foreground" />
            <Span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t("get.widget.sections.network")}
            </Span>
          </Div>
          <Toggle
            value={dataEnabled}
            onToggle={() =>
              form.setValue("dataEnabled", !dataEnabled, { shouldDirty: true })
            }
            label={t("put.dataEnabled.label")}
            description={t("put.dataEnabled.description")}
          />
          <Toggle
            value={vpnEnabled}
            onToggle={() =>
              form.setValue("vpnEnabled", !vpnEnabled, { shouldDirty: true })
            }
            label={t("put.vpnEnabled.label")}
            description={t("put.vpnEnabled.description")}
          />
          <Toggle
            value={privateAccess}
            onToggle={() =>
              form.setValue("privateAccess", !privateAccess, {
                shouldDirty: true,
              })
            }
            label={t("put.privateAccess.label")}
            description={t("put.privateAccess.description")}
          />
          <Toggle
            value={allowDisablePrivateAccess}
            onToggle={() =>
              form.setValue(
                "allowDisablePrivateAccess",
                !allowDisablePrivateAccess,
                { shouldDirty: true },
              )
            }
            label={t("put.allowDisablePrivateAccess.label")}
            description={t("put.allowDisablePrivateAccess.description")}
          />
          <Toggle
            value={allowHostname}
            onToggle={() =>
              form.setValue("allowHostname", !allowHostname, {
                shouldDirty: true,
              })
            }
            label={t("put.allowHostname.label")}
            description={t("put.allowHostname.description")}
          />
        </Div>

        {/* Security */}
        <Div className="rounded-2xl border bg-card overflow-hidden">
          <Div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/20">
            <Shield className="h-3.5 w-3.5 text-muted-foreground" />
            <Span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t("get.widget.sections.securityServices")}
            </Span>
          </Div>
          <Toggle
            value={storeEnabled}
            onToggle={() =>
              form.setValue("storeEnabled", !storeEnabled, {
                shouldDirty: true,
              })
            }
            label={t("put.storeEnabled.label")}
            description={t("put.storeEnabled.description")}
          />
          <Toggle
            value={mfaRequired}
            onToggle={() =>
              form.setValue("mfaRequired", !mfaRequired, { shouldDirty: true })
            }
            label={t("put.mfaRequired.label")}
            description={t("put.mfaRequired.description")}
          />
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2 h-10 text-sm font-semibold"
          onClick={onSubmit ?? undefined}
        >
          <Save className="h-4 w-4" />
          {t("put.submitButton.label")}
        </Button>
      </Div>
    </Div>
  );
}
