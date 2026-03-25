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
import { ModelUtility, type ModelUtilityValue } from "./enum";

/**
 * Model Features - Binary capabilities
 */
export interface ModelFeatures {
  imageInput: boolean;
  pdfInput: boolean;
  imageOutput: boolean;
  audioOutput: boolean;
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
  GEMINI_3_PRO = "gemini-3-pro",
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
  SEEDREAM_4_5 = "seedream-4.5",

  // Music generation models
  MUSICGEN_STEREO = "musicgen-stereo",
  STABLE_AUDIO = "stable-audio",
  UDIO_V2 = "udio-v2",
}

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
export type ModelProviderConfig =
  | ModelProviderConfigTokenBased
  | ModelProviderConfigCreditBased
  | ModelProviderConfigImageBased
  | ModelProviderConfigVideoBased
  | ModelProviderConfigAudioBased;

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
  /** Discriminant: determines routing and UI mode. Defaults to "text". */
  modelType?: ModelType;
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
  /** Discriminant: "text" (default), "image", or "video" */
  modelType: ModelType;
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

export type ModelOption =
  | ModelOptionTokenBased
  | ModelOptionCreditBased
  | ModelOptionImageBased
  | ModelOptionVideoBased
  | ModelOptionAudioBased;

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
};

// Default features for models without specific features
const defaultFeatures: ModelFeatures = {
  imageInput: false,
  pdfInput: false,
  imageOutput: false,
  audioOutput: false,
  streaming: true,
  toolCalling: false,
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
    providers: [
      {
        id: ModelId.CLAUDE_HAIKU_4_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-haiku-4.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 1,
        outputTokenCost: 5,
        cacheReadTokenCost: 0.1,
        cacheWriteTokenCost: 1.25,
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
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.CLAUDE_OPUS_4_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-opus-4.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 5,
        outputTokenCost: 25,
        cacheReadTokenCost: 0.5,
        cacheWriteTokenCost: 6.25,
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
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.CLAUDE_OPUS_4_6,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-opus-4.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 5,
        outputTokenCost: 25,
        cacheReadTokenCost: 0.5,
        cacheWriteTokenCost: 6.25,
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
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.CLAUDE_SONNET_4_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-sonnet-4.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 3,
        outputTokenCost: 15,
        cacheReadTokenCost: 0.3,
        cacheWriteTokenCost: 3.75,
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
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.CLAUDE_SONNET_4_6,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-sonnet-4.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 3,
        outputTokenCost: 15,
        cacheReadTokenCost: 0.3,
        cacheWriteTokenCost: 3.75,
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
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GROK_4,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "x-ai/grok-4",
        creditCost: calculateCreditCost,
        inputTokenCost: 3,
        outputTokenCost: 15,
        cacheReadTokenCost: 0.75,
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
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GROK_4_FAST,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "x-ai/grok-4-fast",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.2,
        outputTokenCost: 0.5,
        cacheReadTokenCost: 0.05,
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GROK_4_20_BETA,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "x-ai/grok-4.20-beta",
        creditCost: calculateCreditCost,
        inputTokenCost: 2,
        outputTokenCost: 6,
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
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GTP_5_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 15,
        outputTokenCost: 120,
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.SMART],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GPT_5_4_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.4-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 30,
        outputTokenCost: 180,
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
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GPT_5_2_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.2-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 21,
        outputTokenCost: 168,
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
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GPT_5_CODEX,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5-codex",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25,
        outputTokenCost: 10,
        cacheReadTokenCost: 0.13,
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CODING],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GPT_5_3_CODEX,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.3-codex",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.75,
        outputTokenCost: 14,
        cacheReadTokenCost: 0.18,
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
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GPT_5_1_CODEX,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.1-codex",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25,
        outputTokenCost: 10,
        cacheReadTokenCost: 0.13,
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
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GPT_5_1,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.1",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25,
        outputTokenCost: 10,
        cacheReadTokenCost: 0.13,
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.SMART],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GPT_5_4,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.4",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.5,
        outputTokenCost: 15,
        cacheReadTokenCost: 0.25,
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
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GPT_5_4_MINI,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.4-mini",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.75,
        outputTokenCost: 4.5,
      },
    ],

    utilities: [ModelUtility.SMART, ModelUtility.CODING, ModelUtility.CHAT],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GPT_5_4_NANO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.4-nano",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.2,
        outputTokenCost: 1.25,
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GPT_5_2,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.2",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.75,
        outputTokenCost: 14,
        cacheReadTokenCost: 0.18,
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
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GPT_5_3_CHAT,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.3-chat",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.75,
        outputTokenCost: 14,
        cacheReadTokenCost: 0.18,
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST, ModelUtility.SMART],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GPT_5_2_CHAT,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.2-chat",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.75,
        outputTokenCost: 14,
        cacheReadTokenCost: 0.18,
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
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GPT_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25,
        outputTokenCost: 10,
        cacheReadTokenCost: 0.13,
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.SMART, ModelUtility.CHAT],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GPT_5_MINI,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5-mini",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.25,
        outputTokenCost: 2,
        cacheReadTokenCost: 0.03,
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GPT_5_NANO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5-nano",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.05,
        outputTokenCost: 0.4,
        cacheReadTokenCost: 0.01,
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GPT_OSS_120B,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-oss-120b",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.04,
        outputTokenCost: 0.19,
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
    providers: [
      {
        id: ModelId.KIMI_K2_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "moonshotai/kimi-k2.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.45,
        outputTokenCost: 2.2,
        cacheReadTokenCost: 0.22,
      },
    ],

    utilities: [
      ModelUtility.SMART,
      ModelUtility.FAST,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.CREATIVE,
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
    providers: [
      {
        id: ModelId.KIMI_K2,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "moonshotai/kimi-k2-0905",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.4,
        outputTokenCost: 2,
        cacheReadTokenCost: 0.15,
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
    providers: [
      {
        id: ModelId.KIMI_K2_THINKING,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "moonshotai/kimi-k2-thinking",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.47,
        outputTokenCost: 2,
        cacheReadTokenCost: 0.14,
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
    contextWindow: 202752,
    icon: "si-zendesk",
    providers: [
      {
        id: ModelId.GLM_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.8,
        outputTokenCost: 2.56,
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
    providers: [
      {
        id: ModelId.GLM_5_TURBO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-5-turbo",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.96,
        outputTokenCost: 3.2,
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
    providers: [
      {
        id: ModelId.GLM_4_7,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-4.7",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.38,
        outputTokenCost: 1.98,
        cacheReadTokenCost: 0.19,
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
    providers: [
      {
        id: ModelId.GLM_4_7_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-4.7-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.06,
        outputTokenCost: 0.4,
        cacheReadTokenCost: 0.01,
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
    providers: [
      {
        id: ModelId.GLM_4_5_AIR,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-4.5-air",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.13,
        outputTokenCost: 0.85,
        cacheReadTokenCost: 0.03,
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
    providers: [
      {
        id: ModelId.GLM_4_6,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-4.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.39,
        outputTokenCost: 1.9,
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
    providers: [
      {
        id: ModelId.GLM_4_5V,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-4.5v",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.6,
        outputTokenCost: 1.8,
        cacheReadTokenCost: 0.11,
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.VISION, ModelUtility.CHAT],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, imageInput: true, toolCalling: true },
  },
  [ModelId.MINIMAX_M2_7]: {
    name: "MiniMax M2.7",
    by: "miniMax",
    description: "chat.models.descriptions.minimaxM27",
    parameterCount: undefined,
    contextWindow: 204800,
    icon: "si-minimax",
    providers: [
      {
        id: ModelId.MINIMAX_M2_7,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "minimax/minimax-m2.7",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.3,
        outputTokenCost: 1.2,
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
    providers: [
      {
        id: ModelId.MIMO_V2_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "xiaomi/mimo-v2-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 1,
        outputTokenCost: 3,
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
    providers: [
      {
        id: ModelId.GEMINI_2_5_FLASH_LITE,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-2.5-flash-lite",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.1,
        outputTokenCost: 0.4,
        cacheReadTokenCost: 0.01,
        cacheWriteTokenCost: 0.08,
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GEMINI_2_5_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-2.5-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.3,
        outputTokenCost: 2.5,
        cacheReadTokenCost: 0.03,
        cacheWriteTokenCost: 0.08,
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GEMINI_2_5_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-2.5-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25,
        outputTokenCost: 10,
        cacheReadTokenCost: 0.13,
        cacheWriteTokenCost: 0.38,
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.SMART],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GEMINI_3_1_PRO_PREVIEW_CUSTOM_TOOLS,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3.1-pro-preview-customtools",
        creditCost: calculateCreditCost,
        inputTokenCost: 2,
        outputTokenCost: 12,
        cacheReadTokenCost: 0.2,
        cacheWriteTokenCost: 0.38,
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
      imageInput: true,
      pdfInput: true,
      toolCalling: true,
    },
  },
  [ModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW]: {
    name: "Gemini 3.1 Flash Image Preview",
    by: "google",
    description: "chat.models.descriptions.gemini31FlashImagePreview",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    providers: [
      {
        id: ModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3.1-flash-image-preview",
        creditCostPerImage: 8, // updated by media-prices updater
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
      imageInput: true,
      imageOutput: true,
    },
    modelType: "image",
  },
  [ModelId.GEMINI_3_1_FLASH_LITE_PREVIEW]: {
    name: "Gemini 3.1 Flash Lite Preview",
    by: "google",
    description: "chat.models.descriptions.gemini31FlashLitePreview",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    providers: [
      {
        id: ModelId.GEMINI_3_1_FLASH_LITE_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3.1-flash-lite-preview",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.25,
        outputTokenCost: 1.5,
        cacheReadTokenCost: 0.03,
        cacheWriteTokenCost: 0.08,
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST, ModelUtility.ANALYSIS],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      imageInput: true,
      pdfInput: true,
      toolCalling: true,
    },
  },
  [ModelId.GEMINI_3_PRO]: {
    name: "Gemini 3 Pro",
    by: "google",
    description: "chat.models.descriptions.gemini3Pro",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    providers: [
      {
        id: ModelId.GEMINI_3_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3-pro-preview",
        creditCost: calculateCreditCost,
        inputTokenCost: 2,
        outputTokenCost: 12,
        cacheReadTokenCost: 0.2,
        cacheWriteTokenCost: 0.38,
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
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
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.GEMINI_3_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3-flash-preview",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.5,
        outputTokenCost: 3,
        cacheReadTokenCost: 0.05,
        cacheWriteTokenCost: 0.08,
      },
    ],

    utilities: [ModelUtility.SMART, ModelUtility.CODING, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      imageInput: true,
      pdfInput: true,
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
    providers: [
      {
        id: ModelId.DEEPSEEK_V32,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "deepseek/deepseek-v3.2",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.25,
        outputTokenCost: 0.4,
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
    providers: [
      {
        id: ModelId.DEEPSEEK_V31,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "deepseek/deepseek-chat-v3.1",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.15,
        outputTokenCost: 0.75,
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
    providers: [
      {
        id: ModelId.DEEPSEEK_R1,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "deepseek/deepseek-r1-0528",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.45,
        outputTokenCost: 2.15,
        cacheReadTokenCost: 0.22,
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
    providers: [
      {
        id: ModelId.QWEN3_235B_FREE,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "qwen/qwen3-235b-a22b",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.45,
        outputTokenCost: 1.82,
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
    providers: [
      {
        id: ModelId.DEEPSEEK_R1_DISTILL,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "deepseek/deepseek-r1-distill-qwen-32b",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.29,
        outputTokenCost: 0.29,
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
    providers: [
      {
        id: ModelId.QWEN_2_5_7B,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "qwen/qwen-2.5-7b-instruct",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.04,
        outputTokenCost: 0.1,
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
    providers: [
      {
        id: ModelId.DALL_E_3,
        apiProvider: ApiProvider.OPENAI_IMAGES,
        providerModel: "dall-e-3",
        creditCostPerImage: 4, // updated by media-prices updater
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
      imageOutput: true,
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
    providers: [
      {
        id: ModelId.GPT_IMAGE_1,
        apiProvider: ApiProvider.OPENAI_IMAGES,
        providerModel: "gpt-image-1",
        creditCostPerImage: 2,
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
      imageOutput: true,
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
    providers: [
      {
        id: ModelId.FLUX_SCHNELL,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "black-forest-labs/flux-schnell",
        creditCostPerImage: 1, // updated by media-prices updater
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
      imageOutput: true,
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
    providers: [
      {
        id: ModelId.FLUX_PRO,
        apiProvider: ApiProvider.REPLICATE,
        providerModel: "black-forest-labs/flux-1.1-pro",
        creditCostPerImage: 4, // $0.04 + 30% markup
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
      imageOutput: true,
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
    providers: [
      {
        id: ModelId.SDXL,
        apiProvider: ApiProvider.REPLICATE,
        providerModel: "stability-ai/sdxl",
        creditCostPerImage: 0.44, // ~$0.0044/image (p50) + 30% markup
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
      imageOutput: true,
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
    providers: [
      {
        id: ModelId.FLUX_2_MAX,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "black-forest-labs/flux.2-max",
        creditCostPerImage: 9, // ~$0.07/MP first + $0.03/MP subsequent + 30% markup
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
      imageOutput: true,
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
    providers: [
      {
        id: ModelId.FLUX_2_KLEIN_4B,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "black-forest-labs/flux.2-klein-4b",
        creditCostPerImage: 2, // $0.014/MP first + $0.001/MP subsequent + 30% markup
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
      imageOutput: true,
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
    providers: [
      {
        id: ModelId.RIVERFLOW_V2_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "sourceful/riverflow-v2-pro",
        creditCostPerImage: 20, // $0.15/image + 30% markup
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
      imageOutput: true,
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
    providers: [
      {
        id: ModelId.RIVERFLOW_V2_FAST,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "sourceful/riverflow-v2-fast",
        creditCostPerImage: 3, // $0.02/image + 30% markup
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
      imageOutput: true,
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
    providers: [
      {
        id: ModelId.RIVERFLOW_V2_MAX_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "sourceful/riverflow-v2-max-preview",
        creditCostPerImage: 10, // $0.075/image + 30% markup
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
      imageOutput: true,
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
    providers: [
      {
        id: ModelId.RIVERFLOW_V2_STANDARD_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "sourceful/riverflow-v2-standard-preview",
        creditCostPerImage: 5, // $0.035/image + 30% markup
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
      imageOutput: true,
    },
  },
  [ModelId.SEEDREAM_4_5]: {
    name: "Seedream 4.5",
    by: "byteDanceSeed",
    description: "chat.models.descriptions.seedream45",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    modelType: "image",
    providers: [
      {
        id: ModelId.SEEDREAM_4_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "bytedance-seed/seedream-4.5",
        creditCostPerImage: 5, // $0.04/image + 30% markup
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
      imageOutput: true,
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
    providers: [
      {
        id: ModelId.MUSICGEN_STEREO,
        apiProvider: ApiProvider.REPLICATE,
        providerModel: "meta/musicgen",
        creditCostPerClip: 5.3999999999999995, // $0.054/8s clip (p50) + 30% markup
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
      audioOutput: true,
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
    providers: [
      {
        id: ModelId.STABLE_AUDIO,
        apiProvider: ApiProvider.REPLICATE,
        providerModel: "stability-ai/stable-audio",
        creditCostPerClip: 26, // ~$0.02 + 30% markup
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
      audioOutput: true,
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
    providers: [
      {
        id: ModelId.UDIO_V2,
        apiProvider: ApiProvider.FAL_AI,
        providerModel: "fal-ai/udio",
        creditCostPerClip: 5, // ~$0.04 + 30% markup
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
      audioOutput: true,
    },
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
      } else if ("creditCostPerSecond" in provider) {
        result[provider.id] = {
          ...base,
          creditCostPerSecond: provider.creditCostPerSecond,
          defaultDurationSeconds: provider.defaultDurationSeconds,
        } as ModelOptionVideoBased;
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

/**
 * Default token counts for credit cost estimation
 */
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
    return modelOption.creditCostPerImage * (1 + STANDARD_MARKUP_PERCENTAGE);
  }
  if ("creditCostPerClip" in modelOption) {
    return modelOption.creditCostPerClip * (1 + STANDARD_MARKUP_PERCENTAGE);
  }
  if ("creditCostPerSecond" in modelOption) {
    return (
      modelOption.creditCostPerSecond *
      modelOption.defaultDurationSeconds *
      (1 + STANDARD_MARKUP_PERCENTAGE)
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
 * Total number of AI models available (conceptual models, not provider variants)
 */
export const TOTAL_MODEL_COUNT = Object.keys(modelDefinitions).length;

/**
 * Total number of pre-built AI characters/personas.
 * 2 companions + 7 coding + 10 creative + 4 education
 * + 6 analysis + 16 assistant + 1 roleplay + 6 controversial = 52
 */
export const TOTAL_CHARACTER_COUNT = 52;

/**
 * Featured models by category for use in marketing content, emails, etc.
 */
export const FEATURED_MODELS = {
  // Representative picks per category - used in marketing content and emails
  mainstream: [
    modelDefinitions[ModelId.CLAUDE_OPUS_4_6].name,
    modelDefinitions[ModelId.GPT_5_2_PRO].name,
    modelDefinitions[ModelId.GEMINI_3_PRO].name,
    modelDefinitions[ModelId.GROK_4].name,
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
