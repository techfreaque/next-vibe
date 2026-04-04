import { z } from "zod";

import { ChatModelId, chatModelOptionsIndex } from "../ai-stream/models";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  PriceLevel,
  SpeedLevel,
} from "../chat/skills/enum";
import { ModelUtility } from "../models/enum";
import {
  ApiProvider,
  calculateCreditCost,
  defaultFeatures,
  filterRoleModels,
  getProviderPrice,
  type ModelDefinition,
  type ModelOptionImageBased,
  type ModelOptionTokenBased,
  type ModelProviderConfigImageBased,
  type ModelProviderConfigTokenBased,
  type ModelProviderEnvAvailability,
} from "../models/models";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

export enum ImageGenModelId {
  FLUX_PRO = "flux-pro",
  FLUX_2_MAX = "flux-2-max",
  FLUX_2_KLEIN_4B = "flux-2-klein-4b",
  RIVERFLOW_V2_PRO = "riverflow-v2-pro",
  RIVERFLOW_V2_FAST = "riverflow-v2-fast",
  RIVERFLOW_V2_MAX_PREVIEW = "riverflow-v2-max-preview",
  RIVERFLOW_V2_STANDARD_PREVIEW = "riverflow-v2-standard-preview",
  RIVERFLOW_V2_FAST_PREVIEW = "riverflow-v2-fast-preview",
  FLUX_2_FLEX = "flux-2-flex",
  FLUX_2_PRO = "flux-2-pro",
  SEEDREAM_4_5 = "seedream-4.5",
  GEN4_T2I_TURBO = "gen4-t2i-turbo",
  GEN4_IMAGE = "gen4-image",
  WAN_2_7_T2I = "wan-2.7-t2i",
  GROK_T2I = "grok-t2i",
  Z_IMAGE_BASE = "z-image-base",
  Z_IMAGE_TURBO = "z-image-turbo",
  FLUX_PRO_1_1_ULTRA = "flux-pro-1.1-ultra",
  IMAGEN_4_ULTRA = "imagen-4-ultra",
  IMAGEN_4 = "imagen-4",
  IMAGEN_4_FAST = "imagen-4-fast",
  QWEN_T2I = "qwen-t2i",
  REALTIME_T2I = "realtime-t2i",
  // BEGIN:llm-generated — do not edit manually, updated by price updater
  GEMINI_3_1_FLASH_IMAGE_PREVIEW = "gemini-3.1-flash-image-preview",
  GEMINI_3_PRO_IMAGE_PREVIEW = "gemini-3-pro-image-preview",
  GPT_5_IMAGE_MINI = "gpt-5-image-mini",
  GPT_5_IMAGE = "gpt-5-image",
  // END:llm-generated
}

/** IDs of LLM-based chat models that also produce images — definitions are derived from the chat model, not duplicated here */
export const llmImageGenModelIds = [
  ImageGenModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW,
  ImageGenModelId.GEMINI_3_PRO_IMAGE_PREVIEW,
  ImageGenModelId.GPT_5_IMAGE_MINI,
  ImageGenModelId.GPT_5_IMAGE,
] as const satisfies ImageGenModelId[];

type DedicatedImageGenModelId = Exclude<
  ImageGenModelId,
  (typeof llmImageGenModelIds)[number]
>;

export const imageGenModelDefinitions: Record<
  DedicatedImageGenModelId,
  ModelDefinition
> = {
  [ImageGenModelId.FLUX_PRO]: {
    name: "Flux Pro 1.1",
    by: "blackForestLabs",
    description: "chat.models.descriptions.fluxPro",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-04 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-04 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.FLUX_PRO,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "flux-pro-1.1",
        creditCostPerImage: 6, // updated: 2026-04-04 from modelslab.com
        supportedSizes: [],
        supportedQualities: [],
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
  [ImageGenModelId.FLUX_2_MAX]: {
    name: "FLUX.2 Max",
    by: "blackForestLabs",
    description: "chat.models.descriptions.flux2Max",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-03 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-03 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.FLUX_2_MAX,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "black-forest-labs/flux.2-max",
        creditCostPerImage: 7, // updated: 2026-03-31 from openrouter-api
        supportedSizes: [],
        supportedQualities: [],
      },
      {
        id: ImageGenModelId.FLUX_2_MAX,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "flux-2-max",
        creditCostPerImage: 8, // updated: 2026-04-04 from modelslab.com
        supportedSizes: [],
        supportedQualities: [],
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
  [ImageGenModelId.FLUX_2_KLEIN_4B]: {
    name: "FLUX.2 Klein 4B",
    by: "blackForestLabs",
    description: "chat.models.descriptions.flux2Klein4b",
    parameterCount: 4,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-03 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-03 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.FLUX_2_KLEIN_4B,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "black-forest-labs/flux.2-klein-4b",
        creditCostPerImage: 1.4, // updated: 2026-03-31 from openrouter-api
        supportedSizes: [],
        supportedQualities: [],
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
  [ImageGenModelId.RIVERFLOW_V2_PRO]: {
    name: "Riverflow V2 Pro",
    by: "sourceful",
    description: "chat.models.descriptions.riverflowV2Pro",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-03 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-03 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.RIVERFLOW_V2_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "sourceful/riverflow-v2-pro",
        creditCostPerImage: 15, // updated: 2026-03-31 from openrouter-api
        pricingByResolution: { "1024px": 15, "2048px": 15, "4096px": 33 }, // updated: 2026-04-04 from openrouter-api
        supportedResolutions: ["1024px", "2048px", "4096px"], // updated: 2026-04-04 from openrouter-api
        supportedSizes: [],
        supportedQualities: [],
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
  [ImageGenModelId.RIVERFLOW_V2_FAST]: {
    name: "Riverflow V2 Fast",
    by: "sourceful",
    description: "chat.models.descriptions.riverflowV2Fast",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-03 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-03 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.RIVERFLOW_V2_FAST,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "sourceful/riverflow-v2-fast",
        creditCostPerImage: 2, // updated: 2026-03-31 from openrouter-api
        pricingByResolution: { "1024px": 2, "2048px": 4 }, // updated: 2026-04-04 from openrouter-api
        supportedResolutions: ["1024px", "2048px"], // updated: 2026-04-04 from openrouter-api
        supportedSizes: [],
        supportedQualities: [],
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
  [ImageGenModelId.RIVERFLOW_V2_MAX_PREVIEW]: {
    name: "Riverflow V2 Max Preview",
    by: "sourceful",
    description: "chat.models.descriptions.riverflowV2MaxPreview",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-03 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-03 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.RIVERFLOW_V2_MAX_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "sourceful/riverflow-v2-max-preview",
        creditCostPerImage: 7.5, // updated: 2026-03-31 from openrouter-api
        supportedSizes: [],
        supportedQualities: [],
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
  [ImageGenModelId.RIVERFLOW_V2_STANDARD_PREVIEW]: {
    name: "Riverflow V2 Standard Preview",
    by: "sourceful",
    description: "chat.models.descriptions.riverflowV2StandardPreview",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-03 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-03 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.RIVERFLOW_V2_STANDARD_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "sourceful/riverflow-v2-standard-preview",
        creditCostPerImage: 3.5, // updated: 2026-03-31 from openrouter-api
        supportedSizes: [],
        supportedQualities: [],
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
  [ImageGenModelId.RIVERFLOW_V2_FAST_PREVIEW]: {
    name: "Riverflow V2 Fast Preview",
    by: "sourceful",
    description: "chat.models.descriptions.riverflowV2FastPreview",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-03 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-03 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.RIVERFLOW_V2_FAST_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "sourceful/riverflow-v2-fast-preview",
        creditCostPerImage: 3, // updated: 2026-03-31 from openrouter-api
        supportedSizes: [],
        supportedQualities: [],
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
  [ImageGenModelId.FLUX_2_FLEX]: {
    name: "FLUX.2 Flex",
    by: "blackForestLabs",
    description: "chat.models.descriptions.flux2Flex",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-03 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-03 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.FLUX_2_FLEX,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "black-forest-labs/flux.2-flex",
        creditCostPerImage: 6, // updated: 2026-03-31 from openrouter-api
        supportedSizes: [],
        supportedQualities: [],
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
  [ImageGenModelId.FLUX_2_PRO]: {
    name: "FLUX.2 Pro",
    by: "blackForestLabs",
    description: "chat.models.descriptions.flux2Pro",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-03 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-03 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.FLUX_2_PRO,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "black-forest-labs/flux.2-pro",
        creditCostPerImage: 3, // updated: 2026-03-31 from openrouter-api
        supportedSizes: [],
        supportedQualities: [],
      },
      {
        id: ImageGenModelId.FLUX_2_PRO,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "flux-2-pro",
        creditCostPerImage: 5.4, // updated: 2026-04-04 from modelslab.com
        supportedSizes: [],
        supportedQualities: [],
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
  [ImageGenModelId.SEEDREAM_4_5]: {
    name: "Seedream 4.5",
    by: "byteDanceSeed",
    description: "chat.models.descriptions.seedream45",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-03 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-03 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.SEEDREAM_4_5,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "bytedance-seed/seedream-4.5",
        creditCostPerImage: 4, // updated: 2026-03-31 from openrouter-api
        supportedSizes: [],
        supportedQualities: [],
      },
      {
        id: ImageGenModelId.SEEDREAM_4_5,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "seedream-4.5",
        creditCostPerImage: 6, // updated: 2026-04-04 from modelslab.com
        supportedAspectRatios: [
          "1:1",
          "4:3",
          "3:4",
          "16:9",
          "9:16",
          "3:2",
          "2:3",
          "21:9",
        ], // updated: 2026-04-04 from modelslab.com
        supportedSizes: [],
        supportedQualities: [],
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
  [ImageGenModelId.GEN4_T2I_TURBO]: {
    name: "Gen4 T2I Turbo",
    by: "runway",
    description: "chat.models.descriptions.modelsLabGen4T2ITurbo",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-03 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-03 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.GEN4_T2I_TURBO,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "gen4_image_turbo",
        creditCostPerImage: 2.5, // updated: 2026-03-31 from modelslab.com
        supportedSizes: [],
        supportedQualities: [],
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
  [ImageGenModelId.GEN4_IMAGE]: {
    name: "Gen4 Image",
    by: "runway",
    description: "chat.models.descriptions.modelsLabGen4Image",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-04 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-04 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.GEN4_IMAGE,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "gen4_image",
        creditCostPerImage: 8.8, // updated: 2026-04-04 from modelslab.com
        supportedAspectRatios: [
          "16:9",
          "9:16",
          "1:1",
          "85:48",
          "4:3",
          "3:4",
          "113:48",
          "88:38",
          "7:3",
        ], // updated: 2026-04-04 from modelslab.com
        supportedSizes: [],
        supportedQualities: [],
      },
    ],
    utilities: [ModelUtility.IMAGE_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },
  [ImageGenModelId.WAN_2_7_T2I]: {
    name: "Wan 2.7 T2I",
    by: "alibaba",
    description: "chat.models.descriptions.modelsLabWan27T2I",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-04 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-04 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.WAN_2_7_T2I,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "wan-2.7-t2i",
        creditCostPerImage: 3, // updated: 2026-04-04 from modelslab.com
        supportedSizes: [],
        supportedQualities: [],
      },
    ],
    utilities: [ModelUtility.IMAGE_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },
  [ImageGenModelId.GROK_T2I]: {
    name: "Grok Imagine T2I",
    by: "xAI",
    description: "chat.models.descriptions.modelsLabGrokT2I",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-04 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-04 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.GROK_T2I,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "grok-t2i",
        creditCostPerImage: 2.4, // updated: 2026-04-04 from modelslab.com
        supportedAspectRatios: ["1:1", "9:16", "3:4", "4:3", "16:9"], // updated: 2026-04-04 from modelslab.com
        supportedSizes: [],
        supportedQualities: [],
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
  [ImageGenModelId.Z_IMAGE_BASE]: {
    name: "Z Image Base",
    by: "modelsLab",
    description: "chat.models.descriptions.modelsLabZImageBase",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-04 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-04 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.Z_IMAGE_BASE,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "z-image-base",
        creditCostPerImage: 0.47, // updated: 2026-04-04 from modelslab.com
        supportedSizes: [],
        supportedQualities: [],
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
  [ImageGenModelId.Z_IMAGE_TURBO]: {
    name: "Z Image Turbo",
    by: "modelsLab",
    description: "chat.models.descriptions.modelsLabZImageTurbo",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-04 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-04 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.Z_IMAGE_TURBO,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "z-image-turbo",
        creditCostPerImage: 0.47, // updated: 2026-04-04 from modelslab.com
        supportedSizes: [],
        supportedQualities: [],
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
  [ImageGenModelId.FLUX_PRO_1_1_ULTRA]: {
    name: "Flux Pro 1.1 Ultra",
    by: "blackForestLabs",
    description: "chat.models.descriptions.modelsLabFluxPro11Ultra",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-04 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-04 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.FLUX_PRO_1_1_ULTRA,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "flux-pro-1.1-ultra",
        creditCostPerImage: 8, // updated: 2026-04-04 from modelslab.com
        supportedSizes: [],
        supportedQualities: [],
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
  [ImageGenModelId.IMAGEN_4_ULTRA]: {
    name: "Imagen 4 Ultra",
    by: "google",
    description: "chat.models.descriptions.modelsLabImagen4Ultra",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-04 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-04 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.IMAGEN_4_ULTRA,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "imagen-4.0-ultra",
        creditCostPerImage: 7.2, // updated: 2026-04-04 from modelslab.com
        supportedAspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"], // updated: 2026-04-04 from modelslab.com
        supportedSizes: [],
        supportedQualities: [],
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
  },
  [ImageGenModelId.IMAGEN_4]: {
    name: "Imagen 4",
    by: "google",
    description: "chat.models.descriptions.modelsLabImagen4",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-04 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-04 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.IMAGEN_4,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "imagen-4.0",
        creditCostPerImage: 4.4, // updated: 2026-04-04 from modelslab.com
        supportedAspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"], // updated: 2026-04-04 from modelslab.com
        supportedSizes: [],
        supportedQualities: [],
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
  },
  [ImageGenModelId.IMAGEN_4_FAST]: {
    name: "Imagen 4 Fast",
    by: "google",
    description: "chat.models.descriptions.modelsLabImagen4Fast",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-04 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-04 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.IMAGEN_4_FAST,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "imagen-4.0-fast",
        creditCostPerImage: 2.4, // updated: 2026-04-04 from modelslab.com
        supportedAspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9"], // updated: 2026-04-04 from modelslab.com
        supportedSizes: [],
        supportedQualities: [],
      },
    ],
    utilities: [ModelUtility.IMAGE_GEN, ModelUtility.FAST],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },
  [ImageGenModelId.QWEN_T2I]: {
    name: "Qwen T2I",
    by: "alibaba",
    description: "chat.models.descriptions.modelsLabQwenT2I",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-04 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-04 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.QWEN_T2I,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "qwen-t2i",
        creditCostPerImage: 0.47, // updated: 2026-04-04 from modelslab.com
        supportedSizes: [],
        supportedQualities: [],
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
  [ImageGenModelId.REALTIME_T2I]: {
    name: "Realtime T2I",
    by: "modelsLab",
    description: "chat.models.descriptions.modelsLabRealtimeT2I",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-04 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-04 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.REALTIME_T2I,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "realtime-t2i",
        creditCostPerImage: 0.47, // updated: 2026-04-04 from modelslab.com
        supportedSizes: [],
        supportedQualities: [],
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
};

export type ImageGenModelOption =
  | (ModelOptionImageBased & { id: ImageGenModelId })
  | (ModelOptionTokenBased & { id: ImageGenModelId });

/**
 * Wrap a chat model (already resolved from chatModelOptionsIndex) as an ImageGenModelOption.
 * Uses the chat model's base metadata; providers are image-gen-specific.
 */
function chatModelToImageGenOption(
  id: ImageGenModelId,
  chatModelId: ChatModelId,
  providers: (ModelProviderConfigTokenBased | ModelProviderConfigImageBased)[],
): ImageGenModelOption | null {
  const chat = chatModelOptionsIndex[chatModelId];
  const sortedProviders = [...providers].toSorted(
    (a, b) => getProviderPrice(a) - getProviderPrice(b),
  );
  for (const provider of sortedProviders) {
    if (provider.creditCostPerImage !== undefined) {
      return {
        id,
        name: chat.name,
        provider: chat.provider,
        apiProvider: provider.apiProvider,
        description: chat.description,
        parameterCount: chat.parameterCount,
        contextWindow: chat.contextWindow,
        icon: chat.icon,
        providerModel: provider.providerModel,
        utilities: chat.utilities,
        supportsTools: chat.supportsTools,
        intelligence: chat.intelligence,
        speed: chat.speed,
        content: chat.content,
        features: chat.features,
        weaknesses: chat.weaknesses,
        adminOnly: provider.adminOnly,
        inputs: chat.inputs,
        outputs: chat.outputs,
        voiceMeta: chat.voiceMeta,
        creditCostPerImage: provider.creditCostPerImage,
        supportedSizes: provider.supportedSizes,
        supportedQualities: provider.supportedQualities,
        pricingBySize: provider.pricingBySize,
        pricingByQuality: provider.pricingByQuality,
        supportedAspectRatios: provider.supportedAspectRatios,
      } satisfies ModelOptionImageBased & { id: ImageGenModelId };
    } else if (typeof provider.creditCost === "function") {
      return {
        id,
        name: chat.name,
        provider: chat.provider,
        apiProvider: provider.apiProvider,
        description: chat.description,
        parameterCount: chat.parameterCount,
        contextWindow: chat.contextWindow,
        icon: chat.icon,
        providerModel: provider.providerModel,
        utilities: chat.utilities,
        supportsTools: chat.supportsTools,
        intelligence: chat.intelligence,
        speed: chat.speed,
        content: chat.content,
        features: chat.features,
        weaknesses: chat.weaknesses,
        adminOnly: provider.adminOnly,
        inputs: chat.inputs,
        outputs: chat.outputs,
        voiceMeta: chat.voiceMeta,
        creditCost: provider.creditCost,
        inputTokenCost: provider.inputTokenCost,
        outputTokenCost: provider.outputTokenCost,
        cacheReadTokenCost: provider.cacheReadTokenCost,
        cacheWriteTokenCost: provider.cacheWriteTokenCost,
      } satisfies ModelOptionTokenBased & { id: ImageGenModelId };
    }
  }
  return null;
}

// BEGIN:llm-image-defs — LLM multimodal models that output images; definitions derived from chat models
const llmImageGenModelOptions: ImageGenModelOption[] = (
  [
    chatModelToImageGenOption(
      ImageGenModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW,
      ChatModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW,
      [
        {
          id: ImageGenModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW,
          apiProvider: ApiProvider.OPENROUTER,
          providerModel: "google/gemini-3.1-flash-image-preview",
          creditCost: calculateCreditCost,
          inputTokenCost: 0.5, // updated: 2026-03-31 from openrouter-api
          outputTokenCost: 3, // updated: 2026-03-31 from openrouter-api
        } satisfies ModelProviderConfigTokenBased,
        {
          id: ImageGenModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW,
          apiProvider: ApiProvider.MODELSLAB,
          providerModel: "nano-banana",
          creditCostPerImage: 4.6, // updated: 2026-04-04 from modelslab.com
          supportedSizes: [],
          supportedQualities: [],
        } satisfies ModelProviderConfigImageBased,
      ],
    ),
    chatModelToImageGenOption(
      ImageGenModelId.GEMINI_3_PRO_IMAGE_PREVIEW,
      ChatModelId.GEMINI_3_PRO_IMAGE_PREVIEW,
      [
        {
          id: ImageGenModelId.GEMINI_3_PRO_IMAGE_PREVIEW,
          apiProvider: ApiProvider.OPENROUTER,
          providerModel: "google/gemini-3-pro-image-preview",
          creditCost: calculateCreditCost,
          inputTokenCost: 2, // updated: 2026-03-31 from openrouter-api
          outputTokenCost: 12, // updated: 2026-03-31 from openrouter-api
          cacheReadTokenCost: 0.2, // updated: 2026-03-31 from openrouter-api
          cacheWriteTokenCost: 0.38, // updated: 2026-03-31 from openrouter-api
        } satisfies ModelProviderConfigTokenBased,
        {
          id: ImageGenModelId.GEMINI_3_PRO_IMAGE_PREVIEW,
          apiProvider: ApiProvider.MODELSLAB,
          providerModel: "nano-banana-pro",
          creditCostPerImage: 18, // updated: 2026-04-04 from modelslab.com
          supportedAspectRatios: [
            "1:1",
            "9:16",
            "2:3",
            "3:4",
            "4:5",
            "5:4",
            "4:3",
            "3:2",
            "16:9",
            "21:9",
          ], // updated: 2026-04-04 from modelslab.com
          supportedSizes: [],
          supportedQualities: [],
        } satisfies ModelProviderConfigImageBased,
      ],
    ),
    chatModelToImageGenOption(
      ImageGenModelId.GPT_5_IMAGE_MINI,
      ChatModelId.GPT_5_IMAGE_MINI,
      [
        {
          id: ImageGenModelId.GPT_5_IMAGE_MINI,
          apiProvider: ApiProvider.OPENROUTER,
          providerModel: "openai/gpt-5-image-mini",
          creditCost: calculateCreditCost,
          inputTokenCost: 2.5, // updated: 2026-03-31 from openrouter-api
          outputTokenCost: 2, // updated: 2026-03-31 from openrouter-api
          cacheReadTokenCost: 0.25, // updated: 2026-03-31 from openrouter-api
        } satisfies ModelProviderConfigTokenBased,
      ],
    ),
    chatModelToImageGenOption(
      ImageGenModelId.GPT_5_IMAGE,
      ChatModelId.GPT_5_IMAGE,
      [
        {
          id: ImageGenModelId.GPT_5_IMAGE,
          apiProvider: ApiProvider.OPENROUTER,
          providerModel: "openai/gpt-5-image",
          creditCost: calculateCreditCost,
          inputTokenCost: 10, // updated: 2026-03-31 from openrouter-api
          outputTokenCost: 10, // updated: 2026-03-31 from openrouter-api
          cacheReadTokenCost: 1.25, // updated: 2026-03-31 from openrouter-api
        } satisfies ModelProviderConfigTokenBased,
      ],
    ),
  ] as const
).filter((m): m is ImageGenModelOption => m !== null);
// END:llm-image-defs

type ImageGenModelOptionRecord = Record<
  DedicatedImageGenModelId,
  ImageGenModelOption
>;

function buildImageGenModelOptions(): ImageGenModelOptionRecord {
  const result = {} as ImageGenModelOptionRecord;

  for (const modelId of Object.values(ImageGenModelId).filter(
    (id): id is DedicatedImageGenModelId =>
      !(llmImageGenModelIds as readonly string[]).includes(id),
  )) {
    const def = imageGenModelDefinitions[modelId];
    const sortedProviders = [...def.providers].toSorted(
      (a, b) => getProviderPrice(a) - getProviderPrice(b),
    );
    // Pick cheapest provider; prefer per-image (dedicated) over token-based (LLM)
    for (const provider of sortedProviders) {
      if (provider.creditCostPerImage !== undefined) {
        result[modelId] = {
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
          speed: def.speed,
          content: def.content,
          features: def.features,
          weaknesses: def.weaknesses,
          adminOnly: provider.adminOnly,
          inputs: def.inputs,
          outputs: def.outputs,
          voiceMeta: def.voiceMeta,
          creditCostPerImage: provider.creditCostPerImage,
          supportedSizes: provider.supportedSizes,
          supportedQualities: provider.supportedQualities,
          pricingBySize: provider.pricingBySize,
          pricingByQuality: provider.pricingByQuality,
          supportedAspectRatios: provider.supportedAspectRatios,
        } satisfies ModelOptionImageBased & { id: ImageGenModelId };
        break; // use cheapest image-based provider
      } else if (typeof provider.creditCost === "function") {
        result[modelId] = {
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
          speed: def.speed,
          content: def.content,
          features: def.features,
          weaknesses: def.weaknesses,
          adminOnly: provider.adminOnly,
          inputs: def.inputs,
          outputs: def.outputs,
          voiceMeta: def.voiceMeta,
          creditCost: provider.creditCost,
          inputTokenCost: provider.inputTokenCost,
          outputTokenCost: provider.outputTokenCost,
          cacheReadTokenCost: provider.cacheReadTokenCost,
          cacheWriteTokenCost: provider.cacheWriteTokenCost,
        } satisfies ModelOptionTokenBased & { id: ImageGenModelId };
        break;
      }
    }
  }

  return result;
}

const imageGenModelOptionsIndex: Partial<
  Record<ImageGenModelId, ImageGenModelOption>
> = {
  ...buildImageGenModelOptions(),
  ...Object.fromEntries(llmImageGenModelOptions.map((m) => [m.id, m])),
};

export const imageGenModelOptions: ImageGenModelOption[] = Object.values(
  imageGenModelOptionsIndex,
).filter((m): m is ImageGenModelOption => m !== undefined);

export const ImageGenModelIdOptions = imageGenModelOptions.map((m) => ({
  value: m.id,
  label: m.name,
}));

export function getImageGenModelById(
  modelId: ImageGenModelId,
): ImageGenModelOption | undefined {
  return imageGenModelOptionsIndex[modelId];
}

// ============================================================
// IMAGE GEN MODEL SELECTION SCHEMA
// ============================================================

const sharedFilterPropsSchema = z.object({
  intelligenceRange: z
    .object({
      min: z.enum(IntelligenceLevel).optional(),
      max: z.enum(IntelligenceLevel).optional(),
    })
    .optional(),
  priceRange: z
    .object({
      min: z.enum(PriceLevel).optional(),
      max: z.enum(PriceLevel).optional(),
    })
    .optional(),
  contentRange: z
    .object({
      min: z.enum(ContentLevel).optional(),
      max: z.enum(ContentLevel).optional(),
    })
    .optional(),
  speedRange: z
    .object({
      min: z.enum(SpeedLevel).optional(),
      max: z.enum(SpeedLevel).optional(),
    })
    .optional(),
  sortBy: z.enum(ModelSortField).optional(),
  sortDirection: z.enum(ModelSortDirection).optional(),
  sortBy2: z.enum(ModelSortField).optional(),
  sortDirection2: z.enum(ModelSortDirection).optional(),
});

const filtersSelectionSchema = z
  .object({ selectionType: z.literal(ModelSelectionType.FILTERS) })
  .merge(sharedFilterPropsSchema);

export const imageGenModelSelectionSchema = z.discriminatedUnion(
  "selectionType",
  [
    z
      .object({
        selectionType: z.literal(ModelSelectionType.MANUAL),
        manualModelId: z.enum(ImageGenModelId),
      })
      .merge(sharedFilterPropsSchema),
    filtersSelectionSchema,
  ],
);
export type ImageGenModelSelection = z.infer<
  typeof imageGenModelSelectionSchema
>;

// ============================================================
// IMAGE GEN MODEL RESOLUTION
// ============================================================

export function filterImageGenModels(
  selection: ImageGenModelSelection | null | undefined,
  user: JwtPayloadType,
  env: ModelProviderEnvAvailability,
): ImageGenModelOption[] {
  return filterRoleModels(imageGenModelOptions, selection, user, env);
}

export function getBestImageGenModel(
  selection: ImageGenModelSelection,
  user: JwtPayloadType,
  env: ModelProviderEnvAvailability,
): ImageGenModelOption | null {
  return filterImageGenModels(selection, user, env)[0] ?? null;
}
