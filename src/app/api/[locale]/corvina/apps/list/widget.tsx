"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Image } from "next-vibe-ui/ui/image";
import { ExternalLink } from "next-vibe-ui/ui/icons/ExternalLink";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Package } from "next-vibe-ui/ui/icons/Package";
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

import { CorvinaAppStoreStatus } from "../enums";
import type definition from "./definition";
import type { CorvinaAppsListResponseOutput } from "./definition";

type App = CorvinaAppsListResponseOutput["apps"][number];

const STATUS_COLORS: Record<string, string> = {
  [CorvinaAppStoreStatus.ACTIVE]: "bg-success/10 text-success",
  [CorvinaAppStoreStatus.UNDER_EVALUATION]: "bg-warning/10 text-warning",
};

function AppCard({
  app,
  installLabel,
}: {
  app: App;
  installLabel: string;
}): React.JSX.Element {
  const { push: navigate } = useWidgetNavigation();

  const handleInstall = useCallback((): void => {
    void (async (): Promise<void> => {
      const installDef = await import("../install/definition");
      navigate(installDef.default.POST, {});
    })();
  }, [navigate]);

  return (
    <Div className="group flex flex-col gap-3 p-4 rounded-xl border bg-card hover:border-primary/40 hover:shadow-sm transition-all">
      <Div className="flex items-start gap-3">
        <Div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          {app.iconUrl ? (
            <Image
              src={app.iconUrl}
              alt={app.name}
              width={24}
              height={24}
              className="object-contain"
            />
          ) : (
            <Package className="h-5 w-5 text-primary" />
          )}
        </Div>

        <Div className="flex-1 min-w-0">
          <Div className="flex items-center gap-2 flex-wrap">
            <Span className="font-semibold text-sm truncate">{app.name}</Span>
            <Span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0",
                STATUS_COLORS[app.status] ?? "bg-muted text-muted-foreground",
              )}
            >
              {app.status === CorvinaAppStoreStatus.ACTIVE
                ? "Active"
                : "Under Evaluation"}
            </Span>
          </Div>
          <Span className="font-mono text-xs text-muted-foreground">
            {app.key}
          </Span>
        </Div>
      </Div>

      {app.description && (
        <Span className="text-xs text-muted-foreground line-clamp-2">
          {app.description}
        </Span>
      )}

      <Div className="flex items-center justify-between mt-auto pt-1">
        {app.version && (
          <Span className="text-xs font-mono text-muted-foreground/60">
            v{app.version}
          </Span>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-auto gap-1.5 text-xs"
          onClick={handleInstall}
        >
          <ExternalLink className="h-3 w-3" />
          {installLabel}
        </Button>
      </Div>
    </Div>
  );
}

export function AppListContainer(): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const apps = data?.apps ?? [];
  const total = data?.total ?? 0;
  const isLoading = data === undefined;

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleNavInstalled = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../installed/definition");
      navigate(def.default.GET, {});
    })();
  }, [navigate]);

  const handleNavInstall = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../install/definition");
      navigate(def.default.POST, {});
    })();
  }, [navigate]);

  const installLabel = t("get.widget.install");

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
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
          className="gap-1.5 text-xs"
          onClick={handleNavInstall}
        >
          {t("get.widget.installApp")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={handleNavInstalled}
        >
          {t("get.widget.installedApps")}
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
        ) : apps.length === 0 ? (
          <Div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <ShoppingBag className="h-8 w-8 opacity-30" />
            <Span className="text-sm">{t("get.widget.noAppsFound")}</Span>
          </Div>
        ) : (
          <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} installLabel={installLabel} />
            ))}
          </Div>
        )}
      </Div>
    </Div>
  );
}
