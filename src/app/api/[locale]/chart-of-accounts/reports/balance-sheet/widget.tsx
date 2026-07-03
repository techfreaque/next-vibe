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
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";
import type { BalanceSheetResponseOutput } from "./definition";

interface BalanceSheetWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type BalanceSheetItem = NonNullable<
  BalanceSheetResponseOutput["assets"]
>[number];

function formatAmount(n: number): string {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatDate(d: Date): string {
  return d.toLocaleDateString();
}

function AccountLine({
  item,
  subtypeLabel,
  onDrill,
}: {
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
      <Span className="font-mono text-right w-24 shrink-0">
        {formatAmount(item.balance)}
      </Span>
    </Div>
  );
}

function Section({
  title,
  items,
  total,
  totalLabel,
  noEntriesLabel,
  getSubtypeLabel,
  onDrill,
}: {
  title: string;
  items: BalanceSheetItem[];
  total: number;
  totalLabel: string;
  noEntriesLabel: string;
  getSubtypeLabel: (subtype: string) => string;
  onDrill: (accountId: string) => () => void;
}): JSX.Element {
  return (
    <Div className="rounded-md border overflow-hidden flex-1">
      <Div className="px-3 py-2 bg-muted/50 border-b text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </Div>
      {items.length > 0 ? (
        items.map((item) => (
          <AccountLine
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
      <Div className="flex items-center justify-between px-3 py-2 border-t bg-muted/30 text-sm font-semibold">
        <Span>{totalLabel}</Span>
        <Span className="font-mono">{formatAmount(total)}</Span>
      </Div>
    </Div>
  );
}

export function BalanceSheetWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: BalanceSheetWidgetProps,
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
          await import("@/app/api/[locale]/chart-of-accounts/ledger/[accountId]/definition");
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

      {data?.assets !== undefined ? (
        <Div className="flex flex-col gap-4">
          {data.asOfDateResponse && (
            <Div className="flex items-center justify-between">
              <Span className="text-sm text-muted-foreground">
                {t("balanceSheet.widget.asOf")}{" "}
                {formatDate(data.asOfDateResponse)}
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
                title={t("balanceSheet.response.equity")}
                items={data.equity}
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
                <Span className="font-mono">
                  {formatAmount(
                    (data.totalLiabilities ?? 0) + (data.totalEquity ?? 0),
                  )}
                </Span>
              </Div>
            </Div>
          </Div>
        </Div>
      ) : (
        <Div className="text-center py-10 text-sm text-muted-foreground border border-dashed rounded-md">
          {t("balanceSheet.widget.selectCompany")}
        </Div>
      )}
    </Div>
  );
}
