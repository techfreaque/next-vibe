/**
 * Users Stats Widget
 * Business dashboard. Web: KPI cards with change vs previous window, a
 * switchable bar chart and breakdown tables. CLI/MCP: a compact text report.
 */

"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Users } from "next-vibe/ui/components/icons/Users";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { Pre } from "next-vibe/ui/components/pre";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import type React from "react";
import { useCallback, useState } from "react";

import {
  cell,
  formatDay,
  formatMoney,
  formatNumber,
  formatPercent,
  formatUsd,
  subscriptionStatusLabel,
  subscriptionStatusVariant,
} from "../format";
import type definition from "./definition";
import type { UserStatsResponseOutput } from "./definition";
import { StatsRange } from "./enum";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type StatsT = ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
type SeriesRow = UserStatsResponseOutput["series"][number];
type SeriesMetric =
  | "signups"
  | "activeUsers"
  | "payingUsers"
  | "revenueUsd"
  | "creditsSpent";

const CREDIT_USD = 0.01;

/** Relative change; null when there is no baseline. */
function change(current: number, previous: number): number | null {
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }
  return (current - previous) / previous;
}

function trendOf(delta: number | null): "up" | "down" | "neutral" {
  if (delta === null || delta === 0) {
    return "neutral";
  }
  return delta > 0 ? "up" : "down";
}

function deltaText(
  delta: number | null,
  t: StatsT,
  locale: CountryLanguage,
): string {
  if (delta === null) {
    return t("widget.new");
  }
  const sign = delta > 0 ? "+" : "";
  return `${sign}${formatPercent(delta, locale)}`;
}

function bucketLabel(
  bucket: Date,
  granularity: UserStatsResponseOutput["period"]["granularity"],
  locale: CountryLanguage,
): string {
  const d = new Date(bucket);
  const tag = locale.endsWith("-GLOBAL") ? locale.split("-")[0] : locale;
  if (granularity === "month") {
    return d.toLocaleDateString(tag, {
      month: "short",
      year: "2-digit",
      timeZone: "UTC",
    });
  }
  return d.toLocaleDateString(tag, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function metricValue(row: SeriesRow, metric: SeriesMetric): number {
  return row[metric];
}

function formatMetric(
  value: number,
  metric: SeriesMetric,
  locale: CountryLanguage,
): string {
  return metric === "revenueUsd"
    ? formatUsd(value, locale)
    : formatNumber(value, locale);
}

function kpiRow(
  label: string,
  value: string,
  prev: string,
  delta: string,
): string {
  return `${cell(label, 22)} ${cell(value, 12)} ${cell(prev, 12)} ${delta}`;
}

// ─── CLI / MCP text report ──────────────────────────────────────────────────

function renderText(
  data: UserStatsResponseOutput,
  t: StatsT,
  locale: CountryLanguage,
): string {
  const { kpis, period } = data;
  const lines: string[] = [];
  lines.push(
    t("widget.text.header", {
      from: formatDay(period.from, locale, true),
      to: formatDay(period.to, locale, true),
      days: period.days,
    }),
  );
  lines.push("");
  lines.push(
    kpiRow(
      t("widget.text.metric"),
      t("widget.text.current"),
      t("widget.text.previous"),
      t("widget.text.change"),
    ),
  );
  lines.push(
    kpiRow(
      t("kpi.newUsers"),
      formatNumber(kpis.newUsers, locale),
      formatNumber(kpis.newUsersPrev, locale),
      deltaText(change(kpis.newUsers, kpis.newUsersPrev), t, locale),
    ),
  );
  lines.push(
    kpiRow(
      t("kpi.activeUsers"),
      formatNumber(kpis.activeUsers, locale),
      formatNumber(kpis.activeUsersPrev, locale),
      deltaText(change(kpis.activeUsers, kpis.activeUsersPrev), t, locale),
    ),
  );
  lines.push(
    kpiRow(
      t("kpi.payingUsers"),
      formatNumber(kpis.payingUsers, locale),
      formatNumber(kpis.payingUsersPrev, locale),
      deltaText(change(kpis.payingUsers, kpis.payingUsersPrev), t, locale),
    ),
  );
  lines.push(
    kpiRow(
      t("kpi.revenue"),
      formatUsd(kpis.revenueUsd, locale),
      formatUsd(kpis.revenuePrevUsd, locale),
      deltaText(change(kpis.revenueUsd, kpis.revenuePrevUsd), t, locale),
    ),
  );
  lines.push(
    kpiRow(
      t("kpi.creditsSpent"),
      formatNumber(kpis.creditsSpent, locale),
      formatNumber(kpis.creditsSpentPrev, locale),
      deltaText(change(kpis.creditsSpent, kpis.creditsSpentPrev), t, locale),
    ),
  );
  lines.push("");
  lines.push(
    `${t("kpi.mrr")}: ${formatUsd(kpis.mrrUsd, locale)} | ${t("kpi.activeSubscribers")}: ${kpis.activeSubscribers} | ${t("kpi.pastDue")}: ${kpis.pastDueSubscribers}`,
  );
  lines.push(
    `${t("kpi.signupToPaid")}: ${formatPercent(kpis.signupToPaid.rate, locale)} (${kpis.signupToPaid.converted}/${kpis.signupToPaid.cohort}) | ${t("kpi.retentionD7")}: ${formatPercent(kpis.retentionD7.rate, locale)} (${kpis.retentionD7.converted}/${kpis.retentionD7.cohort})`,
  );
  lines.push(
    `${t("kpi.totalUsers")}: ${formatNumber(kpis.totalUsers, locale)} | ${t("kpi.payingAllTime")}: ${kpis.payingUsersAllTime} | ${t("kpi.revenueAllTime")}: ${formatUsd(kpis.revenueAllTimeUsd, locale)} | ${t("kpi.refunds")}: ${formatUsd(kpis.refundsUsd, locale)} | ${t("kpi.anonymousActive")}: ${kpis.anonymousActive}`,
  );

  if (data.series.length > 0) {
    lines.push("");
    lines.push(
      [
        cell(t("widget.text.bucket"), 10),
        cell(t("series.signups"), 8),
        cell(t("series.activeUsers"), 8),
        cell(t("series.payingUsers"), 8),
        cell(t("series.revenueUsd"), 10),
        t("series.creditsSpent"),
      ].join(" "),
    );
    for (const r of data.series.slice(-40)) {
      lines.push(
        [
          cell(bucketLabel(r.bucket, period.granularity, locale), 10),
          cell(String(r.signups), 8),
          cell(String(r.activeUsers), 8),
          cell(String(r.payingUsers), 8),
          cell(formatUsd(r.revenueUsd, locale), 10),
          formatNumber(r.creditsSpent, locale),
        ].join(" "),
      );
    }
  }

  if (data.channels.length > 0) {
    lines.push("");
    lines.push(t("sections.channels"));
    for (const c of data.channels) {
      lines.push(
        `  ${cell(c.channel, 28)} ${cell(String(c.signups), 6)} ${t("widget.text.paying", { count: c.paying })}`,
      );
    }
  }

  if (data.revenueByCurrency.length > 0) {
    lines.push("");
    lines.push(t("sections.currencies"));
    for (const c of data.revenueByCurrency) {
      lines.push(
        `  ${cell(formatMoney(c.amount, c.currency, locale), 14)} = ${cell(formatUsd(c.amountUsd, locale), 10)} ${t("widget.times", { count: c.count })}`,
      );
    }
  }

  if (data.topSpenders.length > 0) {
    lines.push("");
    lines.push(t("sections.topSpenders"));
    for (const s of data.topSpenders) {
      lines.push(
        `  ${cell(s.email, 36)} ${cell(formatNumber(s.creditsSpent, locale), 9)} ${cell(s.totalPaidUsd > 0 ? formatUsd(s.totalPaidUsd, locale) : "-", 9)} ${s.userId}`,
      );
    }
  }
  lines.push("");
  lines.push(t("widget.text.footer"));
  return lines.join("\n");
}

// ─── Web pieces ─────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  current,
  previous,
  hint,
  t,
  locale,
  variant,
}: {
  label: string;
  value: string;
  current: number;
  previous: number;
  hint?: string;
  t: StatsT;
  locale: CountryLanguage;
  variant?: "default" | "success" | "info" | "warning" | "danger" | "muted";
}): React.JSX.Element {
  const delta = change(current, previous);
  return (
    <MetricCard
      label={label}
      value={value}
      trend={trendOf(delta)}
      trendValue={deltaText(delta, t, locale)}
      description={hint}
      variant={variant}
    />
  );
}

function SeriesChart({
  data,
  t,
  locale,
}: {
  data: UserStatsResponseOutput;
  t: StatsT;
  locale: CountryLanguage;
}): React.JSX.Element {
  const [metric, setMetric] = useState<SeriesMetric>("signups");
  const metrics: SeriesMetric[] = [
    "signups",
    "activeUsers",
    "payingUsers",
    "revenueUsd",
    "creditsSpent",
  ];
  const rows = data.series;
  const max = Math.max(1, ...rows.map((r) => metricValue(r, metric)));
  const total = rows.reduce((acc, r) => acc + metricValue(r, metric), 0);
  const labelEvery = Math.max(1, Math.ceil(rows.length / 8));

  return (
    <SectionGroup title={t("sections.trend")}>
      <Div className="flex items-center gap-1 flex-wrap">
        {metrics.map((m) => (
          <Button
            key={m}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setMetric(m)}
            className={cn(
              "h-7 px-2.5 rounded-full text-xs border",
              metric === m
                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                : "text-muted-foreground border-border",
            )}
          >
            {t(`series.${m}`)}
          </Button>
        ))}
        <Span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {t("widget.chartTotal", {
            total: formatMetric(total, metric, locale),
          })}
        </Span>
      </Div>
      {rows.length === 0 ? (
        <P className="text-sm text-muted-foreground">{t("widget.noData")}</P>
      ) : (
        <Div className="flex flex-col gap-1">
          <Div className="flex items-end gap-[2px] h-40 border-b border-border">
            {rows.map((r) => {
              const v = metricValue(r, metric);
              return (
                <Div
                  key={new Date(r.bucket).getTime()}
                  className="flex-1 min-w-[3px] h-full flex flex-col justify-end group relative"
                  title={`${bucketLabel(r.bucket, data.period.granularity, locale)}: ${formatMetric(v, metric, locale)}`}
                >
                  <Div
                    style={{
                      height:
                        v > 0 ? `${Math.max(3, (v / max) * 100)}%` : "2px",
                    }}
                  >
                    <Div
                      className={cn(
                        "h-full w-full rounded-t-sm transition-colors",
                        v > 0
                          ? "bg-primary/70 group-hover:bg-primary"
                          : "bg-muted",
                      )}
                    />
                  </Div>
                </Div>
              );
            })}
          </Div>
          <Div className="flex gap-[2px]">
            {rows.map((r, i) => (
              <Span
                key={new Date(r.bucket).getTime()}
                className="flex-1 min-w-[3px] text-[10px] text-muted-foreground text-center whitespace-nowrap overflow-visible"
              >
                {i % labelEvery === 0
                  ? bucketLabel(r.bucket, data.period.granularity, locale)
                  : ""}
              </Span>
            ))}
          </Div>
        </Div>
      )}
    </SectionGroup>
  );
}

// ─── Container ──────────────────────────────────────────────────────────────

export function UsersStatsContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const form = useWidgetForm<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const range = form.watch("range");

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleUsers = useCallback((): void => {
    void (async (): Promise<void> => {
      const listDef = await import("../list/definition");
      navigate(listDef.default.GET);
    })();
  }, [navigate]);

  const handleViewUser = useCallback(
    (userId: string): void => {
      void (async (): Promise<void> => {
        const viewDef = await import("../view/definition");
        navigate(viewDef.default.GET, { data: { userId } });
      })();
    },
    [navigate],
  );

  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return data ? <Pre>{renderText(data, t, locale)}</Pre> : <Pre>{""}</Pre>;
  }

  const kpis = data?.kpis;

  return (
    <WidgetShell>
      <WidgetHeader
        title={t("title")}
        backButton={<NavigateButtonWidget field={children.backButton} />}
        actions={
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleUsers}
              className="gap-1"
            >
              <Users className="h-4 w-4" />
              <Span className="hidden sm:inline text-xs">
                {t("widget.users")}
              </Span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              title={t("widget.refresh")}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </>
        }
      />

      {/* Controls */}
      <Div className="grid grid-cols-2 @lg:grid-cols-5 gap-3 items-end">
        <SelectFieldWidget fieldName="range" field={children.range} />
        <SelectFieldWidget
          fieldName="granularity"
          field={children.granularity}
        />
        {range === StatsRange.CUSTOM && (
          <>
            <DateFieldWidget fieldName="from" field={children.from} />
            <DateFieldWidget fieldName="to" field={children.to} />
          </>
        )}
        <BooleanFieldWidget
          fieldName="includeInternal"
          field={children.includeInternal}
        />
      </Div>

      <FormAlertWidget field={children.formAlert} />

      {!data || !kpis ? (
        endpointMutations?.read?.isLoading !== false && (
          <LoadingBlock message={t("widget.loading")} />
        )
      ) : (
        <>
          <P className="text-xs text-muted-foreground">
            {t("widget.period", {
              from: formatDay(data.period.from, locale, true),
              to: formatDay(data.period.to, locale, true),
              days: data.period.days,
            })}
          </P>

          <MetricGrid columns={4}>
            <KpiCard
              label={t("kpi.revenue")}
              value={formatUsd(kpis.revenueUsd, locale)}
              current={kpis.revenueUsd}
              previous={kpis.revenuePrevUsd}
              hint={
                kpis.refundsUsd > 0
                  ? t("kpi.refundsHint", {
                      amount: formatUsd(kpis.refundsUsd, locale),
                    })
                  : t("kpi.revenueHint")
              }
              t={t}
              locale={locale}
              variant="success"
            />
            <MetricCard
              label={t("kpi.mrr")}
              value={formatUsd(kpis.mrrUsd, locale)}
              description={t("kpi.mrrHint", {
                active: kpis.activeSubscribers,
                pastDue: kpis.pastDueSubscribers,
              })}
              variant="info"
            />
            <KpiCard
              label={t("kpi.payingUsers")}
              value={formatNumber(kpis.payingUsers, locale)}
              current={kpis.payingUsers}
              previous={kpis.payingUsersPrev}
              hint={t("kpi.payingAllTimeHint", {
                count: kpis.payingUsersAllTime,
              })}
              t={t}
              locale={locale}
            />
            <KpiCard
              label={t("kpi.creditsSpent")}
              value={formatNumber(kpis.creditsSpent, locale)}
              current={kpis.creditsSpent}
              previous={kpis.creditsSpentPrev}
              hint={t("kpi.creditsHint", {
                usd: formatUsd(kpis.creditsSpent * CREDIT_USD, locale),
              })}
              t={t}
              locale={locale}
            />
            <KpiCard
              label={t("kpi.newUsers")}
              value={formatNumber(kpis.newUsers, locale)}
              current={kpis.newUsers}
              previous={kpis.newUsersPrev}
              hint={t("kpi.totalUsersHint", {
                count: formatNumber(kpis.totalUsers, locale),
              })}
              t={t}
              locale={locale}
            />
            <KpiCard
              label={t("kpi.activeUsers")}
              value={formatNumber(kpis.activeUsers, locale)}
              current={kpis.activeUsers}
              previous={kpis.activeUsersPrev}
              hint={t("kpi.anonymousHint", {
                count: formatNumber(kpis.anonymousActive, locale),
              })}
              t={t}
              locale={locale}
            />
            <MetricCard
              label={t("kpi.signupToPaid")}
              value={formatPercent(kpis.signupToPaid.rate, locale)}
              description={t("kpi.ratioHint", {
                converted: kpis.signupToPaid.converted,
                cohort: kpis.signupToPaid.cohort,
              })}
            />
            <MetricCard
              label={t("kpi.retentionD7")}
              value={formatPercent(kpis.retentionD7.rate, locale)}
              description={t("kpi.retentionHint", {
                converted: kpis.retentionD7.converted,
                cohort: kpis.retentionD7.cohort,
              })}
            />
          </MetricGrid>

          <SeriesChart data={data} t={t} locale={locale} />

          <Div className="grid grid-cols-1 @lg:grid-cols-2 gap-4">
            <SectionGroup title={t("sections.channels")}>
              {data.channels.length === 0 ? (
                <P className="text-sm text-muted-foreground">
                  {t("widget.noData")}
                </P>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("table.channel")}</TableHead>
                      <TableHead className="text-right">
                        {t("table.signups")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("table.paying")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("table.conversion")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.channels.map((c) => (
                      <TableRow key={c.channel}>
                        <TableCell className="text-sm">{c.channel}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {c.signups}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {c.paying}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {formatPercent(
                            c.signups > 0 ? c.paying / c.signups : 0,
                            locale,
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </SectionGroup>

            <SectionGroup title={t("sections.subscriptions")}>
              {data.subscriptionsByStatus.length === 0 ? (
                <P className="text-sm text-muted-foreground">
                  {t("widget.noData")}
                </P>
              ) : (
                <Div className="flex flex-col gap-2">
                  {data.subscriptionsByStatus.map((s) => (
                    <Div
                      key={s.status}
                      className="flex items-center justify-between"
                    >
                      <StatusPill
                        status={s.status}
                        label={subscriptionStatusLabel(s.status, locale)}
                        variant={subscriptionStatusVariant(s.status)}
                      />
                      <Span className="tabular-nums text-sm">{s.count}</Span>
                    </Div>
                  ))}
                </Div>
              )}
              {data.revenueByCurrency.length > 0 && (
                <Div className="flex flex-col gap-1 pt-3 border-t">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("sections.currencies")}
                  </Span>
                  {data.revenueByCurrency.map((c) => (
                    <Div
                      key={c.currency}
                      className="flex items-center justify-between text-sm"
                    >
                      <Span>
                        {formatMoney(c.amount, c.currency, locale)}
                        <Span className="text-xs text-muted-foreground">
                          {" "}
                          {t("widget.times", { count: c.count })}
                        </Span>
                      </Span>
                      <Span className="tabular-nums text-muted-foreground">
                        {formatUsd(c.amountUsd, locale)}
                      </Span>
                    </Div>
                  ))}
                </Div>
              )}
            </SectionGroup>
          </Div>

          <SectionGroup title={t("sections.topSpenders")}>
            {data.topSpenders.length === 0 ? (
              <P className="text-sm text-muted-foreground">
                {t("widget.noData")}
              </P>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("table.user")}</TableHead>
                    <TableHead className="text-right">
                      {t("table.creditsSpent")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("table.lifetimePaid")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topSpenders.map((s) => (
                    <TableRow
                      key={s.userId}
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => handleViewUser(s.userId)}
                    >
                      <TableCell className="text-sm">{s.email}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatNumber(s.creditsSpent, locale)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {s.totalPaidUsd > 0 ? (
                          <Span className="text-success">
                            {formatUsd(s.totalPaidUsd, locale)}
                          </Span>
                        ) : (
                          <Span className="text-muted-foreground">-</Span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </SectionGroup>

          <P className="text-xs text-muted-foreground">
            {t("widget.definitions")}
          </P>
        </>
      )}
    </WidgetShell>
  );
}
