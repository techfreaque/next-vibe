"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Bell } from "next-vibe-ui/ui/icons/Bell";
import { Building } from "next-vibe-ui/ui/icons/Building";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { PackageCheck } from "next-vibe-ui/ui/icons/PackageCheck";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { ShoppingBag } from "next-vibe-ui/ui/icons/ShoppingBag";
import { Wifi } from "next-vibe-ui/ui/icons/Wifi";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { CorvinaOrgStatus } from "../enums";
import type { CorvinaOrgStatusValue } from "../enums";
import type definition from "./definition";
import type { CorvinaOrganizationsListResponseOutput } from "./definition";

type Org = CorvinaOrganizationsListResponseOutput["organizations"][number];

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  typeof CorvinaOrgStatusValue,
  { bar: string; badge: string; dot: string }
> = {
  [CorvinaOrgStatus.DONE]: {
    bar: "bg-gradient-to-r from-success to-success/50",
    badge: "bg-success/10 text-success",
    dot: "bg-success",
  },
  [CorvinaOrgStatus.NEW]: {
    bar: "bg-gradient-to-r from-primary to-primary/50",
    badge: "bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  [CorvinaOrgStatus.PROVISIONING]: {
    bar: "bg-gradient-to-r from-warning to-warning/50",
    badge: "bg-warning/10 text-warning",
    dot: "bg-warning animate-pulse",
  },
  [CorvinaOrgStatus.DELETING]: {
    bar: "bg-gradient-to-r from-warning to-warning/50",
    badge: "bg-warning/10 text-warning",
    dot: "bg-warning",
  },
  [CorvinaOrgStatus.DELETED]: {
    bar: "bg-muted/40",
    badge: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground/40",
  },
};

// ── Org card ──────────────────────────────────────────────────────────────────

function OrgCard({
  org,
  t,
  onClick,
}: {
  org: Org;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  onClick: (o: Org) => void;
}): React.JSX.Element {
  const cfg = STATUS_CONFIG[org.status];
  const isActive = org.status === CorvinaOrgStatus.DONE;

  return (
    <Div
      className={cn(
        "group flex flex-col rounded-2xl border overflow-hidden cursor-pointer",
        "transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 active:shadow-sm active:translate-y-0",
        isActive ? "border-success/25" : "border-border",
      )}
      onClick={() => onClick(org)}
    >
      {/* Status bar */}
      <Div className={cn("h-1 w-full shrink-0", cfg.bar)} />

      <Div className="p-3.5 flex flex-col gap-3 bg-card flex-1">
        {/* Top row: icon + name + status */}
        <Div className="flex items-start gap-2.5">
          <Div
            className={cn(
              "w-9 h-9 rounded-xl shrink-0 flex items-center justify-center",
              isActive ? "bg-success/10" : "bg-muted/50",
            )}
          >
            <Building
              className={cn(
                "h-4 w-4",
                isActive ? "text-success" : "text-muted-foreground/50",
              )}
            />
          </Div>

          <Div className="flex-1 min-w-0">
            <Span className="font-semibold text-sm block truncate leading-tight">
              {org.label}
            </Span>
            <Span className="font-mono text-[10px] text-muted-foreground block truncate">
              {org.name}
            </Span>
          </Div>

          <Span
            className={cn(
              "shrink-0 flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
              cfg.badge,
            )}
          >
            <Span
              className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)}
            />
            {t(org.status)}
          </Span>
        </Div>

        {/* Feature pills */}
        <Div className="flex flex-wrap gap-1">
          {org.vpnEnabled && (
            <Span className="flex items-center gap-0.5 text-[10px] font-semibold bg-primary/8 text-primary/80 px-1.5 py-0.5 rounded-md">
              <Wifi className="h-2.5 w-2.5" />
              {t("get.widget.badges.vpnOn")}
            </Span>
          )}
          {org.dataEnabled && (
            <Span className="text-[10px] font-semibold bg-success/8 text-success/80 px-1.5 py-0.5 rounded-md">
              {t("get.widget.badges.dataOn")}
            </Span>
          )}
          {org.mfaRequired && (
            <Span className="flex items-center gap-0.5 text-[10px] font-semibold bg-warning/8 text-warning/80 px-1.5 py-0.5 rounded-md">
              <Shield className="h-2.5 w-2.5" />
              {t("get.widget.badges.mfaRequired")}
            </Span>
          )}
          {org.privateAccess && (
            <Span className="text-[10px] font-semibold bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md">
              {t("get.widget.badges.private")}
            </Span>
          )}
        </Div>

        {/* Footer: resourceId/hostname + id */}
        <Div className="flex items-center justify-between pt-2 border-t border-border/40 mt-auto">
          <Span className="text-[10px] font-mono text-muted-foreground/60 truncate max-w-[70%]">
            {org.resourceId ?? org.hostname ?? ""}
          </Span>
          <Span className="text-[10px] font-mono text-muted-foreground/40 shrink-0">
            #{org.id}
          </Span>
        </Div>
      </Div>
    </Div>
  );
}

// ── Main container ─────────────────────────────────────────────────────────────

export function OrgListContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const orgs = data?.organizations ?? [];
  const total = data?.total ?? 0;
  const isLoading = data === undefined;

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleOrgClick = useCallback(
    (org: Org): void => {
      void (async (): Promise<void> => {
        const detail = await import("../[orgId]/definition");
        navigate(detail.default.GET, { urlPathParams: { orgId: org.id } });
      })();
    },
    [navigate],
  );

  const handleNavAppStore = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../../apps/list/definition");
      navigate(def.default.GET, {});
    })();
  }, [navigate]);

  const handleNavInstalledApps = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../../apps/installed/definition");
      navigate(def.default.GET, {});
    })();
  }, [navigate]);

  const handleNavAlarms = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../../alarms/search/definition");
      navigate(def.default.POST, {});
    })();
  }, [navigate]);

  const handleNavDeviceLicenses = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../../device-licenses/list/definition");
      navigate(def.default.GET, {});
    })();
  }, [navigate]);

  const handleNavCreateOrg = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../create/definition");
      navigate(def.default.POST, {});
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // ── Compact ──
  if (isCompact) {
    if (!data) {
      return <Div />;
    }
    return (
      <Div className="flex-col">
        <Div>{`${t("get.widget.title")} (${orgs.length}/${total})`}</Div>
        {orgs.length === 0 ? (
          <Div>{t("get.widget.noOrgsFound")}</Div>
        ) : (
          orgs.map((o) => (
            <Div key={o.id}>
              {`${o.status === CorvinaOrgStatus.DONE ? "●" : "○"} ${o.label} (${o.name})${o.vpnEnabled ? ` ${t("get.widget.badges.vpnOn")}` : ""}${o.dataEnabled ? ` ${t("get.widget.badges.dataOn")}` : ""}${o.mfaRequired ? ` ${t("get.widget.badges.mfaRequired")}` : ""}`}
            </Div>
          ))
        )}
      </Div>
    );
  }

  // ── Web ──
  return (
    <Div className="flex flex-col min-h-0">
      {/* Header */}
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Building className="h-3.5 w-3.5 text-muted-foreground" />
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
          onClick={handleNavCreateOrg}
        >
          <Plus className="h-3.5 w-3.5" />
          <Span className="text-xs font-semibold">
            {t("get.widget.nav.createOrg")}
          </Span>
        </Button>
      </Div>

      {/* Nav strip */}
      <Div className="flex items-center gap-1 px-3 py-1.5 border-b bg-muted/20 shrink-0 flex-wrap">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 gap-1 text-[11px] px-2"
          onClick={handleNavAppStore}
        >
          <ShoppingBag className="h-3 w-3" />
          {t("get.widget.nav.appStore")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 gap-1 text-[11px] px-2"
          onClick={handleNavInstalledApps}
        >
          <PackageCheck className="h-3 w-3" />
          {t("get.widget.nav.installedApps")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 gap-1 text-[11px] px-2"
          onClick={handleNavAlarms}
        >
          <Bell className="h-3 w-3" />
          {t("get.widget.nav.alarms")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 gap-1 text-[11px] px-2"
          onClick={handleNavDeviceLicenses}
        >
          <Shield className="h-3 w-3" />
          {t("get.widget.nav.deviceLicenses")}
        </Button>
      </Div>

      {/* Content */}
      <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-160px))]">
        {isLoading ? (
          <Div className="h-52 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <Span className="text-xs text-muted-foreground">
              {t("get.widget.loading")}
            </Span>
          </Div>
        ) : orgs.length === 0 ? (
          <Div className="h-52 flex flex-col items-center justify-center gap-4 px-8">
            <Div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              <Building className="h-6 w-6 text-muted-foreground/30" />
            </Div>
            <Div className="text-center">
              <Span className="font-semibold text-sm block">
                {t("get.widget.noOrgsFound")}
              </Span>
              <Span className="text-xs text-muted-foreground block mt-1">
                {t("get.widget.noOrgsHint")}
              </Span>
            </Div>
            <Button
              type="button"
              variant="default"
              size="sm"
              className="gap-1.5"
              onClick={handleNavCreateOrg}
            >
              <Plus className="h-3.5 w-3.5" />
              {t("get.widget.nav.createOrg")}
            </Button>
          </Div>
        ) : (
          <Div className="p-3 grid grid-cols-2 gap-2.5">
            {orgs.map((org) => (
              <OrgCard key={org.id} org={org} t={t} onClick={handleOrgClick} />
            ))}
          </Div>
        )}
      </Div>
    </Div>
  );
}
