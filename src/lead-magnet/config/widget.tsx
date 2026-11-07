"use client";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { CheckCircle2 } from "next-vibe/ui/components/icons/CheckCircle2";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
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
import React, { useCallback, useMemo, useState } from "react";

import { LeadMagnetProviderDB } from "../enum";
import type endpoints from "./definition";

type ProviderKey = (typeof LeadMagnetProviderDB)[number];

interface ProviderModule {
  default: { POST: CreateApiEndpointAny };
}

function ProviderForm({
  providerKey,
  loadingLabel,
  prefillData,
}: {
  providerKey: ProviderKey;
  loadingLabel: string;
  prefillData: Record<string, string | boolean | null | undefined>;
}): JSX.Element {
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const platform = useWidgetPlatform();
  const [endpointDef, setEndpointDef] = useState<{
    POST: CreateApiEndpointAny;
  } | null>(null);

  React.useEffect(() => {
    const folderName: Record<string, string> = {
      GOOGLE_SHEETS: "google-sheets",
      PLATFORM_EMAIL: "platform-email",
    };
    const name = folderName[providerKey] ?? providerKey.toLowerCase();
    void (
      import(
        /* @vite-ignore */
        `../providers/${name}/definition`
      ) as Promise<ProviderModule>
    ).then((mod) => {
      setEndpointDef(mod.default);
      return mod;
    });
  }, [providerKey]);

  if (!endpointDef) {
    return (
      <Div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        {loadingLabel}
      </Div>
    );
  }

  return (
    <EndpointsPage
      endpoint={endpointDef}
      locale={locale}
      user={user}
      platform={platform}
      endpointOptions={{
        create: {
          formOptions: { persistForm: false },
          autoPrefillData: prefillData,
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

  const config = widgetData?.config ?? null;
  const currentProvider = config?.provider;

  // null = no explicit user selection yet, fall through to currentProvider
  const [override, setOverride] = useState<ProviderKey | null>(null);

  const selectedProvider = override ?? currentProvider ?? "";
  const activeProvider = override ?? currentProvider;

  const providerOptions = useMemo(
    () =>
      LeadMagnetProviderDB.map((key) => ({
        value: key,
        label: t(`widget.providers.${key}`),
      })),
    [t],
  );

  const handleDelete = useCallback((): void => {
    void (async (): Promise<void> => {
      const [configDef, { apiClient }] = await Promise.all([
        import("./definition"),
        import("next-vibe/unified-ui/hooks/store"),
      ]);
      if (!user) {
        return;
      }
      await apiClient.mutate(
        configDef.DELETE,
        logger,
        user,
        undefined,
        undefined,
        locale,
      );
      endpointMutations?.read?.refetch?.();
      setOverride(null);
    })();
  }, [user, locale, logger, endpointMutations]);

  return (
    <WidgetShell>
      <WidgetHeader
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
        {config ? (
          <Div className="flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm">
            <Div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <Div className="flex flex-col">
                <Span className="text-sm font-medium">
                  {providerOptions.find((p) => p.value === config.provider)
                    ?.label ?? config.provider}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {config.isActive ? t("widget.active") : t("widget.inactive")}
                  {config.headline ? ` · ${config.headline}` : ""}
                </Span>
              </Div>
            </Div>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("widget.delete")}
              title={t("widget.delete")}
              className="h-11 w-11 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Div>
        ) : (
          <>
            {/* Pitch block - explains the feature for first-time users */}
            <Div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 px-5 py-4">
              <Span className="text-base font-semibold text-foreground">
                {t("widget.pitch.headline")}
              </Span>
              <P className="m-0 text-sm leading-relaxed text-muted-foreground">
                {t("widget.pitch.body")}
              </P>
              <Div className="flex flex-col gap-1.5 pt-1">
                {[
                  t("widget.pitch.step1"),
                  t("widget.pitch.step2"),
                  t("widget.pitch.step3"),
                ].map((step) => (
                  <Div
                    key={step}
                    className="flex items-center gap-2 text-sm text-foreground/80"
                  >
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <Span>{step}</Span>
                  </Div>
                ))}
              </Div>
            </Div>
          </>
        )}

        <Div className="flex flex-col gap-2">
          <Span className="text-sm font-medium">
            {config ? t("widget.switchPlatform") : t("widget.choosePlatform")}
          </Span>
          <Select
            value={selectedProvider}
            onValueChange={(v): void => {
              const opt = providerOptions.find((o) => o.value === v);
              if (opt) {
                setOverride(opt.value);
              }
            }}
          >
            <SelectTrigger>
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
          <Div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <ProviderForm
              key={activeProvider}
              providerKey={activeProvider}
              loadingLabel={t("widget.loading")}
              prefillData={{
                headline: config?.headline ?? undefined,
                buttonText: config?.buttonText ?? undefined,
                isActive: config?.isActive ?? true,
                ...config?.publicCredentials,
              }}
            />
          </Div>
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
  const [capturesDef, setCapturesDef] = React.useState<{
    GET: CreateApiEndpointAny;
  } | null>(null);

  React.useEffect(() => {
    void import(
      /* @vite-ignore */
      `../captures/definition`
    ).then((mod: { GET: CreateApiEndpointAny }) => {
      setCapturesDef({ GET: mod.GET });
      return mod;
    });
  }, []);

  if (!capturesDef) {
    return <Div />;
  }

  return (
    <Div className="flex flex-col gap-3 pt-2">
      <Div className="h-px bg-border" />
      <Span className="text-sm font-semibold px-1">{capturedLeadsLabel}</Span>
      <EndpointsPage
        endpoint={capturesDef}
        locale={locale}
        user={user}
        platform={platform}
      />
    </Div>
  );
}

export { LeadMagnetConfigContainer as LeadMagnetConfigWidget };
