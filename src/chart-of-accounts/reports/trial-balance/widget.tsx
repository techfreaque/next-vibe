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

import { ReportAsOfControl } from "@/finance/report-period-control";

import { formatAccountingDateInput } from "../../shared/calendar-date";
import {
  ReportCompanyPicker,
  ReportMenu,
  ReportReadState,
} from "../balance-sheet/report-controls";
import { reportAmountClass } from "../report-amount-class";
import type definition from "./definition";
import type { TrialBalanceResponseOutput } from "./definition";

interface TrialBalanceWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type AccountRow = NonNullable<TrialBalanceResponseOutput["accounts"]>[number];

function AccountLine({
  formatAmount,
  account,
  onDrill,
}: {
  formatAmount: (value: number) => string;
  account: AccountRow;
  onDrill: (accountId: string) => () => void;
}): JSX.Element {
  return (
    <Div className="grid grid-cols-[2.75rem_minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] @lg:grid-cols-[6rem_minmax(0,1fr)_repeat(3,8rem)] gap-2 px-3 py-1.5 border-b last:border-b-0 text-sm hover:bg-muted/20">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onDrill(account.accountId)}
        className="text-left hover:underline cursor-pointer font-mono text-sm text-muted-foreground shrink-0 h-auto p-0"
      >
        {account.code ?? account.accountId}
      </Button>
      <Span className="break-words">{account.name}</Span>
      <Span
        className={`break-words text-right text-xs @lg:text-sm ${reportAmountClass(account.debitTotal)}`}
      >
        {formatAmount(account.debitTotal)}
      </Span>
      <Span
        className={`break-words text-right text-xs @lg:text-sm ${reportAmountClass(account.creditTotal)}`}
      >
        {formatAmount(account.creditTotal)}
      </Span>
      <Span
        className={`break-words text-right text-xs @lg:text-sm ${reportAmountClass(account.balance)}`}
      >
        {formatAmount(account.balance)}
      </Span>
    </Div>
  );
}

export function TrialBalanceWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { field: { children } }: TrialBalanceWidgetProps,
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
  const hasCompany = Boolean(companyId || data?.reportCompanyId);
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
        title={t("trialBalance.title")}
        subtitle={t("trialBalance.description")}
        actions={
          interactive && (
            <ReportMenu
              current="trialBalance"
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
          <ReportAsOfControl
            label={t("trialBalance.asOfDate.label")}
            day={asOf ?? formatAccountingDateInput(data?.asOfDateResponse)}
            onChange={(date) =>
              form.setValue("asOfDate", date, { shouldDirty: true })
            }
          />
        </Div>
      )}
      {hasCompany && response?.success !== false && (
        <FormAlertWidget field={{}} />
      )}
      {ready && data?.reportCurrency && (
        <Span className="text-sm font-medium">
          {t("reports.currency")} {data.reportCurrency}
        </Span>
      )}
      {ready && data?.accounts !== undefined ? (
        <Div className="flex flex-col gap-3">
          {data.asOfDateResponse && (
            <Div className="flex items-center justify-between">
              <Span className="text-sm text-muted-foreground">
                {t("trialBalance.widget.asOf")}{" "}
                {formatDocDate(data.asOfDateResponse, locale)}
              </Span>
              {data.isBalanced !== undefined && (
                <Badge
                  variant={data.isBalanced ? "default" : "destructive"}
                  className="text-xs"
                >
                  {data.isBalanced
                    ? t("trialBalance.widget.balanced")
                    : t("trialBalance.widget.unbalanced")}
                </Badge>
              )}
            </Div>
          )}

          {data.accounts.length > 0 ? (
            <Div className="rounded-md border overflow-hidden">
              <Div className="grid grid-cols-[2.75rem_minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] @lg:grid-cols-[6rem_minmax(0,1fr)_repeat(3,8rem)] gap-2 px-3 py-2 bg-muted/50 border-b text-xs font-medium text-muted-foreground">
                <Span>{t("trialBalance.response.code")}</Span>
                <Span>{t("trialBalance.response.name")}</Span>
                <Span className="text-right">
                  {t("trialBalance.response.debitTotal")}
                </Span>
                <Span className="text-right">
                  {t("trialBalance.response.creditTotal")}
                </Span>
                <Span className="text-right">
                  {t("trialBalance.response.balance")}
                </Span>
              </Div>
              {data.accounts.map((account) => (
                <AccountLine
                  formatAmount={formatAmount}
                  key={account.code}
                  account={account}
                  onDrill={handleAccountDrill}
                />
              ))}
              <Div className="grid grid-cols-[2.75rem_minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] @lg:grid-cols-[6rem_minmax(0,1fr)_repeat(3,8rem)] gap-2 px-3 py-2 bg-muted/50 border-t text-sm font-semibold">
                <Span className="col-span-2">
                  {t("trialBalance.widget.total")}
                </Span>
                <Span
                  className={`break-words text-right text-xs @lg:text-sm ${reportAmountClass(data.totalDebits ?? 0)}`}
                >
                  {formatAmount(data.totalDebits ?? 0)}
                </Span>
                <Span
                  className={`break-words text-right text-xs @lg:text-sm ${reportAmountClass(data.totalCredits ?? 0)}`}
                >
                  {formatAmount(data.totalCredits ?? 0)}
                </Span>
                <Span
                  className={`break-words text-right text-xs @lg:text-sm ${reportAmountClass((data.totalDebits ?? 0) - (data.totalCredits ?? 0))}`}
                >
                  {formatAmount(
                    (data.totalDebits ?? 0) - (data.totalCredits ?? 0),
                  )}
                </Span>
              </Div>
            </Div>
          ) : (
            <Div className="text-center py-8 text-sm text-muted-foreground border rounded-md">
              {t("trialBalance.widget.noActivity")}
            </Div>
          )}
        </Div>
      ) : (
        <ReportReadState
          hasCompany={hasCompany}
          companyPrompt={t("trialBalance.widget.selectCompany")}
        />
      )}
    </WidgetShell>
  );
}
