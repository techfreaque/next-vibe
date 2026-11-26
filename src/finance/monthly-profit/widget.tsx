"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { H3, P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
  formatQuantity,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useState } from "react";

import { scopedTranslation as chartTranslation } from "@/chart-of-accounts/i18n";

import { costProviderLabel } from "../cost-providers";
import {
  monthRange,
  type ReportDateRange,
  reportDay,
  reportMonth,
} from "../report-period";
import { MonthPicker, ReportRangeControl } from "../report-period-control";
import { evidenceMonth } from "../supplier-evidence/rules";
import type definition from "./definition";
import type { MonthlyProfitResponse } from "./definition";

export function MonthlyProfitWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.GET>();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const report = data?.report;

  const monthResult = evidenceMonth.safeParse(form.watch("month"));
  const month = monthResult.success ? monthResult.data : undefined;
  const from = form.watch("from");
  const to = form.watch("to");
  const [currentMonth] = useState(() => reportMonth(new Date()));
  const bounds =
    month && month !== currentMonth ? monthRange(month) : undefined;
  const selectedFrom = from ?? (bounds ? reportDay(bounds.start) : undefined);
  const selectedTo =
    to ??
    (bounds
      ? reportDay(new Date(bounds.end.getTime() - 86_400_000))
      : undefined);
  const selectRange = (range: ReportDateRange): void => {
    form.setValue("month", undefined, { shouldDirty: true });
    form.setValue("from", reportDay(range.from), { shouldDirty: true });
    form.setValue("to", reportDay(range.to), { shouldDirty: true });
    onSubmit?.();
  };

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        title={t("profit.title")}
        subtitle={t("profit.description")}
        size="page"
      />
      {interactive && (
        <Div className="flex flex-wrap items-end gap-3">
          <EntityPickerFieldWidget
            fieldName="companyId"
            field={field.children.companyId}
          />
          <ReportRangeControl
            from={selectedFrom}
            to={selectedTo}
            fromLabel={t("profit.periodFrom")}
            toLabel={t("profit.periodTo")}
            onChange={selectRange}
            customControl={
              <MonthPicker
                month={month ?? from?.slice(0, 7)}
                label={t("suppliers.month")}
                onChange={(value) => {
                  const { start, end } = monthRange(value);
                  selectRange({
                    from: start,
                    to: new Date(end.getTime() - 86_400_000),
                  });
                }}
              />
            }
          />
          <SubmitButtonWidget<typeof definition.GET>
            field={{ text: "profit.run" }}
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {report && (
        <>
          <Div className="flex flex-wrap justify-between gap-2">
            <H3>{report.companyName}</H3>
            <P className="text-sm text-muted-foreground">
              {report.periodFrom && report.periodTo
                ? `${formatDocDate(report.periodFrom, locale)} – ${formatDocDate(report.periodTo, locale)}`
                : new Intl.DateTimeFormat(locale.replace(/-GLOBAL$/u, ""), {
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(`${report.month}-01T00:00:00.000Z`))}
            </P>
          </Div>
          {report.currencies.length === 0 && <P>{t("profit.empty")}</P>}
          {report.currencies.map((row) => (
            <SectionGroup key={row.currency} title={row.currency}>
              <MetricGrid columns={3}>
                <MetricCard
                  label={t("profit.revenue")}
                  value={formatMoney(row.revenue, row.currency, locale)}
                />
                <MetricCard
                  label={t("profit.expenses")}
                  value={formatMoney(row.expenses, row.currency, locale)}
                />
                <MetricCard
                  className="col-span-full @lg:col-span-1"
                  label={t("profit.net")}
                  value={formatMoney(row.net, row.currency, locale)}
                />
              </MetricGrid>
              <P className="text-sm text-muted-foreground">
                {t("profit.unallocatedRevenue", {
                  amount: formatMoney(row.revenue, row.currency, locale),
                })}
              </P>
              {row.expenseAreas.length > 0 && (
                <Div className="max-w-xl space-y-2">
                  <H3 className="text-base font-medium">{t("profit.areas")}</H3>
                  {row.expenseAreas.some(
                    ({ expense }) => Number(expense) < 0,
                  ) && (
                    <P className="text-sm text-muted-foreground">
                      {t("profit.signedExpenseAreas")}
                    </P>
                  )}
                  <Div className="divide-y rounded-lg border">
                    {row.expenseAreas.map(({ area, expense }) => (
                      <Div
                        key={area}
                        className="flex items-baseline justify-between gap-4 px-3 py-2 text-sm"
                      >
                        <P>{t(`suppliers.area.${area}`)}</P>
                        <P className="shrink-0 tabular-nums">
                          {formatMoney(expense, row.currency, locale)}
                        </P>
                      </Div>
                    ))}
                  </Div>
                </Div>
              )}
              <Div className="grid grid-cols-1 gap-4 @3xl:grid-cols-2">
                <AccountRows
                  title={t("profit.revenue")}
                  rows={row.revenueAccounts}
                  currency={row.currency}
                  month={report.month}
                  from={report.periodFrom}
                  to={report.periodTo}
                />
                <AccountRows
                  title={t("profit.expenses")}
                  rows={row.expenseAccounts}
                  currency={row.currency}
                  month={report.month}
                  from={report.periodFrom}
                  to={report.periodTo}
                />
              </Div>
            </SectionGroup>
          ))}
          <SectionGroup title={t("suppliers.estimates")}>
            <P className="text-sm text-muted-foreground">
              {t("profit.estimatesHint")}
            </P>
            {report.estimates.length === 0 && (
              <P>{t("profit.estimatesEmpty")}</P>
            )}
            {report.estimates.map((row) => (
              <Div
                key={JSON.stringify([row.provider, row.modelId])}
                className="grid grid-cols-1 gap-2 border-t py-3 sm:grid-cols-2"
              >
                <Div className="min-w-0">
                  <P className="font-medium break-words">
                    {row.modelId ?? t("profit.unknownModel")}
                  </P>
                  <P className="text-sm text-muted-foreground">
                    {costProviderLabel(row.provider)}
                  </P>
                  <P className="text-sm tabular-nums">
                    {t("profit.estimatedCosts", {
                      amount: formatMoney(row.estimatedUsd, "USD", locale),
                    })}
                  </P>
                  <P className="text-sm tabular-nums">
                    {t("profit.usageValue", {
                      amount: formatMoney(row.paidUsageValueUsd, "USD", locale),
                    })}
                  </P>
                  {row.marginUsd !== null ? (
                    <P className="text-sm font-medium tabular-nums">
                      {t("profit.estimatedMargin", {
                        amount: formatMoney(row.marginUsd, "USD", locale),
                      })}
                    </P>
                  ) : (
                    <P className="text-sm text-muted-foreground">
                      {t("profit.marginUnknown")}
                    </P>
                  )}
                </Div>
                <Div className="text-sm">
                  <P>
                    {t("profit.paid", {
                      amount: formatMoney(row.paidUsd, "USD", locale),
                    })}
                  </P>
                  <P>
                    {t("profit.free", {
                      amount: formatMoney(row.freeUsd, "USD", locale),
                    })}
                  </P>
                  <P>
                    {t("profit.gifted", {
                      amount: formatMoney(row.giftedUsd, "USD", locale),
                    })}
                  </P>
                  {row.unknownUsd > 0 && (
                    <P>
                      {t("profit.unknownFunding", {
                        amount: formatMoney(row.unknownUsd, "USD", locale),
                      })}
                    </P>
                  )}
                  {row.missingPaidPriceCredits > 0 && (
                    <P className="text-muted-foreground">
                      {t("profit.missingPrice", {
                        credits: formatQuantity(
                          row.missingPaidPriceCredits,
                          locale,
                        ),
                      })}
                    </P>
                  )}
                  {row.missingExactCredits > 0 && (
                    <P className="text-muted-foreground">
                      {t("profit.missing", {
                        credits: formatQuantity(
                          row.missingExactCredits,
                          locale,
                        ),
                      })}
                    </P>
                  )}
                </Div>
              </Div>
            ))}
          </SectionGroup>
        </>
      )}
    </WidgetShell>
  );
}

function AccountRows({
  title,
  rows,
  currency,
  month,
  from,
  to,
}: {
  title: string;
  rows: MonthlyProfitResponse["report"]["currencies"][number]["revenueAccounts"];
  currency: string;
  month: string;
  from?: string;
  to?: string;
}): JSX.Element {
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.GET>();
  const { t: tChart } = chartTranslation.scopedT(locale);
  const { push } = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();

  const drill = (accountId: string): void => {
    const dateFrom = new Date(from ?? `${month}-01`);
    const dateTo = to
      ? new Date(to)
      : new Date(
          Date.UTC(dateFrom.getUTCFullYear(), dateFrom.getUTCMonth() + 1, 0),
        );
    void import("@/chart-of-accounts/ledger/[accountId]/definition").then(
      ({ default: routes }) => {
        return push(routes.GET, {
          urlPathParams: { accountId },
          data: { dateFrom, dateTo },
        });
      },
    );
  };

  return (
    <Div className="min-w-0">
      <P className="mb-1 font-medium">{title}</P>
      {rows.length === 0 && (
        <P className="text-sm text-muted-foreground">
          {t("profit.noAccounts")}
        </P>
      )}
      {rows.map(({ id, code, name, subtype, amount }) => (
        <Div
          key={id}
          className="flex flex-wrap items-center justify-between gap-2 border-t py-2"
        >
          <Div className="min-w-0">
            <P className="text-sm break-words">
              {code} {name}
            </P>
            <P className="text-xs text-muted-foreground">{tChart(subtype)}</P>
          </Div>
          <P className="tabular-nums">
            {formatMoney(amount, currency, locale)}
          </P>
          {interactive && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => drill(id)}
            >
              {t("profit.openLedger")}
            </Button>
          )}
        </Div>
      ))}
    </Div>
  );
}
