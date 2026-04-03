import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { STANDARD_MARKUP_PERCENTAGE } from "../../products/constants";
import type { ChatModelId, ChatModelOption } from "../ai-stream/models";
import type {
  AudioVisionModelId,
  ImageVisionModelId,
  VideoVisionModelId,
} from "../ai-stream/vision-models";
import {
  type ContentLevelValue,
  type IntelligenceLevelValue,
  type SpeedLevelValue,
} from "../chat/skills/enum";
import type { AgentTranslationKey } from "../i18n";
import type {
  ImageGenModelId,
  ImageGenModelOption,
} from "../image-generation/models";
import type {
  MusicGenModelId,
  MusicGenModelOption,
} from "../music-generation/models";
import type { SttModelId, SttModelOption } from "../speech-to-text/models";
import type { TtsModelId, TtsModelOption } from "../text-to-speech/models";
import type {
  VideoGenModelId,
  VideoGenModelOption,
} from "../video-generation/models";
import { type Modality, type ModelUtilityValue } from "./enum";

// ============================================
// CORE TYPES AND INTERFACES
// ============================================

/**
 * Model Features - Binary capabilities (slimmed down; modality handled via inputs/outputs)
 */
export interface ModelFeatures {
  streaming: boolean;
  toolCalling: boolean;
}

/**
 * Model type discriminant - determines which interface the UI renders
 * and which backend endpoint to route to.
 */
export type ModelType = "text" | "image" | "video" | "audio";

/** Union of all model ID enums. Only use where role is truly unknown (e.g. credits validator). */
export type AnyModelId =
  | ChatModelId
  | ImageGenModelId
  | MusicGenModelId
  | VideoGenModelId
  | TtsModelId
  | SttModelId
  | ImageVisionModelId
  | VideoVisionModelId
  | AudioVisionModelId;

// ============================================
// API PROVIDER
// ============================================

/**
 * API Provider enum - determines which API to use for the model
 */
export enum ApiProvider {
  OPENROUTER = "openrouter",
  CLAUDE_CODE = "claude-code",
  GAB_AI = "gab-ai",
  FREEDOMGPT = "freedomgpt",
  UNCENSORED_AI = "uncensored-ai",
  VENICE_AI = "venice-ai",
  OPENAI_IMAGES = "openai-images",
  REPLICATE = "replicate",
  FAL_AI = "fal-ai",
  OPENAI_TTS = "openai-tts",
  OPENAI_STT = "openai-stt",
  ELEVENLABS = "elevenlabs",
  DEEPGRAM = "deepgram",
  EDEN_AI_TTS = "eden-ai-tts",
  EDEN_AI_STT = "eden-ai-stt",
  MODELSLAB = "modelslab",
}

// eslint-disable-next-line i18next/no-literal-string -- API provider names are technical identifiers
export const apiProviderDisplayNames: Record<ApiProvider, string> = {
  [ApiProvider.OPENROUTER]: "OpenRouter",
  [ApiProvider.CLAUDE_CODE]: "Claude Code",
  [ApiProvider.GAB_AI]: "Gab AI",
  [ApiProvider.FREEDOMGPT]: "FreedomGPT",
  [ApiProvider.UNCENSORED_AI]: "Uncensored.ai",
  [ApiProvider.VENICE_AI]: "Venice.ai",
  [ApiProvider.OPENAI_IMAGES]: "OpenAI Images",
  [ApiProvider.REPLICATE]: "Replicate",
  [ApiProvider.FAL_AI]: "Fal.ai",
  [ApiProvider.OPENAI_TTS]: "OpenAI TTS",
  [ApiProvider.OPENAI_STT]: "OpenAI STT",
  [ApiProvider.ELEVENLABS]: "ElevenLabs",
  [ApiProvider.DEEPGRAM]: "Deepgram",
  [ApiProvider.EDEN_AI_TTS]: "Eden AI TTS",
  [ApiProvider.EDEN_AI_STT]: "Eden AI STT",
  [ApiProvider.MODELSLAB]: "ModelsLab",
};

// ============================================
// PROVIDER CONFIG INTERFACES
// ============================================

/**
 * Provider-specific config for a model variant
 */
export interface ModelProviderConfigTokenBased {
  id: ChatModelId | ImageGenModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  creditCost: typeof calculateCreditCost;
  inputTokenCost: number;
  outputTokenCost: number;
  cacheReadTokenCost?: number;
  cacheWriteTokenCost?: number;
  adminOnly?: boolean;
}
export interface ModelProviderConfigCreditBased {
  id: ChatModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  creditCost: number;
  inputTokenCost?: never;
  outputTokenCost?: never;
  adminOnly?: boolean;
}
export interface ModelProviderConfigImageBased {
  id: ImageGenModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  /** Fixed credits per generated image */
  creditCostPerImage: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  adminOnly?: boolean;
}
export interface ModelProviderConfigVideoBased {
  id: VideoGenModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  /** Credits per second of generated video */
  creditCostPerSecond: number;
  /** Default duration for upfront balance check */
  defaultDurationSeconds: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  adminOnly?: boolean;
}
export interface ModelProviderConfigAudioBased {
  id: MusicGenModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  /** Fixed credits per generated audio clip */
  creditCostPerClip: number;
  /** Default duration in seconds for upfront balance check */
  defaultDurationSeconds: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  adminOnly?: boolean;
}
export interface ModelProviderConfigTtsBased {
  id: TtsModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  creditCostPerCharacter: number;
  adminOnly?: boolean;
}
export interface ModelProviderConfigSttBased {
  id: SttModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  creditCostPerSecond: number;
  adminOnly?: boolean;
}
export type ModelProviderConfig =
  | ModelProviderConfigTokenBased
  | ModelProviderConfigCreditBased
  | ModelProviderConfigImageBased
  | ModelProviderConfigVideoBased
  | ModelProviderConfigAudioBased
  | ModelProviderConfigTtsBased
  | ModelProviderConfigSttBased;

/**
 * Optional voice metadata for TTS models
 */
export interface TtsVoiceMeta {
  gender?: "male" | "female" | "neutral";
  preview?: string;
  language?: string;
  style?: string;
}

/**
 * Model definition - canonical source of truth for each conceptual model.
 * Provider-specific details (id, apiProvider, costs) live in `providers`.
 */
export interface ModelDefinition {
  name: string;
  by: ModelProviderId;
  description: AgentTranslationKey;
  parameterCount: number | undefined;
  contextWindow: number;
  icon: IconKey;
  providers: ModelProviderConfig[];
  utilities: (typeof ModelUtilityValue)[];
  supportsTools: boolean;
  intelligence: typeof IntelligenceLevelValue;
  speed: typeof SpeedLevelValue;
  content: typeof ContentLevelValue;
  features: ModelFeatures;
  weaknesses?: (typeof ModelUtilityValue)[];
  /** Native input modalities this model accepts */
  inputs: Modality[];
  /** Native output modalities this model produces */
  outputs: Modality[];
  /** Optional voice metadata for TTS models */
  voiceMeta?: TtsVoiceMeta;
  /**
   * Set to false by the price updater when no price can be fetched.
   * Disabled models are excluded from option indexes unless enabledWithoutPrice is true.
   */
  enabled?: boolean;
  /**
   * When true, always included in model options even if price data is unavailable.
   */
  enabledWithoutPrice?: boolean;
}

// ============================================
// MODEL OPTION INTERFACES
// ============================================

/**
 * Configuration interface for AI model options.
 * Contains all necessary information for model selection and API integration.
 * Derived from ModelDefinition + ModelProviderConfig for backward compat.
 */
export interface ModelOptionBase {
  /** Unique identifier for the model */
  id: string;
  /** Human-readable display name */
  name: string;
  /** AI provider company name */
  provider: ModelProviderId;
  /** API provider to use for requests */
  apiProvider: ApiProvider;
  /** Brief description of model capabilities */
  description: AgentTranslationKey;
  /** Number of parameters in billions */
  parameterCount: number | undefined;
  /** Maximum context window size in tokens */
  contextWindow: number;
  /** Icon key from ICON_REGISTRY for UI display */
  icon: IconKey;
  /** Provider-specific model identifier */
  providerModel: string;

  /** Utility categories this model belongs to (strengths) */
  utilities: (typeof ModelUtilityValue)[];
  /** Whether this model supports tool/function calling (for search, etc.) */
  supportsTools: boolean;

  // Tier properties for the new model selection system
  /** Intelligence tier: quick, smart, or brilliant */
  intelligence: typeof IntelligenceLevelValue;
  /** Speed tier: fast, balanced, or thorough */
  speed: typeof SpeedLevelValue;
  /** Content policy tier: mainstream, open, or uncensored */
  content: typeof ContentLevelValue;
  /** Binary features the model supports */
  features: ModelFeatures;
  /** What the model is NOT good at (optional) */
  weaknesses?: (typeof ModelUtilityValue)[];
  /** Whether this model variant is only visible to admin users */
  adminOnly?: boolean;
  /** Native input modalities this model accepts */
  inputs: Modality[];
  /** Native output modalities this model produces */
  outputs: Modality[];
  /** Optional voice metadata for TTS models */
  voiceMeta?: TtsVoiceMeta;
}
export interface ModelOptionTokenBased extends ModelOptionBase {
  id: ChatModelId | ImageGenModelId;
  creditCost: typeof calculateCreditCost;
  inputTokenCost: number;
  outputTokenCost: number;
  cacheReadTokenCost?: number;
  cacheWriteTokenCost?: number;
  creditCostPerImage?: never;
}
export interface ModelOptionCreditBased extends ModelOptionBase {
  id: ChatModelId;
  creditCost: number;
  inputTokenCost?: never;
  outputTokenCost?: never;
  creditCostPerImage?: never;
}
export interface ModelOptionImageBased extends ModelOptionBase {
  id: ImageGenModelId;
  creditCostPerImage: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
}
export interface ModelOptionVideoBased extends ModelOptionBase {
  id: VideoGenModelId;
  creditCostPerSecond: number;
  defaultDurationSeconds: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  creditCostPerImage?: never;
}

export interface ModelOptionAudioBased extends ModelOptionBase {
  id: MusicGenModelId;
  creditCostPerClip: number;
  defaultDurationSeconds: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  creditCostPerImage?: never;
}

export interface ModelOptionTtsBased extends ModelOptionBase {
  id: TtsModelId;
  creditCostPerCharacter: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  creditCostPerImage?: never;
}

export interface ModelOptionSttBased extends ModelOptionBase {
  id: SttModelId;
  creditCostPerSecond: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  creditCostPerImage?: never;
}

/** Union of all role-specific model options across all modalities. */
export type AnyModelOption =
  | ChatModelOption
  | SttModelOption
  | TtsModelOption
  | ImageGenModelOption
  | MusicGenModelOption
  | VideoGenModelOption;

// ============================================
// MODEL PROVIDERS
// ============================================

export interface ModelProvider {
  name: string;
  icon: IconKey;
}

export type ModelProviderId = keyof typeof modelProviders;

export const modelProviders: Record<string, ModelProvider> = {
  openAI: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "OpenAI",
    icon: "si-openai",
  },
  google: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Google",
    icon: "si-googlegemini",
  },
  mistralAI: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Mistral AI",
    icon: "si-mistralai",
  },
  moonshotAI: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Moonshot AI",
    icon: "moon",
  },
  deepSeek: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "DeepSeek",
    icon: "whale",
  },
  alibaba: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Alibaba",
    icon: "si-alibabadotcom",
  },
  xAI: {
    name: "X-AI",
    icon: "si-x",
  },
  uncensoredAI: {
    name: "Uncensored.ai",
    icon: "uncensored-ai",
  },
  anthropic: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Anthropic",
    icon: "si-anthropic",
  },
  zAi: {
    name: "Z.AI",
    icon: "si-zendesk",
  },
  veniceAI: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Venice.ai",
    icon: "venice-ai-logo",
  },
  freedomGPT: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "FreedomGPT",
    icon: "freedom-gpt-logo",
  },
  gabAI: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Gab AI",
    icon: "gab-ai-logo",
  },
  blackForestLabs: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Black Forest Labs",
    icon: "image",
  },
  stabilityAI: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Stability AI",
    icon: "image",
  },
  meta: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Meta",
    icon: "music",
  },
  udio: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Udio",
    icon: "music",
  },
  miniMax: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "MiniMax",
    icon: "si-minimax",
  },
  xiaomi: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Xiaomi",
    icon: "si-xiaomi",
  },
  byteDanceSeed: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "ByteDance",
    icon: "si-bytedance",
  },
  elevenlabs: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "ElevenLabs",
    icon: "volume-2",
  },
  deepgram: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Deepgram",
    icon: "mic",
  },
  sourceful: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Sourceful",
    icon: "image",
  },
  modelsLab: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "ModelsLab",
    icon: "music",
  },
  byteplus: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "BytePlus",
    icon: "video",
  },
  klingai: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Kling AI",
    icon: "video",
  },
  ltx: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "LTX",
    icon: "video",
  },
  minimax: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "MiniMax",
    icon: "video",
  },
  runway: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Runway",
    icon: "video",
  },
  sync: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Sync",
    icon: "video",
  },
  xai: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "xAI",
    icon: "video",
  },
};

/**
 * Minimal env availability shape required by model count helpers.
 * Mirrors AgentEnvAvailability - usable on both server and client.
 */
export interface ModelProviderEnvAvailability {
  openRouter: boolean;
  claudeCode: boolean;
  uncensoredAI: boolean;
  freedomGPT: boolean;
  gabAI: boolean;
  veniceAI: boolean;
  openAiImages: boolean;
  replicate: boolean;
  falAi: boolean;
  modelsLab: boolean;
}

/**
 * Returns true when the given model's API provider is configured in the environment.
 * Extracted here so it works on both server and client
 * without pulling in server-only env modules.
 */
export function isModelProviderAvailable(
  model: ModelOptionBase,
  env: ModelProviderEnvAvailability,
): boolean {
  switch (model.apiProvider) {
    case ApiProvider.OPENROUTER:
      return env.openRouter;
    case ApiProvider.CLAUDE_CODE:
      return env.claudeCode;
    case ApiProvider.UNCENSORED_AI:
      return env.uncensoredAI;
    case ApiProvider.FREEDOMGPT:
      return env.freedomGPT;
    case ApiProvider.GAB_AI:
      return env.gabAI;
    case ApiProvider.VENICE_AI:
      return env.veniceAI;
    case ApiProvider.OPENAI_IMAGES:
      return env.openAiImages;
    case ApiProvider.REPLICATE:
      return env.replicate;
    case ApiProvider.FAL_AI:
      return env.falAi;
    case ApiProvider.MODELSLAB:
      return env.modelsLab;
    default:
      return true;
  }
}

function roundMediaCost(v: number): number {
  const r = Math.round(v * 10) / 10;
  return r % 1 === 0 ? Math.round(r) : r;
}

/**
 * Calculate credit cost based on token pricing
 * 1 credit = $0.01 (1 cent)
 */
/**
 * Structural parameter type for calculateCreditCost.
 * Uses structural shape (not AnyModelOption) so domain files can reference
 * `typeof calculateCreditCost` without circular type dependency.
 */
interface CreditCostInput extends ModelOptionBase {
  creditCostPerImage?: number;
  creditCostPerClip?: number;
  creditCostPerSecond?: number;
  defaultDurationSeconds?: number;
  creditCostPerCharacter?: number;
  creditCost?: number | typeof calculateCreditCost;
  inputTokenCost?: number;
  outputTokenCost?: number;
  cacheReadTokenCost?: number;
  cacheWriteTokenCost?: number;
}

export function calculateCreditCost(
  modelOption: CreditCostInput,
  actualInputTokens: number,
  actualOutputTokens: number,
  cachedInputTokens = 0,
  cacheWriteTokens = 0,
): number {
  if (modelOption.creditCostPerImage !== undefined) {
    return roundMediaCost(
      modelOption.creditCostPerImage * (1 + STANDARD_MARKUP_PERCENTAGE),
    );
  }
  if (modelOption.creditCostPerClip !== undefined) {
    return roundMediaCost(
      modelOption.creditCostPerClip * (1 + STANDARD_MARKUP_PERCENTAGE),
    );
  }
  if (
    modelOption.creditCostPerSecond !== undefined &&
    modelOption.defaultDurationSeconds !== undefined
  ) {
    return roundMediaCost(
      modelOption.creditCostPerSecond *
        modelOption.defaultDurationSeconds *
        (1 + STANDARD_MARKUP_PERCENTAGE),
    );
  }
  if (modelOption.creditCostPerSecond !== undefined) {
    return roundMediaCost(
      modelOption.creditCostPerSecond * (1 + STANDARD_MARKUP_PERCENTAGE),
    );
  }
  if (modelOption.creditCostPerCharacter !== undefined) {
    return roundMediaCost(
      modelOption.creditCostPerCharacter * (1 + STANDARD_MARKUP_PERCENTAGE),
    );
  }
  if (typeof modelOption.creditCost === "number") {
    // Fixed-credit models store raw API cost; apply markup here like all other billing types.
    return roundMediaCost(
      modelOption.creditCost * (1 + STANDARD_MARKUP_PERCENTAGE),
    );
  }

  const DOLLARS_PER_CREDIT = 0.01;
  const inputTokenCost = modelOption.inputTokenCost ?? 0;
  const outputTokenCost = modelOption.outputTokenCost ?? 0;
  const uncachedInputTokens = actualInputTokens - cachedInputTokens;
  const uncachedInputCost = (inputTokenCost / 1_000_000) * uncachedInputTokens;
  const effectiveCacheReadRate =
    modelOption.cacheReadTokenCost ?? inputTokenCost;
  const cachedInputCost =
    (effectiveCacheReadRate / 1_000_000) * cachedInputTokens;
  const effectiveCacheWriteRate =
    modelOption.cacheWriteTokenCost ?? inputTokenCost;
  const cacheWriteCost =
    (effectiveCacheWriteRate / 1_000_000) * cacheWriteTokens;
  const outputCostPerMessage =
    (outputTokenCost / 1_000_000) * actualOutputTokens;
  const totalCostPerMessage =
    uncachedInputCost + cachedInputCost + cacheWriteCost + outputCostPerMessage;
  const credits =
    (totalCostPerMessage / DOLLARS_PER_CREDIT) *
    (1 + STANDARD_MARKUP_PERCENTAGE);
  const rounded = Math.round(credits * 10) / 10;
  return rounded % 1 === 0 ? Math.round(rounded) : rounded;
}

// Default features for models without specific features
export const defaultFeatures: ModelFeatures = {
  streaming: true,
  toolCalling: false,
};

// Default modality declarations for LLMs (text-only)
export const defaultLlmModality = {
  inputs: ["text"] as Modality[],
  outputs: ["text"] as Modality[],
};

// ============================================
// CENTRAL PRICE UTILITIES
// ============================================

/** Default token counts for representative price comparison per message */
const PRICE_REFERENCE_INPUT_TOKENS = 5000;
const PRICE_REFERENCE_OUTPUT_TOKENS = 1500;

/** Reference sizes for TTS/STT representative pricing (typical single usage) */
export const PRICE_REFERENCE_TTS_CHARS = 600; // ~100 words spoken aloud
export const PRICE_REFERENCE_STT_SECONDS = 30; // typical voice message

/**
 * Get the representative credit cost for a model option (with 30% markup).
 * Use for display, sorting, and comparison — NOT for actual billing.
 * For actual billing, use calculateCreditCost() with real token counts.
 *
 * TTS/STT models return an average-usage cost (e.g. 600 chars for TTS,
 * 30 seconds for STT) so the value is meaningful for display and sorting.
 */
export function getModelPrice(model: CreditCostInput): number {
  // TTS: per-character billing → use reference message size
  if (model.creditCostPerCharacter !== undefined) {
    return roundMediaCost(
      model.creditCostPerCharacter *
        PRICE_REFERENCE_TTS_CHARS *
        (1 + STANDARD_MARKUP_PERCENTAGE),
    );
  }
  // STT: per-second billing without fixed duration → use reference recording length
  if (
    model.creditCostPerSecond !== undefined &&
    model.defaultDurationSeconds === undefined
  ) {
    return roundMediaCost(
      model.creditCostPerSecond *
        PRICE_REFERENCE_STT_SECONDS *
        (1 + STANDARD_MARKUP_PERCENTAGE),
    );
  }
  return calculateCreditCost(
    model,
    PRICE_REFERENCE_INPUT_TOKENS,
    PRICE_REFERENCE_OUTPUT_TOKENS,
  );
}

/**
 * Extract a raw representative cost from a provider config (no markup).
 * Used to sort providers by price within buildXxxModelOptions().
 */
export function getProviderPrice(p: ModelProviderConfig): number {
  if ("creditCostPerImage" in p && p.creditCostPerImage !== undefined) {
    return p.creditCostPerImage;
  }
  if ("creditCostPerClip" in p && p.creditCostPerClip !== undefined) {
    return p.creditCostPerClip;
  }
  if (
    "creditCostPerSecond" in p &&
    p.creditCostPerSecond !== undefined &&
    "defaultDurationSeconds" in p &&
    p.defaultDurationSeconds !== undefined
  ) {
    return p.creditCostPerSecond * p.defaultDurationSeconds;
  }
  if ("creditCostPerSecond" in p && p.creditCostPerSecond !== undefined) {
    return p.creditCostPerSecond;
  }
  if ("creditCostPerCharacter" in p && p.creditCostPerCharacter !== undefined) {
    return p.creditCostPerCharacter;
  }
  if ("inputTokenCost" in p && p.inputTokenCost !== undefined) {
    return (
      (p.inputTokenCost * PRICE_REFERENCE_INPUT_TOKENS +
        (p.outputTokenCost ?? 0) * PRICE_REFERENCE_OUTPUT_TOKENS) /
      1_000_000
    );
  }
  if ("creditCost" in p && typeof p.creditCost === "number") {
    return p.creditCost;
  }
  return 0;
}

// Cross-domain aggregates (getModelDisplayName, TOTAL_MODEL_COUNT, etc.)
// live in ./all-models.ts to break the circular dependency with domain models files.
