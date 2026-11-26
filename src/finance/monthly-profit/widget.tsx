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
  formatMoney,
  formatQuantity,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { scopedTranslation as chartTranslation } from "@/chart-of-accounts/i18n";

import { costProviderLabel } from "../cost-providers";
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
  const interactive = useWidgetIsInteractive();
  const report = data?.report;

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
          <TextFieldWidget fieldName="month" field={field.children.month} />
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
              {new Intl.DateTimeFormat(locale, {
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
                />
                <AccountRows
                  title={t("profit.expenses")}
                  rows={row.expenseAccounts}
                  currency={row.currency}
                  month={report.month}
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
}: {
  title: string;
  rows: MonthlyProfitResponse["report"]["currencies"][number]["revenueAccounts"];
  currency: string;
  month: string;
}): JSX.Element {
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.GET>();
  const { t: tChart } = chartTranslation.scopedT(locale);
  const { push } = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();

  const drill = (accountId: string): void => {
    const dateFrom = new Date(`${month}-01T00:00:00.000Z`);
    const dateTo = new Date(dateFrom);
    dateTo.setUTCMonth(dateTo.getUTCMonth() + 1, 0);
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
