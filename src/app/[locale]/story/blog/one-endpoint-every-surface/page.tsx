import type { Metadata } from "next";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { Link } from "next-vibe-ui/ui/link";
import { Separator } from "next-vibe-ui/ui/separator";
import { H1, H2, Muted, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { agentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { getAvailableModelCount } from "@/app/api/[locale]/agent/models/all-models";
import { configScopedTranslation } from "@/config/i18n";
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
    path: "story/blog/one-endpoint-every-surface",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description"),
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070",
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
  });
};

export interface OneEndpointPageData {
  locale: CountryLanguage;
  modelCount: number;
}

export async function tanstackLoader({
  params,
}: Props): Promise<OneEndpointPageData> {
  const { locale } = await params;
  return {
    locale,
    modelCount: getAvailableModelCount(agentEnvAvailability, false),
  };
}

function TypeRuleRow({
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

export function TanstackPage({
  locale,
  modelCount,
}: OneEndpointPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  const typeRules = [
    {
      name: t("typeRules.any.name"),
      description: t("typeRules.any.description"),
    },
    {
      name: t("typeRules.unknown.name"),
      description: t("typeRules.unknown.description"),
    },
    {
      name: t("typeRules.object.name"),
      description: t("typeRules.object.description"),
    },
    {
      name: t("typeRules.asX.name"),
      description: t("typeRules.asX.description"),
    },
    {
      name: t("typeRules.throwStatements.name"),
      description: t("typeRules.throwStatements.description"),
    },
    {
      name: t("typeRules.hardcodedStrings.name"),
      description: t("typeRules.hardcodedStrings.description"),
    },
  ];

  return (
    <Div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <Div className="relative bg-gray-950 text-white overflow-hidden">
        <Div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-gray-950 to-purple-900/30" />

        <Div className="container mx-auto px-4 py-20 relative z-10 max-w-4xl">
          <Link
            href={`/${locale}/story/blog`}
            className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-10 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("hero.backToBlog")}
          </Link>

          <Div className="flex items-center gap-3 mb-6">
            <Div className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wide">
              {t("hero.category")}
            </Div>
            <Div className="flex items-center gap-1.5 text-gray-400 text-sm">
              <Clock className="h-3.5 w-3.5" />
              {t("hero.readTime")}
            </Div>
          </Div>

          <H1 className="text-4xl md:text-6xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-linear-to-r from-white via-blue-100 to-purple-200">
            {t("hero.title")}
          </H1>

          <P className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
            {t("hero.subtitle")}
          </P>
        </Div>
      </Div>

      {/* Article body */}
      <Div className="container mx-auto px-4 py-16 max-w-4xl space-y-16">
        {/* Intro */}
        <Div>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5 text-lg">
            {t("intro.paragraph1")}
          </P>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            {t("intro.paragraph2", { appName, modelCount })}
          </P>
        </Div>

        <Separator />

        {/* Type rules */}
        <Div>
          <H2 className="text-2xl font-bold mb-3">{t("typeRules.title")}</H2>
          <Muted className="mb-6">{t("typeRules.subtitle")}</Muted>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            {t("typeRules.intro")}
          </P>
          <Div className="space-y-3">
            {typeRules.map((rule, index) => (
              <TypeRuleRow
                key={index}
                name={rule.name}
                description={rule.description}
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
              {`"${t("vibeSense.quote")}"`}
            </P>
          </Div>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("vibeSense.whyItMatters")}
          </P>
        </Div>

        <Separator />

        {/* CTA */}
        <Div className="space-y-4">
          <Button asChild>
            <Link
              href="https://github.com/techfreaque/next-vibe"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("cta.github")}
            </Link>
          </Button>
          <Div className="font-mono text-sm text-muted-foreground">
            {t("cta.clone")}
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

export default async function OneEndpointPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
