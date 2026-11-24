/**
 * Server half of a versus page: loader + metadata. Kept apart from
 * ./versus-page.tsx because it reads env availability (server-only): the
 * client strip only removes server exports from page.tsx itself, so a shared
 * module must not mix both.
 */

import type { Metadata } from "next";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";

import {
  canonicalComparisonPath,
  getModelFacts,
  OWN_WORLDVIEW_UNCENSORED_MODEL_ID,
} from "../../../models/_shared/model-facts";
import { scopedTranslation } from "../i18n";
import { type VersusKey, versusPath } from "./platforms";
import { loadUsFacts, usParams } from "./us-facts";
import {
  pageParams,
  type VersusFeaturedModel,
  type VersusPageData,
} from "./versus-page";

/**
 * The platform's own flagship model when we serve it through its API: the
 * versus page links its model page and a head-to-head against the
 * comparison model (UncensoredLM, or GLM 5.3 Uncensored for UncensoredLM).
 */
const VERSUS_FEATURED_MODEL: Partial<Record<VersusKey, ChatModelId>> = {
  venice: ChatModelId.VENICE_UNCENSORED,
  freedomGpt: ChatModelId.FREEDOMGPT_LIBERTY,
  gabAi: ChatModelId.GAB_AI_ARYA,
  uncensoredAi: ChatModelId.UNCENSORED_LM_V1_2,
};

async function loadFeaturedModel(
  versus: VersusKey,
): Promise<VersusFeaturedModel | null> {
  const id = VERSUS_FEATURED_MODEL[versus];
  if (id === undefined) {
    return null;
  }
  const availability = await getEnvAvailability();
  const model = getModelFacts(id, availability);
  const otherId =
    id === OWN_WORLDVIEW_UNCENSORED_MODEL_ID
      ? ChatModelId.GLM_5_3_UNCENSORED
      : OWN_WORLDVIEW_UNCENSORED_MODEL_ID;
  const other = getModelFacts(otherId, availability);
  if (model === null || model.isLegacy) {
    return null;
  }
  return {
    name: model.name.trim(),
    slug: model.slug,
    compare:
      other === null || other.isLegacy
        ? null
        : {
            name: other.name.trim(),
            path: canonicalComparisonPath(model, other),
          },
  };
}

export interface VersusProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function loadVersusPage(
  versus: VersusKey,
  { params }: VersusProps,
): Promise<VersusPageData> {
  const { locale } = await params;
  const [facts, featured] = await Promise.all([
    loadUsFacts(locale),
    loadFeaturedModel(versus),
  ]);
  return { locale, versus, params: usParams(facts), featured };
}

export async function buildVersusMetadata(
  versus: VersusKey,
  props: VersusProps,
): Promise<Metadata> {
  const data = await loadVersusPage(versus, props);
  const { t } = scopedTranslation.scopedT(data.locale);
  const stats = pageParams(data);
  return metadataGenerator(data.locale, {
    path: versusPath(versus).slice(1),
    title: t(`versus.${versus}.meta.title`, stats),
    category: t("common.category"),
    description: t(`versus.${versus}.meta.description`, stats),
    imageAlt: t("common.versusImageAlt", stats),
    keywords: [t(`versus.${versus}.meta.keywords`, stats)],
  });
}
