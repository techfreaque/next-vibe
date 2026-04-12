import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { agentEnvAvailability } from "../env-availability";
import { STANDARD_MARKUP_PERCENTAGE } from "../../products/constants";
import type { ChatModelId, ChatModelOption } from "../ai-stream/models";
import type {
  AudioVisionModelId,
  ImageVisionModelId,
  VideoVisionModelId,
} from "../ai-stream/vision-models";
import {
  ContentLevelDB,
  type ContentLevelValue,
  IntelligenceLevelDB,
  type IntelligenceLevelValue,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  PriceLevel,
  PriceLevelDB,
} from "../chat/skills/enum";
import type { SkillsT } from "../chat/skills/i18n";
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
  UNBOTTLED = "unbottled",
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
  [ApiProvider.UNBOTTLED]: "Unbottled AI",
};

// ============================================
// PROVIDER CONFIG INTERFACES
// ============================================

/**
 * Provider-specific config for a model variant
 */
export interface ModelProviderConfigTokenBased {
  id: ChatModelId | ImageGenModelId | VideoGenModelId | MusicGenModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  creditCost: typeof calculateCreditCost;
  inputTokenCost: number;
  outputTokenCost: number;
  cacheReadTokenCost?: number;
  cacheWriteTokenCost?: number;
  adminOnly?: boolean;
  creditCostPerImage?: never;
  creditCostPerSecond?: never;
  creditCostPerClip?: never;
  creditCostPerCharacter?: never;
  defaultDurationSeconds?: never;
}
export interface ModelProviderConfigCreditBased {
  id: ChatModelId | ImageGenModelId | VideoGenModelId | MusicGenModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  creditCost: number;
  inputTokenCost?: never;
  outputTokenCost?: never;
  adminOnly?: boolean;
  creditCostPerImage?: never;
  creditCostPerSecond?: never;
  creditCostPerClip?: never;
  creditCostPerCharacter?: never;
  defaultDurationSeconds?: never;
}
export interface ModelProviderConfigImageBased {
  id: ImageGenModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  /** Fixed credits per generated image (base price) */
  creditCostPerImage: number;
  /** Which image sizes this model supports (empty = no size option; undefined = all sizes) */
  supportedSizes?: readonly string[];
  /** Which quality options this model supports (empty/undefined = no quality option) */
  supportedQualities?: readonly string[];
  /** Override creditCostPerImage per size (key = ImageSize value) */
  pricingBySize?: Partial<Record<string, number>>;
  /** Override creditCostPerImage per quality (key = ImageQuality value) */
  pricingByQuality?: Partial<Record<string, number>>;
  /** Override creditCostPerImage per resolution (key = resolution string e.g. "1024px") */
  pricingByResolution?: Partial<Record<string, number>>;
  /** Which resolution options this model supports (e.g. ["1024px", "2048px"]) */
  supportedResolutions?: readonly string[];
  /** Which aspect ratios this model supports (e.g. ["16:9", "9:16", "1:1"]) */
  supportedAspectRatios?: readonly string[];
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  adminOnly?: boolean;
  creditCostPerSecond?: never;
  creditCostPerClip?: never;
  creditCostPerCharacter?: never;
  defaultDurationSeconds?: never;
}
export interface ModelProviderConfigVideoBased {
  id: VideoGenModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  /** Credits per second of generated video (base/lowest resolution price) */
  creditCostPerSecond: number;
  /** Default duration for upfront balance check */
  defaultDurationSeconds: number;
  /** Which duration options this model supports (undefined = all) */
  supportedDurations?: readonly string[];
  /** Maximum duration in seconds this model supports */
  maxDurationSeconds?: number;
  /** Minimum duration in seconds this model supports */
  minDurationSeconds?: number;
  /** Which resolution options this model supports (e.g. ["720p","1080p"]) */
  supportedResolutions?: readonly string[];
  /** Which aspect ratios this model supports (e.g. ["16:9","9:16"]) */
  supportedAspectRatios?: readonly string[];
  /** Override creditCostPerSecond per resolution (e.g. { "1080p": 15 }) */
  pricingByResolution?: Partial<Record<string, number>>;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  adminOnly?: boolean;
  creditCostPerImage?: never;
  creditCostPerClip?: never;
  creditCostPerCharacter?: never;
}
export interface ModelProviderConfigAudioBased {
  id: MusicGenModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  /** Fixed credits per generated audio clip */
  creditCostPerClip: number;
  /** Default duration in seconds for upfront balance check */
  defaultDurationSeconds: number;
  /** Which duration options this model supports (undefined = all) */
  supportedDurations?: readonly string[];
  /** Minimum duration in seconds this model supports (e.g. 30 for ModelsLab) */
  minDurationSeconds?: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  adminOnly?: boolean;
  creditCostPerImage?: never;
  creditCostPerSecond?: never;
  creditCostPerCharacter?: never;
}
export interface ModelProviderConfigTtsBased {
  id: TtsModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  creditCostPerCharacter: number;
  adminOnly?: boolean;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  creditCostPerImage?: never;
  creditCostPerSecond?: never;
  creditCostPerClip?: never;
  defaultDurationSeconds?: never;
}
export interface ModelProviderConfigSttBased {
  id: SttModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  creditCostPerSecond: number;
  adminOnly?: boolean;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  creditCostPerImage?: never;
  creditCostPerClip?: never;
  creditCostPerCharacter?: never;
  defaultDurationSeconds?: never;
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
  creditCost: typeof calculateCreditCost;
  inputTokenCost: number;
  outputTokenCost: number;
  cacheReadTokenCost?: number;
  cacheWriteTokenCost?: number;
  /** Estimated output tokens per generated image, for price display on image-gen LLM models */
  estimatedImageOutputTokens?: number;
  creditCostPerImage?: never;
  creditCostPerSecond?: never;
  creditCostPerClip?: never;
  creditCostPerCharacter?: never;
  defaultDurationSeconds?: never;
}
export interface ModelOptionCreditBased extends ModelOptionBase {
  id: ChatModelId;
  creditCost: number;
  inputTokenCost?: never;
  outputTokenCost?: never;
  creditCostPerImage?: never;
  creditCostPerSecond?: never;
  creditCostPerClip?: never;
  creditCostPerCharacter?: never;
  defaultDurationSeconds?: never;
}
/** Union of all billing-shape interfaces - used for type-safe guard discrimination. */
export type AnyModelOptionShape =
  | ModelOptionTokenBased
  | ModelOptionCreditBased
  | ModelOptionImageBased
  | ModelOptionVideoBased
  | ModelOptionAudioBased
  | ModelOptionTtsBased
  | ModelOptionSttBased;

export function isModelOptionTokenBased(
  opt: AnyModelOptionShape,
): opt is ModelOptionTokenBased {
  return typeof opt.creditCost === "function";
}
export function isModelOptionImageBased(
  opt: AnyModelOptionShape,
): opt is ModelOptionImageBased {
  return opt.creditCostPerImage !== undefined;
}
export interface ModelOptionImageBased extends ModelOptionBase {
  creditCostPerImage: number;
  /** Which image sizes this model supports (empty = no size option; undefined = all sizes) */
  supportedSizes?: readonly string[];
  /** Which quality options this model supports (empty/undefined = no quality option) */
  supportedQualities?: readonly string[];
  /** Override creditCostPerImage per size */
  pricingBySize?: Partial<Record<string, number>>;
  /** Override creditCostPerImage per quality */
  pricingByQuality?: Partial<Record<string, number>>;
  /** Override creditCostPerImage per resolution */
  pricingByResolution?: Partial<Record<string, number>>;
  /** Which resolution options this model supports */
  supportedResolutions?: readonly string[];
  /** Which aspect ratios this model supports */
  supportedAspectRatios?: readonly string[];
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  creditCostPerSecond?: never;
  creditCostPerClip?: never;
  creditCostPerCharacter?: never;
  defaultDurationSeconds?: never;
}
export interface ModelOptionVideoBased extends ModelOptionBase {
  creditCostPerSecond: number;
  defaultDurationSeconds: number;
  /** Which duration options this model supports (undefined = all) */
  supportedDurations?: readonly string[];
  /** Maximum duration in seconds */
  maxDurationSeconds?: number;
  /** Minimum duration in seconds */
  minDurationSeconds?: number;
  /** Which resolution options this model supports */
  supportedResolutions?: readonly string[];
  /** Which aspect ratios this model supports */
  supportedAspectRatios?: readonly string[];
  /** Override creditCostPerSecond per resolution */
  pricingByResolution?: Partial<Record<string, number>>;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  creditCostPerImage?: never;
  creditCostPerClip?: never;
  creditCostPerCharacter?: never;
}

export interface ModelOptionAudioBased extends ModelOptionBase {
  creditCostPerClip: number;
  defaultDurationSeconds: number;
  /** Which duration options this model supports (undefined = all) */
  supportedDurations?: readonly string[];
  /** Minimum duration in seconds (e.g. 30 for ModelsLab) */
  minDurationSeconds?: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  creditCostPerImage?: never;
  creditCostPerSecond?: never;
  creditCostPerCharacter?: never;
}

export interface ModelOptionTtsBased extends ModelOptionBase {
  id: TtsModelId;
  creditCostPerCharacter: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  creditCostPerImage?: never;
  creditCostPerSecond?: never;
  creditCostPerClip?: never;
  defaultDurationSeconds?: never;
}

export interface ModelOptionSttBased extends ModelOptionBase {
  id: SttModelId;
  creditCostPerSecond: number;
  defaultDurationSeconds?: never;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  creditCostPerImage?: never;
  creditCostPerClip?: never;
  creditCostPerCharacter?: never;
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
 * Returns true when the given API provider is configured in the environment.
 * Works on both server and client without pulling in server-only env modules.
 */
export function isApiProviderAvailable(provider: ApiProvider): boolean {
  const env = agentEnvAvailability;
  switch (provider) {
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
    case ApiProvider.UNBOTTLED:
      return env.unbottled;
    case ApiProvider.OPENAI_STT:
      return env.openAiStt;
    case ApiProvider.EDEN_AI_STT:
      return env.edenAiStt;
    case ApiProvider.DEEPGRAM:
      return env.deepgram;
    case ApiProvider.OPENAI_TTS:
      return env.openAiTts;
    case ApiProvider.EDEN_AI_TTS:
      return env.edenAiTts;
    case ApiProvider.ELEVENLABS:
      return env.elevenlabs;
    default:
      return true;
  }
}

/**
 * Returns true when the given model's API provider is configured in the environment.
 * Extracted here so it works on both server and client
 * without pulling in server-only env modules.
 */
export function isModelProviderAvailable(model: ModelOptionBase): boolean {
  return isApiProviderAvailable(model.apiProvider);
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
 * Use for display, sorting, and comparison - NOT for actual billing.
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

// Cross-domain aggregates (getModelDisplayName, getAvailableModelCount, etc.)
// live in ./all-models.ts to break the circular dependency with domain models files.

// ============================================================
// GENERIC ROLE FILTER UTIL
// ============================================================

function getModelPriceLevel(creditCost: number): string {
  if (creditCost <= 3) {
    return PriceLevel.CHEAP;
  }
  if (creditCost <= 9) {
    return PriceLevel.STANDARD;
  }
  return PriceLevel.PREMIUM;
}

export function meetsRangeConstraint<T>(
  modelValue: T,
  range: { min?: T; max?: T } | undefined,
  order: readonly T[],
): boolean {
  if (!range) {
    return true;
  }
  const modelIndex = order.indexOf(modelValue);
  if (range.min !== undefined && modelIndex < order.indexOf(range.min)) {
    return false;
  }
  if (range.max !== undefined && modelIndex > order.indexOf(range.max)) {
    return false;
  }
  return true;
}

/**
 * Generic pool filter for any model role.
 * Handles: null → all available, MANUAL → lookup by id (fallback to FILTERS on unavailable), FILTERS → range constraints + sort.
 */
export function filterRoleModels<
  TOption extends ModelOptionBase,
  TSelection extends {
    selectionType: string;
    manualModelId?: string;
    intelligenceRange?: { min?: string; max?: string };
    contentRange?: { min?: string; max?: string };
    priceRange?: { min?: string; max?: string };
    sortBy?: string;
    sortDirection?: string;
    sortBy2?: string;
    sortDirection2?: string;
  },
>(
  pool: TOption[],
  selection: TSelection | null | undefined,
  user: JwtPayloadType,
): TOption[] {
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  if (!selection) {
    return pool.filter(
      (m) => (!m.adminOnly || isAdmin) && isModelProviderAvailable(m),
    );
  }
  if (selection.selectionType === ModelSelectionType.MANUAL) {
    if (selection.manualModelId) {
      // Collect all pool entries for this model ID (multi-provider pools like TTS/STT
      // have one entry per provider, sorted cheapest-first).
      const candidates = pool.filter((m) => m.id === selection.manualModelId);
      if (candidates[0]?.adminOnly && !isAdmin) {
        return [];
      }
      // Pick the cheapest available provider for this model ID.
      const available = candidates.find((m) => isModelProviderAvailable(m));
      if (available) {
        return [available];
      }
      // No provider available for this specific model - fall through to filter fallback.
    }
    // Fall through to filter fallback
  }
  const filtered = pool.filter((m) => {
    if (m.adminOnly && !isAdmin) {
      return false;
    }
    if (!isModelProviderAvailable(m)) {
      return false;
    }
    const modelPrice = getModelPriceLevel(getModelPrice(m));
    return (
      meetsRangeConstraint(
        m.intelligence,
        selection.intelligenceRange,
        IntelligenceLevelDB,
      ) &&
      meetsRangeConstraint(m.content, selection.contentRange, ContentLevelDB) &&
      meetsRangeConstraint(modelPrice, selection.priceRange, PriceLevelDB)
    );
  });
  if (!selection.sortBy) {
    return filtered;
  }
  return filtered.toSorted((a, b) => {
    const dir1 = selection.sortDirection ?? ModelSortDirection.DESC;
    const v1a = getRoleModelSortValue(a, selection.sortBy);
    const v1b = getRoleModelSortValue(b, selection.sortBy);
    const primary = dir1 === ModelSortDirection.ASC ? v1a - v1b : v1b - v1a;
    if (primary !== 0 || !selection.sortBy2) {
      return primary;
    }
    const dir2 = selection.sortDirection2 ?? ModelSortDirection.DESC;
    const v2a = getRoleModelSortValue(a, selection.sortBy2);
    const v2b = getRoleModelSortValue(b, selection.sortBy2);
    return dir2 === ModelSortDirection.ASC ? v2a - v2b : v2b - v2a;
  });
}

function getRoleModelSortValue(
  model: ModelOptionBase,
  sortBy: string | undefined,
): number {
  switch (sortBy) {
    case ModelSortField.INTELLIGENCE: {
      const idx = IntelligenceLevelDB.indexOf(model.intelligence);
      return idx === -1 ? 0 : idx;
    }
    case ModelSortField.PRICE:
      return getModelPrice(model);
    case ModelSortField.CONTENT: {
      const idx = ContentLevelDB.indexOf(model.content);
      return idx === -1 ? 0 : idx;
    }
    default:
      return 0;
  }
}

/**
 * Build an index (Record<id, option>) from a flat options array.
 * The LAST entry for a given ID wins (cheapest-first arrays → cheapest overall).
 * Use for by-id lookups when you only need the default (cheapest) provider.
 */
export function buildModelOptionsIndex<TOption extends ModelOptionBase>(
  options: TOption[],
): Partial<Record<string, TOption>> {
  const index: Partial<Record<string, TOption>> = {};
  for (const opt of options) {
    // First entry wins - caller must pass cheapest-first array
    if (!index[opt.id]) {
      index[opt.id] = opt;
    }
  }
  return index;
}

/**
 * Find the cheapest variant of `modelId` that uses `provider` from the given pool.
 * Pool must be sorted cheapest-first so the first matching entry is the cheapest.
 * Returns `fallback` (typically the default cheapest-overall entry) if no match.
 */
export function getModelForProvider<TOption extends ModelOptionBase>(
  modelId: string,
  provider: ApiProvider,
  pool: TOption[],
  fallback: TOption | undefined,
): TOption | undefined {
  return (
    pool.find((m) => m.id === modelId && m.apiProvider === provider) ?? fallback
  );
}

/** Format credit cost for display */
export function formatCreditCost(
  cost: number,
  t: SkillsT,
  isTokenBased = false,
): string {
  const prefix = isTokenBased ? "~" : "";
  if (cost === 0) {
    return t("selector.free");
  }
  if (cost === 1) {
    return `${prefix}${t("credits.credit", { count: cost })}`;
  }
  return `${prefix}${t("credits.credits", { count: cost })}`;
}
