/**
 * Model facts for the public /models pages (index, per-model, compare).
 *
 * Pure + static: everything derives from chatModelDefinitions and the chat
 * option pool, so the pages stay in sync with the registry without any DB or
 * hand-maintained copy. Only models a public visitor can actually use are
 * listed (at least one non-admin provider, not auto-disabled). Legacy models
 * keep their page - old names still get searched - and point at their
 * successor.
 */

import {
  chatModelDefinitions,
  ChatModelId,
  type ChatModelOption,
  chatModelOptionsPool,
  chatModelSuccessors,
} from "next-vibe/agent/ai-stream/models";
import type { AgentTranslationKey } from "next-vibe/agent/i18n";
import { type Modality, ModelUtility } from "next-vibe/agent/models/enum";
import {
  apiProviderDisplayNames,
  calculateCreditCost,
  type ModelDefinition,
  modelProviders,
} from "next-vibe/agent/models/models";
import {
  ContentLevel,
  type ContentLevelValue,
  type IntelligenceLevelValue,
} from "next-vibe/agent/skills/enum";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";

import { CREDIT_VALUE_USD } from "@/products/constants";

/**
 * Reference message for "price per message" - the same "Normal chat" scenario
 * ModelCreditDisplay uses for its badge, so the numbers on these pages match
 * what the model selector shows.
 */
export const REFERENCE_INPUT_TOKENS = 16_000;
export const REFERENCE_OUTPUT_TOKENS = 1_500;

/** Rough tokens per printed page of prose (~500 words). */
const TOKENS_PER_PAGE = 650;

/** Display order of the tiers on the index page: least filtered first. */
export const CONTENT_TIER_ORDER: readonly (typeof ContentLevelValue)[] = [
  ContentLevel.UNCENSORED,
  ContentLevel.OPEN,
  ContentLevel.MAINSTREAM,
];

export interface ModelRef {
  id: ChatModelId;
  slug: string;
  name: string;
}

export interface ModelFacts extends ModelRef {
  icon: IconKey;
  labName: string;
  description: AgentTranslationKey;
  content: typeof ContentLevelValue;
  intelligence: typeof IntelligenceLevelValue;
  contextWindow: number;
  /** Context window expressed as printed pages of prose. */
  contextPages: number;
  inputs: Modality[];
  outputs: Modality[];
  /** Public API providers serving this model (display names, cheapest first). */
  providers: string[];
  supportsTools: boolean;
  /** Credits for one reference message on the cheapest public provider. */
  creditsPerMessage: number;
  /** How many reference messages one unit of currency ($1 / 1 €) buys. Null when free. */
  messagesPerCurrencyUnit: number | null;
  isLegacy: boolean;
  successor: ModelRef | null;
}

/** URL slug: dots and underscores break dev-server routing and read badly. */
export function toModelSlug(id: string): string {
  return id.toLowerCase().replaceAll(/[._]+/g, "-");
}

function isPublicDefinition(def: ModelDefinition): boolean {
  if (def.enabled === false && def.enabledWithoutPrice !== true) {
    return false;
  }
  return def.providers.some((provider) => provider.adminOnly !== true);
}

function publicOptionsFor(id: ChatModelId): ChatModelOption[] {
  return chatModelOptionsPool.filter(
    (option) => option.id === id && option.adminOnly !== true,
  );
}

/** Every chat model a public visitor can use, in registry order. */
export const PUBLIC_CHAT_MODEL_IDS: readonly ChatModelId[] = Object.values(
  ChatModelId,
).filter(
  (id) =>
    isPublicDefinition(chatModelDefinitions[id]) &&
    publicOptionsFor(id).length > 0,
);

const idBySlug = new Map<string, ChatModelId>(
  PUBLIC_CHAT_MODEL_IDS.map((id) => [toModelSlug(id), id]),
);

/** Resolve a URL segment (slug, or the raw model id) to a public model. */
export function findPublicModelId(segment: string): ChatModelId | null {
  const decoded = decodeURIComponent(segment).toLowerCase();
  return (
    idBySlug.get(decoded) ??
    idBySlug.get(decoded.replaceAll(/[._]+/g, "-")) ??
    null
  );
}

function toRef(id: ChatModelId): ModelRef {
  return { id, slug: toModelSlug(id), name: chatModelDefinitions[id].name };
}

function resolveSuccessor(id: ChatModelId): ModelRef | null {
  const seen = new Set<ChatModelId>([id]);
  let next = chatModelSuccessors[id];
  while (next !== undefined && !seen.has(next)) {
    if (PUBLIC_CHAT_MODEL_IDS.includes(next)) {
      const nextDef = chatModelDefinitions[next];
      if (!nextDef.utilities.includes(ModelUtility.LEGACY)) {
        return toRef(next);
      }
    }
    seen.add(next);
    next = chatModelSuccessors[next];
  }
  return null;
}

function roundCredits(value: number): number {
  return Math.round(value * 100) / 100;
}

export function getModelFacts(id: ChatModelId): ModelFacts | null {
  if (!PUBLIC_CHAT_MODEL_IDS.includes(id)) {
    return null;
  }
  const def = chatModelDefinitions[id];
  const options = publicOptionsFor(id);

  const costs = options.map((option) =>
    calculateCreditCost(
      option,
      REFERENCE_INPUT_TOKENS,
      REFERENCE_OUTPUT_TOKENS,
    ),
  );
  const creditsPerMessage = roundCredits(Math.min(...costs));
  const creditsPerUnit = 1 / CREDIT_VALUE_USD;

  const providers: string[] = [];
  for (const option of options) {
    const label = apiProviderDisplayNames[option.apiProvider];
    if (!providers.includes(label)) {
      providers.push(label);
    }
  }

  const isLegacy = def.utilities.includes(ModelUtility.LEGACY);

  return {
    ...toRef(id),
    icon: def.icon,
    labName: modelProviders[def.by]?.name ?? def.by,
    description: def.description,
    content: def.content,
    intelligence: def.intelligence,
    contextWindow: def.contextWindow,
    contextPages: Math.max(1, Math.round(def.contextWindow / TOKENS_PER_PAGE)),
    inputs: def.inputs,
    outputs: def.outputs,
    providers,
    supportsTools: def.supportsTools,
    creditsPerMessage,
    messagesPerCurrencyUnit:
      creditsPerMessage > 0
        ? Math.floor(creditsPerUnit / creditsPerMessage)
        : null,
    isLegacy,
    successor: isLegacy ? resolveSuccessor(id) : null,
  };
}

/** Facts for every public model, registry order. */
export function listModelFacts(): ModelFacts[] {
  const result: ModelFacts[] = [];
  for (const id of PUBLIC_CHAT_MODEL_IDS) {
    const facts = getModelFacts(id);
    if (facts !== null) {
      result.push(facts);
    }
  }
  return result;
}

/**
 * Comparison suggestions for a model page: its successor first (legacy), then
 * the current same-tier models with the same outputs, closest in price.
 * Feeds internal links.
 */
export function suggestComparisons(facts: ModelFacts, limit = 3): ModelRef[] {
  const picks: ModelRef[] = [];
  if (facts.successor !== null) {
    picks.push(facts.successor);
  }
  const candidates = listModelFacts()
    .filter(
      (other) =>
        other.id !== facts.id &&
        !other.isLegacy &&
        other.content === facts.content &&
        other.outputs.join() === facts.outputs.join() &&
        !picks.some((pick) => pick.id === other.id),
    )
    .toSorted(
      (a, b) =>
        Math.abs(a.creditsPerMessage - facts.creditsPerMessage) -
        Math.abs(b.creditsPerMessage - facts.creditsPerMessage),
    );
  for (const candidate of candidates) {
    if (picks.length >= limit) {
      break;
    }
    picks.push({
      id: candidate.id,
      slug: candidate.slug,
      name: candidate.name,
    });
  }
  return picks;
}

/** "1M", "200K", "32K" - compact token counts for tables and titles. */
export function formatTokenCount(tokens: number): string {
  if (tokens >= 1_000_000) {
    const millions = Math.round((tokens / 1_000_000) * 10) / 10;
    return `${millions}M`;
  }
  if (tokens >= 1000) {
    return `${Math.round(tokens / 1000)}K`;
  }
  return String(tokens);
}

/** One row in the compare-model picker. */
export interface PickerModel extends ModelRef {
  labName: string;
  content: typeof ContentLevelValue;
  /** True for the "relevant" group shown first. */
  suggested: boolean;
}

/**
 * Candidates for a "compare against" picker anchored on `anchor`: the
 * suggestComparisons picks first (same tier/outputs, closest price), then
 * every other public model alphabetically. `exclude` drops extra ids (the
 * model being replaced on the compare page).
 */
export function buildPickerModels(
  anchor: ModelFacts,
  exclude: ChatModelId[] = [],
): PickerModel[] {
  const suggestedIds = suggestComparisons(anchor, 5).map((pick) => pick.id);
  const all = listModelFacts().filter(
    (other) => other.id !== anchor.id && !exclude.includes(other.id),
  );
  const toRow = (other: ModelFacts, suggested: boolean): PickerModel => ({
    id: other.id,
    slug: other.slug,
    name: other.name,
    labName: other.labName,
    content: other.content,
    suggested,
  });
  const top = suggestedIds
    .map((id) => all.find((other) => other.id === id))
    .filter((other): other is ModelFacts => other !== undefined)
    .map((other) => toRow(other, true));
  const rest = all
    .filter((other) => !suggestedIds.includes(other.id))
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .map((other) => toRow(other, false));
  return [...top, ...rest];
}
