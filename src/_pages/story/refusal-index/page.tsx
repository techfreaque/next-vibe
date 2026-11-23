/**
 * Public Refusal Index: /[locale]/story/refusal-index
 * Weekly benchmark leaderboard - who answers, who hedges, who refuses.
 */

import type { Metadata } from "next";
import type { LeaderboardResponseOutput } from "next-vibe/agent/refusal-index/leaderboard/definition";
import { RefusalPublicRepository } from "next-vibe/agent/refusal-index/repository";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { hreflangFor } from "next-vibe/core/i18n/core/seo-locales";
import { createEndpointLogger } from "next-vibe/logger/server";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import {
  buildBreadcrumbList,
  organizationNode,
  pageUrl,
} from "../../_components/structured-data";
import { scopedTranslation } from "./i18n";
import { RefusalIndexClient } from "./page-client";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "story/refusal-index",
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description", { appName }),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords", { appName })],
  });
}

export interface RefusalIndexPageData {
  locale: CountryLanguage;
  leaderboard: LeaderboardResponseOutput | null;
}

export async function tanstackLoader({
  params,
}: Props): Promise<RefusalIndexPageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, locale);
  const result = await RefusalPublicRepository.leaderboard(logger, locale);
  return { locale, leaderboard: result.success ? result.data : null };
}

export function TanstackPage(data: RefusalIndexPageData): JSX.Element {
  const { locale, leaderboard } = data;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const path = "/story/refusal-index";
  return (
    <>
      <JsonLd
        id="refusal-index-structured-data"
        data={{
          "@context": "https://schema.org",
          "@graph": [
            buildBreadcrumbList(locale, [{ name: t("hero.eyebrow"), path }]),
            ...(leaderboard?.hasData
              ? [
                  {
                    "@type": "Dataset",
                    "@id": `${pageUrl(locale, path)}#dataset`,
                    name: t("hero.eyebrow"),
                    description: t("meta.description", {
                      appName: configT("appName"),
                    }),
                    url: pageUrl(locale, path),
                    inLanguage: hreflangFor(locale),
                    creator: organizationNode(locale),
                    isAccessibleForFree: true,
                    ...(leaderboard.runFinishedAt
                      ? { dateModified: leaderboard.runFinishedAt }
                      : {}),
                  },
                ]
              : []),
          ],
        }}
      />
      <RefusalIndexClient {...data} />
    </>
  );
}

export default async function RefusalIndexPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
