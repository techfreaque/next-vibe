"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Textarea } from "next-vibe-ui/ui/textarea";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Download } from "next-vibe-ui/ui/icons/Download";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { PackageCheck } from "next-vibe-ui/ui/icons/PackageCheck";
import { ShoppingBag } from "next-vibe-ui/ui/icons/ShoppingBag";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { CorvinaAppInstallStatus } from "../enums";
import type definition from "./definition";
import type { CorvinaAppInstallResponseOutput } from "./definition";

const STATUS_COLORS: Record<string, string> = {
  [CorvinaAppInstallStatus.INSTALLED]:
    "bg-success/10 text-success border-success/20",
  [CorvinaAppInstallStatus.INSTALLATION]:
    "bg-warning/10 text-warning border-warning/20",
  [CorvinaAppInstallStatus.INSTALLATION_FAILED]:
    "bg-destructive/10 text-destructive border-destructive/20",
  [CorvinaAppInstallStatus.MANUAL_UPGRADABLE]:
    "bg-blue-500/10 text-blue-600 border-blue-500/20",
  [CorvinaAppInstallStatus.FREE_TRIAL]:
    "bg-purple-500/10 text-purple-600 border-purple-500/20",
  [CorvinaAppInstallStatus.PAYMENT_REQUIRED]:
    "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

function InstallResult({
  result,
  labels,
}: {
  result: CorvinaAppInstallResponseOutput;
  labels: {
    resultTitle: string;
    appLabel: string;
    statusLabel: string;
    serviceAccountLabel: string;
    installIdLabel: string;
    installedAtLabel: string;
  };
}): React.JSX.Element {
  const statusColor =
    result.status !== null && result.status !== undefined
      ? (STATUS_COLORS[result.status] ?? "bg-muted text-muted-foreground")
      : "bg-muted text-muted-foreground";

  return (
    <Div className="mt-4 rounded-xl border bg-card p-4 space-y-3">
      <Div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-success" />
        <Span className="font-semibold text-sm">{labels.resultTitle}</Span>
      </Div>

      <Div className="grid grid-cols-2 gap-3 text-sm">
        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">
            {labels.appLabel}
          </Span>
          <Div className="font-medium">
            {result.appName ?? result.appKey ?? "—"}
          </Div>
          {result.appKey !== null && result.appName !== null && (
            <Div className="font-mono text-xs text-muted-foreground">
              {result.appKey}
            </Div>
          )}
        </Div>

        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">
            {labels.statusLabel}
          </Span>
          <Div>
            {result.status !== null && result.status !== undefined ? (
              <Badge
                className={cn("text-xs font-medium border", statusColor)}
                variant="outline"
              >
                {result.status}
              </Badge>
            ) : (
              <Span className="text-muted-foreground">—</Span>
            )}
          </Div>
        </Div>

        {result.serviceAccountUsername !== null &&
          result.serviceAccountUsername !== undefined && (
            <Div className="col-span-2 space-y-0.5">
              <Span className="text-xs text-muted-foreground">
                {labels.serviceAccountLabel}
              </Span>
              <Div className="font-mono text-xs">
                {result.serviceAccountUsername}
              </Div>
            </Div>
          )}

        {result.id !== null && result.id !== undefined && (
          <Div className="space-y-0.5">
            <Span className="text-xs text-muted-foreground">
              {labels.installIdLabel}
            </Span>
            <Div className="font-mono text-xs">#{result.id}</Div>
          </Div>
        )}

        {result.createdAt !== null && result.createdAt !== undefined && (
          <Div className="space-y-0.5">
            <Span className="text-xs text-muted-foreground">
              {labels.installedAtLabel}
            </Span>
            <Div className="text-xs">
              {new Date(result.createdAt).toLocaleString()}
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}

export function AppInstallContainer(): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();

  const [orgId, setOrgId] = useState<number>(45511);
  const [manifest, setManifest] = useState("");
  const [appId, setAppId] = useState<number | undefined>(undefined);
  const [planId, setPlanId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNavStore = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../list/definition");
      navigate(def.default.GET, {});
    })();
  }, [navigate]);

  const handleNavInstalled = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../installed/definition");
      navigate(def.default.GET, {});
    })();
  }, [navigate]);

  const handleSubmit = useCallback((): void => {
    setIsSubmitting(true);
    void endpointMutations?.create
      ?.submit({
        organizationId: orgId,
        manifest,
        appId,
        planId: planId !== "" ? planId : undefined,
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [endpointMutations, orgId, manifest, appId, planId]);

  const resultLabels = {
    resultTitle: t("post.widget.resultTitle"),
    appLabel: t("post.widget.appLabel"),
    statusLabel: t("post.widget.statusLabel"),
    serviceAccountLabel: t("post.widget.serviceAccountLabel"),
    installIdLabel: t("post.widget.installIdLabel"),
    installedAtLabel: t("post.widget.installedAtLabel"),
  };

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Download className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={handleNavStore}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          {t("post.widget.appStore")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={handleNavInstalled}
        >
          <PackageCheck className="h-3.5 w-3.5" />
          {t("post.widget.installedApps")}
        </Button>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="space-y-1.5">
          <Label htmlFor="install-org-id">
            {t("post.organizationId.label")}
          </Label>
          <Input
            id="install-org-id"
            type="number"
            value={orgId}
            onChange={(e) => {
              setOrgId(e.target.value);
            }}
            placeholder={t("post.organizationId.placeholder")}
          />
          <Span className="text-xs text-muted-foreground">
            {t("post.organizationId.description")}
          </Span>
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="install-manifest">{t("post.manifest.label")}</Label>
          <Textarea
            id="install-manifest"
            value={manifest}
            onChange={(e) => {
              setManifest(e.target.value);
            }}
            placeholder={t("post.widget.jsonPlaceholder")}
            rows={12}
            className="font-mono text-xs resize-y"
          />
          <Span className="text-xs text-muted-foreground">
            {t("post.manifest.description")}
          </Span>
        </Div>

        <Div className="grid grid-cols-2 gap-3">
          <Div className="space-y-1.5">
            <Label htmlFor="install-app-id">{t("post.appId.label")}</Label>
            <Input
              id="install-app-id"
              type="number"
              value={appId}
              onChange={(e) => {
                setAppId(e.target.value);
              }}
              placeholder={t("post.appId.placeholder")}
            />
          </Div>
          <Div className="space-y-1.5">
            <Label htmlFor="install-plan-id">{t("post.planId.label")}</Label>
            <Input
              id="install-plan-id"
              type="text"
              value={planId}
              onChange={(e) => {
                setPlanId(e.target.value);
              }}
              placeholder={t("post.planId.placeholder")}
            />
          </Div>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={handleSubmit}
          disabled={isSubmitting || manifest === ""}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("post.submitButton.loadingText")}
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              {t("post.submitButton.label")}
            </>
          )}
        </Button>

        {result !== null && result !== undefined && (
          <InstallResult result={result} labels={resultLabels} />
        )}
      </Div>
    </Div>
  );
}
