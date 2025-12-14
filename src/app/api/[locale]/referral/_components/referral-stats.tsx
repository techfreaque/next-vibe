/**
 * Referral Stats Component
 * Displays aggregated referral statistics
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import React from "react";

import type { CountryLanguage, Currencies } from "@/i18n/core/config";
import { currencyByCountry } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import { formatCurrency } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

import { useReferralStats } from "../hooks";

interface ReferralStatsProps {
  locale: CountryLanguage;
}

export function ReferralStats({
  locale,
}: ReferralStatsProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const endpoint = useReferralStats();
  const country = getCountryFromLocale(locale);
  const currency = currencyByCountry[country] as Currencies;

  if (endpoint.read.isLoading) {
    return <P>{t("app.user.referral.stats.loading")}</P>;
  }

  if (!endpoint.read.data) {
    return <P>{t("app.user.referral.stats.error")}</P>;
  }

  const stats = endpoint.read.data;

  return (
    <Div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border border-border/60 bg-linear-to-b from-background to-background/80">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("app.user.referral.stats.totalReferrals")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <P className="font-mono text-3xl font-semibold tabular-nums">
            {stats.totalReferrals}
          </P>
        </CardContent>
      </Card>

      <Card className="border border-blue-500/40 bg-linear-to-b from-blue-500/10 to-background/40">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("app.user.referral.stats.totalEarnings")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <P className="font-mono text-3xl font-semibold tabular-nums text-blue-300">
            {formatCurrency(stats.totalEarningsCents / 100, currency, locale)}
          </P>
        </CardContent>
      </Card>

      <Card className="border border-amber-500/40 bg-linear-to-b from-amber-500/10 to-background/40">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("app.user.referral.stats.pendingEarnings")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <P className="font-mono text-3xl font-semibold tabular-nums text-amber-200">
            {formatCurrency(stats.pendingEarningsCents / 100, currency, locale)}
          </P>
        </CardContent>
      </Card>

      <Card className="border border-emerald-500/40 bg-linear-to-b from-emerald-500/10 to-background/40">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("app.user.referral.stats.confirmedEarnings")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <P className="font-mono text-3xl font-semibold tabular-nums text-emerald-200">
            {formatCurrency(
              stats.confirmedEarningsCents / 100,
              currency,
              locale,
            )}
          </P>
        </CardContent>
      </Card>
    </Div>
  );
}
