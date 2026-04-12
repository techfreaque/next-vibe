import type { Metadata } from "next";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";

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
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "story/blog/referral-for-beginners",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description", { appName }),
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071",
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
  });
};

export interface ReferralBeginnersPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<ReferralBeginnersPageData> {
  const { locale } = await params;
  return { locale };
}

function TableRow({
  type,
  earn,
  when,
  highlight,
}: {
  type: string;
  earn: string;
  when: string;
  highlight?: boolean;
}): JSX.Element {
  return (
    <Div
      className={`grid grid-cols-3 px-4 py-3 border-t text-sm ${
        highlight
          ? "bg-emerald-50 dark:bg-emerald-950/20 font-semibold"
          : "bg-background"
      }`}
    >
      <Span
        className={
          highlight
            ? "text-emerald-700 dark:text-emerald-300"
            : "text-muted-foreground"
        }
      >
        {type}
      </Span>
      <Span
        className={
          highlight
            ? "text-emerald-700 dark:text-emerald-300"
            : "text-foreground"
        }
      >
        {earn}
      </Span>
      <Span
        className={
          highlight
            ? "text-emerald-700 dark:text-emerald-300"
            : "text-muted-foreground"
        }
      >
        {when}
      </Span>
    </Div>
  );
}

function ScenarioCard({
  label,
  spend,
  earn,
}: {
  label: string;
  spend: string;
  earn: string;
}): JSX.Element {
  return (
    <Div className="rounded-xl border p-4 bg-muted/30">
      <Div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        {label}
      </Div>
      <Div className="text-sm font-medium">{spend}</Div>
      <Div className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
        {earn}
      </Div>
    </Div>
  );
}

function StepCard({
  number,
  title,
  body,
  children,
}: {
  number: number;
  title: string;
  body: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <Div className="flex gap-4">
      <Div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
        {number}
      </Div>
      <Div>
        <Div className="font-semibold text-sm mb-1">{title}</Div>
        <Div className="text-sm text-muted-foreground">{children ?? body}</Div>
      </Div>
    </Div>
  );
}

export function TanstackPage({
  locale,
}: ReferralBeginnersPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  return (
    <Div className="min-h-screen bg-background">
      {/* Header bar */}
      <Div className="bg-emerald-600 border-b border-emerald-700">
        <Div className="container mx-auto px-4 py-3 max-w-4xl">
          <Div className="flex items-center gap-3">
            <Div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center font-bold text-white text-xs">
              {t("hero.icon")}
            </Div>
            <P className="text-white font-semibold text-sm">
              {t("hero.brand", { appName })}
              {t("hero.category")}
            </P>
          </Div>
        </Div>
      </Div>

      {/* Hero */}
      <Div className="bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/40">
        <Div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link
            href={`/${locale}/story/blog`}
            className="inline-flex items-center text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("hero.backToBlog")}
          </Link>

          <Div className="flex items-center gap-3 mb-6">
            <Div className="px-3 py-1 bg-emerald-600 rounded-full text-white text-xs font-semibold uppercase tracking-wider">
              {t("hero.category")}
            </Div>
            <Muted className="text-xs">{t("hero.readTime")}</Muted>
          </Div>

          <H1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {t("hero.title")}
          </H1>
          <P className="text-xl text-muted-foreground mb-6 max-w-2xl">
            {t("hero.subtitle")}
          </P>
          <Div className="inline-block px-5 py-3 rounded-xl bg-white dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm italic max-w-xl">
            {t("hero.quote")}
          </Div>
        </Div>
      </Div>

      <Div className="container mx-auto px-4 py-16 max-w-4xl space-y-16">
        {/* Intro */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">{t("intro.title")}</H2>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t("intro.p1")}
          </P>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("intro.p2", { appName })}
          </P>
        </Div>

        <Separator />

        {/* What makes it different */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">{t("different.title")}</H2>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {t("different.p1", { appName })}
          </P>

          <Div className="overflow-hidden rounded-xl border mb-6">
            <Div className="grid grid-cols-3 bg-muted/60 px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <Span>{t("different.tableHeaderType")}</Span>
              <Span>{t("different.tableHeaderYouEarn")}</Span>
              <Span>{t("different.tableHeaderWhen")}</Span>
            </Div>
            <TableRow
              type={t("different.row1Type")}
              earn={t("different.row1Earn")}
              when={t("different.row1When")}
            />
            <TableRow
              type={t("different.row2Type")}
              earn={t("different.row2Earn")}
              when={t("different.row2When")}
            />
            <TableRow
              type={t("different.row3Type")}
              earn={t("different.row3Earn")}
              when={t("different.row3When")}
              highlight
            />
          </Div>

          <P className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("different.p2")}
          </P>
        </Div>

        <Separator />

        {/* Multi-level */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">{t("multilevel.title")}</H2>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {t("multilevel.p1")}
          </P>
          <Div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 mb-6">
            <Div className="flex items-start gap-3">
              <RefreshCw className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <P className="text-emerald-800 dark:text-emerald-200 leading-relaxed">
                {t("multilevel.explanation", { appName })}
              </P>
            </Div>
          </Div>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t("multilevel.p2", { appName })}
          </P>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("multilevel.p3")}
          </P>
        </Div>

        <Separator />

        {/* Realistic expectations */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">{t("expectations.title")}</H2>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {t("expectations.p1")}
          </P>
          <Div className="grid sm:grid-cols-2 gap-4 mb-6">
            <ScenarioCard
              label={t("expectations.scenario1Label")}
              spend={t("expectations.scenario1Spend")}
              earn={t("expectations.scenario1Earn")}
            />
            <ScenarioCard
              label={t("expectations.scenario2Label")}
              spend={t("expectations.scenario2Spend")}
              earn={t("expectations.scenario2Earn")}
            />
          </Div>
          <Div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-200 mb-6">
            {t("expectations.note")}
          </Div>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("expectations.example")}
          </P>
        </Div>

        <Separator />

        {/* First steps */}
        <Div>
          <H2 className="text-2xl font-bold mb-8">{t("firststeps.title")}</H2>
          <Div className="space-y-6">
            <StepCard
              number={1}
              title={t("firststeps.step1Title")}
              body={t("firststeps.step1Body")}
            />
            <StepCard
              number={2}
              title={t("firststeps.step2Title")}
              body={t("firststeps.step2Body")}
            >
              <Link
                href={`/${locale}/user/(account)/referral`}
                className="text-emerald-600 dark:text-emerald-400 underline hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                {t("firststeps.step2Link")}
              </Link>
              {t("firststeps.step2Suffix")}
            </StepCard>
            <StepCard
              number={3}
              title={t("firststeps.step3Title")}
              body={t("firststeps.step3Body")}
            />
            <StepCard
              number={4}
              title={t("firststeps.step4Title")}
              body={t("firststeps.step4Body")}
            />
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
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Link href={`/${locale}/user/(account)/referral`}>
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

export default async function ReferralBeginnersPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
