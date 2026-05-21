"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Download } from "next-vibe-ui/ui/icons/Download";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Package } from "next-vibe-ui/ui/icons/Package";
import { PackageCheck } from "next-vibe-ui/ui/icons/PackageCheck";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { ShoppingBag } from "next-vibe-ui/ui/icons/ShoppingBag";
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

import { CorvinaAppInstallStatus } from "../enums";
import type definition from "./definition";
import type { CorvinaAppsInstalledResponseOutput } from "./definition";

type Install = CorvinaAppsInstalledResponseOutput["installs"][number];

const SEP = "·";

const STATUS_COLORS: Record<string, string> = {
  [CorvinaAppInstallStatus.INSTALLED]:
    "bg-success/10 text-success border-success/20",
  [CorvinaAppInstallStatus.INSTALLATION]:
    "bg-warning/10 text-warning border-warning/20",
  [CorvinaAppInstallStatus.INSTALLATION_FAILED]:
    "bg-destructive/10 text-destructive border-destructive/20",
  [CorvinaAppInstallStatus.UNINSTALLATION]:
    "bg-warning/10 text-warning border-warning/20",
  [CorvinaAppInstallStatus.UNINSTALLED]:
    "bg-muted text-muted-foreground border-border",
  [CorvinaAppInstallStatus.UNINSTALLATION_FAILED]:
    "bg-destructive/10 text-destructive border-destructive/20",
  [CorvinaAppInstallStatus.MANUAL_UPGRADABLE]:
    "bg-blue-500/10 text-blue-600 border-blue-500/20",
  [CorvinaAppInstallStatus.FREE_TRIAL]:
    "bg-purple-500/10 text-purple-600 border-purple-500/20",
  [CorvinaAppInstallStatus.PAYMENT_REQUIRED]:
    "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

function InstallRow({
  install,
  trialLabel,
  autoRenewLabel,
}: {
  install: Install;
  trialLabel: string;
  autoRenewLabel: string;
}): React.JSX.Element {
  const statusColor =
    STATUS_COLORS[install.status] ??
    "bg-muted text-muted-foreground border-border";

  return (
    <Div className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-accent/50 transition-colors">
      <Div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Package className="h-4 w-4 text-primary" />
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm">
            {install.appName ?? install.appKey ?? `#${install.id}`}
          </Span>
          <Badge
            className={cn("text-xs font-medium border shrink-0", statusColor)}
            variant="outline"
          >
            {install.status}
          </Badge>
          {install.manifestFrom !== null &&
            install.manifestFrom !== undefined && (
              <Badge variant="secondary" className="text-xs shrink-0">
                {install.manifestFrom}
              </Badge>
            )}
        </Div>
        <Div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
          {install.appKey !== null && install.appKey !== undefined && (
            <Span className="font-mono">{install.appKey}</Span>
          )}
          {install.serviceAccountUsername !== null &&
            install.serviceAccountUsername !== undefined && (
              <>
                <Span>{SEP}</Span>
                <Span className="font-mono">
                  {install.serviceAccountUsername}
                </Span>
              </>
            )}
          {install.createdAt !== null && install.createdAt !== undefined && (
            <>
              <Span>{SEP}</Span>
              <Span>{new Date(install.createdAt).toLocaleDateString()}</Span>
            </>
          )}
        </Div>
      </Div>

      <Div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground">
        {install.freeTrial && (
          <Badge variant="secondary" className="text-xs">
            {trialLabel}
          </Badge>
        )}
        {install.autoRenewActive && (
          <Badge variant="secondary" className="text-xs">
            {autoRenewLabel}
          </Badge>
        )}
        <Span className="font-mono opacity-50">#{install.id}</Span>
      </Div>
    </Div>
  );
}

export function InstalledAppsContainer(): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const orgId = form.watch("organizationId");

  const installs = data?.installs ?? [];
  const total = data?.total ?? 0;
  const isLoading = data === undefined;

  const trialLabel = t("get.widget.trialBadge");
  const autoRenewLabel = t("get.widget.autoRenewBadge");

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleNavStore = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../list/definition");
      navigate(def.default.GET, {});
    })();
  }, [navigate]);

  const handleNavInstall = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../install/definition");
      navigate(def.default.POST, {
        data: orgId !== undefined ? { organizationId: orgId } : {},
      });
    })();
  }, [navigate, orgId]);

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <PackageCheck className="h-4 w-4 text-muted-foreground" />
        <Div className="flex flex-col mr-auto">
          <Span className="font-semibold text-sm">
            {t("get.widget.title")}
            {total > 0 && (
              <Span className="ml-2 text-xs text-muted-foreground font-normal">
                ({total})
              </Span>
            )}
          </Span>
          {orgId !== undefined && (
            <Span className="text-xs text-muted-foreground font-mono">
              {t("get.widget.orgLabel")} #{orgId}
            </Span>
          )}
        </Div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={handleNavStore}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          {t("get.widget.appStore")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={handleNavInstall}
        >
          <Download className="h-3.5 w-3.5" />
          {t("get.widget.installApp")}
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
        ) : installs.length === 0 ? (
          <Div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <PackageCheck className="h-8 w-8 opacity-30" />
            <Span className="text-sm">{t("get.widget.noInstallsFound")}</Span>
          </Div>
        ) : (
          installs.map((install) => (
            <InstallRow
              key={install.id}
              install={install}
              trialLabel={trialLabel}
              autoRenewLabel={autoRenewLabel}
            />
          ))
        )}
      </Div>
    </Div>
  );
}
