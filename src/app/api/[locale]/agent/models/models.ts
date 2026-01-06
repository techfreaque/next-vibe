import type { IconKey } from "@/app/api/[locale]/system/unified-interface/react/icons";
import type { TranslationKey } from "@/i18n/core/static-types";

import {
  ContentLevel,
  type ContentLevelValue,
  IntelligenceLevel,
  type IntelligenceLevelValue,
  SpeedLevel,
  type SpeedLevelValue,
} from "../chat/favorites/enum";
import { ModelUtility, type ModelUtilityValue } from "./enum";

/**
 * Model Features - Binary capabilities
 */
export interface ModelFeatures {
  imageInput: boolean;
  pdfInput: boolean;
  imageOutput: boolean;
  streaming: boolean;
  toolCalling: boolean;
}

/**
 * Available AI model identifiers for the chat system.
 * Each model has different pricing, capabilities, and context windows.
 */
export enum ModelId {
  CLAUDE_SONNET_4_5 = "claude-sonnet-4.5",
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
  GEMINI_3_PRO = "gemini-3-pro",
  GEMINI_2_5_PRO = "gemini-2.5-pro",
  GEMINI_2_5_FLASH = "gemini-2.5-flash",
  GEMINI_2_5_FLASH_LITE = "gemini-2.5-flash-lite",
  // MISTRAL_NEMO = "mistral-nemo",
  DEEPSEEK_R1_DISTILL = "deepseek-r1-distill",
  QWEN_2_5_7B = "qwen-2-5-7b",
  KIMI_K2 = "kimi-k2",
  KIMI_K2_THINKING = "kimi-k2-thinking",
  DEEPSEEK_V32 = "deepseek-v3.2",
  DEEPSEEK_V31 = "deepseek-v3.1",
  DEEPSEEK_R1 = "deepseek-r1",
  QWEN3_235B_FREE = "qwen3_235b-free",
  GPT_OSS_120B = "gpt-oss-120b-free",
  GROK_4_FAST = "grok-4-fast",
  GROK_4 = "grok-4",
  UNCENSORED_LM_V1_2 = "uncensored-lm-v1.2",
  CLAUDE_HAIKU_4_5 = "claude-haiku-4.5",
  GLM_4_6 = "glm-4.6",
  GLM_4_5_AIR = "glm-4.5-air",
  GLM_4_5V = "glm-4.5v",
  VENICE_UNCENSORED = "venice-uncensored-free",
  DOLPHIN_3_0_MISTRAL_24B = "dolphin-3.0-mistral-24b",
  DOLPHIN_LLAMA_3_70B = "dolphin-llama-3.70b",
  DOLPHIN_3_0_R1_MISTRAL_24B = "dolphin-3.0-r1-mistral-24b",
  FREEDOMGPT_LIBERTY = "freedomgpt-liberty",
  GAB_AI_ARYA = "gab-ai-arya",
}

/**
 * API Provider enum - determines which API to use for the model
 */
export enum ApiProvider {
  OPENROUTER = "openrouter",
  GAB_AI = "gab-ai",
  FREEDOMGPT = "freedomgpt",
  UNCENSORED_AI = "uncensored-ai",
}

/**
 * Configuration interface for AI model options.
 * Contains all necessary information for model selection and API integration.
 */
export interface ModelOption {
  /** Unique identifier for the model */
  id: ModelId;
  /** Human-readable display name */
  name: string;
  /** AI provider company name */
  provider: ModelProviderId;
  /** API provider to use for requests */
  apiProvider: ApiProvider;
  /** Brief description of model capabilities */
  description: TranslationKey;
  /** Number of parameters in billions */
  parameterCount: number | undefined;
  /** Maximum context window size in tokens */
  contextWindow: number;
  /** Icon key from ICON_REGISTRY for UI display */
  icon: IconKey;
  /** OpenRouter API model identifier */
  openRouterModel: string;
  /** Credit cost per message (0 = free) */
  creditCost: number;
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
    icon: "shield-off",
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
  cognitiveComputations: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Cognitive Computations",
    icon: "ocean",
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
};

// Default features for models without specific features
const defaultFeatures: ModelFeatures = {
  imageInput: false,
  pdfInput: false,
  imageOutput: false,
  streaming: true,
  toolCalling: false,
};

// Model names and icons are technical identifiers that should not be translated
/* eslint-disable i18next/no-literal-string */
export const modelOptions: Record<ModelId, ModelOption> = {
  [ModelId.UNCENSORED_LM_V1_2]: {
    id: ModelId.UNCENSORED_LM_V1_2,
    name: "UncensoredLM v1.2",
    provider: "uncensoredAI",
    apiProvider: ApiProvider.UNCENSORED_AI,
    description: "app.api.agent.chat.models.descriptions.uncensoredLmV11",
    parameterCount: undefined,
    contextWindow: 32768,
    icon: "shield-off",
    openRouterModel: "uncensored-lm",
    creditCost: 5,
    utilities: [
      ModelUtility.UNCENSORED,
      ModelUtility.CREATIVE,
      ModelUtility.SMART,
      ModelUtility.ROLEPLAY,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.CODING],
  },
  [ModelId.FREEDOMGPT_LIBERTY]: {
    id: ModelId.FREEDOMGPT_LIBERTY,
    name: "FreedomGPT Liberty",
    provider: "freedomGPT",
    apiProvider: ApiProvider.FREEDOMGPT,
    description: "app.chat.models.descriptions.freedomgptLiberty",
    parameterCount: undefined,
    contextWindow: 32768,
    icon: "freedom-gpt-logo",
    openRouterModel: "freedomgpt-liberty",
    creditCost: 3,
    utilities: [
      ModelUtility.UNCENSORED,
      ModelUtility.CREATIVE,
      ModelUtility.CHAT,
      ModelUtility.ROLEPLAY,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures },
    weaknesses: [ModelUtility.CODING, ModelUtility.ANALYSIS],
  },
  [ModelId.GAB_AI_ARYA]: {
    id: ModelId.GAB_AI_ARYA,
    name: "Gab AI Arya",
    provider: "gabAI",
    apiProvider: ApiProvider.GAB_AI,
    description: "app.chat.models.descriptions.gabAiArya",
    parameterCount: undefined,
    contextWindow: 8192,
    icon: "gab-ai-logo",
    openRouterModel: "arya",
    creditCost: 5,
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
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures },
  },
  [ModelId.VENICE_UNCENSORED]: {
    id: ModelId.VENICE_UNCENSORED,
    name: "Venice Uncensored",
    provider: "cognitiveComputations",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.veniceUncensored",
    parameterCount: 24,
    contextWindow: 32768,
    icon: "ocean",
    openRouterModel: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
    creditCost: 1,
    utilities: [ModelUtility.UNCENSORED, ModelUtility.CREATIVE, ModelUtility.ROLEPLAY],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures },
    weaknesses: [ModelUtility.CODING, ModelUtility.ANALYSIS],
  },
  [ModelId.DOLPHIN_LLAMA_3_70B]: {
    id: ModelId.DOLPHIN_LLAMA_3_70B,
    name: "Dolphin Llama 3 70B",
    provider: "cognitiveComputations",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.dolphinLlama3_70B",
    parameterCount: 70,
    contextWindow: 8192,
    icon: "ocean",
    openRouterModel: "cognitivecomputations/dolphin-llama-3-70b",
    creditCost: 1,
    utilities: [ModelUtility.FAST, ModelUtility.CHAT],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures },
    weaknesses: [ModelUtility.CODING, ModelUtility.ANALYSIS],
  },
  [ModelId.DOLPHIN_3_0_R1_MISTRAL_24B]: {
    id: ModelId.DOLPHIN_3_0_R1_MISTRAL_24B,
    name: "Dolphin 3.0 R1 Mistral 24B",
    provider: "cognitiveComputations",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.dolphin3_0_r1_mistral_24b",
    parameterCount: 24,
    contextWindow: 32768,
    icon: "ocean",
    openRouterModel: "cognitivecomputations/dolphin3.0-r1-mistral-24b",
    creditCost: 1,
    utilities: [ModelUtility.FAST, ModelUtility.REASONING],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures },
    weaknesses: [ModelUtility.CODING],
  },
  [ModelId.DOLPHIN_3_0_MISTRAL_24B]: {
    id: ModelId.DOLPHIN_3_0_MISTRAL_24B,
    name: "Dolphin 3.0 Mistral 24B",
    provider: "cognitiveComputations",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.mistralNemo",
    parameterCount: 24,
    contextWindow: 32768,
    icon: "ocean",
    openRouterModel: "cognitivecomputations/dolphin3.0-mistral-24b:free",
    creditCost: 1,
    utilities: [ModelUtility.FAST, ModelUtility.CHAT],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures },
    weaknesses: [ModelUtility.CODING, ModelUtility.ANALYSIS],
  },
  [ModelId.GLM_4_5_AIR]: {
    id: ModelId.GLM_4_5_AIR,
    name: "GLM 4.5 AIR",
    provider: "zAi",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.glm45Air",
    parameterCount: undefined,
    contextWindow: 203000,
    icon: "si-zendesk",
    openRouterModel: "z-ai/glm-4.5-air",
    creditCost: 1,
    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.GLM_4_6]: {
    id: ModelId.GLM_4_6,
    name: "GLM 4.6",
    provider: "zAi",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.glm46",
    parameterCount: undefined,
    contextWindow: 203000,
    icon: "si-zendesk",
    openRouterModel: "z-ai/glm-4.6",
    creditCost: 5,
    utilities: [ModelUtility.SMART, ModelUtility.CHAT, ModelUtility.ANALYSIS],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.GLM_4_5V]: {
    id: ModelId.GLM_4_5V,
    name: "GLM 4.5v",
    provider: "zAi",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.glm45v",
    parameterCount: 106,
    contextWindow: 203000,
    icon: "si-zendesk",
    openRouterModel: "z-ai/glm-4.5v",
    creditCost: 1,
    utilities: [ModelUtility.VISION, ModelUtility.CHAT],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, imageInput: true, toolCalling: true },
  },
  [ModelId.CLAUDE_HAIKU_4_5]: {
    id: ModelId.CLAUDE_HAIKU_4_5,
    name: "Claude Haiku 4.5",
    provider: "anthropic",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.claudeHaiku45",
    parameterCount: undefined,
    contextWindow: 200000,
    icon: "si-anthropic",
    openRouterModel: "anthropic/claude-haiku-4.5",
    creditCost: 3,
    utilities: [ModelUtility.CHAT, ModelUtility.FAST, ModelUtility.CODING, ModelUtility.VISION],
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
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },
  [ModelId.CLAUDE_SONNET_4_5]: {
    id: ModelId.CLAUDE_SONNET_4_5,
    name: "Claude Sonnet 4.5",
    provider: "anthropic",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.claudeSonnet45",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    openRouterModel: "anthropic/claude-sonnet-4.5",
    creditCost: 10,
    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.CREATIVE,
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
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },
  [ModelId.GTP_5_PRO]: {
    id: ModelId.GTP_5_PRO,
    name: "GPT-5 Pro",
    provider: "openAI",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.gpt5Pro",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    openRouterModel: "openai/gpt-5-pro",
    creditCost: 20,
    utilities: [ModelUtility.LEGACY, ModelUtility.SMART],
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
    id: ModelId.GPT_5_2_PRO,
    name: "GPT-5.2 Pro",
    provider: "openAI",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.gpt52Pro",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    openRouterModel: "openai/gpt-5.2-pro",
    creditCost: 30,
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
  [ModelId.GPT_5_CODEX]: {
    id: ModelId.GPT_5_CODEX,
    name: "GPT-5 Codex",
    provider: "openAI",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.gpt5Codex",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    openRouterModel: "openai/gpt-5-codex",
    creditCost: 10,
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
  [ModelId.GPT_5_1_CODEX]: {
    id: ModelId.GPT_5_1_CODEX,
    name: "GPT 5.1 Codex",
    provider: "openAI",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.gpt51Codex",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    openRouterModel: "openai/gpt-5.1-codex",
    creditCost: 10,
    utilities: [ModelUtility.SMART, ModelUtility.CODING, ModelUtility.CREATIVE],
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
    id: ModelId.GPT_5_1,
    name: "GPT 5.1",
    provider: "openAI",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.gpt51",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    openRouterModel: "openai/gpt-5.1",
    creditCost: 10,
    utilities: [ModelUtility.LEGACY, ModelUtility.SMART],
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
  [ModelId.GPT_5_2]: {
    id: ModelId.GPT_5_2,
    name: "GPT 5.2",
    provider: "openAI",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.gpt52",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    openRouterModel: "openai/gpt-5.2",
    utilities: [ModelUtility.SMART, ModelUtility.CODING, ModelUtility.CREATIVE],
    creditCost: 10,
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
  [ModelId.GPT_5_2_CHAT]: {
    id: ModelId.GPT_5_2_CHAT,
    name: "GPT 5.2 Chat",
    provider: "openAI",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.gpt52_chat",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    openRouterModel: "openai/gpt-5.2-chat",
    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.CREATIVE,
      ModelUtility.FAST,
      ModelUtility.CHAT,
    ],
    creditCost: 10,
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
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
    id: ModelId.GPT_5,
    name: "GPT-5",
    provider: "openAI",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.gpt5",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    openRouterModel: "openai/gpt-5",
    creditCost: 10,
    utilities: [ModelUtility.LEGACY, ModelUtility.SMART, ModelUtility.CHAT],
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
  [ModelId.GPT_5_MINI]: {
    id: ModelId.GPT_5_MINI,
    name: "GPT-5 Mini",
    provider: "openAI",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.gpt5Mini",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    openRouterModel: "openai/gpt-5-mini",
    creditCost: 3,
    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
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
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.ANALYSIS],
  },
  [ModelId.GPT_5_NANO]: {
    id: ModelId.GPT_5_NANO,
    name: "GPT-5 Nano",
    provider: "openAI",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.gpt5Nano",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    openRouterModel: "openai/gpt-5-nano",
    creditCost: 2,
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
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.ANALYSIS, ModelUtility.CODING],
  },
  [ModelId.GPT_OSS_120B]: {
    id: ModelId.GPT_OSS_120B,
    name: "GPT-OSS 120B",
    provider: "openAI",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.gptOss120b",
    parameterCount: 117,
    contextWindow: 33000,
    icon: "si-openai",
    openRouterModel: "openai/gpt-oss-120b",
    creditCost: 1,
    utilities: [ModelUtility.CHAT, ModelUtility.CODING],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.KIMI_K2]: {
    id: ModelId.KIMI_K2,
    name: "Kimi K2",
    provider: "moonshotAI",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.kimiK2",
    parameterCount: 1000,
    contextWindow: 256000,
    creditCost: 4,
    utilities: [
      ModelUtility.SMART,
      ModelUtility.FAST,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.CREATIVE,
    ],
    icon: "moon",
    openRouterModel: "moonshotai/kimi-k2-0905",
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.KIMI_K2_THINKING]: {
    id: ModelId.KIMI_K2_THINKING,
    name: "Kimi K2 Thinking",
    provider: "moonshotAI",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.kimiK2Thinking",
    parameterCount: 1000,
    contextWindow: 256000,
    creditCost: 8,
    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.CREATIVE,
      ModelUtility.REASONING,
    ],
    icon: "moon",
    openRouterModel: "moonshotai/kimi-k2-thinking",
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.GEMINI_2_5_FLASH_LITE]: {
    id: ModelId.GEMINI_2_5_FLASH_LITE,
    name: "Gemini 2.5 Flash Lite",
    provider: "google",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.geminiFlash25Lite",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-googlegemini",
    openRouterModel: "google/gemini-2.5-flash-lite",
    creditCost: 1,
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
  },
  [ModelId.GEMINI_2_5_FLASH]: {
    id: ModelId.GEMINI_2_5_FLASH,
    name: "Gemini 2.5 Flash",
    provider: "google",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.geminiFlash25Flash",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-googlegemini",
    openRouterModel: "google/gemini-2.5-flash",
    creditCost: 2,
    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
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
  [ModelId.GEMINI_2_5_PRO]: {
    id: ModelId.GEMINI_2_5_PRO,
    name: "Gemini 2.5 Flash Pro",
    provider: "google",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.geminiFlash25Pro",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-googlegemini",
    openRouterModel: "google/gemini-2.5-flash-pro",
    creditCost: 10,
    utilities: [ModelUtility.LEGACY, ModelUtility.SMART],
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
  [ModelId.GEMINI_3_PRO]: {
    id: ModelId.GEMINI_3_PRO,
    name: "Gemini 3 Pro",
    provider: "google",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.api.agent.chat.models.descriptions.gemini3Pro",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    openRouterModel: "google/gemini-3-pro-preview",
    creditCost: 15,
    utilities: [ModelUtility.SMART, ModelUtility.CODING, ModelUtility.REASONING],
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
  // [ModelId.MISTRAL_NEMO]: {
  //   id: ModelId.MISTRAL_NEMO,
  //   name: "Mistral Nemo",
  //   provider: "mistralAI",
  //   apiProvider: ApiProvider.OPENROUTER,
  //   description: "app.chat.models.descriptions.mistralNemo",
  //   parameterCount: 12,
  //   contextWindow: 131072,
  //   icon: "si-mistralai",
  //   openRouterModel: "mistralai/mistral-nemo:free",
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
    id: ModelId.DEEPSEEK_V32,
    name: "DeepSeek V3.2",
    provider: "deepSeek",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.api.agent.chat.models.descriptions.deepseekV32",
    parameterCount: 671,
    contextWindow: 163840,
    icon: "whale",
    openRouterModel: "deepseek/deepseek-v3.2",
    creditCost: 10,
    utilities: [ModelUtility.SMART, ModelUtility.CODING, ModelUtility.ANALYSIS],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.DEEPSEEK_V31]: {
    id: ModelId.DEEPSEEK_V31,
    name: "DeepSeek V3.1",
    provider: "deepSeek",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.deepseekV31",
    parameterCount: 671,
    contextWindow: 164000,
    icon: "whale",
    openRouterModel: "deepseek/deepseek-chat-v3.1",
    creditCost: 10,
    utilities: [ModelUtility.LEGACY, ModelUtility.SMART, ModelUtility.CODING],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.DEEPSEEK_R1]: {
    id: ModelId.DEEPSEEK_R1,
    name: "DeepSeek R1",
    provider: "deepSeek",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.deepseekR1",
    parameterCount: 671,
    contextWindow: 164000,
    icon: "whale",
    openRouterModel: "deepseek/deepseek-r1-0528",
    creditCost: 10,
    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.THOROUGH,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.QWEN3_235B_FREE]: {
    id: ModelId.QWEN3_235B_FREE,
    name: "Qwen3 235B ",
    provider: "alibaba",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.qwen3235bFree",
    parameterCount: 235,
    contextWindow: 131000,
    icon: "si-alibabadotcom",
    openRouterModel: "qwen/qwen3-235b-a22b:free",
    creditCost: 0,
    utilities: [ModelUtility.SMART, ModelUtility.CODING],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.DEEPSEEK_R1_DISTILL]: {
    id: ModelId.DEEPSEEK_R1_DISTILL,
    name: "DeepSeek R1 Distill",
    provider: "deepSeek",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.deepseekR1Distill",
    parameterCount: 70,
    contextWindow: 64000,
    icon: "whale",
    openRouterModel: "deepseek/deepseek-r1-distill-qwen-32b",
    creditCost: 2,
    utilities: [ModelUtility.CODING, ModelUtility.ANALYSIS, ModelUtility.REASONING],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ModelId.QWEN_2_5_7B]: {
    id: ModelId.QWEN_2_5_7B,
    name: "Qwen 2.5 7B",
    provider: "alibaba",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.qwen257b",
    parameterCount: 7,
    contextWindow: 32768,
    icon: "si-alibabadotcom",
    openRouterModel: "qwen/qwen-2.5-7b-instruct",
    creditCost: 2,
    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ANALYSIS, ModelUtility.CODING],
  },
  [ModelId.GROK_4]: {
    id: ModelId.GROK_4,
    name: "Grok 4",
    provider: "xAI",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.grok4",
    parameterCount: undefined,
    contextWindow: 256000,
    icon: "si-x",
    openRouterModel: "x-ai/grok-4",
    creditCost: 10,
    utilities: [ModelUtility.SMART, ModelUtility.CODING, ModelUtility.ANALYSIS],
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
  [ModelId.GROK_4_FAST]: {
    id: ModelId.GROK_4_FAST,
    name: "Grok 4 Fast",
    provider: "xAI",
    apiProvider: ApiProvider.OPENROUTER,
    description: "app.chat.models.descriptions.grok4Fast",
    parameterCount: undefined,
    contextWindow: 2000000,
    icon: "si-x",
    openRouterModel: "x-ai/grok-4-fast",
    creditCost: 2,
    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.FAST,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      imageInput: true,
      pdfInput: true,
      toolCalling: true,
    },
  },
};
/* eslint-enable i18next/no-literal-string */

/** Default model used when no specific model is selected */
export const defaultModel = ModelId.CLAUDE_HAIKU_4_5;

/**
 * Retrieves a model configuration by its ID.
 * Falls back to the default model if the requested model is not found.
 *
 * @param modelId - The model identifier to look up
 * @returns The model configuration object
 */
export function getModelById(modelId: ModelId): ModelOption {
  const foundModel = modelOptions[modelId];

  if (foundModel) {
    return foundModel;
  }

  // Fallback to default model - this should never fail as default model is in the object
  return modelOptions[defaultModel];
}

/**
 * Model ID options for SELECT fields
 */
export const ModelIdOptions = Object.values(modelOptions).map((model) => ({
  value: model.id,
  label: model.name as TranslationKey,
}));

/**
 * Get credit cost for a specific model
 * @param modelId - The model identifier
 * @returns Credit cost (defaults to 1 if model not found)
 */
export function getModelCost(modelId: ModelId | string): number {
  try {
    const model = getModelById(modelId as ModelId);
    return model.creditCost;
  } catch {
    // Fallback to 1 credit if model not found
    return 1;
  }
}
