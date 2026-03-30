"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { DollarSign } from "next-vibe-ui/ui/icons/DollarSign";
import { Gift } from "next-vibe-ui/ui/icons/Gift";
import { Lightbulb } from "next-vibe-ui/ui/icons/Lightbulb";
import { Link2 } from "next-vibe-ui/ui/icons/Link2";
import { LogIn } from "next-vibe-ui/ui/icons/LogIn";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";
import { UserPlus } from "next-vibe-ui/ui/icons/UserPlus";
import { Users } from "next-vibe-ui/ui/icons/Users";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import referralCodesListDefinition from "@/app/api/[locale]/referral/codes/list/definition";
import referralDefinition from "@/app/api/[locale]/referral/definition";
import referralPayoutDefinition from "@/app/api/[locale]/referral/payout/definition";
import referralStatsDefinition from "@/app/api/[locale]/referral/stats/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { configScopedTranslation } from "@/config/i18n";
import { translations as configTranslations } from "@/config/i18n/en";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  scopedTranslation as pageT,
  getCommissionRows,
  getReferralParams,
} from "./i18n";
import type { ReferralPageT, CommissionRow } from "./i18n";

function CommissionTable({
  t,
  rows,
  p,
}: {
  t: ReferralPageT;
  rows: CommissionRow[];
  p: Record<string, string>;
}): JSX.Element {
  return (
    <Div className="overflow-hidden rounded-xl border">
      <Div className="grid grid-cols-3 bg-muted/60 px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        <Span>{t("commissionTable.colLevel")}</Span>
        <Span>{t("commissionTable.colCut")}</Span>
        <Span className="hidden sm:block">
          {t("commissionTable.colExample", p)}
        </Span>
      </Div>
      {rows.map((row, index) => (
        <Div
          key={index}
          className={`grid grid-cols-3 px-4 py-3 border-t text-sm ${
            index === 0
              ? "bg-violet-50 dark:bg-violet-950/20 font-semibold"
              : "bg-background"
          }`}
        >
          <Div className="flex items-center gap-2">
            <Div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                index === 0
                  ? "bg-violet-600 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </Div>
            <Span
              className={
                index === 0 ? "text-foreground" : "text-muted-foreground"
              }
            >
              {row.who}
            </Span>
          </Div>
          <Div
            className={`flex items-center gap-2 ${index === 0 ? "text-violet-600 dark:text-violet-400" : "text-foreground"}`}
          >
            {row.pct}
            {index === 0 && (
              <Badge className="text-xs bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-0">
                {t("commissionTable.alwaysYours")}
              </Badge>
            )}
          </Div>
          <Div className="hidden sm:flex items-center text-muted-foreground text-xs">
            {row.example}
          </Div>
        </Div>
      ))}
    </Div>
  );
}

function HowItWorksSteps({
  t,
  p,
}: {
  t: ReferralPageT;
  p: Record<string, string>;
}): JSX.Element {
  const steps = [
    {
      icon: Link2,
      title: t("howItWorks.step1Title"),
      body: t("howItWorks.step1Body"),
    },
    {
      icon: Users,
      title: t("howItWorks.step2Title"),
      body: t("howItWorks.step2Body", p),
    },
    {
      icon: DollarSign,
      title: t("howItWorks.step3Title"),
      body: t("howItWorks.step3Body"),
    },
  ];

  return (
    <Div className="grid gap-6 sm:grid-cols-3">
      {steps.map((step, i) => (
        <Div key={i} className="flex gap-4">
          <Div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30 mt-0.5">
            <step.icon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </Div>
          <Div>
            <Div className="font-semibold text-sm mb-1">{step.title}</Div>
            <Div className="text-sm text-muted-foreground">{step.body}</Div>
          </Div>
        </Div>
      ))}
    </Div>
  );
}

export function ReferralPageClient({
  locale,
  isAuthenticated,
  user,
}: {
  locale: CountryLanguage;
  isAuthenticated: boolean;
  user: JwtPayloadType;
}): JSX.Element {
  const { t } = pageT.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const commissionRows = getCommissionRows(locale);
  const p = getReferralParams();

  return (
    <Div className="w-full min-h-screen">
      <Div className="absolute inset-0 bg-gradient-to-b from-violet-500/8 via-background to-background -z-10" />

      <Div className="container px-4 md:px-6 py-8 md:py-12 max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/${locale}/threads`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToChat")}
        </Link>

        {/* ── HERO ── */}
        <Div className="mb-12">
          <Badge variant="secondary" className="mb-4 gap-1.5 text-xs">
            <Gift className="h-3.5 w-3.5" />
            {t("tagline")}
          </Badge>
          <H1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {t("title", { appName: configTranslations.appName })}
          </H1>
          <P className="text-muted-foreground text-lg max-w-2xl mb-8">
            {t("description", { appName: configTranslations.appName, ...p })}
          </P>

          {/* Stats row */}
          <Div className="flex flex-wrap gap-3">
            <Div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-500/20">
              <Div className="text-4xl font-black tracking-tighter">
                {p.directPct}
              </Div>
              <Div>
                <Div className="text-sm font-medium leading-tight">
                  {t("commissionTable.heroLabel")}
                </Div>
                <Div className="text-xs text-violet-200 mt-0.5">
                  {t("commissionTable.heroSub")}
                </Div>
              </Div>
            </Div>
            <Div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-muted/80 border">
              <Div className="text-4xl font-black tracking-tighter text-foreground">
                {p.totalPct}
              </Div>
              <Div>
                <Div className="text-sm font-medium leading-tight text-foreground">
                  {t("commission.totalTitle")}
                </Div>
                <Div className="text-xs text-muted-foreground mt-0.5">
                  {t("commission.totalDesc")}
                </Div>
              </Div>
            </Div>
          </Div>
        </Div>

        {/* ── COMMISSION BREAKDOWN ── */}
        <Div className="mb-12">
          <Div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-violet-500" />
            <H2 className="text-xl font-bold">{t("commission.title")}</H2>
          </Div>
          <P className="text-muted-foreground text-sm mb-5 max-w-xl">
            {t("commission.subtitle", p)}
          </P>

          <CommissionTable t={t} rows={commissionRows} p={p} />
        </Div>

        {/* ── AUDIENCE CALLOUT ── */}
        <Div className="mb-12">
          <Div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-violet-500" />
            <H2 className="text-xl font-bold">{t("audienceCallout.title")}</H2>
          </Div>
          <Div className="grid gap-4 sm:grid-cols-2">
            <Div className="rounded-xl border border-l-4 border-l-emerald-500 p-5 bg-emerald-50/50 dark:bg-emerald-950/20">
              <Div className="font-semibold text-sm mb-2 text-emerald-800 dark:text-emerald-300">
                {t("audienceCallout.newTitle")}
              </Div>
              <P className="text-sm text-muted-foreground leading-relaxed">
                {t("audienceCallout.newBody")}
              </P>
            </Div>
            <Div className="rounded-xl border border-l-4 border-l-violet-500 p-5 bg-violet-50/50 dark:bg-violet-950/20">
              <Div className="font-semibold text-sm mb-2 text-violet-800 dark:text-violet-300">
                {t("audienceCallout.proTitle")}
              </Div>
              <P className="text-sm text-muted-foreground leading-relaxed">
                {t("audienceCallout.proBody")}
              </P>
            </Div>
          </Div>
        </Div>

        {/* ── HOW IT WORKS ── */}
        <Div className="mb-12">
          <Div className="flex items-center gap-3 mb-5">
            <Sparkles className="h-5 w-5 text-violet-500" />
            <H2 className="text-xl font-bold">{t("howItWorks.title")}</H2>
          </Div>
          <HowItWorksSteps t={t} p={p} />
        </Div>

        {/* ── AUTHENTICATED SECTION ── */}
        {isAuthenticated ? (
          <>
            {/* Stats */}
            <Div className="mb-8">
              <H2 className="text-xl font-semibold mb-4">
                {t("overview.title")}
              </H2>
              <EndpointsPage
                endpoint={referralStatsDefinition}
                user={user}
                locale={locale}
              />
            </Div>

            {/* Earnings / Payout */}
            <Div className="mb-8">
              <EndpointsPage
                endpoint={referralPayoutDefinition}
                user={user}
                locale={locale}
              />
            </Div>

            {/* Create New Code */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {t("createCode.title")}
                </CardTitle>
                <CardDescription>{t("manage.createSubtitle")}</CardDescription>
              </CardHeader>
              <CardContent>
                <EndpointsPage
                  endpoint={referralDefinition}
                  user={user}
                  locale={locale}
                />
              </CardContent>
            </Card>

            {/* Codes List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  {t("myCodes.title")}
                </CardTitle>
                <CardDescription>{t("manage.codesSubtitle")}</CardDescription>
              </CardHeader>
              <CardContent>
                <EndpointsPage
                  endpoint={referralCodesListDefinition}
                  user={user}
                  locale={locale}
                />
              </CardContent>
            </Card>
          </>
        ) : (
          /* ── NOT AUTHENTICATED ── */
          <Card className="border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
            <CardContent className="pt-10 pb-10">
              <Div className="text-center space-y-6 max-w-sm mx-auto">
                <Div className="mx-auto w-14 h-14 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                  <DollarSign className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                </Div>
                <Div className="space-y-2">
                  <H3 className="text-xl font-semibold">{t("cta.title")}</H3>
                  <P className="text-muted-foreground text-sm">
                    {t("cta.description", p)}
                  </P>
                </Div>

                <Div className="text-left space-y-2">
                  {[t("cta.pitch1", p), t("cta.pitch2"), t("cta.pitch3")].map(
                    (pitch, i) => (
                      <Div key={i} className="flex items-center gap-3 text-sm">
                        <Div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                          <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        </Div>
                        <Span className="text-foreground/80">{pitch}</Span>
                      </Div>
                    ),
                  )}
                </Div>

                <Div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Button asChild size="lg" className="gap-2">
                    <Link href={`/${locale}/user/signup`}>
                      <UserPlus className="h-4 w-4" />
                      {t("cta.signUp")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link
                      href={`/${locale}/user/login?callbackUrl=${encodeURIComponent(`/${locale}/user/referral`)}`}
                    >
                      <LogIn className="h-4 w-4" />
                      {t("cta.logIn")}
                    </Link>
                  </Button>
                </Div>
              </Div>
            </CardContent>
          </Card>
        )}

        {/* ── DISCORD CTA ── */}
        <Div className="mt-10">
          <Div className="rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Div className="flex items-center gap-4">
              <Div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
                <MessageSquare className="h-6 w-6 text-white" />
              </Div>
              <Div>
                <Div className="font-semibold text-white text-base">
                  {t("discord.title")}
                </Div>
                <Div className="text-sm text-violet-100 mt-0.5">
                  {t("discord.description")}
                </Div>
              </Div>
            </Div>
            <Button
              asChild
              size="lg"
              className="shrink-0 bg-white text-violet-700 hover:bg-violet-50 font-semibold gap-2"
            >
              <Link
                href={configT("social.discordInvite")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="h-4 w-4" />
                {t("discord.cta")}
              </Link>
            </Button>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
