import { z } from "zod";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
} from "../chat/skills/enum";
import { ModelUtility } from "../models/enum";
import {
  ApiProvider,
  calculateCreditCost,
  defaultFeatures,
  filterRoleModels,
  getModelForProvider,
  getProviderPrice,
  type ModelDefinition,
  type ModelOptionCreditBased,
  type ModelOptionTokenBased,
} from "../models/models";
import {
  filtersSelectionSchema,
  sharedFilterPropsSchema,
} from "../models/selection";

export enum ChatModelId {
  GPT_5_5 = "gpt-55",
  GPT_5_5_PRO = "gpt-55-pro",
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
  GEMINI_3_1_FLASH_LITE_PREVIEW = "gemini-3.1-flash-lite-preview",
  GEMINI_3_FLASH = "gemini-3-flash",
  GEMINI_2_5_PRO = "gemini-2.5-pro",
  GEMINI_2_5_FLASH = "gemini-2.5-flash",
  GEMINI_2_5_FLASH_LITE = "gemini-2.5-flash-lite",
  GROK_4_FAST = "grok-4-fast",
  GROK_4 = "grok-4",
  GROK_4_20 = "grok-4.20",
  CLAUDE_HAIKU_4_5 = "claude-haiku-4.5",
  CLAUDE_SONNET_4_5 = "claude-sonnet-4.5",
  CLAUDE_SONNET_4_6 = "claude-sonnet-4.6",
  CLAUDE_OPUS_4_5 = "claude-opus-4.5",
  CLAUDE_OPUS_4_6 = "claude-opus-4.6",
  CLAUDE_OPUS_4_7 = "claude-opus-4.7",
  GLM_4_5V = "glm-4.5v",
  KIMI_K2 = "kimi-k2",
  KIMI_K2_5 = "kimi_k2_5",
  KIMI_K2_THINKING = "kimi-k2-thinking",
  DEEPSEEK_V32 = "deepseek-v3.2",
  DEEPSEEK_V31 = "deepseek-v3.1",
  DEEPSEEK_R1 = "deepseek-r1",
  QWEN3_235B_FREE = "qwen3_235b-free",
  DEEPSEEK_R1_DISTILL = "deepseek-r1-distill",
  QWEN_2_5_7B = "qwen-2-5-7b",
  CLAUDE_CODE_HAIKU = "claude-code-haiku",
  CLAUDE_CODE_SONNET = "claude-code-sonnet",
  CLAUDE_CODE_OPUS = "claude-code-opus",
  GPT_OSS_120B = "gpt-oss-120b-free",
  FREEDOMGPT_LIBERTY = "freedomgpt-liberty",
  GAB_AI_ARYA = "gab-ai-arya",
  UNCENSORED_LM_V1_2 = "uncensored-lm-v1.2",
  GLM_5_1 = "glm-5.1",
  GLM_5 = "glm-5",
  GLM_5_TURBO = "glm-5-turbo",
  GLM_4_7 = "glm-4.7",
  GLM_4_7_FLASH = "glm-4.7-flash",
  GLM_4_6 = "glm-4.6",
  GLM_4_5_AIR = "glm-4.5-air",
  VENICE_UNCENSORED = "venice-uncensored",
  MINIMAX_M2_7 = "minimax-m2.7",
  MIMO_V2_PRO = "mimo-v2-pro",
  // Multimodal image+chat models (also in ImageGenModelId)
  GEMINI_3_1_FLASH_IMAGE_PREVIEW = "gemini-3.1-flash-image-preview",
  GEMINI_3_PRO_IMAGE_PREVIEW = "gemini-3-pro-image-preview",
  GPT_5_IMAGE_MINI = "gpt-5-image-mini",
  GPT_5_IMAGE = "gpt-5-image",
  GPT_5_4_IMAGE_2 = "gpt-5.4-image-2",
  KIMI_K2_6 = "kimi-k2.6",
  DEEPSEEK_V4_PRO = "deepseek-v4-pro",
  DEEPSEEK_V4_FLASH = "deepseek-v4-flash",
}

export const chatModelDefinitions: Record<ChatModelId, ModelDefinition> = {
  [ChatModelId.UNCENSORED_LM_V1_2]: {
    name: "UncensoredLM v1.2",
    by: "uncensoredAI",
    description: "chat.models.descriptions.uncensoredLmV11",
    parameterCount: undefined,
    contextWindow: 32768,
    icon: "uncensored-ai",
    inputs: ["text"], // updated: 2026-04-03 from uncensored-ai-deterministic
    outputs: ["text"], // updated: 2026-04-03 from uncensored-ai-deterministic
    providers: [
      {
        id: ChatModelId.UNCENSORED_LM_V1_2,
        apiProvider: ApiProvider.UNCENSORED_AI,
        providerModel: "uncensored-lm",
        creditCost: 5, // updated: 2026-04-03 from uncensored.ai
      },
      {
        id: ChatModelId.UNCENSORED_LM_V1_2,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "uncensored-lm-v1.2",
        creditCost: 6.5, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.CODING],
  },
  [ChatModelId.FREEDOMGPT_LIBERTY]: {
    name: "FreedomGPT Liberty",
    by: "freedomGPT",
    description: "chat.models.descriptions.freedomgptLiberty",
    parameterCount: undefined,
    contextWindow: 32768,
    icon: "freedom-gpt-logo",
    inputs: ["text"], // updated: 2026-04-03 from uncensored-ai-deterministic
    outputs: ["text"], // updated: 2026-04-03 from uncensored-ai-deterministic
    providers: [
      {
        id: ChatModelId.FREEDOMGPT_LIBERTY,
        apiProvider: ApiProvider.FREEDOMGPT,
        providerModel: "liberty",
        creditCost: 8, // updated: 2026-04-03 from chat.freedomgpt.com
      },
      {
        id: ChatModelId.FREEDOMGPT_LIBERTY,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "freedomgpt-liberty",
        creditCost: 10.4, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: false },
    weaknesses: [ModelUtility.CODING, ModelUtility.ANALYSIS],
  },
  [ChatModelId.GAB_AI_ARYA]: {
    enabled: false, // auto-disabled: price not verified + modality not verified
    name: "Gab AI Arya",
    by: "gabAI",
    description: "chat.models.descriptions.gabAiArya",
    parameterCount: undefined,
    contextWindow: 131072,
    icon: "gab-ai-logo",
    inputs: ["text"], // updated: 2026-04-03 from chat.freedomgpt.com
    outputs: ["text"], // updated: 2026-04-03 from chat.freedomgpt.com
    providers: [
      {
        id: ChatModelId.GAB_AI_ARYA,
        apiProvider: ApiProvider.GAB_AI,
        providerModel: "arya",
        creditCost: 5, // raw API cost; 30% markup applied by calculateCreditCost
      },
      {
        id: ChatModelId.GAB_AI_ARYA,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gab-ai-arya",
        creditCost: 6.5, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.CODING],
  },
  [ChatModelId.VENICE_UNCENSORED]: {
    enabled: false, // auto-disabled: price not verified + modality not verified
    name: "Venice Uncensored 1.1",
    by: "veniceAI",
    description: "chat.models.descriptions.veniceUncensored",
    parameterCount: 24,
    contextWindow: 32000,
    icon: "venice-ai-logo",
    inputs: ["text"], // updated: 2026-04-03 from uncensored-ai-deterministic
    outputs: ["text"], // updated: 2026-04-03 from uncensored-ai-deterministic
    providers: [
      {
        id: ChatModelId.VENICE_UNCENSORED,
        apiProvider: ApiProvider.VENICE_AI,
        providerModel: "venice-uncensored",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.2,
        outputTokenCost: 0.9,
      },
      {
        id: ChatModelId.VENICE_UNCENSORED,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "venice-uncensored",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.26, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 1.17, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [
      ModelUtility.UNCENSORED,
      ModelUtility.CREATIVE,
      ModelUtility.ROLEPLAY,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
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
  //   content: ContentLevel.UNCENSORED,
  //   features: { ...defaultFeatures },
  //   weaknesses: [ModelUtility.CODING, ModelUtility.ANALYSIS],
  // },

  [ChatModelId.CLAUDE_HAIKU_4_5]: {
    name: "Claude Haiku 4.5",
    by: "anthropic",
    description: "chat.models.descriptions.claudeHaiku45",
    parameterCount: undefined,
    contextWindow: 200000,
    icon: "si-anthropic",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.CLAUDE_HAIKU_4_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-haiku-4.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 1, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 5, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.1, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 1.25, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.CLAUDE_CODE_HAIKU,
        apiProvider: ApiProvider.CLAUDE_CODE,
        providerModel: "claude-haiku-4-5-20251001",
        creditCost: calculateCreditCost,
        inputTokenCost: 1,
        outputTokenCost: 5,
        adminOnly: true,
      },
      {
        id: ChatModelId.CLAUDE_HAIKU_4_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-haiku-4.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.3, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 6.5, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.13, // updated: 2026-04-07 from unbottled.ai
        cacheWriteTokenCost: 1.625, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },

  [ChatModelId.CLAUDE_OPUS_4_5]: {
    name: "Claude Opus 4.5",
    by: "anthropic",
    description: "chat.models.descriptions.claudeOpus45",
    parameterCount: undefined,
    contextWindow: 200000,
    icon: "si-anthropic",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.CLAUDE_OPUS_4_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-opus-4.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 5, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 25, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.5, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 6.25, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.CLAUDE_OPUS_4_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-opus-4.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 6.5, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 32.5, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.65, // updated: 2026-04-07 from unbottled.ai
        cacheWriteTokenCost: 8.125, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },
  [ChatModelId.CLAUDE_OPUS_4_6]: {
    name: "Claude Opus 4.6",
    by: "anthropic",
    description: "chat.models.descriptions.claudeOpus46",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.CLAUDE_OPUS_4_6,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-opus-4.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 5, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 25, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.5, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 6.25, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.CLAUDE_OPUS_4_6,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-opus-4.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 6.5, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 32.5, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.65, // updated: 2026-04-07 from unbottled.ai
        cacheWriteTokenCost: 8.125, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },
  [ChatModelId.CLAUDE_OPUS_4_7]: {
    name: "Claude Opus 4.7",
    by: "anthropic",
    description: "chat.models.descriptions.claudeOpus47",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text", "image"],
    outputs: ["text"],
    providers: [
      {
        id: ChatModelId.CLAUDE_OPUS_4_7,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-opus-4.7",
        creditCost: calculateCreditCost,
        inputTokenCost: 5,
        outputTokenCost: 25,
      },
      {
        id: ChatModelId.CLAUDE_CODE_OPUS,
        apiProvider: ApiProvider.CLAUDE_CODE,
        providerModel: "claude-opus-4-7",
        creditCost: calculateCreditCost,
        inputTokenCost: 5,
        outputTokenCost: 25,
        adminOnly: true,
      },
      {
        id: ChatModelId.CLAUDE_OPUS_4_7,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-opus-4.7",
        creditCost: calculateCreditCost,
        inputTokenCost: 6.5,
        outputTokenCost: 32.5,
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
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },
  [ChatModelId.CLAUDE_SONNET_4_5]: {
    name: "Claude Sonnet 4.5",
    by: "anthropic",
    description: "chat.models.descriptions.claudeSonnet45",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.CLAUDE_SONNET_4_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-sonnet-4.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 3, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 15, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.3, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 3.75, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.CLAUDE_SONNET_4_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-sonnet-4.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 3.9, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 19.5, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.39, // updated: 2026-04-07 from unbottled.ai
        cacheWriteTokenCost: 4.875, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },
  [ChatModelId.CLAUDE_SONNET_4_6]: {
    name: "Claude Sonnet 4.6",
    by: "anthropic",
    description: "chat.models.descriptions.claudeSonnet46",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.CLAUDE_SONNET_4_6,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-sonnet-4.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 3, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 15, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.3, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 3.75, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.CLAUDE_CODE_SONNET,
        apiProvider: ApiProvider.CLAUDE_CODE,
        providerModel: "claude-sonnet-4-6",
        creditCost: calculateCreditCost,
        inputTokenCost: 3,
        outputTokenCost: 15,
        adminOnly: true,
      },
      {
        id: ChatModelId.CLAUDE_SONNET_4_6,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-sonnet-4.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 3.9, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 19.5, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.39, // updated: 2026-04-07 from unbottled.ai
        cacheWriteTokenCost: 4.875, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },

  [ChatModelId.GROK_4]: {
    name: "Grok 4",
    by: "xAI",
    description: "chat.models.descriptions.grok4",
    parameterCount: undefined,
    contextWindow: 256000,
    icon: "si-x",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GROK_4,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "x-ai/grok-4",
        creditCost: calculateCreditCost,
        inputTokenCost: 3, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 15, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.75, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GROK_4,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "grok-4",
        creditCost: calculateCreditCost,
        inputTokenCost: 3.9, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 19.5, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.975, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  [ChatModelId.GROK_4_FAST]: {
    name: "Grok 4 Fast",
    by: "xAI",
    description: "chat.models.descriptions.grok4Fast",
    parameterCount: undefined,
    contextWindow: 2000000,
    icon: "si-x",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GROK_4_FAST,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "x-ai/grok-4-fast",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.2, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.5, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.05, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GROK_4_FAST,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "grok-4-fast",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.26, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 0.65, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.065, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  [ChatModelId.GROK_4_20]: {
    name: "Grok 4.20",
    by: "xAI",
    description: "chat.models.descriptions.grok420Beta",
    parameterCount: undefined,
    contextWindow: 2000000,
    icon: "si-x",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GROK_4_20,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "x-ai/grok-4.20",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 6, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GROK_4_20,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "grok-4.20",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.6, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 7.8, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  [ChatModelId.GTP_5_PRO]: {
    name: "GPT-5 Pro",
    by: "openAI",
    description: "chat.models.descriptions.gpt5Pro",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GTP_5_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 15, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 120, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GTP_5_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 19.5, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 156, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.SMART],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ChatModelId.GPT_5_4_PRO]: {
    name: "GPT-5.4 Pro",
    by: "openAI",
    description: "chat.models.descriptions.gpt54Pro",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_4_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.4-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 30, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 180, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_4_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-54-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 39, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 234, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ChatModelId.GPT_5_2_PRO]: {
    name: "GPT-5.2 Pro",
    by: "openAI",
    description: "chat.models.descriptions.gpt52Pro",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_2_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.2-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 21, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 168, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_2_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-52-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 27.3, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 218.4, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ChatModelId.GPT_5_CODEX]: {
    name: "GPT-5 Codex",
    by: "openAI",
    description: "chat.models.descriptions.gpt5Codex",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_CODEX,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5-codex",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 10, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.13, // updated: 2026-04-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_CODEX,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5-codex",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.625, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.169, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CODING],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CREATIVE],
  },
  [ChatModelId.GPT_5_3_CODEX]: {
    name: "GPT-5.3-Codex",
    by: "openAI",
    description: "chat.models.descriptions.gpt53Codex",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_3_CODEX,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.3-codex",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.75, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 14, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.18, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_3_CODEX,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-53-codex",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.275, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 18.2, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.234, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CREATIVE],
  },
  [ChatModelId.GPT_5_1_CODEX]: {
    name: "GPT 5.1 Codex",
    by: "openAI",
    description: "chat.models.descriptions.gpt51Codex",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_1_CODEX,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.1-codex",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 10, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.13, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_1_CODEX,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-51-codex",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.625, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.169, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ChatModelId.GPT_5_1]: {
    name: "GPT 5.1",
    by: "openAI",
    description: "chat.models.descriptions.gpt51",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_1,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.1",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 10, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.13, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_1,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-51",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.625, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.169, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.SMART],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ChatModelId.GPT_5_5]: {
    name: "GPT-5.5",
    by: "openAI",
    description: "chat.models.descriptions.gpt55",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // released: 2026-04-24 from openrouter-api
    outputs: ["text"], // released: 2026-04-24 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 5, // released: 2026-04-24 from openrouter-api
        outputTokenCost: 30, // released: 2026-04-24 from openrouter-api
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
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ChatModelId.GPT_5_5_PRO]: {
    name: "GPT-5.5 Pro",
    by: "openAI",
    description: "chat.models.descriptions.gpt55Pro",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // released: 2026-04-24 from openrouter-api
    outputs: ["text"], // released: 2026-04-24 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_5_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.5-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 30, // released: 2026-04-24 from openrouter-api
        outputTokenCost: 180, // released: 2026-04-24 from openrouter-api
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
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ChatModelId.GPT_5_4]: {
    name: "GPT-5.4",
    by: "openAI",
    description: "chat.models.descriptions.gpt54",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_4,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.4",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.5, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 15, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.25, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_4,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-54",
        creditCost: calculateCreditCost,
        inputTokenCost: 3.25, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 19.5, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.325, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.CREATIVE,
      ModelUtility.ANALYSIS,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ChatModelId.GPT_5_4_MINI]: {
    name: "GPT-5.4 Mini",
    by: "openAI",
    description: "chat.models.descriptions.gpt54Mini",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_4_MINI,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.4-mini",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.75, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 4.5, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_4_MINI,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5.4-mini",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.975, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 5.85, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.SMART, ModelUtility.CODING, ModelUtility.CHAT],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ChatModelId.GPT_5_4_NANO]: {
    name: "GPT-5.4 Nano",
    by: "openAI",
    description: "chat.models.descriptions.gpt54Nano",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_4_NANO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.4-nano",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.2, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 1.25, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_4_NANO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5.4-nano",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.26, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 1.625, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.ANALYSIS],
  },
  [ChatModelId.GPT_5_2]: {
    name: "GPT 5.2",
    by: "openAI",
    description: "chat.models.descriptions.gpt52",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_2,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.2",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.75, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 14, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.18, // updated: 2026-04-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_2,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-52",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.275, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 18.2, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.234, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ChatModelId.GPT_5_3_CHAT]: {
    name: "GPT-5.3 Chat",
    by: "openAI",
    description: "chat.models.descriptions.gpt53Chat",
    parameterCount: undefined,
    contextWindow: 128000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_3_CHAT,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.3-chat",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.75, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 14, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.18, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_3_CHAT,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-53-chat",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.275, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 18.2, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.234, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST, ModelUtility.SMART],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ChatModelId.GPT_5_2_CHAT]: {
    name: "GPT 5.2 Chat",
    by: "openAI",
    description: "chat.models.descriptions.gpt52_chat",
    parameterCount: undefined,
    contextWindow: 128000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_2_CHAT,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.2-chat",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.75, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 14, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.18, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_2_CHAT,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-52-chat",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.275, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 18.2, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.234, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ChatModelId.GPT_5]: {
    name: "GPT-5",
    by: "openAI",
    description: "chat.models.descriptions.gpt5",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 10, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.13, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.625, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.169, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.SMART, ModelUtility.CHAT],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY],
  },
  [ChatModelId.GPT_5_MINI]: {
    name: "GPT-5 Mini",
    by: "openAI",
    description: "chat.models.descriptions.gpt5Mini",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_MINI,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5-mini",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.25, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 2, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.03, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_MINI,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5-mini",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.325, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 2.6, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.039, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.ANALYSIS],
  },
  [ChatModelId.GPT_5_NANO]: {
    name: "GPT-5 Nano",
    by: "openAI",
    description: "chat.models.descriptions.gpt5Nano",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_NANO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5-nano",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.05, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.4, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.01, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_NANO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5-nano",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.065, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 0.52, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.013, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
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
  [ChatModelId.GPT_OSS_120B]: {
    name: "GPT-OSS 120B",
    by: "openAI",
    description: "chat.models.descriptions.gptOss120b",
    parameterCount: 117,
    contextWindow: 131072,
    icon: "si-openai",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_OSS_120B,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-oss-120b",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.04, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.19, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GPT_OSS_120B,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-oss-120b-free",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.052, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 0.247, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.CODING],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  // eslint-disable-next-line i18next/no-literal-string
  [ChatModelId.KIMI_K2_6]: {
    name: "Kimi K2.6",
    by: "moonshotAI",
    description: "chat.models.descriptions.kimiK2_6",
    parameterCount: undefined,
    contextWindow: 262144,
    icon: "moon",
    inputs: ["text", "image"], // released: 2026-04-20
    outputs: ["text"], // released: 2026-04-20
    providers: [
      {
        id: ChatModelId.KIMI_K2_6,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "moonshotai/kimi-k2.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.8, // released: 2026-04-20 from openrouter
        outputTokenCost: 3.5, // released: 2026-04-20 from openrouter
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
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.KIMI_K2]: {
    name: "Kimi K2",
    by: "moonshotAI",
    description: "chat.models.descriptions.kimiK2",
    parameterCount: 1000,
    contextWindow: 131072,
    icon: "moon",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.KIMI_K2,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "moonshotai/kimi-k2-0905",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.4, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 2, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.15, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.KIMI_K2,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kimi-k2",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.52, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 2.6, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.195, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.KIMI_K2_5]: {
    name: "Kimi K2.5",
    by: "moonshotAI",
    description: "chat.models.descriptions.kimiK2_5",
    parameterCount: 1000,
    contextWindow: 262144,
    icon: "moon",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.KIMI_K2_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "moonshotai/kimi-k2.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.38, // updated: 2026-04-03 from openrouter-api
        outputTokenCost: 1.72, // updated: 2026-04-03 from openrouter-api
        cacheReadTokenCost: 0.19, // updated: 2026-04-03 from openrouter-api
      },
      {
        id: ChatModelId.KIMI_K2_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kimi_k2_5",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.494, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 2.236, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.247, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.KIMI_K2_THINKING]: {
    name: "Kimi K2 Thinking",
    by: "moonshotAI",
    description: "chat.models.descriptions.kimiK2Thinking",
    parameterCount: 1000,
    contextWindow: 131072,
    icon: "moon",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.KIMI_K2_THINKING,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "moonshotai/kimi-k2-thinking",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.47, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 2, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.14, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.KIMI_K2_THINKING,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kimi-k2-thinking",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.611, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 2.6, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.182, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },

  // eslint-disable-next-line i18next/no-literal-string
  [ChatModelId.GLM_5_1]: {
    name: "GLM-5.1",
    by: "zAi",
    description: "chat.models.descriptions.glm5_1",
    parameterCount: undefined,
    contextWindow: 202752,
    icon: "si-zendesk",
    inputs: ["text"], // released: 2026-04-07
    outputs: ["text"], // released: 2026-04-07
    providers: [
      {
        id: ChatModelId.GLM_5_1,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-5.1",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.05, // released: 2026-04-07 from openrouter
        outputTokenCost: 3.5, // released: 2026-04-07 from openrouter
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
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.GLM_5]: {
    name: "GLM-5",
    by: "zAi",
    description: "chat.models.descriptions.glm5",
    parameterCount: undefined,
    contextWindow: 80000,
    icon: "si-zendesk",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GLM_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.72, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 2.3, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.16,
      },
      {
        id: ChatModelId.GLM_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.936, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 2.99, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.208, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.GLM_5_TURBO]: {
    name: "GLM-5 Turbo",
    by: "zAi",
    description: "chat.models.descriptions.glm5Turbo",
    parameterCount: undefined,
    contextWindow: 202752,
    icon: "si-zendesk",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GLM_5_TURBO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-5-turbo",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.2, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 4, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GLM_5_TURBO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-5-turbo",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.56, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 5.2, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.GLM_4_7]: {
    name: "GLM 4.7",
    by: "zAi",
    description: "chat.models.descriptions.glm47",
    parameterCount: undefined,
    contextWindow: 202752,
    icon: "si-zendesk",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GLM_4_7,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-4.7",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.39, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 1.75, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.2, // updated: 2026-04-07 from openrouter-api
      },
      {
        id: ChatModelId.GLM_4_7,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-4.7",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.507, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 2.275, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.26, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.GLM_4_7_FLASH]: {
    name: "GLM 4.7 Flash",
    by: "zAi",
    description: "chat.models.descriptions.glm47Flash",
    parameterCount: undefined,
    contextWindow: 202752,
    icon: "si-zendesk",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GLM_4_7_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-4.7-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.06, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.4, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.01, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GLM_4_7_FLASH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-4.7-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.078, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 0.52, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.013, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.GLM_4_5_AIR]: {
    name: "GLM 4.5 AIR",
    by: "zAi",
    description: "chat.models.descriptions.glm45Air",
    parameterCount: undefined,
    contextWindow: 131072,
    icon: "si-zendesk",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GLM_4_5_AIR,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-4.5-air",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.13, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.85, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.03, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GLM_4_5_AIR,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-4.5-air",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.169, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 1.105, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.039, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.GLM_4_6]: {
    name: "GLM 4.6",
    by: "zAi",
    description: "chat.models.descriptions.glm46",
    parameterCount: undefined,
    contextWindow: 204800,
    icon: "si-zendesk",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GLM_4_6,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-4.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.39, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 1.9, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GLM_4_6,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-4.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.507, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 2.47, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.GLM_4_5V]: {
    name: "GLM 4.5v",
    by: "zAi",
    description: "chat.models.descriptions.glm45v",
    parameterCount: 106,
    contextWindow: 65536,
    icon: "si-zendesk",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GLM_4_5V,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-4.5v",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.6, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 1.8, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.11, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GLM_4_5V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-4.5v",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.78, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 2.34, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.143, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.VISION, ModelUtility.CHAT],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.MINIMAX_M2_7]: {
    name: "MiniMax M2.7",
    by: "miniMax",
    description: "chat.models.descriptions.minimaxM27",
    parameterCount: undefined,
    contextWindow: 204800,
    icon: "si-minimax",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.MINIMAX_M2_7,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "minimax/minimax-m2.7",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.3, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 1.2, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.MINIMAX_M2_7,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "minimax-m2.7",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.39, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 1.56, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.MIMO_V2_PRO]: {
    name: "MiMo V2 Pro",
    by: "xiaomi",
    description: "chat.models.descriptions.mimoV2Pro",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-xiaomi",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.MIMO_V2_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "xiaomi/mimo-v2-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 1, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 3, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.MIMO_V2_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "mimo-v2-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.3, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 3.9, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.GEMINI_2_5_FLASH_LITE]: {
    name: "Gemini 2.5 Flash Lite",
    by: "google",
    description: "chat.models.descriptions.geminiFlash25Lite",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    inputs: ["text", "image", "video", "audio"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GEMINI_2_5_FLASH_LITE,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-2.5-flash-lite",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.1, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.4, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.01, // updated: 2026-04-07 from openrouter-api
        cacheWriteTokenCost: 0.08, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GEMINI_2_5_FLASH_LITE,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gemini-2.5-flash-lite",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.13, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 0.52, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.013, // updated: 2026-04-07 from unbottled.ai
        cacheWriteTokenCost: 0.104, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  [ChatModelId.GEMINI_2_5_FLASH]: {
    name: "Gemini 2.5 Flash",
    by: "google",
    description: "chat.models.descriptions.geminiFlash25Flash",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    inputs: ["text", "image", "video", "audio"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GEMINI_2_5_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-2.5-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.3, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 2.5, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.03, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 0.08, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GEMINI_2_5_FLASH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gemini-2.5-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.39, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 3.25, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.039, // updated: 2026-04-07 from unbottled.ai
        cacheWriteTokenCost: 0.104, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  [ChatModelId.GEMINI_2_5_PRO]: {
    name: "Gemini 2.5 Flash Pro",
    by: "google",
    description: "chat.models.descriptions.geminiFlash25Pro",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    inputs: ["text", "image", "video", "audio"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GEMINI_2_5_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-2.5-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 10, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.13, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 0.38, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GEMINI_2_5_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gemini-2.5-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.625, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.169, // updated: 2026-04-07 from unbottled.ai
        cacheWriteTokenCost: 0.494, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.SMART],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  [ChatModelId.GEMINI_3_1_PRO_PREVIEW_CUSTOM_TOOLS]: {
    name: "Gemini 3.1 Pro",
    by: "google",
    description: "chat.models.descriptions.gemini31ProPreviewCustomTools",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    inputs: ["text", "image", "video", "audio"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GEMINI_3_1_PRO_PREVIEW_CUSTOM_TOOLS,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3.1-pro-preview-customtools",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 12, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.2, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 0.38, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GEMINI_3_1_PRO_PREVIEW_CUSTOM_TOOLS,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gemini-3.1-pro-preview-customtools",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.6, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 15.6, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.26, // updated: 2026-04-07 from unbottled.ai
        cacheWriteTokenCost: 0.494, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  // eslint-disable-next-line i18next/no-literal-string
  [ChatModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW]: {
    name: "Nano Banana",
    by: "google",
    description: "chat.models.descriptions.gemini31FlashImagePreview",
    parameterCount: undefined,
    contextWindow: 65536,
    icon: "si-googlegemini",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3.1-flash-image-preview",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.5, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 3, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gemini-3.1-flash-image-preview",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.65, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 3.9, // updated: 2026-04-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.CHAT,
      ModelUtility.CREATIVE,
      ModelUtility.IMAGE_GEN,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures },
  },
  [ChatModelId.GEMINI_3_1_FLASH_LITE_PREVIEW]: {
    name: "Gemini 3.1 Flash Lite Preview",
    by: "google",
    description: "chat.models.descriptions.gemini31FlashLitePreview",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    inputs: ["text", "image", "video", "audio"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GEMINI_3_1_FLASH_LITE_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3.1-flash-lite-preview",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.25, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 1.5, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.03, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 0.08, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GEMINI_3_1_FLASH_LITE_PREVIEW,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gemini-3.1-flash-lite-preview",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.325, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 1.95, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.039, // updated: 2026-04-07 from unbottled.ai
        cacheWriteTokenCost: 0.104, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST, ModelUtility.ANALYSIS],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  [ChatModelId.GEMINI_3_FLASH]: {
    name: "Gemini 3 Flash",
    by: "google",
    description: "chat.models.descriptions.gemini3Flash",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    inputs: ["text", "image", "video", "audio"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GEMINI_3_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3-flash-preview",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.5, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 3, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.05, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 0.08, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GEMINI_3_FLASH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gemini-3-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.65, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 3.9, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.065, // updated: 2026-04-07 from unbottled.ai
        cacheWriteTokenCost: 0.104, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.SMART, ModelUtility.CODING, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
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
  //   creditCost: calculateCreditCost,

  //   utilities: [ModelUtility.CHAT, ModelUtility.FAST],
  //   supportsTools: true,
  //   intelligence: IntelligenceLevel.QUICK,
  //   content: ContentLevel.MAINSTREAM,
  //   features: { ...defaultFeatures, toolCalling: true },
  //   weaknesses: [ModelUtility.ANALYSIS, ModelUtility.CODING],
  // },
  [ChatModelId.DEEPSEEK_V4_PRO]: {
    name: "DeepSeek V4 Pro",
    by: "deepSeek",
    description: "chat.models.descriptions.deepseekV4Pro",
    parameterCount: 1600,
    contextWindow: 1048576,
    icon: "whale",
    inputs: ["text"], // updated: 2026-04-25 from openrouter-api
    outputs: ["text"], // updated: 2026-04-25 from openrouter-api
    providers: [
      {
        id: ChatModelId.DEEPSEEK_V4_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "deepseek/deepseek-v4-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.74, // updated: 2026-04-25 from openrouter-api
        outputTokenCost: 3.48, // updated: 2026-04-25 from openrouter-api
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
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.DEEPSEEK_V4_FLASH]: {
    name: "DeepSeek V4 Flash",
    by: "deepSeek",
    description: "chat.models.descriptions.deepseekV4Flash",
    parameterCount: 284,
    contextWindow: 1048576,
    icon: "whale",
    inputs: ["text"], // updated: 2026-04-25 from openrouter-api
    outputs: ["text"], // updated: 2026-04-25 from openrouter-api
    providers: [
      {
        id: ChatModelId.DEEPSEEK_V4_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "deepseek/deepseek-v4-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.14, // updated: 2026-04-25 from openrouter-api
        outputTokenCost: 0.28, // updated: 2026-04-25 from openrouter-api
      },
    ],

    utilities: [ModelUtility.FAST, ModelUtility.CODING, ModelUtility.ANALYSIS],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.DEEPSEEK_V32]: {
    name: "DeepSeek V3.2",
    by: "deepSeek",
    description: "chat.models.descriptions.deepseekV32",
    parameterCount: 671,
    contextWindow: 163840,
    icon: "whale",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.DEEPSEEK_V32,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "deepseek/deepseek-v3.2",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.26, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.38, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.DEEPSEEK_V32,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "deepseek-v3.2",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.338, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 0.494, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.DEEPSEEK_V31]: {
    name: "DeepSeek V3.1",
    by: "deepSeek",
    description: "chat.models.descriptions.deepseekV31",
    parameterCount: 671,
    contextWindow: 32768,
    icon: "whale",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.DEEPSEEK_V31,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "deepseek/deepseek-chat-v3.1",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.15, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.75, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.DEEPSEEK_V31,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "deepseek-v3.1",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.195, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 0.975, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.SMART, ModelUtility.CODING],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.DEEPSEEK_R1]: {
    name: "DeepSeek R1",
    by: "deepSeek",
    description: "chat.models.descriptions.deepseekR1",
    parameterCount: 671,
    contextWindow: 163840,
    icon: "whale",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.DEEPSEEK_R1,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "deepseek/deepseek-r1-0528",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.45, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 2.15, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.22, // updated: 2026-04-07 from openrouter-api
      },
      {
        id: ChatModelId.DEEPSEEK_R1,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "deepseek-r1",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.585, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 2.795, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.286, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.QWEN3_235B_FREE]: {
    name: "Qwen3 235B ",
    by: "alibaba",
    description: "chat.models.descriptions.qwen3235bFree",
    parameterCount: 235,
    contextWindow: 131072,
    icon: "si-alibabadotcom",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.QWEN3_235B_FREE,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "qwen/qwen3-235b-a22b",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.45, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 1.82, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.QWEN3_235B_FREE,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "qwen3_235b-free",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.585, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 2.366, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.SMART, ModelUtility.CODING],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.DEEPSEEK_R1_DISTILL]: {
    name: "DeepSeek R1 Distill",
    by: "deepSeek",
    description: "chat.models.descriptions.deepseekR1Distill",
    parameterCount: 70,
    contextWindow: 32768,
    icon: "whale",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.DEEPSEEK_R1_DISTILL,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "deepseek/deepseek-r1-distill-qwen-32b",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.29, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.29, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.DEEPSEEK_R1_DISTILL,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "deepseek-r1-distill",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.377, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 0.377, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.QWEN_2_5_7B]: {
    name: "Qwen 2.5 7B",
    by: "alibaba",
    description: "chat.models.descriptions.qwen257b",
    parameterCount: 7,
    contextWindow: 32768,
    icon: "si-alibabadotcom",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.QWEN_2_5_7B,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "qwen/qwen-2.5-7b-instruct",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.04, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.1, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.QWEN_2_5_7B,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "qwen-2-5-7b",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.052, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 0.13, // updated: 2026-04-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ANALYSIS, ModelUtility.CODING],
  },
  // Claude Code provider variant aliases - admin-only Claude Code API access points
  // These share the same model characteristics as their OpenRouter counterparts
  [ChatModelId.CLAUDE_CODE_HAIKU]: {
    enabled: false, // auto-disabled: price not verified + modality not verified
    enabledWithoutPrice: true,
    name: "Claude Haiku 4.5",
    by: "anthropic",
    description: "chat.models.descriptions.claudeHaiku45",
    parameterCount: undefined,
    contextWindow: 200000,
    icon: "si-anthropic",
    inputs: ["text"],
    outputs: ["text"],
    providers: [
      {
        id: ChatModelId.CLAUDE_CODE_HAIKU,
        apiProvider: ApiProvider.CLAUDE_CODE,
        providerModel: "claude-haiku-4-5-20251001",
        creditCost: calculateCreditCost,
        inputTokenCost: 1,
        outputTokenCost: 5,
        adminOnly: true,
      },
      {
        id: ChatModelId.CLAUDE_CODE_HAIKU,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-code-haiku",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.3, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 6.5, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },
  [ChatModelId.CLAUDE_CODE_SONNET]: {
    enabled: false, // auto-disabled: price not verified + modality not verified
    enabledWithoutPrice: true,
    name: "Claude Sonnet 4.6",
    by: "anthropic",
    description: "chat.models.descriptions.claudeSonnet46",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text"],
    outputs: ["text"],
    providers: [
      {
        id: ChatModelId.CLAUDE_CODE_SONNET,
        apiProvider: ApiProvider.CLAUDE_CODE,
        providerModel: "claude-sonnet-4-6",
        creditCost: calculateCreditCost,
        inputTokenCost: 3,
        outputTokenCost: 15,
        adminOnly: true,
      },
      {
        id: ChatModelId.CLAUDE_CODE_SONNET,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-code-sonnet",
        creditCost: calculateCreditCost,
        inputTokenCost: 3.9, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 19.5, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },
  [ChatModelId.CLAUDE_CODE_OPUS]: {
    enabled: false, // auto-disabled: price not verified + modality not verified
    enabledWithoutPrice: true,
    name: "Claude Opus 4.7",
    by: "anthropic",
    description: "chat.models.descriptions.claudeOpus47",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text"],
    outputs: ["text"],
    providers: [
      {
        id: ChatModelId.CLAUDE_CODE_OPUS,
        apiProvider: ApiProvider.CLAUDE_CODE,
        providerModel: "claude-opus-4-7",
        creditCost: calculateCreditCost,
        inputTokenCost: 5,
        outputTokenCost: 25,
        adminOnly: true,
      },
      {
        id: ChatModelId.CLAUDE_CODE_OPUS,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-code-opus",
        creditCost: calculateCreditCost,
        inputTokenCost: 6.5, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 32.5, // updated: 2026-04-07 from unbottled.ai
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
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },
  // Multimodal image+chat models - also in imageGenModelDefinitions
  // eslint-disable-next-line i18next/no-literal-string
  [ChatModelId.GEMINI_3_PRO_IMAGE_PREVIEW]: {
    name: "Nano Banana Pro",
    by: "google",
    description: "chat.models.descriptions.gemini3ProImagePreview",
    parameterCount: undefined,
    contextWindow: 65536,
    icon: "si-googlegemini",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GEMINI_3_PRO_IMAGE_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3-pro-image-preview",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 12, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.2, // updated: 2026-03-31 from openrouter-api
        cacheWriteTokenCost: 0.38, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GEMINI_3_PRO_IMAGE_PREVIEW,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gemini-3-pro-image-preview",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.6, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 15.6, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.26, // updated: 2026-04-07 from unbottled.ai
        cacheWriteTokenCost: 0.494, // updated: 2026-04-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.IMAGE_GEN,
      ModelUtility.CREATIVE,
      ModelUtility.SMART,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, streaming: false },
  },
  // eslint-disable-next-line i18next/no-literal-string
  [ChatModelId.GPT_5_IMAGE_MINI]: {
    name: "GPT-5 Image Mini",
    by: "openAI",
    description: "chat.models.descriptions.gpt5ImageMini",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_IMAGE_MINI,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5-image-mini",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.5, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 2, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.25, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_IMAGE_MINI,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5-image-mini",
        creditCost: calculateCreditCost,
        inputTokenCost: 3.25, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 2.6, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 0.325, // updated: 2026-04-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.IMAGE_GEN,
      ModelUtility.CREATIVE,
      ModelUtility.FAST,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      supportsTemperature: false,
    },
  },
  // eslint-disable-next-line i18next/no-literal-string
  [ChatModelId.GPT_5_IMAGE]: {
    name: "GPT-5 Image",
    by: "openAI",
    description: "chat.models.descriptions.gpt5Image",
    parameterCount: undefined,
    contextWindow: 400000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_IMAGE,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5-image",
        creditCost: calculateCreditCost,
        inputTokenCost: 10, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 10, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 1.25, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_IMAGE,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5-image",
        creditCost: calculateCreditCost,
        inputTokenCost: 13, // updated: 2026-04-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-04-07 from unbottled.ai
        cacheReadTokenCost: 1.625, // updated: 2026-04-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.IMAGE_GEN,
      ModelUtility.CREATIVE,
      ModelUtility.SMART,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      supportsTemperature: false,
    },
  },
  // eslint-disable-next-line i18next/no-literal-string
  [ChatModelId.GPT_5_4_IMAGE_2]: {
    name: "GPT-5.4 Image 2",
    by: "openAI",
    description: "chat.models.descriptions.gpt54Image2",
    parameterCount: undefined,
    contextWindow: 272000,
    icon: "si-openai",
    inputs: ["text", "image"], // released: 2026-04-21
    outputs: ["text", "image"], // released: 2026-04-21
    providers: [
      {
        id: ChatModelId.GPT_5_4_IMAGE_2,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.4-image-2",
        creditCost: calculateCreditCost,
        inputTokenCost: 8, // released: 2026-04-21 from openrouter
        outputTokenCost: 15, // released: 2026-04-21 from openrouter
      },
    ],
    utilities: [
      ModelUtility.IMAGE_GEN,
      ModelUtility.CREATIVE,
      ModelUtility.SMART,
      ModelUtility.CODING,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      supportsTemperature: false,
    },
  },
};

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

export const ChatModelIdOptions = Object.values(ChatModelId).map((id) => ({
  value: id,
  label: chatModelOptions.find((m) => m.id === id)?.name ?? id,
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

export const chatModelSelectionSchema = z.discriminatedUnion("selectionType", [
  chatManualModelSelectionSchema,
  filtersSelectionSchema,
]);
export type ChatModelSelection = z.infer<typeof chatModelSelectionSchema>;

// ============================================================
// CHAT MODEL RESOLUTION
// ============================================================

/** Get all chat models matching a selection (MANUAL falls back to FILTERS if unavailable). */
export function filterChatModels(
  selection: ChatModelSelection,
  user: JwtPayloadType,
  providerOverride?: ApiProvider,
): ChatModelOption[] {
  const pool = providerOverride
    ? chatModelOptionsPool.filter((m) => m.apiProvider === providerOverride)
    : chatModelOptionsPool;
  return filterRoleModels(pool, selection, user);
}

/** Get best chat model from a selection. */
export function getBestChatModel(
  selection: ChatModelSelection,
  user: JwtPayloadType,
  providerOverride?: ApiProvider,
): ChatModelOption | null {
  return filterChatModels(selection, user, providerOverride)[0] ?? null;
}
