"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "next-vibe/ui/components/alert";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Span } from "next-vibe/ui/components/span";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
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
import { type JSX, useMemo } from "react";

import { DocumentTextExportButton } from "@/finance/document-text-export";
import { ReportRangeControl } from "@/finance/report-period-control";

import { formatAccountingDateInput } from "../../shared/calendar-date";
import {
  ReportCompanyPicker,
  ReportReadState,
} from "../balance-sheet/report-controls";
import { encodeJournalCsv } from "../journal-export/csv";
import { reportAmountClass } from "../report-amount-class";
import type definition from "./definition";
import type { StatutoryStatementsResponseOutput } from "./definition";

type StatementLine = StatutoryStatementsResponseOutput["balanceSheet"][number];

interface StatutoryStatementsWidgetProps {
  field: (typeof definition.GET)["fields"];
}

const ROW_CLASS: Record<StatementLine["kind"], string> = {
  total: "bg-muted/50 font-semibold",
  group: "font-medium",
  item: "",
};

function StatementTable({
  title,
  lines,
  formatAmount,
  showOfficial,
  labels,
  startRow,
  endRow,
}: {
  title: string;
  lines: StatementLine[];
  formatAmount: (value: number) => string;
  showOfficial: boolean;
  labels: { row: string; item: string; current: string; previous: string };
  startRow?: number;
  endRow?: number;
}): JSX.Element {
  const visible = lines.filter(
    (line) =>
      (startRow === undefined || line.row >= startRow) &&
      (endRow === undefined || line.row <= endRow),
  );
  return (
    <Div className="overflow-hidden rounded-md border">
      <Div className="border-b bg-muted/50 px-4 py-2 text-xs font-semibold text-muted-foreground">
        {title}
      </Div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-left">{labels.row}</TableHead>
            <TableHead className="text-left">{labels.item}</TableHead>
            <TableHead className="w-32 text-right">{labels.current}</TableHead>
            <TableHead className="w-32 text-right">{labels.previous}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((line) => (
            <TableRow key={line.id} className={ROW_CLASS[line.kind]}>
              <TableCell className="align-top font-mono text-xs text-muted-foreground tabular-nums">
                {String(line.row).padStart(2, "0")}
              </TableCell>
              <TableCell
                className={`min-w-0 whitespace-normal text-left [overflow-wrap:anywhere] ${
                  line.kind === "item" ? "pl-6" : ""
                }`}
              >
                <Span>
                  {line.marker && (
                    <Span className="mr-1.5 text-muted-foreground">
                      {line.marker}
                    </Span>
                  )}
                  {line.label}
                </Span>
                {showOfficial && (
                  <Span className="block text-xs font-normal text-muted-foreground">
                    {line.officialLabel}
                  </Span>
                )}
              </TableCell>
              <TableCell
                className={`align-top text-right tabular-nums ${reportAmountClass(line.current)}`}
              >
                {formatAmount(line.current)}
              </TableCell>
              <TableCell
                className={`align-top text-right tabular-nums ${reportAmountClass(line.previous)}`}
              >
                {formatAmount(line.previous)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Div>
  );
}

export function StatutoryStatementsWidget({
  field: { children },
}: StatutoryStatementsWidgetProps): JSX.Element {
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
    data?.available !== undefined &&
    (!showInputs ||
      ((!companyId || data.reportCompanyId === companyId) &&
        (!from || from === formatAccountingDateInput(data.fromResponse)) &&
        (!to || to === formatAccountingDateInput(data.toResponse)) &&
        (!requestedCurrency || data.reportCurrency === requestedCurrency)));
  const report = ready && data ? data : undefined;
  const formatAmount = (value: number): string =>
    formatMoney(value, data?.reportCurrency, locale);
  const showOfficial = !locale.startsWith("sk");

  const csv = useMemo(() => {
    if (!report?.available) {
      return null;
    }
    const currency = report.reportCurrency;
    const statements = [
      { title: t("response.balanceSheet"), lines: report.balanceSheet },
      { title: t("response.profitLoss"), lines: report.profitLoss },
    ];
    return encodeJournalCsv(
      [
        t("csv.statement"),
        t("csv.row"),
        t("csv.marker"),
        t("csv.label"),
        t("csv.officialLabel"),
        t("csv.currency"),
        t("csv.current"),
        t("csv.previous"),
      ],
      statements.flatMap(({ title, lines }) =>
        lines.map((line) => [
          { value: title },
          { value: String(line.row), numeric: true },
          { value: line.marker },
          { value: line.label },
          { value: line.officialLabel },
          { value: currency },
          { value: line.current.toFixed(2), numeric: true },
          { value: line.previous.toFixed(2), numeric: true },
        ]),
      ),
    );
  }, [report, t]);

  const tableLabels = {
    row: t("response.row"),
    item: t("response.label"),
    current: t("response.current"),
    previous: t("response.previous"),
  };
  const unmapped = data?.unmapped ?? [];

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("title")}
        subtitle={t("description")}
        actions={
          report?.available && csv ? (
            <DocumentTextExportButton
              filename={`statutory-statements-${formatAccountingDateInput(report.toResponse) ?? "report"}.csv`}
              content={csv}
              mimeType="text/csv;charset=utf-8"
              downloadLabel={t("widget.download")}
              copyLabel={t("widget.copy")}
              copiedLabel={t("widget.copied")}
              copyErrorLabel={t("widget.copyFailed")}
            />
          ) : undefined
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
              }}
            />
          </Div>
          <ReportRangeControl
            fromLabel={t("from.label")}
            toLabel={t("to.label")}
            from={from ?? formatAccountingDateInput(data?.fromResponse)}
            to={to ?? formatAccountingDateInput(data?.toResponse)}
            defaultPreset="lastYear"
            onChange={({ from: start, to: end }) => {
              form.setValue("from", start, { shouldDirty: true });
              form.setValue("to", end, { shouldDirty: true });
            }}
          />
        </Div>
      )}
      {hasCompany && response?.success !== false && (
        <FormAlertWidget field={{}} />
      )}
      {report && !report.available && (
        <EmptyBlock
          size="page"
          className="rounded-md border border-dashed"
          title={t("widget.notAvailableTitle")}
          message={t("widget.notAvailableMessage")}
        />
      )}
      {report?.available ? (
        <Div className="flex flex-col gap-4">
          <Div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <Span className="font-medium text-foreground">
              {`${report.reportCompanyName} · ${
                report.layout === "DE_HGB"
                  ? "HGB (§ 266 / § 275)"
                  : report.layout === "AT_UGB"
                    ? "UGB (§ 224 / § 231)"
                    : report.layout === "IFRS"
                      ? "IFRS (IAS 1)"
                      : t("widget.layoutSkMuj")
              } · ${report.reportCurrency}`}
            </Span>
            <Span>
              {t("widget.periods", {
                current: t("widget.range", {
                  from: formatDocDate(report.fromResponse, locale),
                  to: formatDocDate(report.toResponse, locale),
                }),
                previous: t("widget.range", {
                  from: formatDocDate(report.previousFromResponse, locale),
                  to: formatDocDate(report.previousToResponse, locale),
                }),
              })}
            </Span>
          </Div>

          <Alert variant={report.isBalanced ? "success" : "destructive"}>
            <AlertDescription>
              {report.isBalanced
                ? t("widget.balanced")
                : t("widget.notBalanced", {
                    amount: formatAmount(
                      Math.abs(report.difference) >= 0.005
                        ? report.difference
                        : report.previousDifference,
                    ),
                  })}
            </AlertDescription>
          </Alert>

          {unmapped.length > 0 && (
            <Alert variant="warning">
              <AlertTitle>
                {t("widget.unmappedTitle", { count: unmapped.length })}
              </AlertTitle>
              <AlertDescription>
                <Span className="block">{t("widget.unmappedDescription")}</Span>
                <Div className="mt-2 flex flex-col gap-1">
                  {unmapped.map((account) => (
                    <Div
                      key={`${account.statement}-${account.code}`}
                      className="flex flex-wrap items-baseline gap-2 text-sm"
                    >
                      <Span className="font-mono text-xs text-muted-foreground">
                        {account.code}
                      </Span>
                      <Span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                        {account.name}
                      </Span>
                      <Span className="text-xs text-muted-foreground">
                        {t(
                          account.statement === "balanceSheet"
                            ? "response.balanceSheet"
                            : "response.profitLoss",
                        )}
                      </Span>
                      <Span className="tabular-nums">
                        {formatAmount(account.current)}
                      </Span>
                    </Div>
                  ))}
                </Div>
              </AlertDescription>
            </Alert>
          )}

          <Div className="flex flex-col gap-2">
            <Span className="text-base font-semibold">
              {t("response.balanceSheet")}
            </Span>
            <StatementTable
              title={t("widget.assets")}
              lines={report.balanceSheet}
              formatAmount={formatAmount}
              showOfficial={showOfficial}
              labels={tableLabels}
              endRow={23}
            />
            <StatementTable
              title={t("widget.liabilities")}
              lines={report.balanceSheet}
              formatAmount={formatAmount}
              showOfficial={showOfficial}
              labels={tableLabels}
              startRow={24}
            />
          </Div>

          <Div className="flex flex-col gap-2">
            <Span className="text-base font-semibold">
              {t("response.profitLoss")}
            </Span>
            <StatementTable
              title={t("response.profitLoss")}
              lines={report.profitLoss}
              formatAmount={formatAmount}
              showOfficial={showOfficial}
              labels={tableLabels}
            />
          </Div>

          <Span className="text-xs text-muted-foreground">
            {t("widget.disclaimer")}
          </Span>
        </Div>
      ) : (
        !report && (
          <ReportReadState
            hasCompany={hasCompany}
            companyPrompt={t("widget.selectCompany")}
          />
        )
      )}
    </WidgetShell>
  );
}
