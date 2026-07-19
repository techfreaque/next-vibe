"use client";

import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { Span } from "next-vibe/ui/ui/span";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";
import type { TrialBalanceResponseOutput } from "./definition";

interface TrialBalanceWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type AccountRow = NonNullable<TrialBalanceResponseOutput["accounts"]>[number];

function formatAmount(n: number): string {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function AccountLine({
  account,
  onDrill,
}: {
  account: AccountRow;
  onDrill: (accountId: string) => () => void;
}): JSX.Element {
  return (
    <Div className="grid grid-cols-[6rem_1fr_8rem_8rem_8rem] gap-2 px-3 py-1.5 border-b last:border-b-0 text-sm hover:bg-muted/20">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onDrill(account.accountId)}
        className="text-left hover:underline cursor-pointer font-mono text-sm text-muted-foreground shrink-0 h-auto p-0"
      >
        {account.code ?? account.accountId}
      </Button>
      <Span className="truncate">{account.name}</Span>
      <Span className="text-right font-mono text-amber-600 dark:text-amber-400">
        {formatAmount(account.debitTotal)}
      </Span>
      <Span className="text-right font-mono text-emerald-600 dark:text-emerald-400">
        {formatAmount(account.creditTotal)}
      </Span>
      <Span className="text-right font-mono font-medium">
        {formatAmount(account.balance)}
      </Span>
    </Div>
  );
}

export function TrialBalanceWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: TrialBalanceWidgetProps,
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const navigation = useWidgetNavigation();

  const handleNavProfitLoss = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../profit-loss/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const handleNavBalanceSheet = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../balance-sheet/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const handleNavTaxReport = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../tax-report/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const handleNavReceivablesAging = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../receivables-aging/definition");
      navigation.push(def.default.GET, {});
    })();
  };

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
    <Div className="flex flex-col gap-4">
      <Div className="flex items-center justify-between gap-3 flex-wrap">
        <SubmitButtonWidget<typeof definition.GET>
          field={{
            size: "sm",
            variant: "default",
            text: "reports.widget.run" as const,
            loadingText: "reports.widget.running" as const,
          }}
        />
        <Div className="flex gap-1 flex-wrap">
          <Button size="sm" variant="ghost" onClick={handleNavProfitLoss}>
            {t("reports.nav.profitLoss")}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleNavBalanceSheet}>
            {t("reports.nav.balanceSheet")}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleNavTaxReport}>
            {t("reports.nav.taxReport")}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleNavReceivablesAging}>
            {t("reports.nav.receivablesAging")}
          </Button>
        </Div>
      </Div>

      {data?.accounts !== undefined ? (
        <Div className="flex flex-col gap-3">
          {data.asOfDateResponse && (
            <Div className="flex items-center justify-between">
              <Span className="text-sm text-muted-foreground">
                {t("trialBalance.widget.asOf")} {data.asOfDateResponse}
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
              <Div className="grid grid-cols-[6rem_1fr_8rem_8rem_8rem] gap-2 px-3 py-2 bg-muted/50 border-b text-xs font-medium text-muted-foreground">
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
                  key={account.code}
                  account={account}
                  onDrill={handleAccountDrill}
                />
              ))}
              <Div className="grid grid-cols-[6rem_1fr_8rem_8rem_8rem] gap-2 px-3 py-2 bg-muted/50 border-t text-sm font-semibold">
                <Span className="col-span-2">
                  {t("trialBalance.widget.total")}
                </Span>
                <Span className="text-right font-mono">
                  {formatAmount(data.totalDebits ?? 0)}
                </Span>
                <Span className="text-right font-mono">
                  {formatAmount(data.totalCredits ?? 0)}
                </Span>
                <Span className="text-right font-mono">
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
        <Div className="text-center py-10 text-sm text-muted-foreground border border-dashed rounded-md">
          {t("trialBalance.widget.selectCompany")}
        </Div>
      )}
    </Div>
  );
}
