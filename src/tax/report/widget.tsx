"use client";

import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
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
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import type { JSX } from "react";

import {
  ReportCompanyPicker,
  ReportDateFilter,
  ReportMenu,
  ReportPeriodMenu,
} from "@/chart-of-accounts/reports/balance-sheet/report-controls";
import { formatAccountingDateInput } from "@/chart-of-accounts/shared/calendar-date";

import type definition from "./definition";
import { TaxReportDirectionDB } from "./enum";

export function TaxReportWidget({
  field: { children },
}: {
  field: typeof definition.GET.fields;
}): JSX.Element {
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
  const needsCompany = showInputs && !companyId;
  const failed = response?.success === false;
  const ready =
    !needsCompany &&
    !failed &&
    data?.reportCurrency &&
    (!showInputs ||
      ((!companyId || data.reportCompanyId === companyId) &&
        (!currency || data.reportCurrency === currency) &&
        (!from || data.reportDateFrom === from) &&
        (!to || data.reportDateTo === to)));

  const formatLocale = locale.replace(/-GLOBAL$/, "");
  const money = (amount: number): string =>
    formatMoney(amount, data?.reportCurrency, formatLocale);
  const rate = new Intl.NumberFormat(formatLocale, {
    style: "percent",
    maximumFractionDigits: 4,
  });
  const date = new Intl.DateTimeFormat(formatLocale, {
    dateStyle: "medium",
    timeZone: "UTC",
  });

  const showPreviousMonth = (): void => {
    const reference = data?.reportDateFrom
      ? new Date(data.reportDateFrom)
      : new Date();
    const year = reference.getUTCFullYear();
    const month = reference.getUTCMonth();
    form.setValue("dateFrom", new Date(Date.UTC(year, month - 1, 1)), {
      shouldDirty: true,
    });
    form.setValue("dateTo", new Date(Date.UTC(year, month, 0)), {
      shouldDirty: true,
    });
  };

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("report.title")}
        subtitle={t("report.description")}
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
        <Div className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-3">
          <ReportCompanyPicker
            label={t("report.companyId.label")}
            selectedId={companyId}
            reportId={data?.reportCompanyId}
            reportName={data?.reportCompanyName}
            onChange={(id) =>
              form.setValue("companyId", id, { shouldDirty: true })
            }
          />
          <Div className="w-36 max-w-full">
            <SelectFieldWidget
              fieldName="currency"
              field={{ ...children.currency, description: undefined }}
            />
          </Div>
          <ReportDateFilter
            id="tax-report-start"
            label={t("report.dateFrom.label")}
            day={from ?? data?.reportDateFrom}
            onChange={(value) =>
              form.setValue("dateFrom", value, { shouldDirty: true })
            }
          />
          <ReportDateFilter
            id="tax-report-end"
            label={t("report.dateTo.label")}
            day={to ?? data?.reportDateTo}
            onChange={(value) =>
              form.setValue("dateTo", value, { shouldDirty: true })
            }
          />
          <ReportPeriodMenu
            onChange={({ from: start, to: end }) => {
              form.setValue("dateFrom", start, { shouldDirty: true });
              form.setValue("dateTo", end, { shouldDirty: true });
            }}
          />
        </Div>
      )}
      {needsCompany && (
        <EmptyBlock
          size="page"
          title={t("report.widget.selectCompany")}
          message={t("report.widget.scopeHint")}
        />
      )}
      {!needsCompany && failed && (
        <EmptyBlock
          title={response.message}
          action={
            showInputs && (read || onSubmit)
              ? {
                  label: t("report.widget.retry"),
                  onClick: () => {
                    if (read) {
                      void read.refetch();
                    } else {
                      onSubmit?.();
                    }
                  },
                }
              : undefined
          }
        />
      )}
      {!needsCompany && !failed && read?.isLoadingFresh && !ready && (
        <Div
          className="space-y-3"
          aria-live="polite"
          aria-label={t("report.widget.running")}
        >
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </Div>
      )}
      {ready && data ? (
        <>
          {data.reportDateFrom && data.reportDateTo && (
            <Div className="flex flex-wrap items-baseline justify-between gap-2">
              <Div className="flex items-baseline gap-2">
                {!showInputs && (
                  <Span className="text-sm font-medium">
                    {data.reportCompanyName}
                  </Span>
                )}
                <Span className="text-sm font-medium">
                  {data.reportCurrency}
                </Span>
              </Div>
              <Span className="text-sm text-muted-foreground">
                {t("report.widget.range", {
                  from: date.format(new Date(data.reportDateFrom)),
                  to: date.format(new Date(data.reportDateTo)),
                })}
              </Span>
            </Div>
          )}
          {data.rows?.length ? (
            TaxReportDirectionDB.map((direction) => {
              const rows = data.rows?.filter(
                (row) => row.direction === direction,
              );
              const total = data.totals?.find(
                (row) => row.direction === direction,
              );
              return rows?.length ? (
                <SectionGroup key={direction} title={t(direction)}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("report.response.row.rate")}</TableHead>
                        <TableHead className="text-right">
                          {t("report.response.row.taxableAmount")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("report.response.row.taxAmount")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.rate ?? "unknown"}>
                          <TableCell>
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
                      ))}
                    </TableBody>
                    {total && (
                      <TableFooter>
                        <TableRow>
                          <TableCell>{t("report.widget.total")}</TableCell>
                          <TableCell className="text-right tabular-nums whitespace-nowrap">
                            {money(total.taxableAmount)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums whitespace-nowrap">
                            {money(total.taxAmount)}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    )}
                  </Table>
                </SectionGroup>
              ) : null;
            })
          ) : (
            <EmptyBlock
              title={t("report.widget.empty")}
              action={
                showInputs
                  ? {
                      label: t("report.widget.previousMonth"),
                      onClick: showPreviousMonth,
                      variant: "outline",
                    }
                  : undefined
              }
            />
          )}
          {!!data.rows?.length && (
            <Span className="text-xs text-muted-foreground">
              {t("report.widget.scope")}
            </Span>
          )}
        </>
      ) : null}
    </WidgetShell>
  );
}
