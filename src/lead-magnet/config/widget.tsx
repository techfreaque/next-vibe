"use client";

import { useProviderAvailability } from "next-vibe/agent/env-availability-context";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { ArrowRight } from "next-vibe/ui/ui/icons/ArrowRight";
import { CheckCircle2 } from "next-vibe/ui/ui/icons/CheckCircle2";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Mail } from "next-vibe/ui/ui/icons/Mail";
import { Trash2 } from "next-vibe/ui/ui/icons/Trash2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/ui/select";
import { Span } from "next-vibe/ui/ui/span";
import { P } from "next-vibe/ui/ui/typography";
import { WidgetHeader } from "next-vibe/ui/ui/widget-header";
import { WidgetShell } from "next-vibe/ui/ui/widget-shell";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/react/EndpointsPage";
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
  const logger = useWidgetLogger();
  const availability = useProviderAvailability();
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
        import("next-vibe/platforms/react/hooks/store"),
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
        availability,
      );
      endpointMutations?.read?.refetch?.();
      setOverride(null);
    })();
  }, [user, locale, logger, availability, endpointMutations]);

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
      <Div className="flex flex-col gap-6 p-4">
        {config ? (
          <Div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
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
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Div>
        ) : (
          <>
            {/* Pitch block - explains the feature for first-time users */}
            <Div className="rounded-lg border border-violet-300 dark:border-violet-500/20 bg-violet-100 dark:bg-violet-950/20 px-5 py-4 flex flex-col gap-3">
              <Span className="text-sm font-semibold text-violet-900 dark:text-violet-200">
                {t("widget.pitch.headline")}
              </Span>
              <P className="text-sm text-violet-800 dark:text-muted-foreground leading-relaxed">
                {t("widget.pitch.body")}
              </P>
              <Div className="flex flex-col gap-1.5 pt-1">
                {(
                  [
                    t("widget.pitch.step1"),
                    t("widget.pitch.step2"),
                    t("widget.pitch.step3"),
                  ] as string[]
                ).map((step, i) => (
                  <Div
                    key={i}
                    className="flex items-center gap-2 text-xs text-violet-700 dark:text-muted-foreground"
                  >
                    <ArrowRight className="h-3 w-3 shrink-0 text-violet-500 dark:text-violet-400" />
                    <Span>{step}</Span>
                  </Div>
                ))}
              </Div>
            </Div>

            <Div className="flex items-center gap-3 rounded-lg border border-dashed px-4 py-3 text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <Span className="text-sm">{t("widget.noConfig")}</Span>
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
          <Div className="rounded-lg border overflow-hidden">
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
          capturedLeadsLabel={t("widget.capturedLeads")}
        />
      </Div>
    </WidgetShell>
  );
}

function CapturedLeadsSection({
  locale,
  user,
  capturedLeadsLabel,
}: {
  locale: ReturnType<typeof useWidgetLocale>;
  user: ReturnType<typeof useWidgetUser>;
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
      <EndpointsPage endpoint={capturesDef} locale={locale} user={user} />
    </Div>
  );
}

export { LeadMagnetConfigContainer as LeadMagnetConfigWidget };
