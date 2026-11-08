/**
 * Public model page: /[locale]/models/[modelId]
 * One page per chat model, built from the model registry.
 */

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { RefusalPublicRepository } from "next-vibe/agent/refusal-index/repository";
import type { ModelStatsResponseOutput } from "next-vibe/agent/refusal-index/model/[modelId]/definition";
import { createEndpointLogger } from "next-vibe/logger/server";
import { notFound } from "next-vibe/ui/lib/not-found";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import {
  findPublicModelId,
  formatTokenCount,
  getModelFacts,
  type ModelFacts,
  type ModelRef,
  suggestComparisons,
  buildPickerModels,
  type PickerModel,
} from "../_shared/model-facts";
import { formatNumber, tierName } from "../_shared/model-format";
import {
  findMediaFacts,
  type MediaModelFacts,
} from "../_shared/model-media-facts";
import { MODELS_OG_IMAGE } from "../constants";
import { scopedTranslation } from "../i18n";
import { ModelPageClient } from "./page-client";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage; modelId: string }>;
}

function resolveFacts(modelId: string): ModelFacts | null {
  const id = findPublicModelId(modelId);
  return id === null ? null : getModelFacts(id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, modelId } = await params;
  const facts = resolveFacts(modelId);
  if (facts === null) {
    const media = findMediaFacts(modelId);
    if (media === null) {
      notFound();
    }
    return mediaMetadata(locale, media);
  }
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const vars = {
    appName,
    model: facts.name,
    lab: facts.labName,
    tier: tierName(facts.content, locale),
    context: formatTokenCount(facts.contextWindow),
    price: formatNumber(facts.creditsPerMessage, locale),
  };
  return metadataGenerator(locale, {
    path: `models/${facts.slug}`,
    title: t("meta.model.title", vars),
    category: t("meta.category"),
    description: t("meta.model.description", vars),
    image: MODELS_OG_IMAGE,
    imageAlt: t("meta.model.imageAlt", vars),
    keywords: [t("meta.model.keywords", vars)],
  });
}

function mediaMetadata(
  locale: CountryLanguage,
  facts: MediaModelFacts,
): Metadata {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const vars = {
    appName: configT("appName"),
    model: facts.name,
    lab: facts.labName,
    tier: tierName(facts.content, locale),
    type: t(`catalog.types.${facts.type}`),
  };
  return metadataGenerator(locale, {
    path: `models/${facts.slug}`,
    title: t("meta.media.title", vars),
    category: t("meta.category"),
    description: t("meta.media.description", vars),
    image: MODELS_OG_IMAGE,
    imageAlt: t("meta.media.imageAlt", vars),
    keywords: [t("meta.media.keywords", vars)],
  });
}

export interface ChatModelPageData {
  kind: "chat";
  locale: CountryLanguage;
  facts: ModelFacts;
  comparisons: ModelRef[];
  pickerModels: PickerModel[];
  refusal: ModelStatsResponseOutput | null;
}

export interface MediaModelPageData {
  kind: "media";
  locale: CountryLanguage;
  facts: MediaModelFacts;
}

export type ModelPageData = ChatModelPageData | MediaModelPageData;

export async function tanstackLoader({
  params,
}: Props): Promise<ModelPageData> {
  const { locale, modelId } = await params;
  const facts = resolveFacts(modelId);
  if (facts === null) {
    const media = findMediaFacts(modelId);
    if (media === null) {
      notFound();
    }
    return { kind: "media", locale, facts: media };
  }
  const logger = createEndpointLogger(false, locale);
  const stats = await RefusalPublicRepository.modelStats(
    { modelId: facts.id },
    logger,
    locale,
  );
  return {
    kind: "chat",
    locale,
    facts,
    comparisons: suggestComparisons(facts),
    pickerModels: buildPickerModels(facts),
    refusal: stats.success ? stats.data : null,
  };
}

export function TanstackPage(data: ModelPageData): JSX.Element {
  return <ModelPageClient {...data} />;
}

export default async function ModelPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
