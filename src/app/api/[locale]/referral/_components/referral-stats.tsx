/**
 * Referral Stats Component
 * Displays aggregated referral statistics with earnings in USD
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { DollarSign, TrendingUp, Users, Wallet } from "next-vibe-ui/ui/icons";
import { P } from "next-vibe-ui/ui/typography";
import React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useReferralStats } from "../hooks";

interface ReferralStatsProps {
  locale: CountryLanguage;
}

/**
 * Format credits as USD (1 credit = $0.01)
 */
function formatCreditsAsUSD(credits: number): string {
  const usd = credits / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usd);
}

export function ReferralStats({ locale }: ReferralStatsProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const endpoint = useReferralStats();

  if (endpoint.read.isLoading) {
    return (
      <Div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {
          // oxlint-disable-next-line no-unused-vars
          [...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <Div className="h-4 w-24 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <Div className="h-8 w-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))
        }
      </Div>
    );
  }

  if (!endpoint.read.data) {
    return <P className="text-muted-foreground">{t("app.user.referral.stats.error")}</P>;
  }

  const stats = endpoint.read.data;

  return (
    <Div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Signups */}
      <Card className="border border-border/60 bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("app.user.referral.stats.totalSignups")}
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <P className="font-mono text-3xl font-bold tabular-nums">{stats.totalSignups}</P>
          <P className="text-xs text-muted-foreground mt-1">
            {t("app.user.referral.stats.totalSignupsDesc")}
          </P>
        </CardContent>
      </Card>

      {/* Total Revenue Generated */}
      <Card className="border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("app.user.referral.stats.totalRevenue")}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <P className="font-mono text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {formatCreditsAsUSD(stats.totalRevenueCredits)}
          </P>
          <P className="text-xs text-muted-foreground mt-1">
            {t("app.user.referral.stats.totalRevenueDesc")}
          </P>
        </CardContent>
      </Card>

      {/* Total Earned */}
      <Card className="border border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("app.user.referral.stats.totalEarned")}
          </CardTitle>
          <DollarSign className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <P className="font-mono text-3xl font-bold tabular-nums text-blue-600 dark:text-blue-400">
            {formatCreditsAsUSD(stats.totalEarnedCredits)}
          </P>
          <P className="text-xs text-muted-foreground mt-1">
            {t("app.user.referral.stats.totalEarnedDesc")}
          </P>
        </CardContent>
      </Card>

      {/* Available for Payout */}
      <Card className="border border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-violet-500/10">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("app.user.referral.stats.availableBalance")}
          </CardTitle>
          <Wallet className="h-4 w-4 text-violet-500" />
        </CardHeader>
        <CardContent>
          <P className="font-mono text-3xl font-bold tabular-nums text-violet-600 dark:text-violet-400">
            {formatCreditsAsUSD(stats.availableCredits)}
          </P>
          <P className="text-xs text-muted-foreground mt-1">
            {t("app.user.referral.stats.availableBalanceDesc")}
          </P>
        </CardContent>
      </Card>
    </Div>
  );
}
