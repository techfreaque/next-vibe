"use client";

import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import {
  AnalyticsSegmented,
  KpiGrid,
  KpiTile,
} from "next-vibe/ui/components/analytics";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { Building } from "next-vibe/ui/components/icons/Building";
import { Receipt } from "next-vibe/ui/components/icons/Receipt";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
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
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
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
import type { JSX } from "react";

import {
  ReportCompanyPicker,
  ReportMenu,
} from "@/chart-of-accounts/reports/balance-sheet/report-controls";
import { formatAccountingDateInput } from "@/chart-of-accounts/shared/calendar-date";
import { ReportRangeControl } from "@/finance/report-period-control";

import type definition from "./definition";
import type { TaxReportResponseOutput } from "./definition";
import { TaxReportDirection, TaxReportDirectionDB } from "./enum";

const SALES_SIDE: readonly string[] = [
  TaxReportDirection.SALES,
  TaxReportDirection.POS_SALES,
  TaxReportDirection.CREDIT_NOTES,
];

function sumWhere(
  totals: TaxReportResponseOutput["totals"] | undefined,
  matches: (direction: string) => boolean,
): { base: number; tax: number } {
  return (totals ?? [])
    .filter((row) => matches(row.direction))
    .reduce(
      (sum, row) => ({
        base: sum.base + row.taxableAmount,
        tax: sum.tax + row.taxAmount,
      }),
      { base: 0, tax: 0 },
    );
}

export function TaxReportWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const response = useWidgetResponse();
  const onSubmit = useWidgetOnSubmit();
  const form = useWidgetForm<typeof definition.GET>();
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const read = useWidgetEndpointMutations()?.read;
  const showInputs = interactive && !responseOnly;
  const companyId = form.watch("companyId");
  const currency = form.watch("currency");
  const from = formatAccountingDateInput(form.watch("dateFrom"));
  const to = formatAccountingDateInput(form.watch("dateTo"));
  const hasCompany = Boolean(companyId || data?.reportCompanyId);
  const needsCompany = showInputs && !hasCompany;
  const matches =
    !!data?.reportCurrency &&
    (!showInputs ||
      ((!companyId || data.reportCompanyId === companyId) &&
        (!currency || data.reportCurrency === currency) &&
        (!from || data.reportDateFrom === from) &&
        (!to || data.reportDateTo === to)));
  const loading = !!read?.isLoadingFresh || !!read?.isFetching;
  const accessDenied =
    response?.success === false && response.errorType.errorCode === 403;

  const formatLocale = locale.replace(/-GLOBAL$/, "");
  const money = (amount: number): string =>
    formatMoney(amount, data?.reportCurrency, formatLocale);
  const rate = new Intl.NumberFormat(formatLocale, {
    style: "percent",
    maximumFractionDigits: 4,
  });
  const date = new Intl.DateTimeFormat(formatLocale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  const applyRange = (range: { from: Date; to: Date }): void => {
    form.setValue("dateFrom", range.from, { shouldDirty: true });
    form.setValue("dateTo", range.to, { shouldDirty: true });
  };
  const retry = (): void => {
    if (read) {
      void read.refetch();
      return;
    }
    onSubmit?.();
  };

  const subtitle =
    data?.reportDateFrom && data.reportDateTo && hasCompany
      ? t("report.widget.subtitle", {
          company: data.reportCompanyName,
          from: date.format(new Date(data.reportDateFrom)),
          to: date.format(new Date(data.reportDateTo)),
        })
      : t("report.description");

  const sales = sumWhere(data?.totals, (d) => SALES_SIDE.includes(d));
  const purchases = sumWhere(
    data?.totals,
    (d) => d === TaxReportDirection.PURCHASES,
  );
  const hasRows = !!data?.rows?.length;

  const groups = TaxReportDirectionDB.flatMap((direction) => {
    const rows = data?.rows?.filter((row) => row.direction === direction);
    const total = data?.totals?.find((row) => row.direction === direction);
    return rows?.length ? [{ direction, rows, total }] : [];
  });

  const results = data ? (
    <Div
      className={
        matches ? "flex flex-col gap-4" : "flex flex-col gap-4 opacity-60"
      }
      aria-busy={!matches}
    >
      {hasRows ? (
        <>
          <KpiGrid columns={4}>
            <KpiTile
              locale={locale}
              format="currency"
              currency={data.reportCurrency}
              label={t("report.widget.kpi.salesTax")}
              value={sales.tax}
              tone={sales.tax === 0 ? "muted" : "default"}
            />
            <KpiTile
              locale={locale}
              format="currency"
              currency={data.reportCurrency}
              label={t("report.widget.kpi.salesBase")}
              value={sales.base}
              tone={sales.base === 0 ? "muted" : "default"}
            />
            <KpiTile
              locale={locale}
              format="currency"
              currency={data.reportCurrency}
              label={t("report.widget.kpi.purchaseTax")}
              value={purchases.tax}
              tone={purchases.tax === 0 ? "muted" : "default"}
            />
            <KpiTile
              locale={locale}
              format="currency"
              currency={data.reportCurrency}
              label={t("report.widget.kpi.purchaseBase")}
              value={purchases.base}
              tone={purchases.base === 0 ? "muted" : "default"}
            />
          </KpiGrid>
          <Div className="overflow-x-auto rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("report.response.row.rate")}</TableHead>
                  <TableHead className="text-right whitespace-nowrap">
                    {t("report.response.row.taxableAmount")}
                  </TableHead>
                  <TableHead className="text-right whitespace-nowrap">
                    {t("report.response.row.taxAmount")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map(({ direction, rows, total }) => [
                  <TableRow
                    key={`${direction}-head`}
                    className="border-t hover:bg-transparent"
                  >
                    <TableCell
                      colSpan={3}
                      className="pt-5 pb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {t(direction)}
                    </TableCell>
                  </TableRow>,
                  ...rows.map((row) => (
                    <TableRow key={`${direction}-${row.rate ?? "unknown"}`}>
                      <TableCell className="ps-6 tabular-nums">
                        {row.rate === null
                          ? t("report.widget.unknownRate")
                          : rate.format(row.rate)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums whitespace-nowrap">
                        {money(row.taxableAmount)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums whitespace-nowrap">
                        {money(row.taxAmount)}
                      </TableCell>
                    </TableRow>
                  )),
                  total ? (
                    <TableRow
                      key={`${direction}-total`}
                      className="border-t font-semibold hover:bg-transparent"
                    >
                      <TableCell className="ps-6">
                        {t("report.widget.total")}
                      </TableCell>
                      <TableCell className="text-right tabular-nums whitespace-nowrap">
                        {money(total.taxableAmount)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums whitespace-nowrap">
                        {money(total.taxAmount)}
                      </TableCell>
                    </TableRow>
                  ) : null,
                ])}
              </TableBody>
            </Table>
          </Div>
        </>
      ) : (
        <Div className="rounded-lg border bg-card">
          <EmptyBlock
            size="page"
            icon={<Receipt className="h-6 w-6" />}
            title={t("report.widget.emptyTitle")}
            message={t("report.widget.empty")}
          />
        </Div>
      )}
      <P className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
        {t("report.widget.scope")}
      </P>
    </Div>
  ) : null;

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("report.title")}
        subtitle={subtitle}
        actions={
          showInputs && (
            <ReportMenu
              current="taxRates"
              companyId={companyId || data?.reportCompanyId}
            />
          )
        }
      />
      {showInputs && (
        <Div className="flex flex-col gap-3">
          <Div className="flex flex-wrap items-center gap-2">
            <ReportCompanyPicker
              selectedId={companyId}
              reportId={data?.reportCompanyId}
              reportName={data?.reportCompanyName}
              onChange={(id) =>
                form.setValue("companyId", id, { shouldDirty: true })
              }
            />
            {!needsCompany && (
              <ReportRangeControl
                fromLabel={t("report.dateFrom.label")}
                toLabel={t("report.dateTo.label")}
                from={from ?? data?.reportDateFrom}
                to={to ?? data?.reportDateTo}
                onChange={applyRange}
              />
            )}
            <Div className={needsCompany ? "hidden" : "ms-auto"}>
              <AnalyticsSegmented
                label={t("report.currency.label")}
                value={currency ?? data?.reportCurrency ?? ""}
                onSelect={(next): void => {
                  const code = CurrenciesArr.find((value) => value === next);
                  if (code) {
                    form.setValue("currency", code, { shouldDirty: true });
                  }
                }}
                options={CurrenciesArr.map((value) => ({
                  value,
                  label: t(`report.currencies.${value}`),
                }))}
              />
            </Div>
          </Div>
        </Div>
      )}
      {needsCompany ? (
        <Div className="rounded-lg border border-dashed bg-card">
          <EmptyBlock
            size="page"
            icon={<Building className="h-6 w-6" />}
            title={t("report.widget.selectCompany")}
            message={t("report.widget.scopeHint")}
          />
        </Div>
      ) : response?.success === false && !loading ? (
        <Div className="rounded-lg border bg-card">
          <EmptyBlock
            size="page"
            icon={<AlertCircle className="h-6 w-6" />}
            title={t(
              accessDenied
                ? "report.errors.forbidden.title"
                : "report.widget.errorTitle",
            )}
            message={
              accessDenied
                ? t("report.errors.forbidden.description")
                : response.message
            }
            action={
              !accessDenied && showInputs && (read || onSubmit)
                ? { label: t("report.widget.retry"), onClick: retry }
                : undefined
            }
          />
        </Div>
      ) : data?.reportCurrency ? (
        results
      ) : (
        <Div
          className="flex flex-col gap-4"
          aria-live="polite"
          aria-busy="true"
          aria-label={t("report.widget.running")}
        >
          <Div className="grid grid-cols-2 gap-3 @3xl:grid-cols-4">
            {[0, 1, 2, 3].map((key) => (
              <Skeleton key={key} className="h-[88px] w-full rounded-lg" />
            ))}
          </Div>
          <Div className="flex flex-col gap-2 rounded-lg border bg-card p-4">
            <Skeleton className="h-4 w-32" />
            {[0, 1, 2, 3, 4].map((key) => (
              <Div key={key} className="flex items-center gap-4">
                <Skeleton className="h-5 w-16" />
                <Span className="flex-1" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
              </Div>
            ))}
          </Div>
        </Div>
      )}
    </WidgetShell>
  );
}
