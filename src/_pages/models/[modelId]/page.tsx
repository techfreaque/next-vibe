/**
 * Public model page: /[locale]/models/[modelId]
 * One page per chat model, built from the model registry.
 *
 * Server-only helpers (redirects, SEO content, JSON-LD) live in
 * ../_shared/model-page-loaders so the client build of this file keeps none
 * of them (see that module's header).
 */

import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import type { ModelStatsResponseOutput } from "next-vibe/agent/refusal-index/model/[modelId]/definition";
import { RefusalPublicRepository } from "next-vibe/agent/refusal-index/repository";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { createEndpointLogger } from "next-vibe/logger/server";
import { JsonLd, type JsonLdNode } from "next-vibe/ui/components/json-ld";
import { notFound } from "next-vibe/ui/lib/not-found";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import {
  buildPickerModels,
  type ModelFacts,
  type ModelRef,
  type PickerModel,
  suggestComparisons,
} from "../_shared/model-facts";
import { tierName } from "../_shared/model-format";
import type { MediaModelFacts } from "../_shared/model-media-facts";
import {
  buildChatModelPageSeo,
  buildMediaModelPageSeo,
  resolveMediaModelFacts,
  resolveModelFacts,
} from "../_shared/model-page-loaders";
import { chatModelMeta, mediaModelMeta } from "../_shared/model-seo";
import {
  type ModelSeoContent,
  ModelSeoSections,
} from "../_shared/model-seo-sections";
import { scopedTranslation } from "../i18n";
import { ModelPageClient } from "./page-client";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage; modelId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, modelId } = await params;
  const availability = await getEnvAvailability();
  const facts = resolveModelFacts(locale, modelId, availability);
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  if (facts === null) {
    const media = resolveMediaModelFacts(locale, modelId, availability);
    if (media === null) {
      notFound();
    }
    const mediaVars = {
      appName: configT("appName"),
      model: media.name,
      lab: media.labName,
      tier: tierName(media.content, locale),
      type: t(`catalog.types.${media.type}`),
    };
    const mediaMeta = mediaModelMeta(media, locale);
    return metadataGenerator(locale, {
      path: `models/${media.slug}`,
      title: mediaMeta.title,
      category: t("meta.category"),
      description: mediaMeta.description,
      imageAlt: t("meta.media.imageAlt", mediaVars),
      keywords: [t("meta.media.keywords", mediaVars)],
    });
  }
  const vars = {
    appName: configT("appName"),
    model: facts.name,
    lab: facts.labName,
  };
  const meta = chatModelMeta(facts, locale);
  return metadataGenerator(locale, {
    path: `models/${facts.slug}`,
    title: meta.title,
    category: t("meta.category"),
    description: meta.description,
    imageAlt: t("meta.model.imageAlt", vars),
    keywords: [t("meta.model.keywords", vars)],
  });
}

export interface ChatModelPageData {
  kind: "chat";
  locale: CountryLanguage;
  facts: ModelFacts;
  comparisons: ModelRef[];
  pickerModels: PickerModel[];
  refusal: ModelStatsResponseOutput | null;
  seo: ModelSeoContent;
  /** Service + BreadcrumbList JSON-LD. */
  structuredData: JsonLdNode;
}

export interface MediaModelPageData {
  kind: "media";
  locale: CountryLanguage;
  facts: MediaModelFacts;
  seo: ModelSeoContent;
  structuredData: JsonLdNode;
}

export type ModelPageData = ChatModelPageData | MediaModelPageData;

export async function tanstackLoader({
  params,
}: Props): Promise<ModelPageData> {
  const { locale, modelId } = await params;
  const availability = await getEnvAvailability();
  const facts = resolveModelFacts(locale, modelId, availability);
  if (facts === null) {
    const media = resolveMediaModelFacts(locale, modelId, availability);
    if (media === null) {
      notFound();
    }
    return {
      kind: "media",
      locale,
      facts: media,
      ...buildMediaModelPageSeo(media, locale, availability),
    };
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
    comparisons: suggestComparisons(facts, availability),
    pickerModels: buildPickerModels(facts, availability),
    refusal: stats.success ? stats.data : null,
    ...buildChatModelPageSeo(facts, locale, availability),
  };
}

export function TanstackPage(data: ModelPageData): JSX.Element {
  const { structuredData, seo, ...clientData } = data;
  return (
    <>
      <JsonLd id="model-structured-data" data={structuredData} />
      <ModelPageClient
        {...clientData}
        sections={
          <ModelSeoSections
            locale={data.locale}
            model={data.facts.name}
            content={seo}
          />
        }
      />
    </>
  );
}

export default async function ModelPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
