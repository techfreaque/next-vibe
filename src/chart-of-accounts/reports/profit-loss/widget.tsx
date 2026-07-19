"use client";

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
import type { ProfitLossResponseOutput } from "./definition";

interface ProfitLossWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type LineItem = NonNullable<ProfitLossResponseOutput["revenue"]>[number];

function formatAmount(n: number): string {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatDate(d: Date): string {
  return d.toLocaleDateString();
}

function SectionRow({
  item,
  onDrill,
}: {
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
      <Span className="font-mono text-right">{formatAmount(item.amount)}</Span>
    </Div>
  );
}

function SectionTotal({
  label,
  amount,
  highlight,
}: {
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
        className={`font-mono ${amount >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
      >
        {formatAmount(amount)}
      </Span>
    </Div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProfitLossWidget(_props: ProfitLossWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const navigation = useWidgetNavigation();

  const handleNavBalanceSheet = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../balance-sheet/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const handleNavTrialBalance = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../trial-balance/definition");
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
          <Button size="sm" variant="ghost" onClick={handleNavBalanceSheet}>
            {t("reports.nav.balanceSheet")}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleNavTrialBalance}>
            {t("reports.nav.trialBalance")}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleNavTaxReport}>
            {t("reports.nav.taxReport")}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleNavReceivablesAging}>
            {t("reports.nav.receivablesAging")}
          </Button>
        </Div>
      </Div>

      {data?.revenue !== undefined ? (
        <Div className="flex flex-col gap-4">
          {data.fromResponse && data.toResponse && (
            <Span className="text-sm text-muted-foreground">
              {t("profitLoss.widget.dateRange")}:{" "}
              {formatDate(data.fromResponse)} — {formatDate(data.toResponse)}
            </Span>
          )}

          <Div className="rounded-md border overflow-hidden">
            <Div className="px-4 py-2 bg-muted/50 border-b text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("profitLoss.response.revenue")}
            </Div>
            {data.revenue.length > 0 ? (
              data.revenue.map((item) => (
                <SectionRow
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
              label={t("profitLoss.response.totalRevenue")}
              amount={data.totalRevenue ?? 0}
            />
          </Div>

          <Div className="rounded-md border overflow-hidden">
            <Div className="px-4 py-2 bg-muted/50 border-b text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("profitLoss.response.expenses")}
            </Div>
            {data.expenses.length > 0 ? (
              data.expenses.map((item) => (
                <SectionRow
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
              label={t("profitLoss.response.totalExpenses")}
              amount={data.totalExpenses ?? 0}
            />
          </Div>

          <Div className="rounded-md border overflow-hidden">
            <Div className="px-4 py-2 bg-muted/50 border-b text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("profitLoss.response.grossProfit")}
            </Div>
            <Div className="p-2 flex flex-col gap-1">
              <SectionTotal
                label={t("profitLoss.response.grossProfit")}
                amount={data.grossProfit ?? 0}
              />
              <SectionTotal
                label={t("profitLoss.response.operatingProfit")}
                amount={data.operatingProfit ?? 0}
              />
              <SectionTotal
                label={t("profitLoss.response.netProfit")}
                amount={data.netProfit ?? 0}
                highlight
              />
            </Div>
          </Div>
        </Div>
      ) : (
        <Div className="text-center py-10 text-sm text-muted-foreground border border-dashed rounded-md">
          {t("profitLoss.widget.selectCompany")}
        </Div>
      )}
    </Div>
  );
}
