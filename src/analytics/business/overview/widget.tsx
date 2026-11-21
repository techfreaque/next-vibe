/**
 * Business Overview widget (web, CLI, MCP, native via next-vibe-ui).
 */

"use client";

import { parseError } from "next-vibe/core/utils/parse-error";
import { isAgentPlatform, isCliPlatform } from "next-vibe/platforms/platforms";
import {
  AnalyticsToolbar,
  type AnalyticsWindowValue,
  BreakdownTable,
  KpiGrid,
  KpiTile,
  TimeSeriesChart,
} from "next-vibe/ui/components/analytics";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { isValidEnumValue } from "next-vibe/unified-ui/_shared/enum";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { formatAnalyticsValue } from "next-vibe/unified-ui/analytics/format";
import { resolveEndpoint } from "next-vibe/unified-ui/hooks/resolve-endpoint";
import type { JSX } from "react";

import { LeadChannelFilter } from "@/leads/analytics/enum";

import type definition from "./definition";
import type { BusinessOverviewTranslationKey } from "./i18n";

type Overview = typeof definition.GET.types.ResponseOutput;
type Drill = (alias: string, filters?: Record<string, string>) => void;

const TRAFFIC_LABEL: Record<string, BusinessOverviewTranslationKey> = {
  visits: "get.widget.series.visits",
  leads: "get.widget.series.leads",
  signups: "get.widget.series.signups",
};

const MONEY_LABEL: Record<string, BusinessOverviewTranslationKey> = {
  revenueUsd: "get.widget.series.revenueUsd",
  spendUsd: "get.widget.series.spendUsd",
  upstreamCostUsd: "get.widget.series.upstreamCostUsd",
};

const SKELETON_TILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 } as const;
const SEVERITY_LABEL = {
  high: "get.widget.alerts.severity.high",
  medium: "get.widget.alerts.severity.medium",
  low: "get.widget.alerts.severity.low",
} as const;

/** Drill targets (aliases from the owning domains; resolved at click time). */
const TARGET = {
  acquisition: "acquisition-report",
  funnel: "funnel-report",
  abuse: "abuse-report",
  referrals: "referral-overview",
  referralCode: "referral-code-report",
  payouts: "referral/admin/payouts/GET",
  revenue: "revenue-report",
  usage: "credit-usage-report",
  errors: "error-logs",
  tasks: "cron-stats",
  connections: "remote-connections",
} as const;

function useDrill(windowArgs: Record<string, string>): Drill {
  const navigation = useWidgetNavigation();
  const logger = useWidgetLogger();
  return (alias, filters) => {
    void resolveEndpoint(alias)
      .then((endpoint) => {
        if (endpoint) {
          navigation.push(endpoint, { data: { ...windowArgs, ...filters } });
        }
        return undefined;
      })
      .catch((error) => {
        logger.error("Overview drill-down failed", parseError(error));
      });
  };
}

/** topSources keys are lead-analytics channel enum keys (spread into our i18n). */
function channelLabel(
  key: string,
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>,
): string {
  return isValidEnumValue(LeadChannelFilter, key) ? t(key) : key;
}

function sumMetric(
  rows: readonly { metrics: Record<string, number> }[],
  metric: string,
): number {
  return rows.reduce((sum, row) => sum + (row.metrics[metric] ?? 0), 0);
}

function ratio(numerator: number, denominator: number): number | null {
  return denominator > 0 ? numerator / denominator : null;
}

export function BusinessOverviewWidget(): JSX.Element {
  const value = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.GET>();
  const { endpointMutations } = useWidgetContext();
  const isFetching = endpointMutations?.read?.isFetching ?? false;

  const windowValue: AnalyticsWindowValue = {
    range: form.watch("range"),
    granularity: form.watch("granularity"),
    from: form.watch("from"),
    to: form.watch("to"),
  };
  const windowArgs: Record<string, string> = {};
  for (const [key, arg] of Object.entries(windowValue)) {
    if (typeof arg === "string" && arg.length > 0) {
      windowArgs[key] = arg;
    }
  }
  const drill = useDrill(windowArgs);

  const onWindowChange = (patch: AnalyticsWindowValue): void => {
    if (patch.range !== undefined) {
      form.setValue("range", patch.range, { shouldDirty: true });
    }
    if (patch.granularity !== undefined) {
      form.setValue("granularity", patch.granularity, { shouldDirty: true });
    }
    if ("from" in patch) {
      form.setValue("from", patch.from, { shouldDirty: true });
    }
    if ("to" in patch) {
      form.setValue("to", patch.to, { shouldDirty: true });
    }
    onSubmit?.();
  };

  return (
    <WidgetShell padding="none" className="gap-4">
      <AnalyticsToolbar
        locale={locale}
        value={windowValue}
        onChange={onWindowChange}
        period={value?.window}
        onRefresh={() => {
          void endpointMutations?.read?.refetch?.();
        }}
        isLoading={isFetching}
      />
      {!value ? (
        <Div className="flex flex-col gap-4" aria-busy="true">
          <KpiGrid columns={4}>
            {SKELETON_TILES.map((key) => (
              <Div
                key={key}
                className="h-32 animate-pulse rounded-lg border bg-card"
              />
            ))}
          </KpiGrid>
          <LoadingBlock message={t("get.widget.loading")} />
        </Div>
      ) : (
        <OverviewBody value={value} drill={drill} />
      )}
    </WidgetShell>
  );
}

function OverviewBody({
  value,
  drill,
}: {
  value: Overview;
  drill: Drill;
}): JSX.Element {
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.GET>();
  const { acquisition, referral, money, ops, window: period } = value;
  const traffic = acquisition?.trend;
  const signupRate = acquisition
    ? ratio(acquisition.kpis.signups.value, acquisition.kpis.humanLeads.value)
    : null;
  /** Series by key in display order (missing keys are skipped). */
  const pickSeries = (
    trend: { key: string; values: number[] }[],
    keys: readonly string[],
    labels: Record<string, BusinessOverviewTranslationKey>,
  ): { key: string; label: string; values: number[] }[] =>
    keys.flatMap((key) => {
      const found = trend.find((s) => s.key === key);
      return found
        ? [
            {
              key,
              label: labels[key] ? t(labels[key]) : key,
              values: found.values,
            },
          ]
        : [];
    });

  const costed = money?.kpis.costedSpendUsd;
  const marginRate =
    money && costed ? ratio(money.kpis.marginUsd.value, costed.value) : null;
  const prevMargin = money?.kpis.marginUsd.previous;
  const marginRatePrevious =
    costed &&
    costed.previous !== null &&
    prevMargin !== null &&
    prevMargin !== undefined
      ? ratio(prevMargin, costed.previous)
      : null;
  const costCoverage =
    money && costed
      ? ratio(costed.value, money.kpis.creditSpendUsd.value)
      : null;

  const botShare = acquisition
    ? ratio(
        acquisition.kpis.botLeads.value,
        acquisition.kpis.botLeads.value + acquisition.kpis.humanLeads.value,
      )
    : null;
  const prevBot = acquisition?.kpis.botLeads.previous;
  const prevHuman = acquisition?.kpis.humanLeads.previous;
  const botSharePrevious =
    prevBot === null ||
    prevBot === undefined ||
    prevHuman === null ||
    prevHuman === undefined
      ? null
      : ratio(prevBot, prevBot + prevHuman);

  const sparkOf = (key: string): number[] | undefined =>
    traffic?.series.find((s) => s.key === key)?.values;
  const moneySpark = (key: string): number[] | undefined =>
    money?.trend.series.find((s) => s.key === key)?.values;

  const alerts: {
    key: string;
    text: string;
    target: string;
    severity: "high" | "medium" | "low";
    onOpen: () => void;
  }[] = [];
  if (acquisition && acquisition.abuse.flaggedPrefixes > 0) {
    alerts.push({
      key: "abuse",
      target: TARGET.abuse,
      severity: "high",
      text: t("get.widget.alerts.abuse", {
        count: acquisition.abuse.flaggedPrefixes,
        prefix: acquisition.abuse.topPrefix ?? "",
        leads: formatAnalyticsValue(acquisition.abuse.topPrefixLeads, {
          locale,
        }),
      }),
      onOpen: () => drill(TARGET.abuse),
    });
  }
  if (referral && referral.pendingPayouts.count > 0) {
    alerts.push({
      key: "payouts",
      target: TARGET.payouts,
      severity: "medium",
      text: t("get.widget.alerts.payouts", {
        count: referral.pendingPayouts.count,
        amount: formatAnalyticsValue(referral.pendingPayouts.amountUsd, {
          format: "currency",
          locale,
        }),
      }),
      onOpen: () =>
        drill(TARGET.payouts, { status: "enums.payoutStatus.pending" }),
    });
  }
  if (ops && ops.unresolvedErrors > 0) {
    alerts.push({
      key: "errors",
      target: TARGET.errors,
      severity: "high",
      text: t("get.widget.alerts.errors", {
        count: formatAnalyticsValue(ops.unresolvedErrors, { locale }),
        occurrences: formatAnalyticsValue(ops.errorOccurrences.value, {
          locale,
        }),
      }),
      onOpen: () => drill(TARGET.errors),
    });
  }
  if (costCoverage !== null && costCoverage < 0.5) {
    alerts.push({
      key: "costCoverage",
      target: TARGET.usage,
      severity: "medium",
      text: t("get.widget.alerts.costCoverage", {
        coverage: formatAnalyticsValue(costCoverage, {
          format: "percent",
          locale,
        }),
      }),
      onOpen: () => drill(TARGET.usage),
    });
  }
  const unattributedRevenue =
    acquisition?.topSources.find(
      (row) => row.key === LeadChannelFilter.UNATTRIBUTED,
    )?.metrics.revenueUsd ?? 0;
  const unattributedShare =
    money && money.kpis.revenueUsd.value > 0
      ? unattributedRevenue / money.kpis.revenueUsd.value
      : 0;
  if (unattributedShare >= 0.2) {
    alerts.push({
      key: "unattributed",
      target: TARGET.acquisition,
      severity: "medium",
      text: t("get.widget.alerts.unattributed", {
        share: formatAnalyticsValue(unattributedShare, {
          format: "percent",
          locale,
        }),
        amount: formatAnalyticsValue(unattributedRevenue, {
          format: "currency",
          locale,
        }),
      }),
      onOpen: () =>
        drill(TARGET.acquisition, {
          channelType: LeadChannelFilter.UNATTRIBUTED,
        }),
    });
  }
  if (ops && ops.failingTasks > 0) {
    alerts.push({
      key: "tasks",
      target: TARGET.tasks,
      severity: "medium",
      text: t("get.widget.alerts.tasks", { count: ops.failingTasks }),
      onOpen: () =>
        drill(TARGET.tasks, { health: "enums.healthFilter.attention" }),
    });
  }
  if (ops && ops.unhealthyConnections > 0) {
    alerts.push({
      key: "connections",
      target: TARGET.connections,
      severity: "medium",
      text: t("get.widget.alerts.connections", {
        count: ops.unhealthyConnections,
      }),
      onOpen: () => drill(TARGET.connections),
    });
  }

  const platform = useWidgetPlatform();
  const isTerminal = isAgentPlatform(platform) || isCliPlatform(platform);
  const unavailable = (
    <EmptyBlock title={t("get.widget.unavailable")} className="py-6" />
  );

  return (
    <Div className="flex flex-col gap-4">
      <KpiGrid columns={4}>
        {acquisition ? (
          <>
            <KpiTile
              drillHint={TARGET.acquisition}
              label={t("get.widget.kpi.visits")}
              value={acquisition.kpis.visits.value}
              previous={acquisition.kpis.visits.previous}
              locale={locale}
              hint={
                acquisition.kpis.botVisits &&
                acquisition.kpis.botVisits.value > 0
                  ? t("get.widget.kpi.botVisitsHint", {
                      count: formatAnalyticsValue(
                        acquisition.kpis.botVisits.value,
                        { locale },
                      ),
                    })
                  : undefined
              }
              sparkline={sparkOf("visits")}
              onClick={() =>
                drill(TARGET.acquisition, {
                  traffic: "leadAnalytics.traffic.humans",
                })
              }
            />
            <KpiTile
              drillHint={TARGET.acquisition}
              label={t("get.widget.kpi.humanLeads")}
              value={acquisition.kpis.humanLeads.value}
              previous={acquisition.kpis.humanLeads.previous}
              locale={locale}
              hint={
                acquisition.kpis.botLeads.value > 0
                  ? t("get.widget.kpi.botLeadsHint", {
                      count: formatAnalyticsValue(
                        acquisition.kpis.botLeads.value,
                        { locale },
                      ),
                    })
                  : undefined
              }
              sparkline={sparkOf("leads")}
              onClick={() =>
                drill(TARGET.acquisition, {
                  traffic: "leadAnalytics.traffic.humans",
                })
              }
            />
            <KpiTile
              drillHint={TARGET.funnel}
              label={t("get.widget.kpi.signups")}
              value={acquisition.kpis.signups.value}
              previous={acquisition.kpis.signups.previous}
              locale={locale}
              hint={
                signupRate === null
                  ? undefined
                  : t("get.widget.kpi.signupRateHint", {
                      rate: formatAnalyticsValue(signupRate, {
                        format: "percent",
                        locale,
                      }),
                    })
              }
              sparkline={sparkOf("signups")}
              onClick={() => drill(TARGET.funnel)}
            />
          </>
        ) : null}
        {money ? (
          <>
            <KpiTile
              drillHint={TARGET.revenue}
              label={t("get.widget.kpi.payers")}
              value={money.kpis.payingCustomers.value}
              previous={money.kpis.payingCustomers.previous}
              locale={locale}
              hint={t("get.widget.kpi.payersHint")}
              onClick={() => drill(TARGET.revenue)}
            />
            <KpiTile
              drillHint={TARGET.revenue}
              label={t("get.widget.kpi.revenue")}
              value={money.kpis.revenueUsd.value}
              previous={money.kpis.revenueUsd.previous}
              format="currency"
              locale={locale}
              hint={t("get.widget.kpi.revenueHint")}
              sparkline={moneySpark("revenueUsd")}
              onClick={() => drill(TARGET.revenue)}
            />
            <KpiTile
              drillHint={TARGET.usage}
              label={t("get.widget.kpi.creditSpend")}
              value={money.kpis.creditSpendUsd.value}
              previous={money.kpis.creditSpendUsd.previous}
              format="currency"
              locale={locale}
              hint={t("get.widget.kpi.creditSpendHint", {
                cost: formatAnalyticsValue(money.kpis.upstreamCostUsd.value, {
                  format: "currency",
                  locale,
                }),
                previous: formatAnalyticsValue(
                  money.kpis.upstreamCostUsd.previous,
                  { format: "currency", locale },
                ),
                guests: formatAnalyticsValue(money.kpis.guestSpendUsd.value, {
                  format: "currency",
                  locale,
                }),
              })}
              sparkline={moneySpark("spendUsd")}
              onClick={() => drill(TARGET.usage)}
            />
            <KpiTile
              drillHint={TARGET.usage}
              label={
                costCoverage !== null && costCoverage < 0.5
                  ? t("get.widget.kpi.marginPartial")
                  : t("get.widget.kpi.margin")
              }
              value={marginRate ?? money.kpis.marginUsd.value}
              previous={
                marginRate === null
                  ? money.kpis.marginUsd.previous
                  : marginRatePrevious
              }
              format={marginRate === null ? "currency" : "percent"}
              locale={locale}
              tone={
                money.kpis.marginUsd.value < 0
                  ? "negative"
                  : costCoverage !== null && costCoverage < 0.5
                    ? "muted"
                    : "default"
              }
              hint={
                marginRate !== null && money.kpis.costedSpendUsd
                  ? t("get.widget.kpi.marginRateHint", {
                      margin: formatAnalyticsValue(money.kpis.marginUsd.value, {
                        format: "currency",
                        locale,
                      }),
                      base: formatAnalyticsValue(
                        money.kpis.costedSpendUsd.value,
                        { format: "currency", locale },
                      ),
                      coverage: formatAnalyticsValue(costCoverage ?? 0, {
                        format: "percent",
                        locale,
                      }),
                      cost: formatAnalyticsValue(
                        money.kpis.upstreamCostUsd.value,
                        { format: "currency", locale },
                      ),
                    })
                  : t("get.widget.kpi.marginHint", {
                      cost: formatAnalyticsValue(
                        money.kpis.upstreamCostUsd.value,
                        { format: "currency", locale },
                      ),
                    })
              }
              onClick={() => drill(TARGET.usage)}
            />
          </>
        ) : null}
        {acquisition ? (
          <KpiTile
            drillHint={TARGET.acquisition}
            label={t("get.widget.kpi.botShare")}
            value={botShare}
            previous={botSharePrevious}
            format="percent"
            locale={locale}
            invertDelta
            tone={botShare !== null && botShare > 0.5 ? "warning" : "default"}
            hint={
              acquisition.abuse.topPrefix
                ? t("get.widget.kpi.botShareTopHint", {
                    count: formatAnalyticsValue(
                      acquisition.kpis.botLeads.value,
                      {
                        locale,
                      },
                    ),
                    prefix: acquisition.abuse.topPrefix,
                  })
                : t("get.widget.kpi.botShareHint", {
                    count: formatAnalyticsValue(
                      acquisition.kpis.botLeads.value,
                      {
                        locale,
                      },
                    ),
                  })
            }
            onClick={() =>
              drill(TARGET.acquisition, {
                traffic: "leadAnalytics.traffic.bots",
              })
            }
          />
        ) : null}
      </KpiGrid>
      <Span className="block text-xs text-muted-foreground">
        {t("get.widget.asOf", {
          time: new Intl.DateTimeFormat(locale, {
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(value.generatedAt)),
        })}
      </Span>

      <SectionGroup title={t("get.widget.alerts.title")}>
        {isTerminal && alerts.length > 0 ? (
          <Div className="flex flex-col">
            {alerts
              .toSorted(
                (a, b) =>
                  SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
              )
              .map((alert) => (
                <Span key={alert.key}>
                  {`- ${t(SEVERITY_LABEL[alert.severity])}: ${alert.text} (-> ${alert.target})`}
                </Span>
              ))}
          </Div>
        ) : alerts.length === 0 ? (
          <Span className="block px-4 py-3 text-sm text-muted-foreground">
            {t("get.widget.alerts.none")}
          </Span>
        ) : (
          <Div className="flex flex-col divide-y">
            {alerts
              .toSorted(
                (a, b) =>
                  SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
              )
              .map((alert) => (
                <Button
                  key={alert.key}
                  type="button"
                  variant="ghost"
                  className="h-auto min-h-10 justify-start whitespace-normal rounded-none px-4 py-2 text-start text-sm font-normal"
                  onClick={alert.onOpen}
                >
                  <Span
                    className={cn(
                      "me-2 inline-block size-2 shrink-0 rounded-full",
                      alert.severity === "high"
                        ? "bg-destructive"
                        : alert.severity === "medium"
                          ? "bg-warning"
                          : "bg-info",
                    )}
                    aria-hidden="true"
                  />
                  <Span className="flex-1">{alert.text}</Span>
                  <Span className="me-2 text-xs text-muted-foreground">
                    {t(SEVERITY_LABEL[alert.severity])}
                  </Span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Button>
              ))}
          </Div>
        )}
      </SectionGroup>

      <Div className="grid min-w-0 gap-4 @4xl:grid-cols-2">
        {traffic ? (
          <TimeSeriesChart
            title={t("get.widget.trafficChart")}
            drillHint={TARGET.acquisition}
            subtitle={t("get.widget.trafficChartHint")}
            buckets={traffic.buckets}
            bucket={period.bucket}
            series={pickSeries(
              traffic.series,
              ["leads", "signups"],
              TRAFFIC_LABEL,
            )}
            variant="line"
            cliTable={false}
            locale={locale}
            onBucketClick={(day) =>
              drill(TARGET.acquisition, {
                range: "analytics.range.custom",
                from: day,
                to: day,
              })
            }
            actions={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => drill(TARGET.acquisition)}
              >
                {t("get.widget.open.acquisition")}
              </Button>
            }
          />
        ) : (
          unavailable
        )}
        {money ? (
          <TimeSeriesChart
            title={t("get.widget.moneyChart")}
            drillHint={TARGET.revenue}
            subtitle={t("get.widget.moneyChartHint")}
            buckets={money.trend.buckets}
            bucket={period.bucket}
            series={pickSeries(
              money.trend.series,
              ["revenueUsd"],
              MONEY_LABEL,
            ).map((s) => ({ ...s, color: 2 }))}
            variant="bar"
            cliTable={false}
            format="currency"
            locale={locale}
            actions={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => drill(TARGET.revenue)}
              >
                {t("get.widget.open.revenue")}
              </Button>
            }
          />
        ) : (
          unavailable
        )}
      </Div>

      <Div className="grid min-w-0 gap-4 @4xl:grid-cols-2">
        {acquisition ? (
          <BreakdownTable
            title={t("get.widget.sources")}
            drillHint={TARGET.acquisition}
            subtitle={t("get.widget.sourcesHint")}
            shareKey="revenueUsd"
            shareLabel={t("get.widget.revenueShare")}
            footer={
              money
                ? t("get.widget.footerSources", {
                    rows: formatAnalyticsValue(
                      sumMetric(acquisition.topSources, "revenueUsd"),
                      { format: "currency", locale },
                    ),
                    total: formatAnalyticsValue(money.kpis.revenueUsd.value, {
                      format: "currency",
                      locale,
                    }),
                  })
                : undefined
            }
            dimensionLabel={t("get.widget.sourcesDimension")}
            columns={[
              { key: "leads", label: t("get.widget.columns.leads") },
              { key: "signups", label: t("get.widget.columns.signups") },
              {
                key: "payers",
                label: t("get.widget.columns.payers"),
                hideOnNarrow: true,
              },
              {
                key: "revenueUsd",
                label: t("get.widget.columns.revenueUsd"),
                format: "currency",
              },
            ]}
            rows={acquisition.topSources.map((row) => ({
              id: row.key ?? "none",
              label: row.key
                ? channelLabel(row.key, t)
                : t("analytics.chart.none"),
              values: row.metrics,
              onClick: row.key
                ? () =>
                    drill(TARGET.acquisition, {
                      channelType: row.key ?? "",
                      traffic: "leadAnalytics.traffic.humans",
                    })
                : undefined,
            }))}
            limit={8}
            locale={locale}
            actions={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => drill(TARGET.funnel)}
              >
                {t("get.widget.open.funnel")}
              </Button>
            }
          />
        ) : (
          unavailable
        )}
        {referral ? (
          <BreakdownTable
            title={t("get.widget.referrals")}
            drillHint={TARGET.referrals}
            subtitle={t("get.widget.referralsHint")}
            showShare={false}
            footer={
              money
                ? t("get.widget.footerReferrals", {
                    rows: formatAnalyticsValue(referral.kpis.revenueUsd.value, {
                      format: "currency",
                      locale,
                    }),
                    total: formatAnalyticsValue(money.kpis.revenueUsd.value, {
                      format: "currency",
                      locale,
                    }),
                  })
                : undefined
            }
            dimensionLabel={t("get.widget.referralsDimension")}
            columns={[
              {
                key: "clicks",
                label: t("get.widget.columns.clicks"),
                hideOnNarrow: true,
              },
              {
                key: "signups",
                label: t("get.widget.columns.signups"),
                hideOnNarrow: true,
              },
              {
                key: "clickToSignup",
                label: t("get.widget.columns.clickToSignup"),
                format: "percent",
                hideOnNarrow: true,
              },
              {
                key: "payers",
                label: t("get.widget.columns.payers"),
              },
              {
                key: "revenueUsd",
                label: t("get.widget.columns.revenueUsd"),
                format: "currency",
              },
            ]}
            rows={referral.topCodes.map((row) => ({
              id: row.key ?? "none",
              label: row.key ?? t("analytics.chart.none"),
              values: {
                ...row.metrics,
                clickToSignup: ratio(
                  row.metrics.signups ?? 0,
                  row.metrics.clicks ?? 0,
                ),
              },
              onClick: row.key
                ? () => drill(TARGET.referralCode, { code: row.key ?? "" })
                : undefined,
            }))}
            limit={8}
            locale={locale}
            actions={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => drill(TARGET.referrals)}
              >
                {t("get.widget.open.referrals")}
              </Button>
            }
          />
        ) : (
          unavailable
        )}
      </Div>
    </Div>
  );
}
