/**
 * Chat model REGISTRY — the ChatModelId enum and the full model-definition
 * record, split out of models.ts so the data lives apart from the option/
 * selection logic. Add new models HERE; models.ts re-exports both.
 */

import { ModelUtility } from "../models/enum";
import {
  ApiProvider,
  calculateCreditCost,
  defaultFeatures,
  type ModelDefinition,
} from "../models/models";
import { ContentLevel, IntelligenceLevel } from "../skills/enum";

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
  GEMINI_3_5_FLASH = "gemini-3.5-flash",
  GEMINI_3_FLASH = "gemini-3-flash",
  GEMINI_2_5_PRO = "gemini-2.5-pro",
  GEMINI_2_5_FLASH = "gemini-2.5-flash",
  GEMINI_2_5_FLASH_LITE = "gemini-2.5-flash-lite",
  GROK_4_FAST = "grok-4-fast",
  GROK_4 = "grok-4",
  GROK_4_3 = "grok-4.3",
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
  CLAUDE_CODE_FABLE = "claude-code-fable",
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
  // Uncensored models added 2026-11-07 (see docs/research/uncensored-providers-2026-11.md)
  VENICE_UNCENSORED_ROLEPLAY = "venice-uncensored-roleplay",
  GEMMA_4_UNCENSORED = "gemma-4-uncensored",
  QWEN_3_6_PLUS_UNCENSORED = "qwen-3.6-plus-uncensored",
  GLM_4_7_FLASH_HERETIC = "glm-4.7-flash-heretic",
  GLM_5_3_ABLITERATED = "glm-5.3-abliterated",
  DEEPSEEK_V4_1_FLASH_ABLITERATED = "deepseek-v4.1-flash-abliterated",
  MIMO_V2_6_FLASH_ABLITERATED = "mimo-v2.6-flash-abliterated",
  GLM_5_3_UNCENSORED = "glm-5.3-uncensored",
  GLM_5_3_FLASH_UNCENSORED = "glm-5.3-flash-uncensored",
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
  // New models added 2026-08-16
  CLAUDE_OPUS_4_8 = "claude-opus-4.8",
  CLAUDE_SONNET_5 = "claude-sonnet-5",
  CLAUDE_OPUS_5 = "claude-opus-5",
  CLAUDE_OPUS_5_FAST = "claude-opus-5-fast",
  CLAUDE_FABLE_5 = "claude-fable-5",
  GROK_4_5 = "grok-4.5",
  GROK_4_6 = "grok-4.6",
  GPT_5_6_LUNA = "gpt-5.6-luna",
  GPT_5_6_LUNA_PRO = "gpt-5.6-luna-pro",
  GPT_5_6_TERRA = "gpt-5.6-terra",
  GPT_5_6_TERRA_PRO = "gpt-5.6-terra-pro",
  GPT_5_6_SOL = "gpt-5.6-sol",
  GPT_5_6_SOL_PRO = "gpt-5.6-sol-pro",
  GEMINI_3_6_FLASH = "gemini-3.6-flash",
  GEMINI_3_5_FLASH_LITE = "gemini-3.5-flash-lite",
  GEMINI_3_7_FLASH = "gemini-3.7-flash",
  KIMI_K3 = "kimi-k3",
  GLM_5_2 = "glm-5.2",
  MINIMAX_M3 = "minimax-m3",
  QWEN_3_7_FLASH = "qwen-3.7-flash",
  QWEN_3_8_MAX = "qwen-3.8-max",
  MIMO_V2_5 = "mimo-v2.5",
  MIMO_V2_5_PRO = "mimo-v2.5-pro",
  META_MUSE_SPARK_1_2 = "meta-muse-spark-1.2",
  MISTRAL_MEDIUM_3_5 = "mistral-medium-3.5",
  // New models added 2026-11-07
  CLAUDE_OPUS_5_5 = "claude-opus-5.5",
  CLAUDE_SONNET_5_5 = "claude-sonnet-5.5",
  CLAUDE_HAIKU_5_5 = "claude-haiku-5.5",
  CLAUDE_FABLE_5_1 = "claude-fable-5.1",
  GPT_6_ASTRA = "gpt-6-astra",
  GPT_6_ASTRA_PRO = "gpt-6-astra-pro",
  GPT_6_1_SOL = "gpt-6.1-sol",
  GPT_6_1_SOL_PRO = "gpt-6.1-sol-pro",
  GPT_6_1_TERRA = "gpt-6.1-terra",
  GPT_6_1_TERRA_PRO = "gpt-6.1-terra-pro",
  GPT_6_LUNA = "gpt-6-luna",
  GPT_6_LUNA_PRO = "gpt-6-luna-pro",
  GEMINI_4_ARGON = "gemini-4-argon",
  GEMINI_3_8_FLASH = "gemini-3.8-flash",
  GROK_4_7 = "grok-4.7",
  KIMI_K3_1_PRO = "kimi-k3.1-pro",
  DEEPSEEK_V4_1_FLASH = "deepseek-v4.1-flash",
  QWEN_3_8_FLASH = "qwen-3.8-flash",
  GLM_5_3 = "glm-5.3",
  GLM_5_3_FLASH = "glm-5.3-flash",
  MIMO_V2_6_PRO = "mimo-v2.6-pro",
  MIMO_V2_6_FLASH = "mimo-v2.6-flash",
  META_MUSE_SPARK_1_3 = "meta-muse-spark-1.3",
  META_MUSE_WONDER = "meta-muse-wonder",
  MISTRAL_LARGE_4 = "mistral-large-4",
  VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED = "venice-deepseek-v4.1-flash-uncensored",
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
        creditCost: 6.5, // updated: 2026-11-07 from unbottled.ai
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
        creditCost: 10.4, // updated: 2026-11-07 from unbottled.ai
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
        creditCost: 6.5, // updated: 2026-11-07 from unbottled.ai
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
    name: "Venice Uncensored 1.2",
    by: "veniceAI",
    description: "chat.models.descriptions.veniceUncensored",
    parameterCount: 24,
    contextWindow: 128000, // updated: 2026-11-07 from venice-api
    icon: "venice-ai-logo",
    inputs: ["text", "image"], // updated: 2026-11-07 from venice-api
    outputs: ["text"], // updated: 2026-11-07 from venice-api
    providers: [
      {
        id: ChatModelId.VENICE_UNCENSORED,
        apiProvider: ApiProvider.VENICE_AI,
        providerModel: "venice-uncensored-1-2",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.2, // updated: 2026-11-07 from venice-api
        outputTokenCost: 0.9, // updated: 2026-11-07 from venice-api
      },
      {
        id: ChatModelId.VENICE_UNCENSORED,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "venice-uncensored",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.26, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 1.17, // updated: 2026-11-07 from unbottled.ai
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
  [ChatModelId.VENICE_UNCENSORED_ROLEPLAY]: {
    name: "Venice Role Play Uncensored",
    by: "veniceAI",
    description: "chat.models.descriptions.veniceUncensoredRoleplay",
    parameterCount: 24,
    contextWindow: 128000, // updated: 2026-11-07 from venice-api
    icon: "venice-ai-logo",
    inputs: ["text", "image"], // updated: 2026-11-07 from venice-api
    outputs: ["text"], // updated: 2026-11-07 from venice-api
    providers: [
      {
        id: ChatModelId.VENICE_UNCENSORED_ROLEPLAY,
        apiProvider: ApiProvider.VENICE_AI,
        providerModel: "venice-uncensored-role-play",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.5, // updated: 2026-11-07 from venice-api
        outputTokenCost: 2, // updated: 2026-11-07 from venice-api
      },
      {
        id: ChatModelId.VENICE_UNCENSORED_ROLEPLAY,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "venice-uncensored-roleplay",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.65, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.UNCENSORED,
      ModelUtility.ROLEPLAY,
      ModelUtility.ROLEPLAY_DARK,
      ModelUtility.CREATIVE,
      ModelUtility.ADULT_EXPLICIT,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.CODING, ModelUtility.ANALYSIS],
  },
  [ChatModelId.GEMMA_4_UNCENSORED]: {
    name: "Gemma 4 26B Uncensored",
    by: "google",
    description: "chat.models.descriptions.gemma4Uncensored",
    parameterCount: 26,
    contextWindow: 256000, // updated: 2026-11-07 from venice-api
    icon: "si-googlegemini",
    inputs: ["text", "image"], // updated: 2026-11-07 from venice-api
    outputs: ["text"], // updated: 2026-11-07 from venice-api
    providers: [
      {
        id: ChatModelId.GEMMA_4_UNCENSORED,
        apiProvider: ApiProvider.VENICE_AI,
        providerModel: "gemma-4-uncensored",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.1625, // updated: 2026-11-07 from venice-api
        outputTokenCost: 0.5, // updated: 2026-11-07 from venice-api
      },
      {
        id: ChatModelId.GEMMA_4_UNCENSORED,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gemma-4-uncensored",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.2113, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.65, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.UNCENSORED,
      ModelUtility.CHAT,
      ModelUtility.FAST,
      ModelUtility.CREATIVE,
      ModelUtility.VISION,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.REASONING],
  },
  [ChatModelId.QWEN_3_6_PLUS_UNCENSORED]: {
    name: "Qwen 3.6 Plus Uncensored",
    by: "alibaba",
    description: "chat.models.descriptions.qwen36PlusUncensored",
    parameterCount: undefined,
    // Venice serves 1M but bills 4x input / 2x output past 256K tokens —
    // capped (also by the Venice price fetcher) so one flat price stays correct.
    contextWindow: 256000,
    icon: "si-alibabadotcom",
    inputs: ["text", "image"], // updated: 2026-11-07 from venice-api
    outputs: ["text"], // updated: 2026-11-07 from venice-api
    providers: [
      {
        id: ChatModelId.QWEN_3_6_PLUS_UNCENSORED,
        apiProvider: ApiProvider.VENICE_AI,
        providerModel: "qwen-3-6-plus",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.625, // updated: 2026-11-07 from venice-api
        outputTokenCost: 3.75, // updated: 2026-11-07 from venice-api
        cacheReadTokenCost: 0.0625, // updated: 2026-11-07 from venice-api
        cacheWriteTokenCost: 0.78, // updated: 2026-11-07 from venice-api
      },
      {
        id: ChatModelId.QWEN_3_6_PLUS_UNCENSORED,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "qwen-3.6-plus-uncensored",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.8125, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 4.875, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.0813, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 1.014, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.UNCENSORED,
      ModelUtility.CODING,
      ModelUtility.REASONING,
      ModelUtility.ANALYSIS,
      ModelUtility.VISION,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.GLM_4_7_FLASH_HERETIC]: {
    name: "GLM 4.7 Flash Heretic",
    by: "zAi",
    description: "chat.models.descriptions.glm47FlashHeretic",
    parameterCount: undefined,
    contextWindow: 200000, // updated: 2026-11-07 from venice-api
    icon: "si-zendesk",
    inputs: ["text"], // updated: 2026-11-07 from venice-api
    outputs: ["text"], // updated: 2026-11-07 from venice-api
    providers: [
      {
        id: ChatModelId.GLM_4_7_FLASH_HERETIC,
        apiProvider: ApiProvider.VENICE_AI,
        providerModel: "olafangensan-glm-4.7-flash-heretic",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.07, // updated: 2026-11-07 from venice-api
        outputTokenCost: 0.4, // updated: 2026-11-07 from venice-api
        cacheReadTokenCost: 0.035, // updated: 2026-11-07 from venice-api
      },
      {
        id: ChatModelId.GLM_4_7_FLASH_HERETIC,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-4.7-flash-heretic",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.091, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.52, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.0455, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.UNCENSORED,
      ModelUtility.FAST,
      ModelUtility.CHAT,
      ModelUtility.CREATIVE,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ANALYSIS],
  },
  [ChatModelId.GLM_5_3_ABLITERATED]: {
    // Abliteration.ai's "Abliterated Large V2" — GLM-5.3 with refusals ablated.
    name: "GLM 5.3 Abliterated",
    by: "abliterationAI",
    description: "chat.models.descriptions.glm53Abliterated",
    parameterCount: undefined,
    contextWindow: 1048576, // updated: 2026-11-07 from venice-api
    icon: "si-zendesk",
    inputs: ["text"], // updated: 2026-11-07 from venice-api
    outputs: ["text"], // updated: 2026-11-07 from venice-api
    providers: [
      // NanoGPT first: same price, native tool calling (Venice prompt-engineers tools).
      {
        id: ChatModelId.GLM_5_3_ABLITERATED,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "abliteration-ai/abliterated-model-large-v2",
        creditCost: calculateCreditCost,
        inputTokenCost: 3, // updated: 2026-11-07 from nano-gpt-api
        outputTokenCost: 5, // updated: 2026-11-07 from nano-gpt-api
        cacheReadTokenCost: 0.3, // updated: 2026-11-07 from nano-gpt-api
      },
      {
        id: ChatModelId.GLM_5_3_ABLITERATED,
        apiProvider: ApiProvider.VENICE_AI,
        providerModel: "abliteration-abliterated-model-large-v2",
        creditCost: calculateCreditCost,
        inputTokenCost: 3, // updated: 2026-11-07 from venice-api
        outputTokenCost: 5, // updated: 2026-11-07 from venice-api
        cacheReadTokenCost: 0.3, // updated: 2026-11-07 from venice-api
      },
      {
        id: ChatModelId.GLM_5_3_ABLITERATED,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-5.3-abliterated",
        creditCost: calculateCreditCost,
        inputTokenCost: 3.9, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 6.5, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.39, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.UNCENSORED,
      ModelUtility.SMART,
      ModelUtility.REASONING,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.ILLEGAL_INFO,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.FAST],
  },
  [ChatModelId.DEEPSEEK_V4_1_FLASH_ABLITERATED]: {
    // Abliteration.ai's "Abliterated Large Flash" — DeepSeek V4.1 Flash 1017 with refusals ablated.
    name: "DeepSeek V4.1 Flash Abliterated",
    by: "abliterationAI",
    description: "chat.models.descriptions.deepseekV41FlashAbliterated",
    parameterCount: 552,
    contextWindow: 1048576, // updated: 2026-11-07 from nano-gpt-api
    icon: "whale",
    inputs: ["text", "image"], // updated: 2026-11-07 from nano-gpt-api
    outputs: ["text"], // updated: 2026-11-07 from nano-gpt-api
    providers: [
      {
        id: ChatModelId.DEEPSEEK_V4_1_FLASH_ABLITERATED,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "abliteration-ai/abliterated-model-large-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 1, // updated: 2026-11-07 from nano-gpt-api
        outputTokenCost: 2, // updated: 2026-11-07 from nano-gpt-api
        cacheReadTokenCost: 0.1, // updated: 2026-11-07 from nano-gpt-api
      },
      {
        id: ChatModelId.DEEPSEEK_V4_1_FLASH_ABLITERATED,
        apiProvider: ApiProvider.VENICE_AI,
        providerModel: "abliteration-abliterated-model-large-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25, // updated: 2026-11-07 from venice-api
        outputTokenCost: 2.5, // updated: 2026-11-07 from venice-api
        cacheReadTokenCost: 0.125, // updated: 2026-11-07 from venice-api
      },
      {
        id: ChatModelId.DEEPSEEK_V4_1_FLASH_ABLITERATED,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "deepseek-v4.1-flash-abliterated",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.3, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.13, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.UNCENSORED,
      ModelUtility.SMART,
      ModelUtility.REASONING,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.VISION,
      ModelUtility.ILLEGAL_INFO,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.MIMO_V2_6_FLASH_ABLITERATED]: {
    name: "MiMo V2.6 Flash Abliterated",
    by: "xiaomi",
    description: "chat.models.descriptions.mimoV26FlashAbliterated",
    parameterCount: undefined,
    contextWindow: 1048576, // updated: 2026-11-07 from nano-gpt-api
    icon: "si-xiaomi",
    inputs: ["text", "image"], // updated: 2026-11-07 from nano-gpt-api
    outputs: ["text"], // updated: 2026-11-07 from nano-gpt-api
    providers: [
      {
        id: ChatModelId.MIMO_V2_6_FLASH_ABLITERATED,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "xiaomi/mimo-v2.6-flash-abliterated",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.5, // updated: 2026-11-07 from nano-gpt-api
        outputTokenCost: 1.5, // updated: 2026-11-07 from nano-gpt-api
        cacheReadTokenCost: 0.275, // updated: 2026-11-07 from nano-gpt-api
      },
      {
        id: ChatModelId.MIMO_V2_6_FLASH_ABLITERATED,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "mimo-v2.6-flash-abliterated",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.65, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 1.95, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.3575, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.UNCENSORED,
      ModelUtility.FAST,
      ModelUtility.CODING,
      ModelUtility.CREATIVE,
      ModelUtility.VISION,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.GLM_5_3_UNCENSORED]: {
    name: "GLM 5.3 Uncensored",
    by: "zAi",
    description: "chat.models.descriptions.glm53Uncensored",
    parameterCount: undefined,
    contextWindow: 1048576, // updated: 2026-11-07 from nano-gpt-api
    icon: "si-zendesk",
    inputs: ["text"], // updated: 2026-11-07 from nano-gpt-api
    outputs: ["text"], // updated: 2026-11-07 from nano-gpt-api
    providers: [
      {
        id: ChatModelId.GLM_5_3_UNCENSORED,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "z-ai/glm-5.3-uncensored",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25, // updated: 2026-11-07 from nano-gpt-api
        outputTokenCost: 2.25, // updated: 2026-11-07 from nano-gpt-api
        cacheReadTokenCost: 0.3, // updated: 2026-11-07 from nano-gpt-api
      },
      {
        id: ChatModelId.GLM_5_3_UNCENSORED,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-5.3-uncensored",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.625, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 2.925, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.39, // updated: 2026-11-07 from unbottled.ai
      },
      {
        id: ChatModelId.GLM_5_3_UNCENSORED,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "abliteration-ai/abliterated-model-large-v2",
        creditCost: calculateCreditCost,
        inputTokenCost: 3, // updated: 2026-11-07 from nano-gpt-api
        outputTokenCost: 5, // updated: 2026-11-07 from nano-gpt-api
        cacheReadTokenCost: 0.3, // updated: 2026-11-07 from nano-gpt-api
      },
      {
        id: ChatModelId.GLM_5_3_UNCENSORED,
        apiProvider: ApiProvider.VENICE_AI,
        providerModel: "abliteration-abliterated-model-large-v2",
        creditCost: calculateCreditCost,
        inputTokenCost: 3, // updated: 2026-11-07 from venice-api
        outputTokenCost: 5, // updated: 2026-11-07 from venice-api
        cacheReadTokenCost: 0.3, // updated: 2026-11-07 from venice-api
      },
    ],
    utilities: [
      ModelUtility.UNCENSORED,
      ModelUtility.SMART,
      ModelUtility.REASONING,
      ModelUtility.CODING,
      ModelUtility.CREATIVE,
      ModelUtility.ANALYSIS,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.GLM_5_3_FLASH_UNCENSORED]: {
    name: "GLM 5.3 Flash Uncensored",
    by: "zAi",
    description: "chat.models.descriptions.glm53FlashUncensored",
    parameterCount: 320,
    contextWindow: 1048576, // updated: 2026-11-07 from nano-gpt-api
    icon: "si-zendesk",
    inputs: ["text", "image"], // updated: 2026-11-07 from nano-gpt-api
    outputs: ["text"], // updated: 2026-11-07 from nano-gpt-api
    providers: [
      {
        id: ChatModelId.GLM_5_3_FLASH_UNCENSORED,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "z-ai/glm-5.3-flash-uncensored",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.2, // updated: 2026-11-07 from nano-gpt-api
        outputTokenCost: 0.8, // updated: 2026-11-07 from nano-gpt-api
        cacheReadTokenCost: 0.07, // updated: 2026-11-07 from nano-gpt-api
      },
      {
        id: ChatModelId.GLM_5_3_FLASH_UNCENSORED,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-5.3-flash-uncensored",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.26, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 1.04, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.091, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.UNCENSORED,
      ModelUtility.FAST,
      ModelUtility.CODING,
      ModelUtility.CREATIVE,
      ModelUtility.VISION,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: true },
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
        id: ChatModelId.CLAUDE_HAIKU_4_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-haiku-4.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.3, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 6.5, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.13, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 1.625, // updated: 2026-11-07 from unbottled.ai
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
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
        inputTokenCost: 6.5, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 32.5, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.65, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 8.125, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 6.5, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 32.5, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.65, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 8.125, // updated: 2026-11-07 from unbottled.ai
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
    inputs: ["text", "image"], // updated: 2026-07-02 from openrouter-api
    outputs: ["text"], // updated: 2026-07-02 from openrouter-api
    providers: [
      {
        id: ChatModelId.CLAUDE_OPUS_4_7,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-opus-4.7",
        creditCost: calculateCreditCost,
        inputTokenCost: 5, // updated: 2026-07-02 from openrouter-api
        outputTokenCost: 25, // updated: 2026-07-02 from openrouter-api
        cacheReadTokenCost: 0.5, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 6.25, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.CLAUDE_OPUS_4_7,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-opus-4.7",
        creditCost: calculateCreditCost,
        inputTokenCost: 6.5, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 32.5, // updated: 2026-11-07 from unbottled.ai
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
        cacheReadTokenCost: 0.3, // updated: 2026-07-02 from openrouter-api
        cacheWriteTokenCost: 3.75, // updated: 2026-07-02 from openrouter-api
      },
      {
        id: ChatModelId.CLAUDE_SONNET_4_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-sonnet-4.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 3.9, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 19.5, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.39, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 4.875, // updated: 2026-11-07 from unbottled.ai
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
        id: ChatModelId.CLAUDE_SONNET_4_6,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-sonnet-4.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 3.9, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 19.5, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.39, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 4.875, // updated: 2026-11-07 from unbottled.ai
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
    contextWindow: 1000000,
    icon: "si-x",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GROK_4,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "x-ai/grok-4.3",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 2.5, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.2, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GROK_4,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "grok-4.3",
        creditCost: calculateCreditCost,
        inputTokenCost: 3.9, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 19.5, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.975, // updated: 2026-11-07 from unbottled.ai
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
    contextWindow: 1000000,
    icon: "si-x",
    inputs: ["text", "image"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GROK_4_FAST,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "x-ai/grok-4.3",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.2, // updated: 2026-03-31 from openrouter-api
        outputTokenCost: 0.5, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.05, // updated: 2026-03-31 from openrouter-api
      },
      {
        id: ChatModelId.GROK_4_FAST,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "grok-4.3",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.26, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.65, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.065, // updated: 2026-11-07 from unbottled.ai
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
  [ChatModelId.GROK_4_3]: {
    name: "Grok 4.3",
    by: "xAI",
    description: "chat.models.descriptions.grok43",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-x",
    inputs: ["text", "image"], // updated: 2026-07-02 from openrouter-api
    outputs: ["text"], // updated: 2026-07-02 from openrouter-api
    providers: [
      {
        id: ChatModelId.GROK_4_3,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "x-ai/grok-4.3",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25, // updated: 2026-05-03 from openrouter-api
        outputTokenCost: 2.5, // updated: 2026-05-03 from openrouter-api
      },
      {
        id: ChatModelId.GROK_4_3,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "grok-4.3",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.625, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 3.25, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 1.25, // updated: 2026-07-02 from openrouter-api
        outputTokenCost: 2.5, // updated: 2026-07-02 from openrouter-api
        cacheReadTokenCost: 0.2, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GROK_4_20,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "grok-4.20",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.625, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 3.25, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 19.5, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 156, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 39, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 234, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 27.3, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 218.4, // updated: 2026-11-07 from unbottled.ai
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
    enabled: false, // auto-disabled: price not verified + modality not verified
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
        cacheReadTokenCost: 0.13, // updated: 2026-07-02 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_CODEX,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5-codex",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.625, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.169, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 2.275, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 18.2, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.234, // updated: 2026-11-07 from unbottled.ai
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
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
        inputTokenCost: 1.625, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.169, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 1.625, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.169, // updated: 2026-11-07 from unbottled.ai
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
    inputs: ["text", "image"], // updated: 2026-07-02 from openrouter-api
    outputs: ["text"], // updated: 2026-07-02 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 5, // updated: 2026-07-02 from openrouter-api
        outputTokenCost: 30, // updated: 2026-07-02 from openrouter-api
        cacheReadTokenCost: 0.5, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-55",
        creditCost: calculateCreditCost,
        inputTokenCost: 6.5, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 39, // updated: 2026-11-07 from unbottled.ai
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
  [ChatModelId.GPT_5_5_PRO]: {
    name: "GPT-5.5 Pro",
    by: "openAI",
    description: "chat.models.descriptions.gpt55Pro",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-07-02 from openrouter-api
    outputs: ["text"], // updated: 2026-07-02 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_5_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.5-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 30, // updated: 2026-07-02 from openrouter-api
        outputTokenCost: 180, // updated: 2026-07-02 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_5_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-55-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 39, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 234, // updated: 2026-11-07 from unbottled.ai
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
        cacheReadTokenCost: 0.25, // updated: 2026-07-02 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_4,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-54",
        creditCost: calculateCreditCost,
        inputTokenCost: 3.25, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 19.5, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.325, // updated: 2026-11-07 from unbottled.ai
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
        cacheReadTokenCost: 0.08, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_4_MINI,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5.4-mini",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.975, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 5.85, // updated: 2026-11-07 from unbottled.ai
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CODING,
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
        cacheReadTokenCost: 0.02, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_4_NANO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5.4-nano",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.26, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 1.625, // updated: 2026-11-07 from unbottled.ai
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
        cacheReadTokenCost: 0.18, // updated: 2026-07-02 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_2,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-52",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.275, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 18.2, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.234, // updated: 2026-11-07 from unbottled.ai
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
    enabled: false, // auto-disabled: price not verified + modality not verified
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
        inputTokenCost: 2.275, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 18.2, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.234, // updated: 2026-11-07 from unbottled.ai
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.CHAT,
      ModelUtility.FAST,
      ModelUtility.SMART,
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
        inputTokenCost: 2.275, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 18.2, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.234, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 1.625, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.169, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 0.325, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.039, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 0.065, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.52, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.013, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 0.02, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 0.07, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.02, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_OSS_120B,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-oss-120b-free",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.039, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.195, // updated: 2026-11-07 from unbottled.ai
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
    inputs: ["text", "image"], // updated: 2026-07-02 from openrouter-api
    outputs: ["text"], // updated: 2026-07-02 from openrouter-api
    providers: [
      {
        id: ChatModelId.KIMI_K2_6,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "moonshotai/kimi-k2.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.65, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 3.41, // updated: 2026-07-02 from openrouter-api
        cacheReadTokenCost: 0.15, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.KIMI_K2_6,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kimi-k2.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.858, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 4.433, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
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
    contextWindow: 262144,
    icon: "moon",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.KIMI_K2,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "moonshotai/kimi-k2-0905",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.6, // updated: 2026-07-02 from openrouter-api
        outputTokenCost: 2.5, // updated: 2026-07-02 from openrouter-api
        cacheReadTokenCost: 0.14, // updated: 2026-07-02 from openrouter-api
      },
      {
        id: ChatModelId.KIMI_K2,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kimi-k2",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.78, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 3.25, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.182, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 0.5, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 2.5, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.15, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.KIMI_K2_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kimi_k2_5",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.494, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 2.639, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.247, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
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
    contextWindow: 262144,
    icon: "moon",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.KIMI_K2_THINKING,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "moonshotai/kimi-k2-thinking",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.6, // updated: 2026-07-02 from openrouter-api
        outputTokenCost: 2.5, // updated: 2026-07-02 from openrouter-api
        cacheReadTokenCost: 0.15, // updated: 2026-07-02 from openrouter-api
      },
      {
        id: ChatModelId.KIMI_K2_THINKING,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kimi-k2-thinking",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.78, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 3.25, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.195, // updated: 2026-11-07 from unbottled.ai
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
    contextWindow: 204800,
    icon: "si-zendesk",
    inputs: ["text"], // updated: 2026-07-02 from openrouter-api
    outputs: ["text"], // updated: 2026-07-02 from openrouter-api
    providers: [
      {
        id: ChatModelId.GLM_5_1,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-5.1",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.4, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 4.4, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.26, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GLM_5_1,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-5.1",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.274, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 5.59, // updated: 2026-11-07 from unbottled.ai
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
  [ChatModelId.GLM_5]: {
    name: "GLM-5",
    by: "zAi",
    description: "chat.models.descriptions.glm5",
    parameterCount: undefined,
    contextWindow: 204800,
    icon: "si-zendesk",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GLM_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 1, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 3.2, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.2, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GLM_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.78, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 2.496, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.156, // updated: 2026-11-07 from unbottled.ai
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
        cacheReadTokenCost: 0.24, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GLM_5_TURBO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-5-turbo",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.56, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 5.2, // updated: 2026-11-07 from unbottled.ai
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
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
    contextWindow: 204800,
    icon: "si-zendesk",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.GLM_4_7,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-4.7",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.6, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 2.2, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.11, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GLM_4_7,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-4.7",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.52, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 2.275, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.104, // updated: 2026-11-07 from unbottled.ai
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
    contextWindow: 200000,
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
        inputTokenCost: 0.078, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.52, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.013, // updated: 2026-11-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CHAT, ModelUtility.FAST],
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
        inputTokenCost: 0.169, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 1.105, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.039, // updated: 2026-11-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CHAT, ModelUtility.FAST],
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
        inputTokenCost: 0.5, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 2, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.1, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GLM_4_6,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-4.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.559, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 2.262, // updated: 2026-11-07 from unbottled.ai
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
        cacheReadTokenCost: 0.11, // updated: 2026-07-02 from openrouter-api
      },
      {
        id: ChatModelId.GLM_4_5V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-4.5v",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.78, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 2.34, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.143, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 0.21, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 0.84, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.04, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.MINIMAX_M2_7,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "minimax-m2.7",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.234, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.936, // updated: 2026-11-07 from unbottled.ai
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
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.MIMO_V2_PRO]: {
    name: "MiMo V2 Pro",
    by: "xiaomi",
    description: "chat.models.descriptions.mimoV2Pro",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-xiaomi",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.MIMO_V2_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "xiaomi/mimo-v2.5-pro", // v2-pro deprecated by provider, redirected to v2.5-pro
        creditCost: calculateCreditCost,
        inputTokenCost: 0.48, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 1.8, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.1, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.MIMO_V2_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "mimo-v2.5-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.3965, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.7917, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 0.13, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.52, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.013, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 0.104, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 0.39, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 3.25, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.039, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 0.104, // updated: 2026-11-07 from unbottled.ai
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
    name: "Gemini 2.5 Pro",
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
        inputTokenCost: 1.625, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.169, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 0.494, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 15.6, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.26, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 0.494, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 0.65, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 3.9, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 0.325, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 1.95, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.039, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 0.104, // updated: 2026-11-07 from unbottled.ai
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.CHAT,
      ModelUtility.FAST,
      ModelUtility.ANALYSIS,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      toolCalling: true,
    },
  },
  [ChatModelId.GEMINI_3_5_FLASH]: {
    name: "Gemini 3.5 Flash",
    by: "google",
    description: "chat.models.descriptions.gemini35Flash",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    inputs: ["text", "image", "video", "audio"], // updated: 2026-05-21 from openrouter-api (also supports pdf)
    outputs: ["text"], // updated: 2026-05-21 from openrouter-api
    providers: [
      {
        id: ChatModelId.GEMINI_3_5_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3.5-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.5, // updated: 2026-07-02 from openrouter-api
        outputTokenCost: 9, // updated: 2026-07-02 from openrouter-api
        cacheReadTokenCost: 0.15, // updated: 2026-07-02 from openrouter-api
        cacheWriteTokenCost: 0.08, // updated: 2026-05-21 from openrouter-api
      },
      {
        id: ChatModelId.GEMINI_3_5_FLASH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gemini-3.5-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.95, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 11.7, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.195, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 0.104, // updated: 2026-11-07 from unbottled.ai
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.FAST,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
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
        inputTokenCost: 0.65, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 3.9, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.065, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 0.104, // updated: 2026-11-07 from unbottled.ai
      },
    ],

    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.FAST,
      ModelUtility.LEGACY,
    ],
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
        inputTokenCost: 0.63, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 1.25, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.05, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.DEEPSEEK_V4_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "deepseek-v4-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.572, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 1.131, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 0.09, // updated: 2026-07-02 from openrouter-api
        outputTokenCost: 0.18, // updated: 2026-07-02 from openrouter-api
        cacheReadTokenCost: 0.02, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.DEEPSEEK_V4_FLASH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "deepseek-v4-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.117, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.234, // updated: 2026-11-07 from unbottled.ai
      },
    ],

    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.FAST,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
    ],
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
        inputTokenCost: 0.26, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 0.38, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.13, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.DEEPSEEK_V32,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "deepseek-v3.2",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.299, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.442, // updated: 2026-11-07 from unbottled.ai
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
    contextWindow: 163840,
    icon: "whale",
    inputs: ["text"], // updated: 2026-04-03 from openrouter-api
    outputs: ["text"], // updated: 2026-04-03 from openrouter-api
    providers: [
      {
        id: ChatModelId.DEEPSEEK_V31,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "deepseek/deepseek-chat-v3.1",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.25, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 0.95, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.13, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.DEEPSEEK_V31,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "deepseek-v3.1",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.273, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 1.027, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 0.5, // updated: 2026-07-02 from openrouter-api
        outputTokenCost: 2.15, // updated: 2026-03-31 from openrouter-api
        cacheReadTokenCost: 0.35, // updated: 2026-07-02 from openrouter-api
      },
      {
        id: ChatModelId.DEEPSEEK_R1,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "deepseek-r1",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.65, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 2.795, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.455, // updated: 2026-11-07 from unbottled.ai
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
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.QWEN3_235B_FREE]: {
    enabled: false, // auto-disabled: price not verified + modality not verified
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
        inputTokenCost: 0.585, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 2.366, // updated: 2026-11-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.SMART, ModelUtility.CODING],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },
  [ChatModelId.DEEPSEEK_R1_DISTILL]: {
    enabled: false, // auto-disabled: price not verified + modality not verified
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
        inputTokenCost: 0.377, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.377, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 0.1, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 0.2, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.QWEN_2_5_7B,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "qwen-2-5-7b",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.052, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.13, // updated: 2026-11-07 from unbottled.ai
      },
    ],

    utilities: [ModelUtility.LEGACY, ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ANALYSIS, ModelUtility.CODING],
  },
  // Claude Code provider variant aliases - admin-only Claude Code API access points
  // These share the same model characteristics as their OpenRouter counterparts
  [ChatModelId.CLAUDE_CODE_HAIKU]: {
    enabledWithoutPrice: true,
    name: "Claude Haiku 5.5",
    by: "anthropic",
    description: "chat.models.descriptions.claudeHaiku55",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text"],
    outputs: ["text"],
    providers: [
      {
        id: ChatModelId.CLAUDE_CODE_HAIKU,
        apiProvider: ApiProvider.CLAUDE_CODE,
        providerModel: "claude-haiku-5-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.1,
        outputTokenCost: 0.5,
        adminOnly: true,
      },
      {
        id: ChatModelId.CLAUDE_CODE_HAIKU,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-code-haiku",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.13, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.65, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
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
    enabledWithoutPrice: true,
    name: "Claude Sonnet 5.5",
    by: "anthropic",
    description: "chat.models.descriptions.claudeSonnet55",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text"],
    outputs: ["text"],
    providers: [
      {
        id: ChatModelId.CLAUDE_CODE_SONNET,
        apiProvider: ApiProvider.CLAUDE_CODE,
        providerModel: "claude-sonnet-5-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 2,
        outputTokenCost: 10,
        adminOnly: true,
      },
      {
        id: ChatModelId.CLAUDE_CODE_SONNET,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-code-sonnet",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
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
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },
  [ChatModelId.CLAUDE_CODE_OPUS]: {
    enabledWithoutPrice: true,
    name: "Claude Opus 5.5",
    by: "anthropic",
    description: "chat.models.descriptions.claudeOpus55",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text"],
    outputs: ["text"],
    providers: [
      {
        id: ChatModelId.CLAUDE_CODE_OPUS,
        apiProvider: ApiProvider.CLAUDE_CODE,
        providerModel: "claude-opus-5-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 4,
        outputTokenCost: 20,
        adminOnly: true,
      },
      {
        id: ChatModelId.CLAUDE_CODE_OPUS,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-code-opus",
        creditCost: calculateCreditCost,
        inputTokenCost: 5.2, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 26, // updated: 2026-11-07 from unbottled.ai
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
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },
  [ChatModelId.CLAUDE_CODE_FABLE]: {
    enabledWithoutPrice: true,
    name: "Claude Fable 5.1",
    by: "anthropic",
    description: "chat.models.descriptions.claudeFable51",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text"],
    outputs: ["text"],
    providers: [
      {
        id: ChatModelId.CLAUDE_CODE_FABLE,
        apiProvider: ApiProvider.CLAUDE_CODE,
        providerModel: "claude-fable-5-1",
        creditCost: calculateCreditCost,
        inputTokenCost: 10,
        outputTokenCost: 50,
        adminOnly: true,
      },
      {
        id: ChatModelId.CLAUDE_CODE_FABLE,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-code-fable",
        creditCost: calculateCreditCost,
        inputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 65, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
      ModelUtility.CREATIVE,
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
        inputTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 15.6, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.26, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 0.494, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 3.25, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.325, // updated: 2026-11-07 from unbottled.ai
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
        inputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 1.625, // updated: 2026-11-07 from unbottled.ai
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
    inputs: ["text", "image"], // updated: 2026-07-02 from openrouter-api
    outputs: ["text", "image"], // updated: 2026-07-02 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_4_IMAGE_2,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.4-image-2",
        creditCost: calculateCreditCost,
        inputTokenCost: 8, // updated: 2026-07-02 from openrouter-api
        outputTokenCost: 15, // updated: 2026-07-02 from openrouter-api
        cacheReadTokenCost: 2, // updated: 2026-07-02 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_4_IMAGE_2,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5.4-image-2",
        creditCost: calculateCreditCost,
        inputTokenCost: 10.4, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 19.5, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
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

  // ── New models added 2026-08-16 ───────────────────────────────────────────

  [ChatModelId.CLAUDE_OPUS_4_8]: {
    name: "Claude Opus 4.8",
    by: "anthropic",
    description: "chat.models.descriptions.claudeOpus48",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.CLAUDE_OPUS_4_8,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-opus-4.8",
        creditCost: calculateCreditCost,
        inputTokenCost: 5, // updated: 2026-08-16 from openrouter-api
        outputTokenCost: 25, // updated: 2026-08-16 from openrouter-api
        cacheReadTokenCost: 0.5, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 6.25, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.CLAUDE_OPUS_4_8,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-opus-4.8",
        creditCost: calculateCreditCost,
        inputTokenCost: 6.5, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 32.5, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.65, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 8.125, // updated: 2026-11-07 from unbottled.ai
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
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },

  [ChatModelId.CLAUDE_SONNET_5]: {
    name: "Claude Sonnet 5",
    by: "anthropic",
    description: "chat.models.descriptions.claudeSonnet5",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.CLAUDE_SONNET_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-sonnet-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-08-16 from openrouter-api
        outputTokenCost: 10, // updated: 2026-08-16 from openrouter-api
        cacheReadTokenCost: 0.2, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 2.5, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.CLAUDE_SONNET_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-sonnet-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.26, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 3.25, // updated: 2026-11-07 from unbottled.ai
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
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },

  [ChatModelId.CLAUDE_OPUS_5]: {
    name: "Claude Opus 5",
    by: "anthropic",
    description: "chat.models.descriptions.claudeOpus5",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.CLAUDE_OPUS_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-opus-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 5, // updated: 2026-08-16 from openrouter-api
        outputTokenCost: 25, // updated: 2026-08-16 from openrouter-api
        cacheReadTokenCost: 0.5, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 6.25, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.CLAUDE_OPUS_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-opus-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 6.5, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 32.5, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.65, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 8.125, // updated: 2026-11-07 from unbottled.ai
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
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },

  [ChatModelId.CLAUDE_OPUS_5_FAST]: {
    enabled: false, // auto-disabled: price not verified + modality not verified
    name: "Claude Opus 5 Fast",
    by: "anthropic",
    description: "chat.models.descriptions.claudeOpus5Fast",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text", "image"],
    outputs: ["text"],
    providers: [
      {
        id: ChatModelId.CLAUDE_OPUS_5_FAST,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-opus-5-fast",
        creditCost: calculateCreditCost,
        inputTokenCost: 10, // updated: 2026-08-16 from openrouter-api
        outputTokenCost: 50, // updated: 2026-08-16 from openrouter-api
        cacheReadTokenCost: 1,
        cacheWriteTokenCost: 12.5,
      },
      {
        id: ChatModelId.CLAUDE_OPUS_5_FAST,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-opus-5-fast",
        creditCost: calculateCreditCost,
        inputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 65, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 1.3, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 16.25, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.FAST,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },

  [ChatModelId.CLAUDE_FABLE_5]: {
    name: "Claude Fable 5",
    by: "anthropic",
    description: "chat.models.descriptions.claudeFable5",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.CLAUDE_FABLE_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-fable-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 10, // updated: 2026-08-16 from openrouter-api
        outputTokenCost: 50, // updated: 2026-08-16 from openrouter-api
        cacheReadTokenCost: 1, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 12.5, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.CLAUDE_FABLE_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-fable-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 65, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 1.3, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 16.25, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
      ModelUtility.CREATIVE,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },

  [ChatModelId.GROK_4_5]: {
    name: "Grok 4.5",
    by: "xAI",
    description: "chat.models.descriptions.grok45",
    parameterCount: undefined,
    contextWindow: 500000,
    icon: "si-x",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GROK_4_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "x-ai/grok-4.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-08-16 from openrouter-api
        outputTokenCost: 6, // updated: 2026-08-16 from openrouter-api
        cacheReadTokenCost: 0.3, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GROK_4_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "grok-4.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 7.8, // updated: 2026-11-07 from unbottled.ai
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

  [ChatModelId.GROK_4_6]: {
    name: "Grok 4.6",
    by: "xAI",
    description: "chat.models.descriptions.grok46",
    parameterCount: undefined,
    contextWindow: 500000,
    icon: "si-x",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GROK_4_6,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "x-ai/grok-4.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-08-16 from openrouter-api
        outputTokenCost: 6, // updated: 2026-08-16 from openrouter-api
        cacheReadTokenCost: 0.5, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GROK_4_6,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "grok-4.6",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 7.8, // updated: 2026-11-07 from unbottled.ai
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

  [ChatModelId.GPT_5_6_LUNA]: {
    name: "GPT-5.6 Luna",
    by: "openAI",
    description: "chat.models.descriptions.gpt56Luna",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_6_LUNA,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.6-luna",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.2, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 1.2, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.02, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 0.25, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_6_LUNA,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5.6-luna",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.13, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.78, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [ModelUtility.LEGACY, ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY],
  },

  [ChatModelId.GPT_5_6_LUNA_PRO]: {
    name: "GPT-5.6 Luna Pro",
    by: "openAI",
    description: "chat.models.descriptions.gpt56LunaPro",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_6_LUNA_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.6-luna-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.2, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 1.2, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.02, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 0.25, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_6_LUNA_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5.6-luna-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.13, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.78, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.CHAT,
      ModelUtility.FAST,
      ModelUtility.CODING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY],
  },

  [ChatModelId.GPT_5_6_TERRA]: {
    name: "GPT-5.6 Terra",
    by: "openAI",
    description: "chat.models.descriptions.gpt56Terra",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_6_TERRA,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.6-terra",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 12, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.2, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 2.5, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_6_TERRA,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5.6-terra",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.3, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 7.8, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.CHAT,
      ModelUtility.ANALYSIS,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY],
  },

  [ChatModelId.GPT_5_6_TERRA_PRO]: {
    name: "GPT-5.6 Terra Pro",
    by: "openAI",
    description: "chat.models.descriptions.gpt56TerraPro",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_6_TERRA_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.6-terra-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 12, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.2, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 2.5, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_6_TERRA_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5.6-terra-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.3, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 7.8, // updated: 2026-11-07 from unbottled.ai
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
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY],
  },

  [ChatModelId.GPT_5_6_SOL]: {
    name: "GPT-5.6 Sol",
    by: "openAI",
    description: "chat.models.descriptions.gpt56Sol",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_6_SOL,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.6-sol",
        creditCost: calculateCreditCost,
        inputTokenCost: 4, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 20, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.4, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 5, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_6_SOL,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5.6-sol",
        creditCost: calculateCreditCost,
        inputTokenCost: 6.5, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 39, // updated: 2026-11-07 from unbottled.ai
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
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY],
  },

  [ChatModelId.GPT_5_6_SOL_PRO]: {
    name: "GPT-5.6 Sol Pro",
    by: "openAI",
    description: "chat.models.descriptions.gpt56SolPro",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_5_6_SOL_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-5.6-sol-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 4, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 20, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.4, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 5, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_5_6_SOL_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-5.6-sol-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 6.5, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 39, // updated: 2026-11-07 from unbottled.ai
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
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY],
  },

  [ChatModelId.GEMINI_3_6_FLASH]: {
    name: "Gemini 3.6 Flash",
    by: "google",
    description: "chat.models.descriptions.gemini36Flash",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    inputs: ["text", "image", "video", "audio"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GEMINI_3_6_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3.6-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.75, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 3.75, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.08, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 0.04, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GEMINI_3_6_FLASH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gemini-3.6-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.95, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 9.75, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.195, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 0.104, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.FAST,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.GEMINI_3_5_FLASH_LITE]: {
    name: "Gemini 3.5 Flash Lite",
    by: "google",
    description: "chat.models.descriptions.gemini35FlashLite",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    inputs: ["text", "image", "video", "audio"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GEMINI_3_5_FLASH_LITE,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3.5-flash-lite",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.3, // updated: 2026-08-16 from openrouter-api
        outputTokenCost: 2.5, // updated: 2026-08-16 from openrouter-api
        cacheReadTokenCost: 0.03, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 0.08, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GEMINI_3_5_FLASH_LITE,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gemini-3.5-flash-lite",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.39, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 3.25, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.039, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 0.104, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.GEMINI_3_7_FLASH]: {
    name: "Gemini 3.7 Flash",
    by: "google",
    description: "chat.models.descriptions.gemini37Flash",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    inputs: ["text", "image", "video", "audio"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GEMINI_3_7_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3.7-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.75, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 3.75, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.08, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 0.04, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GEMINI_3_7_FLASH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gemini-3.7-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.4875, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 2.4375, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.0494, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 0.052, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.FAST,
      ModelUtility.ANALYSIS,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.KIMI_K3]: {
    name: "Kimi K3",
    by: "moonshotAI",
    description: "chat.models.descriptions.kimiK3",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "moon",
    inputs: ["text", "image", "video"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.KIMI_K3,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "moonshotai/kimi-k3",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.19, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 16, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.18, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.KIMI_K3,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kimi-k3",
        creditCost: calculateCreditCost,
        inputTokenCost: 3.64, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 18.2, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.CREATIVE,
      ModelUtility.VISION,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.GLM_5_2]: {
    name: "GLM-5.2",
    by: "zAi",
    description: "chat.models.descriptions.glm52",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-zendesk",
    inputs: ["text"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GLM_5_2,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-5.2",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.01, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 6.8, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.01, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GLM_5_2,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-5.2",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.4004, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 1.2584, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
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

  [ChatModelId.MINIMAX_M3]: {
    name: "MiniMax M3",
    by: "miniMax",
    description: "chat.models.descriptions.minimaxM3",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-minimax",
    inputs: ["text", "image", "video"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.MINIMAX_M3,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "minimax/minimax-m3",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.3, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 1.2, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.06, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.MINIMAX_M3,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "minimax-m3",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.299, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 1.248, // updated: 2026-11-07 from unbottled.ai
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

  [ChatModelId.QWEN_3_7_FLASH]: {
    name: "Qwen 3.7 Flash",
    by: "alibaba",
    description: "chat.models.descriptions.qwen37Flash",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-alibabadotcom",
    inputs: ["text", "image", "video"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.QWEN_3_7_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "qwen/qwen3.7-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.03, // updated: 2026-08-16 from openrouter-api
        outputTokenCost: 0.13, // updated: 2026-08-16 from openrouter-api
        cacheReadTokenCost: 0.01, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 0.04, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.QWEN_3_7_FLASH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "qwen-3.7-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.039, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.169, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.QWEN_3_8_MAX]: {
    name: "Qwen 3.8 Max",
    by: "alibaba",
    description: "chat.models.descriptions.qwen38Max",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-alibabadotcom",
    inputs: ["text", "image", "video"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.QWEN_3_8_MAX,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "qwen/qwen3.8-max-0902",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-08-16 from openrouter-api
        outputTokenCost: 6, // updated: 2026-08-16 from openrouter-api
        cacheReadTokenCost: 0.25, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.QWEN_3_8_MAX,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "qwen-3.8-max",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 7.8, // updated: 2026-11-07 from unbottled.ai
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

  [ChatModelId.MIMO_V2_5]: {
    name: "MiMo V2.5",
    by: "xiaomi",
    description: "chat.models.descriptions.mimoV25",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-xiaomi",
    inputs: ["text", "image", "video", "audio"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.MIMO_V2_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "xiaomi/mimo-v2.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.4, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 2, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.08, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.MIMO_V2_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "mimo-v2.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.1547, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.3094, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.CHAT,
      ModelUtility.FAST,
      ModelUtility.CODING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.MIMO_V2_5_PRO]: {
    name: "MiMo V2.5 Pro",
    by: "xiaomi",
    description: "chat.models.descriptions.mimoV25Pro",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-xiaomi",
    inputs: ["text"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.MIMO_V2_5_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "xiaomi/mimo-v2.5-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.305, // updated: 2026-08-16 from openrouter-api
        outputTokenCost: 0.609, // updated: 2026-08-16 from openrouter-api
      },
      {
        id: ChatModelId.MIMO_V2_5_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "mimo-v2.5-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.3965, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.7917, // updated: 2026-11-07 from unbottled.ai
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

  [ChatModelId.META_MUSE_SPARK_1_2]: {
    name: "Meta Muse Spark 1.2",
    by: "meta",
    description: "chat.models.descriptions.metaMuseSpark12",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "cpu",
    inputs: ["text", "image", "video"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.META_MUSE_SPARK_1_2,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "meta/muse-spark-1.2",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25, // updated: 2026-08-16 from openrouter-api
        outputTokenCost: 4.25, // updated: 2026-08-16 from openrouter-api
        cacheReadTokenCost: 0.15, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.META_MUSE_SPARK_1_2,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "meta-muse-spark-1.2",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.625, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 5.525, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
      ModelUtility.VISION,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.MISTRAL_MEDIUM_3_5]: {
    name: "Mistral Medium 3.5",
    by: "mistralAI",
    description: "chat.models.descriptions.mistralMedium35",
    parameterCount: undefined,
    contextWindow: 262144,
    icon: "si-mistralai",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.MISTRAL_MEDIUM_3_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "mistralai/mistral-medium-3-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.5, // updated: 2026-08-16 from openrouter-api
        outputTokenCost: 7.5, // updated: 2026-08-16 from openrouter-api
      },
      {
        id: ChatModelId.MISTRAL_MEDIUM_3_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "mistral-medium-3.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.95, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 9.75, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.LEGACY,
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.VISION,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.CLAUDE_OPUS_5_5]: {
    name: "Claude Opus 5.5",
    by: "anthropic",
    description: "chat.models.descriptions.claudeOpus55",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.CLAUDE_CODE_OPUS,
        apiProvider: ApiProvider.CLAUDE_CODE,
        providerModel: "claude-opus-5-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 4,
        outputTokenCost: 20,
        adminOnly: true,
      },
      {
        id: ChatModelId.CLAUDE_OPUS_5_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-opus-5.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 4, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 20, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.2, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 5, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.CLAUDE_OPUS_5_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-opus-5.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 5.2, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 26, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.26, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 6.5, // updated: 2026-11-07 from unbottled.ai
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

  [ChatModelId.CLAUDE_SONNET_5_5]: {
    name: "Claude Sonnet 5.5",
    by: "anthropic",
    description: "chat.models.descriptions.claudeSonnet55",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.CLAUDE_CODE_SONNET,
        apiProvider: ApiProvider.CLAUDE_CODE,
        providerModel: "claude-sonnet-5-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 2,
        outputTokenCost: 10,
        adminOnly: true,
      },
      {
        id: ChatModelId.CLAUDE_SONNET_5_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-sonnet-5.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 10, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.1, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 2.5, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.CLAUDE_SONNET_5_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-sonnet-5.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.13, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 3.25, // updated: 2026-11-07 from unbottled.ai
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

  [ChatModelId.CLAUDE_HAIKU_5_5]: {
    name: "Claude Haiku 5.5",
    by: "anthropic",
    description: "chat.models.descriptions.claudeHaiku55",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.CLAUDE_CODE_HAIKU,
        apiProvider: ApiProvider.CLAUDE_CODE,
        providerModel: "claude-haiku-5-5",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.1,
        outputTokenCost: 0.5,
        adminOnly: true,
      },
      {
        id: ChatModelId.CLAUDE_HAIKU_5_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-haiku-5.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.1, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 0.5, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.01, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 0.13, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.CLAUDE_HAIKU_5_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-haiku-5.5",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.13, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.65, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.013, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 0.1625, // updated: 2026-11-07 from unbottled.ai
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

  [ChatModelId.CLAUDE_FABLE_5_1]: {
    name: "Claude Fable 5.1",
    by: "anthropic",
    description: "chat.models.descriptions.claudeFable51",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-anthropic",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.CLAUDE_CODE_FABLE,
        apiProvider: ApiProvider.CLAUDE_CODE,
        providerModel: "claude-fable-5-1",
        creditCost: calculateCreditCost,
        inputTokenCost: 10,
        outputTokenCost: 50,
        adminOnly: true,
      },
      {
        id: ChatModelId.CLAUDE_FABLE_5_1,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "anthropic/claude-fable-5.1",
        creditCost: calculateCreditCost,
        inputTokenCost: 10, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 50, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.25, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 12.5, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.CLAUDE_FABLE_5_1,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "claude-fable-5.1",
        creditCost: calculateCreditCost,
        inputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 65, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.325, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 16.25, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.SMART,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
      ModelUtility.CREATIVE,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY, ModelUtility.CONTROVERSIAL],
  },

  [ChatModelId.GPT_6_ASTRA]: {
    name: "GPT-6 Astra",
    by: "openAI",
    description: "chat.models.descriptions.gpt6Astra",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_6_ASTRA,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-6-astra",
        creditCost: calculateCreditCost,
        inputTokenCost: 10, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 50, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 1, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 12.5, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_6_ASTRA,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-6-astra",
        creditCost: calculateCreditCost,
        inputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 65, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 1.3, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 16.25, // updated: 2026-11-07 from unbottled.ai
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
    weaknesses: [ModelUtility.ROLEPLAY],
  },

  [ChatModelId.GPT_6_ASTRA_PRO]: {
    name: "GPT-6 Astra Pro",
    by: "openAI",
    description: "chat.models.descriptions.gpt6AstraPro",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_6_ASTRA_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-6-astra-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 10, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 50, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 1, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 12.5, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_6_ASTRA_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-6-astra-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 65, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 1.3, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 16.25, // updated: 2026-11-07 from unbottled.ai
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
    weaknesses: [ModelUtility.ROLEPLAY],
  },

  [ChatModelId.GPT_6_1_SOL]: {
    name: "GPT-6.1 Sol",
    by: "openAI",
    description: "chat.models.descriptions.gpt61Sol",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_6_1_SOL,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-6.1-sol",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 10, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.1, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 2.5, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_6_1_SOL,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-6.1-sol",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.13, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 3.25, // updated: 2026-11-07 from unbottled.ai
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
    weaknesses: [ModelUtility.ROLEPLAY],
  },

  [ChatModelId.GPT_6_1_SOL_PRO]: {
    name: "GPT-6.1 Sol Pro",
    by: "openAI",
    description: "chat.models.descriptions.gpt61SolPro",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_6_1_SOL_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-6.1-sol-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 10, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.1, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 2.5, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_6_1_SOL_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-6.1-sol-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.13, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 3.25, // updated: 2026-11-07 from unbottled.ai
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
    weaknesses: [ModelUtility.ROLEPLAY],
  },

  [ChatModelId.GPT_6_1_TERRA]: {
    name: "GPT-6.1 Terra",
    by: "openAI",
    description: "chat.models.descriptions.gpt61Terra",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_6_1_TERRA,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-6.1-terra",
        creditCost: calculateCreditCost,
        inputTokenCost: 1, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 5, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.05, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 1.25, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_6_1_TERRA,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-6.1-terra",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.3, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 6.5, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.065, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 1.625, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.CHAT,
      ModelUtility.ANALYSIS,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY],
  },

  [ChatModelId.GPT_6_1_TERRA_PRO]: {
    name: "GPT-6.1 Terra Pro",
    by: "openAI",
    description: "chat.models.descriptions.gpt61TerraPro",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_6_1_TERRA_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-6.1-terra-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 1, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 5, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.05, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 1.25, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_6_1_TERRA_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-6.1-terra-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.3, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 6.5, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.065, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 1.625, // updated: 2026-11-07 from unbottled.ai
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
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY],
  },

  [ChatModelId.GPT_6_LUNA]: {
    name: "GPT-6 Luna",
    by: "openAI",
    description: "chat.models.descriptions.gpt6Luna",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_6_LUNA,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-6-luna",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.1, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 0.5, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.01, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 0.13, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_6_LUNA,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-6-luna",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.13, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.65, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.013, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 0.1625, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [ModelUtility.CHAT, ModelUtility.FAST],
    supportsTools: true,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY],
  },

  [ChatModelId.GPT_6_LUNA_PRO]: {
    name: "GPT-6 Luna Pro",
    by: "openAI",
    description: "chat.models.descriptions.gpt6LunaPro",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-openai",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GPT_6_LUNA_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/gpt-6-luna-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.1, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 0.5, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.01, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 0.13, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GPT_6_LUNA_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gpt-6-luna-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.13, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.65, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.013, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 0.1625, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [ModelUtility.CHAT, ModelUtility.FAST, ModelUtility.CODING],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
    weaknesses: [ModelUtility.ROLEPLAY],
  },

  [ChatModelId.GEMINI_4_ARGON]: {
    name: "Gemini 4 Argon",
    by: "google",
    description: "chat.models.descriptions.gemini4Argon",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    inputs: ["text", "image", "video", "audio"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GEMINI_4_ARGON,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-4-argon",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 10, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.1, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 0.19, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GEMINI_4_ARGON,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gemini-4-argon",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.13, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 0.2444, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
      ModelUtility.VISION,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.GEMINI_3_8_FLASH]: {
    name: "Gemini 3.8 Flash",
    by: "google",
    description: "chat.models.descriptions.gemini38Flash",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-googlegemini",
    inputs: ["text", "image", "video", "audio"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GEMINI_3_8_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/gemini-3.8-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.83, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 4.13, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.08, // updated: 2026-11-07 from openrouter-api
        cacheWriteTokenCost: 0.04, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GEMINI_3_8_FLASH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gemini-3.8-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.0725, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 5.3625, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.1079, // updated: 2026-11-07 from unbottled.ai
        cacheWriteTokenCost: 0.0546, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.FAST,
      ModelUtility.ANALYSIS,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.GROK_4_7]: {
    name: "Grok 4.7",
    by: "xAI",
    description: "chat.models.descriptions.grok47",
    parameterCount: undefined,
    contextWindow: 500000,
    icon: "si-x",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GROK_4_7,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "x-ai/grok-4.7",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 6, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.5, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GROK_4_7,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "grok-4.7",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 7.8, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.65, // updated: 2026-11-07 from unbottled.ai
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

  [ChatModelId.KIMI_K3_1_PRO]: {
    name: "Kimi K3.1 Pro",
    by: "moonshotAI",
    description: "chat.models.descriptions.kimiK31Pro",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "moon",
    inputs: ["text", "image", "video"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.KIMI_K3_1_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "moonshotai/kimi-k3.1-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 2, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 10, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.2, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.KIMI_K3_1_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kimi-k3.1-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 2.6, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 13, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.26, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.CREATIVE,
      ModelUtility.VISION,
      ModelUtility.REASONING,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.DEEPSEEK_V4_1_FLASH]: {
    name: "DeepSeek V4.1 Flash",
    by: "deepSeek",
    description: "chat.models.descriptions.deepseekV41Flash",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "whale",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.DEEPSEEK_V4_1_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "deepseek/deepseek-v4.1-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.05, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 0.57, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.02, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.DEEPSEEK_V4_1_FLASH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "deepseek-v4.1-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.0663, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.7371, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.0234, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.FAST,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.VISION,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.QWEN_3_8_FLASH]: {
    name: "Qwen 3.8 Flash",
    by: "alibaba",
    description: "chat.models.descriptions.qwen38Flash",
    parameterCount: undefined,
    contextWindow: 1000000,
    icon: "si-alibabadotcom",
    inputs: ["text", "image", "video"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.QWEN_3_8_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "qwen/qwen3.8-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.15, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 0.47, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.02, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.QWEN_3_8_FLASH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "qwen-3.8-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.195, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.611, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.0208, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.CHAT,
      ModelUtility.FAST,
      ModelUtility.CODING,
      ModelUtility.VISION,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.GLM_5_3]: {
    name: "GLM-5.3",
    by: "zAi",
    description: "chat.models.descriptions.glm53",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-zendesk",
    inputs: ["text"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GLM_5_3,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-5.3",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.07, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 1.4, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.07, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GLM_5_3,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-5.3",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.091, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 1.82, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.0897, // updated: 2026-11-07 from unbottled.ai
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

  [ChatModelId.GLM_5_3_FLASH]: {
    name: "GLM-5.3 Flash",
    by: "zAi",
    description: "chat.models.descriptions.glm53Flash",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-zendesk",
    inputs: ["text", "image", "video"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.GLM_5_3_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "z-ai/glm-5.3-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.15, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 0.5, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.03, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.GLM_5_3_FLASH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "glm-5.3-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.195, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.65, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.039, // updated: 2026-11-07 from unbottled.ai
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
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.MIMO_V2_6_PRO]: {
    name: "MiMo V2.6 Pro",
    by: "xiaomi",
    description: "chat.models.descriptions.mimoV26Pro",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-xiaomi",
    inputs: ["text", "image", "video", "audio"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.MIMO_V2_6_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "xiaomi/mimo-v2.6-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.44, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 0.87, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.MIMO_V2_6_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "mimo-v2.6-pro",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.5655, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 1.131, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.0052, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
      ModelUtility.VISION,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.MIMO_V2_6_FLASH]: {
    name: "MiMo V2.6 Flash",
    by: "xiaomi",
    description: "chat.models.descriptions.mimoV26Flash",
    parameterCount: undefined,
    contextWindow: 1050000,
    icon: "si-xiaomi",
    inputs: ["text", "image", "video", "audio"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.MIMO_V2_6_FLASH,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "xiaomi/mimo-v2.6-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.14, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 0.28, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.MIMO_V2_6_FLASH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "mimo-v2.6-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.182, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 0.364, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.0039, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.CHAT,
      ModelUtility.FAST,
      ModelUtility.CODING,
      ModelUtility.VISION,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.META_MUSE_SPARK_1_3]: {
    name: "Meta Muse Spark 1.3",
    by: "meta",
    description: "chat.models.descriptions.metaMuseSpark13",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "cpu",
    inputs: ["text", "image", "video"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.META_MUSE_SPARK_1_3,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "meta/muse-spark-1.3",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 4.25, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.15, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.META_MUSE_SPARK_1_3,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "meta-muse-spark-1.3",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.625, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 5.525, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.195, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.SMART,
      ModelUtility.ANALYSIS,
      ModelUtility.REASONING,
      ModelUtility.VISION,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.META_MUSE_WONDER]: {
    name: "Meta Muse Wonder",
    by: "meta",
    description: "chat.models.descriptions.metaMuseWonder",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "cpu",
    inputs: ["text", "image", "video", "audio"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.META_MUSE_WONDER,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "meta/muse-wonder",
        creditCost: calculateCreditCost,
        inputTokenCost: 4, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 20, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.2, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.META_MUSE_WONDER,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "meta-muse-wonder",
        creditCost: calculateCreditCost,
        inputTokenCost: 5.2, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 26, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.26, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.CREATIVE,
      ModelUtility.REASONING,
      ModelUtility.VISION,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.MISTRAL_LARGE_4]: {
    name: "Mistral Large 4",
    by: "mistralAI",
    description: "chat.models.descriptions.mistralLarge4",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "si-mistralai",
    inputs: ["text", "image"], // updated: 2026-11-07 from openrouter-api
    outputs: ["text"], // updated: 2026-11-07 from openrouter-api
    providers: [
      {
        id: ChatModelId.MISTRAL_LARGE_4,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "mistralai/mistral-large-4-0",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.7, // updated: 2026-11-07 from openrouter-api
        outputTokenCost: 2.1, // updated: 2026-11-07 from openrouter-api
        cacheReadTokenCost: 0.07, // updated: 2026-11-07 from openrouter-api
      },
      {
        id: ChatModelId.MISTRAL_LARGE_4,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "mistral-large-4",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.91, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 2.73, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.091, // updated: 2026-11-07 from unbottled.ai
      },
    ],
    utilities: [
      ModelUtility.SMART,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.VISION,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: { ...defaultFeatures, toolCalling: true },
  },

  [ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED]: {
    name: "DeepSeek V4.1 Flash Uncensored",
    by: "veniceAI",
    description: "chat.models.descriptions.veniceDeepseekV41FlashUncensored",
    parameterCount: undefined,
    contextWindow: 1048576,
    icon: "venice-ai-logo",
    inputs: ["text", "image"], // updated: 2026-11-07 from nano-gpt-api
    outputs: ["text"], // updated: 2026-11-07 from nano-gpt-api
    providers: [
      // NanoGPT first: same price, native tool calling (Venice prompt-engineers
      // tools, which this model answers in raw markup).
      {
        id: ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "deepseek/deepseek-v4.1-flash-uncensored",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.33, // updated: 2026-11-07 from nano-gpt-api
        outputTokenCost: 1.32, // updated: 2026-11-07 from nano-gpt-api
        cacheReadTokenCost: 0.00825, // updated: 2026-11-07 from nano-gpt-api
      },
      {
        id: ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
        apiProvider: ApiProvider.VENICE_AI,
        providerModel: "deepseek-v4-1-flash-uncensored",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.33, // updated: 2026-11-07 from venice-api
        outputTokenCost: 1.32, // updated: 2026-11-07 from venice-api
        cacheReadTokenCost: 0.00825, // updated: 2026-11-07 from venice-api
      },
      {
        id: ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "venice-deepseek-v4.1-flash-uncensored",
        creditCost: calculateCreditCost,
        inputTokenCost: 0.429, // updated: 2026-11-07 from unbottled.ai
        outputTokenCost: 1.716, // updated: 2026-11-07 from unbottled.ai
        cacheReadTokenCost: 0.0107, // updated: 2026-11-07 from unbottled.ai
      },
      {
        id: ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "abliteration-ai/abliterated-model-large-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 1, // updated: 2026-11-07 from nano-gpt-api
        outputTokenCost: 2, // updated: 2026-11-07 from nano-gpt-api
        cacheReadTokenCost: 0.1, // updated: 2026-11-07 from nano-gpt-api
      },
      {
        id: ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
        apiProvider: ApiProvider.VENICE_AI,
        providerModel: "abliteration-abliterated-model-large-flash",
        creditCost: calculateCreditCost,
        inputTokenCost: 1.25, // updated: 2026-11-07 from venice-api
        outputTokenCost: 2.5, // updated: 2026-11-07 from venice-api
        cacheReadTokenCost: 0.125, // updated: 2026-11-07 from venice-api
      },
    ],
    utilities: [
      ModelUtility.UNCENSORED,
      ModelUtility.CODING,
      ModelUtility.ANALYSIS,
      ModelUtility.CREATIVE,
      ModelUtility.ROLEPLAY,
    ],
    supportsTools: true,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.UNCENSORED,
    features: { ...defaultFeatures, toolCalling: true },
  },
};

/**
 * Legacy → successor map. Every key is marked ModelUtility.LEGACY; every value
 * is a current (non-legacy) model. Stored selections (favorites, skills, skill
 * variants, chat settings, API callers) that name a key transparently resolve
 * to its successor — see resolveChatModelSuccessor() in ./models.ts. Legacy ids
 * are NEVER deleted: stored messages and history still reference them.
 */
export const chatModelSuccessors: Partial<Record<ChatModelId, ChatModelId>> = {
  [ChatModelId.CLAUDE_OPUS_4_5]: ChatModelId.CLAUDE_OPUS_5_5,
  [ChatModelId.CLAUDE_OPUS_4_6]: ChatModelId.CLAUDE_OPUS_5_5,
  [ChatModelId.CLAUDE_OPUS_4_7]: ChatModelId.CLAUDE_OPUS_5_5,
  [ChatModelId.CLAUDE_OPUS_4_8]: ChatModelId.CLAUDE_OPUS_5_5,
  [ChatModelId.CLAUDE_OPUS_5]: ChatModelId.CLAUDE_OPUS_5_5,
  [ChatModelId.CLAUDE_OPUS_5_FAST]: ChatModelId.CLAUDE_OPUS_5_5,
  [ChatModelId.CLAUDE_SONNET_4_5]: ChatModelId.CLAUDE_SONNET_5_5,
  [ChatModelId.CLAUDE_SONNET_4_6]: ChatModelId.CLAUDE_SONNET_5_5,
  [ChatModelId.CLAUDE_SONNET_5]: ChatModelId.CLAUDE_SONNET_5_5,
  [ChatModelId.CLAUDE_HAIKU_4_5]: ChatModelId.CLAUDE_HAIKU_5_5,
  [ChatModelId.CLAUDE_FABLE_5]: ChatModelId.CLAUDE_FABLE_5_1,
  [ChatModelId.GPT_5]: ChatModelId.GPT_6_1_SOL,
  [ChatModelId.GPT_5_1]: ChatModelId.GPT_6_1_SOL,
  [ChatModelId.GPT_5_2]: ChatModelId.GPT_6_1_SOL,
  [ChatModelId.GPT_5_4]: ChatModelId.GPT_6_1_SOL,
  [ChatModelId.GPT_5_5]: ChatModelId.GPT_6_1_SOL,
  [ChatModelId.GPT_5_6_SOL]: ChatModelId.GPT_6_1_SOL,
  [ChatModelId.GPT_5_6_SOL_PRO]: ChatModelId.GPT_6_1_SOL_PRO,
  [ChatModelId.GTP_5_PRO]: ChatModelId.GPT_6_ASTRA_PRO,
  [ChatModelId.GPT_5_2_PRO]: ChatModelId.GPT_6_ASTRA_PRO,
  [ChatModelId.GPT_5_4_PRO]: ChatModelId.GPT_6_ASTRA_PRO,
  [ChatModelId.GPT_5_5_PRO]: ChatModelId.GPT_6_ASTRA_PRO,
  [ChatModelId.GPT_5_2_CHAT]: ChatModelId.GPT_6_1_TERRA,
  [ChatModelId.GPT_5_3_CHAT]: ChatModelId.GPT_6_1_TERRA,
  [ChatModelId.GPT_5_6_TERRA]: ChatModelId.GPT_6_1_TERRA,
  [ChatModelId.GPT_5_6_TERRA_PRO]: ChatModelId.GPT_6_1_TERRA_PRO,
  [ChatModelId.GPT_5_MINI]: ChatModelId.GPT_6_LUNA,
  [ChatModelId.GPT_5_4_MINI]: ChatModelId.GPT_6_LUNA,
  [ChatModelId.GPT_5_6_LUNA]: ChatModelId.GPT_6_LUNA,
  [ChatModelId.GPT_5_6_LUNA_PRO]: ChatModelId.GPT_6_LUNA_PRO,
  [ChatModelId.GPT_5_NANO]: ChatModelId.GPT_5_4_NANO,
  [ChatModelId.GPT_5_CODEX]: ChatModelId.GPT_5_3_CODEX,
  [ChatModelId.GPT_5_1_CODEX]: ChatModelId.GPT_5_3_CODEX,
  [ChatModelId.GEMINI_2_5_PRO]: ChatModelId.GEMINI_4_ARGON,
  [ChatModelId.GEMINI_3_1_PRO_PREVIEW_CUSTOM_TOOLS]: ChatModelId.GEMINI_4_ARGON,
  [ChatModelId.GEMINI_2_5_FLASH]: ChatModelId.GEMINI_3_8_FLASH,
  [ChatModelId.GEMINI_3_FLASH]: ChatModelId.GEMINI_3_8_FLASH,
  [ChatModelId.GEMINI_3_5_FLASH]: ChatModelId.GEMINI_3_8_FLASH,
  [ChatModelId.GEMINI_3_6_FLASH]: ChatModelId.GEMINI_3_8_FLASH,
  [ChatModelId.GEMINI_3_7_FLASH]: ChatModelId.GEMINI_3_8_FLASH,
  [ChatModelId.GEMINI_2_5_FLASH_LITE]: ChatModelId.GEMINI_3_5_FLASH_LITE,
  [ChatModelId.GEMINI_3_1_FLASH_LITE_PREVIEW]:
    ChatModelId.GEMINI_3_5_FLASH_LITE,
  [ChatModelId.GROK_4]: ChatModelId.GROK_4_7,
  [ChatModelId.GROK_4_3]: ChatModelId.GROK_4_7,
  [ChatModelId.GROK_4_20]: ChatModelId.GROK_4_7,
  [ChatModelId.GROK_4_5]: ChatModelId.GROK_4_7,
  [ChatModelId.GROK_4_6]: ChatModelId.GROK_4_7,
  [ChatModelId.KIMI_K2]: ChatModelId.KIMI_K3,
  [ChatModelId.KIMI_K2_5]: ChatModelId.KIMI_K3,
  [ChatModelId.KIMI_K2_6]: ChatModelId.KIMI_K3,
  [ChatModelId.KIMI_K2_THINKING]: ChatModelId.KIMI_K3,
  [ChatModelId.DEEPSEEK_V31]: ChatModelId.DEEPSEEK_V4_1_FLASH,
  [ChatModelId.DEEPSEEK_V32]: ChatModelId.DEEPSEEK_V4_1_FLASH,
  [ChatModelId.DEEPSEEK_V4_FLASH]: ChatModelId.DEEPSEEK_V4_1_FLASH,
  [ChatModelId.GLM_4_6]: ChatModelId.GLM_5_3,
  [ChatModelId.GLM_4_7]: ChatModelId.GLM_5_3,
  [ChatModelId.GLM_5]: ChatModelId.GLM_5_3,
  [ChatModelId.GLM_5_1]: ChatModelId.GLM_5_3,
  [ChatModelId.GLM_5_2]: ChatModelId.GLM_5_3,
  [ChatModelId.GLM_4_5V]: ChatModelId.GLM_5_3_FLASH,
  [ChatModelId.GLM_4_7_FLASH]: ChatModelId.GLM_5_3_FLASH,
  [ChatModelId.MINIMAX_M2_7]: ChatModelId.MINIMAX_M3,
  [ChatModelId.MIMO_V2_PRO]: ChatModelId.MIMO_V2_6_PRO,
  [ChatModelId.MIMO_V2_5_PRO]: ChatModelId.MIMO_V2_6_PRO,
  [ChatModelId.MIMO_V2_5]: ChatModelId.MIMO_V2_6_FLASH,
  [ChatModelId.META_MUSE_SPARK_1_2]: ChatModelId.META_MUSE_SPARK_1_3,
  // Redundant entries: cheapest / newest kept (2026-11-07)
  [ChatModelId.CLAUDE_CODE_HAIKU]: ChatModelId.CLAUDE_HAIKU_5_5,
  [ChatModelId.CLAUDE_CODE_SONNET]: ChatModelId.CLAUDE_SONNET_5_5,
  [ChatModelId.CLAUDE_CODE_OPUS]: ChatModelId.CLAUDE_OPUS_5_5,
  [ChatModelId.CLAUDE_CODE_FABLE]: ChatModelId.CLAUDE_FABLE_5_1,
  [ChatModelId.GLM_5_3_ABLITERATED]: ChatModelId.GLM_5_3_UNCENSORED,
  [ChatModelId.DEEPSEEK_V4_1_FLASH_ABLITERATED]:
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  [ChatModelId.GLM_4_7_FLASH_HERETIC]: ChatModelId.GLM_5_3_FLASH_UNCENSORED,
  [ChatModelId.GLM_4_5_AIR]: ChatModelId.GLM_5_3_FLASH,
  [ChatModelId.GLM_5_TURBO]: ChatModelId.GLM_5_3,
  [ChatModelId.QWEN_2_5_7B]: ChatModelId.QWEN_3_7_FLASH,
  [ChatModelId.DEEPSEEK_R1]: ChatModelId.DEEPSEEK_V4_1_FLASH,
  [ChatModelId.MISTRAL_MEDIUM_3_5]: ChatModelId.MISTRAL_LARGE_4,
  [ChatModelId.GPT_5_4_NANO]: ChatModelId.GPT_6_LUNA,
  [ChatModelId.GPT_5_3_CODEX]: ChatModelId.GPT_6_1_SOL,
};
