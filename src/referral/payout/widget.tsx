/**
 * Custom Widget for Referral Payout
 * GET view: Withdraw card (state-aware progress + payout button) + payout options
 * Payout history list shown below when entries exist
 */

"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "next-vibe/ui/components/card";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { Bitcoin } from "next-vibe/ui/components/icons/Bitcoin";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { Download } from "next-vibe/ui/components/icons/Download";
import { History } from "next-vibe/ui/components/icons/History";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { Span } from "next-vibe/ui/components/span";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";

import { REFERRAL_CONFIG } from "../config";
import type definition from "./definition";

const STATUS_COLORS: Record<string, string> = {
  "enums.payoutStatus.pending": "bg-warning/10 text-warning",
  "enums.payoutStatus.approved": "bg-info/10 text-info",
  "enums.payoutStatus.rejected": "bg-destructive/10 text-destructive",
  "enums.payoutStatus.processing": "bg-primary/10 text-primary",
  "enums.payoutStatus.completed": "bg-success/10 text-success",
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
    <Div className="flex flex-col gap-4">
      {/* Withdraw — state-aware */}
      <Div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
          <Div className="flex flex-col gap-4 p-5 sm:p-6">
            <Div className="flex items-center gap-3">
              <Span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  canRequestPayout
                    ? "bg-success/10 text-success"
                    : "bg-primary/10 text-primary",
                )}
              >
                <Wallet className="h-4 w-4" />
              </Span>
              <Span className="text-lg font-semibold tracking-tight">
                {t("payout.widget.withdrawTitle")}
              </Span>
            </Div>

            {canRequestPayout ? (
              <Div className="flex items-center gap-2.5 rounded-lg border border-success/30 bg-success/10 px-3.5 py-3">
                <CheckCircle className="h-4 w-4 shrink-0 text-success" />
                <Div>
                  <Div className="text-sm font-medium text-foreground">
                    {t("payout.widget.readyForPayout")}
                  </Div>
                  <Div className="text-xs text-muted-foreground">
                    {`${availableDollars} ${t("payout.widget.unlockedOf")} ${minDollars}`}
                  </Div>
                </Div>
              </Div>
            ) : (
              <Div className="flex flex-col gap-2">
                <Div className="flex items-baseline justify-between gap-2">
                  <Span className="text-2xl font-semibold tabular-nums tracking-tight">
                    {availableDollars}
                    <Span className="ml-1 text-sm font-normal text-muted-foreground">
                      {`/ ${minDollars}`}
                    </Span>
                  </Span>
                  <Span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {`${remainingDollars} ${t("payout.widget.moreToUnlock")}`}
                  </Span>
                </Div>
                <Div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <Div
                    style={{
                      width: `${progressPct}%`,
                      height: "100%",
                      borderRadius: "9999px",
                      backgroundColor: "hsl(var(--primary))",
                      transition: "width 300ms",
                    }}
                  />
                </Div>
                <Span className="text-xs text-muted-foreground">
                  {t("payout.widget.progressLabel")}
                </Span>
              </Div>
            )}

            <Div className="mt-auto flex flex-col gap-3">
              <Button
                onClick={handleRequestPayout}
                disabled={!canRequestPayout}
                className="h-11 w-full gap-2"
                variant={canRequestPayout ? "default" : "outline"}
              >
                <Download className="h-4 w-4" />
                {t("payout.widget.requestPayout")}
              </Button>
              <Div className="text-xs leading-relaxed text-muted-foreground">
                {t("payout.widget.minimumNote", {
                  minPayout: minDollars,
                  cryptoPayoutHours: String(
                    REFERRAL_CONFIG.CRYPTO_PAYOUT_HOURS,
                  ),
                })}
              </Div>
            </Div>
          </Div>

          {/* Payout options */}
          <Div className="flex flex-col divide-y border-t bg-muted/30 lg:border-l lg:border-t-0">
            <Div className="flex items-start gap-3 p-5">
              <Coins className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <Div>
                <Div className="text-sm font-medium">
                  {t("payout.widget.useAsCredits")}
                </Div>
                <Div className="text-xs text-muted-foreground">
                  {t("payout.widget.useAsCreditsDesc")}
                </Div>
              </Div>
            </Div>
            <Div className="flex items-start gap-3 p-5">
              <Bitcoin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <Div>
                <Div className="text-sm font-medium">
                  {t("payout.widget.cryptoPayout")}
                </Div>
                <Div className="text-xs text-muted-foreground">
                  {t("payout.widget.cryptoPayoutDesc")}
                </Div>
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>

      {/* Payout History - always shown */}
      <Card className="rounded-xl">
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
