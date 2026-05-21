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
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";

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
  const platform = useWidgetPlatform();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.POST>();
  const isSubmitting = useWidgetIsSubmitting() ?? false;

  const orgId = form.watch("organizationId");
  const manifestValue = form.watch("manifest");
  const manifest =
    manifestValue === null || manifestValue === undefined
      ? ""
      : typeof manifestValue === "string"
        ? manifestValue
        : JSON.stringify(manifestValue, null, 2);
  const appId = form.watch("appId");
  const planId = form.watch("planId") ?? "";

  const manifestError = form.formState.errors.manifest?.message;
  const appIdError = form.formState.errors.appId?.message;
  const planIdError = form.formState.errors.planId?.message;

  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const handleNavStore = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../list/definition");
      navigate(def.default.GET, {});
    })();
  }, [navigate]);

  const handleNavInstalled = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../installed/definition");
      navigate(def.default.GET, {
        data: orgId !== undefined ? { organizationId: orgId } : {},
      });
    })();
  }, [navigate, orgId]);

  const resultLabels = {
    resultTitle: t("post.widget.resultTitle"),
    appLabel: t("post.widget.appLabel"),
    statusLabel: t("post.widget.statusLabel"),
    serviceAccountLabel: t("post.widget.serviceAccountLabel"),
    installIdLabel: t("post.widget.installIdLabel"),
    installedAtLabel: t("post.widget.installedAtLabel"),
  };

  if (isCompact) {
    if (!result) {
      return <Div />;
    }
    const parts: string[] = [];
    if (result.id !== null && result.id !== undefined) {
      parts.push(`id:${result.id}`);
    }
    if (result.appName !== null && result.appName !== undefined) {
      parts.push(`app:${result.appName}`);
    } else if (result.appKey !== null && result.appKey !== undefined) {
      parts.push(`key:${result.appKey}`);
    }
    if (result.status !== null && result.status !== undefined) {
      parts.push(`status:${result.status}`);
    }
    if (
      result.serviceAccountUsername !== null &&
      result.serviceAccountUsername !== undefined
    ) {
      parts.push(`svc:${result.serviceAccountUsername}`);
    }
    return (
      <Div className="font-mono text-sm p-2">
        <Div className="font-semibold mb-1">{t("post.widget.resultTitle")}</Div>
        <Div>{parts.join(" | ")}</Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Download className="h-4 w-4 text-muted-foreground" />
        <Div className="flex flex-col mr-auto">
          <Span className="font-semibold text-sm">
            {t("post.widget.title")}
          </Span>
          {orgId !== undefined && (
            <Span className="text-xs text-muted-foreground font-mono">
              {t("post.widget.orgLabel")} #{orgId}
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
        <FormAlertWidget field={{}} />

        <Div className="space-y-1.5">
          <Label htmlFor="install-manifest">
            {t("post.manifest.label")}
            <Span className="text-destructive ml-0.5">*</Span>
          </Label>
          <Textarea
            id="install-manifest"
            value={manifest}
            onChange={(e) =>
              form.setValue("manifest", e.target.value, { shouldDirty: true })
            }
            placeholder={t("post.widget.jsonPlaceholder")}
            rows={12}
            className="font-mono text-xs resize-y"
          />
          {manifestError && (
            <Span className="text-xs text-destructive">{manifestError}</Span>
          )}
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
              onChange={(e) =>
                form.setValue("appId", e.target.value, { shouldDirty: true })
              }
              placeholder={t("post.appId.placeholder")}
            />
            {appIdError && (
              <Span className="text-xs text-destructive">{appIdError}</Span>
            )}
          </Div>
          <Div className="space-y-1.5">
            <Label htmlFor="install-plan-id">{t("post.planId.label")}</Label>
            <Input
              id="install-plan-id"
              type="text"
              value={planId}
              onChange={(e) =>
                form.setValue("planId", e.target.value, { shouldDirty: true })
              }
              placeholder={t("post.planId.placeholder")}
            />
            {planIdError && (
              <Span className="text-xs text-destructive">{planIdError}</Span>
            )}
          </Div>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit}
          disabled={isSubmitting}
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
