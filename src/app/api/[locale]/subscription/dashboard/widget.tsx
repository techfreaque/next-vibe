/**
 * Subscription Dashboard Widget
 * KPI cards + quick action buttons for the subscription landing page
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Crown } from "next-vibe-ui/ui/icons/Crown";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Span } from "next-vibe-ui/ui/span";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import React, { useCallback, useMemo } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import type definition from "./definition";

const variantColorMap: Record<
  "default" | "success" | "warning" | "danger" | "info",
  string | undefined
> = {
  default: undefined,
  success: "#16a34a",
  warning: "#ca8a04",
  danger: "#dc2626",
  info: "#2563eb",
};

function StatCard({
  label,
  value,
  variant = "default",
  locale,
}: {
  label: string;
  value: number | null | undefined;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  locale: CountryLanguage;
}): React.JSX.Element {
  const variantColor = variantColorMap[variant];

  const formatted = useMemo(() => {
    if (value === null || value === undefined) {
      return "\u2014";
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toLocaleString(locale);
  }, [value, locale]);

  return (
    <Div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
      <Div className="text-xs text-muted-foreground">{label}</Div>
      <Div
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          ...(variantColor !== undefined ? { color: variantColor } : {}),
        }}
      >
        {formatted}
      </Div>
    </Div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SubscriptionDashboardWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const data = useWidgetValue<typeof definition.GET>();

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleMySubscription = useCallback((): void => {
    void (async (): Promise<void> => {
      const subscriptionDef = await import("../definition");
      navigate(subscriptionDef.default.GET);
    })();
  }, [navigate]);

  const handleManage = useCallback((): void => {
    void (async (): Promise<void> => {
      const updateDef = await import("../update/definition");
      navigate(updateDef.default.PUT);
    })();
  }, [navigate]);

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
      {/* Header */}
      <Div className="flex items-center gap-2">
        <Div className="flex items-center gap-2 mr-auto">
          <Crown className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">{t("get.title")}</Span>
        </Div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("widget.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* KPI cards */}
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label={t("get.response.activeCount")}
          value={data?.activeCount}
          variant="success"
          locale={locale}
        />
        <StatCard
          label={t("get.response.cancelingCount")}
          value={data?.cancelingCount}
          variant={
            data?.cancelingCount !== undefined && data.cancelingCount > 0
              ? "warning"
              : "default"
          }
          locale={locale}
        />
        <StatCard
          label={t("get.response.trialCount")}
          value={data?.trialCount}
          variant="info"
          locale={locale}
        />
        <StatCard
          label={t("get.response.totalCount")}
          value={data?.totalCount}
          variant="default"
          locale={locale}
        />
      </Div>

      {/* Quick actions */}
      <Div className="flex flex-wrap items-center gap-2">
        <Span className="text-xs text-muted-foreground mr-1">
          {t("widget.actions")}
        </Span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleMySubscription}
        >
          {t("widget.mySubscription")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleManage}
        >
          {t("widget.manage")}
        </Button>
      </Div>
    </Div>
  );
}
