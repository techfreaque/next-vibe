/**
 * Subscription Admin Stats Custom Widget
 * Legacy all-time snapshot of subscriptions, credits and referrals. Money
 * questions belong to the revenue report, linked at the top.
 */

"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "next-vibe/ui/components/alert";
import {
  type AnalyticsTone,
  KpiGrid,
  KpiTile,
} from "next-vibe/ui/components/analytics";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import React, { useState } from "react";

import { SubscriptionStatusAdminFilter } from "../enum";
import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

/** Cents (approx. USD) -> dollars for the KPI tiles. */
const dollars = (cents: number | null | undefined): number | null =>
  cents === null || cents === undefined ? null : cents / 100;

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex min-w-0 flex-col gap-2">
      <Div className="flex min-w-0 flex-col">
        <Span className="text-sm font-semibold">{title}</Span>
        {hint && <Span className="text-xs text-muted-foreground">{hint}</Span>}
      </Div>
      {children}
    </Div>
  );
}

function BarList({
  title,
  items,
  locale,
  currency,
}: {
  title: string;
  items: Array<{ x: string; y: number; label?: string }> | undefined;
  locale: CountryLanguage;
  currency: boolean;
}): React.JSX.Element | null {
  if (!items?.length) {
    return null;
  }
  const top = items.slice(-8);
  const max = Math.max(...top.map((item) => item.y), 1);
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  const numbers = new Intl.NumberFormat(locale);
  return (
    <Div className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-4">
      <Span className="text-sm font-semibold">{title}</Span>
      {top.map((item) => (
        <Div key={item.x} className="flex min-w-0 items-center gap-2">
          <Span className="w-20 shrink-0 truncate text-xs text-muted-foreground">
            {item.label ?? item.x}
          </Span>
          <Div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
            <Div
              style={{
                width: `${(item.y / max) * 100}%`,
                height: "100%",
                borderRadius: "9999px",
                backgroundColor: "hsl(var(--primary))",
              }}
            />
          </Div>
          <Span className="w-20 shrink-0 text-right text-xs tabular-nums">
            {currency ? money.format(item.y / 100) : numbers.format(item.y)}
          </Span>
        </Div>
      ))}
    </Div>
  );
}

export function SubscriptionStatsContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const openRelated = useRelatedEntityNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const [legacyOpen, setLegacyOpen] = useState(false);
  const data = useWidgetValue<typeof definition.GET>();
  const response = useWidgetResponse();
  const isFetching = endpointMutations?.read?.isFetching ?? false;

  const revenueStats = data?.revenueStats;
  const subscriptionStats = data?.subscriptionStats;
  const intervalStats = data?.intervalStats;
  const creditStats = data?.creditStats;
  const referralStats = data?.referralStats;
  const growthMetrics = data?.growthMetrics;
  const generatedAt = data?.businessInsights?.generatedAt;
  const usdHint = t("widget.approxUsd");

  const openList = (
    status?:
      | typeof SubscriptionStatusAdminFilter.ACTIVE
      | typeof SubscriptionStatusAdminFilter.CANCELED
      | typeof SubscriptionStatusAdminFilter.TRIALING
      | typeof SubscriptionStatusAdminFilter.PAST_DUE,
  ): void =>
    openRelated(
      () => import("../list/definition").then((module) => module.default.GET),
      status ? { data: { searchFilters: { status: [status] } } } : undefined,
    );

  const tile = (
    label: string,
    value: number | null | undefined,
    options: {
      format?: "number" | "percent" | "currency" | "compact";
      hint?: string;
      tone?: AnalyticsTone;
      onClick?: () => void;
    } = {},
  ): React.JSX.Element => (
    <KpiTile
      label={label}
      value={value ?? null}
      format={options.format ?? "number"}
      currency={options.format === "currency" ? "USD" : undefined}
      locale={locale}
      hint={options.hint}
      tone={options.tone}
      onClick={options.onClick}
    />
  );

  return (
    <WidgetShell className="min-w-0 gap-5">
      <WidgetHeader
        title={t("get.title")}
        backButton={<NavigateButtonWidget field={children.backButton} />}
      />
      <Div className="flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 sm:flex-row sm:items-center sm:justify-between">
        <Div className="flex min-w-0 flex-col gap-0.5">
          <Span className="text-sm font-medium">
            {t("widget.revenueReportTitle")}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {t("widget.revenueReportHint")}
          </Span>
        </Div>
        <Button
          type="button"
          size="sm"
          className="self-start sm:self-auto"
          onClick={() =>
            openRelated(() =>
              import("@/payment/analytics/revenue/definition").then(
                (module) => module.default.GET,
              ),
            )
          }
        >
          {t("widget.openRevenueReport")}
        </Button>
      </Div>

      {response?.success === false ? (
        <Alert variant="destructive">
          <AlertTitle>{t("get.errors.server.title")}</AlertTitle>
          <AlertDescription>{response.message}</AlertDescription>
        </Alert>
      ) : null}

      <Div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isFetching}
          onClick={() => void endpointMutations?.read?.refetch?.()}
        >
          {t("widget.refresh")}
        </Button>
        <Span className="ms-auto text-xs text-muted-foreground">
          {t("widget.openLabel")}
        </Span>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-7 px-1"
          onClick={() => openList()}
        >
          {t("widget.linkSubscriptions")}
        </Button>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-7 px-1"
          onClick={() =>
            openRelated(() =>
              import("../purchases/definition").then(
                (module) => module.default.GET,
              ),
            )
          }
        >
          {t("widget.linkPurchases")}
        </Button>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-7 px-1"
          onClick={() =>
            openRelated(() =>
              import("../referrals/definition").then(
                (module) => module.default.GET,
              ),
            )
          }
        >
          {t("widget.linkReferrals")}
        </Button>
      </Div>

      <Section
        title={t("widget.sectionSubscriptions")}
        hint={t("widget.sectionSubscriptionsHint")}
      >
        <KpiGrid columns={4}>
          {tile(t("widget.activePaid"), subscriptionStats?.activeCount, {
            tone: "positive",
            hint: t("widget.activePaidHint"),
            onClick: () => openList(SubscriptionStatusAdminFilter.ACTIVE),
          })}
          {tile(
            t("get.response.subscriptionStats.pastDueCount.label"),
            subscriptionStats?.pastDueCount,
            {
              tone: "negative",
              hint: t("widget.pastDueHint"),
              onClick: () => openList(SubscriptionStatusAdminFilter.PAST_DUE),
            },
          )}
          {tile(
            t("get.response.subscriptionStats.trialingCount.label"),
            subscriptionStats?.trialingCount,
            {
              onClick:
                (subscriptionStats?.trialingCount ?? 0) > 0
                  ? (): void => openList(SubscriptionStatusAdminFilter.TRIALING)
                  : undefined,
            },
          )}
          {tile(
            t("get.response.subscriptionStats.canceledCount.label"),
            subscriptionStats?.canceledCount,
            {
              tone: "warning",
              onClick: () => openList(SubscriptionStatusAdminFilter.CANCELED),
            },
          )}
          {tile(t("widget.canceledShare"), subscriptionStats?.churnRate, {
            format: "percent",
            tone: "warning",
            hint: t("widget.churnHint"),
          })}
          {tile(
            t("get.response.intervalStats.monthlyCount.label"),
            intervalStats?.monthlyCount,
          )}
          {tile(
            t("get.response.intervalStats.yearlyCount.label"),
            intervalStats?.yearlyCount,
          )}
          {tile(t("widget.yearlyShare"), intervalStats?.yearlyRevenuePct, {
            format: "percent",
            hint: t("widget.yearlyShareHint"),
          })}
        </KpiGrid>
      </Section>

      <Section title={t("widget.sectionCredits")}>
        <KpiGrid columns={4}>
          {tile(t("widget.creditsSold"), creditStats?.totalPurchased, {
            hint: t("widget.creditsSoldHint"),
          })}
          {tile(
            t("get.response.creditStats.totalSpent.label"),
            creditStats?.totalSpent,
            {
              hint: t("widget.spentSplit", {
                packs: new Intl.NumberFormat(locale).format(
                  Math.max(
                    (creditStats?.totalSpent ?? 0) -
                      (creditStats?.spentFromFree ?? 0),
                    0,
                  ),
                ),
                free: new Intl.NumberFormat(locale).format(
                  creditStats?.spentFromFree ?? 0,
                ),
              }),
            },
          )}
          {tile(t("widget.paidPacks"), creditStats?.packsSold)}
          {tile(
            t("get.response.creditStats.avgPackSize.label"),
            creditStats?.avgPackSize,
          )}
        </KpiGrid>
      </Section>

      <Section title={t("widget.sectionReferrals")} hint={usdHint}>
        <KpiGrid columns={4}>
          {tile(
            t("get.response.referralStats.totalReferrals.label"),
            referralStats?.totalReferrals,
          )}
          {tile(
            t("get.response.referralStats.conversionRate.label"),
            referralStats?.conversionRate,
            { format: "percent" },
          )}
          {tile(
            t("get.response.referralStats.totalEarned.label"),
            dollars(referralStats?.totalEarned),
            { format: "currency" },
          )}
          {tile(
            t("get.response.referralStats.pendingPayouts.label"),
            dollars(referralStats?.pendingPayouts),
            { format: "currency", tone: "warning" },
          )}
        </KpiGrid>
      </Section>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => setLegacyOpen((open) => !open)}
      >
        {legacyOpen ? t("widget.hideLegacy") : t("widget.showLegacy")}
      </Button>
      {legacyOpen && (
        <Section
          title={t("widget.sectionLegacy")}
          hint={t("widget.sectionLegacyHint")}
        >
          <KpiGrid columns={4}>
            {tile(
              t("get.response.revenueStats.mrr.label"),
              dollars(revenueStats?.mrr),
              { format: "currency", tone: "muted", hint: usdHint },
            )}
            {tile(
              t("get.response.revenueStats.arr.label"),
              dollars(revenueStats?.arr),
              { format: "currency", tone: "muted", hint: usdHint },
            )}
            {tile(
              t("get.response.revenueStats.totalRevenue.label"),
              dollars(revenueStats?.totalRevenue),
              { format: "currency", tone: "muted", hint: usdHint },
            )}
            {tile(
              t("get.response.revenueStats.avgOrderValue.label"),
              dollars(revenueStats?.avgOrderValue),
              { format: "currency", tone: "muted", hint: usdHint },
            )}
          </KpiGrid>
          <Div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <BarList
              title={`${t("get.response.growthMetrics.revenueChart.label")} (${usdHint})`}
              items={growthMetrics?.revenueChart}
              locale={locale}
              currency
            />
            <BarList
              title={t("get.response.growthMetrics.subscriptionChart.label")}
              items={growthMetrics?.subscriptionChart}
              locale={locale}
              currency={false}
            />
          </Div>
        </Section>
      )}

      {generatedAt && (
        <Span className="text-right text-xs text-muted-foreground">
          {t("get.response.businessInsights.generatedAt.label")}{" "}
          {generatedAt.toLocaleString(locale)}
        </Span>
      )}
    </WidgetShell>
  );
}
