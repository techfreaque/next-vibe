"use client";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "next-vibe/ui/components/alert-dialog";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import { Label } from "next-vibe/ui/components/label";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

import capturesDefinition from "../captures/definition";
import { LeadMagnetProviderDB } from "../enum";
import type endpoints from "./definition";

type ProviderKey = (typeof LeadMagnetProviderDB)[number];

interface ProviderModule {
  default: { POST: CreateApiEndpointAny };
}

const loadProvider: Record<ProviderKey, () => Promise<ProviderModule>> = {
  GETRESPONSE: () => import("../providers/getresponse/definition"),
  KLAVIYO: () => import("../providers/klaviyo/definition"),
  EMARSYS: () => import("../providers/emarsys/definition"),
  ACUMBAMAIL: () => import("../providers/acumbamail/definition"),
  CLEVERREACH: () => import("../providers/cleverreach/definition"),
  CONNECTIF: () => import("../providers/connectif/definition"),
  DATANEXT: () => import("../providers/datanext/definition"),
  EDRONE: () => import("../providers/edrone/definition"),
  EXPERTSENDER: () => import("../providers/expertsender/definition"),
  FRESHMAIL: () => import("../providers/freshmail/definition"),
  MAILUP: () => import("../providers/mailup/definition"),
  MAPP: () => import("../providers/mapp/definition"),
  SAILTHRU: () => import("../providers/sailthru/definition"),
  SALESMANAGO: () => import("../providers/salesmanago/definition"),
  SHOPIFY: () => import("../providers/shopify/definition"),
  SPOTLER: () => import("../providers/spotler/definition"),
  YOULEAD: () => import("../providers/youlead/definition"),
  ADOBECAMPAIGN: () => import("../providers/adobecampaign/definition"),
  GOOGLE_SHEETS: () => import("../providers/google-sheets/definition"),
  PLATFORM_EMAIL: () => import("../providers/platform-email/definition"),
};

function ProviderForm({
  providerKey,
  loadingLabel,
  errorLabel,
  prefillData,
  onSaved,
}: {
  providerKey: ProviderKey;
  loadingLabel: string;
  errorLabel: string;
  prefillData: Record<string, string | boolean | null | undefined>;
  onSaved: () => Promise<void>;
}): JSX.Element {
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const platform = useWidgetPlatform();
  const [endpointDef, setEndpointDef] = useState<{
    POST: CreateApiEndpointAny;
  } | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect((): (() => void) => {
    let active = true;
    void (async (): Promise<void> => {
      try {
        const mod = await loadProvider[providerKey]();
        if (active) {
          setEndpointDef(mod.default);
        }
      } catch {
        if (active) {
          setLoadFailed(true);
        }
      }
    })();
    return (): void => {
      active = false;
    };
  }, [providerKey]);

  if (loadFailed) {
    return <ResultBanner variant="danger" title={errorLabel} />;
  }
  if (!endpointDef) {
    return (
      <Div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        {loadingLabel}
      </Div>
    );
  }

  return (
    <EndpointsPage
      logger={logger}
      endpoint={endpointDef}
      locale={locale}
      user={user}
      platform={platform}
      endpointOptions={{
        create: {
          formOptions: { persistForm: false },
          autoPrefillData: prefillData,
          mutationOptions: { onSuccess: onSaved },
        },
      }}
    />
  );
}

export function LeadMagnetConfigContainer(): JSX.Element {
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const platform = useWidgetPlatform();
  const logger = useWidgetLogger();
  const { endpointMutations } = useWidgetContext();
  const { pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const widgetData = useWidgetValue<typeof endpoints.GET>();
  const providerSelectId = useId();

  const config = widgetData?.config ?? null;
  const currentProvider = config?.provider;

  // null = no explicit user selection yet, fall through to currentProvider
  const [override, setOverride] = useState<ProviderKey | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [disconnectError, setDisconnectError] = useState<string>();

  const selectedProvider = override ?? currentProvider ?? "";
  const activeProvider = override ?? currentProvider;
  const providerCredentials =
    activeProvider === currentProvider ? config?.publicCredentials : undefined;
  const providerListId =
    activeProvider === currentProvider ? config?.listId : undefined;

  const refreshConfig = useCallback(async (): Promise<void> => {
    await endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const providerOptions = useMemo(
    () =>
      LeadMagnetProviderDB.map((key) => ({
        value: key,
        label: t(`widget.providers.${key}`),
      })),
    [t],
  );

  const handleDelete = useCallback((): void => {
    setConfirmOpen(false);
    if (!user || disconnecting) {
      return;
    }
    setDisconnecting(true);
    setDisconnectError(undefined);
    void (async (): Promise<void> => {
      try {
        const [configDef, { apiClient }] = await Promise.all([
          import("./definition"),
          import("next-vibe/unified-ui/hooks/store"),
        ]);
        const result = await apiClient.mutate(
          configDef.DELETE,
          logger,
          user,
          undefined,
          undefined,
          locale,
        );
        if (!result.success) {
          setDisconnectError(result.message);
          return;
        }
        await refreshConfig();
        setOverride(null);
      } catch {
        setDisconnectError(t("delete.errors.internal.description"));
      } finally {
        setDisconnecting(false);
      }
    })();
  }, [disconnecting, user, locale, logger, refreshConfig, t]);

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("get.title")}
        backButton={
          canGoBack ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(): void => {
                pop();
              }}
              className="gap-1.5 -ml-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("widget.back")}
            </Button>
          ) : undefined
        }
      />
      <Div className="flex flex-col gap-6">
        {disconnectError && (
          <ResultBanner
            variant="danger"
            title={t("delete.errors.internal.title")}
            message={disconnectError}
          />
        )}
        {config ? (
          <Div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
            <Div className="flex min-w-0 flex-col gap-1">
              <Div className="flex flex-wrap items-center gap-2">
                <Span className="text-sm font-medium">
                  {providerOptions.find((p) => p.value === config.provider)
                    ?.label ?? config.provider}
                </Span>
                <StatusPill
                  status={config.isActive ? "active" : "inactive"}
                  label={t(
                    config.isActive ? "widget.active" : "widget.inactive",
                  )}
                  variant={config.isActive ? "success" : "muted"}
                />
              </Div>
              {config.headline && (
                <Span className="text-xs text-muted-foreground">
                  {config.headline}
                </Span>
              )}
            </Div>
            <Button
              variant="ghost"
              size="icon"
              disabled={disconnecting}
              aria-label={t("widget.delete")}
              title={t("widget.delete")}
              className="h-11 w-11 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={(): void => {
                setConfirmOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("widget.confirmDelete.title", {
                      provider:
                        providerOptions.find((p) => p.value === config.provider)
                          ?.label ?? config.provider,
                    })}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("widget.confirmDelete.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t("widget.confirmDelete.cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {t("widget.confirmDelete.proceed")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Div>
        ) : (
          <P className="text-sm text-muted-foreground">
            {t("widget.noConfig")}
          </P>
        )}

        <Div className="flex flex-col gap-2">
          <Label htmlFor={providerSelectId} className="text-sm font-medium">
            {config ? t("widget.switchPlatform") : t("widget.choosePlatform")}
          </Label>
          <Select
            value={selectedProvider}
            onValueChange={(v): void => {
              const opt = providerOptions.find((o) => o.value === v);
              if (opt) {
                setOverride(opt.value);
              }
            }}
          >
            <SelectTrigger id={providerSelectId}>
              <SelectValue placeholder={t("widget.selectPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {providerOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Div>

        {activeProvider && (
          <ProviderForm
            key={`${activeProvider}:${config?.updatedAt ?? "new"}`}
            providerKey={activeProvider}
            loadingLabel={t("widget.loading")}
            errorLabel={t("get.errors.internal.title")}
            onSaved={refreshConfig}
            prefillData={{
              headline: config?.headline ?? undefined,
              buttonText: config?.buttonText ?? undefined,
              isActive: config?.isActive ?? true,
              ...providerCredentials,
              listId: providerListId ?? undefined,
              ...(activeProvider === "GOOGLE_SHEETS"
                ? {
                    spreadsheetId: providerListId ?? undefined,
                    sheetTab: providerCredentials?.["googleSheetTab"],
                  }
                : {}),
            }}
          />
        )}

        <CapturedLeadsSection
          locale={locale}
          user={user}
          platform={platform}
          capturedLeadsLabel={t("widget.capturedLeads")}
        />
      </Div>
    </WidgetShell>
  );
}

function CapturedLeadsSection({
  locale,
  user,
  platform,
  capturedLeadsLabel,
}: {
  locale: ReturnType<typeof useWidgetLocale>;
  user: ReturnType<typeof useWidgetUser>;
  platform: ReturnType<typeof useWidgetPlatform>;
  capturedLeadsLabel: string;
}): JSX.Element {
  const logger = useWidgetLogger();
  return (
    <Div className="flex flex-col gap-3 pt-2">
      <Div className="h-px bg-border" />
      <Span className="text-sm font-semibold px-1">{capturedLeadsLabel}</Span>
      <EndpointsPage
        logger={logger}
        endpoint={capturesDefinition}
        locale={locale}
        user={user}
        platform={platform}
        responseOnly
      />
    </Div>
  );
}

export { LeadMagnetConfigContainer as LeadMagnetConfigWidget };
