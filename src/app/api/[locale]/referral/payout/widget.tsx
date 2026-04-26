/**
 * Custom Widget for Referral Payout
 * GET view: How It Works + Withdraw card (with state-aware content + payout button)
 * Payout history list shown below when entries exist
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { AlertCircle } from "next-vibe-ui/ui/icons/AlertCircle";
import { Bitcoin } from "next-vibe-ui/ui/icons/Bitcoin";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Coins } from "next-vibe-ui/ui/icons/Coins";
import { Download } from "next-vibe-ui/ui/icons/Download";
import { History } from "next-vibe-ui/ui/icons/History";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Wallet } from "next-vibe-ui/ui/icons/Wallet";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { REFERRAL_CONFIG, computeLevelPercentages } from "../config";
import type definition from "./definition";

function fmtPct(v: number): string {
  const pct = v * 100;
  const r3 = Math.round(pct * 1000) / 1000;
  if (r3 % 1 === 0) {
    return `${r3.toFixed(0)}%`;
  }
  const r1 = Math.round(pct * 10) / 10;
  if (r1 === r3) {
    return `${r1.toFixed(1)}%`;
  }
  const r2 = Math.round(pct * 100) / 100;
  if (r2 === r3) {
    return `${r2.toFixed(2)}%`;
  }
  return `${r3.toFixed(3)}%`;
}

const STATUS_COLORS: Record<string, string> = {
  "enums.payoutStatus.pending": "bg-warning/10 text-warning",
  "enums.payoutStatus.approved": "bg-info/10 text-info",
  "enums.payoutStatus.rejected": "bg-destructive/10 text-destructive",
  "enums.payoutStatus.processing":
    "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  "enums.payoutStatus.completed":
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "enums.payoutStatus.failed": "bg-destructive/10 text-destructive",
};

export function ReferralPayoutContainer(): React.JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();

  const handleRequestPayout = (): void => {
    void (async (): Promise<void> => {
      const payoutDef = await import("./definition");
      navigation.push(payoutDef.POST, { popNavigationOnSuccess: 1 });
    })();
  };

  const percentages = computeLevelPercentages();
  const directPct = fmtPct(REFERRAL_CONFIG.DIRECT_PERCENTAGE);
  const skillBonusPct = fmtPct(percentages[1] ?? 0);
  const skillPct = fmtPct(
    REFERRAL_CONFIG.DIRECT_PERCENTAGE + (percentages[1] ?? 0),
  );

  const available = data?.earnedCreditsAvailable ?? 0;
  const canRequestPayout = available >= REFERRAL_CONFIG.MIN_PAYOUT_CENTS;
  const progressPct = Math.min(
    100,
    Math.round((available / REFERRAL_CONFIG.MIN_PAYOUT_CENTS) * 100),
  );
  const remainingDollars = `$${((REFERRAL_CONFIG.MIN_PAYOUT_CENTS - available) / 100).toFixed(2)}`;
  const availableDollars = `$${(available / 100).toFixed(2)}`;
  const minDollars = `$${(REFERRAL_CONFIG.MIN_PAYOUT_CENTS / 100).toFixed(2)}`;
  const hasHistory = (data?.payoutHistory.length ?? 0) > 0;

  return (
    <Div className="space-y-6">
      {/* Grid: How It Works + Withdraw */}
      <Div className="grid gap-6 lg:grid-cols-2">
        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-500" />
              {t("payout.widget.howItWorksTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Div className="relative">
              {/* Connector line */}
              <Div className="absolute left-4 top-8 bottom-8 w-px bg-violet-200 dark:bg-violet-800" />
              <Div className="space-y-6">
                {[
                  {
                    key: "step1",
                    title: t("payout.widget.step1Title"),
                    body: t("payout.widget.step1Body"),
                  },
                  {
                    key: "step2",
                    title: t("payout.widget.step2Title"),
                    body: t("payout.widget.step2Body", {
                      directPct,
                      skillPct,
                      skillBonusPct,
                    }),
                  },
                  {
                    key: "step3",
                    title: t("payout.widget.step3Title"),
                    body: t("payout.widget.step3Body"),
                  },
                ].map((step, i) => (
                  <Div key={step.key} className="flex gap-4 relative">
                    <Div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-sm font-bold z-10">
                      {i + 1}
                    </Div>
                    <Div className="pt-1">
                      <Div className="font-medium text-sm">{step.title}</Div>
                      <Div className="text-xs text-muted-foreground mt-0.5">
                        {step.body}
                      </Div>
                    </Div>
                  </Div>
                ))}
              </Div>
            </Div>
          </CardContent>
        </Card>

        {/* Withdraw Your Earnings - state-aware */}
        <Card
          className={
            canRequestPayout ? "border-success/30" : "border-warning/30"
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet
                className={`h-5 w-5 ${canRequestPayout ? "text-success" : "text-warning"}`}
              />
              {t("payout.widget.withdrawTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress / ready state */}
            {canRequestPayout ? (
              <Div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <Div>
                  <Div className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    {t("payout.widget.readyForPayout")}
                  </Div>
                  <Div className="text-xs text-emerald-700 dark:text-emerald-400">
                    {`${availableDollars} ${t("payout.widget.unlockedOf")} ${minDollars}`}
                  </Div>
                </Div>
              </Div>
            ) : (
              <Div className="space-y-2">
                <Div className="flex justify-between text-xs text-muted-foreground">
                  <Span>{t("payout.widget.progressLabel")}</Span>
                  <Span className="text-warning font-medium tabular-nums">
                    {`${remainingDollars} ${t("payout.widget.moreToUnlock")}`}
                  </Span>
                </Div>
                <Div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <Div
                    style={{
                      width: `${progressPct}%`,
                      height: "100%",
                      borderRadius: "9999px",
                      backgroundColor: "rgb(251 191 36)",
                      transitionProperty: "all",
                      transitionDuration: "300ms",
                    }}
                  />
                </Div>
                <Div className="text-xs text-muted-foreground tabular-nums">
                  {`${availableDollars} / ${minDollars}`}
                </Div>
              </Div>
            )}

            {/* Payout options */}
            <Div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Coins className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <Div>
                <Div className="font-medium text-sm">
                  {t("payout.widget.useAsCredits")}
                </Div>
                <Div className="text-xs text-muted-foreground">
                  {t("payout.widget.useAsCreditsDesc")}
                </Div>
              </Div>
            </Div>
            <Div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Bitcoin className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
              <Div>
                <Div className="font-medium text-sm">
                  {t("payout.widget.cryptoPayout")}
                </Div>
                <Div className="text-xs text-muted-foreground">
                  {t("payout.widget.cryptoPayoutDesc")}
                </Div>
              </Div>
            </Div>

            <Div className="pt-2 border-t space-y-3">
              <Div className="text-xs text-muted-foreground">
                {t("payout.widget.minimumNote", {
                  minPayout: minDollars,
                  cryptoPayoutHours: String(
                    REFERRAL_CONFIG.CRYPTO_PAYOUT_HOURS,
                  ),
                })}
              </Div>
              <Button
                onClick={handleRequestPayout}
                disabled={!canRequestPayout}
                className="w-full gap-2"
                variant={canRequestPayout ? "default" : "outline"}
              >
                <Download className="h-4 w-4" />
                {t("payout.widget.requestPayout")}
              </Button>
            </Div>
          </CardContent>
        </Card>
      </Div>

      {/* Payout History - always shown */}
      <Card>
        <CardHeader className="pb-3">
          <Div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4" />
              {t("payout.widget.payoutHistory")}
            </CardTitle>
          </Div>
        </CardHeader>
        <CardContent className="p-0">
          {hasHistory ? (
            <Div className="divide-y">
              {data?.payoutHistory.map((item) => (
                <Div
                  key={item.id}
                  className="flex items-start justify-between gap-3 px-4 py-3"
                >
                  <Div className="flex-1 min-w-0">
                    <Div className="flex items-center gap-2 flex-wrap">
                      <Span className="font-medium text-sm tabular-nums">
                        {`$${(item.amountCents / 100).toFixed(2)}`}
                      </Span>
                      <Span className="text-xs text-muted-foreground">
                        {t(item.currency)}
                      </Span>
                      {item.walletAddress ? (
                        <Span className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {item.walletAddress}
                        </Span>
                      ) : null}
                    </Div>
                    {item.rejectionReason ? (
                      <Div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <Span>{item.rejectionReason}</Span>
                      </Div>
                    ) : null}
                    <Div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Div>
                  </Div>
                  <Badge
                    className={
                      STATUS_COLORS[item.status] ??
                      "bg-muted text-muted-foreground"
                    }
                  >
                    {t(item.status)}
                  </Badge>
                </Div>
              ))}
            </Div>
          ) : (
            <Div className="flex flex-col items-center justify-center py-8 text-center gap-2 text-muted-foreground">
              <Download className="h-5 w-5 opacity-30" />
              <Div className="text-sm">{t("payout.widget.historyEmpty")}</Div>
            </Div>
          )}
        </CardContent>
      </Card>
    </Div>
  );
}
