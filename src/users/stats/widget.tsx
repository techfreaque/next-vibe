/**
 * Signups report widget (users-stats).
 * Web: period toolbar with filter chips, KPI tiles, signup and activity
 * charts, funnel, channel/ref-code/plan/locale breakdowns and free burners.
 * Every tile, bar, step and row drills into users-list with the same filters.
 * CLI/MCP: the analytics components render tables and compact text.
 */

"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import {
  type AnalyticsFilterChip,
  AnalyticsToolbar,
  BreakdownTable,
  type BreakdownTableRow,
  KpiGrid,
  KpiTile,
  TimeSeriesChart,
  type TimeSeriesChartSeries,
} from "next-vibe/ui/components/analytics";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Filter } from "next-vibe/ui/components/icons/Filter";
import { Users } from "next-vibe/ui/components/icons/Users";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Pre } from "next-vibe/ui/components/pre";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { AnalyticsBucket } from "next-vibe/unified-ui/analytics/enum";
import { nextBucket } from "next-vibe/unified-ui/analytics/window";
import { MultiSelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/multiselect-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import type React from "react";
import { useState } from "react";

import { SubscriptionPlan } from "@/subscription/enum";

import { formatDay, subscriptionPlanLabel } from "../format";
import { USERS_CHANNEL_NONE } from "../list/constants";
import type { UserListRequestOutput } from "../list/definition";
import {
  AccountStateFilter,
  ListSortOrder,
  PayerFilter,
  SubscriptionFilter,
  UserListSortField,
  UserPlanFilter,
  UsersAudience,
} from "../list/enum";
import { scopedTranslation as listScopedTranslation } from "../list/i18n";
import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type ListDrill = Partial<UserListRequestOutput>;

const DAY_MS = 86_400_000;

function dayDate(key: string): Date {
  return new Date(`${key}T00:00:00.000Z`);
}

/** Last day (inclusive) of the bucket starting at `key`, clamped to `max`. */
function bucketLastDay(
  key: string,
  bucket: AnalyticsBucket,
  max: string,
): Date {
  const end = new Date(nextBucket(dayDate(key), bucket).getTime() - DAY_MS);
  const cap = dayDate(max);
  return end.getTime() > cap.getTime() ? cap : end;
}

function localeLabel(key: string, locale: CountryLanguage): string {
  const [lang, country] = key.split("-");
  try {
    const names = new Intl.DisplayNames([locale.split("-")[0] ?? "en"], {
      type: "language",
    });
    const name = lang ? names.of(lang) : undefined;
    return name && country ? `${name} (${country.toUpperCase()})` : key;
  } catch {
    return key;
  }
}

export function UsersStatsContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.GET>();
  const { t: lt } = listScopedTranslation.scopedT(useWidgetLocale());
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const isTextPlatform = isCliPlatform(platform) || platform === Platform.MCP;
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const value = useWidgetValue<typeof definition.GET>();
  const { endpointMutations } = useWidgetContext();
  const navigate = useRelatedEntityNavigation();
  const [showFilters, setShowFilters] = useState(false);
  const [showAccountActivity, setShowAccountActivity] = useState(false);

  const submit = (): void => {
    onSubmit?.();
  };

  // Current cohort filters, forwarded to every drill-down.
  const audience = form.watch("audience") ?? UsersAudience.HUMANS;
  const channel = form.watch("channel");
  const channelType = form.watch("channelType");
  const refCode = form.watch("refCode");
  const payer = form.watch("payer");
  const plan = form.watch("plan");
  const accountState = form.watch("accountState");
  const base: ListDrill = {
    audience,
    channel: channel || undefined,
    channelType,
    refCode: refCode || undefined,
    payer,
    plan,
    accountState:
      accountState && accountState.length > 0 ? accountState : undefined,
  };
  const period = value?.window;
  const signupWindow: ListDrill = period
    ? { signupFrom: dayDate(period.from), signupTo: dayDate(period.to) }
    : {};

  const openList = (extra: ListDrill): void => {
    navigate(() => import("../list/definition").then((m) => m.default.GET), {
      data: { ...base, ...extra },
    });
  };
  const openUser = (userId: string): void => {
    navigate(() => import("../view/definition").then((m) => m.GET), {
      data: { userId },
    });
  };

  const chips: AnalyticsFilterChip[] = [];
  if (audience === UsersAudience.ALL) {
    chips.push({
      key: "audience",
      label: lt("get.fields.audience.label"),
      value: lt(UsersAudience.ALL),
      onRemove: () => {
        form.setValue("audience", UsersAudience.HUMANS, { shouldDirty: true });
        submit();
      },
    });
  }
  if (channel) {
    chips.push({
      key: "channel",
      label: lt("get.fields.channel.label"),
      value: channel,
      onRemove: () => {
        form.setValue("channel", "", { shouldDirty: true });
        submit();
      },
    });
  }
  if (channelType) {
    chips.push({
      key: "channelType",
      label: lt("get.fields.channelType.label"),
      value: lt(channelType),
      onRemove: () => {
        form.setValue("channelType", undefined, { shouldDirty: true });
        submit();
      },
    });
  }
  if (refCode) {
    chips.push({
      key: "refCode",
      label: lt("get.fields.refCode.label"),
      value: refCode,
      onRemove: () => {
        form.setValue("refCode", "", { shouldDirty: true });
        submit();
      },
    });
  }
  if (payer && payer !== PayerFilter.ANY) {
    chips.push({
      key: "payer",
      label: lt("get.fields.payer.label"),
      value: lt(payer),
      onRemove: () => {
        form.setValue("payer", undefined, { shouldDirty: true });
        submit();
      },
    });
  }
  if (plan) {
    chips.push({
      key: "plan",
      label: lt("get.fields.plan.label"),
      value: lt(plan),
      onRemove: () => {
        form.setValue("plan", undefined, { shouldDirty: true });
        submit();
      },
    });
  }
  if (accountState && accountState.length > 0) {
    chips.push({
      key: "accountState",
      label: lt("get.fields.accountState.label"),
      value: accountState.map((s) => lt(s)).join(", "),
      onRemove: () => {
        form.setValue("accountState", [], { shouldDirty: true });
        submit();
      },
    });
  }
  const clearFilters = (): void => {
    form.setValue("audience", UsersAudience.HUMANS, { shouldDirty: true });
    form.setValue("channel", "", { shouldDirty: true });
    form.setValue("channelType", undefined, { shouldDirty: true });
    form.setValue("refCode", "", { shouldDirty: true });
    form.setValue("payer", undefined, { shouldDirty: true });
    form.setValue("plan", undefined, { shouldDirty: true });
    form.setValue("accountState", [], { shouldDirty: true });
    submit();
  };

  const toolbar = (
    <AnalyticsToolbar
      locale={locale}
      period={period}
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
        if ("from" in patch) {
          form.setValue("from", patch.from, { shouldDirty: true });
        }
        if ("to" in patch) {
          form.setValue("to", patch.to, { shouldDirty: true });
        }
        submit();
      }}
      onRefresh={() => endpointMutations?.read?.refetch?.()}
      isLoading={endpointMutations?.read?.isLoading === true}
      filters={chips}
      onClearFilters={clearFilters}
    >
      <Button
        type="button"
        variant={showFilters ? "secondary" : "outline"}
        size="sm"
        className="h-7 gap-1 text-xs"
        onClick={() => setShowFilters((v) => !v)}
        aria-expanded={showFilters}
      >
        <Filter className="h-3.5 w-3.5" />
        {t("widget.filters")}
      </Button>
    </AnalyticsToolbar>
  );

  const filters = showFilters && (
    <Div className="grid grid-cols-1 gap-3 rounded-lg border p-3 @sm:grid-cols-2 @3xl:grid-cols-4">
      <SelectFieldWidget fieldName="audience" field={children.audience} />
      <TextFieldWidget fieldName="channel" field={children.channel} />
      <SelectFieldWidget fieldName="channelType" field={children.channelType} />
      <TextFieldWidget fieldName="refCode" field={children.refCode} />
      <SelectFieldWidget fieldName="payer" field={children.payer} />
      <SelectFieldWidget fieldName="plan" field={children.plan} />
      <MultiSelectFieldWidget
        fieldName="accountState"
        field={children.accountState}
      />
    </Div>
  );
  const formAlert = (
    <Div className="min-w-0 [overflow-wrap:anywhere]">
      <FormAlertWidget field={children.formAlert} />
    </Div>
  );

  if (!value) {
    return (
      <WidgetShell className="min-w-0">
        <WidgetHeader
          title={t("title")}
          backButton={<NavigateButtonWidget field={children.backButton} />}
        />
        {toolbar}
        {filters}
        {endpointMutations?.read?.isLoading !== false ? (
          <LoadingBlock message={t("widget.loading")} />
        ) : (
          <>
            <EmptyBlock
              title={t("errors.server.title")}
              action={{
                label: t("analytics.chart.refresh"),
                onClick: () => endpointMutations?.read?.refetch?.(),
              }}
            />
            {formAlert}
          </>
        )}
      </WidgetShell>
    );
  }

  const { kpis, totals, signupTrend, activityTrend, funnel } = value;
  const bucket = value.window.bucket;
  const signupTotals: number[] = [];
  for (let i = 0; i < signupTrend.buckets.length; i++) {
    let sum = 0;
    for (const series of signupTrend.series) {
      sum += series.values[i] ?? 0;
    }
    signupTotals.push(sum);
  }
  const activeSeries =
    activityTrend.series.find((s) => s.key === "active")?.values ?? [];
  const activeWindow: ListDrill = {
    activeFrom: dayDate(value.window.from),
    activeTo: dayDate(value.window.to),
  };
  const paidWindow: ListDrill = {
    paidFrom: dayDate(value.window.from),
    paidTo: dayDate(value.window.to),
  };
  const bucketDrill = (key: string): ListDrill => ({
    signupFrom: dayDate(key < value.window.from ? value.window.from : key),
    signupTo: bucketLastDay(key, bucket, value.window.to),
  });

  const signupLabel: Record<string, string> = {
    paid: t("widget.series.paid"),
    verified: t("widget.series.verified"),
    unverified: t("widget.series.unverified"),
  };
  const activityLabel: Record<string, string> = {
    active: t("widget.series.active"),
    paying: t("widget.series.paying"),
  };

  const funnelMeta: Record<string, { label: string; drill: ListDrill }> = {
    signups: { label: t("widget.funnel.signups"), drill: signupWindow },
    verified: {
      label: t("widget.funnel.verified"),
      drill: { ...signupWindow, requiredState: AccountStateFilter.VERIFIED },
    },
    paid: {
      label: t("widget.funnel.paid"),
      drill: { ...signupWindow, payer: PayerFilter.PAID },
    },
    active: {
      label: t("widget.funnel.active"),
      drill: { ...signupWindow, hasSpentCredits: true },
    },
  };

  const kpiTiles = (
    <Div className="flex flex-col gap-2">
      {isTextPlatform ? (
        <Pre>{`${t("widget.groups.signups")} (${lt(audience)})`}</Pre>
      ) : (
        <Div className="flex flex-wrap items-baseline justify-between gap-x-2">
          <Span className="text-sm font-semibold">
            {t("widget.groups.signups")}
          </Span>
          <Span className="text-xs text-muted-foreground">{lt(audience)}</Span>
        </Div>
      )}
      <Span className="text-xs text-muted-foreground">
        {t("widget.cohortNote")}
      </Span>
      <KpiGrid columns={4}>
        <KpiTile
          label={t("widget.kpi.signups")}
          value={kpis.signups.value}
          previous={kpis.signups.previous}
          locale={locale}
          sparkline={signupTotals}
          hint={t("widget.kpi.signupsHint", { total: totals.cohortUsers })}
          onClick={() => openList(signupWindow)}
        />
        <KpiTile
          label={t("widget.kpi.verifiedRate")}
          value={kpis.signups.value > 0 ? kpis.verifiedRate.value : null}
          previous={kpis.signups.previous ? kpis.verifiedRate.previous : null}
          deltaTone="neutral"
          format="percent"
          locale={locale}
          hint={t("widget.kpi.ofSignups", {
            count: totals.verified,
            total: kpis.signups.value,
          })}
          onClick={
            totals.verified > 0
              ? (): void =>
                  openList({
                    ...signupWindow,
                    requiredState: AccountStateFilter.VERIFIED,
                  })
              : undefined
          }
        />
        <KpiTile
          label={t("widget.kpi.activatedRate")}
          value={kpis.signups.value > 0 ? kpis.activatedRate.value : null}
          previous={kpis.signups.previous ? kpis.activatedRate.previous : null}
          deltaTone="neutral"
          format="percent"
          locale={locale}
          hint={t("widget.kpi.ofSignups", {
            count: totals.activated,
            total: kpis.signups.value,
          })}
          onClick={() => openList({ ...signupWindow, hasSpentCredits: true })}
        />
        <KpiTile
          label={t("widget.kpi.paidConversion")}
          value={kpis.signups.value > 0 ? kpis.paidConversion.value : null}
          previous={kpis.signups.previous ? kpis.paidConversion.previous : null}
          deltaTone="neutral"
          format="percent"
          locale={locale}
          hint={t("widget.kpi.ofSignups", {
            count: totals.converted,
            total: kpis.signups.value,
          })}
          onClick={
            totals.converted > 0
              ? (): void =>
                  openList({ ...signupWindow, payer: PayerFilter.PAID })
              : undefined
          }
        />
      </KpiGrid>
    </Div>
  );

  const activityTiles = (
    <KpiGrid columns={4}>
      <KpiTile
        label={t("widget.kpi.activeUsers")}
        value={kpis.activeUsers.value}
        previous={kpis.activeUsers.previous}
        locale={locale}
        sparkline={activeSeries}
        hint={t("widget.kpi.activeHint")}
        onClick={() =>
          openList({ ...activeWindow, sortBy: UserListSortField.LAST_ACTIVE })
        }
      />
      <KpiTile
        label={t("widget.kpi.payingUsers")}
        value={kpis.payingUsers.value}
        previous={kpis.payingUsers.previous}
        locale={locale}
        hint={t("widget.kpi.payingHint")}
        onClick={() =>
          openList({ ...paidWindow, sortBy: UserListSortField.TOTAL_PAID })
        }
      />
      <KpiTile
        label={t("widget.kpi.revenuePeriod")}
        value={kpis.revenueUsd.value}
        previous={kpis.revenueUsd.previous}
        format="currency"
        currency="USD"
        locale={locale}
        tone="positive"
        hint={t("widget.kpi.revenueHint")}
        onClick={() =>
          openList({
            ...paidWindow,
            sortBy: UserListSortField.TOTAL_PAID,
            sortOrder: ListSortOrder.DESC,
          })
        }
      />
      <KpiTile
        label={t("widget.kpi.revenuePerPayer")}
        value={
          kpis.payingUsers.value > 0
            ? kpis.revenueUsd.value / kpis.payingUsers.value
            : null
        }
        previous={
          kpis.payingUsers.previous && kpis.revenueUsd.previous !== null
            ? kpis.revenueUsd.previous / kpis.payingUsers.previous
            : null
        }
        format="currency"
        currency="USD"
        locale={locale}
        hint={t("widget.kpi.revenuePerPayerHint")}
        onClick={() =>
          openList({
            ...paidWindow,
            sortBy: UserListSortField.TOTAL_PAID,
            sortOrder: ListSortOrder.DESC,
          })
        }
      />
    </KpiGrid>
  );

  const abuseTiles = (
    <Div className="flex flex-col gap-2">
      <Span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t("widget.groups.abuse")}
      </Span>
      <KpiGrid columns={2}>
        <KpiTile
          label={t("widget.kpi.banned")}
          value={kpis.banned.value}
          previous={kpis.banned.previous}
          locale={locale}
          invertDelta
          tone={kpis.banned.value > 0 ? "negative" : "muted"}
          hint={t("widget.kpi.bannedHint")}
          onClick={() =>
            openList({
              ...signupWindow,
              requiredState: AccountStateFilter.BANNED,
            })
          }
        />
        <KpiTile
          label={t("widget.kpi.freeBurn")}
          value={kpis.freeBurnCredits.value}
          previous={kpis.freeBurnCredits.previous}
          format="credits"
          locale={locale}
          invertDelta
          tone="warning"
          hint={t("widget.kpi.freeBurnHint", { count: totals.freeBurners })}
          onClick={() =>
            openList({
              ...activeWindow,
              payer: PayerFilter.FREE,
              sortBy: UserListSortField.CREDITS_SPENT,
              sortOrder: ListSortOrder.DESC,
            })
          }
        />
      </KpiGrid>
    </Div>
  );

  const signupChart = (
    <TimeSeriesChart
      title={t("widget.charts.signups")}
      subtitle={t("widget.charts.signupsHint")}
      buckets={signupTrend.buckets}
      bucket={bucket}
      variant="stacked-bar"
      series={signupTrend.series.map((s, i): TimeSeriesChartSeries => ({
        key: s.key,
        label: signupLabel[s.key] ?? s.key,
        values: s.values,
        color: i === 0 ? "positive" : i === 1 ? 1 : "muted",
      }))}
      locale={locale}
      onBucketClick={(key) => openList(bucketDrill(key))}
      emptyLabel={t("widget.empty")}
    />
  );

  const activityChart = (
    <TimeSeriesChart
      title={t("widget.charts.activity")}
      subtitle={t("widget.charts.activityHint")}
      buckets={activityTrend.buckets}
      bucket={bucket}
      variant="line"
      series={activityTrend.series.map((s, i): TimeSeriesChartSeries => ({
        key: s.key,
        label: activityLabel[s.key] ?? s.key,
        values: s.values,
        // Distinct accounts: the legend shows the true period total.
        total:
          s.key === "active"
            ? kpis.activeUsers.value
            : s.key === "paying"
              ? kpis.payingUsers.value
              : null,
        color: i === 0 ? 1 : "positive",
      }))}
      locale={locale}
      emptyLabel={t("widget.empty")}
    />
  );

  // Milestones as shares of the period's signups: every count matches a tile.
  const funnelChart = (
    <BreakdownTable
      title={t("widget.charts.funnel")}
      subtitle={t("widget.charts.funnelHint")}
      dimensionLabel={t("widget.columns.milestone")}
      columns={[
        { key: "count", label: t("widget.columns.accounts") },
        {
          key: "share",
          label: t("widget.columns.ofSignups"),
          format: "percent",
        },
      ]}
      showShare={false}
      rows={funnel.map((step): BreakdownTableRow => ({
        id: step.key,
        label: funnelMeta[step.key]?.label ?? step.key,
        values: {
          count: step.value,
          share:
            kpis.signups.value > 0 ? step.value / kpis.signups.value : null,
        },
        onClick:
          step.value > 0
            ? (): void => openList(funnelMeta[step.key]?.drill ?? signupWindow)
            : undefined,
      }))}
      locale={locale}
    />
  );

  const attributionColumns = [
    { key: "signups", label: t("widget.columns.signups") },
    { key: "verified", label: t("widget.columns.verified"), secondary: true },
    { key: "active", label: t("widget.columns.active"), secondary: true },
    { key: "paid", label: t("widget.columns.paid"), secondary: true },
    {
      key: "conversion",
      label: t("widget.columns.conversion"),
      format: "percent" as const,
    },
    {
      key: "revenueUsd",
      label: t("widget.columns.revenueWindow"),
      format: "currency" as const,
      currency: "USD",
    },
  ];

  const channelTable = (
    <BreakdownTable
      title={t("widget.charts.byChannel")}
      subtitle={t("widget.charts.byChannelHint")}
      dimensionLabel={t("widget.columns.channel")}
      columns={attributionColumns}
      shareKey="signups"
      rows={value.byChannel.map((row): BreakdownTableRow => ({
        id: row.key ?? USERS_CHANNEL_NONE,
        label: row.key ?? t("widget.noJourney"),
        values: row.metrics,
        onClick: () =>
          openList({ ...signupWindow, channel: row.key ?? USERS_CHANNEL_NONE }),
      }))}
      locale={locale}
      emptyLabel={t("widget.empty")}
    />
  );

  const refTable = (
    <BreakdownTable
      title={t("widget.charts.byRefCode")}
      subtitle={t("widget.charts.byRefCodeHint")}
      dimensionLabel={t("widget.columns.refCode")}
      columns={attributionColumns}
      shareKey="signups"
      rows={value.byRefCode.flatMap((row): BreakdownTableRow[] =>
        row.key
          ? [
              {
                id: row.key,
                label: row.key,
                values: row.metrics,
                onClick: () =>
                  openList({
                    ...signupWindow,
                    attributedRefCode: row.key ?? undefined,
                  }),
              },
            ]
          : [],
      )}
      locale={locale}
      emptyLabel={t("widget.noRefCodes")}
    />
  );

  const planTable = (
    <BreakdownTable
      title={t("widget.charts.byPlan")}
      subtitle={t("widget.charts.byPlanHint")}
      dimensionLabel={t("widget.columns.plan")}
      columns={[
        { key: "subscribers", label: t("widget.columns.subscribers") },
        {
          key: "revenueUsd",
          label: t("widget.columns.revenueWindow"),
          format: "currency",
          currency: "USD",
        },
      ]}
      showShare={false}
      rows={value.byPlan.map((row): BreakdownTableRow => ({
        id: row.key ?? "none",
        label:
          row.key === "__packs"
            ? t("widget.planPacks")
            : row.key === "__lapsed"
              ? t("widget.planLapsed")
              : row.key
                ? subscriptionPlanLabel(row.key, locale)
                : "-",
        values: row.metrics,
        onClick:
          row.key === "__lapsed"
            ? undefined
            : () =>
                openList({
                  ...paidWindow,
                  ...(row.key === "__packs"
                    ? { subscription: SubscriptionFilter.NEVER }
                    : {
                        subscription: SubscriptionFilter.HAS_ACTIVE,
                        plan: planFilter(row.key),
                      }),
                }),
      }))}
      locale={locale}
      emptyLabel={t("widget.noSubscribers")}
    />
  );

  const localeTable = (
    <BreakdownTable
      title={t("widget.charts.byLocale")}
      dimensionLabel={t("widget.columns.locale")}
      columns={[
        { key: "signups", label: t("widget.columns.signups") },
        { key: "paid", label: t("widget.columns.paid") },
        {
          key: "conversion",
          label: t("widget.columns.conversion"),
          format: "percent",
        },
      ]}
      shareKey="signups"
      limit={8}
      rows={value.byLocale.map((row): BreakdownTableRow => ({
        id: row.key ?? "none",
        label: row.key ? localeLabel(row.key, locale) : "-",
        values: row.metrics,
        onClick: row.key
          ? () =>
              openList({ ...signupWindow, accountLocale: row.key ?? undefined })
          : undefined,
      }))}
      locale={locale}
      emptyLabel={t("widget.empty")}
    />
  );

  const burnerTable = (
    <BreakdownTable
      title={t("widget.charts.freeBurners")}
      subtitle={t("widget.charts.freeBurnersHint")}
      dimensionLabel={t("widget.columns.account")}
      showShare={false}
      columns={[
        {
          key: "creditsSpent",
          label: t("widget.columns.creditsSpent"),
          format: "credits",
        },
        {
          key: "creditsGranted",
          label: t("widget.columns.creditsGranted"),
          format: "credits",
        },
        {
          key: "creditsSpentTotal",
          label: t("widget.columns.creditsSpentTotal"),
          format: "credits",
          secondary: true,
        },
        {
          key: "creditBalance",
          label: t("widget.columns.creditBalance"),
          format: "credits",
          secondary: true,
        },
      ]}
      rows={value.freeBurners.map((row): BreakdownTableRow => ({
        id: row.userId,
        label: row.email,
        sublabel: [
          t("widget.signedUpOn", { date: formatDay(row.signedUpAt, locale) }),
          row.isBanned ? t("widget.banned") : "",
          row.emailVerified ? "" : t("widget.unverified"),
        ]
          .filter(Boolean)
          .join(" · "),
        values: {
          creditsSpent: row.creditsSpent,
          creditsSpentTotal: row.creditsSpentTotal,
          creditBalance: row.creditBalance,
          creditsGranted: row.creditsGranted,
        },
        onClick: () => openUser(row.userId),
      }))}
      locale={locale}
      emptyLabel={t("widget.noBurners")}
    />
  );

  // CLI / MCP: data components only (they render tables / compact text).
  if (isTextPlatform) {
    return (
      <Div className="flex flex-col gap-4">
        {toolbar}
        {kpiTiles}
        <Pre>{t("widget.groups.accounts")}</Pre>
        {activityTiles}
        {abuseTiles}
        {chips.every((chip) => chip.key === "audience") && (
          <Pre>{`vibe users-list --audience=${audience} --signupFrom=${value.window.from} --signupTo=${value.window.to}`}</Pre>
        )}
        {signupChart}
        {funnelChart}
        {channelTable}
        {refTable}
        {planTable}
        {burnerTable}
      </Div>
    );
  }

  return (
    <WidgetShell className="min-w-0">
      <WidgetHeader
        title={t("title")}
        backButton={<NavigateButtonWidget field={children.backButton} />}
        actions={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => openList(signupWindow)}
            className="gap-1"
          >
            <Users className="h-4 w-4" />
            <Span className="text-xs">{t("widget.openUsers")}</Span>
          </Button>
        }
      />
      {toolbar}
      {filters}
      {formAlert}
      {kpiTiles}
      <Div className="flex flex-wrap items-start gap-2">
        {kpis.signups.value > totals.verified && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() =>
              openList({
                ...signupWindow,
                requiredState: AccountStateFilter.UNVERIFIED,
              })
            }
          >
            {t("widget.reviewUnverified", {
              count: kpis.signups.value - totals.verified,
            })}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-auto min-h-9 self-start whitespace-normal"
          aria-expanded={showAccountActivity}
          onClick={() => setShowAccountActivity((shown) => !shown)}
        >
          {t("widget.activityToggle")}
        </Button>
      </Div>
      {showAccountActivity && (
        <>
          {activityTiles}
          {activityChart}
          {planTable}
          {abuseTiles}
          {burnerTable}
        </>
      )}
      {kpis.signups.value > 0 ? (
        <>
          {signupChart}
          {channelTable}
          {refTable}
          {localeTable}
        </>
      ) : (
        <EmptyBlock
          icon={<Users className="h-8 w-8" />}
          title={t("widget.empty")}
          action={
            chips.length > 0
              ? {
                  label: t("analytics.chart.clearFilters"),
                  onClick: clearFilters,
                }
              : undefined
          }
        />
      )}
      <Span className="text-xs text-muted-foreground">
        {t("widget.definitions")}
      </Span>
    </WidgetShell>
  );
}

function planFilter(key: string | null): ListDrill["plan"] {
  switch (key) {
    case SubscriptionPlan.SUBSCRIPTION:
      return UserPlanFilter.SUBSCRIPTION;
    case SubscriptionPlan.PLUS:
      return UserPlanFilter.PLUS;
    case SubscriptionPlan.PRO:
      return UserPlanFilter.PRO;
    case SubscriptionPlan.ULTRA:
      return UserPlanFilter.ULTRA;
    default:
      return undefined;
  }
}
