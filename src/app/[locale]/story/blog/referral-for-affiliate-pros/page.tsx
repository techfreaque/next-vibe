import type { Metadata } from "next";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";
import { Link } from "next-vibe-ui/ui/link";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, Muted, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { configScopedTranslation } from "@/config/i18n";

import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  return metadataGenerator(locale, {
    path: "story/blog/referral-for-affiliate-pros",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description"),
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070",
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
  });
};

export interface ReferralAffiliateProsPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<ReferralAffiliateProsPageData> {
  const { locale } = await params;
  return { locale };
}

function CommissionRow({
  profile,
  spend,
  earn,
  highlight,
}: {
  profile: string;
  spend: string;
  earn: string;
  highlight?: boolean;
}): JSX.Element {
  return (
    <Div
      className={`grid grid-cols-3 px-4 py-3 border-t text-sm ${
        highlight
          ? "bg-violet-50 dark:bg-violet-950/20 font-semibold"
          : "bg-background"
      }`}
    >
      <Span
        className={
          highlight
            ? "text-violet-700 dark:text-violet-300"
            : "text-muted-foreground"
        }
      >
        {profile}
      </Span>
      <Span
        className={
          highlight ? "text-violet-700 dark:text-violet-300" : "text-foreground"
        }
      >
        {spend}
      </Span>
      <Span
        className={
          highlight
            ? "text-violet-600 dark:text-violet-400 font-bold"
            : "text-emerald-600 dark:text-emerald-400 font-semibold"
        }
      >
        {earn}
      </Span>
    </Div>
  );
}

function AudienceCard({
  title,
  body,
}: {
  title: string;
  body: string;
}): JSX.Element {
  return (
    <Div className="flex gap-4 p-5 rounded-xl border bg-muted/20">
      <Div className="flex h-2 w-2 shrink-0 rounded-full bg-violet-500 mt-2" />
      <Div>
        <Div className="font-semibold text-sm mb-1">{title}</Div>
        <Div className="text-sm text-muted-foreground">{body}</Div>
      </Div>
    </Div>
  );
}

function AngleCard({
  title,
  body,
}: {
  title: string;
  body: string;
}): JSX.Element {
  return (
    <Div className="p-5 rounded-xl border bg-background">
      <Div className="font-semibold text-sm mb-2 text-violet-700 dark:text-violet-300">
        {title}
      </Div>
      <P className="text-sm text-muted-foreground leading-relaxed">{body}</P>
    </Div>
  );
}

export function TanstackPage({
  locale,
}: ReferralAffiliateProsPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);

  return (
    <Div className="min-h-screen bg-background">
      {/* Header bar */}
      <Div className="bg-violet-700 border-b border-violet-800">
        <Div className="container mx-auto px-4 py-3 max-w-4xl">
          <Div className="flex items-center gap-3">
            <Div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center font-bold text-white text-xs">
              {t("hero.icon")}
            </Div>
            <P className="text-white font-semibold text-sm">
              {t("hero.brand")}
              {t("hero.category")}
            </P>
          </Div>
        </Div>
      </Div>

      {/* Hero */}
      <Div className="bg-violet-50 dark:bg-violet-950/20 border-b border-violet-100 dark:border-violet-900/40">
        <Div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link
            href={`/${locale}/story/blog`}
            className="inline-flex items-center text-sm text-violet-700 dark:text-violet-400 hover:text-violet-900 dark:hover:text-violet-300 mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("hero.backToBlog")}
          </Link>

          <Div className="flex items-center gap-3 mb-6">
            <Div className="px-3 py-1 bg-violet-700 rounded-full text-white text-xs font-semibold uppercase tracking-wider">
              {t("hero.category")}
            </Div>
            <Muted className="text-xs">{t("hero.readTime")}</Muted>
          </Div>

          <H1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {t("hero.title")}
          </H1>
          <P className="text-xl text-muted-foreground max-w-2xl">
            {t("hero.subtitle")}
          </P>
        </Div>
      </Div>

      <Div className="container mx-auto px-4 py-16 max-w-4xl space-y-16">
        {/* Recurring math */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">
            {t("recurringMath.title")}
          </H2>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t("recurringMath.p1")}
          </P>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {t("recurringMath.p2")}
          </P>

          <Div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Div className="p-5 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800">
              <Div className="font-semibold text-sm mb-2 text-violet-800 dark:text-violet-300">
                {t("recurringMath.powerUserTitle")}
              </Div>
              <P className="text-sm text-violet-700 dark:text-violet-200 leading-relaxed">
                {t("recurringMath.powerUserBody")}
              </P>
            </Div>
            <Div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <Div className="font-semibold text-sm mb-2 text-emerald-800 dark:text-emerald-300">
                {t("recurringMath.floorTitle")}
              </Div>
              <P className="text-sm text-emerald-700 dark:text-emerald-200 leading-relaxed">
                {t("recurringMath.floorBody")}
              </P>
            </Div>
          </Div>

          <Div className="overflow-hidden rounded-xl border">
            <Div className="grid grid-cols-3 bg-muted/60 px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <Span>{t("recurringMath.tableHeaderProfile")}</Span>
              <Span>{t("recurringMath.tableHeaderSpend")}</Span>
              <Span>{t("recurringMath.tableHeaderYouEarn")}</Span>
            </Div>
            <CommissionRow
              profile={t("recurringMath.row1Profile")}
              spend={t("recurringMath.row1Spend")}
              earn={t("recurringMath.row1Earn")}
            />
            <CommissionRow
              profile={t("recurringMath.row2Profile")}
              spend={t("recurringMath.row2Spend")}
              earn={t("recurringMath.row2Earn")}
            />
            <CommissionRow
              profile={t("recurringMath.row3Profile")}
              spend={t("recurringMath.row3Spend")}
              earn={t("recurringMath.row3Earn")}
              highlight
            />
            <CommissionRow
              profile={t("recurringMath.row4Profile")}
              spend={t("recurringMath.row4Spend")}
              earn={t("recurringMath.row4Earn")}
              highlight
            />
          </Div>
        </Div>

        <Separator />

        {/* Structure */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">{t("structure.title")}</H2>
          <Div className="space-y-4">
            <Div className="flex items-start gap-3 p-4 rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800">
              <Div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white text-xs font-bold mt-0.5">
                1
              </Div>
              <P className="text-sm text-violet-800 dark:text-violet-200 leading-relaxed">
                {t("structure.p1")}
              </P>
            </Div>
            <Div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border">
              <Div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-bold mt-0.5">
                2
              </Div>
              <P className="text-sm text-muted-foreground leading-relaxed">
                {t("structure.p2")}
              </P>
            </Div>
            <Div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <P className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                {t("structure.p3")}
              </P>
            </Div>
          </Div>
        </Div>

        <Separator />

        {/* Audience */}
        <Div>
          <H2 className="text-2xl font-bold mb-3">{t("audience.title")}</H2>
          <P className="text-muted-foreground mb-6">{t("audience.intro")}</P>
          <Div className="grid sm:grid-cols-2 gap-4">
            <AudienceCard
              title={t("audience.group1Title")}
              body={t("audience.group1Body")}
            />
            <AudienceCard
              title={t("audience.group2Title")}
              body={t("audience.group2Body")}
            />
            <AudienceCard
              title={t("audience.group3Title")}
              body={t("audience.group3Body")}
            />
            <AudienceCard
              title={t("audience.group4Title")}
              body={t("audience.group4Body")}
            />
          </Div>
        </Div>

        <Separator />

        {/* Promotion angles */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">{t("promotion.title")}</H2>
          <Div className="space-y-4">
            <AngleCard
              title={t("promotion.angle1Title")}
              body={t("promotion.angle1Body")}
            />
            <AngleCard
              title={t("promotion.angle2Title")}
              body={t("promotion.angle2Body")}
            />
            <AngleCard
              title={t("promotion.angle3Title")}
              body={t("promotion.angle3Body")}
            />
            <AngleCard
              title={t("promotion.angle4Title")}
              body={t("promotion.angle4Body")}
            />
          </Div>
        </Div>

        <Separator />

        {/* Payouts */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">{t("payouts.title")}</H2>
          <Div className="space-y-3">
            {[t("payouts.p1"), t("payouts.p2"), t("payouts.p3")].map((p, i) => (
              <P
                key={i}
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
              >
                {p}
              </P>
            ))}
          </Div>
        </Div>

        <Separator />

        {/* Close */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">{t("close.title")}</H2>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t("close.p1")}
          </P>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            {t("close.p2")}
          </P>
          <Div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-violet-700 hover:bg-violet-800 text-white"
            >
              <Link href={`/${locale}/user/referral`}>
                {t("close.createCode")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link
                href={configT("social.discordInvite")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="h-4 w-4" />
                {t("close.joinDiscord")}
              </Link>
            </Button>
          </Div>
        </Div>

        <Div className="flex justify-start pt-4">
          <Button asChild variant="outline">
            <Link href={`/${locale}/story/blog`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("hero.backToBlog")}
            </Link>
          </Button>
        </Div>
      </Div>
    </Div>
  );
}

export default async function ReferralAffiliateProsPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
