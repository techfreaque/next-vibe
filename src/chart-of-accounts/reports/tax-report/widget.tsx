"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "next-vibe/ui/components/accordion";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { H2 } from "next-vibe/ui/components/typography";
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

import { ReportRangeControl } from "@/finance/report-period-control";

import { formatAccountingDateInput } from "../../shared/calendar-date";
import {
  ReportCompanyPicker,
  ReportMenu,
  ReportReadState,
} from "../balance-sheet/report-controls";
import { reportAmountClass } from "../report-amount-class";
import type definition from "./definition";
import type { TaxReportResponseOutput } from "./definition";

interface TaxReportWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type TaxLine = NonNullable<TaxReportResponseOutput["lines"]>[number];

function TaxLineRow({
  line,
  direction,
  formatAmount,
}: {
  line: TaxLine;
  direction: string;
  formatAmount: (value: number) => string;
}): JSX.Element {
  return (
    <Div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b px-3 py-2 last:border-b-0">
      <Div className="flex min-w-0 flex-col gap-0.5">
        <Span className="break-words text-sm">
          {line.taxRateCode} {line.taxRateName}
        </Span>
        <Span className="text-xs text-muted-foreground">{direction}</Span>
      </Div>
      <Span
        className={`text-right text-sm ${reportAmountClass(line.taxAmount)}`}
      >
        {formatAmount(line.taxAmount)}
      </Span>
    </Div>
  );
}

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
  const hasCompany = Boolean(companyId || data?.reportCompanyId);
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
        <ReportCompanyPicker
          selectedId={companyId}
          reportId={data?.reportCompanyId}
          reportName={data?.reportCompanyName}
          onChange={(id) => {
            form.setValue("companyId", id, { shouldDirty: true });
          }}
        />
      )}
      {showInputs && hasCompany && (
        <Accordion collapsible className="rounded-md border bg-card px-3">
          <AccordionItem value="filters" className="border-0">
            <AccordionTrigger className="min-h-10 py-2 text-sm">
              {t("taxReport.widget.filters")}
            </AccordionTrigger>
            <AccordionContent>
              <Div className="flex flex-wrap items-end gap-2">
                <Div className="w-32">
                  <TextFieldWidget
                    fieldName="currency"
                    field={{
                      ...children.currency,
                      description: undefined,
                      placeholder: "reports.widget.autoCurrency",
                    }}
                  />
                </Div>
                <ReportRangeControl
                  fromLabel={t("taxReport.from.label")}
                  toLabel={t("taxReport.to.label")}
                  from={from ?? formatAccountingDateInput(data?.fromResponse)}
                  to={to ?? formatAccountingDateInput(data?.toResponse)}
                  defaultPreset="yearToDate"
                  onChange={({ from: start, to: end }) => {
                    form.setValue("from", start, { shouldDirty: true });
                    form.setValue("to", end, { shouldDirty: true });
                  }}
                />
              </Div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      {hasCompany && response?.success !== false && (
        <FormAlertWidget field={{}} />
      )}
      {ready && data?.vatCollected !== undefined ? (
        <Div className="flex flex-col gap-4">
          <Div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
            <Span className="break-words text-sm font-medium">
              {data.reportCompanyName}
            </Span>
            <Div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground">
              {data.fromResponse && data.toResponse && (
                <Span>
                  {t("taxReport.widget.window", {
                    from: formatDocDate(data.fromResponse, locale),
                    to: formatDocDate(data.toResponse, locale),
                  })}
                </Span>
              )}
              {data.reportCurrency && (
                <Span>
                  {t("reports.currency")} {data.reportCurrency}
                </Span>
              )}
            </Div>
            <Div className="flex flex-col gap-1">
              <H2 className="text-sm font-medium text-muted-foreground">
                {t("taxReport.response.netVatPayable")}
              </H2>
              <Span
                className={`text-2xl font-semibold ${reportAmountClass(data.netVatPayable ?? 0)}`}
              >
                {formatAmount(data.netVatPayable ?? 0)}
              </Span>
            </Div>
            <Div className="grid max-w-xl grid-cols-2 gap-4 border-t pt-3">
              <Div className="flex min-w-0 flex-col justify-between gap-1">
                <Span className="text-xs text-muted-foreground">
                  {t("taxReport.response.vatCollected")}
                </Span>
                <Span
                  className={`font-medium ${reportAmountClass(data.vatCollected)}`}
                >
                  {formatAmount(data.vatCollected)}
                </Span>
              </Div>
              <Div className="flex min-w-0 flex-col justify-between gap-1">
                <Span className="text-xs text-muted-foreground">
                  {t("taxReport.response.vatReclaimable")}
                </Span>
                <Span
                  className={`font-medium ${reportAmountClass(data.vatReclaimable)}`}
                >
                  {formatAmount(data.vatReclaimable)}
                </Span>
              </Div>
            </Div>
          </Div>

          {data.lines?.length ? (
            <Div className="max-w-4xl overflow-hidden rounded-md border">
              <H2 className="border-b bg-muted/50 px-3 py-2 text-sm font-semibold">
                {t("taxReport.widget.detailSection")}
              </H2>
              {data.lines.map((line) => (
                <TaxLineRow
                  key={line.accountId}
                  line={line}
                  direction={t(
                    line.direction === "output"
                      ? "taxReport.response.vatCollected"
                      : "taxReport.response.vatReclaimable",
                  )}
                  formatAmount={formatAmount}
                />
              ))}
            </Div>
          ) : (
            <Span className="text-sm text-muted-foreground">
              {t("taxReport.widget.noData")}
            </Span>
          )}
        </Div>
      ) : (
        <ReportReadState
          hasCompany={hasCompany}
          companyPrompt={t("taxReport.widget.selectCompany")}
          companyHint={t("taxReport.widget.scopeHint")}
        />
      )}
    </WidgetShell>
  );
}
