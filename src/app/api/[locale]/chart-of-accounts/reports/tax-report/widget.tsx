"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";
import type { TaxReportResponseOutput } from "./definition";

interface TaxReportWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type TaxLine = NonNullable<TaxReportResponseOutput["lines"]>[number];

function formatAmount(n: number): string {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function TaxLineRow({ line }: { line: TaxLine }): JSX.Element {
  return (
    <Div className="grid grid-cols-[6rem_1fr_8rem_8rem_6rem] gap-2 px-3 py-1.5 border-b last:border-b-0 text-sm hover:bg-muted/20">
      <Span className="font-mono text-xs text-muted-foreground">
        {line.taxRateCode}
      </Span>
      <Span className="truncate">{line.taxRateName}</Span>
      <Span className="text-right font-mono">
        {formatAmount(line.netAmount)}
      </Span>
      <Span className="text-right font-mono">
        {formatAmount(line.taxAmount)}
      </Span>
      <Span className="text-right font-mono text-muted-foreground">
        {(line.rate * 100).toFixed(1)}%
      </Span>
    </Div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TaxReportWidget(_props: TaxReportWidgetProps): JSX.Element {
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

  const handleNavTrialBalance = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../trial-balance/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const handleNavReceivablesAging = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../receivables-aging/definition");
      navigation.push(def.default.GET, {});
    })();
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
          <Button size="sm" variant="ghost" onClick={handleNavTrialBalance}>
            {t("reports.nav.trialBalance")}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleNavReceivablesAging}>
            {t("reports.nav.receivablesAging")}
          </Button>
        </Div>
      </Div>

      {data?.vatCollected !== undefined ? (
        <Div className="flex flex-col gap-4">
          {data.fromResponse && data.toResponse && (
            <Span className="text-sm text-muted-foreground">
              {t("taxReport.widget.dateRange")}: {data.fromResponse} —{" "}
              {data.toResponse}
            </Span>
          )}

          <Div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Div className="rounded-md border p-3 flex flex-col gap-1">
              <Span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t("taxReport.response.vatCollected")}
              </Span>
              <Span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {formatAmount(data.vatCollected)}
              </Span>
            </Div>
            <Div className="rounded-md border p-3 flex flex-col gap-1">
              <Span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t("taxReport.response.vatReclaimable")}
              </Span>
              <Span className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400">
                {formatAmount(data.vatReclaimable)}
              </Span>
            </Div>
            <Div
              className={`rounded-md border p-3 flex flex-col gap-1 ${
                (data.netVatPayable ?? 0) > 0
                  ? "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800"
                  : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
              }`}
            >
              <Span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t("taxReport.response.netVatPayable")}
              </Span>
              <Span
                className={`text-lg font-bold font-mono ${
                  (data.netVatPayable ?? 0) > 0
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {formatAmount(data.netVatPayable ?? 0)}
              </Span>
            </Div>
          </Div>

          {data.lines && data.lines.length > 0 && (
            <Div className="rounded-md border overflow-hidden">
              <Div className="px-3 py-2 bg-muted/50 border-b text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("taxReport.widget.detailSection")}
              </Div>
              <Div className="grid grid-cols-[6rem_1fr_8rem_8rem_6rem] gap-2 px-3 py-1.5 border-b text-xs font-medium text-muted-foreground bg-muted/30">
                <Span>{t("taxReport.response.taxRateCode")}</Span>
                <Span>{t("taxReport.response.taxRateName")}</Span>
                <Span className="text-right">
                  {t("taxReport.response.netAmount")}
                </Span>
                <Span className="text-right">
                  {t("taxReport.response.taxAmount")}
                </Span>
                <Span className="text-right">
                  {t("taxReport.response.rate")}
                </Span>
              </Div>
              {data.lines.map((line) => (
                <TaxLineRow key={line.taxRateCode} line={line} />
              ))}
            </Div>
          )}
        </Div>
      ) : (
        <Div className="text-center py-10 text-sm text-muted-foreground border border-dashed rounded-md">
          {t("taxReport.widget.selectCompany")}
        </Div>
      )}
    </Div>
  );
}
