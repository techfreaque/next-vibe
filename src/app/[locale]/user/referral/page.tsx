/**
 * Referral Dashboard Page
 * Server-side page for managing referral codes
 */

import type { Metadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { H1, H2, P } from "next-vibe-ui/ui/typography";
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
    title: t("app.user.referral.title"),
    description: t("app.user.referral.description"),
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
    <Div className="w-full">
      {/* Background */}
      <Div className="absolute inset-0 bg-linear-to-b from-blue-500/5 to-background -z-10" />

      <Div className="container px-4 md:px-6 py-16 md:py-24 lg:py-32">
        {/* Hero */}
        <Div className="flex flex-col gap-6 mb-20 md:mb-28">
          <P className="inline-flex w-fit items-center rounded-full border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
            {t("app.user.referral.tagline")}
          </P>
          <H1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-cyan-500 to-blue-600 leading-[1.15]">
            {t("app.user.referral.title", {
              appName: t("config.appName"),
            })}
          </H1>
          <P className="text-gray-600 dark:text-gray-300 max-w-3xl text-lg md:text-xl leading-relaxed">
            {t("app.user.referral.description", {
              appName: t("config.appName"),
            })}
          </P>
        </Div>

        {/* How it works + Stats */}
        <Div className="grid gap-12 lg:gap-20 items-start mb-20 md:mb-28">
          <Div className="flex flex-col gap-6">
            <H2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("app.user.referral.howItWorks.title")}
            </H2>
            <Div className="space-y-6">
              <Div className="flex gap-5">
                <Div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
                  1
                </Div>
                <Div className="space-y-2 pt-1">
                  <P className="text-base md:text-lg font-semibold text-foreground">
                    {t("app.user.referral.howItWorks.step1Title")}
                  </P>
                  <P className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t("app.user.referral.howItWorks.step1Body")}
                  </P>
                </Div>
              </Div>

              <Div className="flex gap-5">
                <Div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
                  2
                </Div>
                <Div className="space-y-2 pt-1">
                  <P className="text-base md:text-lg font-semibold text-foreground">
                    {t("app.user.referral.howItWorks.step2Title")}
                  </P>
                  <P className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t("app.user.referral.howItWorks.step2Body")}
                  </P>
                </Div>
              </Div>

              <Div className="flex gap-5">
                <Div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
                  3
                </Div>
                <Div className="space-y-2 pt-1">
                  <P className="text-base md:text-lg font-semibold text-foreground">
                    {t("app.user.referral.howItWorks.step3Title")}
                  </P>
                  <P className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t("app.user.referral.howItWorks.step3Body")}
                  </P>
                </Div>
              </Div>
            </Div>
          </Div>

          <Div className="flex flex-col gap-4">
            <H2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("app.user.referral.overview.title")}
            </H2>
            <P className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              {t("app.user.referral.overview.subtitle")}
            </P>
            <ReferralStats locale={locale} />
          </Div>
        </Div>

        {/* Manage referral codes */}
        <Div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-start">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">
                {t("app.user.referral.createCode.title")}
              </CardTitle>
              <P className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                {t("app.user.referral.manage.createSubtitle")}
              </P>
            </CardHeader>
            <CardContent>
              <ReferralCodeForm locale={locale} />
            </CardContent>
          </Card>

          <Card className="h-full border-2">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">
                {t("app.user.referral.myCodes.title")}
              </CardTitle>
              <P className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                {t("app.user.referral.manage.codesSubtitle")}
              </P>
            </CardHeader>
            <CardContent>
              <ReferralCodesList locale={locale} />
            </CardContent>
          </Card>
        </Div>
      </Div>
    </Div>
  );
}
