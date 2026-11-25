"use client";

import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import { formatAccountingDateInput } from "../../shared/calendar-date";
import {
  reportAmountClass,
  ReportCompanyPicker,
  ReportDateFilter,
  ReportMenu,
  ReportPeriodMenu,
} from "../balance-sheet/report-controls";
import type definition from "./definition";
import type { TaxReportResponseOutput } from "./definition";

interface TaxReportWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type TaxLine = NonNullable<TaxReportResponseOutput["lines"]>[number];

function TaxLineRow({
  line,
  formatAmount,
}: {
  line: TaxLine;
  formatAmount: (value: number) => string;
}): JSX.Element {
  return (
    <Div className="grid grid-cols-[2.5rem_minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] @lg:grid-cols-[6rem_minmax(0,1fr)_8rem_8rem_6rem] gap-2 px-3 py-1.5 border-b last:border-b-0 text-sm hover:bg-muted/20">
      <Span className="font-mono text-xs text-muted-foreground">
        {line.taxRateCode}
      </Span>
      <Span className="truncate">{line.taxRateName}</Span>
      <Span
        className={`break-words text-right text-xs @lg:text-sm ${reportAmountClass(line.netAmount)}`}
      >
        {formatAmount(line.netAmount)}
      </Span>
      <Span
        className={`break-words text-right text-xs @lg:text-sm ${reportAmountClass(line.taxAmount)}`}
      >
        {formatAmount(line.taxAmount)}
      </Span>
      <Span className="text-right font-mono text-muted-foreground">
        {(line.rate * 100).toFixed(1)}%
      </Span>
    </Div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TaxReportWidget({
  field: { children },
}: TaxReportWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const locale = useWidgetLocale();
  const response = useWidgetResponse();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const showInputs = interactive && !responseOnly;
  const companyId = form.watch("companyId");
  const requestedCurrency = form.watch("currency")?.trim().toUpperCase();
  const from = formatAccountingDateInput(form.watch("from"));
  const to = formatAccountingDateInput(form.watch("to"));
  const ready =
    response?.success !== false &&
    (!showInputs ||
      ((!companyId || data?.reportCompanyId === companyId) &&
        (!from || from === formatAccountingDateInput(data?.fromResponse)) &&
        (!to || to === formatAccountingDateInput(data?.toResponse)) &&
        (!requestedCurrency || data?.reportCurrency === requestedCurrency)));
  const formatAmount = (value: number): string =>
    formatMoney(value, data?.reportCurrency, locale);

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("taxReport.title")}
        subtitle={t("taxReport.description")}
        actions={
          interactive && (
            <ReportMenu
              current="taxReport"
              companyId={companyId || data?.reportCompanyId}
            />
          )
        }
      />
      {showInputs && (
        <Div className="flex flex-wrap items-end gap-2 rounded-md border bg-card p-3">
          <ReportCompanyPicker
            selectedId={companyId}
            reportId={data?.reportCompanyId}
            reportName={data?.reportCompanyName}
            onChange={(id) =>
              form.setValue("companyId", id, { shouldDirty: true })
            }
          />
          <Div className="w-40">
            <TextFieldWidget
              fieldName="currency"
              field={{
                ...children.currency,
                description: undefined,
                placeholder: "reports.widget.autoCurrency",
              }}
            />
          </Div>
          <ReportDateFilter
            id="report-from"
            label={t("taxReport.from.label")}
            day={from ?? formatAccountingDateInput(data?.fromResponse)}
            onChange={(date) =>
              form.setValue("from", date, { shouldDirty: true })
            }
          />
          <ReportDateFilter
            id="report-to"
            label={t("taxReport.to.label")}
            day={to ?? formatAccountingDateInput(data?.toResponse)}
            onChange={(date) =>
              form.setValue("to", date, { shouldDirty: true })
            }
          />
          <ReportPeriodMenu
            onChange={({ from: start, to: end }) => {
              form.setValue("from", start, { shouldDirty: true });
              form.setValue("to", end, { shouldDirty: true });
            }}
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {ready && data?.reportCurrency && (
        <Span className="text-sm font-medium">
          {t("reports.currency")} {data.reportCurrency}
        </Span>
      )}
      {ready && data?.vatCollected !== undefined ? (
        <Div className="flex flex-col gap-4">
          {data.fromResponse && data.toResponse && (
            <Span className="text-sm text-muted-foreground">
              {`${t("taxReport.widget.dateRange")} · ${formatDocDate(data.fromResponse, locale)} – ${formatDocDate(data.toResponse, locale)}`}
            </Span>
          )}

          <Div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Div className="rounded-md border p-3 flex flex-col gap-1">
              <Span className="text-xs text-muted-foreground">
                {t("taxReport.response.vatCollected")}
              </Span>
              <Span
                className={`text-lg font-semibold ${reportAmountClass(data.vatCollected)}`}
              >
                {formatAmount(data.vatCollected)}
              </Span>
            </Div>
            <Div className="rounded-md border p-3 flex flex-col gap-1">
              <Span className="text-xs text-muted-foreground">
                {t("taxReport.response.vatReclaimable")}
              </Span>
              <Span
                className={`text-lg font-semibold ${reportAmountClass(data.vatReclaimable)}`}
              >
                {formatAmount(data.vatReclaimable)}
              </Span>
            </Div>
            <Div className="rounded-md border p-3 flex flex-col gap-1">
              <Span className="text-xs text-muted-foreground">
                {t("taxReport.response.netVatPayable")}
              </Span>
              <Span
                className={`text-lg font-semibold ${reportAmountClass(data.netVatPayable ?? 0)}`}
              >
                {formatAmount(data.netVatPayable ?? 0)}
              </Span>
            </Div>
          </Div>

          {data.lines && data.lines.length > 0 && (
            <Div className="rounded-md border overflow-hidden">
              <Div className="px-3 py-2 bg-muted/50 border-b text-xs font-semibold text-muted-foreground">
                {t("taxReport.widget.detailSection")}
              </Div>
              <Div className="grid grid-cols-[2.5rem_minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] @lg:grid-cols-[6rem_minmax(0,1fr)_8rem_8rem_6rem] gap-2 px-3 py-1.5 border-b text-xs font-medium text-muted-foreground bg-muted/30">
                <Span>{t("taxReport.response.taxRateCode")}</Span>
                <Span>{t("taxReport.response.taxRateName")}</Span>
                <Span className="text-right">
                  {t("taxReport.response.netAmount")}
                </Span>
                <Span className="text-right">
                  {t("taxReport.response.taxAmount")}
                </Span>
                <Span className="text-right">
                  {t("taxReport.response.rate")}
                </Span>
              </Div>
              {data.lines.map((line) => (
                <TaxLineRow
                  key={line.taxRateCode}
                  line={line}
                  formatAmount={formatAmount}
                />
              ))}
            </Div>
          )}
        </Div>
      ) : response?.success === false ? null : (
        <Div className="text-center py-10 text-sm text-muted-foreground border border-dashed rounded-md">
          {companyId || data?.reportCompanyId
            ? t("reports.widget.running")
            : t("taxReport.widget.selectCompany")}
        </Div>
      )}
    </WidgetShell>
  );
}
