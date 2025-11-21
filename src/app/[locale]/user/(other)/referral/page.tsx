/**
 * Referral Dashboard Page
 * Server-side page for managing referral codes
 */

import type { Metadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import { H1, P } from "next-vibe-ui/ui/typography";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import type React from "react";

import { requireUser } from "@/app/api/[locale]/v1/core/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ReferralCodeForm } from "@/app/api/[locale]/v1/core/referral/_components/referral-code-form";
import { ReferralCodesList } from "@/app/api/[locale]/v1/core/referral/_components/referral-codes-list";
import { ReferralStats } from "@/app/api/[locale]/v1/core/referral/_components/referral-stats";

interface ReferralPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export async function generateMetadata({
  params,
}: ReferralPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("app.user.other.referral.title"),
    description: t("app.user.other.referral.description"),
  };
}

export default async function ReferralPage({
  params,
}: ReferralPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  // Require authenticated user
  await requireUser(locale, `/${locale}/user/referral`);

  return (
    <Div className="container mx-auto py-6 flex flex-col gap-6">
      {/* Header */}
      <Div>
        <H1 className="text-3xl font-bold tracking-tight">
          {t("app.user.other.referral.title")}
        </H1>
        <P className="text-muted-foreground mt-2">
          {t("app.user.other.referral.description")}
        </P>
      </Div>

      {/* Stats Overview */}
      <ReferralStats locale={locale} />

      {/* Create New Code */}
      <Card>
        <CardHeader>
          <CardTitle>{t("app.user.other.referral.createCode.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ReferralCodeForm locale={locale} />
        </CardContent>
      </Card>

      {/* Existing Codes */}
      <Card>
        <CardHeader>
          <CardTitle>{t("app.user.other.referral.myCodes.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ReferralCodesList locale={locale} />
        </CardContent>
      </Card>
    </Div>
  );
}
