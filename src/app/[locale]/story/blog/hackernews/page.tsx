import type { Metadata } from "next";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";
import { Link } from "next-vibe-ui/ui/link";
import { Separator } from "next-vibe-ui/ui/separator";
import { H1, H2, H3, Lead, Muted, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

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
    path: "story/blog/hackernews",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description"),
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070",
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
  });
};

export interface HackernewsPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<HackernewsPageData> {
  const { locale } = await params;
  return { locale };
}

function HnPostPreview({
  title,
  body,
  badge,
  badgeColor,
  isRecommended,
  hnNavFull,
  hnPostMeta,
  hnRecommended,
}: {
  title: string;
  body: string;
  badge: string;
  badgeColor: "orange" | "blue";
  isRecommended: boolean;
  hnNavFull: string;
  hnPostMeta: string;
  hnRecommended: string;
}): JSX.Element {
  const badgeStyles = {
    orange:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border border-orange-300 dark:border-orange-700",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-300 dark:border-blue-700",
  };

  return (
    <Div
      className={`rounded-xl border-2 overflow-hidden ${isRecommended ? "border-orange-400 dark:border-orange-600" : "border-gray-200 dark:border-gray-700"}`}
    >
      {/* HN-style header */}
      <Div className="bg-orange-500 px-4 py-2 flex items-center gap-3">
        <Div className="font-mono text-white text-sm font-bold">Y</Div>
        <Div className="font-mono text-white/90 text-xs">{hnNavFull}</Div>
        {isRecommended && (
          <Div className="ml-auto bg-white/20 text-white text-xs px-2 py-0.5 rounded font-mono">
            {hnRecommended}
          </Div>
        )}
      </Div>

      {/* HN-style post */}
      <Div className="bg-[#f6f6ef] dark:bg-gray-900 p-4">
        <Div className="flex items-start gap-2">
          <Div className="text-gray-500 font-mono text-xs pt-0.5">▲</Div>
          <Div>
            <P className="font-mono text-sm text-gray-900 dark:text-gray-100 leading-tight mb-1">
              {title}
            </P>
            <Div className="text-xs text-gray-500 font-mono">{hnPostMeta}</Div>
          </Div>
        </Div>
      </Div>

      {/* Post body */}
      <Div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
        <Div
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${badgeStyles[badgeColor]}`}
        >
          {badge}
        </Div>
        <P className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line font-mono">
          {body}
        </P>
      </Div>
    </Div>
  );
}

function BannedPatternRow({
  name,
  description,
}: {
  name: string;
  description: string;
}): JSX.Element {
  return (
    <Div className="flex items-start gap-4 p-4 bg-gray-900 border border-red-900/50 rounded-lg">
      <Div className="flex-shrink-0 px-3 py-1 bg-red-950 border border-red-800 rounded font-mono text-red-400 text-sm font-bold">
        {name}
      </Div>
      <P className="text-gray-300 text-sm leading-relaxed pt-0.5">
        {description}
      </P>
    </Div>
  );
}

function AngleRankCard({
  rank,
  title,
  reason,
  isTop,
}: {
  rank: string;
  title: string;
  reason: string;
  isTop: boolean;
}): JSX.Element {
  return (
    <Div
      className={`flex items-start gap-4 p-5 rounded-xl border ${isTop ? "bg-orange-950/30 border-orange-700/50" : "bg-gray-900 border-gray-700"}`}
    >
      <Div
        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${isTop ? "bg-orange-600 text-white" : "bg-gray-700 text-gray-300"}`}
      >
        {rank}
      </Div>
      <Div>
        <P
          className={`font-semibold mb-1 ${isTop ? "text-orange-200" : "text-gray-200"}`}
        >
          {title}
        </P>
        <Muted className="text-sm text-gray-400">{reason}</Muted>
      </Div>
    </Div>
  );
}

export function TanstackPage({ locale }: HackernewsPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  const bannedPatterns = [
    {
      name: t("bannedPatterns.any.name"),
      description: t("bannedPatterns.any.description"),
    },
    {
      name: t("bannedPatterns.unknown.name"),
      description: t("bannedPatterns.unknown.description"),
    },
    {
      name: t("bannedPatterns.object.name"),
      description: t("bannedPatterns.object.description"),
    },
    {
      name: t("bannedPatterns.asX.name"),
      description: t("bannedPatterns.asX.description"),
    },
    {
      name: t("bannedPatterns.throwStatements.name"),
      description: t("bannedPatterns.throwStatements.description"),
    },
    {
      name: t("bannedPatterns.hardcodedStrings.name"),
      description: t("bannedPatterns.hardcodedStrings.description"),
    },
  ];

  const angles = [
    {
      rank: t("angles.items.typescript.rank"),
      title: t("angles.items.typescript.title"),
      reason: t("angles.items.typescript.reason"),
      isTop: true,
    },
    {
      rank: t("angles.items.unifiedSurface.rank"),
      title: t("angles.items.unifiedSurface.title"),
      reason: t("angles.items.unifiedSurface.reason"),
      isTop: false,
    },
    {
      rank: t("angles.items.vibeSense.rank"),
      title: t("angles.items.vibeSense.title"),
      reason: t("angles.items.vibeSense.reason"),
      isTop: false,
    },
    {
      rank: t("angles.items.agentCoordination.rank"),
      title: t("angles.items.agentCoordination.title"),
      reason: t("angles.items.agentCoordination.reason"),
      isTop: false,
    },
    {
      rank: t("angles.items.freeSpeech.rank"),
      title: t("angles.items.freeSpeech.title"),
      reason: t("angles.items.freeSpeech.reason"),
      isTop: false,
    },
  ];

  const titleAlternatives = [
    t("titleAlternatives.items.alt1"),
    t("titleAlternatives.items.alt2"),
    t("titleAlternatives.items.alt3"),
    t("titleAlternatives.items.alt4"),
  ];

  return (
    <Div className="min-h-screen bg-[#f6f6ef] dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero - HN styled */}
      <Div className="bg-orange-500 border-b border-orange-600">
        <Div className="container mx-auto px-4 py-3 max-w-5xl">
          <Div className="flex items-center justify-between">
            <Div className="flex items-center gap-3">
              <Div className="w-5 h-5 bg-white/20 flex items-center justify-center font-bold text-white font-mono text-sm">
                Y
              </Div>
              <P className="font-mono text-white font-bold text-sm">
                {t("ui.hnSiteName")}
              </P>
            </Div>
            <P className="font-mono text-white/80 text-xs hidden sm:block">
              {t("ui.hnNavShort")}
            </P>
          </Div>
        </Div>
      </Div>

      <Div className="bg-orange-50 dark:bg-orange-950/20 border-b border-orange-200 dark:border-orange-900/50">
        <Div className="container mx-auto px-4 py-12 max-w-5xl">
          <Link
            href={`/${locale}/story/blog`}
            className="inline-flex items-center text-sm text-orange-700 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("hero.backToBlog")}
          </Link>

          <Div className="flex items-center gap-3 mb-6">
            <Div className="px-3 py-1 bg-orange-500 rounded-full text-white text-xs font-semibold uppercase tracking-wider font-mono">
              {t("hero.hnBadge")}
            </Div>
            <Div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/40 border border-orange-300 dark:border-orange-700 rounded-full text-orange-700 dark:text-orange-300 text-xs font-mono">
              {t("hero.hnSubtext")}
            </Div>
            <Muted className="text-xs text-gray-500">
              {t("hero.readTime")}
            </Muted>
          </Div>

          <H1 className="text-4xl md:text-5xl font-bold mb-6 font-mono">
            {t("hero.title")}
          </H1>
          <Lead className="text-xl text-gray-600 dark:text-gray-300">
            {t("hero.subtitle")}
          </Lead>
        </Div>
      </Div>

      <Div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Intro */}
        <Div className="mb-16">
          <H2 className="text-2xl font-bold mb-6">{t("intro.title")}</H2>
          <P className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
            {t("intro.paragraph1")}
          </P>
          <P className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {t("intro.paragraph2")}
          </P>
        </Div>

        {/* Option A */}
        <Div className="mb-12">
          <H2 className="text-2xl font-bold mb-6">{t("optionA.title")}</H2>
          <HnPostPreview
            title={t("optionA.hnTitle")}
            body={t("optionA.body")}
            badge={t("optionA.badge")}
            badgeColor="orange"
            isRecommended={true}
            hnNavFull={t("ui.hnNavFull")}
            hnPostMeta={t("ui.hnPostMeta")}
            hnRecommended={t("ui.hnRecommended")}
          />
          <Div className="mt-4 p-5 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-xl">
            <P className="text-sm text-orange-800 dark:text-orange-200 leading-relaxed">
              {t("optionA.reasoning")}
            </P>
          </Div>
        </Div>

        {/* Option B */}
        <Div className="mb-16">
          <H2 className="text-2xl font-bold mb-6">{t("optionB.title")}</H2>
          <HnPostPreview
            title={t("optionB.hnTitle")}
            body={t("optionB.body")}
            badge={t("optionB.badge")}
            badgeColor="blue"
            isRecommended={false}
            hnNavFull={t("ui.hnNavFull")}
            hnPostMeta={t("ui.hnPostMeta")}
            hnRecommended={t("ui.hnRecommended")}
          />
          <Div className="mt-4 p-5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
            <P className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              {t("optionB.reasoning")}
            </P>
          </Div>
        </Div>

        <Separator className="my-16" />

        {/* Banned Patterns */}
        <Div className="mb-16">
          <H2 className="text-2xl font-bold mb-3">
            {t("bannedPatterns.title")}
          </H2>
          <Muted className="text-base mb-8">
            {t("bannedPatterns.subtitle")}
          </Muted>
          <Div className="space-y-3">
            {bannedPatterns.map((pattern, index) => (
              <BannedPatternRow
                key={index}
                name={pattern.name}
                description={pattern.description}
              />
            ))}
          </Div>
        </Div>

        <Separator className="my-16" />

        {/* Vibe Sense angle */}
        <Div className="mb-16">
          <H2 className="text-2xl font-bold mb-3">{t("vibeSense.title")}</H2>
          <H3 className="text-lg font-semibold text-orange-500 mb-6">
            {t("vibeSense.subtitle")}
          </H3>
          <P className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            {t("vibeSense.description")}
          </P>

          <Card className="bg-gray-900 border-gray-700 mb-6">
            <CardHeader>
              <Div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-green-400" />
                <CardTitle className="text-green-400 text-sm font-mono">
                  {t("ui.hookForCommentsLabel")}
                </CardTitle>
              </Div>
            </CardHeader>
            <CardContent>
              <P className="text-gray-300 font-mono text-sm leading-relaxed italic">
                {`"${t("vibeSense.hookForComments")}"`}
              </P>
            </CardContent>
          </Card>

          <P className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("vibeSense.whyItMatters")}
          </P>
        </Div>

        <Separator className="my-16" />

        {/* Angles ranked */}
        <Div className="mb-16">
          <H2 className="text-2xl font-bold mb-3">{t("angles.title")}</H2>
          <Muted className="text-base mb-8">{t("angles.intro")}</Muted>
          <Div className="space-y-3">
            {angles.map((angle, index) => (
              <AngleRankCard
                key={index}
                rank={angle.rank}
                title={angle.title}
                reason={angle.reason}
                isTop={angle.isTop}
              />
            ))}
          </Div>
        </Div>

        <Separator className="my-16" />

        {/* Title alternatives */}
        <Div className="mb-16">
          <H2 className="text-2xl font-bold mb-8">
            {t("titleAlternatives.title")}
          </H2>
          <Div className="space-y-3">
            {titleAlternatives.map((alt, index) => (
              <Div
                key={index}
                className="flex items-start gap-3 p-4 bg-[#f6f6ef] dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-orange-400 dark:hover:border-orange-600 transition-colors cursor-default"
              >
                <Div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 mt-0.5" />
                <P className="text-sm font-mono text-gray-700 dark:text-gray-300 leading-relaxed">
                  {alt}
                </P>
              </Div>
            ))}
          </Div>
        </Div>

        <Separator className="my-16" />

        {/* Decision */}
        <Div className="mb-16">
          <H2 className="text-2xl font-bold mb-6">{t("decision.title")}</H2>

          <Card className="bg-orange-50 dark:bg-orange-950/30 border-orange-400 dark:border-orange-700 border-2">
            <CardHeader>
              <Div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-orange-500" />
                <CardTitle className="text-orange-600 dark:text-orange-400 text-xl font-mono">
                  {t("decision.option")}
                </CardTitle>
              </Div>
            </CardHeader>
            <CardContent>
              <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {t("decision.reasoning")}
              </P>
              <Div className="flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Link
                    href="https://github.com/techfreaque/next-vibe"
                    target="_blank"
                  >
                    {t("decision.cta")}
                  </Link>
                </Button>
                <Muted className="font-mono text-sm">
                  {t("decision.github")}
                </Muted>
              </Div>
            </CardContent>
          </Card>
        </Div>

        <Div className="flex justify-start pt-8">
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

export default async function HackernewsPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
