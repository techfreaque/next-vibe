"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
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
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import { formatAccountingDateInput } from "../../shared/calendar-date";
import type definition from "./definition";
import type { BalanceSheetResponseOutput } from "./definition";
import {
  reportAmountClass,
  ReportCompanyPicker,
  ReportDateFilter,
  ReportMenu,
  ReportPeriodMenu,
} from "./report-controls";

interface BalanceSheetWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type BalanceSheetItem = NonNullable<
  BalanceSheetResponseOutput["assets"]
>[number];

function AccountLine({
  formatAmount,
  item,
  subtypeLabel,
  onDrill,
}: {
  formatAmount: (value: number) => string;
  item: BalanceSheetItem;
  subtypeLabel: string;
  onDrill: (accountId: string) => () => void;
}): JSX.Element {
  return (
    <Div className="flex items-center gap-2 px-3 py-1.5 border-b last:border-b-0 text-sm hover:bg-muted/20">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onDrill(item.accountId)}
        className="text-left hover:underline cursor-pointer font-mono text-xs text-muted-foreground w-16 shrink-0 h-auto p-0"
      >
        {item.code ?? item.accountId}
      </Button>
      <Span className="flex-1 truncate">{item.name}</Span>
      <Span className="text-xs text-muted-foreground hidden sm:block">
        {subtypeLabel}
      </Span>
      <Span
        className={`shrink-0 text-right ${reportAmountClass(item.balance)}`}
      >
        {formatAmount(item.balance)}
      </Span>
    </Div>
  );
}

function Section({
  formatAmount,
  title,
  items,
  extraLine,
  total,
  totalLabel,
  noEntriesLabel,
  getSubtypeLabel,
  onDrill,
}: {
  formatAmount: (value: number) => string;
  title: string;
  items: BalanceSheetItem[];
  extraLine?: { label: string; amount: number };
  total: number;
  totalLabel: string;
  noEntriesLabel: string;
  getSubtypeLabel: (subtype: string) => string;
  onDrill: (accountId: string) => () => void;
}): JSX.Element {
  return (
    <Div className="rounded-md border overflow-hidden flex-1">
      <Div className="px-3 py-2 bg-muted/50 border-b text-xs font-semibold text-muted-foreground">
        {title}
      </Div>
      {items.length > 0 || extraLine ? (
        items.map((item) => (
          <AccountLine
            formatAmount={formatAmount}
            key={item.code}
            item={item}
            subtypeLabel={getSubtypeLabel(item.subtype)}
            onDrill={onDrill}
          />
        ))
      ) : (
        <Div className="px-3 py-3 text-sm text-muted-foreground italic">
          {noEntriesLabel}
        </Div>
      )}
      {extraLine && (
        <Div className="flex items-center justify-between gap-2 border-b px-3 py-2 text-sm">
          <Span>{extraLine.label}</Span>
          <Span className={reportAmountClass(extraLine.amount)}>
            {formatAmount(extraLine.amount)}
          </Span>
        </Div>
      )}
      <Div className="flex items-center justify-between px-3 py-2 border-t bg-muted/30 text-sm font-semibold">
        <Span>{totalLabel}</Span>
        <Span className={reportAmountClass(total)}>{formatAmount(total)}</Span>
      </Div>
    </Div>
  );
}

export function BalanceSheetWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { field: { children } }: BalanceSheetWidgetProps,
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const form = useWidgetForm<typeof definition.GET>();
  const locale = useWidgetLocale();
  const response = useWidgetResponse();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const showInputs = interactive && !responseOnly;
  const companyId = form.watch("companyId");
  const requestedCurrency = form.watch("currency")?.trim().toUpperCase();
  const asOf = formatAccountingDateInput(form.watch("asOfDate"));
  const ready =
    response?.success !== false &&
    (!showInputs ||
      ((!companyId || data?.reportCompanyId === companyId) &&
        (!asOf || asOf === formatAccountingDateInput(data?.asOfDateResponse)) &&
        (!requestedCurrency || data?.reportCurrency === requestedCurrency)));
  const formatAmount = (value: number): string =>
    formatMoney(value, data?.reportCurrency, locale);

  const handleAccountDrill = (accountId: string): (() => void) => {
    return (): void => {
      void (async (): Promise<void> => {
        const def =
          await import("@/chart-of-accounts/ledger/[accountId]/definition");
        navigation.push(def.default.GET, {
          urlPathParams: { accountId },
        });
      })();
    };
  };

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("balanceSheet.title")}
        subtitle={t("balanceSheet.description")}
        actions={
          interactive && (
            <ReportMenu
              current="balanceSheet"
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
            id="report-as-of"
            label={t("balanceSheet.asOfDate.label")}
            day={asOf ?? formatAccountingDateInput(data?.asOfDateResponse)}
            onChange={(date) =>
              form.setValue("asOfDate", date, { shouldDirty: true })
            }
          />
          <ReportPeriodMenu
            onChange={({ to: end }) =>
              form.setValue("asOfDate", end, { shouldDirty: true })
            }
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {ready && data?.reportCurrency && (
        <Span className="text-sm font-medium">
          {t("reports.currency")} {data.reportCurrency}
        </Span>
      )}
      {ready && data?.assets !== undefined ? (
        <Div className="flex flex-col gap-4">
          {data.asOfDateResponse && (
            <Div className="flex items-center justify-between">
              <Span className="text-sm text-muted-foreground">
                {t("balanceSheet.widget.asOf")}{" "}
                {formatDocDate(data.asOfDateResponse, locale)}
              </Span>
              {data.isBalanced !== undefined && (
                <Badge
                  variant={data.isBalanced ? "default" : "destructive"}
                  className="text-xs"
                >
                  {data.isBalanced
                    ? t("balanceSheet.widget.balanced")
                    : t("balanceSheet.widget.unbalanced")}
                </Badge>
              )}
            </Div>
          )}

          <Div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Section
              formatAmount={formatAmount}
              title={t("balanceSheet.response.assets")}
              items={data.assets}
              total={data.totalAssets ?? 0}
              totalLabel={t("balanceSheet.response.totalAssets")}
              noEntriesLabel={t("balanceSheet.widget.noEntries")}
              getSubtypeLabel={(s) =>
                t(`enums.accountSubtype.${s}` as Parameters<typeof t>[0])
              }
              onDrill={handleAccountDrill}
            />

            <Div className="flex flex-col gap-4">
              <Section
                formatAmount={formatAmount}
                title={t("balanceSheet.response.liabilities")}
                items={data.liabilities}
                total={data.totalLiabilities ?? 0}
                totalLabel={t("balanceSheet.response.totalLiabilities")}
                noEntriesLabel={t("balanceSheet.widget.noEntries")}
                getSubtypeLabel={(s) =>
                  t(`enums.accountSubtype.${s}` as Parameters<typeof t>[0])
                }
                onDrill={handleAccountDrill}
              />
              <Section
                formatAmount={formatAmount}
                title={t("balanceSheet.response.equity")}
                items={data.equity}
                extraLine={
                  data.unclosedEarnings
                    ? {
                        label: t("balanceSheet.response.unclosedEarnings"),
                        amount: data.unclosedEarnings,
                      }
                    : undefined
                }
                total={data.totalEquity ?? 0}
                totalLabel={t("balanceSheet.response.totalEquity")}
                noEntriesLabel={t("balanceSheet.widget.noEntries")}
                getSubtypeLabel={(s) =>
                  t(`enums.accountSubtype.${s}` as Parameters<typeof t>[0])
                }
                onDrill={handleAccountDrill}
              />
              <Div className="rounded-md border px-3 py-2 flex items-center justify-between text-sm font-semibold bg-muted/30">
                <Span>{t("balanceSheet.widget.liabilitiesAndEquity")}</Span>
                <Span
                  className={reportAmountClass(
                    (data.totalLiabilities ?? 0) + (data.totalEquity ?? 0),
                  )}
                >
                  {formatAmount(
                    (data.totalLiabilities ?? 0) + (data.totalEquity ?? 0),
                  )}
                </Span>
              </Div>
            </Div>
          </Div>
        </Div>
      ) : response?.success === false ? null : (
        <Div className="text-center py-10 text-sm text-muted-foreground border border-dashed rounded-md">
          {companyId || data?.reportCompanyId
            ? t("reports.widget.running")
            : t("balanceSheet.widget.selectCompany")}
        </Div>
      )}
    </WidgetShell>
  );
}
