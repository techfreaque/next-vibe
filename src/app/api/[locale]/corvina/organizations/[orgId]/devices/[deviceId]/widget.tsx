"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Activity } from "next-vibe-ui/ui/icons/Activity";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Calendar } from "next-vibe-ui/ui/icons/Calendar";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Cpu } from "next-vibe-ui/ui/icons/Cpu";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { Tag } from "next-vibe-ui/ui/icons/Tag";
import { Trash } from "next-vibe-ui/ui/icons/Trash";
import { Wifi } from "next-vibe-ui/ui/icons/Wifi";
import { WifiOff } from "next-vibe-ui/ui/icons/WifiOff";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { CorvinaDeviceGetResponseOutput } from "./definition";

type Device = CorvinaDeviceGetResponseOutput;

type SubscriptionStatusType =
  | "trial"
  | "active"
  | "expiring_soon"
  | "expired"
  | "no_subscription";

// ─── Constants ────────────────────────────────────────────────────────────────

const SUB_CONFIG: Record<
  SubscriptionStatusType,
  {
    bg: string;
    text: string;
    border: string;
    label: (d?: number | null) => string;
  } | null
> = {
  trial: {
    bg: "bg-primary/8",
    text: "text-primary",
    border: "border-primary/20",
    label: () => "Trial",
  },
  active: {
    bg: "bg-success/8",
    text: "text-success",
    border: "border-success/20",
    label: () => "Active",
  },
  expiring_soon: {
    bg: "bg-warning/8",
    text: "text-warning",
    border: "border-warning/20",
    label: (d) => `Expires in ${d ?? "?"} days`,
  },
  expired: {
    bg: "bg-destructive/8",
    text: "text-destructive",
    border: "border-destructive/20",
    label: () => "Expired",
  },
  no_subscription: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTs(ts: Date | string | null | undefined): string {
  if (!ts) {
    return "—";
  }
  try {
    return new Date(ts).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(ts);
  }
}

function toDateInput(val: Date | string | null | undefined): string {
  if (!val) {
    return "";
  }
  try {
    return new Date(val).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function TopBar({
  onBack,
  children,
}: {
  onBack: () => void;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex items-center gap-2 px-3 py-2.5 border-b shrink-0 bg-background">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 shrink-0"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      {children}
    </Div>
  );
}

function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <Div
      className={cn(
        "rounded-2xl border bg-card shadow-xs overflow-hidden",
        className,
      )}
    >
      {children}
    </Div>
  );
}

function SectionHead({
  icon,
  label,
  right,
}: {
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/20">
      <Span className="text-muted-foreground">{icon}</Span>
      <Span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Span>
      {right && <Div className="ml-auto">{right}</Div>}
    </Div>
  );
}

function DataRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}): React.JSX.Element {
  return (
    <Div className="flex items-start gap-3 py-2.5 border-b last:border-b-0 px-4">
      <Span className="text-xs text-muted-foreground w-28 shrink-0 pt-0.5 leading-snug">
        {label}
      </Span>
      <Div
        className={cn(
          "flex-1 text-sm leading-snug break-all",
          mono ? "font-mono text-[12px]" : "font-medium",
        )}
      >
        {value}
      </Div>
    </Div>
  );
}

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold">{label}</Label>
      {children}
      {hint && (
        <Span className="text-[11px] text-muted-foreground leading-snug">
          {hint}
        </Span>
      )}
    </Div>
  );
}

// ─── DeviceDetailContainer ────────────────────────────────────────────────────

export function DeviceDetailContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { push: navigate, pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const device = data as Device | undefined;
  const isLoading = data === undefined;
  const isCompact = platform === Platform.CLI || platform === Platform.MCP;

  const isOnline = device?.connected === true;
  const isOffline = device?.connected === false;
  const hasConnectedStatus =
    device?.connected !== null && device?.connected !== undefined;
  const subCfg =
    device?.subscriptionStatus &&
    device.subscriptionStatus !== "no_subscription"
      ? SUB_CONFIG[device.subscriptionStatus]
      : null;

  const handleEdit = useCallback((): void => {
    if (!device) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("./definition");
      navigate(def.default.PATCH, {
        urlPathParams: { orgId: device.orgId, deviceId: device.deviceId },
        data: {
          label: device.label,
          trialStartDate: device.trialStartDate ?? undefined,
          subscriptionEndDate: device.subscriptionEndDate ?? undefined,
          clientEmail: device.clientEmail ?? undefined,
        },
      });
    })();
  }, [navigate, device]);

  const handleTags = useCallback((): void => {
    if (!device) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("./tags/definition");
      navigate(def.default.GET, {
        urlPathParams: { orgId: device.orgId, deviceId: device.hwId },
      });
    })();
  }, [navigate, device]);

  const handleDelete = useCallback((): void => {
    if (!device) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("./delete/definition");
      navigate(def.default.DELETE, {
        urlPathParams: { orgId: device.orgId, deviceId: device.deviceId },
      });
    })();
  }, [navigate, device]);

  // ── Compact (CLI/MCP) ──
  if (isCompact) {
    if (!device) {
      return <Div />;
    }
    const subCfgCompact =
      device.subscriptionStatus &&
      device.subscriptionStatus !== "no_subscription"
        ? SUB_CONFIG[device.subscriptionStatus]
        : null;
    return (
      <Div className="flex-col">
        <Div>
          {`${device.connected === true ? "● " : device.connected === false ? "○ " : "  "}${device.label} · ${device.hwId}`}
        </Div>
        {device.orgResourceId && (
          <Div>
            {`${t("get.widget.labels.orgResourceId")}: ${device.orgResourceId}`}
          </Div>
        )}
        {device.groups.length > 0 && (
          <Div>{`${t("get.widget.groups")}: ${device.groups.join(", ")}`}</Div>
        )}
        {device.lastConnection && (
          <Div>
            {`${t("get.widget.labels.lastConnection")}: ${formatTs(device.lastConnection)}`}
          </Div>
        )}
        {device.lastSeenIp && (
          <Div>
            {`${t("get.widget.labels.lastSeenIp")}: ${device.lastSeenIp}`}
          </Div>
        )}
        {subCfgCompact && (
          <Div>
            {`${t("get.widget.subscription")}: ${subCfgCompact.label(device.daysUntilExpiry)}${device.subscriptionEndDate ? ` (${formatTs(device.subscriptionEndDate)})` : ""}`}
          </Div>
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0 bg-background">
      <TopBar onBack={goBack}>
        <Span className="font-semibold text-sm truncate mr-auto">
          {isLoading
            ? t("get.widget.loading")
            : (device?.label ?? t("get.title"))}
        </Span>
        {device && (
          <Div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              title={t("get.widget.tags")}
              onClick={handleTags}
            >
              <Tag className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              title={t("get.widget.delete")}
              onClick={handleDelete}
            >
              <Trash className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2.5 gap-1.5 ml-1"
              onClick={handleEdit}
            >
              <Pencil className="h-3 w-3" />
              <Span className="text-xs">{t("get.widget.edit")}</Span>
            </Button>
          </Div>
        )}
      </TopBar>

      {isLoading ? (
        <Div className="h-52 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <Span className="text-xs text-muted-foreground">
            {t("get.widget.loading")}
          </Span>
        </Div>
      ) : !device ? null : (
        <Div className="overflow-y-auto flex-1 max-h-[min(740px,calc(100dvh-120px))] p-4 flex flex-col gap-3">
          {/* ── Hero card ── */}
          <SectionCard>
            {/* Status strip */}
            <Div
              className={cn(
                "h-1 w-full",
                isOnline
                  ? "bg-success"
                  : isOffline
                    ? "bg-muted-foreground/20"
                    : "bg-transparent",
              )}
            />

            <Div className="p-4 flex items-start gap-4">
              {/* Large device icon */}
              <Div className="relative shrink-0">
                <Div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center",
                    isOnline ? "bg-success/10" : "bg-muted/60",
                  )}
                >
                  <Server
                    className={cn(
                      "h-6 w-6",
                      isOnline ? "text-success" : "text-muted-foreground/60",
                    )}
                  />
                </Div>
                {hasConnectedStatus && (
                  <Span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background flex items-center justify-center",
                      isOnline ? "bg-success" : "bg-muted-foreground/40",
                    )}
                  >
                    {isOnline ? (
                      <Wifi className="h-2 w-2 text-white" />
                    ) : (
                      <WifiOff className="h-2 w-2 text-white/60" />
                    )}
                  </Span>
                )}
              </Div>

              {/* Name, hwId, badges */}
              <Div className="flex-1 min-w-0">
                <Span className="font-bold text-lg block truncate leading-tight">
                  {device.label}
                </Span>
                <Span className="font-mono text-xs text-muted-foreground block mt-1">
                  {device.hwId}
                </Span>
                <Div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {hasConnectedStatus && (
                    <Span
                      className={cn(
                        "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                        isOnline
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isOnline
                        ? t("get.widget.labels.online")
                        : t("get.widget.labels.offline")}
                    </Span>
                  )}
                  {subCfg && (
                    <Span
                      className={cn(
                        "text-[11px] font-semibold px-2 py-0.5 rounded-full border",
                        subCfg.bg,
                        subCfg.text,
                        subCfg.border,
                      )}
                    >
                      {subCfg.label(device.daysUntilExpiry)}
                    </Span>
                  )}
                  {device.orgResourceId && (
                    <Span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full max-w-[160px] truncate">
                      {device.orgResourceId}
                    </Span>
                  )}
                </Div>
              </Div>
            </Div>

            {/* Groups */}
            {device.groups.length > 0 && (
              <Div className="px-4 pb-3 border-t pt-3">
                <Span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">
                  {t("get.widget.groups")}
                </Span>
                <Div className="flex flex-wrap gap-1.5">
                  {device.groups.map((g) => (
                    <Span
                      key={g}
                      className="text-xs font-mono bg-muted px-2 py-0.5 rounded-md"
                    >
                      {g}
                    </Span>
                  ))}
                </Div>
              </Div>
            )}
          </SectionCard>

          {/* ── Connectivity ── */}
          <SectionCard>
            <SectionHead
              icon={<Activity className="h-3.5 w-3.5" />}
              label={t("get.widget.sections.connectivity")}
              right={
                hasConnectedStatus ? (
                  <Div className="flex items-center gap-1.5">
                    <Span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        isOnline ? "bg-success" : "bg-muted-foreground/40",
                      )}
                    />
                    <Span
                      className={cn(
                        "text-xs font-medium",
                        isOnline ? "text-success" : "text-muted-foreground",
                      )}
                    >
                      {isOnline
                        ? t("get.widget.labels.online")
                        : t("get.widget.labels.offline")}
                    </Span>
                  </Div>
                ) : undefined
              }
            />
            <DataRow
              label={t("get.widget.labels.lastConnection")}
              value={formatTs(device.lastConnection)}
            />
            <DataRow
              label={t("get.widget.labels.lastDisconnection")}
              value={formatTs(device.lastDisconnection)}
            />
            <DataRow
              label={t("get.widget.labels.firstRegistration")}
              value={formatTs(device.firstRegistration)}
            />
            {device.lastSeenIp && (
              <DataRow
                label={t("get.widget.labels.lastSeenIp")}
                value={device.lastSeenIp}
                mono
              />
            )}
          </SectionCard>

          {/* ── Subscription ── */}
          <SectionCard>
            <SectionHead
              icon={<Cpu className="h-3.5 w-3.5" />}
              label={t("get.widget.sections.subscription")}
              right={
                subCfg ? (
                  <Span
                    className={cn(
                      "text-[11px] font-semibold px-2 py-0.5 rounded-full border",
                      subCfg.bg,
                      subCfg.text,
                      subCfg.border,
                    )}
                  >
                    {subCfg.label(device.daysUntilExpiry)}
                  </Span>
                ) : undefined
              }
            />
            {!subCfg ? (
              <Div className="px-4 py-5 flex flex-col items-center gap-2 text-center">
                <Span className="text-sm text-muted-foreground font-medium">
                  {t("get.widget.noSubscription")}
                </Span>
                <Span className="text-xs text-muted-foreground/60">
                  {t("get.widget.noSubscriptionHint")}
                </Span>
              </Div>
            ) : (
              <>
                {device.trialStartDate && (
                  <DataRow
                    label={t("get.widget.trialStart")}
                    value={formatTs(device.trialStartDate)}
                  />
                )}
                {device.subscriptionEndDate && (
                  <DataRow
                    label={t("get.widget.subscriptionEnd")}
                    value={formatTs(device.subscriptionEndDate)}
                  />
                )}
                {device.clientEmail && (
                  <DataRow
                    label={t("get.widget.clientEmail")}
                    value={device.clientEmail}
                  />
                )}
              </>
            )}
          </SectionCard>
        </Div>
      )}
    </Div>
  );
}

// ─── DeviceUpdateContainer ────────────────────────────────────────────────────

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
  const trialStartDateValue = form.watch("trialStartDate");
  const subscriptionEndDateValue = form.watch("subscriptionEndDate");
  const clientEmailValue = form.watch("clientEmail") ?? "";

  // ── Success state ──
  if (saved) {
    return (
      <Div className="flex flex-col min-h-0 bg-background">
        <TopBar onBack={goBack}>
          <Span className="font-semibold text-sm mr-auto">
            {t("patch.success.title")}
          </Span>
        </TopBar>
        <Div className="p-6 flex flex-col items-center gap-5">
          <Div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
            <Check className="h-7 w-7 text-success" />
          </Div>
          <Div className="text-center">
            <Span className="block font-bold text-base">{data.label}</Span>
            <Span className="block text-sm text-muted-foreground mt-1">
              {t("patch.success.description")}
            </Span>
          </Div>
          {(data.hwId ?? data.orgResourceId) && (
            <Div className="w-full rounded-2xl border bg-card overflow-hidden">
              {data.hwId && (
                <Div className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0">
                  <Cpu className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <Span className="text-xs text-muted-foreground">
                    {t("get.widget.labels.hwIdLabel")}
                  </Span>
                  <Span className="text-xs font-mono font-medium ml-auto">
                    {data.hwId}
                  </Span>
                </Div>
              )}
              {data.orgResourceId && (
                <Div className="flex items-center gap-3 px-4 py-3">
                  <Server className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <Span className="text-xs text-muted-foreground">
                    {t("get.widget.labels.orgResourceLabel")}
                  </Span>
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
            {t("get.widget.labels.backToDevice")}
          </Button>
        </Div>
      </Div>
    );
  }

  // ── Edit form ──
  return (
    <Div className="flex flex-col min-h-0 bg-background">
      <TopBar onBack={goBack}>
        <Server className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Span className="font-semibold text-sm mr-auto">
          {t("patch.title")}
        </Span>
      </TopBar>

      <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-120px))] p-4 flex flex-col gap-3">
        {/* ── Device info card ── */}
        <SectionCard>
          <SectionHead
            icon={<Server className="h-3.5 w-3.5" />}
            label={t("get.widget.sections.device")}
          />
          <Div className="p-4 flex flex-col gap-4">
            <FormField
              label={t("patch.label.label")}
              hint={t("patch.label.description")}
            >
              <Input
                value={labelValue}
                onChange={(e) =>
                  form.setValue("label", e.target.value, { shouldDirty: true })
                }
                placeholder={t("patch.label.placeholder")}
              />
            </FormField>

            <FormField label={t("patch.description.label")}>
              <Input
                value={descriptionValue}
                onChange={(e) =>
                  form.setValue("description", e.target.value, {
                    shouldDirty: true,
                  })
                }
                placeholder={t("patch.description.placeholder")}
              />
            </FormField>

            <FormField label={t("patch.serialNumber.label")}>
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
            </FormField>
          </Div>
        </SectionCard>

        {/* ── Subscription card ── */}
        <SectionCard>
          <SectionHead
            icon={<Calendar className="h-3.5 w-3.5" />}
            label={t("patch.subscription.sectionTitle")}
          />
          <Div className="p-4 flex flex-col gap-4">
            <Div className="grid grid-cols-2 gap-3">
              <FormField label={t("patch.trialStartDate.label")}>
                <Input
                  type="date"
                  value={toDateInput(trialStartDateValue)}
                  onChange={(e) =>
                    form.setValue(
                      "trialStartDate",
                      e.target.value ? new Date(e.target.value) : undefined,
                      { shouldDirty: true },
                    )
                  }
                />
              </FormField>
              <FormField label={t("patch.subscriptionEndDate.label")}>
                <Input
                  type="date"
                  value={toDateInput(subscriptionEndDateValue)}
                  onChange={(e) =>
                    form.setValue(
                      "subscriptionEndDate",
                      e.target.value ? new Date(e.target.value) : undefined,
                      { shouldDirty: true },
                    )
                  }
                />
              </FormField>
            </Div>

            <FormField label={t("patch.clientEmail.label")}>
              <Div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  type="email"
                  value={clientEmailValue}
                  onChange={(e) =>
                    form.setValue("clientEmail", e.target.value || undefined, {
                      shouldDirty: true,
                    })
                  }
                  placeholder={t("patch.clientEmail.placeholder")}
                  className="pl-9"
                />
              </Div>
            </FormField>
          </Div>
        </SectionCard>

        {/* ── Save button ── */}
        <Button
          type="button"
          variant="default"
          size="sm"
          className="w-full gap-2 h-10 text-sm font-semibold"
          onClick={onSubmit ?? undefined}
        >
          <Save className="h-4 w-4" />
          {t("patch.submitButton.label")}
        </Button>
      </Div>
    </Div>
  );
}
