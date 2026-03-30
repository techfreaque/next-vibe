import type { Metadata } from "next";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Hash } from "next-vibe-ui/ui/icons/Hash";
import { Link } from "next-vibe-ui/ui/link";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, Muted, P } from "next-vibe-ui/ui/typography";
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

function BannedPatternRow({
  name,
  description,
}: {
  name: string;
  description: string;
}): JSX.Element {
  return (
    <Div className="flex items-start gap-4 p-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
      <Div className="flex-shrink-0 px-3 py-1 bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 rounded font-mono text-red-700 dark:text-red-400 text-sm font-bold">
        {name}
      </Div>
      <P className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed pt-0.5">
        {description}
      </P>
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

  const alternatives = [
    t("alternatives.items.alt1"),
    t("alternatives.items.alt2"),
    t("alternatives.items.alt3"),
    t("alternatives.items.alt4"),
  ];

  return (
    <Div className="min-h-screen bg-background">
      {/* Header bar */}
      <Div className="bg-orange-500 border-b border-orange-600">
        <Div className="container mx-auto px-4 py-3 max-w-4xl">
          <Div className="flex items-center gap-3">
            <Div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-white">
              <Hash className="h-4 w-4" />
            </Div>
            <P className="text-white font-semibold text-sm">
              {t("hero.category")}
            </P>
          </Div>
        </Div>
      </Div>

      {/* Hero */}
      <Div className="bg-orange-50 dark:bg-orange-950/20 border-b border-orange-100 dark:border-orange-900/40">
        <Div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link
            href={`/${locale}/story/blog`}
            className="inline-flex items-center text-sm text-orange-700 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("hero.backToBlog")}
          </Link>

          <Div className="flex items-center gap-3 mb-6">
            <Div className="px-3 py-1 bg-orange-500 rounded-full text-white text-xs font-semibold uppercase tracking-wider">
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
        {/* The post */}
        <Div>
          <Div className="flex items-center gap-2 mb-6">
            <Span className="text-xs font-semibold uppercase tracking-widest text-orange-500">
              {t("post.label")}
            </Span>
          </Div>
          <Div className="prose prose-gray dark:prose-invert max-w-none">
            {t("post.body")
              .split("\n\n")
              .map((paragraph, i) => (
                <P
                  key={i}
                  className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5 text-lg"
                >
                  {paragraph}
                </P>
              ))}
          </Div>
          <Div className="mt-6 p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-sm text-orange-800 dark:text-orange-200">
            {t("post.note")}
          </Div>
        </Div>

        <Separator />

        {/* Behind the post */}
        <Div>
          <Div className="flex items-center gap-2 mb-6">
            <Span className="text-xs font-semibold uppercase tracking-widest text-orange-500">
              {t("behind.label")}
            </Span>
          </Div>
          <Muted className="mb-8">{t("behind.subtitle")}</Muted>

          <H2 className="text-2xl font-bold mb-4">{t("whyAngle.title")}</H2>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t("whyAngle.p1")}
          </P>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("whyAngle.p2")}
          </P>
        </Div>

        <Separator />

        {/* Banned patterns */}
        <Div>
          <H2 className="text-2xl font-bold mb-3">
            {t("bannedPatterns.title")}
          </H2>
          <Muted className="mb-8">{t("bannedPatterns.subtitle")}</Muted>
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

        <Separator />

        {/* Vibe Sense */}
        <Div>
          <H2 className="text-2xl font-bold mb-2">{t("vibeSense.title")}</H2>
          <Muted className="mb-6">{t("vibeSense.subtitle")}</Muted>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {t("vibeSense.description")}
          </P>
          <Div className="p-5 rounded-xl bg-gray-900 border border-gray-700 mb-6">
            <P className="text-gray-300 font-mono text-sm leading-relaxed italic">
              {`"${t("vibeSense.hookForComments")}"`}
            </P>
          </Div>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("vibeSense.whyItMatters")}
          </P>
        </Div>

        <Separator />

        {/* Title alternatives */}
        <Div>
          <H2 className="text-2xl font-bold mb-8">{t("alternatives.title")}</H2>
          <Div className="space-y-3">
            {alternatives.map((alt, index) => (
              <Div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-muted/20"
              >
                <Div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 mt-0.5" />
                <P className="text-sm font-mono text-gray-700 dark:text-gray-300 leading-relaxed">
                  {alt}
                </P>
              </Div>
            ))}
          </Div>
        </Div>

        <Separator />

        <Div>
          <Button
            asChild
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Link
              href="https://github.com/techfreaque/next-vibe"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("cta.github")}
            </Link>
          </Button>
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

export default async function HackernewsPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
