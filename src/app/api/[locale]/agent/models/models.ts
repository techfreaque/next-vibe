import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { STANDARD_MARKUP_PERCENTAGE } from "../../products/constants";
import {
  ContentLevel,
  type ContentLevelValue,
  IntelligenceLevel,
  type IntelligenceLevelValue,
  SpeedLevel,
  type SpeedLevelValue,
} from "../chat/skills/enum";
import type { AgentTranslationKey } from "../i18n";
import {
  type Modality,
  type ModelRole,
  ModelUtility,
  type ModelUtilityValue,
} from "./enum";

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

/**
 * Available AI model identifiers for the chat system.
 * Each model has different pricing, capabilities, and context windows.
 */
export enum ModelId {
  GPT_5_4 = "gpt-54",
  GPT_5_4_PRO = "gpt-54-pro",
  GPT_5_4_MINI = "gpt-5.4-mini",
  GPT_5_4_NANO = "gpt-5.4-nano",
  GPT_5_3_CODEX = "gpt-53-codex",
  GPT_5_3_CHAT = "gpt-53-chat",
  GPT_5_2 = "gpt-52",
  GPT_5_2_CHAT = "gpt-52-chat",
  GPT_5_2_PRO = "gpt-52-pro",
  GPT_5_1 = "gpt-51",
  GPT_5_1_CODEX = "gpt-51-codex",
  GTP_5_PRO = "gpt-5-pro",
  GPT_5_CODEX = "gpt-5-codex",
  GPT_5 = "gpt-5",
  GPT_5_MINI = "gpt-5-mini",
  GPT_5_NANO = "gpt-5-nano",
  GEMINI_3_1_PRO_PREVIEW_CUSTOM_TOOLS = "gemini-3.1-pro-preview-customtools",
  GEMINI_3_1_FLASH_IMAGE_PREVIEW = "gemini-3.1-flash-image-preview",
  GEMINI_3_1_FLASH_LITE_PREVIEW = "gemini-3.1-flash-lite-preview",
  GEMINI_3_FLASH = "gemini-3-flash",
  GEMINI_2_5_PRO = "gemini-2.5-pro",
  GEMINI_2_5_FLASH = "gemini-2.5-flash",
  GEMINI_2_5_FLASH_LITE = "gemini-2.5-flash-lite",
  // MISTRAL_NEMO = "mistral-nemo",
  DEEPSEEK_R1_DISTILL = "deepseek-r1-distill",
  QWEN_2_5_7B = "qwen-2-5-7b",
  KIMI_K2_5 = "kimi_k2_5",
  KIMI_K2 = "kimi-k2",
  KIMI_K2_THINKING = "kimi-k2-thinking",
  DEEPSEEK_V32 = "deepseek-v3.2",
  DEEPSEEK_V31 = "deepseek-v3.1",
  DEEPSEEK_R1 = "deepseek-r1",
  QWEN3_235B_FREE = "qwen3_235b-free",
  GPT_OSS_120B = "gpt-oss-120b-free",
  GROK_4_FAST = "grok-4-fast",
  GROK_4 = "grok-4",
  GROK_4_20_BETA = "grok-4.20-beta",
  UNCENSORED_LM_V1_2 = "uncensored-lm-v1.2",
  CLAUDE_HAIKU_4_5 = "claude-haiku-4.5",
  CLAUDE_SONNET_4_5 = "claude-sonnet-4.5",
  CLAUDE_SONNET_4_6 = "claude-sonnet-4.6",
  CLAUDE_OPUS_4_5 = "claude-opus-4.5",
  CLAUDE_OPUS_4_6 = "claude-opus-4.6",
  GLM_5 = "glm-5",
  GLM_5_TURBO = "glm-5-turbo",
  GLM_4_7 = "glm-4.7",
  GLM_4_7_FLASH = "glm-4.7-flash",
  GLM_4_6 = "glm-4.6",
  GLM_4_5_AIR = "glm-4.5-air",
  GLM_4_5V = "glm-4.5v",
  VENICE_UNCENSORED = "venice-uncensored",
  // DOLPHIN_3_0_MISTRAL_24B = "dolphin-3.0-mistral-24b",
  // DOLPHIN_LLAMA_3_70B = "dolphin-llama-3.70b",
  // DOLPHIN_3_0_R1_MISTRAL_24B = "dolphin-3.0-r1-mistral-24b",
  MINIMAX_M2_7 = "minimax-m2.7",
  MIMO_V2_PRO = "mimo-v2-pro",
  FREEDOMGPT_LIBERTY = "freedomgpt-liberty",
  GAB_AI_ARYA = "gab-ai-arya",
  // Claude Code provider variants (admin-only, same underlying model)
  CLAUDE_CODE_HAIKU = "claude-code-haiku",
  CLAUDE_CODE_SONNET = "claude-code-sonnet",
  CLAUDE_CODE_OPUS = "claude-code-opus",

  // Image generation models
  DALL_E_3 = "dall-e-3",
  GPT_IMAGE_1 = "gpt-image-1",
  FLUX_SCHNELL = "flux-schnell",
  FLUX_PRO = "flux-pro",
  SDXL = "sdxl",
  FLUX_2_MAX = "flux-2-max",
  FLUX_2_KLEIN_4B = "flux-2-klein-4b",
  RIVERFLOW_V2_PRO = "riverflow-v2-pro",
  RIVERFLOW_V2_FAST = "riverflow-v2-fast",
  RIVERFLOW_V2_MAX_PREVIEW = "riverflow-v2-max-preview",
  RIVERFLOW_V2_STANDARD_PREVIEW = "riverflow-v2-standard-preview",
  RIVERFLOW_V2_FAST_PREVIEW = "riverflow-v2-fast-preview",
  FLUX_2_FLEX = "flux-2-flex",
  FLUX_2_PRO = "flux-2-pro",
  GEMINI_3_PRO_IMAGE_PREVIEW = "gemini-3-pro-image-preview",
  GPT_5_IMAGE_MINI = "gpt-5-image-mini",
  GPT_5_IMAGE = "gpt-5-image",
  SEEDREAM_4_5 = "seedream-4.5",

  // Music generation models
  MUSICGEN_STEREO = "musicgen-stereo",
  STABLE_AUDIO = "stable-audio",
  UDIO_V2 = "udio-v2",
  MODELSLAB_MUSIC_GEN = "modelslab-music-gen",

  // Video generation models
  MODELSLAB_WAN_2_5_T2V = "modelslab-wan-2-5-t2v",
  MODELSLAB_WAN_2_5_I2V = "modelslab-wan-2-5-i2v",
  MODELSLAB_WAN_2_6_T2V = "modelslab-wan-2-6-t2v",
  MODELSLAB_WAN_2_6_I2V = "modelslab-wan-2-6-i2v",
  MODELSLAB_WAN_2_6_I2V_FLASH = "modelslab-wan-2-6-i2v-flash",
  MODELSLAB_SEEDANCE_T2V = "modelslab-seedance-t2v",
  MODELSLAB_SEEDANCE_I2V = "modelslab-seedance-i2v",
  MODELSLAB_OMNIHUMAN = "modelslab-omnihuman",
  MODELSLAB_SEEDANCE_1_PRO_I2V = "modelslab-seedance-1-pro-i2v",
  MODELSLAB_SEEDANCE_1_PRO_FAST_I2V = "modelslab-seedance-1-pro-fast-i2v",
  MODELSLAB_SEEDANCE_1_PRO_FAST_T2V = "modelslab-seedance-1-pro-fast-t2v",
  MODELSLAB_OMNIHUMAN_1_5 = "modelslab-omnihuman-1-5",
  MODELSLAB_SEEDANCE_1_5_PRO = "modelslab-seedance-1-5-pro",
  MODELSLAB_VEO_2 = "modelslab-veo-2",
  MODELSLAB_VEO_3 = "modelslab-veo-3",
  MODELSLAB_VEO_3_FAST = "modelslab-veo-3-fast",
  MODELSLAB_VEO_3_FAST_PREVIEW = "modelslab-veo-3-fast-preview",
  MODELSLAB_VEO_3_1 = "modelslab-veo-3-1",
  MODELSLAB_VEO_3_1_FAST = "modelslab-veo-3-1-fast",
  MODELSLAB_KLING_V2_1_I2V = "modelslab-kling-v2-1-i2v",
  MODELSLAB_KLING_V2_5_TURBO_I2V = "modelslab-kling-v2-5-turbo-i2v",
  MODELSLAB_KLING_V2_5_TURBO_T2V = "modelslab-kling-v2-5-turbo-t2v",
  MODELSLAB_KLING_V2_MASTER_T2V = "modelslab-kling-v2-master-t2v",
  MODELSLAB_KLING_V2_MASTER_I2V = "modelslab-kling-v2-master-i2v",
  MODELSLAB_KLING_V2_1_MASTER_T2V = "modelslab-kling-v2-1-master-t2v",
  MODELSLAB_KLING_V2_1_MASTER_I2V = "modelslab-kling-v2-1-master-i2v",
  MODELSLAB_KLING_V1_6_MULTI_I2V = "modelslab-kling-v1-6-multi-i2v",
  MODELSLAB_KLING_3_0_T2V = "modelslab-kling-3-0-t2v",
  MODELSLAB_LTX_2_PRO_T2V = "modelslab-ltx-2-pro-t2v",
  MODELSLAB_LTX_2_PRO_I2V = "modelslab-ltx-2-pro-i2v",
  MODELSLAB_LTX_2_3_PRO_I2V = "modelslab-ltx-2-3-pro-i2v",
  MODELSLAB_HAILUO_2_3_T2V = "modelslab-hailuo-2-3-t2v",
  MODELSLAB_HAILUO_02_T2V = "modelslab-hailuo-02-t2v",
  MODELSLAB_HAILUO_2_3_I2V = "modelslab-hailuo-2-3-i2v",
  MODELSLAB_HAILUO_2_3_FAST_I2V = "modelslab-hailuo-2-3-fast-i2v",
  MODELSLAB_HAILUO_02_I2V = "modelslab-hailuo-02-i2v",
  MODELSLAB_HAILUO_02_START_END = "modelslab-hailuo-02-start-end",
  MODELSLAB_SORA_2 = "modelslab-sora-2",
  MODELSLAB_SORA_2_PRO = "modelslab-sora-2-pro",
  MODELSLAB_GEN4_T2I_TURBO = "modelslab-gen4-t2i-turbo",
  MODELSLAB_GEN4_ALEPH = "modelslab-gen4-aleph",
  MODELSLAB_LIPSYNC_2 = "modelslab-lipsync-2",
  MODELSLAB_GROK_T2V = "modelslab-grok-t2v",
  MODELSLAB_GROK_I2V = "modelslab-grok-i2v",

  // TTS voices
  OPENAI_ALLOY = "openai-alloy",
  OPENAI_NOVA = "openai-nova",
  OPENAI_ONYX = "openai-onyx",
  OPENAI_ECHO = "openai-echo",
  OPENAI_SHIMMER = "openai-shimmer",
  OPENAI_FABLE = "openai-fable",
  ELEVENLABS_RACHEL = "elevenlabs-rachel",
  ELEVENLABS_JOSH = "elevenlabs-josh",
  ELEVENLABS_BELLA = "elevenlabs-bella",
  ELEVENLABS_ADAM = "elevenlabs-adam",

  // STT models
  OPENAI_WHISPER = "openai-whisper",
  DEEPGRAM_NOVA_2 = "deepgram-nova-2",
}

/**
 * TTS model IDs - ModelId values with modelRole: "tts"
 * Use this type for voiceId fields instead of plain string or ModelId
 */
export type TtsModelId =
  | ModelId.OPENAI_ALLOY
  | ModelId.OPENAI_NOVA
  | ModelId.OPENAI_ONYX
  | ModelId.OPENAI_ECHO
  | ModelId.OPENAI_SHIMMER
  | ModelId.OPENAI_FABLE
  | ModelId.ELEVENLABS_RACHEL
  | ModelId.ELEVENLABS_JOSH
  | ModelId.ELEVENLABS_BELLA
  | ModelId.ELEVENLABS_ADAM;

/**
 * All valid TTS voice model IDs (for Zod enum validation)
 */
export const TTS_MODEL_IDS = [
  ModelId.OPENAI_ALLOY,
  ModelId.OPENAI_NOVA,
  ModelId.OPENAI_ONYX,
  ModelId.OPENAI_ECHO,
  ModelId.OPENAI_SHIMMER,
  ModelId.OPENAI_FABLE,
  ModelId.ELEVENLABS_RACHEL,
  ModelId.ELEVENLABS_JOSH,
  ModelId.ELEVENLABS_BELLA,
  ModelId.ELEVENLABS_ADAM,
] as const satisfies TtsModelId[];

/**
 * System default TTS voice ID
 */
export const DEFAULT_TTS_VOICE_ID: TtsModelId = ModelId.OPENAI_NOVA;

/**
 * STT model IDs - ModelId values with modelRole: "stt"
 */
export type SttModelId = ModelId.OPENAI_WHISPER | ModelId.DEEPGRAM_NOVA_2;

export const STT_MODEL_IDS = [
  ModelId.OPENAI_WHISPER,
  ModelId.DEEPGRAM_NOVA_2,
] as const satisfies SttModelId[];

export const DEFAULT_STT_MODEL_ID: SttModelId = ModelId.OPENAI_WHISPER;

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

/**
 * Provider-specific config for a model variant
 */
export interface ModelProviderConfigTokenBased {
  id: ModelId;
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
  id: ModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  creditCost: number;
  inputTokenCost?: never;
  outputTokenCost?: never;
  adminOnly?: boolean;
}
export interface ModelProviderConfigImageBased {
  id: ModelId;
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
  id: ModelId;
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
  id: ModelId;
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
  id: ModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  creditCostPerCharacter: number;
  adminOnly?: boolean;
}
export interface ModelProviderConfigSttBased {
  id: ModelId;
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
  /** Primary UI mode discriminant. Defaults to "text". Controls generation settings shown in chat. */
  modelType?: ModelType;
  /** All tabs this model should appear in. Defaults to [modelType]. Use for cross-tab models (e.g. multimodal chat). */
  modelTypes?: ModelType[];
  /** What role this model plays in the modality system */
  modelRole: ModelRole;
  /** Native input modalities this model accepts */
  inputs: Modality[];
  /** Native output modalities this model produces */
  outputs: Modality[];
  /** Optional voice metadata for TTS models */
  voiceMeta?: TtsVoiceMeta;
}

/**
 * Configuration interface for AI model options.
 * Contains all necessary information for model selection and API integration.
 * Derived from ModelDefinition + ModelProviderConfig for backward compat.
 */
export interface ModelOptionBase {
  /** Unique identifier for the model */
  id: ModelId;
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
  /** Primary UI mode discriminant ("text" default). Controls generation settings shown in chat. */
  modelType: ModelType;
  /** All tabs this model appears in. Defaults to [modelType]. Cross-tab models list multiple types. */
  modelTypes: ModelType[];
  /** What role this model plays in the modality system */
  modelRole: ModelRole;
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
}
export interface ModelOptionCreditBased extends ModelOptionBase {
  creditCost: number;
  inputTokenCost?: never;
  outputTokenCost?: never;
}
export interface ModelOptionImageBased extends ModelOptionBase {
  creditCostPerImage: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
}
export interface ModelOptionVideoBased extends ModelOptionBase {
  creditCostPerSecond: number;
  defaultDurationSeconds: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
}

export interface ModelOptionAudioBased extends ModelOptionBase {
  creditCostPerClip: number;
  defaultDurationSeconds: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
}

export interface ModelOptionTtsBased extends ModelOptionBase {
  creditCostPerCharacter: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
}

export interface ModelOptionSttBased extends ModelOptionBase {
  creditCostPerSecond: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
}

export type ModelOption =
  | ModelOptionTokenBased
  | ModelOptionCreditBased
  | ModelOptionImageBased
  | ModelOptionVideoBased
  | ModelOptionAudioBased
  | ModelOptionTtsBased
  | ModelOptionSttBased;

/** ModelOption narrowed to an image-gen model — id is ImageGenModelId */
export type ImageGenModelOption = ModelOption & { id: ImageGenModelId };
/** ModelOption narrowed to a music/audio-gen model — id is MusicGenModelId */
export type MusicGenModelOption = ModelOption & { id: MusicGenModelId };
/** ModelOption narrowed to a video-gen model — id is VideoGenModelId */
export type VideoGenModelOption = ModelOption & { id: VideoGenModelId };

export function isModelOptionAudioBased(
  m: ModelOption,
): m is ModelOptionAudioBased {
  return m.modelRole === "audio-gen";
}

export function isModelOptionVideoBased(
  m: ModelOption,
): m is ModelOptionVideoBased {
  return m.modelRole === "video-gen";
}

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

// Default features for models without specific features
const defaultFeatures: ModelFeatures = {
  streaming: true,
  toolCalling: false,
};

// Default modality declarations for LLMs (text-only)
const defaultLlmModality = {
  modelRole: "llm" as ModelRole,
  inputs: ["text"] as Modality[],
  outputs: ["text"] as Modality[],
};

// Model names and icons are technical identifiers that should not be translated
export const modelDefinitions: Record<string, ModelDefinition> = {
  [ModelId.UNCENSORED_LM_V1_2]: {
    name: "UncensoredLM v1.2",
    by: "uncensoredAI",
    description: "chat.models.descriptions.uncensoredLmV11",
    parameterCount: undefined,
    contextWindow: 32768,
    icon: "uncensored-ai",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.UNCENSORED_LM_V1_2,
        apiProvider: ApiProvider.UNCENSORED_AI,
        providerModel: "uncensored-lm",
        creditCost: 7,
      },
    ],

    utilities: [
      ModelUtility.UNCENSORED,
      ModelUtility.CREATIVE,
      ModelUtility.SMART,
      ModelUtility.ROLEPLAY,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.CODING],
  },
  [ModelId.FREEDOMGPT_LIBERTY]: {
    name: "FreedomGPT Liberty",
    by: "freedomGPT",
    description: "chat.models.descriptions.freedomgptLiberty",
    parameterCount: undefined,
    contextWindow: 32768,
    icon: "freedom-gpt-logo",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.FREEDOMGPT_LIBERTY,
        apiProvider: ApiProvider.FREEDOMGPT,
        providerModel: "liberty",
        creditCost: 7, // costs 5 credits but we add 2 credits for markup
      },
    ],

    utilities: [
      ModelUtility.UNCENSORED,
      ModelUtility.CREATIVE,
      ModelUtility.CHAT,
      ModelUtility.ROLEPLAY,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: false },
    weaknesses: [ModelUtility.CODING, ModelUtility.ANALYSIS],
  },
  [ModelId.GAB_AI_ARYA]: {
    name: "Gab AI Arya",
    by: "gabAI",
    description: "chat.models.descriptions.gabAiArya",
    parameterCount: undefined,
    contextWindow: 131072,
    icon: "gab-ai-logo",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.GAB_AI_ARYA,
        apiProvider: ApiProvider.GAB_AI,
        providerModel: "arya",
        creditCost: 7,
      },
    ],

    utilities: [
      ModelUtility.UNCENSORED,
      ModelUtility.CREATIVE,
      ModelUtility.CHAT,
      ModelUtility.ANALYSIS,
      ModelUtility.SMART,
      ModelUtility.ROLEPLAY,
      ModelUtility.CONTROVERSIAL,
      ModelUtility.POLITICAL_RIGHT,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.CODING],
  },
  [ModelId.VENICE_UNCENSORED]: {
    name: "Venice Uncensored 1.1",
    by: "veniceAI",
    description: "chat.models.descriptions.veniceUncensored",
    parameterCount: 24,
    contextWindow: 32000,
    icon: "venice-ai-logo",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.VENICE_UNCENSORED,
        apiProvider: ApiProvider.VENICE_AI,
        providerModel: "venice-uncensored",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.2,
        outputTokenCost: 0.9,
      },
    ],

    utilities: [
      ModelUtility.UNCENSORED,
      ModelUtility.CREATIVE,
      ModelUtility.ROLEPLAY,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.CODING, ModelUtility.ANALYSIS],
  },
  // [ModelId.DOLPHIN_LLAMA_3_70B]: {
  //   id: ModelId.DOLPHIN_LLAMA_3_70B,
  //   name: "Dolphin Llama 3 70B",
  //   provider: "cognitiveComputations",
  //   apiProvider: ApiProvider.OPENROUTER,
  //   description: "chat.models.descriptions.dolphinLlama3_70B",
  //   parameterCount: 70,
  //   contextWindow: 8192,
  //   icon: "ocean",
  //   providerModel: "cognitivecomputations/dolphin-llama-3-70b",
  //   creditCost: 1,
  //   inputTokenCost: 0,
  //   outputTokenCost: 0,

  //   utilities: [ModelUtility.FAST, ModelUtility.CHAT],
  //   supportsTools: false,
  //   intelligence: IntelligenceLevel.QUICK,
  //   speed: SpeedLevel.FAST,
  //   content: ContentLevel.UNCENSORED,
  //   features: { ...defaultFeatures },
  //   weaknesses: [ModelUtility.CODING, ModelUtility.ANALYSIS],
  // },
  // [ModelId.DOLPHIN_3_0_R1_MISTRAL_24B]: {
  //   id: ModelId.DOLPHIN_3_0_R1_MISTRAL_24B,
  //   name: "Dolphin 3.0 R1 Mistral 24B",
  //   provider: "cognitiveComputations",
  //   apiProvider: ApiProvider.OPENROUTER,
  //   description: "chat.models.descriptions.dolphin3_0_r1_mistral_24b",
  //   parameterCount: 24,
  //   contextWindow: 32768,
  //   icon: "ocean",
  //   providerModel: "cognitivecomputations/dolphin3.0-r1-mistral-24b",
  //   creditCost: 1,
  //   inputTokenCost: 0,
  //   outputTokenCost: 0,

  //   utilities: [ModelUtility.FAST, ModelUtility.REASONING],
  //   supportsTools: false,
  //   intelligence: IntelligenceLevel.SMART,
  //   speed: SpeedLevel.FAST,
  //   content: ContentLevel.UNCENSORED,
  //   features: { ...defaultFeatures },
  //   weaknesses: [ModelUtility.CODING],
  // },
  // [ModelId.DOLPHIN_3_0_MISTRAL_24B]: {
  //   id: ModelId.DOLPHIN_3_0_MISTRAL_24B,
  //   name: "Dolphin 3.0 Mistral 24B",
  //   provider: "cognitiveComputations",
  //   apiProvider: ApiProvider.OPENROUTER,
  //   description: "chat.models.descriptions.mistralNemo",
  //   parameterCount: 24,
  //   contextWindow: 32768,
  //   icon: "ocean",
  //   providerModel: "cognitivecomputations/dolphin3.0-mistral-24b:free",
  //   creditCost: 1,
  //   inputTokenCost: 0,
  //   outputTokenCost: 0,

  //   utilities: [ModelUtility.FAST, ModelUtility.CHAT],
  //   supportsTools: false,
  //   intelligence: IntelligenceLevel.QUICK,
  //   speed: SpeedLevel.FAST,
  //   content: ContentLevel.UNCENSORED,
  //   features: { ...defaultFeatures },
  //   weaknesses: [ModelUtility.CODING, ModelUtility.ANALYSIS],
  // },

  [ModelId.CLAUDE_HAIKU_4_5]: {
    name: "Claude Haiku 4.5",
    by: "anthropic",
    description: "chat.models.descriptions.claudeHaiku45",
    parameterCount: undefined,
    contextWindow: 200000,
    icon: "si-anthropic",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.CLAUDE_HAIKU_4_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-haiku-4.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 1, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 5, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.1, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 1.25, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ModelId.CLAUDE_CODE_HAIKU,
        apiProvider: ApiProvider.CLAUDE_CODE,
        providerModel: "claude-haiku-4-5-20251001",
        creditCost: calculateCreditCost,
        inputTokenCost: 1,
        outputTokenCost: 5,
        adminOnly: true,
      },
    ],

    utilities: [
      ModelUtility.CHAT,
      ModelUtility.FAST,
      ModelUtility.CODING,
      ModelUtility.VISION,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },

  [ModelId.CLAUDE_OPUS_4_5]: {
    name: "Claude Opus 4.5",
    by: "anthropic",
    description: "chat.models.descriptions.claudeOpus45",
    parameterCount: undefined,
    contextWindow: 200000,
    icon: "si-anthropic",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.CLAUDE_OPUS_4_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-opus-4.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 5, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 25, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.5, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 6.25, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.CREATIVE,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },
  [ModelId.CLAUDE_OPUS_4_6]: {
    name: "Claude Opus 4.6",
    by: "anthropic",
    description: "chat.models.descriptions.claudeOpus46",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.CLAUDE_OPUS_4_6,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-opus-4.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 5, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 25, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.5, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 6.25, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ModelId.CLAUDE_CODE_OPUS,
        apiProvider: ApiProvider.CLAUDE_CODE,
        providerModel: "claude-opus-4-6",
        creditCost: calculateCreditCost,
        inputTokenCost: 5,
        outputTokenCost: 25,
        adminOnly: true,
      },
    ],

    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.CREATIVE,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },
  [ModelId.CLAUDE_SONNET_4_5]: {
    name: "Claude Sonnet 4.5",
    by: "anthropic",
    description: "chat.models.descriptions.claudeSonnet45",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.CLAUDE_SONNET_4_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-sonnet-4.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 3, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 15, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.3, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 3.75, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.CREATIVE,
      ModelUtility.REASONING,
      ModelUtility.LEGACY,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },
  [ModelId.CLAUDE_SONNET_4_6]: {
    name: "Claude Sonnet 4.6",
    by: "anthropic",
    description: "chat.models.descriptions.claudeSonnet46",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.CLAUDE_SONNET_4_6,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-sonnet-4.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 3, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 15, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.3, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 3.75, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ModelId.CLAUDE_CODE_SONNET,
        apiProvider: ApiProvider.CLAUDE_CODE,
        providerModel: "claude-sonnet-4-6",
        creditCost: calculateCreditCost,
        inputTokenCost: 3,
        outputTokenCost: 15,
        adminOnly: true,
      },
    ],

    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.CREATIVE,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },

  [ModelId.GROK_4]: {
    name: "Grok 4",
    by: "xAI",
    description: "chat.models.descriptions.grok4",
    parameterCount: undefined,
    contextWindow: 256000,
    icon: "si-x",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GROK_4,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "x-ai/grok-4",
        creditCost: calculateCreditCost,
        inputTokenCost: 3, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 15, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.75, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  [ModelId.GROK_4_FAST]: {
    name: "Grok 4 Fast",
    by: "xAI",
    description: "chat.models.descriptions.grok4Fast",
    parameterCount: undefined,
    contextWindow: 2000000,
    icon: "si-x",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GROK_4_FAST,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "x-ai/grok-4-fast",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.2, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.5, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.05, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  [ModelId.GROK_4_20_BETA]: {
    name: "Grok 4.20 Beta",
    by: "xAI",
    description: "chat.models.descriptions.grok420Beta",
    parameterCount: undefined,
    contextWindow: 2000000,
    icon: "si-x",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GROK_4_20_BETA,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "x-ai/grok-4.20-beta",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 6, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  [ModelId.GTP_5_PRO]: {
    name: "GPT-5 Pro",
    by: "openAI",
    description: "chat.models.descriptions.gpt5Pro",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GTP_5_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 15, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 120, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.SMART],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ModelId.GPT_5_4_PRO]: {
    name: "GPT-5.4 Pro",
    by: "openAI",
    description: "chat.models.descriptions.gpt54Pro",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GPT_5_4_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.4-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 30, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 180, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.CREATIVE,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ModelId.GPT_5_2_PRO]: {
    name: "GPT-5.2 Pro",
    by: "openAI",
    description: "chat.models.descriptions.gpt52Pro",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GPT_5_2_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.2-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 21, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 168, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.CREATIVE,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ModelId.GPT_5_CODEX]: {
    name: "GPT-5 Codex",
    by: "openAI",
    description: "chat.models.descriptions.gpt5Codex",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GPT_5_CODEX,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5-codex",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 10, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.13, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CODING],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CREATIVE],
  },
  [ModelId.GPT_5_3_CODEX]: {
    name: "GPT-5.3-Codex",
    by: "openAI",
    description: "chat.models.descriptions.gpt53Codex",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GPT_5_3_CODEX,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.3-codex",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.75, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 14, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.18, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CREATIVE],
  },
  [ModelId.GPT_5_1_CODEX]: {
    name: "GPT 5.1 Codex",
    by: "openAI",
    description: "chat.models.descriptions.gpt51Codex",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GPT_5_1_CODEX,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.1-codex",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 10, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.13, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.CREATIVE,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ModelId.GPT_5_1]: {
    name: "GPT 5.1",
    by: "openAI",
    description: "chat.models.descriptions.gpt51",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GPT_5_1,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.1",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 10, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.13, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.SMART],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ModelId.GPT_5_4]: {
    name: "GPT-5.4",
    by: "openAI",
    description: "chat.models.descriptions.gpt54",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GPT_5_4,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.4",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.5, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 15, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.25, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.CREATIVE,
      ModelUtility.ANALYSIS,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ModelId.GPT_5_4_MINI]: {
    name: "GPT-5.4 Mini",
    by: "openAI",
    description: "chat.models.descriptions.gpt54Mini",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GPT_5_4_MINI,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.4-mini",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.75, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 4.5, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.SMART, ModelUtility.CODING, ModelUtility.CHAT],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ModelId.GPT_5_4_NANO]: {
    name: "GPT-5.4 Nano",
    by: "openAI",
    description: "chat.models.descriptions.gpt54Nano",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GPT_5_4_NANO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.4-nano",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.2, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 1.25, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.ANALYSIS],
  },
  [ModelId.GPT_5_2]: {
    name: "GPT 5.2",
    by: "openAI",
    description: "chat.models.descriptions.gpt52",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GPT_5_2,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.2",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.75, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 14, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.18, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.CREATIVE,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ModelId.GPT_5_3_CHAT]: {
    name: "GPT-5.3 Chat",
    by: "openAI",
    description: "chat.models.descriptions.gpt53Chat",
    parameterCount: undefined,
    contextWindow: 128000,
    icon: "si-openai",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GPT_5_3_CHAT,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.3-chat",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.75, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 14, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.18, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST, ModelUtility.SMART],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ModelId.GPT_5_2_CHAT]: {
    name: "GPT 5.2 Chat",
    by: "openAI",
    description: "chat.models.descriptions.gpt52_chat",
    parameterCount: undefined,
    contextWindow: 128000,
    icon: "si-openai",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GPT_5_2_CHAT,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.2-chat",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.75, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 14, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.18, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.CREATIVE,
      ModelUtility.FAST,
      ModelUtility.CHAT,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ModelId.GPT_5]: {
    name: "GPT-5",
    by: "openAI",
    description: "chat.models.descriptions.gpt5",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GPT_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 10, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.13, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.SMART, ModelUtility.CHAT],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ModelId.GPT_5_MINI]: {
    name: "GPT-5 Mini",
    by: "openAI",
    description: "chat.models.descriptions.gpt5Mini",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GPT_5_MINI,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5-mini",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.25, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 2, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.03, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.ANALYSIS],
  },
  [ModelId.GPT_5_NANO]: {
    name: "GPT-5 Nano",
    by: "openAI",
    description: "chat.models.descriptions.gpt5Nano",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GPT_5_NANO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5-nano",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.05, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.4, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.01, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [
      ModelUtility.ROLEPLAY,
      ModelUtility.ANALYSIS,
      ModelUtility.CODING,
    ],
  },
  [ModelId.GPT_OSS_120B]: {
    name: "GPT-OSS 120B",
    by: "openAI",
    description: "chat.models.descriptions.gptOss120b",
    parameterCount: 117,
    contextWindow: 131072,
    icon: "si-openai",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.GPT_OSS_120B,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-oss-120b",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.04, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.19, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.CODING],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.KIMI_K2_5]: {
    name: "Kimi K2.5",
    by: "moonshotAI",
    description: "chat.models.descriptions.kimiK2_5",
    parameterCount: 1000,
    contextWindow: 262144,
    icon: "moon",
    modelRole: "llm",
    inputs: ["text", "image"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.KIMI_K2_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "moonshotai/kimi-k2.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.42, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 2.2, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.21, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.SMART,
      ModelUtility.FAST,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.CREATIVE,
      ModelUtility.VISION,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.KIMI_K2]: {
    name: "Kimi K2",
    by: "moonshotAI",
    description: "chat.models.descriptions.kimiK2",
    parameterCount: 1000,
    contextWindow: 131072,
    icon: "moon",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.KIMI_K2,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "moonshotai/kimi-k2-0905",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.4, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 2, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.15, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.FAST,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.CREATIVE,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.KIMI_K2_THINKING]: {
    name: "Kimi K2 Thinking",
    by: "moonshotAI",
    description: "chat.models.descriptions.kimiK2Thinking",
    parameterCount: 1000,
    contextWindow: 131072,
    icon: "moon",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.KIMI_K2_THINKING,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "moonshotai/kimi-k2-thinking",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.47, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 2, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.14, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.CREATIVE,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ModelId.GLM_5]: {
    name: "GLM-5",
    by: "zAi",
    description: "chat.models.descriptions.glm5",
    parameterCount: undefined,
    contextWindow: 80000,
    icon: "si-zendesk",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.GLM_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.72, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 2.3, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.16,
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.GLM_5_TURBO]: {
    name: "GLM-5 Turbo",
    by: "zAi",
    description: "chat.models.descriptions.glm5Turbo",
    parameterCount: undefined,
    contextWindow: 202752,
    icon: "si-zendesk",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.GLM_5_TURBO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-5-turbo",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.2, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 4, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
      ModelUtility.FAST,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.GLM_4_7]: {
    name: "GLM 4.7",
    by: "zAi",
    description: "chat.models.descriptions.glm47",
    parameterCount: undefined,
    contextWindow: 202752,
    icon: "si-zendesk",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.GLM_4_7,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-4.7",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.39, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 1.75, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.2, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CHAT,
      ModelUtility.ANALYSIS,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.GLM_4_7_FLASH]: {
    name: "GLM 4.7 Flash",
    by: "zAi",
    description: "chat.models.descriptions.glm47Flash",
    parameterCount: undefined,
    contextWindow: 202752,
    icon: "si-zendesk",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.GLM_4_7_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-4.7-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.06, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.4, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.01, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.GLM_4_5_AIR]: {
    name: "GLM 4.5 AIR",
    by: "zAi",
    description: "chat.models.descriptions.glm45Air",
    parameterCount: undefined,
    contextWindow: 131072,
    icon: "si-zendesk",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.GLM_4_5_AIR,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-4.5-air",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.13, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.85, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.03, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.GLM_4_6]: {
    name: "GLM 4.6",
    by: "zAi",
    description: "chat.models.descriptions.glm46",
    parameterCount: undefined,
    contextWindow: 204800,
    icon: "si-zendesk",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.GLM_4_6,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-4.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.39, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 1.9, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CHAT,
      ModelUtility.ANALYSIS,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.GLM_4_5V]: {
    name: "GLM 4.5v",
    by: "zAi",
    description: "chat.models.descriptions.glm45v",
    parameterCount: 106,
    contextWindow: 65536,
    icon: "si-zendesk",
    modelRole: "llm",
    inputs: ["text", "image"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GLM_4_5V,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-4.5v",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.6, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 1.8, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.11, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.VISION, ModelUtility.CHAT],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.MINIMAX_M2_7]: {
    name: "MiniMax M2.7",
    by: "miniMax",
    description: "chat.models.descriptions.minimaxM27",
    parameterCount: undefined,
    contextWindow: 204800,
    icon: "si-minimax",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.MINIMAX_M2_7,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "minimax/minimax-m2.7",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.3, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 1.2, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.MIMO_V2_PRO]: {
    name: "MiMo V2 Pro",
    by: "xiaomi",
    description: "chat.models.descriptions.mimoV2Pro",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-xiaomi",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.MIMO_V2_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "xiaomi/mimo-v2-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 1, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 3, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.GEMINI_2_5_FLASH_LITE]: {
    name: "Gemini 2.5 Flash Lite",
    by: "google",
    description: "chat.models.descriptions.geminiFlash25Lite",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GEMINI_2_5_FLASH_LITE,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-2.5-flash-lite",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.1, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.4, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.01, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 0.08, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  [ModelId.GEMINI_2_5_FLASH]: {
    name: "Gemini 2.5 Flash",
    by: "google",
    description: "chat.models.descriptions.geminiFlash25Flash",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GEMINI_2_5_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-2.5-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.3, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 2.5, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.03, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 0.08, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  [ModelId.GEMINI_2_5_PRO]: {
    name: "Gemini 2.5 Flash Pro",
    by: "google",
    description: "chat.models.descriptions.geminiFlash25Pro",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GEMINI_2_5_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-2.5-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 10, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.13, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 0.38, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.SMART],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  [ModelId.GEMINI_3_1_PRO_PREVIEW_CUSTOM_TOOLS]: {
    name: "Gemini 3.1 Pro",
    by: "google",
    description: "chat.models.descriptions.gemini31ProPreviewCustomTools",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GEMINI_3_1_PRO_PREVIEW_CUSTOM_TOOLS,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3.1-pro-preview-customtools",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 12, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.2, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 0.38, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  [ModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW]: {
    name: "Gemini 3.1 Flash Image Preview",
    by: "google",
    description: "chat.models.descriptions.gemini31FlashImagePreview",
    parameterCount: undefined,
    contextWindow: 65536,
    icon: "si-googlegemini",
    modelRole: "image-gen",
    inputs: ["text", "image"],
    outputs: ["text", "image"],
    providers: [
      {
        id: ModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3.1-flash-image-preview",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.5, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 3, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.CHAT,
      ModelUtility.CREATIVE,
      ModelUtility.IMAGE_GEN,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
    },
    // modelType omitted (defaults to "text") - primary UI mode is chat (no size/quality dropdowns).
    // modelTypes includes "image" so this model appears in both the Chat and Image tabs.
    modelTypes: ["text", "image"],
  },
  [ModelId.GEMINI_3_1_FLASH_LITE_PREVIEW]: {
    name: "Gemini 3.1 Flash Lite Preview",
    by: "google",
    description: "chat.models.descriptions.gemini31FlashLitePreview",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GEMINI_3_1_FLASH_LITE_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3.1-flash-lite-preview",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.25, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 1.5, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.03, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 0.08, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST, ModelUtility.ANALYSIS],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  [ModelId.GEMINI_3_FLASH]: {
    name: "Gemini 3 Flash",
    by: "google",
    description: "chat.models.descriptions.gemini3Flash",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    modelRole: "llm",
    inputs: ["text", "image", "file"],
    outputs: ["text"],
    providers: [
      {
        id: ModelId.GEMINI_3_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3-flash-preview",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.5, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 3, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.05, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 0.08, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.SMART, ModelUtility.CODING, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  // [ModelId.MISTRAL_NEMO]: {
  //   id: ModelId.MISTRAL_NEMO,
  //   name: "Mistral Nemo",
  //   provider: "mistralAI",
  //   apiProvider: ApiProvider.OPENROUTER,
  //   description: "chat.models.descriptions.mistralNemo",
  //   parameterCount: 12,
  //   contextWindow: 131072,
  //   icon: "si-mistralai",
  //   providerModel: "mistralai/mistral-nemo:free",
  //   creditCost: 0,

  //   utilities: [ModelUtility.CHAT, ModelUtility.FAST],
  //   supportsTools: true,
  //   intelligence: IntelligenceLevel.QUICK,
  //   speed: SpeedLevel.FAST,
  //   content: ContentLevel.MAINSTREAM,
  //   features: { ...defaultFeatures, toolCalling: true },
  //   weaknesses: [ModelUtility.ANALYSIS, ModelUtility.CODING],
  // },
  [ModelId.DEEPSEEK_V32]: {
    name: "DeepSeek V3.2",
    by: "deepSeek",
    description: "chat.models.descriptions.deepseekV32",
    parameterCount: 671,
    contextWindow: 163840,
    icon: "whale",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.DEEPSEEK_V32,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "deepseek/deepseek-v3.2",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.26, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.38, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.SMART, ModelUtility.CODING, ModelUtility.ANALYSIS],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.DEEPSEEK_V31]: {
    name: "DeepSeek V3.1",
    by: "deepSeek",
    description: "chat.models.descriptions.deepseekV31",
    parameterCount: 671,
    contextWindow: 32768,
    icon: "whale",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.DEEPSEEK_V31,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "deepseek/deepseek-chat-v3.1",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.15, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.75, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.SMART, ModelUtility.CODING],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.DEEPSEEK_R1]: {
    name: "DeepSeek R1",
    by: "deepSeek",
    description: "chat.models.descriptions.deepseekR1",
    parameterCount: 671,
    contextWindow: 163840,
    icon: "whale",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.DEEPSEEK_R1,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "deepseek/deepseek-r1-0528",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.45, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 2.15, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.22, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.QWEN3_235B_FREE]: {
    name: "Qwen3 235B ",
    by: "alibaba",
    description: "chat.models.descriptions.qwen3235bFree",
    parameterCount: 235,
    contextWindow: 131072,
    icon: "si-alibabadotcom",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.QWEN3_235B_FREE,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "qwen/qwen3-235b-a22b",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.45, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 1.82, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.SMART, ModelUtility.CODING],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.DEEPSEEK_R1_DISTILL]: {
    name: "DeepSeek R1 Distill",
    by: "deepSeek",
    description: "chat.models.descriptions.deepseekR1Distill",
    parameterCount: 70,
    contextWindow: 32768,
    icon: "whale",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.DEEPSEEK_R1_DISTILL,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "deepseek/deepseek-r1-distill-qwen-32b",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.29, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.29, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.QWEN_2_5_7B]: {
    name: "Qwen 2.5 7B",
    by: "alibaba",
    description: "chat.models.descriptions.qwen257b",
    parameterCount: 7,
    contextWindow: 32768,
    icon: "si-alibabadotcom",
    ...defaultLlmModality,
    providers: [
      {
        id: ModelId.QWEN_2_5_7B,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "qwen/qwen-2.5-7b-instruct",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.04, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.1, // updated: 2026-03-31 from openrouter-api
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ANALYSIS, ModelUtility.CODING],
  },

  // =============================================
  // IMAGE GENERATION MODELS
  // =============================================

  [ModelId.DALL_E_3]: {
    name: "DALL-E 3",
    by: "openAI",
    description: "chat.models.descriptions.dallE3",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "si-openai",
    modelType: "image",
    modelRole: "image-gen",
    inputs: ["text"],
    outputs: ["image"],
    providers: [
      {
        id: ModelId.DALL_E_3,
        apiProvider: ApiProvider.OPENAI_IMAGES,
        providerModel: "dall-e-3",
        creditCostPerImage: 4, // updated: 2026-03-31 from openai-static
      },
    ],
    utilities: [ModelUtility.IMAGE_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },
  [ModelId.GPT_IMAGE_1]: {
    name: "GPT-Image-1",
    by: "openAI",
    description: "chat.models.descriptions.gptImage1",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "si-openai",
    modelType: "image",
    modelRole: "image-gen",
    inputs: ["text"],
    outputs: ["image"],
    providers: [
      {
        id: ModelId.GPT_IMAGE_1,
        apiProvider: ApiProvider.OPENAI_IMAGES,
        providerModel: "gpt-image-1",
        creditCostPerImage: 2, // updated: 2026-03-31 from openai-static
      },
    ],
    utilities: [ModelUtility.IMAGE_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },
  [ModelId.FLUX_SCHNELL]: {
    name: "Flux Schnell",
    by: "blackForestLabs",
    description: "chat.models.descriptions.fluxSchnell",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    modelType: "image",
    modelRole: "image-gen",
    inputs: ["text"],
    outputs: ["image"],
    providers: [
      {
        id: ModelId.FLUX_SCHNELL,
        apiProvider: ApiProvider.FAL_AI,
        providerModel: "fal-ai/flux/schnell",
        creditCostPerImage: 0.3, // updated: 2026-03-31 from fal-ai-static
      },
    ],
    utilities: [ModelUtility.IMAGE_GEN, ModelUtility.FAST],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },
  [ModelId.FLUX_PRO]: {
    name: "Flux Pro",
    by: "blackForestLabs",
    description: "chat.models.descriptions.fluxPro",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    modelType: "image",
    modelRole: "image-gen",
    inputs: ["text"],
    outputs: ["image"],
    providers: [
      {
        id: ModelId.FLUX_PRO,
        apiProvider: ApiProvider.REPLICATE,
        providerModel: "black-forest-labs/flux-1.1-pro",
        creditCostPerImage: 4, // updated: 2026-03-31 from replicate-html-per-image
      },
    ],
    utilities: [
      ModelUtility.IMAGE_GEN,
      ModelUtility.CREATIVE,
      ModelUtility.SMART,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },
  [ModelId.SDXL]: {
    name: "Stable Diffusion XL",
    by: "stabilityAI",
    description: "chat.models.descriptions.sdxl",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    modelType: "image",
    modelRole: "image-gen",
    inputs: ["text"],
    outputs: ["image"],
    providers: [
      {
        id: ModelId.SDXL,
        apiProvider: ApiProvider.REPLICATE,
        providerModel: "stability-ai/sdxl",
        creditCostPerImage: 0.4, // updated: 2026-03-31 from replicate-html-p50
      },
    ],
    utilities: [ModelUtility.IMAGE_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.FLUX_2_MAX]: {
    name: "FLUX.2 Max",
    by: "blackForestLabs",
    description: "chat.models.descriptions.flux2Max",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    modelType: "image",
    modelRole: "image-gen",
    inputs: ["text"],
    outputs: ["image"],
    providers: [
      {
        id: ModelId.FLUX_2_MAX,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "black-forest-labs/flux.2-max",
        creditCostPerImage: 7, // updated: 2026-03-31 from openrouter-api
      },
    ],
    utilities: [
      ModelUtility.IMAGE_GEN,
      ModelUtility.CREATIVE,
      ModelUtility.SMART,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },
  [ModelId.FLUX_2_KLEIN_4B]: {
    name: "FLUX.2 Klein 4B",
    by: "blackForestLabs",
    description: "chat.models.descriptions.flux2Klein4b",
    parameterCount: 4,
    contextWindow: 0,
    icon: "image",
    modelType: "image",
    modelRole: "image-gen",
    inputs: ["text"],
    outputs: ["image"],
    providers: [
      {
        id: ModelId.FLUX_2_KLEIN_4B,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "black-forest-labs/flux.2-klein-4b",
        creditCostPerImage: 1.4, // updated: 2026-03-31 from openrouter-api
      },
    ],
    utilities: [ModelUtility.IMAGE_GEN, ModelUtility.FAST],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },
  [ModelId.RIVERFLOW_V2_PRO]: {
    name: "Riverflow V2 Pro",
    by: "sourceful",
    description: "chat.models.descriptions.riverflowV2Pro",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    modelType: "image",
    modelRole: "image-gen",
    inputs: ["text"],
    outputs: ["image"],
    providers: [
      {
        id: ModelId.RIVERFLOW_V2_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "sourceful/riverflow-v2-pro",
        creditCostPerImage: 15, // updated: 2026-03-31 from openrouter-api
      },
    ],
    utilities: [
      ModelUtility.IMAGE_GEN,
      ModelUtility.CREATIVE,
      ModelUtility.SMART,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },
  [ModelId.RIVERFLOW_V2_FAST]: {
    name: "Riverflow V2 Fast",
    by: "sourceful",
    description: "chat.models.descriptions.riverflowV2Fast",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    modelType: "image",
    modelRole: "image-gen",
    inputs: ["text"],
    outputs: ["image"],
    providers: [
      {
        id: ModelId.RIVERFLOW_V2_FAST,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "sourceful/riverflow-v2-fast",
        creditCostPerImage: 2, // updated: 2026-03-31 from openrouter-api
      },
    ],
    utilities: [ModelUtility.IMAGE_GEN, ModelUtility.FAST],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },
  [ModelId.RIVERFLOW_V2_MAX_PREVIEW]: {
    name: "Riverflow V2 Max Preview",
    by: "sourceful",
    description: "chat.models.descriptions.riverflowV2MaxPreview",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    modelType: "image",
    modelRole: "image-gen",
    inputs: ["text"],
    outputs: ["image"],
    providers: [
      {
        id: ModelId.RIVERFLOW_V2_MAX_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "sourceful/riverflow-v2-max-preview",
        creditCostPerImage: 7.5, // updated: 2026-03-31 from openrouter-api
      },
    ],
    utilities: [
      ModelUtility.IMAGE_GEN,
      ModelUtility.CREATIVE,
      ModelUtility.SMART,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },
  [ModelId.RIVERFLOW_V2_STANDARD_PREVIEW]: {
    name: "Riverflow V2 Standard Preview",
    by: "sourceful",
    description: "chat.models.descriptions.riverflowV2StandardPreview",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    modelType: "image",
    modelRole: "image-gen",
    inputs: ["text"],
    outputs: ["image"],
    providers: [
      {
        id: ModelId.RIVERFLOW_V2_STANDARD_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "sourceful/riverflow-v2-standard-preview",
        creditCostPerImage: 3.5, // updated: 2026-03-31 from openrouter-api
      },
    ],
    utilities: [ModelUtility.IMAGE_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },
  [ModelId.RIVERFLOW_V2_FAST_PREVIEW]: {
    name: "Riverflow V2 Fast Preview",
    by: "sourceful",
    description: "chat.models.descriptions.riverflowV2FastPreview",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    modelType: "image",
    modelRole: "image-gen",
    inputs: ["text"],
    outputs: ["image"],
    providers: [
      {
        id: ModelId.RIVERFLOW_V2_FAST_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "sourceful/riverflow-v2-fast-preview",
        creditCostPerImage: 3, // updated: 2026-03-31 from openrouter-api
      },
    ],
    utilities: [ModelUtility.IMAGE_GEN, ModelUtility.FAST],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },
  [ModelId.FLUX_2_FLEX]: {
    name: "FLUX.2 Flex",
    by: "blackForestLabs",
    description: "chat.models.descriptions.flux2Flex",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    modelType: "image",
    modelRole: "image-gen",
    inputs: ["text"],
    outputs: ["image"],
    providers: [
      {
        id: ModelId.FLUX_2_FLEX,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "black-forest-labs/flux.2-flex",
        creditCostPerImage: 6, // updated: 2026-03-31 from openrouter-api
      },
    ],
    utilities: [
      ModelUtility.IMAGE_GEN,
      ModelUtility.CREATIVE,
      ModelUtility.SMART,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },
  [ModelId.FLUX_2_PRO]: {
    name: "FLUX.2 Pro",
    by: "blackForestLabs",
    description: "chat.models.descriptions.flux2Pro",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    modelType: "image",
    modelRole: "image-gen",
    inputs: ["text"],
    outputs: ["image"],
    providers: [
      {
        id: ModelId.FLUX_2_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "black-forest-labs/flux.2-pro",
        creditCostPerImage: 3, // updated: 2026-03-31 from openrouter-api
      },
    ],
    utilities: [
      ModelUtility.IMAGE_GEN,
      ModelUtility.CREATIVE,
      ModelUtility.SMART,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },
  [ModelId.GEMINI_3_PRO_IMAGE_PREVIEW]: {
    name: "Gemini 3 Pro Image Preview",
    by: "google",
    description: "chat.models.descriptions.gemini3ProImagePreview",
    parameterCount: undefined,
    contextWindow: 65536,
    icon: "si-googlegemini",
    // modelType intentionally omitted (defaults to "text") - multimodal chat model,
    // not a pure image generator. Routes through stream; outputs["image"] drives
    // the modalities passed to OpenRouter.
    modelRole: "image-gen",
    inputs: ["text", "image"],
    outputs: ["text", "image"],
    providers: [
      {
        id: ModelId.GEMINI_3_PRO_IMAGE_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3-pro-image-preview",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 12, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.2, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 0.38, // updated: 2026-03-31 from openrouter-api
      },
    ],
    utilities: [
      ModelUtility.IMAGE_GEN,
      ModelUtility.CREATIVE,
      ModelUtility.SMART,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
    // modelType omitted (defaults to "text") - primary UI mode is chat.
    // modelTypes includes "image" so this model appears in both the Chat and Image tabs.
    modelTypes: ["text", "image"],
  },
  [ModelId.GPT_5_IMAGE_MINI]: {
    name: "GPT-5 Image Mini",
    by: "openAI",
    description: "chat.models.descriptions.gpt5ImageMini",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    // modelType omitted (defaults to "text") - chat-style multimodal model via OpenRouter.
    // modelTypes includes "image" so it appears in both Chat and Image tabs.
    modelRole: "image-gen",
    inputs: ["text", "image"],
    outputs: ["text", "image"],
    providers: [
      {
        id: ModelId.GPT_5_IMAGE_MINI,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5-image-mini",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.5, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 2, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.25, // updated: 2026-03-31 from openrouter-api
      },
    ],
    utilities: [
      ModelUtility.IMAGE_GEN,
      ModelUtility.CREATIVE,
      ModelUtility.FAST,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
    modelTypes: ["text", "image"],
  },
  [ModelId.GPT_5_IMAGE]: {
    name: "GPT-5 Image",
    by: "openAI",
    description: "chat.models.descriptions.gpt5Image",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    // modelType omitted (defaults to "text") - chat-style multimodal model via OpenRouter.
    // modelTypes includes "image" so it appears in both Chat and Image tabs.
    modelRole: "image-gen",
    inputs: ["text", "image"],
    outputs: ["text", "image"],
    providers: [
      {
        id: ModelId.GPT_5_IMAGE,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5-image",
        creditCost: calculateCreditCost,
        inputTokenCost: 10, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 10, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 1.25, // updated: 2026-03-31 from openrouter-api
      },
    ],
    utilities: [
      ModelUtility.IMAGE_GEN,
      ModelUtility.CREATIVE,
      ModelUtility.SMART,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
    modelTypes: ["text", "image"],
  },
  [ModelId.SEEDREAM_4_5]: {
    name: "Seedream 4.5",
    by: "byteDanceSeed",
    description: "chat.models.descriptions.seedream45",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    modelType: "image",
    modelRole: "image-gen",
    inputs: ["text"],
    outputs: ["image"],
    providers: [
      {
        id: ModelId.SEEDREAM_4_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "bytedance-seed/seedream-4.5",
        creditCostPerImage: 4, // updated: 2026-03-31 from openrouter-api
      },
    ],
    utilities: [ModelUtility.IMAGE_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  // =============================================
  // MUSIC GENERATION MODELS
  // =============================================

  [ModelId.MUSICGEN_STEREO]: {
    name: "MusicGen Stereo",
    by: "meta",
    description: "chat.models.descriptions.musicgenStereo",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "music",
    modelType: "audio",
    modelRole: "audio-gen",
    inputs: ["text"],
    outputs: ["audio"],
    providers: [
      {
        id: ModelId.MUSICGEN_STEREO,
        apiProvider: ApiProvider.REPLICATE,
        providerModel: "meta/musicgen",
        creditCostPerClip: 5.2, // updated: 2026-03-31 from replicate-html-p50
        defaultDurationSeconds: 8,
      },
    ],
    utilities: [ModelUtility.MUSIC_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.STABLE_AUDIO]: {
    name: "Stable Audio",
    by: "stabilityAI",
    description: "chat.models.descriptions.stableAudio",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "music",
    modelType: "audio",
    modelRole: "audio-gen",
    inputs: ["text"],
    outputs: ["audio"],
    providers: [
      {
        id: ModelId.STABLE_AUDIO,
        apiProvider: ApiProvider.FAL_AI,
        // TODO: price not found from fal-ai: No static price defined - update FAL_AI_STATIC_PRICES in fal-ai.ts manually
        providerModel: "fal-ai/stable-audio",
        creditCostPerClip: 1, // updated: 2026-03-31 from fal-ai-static
        defaultDurationSeconds: 20,
      },
    ],
    utilities: [ModelUtility.MUSIC_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.UDIO_V2]: {
    name: "Udio v2",
    by: "udio",
    description: "chat.models.descriptions.udioV2",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "music",
    modelType: "audio",
    modelRole: "audio-gen",
    inputs: ["text"],
    outputs: ["audio"],
    providers: [
      {
        id: ModelId.UDIO_V2,
        apiProvider: ApiProvider.FAL_AI,
        providerModel: "fal-ai/udio",
        creditCostPerClip: 5, // updated: 2026-03-31 from fal-ai-static
        defaultDurationSeconds: 30,
      },
    ],
    utilities: [ModelUtility.MUSIC_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_MUSIC_GEN]: {
    name: "ModelsLab Music Gen",
    by: "modelsLab",
    description:
      "chat.models.descriptions.modelsLabMusicGen" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "music",
    modelType: "audio",
    modelRole: "audio-gen",
    inputs: ["text"],
    outputs: ["audio"],
    providers: [
      {
        id: ModelId.MODELSLAB_MUSIC_GEN,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "music_gen",
        creditCostPerClip: 21, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 30,
      },
    ],
    utilities: [ModelUtility.MUSIC_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  // =============================================
  // VIDEO GENERATION MODELS (ModelsLab)
  // =============================================

  [ModelId.MODELSLAB_WAN_2_5_T2V]: {
    name: "Wan 2.5 T2V",
    by: "alibaba",
    description:
      "chat.models.descriptions.modelsLabWan25T2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_WAN_2_5_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "wan2.5-t2v" uses multiplier pricing ($0.500000x base compute) - cannot auto-convert to credits, set manually
        providerModel: "wan2.5-t2v",
        creditCostPerSecond: 50, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_WAN_2_5_I2V]: {
    name: "Wan 2.5 I2V",
    by: "alibaba",
    description:
      "chat.models.descriptions.modelsLabWan25I2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_WAN_2_5_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "wan2.5-i2v" uses multiplier pricing ($0.500000x base compute) - cannot auto-convert to credits, set manually
        providerModel: "wan2.5-i2v",
        creditCostPerSecond: 50, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_WAN_2_6_T2V]: {
    name: "Wan 2.6 T2V",
    by: "alibaba",
    description:
      "chat.models.descriptions.modelsLabWan26T2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_WAN_2_6_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "wan2.6-t2v" uses multiplier pricing ($0.500000x base compute) - cannot auto-convert to credits, set manually
        providerModel: "wan2.6-t2v",
        creditCostPerSecond: 50, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_WAN_2_6_I2V]: {
    name: "Wan 2.6 I2V",
    by: "alibaba",
    description:
      "chat.models.descriptions.modelsLabWan26I2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_WAN_2_6_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "wan2.6-i2v" uses multiplier pricing ($0.500000x base compute) - cannot auto-convert to credits, set manually
        providerModel: "wan2.6-i2v",
        creditCostPerSecond: 50, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_WAN_2_6_I2V_FLASH]: {
    name: "Wan 2.6 I2V Flash",
    by: "alibaba",
    description:
      "chat.models.descriptions.modelsLabWan26I2VFlash" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_WAN_2_6_I2V_FLASH,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "wan2.6-i2v-flash" uses multiplier pricing ($0.050000x base compute) - cannot auto-convert to credits, set manually
        providerModel: "wan2.6-i2v-flash",
        creditCostPerSecond: 5, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_SEEDANCE_T2V]: {
    name: "Seedance T2V",
    by: "byteplus",
    description:
      "chat.models.descriptions.modelsLabSeedanceT2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_SEEDANCE_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "seedance-t2v",
        creditCostPerSecond: 5.5, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_SEEDANCE_I2V]: {
    name: "Seedance I2V",
    by: "byteplus",
    description:
      "chat.models.descriptions.modelsLabSeedanceI2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_SEEDANCE_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "seedance-i2v",
        creditCostPerSecond: 5.5, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_OMNIHUMAN]: {
    name: "Omnihuman",
    by: "byteplus",
    description:
      "chat.models.descriptions.modelsLabOmnihuman" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_OMNIHUMAN,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "omni-human",
        creditCostPerSecond: 16.8, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_SEEDANCE_1_PRO_I2V]: {
    name: "Seedance 1.0 Pro I2V",
    by: "byteplus",
    description:
      "chat.models.descriptions.modelsLabSeedance1ProI2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_SEEDANCE_1_PRO_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "seedance-1.0-pro-i2v",
        creditCostPerSecond: 4.4, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_SEEDANCE_1_PRO_FAST_I2V]: {
    name: "Seedance 1.0 Pro Fast I2V",
    by: "byteplus",
    description:
      "chat.models.descriptions.modelsLabSeedance1ProFastI2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_SEEDANCE_1_PRO_FAST_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "seedance-1.0-pro-fast-i2v",
        creditCostPerSecond: 3.12, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_SEEDANCE_1_PRO_FAST_T2V]: {
    name: "Seedance 1.0 Pro Fast T2V",
    by: "byteplus",
    description:
      "chat.models.descriptions.modelsLabSeedance1ProFastT2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_SEEDANCE_1_PRO_FAST_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "seedance-1.0-pro-fast-t2v",
        creditCostPerSecond: 3.12, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_OMNIHUMAN_1_5]: {
    name: "Omnihuman 1.5",
    by: "byteplus",
    description:
      "chat.models.descriptions.modelsLabOmnihuman15" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_OMNIHUMAN_1_5,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "omnihuman-1.5" (pricing id: "omnihuman-1.5") not found on ModelsLab pricing page
        providerModel: "omni-human-1.5",
        creditCostPerSecond: 14, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_SEEDANCE_1_5_PRO]: {
    name: "Seedance 1.5 Pro",
    by: "byteplus",
    description:
      "chat.models.descriptions.modelsLabSeedance15Pro" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_SEEDANCE_1_5_PRO,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "seedance-1.5-pro" (pricing id: "seedance-1.5-pro") not found on ModelsLab pricing page
        providerModel: "seedance-1-5-pro",
        creditCostPerSecond: 6.2, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_VEO_2]: {
    name: "Veo 2",
    by: "google",
    description:
      "chat.models.descriptions.modelsLabVeo2" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_VEO_2,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "veo-2" (pricing id: "veo-2") not found on ModelsLab pricing page
        providerModel: "veo-2",
        creditCostPerSecond: 66, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_VEO_3]: {
    name: "Veo 3",
    by: "google",
    description:
      "chat.models.descriptions.modelsLabVeo3" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_VEO_3,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "veo-3" (pricing id: "veo-3") not found on ModelsLab pricing page
        providerModel: "veo-3",
        creditCostPerSecond: 83, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_VEO_3_FAST]: {
    name: "Veo 3 Fast",
    by: "google",
    description:
      "chat.models.descriptions.modelsLabVeo3Fast" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_VEO_3_FAST,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "veo-3.0-fast-generate",
        creditCostPerSecond: 18, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_VEO_3_FAST_PREVIEW]: {
    name: "Veo 3 Fast Preview",
    by: "google",
    description:
      "chat.models.descriptions.modelsLabVeo3FastPreview" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_VEO_3_FAST_PREVIEW,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "veo-3-fast-preview" (pricing id: "veo-3-fast-preview") not found on ModelsLab pricing page
        providerModel: "veo-3.0-fast-generate-preview",
        creditCostPerSecond: 12, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_VEO_3_1]: {
    name: "Veo 3.1",
    by: "google",
    description:
      "chat.models.descriptions.modelsLabVeo31" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_VEO_3_1,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "veo-3.1",
        creditCostPerSecond: 48, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_VEO_3_1_FAST]: {
    name: "Veo 3.1 Fast",
    by: "google",
    description:
      "chat.models.descriptions.modelsLabVeo31Fast" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_VEO_3_1_FAST,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "veo-3.1-fast",
        creditCostPerSecond: 24, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_KLING_V2_1_I2V]: {
    name: "Kling V2.1 I2V",
    by: "klingai",
    description:
      "chat.models.descriptions.modelsLabKlingV21I2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_KLING_V2_1_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "kling-v2.1-i2v" (pricing id: "kling-v2.1-i2v") not found on ModelsLab pricing page
        providerModel: "kling-v2-1-i2v",
        creditCostPerSecond: 6.72, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_KLING_V2_5_TURBO_I2V]: {
    name: "Kling V2.5 Turbo I2V",
    by: "klingai",
    description:
      "chat.models.descriptions.modelsLabKlingV25TurboI2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_KLING_V2_5_TURBO_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "kling-v2-5-turbo-i2v" (pricing id: "kling-v2-5-turbo-i2v") not found on ModelsLab pricing page
        providerModel: "kling-v2-5-turbo-i2v",
        creditCostPerSecond: 8.4, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_KLING_V2_5_TURBO_T2V]: {
    name: "Kling V2.5 Turbo T2V",
    by: "klingai",
    description:
      "chat.models.descriptions.modelsLabKlingV25TurboT2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_KLING_V2_5_TURBO_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "kling-v2.5-turbo-t2v" (pricing id: "kling-v2.5-turbo-t2v") not found on ModelsLab pricing page
        providerModel: "kling-v2-5-turbo-t2v",
        creditCostPerSecond: 8.4, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_KLING_V2_MASTER_T2V]: {
    name: "Kling V2 Master T2V",
    by: "klingai",
    description:
      "chat.models.descriptions.modelsLabKlingV2MasterT2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_KLING_V2_MASTER_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "kling-v2-master-t2v",
        creditCostPerSecond: 33.6, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_KLING_V2_MASTER_I2V]: {
    name: "Kling V2 Master I2V",
    by: "klingai",
    description:
      "chat.models.descriptions.modelsLabKlingV2MasterI2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_KLING_V2_MASTER_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "kling-v2-master-i2v",
        creditCostPerSecond: 33.6, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_KLING_V2_1_MASTER_T2V]: {
    name: "Kling V2.1 Master T2V",
    by: "klingai",
    description:
      "chat.models.descriptions.modelsLabKlingV21MasterT2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_KLING_V2_1_MASTER_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "kling-v2.1-master-t2v" (pricing id: "kling-v2.1-master-t2v") not found on ModelsLab pricing page
        providerModel: "kling-v2-1-master-t2v",
        creditCostPerSecond: 33.6, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_KLING_V2_1_MASTER_I2V]: {
    name: "Kling V2.1 Master I2V",
    by: "klingai",
    description:
      "chat.models.descriptions.modelsLabKlingV21MasterI2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_KLING_V2_1_MASTER_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "kling-v2.1-master-i2v" (pricing id: "kling-v2.1-master-i2v") not found on ModelsLab pricing page
        providerModel: "kling-v2-1-master-i2v",
        creditCostPerSecond: 33.6, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_KLING_V1_6_MULTI_I2V]: {
    name: "Kling V1.6 Multi I2V",
    by: "klingai",
    description:
      "chat.models.descriptions.modelsLabKlingV16MultiI2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_KLING_V1_6_MULTI_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "kling-v1.6-multi-i2v" (pricing id: "kling-v1.6-multi-i2v") not found on ModelsLab pricing page
        providerModel: "kling-v1-6",
        creditCostPerSecond: 12, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_KLING_3_0_T2V]: {
    name: "Kling 3.0 T2V",
    by: "klingai",
    description:
      "chat.models.descriptions.modelsLabKling30T2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_KLING_3_0_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "kling-3.0-t2v" (pricing id: "kling-3.0-t2v") not found on ModelsLab pricing page
        providerModel: "kling-v3-t2v",
        creditCostPerSecond: 10, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_LTX_2_PRO_T2V]: {
    name: "LTX 2 PRO T2V",
    by: "ltx",
    description:
      "chat.models.descriptions.modelsLabLtx2ProT2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_LTX_2_PRO_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "ltx-2-pro-t2v" uses multiplier pricing ($0.070000x base compute) - cannot auto-convert to credits, set manually
        providerModel: "ltx-2-pro-t2v",
        creditCostPerSecond: 7, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_LTX_2_PRO_I2V]: {
    name: "LTX 2 PRO I2V",
    by: "ltx",
    description:
      "chat.models.descriptions.modelsLabLtx2ProI2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_LTX_2_PRO_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "ltx-2-pro-i2v" uses multiplier pricing ($0.260000x base compute) - cannot auto-convert to credits, set manually
        providerModel: "ltx-2-pro-i2v",
        creditCostPerSecond: 26, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_LTX_2_3_PRO_I2V]: {
    name: "LTX 2.3 Pro I2V",
    by: "ltx",
    description:
      "chat.models.descriptions.modelsLabLtx23ProI2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_LTX_2_3_PRO_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "ltx-2-3-pro-i2v" uses multiplier pricing ($0.070000x base compute) - cannot auto-convert to credits, set manually
        providerModel: "ltx-2-3-pro-i2v",
        creditCostPerSecond: 7, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_HAILUO_2_3_T2V]: {
    name: "Hailuo 2.3 T2V",
    by: "minimax",
    description:
      "chat.models.descriptions.modelsLabHailuo23T2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_HAILUO_2_3_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "hailuo-2.3-t2v" (pricing id: "hailuo-2.3-t2v") not found on ModelsLab pricing page
        providerModel: "Hailuo-2.3-t2v",
        creditCostPerSecond: 5.5, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_HAILUO_02_T2V]: {
    name: "Hailuo 02 T2V",
    by: "minimax",
    description:
      "chat.models.descriptions.modelsLabHailuo02T2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_HAILUO_02_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "hailuo-02-t2v" (pricing id: "hailuo-02-t2v") not found on ModelsLab pricing page
        providerModel: "Hailuo-02-t2v",
        creditCostPerSecond: 2, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_HAILUO_2_3_I2V]: {
    name: "Hailuo 2.3 I2V",
    by: "minimax",
    description:
      "chat.models.descriptions.modelsLabHailuo23I2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_HAILUO_2_3_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "hailuo-2.3-i2v" (pricing id: "hailuo-2.3-i2v") not found on ModelsLab pricing page
        providerModel: "Hailuo-2.3-i2v",
        creditCostPerSecond: 5.5, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_HAILUO_2_3_FAST_I2V]: {
    name: "Hailuo 2.3 Fast I2V",
    by: "minimax",
    description:
      "chat.models.descriptions.modelsLabHailuo23FastI2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_HAILUO_2_3_FAST_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "hailuo-2.3-fast-i2v" (pricing id: "hailuo-2.3-fast-i2v") not found on ModelsLab pricing page
        providerModel: "Hailuo-2.3-Fast-i2v",
        creditCostPerSecond: 3.8, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_HAILUO_02_I2V]: {
    name: "Hailuo 02 I2V",
    by: "minimax",
    description:
      "chat.models.descriptions.modelsLabHailuo02I2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_HAILUO_02_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "hailuo-02-i2v" (pricing id: "hailuo-02-i2v") not found on ModelsLab pricing page
        providerModel: "Hailuo-02-i2v",
        creditCostPerSecond: 9.8, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_HAILUO_02_START_END]: {
    name: "Hailuo 02 Start/End",
    by: "minimax",
    description:
      "chat.models.descriptions.modelsLabHailuo02StartEnd" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_HAILUO_02_START_END,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "Hailuo-02-start-end" (pricing id: "Hailuo-02-start-end-frame") not found on ModelsLab pricing page
        providerModel: "Hailuo-02-start-end",
        creditCostPerSecond: 9.7, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_SORA_2]: {
    name: "Sora 2",
    by: "openAI",
    description:
      "chat.models.descriptions.modelsLabSora2" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_SORA_2,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "sora-2",
        creditCostPerSecond: 12.5, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_SORA_2_PRO]: {
    name: "Sora 2 Pro",
    by: "openAI",
    description:
      "chat.models.descriptions.modelsLabSora2Pro" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_SORA_2_PRO,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "sora-2-pro" (pricing id: "sora-2-pro") not found on ModelsLab pricing page
        providerModel: "sora-2-pro-t2v",
        creditCostPerSecond: 36, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_GEN4_T2I_TURBO]: {
    name: "Gen4 T2I Turbo",
    by: "runway",
    description:
      "chat.models.descriptions.modelsLabGen4T2ITurbo" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_GEN4_T2I_TURBO,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "gen4_image_turbo",
        creditCostPerImage: 2.5, // updated: 2026-03-31 from modelslab.com
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_GEN4_ALEPH]: {
    name: "Gen4 Aleph",
    by: "runway",
    description:
      "chat.models.descriptions.modelsLabGen4Aleph" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_GEN4_ALEPH,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "gen4-aleph" (pricing id: "gen4-aleph") not found on ModelsLab pricing page
        providerModel: "gen4_aleph",
        creditCostPerSecond: 18, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_LIPSYNC_2]: {
    name: "Lipsync 2",
    by: "sync",
    description:
      "chat.models.descriptions.modelsLabLipsync2" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_LIPSYNC_2,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "lipsync-2",
        creditCostPerSecond: 7, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_GROK_T2V]: {
    name: "Grok T2V",
    by: "xai",
    description:
      "chat.models.descriptions.modelsLabGrokT2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_GROK_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "grok-t2v" uses multiplier pricing ($0.060000x base compute) - cannot auto-convert to credits, set manually
        providerModel: "grok-t2v",
        creditCostPerSecond: 6, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [ModelId.MODELSLAB_GROK_I2V]: {
    name: "Grok I2V",
    by: "xai",
    description:
      "chat.models.descriptions.modelsLabGrokI2V" as AgentTranslationKey,
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    modelType: "video",
    modelRole: "video-gen",
    inputs: ["text"],
    outputs: ["video"],
    providers: [
      {
        id: ModelId.MODELSLAB_GROK_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        // TODO: price not found from modelslab: Model "grok-i2v" uses multiplier pricing ($0.060000x base compute) - cannot auto-convert to credits, set manually
        providerModel: "grok-i2v",
        creditCostPerSecond: 6, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  // =============================================
  // TTS MODELS
  // =============================================

  [ModelId.OPENAI_ALLOY]: {
    name: "Alloy",
    by: "openAI",
    description: "agent.models.openaiAlloy.description" as AgentTranslationKey,
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    modelRole: "tts",
    inputs: ["text"],
    outputs: ["audio"],
    voiceMeta: { gender: "neutral", style: "conversational", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    modelType: "audio",
    providers: [
      {
        id: ModelId.OPENAI_ALLOY,
        apiProvider: ApiProvider.OPENAI_TTS,
        providerModel: "tts-1",
        creditCostPerCharacter: 0.0015, // updated: 2026-03-31 from platform.openai.com
      },
      {
        id: ModelId.OPENAI_ALLOY,
        apiProvider: ApiProvider.EDEN_AI_TTS,
        providerModel: "openai",
        creditCostPerCharacter: 0.0018, // updated: 2026-03-31 from edenai.co
      },
    ],
  },
  [ModelId.OPENAI_NOVA]: {
    name: "Nova",
    by: "openAI",
    description: "agent.models.openaiNova.description" as AgentTranslationKey,
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    modelRole: "tts",
    inputs: ["text"],
    outputs: ["audio"],
    voiceMeta: { gender: "female", style: "warm", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    modelType: "audio",
    providers: [
      {
        id: ModelId.OPENAI_NOVA,
        apiProvider: ApiProvider.OPENAI_TTS,
        providerModel: "tts-1",
        creditCostPerCharacter: 0.0015, // updated: 2026-03-31 from platform.openai.com
      },
      {
        id: ModelId.OPENAI_NOVA,
        apiProvider: ApiProvider.EDEN_AI_TTS,
        providerModel: "openai",
        creditCostPerCharacter: 0.0018, // updated: 2026-03-31 from edenai.co
      },
    ],
  },
  [ModelId.OPENAI_ONYX]: {
    name: "Onyx",
    by: "openAI",
    description: "agent.models.openaiOnyx.description" as AgentTranslationKey,
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    modelRole: "tts",
    inputs: ["text"],
    outputs: ["audio"],
    voiceMeta: { gender: "male", style: "deep", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    modelType: "audio",
    providers: [
      {
        id: ModelId.OPENAI_ONYX,
        apiProvider: ApiProvider.OPENAI_TTS,
        providerModel: "tts-1",
        creditCostPerCharacter: 0.0015, // updated: 2026-03-31 from platform.openai.com
      },
      {
        id: ModelId.OPENAI_ONYX,
        apiProvider: ApiProvider.EDEN_AI_TTS,
        providerModel: "openai",
        creditCostPerCharacter: 0.0018, // updated: 2026-03-31 from edenai.co
      },
    ],
  },
  [ModelId.OPENAI_ECHO]: {
    name: "Echo",
    by: "openAI",
    description: "agent.models.openaiEcho.description" as AgentTranslationKey,
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    modelRole: "tts",
    inputs: ["text"],
    outputs: ["audio"],
    voiceMeta: { gender: "male", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    modelType: "audio",
    providers: [
      {
        id: ModelId.OPENAI_ECHO,
        apiProvider: ApiProvider.OPENAI_TTS,
        providerModel: "tts-1",
        creditCostPerCharacter: 0.0015, // updated: 2026-03-31 from platform.openai.com
      },
    ],
  },
  [ModelId.OPENAI_SHIMMER]: {
    name: "Shimmer",
    by: "openAI",
    description:
      "agent.models.openaiShimmer.description" as AgentTranslationKey,
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    modelRole: "tts",
    inputs: ["text"],
    outputs: ["audio"],
    voiceMeta: { gender: "female", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    modelType: "audio",
    providers: [
      {
        id: ModelId.OPENAI_SHIMMER,
        apiProvider: ApiProvider.OPENAI_TTS,
        providerModel: "tts-1",
        creditCostPerCharacter: 0.0015, // updated: 2026-03-31 from platform.openai.com
      },
    ],
  },
  [ModelId.OPENAI_FABLE]: {
    name: "Fable",
    by: "openAI",
    description: "agent.models.openaiFable.description" as AgentTranslationKey,
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    modelRole: "tts",
    inputs: ["text"],
    outputs: ["audio"],
    voiceMeta: { gender: "male", style: "expressive", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    modelType: "audio",
    providers: [
      {
        id: ModelId.OPENAI_FABLE,
        apiProvider: ApiProvider.OPENAI_TTS,
        providerModel: "tts-1",
        creditCostPerCharacter: 0.0015, // updated: 2026-03-31 from platform.openai.com
      },
    ],
  },
  [ModelId.ELEVENLABS_RACHEL]: {
    name: "Rachel",
    by: "elevenlabs",
    description:
      "agent.models.elevenlabsRachel.description" as AgentTranslationKey,
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    modelRole: "tts",
    inputs: ["text"],
    outputs: ["audio"],
    voiceMeta: { gender: "female", style: "calm", language: "en" },
    utilities: [ModelUtility.TTS, ModelUtility.SMART],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    modelType: "audio",
    providers: [
      {
        id: ModelId.ELEVENLABS_RACHEL,
        apiProvider: ApiProvider.ELEVENLABS,
        providerModel: "21m00Tcm4TlvDq8ikWAM",
        creditCostPerCharacter: 0.03, // updated: 2026-03-31 from api.elevenlabs.io
      },
    ],
  },
  [ModelId.ELEVENLABS_JOSH]: {
    name: "Josh",
    by: "elevenlabs",
    description:
      "agent.models.elevenlabsJosh.description" as AgentTranslationKey,
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    modelRole: "tts",
    inputs: ["text"],
    outputs: ["audio"],
    voiceMeta: { gender: "male", style: "deep", language: "en" },
    utilities: [ModelUtility.TTS, ModelUtility.SMART],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    modelType: "audio",
    providers: [
      {
        id: ModelId.ELEVENLABS_JOSH,
        apiProvider: ApiProvider.ELEVENLABS,
        providerModel: "TxGEqnHWrfWFTfGW9XjX",
        creditCostPerCharacter: 0.03, // updated: 2026-03-31 from api.elevenlabs.io
      },
    ],
  },
  [ModelId.ELEVENLABS_BELLA]: {
    name: "Bella",
    by: "elevenlabs",
    description:
      "agent.models.elevenlabsBella.description" as AgentTranslationKey,
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    modelRole: "tts",
    inputs: ["text"],
    outputs: ["audio"],
    voiceMeta: { gender: "female", style: "friendly", language: "en" },
    utilities: [ModelUtility.TTS, ModelUtility.SMART],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    modelType: "audio",
    providers: [
      {
        id: ModelId.ELEVENLABS_BELLA,
        apiProvider: ApiProvider.ELEVENLABS,
        providerModel: "EXAVITQu4vr4xnSDxMaL",
        creditCostPerCharacter: 0.03, // updated: 2026-03-31 from api.elevenlabs.io
      },
    ],
  },
  [ModelId.ELEVENLABS_ADAM]: {
    name: "Adam",
    by: "elevenlabs",
    description:
      "agent.models.elevenlabsAdam.description" as AgentTranslationKey,
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    modelRole: "tts",
    inputs: ["text"],
    outputs: ["audio"],
    voiceMeta: { gender: "male", style: "authoritative", language: "en" },
    utilities: [ModelUtility.TTS, ModelUtility.SMART],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    modelType: "audio",
    providers: [
      {
        id: ModelId.ELEVENLABS_ADAM,
        apiProvider: ApiProvider.ELEVENLABS,
        providerModel: "pNInz6obpgDQGcFmaJgB",
        creditCostPerCharacter: 0.03, // updated: 2026-03-31 from api.elevenlabs.io
      },
    ],
  },

  // =============================================
  // STT MODELS
  // =============================================

  [ModelId.OPENAI_WHISPER]: {
    name: "Whisper",
    by: "openAI",
    description:
      "agent.models.openaiWhisper.description" as AgentTranslationKey,
    contextWindow: 0,
    parameterCount: undefined,
    icon: "mic",
    modelRole: "stt",
    inputs: ["audio"],
    outputs: ["text"],
    utilities: [ModelUtility.STT],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    modelType: "audio",
    providers: [
      {
        id: ModelId.OPENAI_WHISPER,
        apiProvider: ApiProvider.OPENAI_STT,
        providerModel: "whisper-1",
        creditCostPerSecond: 0.012, // updated: 2026-03-31 from edenai.co
      },
      {
        id: ModelId.OPENAI_WHISPER,
        apiProvider: ApiProvider.EDEN_AI_STT,
        providerModel: "openai",
        creditCostPerSecond: 0.012, // updated: 2026-03-31 from edenai.co
      },
    ],
  },
  [ModelId.DEEPGRAM_NOVA_2]: {
    name: "Nova-2",
    by: "deepgram",
    description:
      "agent.models.deepgramNova2.description" as AgentTranslationKey,
    contextWindow: 0,
    parameterCount: undefined,
    icon: "mic",
    modelRole: "stt",
    inputs: ["audio"],
    outputs: ["text"],
    utilities: [ModelUtility.STT, ModelUtility.FAST],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    modelType: "audio",
    providers: [
      {
        id: ModelId.DEEPGRAM_NOVA_2,
        apiProvider: ApiProvider.DEEPGRAM,
        providerModel: "nova-2",
        creditCostPerSecond: 0.0097, // updated: 2026-03-31 from deepgram.com
      },
    ],
  },
};
/* eslint-enable i18next/no-literal-string */

/**
 * Build flat modelOptions from modelDefinitions for backward compatibility.
 * Each provider variant becomes its own ModelOption entry.
 */
function buildModelOptions(): Record<string, ModelOption> {
  const result: Record<string, ModelOption> = {};

  for (const def of Object.values(modelDefinitions)) {
    for (const provider of def.providers) {
      const base = {
        id: provider.id,
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
        speed: def.speed,
        content: def.content,
        features: def.features,
        weaknesses: def.weaknesses,
        adminOnly: provider.adminOnly,
        modelType: def.modelType ?? "text",
        modelTypes: def.modelTypes ?? [def.modelType ?? "text"],
        modelRole: def.modelRole,
        inputs: def.inputs,
        outputs: def.outputs,
        voiceMeta: def.voiceMeta,
      };

      if ("creditCostPerImage" in provider) {
        result[provider.id] = {
          ...base,
          creditCostPerImage: provider.creditCostPerImage,
        } as ModelOptionImageBased;
      } else if ("creditCostPerClip" in provider) {
        result[provider.id] = {
          ...base,
          creditCostPerClip: provider.creditCostPerClip,
          defaultDurationSeconds: provider.defaultDurationSeconds,
        } as ModelOptionAudioBased;
      } else if ("creditCostPerCharacter" in provider) {
        result[provider.id] = {
          ...base,
          creditCostPerCharacter: provider.creditCostPerCharacter,
        } as ModelOptionTtsBased;
      } else if (
        "creditCostPerSecond" in provider &&
        "defaultDurationSeconds" in provider
      ) {
        result[provider.id] = {
          ...base,
          creditCostPerSecond: provider.creditCostPerSecond,
          defaultDurationSeconds: provider.defaultDurationSeconds,
        } as ModelOptionVideoBased;
      } else if ("creditCostPerSecond" in provider) {
        result[provider.id] = {
          ...base,
          creditCostPerSecond: provider.creditCostPerSecond,
        } as ModelOptionSttBased;
      } else if (typeof provider.creditCost === "number") {
        result[provider.id] = {
          ...base,
          creditCost: provider.creditCost,
        } as ModelOptionCreditBased;
      } else {
        result[provider.id] = {
          ...base,
          creditCost: provider.creditCost,
          inputTokenCost: provider.inputTokenCost,
          outputTokenCost: provider.outputTokenCost,
        } as ModelOptionTokenBased;
      }
    }
  }

  return result;
}

/**
 * Internal flat index: ModelId → ModelOption (one entry per provider variant).
 * Use getModelById() for point lookups, getAllModelOptions() for iteration.
 */
const modelOptionsIndex = buildModelOptions();

/**
 * @deprecated Use modelDefinitions + getModelById() instead.
 * Kept temporarily for backward compat during refactor.
 */
export const modelOptions = modelOptionsIndex;

/** Default model used when no specific model is selected */
export const defaultModel = ModelId.KIMI_K2;

/**
 * Retrieves a model configuration by its ID.
 * Falls back to the default model if the requested model is not found.
 *
 * @param modelId - The model identifier to look up
 * @returns The model configuration object
 */
export function getModelById(modelId: ImageGenModelId): ImageGenModelOption;
export function getModelById(modelId: MusicGenModelId): MusicGenModelOption;
export function getModelById(modelId: VideoGenModelId): VideoGenModelOption;
export function getModelById(modelId: ModelId): ModelOption;
export function getModelById(modelId: ModelId): ModelOption {
  const foundModel = modelOptionsIndex[modelId];

  if (foundModel) {
    return foundModel;
  }

  // Fallback to default model - this should never fail as default model is in the object
  return modelOptionsIndex[defaultModel];
}

/**
 * Get all model options as a flat array (one entry per provider variant).
 * For UI display that groups by conceptual model, use modelDefinitions instead.
 */
export function getAllModelOptions(): ModelOption[] {
  return Object.values(modelOptionsIndex);
}

/**
 * Get display name for a model, appending API provider suffix when the
 * conceptual model has multiple providers visible to the given user.
 * E.g. "Claude Haiku 4.5 (OpenRouter)" vs "Claude Haiku 4.5 (Claude Code)"
 */
export function getModelDisplayName(
  model: ModelOption,
  isAdmin: boolean,
): string {
  // Find the parent definition by matching model name
  const def = Object.values(modelDefinitions).find(
    (d) => d.name === model.name,
  );
  if (!def) {
    return model.name;
  }

  // Count how many providers are visible to this user
  const visibleProviders = isAdmin
    ? def.providers
    : def.providers.filter((p) => !p.adminOnly);

  if (visibleProviders.length <= 1) {
    return model.name;
  }

  return `${model.name} (${apiProviderDisplayNames[model.apiProvider]})`;
}

/**
 * Model ID options for SELECT fields
 */
export const ModelIdOptions = Object.values(modelOptionsIndex).map((model) => ({
  value: model.id,
  label: model.name,
}));

/**
 * TTS voice options for SELECT fields (voiceId)
 */
export const TtsModelIdOptions = TTS_MODEL_IDS.map((id) => ({
  value: id,
  label: modelOptionsIndex[id]?.name ?? id,
}));

/**
 * STT model options for SELECT fields (sttModelId)
 */
export const SttModelIdOptions = STT_MODEL_IDS.map((id) => ({
  value: id,
  label: modelOptionsIndex[id]?.name ?? id,
}));

/**
 * LLM model IDs - all ModelId values with modelRole: "llm"
 * Used for visionBridgeModelId and translationModelId selectors.
 */
export const LLM_MODEL_IDS = Object.values(modelOptionsIndex)
  .filter((m) => m.modelRole === "llm")
  .map((m) => m.id) as ModelId[];

export type LlmModelId = (typeof LLM_MODEL_IDS)[number];

export const LlmModelIdOptions = LLM_MODEL_IDS.map((id) => ({
  value: id,
  label: modelOptionsIndex[id]?.name ?? id,
}));

/**
 * Vision-capable LLM model IDs (accept image input) - for visionBridgeModelId.
 */
export const VISION_MODEL_IDS = Object.values(modelOptionsIndex)
  .filter((m) => m.modelRole === "llm" && m.inputs.includes("image"))
  .map((m) => m.id) as ModelId[];

export type VisionModelId = (typeof VISION_MODEL_IDS)[number];

export const VisionModelIdOptions = VISION_MODEL_IDS.map((id) => ({
  value: id,
  label: modelOptionsIndex[id]?.name ?? id,
}));

/**
 * Image generation model IDs - all ModelId values with modelRole: "image-gen"
 * Used for imageGenModelId selectors.
 * Static list kept in sync with modelOptionsIndex entries where modelRole === "image-gen".
 */
export type ImageGenModelId =
  | ModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW
  | ModelId.DALL_E_3
  | ModelId.GPT_IMAGE_1
  | ModelId.FLUX_SCHNELL
  | ModelId.FLUX_PRO
  | ModelId.SDXL
  | ModelId.FLUX_2_MAX
  | ModelId.FLUX_2_KLEIN_4B
  | ModelId.RIVERFLOW_V2_PRO
  | ModelId.RIVERFLOW_V2_FAST
  | ModelId.RIVERFLOW_V2_MAX_PREVIEW
  | ModelId.RIVERFLOW_V2_STANDARD_PREVIEW
  | ModelId.RIVERFLOW_V2_FAST_PREVIEW
  | ModelId.FLUX_2_FLEX
  | ModelId.FLUX_2_PRO
  | ModelId.GEMINI_3_PRO_IMAGE_PREVIEW
  | ModelId.GPT_5_IMAGE_MINI
  | ModelId.GPT_5_IMAGE
  | ModelId.SEEDREAM_4_5;

export const IMAGE_GEN_MODEL_IDS = [
  ModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW,
  ModelId.DALL_E_3,
  ModelId.GPT_IMAGE_1,
  ModelId.FLUX_SCHNELL,
  ModelId.FLUX_PRO,
  ModelId.SDXL,
  ModelId.FLUX_2_MAX,
  ModelId.FLUX_2_KLEIN_4B,
  ModelId.RIVERFLOW_V2_PRO,
  ModelId.RIVERFLOW_V2_FAST,
  ModelId.RIVERFLOW_V2_MAX_PREVIEW,
  ModelId.RIVERFLOW_V2_STANDARD_PREVIEW,
  ModelId.RIVERFLOW_V2_FAST_PREVIEW,
  ModelId.FLUX_2_FLEX,
  ModelId.FLUX_2_PRO,
  ModelId.GEMINI_3_PRO_IMAGE_PREVIEW,
  ModelId.GPT_5_IMAGE_MINI,
  ModelId.GPT_5_IMAGE,
  ModelId.SEEDREAM_4_5,
] as const satisfies ImageGenModelId[];

export const DEFAULT_IMAGE_GEN_MODEL_ID: ImageGenModelId =
  ModelId.GEMINI_3_PRO_IMAGE_PREVIEW;

export const ImageGenModelIdOptions = IMAGE_GEN_MODEL_IDS.map((id) => ({
  value: id,
  label: modelOptionsIndex[id]?.name ?? id,
}));

/**
 * Music/audio generation model IDs - all ModelId values with modelRole: "audio-gen"
 * Used for musicGenModelId selectors.
 * Static list kept in sync with modelOptionsIndex entries where modelRole === "audio-gen".
 */
export type MusicGenModelId =
  | ModelId.MUSICGEN_STEREO
  | ModelId.STABLE_AUDIO
  | ModelId.UDIO_V2
  | ModelId.MODELSLAB_MUSIC_GEN;

export const MUSIC_GEN_MODEL_IDS = [
  ModelId.MUSICGEN_STEREO,
  ModelId.STABLE_AUDIO,
  ModelId.UDIO_V2,
  ModelId.MODELSLAB_MUSIC_GEN,
] as const satisfies MusicGenModelId[];

export const MusicGenModelIdOptions = MUSIC_GEN_MODEL_IDS.map((id) => ({
  value: id,
  label: modelOptionsIndex[id]?.name ?? id,
}));

/**
 * Video generation model IDs - all ModelId values with modelRole: "video-gen"
 * Used for videoGenModelId selectors.
 * Static list kept in sync with modelOptionsIndex entries where modelRole === "video-gen".
 */
export type VideoGenModelId =
  | ModelId.MODELSLAB_WAN_2_5_T2V
  | ModelId.MODELSLAB_WAN_2_5_I2V
  | ModelId.MODELSLAB_WAN_2_6_T2V
  | ModelId.MODELSLAB_WAN_2_6_I2V
  | ModelId.MODELSLAB_WAN_2_6_I2V_FLASH
  | ModelId.MODELSLAB_SEEDANCE_T2V
  | ModelId.MODELSLAB_SEEDANCE_I2V
  | ModelId.MODELSLAB_OMNIHUMAN
  | ModelId.MODELSLAB_SEEDANCE_1_PRO_I2V
  | ModelId.MODELSLAB_SEEDANCE_1_PRO_FAST_I2V
  | ModelId.MODELSLAB_SEEDANCE_1_PRO_FAST_T2V
  | ModelId.MODELSLAB_OMNIHUMAN_1_5
  | ModelId.MODELSLAB_SEEDANCE_1_5_PRO
  | ModelId.MODELSLAB_VEO_2
  | ModelId.MODELSLAB_VEO_3
  | ModelId.MODELSLAB_VEO_3_FAST
  | ModelId.MODELSLAB_VEO_3_FAST_PREVIEW
  | ModelId.MODELSLAB_VEO_3_1
  | ModelId.MODELSLAB_VEO_3_1_FAST
  | ModelId.MODELSLAB_KLING_V2_1_I2V
  | ModelId.MODELSLAB_KLING_V2_5_TURBO_I2V
  | ModelId.MODELSLAB_KLING_V2_5_TURBO_T2V
  | ModelId.MODELSLAB_KLING_V2_MASTER_T2V
  | ModelId.MODELSLAB_KLING_V2_MASTER_I2V
  | ModelId.MODELSLAB_KLING_V2_1_MASTER_T2V
  | ModelId.MODELSLAB_KLING_V2_1_MASTER_I2V
  | ModelId.MODELSLAB_KLING_V1_6_MULTI_I2V
  | ModelId.MODELSLAB_KLING_3_0_T2V
  | ModelId.MODELSLAB_LTX_2_PRO_T2V
  | ModelId.MODELSLAB_LTX_2_PRO_I2V
  | ModelId.MODELSLAB_LTX_2_3_PRO_I2V
  | ModelId.MODELSLAB_HAILUO_2_3_T2V
  | ModelId.MODELSLAB_HAILUO_02_T2V
  | ModelId.MODELSLAB_HAILUO_2_3_I2V
  | ModelId.MODELSLAB_HAILUO_2_3_FAST_I2V
  | ModelId.MODELSLAB_HAILUO_02_I2V
  | ModelId.MODELSLAB_HAILUO_02_START_END
  | ModelId.MODELSLAB_SORA_2
  | ModelId.MODELSLAB_SORA_2_PRO
  | ModelId.MODELSLAB_GEN4_T2I_TURBO
  | ModelId.MODELSLAB_GEN4_ALEPH
  | ModelId.MODELSLAB_LIPSYNC_2
  | ModelId.MODELSLAB_GROK_T2V
  | ModelId.MODELSLAB_GROK_I2V;

export const VIDEO_GEN_MODEL_IDS = [
  ModelId.MODELSLAB_WAN_2_5_T2V,
  ModelId.MODELSLAB_WAN_2_5_I2V,
  ModelId.MODELSLAB_WAN_2_6_T2V,
  ModelId.MODELSLAB_WAN_2_6_I2V,
  ModelId.MODELSLAB_WAN_2_6_I2V_FLASH,
  ModelId.MODELSLAB_SEEDANCE_T2V,
  ModelId.MODELSLAB_SEEDANCE_I2V,
  ModelId.MODELSLAB_OMNIHUMAN,
  ModelId.MODELSLAB_SEEDANCE_1_PRO_I2V,
  ModelId.MODELSLAB_SEEDANCE_1_PRO_FAST_I2V,
  ModelId.MODELSLAB_SEEDANCE_1_PRO_FAST_T2V,
  ModelId.MODELSLAB_OMNIHUMAN_1_5,
  ModelId.MODELSLAB_SEEDANCE_1_5_PRO,
  ModelId.MODELSLAB_VEO_2,
  ModelId.MODELSLAB_VEO_3,
  ModelId.MODELSLAB_VEO_3_FAST,
  ModelId.MODELSLAB_VEO_3_FAST_PREVIEW,
  ModelId.MODELSLAB_VEO_3_1,
  ModelId.MODELSLAB_VEO_3_1_FAST,
  ModelId.MODELSLAB_KLING_V2_1_I2V,
  ModelId.MODELSLAB_KLING_V2_5_TURBO_I2V,
  ModelId.MODELSLAB_KLING_V2_5_TURBO_T2V,
  ModelId.MODELSLAB_KLING_V2_MASTER_T2V,
  ModelId.MODELSLAB_KLING_V2_MASTER_I2V,
  ModelId.MODELSLAB_KLING_V2_1_MASTER_T2V,
  ModelId.MODELSLAB_KLING_V2_1_MASTER_I2V,
  ModelId.MODELSLAB_KLING_V1_6_MULTI_I2V,
  ModelId.MODELSLAB_KLING_3_0_T2V,
  ModelId.MODELSLAB_LTX_2_PRO_T2V,
  ModelId.MODELSLAB_LTX_2_PRO_I2V,
  ModelId.MODELSLAB_LTX_2_3_PRO_I2V,
  ModelId.MODELSLAB_HAILUO_2_3_T2V,
  ModelId.MODELSLAB_HAILUO_02_T2V,
  ModelId.MODELSLAB_HAILUO_2_3_I2V,
  ModelId.MODELSLAB_HAILUO_2_3_FAST_I2V,
  ModelId.MODELSLAB_HAILUO_02_I2V,
  ModelId.MODELSLAB_HAILUO_02_START_END,
  ModelId.MODELSLAB_SORA_2,
  ModelId.MODELSLAB_SORA_2_PRO,
  ModelId.MODELSLAB_GEN4_T2I_TURBO,
  ModelId.MODELSLAB_GEN4_ALEPH,
  ModelId.MODELSLAB_LIPSYNC_2,
  ModelId.MODELSLAB_GROK_T2V,
  ModelId.MODELSLAB_GROK_I2V,
] as const satisfies VideoGenModelId[];

export const VideoGenModelIdOptions = VIDEO_GEN_MODEL_IDS.map((id) => ({
  value: id,
  label: modelOptionsIndex[id]?.name ?? id,
}));

/**
 * Chat model IDs - models suitable for the main chat LLM selector.
 * Excludes pure media-generation (image-gen, video-gen, audio-gen),
 * speech (tts, stt), and embedding roles.
 */
export const CHAT_MODEL_IDS = Object.values(modelOptionsIndex)
  .filter(
    (m) =>
      m.modelRole !== "image-gen" &&
      m.modelRole !== "video-gen" &&
      m.modelRole !== "audio-gen" &&
      m.modelRole !== "tts" &&
      m.modelRole !== "stt" &&
      m.modelRole !== "embedding",
  )
  .map((m) => m.id) as ModelId[];

export type ChatModelId = (typeof CHAT_MODEL_IDS)[number];

export const ChatModelIdOptions = CHAT_MODEL_IDS.map((id) => ({
  value: id,
  label: modelOptionsIndex[id]?.name ?? id,
}));

/**
 * Returns the best available platform-level default ModelOption for a given role.
 *
 * When `env` is provided, only models whose API provider is configured are
 * considered - so the trigger always shows a model the user can actually use.
 * When `env` is omitted, the original hardcoded defaults are used (backward-compat).
 *
 * Priority: configured hardcoded default first, then any available model for
 * the role, then null (shows placeholder text instead).
 */
export function getDefaultModelForRole(
  roles: ModelRole[],
  env?: ModelProviderEnvAvailability,
  requiredInputs?: Modality[],
): ModelOption | null {
  const matchesInputs = (m: ModelOption): boolean =>
    !requiredInputs || requiredInputs.every((mod) => m.inputs.includes(mod));

  // Try hardcoded defaults first (preferred UX anchors) - only when no input filter
  if (!requiredInputs) {
    const hardcodedDefaults: Partial<Record<ModelRole, ModelId>> = {
      tts: DEFAULT_TTS_VOICE_ID,
      stt: DEFAULT_STT_MODEL_ID,
      "image-gen": DEFAULT_IMAGE_GEN_MODEL_ID,
    };
    for (const role of roles) {
      const defaultId = hardcodedDefaults[role];
      if (defaultId) {
        const m = getModelById(defaultId);
        if (m && (!env || isModelProviderAvailable(m, env))) {
          return m;
        }
      }
    }
  }
  // Fallback: first non-admin available model for this role set (+ optional input filter)
  if (env) {
    const candidate = getAllModelOptions().find(
      (m) =>
        (roles as string[]).includes(m.modelRole) &&
        !m.adminOnly &&
        isModelProviderAvailable(m, env) &&
        matchesInputs(m),
    );
    if (candidate) {
      return candidate;
    }
  }
  return null;
}

/**
 * Get credit cost from a ModelOption object
 * Handles both function and number types
 * @param model - The model option object
 * @param actualInputTokens - Actual input tokens used (required)
 * @param actualOutputTokens - Actual output tokens used (required)
 * @returns Credit cost as a number
 */
export function getCreditCostFromModel(
  model: ModelOption,
  actualInputTokens: number,
  actualOutputTokens: number,
  cachedInputTokens = 0,
  cacheWriteTokens = 0,
): number {
  return typeof model.creditCost === "number"
    ? model.creditCost
    : model.inputTokenCost !== undefined && model.outputTokenCost !== undefined
      ? model.creditCost(
          model,
          actualInputTokens,
          actualOutputTokens,
          cachedInputTokens,
          cacheWriteTokens,
        )
      : 0;
}

/**
 * Get credit cost for a specific model
 * @param modelId - The model identifier
 * @param actualInputTokens - Total input tokens (including cached)
 * @param actualOutputTokens - Actual output tokens used (required)
 * @param cachedInputTokens - Tokens served from cache (default 0)
 * @param cacheWriteTokens - Tokens written to cache (default 0)
 * @returns Credit cost (defaults to 1 if model not found)
 */
export function getModelCost(
  modelId: ModelId,
  actualInputTokens: number,
  actualOutputTokens: number,
  cachedInputTokens = 0,
  cacheWriteTokens = 0,
): number {
  const model = getModelById(modelId);
  return getCreditCostFromModel(
    model,
    actualInputTokens,
    actualOutputTokens,
    cachedInputTokens,
    cacheWriteTokens,
  );
}

function roundMediaCost(v: number): number {
  const r = Math.round(v * 10) / 10;
  return r % 1 === 0 ? Math.round(r) : r;
}

/**
 * Calculate credit cost based on token pricing
 * 1 credit = $0.01 (1 cent)
 * @param modelOption - The model option with pricing information
 * @param actualInputTokens - Total input tokens (including cached)
 * @param actualOutputTokens - Actual output tokens used
 * @param cachedInputTokens - Tokens served from cache (subset of actualInputTokens, default 0)
 * @param cacheWriteTokens - Tokens written to cache this request (default 0)
 * @returns Calculated credit cost (0 for models with 0 token costs)
 */
export function calculateCreditCost(
  modelOption: ModelOption,
  actualInputTokens: number,
  actualOutputTokens: number,
  cachedInputTokens = 0,
  cacheWriteTokens = 0,
): number {
  // Handle fixed-cost media generation models
  // Stored value is raw API cost in credits; apply markup at call time
  if ("creditCostPerImage" in modelOption) {
    return roundMediaCost(
      modelOption.creditCostPerImage * (1 + STANDARD_MARKUP_PERCENTAGE),
    );
  }
  if ("creditCostPerClip" in modelOption) {
    return roundMediaCost(
      modelOption.creditCostPerClip * (1 + STANDARD_MARKUP_PERCENTAGE),
    );
  }
  if ("creditCostPerSecond" in modelOption) {
    if ("defaultDurationSeconds" in modelOption) {
      // Video model: fixed upfront cost for default duration
      return roundMediaCost(
        modelOption.creditCostPerSecond *
          modelOption.defaultDurationSeconds *
          (1 + STANDARD_MARKUP_PERCENTAGE),
      );
    }
    // STT model: creditCostPerSecond displayed as rate, not upfront
    return roundMediaCost(
      modelOption.creditCostPerSecond * (1 + STANDARD_MARKUP_PERCENTAGE),
    );
  }

  // Handle credit-based models (fixed cost per message)
  if (typeof modelOption.creditCost === "number") {
    return modelOption.creditCost;
  }

  // At this point, TypeScript knows it's ModelOptionTokenBased
  const tokenModel = modelOption as ModelOptionTokenBased;
  const DOLLARS_PER_CREDIT = 0.01; // 1 credit = $0.01 (1 cent)

  const uncachedInputTokens = actualInputTokens - cachedInputTokens;

  // Uncached input tokens billed at full input rate
  const uncachedInputCost =
    (tokenModel.inputTokenCost / 1_000_000) * uncachedInputTokens;

  // Cache reads: use cacheReadTokenCost if defined, otherwise fall back to full input rate
  const effectiveCacheReadRate =
    tokenModel.cacheReadTokenCost ?? tokenModel.inputTokenCost;
  const cachedInputCost =
    (effectiveCacheReadRate / 1_000_000) * cachedInputTokens;

  // Cache writes: use cacheWriteTokenCost if defined, otherwise fall back to full input rate
  const effectiveCacheWriteRate =
    tokenModel.cacheWriteTokenCost ?? tokenModel.inputTokenCost;
  const cacheWriteCost =
    (effectiveCacheWriteRate / 1_000_000) * cacheWriteTokens;

  const outputCostPerMessage =
    (tokenModel.outputTokenCost / 1_000_000) * actualOutputTokens;

  const totalCostPerMessage =
    uncachedInputCost + cachedInputCost + cacheWriteCost + outputCostPerMessage;

  // Convert to credits (1 credit = $0.01)
  const credits =
    (totalCostPerMessage / DOLLARS_PER_CREDIT) *
    (1 + STANDARD_MARKUP_PERCENTAGE);

  // Round to one decimal place
  const rounded = Math.round(credits * 10) / 10;

  // Return as integer if the decimal place is 0 (e.g., 1.0 → 1, 2.0 → 2)
  return rounded % 1 === 0 ? Math.round(rounded) : rounded;
}

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
 * Extracted here (alongside modelDefinitions) so it works on both server and client
 * without pulling in server-only env modules.
 */
export function isModelProviderAvailable(
  model: ModelOption,
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

/**
 * Total number of AI models available (conceptual models, not provider variants).
 * Counts all non-admin-only models - the public-facing baseline.
 * For the count a specific user actually sees, use getAvailableModelCount().
 */
export const TOTAL_MODEL_COUNT = Object.values(modelDefinitions).filter((def) =>
  def.providers.some((p) => !p.adminOnly),
).length;

/**
 * Total number of AI provider companies (OpenAI, Anthropic, Google, etc.).
 * For the count available on a specific instance, use getAvailableProviderCount().
 */
export const TOTAL_PROVIDER_COUNT = Object.keys(modelProviders).length;

/**
 * Returns how many conceptual models are accessible to a user given their role
 * and the current server's env key configuration.
 *
 * - Non-admins: only models with at least one non-admin-only provider that is
 *   also available in the env.
 * - Admins: all models regardless of adminOnly or env availability.
 */
export function getAvailableModelCount(
  env: ModelProviderEnvAvailability,
  isAdmin: boolean,
): number {
  return Object.values(modelDefinitions).filter((def) => {
    const visibleProviders = isAdmin
      ? def.providers
      : def.providers.filter((p) => !p.adminOnly);
    if (visibleProviders.length === 0) {
      return false;
    }
    if (isAdmin) {
      return true;
    }
    return visibleProviders.some((p) => {
      const option = modelOptionsIndex[p.id];
      return option ? isModelProviderAvailable(option, env) : false;
    });
  }).length;
}

/**
 * Returns how many distinct API providers are configured in the environment.
 * Admins see all providers regardless of key presence.
 */
export function getAvailableProviderCount(
  env: ModelProviderEnvAvailability,
  isAdmin: boolean,
): number {
  if (isAdmin) {
    return Object.keys(modelProviders).length;
  }
  // Count providers that have at least one non-adminOnly model available in env
  const availableProviderIds = new Set<string>();
  for (const def of Object.values(modelDefinitions)) {
    const publicProviders = def.providers.filter((p) => !p.adminOnly);
    for (const p of publicProviders) {
      const option = modelOptionsIndex[p.id];
      if (option && isModelProviderAvailable(option, env)) {
        availableProviderIds.add(def.by);
        break;
      }
    }
  }
  return availableProviderIds.size;
}

/**
 * Total number of pre-built AI skills/personas accessible to regular customers.
 * Source of truth: DEFAULT_SKILLS in generated/skills-index (52 skills as of last gen).
 * Kept as a constant here to avoid a circular import (skills → models → skills).
 * Update this when the generator output changes, or use getAvailableSkillCount()
 * from skills/config for user-role-aware counts.
 */
export const TOTAL_CHARACTER_COUNT = 52;

/**
 * Featured models by category for use in marketing content, emails, etc.
 */
export const FEATURED_MODELS = {
  // Representative picks per category - used in marketing content and emails
  mainstream: [
    modelDefinitions[ModelId.CLAUDE_OPUS_4_6].name,
    modelDefinitions[ModelId.GPT_5_4_PRO].name,
    modelDefinitions[ModelId.GEMINI_3_1_PRO_PREVIEW_CUSTOM_TOOLS].name,
    modelDefinitions[ModelId.GROK_4_20_BETA].name,
  ],
  open: [
    modelDefinitions[ModelId.DEEPSEEK_R1].name,
    modelDefinitions[ModelId.KIMI_K2_5].name,
    modelDefinitions[ModelId.GLM_5].name,
  ],
  uncensored: [
    modelDefinitions[ModelId.UNCENSORED_LM_V1_2].name,
    modelDefinitions[ModelId.FREEDOMGPT_LIBERTY].name,
    modelDefinitions[ModelId.GAB_AI_ARYA].name,
    modelDefinitions[ModelId.VENICE_UNCENSORED].name,
  ],
} as const;

/**
 * Returns true if the model natively accepts the given input modality.
 */
export function hasNativeInput(
  model: ModelOption,
  modality: Modality,
): boolean {
  return model.inputs.includes(modality);
}

/**
 * Returns true if the model natively produces the given output modality.
 */
export function hasNativeOutput(
  model: ModelOption,
  modality: Modality,
): boolean {
  return model.outputs.includes(modality);
}
