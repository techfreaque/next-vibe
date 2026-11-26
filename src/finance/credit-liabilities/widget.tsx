"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoneyAmount,
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
import type { JSX } from "react";

import { ReportCompanyPicker } from "@/chart-of-accounts/reports/balance-sheet/report-controls";

import type endpoint from "./definition";

export function CreditLiabilityWidget(): JSX.Element {
  const data = useWidgetValue<typeof endpoint.GET>();
  const response = useWidgetResponse();
  const form = useWidgetForm<typeof endpoint.GET>();
  const t = useWidgetTranslation<typeof endpoint.GET>();
  const locale = useWidgetLocale();
  const { push } = useWidgetNavigation();
  const isInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const interactive = isInteractive && !responseOnly;
  const companyId = form.watch("companyId");
  const current =
    data && (!interactive || data.reportCompanyId === companyId)
      ? data
      : undefined;
  const openLedger = (accountId: string): void => {
    if (!current) {
      return;
    }
    void import("@/chart-of-accounts/ledger/[accountId]/definition").then(
      ({ default: ledger }) =>
        push(ledger.GET, {
          urlPathParams: { accountId },
          data: { dateTo: new Date(current.asOfDate) },
        }),
    );
  };

  const accountLabel = (
    accountId: string,
    name: string,
  ): JSX.Element | string =>
    interactive ? (
      <Button
        type="button"
        variant="link"
        className="h-auto whitespace-normal p-0 text-left"
        onClick={() => openLedger(accountId)}
      >
        {name}
      </Button>
    ) : (
      name
    );

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("title")}
        subtitle={t("description")}
      />
      {interactive && (
        <ReportCompanyPicker
          label={t("company")}
          selectedId={companyId}
          reportId={current?.reportCompanyId ?? undefined}
          reportName={current?.companyName ?? undefined}
          onChange={(id) =>
            form.setValue("companyId", id, { shouldDirty: true })
          }
        />
      )}
      {interactive && !companyId ? (
        <EmptyBlock title={t("choose")} />
      ) : response?.success === false ? (
        <EmptyBlock title={response.message} />
      ) : current ? (
        <>
          <Div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            {current.companyName && (
              <P className="min-w-0 text-sm font-medium [overflow-wrap:anywhere]">
                {current.companyName}
              </P>
            )}
            <P className="text-sm text-muted-foreground">
              {t("reportDay", {
                date: formatDocDate(current.asOfDate, locale),
              })}
            </P>
          </Div>
          {current.balances.length === 0 ? (
            <EmptyBlock title={t("empty")} />
          ) : (
            <RecordTable
              label={t("title")}
              columns={[
                { id: "account", label: t("account") },
                { id: "currency", label: t("currency") },
                { id: "amount", label: t("amount"), numeric: true },
              ]}
              rows={current.balances.map((row) => ({
                id: `${row.accountId}:${row.currency}`,
                cells: {
                  account: accountLabel(
                    row.accountId,
                    `${row.accountCode} ${row.accountName}`,
                  ),
                  currency: row.currency,
                  amount: formatMoneyAmount(Number(row.amount), locale),
                },
              }))}
              compact={
                <Div className="divide-y rounded-lg border bg-card">
                  <Div className="flex items-baseline justify-between gap-3 px-3 py-2 text-xs text-muted-foreground">
                    <Span>{t("account")}</Span>
                    <Span className="text-right">{t("amount")}</Span>
                  </Div>
                  {current.balances.map((row) => (
                    <Div
                      key={`${row.accountId}:${row.currency}`}
                      className="flex flex-wrap items-baseline justify-between gap-2 p-3 text-sm"
                    >
                      {accountLabel(
                        row.accountId,
                        `${row.accountCode} ${row.accountName}`,
                      )}
                      <Div className="flex gap-2">
                        <Span className="text-muted-foreground">
                          {row.currency}
                        </Span>
                        <Span className="font-medium tabular-nums">
                          {formatMoneyAmount(Number(row.amount), locale)}
                        </Span>
                      </Div>
                    </Div>
                  ))}
                </Div>
              }
            />
          )}
          <P className="text-sm text-muted-foreground">{t("scope")}</P>
          {interactive && current.balances.length > 0 && (
            <P className="text-sm text-muted-foreground">{t("ledgerScope")}</P>
          )}
        </>
      ) : null}
    </WidgetShell>
  );
}
