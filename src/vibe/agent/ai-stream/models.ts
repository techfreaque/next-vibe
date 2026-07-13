import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { z } from "zod";

import type { AgentEnvAvailability } from "../env-availability";
import {
  ApiProvider,
  filterRoleModels,
  getModelForProvider,
  getProviderPrice,
  type ModelDefinition,
  type ModelOptionCreditBased,
  type ModelOptionTokenBased,
} from "../models/models";
import {
  type FiltersModelSelection,
  filtersSelectionSchema,
  sharedFilterPropsSchema,
} from "../models/selection";
import { ModelSelectionType } from "../skills/enum";
import { chatModelDefinitions, ChatModelId } from "./models-definitions";

export { chatModelDefinitions, ChatModelId };

/**
 * String-keyed lookup for chat model definitions.
 * Use this in media-gen files to avoid importing ChatModelId.
 */
export const chatModelDefinitionsByString: Record<string, ModelDefinition> =
  chatModelDefinitions;

/**
 * Featured models by category for use in marketing content, emails, etc.
 */
export const FEATURED_MODELS = {
  // Representative picks per category - used in marketing content and emails
  mainstream: [
    chatModelDefinitions[ChatModelId.CLAUDE_OPUS_4_7].name,
    chatModelDefinitions[ChatModelId.GPT_5_5_PRO].name,
    chatModelDefinitions[ChatModelId.GEMINI_3_1_PRO_PREVIEW_CUSTOM_TOOLS].name,
    chatModelDefinitions[ChatModelId.GROK_4_20].name,
  ],
  open: [
    chatModelDefinitions[ChatModelId.DEEPSEEK_R1].name,
    chatModelDefinitions[ChatModelId.DEEPSEEK_V4_PRO].name,
    chatModelDefinitions[ChatModelId.GLM_5].name,
  ],
  uncensored: [
    chatModelDefinitions[ChatModelId.UNCENSORED_LM_V1_2].name,
    chatModelDefinitions[ChatModelId.FREEDOMGPT_LIBERTY].name,
    chatModelDefinitions[ChatModelId.GAB_AI_ARYA].name,
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

/**
 * Resolve a chat model option using a specific API provider.
 * Picks the cheapest provider variant for `modelId` that matches `provider` from the pool.
 * Falls back to the default (cheapest overall) if no matching provider exists.
 */
export function getChatModelForProvider(
  modelId: ChatModelId,
  provider: ApiProvider,
): ChatModelOption {
  return (
    getModelForProvider(
      modelId,
      provider,
      chatModelOptionsPool,
      getChatModelById(modelId),
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

// ============================================================
// CHAT MODEL RESOLUTION
// ============================================================

/** Get all chat models matching a selection (MANUAL falls back to FILTERS if unavailable). */
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
  return filterRoleModels(pool, selection, user, availability);
}

/** Get best chat model from a selection. */
export function getBestChatModel(
  selection: ChatModelSelection,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): ChatModelOption | null {
  return filterChatModels(selection, user, availability)[0] ?? null;
}
