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
  ApiProvider,
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

/** Served by a public provider other than the UNBOTTLED cloud mirror. */
function hasDirectPublicProvider(def: ModelDefinition): boolean {
  return def.providers.some(
    (provider) =>
      provider.adminOnly !== true &&
      provider.apiProvider !== ApiProvider.UNBOTTLED,
  );
}

/**
 * Definitions that are a provider route of another model, not a model of
 * their own - e.g. the admin-only Claude Code entries (claude-code-haiku)
 * duplicate Claude Haiku 5.5, which already carries the Claude Code route.
 * Rule: same lab + name as a definition with a direct public provider, and no
 * direct public provider itself. Alias → canonical id. Aliases get no page,
 * catalog row or sitemap entry; their URLs redirect to the canonical page.
 */
const MODEL_PAGE_ALIASES: ReadonlyMap<ChatModelId, ChatModelId> = (() => {
  const groups = new Map<string, ChatModelId[]>();
  for (const id of Object.values(ChatModelId)) {
    const def = chatModelDefinitions[id];
    if (!isPublicDefinition(def)) {
      continue;
    }
    const key = `${def.by}\u0000${def.name}`;
    groups.set(key, [...(groups.get(key) ?? []), id]);
  }
  const aliases = new Map<ChatModelId, ChatModelId>();
  for (const ids of groups.values()) {
    const canonical = ids.find((id) =>
      hasDirectPublicProvider(chatModelDefinitions[id]),
    );
    if (canonical === undefined) {
      continue;
    }
    for (const id of ids) {
      if (!hasDirectPublicProvider(chatModelDefinitions[id])) {
        aliases.set(id, canonical);
      }
    }
  }
  return aliases;
})();

const aliasIds: ReadonlySet<string> = new Set<string>(
  MODEL_PAGE_ALIASES.keys(),
);

/** True when this chat model id is a duplicate route of another model's page. */
export function isModelPageAlias(id: string): boolean {
  return aliasIds.has(id);
}

/** Every chat model a public visitor can use, in registry order. */
export const PUBLIC_CHAT_MODEL_IDS: readonly ChatModelId[] = Object.values(
  ChatModelId,
).filter(
  (id) =>
    !MODEL_PAGE_ALIASES.has(id) &&
    isPublicDefinition(chatModelDefinitions[id]) &&
    publicOptionsFor(id).length > 0,
);

const idBySlug = new Map<string, ChatModelId>(
  PUBLIC_CHAT_MODEL_IDS.map((id) => [toModelSlug(id), id]),
);

const aliasBySlug = new Map<string, ChatModelId>(
  [...MODEL_PAGE_ALIASES].map(([alias, canonical]) => [
    toModelSlug(alias),
    canonical,
  ]),
);

function normalizeSegment(segment: string): string {
  return decodeURIComponent(segment).toLowerCase().replaceAll(/[._]+/g, "-");
}

/**
 * The canonical model for a URL segment that names a duplicate (alias) entry,
 * e.g. "claude-code-haiku" → claude-haiku-5.5. Null for any other segment.
 * Pages use it to redirect old duplicate URLs to the one canonical page.
 */
export function findModelPageAlias(segment: string): ChatModelId | null {
  const canonical = aliasBySlug.get(normalizeSegment(segment));
  return canonical !== undefined && PUBLIC_CHAT_MODEL_IDS.includes(canonical)
    ? canonical
    : null;
}

/** Resolve a URL segment (slug, or the raw model id) to a public model. */
export function findPublicModelId(segment: string): ChatModelId | null {
  const decoded = decodeURIComponent(segment).toLowerCase();
  return (
    idBySlug.get(decoded) ??
    idBySlug.get(normalizeSegment(segment)) ??
    findModelPageAlias(segment)
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
 * The model built to be uncensored (trained that way by its lab), as opposed
 * to the refusal-stripped variants of mainstream/open models in the same tier.
 * Every other uncensored-tier text model links to it first.
 */
export const BUILT_UNCENSORED_MODEL_ID: ChatModelId =
  ChatModelId.UNCENSORED_LM_V1_2;

/**
 * Hand-picked comparison pairs, linked from both model pages ahead of the
 * price-based suggestions (and therefore sitemapped). Order inside a pair is
 * the canonical URL order: /models/compare/<a>/<b>.
 */
export const FEATURED_COMPARISON_PAIRS: readonly (readonly [
  ChatModelId,
  ChatModelId,
])[] = [
  // Built uncensored vs refusals removed.
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GLM_5_3_UNCENSORED],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.QWEN_3_6_PLUS_UNCENSORED],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.VENICE_UNCENSORED],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GLM_5_3_FLASH_UNCENSORED],
  // Built uncensored vs the mainstream and open flagships.
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GPT_6_1_SOL],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.CLAUDE_SONNET_5_5],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GROK_4_7],
];

/** Featured partners of a model, in pair order, public text models only. */
function featuredComparisons(facts: ModelFacts): ModelRef[] {
  const ids: ChatModelId[] = [];
  for (const [a, b] of FEATURED_COMPARISON_PAIRS) {
    if (a === facts.id) {
      ids.push(b);
    } else if (b === facts.id) {
      ids.push(a);
    }
  }
  if (
    facts.id !== BUILT_UNCENSORED_MODEL_ID &&
    facts.content === ContentLevel.UNCENSORED &&
    !ids.includes(BUILT_UNCENSORED_MODEL_ID)
  ) {
    ids.unshift(BUILT_UNCENSORED_MODEL_ID);
  }
  const refs: ModelRef[] = [];
  for (const id of ids) {
    const other = getModelFacts(id);
    if (
      other !== null &&
      !other.isLegacy &&
      other.outputs.join() === facts.outputs.join()
    ) {
      refs.push({ id: other.id, slug: other.slug, name: other.name });
    }
  }
  return refs;
}

/**
 * Comparison suggestions for a model page: its successor first (legacy), then
 * the featured pairs (always shown, may exceed `limit`), then the current
 * same-tier models with the same outputs, closest in price.
 * Feeds internal links and the sitemap.
 */
export function suggestComparisons(facts: ModelFacts, limit = 3): ModelRef[] {
  const picks: ModelRef[] = [];
  if (facts.successor !== null) {
    picks.push(facts.successor);
  }
  for (const featured of featuredComparisons(facts)) {
    if (!picks.some((pick) => pick.id === featured.id)) {
      picks.push(featured);
    }
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
