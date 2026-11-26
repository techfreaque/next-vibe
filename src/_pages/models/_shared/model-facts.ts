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
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import type { AgentTranslationKey } from "next-vibe/agent/i18n";
import {
  type Modality,
  ModelUtility,
  type ModelUtilityValue,
} from "next-vibe/agent/models/enum";
import {
  ApiProvider,
  apiProviderDisplayNames,
  estimateReferenceChatTurnCredits,
  isApiProviderAvailable,
  type ModelDefinition,
  modelProviders,
  providerUsdToCredits,
  type UncensoredModelMethod,
} from "next-vibe/agent/models/models";
import {
  type TokenTariff,
  tokenTariffs,
} from "next-vibe/agent/models/token-tariffs";
import {
  ContentLevel,
  type ContentLevelValue,
  type IntelligenceLevelValue,
} from "next-vibe/agent/skills/enum";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";

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
  uncensoredMethod: UncensoredModelMethod | null;
  intelligence: typeof IntelligenceLevelValue;
  contextWindow: number;
  /** Context window expressed as printed pages of prose. */
  contextPages: number;
  inputs: Modality[];
  outputs: Modality[];
  /** Public API providers serving this model, ordered by reference turn price. */
  providers: string[];
  /** Provider behind the displayed reference price and token rates. */
  priceProvider: string;
  supportsTools: boolean;
  /** Credits for one reference message on the cheapest public provider. */
  creditsPerMessage: number;
  /**
   * Credits per 1M tokens on the provider behind creditsPerMessage, markup
   * included. Null for fixed-price routes (no per-token price exists).
   */
  pricingTiers: readonly TokenTariff[];
  tokenPrice: {
    inputCredits: number;
    outputCredits: number;
    cacheReadCredits: number | null;
    cacheWriteCredits: number | null;
    cacheWrite1hCredits: number | null;
    imageOutputCredits: number | null;
  } | null;
  /** Parameter count in billions, when the registry knows it. */
  parameterCount: number | null;
  /** Registry strengths (ModelUtility values), registry order, meta tags dropped. */
  strengths: (typeof ModelUtilityValue)[];
  weaknesses: (typeof ModelUtilityValue)[];
  isLegacy: boolean;
  successor: ModelRef | null;
}

/** Utilities that describe what a model is good at (not tier/meta tags). */
const STRENGTH_UTILITIES: ReadonlySet<string> = new Set<string>([
  ModelUtility.CODING,
  ModelUtility.REASONING,
  ModelUtility.ANALYSIS,
  ModelUtility.CREATIVE,
  ModelUtility.ROLEPLAY,
  ModelUtility.ROLEPLAY_DARK,
  ModelUtility.FAST,
  ModelUtility.VISION,
  ModelUtility.IMAGE_GEN,
]);

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

const publicOptionsById = new Map<ChatModelId, ChatModelOption[]>();
for (const option of chatModelOptionsPool) {
  if (option.adminOnly !== true) {
    const options = publicOptionsById.get(option.id);
    if (options === undefined) {
      publicOptionsById.set(option.id, [option]);
    } else {
      options.push(option);
    }
  }
}

/** Configured public routes allowed by this instance's relay policy. */
function availableOptionsFor(
  id: ChatModelId,
  availability: AgentEnvAvailability,
): ChatModelOption[] {
  return (publicOptionsById.get(id) ?? []).filter(
    (option) =>
      (!availability.unbottledForce ||
        option.apiProvider === ApiProvider.UNBOTTLED) &&
      isApiProviderAvailable(option.apiProvider, availability),
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
    publicOptionsById.has(id),
);

const publicChatModelIds = new Set(PUBLIC_CHAT_MODEL_IDS);

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
  return canonical !== undefined && publicChatModelIds.has(canonical)
    ? canonical
    : null;
}

/**
 * Delisted (enabled: false) chat models that have a successor, by slug. They
 * get no page of their own; their old URLs 308 to the successor's page.
 */
const retiredIdBySlug = new Map<string, ChatModelId>(
  Object.values(ChatModelId)
    .filter(
      (id) =>
        !isPublicDefinition(chatModelDefinitions[id]) &&
        chatModelSuccessors[id] !== undefined,
    )
    .map((id) => [toModelSlug(id), id]),
);

/** The delisted model a URL segment names, or null. */
export function findRetiredModelId(segment: string): ChatModelId | null {
  return retiredIdBySlug.get(normalizeSegment(segment)) ?? null;
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

/**
 * True when a public visitor can use this model on this instance: a public
 * model (registry) with at least one route whose provider key is configured.
 * A model whose only providers lack a key gets no page, catalog row, sitemap
 * entry or llms.txt line.
 */
export function isChatModelAvailable(
  id: ChatModelId,
  availability: AgentEnvAvailability,
): boolean {
  return (
    publicChatModelIds.has(id) &&
    availableOptionsFor(id, availability).length > 0
  );
}

function toRef(id: ChatModelId): ModelRef {
  return { id, slug: toModelSlug(id), name: chatModelDefinitions[id].name };
}

/**
 * The first current (non-legacy) successor of a model that is available here.
 * Also where an unavailable model's page redirects to.
 */
export function resolveSuccessor(
  id: ChatModelId,
  availability: AgentEnvAvailability,
): ModelRef | null {
  const seen = new Set<ChatModelId>([id]);
  let next = chatModelSuccessors[id];
  while (next !== undefined && !seen.has(next)) {
    if (isChatModelAvailable(next, availability)) {
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

/** USD per 1M tokens (provider list price) → credits per 1M, markup included. */
function perMillionCredits(usdPerMillion: number): number;
function perMillionCredits(usdPerMillion: number | undefined): number | null;
function perMillionCredits(usdPerMillion: number | undefined): number | null {
  return usdPerMillion === undefined
    ? null
    : providerUsdToCredits(usdPerMillion);
}

function buildModelFacts(
  id: ChatModelId,
  availability: AgentEnvAvailability,
): ModelFacts | null {
  const def = chatModelDefinitions[id];
  const options = availableOptionsFor(id, availability)
    .map((option) => ({
      option,
      cost: estimateReferenceChatTurnCredits(option),
    }))
    .toSorted((a, b) => a.cost - b.cost);
  const first = options[0];
  if (first === undefined) {
    return null;
  }

  const { option: cheapest, cost } = first;
  const creditsPerMessage = roundCredits(cost);
  const tokenPrice =
    "inputTokenCost" in cheapest &&
    typeof cheapest.inputTokenCost === "number" &&
    typeof cheapest.outputTokenCost === "number"
      ? {
          inputCredits: perMillionCredits(cheapest.inputTokenCost),
          outputCredits: perMillionCredits(cheapest.outputTokenCost),
          cacheReadCredits: perMillionCredits(cheapest.cacheReadTokenCost),
          cacheWriteCredits: perMillionCredits(cheapest.cacheWriteTokenCost),
          cacheWrite1hCredits: perMillionCredits(
            cheapest.cacheWrite1hTokenCost,
          ),
          imageOutputCredits: perMillionCredits(cheapest.imageOutputTokenCost),
        }
      : null;

  const providers: string[] = [];
  for (const { option } of options) {
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
    uncensoredMethod: def.uncensoredMethod ?? null,
    intelligence: def.intelligence,
    contextWindow: def.contextWindow,
    contextPages: Math.max(1, Math.round(def.contextWindow / TOKENS_PER_PAGE)),
    inputs: def.inputs,
    outputs: def.outputs,
    providers,
    priceProvider: apiProviderDisplayNames[cheapest.apiProvider],
    supportsTools: def.supportsTools,
    creditsPerMessage,
    tokenPrice,
    pricingTiers: tokenTariffs(cheapest),
    parameterCount: def.parameterCount ?? null,
    strengths: def.utilities.filter((utility) =>
      STRENGTH_UTILITIES.has(utility),
    ),
    weaknesses: def.weaknesses ?? [],
    isLegacy,
    successor: isLegacy ? resolveSuccessor(id, availability) : null,
  };
}

// Keep one bounded snapshot of public facts. The live availability flags
// select the snapshot, so connection changes take effect on the next lookup.
let modelFactsSnapshot:
  | { key: string; facts: Map<ChatModelId, ModelFacts | null> }
  | undefined;

function factsForFlags(
  availability: AgentEnvAvailability,
): Map<ChatModelId, ModelFacts | null> {
  const key = JSON.stringify(availability);
  if (modelFactsSnapshot?.key !== key) {
    modelFactsSnapshot = { key, facts: new Map() };
  }
  return modelFactsSnapshot.facts;
}

function getCachedModelFacts(
  id: ChatModelId,
  availability: AgentEnvAvailability,
  cached: Map<ChatModelId, ModelFacts | null>,
): ModelFacts | null {
  const existing = cached.get(id);
  if (existing !== undefined) {
    return existing;
  }
  const facts = buildModelFacts(id, availability);
  cached.set(id, facts);
  return facts;
}

export function getModelFacts(
  id: ChatModelId,
  availability: AgentEnvAvailability,
): ModelFacts | null {
  return publicChatModelIds.has(id)
    ? getCachedModelFacts(id, availability, factsForFlags(availability))
    : null;
}

/** Facts for every public model available on this instance, registry order. */
export function listModelFacts(
  availability: AgentEnvAvailability,
): ModelFacts[] {
  const result: ModelFacts[] = [];
  const cached = factsForFlags(availability);
  for (const id of PUBLIC_CHAT_MODEL_IDS) {
    const facts = getCachedModelFacts(id, availability, cached);
    if (facts !== null) {
      result.push(facts);
    }
  }
  return result;
}

/**
 * The uncensored model with its own worldview (UncensoredLM: trained on books and
 * documents banned from the mainstream internet, contrary political takes), as opposed to the refusal-stripped
 * (abliterated) variants of mainstream/open models in the same tier, which
 * keep their base model's training and worldview.
 * Every other uncensored-tier text model links to it first.
 */
export const OWN_WORLDVIEW_UNCENSORED_MODEL_ID: ChatModelId =
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
  // Own worldview vs refusals removed (abliterated).
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GLM_5_3_UNCENSORED],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.QWEN_3_6_PLUS_UNCENSORED],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.VENICE_UNCENSORED],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GLM_5_3_FLASH_UNCENSORED],
  // Own worldview vs the roleplay/fiction picks (dark and taboo scenes).
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.VENICE_UNCENSORED_ROLEPLAY],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.DRUMMER_ARTEMIS_31B],
  [
    ChatModelId.UNCENSORED_LM_V1_2,
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ],
  // Own worldview vs the other platforms' own uncensored models (linked
  // from the Gab AI and FreedomGPT versus pages).
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GAB_AI_ARYA],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.FREEDOMGPT_LIBERTY],
  // Own worldview vs the mainstream and open flagships.
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GPT_6_2_SOL],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.CLAUDE_SONNET_5_5],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GROK_4_7],
];

/** Pick one indexable URL for a pair while allowing either on-screen order. */
export function canonicalComparisonPath(
  leftModel: ChatModelId | ModelRef,
  rightModel: ChatModelId | ModelRef,
): string {
  const left = typeof leftModel === "string" ? toRef(leftModel) : leftModel;
  const right = typeof rightModel === "string" ? toRef(rightModel) : rightModel;
  const featured = FEATURED_COMPARISON_PAIRS.find(
    ([a, b]) =>
      (a === left.id && b === right.id) || (a === right.id && b === left.id),
  );
  const leftFirst = featured
    ? featured[0] === left.id
    : PUBLIC_CHAT_MODEL_IDS.indexOf(left.id) <
      PUBLIC_CHAT_MODEL_IDS.indexOf(right.id);
  return leftFirst
    ? `/models/compare/${left.slug}/${right.slug}`
    : `/models/compare/${right.slug}/${left.slug}`;
}

/** True when a pair compares a legacy model directly against its current successor. */
export function isLegacyUpgradeComparison(
  left: Pick<ModelFacts, "id" | "isLegacy" | "successor">,
  right: Pick<ModelFacts, "id" | "isLegacy" | "successor">,
): boolean {
  return (
    (left.isLegacy && !right.isLegacy && left.successor?.id === right.id) ||
    (right.isLegacy && !left.isLegacy && right.successor?.id === left.id)
  );
}

/**
 * True when a comparison page should be indexed (and eligible for the sitemap):
 * - two current models, OR
 * - a legacy model compared directly against its current successor ("old vs new" upgrade query).
 * Legacy-vs-unrelated and legacy-vs-legacy pairs stay reachable for users and
 * link-followable, but carry noindex, follow to avoid programmatic index bloat.
 */
export function isIndexableComparison(
  left: Pick<ModelFacts, "id" | "isLegacy" | "successor">,
  right: Pick<ModelFacts, "id" | "isLegacy" | "successor">,
): boolean {
  return (
    (!left.isLegacy && !right.isLegacy) ||
    isLegacyUpgradeComparison(left, right)
  );
}

/** Featured partners of a model, in pair order, public text models only. */
function featuredComparisons(
  facts: ModelFacts,
  availability: AgentEnvAvailability,
): ModelRef[] {
  const ids: ChatModelId[] = [];
  for (const [a, b] of FEATURED_COMPARISON_PAIRS) {
    if (a === facts.id) {
      ids.push(b);
    } else if (b === facts.id) {
      ids.push(a);
    }
  }
  if (
    facts.id !== OWN_WORLDVIEW_UNCENSORED_MODEL_ID &&
    facts.content === ContentLevel.UNCENSORED &&
    !ids.includes(OWN_WORLDVIEW_UNCENSORED_MODEL_ID)
  ) {
    ids.unshift(OWN_WORLDVIEW_UNCENSORED_MODEL_ID);
  }
  const refs: ModelRef[] = [];
  for (const id of ids) {
    const other = getModelFacts(id, availability);
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

/** "GLM-5.3" and "GLM 5.3 Uncensored" → "glm53", "glm53uncensored". */
function nameKey(name: string): string {
  return name.toLowerCase().replaceAll(/[^a-z0-9]/g, "");
}

const UNCENSORED_SUFFIXES = ["uncensored", "abliterated"];

/** True when `variant` is `base` with only an uncensored/abliterated suffix. */
export function isUncensoredVariantOf(
  variant: ModelFacts,
  base: ModelFacts,
): boolean {
  if (variant.content !== ContentLevel.UNCENSORED || variant.id === base.id) {
    return false;
  }
  const variantKey = nameKey(variant.name);
  const baseKey = nameKey(base.name);
  return UNCENSORED_SUFFIXES.some(
    (suffix) => variantKey === `${baseKey}${suffix}`,
  );
}

/**
 * Comparison suggestions for a model page: its successor first (legacy), then
 * the featured pairs (always shown, may exceed `limit`), then known
 * base/uncensored variants and same-tier models, closest in price.
 * Feeds internal links and the sitemap.
 */
export function suggestComparisons(
  facts: ModelFacts,
  availability: AgentEnvAvailability,
  limit = 3,
): ModelRef[] {
  const picks: ModelRef[] = [];
  if (facts.successor !== null) {
    picks.push(facts.successor);
  }
  for (const featured of featuredComparisons(facts, availability)) {
    if (!picks.some((pick) => pick.id === featured.id)) {
      picks.push(featured);
    }
  }
  const candidates = listModelFacts(availability)
    .filter(
      (other) =>
        other.id !== facts.id &&
        !other.isLegacy &&
        !picks.some((pick) => pick.id === other.id),
    )
    .map((other) => ({
      other,
      isVariant:
        isUncensoredVariantOf(other, facts) ||
        isUncensoredVariantOf(facts, other),
    }))
    .filter(
      ({ other, isVariant }) =>
        isVariant ||
        (other.content === facts.content &&
          other.outputs.join() === facts.outputs.join()),
    )
    .toSorted(
      (a, b) =>
        Number(b.isVariant) - Number(a.isVariant) ||
        Math.abs(a.other.creditsPerMessage - facts.creditsPerMessage) -
          Math.abs(b.other.creditsPerMessage - facts.creditsPerMessage),
    );
  for (const { other: candidate } of candidates) {
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

function pickerRow(facts: ModelFacts): PickerModel {
  return {
    id: facts.id,
    slug: facts.slug,
    name: facts.name,
    labName: facts.labName,
    content: facts.content,
    suggested: false,
  };
}

function pickerCandidates(
  availability: AgentEnvAvailability,
  excludedIds: readonly ChatModelId[],
): PickerModel[] {
  return listModelFacts(availability)
    .filter((other) => !excludedIds.includes(other.id))
    .map(pickerRow)
    .toSorted((a, b) => a.name.localeCompare(b.name));
}

export function orderPickerModels(
  models: readonly PickerModel[],
  suggestedIds: readonly ChatModelId[],
): PickerModel[] {
  const suggested = suggestedIds.flatMap((id) => {
    const model = models.find((candidate) => candidate.id === id);
    return model === undefined ? [] : [{ ...model, suggested: true }];
  });
  const rest = models.filter((model) => !suggestedIds.includes(model.id));
  return [...suggested, ...rest];
}

/** Both compare pickers offer the same candidates, with different suggestions. */
export function buildComparePickers(
  left: ModelFacts,
  right: ModelFacts,
  availability: AgentEnvAvailability,
): {
  models: PickerModel[];
  suggestedLeft: ChatModelId[];
  suggestedRight: ChatModelId[];
} {
  return {
    models: pickerCandidates(availability, [left.id, right.id]),
    suggestedLeft: suggestComparisons(right, availability, 5).map(
      (pick) => pick.id,
    ),
    suggestedRight: suggestComparisons(left, availability, 5).map(
      (pick) => pick.id,
    ),
  };
}

/**
 * Candidates for a "compare against" picker anchored on `anchor`: the
 * suggestComparisons picks first (same tier/outputs, closest price), then
 * every other public model alphabetically. `exclude` drops extra ids (the
 * model being replaced on the compare page).
 */
export function buildPickerModels(
  anchor: ModelFacts,
  availability: AgentEnvAvailability,
  exclude: ChatModelId[] = [],
): PickerModel[] {
  const suggestedIds = suggestComparisons(anchor, availability, 5).map(
    (pick) => pick.id,
  );
  const all = pickerCandidates(availability, [anchor.id, ...exclude]);
  return orderPickerModels(all, suggestedIds);
}
