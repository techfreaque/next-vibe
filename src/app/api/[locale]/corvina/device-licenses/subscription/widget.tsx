"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Calendar } from "next-vibe-ui/ui/icons/Calendar";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { ShoppingCart } from "next-vibe-ui/ui/icons/ShoppingCart";
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
import type { SubscriptionStatusType } from "./definition";

// ─── Status config ─────────────────────────────────────────────────────────────

const SUB_CONFIG: Record<
  SubscriptionStatusType,
  {
    bar: string;
    badge: string;
    dot: string;
    iconBg: string;
    iconColor: string;
    label: (d?: number | null) => string;
  } | null
> = {
  trial: {
    bar: "bg-gradient-to-r from-primary to-primary/50",
    badge: "bg-primary/10 text-primary",
    dot: "bg-primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    label: () => "Trial",
  },
  active: {
    bar: "bg-gradient-to-r from-success to-success/50",
    badge: "bg-success/10 text-success",
    dot: "bg-success",
    iconBg: "bg-success/10",
    iconColor: "text-success",
    label: () => "Active",
  },
  expiring_soon: {
    bar: "bg-gradient-to-r from-warning to-warning/50",
    badge: "bg-warning/10 text-warning",
    dot: "bg-warning animate-pulse",
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    label: (d) => `${d ?? "?"} days left`,
  },
  expired: {
    bar: "bg-gradient-to-r from-destructive to-destructive/50",
    badge: "bg-destructive/10 text-destructive",
    dot: "bg-destructive",
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    label: () => "Expired",
  },
  no_subscription: null,
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(ts: Date | string | null | undefined): string {
  if (!ts) {
    return "—";
  }
  try {
    return new Date(ts).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
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

// ─── Shared UI ─────────────────────────────────────────────────────────────────

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

// ─── DeviceSubscriptionContainer (GET) ─────────────────────────────────────────

export function DeviceSubscriptionContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { push: navigate, pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const isLoading = data === undefined;
  const isCompact = platform === Platform.CLI || platform === Platform.MCP;

  const cfg = data?.status ? SUB_CONFIG[data.status] : null;
  const isExpiredOrNoSub =
    data?.status === "no_subscription" || data?.status === "expired";

  const handleEdit = useCallback((): void => {
    if (!data) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("./definition");
      navigate(def.default.POST, {
        data: {
          logicalId: data.logicalIdOut,
          orgResourceId: data.orgResourceId ?? undefined,
          clientEmail: data.clientEmail ?? undefined,
          trialStartDate: data.trialStartDate ?? undefined,
          subscriptionEndDate: data.subscriptionEndDate ?? undefined,
        },
      });
    })();
  }, [navigate, data]);

  const handleRequestRenewal = useCallback((): void => {
    if (!data) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../purchase-inquiry/definition");
      navigate(def.default.POST, {
        data: {
          logicalId: [data.logicalIdOut],
          orgResourceId: data.orgResourceId ?? "",
        },
      });
    })();
  }, [navigate, data]);

  // ── Compact ──
  if (isCompact) {
    if (!data) {
      return <Div />;
    }
    return (
      <Div className="flex-col">
        <Div>
          {[
            `status:${data.status}`,
            data.daysUntilExpiry !== null
              ? `days:${data.daysUntilExpiry}`
              : null,
            data.effectiveEndDate
              ? `until:${new Date(data.effectiveEndDate).toISOString().slice(0, 10)}`
              : null,
            data.clientEmail ? `email:${data.clientEmail}` : null,
            data.orgResourceId ? `org:${data.orgResourceId}` : null,
          ]
            .filter(Boolean)
            .join(" ")}
        </Div>
      </Div>
    );
  }

  // ── Loading ──
  if (isLoading) {
    return (
      <Div className="h-52 flex flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <Span className="text-xs text-muted-foreground">
          {t("get.widget.loading")}
        </Span>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0 bg-background">
      <TopBar onBack={goBack}>
        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Span className="font-semibold text-sm truncate mr-auto">
          {t("get.widget.title")}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground shrink-0"
          onClick={handleEdit}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </TopBar>

      <Div className="overflow-y-auto flex-1 max-h-[min(740px,calc(100dvh-120px))] p-4 flex flex-col gap-3">
        {/* ── Hero card ── */}
        <SectionCard>
          <Div
            className={cn("h-1 w-full shrink-0", cfg ? cfg.bar : "bg-muted/40")}
          />

          <Div className="p-3.5 flex flex-col gap-3 bg-card">
            {/* Top: icon + id/org + status badge */}
            <Div className="flex items-start gap-2.5">
              <Div
                className={cn(
                  "w-9 h-9 rounded-xl shrink-0 flex items-center justify-center",
                  cfg ? cfg.iconBg : "bg-muted/50",
                )}
              >
                <Calendar
                  className={cn(
                    "h-4 w-4",
                    cfg ? cfg.iconColor : "text-muted-foreground/50",
                  )}
                />
              </Div>

              <Div className="flex-1 min-w-0">
                <Span className="font-semibold text-sm block font-mono truncate leading-tight">
                  {data.logicalIdOut}
                </Span>
                <Span className="text-[10px] text-muted-foreground block truncate mt-0.5">
                  {data.orgResourceId ?? t("get.widget.noSubscription")}
                </Span>
              </Div>

              {cfg ? (
                <Span
                  className={cn(
                    "shrink-0 flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                    cfg.badge,
                  )}
                >
                  <Span
                    className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)}
                  />
                  {cfg.label(data.daysUntilExpiry)}
                </Span>
              ) : (
                <Span className="shrink-0 flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                  <Span className="w-1.5 h-1.5 rounded-full shrink-0 bg-muted-foreground/40" />
                  {t("get.widget.noSubscription")}
                </Span>
              )}
            </Div>

            {/* Chips row: email */}
            {data.clientEmail && (
              <Div className="flex flex-wrap gap-1">
                <Span className="text-[10px] font-mono bg-muted/60 text-muted-foreground px-1.5 py-0.5 rounded-md truncate max-w-full">
                  {data.clientEmail}
                </Span>
              </Div>
            )}

            {/* Footer: date range */}
            <Div className="flex items-center justify-between pt-2 border-t border-border/40 mt-auto">
              <Span className="text-[10px] font-mono text-muted-foreground/60 truncate">
                {`${formatDate(data.effectiveStartDate)} — ${formatDate(data.effectiveEndDate)}`}
              </Span>
              {data.daysUntilExpiry !== null &&
                data.daysUntilExpiry !== undefined &&
                cfg && (
                  <Span
                    className={cn(
                      "text-[10px] font-semibold font-mono shrink-0 ml-2",
                      cfg.iconColor,
                    )}
                  >
                    {data.daysUntilExpiry >= 0
                      ? `${data.daysUntilExpiry}d`
                      : `${Math.abs(data.daysUntilExpiry)}d ago`}
                  </Span>
                )}
            </Div>
          </Div>
        </SectionCard>

        {/* ── Subscription details ── */}
        <SectionCard>
          <SectionHead
            icon={<Calendar className="h-3.5 w-3.5" />}
            label={t("get.widget.sections.subscription")}
            right={
              cfg ? (
                <Span
                  className={cn(
                    "text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1",
                    cfg.badge,
                  )}
                >
                  <Span
                    className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)}
                  />
                  {cfg.label(data.daysUntilExpiry)}
                </Span>
              ) : undefined
            }
          />
          {data.trialStartDate && (
            <DataRow
              label={t("get.widget.trialStart")}
              value={formatDate(data.trialStartDate)}
            />
          )}
          {data.subscriptionEndDate && (
            <DataRow
              label={t("get.widget.subscriptionEnd")}
              value={formatDate(data.subscriptionEndDate)}
            />
          )}
          <DataRow
            label={t("get.widget.effectiveFrom")}
            value={formatDate(data.effectiveStartDate)}
          />
          <DataRow
            label={t("get.widget.effectiveUntil")}
            value={formatDate(data.effectiveEndDate)}
          />
          <DataRow
            label={t("get.widget.clientEmail")}
            value={data.clientEmail ?? "—"}
            mono
          />
          <DataRow
            label={t("get.widget.organization")}
            value={data.orgResourceId ?? "—"}
            mono
          />
        </SectionCard>

        {/* ── Primary CTA ── */}
        {isExpiredOrNoSub ? (
          <Button
            type="button"
            variant="default"
            size="sm"
            className="w-full gap-2 h-10 text-sm font-semibold"
            onClick={handleRequestRenewal}
          >
            <ShoppingCart className="h-4 w-4" />
            {t("get.widget.requestRenewal")}
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full gap-2 h-9 text-sm"
            onClick={handleEdit}
          >
            <Pencil className="h-3.5 w-3.5" />
            {t("get.widget.editButton")}
          </Button>
        )}
      </Div>
    </Div>
  );
}

// ─── DeviceSubscriptionEditContainer (POST) ────────────────────────────────────

export function DeviceSubscriptionEditContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.POST>();

  const saved = data !== undefined;

  const logicalIdValue = form.watch("logicalId") ?? "";
  const orgResourceIdValue = form.watch("orgResourceId") ?? "";
  const clientEmailValue = form.watch("clientEmail") ?? "";
  const trialStartDateValue = form.watch("trialStartDate");
  const subscriptionEndDateValue = form.watch("subscriptionEndDate");

  const isCompact = platform === Platform.CLI || platform === Platform.MCP;

  if (isCompact) {
    if (saved) {
      return (
        <Div className="flex-col">
          <Div>{`updated:${data.logicalId}`}</Div>
        </Div>
      );
    }
    return <Div />;
  }

  // ── Success ──
  if (saved) {
    return (
      <Div className="flex flex-col min-h-0 bg-background">
        <TopBar onBack={goBack}>
          <Span className="font-semibold text-sm mr-auto">
            {t("post.success.title")}
          </Span>
        </TopBar>
        <Div className="p-6 flex flex-col items-center gap-5">
          <Div className="relative">
            <Div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center">
              <Calendar className="h-7 w-7 text-success" />
            </Div>
            <Div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success flex items-center justify-center border-2 border-background">
              <Check className="h-3 w-3 text-white" />
            </Div>
          </Div>
          <Div className="text-center">
            <Span className="block font-bold text-base font-mono">
              {data.logicalId}
            </Span>
            <Span className="block text-sm text-muted-foreground mt-1">
              {t("post.success.description")}
            </Span>
          </Div>
          {(data.orgResourceId ?? data.clientEmail) && (
            <Div className="w-full rounded-2xl border bg-card overflow-hidden">
              {data.orgResourceId && (
                <Div className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0">
                  <Server className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <Span className="text-xs text-muted-foreground">
                    {t("post.orgResourceId.label")}
                  </Span>
                  <Span className="text-xs font-mono font-medium ml-auto truncate max-w-[160px]">
                    {data.orgResourceId}
                  </Span>
                </Div>
              )}
              {data.clientEmail && (
                <Div className="flex items-center gap-3 px-4 py-3 last:border-b-0">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <Span className="text-xs text-muted-foreground">
                    {t("post.clientEmail.label")}
                  </Span>
                  <Span className="text-xs font-mono font-medium ml-auto truncate max-w-[160px]">
                    {data.clientEmail}
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
            {t("post.widget.back")}
          </Button>
        </Div>
      </Div>
    );
  }

  // ── Edit form ──
  return (
    <Div className="flex flex-col min-h-0 bg-background">
      <TopBar onBack={goBack}>
        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </TopBar>

      <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-120px))] p-4 flex flex-col gap-3">
        {/* ── Identity ── */}
        <SectionCard>
          <SectionHead
            icon={<Server className="h-3.5 w-3.5" />}
            label={t("post.widget.sections.identity")}
          />
          <Div className="p-4 flex flex-col gap-4">
            <DataRow
              label={t("post.logicalId.label")}
              value={logicalIdValue}
              mono
            />
            <FormField
              label={t("post.orgResourceId.label")}
              hint={t("post.orgResourceId.description")}
            >
              <Input
                value={orgResourceIdValue}
                onChange={(e) =>
                  form.setValue("orgResourceId", e.target.value || undefined, {
                    shouldDirty: true,
                  })
                }
                className="font-mono"
              />
            </FormField>
            <FormField
              label={t("post.clientEmail.label")}
              hint={t("post.clientEmail.description")}
            >
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
                  className="pl-9"
                />
              </Div>
            </FormField>
          </Div>
        </SectionCard>

        {/* ── Dates ── */}
        <SectionCard>
          <SectionHead
            icon={<Calendar className="h-3.5 w-3.5" />}
            label={t("post.widget.sections.subscription")}
          />
          <Div className="p-4">
            <Div className="grid grid-cols-2 gap-3">
              <FormField label={t("post.trialStartDate.label")}>
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
              <FormField label={t("post.subscriptionEndDate.label")}>
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
          </Div>
        </SectionCard>

        {/* ── Save ── */}
        <Button
          type="button"
          variant="default"
          size="sm"
          className="w-full gap-2 h-10 text-sm font-semibold"
          onClick={onSubmit ?? undefined}
        >
          <Save className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>
      </Div>
    </Div>
  );
}
