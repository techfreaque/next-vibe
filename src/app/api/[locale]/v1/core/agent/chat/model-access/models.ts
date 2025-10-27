import {
  SiAlibabadotcom,
  SiAnthropic,
  SiGooglegemini,
  SiMistralai,
  SiOpenai,
  SiX,
  SiZendesk,
} from "@icons-pack/react-simple-icons";
import { MoonIcon, ShieldOffIcon } from "lucide-react";

import type { TranslationKey } from "@/i18n/core/static-types";

import type { IconValue } from "./icons";
import { ModelUtility } from "./model-utilities";

/**
 * Available AI model identifiers for the chat system.
 * Each model has different pricing, capabilities, and context windows.
 */
export enum ModelId {
  CLAUDE_SONNET_4_5 = "claude-sonnet-4.5",
  GPT_5 = "gpt-5",
  GTP_5_PRO = "gpt-5-pro",
  GPT_5_CODEX = "gpt-5-codex",
  GPT_5_MINI = "gpt-5-mini",
  GPT_5_NANO = "gpt-5-nano",
  GEMINI_FLASH_2_5_PRO = "gemini-2.5-flash-pro",
  GEMINI_FLASH_2_5_FLASH = "gemini-2.5-flash",
  GEMINI_FLASH_2_5_LITE = "gemini-2.5-flash-lite",
  MISTRAL_NEMO = "mistral-nemo",
  DEEPSEEK_R1_DISTILL = "deepseek-r1-distill",
  QWEN_2_5_7B = "qwen-2-5-7b",
  KIMI_K2_FREE = "kimi-k2-free",
  DEEPSEEK_V31 = "deepseek-v3.1",
  DEEPSEEK_R1 = "deepseek-r1",
  QWEN3_235B_FREE = "qwen3_235b-free",
  GPT_OSS_120B = "gpt-oss-120b-free",
  GROK_4_FAST = "grok-4-fast",
  GROK_4 = "grok-4",
  UNCENSORED_LM_V1_1 = "uncensored-lm-v1.1",
  CLAUDE_HAIKU_4_5 = "claude-haiku-4.5",
  GLM_4_6 = "glm-4.6",
  GLM_4_5_AIR = "glm-4.5-air",
  GLM_4_5V = "glm-4.5v",
  VENICE_UNCENSORED = "venice-uncensored-free",
  DOLPHIN_3_0_MISTRAL_24B = "dolphin-3.0-mistral-24b",
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
  /** Brief description of model capabilities */
  description: TranslationKey;
  /** Number of parameters in billions */
  parameterCount: number | undefined;
  /** Maximum context window size in tokens */
  contextWindow: number;
  /** Icon for UI display (emoji, icon key, or React component) */
  icon: IconValue;
  /** OpenRouter API model identifier */
  openRouterModel: string;
  /** Credit cost per message (0 = free) */
  creditCost: number;
  /** Utility categories this model belongs to */
  utilities: ModelUtility[];
  /** Whether this model supports tool/function calling (for search, etc.) */
  supportsTools: boolean;
}

export interface ModelProvider {
  name: string;
  icon: IconValue;
}

export type ModelProviderId = keyof typeof modelProviders;

export const modelProviders = {
  openAI: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "OpenAI",
    icon: SiOpenai,
  },
  google: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Google",
    icon: SiGooglegemini,
  },
  mistralAI: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Mistral AI",
    icon: SiMistralai,
  },
  moonshotAI: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Moonshot AI",
    icon: MoonIcon,
  },
  deepSeek: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "DeepSeek",
    // eslint-disable-next-line i18next/no-literal-string -- Emoji icon
    icon: "🐋",
  },
  alibaba: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Alibaba",
    icon: SiAlibabadotcom,
  },
  xAI: {
    name: "X-AI",
    icon: SiX,
  },
  uncensoredAI: {
    name: "Uncensored.ai",
    icon: ShieldOffIcon,
  },
  anthropic: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Anthropic",
    icon: SiAnthropic,
  },
  zAi: {
    name: "Z.AI",
    icon: SiZendesk,
  },
  cognitiveComputations: {
    // eslint-disable-next-line i18next/no-literal-string -- Provider name is technical identifier
    name: "Cognitive Computations",
    // eslint-disable-next-line i18next/no-literal-string
    icon: "🌊",
  },
};

// Model names and icons are technical identifiers that should not be translated
/* eslint-disable i18next/no-literal-string */
export const modelOptions: ModelOption[] = [
  {
    id: ModelId.UNCENSORED_LM_V1_1,
    name: "UncensoredLM v1.1",
    provider: "uncensoredAI",
    description: "app.chat.models.descriptions.uncensoredLmV11",
    parameterCount: undefined,
    contextWindow: 32768,
    icon: ShieldOffIcon,
    openRouterModel: "uncensored-lm",
    creditCost: 5,
    utilities: [
      ModelUtility.UNCENSORED,
      ModelUtility.GENERAL,
      ModelUtility.CREATIVE,
    ],
    supportsTools: true,
  },
  {
    id: ModelId.VENICE_UNCENSORED,
    name: "Venice Uncensored",
    provider: "cognitiveComputations",
    description: "app.chat.models.descriptions.uncensoredLmV11",
    parameterCount: 24,
    contextWindow: 32768,
    icon: "🌊",
    openRouterModel:
      "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
    creditCost: 0,
    utilities: [ModelUtility.UNCENSORED, ModelUtility.CREATIVE],
    supportsTools: false, // OpenRouter reports: "No endpoints found that support tool use"
  },
  {
    id: ModelId.DOLPHIN_3_0_MISTRAL_24B,
    name: "Dolphin 3.0 Mistral 24B",
    provider: "cognitiveComputations",
    description: "app.chat.models.descriptions.mistralNemo",
    parameterCount: 24,
    contextWindow: 32768,
    icon: "🌊",
    openRouterModel: "cognitivecomputations/dolphin3.0-mistral-24b:free",
    creditCost: 0,
    utilities: [ModelUtility.FAST],
    supportsTools: false, // OpenRouter reports: "No endpoints found that support tool use"
  },
  {
    id: ModelId.GLM_4_5_AIR,
    name: "GLM 4.5 AIR",
    provider: "zAi",
    description: "app.chat.models.descriptions.glm45Air",
    parameterCount: undefined,
    contextWindow: 203000,
    icon: SiZendesk,
    openRouterModel: "z-ai/glm-4.5-air",
    creditCost: 1,
    utilities: [ModelUtility.GENERAL, ModelUtility.FAST],
    supportsTools: true,
  },
  {
    id: ModelId.GLM_4_6,
    name: "GLM 4.6",
    provider: "zAi",
    description: "app.chat.models.descriptions.glm46",
    parameterCount: undefined,
    contextWindow: 203000,
    icon: SiZendesk,
    openRouterModel: "z-ai/glm-4.6",
    creditCost: 5,
    utilities: [ModelUtility.GENERAL],
    supportsTools: true,
  },
  {
    id: ModelId.GLM_4_5V,
    name: "GLM 4.5v",
    provider: "zAi",
    description: "app.chat.models.descriptions.glm45v",
    parameterCount: 106,
    contextWindow: 203000,
    icon: SiZendesk,
    openRouterModel: "z-ai/glm-4.5v",
    creditCost: 1,
    utilities: [ModelUtility.VISION],
    supportsTools: true,
  },
  {
    id: ModelId.CLAUDE_HAIKU_4_5,
    name: "Claude Haiku 4.5",
    provider: "anthropic",
    description: "app.chat.models.descriptions.claudeHaiku45",
    parameterCount: undefined,
    contextWindow: 200000,
    icon: SiAnthropic,
    openRouterModel: "anthropic/claude-haiku-4.5",
    creditCost: 3,
    utilities: [ModelUtility.GENERAL, ModelUtility.FAST, ModelUtility.CODING],
    supportsTools: true,
  },
  {
    id: ModelId.CLAUDE_SONNET_4_5,
    name: "Claude Sonnet 4.5",
    provider: "anthropic",
    description: "app.chat.models.descriptions.claudeSonnet45",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: SiAnthropic,
    openRouterModel: "anthropic/claude-sonnet-4.5",
    creditCost: 10,
    utilities: [
      ModelUtility.GENERAL,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.CREATIVE,
    ],
    supportsTools: true,
  },
  {
    id: ModelId.GTP_5_PRO,
    name: "GPT-5 Pro",
    provider: "openAI",
    description: "app.chat.models.descriptions.gpt5Pro",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: SiOpenai,
    openRouterModel: "openai/gpt-5-pro",
    creditCost: 20, // Premium model
    utilities: [
      ModelUtility.GENERAL,
      ModelUtility.CODING,
      ModelUtility.CREATIVE,
      ModelUtility.ANALYSIS,
    ],
    supportsTools: true,
  },
  {
    id: ModelId.GPT_5_CODEX,
    name: "GPT-5 Codex",
    provider: "openAI",
    description: "app.chat.models.descriptions.gpt5Codex",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: SiOpenai,
    openRouterModel: "openai/gpt-5-codex",
    creditCost: 10, // Premium model
    utilities: [
      ModelUtility.GENERAL,
      ModelUtility.CODING,
      ModelUtility.CREATIVE,
    ],
    supportsTools: true,
  },
  {
    id: ModelId.GPT_5,
    name: "GPT-5",
    provider: "openAI",
    description: "app.chat.models.descriptions.gpt5",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: SiOpenai,
    openRouterModel: "openai/gpt-5",
    creditCost: 10, // Premium model
    utilities: [
      ModelUtility.GENERAL,
      ModelUtility.CODING,
      ModelUtility.CREATIVE,
    ],
    supportsTools: true,
  },
  {
    id: ModelId.GPT_5_MINI,
    name: "GPT-5 Mini",
    provider: "openAI",
    description: "app.chat.models.descriptions.gpt5Mini",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: SiOpenai,
    openRouterModel: "openai/gpt-5-mini",
    creditCost: 3,
    utilities: [ModelUtility.GENERAL, ModelUtility.FAST],
    supportsTools: true,
  },
  {
    id: ModelId.GPT_5_NANO,
    name: "GPT-5 Nano",
    provider: "openAI",
    description: "app.chat.models.descriptions.gpt5Nano",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: SiOpenai,
    openRouterModel: "openai/gpt-5-nano",
    creditCost: 2, // Basic model
    utilities: [ModelUtility.GENERAL, ModelUtility.FAST],
    supportsTools: true,
  },
  {
    id: ModelId.GPT_OSS_120B,
    name: "GPT-OSS 120B",
    provider: "openAI",
    description: "app.chat.models.descriptions.gptOss120b",
    parameterCount: 117,
    contextWindow: 33000,
    icon: SiOpenai,
    openRouterModel: "openai/gpt-oss-120b",
    creditCost: 1,
    utilities: [ModelUtility.GENERAL, ModelUtility.CODING],
    supportsTools: true,
  },
  {
    id: ModelId.KIMI_K2_FREE,
    name: "Kimi K2",
    provider: "moonshotAI",
    description: "app.chat.models.descriptions.kimiK2Free",
    parameterCount: 1000,
    contextWindow: 33000,
    creditCost: 0, // Free model
    utilities: [ModelUtility.GENERAL, ModelUtility.FAST],
    icon: MoonIcon,
    openRouterModel: "moonshotai/kimi-k2:free",
    supportsTools: false, // OpenRouter reports: "No endpoints found that support tool use"
  },
  {
    id: ModelId.GEMINI_FLASH_2_5_LITE,
    name: "Gemini 2.5 Flash Lite",
    provider: "google",
    description: "app.chat.models.descriptions.geminiFlash25Lite",
    parameterCount: 14.3,
    contextWindow: 1050000,
    icon: SiGooglegemini,
    openRouterModel: "google/gemini-2.5-flash-lite",
    creditCost: 1,
    utilities: [ModelUtility.GENERAL, ModelUtility.FAST],
    supportsTools: true,
  },
  {
    id: ModelId.GEMINI_FLASH_2_5_FLASH,
    name: "Gemini 2.5 Flash",
    provider: "google",
    description: "app.chat.models.descriptions.geminiFlash25Flash",
    parameterCount: 14.3,
    contextWindow: 1050000,
    icon: SiGooglegemini,
    openRouterModel: "google/gemini-2.5-flash",
    creditCost: 2,
    utilities: [ModelUtility.GENERAL],
    supportsTools: true,
  },
  {
    id: ModelId.GEMINI_FLASH_2_5_PRO,
    name: "Gemini 2.5 Flash Pro",
    provider: "google",
    description: "app.chat.models.descriptions.geminiFlash25Pro",
    parameterCount: 14.3,
    contextWindow: 1050000,
    icon: SiGooglegemini,
    openRouterModel: "google/gemini-2.5-flash-pro",
    creditCost: 10,
    utilities: [ModelUtility.GENERAL, ModelUtility.CODING],
    supportsTools: true,
  },
  {
    id: ModelId.MISTRAL_NEMO,
    name: "Mistral Nemo",
    provider: "mistralAI",
    description: "app.chat.models.descriptions.mistralNemo",
    parameterCount: 12,
    contextWindow: 131072,
    icon: SiMistralai,
    openRouterModel: "mistralai/mistral-nemo:free",
    creditCost: 0, // Free model
    utilities: [ModelUtility.GENERAL, ModelUtility.FAST],
    supportsTools: true,
  },
  {
    id: ModelId.DEEPSEEK_V31,
    name: "DeepSeek V3.1",
    provider: "deepSeek",
    description: "app.chat.models.descriptions.deepseekV31",
    parameterCount: 671,
    contextWindow: 164000,
    icon: "🐋",
    openRouterModel: "deepseek/deepseek-chat-v3.1",
    creditCost: 5,
    utilities: [ModelUtility.GENERAL, ModelUtility.CODING],
    supportsTools: true,
  },
  {
    id: ModelId.DEEPSEEK_R1,
    name: "DeepSeek R1",
    provider: "deepSeek",
    description: "app.chat.models.descriptions.deepseekR1",
    parameterCount: 671,
    contextWindow: 164000,
    icon: "🐋",
    openRouterModel: "deepseek/deepseek-r1-0528",
    creditCost: 6,
    utilities: [ModelUtility.GENERAL, ModelUtility.CODING],
    supportsTools: true,
  },

  {
    id: ModelId.QWEN3_235B_FREE,
    name: "Qwen3 235B ",
    provider: "alibaba",
    description: "app.chat.models.descriptions.qwen3235bFree",
    parameterCount: 235,
    contextWindow: 131000,
    icon: SiAlibabadotcom,
    openRouterModel: "qwen/qwen3-235b-a22b:free",
    creditCost: 0, // Free model
    utilities: [ModelUtility.GENERAL, ModelUtility.CODING],
    supportsTools: true,
  },
  {
    id: ModelId.DEEPSEEK_R1_DISTILL,
    name: "DeepSeek R1 Distill",
    provider: "deepSeek",
    description: "app.chat.models.descriptions.deepseekR1Distill",
    parameterCount: 70,
    contextWindow: 64000,
    icon: "🐋",
    openRouterModel: "deepseek/deepseek-r1-distill-qwen-32b",
    creditCost: 2, // Pro model
    utilities: [ModelUtility.CODING, ModelUtility.ANALYSIS],
    supportsTools: true,
  },
  {
    id: ModelId.QWEN_2_5_7B,
    name: "Qwen 2.5 7B",
    provider: "alibaba",
    description: "app.chat.models.descriptions.qwen257b",
    parameterCount: 7,
    contextWindow: 32768,
    icon: SiAlibabadotcom,
    openRouterModel: "qwen/qwen-2.5-7b-instruct",
    creditCost: 2, // Pro model
    utilities: [ModelUtility.GENERAL],
    supportsTools: true,
  },
  {
    id: ModelId.GROK_4,
    name: "Grok 4",
    provider: "xAI",
    description: "app.chat.models.descriptions.grok4",
    parameterCount: undefined,
    contextWindow: 256000,
    icon: SiX,
    openRouterModel: "x-ai/grok-4",
    creditCost: 10,
    utilities: [ModelUtility.GENERAL, ModelUtility.CODING],
    supportsTools: true,
  },
  {
    id: ModelId.GROK_4_FAST,
    name: "Grok 4 Fast",
    provider: "xAI",
    description: "app.chat.models.descriptions.grok4Fast",
    parameterCount: undefined,
    contextWindow: 2000000,
    icon: SiX,
    openRouterModel: "x-ai/grok-4-fast",
    creditCost: 2,
    utilities: [ModelUtility.GENERAL, ModelUtility.FAST],
    supportsTools: true,
  },
];
/* eslint-enable i18next/no-literal-string */

/** Default model used when no specific model is selected */
export const defaultModel = ModelId.GPT_5_NANO;

/**
 * Retrieves a model configuration by its ID.
 * Falls back to the default model if the requested model is not found.
 *
 * @param modelId - The model identifier to look up
 * @returns The model configuration object
 */
export function getModelById(modelId: ModelId): ModelOption {
  const foundModel = modelOptions.find((model) => model.id === modelId);

  if (foundModel) {
    return foundModel;
  }

  // Fallback to default model - this should never fail as default model is in the array
  const defaultModelOption = modelOptions.find(
    (model) => model.id === defaultModel,
  );

  // This should never happen in a properly configured system, but we handle it gracefully
  return defaultModelOption ?? modelOptions[0];
}

/**
 * Helper function to get all available model IDs.
 * Useful for validation and iteration purposes.
 *
 * @returns Array of all available model IDs
 */
export function getAllModelIds(): ModelId[] {
  return modelOptions.map((model) => model.id);
}

/**
 * Model ID options for SELECT fields
 */
export const ModelIdOptions = modelOptions.map((model) => ({
  value: model.id,
  label: model.name,
}));
