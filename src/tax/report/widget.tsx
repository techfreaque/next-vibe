"use client";

import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
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
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useState } from "react";

import { formatAccountingDateInput } from "@/chart-of-accounts/shared/calendar-date";
import { DocumentScopePicker } from "@/finance/document-list-ui";

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
  const [datePickerRevision, setDatePickerRevision] = useState(0);
  const showInputs = interactive && !responseOnly;
  const companyId = form.watch("companyId");
  const currency = form.watch("currency");
  const from = formatAccountingDateInput(form.watch("dateFrom"));
  const to = formatAccountingDateInput(form.watch("dateTo"));
  const ready =
    response?.success !== false &&
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
    setDatePickerRevision((revision) => revision + 1);
    onSubmit?.();
  };

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("report.title")}
        actions={
          showInputs && (
            <SubmitButtonWidget<typeof definition.GET>
              field={{
                text: "report.widget.run",
                loadingText: "report.widget.running",
                size: "sm",
              }}
            />
          )
        }
      />
      {showInputs && (
        <Div className="grid items-end gap-3 @sm:grid-cols-2 @lg:grid-cols-4">
          <Div className="flex flex-col gap-1.5">
            <Span className="text-sm font-medium">
              {t("report.companyId.label")}
            </Span>
            <DocumentScopePicker
              kind="company"
              required
              value={companyId ?? data?.reportCompanyId}
              appliedLabel={
                !companyId || companyId === data?.reportCompanyId
                  ? data?.reportCompanyName
                  : undefined
              }
              onSelect={(id) =>
                form.setValue("companyId", id, { shouldDirty: true })
              }
            />
          </Div>
          <SelectFieldWidget fieldName="currency" field={children.currency} />
          <DateFieldWidget
            utcCalendarDay
            key={`from-${datePickerRevision}`}
            fieldName="dateFrom"
            field={children.dateFrom}
          />
          <DateFieldWidget
            utcCalendarDay
            key={`to-${datePickerRevision}`}
            fieldName="dateTo"
            field={children.dateTo}
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />
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
          <Span className="text-sm text-muted-foreground">
            {t("report.widget.scope")}
          </Span>
        </>
      ) : (
        showInputs &&
        response?.success !== false &&
        !companyId && <EmptyBlock title={t("report.widget.selectCompany")} />
      )}
    </WidgetShell>
  );
}
