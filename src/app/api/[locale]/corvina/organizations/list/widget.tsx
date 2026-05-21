"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Bell } from "next-vibe-ui/ui/icons/Bell";
import { Building } from "next-vibe-ui/ui/icons/Building";
import { FileText } from "next-vibe-ui/ui/icons/FileText";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { PackageCheck } from "next-vibe-ui/ui/icons/PackageCheck";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { ShoppingBag } from "next-vibe-ui/ui/icons/ShoppingBag";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { CorvinaOrgStatusValue } from "../enums";
import { CorvinaOrgStatus } from "../enums";
import type definition from "./definition";
import type { CorvinaOrganizationsListResponseOutput } from "./definition";
import type { CorvinaOrganizationsListT } from "./i18n";

type Org = CorvinaOrganizationsListResponseOutput["organizations"][number];

const SEP = "·";

const STATUS_COLORS: Record<typeof CorvinaOrgStatusValue, string> = {
  [CorvinaOrgStatus.DONE]: "bg-success/10 text-success",
  [CorvinaOrgStatus.NEW]: "bg-muted text-muted-foreground",
  [CorvinaOrgStatus.PROVISIONING]: "bg-warning/10 text-warning",
  [CorvinaOrgStatus.DELETING]: "bg-warning/10 text-warning",
  [CorvinaOrgStatus.DELETED]: "bg-muted text-muted-foreground",
};

function ToggleDot({ on }: { on: boolean }): React.JSX.Element {
  return (
    <Span
      className={cn(
        "inline-flex w-2 h-2 rounded-full",
        on ? "bg-success" : "bg-muted-foreground/30",
      )}
    />
  );
}

function OrgRow({
  org,
  t,
  onClick,
}: {
  org: Org;
  t: CorvinaOrganizationsListT;
  onClick: (org: Org) => void;
}): React.JSX.Element {
  return (
    <Div
      className="group flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-accent cursor-pointer transition-colors"
      onClick={() => onClick(org)}
    >
      <Div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Building className="h-4 w-4 text-primary" />
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm">{org.label}</Span>
          <Span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              STATUS_COLORS[org.status],
            )}
          >
            {t(org.status)}
          </Span>
        </Div>
        <Div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <Span className="font-mono">{org.name}</Span>
          <Span>{SEP}</Span>
          <Span>{org.resourceId}</Span>
        </Div>
      </Div>

      <Div className="flex items-center gap-3 shrink-0">
        <Div className="flex items-center gap-1 text-xs text-muted-foreground">
          <ToggleDot on={org.dataEnabled} />
          <Span>{t("get.response.organizations.dataEnabled")}</Span>
        </Div>
        <Div className="flex items-center gap-1 text-xs text-muted-foreground">
          <ToggleDot on={org.vpnEnabled} />
          <Span>{t("get.response.organizations.vpnEnabled")}</Span>
        </Div>
        <Span className="text-xs font-mono text-muted-foreground/60">
          #{org.id}
        </Span>
      </Div>
    </Div>
  );
}

export function OrgListContainer(): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

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

  const handleNavLicenses = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../../licenses/list/definition");
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

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Building className="h-4 w-4 text-muted-foreground" />
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
          onClick={handleRefresh}
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      <Div className="flex items-center gap-1 px-3 py-2 border-b bg-muted/20 shrink-0 flex-wrap">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={handleNavAppStore}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          {t("get.widget.nav.appStore")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={handleNavInstalledApps}
        >
          <PackageCheck className="h-3.5 w-3.5" />
          {t("get.widget.nav.installedApps")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={handleNavAlarms}
        >
          <Bell className="h-3.5 w-3.5" />
          {t("get.widget.nav.alarms")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={handleNavLicenses}
        >
          <FileText className="h-3.5 w-3.5" />
          {t("get.widget.nav.licenses")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs ml-auto"
          onClick={handleNavCreateOrg}
        >
          <Plus className="h-3.5 w-3.5" />
          {t("get.widget.nav.createOrg")}
        </Button>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))]">
        {isLoading ? (
          <Div className="h-48 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Div>
        ) : orgs.length === 0 ? (
          <Div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Building className="h-8 w-8 opacity-30" />
            <Span className="text-sm">{t("get.widget.noOrgsFound")}</Span>
          </Div>
        ) : (
          orgs.map((org) => (
            <OrgRow key={org.id} org={org} t={t} onClick={handleOrgClick} />
          ))
        )}
      </Div>
    </Div>
  );
}
