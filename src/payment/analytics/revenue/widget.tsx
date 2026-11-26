/**
 * Revenue Report widget (web, CLI, MCP, native via the analytics components).
 */

"use client";

import {
  type CountryLanguage,
  CurrenciesArr,
} from "next-vibe/core/i18n/core/config";
import { Platform } from "next-vibe/platforms/platforms";
import {
  type AnalyticsFilterChip,
  AnalyticsSegmented,
  AnalyticsToolbar,
  BreakdownTable,
  type BreakdownTableRow,
  KpiGrid,
  KpiTile,
  TimeSeriesChart,
} from "next-vibe/ui/components/analytics";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { AnalyticsRange } from "next-vibe/unified-ui/analytics/enum";
import {
  formatAnalyticsValue,
  formatPeriod,
} from "next-vibe/unified-ui/analytics/format";
import type { BreakdownRow } from "next-vibe/unified-ui/analytics/schema";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { type JSX, useId, useState } from "react";

import { ReportAnalyticsPeriod } from "@/finance/report-analytics-period";
import { SubscriptionStatusAdminFilter } from "@/subscription/admin/enum";
import {
  SubscriptionPlan,
  type SubscriptionPlanValue,
} from "@/subscription/enum";

import {
  PaymentProvider,
  type PaymentProviderValue,
  PaymentStatus,
  type PaymentStatusValue,
} from "../../enum";
import type definitions from "./definition";
import { RevenueKind, type RevenueKindValue } from "./enum";

const REPORT_CURRENCY = "USD";
const DAY_MS = 86_400_000;

function formatRevenueWindow(
  from: string,
  to: string,
  locale: CountryLanguage,
): string {
  return from === to
    ? formatDocDate(from, locale)
    : formatPeriod(from, to, locale);
}

function bucketEnd(start: string, bucket: "day" | "week" | "month"): string {
  const date = new Date(`${start}T00:00:00.000Z`);
  if (bucket === "day") {
    return start;
  }
  if (bucket === "week") {
    return new Date(date.getTime() + 6 * DAY_MS).toISOString().slice(0, 10);
  }
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1) - DAY_MS,
  )
    .toISOString()
    .slice(0, 10);
}

const ALL = "all" as const;

const STATUS_VARIANT: Record<typeof PaymentStatusValue, StatusPillVariant> = {
  [PaymentStatus.PENDING]: "warning",
  [PaymentStatus.PROCESSING]: "info",
  [PaymentStatus.SUCCEEDED]: "success",
  [PaymentStatus.FAILED]: "danger",
  [PaymentStatus.CANCELED]: "muted",
  [PaymentStatus.REFUNDED]: "muted",
};

const KINDS = [
  RevenueKind.ALL,
  RevenueKind.PACK,
  RevenueKind.NEW_SUBSCRIPTION,
  RevenueKind.RENEWAL,
] as const;

const PLANS: readonly string[] = Object.values(SubscriptionPlan);
const PROVIDERS: readonly string[] = Object.values(PaymentProvider);

function asPlan(key: string | null): typeof SubscriptionPlanValue | undefined {
  return Object.values(SubscriptionPlan).find((plan) => plan === key);
}

function asProvider(
  key: string | null,
): typeof PaymentProviderValue | undefined {
  return Object.values(PaymentProvider).find((p) => p === key);
}

export function RevenueReportWidget({
  field: { children },
}: {
  field: typeof definitions.GET.fields;
}): JSX.Element {
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definitions.GET>();
  const form = useWidgetForm<typeof definitions.GET>();
  const onSubmit = useWidgetOnSubmit();
  const value = useWidgetValue<typeof definitions.GET>();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = useWidgetIsInteractive() && !responseOnly;
  const compactFilters =
    useWidgetPlatform() === Platform.NEXT_PAGE && isInteractive;
  const filtersId = useId();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { endpointMutations } = useWidgetContext();
  const navigate = useRelatedEntityNavigation();
  const read = endpointMutations?.read;
  const isLoading = read?.isFetching ?? false;
  const failed = useWidgetResponse()?.success === false;

  // Interactive surfaces follow the form; CLI/MCP show what the server applied.
  const applied = isInteractive ? undefined : value?.appliedFilters;
  const kind = applied?.kind ?? form.watch("kind") ?? RevenueKind.ALL;
  const provider = applied
    ? (applied.provider ?? undefined)
    : form.watch("provider");
  const currency = applied
    ? (applied.currency ?? undefined)
    : form.watch("currency");
  const plan = applied ? (applied.plan ?? undefined) : form.watch("plan");
  const includeInternal =
    applied?.includeInternal ?? form.watch("includeInternal") ?? false;

  const submit = (): void => {
    onSubmit?.();
  };
  const setKind = (next: typeof RevenueKindValue): void => {
    form.setValue("kind", next, { shouldDirty: true });
    submit();
  };
  const setProvider = (next: typeof PaymentProviderValue | undefined): void => {
    form.setValue("provider", next, { shouldDirty: true });
    submit();
  };
  const setCurrency = (next: typeof currency): void => {
    form.setValue("currency", next, { shouldDirty: true });
    submit();
  };
  const setPlan = (next: typeof SubscriptionPlanValue | undefined): void => {
    form.setValue("plan", next, { shouldDirty: true });
    submit();
  };
  const setInternal = (next: boolean): void => {
    form.setValue("includeInternal", next, { shouldDirty: true });
    submit();
  };
  const drillBucket = (start: string): void => {
    if (!value) {
      return;
    }
    form.setValue("range", AnalyticsRange.CUSTOM, { shouldDirty: true });
    form.setValue("from", start, { shouldDirty: true });
    form.setValue("to", bucketEnd(start, value.window.bucket), {
      shouldDirty: true,
    });
    submit();
  };

  const openProcessor = (
    data: {
      status?: typeof PaymentStatus.FAILED | typeof PaymentStatus.REFUNDED;
      provider?: typeof PaymentProviderValue;
      transactionId?: string;
    } = {},
  ): void =>
    navigate(
      async () => (await import("../../processor/definition")).default.GET,
      {
        data: data.transactionId
          ? data
          : {
              ...data,
              provider: data.provider ?? provider,
              currency,
              from: value?.window.from,
              to: value?.window.to,
            },
      },
    );
  const openSubscriptions = (
    status:
      | typeof SubscriptionStatusAdminFilter.ACTIVE
      | typeof SubscriptionStatusAdminFilter.CANCELED,
  ): void =>
    navigate(
      async () =>
        (await import("@/subscription/admin/list/definition")).default.GET,
      { data: { searchFilters: { status: [status] } } },
    );

  const filters: AnalyticsFilterChip[] = [];
  if (kind !== RevenueKind.ALL) {
    filters.push({
      key: "kind",
      label: t("widget.filter.kind"),
      value: t(kind),
      onRemove: () => setKind(RevenueKind.ALL),
    });
  }
  if (provider) {
    filters.push({
      key: "provider",
      label: t("widget.filter.provider"),
      value: t(provider),
      onRemove: () => setProvider(undefined),
    });
  }
  if (currency) {
    filters.push({
      key: "currency",
      label: t("widget.filter.currency"),
      value: currency,
      onRemove: () => setCurrency(undefined),
    });
  }
  if (plan) {
    filters.push({
      key: "plan",
      label: t("widget.filter.plan"),
      value: t(plan),
      onRemove: () => setPlan(undefined),
    });
  }
  if (includeInternal) {
    filters.push({
      key: "internal",
      label: t("widget.filter.internal"),
      value: "✓",
      onRemove: () => setInternal(false),
    });
  }
  const clearFilters = (): void => {
    form.setValue("kind", RevenueKind.ALL, { shouldDirty: true });
    form.setValue("provider", undefined, { shouldDirty: true });
    form.setValue("currency", undefined, { shouldDirty: true });
    form.setValue("plan", undefined, { shouldDirty: true });
    form.setValue("includeInternal", false, { shouldDirty: true });
    submit();
  };

  const kpis = value?.kpis;
  const win = value?.window;

  const keyLabel = (key: string | null): string => {
    if (key === null) {
      return t("analytics.chart.none");
    }
    if (PLANS.includes(key) || PROVIDERS.includes(key)) {
      return t(asPlan(key) ?? asProvider(key) ?? PaymentProvider.STRIPE);
    }
    switch (key) {
      case "credit_pack":
        return t("widget.label.creditPack");
      case "credit_pack_large":
        return t("widget.label.creditPackLarge");
      case "pack":
        return t("widget.extra.packUnknown");
      case "newSubscription":
        return t("widget.label.newSubscription");
      case "renewal":
        return t("widget.label.renewal");
      default:
        return key;
    }
  };

  const moneyColumns = [
    {
      key: "revenueUsd",
      label: t("widget.column.revenueUsd"),
      format: "currency",
      currency: REPORT_CURRENCY,
    },
    { key: "payments", label: t("widget.extra.paid"), format: "number" },
    {
      key: "customers",
      label: t("widget.column.customers"),
      format: "number",
    },
    {
      key: "failed",
      label: t("widget.column.failed"),
      format: "number",
      secondary: true,
    },
    {
      key: "refundsUsd",
      label: t("widget.column.refundsUsd"),
      format: "currency",
      currency: REPORT_CURRENCY,
      secondary: true,
    },
  ] as const;

  const rowsFor = (
    rows: readonly BreakdownRow[],
    onPick: (key: string) => void,
    sublabel?: (row: BreakdownRow) => string | undefined,
  ): BreakdownTableRow[] =>
    rows.map((row) => ({
      id: row.key ?? "none",
      label: keyLabel(row.key),
      sublabel: sublabel?.(row),
      values: row.metrics,
      onClick:
        isInteractive && row.key !== null
          ? (): void => onPick(row.key ?? "")
          : undefined,
    }));

  const rates = (value?.fxRates ?? [])
    .map((r) =>
      t("widget.label.rate", { currency: r.currency, rate: String(r.usdRate) }),
    )
    .join(", ");
  const currencySublabel = (row: BreakdownRow): string | undefined => {
    const code = CurrenciesArr.find((c) => c === row.key);
    if (!code || code === REPORT_CURRENCY) {
      return undefined;
    }
    const native = formatMoney(row.metrics.amount ?? 0, code, locale);
    const rate = value?.fxRates.find((r) => r.currency === code);
    return rate
      ? `${native} · ${t("widget.label.rate", {
          currency: rate.currency,
          rate: String(rate.usdRate),
        })}`
      : native;
  };

  const kindLabel = (paymentKind: typeof RevenueKindValue): string =>
    paymentKind === RevenueKind.PACK
      ? t("widget.extra.kindPack")
      : paymentKind === RevenueKind.RENEWAL
        ? t("widget.extra.kindRenewal")
        : t("widget.extra.kindNew");

  const statusMarker = (status: typeof PaymentStatusValue): JSX.Element => (
    <StatusPill
      status={status}
      label={t(status)}
      variant={STATUS_VARIANT[status]}
    />
  );

  const recentRows: BreakdownTableRow[] = (value?.recentPayments ?? []).map(
    (payment) => {
      const date = new Date(payment.createdAt).toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
      });
      const collected =
        payment.status === PaymentStatus.SUCCEEDED ||
        payment.status === PaymentStatus.REFUNDED;
      const native = formatMoney(payment.amount, payment.currency, locale);
      const parts: string[] = [kindLabel(payment.kind)];
      if (payment.plan) {
        parts.push(keyLabel(payment.plan));
      }
      parts.push(t(payment.provider));
      // Web shows the status pill; CLI/MCP have no marker, so name it there.
      if (!collected && !isInteractive) {
        parts.unshift(t(payment.status));
      }
      if (payment.currency !== REPORT_CURRENCY || !collected) {
        parts.push(native);
      }
      parts.push(date);
      return {
        id: payment.id,
        label: payment.email ?? payment.userId,
        sublabel: parts.join(" · "),
        marker: statusMarker(payment.status),
        values: { usd: collected ? payment.usd : null },
        onClick: isInteractive
          ? (): void => openProcessor({ transactionId: payment.id })
          : undefined,
      };
    },
  );

  // Subscription tiles ignore payment-only filters (kind, currency): mute them then.
  const paymentOnlyFilter = kind !== RevenueKind.ALL || Boolean(currency);
  const subTone = paymentOnlyFilter ? "muted" : undefined;
  const subHint = (hint: string): string =>
    paymentOnlyFilter ? `${hint} · ${t("widget.extra.filterIgnored")}` : hint;
  const mrrSeries =
    value?.mrrTrend.series.find((s) => s.key === "mrrUsd")?.values ?? [];
  const activeSeries =
    value?.mrrTrend.series.find((s) => s.key === "activeSubscriptions")
      ?.values ?? [];
  const churn30 = formatAnalyticsValue(
    value?.mrrTrend.series.find((s) => s.key === "churnRate")?.values.at(-1) ??
      0,
    { format: "percent", locale },
  );
  const kindTotal = (key: string): number =>
    (
      value?.revenueByKind.series.find((series) => series.key === key)
        ?.values ?? []
    ).reduce((sum, v) => sum + v, 0);
  const packRevenue = kindTotal("pack");
  const subscriptionRevenue =
    kindTotal("newSubscription") + kindTotal("renewal");

  return (
    <WidgetShell className="min-w-0">
      <WidgetHeader
        size="page"
        border={false}
        title={t("widget.operatingTitle")}
        subtitle={t("widget.currencyBasis")}
        backButton={
          isInteractive && <NavigateButtonWidget field={children.backButton} />
        }
      />
      <Div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
        {win && (
          <Div className="min-w-0 space-y-1 text-xs text-muted-foreground">
            <Div className="flex flex-wrap gap-x-2 gap-y-1 tabular-nums">
              <Span className="font-medium text-foreground">
                {formatRevenueWindow(win.from, win.to, locale)}
              </Span>
              {win.previousFrom && win.previousTo && (
                <Span>
                  {t("analytics.chart.comparedTo", {
                    period: formatRevenueWindow(
                      win.previousFrom,
                      win.previousTo,
                      locale,
                    ),
                  })}
                </Span>
              )}
              <Span>{t(`analytics.chart.groupedBy.${win.bucket}`)}</Span>
            </Div>
            {compactFilters && !filtersOpen && filters.length > 0 && (
              <Div className="flex flex-wrap gap-x-3 gap-y-1 @3xl:hidden">
                {filters.map(({ key, label, value: filterValue }) => (
                  <Span key={key} className="break-words">
                    {label}: {filterValue}
                  </Span>
                ))}
              </Div>
            )}
          </Div>
        )}
        {compactFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 @3xl:hidden"
            aria-controls={filtersId}
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            {t("widget.filterDisclosure")}
            <ChevronDown
              className={cn("size-4", filtersOpen && "rotate-180")}
              aria-hidden="true"
            />
          </Button>
        )}
      </Div>
      <Div
        id={filtersId}
        className={cn(compactFilters && !filtersOpen && "hidden @3xl:block")}
      >
        <AnalyticsToolbar
          rangeControls={
            <ReportAnalyticsPeriod
              range={form.watch("range")}
              from={form.watch("from")}
              to={form.watch("to")}
              applied={win}
              onChange={({ range, from, to }) => {
                form.setValue("range", range, { shouldDirty: true });
                form.setValue("from", from, { shouldDirty: true });
                form.setValue("to", to, { shouldDirty: true });
                submit();
              }}
            />
          }
          locale={locale}
          isLoading={isLoading}
          onRefresh={isInteractive ? submit : undefined}
          value={{
            range: form.watch("range"),
            granularity: form.watch("granularity"),
            from: form.watch("from"),
            to: form.watch("to"),
          }}
          onChange={(patch) => {
            if (patch.range !== undefined) {
              form.setValue("range", patch.range, { shouldDirty: true });
            }
            if (patch.granularity !== undefined) {
              form.setValue("granularity", patch.granularity, {
                shouldDirty: true,
              });
            }
            if (patch.from !== undefined) {
              form.setValue("from", patch.from, { shouldDirty: true });
            }
            if (patch.to !== undefined) {
              form.setValue("to", patch.to, { shouldDirty: true });
            }
            submit();
          }}
          filters={filters}
          onClearFilters={clearFilters}
        >
          {isInteractive && (
            <>
              <AnalyticsSegmented
                label={t("widget.filter.kind")}
                value={kind}
                onSelect={setKind}
                options={KINDS.map((option) => ({
                  value: option,
                  label: t(option),
                }))}
              />
              <AnalyticsSegmented
                label={t("widget.filter.provider")}
                value={provider ?? ALL}
                onSelect={(next) => setProvider(asProvider(next))}
                options={[
                  { value: ALL, label: t("widget.extra.processorAll") },
                  ...Object.values(PaymentProvider).map((option) => ({
                    value: option,
                    label: t(option),
                  })),
                ]}
              />
              <AnalyticsSegmented
                label={t("widget.filter.currency")}
                value={currency ?? ALL}
                onSelect={(next) =>
                  setCurrency(CurrenciesArr.find((code) => code === next))
                }
                options={[
                  { value: ALL, label: t("widget.extra.currencyAll") },
                  ...CurrenciesArr.map((code) => ({
                    value: code,
                    label: code,
                  })),
                ]}
              />
              <Button
                type="button"
                variant="ghost"
                aria-pressed={includeInternal}
                disabled={isLoading}
                onClick={() => setInternal(!includeInternal)}
                className={
                  includeInternal
                    ? "h-auto whitespace-nowrap rounded-md border bg-background px-2.5 py-1 text-xs font-medium text-foreground shadow-sm"
                    : "h-auto whitespace-nowrap rounded-md border border-dashed px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                }
              >
                {t("widget.includeInternal")}
              </Button>
            </>
          )}
        </AnalyticsToolbar>
      </Div>

      {kpis && win && value && (
        <>
          <KpiGrid columns={4}>
            <KpiTile
              label={t("widget.kpi.grossRevenueUsd")}
              value={kpis.grossRevenueUsd.value}
              previous={kpis.grossRevenueUsd.previous}
              format="currency"
              currency={REPORT_CURRENCY}
              hint={t("widget.extra.grossHint", {
                subs: formatAnalyticsValue(subscriptionRevenue, {
                  format: "currency",
                  currency: REPORT_CURRENCY,
                  locale,
                }),
                packs: formatAnalyticsValue(packRevenue, {
                  format: "currency",
                  currency: REPORT_CURRENCY,
                  locale,
                }),
              })}
              locale={locale}
              sparkline={value.revenueByKind.series.reduce<number[]>(
                (sum, s) => s.values.map((v, i) => v + (sum[i] ?? 0)),
                [],
              )}
            />
            <KpiTile
              label={t("widget.kpi.netRevenueUsd")}
              value={kpis.netRevenueUsd.value}
              previous={kpis.netRevenueUsd.previous}
              format="currency"
              currency={REPORT_CURRENCY}
              hint={t("widget.extra.netHint")}
              locale={locale}
            />
            <KpiTile
              label={t("widget.kpi.mrrUsd")}
              value={kpis.mrrUsd.value}
              previous={kpis.mrrUsd.previous}
              format="currency"
              currency={REPORT_CURRENCY}
              hint={subHint(t("widget.extra.mrrHint"))}
              tone={subTone}
              locale={locale}
              sparkline={mrrSeries}
            />
            <KpiTile
              label={t("widget.kpi.refundsUsd")}
              value={kpis.refundsUsd.value}
              previous={kpis.refundsUsd.previous}
              format="currency"
              currency={REPORT_CURRENCY}
              invertDelta
              tone={kpis.refundsUsd.value > 0 ? "warning" : undefined}
              hint={t("widget.hint.refundsUsd")}
              locale={locale}
              onClick={
                isInteractive
                  ? () => openProcessor({ status: PaymentStatus.REFUNDED })
                  : undefined
              }
            />
            <KpiTile
              label={t("widget.kpi.payingCustomers")}
              value={kpis.payingCustomers.value}
              previous={kpis.payingCustomers.previous}
              format="number"
              hint={t("widget.hint.payingCustomers")}
              locale={locale}
            />
            <KpiTile
              label={t("widget.kpi.activeSubscriptions")}
              value={kpis.activeSubscriptions.value}
              previous={kpis.activeSubscriptions.previous}
              format="number"
              hint={subHint(t("widget.hint.activeSubscriptions"))}
              tone={subTone}
              sparkline={activeSeries}
              locale={locale}
              onClick={
                isInteractive
                  ? () =>
                      openSubscriptions(SubscriptionStatusAdminFilter.ACTIVE)
                  : undefined
              }
            />
            <KpiTile
              label={t("widget.kpi.newSubscriptions")}
              value={kpis.newSubscriptions.value}
              previous={kpis.newSubscriptions.previous}
              format="number"
              hint={subHint(t("widget.hint.newSubscriptions"))}
              tone={subTone}
              locale={locale}
              onClick={
                isInteractive
                  ? () => setKind(RevenueKind.NEW_SUBSCRIPTION)
                  : undefined
              }
            />
            <KpiTile
              label={t("widget.kpi.churnedSubscriptions")}
              value={kpis.churnedSubscriptions.value}
              previous={kpis.churnedSubscriptions.previous}
              format="number"
              invertDelta
              tone={
                subTone ??
                (kpis.churnedSubscriptions.value > 0 ? "warning" : undefined)
              }
              hint={subHint(t("widget.extra.churn30Hint", { rate: churn30 }))}
              locale={locale}
              onClick={
                isInteractive
                  ? () =>
                      openSubscriptions(SubscriptionStatusAdminFilter.CANCELED)
                  : undefined
              }
            />
            <KpiTile
              label={t("widget.kpi.renewals")}
              value={kpis.renewals.value}
              previous={kpis.renewals.previous}
              format="number"
              hint={t("widget.hint.renewals")}
              locale={locale}
              onClick={
                isInteractive ? () => setKind(RevenueKind.RENEWAL) : undefined
              }
            />
            <KpiTile
              label={t("widget.kpi.packPurchases")}
              value={kpis.packPurchases.value}
              previous={kpis.packPurchases.previous}
              format="number"
              hint={t("widget.hint.packPurchases")}
              locale={locale}
              onClick={
                isInteractive ? () => setKind(RevenueKind.PACK) : undefined
              }
            />
            <KpiTile
              label={t("widget.kpi.failedPayments")}
              value={kpis.failedPayments.value}
              previous={kpis.failedPayments.previous}
              format="number"
              invertDelta
              tone={kpis.failedPayments.value > 0 ? "warning" : undefined}
              hint={t("widget.hint.failedPayments")}
              locale={locale}
              onClick={
                isInteractive
                  ? () => openProcessor({ status: PaymentStatus.FAILED })
                  : undefined
              }
            />
            <KpiTile
              label={t("widget.kpi.disputes")}
              value={kpis.disputes.value}
              previous={kpis.disputes.previous}
              format="number"
              invertDelta
              tone={kpis.disputes.value > 0 ? "negative" : undefined}
              hint={t("widget.hint.disputes")}
              locale={locale}
            />
          </KpiGrid>
          <Span className="text-xs text-muted-foreground">
            {t("widget.fxNote", { rates })} {t("widget.extra.subscriptionNote")}
          </Span>

          <Div className="grid min-w-0 gap-4 lg:grid-cols-2">
            <TimeSeriesChart
              title={t("widget.chart.kind")}
              buckets={value.revenueByKind.buckets}
              bucket={win.bucket}
              series={value.revenueByKind.series.map((s, index) => ({
                key: s.key,
                label:
                  s.key === "pack"
                    ? t("widget.series.pack")
                    : s.key === "renewal"
                      ? t("widget.series.renewal")
                      : t("widget.extra.firstPayments"),
                values: s.values,
                color: index === 0 ? 4 : index === 1 ? 1 : 2,
              }))}
              variant="stacked-bar"
              format="currency"
              currency={REPORT_CURRENCY}
              locale={locale}
              emptyLabel={t("widget.empty")}
              onBucketClick={isInteractive ? drillBucket : undefined}
            />
            <TimeSeriesChart
              title={t("widget.chart.processor")}
              buckets={value.revenueByProcessor.buckets}
              bucket={win.bucket}
              series={value.revenueByProcessor.series.map((s, index) => ({
                key: s.key,
                label: keyLabel(s.key),
                values: s.values,
                color: index === 0 ? 3 : 5,
              }))}
              variant="stacked-bar"
              format="currency"
              currency={REPORT_CURRENCY}
              locale={locale}
              emptyLabel={t("widget.empty")}
              onBucketClick={isInteractive ? drillBucket : undefined}
            />
          </Div>

          <Div className="grid min-w-0 gap-4 lg:grid-cols-2">
            <TimeSeriesChart
              title={t("widget.extra.mrrChart")}
              subtitle={t("widget.extra.mrrNote")}
              buckets={value.mrrTrend.buckets}
              bucket={win.bucket}
              series={[
                {
                  key: "mrrUsd",
                  label: t("widget.extra.seriesMrr"),
                  values: mrrSeries,
                  color: 1,
                  aggregate: "last",
                },
              ]}
              variant="area"
              format="currency"
              currency={REPORT_CURRENCY}
              locale={locale}
              height={200}
              emptyLabel={t("widget.empty")}
              onBucketClick={isInteractive ? drillBucket : undefined}
            />
            <TimeSeriesChart
              title={t("widget.chart.flow")}
              buckets={value.subscriptionFlow.buckets}
              bucket={win.bucket}
              series={value.subscriptionFlow.series.map((s) => ({
                key: s.key,
                label:
                  s.key === "new"
                    ? t("widget.series.new")
                    : t("widget.series.churned"),
                values: s.values,
                color: s.key === "new" ? "positive" : "negative",
              }))}
              variant="bar"
              format="number"
              locale={locale}
              height={200}
              emptyLabel={t("widget.empty")}
              onBucketClick={isInteractive ? drillBucket : undefined}
            />
          </Div>

          <TimeSeriesChart
            title={t("widget.extra.churnChart")}
            subtitle={t("widget.extra.churnNote")}
            buckets={value.mrrTrend.buckets}
            bucket={win.bucket}
            series={[
              {
                key: "churnRate",
                label: t("widget.extra.churnChart"),
                values:
                  value.mrrTrend.series.find((s) => s.key === "churnRate")
                    ?.values ?? [],
                color: "negative",
                aggregate: "last",
              },
            ]}
            variant="line"
            format="percent"
            locale={locale}
            height={160}
            emptyLabel={t("widget.empty")}
            onBucketClick={isInteractive ? drillBucket : undefined}
          />

          <BreakdownTable
            title={t("widget.breakdown.byPlan")}
            subtitle={
              isInteractive ? t("widget.breakdown.drillHint") : undefined
            }
            dimensionLabel={t("widget.breakdown.plan")}
            columns={moneyColumns}
            rows={rowsFor(value.byPlan, (key) => {
              const pickedPlan = asPlan(key);
              if (pickedPlan) {
                setPlan(pickedPlan);
              } else if (key === "renewal") {
                setKind(RevenueKind.RENEWAL);
              } else if (key === "newSubscription") {
                setKind(RevenueKind.NEW_SUBSCRIPTION);
              } else {
                setKind(RevenueKind.PACK);
              }
            })}
            locale={locale}
            limit={8}
            emptyLabel={t("widget.empty")}
          />
          <Div className="grid min-w-0 gap-4 lg:grid-cols-2">
            <BreakdownTable
              title={t("widget.breakdown.byProcessor")}
              subtitle={
                isInteractive ? t("widget.breakdown.drillHint") : undefined
              }
              dimensionLabel={t("widget.breakdown.processor")}
              columns={moneyColumns}
              rows={rowsFor(value.byProcessor, (key) =>
                setProvider(asProvider(key)),
              )}
              locale={locale}
              emptyLabel={t("widget.empty")}
            />
            <BreakdownTable
              title={t("widget.breakdown.byCurrency")}
              subtitle={
                isInteractive ? t("widget.breakdown.drillHint") : undefined
              }
              dimensionLabel={t("widget.breakdown.currency")}
              columns={[
                {
                  key: "revenueUsd",
                  label: t("widget.column.revenueUsd"),
                  format: "currency",
                  currency: REPORT_CURRENCY,
                },
                {
                  key: "payments",
                  label: t("widget.extra.paid"),
                  format: "number",
                  secondary: true,
                },
              ]}
              rows={rowsFor(
                value.byCurrency,
                (key) => setCurrency(CurrenciesArr.find((c) => c === key)),
                currencySublabel,
              )}
              locale={locale}
              emptyLabel={t("widget.empty")}
            />
          </Div>
          <BreakdownTable
            title={t("widget.breakdown.recent")}
            subtitle={
              isInteractive ? t("widget.breakdown.recentHint") : undefined
            }
            dimensionLabel={t("widget.breakdown.payment")}
            columns={[
              {
                key: "usd",
                label: t("widget.column.usd"),
                format: "currency",
                currency: REPORT_CURRENCY,
              },
            ]}
            rows={recentRows}
            showShare={false}
            actions={
              isInteractive ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => openProcessor()}
                >
                  {t("widget.extra.openAll")}
                </Button>
              ) : undefined
            }
            locale={locale}
            limit={10}
            emptyLabel={t("widget.empty")}
          />
        </>
      )}
      {!value && isLoading && (
        <LoadingBlock message={t("widget.loadingReport")} />
      )}
      {!value && !isLoading && failed && (
        <ResultBanner
          variant="warning"
          title={t("get.errors.server.title")}
          message={t("get.errors.server.description")}
        >
          {isInteractive && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void read?.refetch()}
            >
              {t("analytics.chart.refresh")}
            </Button>
          )}
        </ResultBanner>
      )}
      {!value && !isLoading && !failed && (
        <Div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Span>{t("widget.extra.notLoaded")}</Span>
          {isInteractive && (
            <Button type="button" size="sm" variant="outline" onClick={submit}>
              {t("analytics.chart.refresh")}
            </Button>
          )}
        </Div>
      )}
    </WidgetShell>
  );
}
