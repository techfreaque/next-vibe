"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { Building } from "next-vibe/ui/components/icons/Building";
import { Pre } from "next-vibe/ui/components/pre";
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

function useMoney(locale: string): (value: number) => string {
  const format = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
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
  const money = useMoney(locale);
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

  const prepared =
    result?.returnCompanyId &&
    (!companyId || result.returnCompanyId === companyId)
      ? result
      : undefined;
  const csv = prepared
    ? [
        "line;meaning;amount",
        ...prepared.lines.map(
          (line) =>
            `${line.line};"${t(`lines.${line.line}`)}";${line.amount.toFixed(2)}`,
        ),
      ].join("\n")
    : "";
  const allZero = prepared?.lines.every((line) => line.amount === 0) ?? true;

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
            <Span className="text-xs text-muted-foreground">{t("due")}</Span>
          </Div>

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
              <Span className="text-sm font-semibold">{t("lines.title")}</Span>
              <DocumentTextExportButton
                filename={`DPH_${prepared.returnPeriod}.csv`}
                content={csv}
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
                    <TableHead className="w-16">{t("lines.line")}</TableHead>
                    <TableHead>{t("lines.meaning")}</TableHead>
                    <TableHead className="text-right">
                      {t("lines.amount")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prepared.lines
                    .filter(
                      (line) =>
                        line.amount !== 0 ||
                        line.line === "r32" ||
                        line.line === "r33",
                    )
                    .map((line) => {
                      const total =
                        line.line === "r17" ||
                        line.line === "r32" ||
                        line.line === "r33";
                      return (
                        <TableRow key={line.line}>
                          <TableCell className="font-mono text-xs">
                            {line.line.slice(1)}
                          </TableCell>
                          <TableCell
                            className={total ? "font-semibold" : undefined}
                          >
                            {t(`lines.${line.line}`)}
                          </TableCell>
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

          <Div className="rounded-lg border bg-card">
            <Div className="flex flex-wrap items-center justify-between gap-2 border-b p-3">
              <Span className="text-sm font-semibold">
                {t("sections.title")}
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
                  downloadLabel={t("actions.downloadKv")}
                  copyLabel={t("actions.copy")}
                  copiedLabel={t("actions.copied")}
                  copyErrorLabel={t("actions.copyError")}
                />
              </Div>
            </Div>
            <Div className="grid gap-x-6 gap-y-1 p-3 @md:grid-cols-2">
              {prepared.sections.map((section) => (
                <Div
                  key={section.section}
                  className="flex items-center justify-between gap-3 py-1 text-sm"
                >
                  <Span
                    className={
                      section.count === 0 ? "text-muted-foreground" : undefined
                    }
                  >
                    {t(`sections.${section.section}`)}
                  </Span>
                  <Span className="tabular-nums">{section.count}</Span>
                </Div>
              ))}
            </Div>
            {showXml && (
              <Pre className="max-h-96 overflow-auto border-t p-3 text-xs">
                {prepared.kvXml}
              </Pre>
            )}
          </Div>
          <P className="text-xs text-muted-foreground">{t("disclaimer")}</P>
        </Div>
      ) : response?.success === false ? null : (
        <Skeleton className="h-64 w-full rounded-lg" />
      )}
    </WidgetShell>
  );
}
