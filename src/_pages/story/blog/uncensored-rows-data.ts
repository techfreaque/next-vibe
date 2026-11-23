/**
 * Server-side loaders for the blog model rows (see ./uncensored-rows). Kept
 * apart from the rendered table because they read the instance's env
 * availability, which is server-only: page modules import these in their
 * tanstackLoader only, so the client bundle never pulls them in.
 */

import type { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { isUncensoredContent } from "next-vibe/agent/models/uncensored-consent/constants";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

import {
  canonicalComparisonPath,
  CONTENT_TIER_ORDER,
  getModelFacts,
  listModelFacts,
  type ModelFacts,
} from "@/_pages/models/_shared/model-facts";
import {
  chatHref,
  formatMoney,
  isApiCallable,
  strengthList,
  tierName,
  uncensoredKind,
} from "@/_pages/models/_shared/model-format";
import { scopedTranslation as modelsScopedTranslation } from "@/_pages/models/i18n";

import type { ComparePair, UncensoredRow } from "./uncensored-rows";

function toRow(facts: ModelFacts, locale: CountryLanguage): UncensoredRow {
  const { t: modelsT } = modelsScopedTranslation.scopedT(locale);
  return {
    id: facts.id,
    slug: facts.slug,
    name: facts.name.trim(),
    kind: uncensoredKind(facts),
    tier: tierName(facts.content, locale),
    contextWindow: facts.contextWindow,
    contextPages: facts.contextPages,
    creditsPerMessage: facts.creditsPerMessage,
    messagePrice: formatMoney(facts.creditsPerMessage, locale),
    parameterCount: facts.parameterCount,
    strengths: [...facts.strengths],
    strengthText: strengthList(facts, modelsT),
    supportsTools: facts.supportsTools,
    apiCallable: isApiCallable(facts),
    chatHref: chatHref(locale, facts),
  };
}

/** Current uncensored chat models on this instance, cheapest first. */
export async function loadUncensoredRows(
  locale: CountryLanguage,
): Promise<UncensoredRow[]> {
  const availability = await getEnvAvailability();
  return listModelFacts(availability)
    .filter((facts) => !facts.isLegacy && isUncensoredContent(facts.content))
    .toSorted(
      (a, b) =>
        a.creditsPerMessage - b.creditsPerMessage ||
        a.name.localeCompare(b.name),
    )
    .map((facts) => toRow(facts, locale));
}

function liveFacts(
  id: ChatModelId,
  availability: AgentEnvAvailability,
): ModelFacts | null {
  const facts = getModelFacts(id, availability);
  return facts === null || facts.isLegacy ? null : facts;
}

/** Rows for hand-picked models, in the given order, live and current only. */
export async function loadModelRowsByIds(
  ids: readonly ChatModelId[],
  locale: CountryLanguage,
): Promise<UncensoredRow[]> {
  const availability = await getEnvAvailability();
  return ids.flatMap((id) => {
    const facts = liveFacts(id, availability);
    return facts === null ? [] : [toRow(facts, locale)];
  });
}

/**
 * The cheapest current text chat models per content tier, `perTier` each,
 * in the catalog's tier order (least filtered first).
 */
export async function loadCheapestRowsByTier(
  locale: CountryLanguage,
  perTier: number,
): Promise<UncensoredRow[]> {
  const availability = await getEnvAvailability();
  const models = listModelFacts(availability).filter(
    (facts) => !facts.isLegacy && facts.outputs.join() === "text",
  );
  return CONTENT_TIER_ORDER.flatMap((tier) =>
    models
      .filter((facts) => facts.content === tier)
      .toSorted(
        (a, b) =>
          a.creditsPerMessage - b.creditsPerMessage ||
          a.name.localeCompare(b.name),
      )
      .slice(0, perTier)
      .map((facts) => toRow(facts, locale)),
  );
}

/** Compare-page pairs whose two sides are both live and current. */
export async function loadComparePairs(
  pairs: readonly (readonly [ChatModelId, ChatModelId])[],
): Promise<ComparePair[]> {
  const availability = await getEnvAvailability();
  return pairs.flatMap(([aId, bId]): ComparePair[] => {
    const a = liveFacts(aId, availability);
    const b = liveFacts(bId, availability);
    if (a === null || b === null) {
      return [];
    }
    return [
      {
        a: { slug: a.slug, name: a.name.trim() },
        b: { slug: b.slug, name: b.name.trim() },
        path: canonicalComparisonPath(a, b),
      },
    ];
  });
}
