"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Building } from "next-vibe-ui/ui/icons/Building";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Wifi } from "next-vibe-ui/ui/icons/Wifi";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

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

import type { SubscriptionStatusType } from "../subscription/definition";
import definition from "./definition";
import type { DeviceLicensesListResponseOutput } from "./definition";

type DeviceLicenseItem =
  DeviceLicensesListResponseOutput["deviceLicenses"][number];

// ─── Status config ─────────────────────────────────────────────────────────────

const SUB_CONFIG: Record<
  SubscriptionStatusType,
  {
    bar: string;
    badge: string;
    dot: string;
    iconBg: string;
    iconColor: string;
  } | null
> = {
  trial: {
    bar: "bg-gradient-to-r from-primary to-primary/50",
    badge: "bg-primary/10 text-primary",
    dot: "bg-primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  active: {
    bar: "bg-gradient-to-r from-success to-success/50",
    badge: "bg-success/10 text-success",
    dot: "bg-success",
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  expiring_soon: {
    bar: "bg-gradient-to-r from-warning to-warning/50",
    badge: "bg-warning/10 text-warning",
    dot: "bg-warning animate-pulse",
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  expired: {
    bar: "bg-gradient-to-r from-destructive to-destructive/50",
    badge: "bg-destructive/10 text-destructive",
    dot: "bg-destructive",
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
  },
  no_subscription: null,
};

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
}: {
  icon: React.ReactNode;
  label: string;
}): React.JSX.Element {
  return (
    <Div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/20">
      <Span className="text-muted-foreground">{icon}</Span>
      <Span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Span>
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

// ─── LicenseCard ───────────────────────────────────────────────────────────────

function LicenseCard({
  license,
  t,
  onClick,
}: {
  license: DeviceLicenseItem;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  onClick: (l: DeviceLicenseItem) => void;
}): React.JSX.Element {
  const status = license.subscriptionStatus as
    | SubscriptionStatusType
    | null
    | undefined;
  const cfg = status ? SUB_CONFIG[status] : null;
  const isDeleted = license.deleted === true;

  return (
    <Div
      className={cn(
        "group flex flex-col rounded-2xl border overflow-hidden cursor-pointer",
        "transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 active:shadow-sm active:translate-y-0",
        isDeleted ? "opacity-50" : "border-border",
      )}
      onClick={() => onClick(license)}
    >
      {/* Status bar */}
      <Div
        className={cn("h-1 w-full shrink-0", cfg ? cfg.bar : "bg-muted/40")}
      />

      <Div className="p-3.5 flex flex-col gap-3 bg-card">
        {/* Top row: icon + name/serial + status badge */}
        <Div className="flex items-start gap-2.5">
          <Div
            className={cn(
              "w-9 h-9 rounded-xl shrink-0 flex items-center justify-center",
              cfg ? cfg.iconBg : "bg-muted/50",
            )}
          >
            <Shield
              className={cn(
                "h-4 w-4",
                cfg ? cfg.iconColor : "text-muted-foreground/50",
              )}
            />
          </Div>

          <Div className="flex-1 min-w-0">
            <Span className="font-semibold text-sm block truncate leading-tight">
              {license.clientName ?? `#${license.id}`}
            </Span>
            <Span className="font-mono text-[10px] text-muted-foreground block truncate mt-0.5">
              {license.serialNumber ?? license.realm ?? `#${license.id}`}
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
              {status === "expiring_soon"
                ? `${license.daysUntilExpiry ?? "?"}d`
                : t(
                    `get.widget.subscription.${status === "trial" ? "trial" : status === "active" ? "active" : status === "expired" ? "expired" : "noSubscription"}`,
                  )}
            </Span>
          ) : (
            <Span className="shrink-0 flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              <Span className="w-1.5 h-1.5 rounded-full shrink-0 bg-muted-foreground/40" />
              {t("get.widget.subscription.noSubscription")}
            </Span>
          )}
        </Div>

        {/* Feature chips */}
        {(license.vpnEnabled === true || license.used) && (
          <Div className="flex flex-wrap gap-1">
            {license.used && (
              <Span className="flex items-center gap-0.5 text-[10px] font-semibold bg-success/8 text-success/80 px-1.5 py-0.5 rounded-md">
                <Check className="h-2.5 w-2.5" />
                {t("get.response.deviceLicenses.used")}
              </Span>
            )}
            {license.vpnEnabled === true && (
              <Span className="flex items-center gap-0.5 text-[10px] font-semibold bg-primary/8 text-primary/80 px-1.5 py-0.5 rounded-md">
                <Wifi className="h-2.5 w-2.5" />
                {"VPN"}
              </Span>
            )}
          </Div>
        )}

        {/* Footer: org + activation key */}
        <Div className="flex items-center justify-between pt-2 border-t border-border/40 mt-auto">
          <Span className="text-[10px] font-mono text-muted-foreground/60 truncate max-w-[70%]">
            {license.orgResourceId ?? license.realm ?? ""}
          </Span>
          <Span className="text-[10px] font-mono text-muted-foreground/40 shrink-0">
            {license.activationKey !== ""
              ? license.activationKey
              : `#${license.id}`}
          </Span>
        </Div>
      </Div>
    </Div>
  );
}

// ─── DeviceLicensesListContainer ───────────────────────────────────────────────

export function DeviceLicensesListContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { endpointMutations } = useWidgetContext();
  const { pop, push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();

  const licenses = data?.deviceLicenses ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const isLoading = data === undefined;
  const isCompact = platform === Platform.CLI || platform === Platform.MCP;
  const isMcp = platform === Platform.MCP;

  const currentPage = (form.watch("page") ?? 0) + 1;

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleNavOrgs = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../../organizations/list/definition");
      navigate(def.default.GET, {});
    })();
  }, [navigate]);

  const handleNavActivate = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../activate/definition");
      navigate(def.default.POST, {});
    })();
  }, [navigate]);

  const handleNavVpnActivate = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../vpn-activate/definition");
      navigate(def.default.POST, {});
    })();
  }, [navigate]);

  const handleCreate = useCallback((): void => {
    void (async (): Promise<void> => {
      navigate(definition.POST, {});
    })();
  }, [navigate]);

  const handleLicenseClick = useCallback(
    (license: DeviceLicenseItem): void => {
      void (async (): Promise<void> => {
        const detail = await import("../[deviceLicenseId]/definition");
        navigate(detail.default.PUT, {
          urlPathParams: { deviceLicenseId: license.id },
        });
      })();
    },
    [navigate],
  );

  const handlePrev = useCallback((): void => {
    const p = form.getValues("page") ?? 0;
    if (p > 0) {
      form.setValue("page", p - 1);
    }
  }, [form]);

  const handleNext = useCallback((): void => {
    const p = form.getValues("page") ?? 0;
    if (p + 1 < totalPages) {
      form.setValue("page", p + 1);
    }
  }, [form, totalPages]);

  // ── Compact ──
  if (isCompact) {
    if (!data) {
      return <Div />;
    }
    return (
      <Div className="font-mono text-sm p-2">
        <Div className="font-semibold mb-1">
          {t("get.widget.title")} ({licenses.length}/{total})
          {isMcp && ` p:${currentPage}/${totalPages}`}
        </Div>
        {licenses.length === 0 ? (
          <Div className="text-muted-foreground">
            {t("get.widget.noItemsFound")}
          </Div>
        ) : (
          licenses.map((license, idx) => (
            <Div key={idx} className="py-1 text-sm font-mono">
              <Span className="font-semibold">{`id:${license.id}`}</Span>
              {license.serialNumber !== null &&
                license.serialNumber !== undefined && (
                  <Span className="ml-2">{`serial:${license.serialNumber}`}</Span>
                )}
              {license.clientName !== null &&
                license.clientName !== undefined && (
                  <Span className="ml-2">{`client:${license.clientName}`}</Span>
                )}
              <Span className="ml-2">{`used:${license.used ? "Y" : "N"}`}</Span>
              {license.subscriptionStatus && (
                <Span className="ml-2">{`sub:${license.subscriptionStatus}`}</Span>
              )}
            </Div>
          ))
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0 bg-background">
      {/* TopBar */}
      <TopBar onBack={() => pop()}>
        <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
          {total > 0 && (
            <Span className="ml-1.5 text-xs text-muted-foreground font-normal">
              ({total})
            </Span>
          )}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground shrink-0"
          onClick={handleCreate}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground shrink-0"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </TopBar>

      {/* Nav strip */}
      <Div className="flex items-center gap-1 px-3 py-1.5 border-b bg-muted/20 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 gap-1 text-[11px] px-2"
          onClick={handleNavOrgs}
        >
          <Building className="h-3 w-3" />
          {t("get.widget.nav.orgs")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 gap-1 text-[11px] px-2"
          onClick={handleNavActivate}
        >
          <Zap className="h-3 w-3" />
          {t("get.widget.nav.activate")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 gap-1 text-[11px] px-2"
          onClick={handleNavVpnActivate}
        >
          <Wifi className="h-3 w-3" />
          {t("get.widget.nav.vpnActivate")}
        </Button>
      </Div>

      {/* Card grid */}
      <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-160px))] p-3">
        {isLoading ? (
          <Div className="h-48 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Div>
        ) : licenses.length === 0 ? (
          <Div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Shield className="h-8 w-8 opacity-30" />
            <Span className="text-sm">{t("get.widget.noItemsFound")}</Span>
          </Div>
        ) : (
          <Div className="grid grid-cols-1 gap-2">
            {licenses.map((license, idx) => (
              <LicenseCard
                key={idx}
                license={license}
                t={t}
                onClick={handleLicenseClick}
              />
            ))}
          </Div>
        )}
      </Div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Div className="flex items-center justify-between px-4 py-2 border-t shrink-0">
          <Span className="text-xs text-muted-foreground">
            {currentPage} / {totalPages}
          </Span>
          <Div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={currentPage <= 1}
              onClick={handlePrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={currentPage >= totalPages}
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}

// ─── DeviceLicenseCreateContainer ──────────────────────────────────────────────

export function DeviceLicenseCreateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.POST>();

  const isCompact = platform === Platform.CLI || platform === Platform.MCP;

  const activationKeyValue = form.watch("activationKey") ?? "";
  const serialNumberValue = form.watch("serialNumber") ?? "";
  const clientNameValue = form.watch("clientName") ?? "";
  const vpnValidityMonthsValue = form.watch("vpnValidityMonths");
  const notesValue = form.watch("notes") ?? "";

  if (isCompact && result) {
    return (
      <Div className="font-mono text-sm p-2">
        {`created device #${result.id}: serial:${result.serialNumberOut ?? "—"} key:${result.activationKey}`}
      </Div>
    );
  }

  // ── Success ──
  if (result !== undefined && result !== null) {
    return (
      <Div className="flex flex-col min-h-0 bg-background">
        <TopBar onBack={goBack}>
          <Span className="font-semibold text-sm mr-auto">
            {t("post.widget.result.title")}
          </Span>
        </TopBar>
        <Div className="p-6 flex flex-col items-center gap-5">
          <Div className="relative">
            <Div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center">
              <Shield className="h-7 w-7 text-success" />
            </Div>
            <Div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success flex items-center justify-center border-2 border-background">
              <Check className="h-3 w-3 text-white" />
            </Div>
          </Div>
          <Div className="text-center">
            <Span className="block font-bold text-base font-mono">
              {`#${result.id}`}
            </Span>
            <Span className="block text-sm text-muted-foreground mt-1">
              {t("post.success.description")}
            </Span>
          </Div>
          <Div className="w-full rounded-2xl border bg-card overflow-hidden">
            <Div className="flex items-center justify-between px-4 py-3 border-b">
              <Span className="text-xs text-muted-foreground">
                {t("post.activationKey.label")}
              </Span>
              <Span className="text-xs font-mono font-semibold">
                {result.activationKey}
              </Span>
            </Div>
            {result.serialNumberOut && (
              <Div className="flex items-center justify-between px-4 py-3 border-b last:border-b-0">
                <Span className="text-xs text-muted-foreground">
                  {t("post.serialNumber.label")}
                </Span>
                <Span className="text-xs font-mono font-semibold">
                  {result.serialNumberOut}
                </Span>
              </Div>
            )}
            {result.clientName && (
              <Div className="flex items-center justify-between px-4 py-3 last:border-b-0">
                <Span className="text-xs text-muted-foreground">
                  {t("post.clientName.label")}
                </Span>
                <Span className="text-xs font-medium">{result.clientName}</Span>
              </Div>
            )}
          </Div>
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

  // ── Form ──
  return (
    <Div className="flex flex-col min-h-0 bg-background">
      <TopBar onBack={goBack}>
        <Plus className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </TopBar>

      <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-120px))] p-4 flex flex-col gap-3">
        <SectionCard>
          <SectionHead
            icon={<Shield className="h-3.5 w-3.5" />}
            label={t("post.widget.title")}
          />
          <Div className="p-4 flex flex-col gap-4">
            <Div className="grid grid-cols-2 gap-3">
              <FormField
                label={t("post.activationKey.label")}
                hint={t("post.activationKey.description")}
              >
                <Input
                  value={activationKeyValue}
                  onChange={(e) =>
                    form.setValue("activationKey", e.target.value, {
                      shouldDirty: true,
                    })
                  }
                  className="font-mono"
                />
              </FormField>
              <FormField
                label={t("post.serialNumber.label")}
                hint={t("post.serialNumber.description")}
              >
                <Input
                  value={serialNumberValue}
                  onChange={(e) =>
                    form.setValue("serialNumber", e.target.value || undefined, {
                      shouldDirty: true,
                    })
                  }
                  className="font-mono"
                />
              </FormField>
            </Div>
            <Div className="grid grid-cols-2 gap-3">
              <FormField
                label={t("post.clientName.label")}
                hint={t("post.clientName.description")}
              >
                <Input
                  value={clientNameValue}
                  onChange={(e) =>
                    form.setValue("clientName", e.target.value || undefined, {
                      shouldDirty: true,
                    })
                  }
                />
              </FormField>
              <FormField
                label={t("post.vpnValidityMonths.label")}
                hint={t("post.vpnValidityMonths.description")}
              >
                <Input
                  type="number"
                  min={1}
                  value={vpnValidityMonthsValue}
                  onChange={(e) =>
                    form.setValue(
                      "vpnValidityMonths",
                      e.target.value ? Number(e.target.value) : undefined,
                      { shouldDirty: true },
                    )
                  }
                />
              </FormField>
            </Div>
            <FormField
              label={t("post.notes.label")}
              hint={t("post.notes.description")}
            >
              <Input
                value={notesValue}
                onChange={(e) =>
                  form.setValue("notes", e.target.value || undefined, {
                    shouldDirty: true,
                  })
                }
              />
            </FormField>
          </Div>
        </SectionCard>

        <Button
          type="button"
          variant="default"
          size="sm"
          className="w-full gap-2 h-10 text-sm font-semibold"
          onClick={onSubmit ?? undefined}
        >
          <Plus className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>
      </Div>
    </Div>
  );
}
