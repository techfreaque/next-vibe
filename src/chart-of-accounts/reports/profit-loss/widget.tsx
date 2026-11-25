"use client";

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
import {
  reportAmountClass,
  ReportCompanyPicker,
  ReportDateFilter,
  ReportMenu,
  ReportPeriodMenu,
} from "../balance-sheet/report-controls";
import type definition from "./definition";
import type { ProfitLossResponseOutput } from "./definition";

interface ProfitLossWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type LineItem = NonNullable<ProfitLossResponseOutput["revenue"]>[number];

function SectionRow({
  formatAmount,
  item,
  onDrill,
}: {
  formatAmount: (value: number) => string;
  item: LineItem;
  onDrill: (accountId: string) => () => void;
}): JSX.Element {
  return (
    <Div className="flex items-center gap-2 px-4 py-1.5 border-b last:border-b-0 text-sm hover:bg-muted/20">
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
      <Span className={`text-right ${reportAmountClass(item.amount)}`}>
        {formatAmount(item.amount)}
      </Span>
    </Div>
  );
}

function SectionTotal({
  formatAmount,
  label,
  amount,
  highlight,
}: {
  formatAmount: (value: number) => string;
  label: string;
  amount: number;
  highlight?: boolean;
}): JSX.Element {
  return (
    <Div
      className={`flex items-center justify-between px-4 py-2 text-sm font-semibold ${
        highlight ? "bg-primary/10 rounded-md" : "border-t"
      }`}
    >
      <Span>{label}</Span>
      <Span
        className={
          highlight && Math.abs(amount) >= 0.005
            ? `tabular-nums ${amount > 0 ? "text-success" : "text-destructive"}`
            : reportAmountClass(amount)
        }
      >
        {formatAmount(amount)}
      </Span>
    </Div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProfitLossWidget({
  field: { children },
}: ProfitLossWidgetProps): JSX.Element {
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
        title={t("profitLoss.title")}
        subtitle={t("profitLoss.description")}
        actions={
          interactive && (
            <ReportMenu
              current="profitLoss"
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
            label={t("profitLoss.from.label")}
            day={from ?? formatAccountingDateInput(data?.fromResponse)}
            onChange={(date) =>
              form.setValue("from", date, { shouldDirty: true })
            }
          />
          <ReportDateFilter
            id="report-to"
            label={t("profitLoss.to.label")}
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
      {ready && data?.revenue !== undefined ? (
        <Div className="flex flex-col gap-4">
          {data.fromResponse && data.toResponse && (
            <Span className="text-sm text-muted-foreground">
              {`${t("profitLoss.widget.dateRange")} · ${formatDocDate(data.fromResponse, locale)} – ${formatDocDate(data.toResponse, locale)}`}
            </Span>
          )}

          <Div className="rounded-md border overflow-hidden">
            <Div className="px-4 py-2 bg-muted/50 border-b text-xs font-semibold text-muted-foreground">
              {t("profitLoss.response.revenue")}
            </Div>
            {data.revenue.length > 0 ? (
              data.revenue.map((item) => (
                <SectionRow
                  formatAmount={formatAmount}
                  key={item.code}
                  item={item}
                  onDrill={handleAccountDrill}
                />
              ))
            ) : (
              <Div className="px-4 py-3 text-sm text-muted-foreground italic">
                {t("profitLoss.widget.noData")}
              </Div>
            )}
            <SectionTotal
              formatAmount={formatAmount}
              label={t("profitLoss.response.totalRevenue")}
              amount={data.totalRevenue ?? 0}
            />
          </Div>

          <Div className="rounded-md border overflow-hidden">
            <Div className="px-4 py-2 bg-muted/50 border-b text-xs font-semibold text-muted-foreground">
              {t("profitLoss.response.expenses")}
            </Div>
            {data.expenses.length > 0 ? (
              data.expenses.map((item) => (
                <SectionRow
                  formatAmount={formatAmount}
                  key={item.code}
                  item={item}
                  onDrill={handleAccountDrill}
                />
              ))
            ) : (
              <Div className="px-4 py-3 text-sm text-muted-foreground italic">
                {t("profitLoss.widget.noData")}
              </Div>
            )}
            <SectionTotal
              formatAmount={formatAmount}
              label={t("profitLoss.response.totalExpenses")}
              amount={data.totalExpenses ?? 0}
            />
          </Div>

          <Div className="rounded-md border overflow-hidden">
            <Div className="px-4 py-2 bg-muted/50 border-b text-xs font-semibold text-muted-foreground">
              {t("profitLoss.response.grossProfit")}
            </Div>
            <Div className="p-2 flex flex-col gap-1">
              <SectionTotal
                formatAmount={formatAmount}
                label={t("profitLoss.response.grossProfit")}
                amount={data.grossProfit ?? 0}
              />
              <SectionTotal
                formatAmount={formatAmount}
                label={t("profitLoss.response.operatingProfit")}
                amount={data.operatingProfit ?? 0}
              />
              <SectionTotal
                formatAmount={formatAmount}
                label={t("profitLoss.response.netProfit")}
                amount={data.netProfit ?? 0}
                highlight
              />
            </Div>
          </Div>
        </Div>
      ) : response?.success === false ? null : (
        <Div className="text-center py-10 text-sm text-muted-foreground border border-dashed rounded-md">
          {companyId || data?.reportCompanyId
            ? t("reports.widget.running")
            : t("profitLoss.widget.selectCompany")}
        </Div>
      )}
    </WidgetShell>
  );
}
