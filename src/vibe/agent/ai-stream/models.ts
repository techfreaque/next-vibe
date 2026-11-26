import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { z } from "zod";

import type { AgentEnvAvailability } from "../env-availability";
import { ModelUtility } from "../models/enum";
import {
  ApiProvider,
  filterRoleModels,
  getProviderPrice,
  isModelProviderAvailable,
  type ModelDefinition,
  type ModelOptionBase,
  type ModelOptionCreditBased,
  type ModelOptionTokenBased,
} from "../models/models";
import {
  type FiltersModelSelection,
  filtersSelectionSchema,
  sharedFilterPropsSchema,
} from "../models/selection";
import { ModelSelectionType } from "../skills/enum";
import {
  chatModelDefinitions,
  ChatModelId,
  chatModelSuccessors,
} from "./models-definitions";

export { chatModelDefinitions, ChatModelId, chatModelSuccessors };

/**
 * Featured models by category for use in marketing content, emails, etc.
 */
export const FEATURED_MODELS = {
  // Representative picks per category - used in marketing content and emails
  mainstream: [
    chatModelDefinitions[ChatModelId.CLAUDE_OPUS_5_5].name,
    chatModelDefinitions[ChatModelId.GPT_6_2_ASTRA].name,
    chatModelDefinitions[ChatModelId.GEMINI_4_CARBON].name,
    chatModelDefinitions[ChatModelId.GROK_4_7].name,
  ],
  open: [
    chatModelDefinitions[ChatModelId.KIMI_K3_1_PRO].name,
    chatModelDefinitions[ChatModelId.DEEPSEEK_V4_1_FLASH].name,
    chatModelDefinitions[ChatModelId.GLM_5_3].name,
  ],
  // Enabled + servable only (Venice / NanoGPT), strongest abliterated first.
  uncensored: [
    chatModelDefinitions[ChatModelId.KIMI_K3_1_PRO_UNCENSORED].name,
    chatModelDefinitions[ChatModelId.GLM_5_3_UNCENSORED].name,
    chatModelDefinitions[ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED]
      .name,
    chatModelDefinitions[ChatModelId.UNCENSORED_LM_V1_2].name,
    chatModelDefinitions[ChatModelId.VENICE_UNCENSORED].name,
  ],
} as const;

export type ChatModelOption =
  | (ModelOptionTokenBased & { id: ChatModelId })
  | (ModelOptionCreditBased & { id: ChatModelId });

type ChatProviderConfig = ModelDefinition["providers"][number];

/**
 * Providers that are only ever an ALTERNATE route for a model: aggregators
 * such as OpenUncensored that resell hosts we may also reach directly. They
 * join the availability-aware pool (getChatModelForUser / filterChatModels
 * pick the cheapest CONFIGURED route), but never become the static primary
 * option: that one is availability-blind and drives listed prices and
 * display, so a cheap route on an instance without its key would show a
 * price no turn there can get.
 */
const ROUTE_ONLY_PROVIDERS: ReadonlySet<ApiProvider> = new Set([
  ApiProvider.OPENUNCENSORED,
]);

/**
 * Static primary order: public direct routes, then route-only providers,
 * then admin-only ones; cheapest first within each group (stable, so the
 * definition order breaks price ties).
 */
export function compareStaticPrimaryRoutes(
  a: ChatProviderConfig,
  b: ChatProviderConfig,
): number {
  const group = (p: ChatProviderConfig): number =>
    (p.adminOnly === true ? 2 : 0) +
    (ROUTE_ONLY_PROVIDERS.has(p.apiProvider) ? 1 : 0);
  return group(a) - group(b) || getProviderPrice(a) - getProviderPrice(b);
}

/**
 * Routing order: cheapest first by listed price, ties keep the definition
 * order (put the preferred route first, e.g. native tool calling).
 */
export function compareRoutesByPrice(
  a: ChatProviderConfig,
  b: ChatProviderConfig,
): number {
  return getProviderPrice(a) - getProviderPrice(b);
}

function buildChatOption(
  modelId: ChatModelId,
  def: ModelDefinition,
  provider: ChatProviderConfig,
): ChatModelOption | null {
  const base = {
    id: modelId,
    name: def.name,
    provider: def.by,
    apiProvider: provider.apiProvider,
    description: def.description,
    parameterCount: def.parameterCount,
    contextWindow: def.contextWindow,
    icon: def.icon,
    providerModel: provider.providerModel,
    utilities: def.utilities,
    supportsTools: def.supportsTools,
    intelligence: def.intelligence,
    content: def.content,
    features: def.features,
    weaknesses: def.weaknesses,
    adminOnly: provider.adminOnly,
    inputs: def.inputs,
    outputs: def.outputs,
    voiceMeta: def.voiceMeta,
  } as const;
  if (typeof provider.creditCost === "number") {
    return {
      ...base,
      creditCost: provider.creditCost,
    } satisfies ModelOptionCreditBased & { id: ChatModelId };
  }
  if (typeof provider.inputTokenCost === "number") {
    return {
      ...base,
      creditCost: provider.creditCost,
      inputTokenCost: provider.inputTokenCost,
      outputTokenCost: provider.outputTokenCost,
      cacheReadTokenCost: provider.cacheReadTokenCost,
      cacheWriteTokenCost: provider.cacheWriteTokenCost,
      cacheWrite1hTokenCost: provider.cacheWrite1hTokenCost,
      imageOutputTokenCost: provider.imageOutputTokenCost,
      maxInputTokenCost: provider.maxInputTokenCost,
      longContextPricing: provider.longContextPricing,
      pricingTiers: provider.pricingTiers,
    } satisfies ModelOptionTokenBased & { id: ChatModelId };
  }
  return null;
}

function buildChatModelOptions(): Record<ChatModelId, ChatModelOption> {
  const result = {} as Record<ChatModelId, ChatModelOption>;
  for (const modelId of Object.values(ChatModelId)) {
    const def = chatModelDefinitions[modelId];
    if (!def) {
      continue;
    }
    // Public providers before admin-only ones, cheapest first within each
    // group. Price alone is not enough: Claude Code is listed at the same
    // token price as OpenRouter, so a price-only sort let the admin-only
    // provider become the primary option and every non-admin request for
    // that model was rejected as FORBIDDEN. Admins get their admin-only
    // provider through getChatModelForUser instead.
    const sortedProviders = [...def.providers].toSorted(
      compareStaticPrimaryRoutes,
    );
    for (const provider of sortedProviders) {
      if (
        provider.creditCostPerClip !== undefined ||
        provider.creditCostPerSecond !== undefined ||
        provider.creditCostPerCharacter !== undefined
      ) {
        continue;
      }
      // First provider wins for primary model id - prevents admin-only
      // providers (e.g. CLAUDE_CODE) from shadowing public providers (OpenRouter).
      if (result[modelId]) {
        continue;
      }
      const option = buildChatOption(modelId, def, provider);
      if (option) {
        result[modelId] = option;
      }
    }
  }
  return result;
}

export const chatModelOptionsIndex: Record<string, ChatModelOption> =
  buildChatModelOptions();

/** One entry per selectable model. The index also keeps historical IDs for display. */
export const chatModelOptions: ChatModelOption[] = Object.values(
  chatModelOptionsIndex,
).filter((model) => !isRetiredChatModel(model.id));

/**
 * All (model, provider) combinations sorted cheapest-first.
 * Used exclusively by filterChatModels so filterRoleModels can pick the cheapest
 * AVAILABLE provider per model (falls back to next provider if cheapest is unconfigured).
 */
function buildChatModelOptionsPool(): ChatModelOption[] {
  const pool: ChatModelOption[] = [];
  for (const modelId of Object.values(ChatModelId)) {
    const def = chatModelDefinitions[modelId];
    if (!def || isRetiredChatModel(modelId)) {
      continue;
    }
    const sortedProviders = [...def.providers].toSorted(compareRoutesByPrice);
    for (const provider of sortedProviders) {
      if (
        provider.creditCostPerClip !== undefined ||
        provider.creditCostPerSecond !== undefined ||
        provider.creditCostPerCharacter !== undefined
      ) {
        continue;
      }
      const option = buildChatOption(modelId, def, provider);
      if (option) {
        pool.push(option);
      }
    }
  }
  return pool;
}

export const chatModelOptionsPool: ChatModelOption[] =
  buildChatModelOptionsPool();

export const ChatModelIdOptions = (
  Object.entries(ChatModelId) as [keyof typeof ChatModelId, ChatModelId][]
)
  .filter(([, id]) => !isRetiredChatModel(id))
  .map(([key, id]) => ({
    value: id,
    label: `models.names.${key}` as `models.names.${keyof typeof ChatModelId}`,
  }));

export function getChatModelById(modelId: ChatModelId): ChatModelOption;
export function getChatModelById(
  modelId: ChatModelId | null | undefined,
): ChatModelOption | null;
export function getChatModelById(
  modelId: ChatModelId | null | undefined,
): ChatModelOption | null {
  if (!modelId) {
    return null;
  }
  return (
    chatModelOptionsIndex[modelId] ??
    chatModelOptionsIndex[ChatModelId.KIMI_K3_1_PRO]!
  );
}

/**
 * The provider option that serves `modelId` for this user on this instance:
 * the cheapest provider the user may use (admin-only providers such as Claude
 * Code are skipped for non-admins) whose API provider is configured here.
 * Falls back to the static primary option when none qualifies, so the
 * missing-key and admin-only guards still report against the model itself.
 */
export function getChatModelForUser(
  modelId: ChatModelId,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): ChatModelOption {
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  return (
    chatModelOptionsPool.find(
      (option) =>
        option.id === modelId &&
        (option.adminOnly !== true || isAdmin) &&
        isModelProviderAvailable(option, availability),
    ) ?? getChatModelById(modelId)
  );
}

// ============================================================
// CHAT MODEL SELECTION SCHEMA
// ============================================================

export const chatManualModelSelectionSchema = z
  .object({
    selectionType: z.literal(ModelSelectionType.MANUAL),
    manualModelId: z.enum(ChatModelId),
  })
  .merge(sharedFilterPropsSchema);
export type ChatManualModelSelection = z.infer<
  typeof chatManualModelSelectionSchema
>;

/**
 * Chat model selection — a manual pick or a filter-based selection.
 *
 * Declared as an EXPLICIT union of its two component types (not `z.infer` of the
 * discriminated union) and the schema is annotated `z.ZodType<ChatModelSelection>`.
 * This pins `z.output<chatModelSelectionSchema>` to this named type so consumers
 * (definitions embedding it as a field, event-payload Picks over the request/
 * response output) resolve it shallowly instead of re-deriving the discriminated
 * union every time — which exceeds TS's instantiation-depth limit and collapses
 * the field type to `unknown`/`{}`.
 */
export type ChatModelSelection =
  | ChatManualModelSelection
  | FiltersModelSelection;

export const chatModelSelectionSchema: z.ZodType<
  ChatModelSelection,
  ChatModelSelection
> = z.discriminatedUnion("selectionType", [
  chatManualModelSelectionSchema,
  filtersSelectionSchema,
]);

/**
 * A MANUAL pick whose id this bundle does not know. Happens when a browser tab
 * still runs a bundle from before a model-catalog refresh and the server
 * returns a newer id. Degrades to filter-based auto-selection with the same
 * filter/sort props instead of failing the whole response.
 */
const unknownManualChatModelSelectionSchema = z
  .object({
    selectionType: z.literal(ModelSelectionType.MANUAL),
    manualModelId: z.string(),
  })
  .merge(sharedFilterPropsSchema)
  .transform((selection): FiltersModelSelection => ({
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: selection.intelligenceRange,
    priceRange: selection.priceRange,
    contentRange: selection.contentRange,
    sortBy: selection.sortBy,
    sortDirection: selection.sortDirection,
    sortBy2: selection.sortBy2,
    sortDirection2: selection.sortDirection2,
  }));

/**
 * RESPONSE-side chat model selection: strict schema first, then the unknown-id
 * fallback above. Never use for request fields - an unknown id sent TO the
 * server is a real error, not version skew.
 */
export const chatModelSelectionResponseSchema: z.ZodType<ChatModelSelection> =
  z.union([chatModelSelectionSchema, unknownManualChatModelSelectionSchema]);

// ============================================================
// LEGACY → SUCCESSOR RESOLUTION
// ============================================================

/** True when the model is flagged ModelUtility.LEGACY (hidden from pickers, still resolvable). */
export function isLegacyChatModel(modelId: ChatModelId): boolean {
  const def = chatModelDefinitions[modelId];
  if (!def) {
    return false;
  }
  return def.utilities.includes(ModelUtility.LEGACY);
}

/** Retired IDs remain readable in saved chats but have no callable route. */
export function isRetiredChatModel(modelId: ChatModelId): boolean {
  const def = chatModelDefinitions[modelId];
  return def?.enabled === false && def.enabledWithoutPrice !== true;
}

/**
 * Follow the legacy → successor chain to the current model. Returns the input
 * id unchanged for current models and for legacy models without a successor.
 * Pure + static: callers that must honour provider availability use
 * filterChatModels / resolveChatModelForUser, which fall back to the legacy id
 * when its successor cannot be served.
 */
export function resolveChatModelSuccessor(modelId: ChatModelId): ChatModelId {
  let current = modelId;
  const seen = new Set<ChatModelId>([current]);
  let next = chatModelSuccessors[current];
  while (next && !seen.has(next)) {
    seen.add(next);
    current = next;
    next = chatModelSuccessors[current];
  }
  return current;
}

/**
 * Resolve an explicitly chosen model id for a user: legacy ids map to their
 * successor when the successor is servable for this user/env, otherwise the
 * original id is kept (no silent swap to an unrelated model).
 */
export function resolveChatModelForUser(
  modelId: ChatModelId,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): ChatModelId {
  const successorId = resolveChatModelSuccessor(modelId);
  if (successorId === modelId) {
    return modelId;
  }
  const best = getBestChatModel(
    { selectionType: ModelSelectionType.MANUAL, manualModelId: modelId },
    user,
    availability,
  );
  return best && (best.id === successorId || best.id === modelId)
    ? best.id
    : modelId;
}

// ============================================================
// CHAT MODEL RESOLUTION
// ============================================================

/** Selection shape accepted by filterRoleModels (any role). */
type RoleModelSelection = NonNullable<Parameters<typeof filterRoleModels>[1]>;

/**
 * filterRoleModels with legacy → successor resolution for MANUAL picks.
 * Works for every pool whose ids are chat model ids (chat + vision bridges):
 * a MANUAL pick of a legacy model resolves to its successor when the successor
 * is in this pool and servable; otherwise the original pick resolves as before
 * (legacy model itself, then the filter fallback).
 */
export function filterRoleModelsWithSuccessor<
  TOption extends ModelOptionBase,
  TSelection extends RoleModelSelection,
>(
  pool: TOption[],
  selection: TSelection | null | undefined,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): TOption[] {
  const manualId =
    selection?.selectionType === ModelSelectionType.MANUAL
      ? selection.manualModelId
      : undefined;
  const chatId = manualId
    ? Object.values(ChatModelId).find((id) => id === manualId)
    : undefined;
  if (selection && chatId) {
    const successorId = resolveChatModelSuccessor(chatId);
    if (successorId !== chatId && pool.some((m) => m.id === successorId)) {
      const viaSuccessor = filterRoleModels(
        pool,
        { ...selection, manualModelId: successorId },
        user,
        availability,
      );
      if (viaSuccessor[0]?.id === successorId) {
        return viaSuccessor;
      }
    }
  }
  return filterRoleModels(pool, selection, user, availability);
}

/**
 * Get all chat models matching a selection (MANUAL falls back to FILTERS if unavailable).
 * MANUAL picks of a legacy model resolve to its successor first; when the
 * successor is not servable the legacy model itself is used if it still is.
 */
export function filterChatModels(
  selection: ChatModelSelection,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): ChatModelOption[] {
  const pool = availability.unbottledForce
    ? chatModelOptionsPool.filter(
        (m) => m.apiProvider === ApiProvider.UNBOTTLED,
      )
    : chatModelOptionsPool;
  return filterRoleModelsWithSuccessor(pool, selection, user, availability);
}

/** Get best chat model from a selection. */
export function getBestChatModel(
  selection: ChatModelSelection,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): ChatModelOption | null {
  return filterChatModels(selection, user, availability)[0] ?? null;
}
