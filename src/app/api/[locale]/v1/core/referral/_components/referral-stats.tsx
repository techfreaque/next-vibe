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
    return <P>{t("app.user.other.referral.stats.loading")}</P>;
  }

  if (!endpoint.read.data) {
    return <P>{t("app.user.other.referral.stats.error")}</P>;
  }

  const stats = endpoint.read.data;

  return (
    <Div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("app.user.other.referral.stats.totalReferrals")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <P className="text-2xl font-bold">{stats.totalReferrals}</P>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("app.user.other.referral.stats.totalEarnings")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <P className="text-2xl font-bold">
            {formatCurrency(stats.totalEarningsCents / 100, currency, locale)}
          </P>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("app.user.other.referral.stats.pendingEarnings")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <P className="text-2xl font-bold">
            {formatCurrency(stats.pendingEarningsCents / 100, currency, locale)}
          </P>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("app.user.other.referral.stats.confirmedEarnings")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <P className="text-2xl font-bold">
            {formatCurrency(stats.confirmedEarningsCents / 100, currency, locale)}
          </P>
        </CardContent>
      </Card>
    </Div>
  );
}
