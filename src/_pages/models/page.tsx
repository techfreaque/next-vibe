/**
 * Public model directory: /[locale]/models
 * Every public chat model grouped by content tier, with search.
 */

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import { listModelFacts, type ModelFacts } from "./_shared/model-facts";
import { MODELS_OG_IMAGE } from "./constants";
import { scopedTranslation } from "./i18n";
import { ModelsIndexClient } from "./page-client";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const count = listModelFacts().filter((facts) => !facts.isLegacy).length;
  return metadataGenerator(locale, {
    path: "models",
    title: t("meta.index.title", { appName, count }),
    category: t("meta.category"),
    description: t("meta.index.description", { appName }),
    image: MODELS_OG_IMAGE,
    imageAlt: t("meta.index.imageAlt", { appName }),
    keywords: [t("meta.index.keywords", { appName })],
  });
}

export interface ModelsIndexPageData {
  locale: CountryLanguage;
  models: ModelFacts[];
}

export async function tanstackLoader({
  params,
}: Props): Promise<ModelsIndexPageData> {
  const { locale } = await params;
  return { locale, models: listModelFacts() };
}

export function TanstackPage(data: ModelsIndexPageData): JSX.Element {
  return <ModelsIndexClient {...data} />;
}

export default async function ModelsIndexPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
