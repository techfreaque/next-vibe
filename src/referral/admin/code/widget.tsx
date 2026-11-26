"use client";

import { formatDate } from "next-vibe/core/i18n/core/localization-utils";
import {
  AnalyticsToolbar,
  BreakdownTable,
  FunnelChart,
  KpiGrid,
  KpiTile,
  TimeSeriesChart,
} from "next-vibe/ui/components/analytics";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Input } from "next-vibe/ui/components/input";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { formatAnalyticsValue } from "next-vibe/unified-ui/analytics/format";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { type JSX, useState } from "react";

import { PayoutStatus } from "../../enum";
import { scopedTranslation as referralScopedTranslation } from "../../i18n";
import type definitions from "./definition";
import type { ReferralCodeReportGetResponseOutput } from "./definition";

type Report = ReferralCodeReportGetResponseOutput;
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

const FUNNEL_LABEL = {
  clicks: "get.widget.funnel.clicks",
  leads: "get.widget.funnel.leads",
  signups: "get.widget.funnel.signups",
  payers: "get.widget.funnel.payers",
} as const;

const FINAL_PAYOUT_STATUSES: ReadonlySet<string> = new Set([
  PayoutStatus.COMPLETED,
  PayoutStatus.REJECTED,
  PayoutStatus.FAILED,
]);

function isFunnelKey(key: string): key is keyof typeof FUNNEL_LABEL {
  return key in FUNNEL_LABEL;
}

function seriesValues(trend: Report["trend"], key: SeriesKey): number[] {
  return trend.series.find((s) => s.key === key)?.values ?? [];
}

export function ReferralCodeReportWidget({
  field: { children },
}: {
  field: (typeof definitions.GET)["fields"];
}): JSX.Element {
  const value = useWidgetValue<typeof definitions.GET>();
  const response = useWidgetResponse();
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
  const money = { format: "currency" as const, currency: "USD", locale };

  const code = form?.watch("code") ?? "";
  const [draft, setDraft] = useState<string | null>(null);

  function commitCode(): void {
    if (draft === null) {
      return;
    }
    const next = draft.trim();
    setDraft(null);
    if (next && next !== code) {
      form.setValue("code", next, { shouldDirty: true });
      onSubmit?.();
    }
  }

  const ratio = (num: number, den: number): string =>
    formatAnalyticsValue(den > 0 ? num / den : null, {
      format: "percent",
      locale,
    });
  const day = (iso: string): string => formatDate(new Date(iso), locale, "PP");

  function openUser(userId: string): void {
    navigate(
      () => import("@/users/view/definition").then((m) => m.default.GET),
      { data: { userId } },
    );
  }

  function openLeads(refCode: string): void {
    navigate(
      () => import("@/leads/list/definition").then((m) => m.default.GET),
      { data: { acquisitionFilters: { refCode } } },
    );
  }

  function openPayouts(filter: { userId?: string; requestId?: string }): void {
    navigate(() => import("../payouts/definition").then((m) => m.default.GET), {
      data: filter,
    });
  }

  function openBonus(target: string): void {
    navigate(
      () => import("../code-bonus/definition").then((m) => m.default.POST),
      {
        data: { code: target },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      },
    );
  }

  function openReassign(target: string): void {
    navigate(
      () => import("../code-reassign/definition").then((m) => m.default.POST),
      {
        data: { code: target },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      },
    );
  }

  const codeInput = canControl ? (
    <Input
      type="text"
      value={draft ?? code}
      placeholder={t("get.fields.code.placeholder")}
      aria-label={t("get.fields.code.label")}
      className="h-8 w-full min-w-0 @md:w-48"
      onChangeText={(text) => setDraft(text)}
      onBlur={commitCode}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          commitCode();
        }
      }}
    />
  ) : null;

  const toolbar = (
    <AnalyticsToolbar
      locale={locale}
      period={value?.window}
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
    >
      {codeInput}
    </AnalyticsToolbar>
  );

  if (!value) {
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
        {toolbar}
        <FormAlertWidget field={{}} />
        {!code ? (
          <EmptyBlock
            icon={<Search className="size-6" />}
            title={t("get.widget.pickTitle")}
            message={t("get.widget.pickCode")}
            action={
              canControl
                ? {
                    label: t("get.widget.browseCodes"),
                    onClick: () =>
                      navigate(
                        () =>
                          import("../overview/definition").then(
                            (m) => m.default.GET,
                          ),
                        { data: {} },
                      ),
                  }
                : undefined
            }
          />
        ) : response?.success === false ? null : (
          <LoadingBlock message={t("get.widget.loading")} size="sm" />
        )}
      </WidgetShell>
    );
  }

  const { header, kpis, trend, balance } = value;

  return (
    <WidgetShell layout="page" className="min-w-0">
      {canControl && (
        <WidgetHeader
          size="page"
          title={header.code}
          backButton={<NavigateButtonWidget field={children.backButton} />}
          actions={
            <Div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => openBonus(header.code)}
              >
                {t("get.widget.editBonus")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => openReassign(header.code)}
              >
                {t("get.widget.reassign")}
              </Button>
            </Div>
          }
        />
      )}
      {toolbar}
      <FormAlertWidget field={{}} />

      <Div className="rounded-lg border bg-card p-4">
        <DetailGrid columns={3}>
          <DetailField
            label={t("get.widget.owner")}
            value={
              canControl ? (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto max-w-full justify-start truncate p-0"
                  onClick={() => openUser(header.ownerUserId)}
                >
                  {header.ownerName ?? header.ownerEmail}
                </Button>
              ) : (
                (header.ownerName ?? header.ownerEmail)
              )
            }
          />
          <DetailField
            label={t("get.widget.ownerEmail")}
            value={header.ownerEmail}
            copyable
          />
          <DetailField
            label={t("get.widget.label")}
            value={header.label ?? t("get.widget.noLabel")}
          />
          <DetailField
            label={t("get.widget.status")}
            value={
              <StatusPill
                status={
                  header.isActive
                    ? t("get.widget.active")
                    : t("get.widget.inactive")
                }
                variant={header.isActive ? "success" : "default"}
              />
            }
          />
          <DetailField
            label={t("get.widget.bonus")}
            value={
              header.bonusCredits > 0
                ? t("get.widget.bonusValue", {
                    credits: header.bonusCredits,
                  })
                : t("get.widget.noBonus")
            }
          />
          <DetailField
            label={t("get.widget.uses")}
            value={String(header.currentUses)}
          />
          <DetailField
            label={t("get.widget.created")}
            value={day(header.createdAt)}
          />
        </DetailGrid>
      </Div>

      <Div className="flex min-w-0 flex-col gap-2">
        <Div className="flex flex-wrap items-center justify-between gap-2">
          <Span className="text-sm font-semibold">
            {t("get.widget.balance.title")}
          </Span>
          {canControl && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => openPayouts({ userId: header.ownerUserId })}
            >
              {t("get.widget.payouts.openAll")}
            </Button>
          )}
        </Div>
        <KpiGrid columns={4}>
          <KpiTile
            label={t("get.widget.balance.free")}
            value={balance.freeUsd}
            hint={
              balance.freeUsd < 0
                ? t("get.widget.balance.overCommitted")
                : `${t("get.widget.balance.available")}: ${formatAnalyticsValue(balance.availableUsd, money)}`
            }
            tone={
              balance.freeUsd < 0
                ? "negative"
                : balance.freeUsd < Math.max(10, balance.openPayoutUsd * 0.25)
                  ? "warning"
                  : "positive"
            }
            {...money}
          />
          <KpiTile
            label={t("get.widget.balance.open")}
            value={balance.openPayoutUsd}
            tone={balance.openPayoutUsd > 0 ? "warning" : "muted"}
            onClick={
              canControl
                ? () => openPayouts({ userId: header.ownerUserId })
                : undefined
            }
            {...money}
          />
          <KpiTile
            label={t("get.widget.balance.confirmed")}
            value={balance.confirmedUsd}
            hint={`${t("get.widget.balance.pending")}: ${formatAnalyticsValue(balance.pendingUsd, money)}`}
            {...money}
          />
          <KpiTile
            label={t("get.widget.balance.paidOut")}
            value={balance.paidOutUsd}
            {...money}
          />
        </KpiGrid>
      </Div>

      <Span className="text-sm font-semibold">
        {t("get.widget.periodTitle")}
      </Span>
      <KpiGrid columns={3}>
        <KpiTile
          label={t("get.widget.kpi.clicks")}
          value={kpis.clicks.value}
          previous={kpis.clicks.previous}
          sparkline={seriesValues(trend, "clicks")}
          locale={locale}
          onClick={canControl ? () => openLeads(header.code) : undefined}
        />
        <KpiTile
          label={t("get.widget.kpi.leads")}
          value={kpis.leads.value}
          previous={kpis.leads.previous}
          sparkline={seriesValues(trend, "leads")}
          locale={locale}
          onClick={canControl ? () => openLeads(header.code) : undefined}
        />
        <KpiTile
          label={t("get.widget.kpi.signups")}
          value={kpis.signups.value}
          previous={kpis.signups.previous}
          hint={t("get.widget.kpi.signupsHint", {
            rate: ratio(kpis.signups.value, kpis.clicks.value),
          })}
          sparkline={seriesValues(trend, "signups")}
          locale={locale}
        />
        <KpiTile
          label={t("get.widget.kpi.payers")}
          value={kpis.payers.value}
          previous={kpis.payers.previous}
          hint={t("get.widget.kpi.payersHint")}
          sparkline={seriesValues(trend, "payers")}
          locale={locale}
        />
        <KpiTile
          label={t("get.widget.kpi.revenue")}
          value={kpis.revenueUsd.value}
          previous={kpis.revenueUsd.previous}
          sparkline={seriesValues(trend, "revenue")}
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
          sparkline={seriesValues(trend, "commission")}
          {...money}
        />
      </KpiGrid>

      <Div className="grid min-w-0 gap-4 @3xl:grid-cols-2">
        <FunnelChart
          title={t("get.widget.funnel.title")}
          subtitle={t("get.widget.funnel.subtitle")}
          steps={value.funnel.map((step) => ({
            key: step.key,
            label: isFunnelKey(step.key) ? t(FUNNEL_LABEL[step.key]) : step.key,
            value: step.value,
          }))}
          locale={locale}
        />
        <TimeSeriesChart
          title={t("get.widget.chart.conversions")}
          buckets={trend.buckets}
          bucket={value.window.bucket}
          series={(["signups", "payers"] as const).map((key, index) => ({
            key,
            label: t(SERIES_LABEL[key]),
            values: seriesValues(trend, key),
            color: index === 0 ? 1 : 2,
          }))}
          variant="bar"
          locale={locale}
          height={200}
        />
      </Div>
      <TimeSeriesChart
        title={t("get.widget.chart.money")}
        subtitle={t("get.widget.chart.moneySub")}
        buckets={trend.buckets}
        bucket={value.window.bucket}
        series={(["revenue", "commission"] as const).map((key, index) => ({
          key,
          label: t(SERIES_LABEL[key]),
          values: seriesValues(trend, key),
          color: index === 0 ? 3 : 4,
        }))}
        variant="bar"
        format="currency"
        currency="USD"
        locale={locale}
        height={180}
      />

      <BreakdownTable
        title={t("get.widget.levels.title")}
        subtitle={t("get.widget.levels.subtitle")}
        dimensionLabel={t("get.widget.levels.dimension")}
        showShare={false}
        columns={[
          { key: "count", label: t("get.widget.levels.count") },
          {
            key: "totalUsd",
            label: t("get.widget.levels.total"),
            format: "currency",
          },
          {
            key: "pendingUsd",
            label: t("get.widget.levels.pending"),
            format: "currency",
          },
          {
            key: "confirmedUsd",
            label: t("get.widget.levels.confirmed"),
            format: "currency",
          },
          {
            key: "canceledUsd",
            label: t("get.widget.levels.canceled"),
            format: "currency",
          },
        ]}
        rows={value.earningsByLevel.map((row) => ({
          id: String(row.level),
          label:
            row.level === 0
              ? t("get.widget.levels.direct")
              : t("get.widget.levels.upline", { level: row.level }),
          values: {
            count: row.count,
            totalUsd: row.pendingUsd + row.confirmedUsd,
            pendingUsd: row.pendingUsd,
            confirmedUsd: row.confirmedUsd,
            canceledUsd: row.canceledUsd,
          },
        }))}
        emptyLabel={t("get.widget.levels.empty")}
        locale={locale}
      />

      <BreakdownTable
        title={t("get.widget.users.title")}
        subtitle={t("get.widget.users.subtitle", {
          shown: value.referredUsers.length,
          total: value.referredTotal,
        })}
        dimensionLabel={t("get.widget.users.dimension")}
        showShare={false}
        limit={15}
        columns={[
          { key: "payments", label: t("get.widget.users.payments") },
          {
            key: "revenueUsd",
            label: t("get.widget.users.revenue"),
            format: "currency",
          },
          {
            key: "commissionUsd",
            label: t("get.widget.users.commission"),
            format: "currency",
            secondary: true,
          },
        ]}
        rows={value.referredUsers.map((row) => ({
          id: row.userId,
          label: row.email.split("@")[0] ?? row.email,
          sublabel:
            row.payments > 0
              ? `${row.email} · ${t("get.widget.users.signedUp", { date: day(row.signedUpAt) })}`
              : `${row.email} · ${t("get.widget.users.signedUp", { date: day(row.signedUpAt) })} · ${t("get.widget.users.unpaid")}`,
          values: {
            payments: row.payments,
            revenueUsd: row.revenueUsd,
            commissionUsd: row.commissionUsd,
          },
          onClick: canControl ? () => openUser(row.userId) : undefined,
        }))}
        emptyLabel={t("get.widget.users.empty")}
        locale={locale}
      />

      <BreakdownTable
        title={t("get.widget.payouts.title")}
        subtitle={t("get.widget.payouts.subtitle")}
        dimensionLabel={t("get.widget.payouts.dimension")}
        showShare={false}
        columns={[
          {
            key: "amountUsd",
            label: t("get.widget.payouts.amount"),
            format: "currency",
          },
        ]}
        rows={value.payouts.map((row) => ({
          id: row.id,
          label: `${tReferral(row.status)} · ${tReferral(row.currency)}`,
          sublabel:
            row.processedAt && FINAL_PAYOUT_STATUSES.has(row.status)
              ? t("get.widget.payouts.processed", {
                  date: day(row.processedAt),
                })
              : t("get.widget.payouts.requested", {
                  date: day(row.createdAt),
                }),
          values: { amountUsd: row.amountUsd },
          onClick: canControl
            ? () => openPayouts({ requestId: row.id })
            : undefined,
        }))}
        emptyLabel={t("get.widget.payouts.empty")}
        locale={locale}
        actions={
          canControl ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => openPayouts({ userId: header.ownerUserId })}
            >
              {t("get.widget.payouts.openAll")}
            </Button>
          ) : undefined
        }
      />
    </WidgetShell>
  );
}
