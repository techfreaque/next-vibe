import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Github } from "next-vibe/ui/components/icons/Github";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { GITHUB_REPO_URL } from "@/env/constants";
import { configScopedTranslation } from "@/env/i18n";

import {
  ArticleBody,
  ArticleCode,
  ArticleEnd,
  ArticleHeader,
  ArticleLead,
  ArticleP,
  ArticleQuote,
  ArticleSection,
} from "../../_shared/article";
import { Cta } from "../../_shared/marketing";
import { formatPostDate } from "../posts-meta";
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
    modelCount: getAvailableChatModelCount(false, await getEnvAvailability()),
  };
}

export function TanstackPage({
  locale,
  modelCount,
}: OneEndpointPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };

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
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        date={formatPostDate("one-endpoint-every-surface", locale)}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>{t("intro.paragraph1")}</ArticleLead>
          <ArticleP>{t("intro.paragraph2", { appName, modelCount })}</ArticleP>
        </Div>

        <ArticleSection
          title={t("typeRules.title")}
          intro={t("typeRules.subtitle")}
        >
          <ArticleP>{t("typeRules.intro")}</ArticleP>
          <Div className="grid gap-3 sm:grid-cols-2">
            {typeRules.map((rule) => (
              <Div
                key={rule.name}
                className="rounded-xl border border-border bg-card p-5"
              >
                <Span className="inline-block rounded-md border border-destructive/25 bg-destructive/10 px-2 py-0.5 font-mono text-sm font-semibold text-destructive">
                  {rule.name}
                </Span>
                <P className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {rule.description}
                </P>
              </Div>
            ))}
          </Div>
        </ArticleSection>

        <ArticleSection
          title={t("vibeSense.title")}
          intro={t("vibeSense.subtitle")}
        >
          <ArticleP>{t("vibeSense.description")}</ArticleP>
          <ArticleQuote>{t("vibeSense.quote")}</ArticleQuote>
          <ArticleP>{t("vibeSense.whyItMatters")}</ArticleP>
        </ArticleSection>

        <ArticleCode code={t("cta.clone")} language="bash" />

        <ArticleEnd
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle")}
          actions={
            <>
              <Cta
                href={GITHUB_REPO_URL}
                label={t("cta.github")}
                icon={Github}
                external
              />
              <Cta
                href={`/${locale}/story/framework`}
                label={t("cta.framework")}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function OneEndpointPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
