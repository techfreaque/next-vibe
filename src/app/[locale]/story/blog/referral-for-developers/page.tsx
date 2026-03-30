import type { Metadata } from "next";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Code } from "next-vibe-ui/ui/icons/Code";
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
    path: "story/blog/referral-for-developers",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description"),
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070",
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
  });
};

export interface ReferralDevelopersPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<ReferralDevelopersPageData> {
  const { locale } = await params;
  return { locale };
}

function MathRow({
  referrals,
  casual,
  heavy,
}: {
  referrals: string;
  casual: string;
  heavy: string;
}): JSX.Element {
  return (
    <Div className="grid grid-cols-3 px-4 py-3 border-t text-sm font-mono">
      <Span className="text-cyan-300">{referrals}</Span>
      <Span className="text-gray-300">{casual}</Span>
      <Span className="text-cyan-400 font-semibold">{heavy}</Span>
    </Div>
  );
}

export function TanstackPage({
  locale,
}: ReferralDevelopersPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);

  return (
    <Div className="min-h-screen bg-background">
      {/* Header bar */}
      <Div className="bg-cyan-700 border-b border-cyan-800">
        <Div className="container mx-auto px-4 py-3 max-w-4xl">
          <Div className="flex items-center gap-3">
            <Code className="h-5 w-5 text-white/80" />
            <P className="text-white font-semibold text-sm font-mono">
              {t("hero.brand")}
              {t("hero.category")}
            </P>
          </Div>
        </Div>
      </Div>

      {/* Hero */}
      <Div className="bg-cyan-50 dark:bg-cyan-950/20 border-b border-cyan-100 dark:border-cyan-900/40">
        <Div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link
            href={`/${locale}/story/blog`}
            className="inline-flex items-center text-sm text-cyan-700 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-cyan-300 mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("hero.backToBlog")}
          </Link>

          <Div className="flex items-center gap-3 mb-6">
            <Div className="px-3 py-1 bg-cyan-700 rounded-full text-white text-xs font-semibold uppercase tracking-wider font-mono">
              {t("hero.category")}
            </Div>
            <Muted className="text-xs font-mono">{t("hero.readTime")}</Muted>
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
        {/* Use case */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">{t("useCase.title")}</H2>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t("useCase.p1")}
          </P>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {t("useCase.p2")}
          </P>
          <Div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <Div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700">
              <Code className="h-4 w-4 text-cyan-400" />
              <Span className="text-cyan-400 text-sm font-mono">{`// examples`}</Span>
            </Div>
            <Div className="p-4 space-y-3">
              {[
                t("useCase.examples.0"),
                t("useCase.examples.1"),
                t("useCase.examples.2"),
                t("useCase.examples.3"),
              ].map((example, i) => (
                <P
                  key={i}
                  className="text-gray-300 text-sm font-mono leading-relaxed"
                >
                  {`"${example}"`}
                </P>
              ))}
            </Div>
          </Div>
        </Div>

        <Separator />

        {/* API angle */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">{t("apiAngle.title")}</H2>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t("apiAngle.p1")}
          </P>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("apiAngle.p2")}
          </P>
        </Div>

        <Separator />

        {/* Math */}
        <Div>
          <H2 className="text-2xl font-bold mb-2">{t("math.title")}</H2>
          <Muted className="mb-6">{t("math.subtitle")}</Muted>

          <Div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-900 mb-6">
            <Div className="grid grid-cols-3 bg-gray-800 px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide font-mono">
              <Span>{t("math.tableHeaderReferrals")}</Span>
              <Span>{t("math.tableHeaderCasual")}</Span>
              <Span>{t("math.tableHeaderHeavy")}</Span>
            </Div>
            <MathRow
              referrals={t("math.rows.0.referrals")}
              casual={t("math.rows.0.casual")}
              heavy={t("math.rows.0.heavy")}
            />
            <MathRow
              referrals={t("math.rows.1.referrals")}
              casual={t("math.rows.1.casual")}
              heavy={t("math.rows.1.heavy")}
            />
            <MathRow
              referrals={t("math.rows.2.referrals")}
              casual={t("math.rows.2.casual")}
              heavy={t("math.rows.2.heavy")}
            />
          </Div>

          <Div className="p-4 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 text-sm text-cyan-800 dark:text-cyan-200 mb-4">
            {t("math.note")}
          </Div>
          <Div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-800 dark:text-emerald-200">
            <Div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 mt-0.5 shrink-0" />
              <Span>{t("math.growthNote")}</Span>
            </Div>
          </Div>
        </Div>

        <Separator />

        {/* Multi-level for builders */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">{t("multilevel.title")}</H2>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t("multilevel.p1")}
          </P>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("multilevel.p2")}
          </P>
        </Div>

        <Separator />

        {/* Crypto */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">{t("crypto.title")}</H2>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t("crypto.p1")}
          </P>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("crypto.p2")}
          </P>
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
              className="gap-2 bg-cyan-700 hover:bg-cyan-800 text-white"
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

export default async function ReferralDevelopersPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
