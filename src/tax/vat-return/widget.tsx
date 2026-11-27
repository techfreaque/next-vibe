"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { Building } from "next-vibe/ui/components/icons/Building";
import { Pre } from "next-vibe/ui/components/pre";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
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
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { type JSX, useState } from "react";

import { DocumentTextExportButton } from "@/finance/document-text-export";

import type definition from "./definition";
import { recentVatPeriods } from "./period";

function useMoney(locale: string, currency: string): (value: number) => string {
  const format = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency || "EUR",
  });
  return (value: number) => format.format(value);
}

export function VatReturnWidget({
  field,
}: {
  field: typeof definition.GET.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const result = useWidgetValue<typeof definition.GET>();
  const interactive = useWidgetIsInteractive();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.GET>();
  const read = useWidgetEndpointMutations()?.read;
  const response = useWidgetResponse();
  const companyId = form.watch("companyId");
  const period = form.watch("period");
  const [periods] = useState(() => recentVatPeriods(new Date()));
  const [showXml, setShowXml] = useState(false);

  const prepared =
    result?.returnCompanyId &&
    (!companyId || result.returnCompanyId === companyId)
      ? result
      : undefined;
  const money = useMoney(locale, prepared?.currency ?? "EUR");
  const monthName = new Intl.DateTimeFormat(locale, { month: "long" });

  const periodLabel = (value: string): string => {
    const [year, part] = value.split("-");
    if (!year || !part) {
      return value;
    }
    if (part.startsWith("Q")) {
      return t("period.quarter", { quarter: part.slice(1), year });
    }
    return t("period.month", {
      month: monthName.format(
        new Date(Date.UTC(Number(year), Number(part) - 1, 15)),
      ),
      year,
    });
  };

  const formatKey = prepared?.filingFormat ?? "GENERIC_VAT";
  const hasBaseColumn =
    prepared?.lines.some((line) => line.base !== undefined) ?? false;
  const visibleLines = (prepared?.lines ?? []).filter(
    (line) =>
      line.amount !== 0 ||
      (line.base !== undefined && line.base !== 0) ||
      line.isTotal === true,
  );
  const allZero =
    (prepared?.lines ?? []).every(
      (line) => line.amount === 0 && (line.base ?? 0) === 0,
    ) ?? true;
  const hasXmlExport = Boolean(prepared?.kvXml && prepared?.kvFileName);

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("title")}
        subtitle={t("description")}
      />
      {interactive && (
        <Div className="grid gap-3 @xl:grid-cols-2">
          {!companyId && (
            <EntityPickerFieldWidget
              fieldName="companyId"
              field={withValue(field.children.companyId, undefined, null)}
            />
          )}
          <Div className="flex flex-col gap-1.5">
            <Span className="text-sm font-medium">{t("period.label")}</Span>
            <Select
              value={period}
              onValueChange={(value: string) =>
                form.setValue("period", value, { shouldDirty: true })
              }
            >
              <SelectTrigger className="w-full @xl:w-64">
                <SelectValue>{period ? periodLabel(period) : null}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {periods.map((value) => (
                  <SelectItem key={value} value={value}>
                    {periodLabel(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Div>
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {!prepared && interactive && !companyId ? (
        <Div className="rounded-lg border border-dashed bg-card">
          <EmptyBlock
            size="page"
            icon={<Building className="h-6 w-6" />}
            title={t("pickCompany")}
          />
        </Div>
      ) : prepared ? (
        <Div
          className={
            read?.isFetching
              ? "flex flex-col gap-4 opacity-60"
              : "flex flex-col gap-4"
          }
        >
          <Div className="flex flex-wrap items-baseline justify-between gap-2">
            <Span className="text-sm font-medium">
              {t("summary", {
                company: prepared.returnCompanyName,
                from: formatDocDate(prepared.periodFrom, locale),
                to: formatDocDate(prepared.periodTo, locale),
              })}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t(`dueByFormat.${formatKey}`)}
            </Span>
          </Div>

          {prepared.smallBusinessExempt && (
            <ResultBanner
              variant="info"
              title={t("smallBusiness.title")}
              message={t(`smallBusiness.body.${formatKey}`)}
            />
          )}

          {prepared.warnings.map((warning) => (
            <Div
              key={warning.code}
              className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/5 p-3"
            >
              <AlertTriangle
                className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
                aria-hidden
              />
              <P className="text-sm">
                {t(warning.code, { count: warning.count ?? 0 })}
              </P>
            </Div>
          ))}

          <Div className="rounded-lg border bg-card">
            <Div className="flex flex-wrap items-center justify-between gap-2 border-b p-3">
              <Span className="text-sm font-semibold">
                {t(`formats.${formatKey}`)}
              </Span>
              <DocumentTextExportButton
                filename={prepared.exportCsvFileName}
                content={prepared.exportCsv}
                mimeType="text/csv"
                downloadLabel={t("actions.downloadCsv")}
                copyLabel={t("actions.copy")}
                copiedLabel={t("actions.copied")}
                copyErrorLabel={t("actions.copyError")}
              />
            </Div>
            {allZero ? (
              <P className="p-4 text-sm text-muted-foreground">{t("empty")}</P>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">{t("lines.line")}</TableHead>
                    <TableHead>{t("lines.meaning")}</TableHead>
                    {hasBaseColumn && (
                      <TableHead className="text-right">
                        {t("lines.base")}
                      </TableHead>
                    )}
                    <TableHead className="text-right">
                      {t("lines.amount")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleLines.map((line) => {
                    const total = Boolean(line.isTotal);
                    return (
                      <TableRow key={`${line.line}-${line.label ?? ""}`}>
                        <TableCell className="font-mono text-xs whitespace-nowrap">
                          {formatKey === "SK_DPH" && line.line.startsWith("r")
                            ? line.line.slice(1)
                            : line.line}
                        </TableCell>
                        <TableCell
                          className={total ? "font-semibold" : undefined}
                        >
                          {line.label ?? line.line}
                        </TableCell>
                        {hasBaseColumn && (
                          <TableCell className="text-right tabular-nums">
                            {line.base !== undefined ? money(line.base) : ""}
                          </TableCell>
                        )}
                        <TableCell
                          className={
                            total
                              ? "text-right font-semibold tabular-nums"
                              : "text-right tabular-nums"
                          }
                        >
                          {money(line.amount)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Div>

          {hasXmlExport && (
            <Div className="rounded-lg border bg-card">
              <Div className="flex flex-wrap items-center justify-between gap-2 border-b p-3">
                <Span className="text-sm font-semibold">
                  {t(`xmlSection.${formatKey}`)}
                </Span>
                <Div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowXml((open) => !open)}
                  >
                    {showXml ? t("actions.hideXml") : t("actions.showXml")}
                  </Button>
                  <DocumentTextExportButton
                    filename={prepared.kvFileName}
                    content={prepared.kvXml}
                    mimeType="application/xml"
                    downloadLabel={t("actions.downloadXml")}
                    copyLabel={t("actions.copy")}
                    copiedLabel={t("actions.copied")}
                    copyErrorLabel={t("actions.copyError")}
                  />
                </Div>
              </Div>
              {prepared.sections.length > 0 ? (
                <Div className="grid gap-x-6 gap-y-1 p-3 @md:grid-cols-2">
                  {prepared.sections.map((section) => (
                    <Div
                      key={section.section}
                      className="flex items-center justify-between gap-3 py-1 text-sm"
                    >
                      <Span
                        className={
                          section.count === 0
                            ? "text-muted-foreground"
                            : undefined
                        }
                      >
                        {t(`sections.${section.section}`)}
                      </Span>
                      <Span className="tabular-nums">{section.count}</Span>
                    </Div>
                  ))}
                </Div>
              ) : (
                <P className="p-3 text-sm text-muted-foreground">
                  {t(`xmlNote.${formatKey}`)}
                </P>
              )}
              {showXml && (
                <Pre className="max-h-96 overflow-auto border-t p-3 text-xs">
                  {prepared.kvXml}
                </Pre>
              )}
            </Div>
          )}

          <P className="text-xs text-muted-foreground">{t("disclaimer")}</P>
        </Div>
      ) : response?.success === false ? null : (
        <Skeleton className="h-64 w-full rounded-lg" />
      )}
    </WidgetShell>
  );
}
