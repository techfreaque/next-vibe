import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { z } from "zod";

import type { AgentEnvAvailability } from "../env-availability";
import {
  ApiProvider,
  filterRoleModels,
  getProviderPrice,
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
import { ModelUtility } from "../models/enum";
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
    chatModelDefinitions[ChatModelId.GPT_6_ASTRA].name,
    chatModelDefinitions[ChatModelId.GEMINI_4_ARGON].name,
    chatModelDefinitions[ChatModelId.GROK_4_7].name,
  ],
  open: [
    chatModelDefinitions[ChatModelId.KIMI_K3_1_PRO].name,
    chatModelDefinitions[ChatModelId.DEEPSEEK_V4_1_FLASH].name,
    chatModelDefinitions[ChatModelId.GLM_5_3].name,
  ],
  // Enabled + servable only (Venice / NanoGPT), strongest abliterated first.
  uncensored: [
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
    const sortedProviders = [...def.providers].toSorted(
      (a, b) => getProviderPrice(a) - getProviderPrice(b),
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

/** One entry per model (cheapest provider overall). Used for display/UI and ID lookups. */
export const chatModelOptions: ChatModelOption[] = Object.values(
  chatModelOptionsIndex,
).filter((m): m is ChatModelOption => m !== undefined);

/**
 * All (model, provider) combinations sorted cheapest-first.
 * Used exclusively by filterChatModels so filterRoleModels can pick the cheapest
 * AVAILABLE provider per model (falls back to next provider if cheapest is unconfigured).
 */
function buildChatModelOptionsPool(): ChatModelOption[] {
  const pool: ChatModelOption[] = [];
  for (const modelId of Object.values(ChatModelId)) {
    const def = chatModelDefinitions[modelId];
    if (!def) {
      continue;
    }
    const sortedProviders = [...def.providers].toSorted(
      (a, b) => getProviderPrice(a) - getProviderPrice(b),
    );
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
).map(([key, id]) => ({
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
    chatModelOptionsIndex[ChatModelId.KIMI_K2]!
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
