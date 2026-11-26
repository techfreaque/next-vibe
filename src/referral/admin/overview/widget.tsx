"use client";

import {
  type AnalyticsFilterChip,
  AnalyticsToolbar,
  BreakdownTable,
  KpiGrid,
  KpiTile,
  TimeSeriesChart,
} from "next-vibe/ui/components/analytics";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Switch } from "next-vibe/ui/components/switch";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { formatAnalyticsValue } from "next-vibe/unified-ui/analytics/format";
import { percentChange } from "next-vibe/unified-ui/analytics/window";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { type JSX, useState } from "react";

import { scopedTranslation as referralScopedTranslation } from "../../i18n";
import type definitions from "./definition";
import type { ReferralOverviewGetResponseOutput } from "./definition";
import {
  ReferralCodeSort,
  ReferralCodeSortOptions,
  type ReferralCodeSortValue,
} from "./enum";

type SeriesKey =
  | "clicks"
  | "leads"
  | "signups"
  | "payers"
  | "revenue"
  | "commission";

const SERIES_LABEL = {
  clicks: "get.widget.series.clicks",
  leads: "get.widget.series.leads",
  signups: "get.widget.series.signups",
  payers: "get.widget.series.payers",
  revenue: "get.widget.series.revenue",
  commission: "get.widget.series.commission",
} as const;

function isSortValue(value: string): value is ReferralCodeSortValue {
  return ReferralCodeSortOptions.some((option) => option.value === value);
}

function chartSeries(
  trend: ReferralOverviewGetResponseOutput["trend"],
  keys: readonly SeriesKey[],
  label: (key: SeriesKey) => string,
  colors: readonly (1 | 2 | 3 | 4)[],
): Array<{
  key: string;
  label: string;
  values: number[];
  color: 1 | 2 | 3 | 4;
}> {
  return keys.map((key, index) => ({
    key,
    label: label(key),
    values: seriesValues(trend, key),
    color: colors[index] ?? 1,
  }));
}

function seriesValues(
  trend: ReferralOverviewGetResponseOutput["trend"] | undefined,
  key: SeriesKey,
): number[] {
  return trend?.series.find((s) => s.key === key)?.values ?? [];
}

function codeSublabel(
  row: ReferralOverviewGetResponseOutput["codes"][number],
  alert: string | null,
  inactive: string | null,
): string {
  let text = alert ? `${alert} · ` : "";
  text += row.ownerName ?? row.ownerEmail;
  if (row.label) {
    text += ` · ${row.label}`;
  }
  if (inactive) {
    text += ` · ${inactive}`;
  }
  return text;
}

export function ReferralOverviewWidget({
  field: { children },
}: {
  field: (typeof definitions.GET)["fields"];
}): JSX.Element {
  const value = useWidgetValue<typeof definitions.GET>();
  const form = useWidgetForm<typeof definitions.GET>();
  const t = useWidgetTranslation<typeof definitions.GET>();
  const locale = useWidgetLocale();
  const onSubmit = useWidgetOnSubmit();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const { read } = useWidgetEndpointMutations() ?? {};
  const navigate = useRelatedEntityNavigation();
  const { t: tReferral } = referralScopedTranslation.scopedT(locale);
  const canControl = interactive && !responseOnly;
  const seriesLabel = (key: SeriesKey): string => t(SERIES_LABEL[key]);

  const search = form?.watch("search") ?? "";
  const activeOnly = form?.watch("activeOnly") ?? false;
  const ownerUserId = form?.watch("ownerUserId");
  const sortBy = form?.watch("sortBy") ?? ReferralCodeSort.REVENUE;
  const [draft, setDraft] = useState<string | null>(null);
  const searchInput = draft ?? search;

  function commitSearch(): void {
    if (draft === null) {
      return;
    }
    form.setValue("search", draft.trim() || undefined, { shouldDirty: true });
    setDraft(null);
    onSubmit?.();
  }

  const filterChips: AnalyticsFilterChip[] = [];
  if (search) {
    filterChips.push({
      key: "search",
      label: t("get.widget.filters.search"),
      value: search,
      onRemove: () => {
        form.setValue("search", undefined, { shouldDirty: true });
        onSubmit?.();
      },
    });
  }
  if (ownerUserId) {
    filterChips.push({
      key: "owner",
      label: t("get.widget.filters.owner"),
      value: value?.codes[0]?.ownerEmail ?? ownerUserId,
      onRemove: () => {
        form.setValue("ownerUserId", undefined, { shouldDirty: true });
        onSubmit?.();
      },
    });
  }
  if (activeOnly) {
    filterChips.push({
      key: "activeOnly",
      label: t("get.widget.filters.activeOnly"),
      value: "✓",
      onRemove: () => {
        form.setValue("activeOnly", undefined, { shouldDirty: true });
        onSubmit?.();
      },
    });
  }

  function openCode(code: string): void {
    navigate(
      () => import("../code/definition").then((module) => module.default.GET),
      {
        data: {
          code,
          range: form?.watch("range"),
          granularity: form?.watch("granularity"),
          from: form?.watch("from"),
          to: form?.watch("to"),
        },
      },
    );
  }

  function openPayouts(
    status?: ReferralOverviewGetResponseOutput["payouts"]["byStatus"][number]["status"],
  ): void {
    navigate(
      () =>
        import("../payouts/definition").then((module) => module.default.GET),
      { data: status ? { status } : {} },
    );
  }

  const kpis = value?.kpis;
  const period = value?.window;
  const money = { format: "currency" as const, currency: "USD", locale };
  const ratio = (num: number, den: number): string =>
    formatAnalyticsValue(den > 0 ? num / den : null, {
      format: "percent",
      locale,
    });

  return (
    <WidgetShell layout="page" className="min-w-0">
      {canControl && (
        <WidgetHeader
          size="page"
          title={t("get.title")}
          subtitle={t("get.widget.subtitle")}
          backButton={<NavigateButtonWidget field={children.backButton} />}
        />
      )}
      <AnalyticsToolbar
        locale={locale}
        period={period}
        value={{
          range: form?.watch("range"),
          granularity: form?.watch("granularity"),
          from: form?.watch("from"),
          to: form?.watch("to"),
        }}
        onChange={(patch) => {
          if (patch.range) {
            form.setValue("range", patch.range, { shouldDirty: true });
          }
          if (patch.granularity) {
            form.setValue("granularity", patch.granularity, {
              shouldDirty: true,
            });
          }
          if ("from" in patch) {
            form.setValue("from", patch.from, { shouldDirty: true });
          }
          if ("to" in patch) {
            form.setValue("to", patch.to, { shouldDirty: true });
          }
          onSubmit?.();
        }}
        onRefresh={() => {
          void read?.refetch();
        }}
        isLoading={read?.isFetching}
        filters={filterChips}
        onClearFilters={() => {
          form.setValue("search", undefined, { shouldDirty: true });
          form.setValue("ownerUserId", undefined, { shouldDirty: true });
          form.setValue("activeOnly", undefined, { shouldDirty: true });
          onSubmit?.();
        }}
      >
        {canControl && (
          <Div className="flex min-w-0 flex-wrap items-center gap-3">
            <Input
              type="text"
              value={searchInput}
              placeholder={t("get.widget.filters.searchPlaceholder")}
              aria-label={t("get.widget.filters.search")}
              className="h-8 w-full min-w-0 @md:w-56"
              onChangeText={(text) => setDraft(text)}
              onBlur={commitSearch}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitSearch();
                }
              }}
            />
            <Div className="flex items-center gap-2">
              <Switch
                id="referral-overview-active-only"
                checked={activeOnly}
                onCheckedChange={(checked) => {
                  form.setValue("activeOnly", checked || undefined, {
                    shouldDirty: true,
                  });
                  onSubmit?.();
                }}
              />
              <Label
                htmlFor="referral-overview-active-only"
                className="text-xs text-muted-foreground"
              >
                {t("get.widget.filters.activeOnly")}
              </Label>
            </Div>
          </Div>
        )}
      </AnalyticsToolbar>

      <FormAlertWidget field={{}} />

      {!value ? (
        <LoadingBlock message={t("get.widget.loading")} size="sm" />
      ) : (
        <>
          {kpis && (
            <KpiGrid columns={4}>
              <KpiTile
                label={t("get.widget.kpi.clicks")}
                value={kpis.clicks.value}
                previous={kpis.clicks.previous}
                hint={t("get.widget.kpi.clicksHint")}
                sparkline={seriesValues(value.trend, "clicks")}
                locale={locale}
              />
              <KpiTile
                label={t("get.widget.kpi.leads")}
                value={kpis.leads.value}
                previous={kpis.leads.previous}
                hint={t("get.widget.kpi.leadsHint")}
                sparkline={seriesValues(value.trend, "leads")}
                locale={locale}
              />
              <KpiTile
                label={t("get.widget.kpi.signups")}
                value={kpis.signups.value}
                previous={kpis.signups.previous}
                hint={t("get.widget.kpi.signupsHint", {
                  rate: ratio(kpis.signups.value, kpis.clicks.value),
                })}
                sparkline={seriesValues(value.trend, "signups")}
                locale={locale}
              />
              <KpiTile
                label={t("get.widget.kpi.payers")}
                value={kpis.payers.value}
                previous={kpis.payers.previous}
                hint={t("get.widget.kpi.payersHint")}
                sparkline={seriesValues(value.trend, "payers")}
                locale={locale}
              />
              <KpiTile
                label={t("get.widget.kpi.revenue")}
                value={kpis.revenueUsd.value}
                previous={kpis.revenueUsd.previous}
                hint={t("get.widget.kpi.revenueHint")}
                sparkline={seriesValues(value.trend, "revenue")}
                {...money}
              />
              <KpiTile
                label={t("get.widget.kpi.commission")}
                value={kpis.commissionUsd.value}
                previous={kpis.commissionUsd.previous}
                hint={t("get.widget.kpi.commissionHint", {
                  pending: formatAnalyticsValue(
                    kpis.commissionPendingUsd.value,
                    money,
                  ),
                  confirmed: formatAnalyticsValue(
                    kpis.commissionConfirmedUsd.value,
                    money,
                  ),
                })}
                sparkline={seriesValues(value.trend, "commission")}
                {...money}
              />
              <KpiTile
                label={t("get.widget.kpi.payoutsPaid")}
                value={kpis.payoutsPaidUsd.value}
                previous={kpis.payoutsPaidUsd.previous}
                hint={t("get.widget.kpi.payoutsPaidHint")}
                {...money}
              />
              <KpiTile
                label={t("get.widget.kpi.queue")}
                value={value.payouts.openUsd}
                hint={
                  value.payouts.openCount > 0
                    ? t("get.widget.kpi.queueHint", {
                        count: value.payouts.openCount,
                      })
                    : t("get.widget.kpi.queueEmpty")
                }
                tone={value.payouts.openCount > 0 ? "warning" : "muted"}
                onClick={canControl ? () => openPayouts() : undefined}
                {...money}
              />
            </KpiGrid>
          )}

          <Div className="grid min-w-0 gap-4 @3xl:grid-cols-2">
            <TimeSeriesChart
              title={t("get.widget.chart.traffic")}
              subtitle={t("get.widget.chart.trafficSub")}
              buckets={value.trend.buckets}
              bucket={value.window.bucket}
              series={chartSeries(
                value.trend,
                ["clicks", "leads"],
                seriesLabel,
                [1, 2],
              )}
              variant={value.trend.buckets.length >= 3 ? "line" : "bar"}
              locale={locale}
              height={200}
            />
            <TimeSeriesChart
              title={t("get.widget.chart.conversions")}
              subtitle={t("get.widget.chart.conversionsSub")}
              buckets={value.trend.buckets}
              bucket={value.window.bucket}
              series={chartSeries(
                value.trend,
                ["signups", "payers"],
                seriesLabel,
                [1, 2],
              )}
              variant="bar"
              locale={locale}
              height={200}
            />
          </Div>
          <TimeSeriesChart
            title={t("get.widget.chart.money")}
            subtitle={t("get.widget.chart.moneySub")}
            buckets={value.trend.buckets}
            bucket={value.window.bucket}
            series={chartSeries(
              value.trend,
              ["revenue", "commission"],
              seriesLabel,
              [3, 4],
            )}
            variant="bar"
            format="currency"
            currency="USD"
            locale={locale}
            height={200}
          />

          <BreakdownTable
            title={t("get.widget.table.title")}
            subtitle={t("get.widget.table.subtitle", {
              shown: value.codes.length,
              total: value.codesTotal,
            })}
            dimensionLabel={t("get.widget.table.dimension")}
            showShare={false}
            limit={15}
            columns={[
              { key: "clicks", label: t("get.widget.table.clicks") },
              { key: "signups", label: t("get.widget.table.signups") },
              {
                key: "signupsChange",
                label: t("get.widget.table.signupsChange"),
                format: "delta",
                secondary: true,
              },
              { key: "payers", label: t("get.widget.table.payers") },
              {
                key: "revenueUsd",
                label: t("get.widget.table.revenue"),
                format: "currency",
              },
              {
                key: "commissionUsd",
                label: t("get.widget.table.commission"),
                format: "currency",
              },
              {
                key: "ownerQueueUsd",
                label: t("get.widget.table.ownerQueue"),
                format: "currency",
                secondary: true,
              },
              {
                key: "ownerFreeUsd",
                label: t("get.widget.table.ownerFree"),
                format: "currency",
                negativeTone: true,
              },
            ]}
            rows={value.codes.map((row) => ({
              id: row.codeId,
              label: row.code,
              sublabel: codeSublabel(
                row,
                row.ownerFreeUsd < 0
                  ? t("get.widget.table.overCommitted")
                  : null,
                row.isActive ? null : t("get.widget.table.inactive"),
              ),
              marker:
                row.ownerFreeUsd < 0 ? (
                  <AlertTriangle
                    className="h-3.5 w-3.5 shrink-0 text-destructive"
                    aria-label={t("get.widget.table.overCommitted")}
                  />
                ) : undefined,
              values: {
                clicks: row.clicks,
                signups: row.signups,
                payers: row.payers,
                revenueUsd: row.revenueUsd,
                commissionUsd: row.commissionUsd,
                signupsChange:
                  row.signupsPrevious === 0
                    ? null
                    : percentChange(row.signups, row.signupsPrevious),
                ownerQueueUsd: row.ownerQueueUsd,
                ownerFreeUsd: row.ownerFreeUsd,
              },
              onClick: canControl ? () => openCode(row.code) : undefined,
            }))}
            emptyLabel={t("get.widget.table.empty")}
            locale={locale}
            actions={
              canControl ? (
                <Div className="flex flex-wrap items-center gap-2">
                  {value.overCommittedOwners > 0 &&
                    sortBy !== ReferralCodeSort.OWNER_FREE && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-destructive/50 text-destructive"
                        onClick={() => {
                          form.setValue("sortBy", ReferralCodeSort.OWNER_FREE, {
                            shouldDirty: true,
                          });
                          onSubmit?.();
                        }}
                      >
                        <AlertTriangle className="me-1 h-3.5 w-3.5" />
                        {t("get.widget.table.overCommittedOwners", {
                          count: value.overCommittedOwners,
                        })}
                      </Button>
                    )}
                  <Select<ReferralCodeSortValue>
                    value={sortBy}
                    onValueChange={(next) => {
                      if (isSortValue(next)) {
                        form.setValue("sortBy", next, { shouldDirty: true });
                        onSubmit?.();
                      }
                    }}
                  >
                    <SelectTrigger
                      className="h-8 w-44"
                      id="referral-overview-sort"
                    >
                      <SelectValue placeholder={t("get.widget.table.sort")} />
                    </SelectTrigger>
                    <SelectContent>
                      {ReferralCodeSortOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          label={t(option.label)}
                        >
                          {t(option.label)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Div>
              ) : undefined
            }
          />

          <BreakdownTable
            title={t("get.widget.payouts.title")}
            subtitle={t("get.widget.payouts.subtitle")}
            dimensionLabel={t("get.widget.payouts.dimension")}
            showShare={false}
            columns={[
              { key: "count", label: t("get.widget.payouts.count") },
              {
                key: "amountUsd",
                label: t("get.widget.payouts.amount"),
                format: "currency",
              },
            ]}
            rows={value.payouts.byStatus.map((row) => ({
              id: row.status,
              label: tReferral(row.status),
              values: { count: row.count, amountUsd: row.amountUsd },
              onClick: canControl ? () => openPayouts(row.status) : undefined,
            }))}
            emptyLabel={t("get.widget.payouts.empty")}
            locale={locale}
            actions={
              canControl ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => openPayouts()}
                >
                  {t("get.widget.payouts.open")}
                </Button>
              ) : undefined
            }
          />
        </>
      )}
    </WidgetShell>
  );
}
