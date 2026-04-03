import { chatModelDefinitions } from "../ai-stream/models";
import {
  ContentLevel,
  IntelligenceLevel,
  SpeedLevel,
} from "../chat/skills/enum";
import { ModelUtility } from "../models/enum";
import {
  ApiProvider,
  defaultFeatures,
  getProviderPrice,
  type ModelDefinition,
  type ModelOptionImageBased,
  type ModelOptionTokenBased,
  type ModelProviderConfigImageBased,
  type ModelProviderConfigTokenBased,
} from "../models/models";

/** Look up a chat model definition by a media-gen model ID (shared string values) */
const chatDef = (id: ImageGenModelId): ModelDefinition =>
  (chatModelDefinitions as Record<string, ModelDefinition>)[id];

export enum ImageGenModelId {
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
  SEEDREAM_4_5 = "seedream-4.5",
  MODELSLAB_GEN4_T2I_TURBO = "modelslab-gen4-t2i-turbo",
  // --- AUTO-GENERATED from chat models with matching output modality ---
  GEMINI_3_1_FLASH_IMAGE_PREVIEW = "gemini-3.1-flash-image-preview",
  GEMINI_3_PRO_IMAGE_PREVIEW = "gemini-3-pro-image-preview",
  GPT_5_IMAGE_MINI = "gpt-5-image-mini",
  GPT_5_IMAGE = "gpt-5-image",
  // --- END AUTO-GENERATED ---
}

export const imageGenModelDefinitions: Record<
  ImageGenModelId,
  ModelDefinition
> = {
  [ImageGenModelId.DALL_E_3]: {
    name: "DALL-E 3",
    by: "openAI",
    description: "chat.models.descriptions.dallE3",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "si-openai",
    inputs: ["text"], // updated: 2026-04-03 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-03 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.DALL_E_3,
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
  [ImageGenModelId.GPT_IMAGE_1]: {
    name: "GPT-Image-1",
    by: "openAI",
    description: "chat.models.descriptions.gptImage1",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "si-openai",
    inputs: ["text"], // updated: 2026-04-03 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-03 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.GPT_IMAGE_1,
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
  [ImageGenModelId.FLUX_SCHNELL]: {
    name: "Flux Schnell",
    by: "blackForestLabs",
    description: "chat.models.descriptions.fluxSchnell",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-03 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-03 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.FLUX_SCHNELL,
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
  [ImageGenModelId.FLUX_PRO]: {
    name: "Flux Pro",
    by: "blackForestLabs",
    description: "chat.models.descriptions.fluxPro",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-03 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-03 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.FLUX_PRO,
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
  [ImageGenModelId.SDXL]: {
    name: "Stable Diffusion XL",
    by: "stabilityAI",
    description: "chat.models.descriptions.sdxl",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "image",
    inputs: ["text"], // updated: 2026-04-03 from image-gen-deterministic
    outputs: ["image"], // updated: 2026-04-03 from image-gen-deterministic
    providers: [
      {
        id: ImageGenModelId.SDXL,
        apiProvider: ApiProvider.REPLICATE,
        providerModel: "stability-ai/sdxl",
        creditCostPerImage: 0.19, // updated: 2026-04-03 from replicate-html-p50
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
  // Auto-generated chat model entries — definitions sourced from chatModelDefinitions
  // Re-run: vibe update-all-model-prices or vibe gen
  [ImageGenModelId.GEMINI_3_PRO_IMAGE_PREVIEW]: chatDef(
    ImageGenModelId.GEMINI_3_PRO_IMAGE_PREVIEW,
  ),
  [ImageGenModelId.GPT_5_IMAGE_MINI]: chatDef(ImageGenModelId.GPT_5_IMAGE_MINI),
  [ImageGenModelId.GPT_5_IMAGE]: chatDef(ImageGenModelId.GPT_5_IMAGE),
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
  // Multimodal image+chat models — also in chatModelDefinitions
  [ImageGenModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW]: chatDef(
    ImageGenModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW,
  ),
  [ImageGenModelId.MODELSLAB_GEN4_T2I_TURBO]: {
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
        id: ImageGenModelId.MODELSLAB_GEN4_T2I_TURBO,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "gen4_image_turbo",
        creditCostPerImage: 2.5, // updated: 2026-03-31 from modelslab.com
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
};

export type ImageGenModelOption = (
  | ModelOptionImageBased
  | ModelOptionTokenBased
) & { id: ImageGenModelId };

function buildImageGenModelOptions(): Record<string, ImageGenModelOption> {
  const result: Record<string, ImageGenModelOption> = {};
  for (const [modelId, def] of Object.entries(imageGenModelDefinitions)) {
    const sortedProviders = [...def.providers].toSorted(
      (a, b) => getProviderPrice(a) - getProviderPrice(b),
    );
    for (const provider of sortedProviders) {
      if ("creditCostPerImage" in provider) {
        const p = provider as ModelProviderConfigImageBased;
        result[modelId] = {
          id: modelId as ImageGenModelId,
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
          creditCostPerImage: p.creditCostPerImage,
        } satisfies ModelOptionImageBased & { id: ImageGenModelId };
      } else {
        const p = provider as ModelProviderConfigTokenBased;
        result[modelId] = {
          id: modelId as ImageGenModelId,
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
          creditCost: p.creditCost,
          inputTokenCost: p.inputTokenCost,
          outputTokenCost: p.outputTokenCost,
          cacheReadTokenCost: p.cacheReadTokenCost,
          cacheWriteTokenCost: p.cacheWriteTokenCost,
        } satisfies ModelOptionTokenBased & { id: ImageGenModelId };
      }
    }
  }
  return result;
}

const imageGenModelOptionsIndex: Record<string, ImageGenModelOption> =
  buildImageGenModelOptions();

export const imageGenModelOptions: ImageGenModelOption[] = Object.values(
  imageGenModelOptionsIndex,
).filter((m): m is ImageGenModelOption => m !== undefined);

export const ImageGenModelIdOptions = Object.values(ImageGenModelId).map(
  (id) => ({
    value: id,
    label: imageGenModelOptions.find((m) => m.id === id)?.name ?? id,
  }),
);

export function getImageGenModelById(
  modelId: ImageGenModelId,
): ImageGenModelOption {
  return imageGenModelOptionsIndex[modelId];
}

/** Check if a model ID (from any enum) also exists as an image gen model */
export function isImageGenModelId(modelId: string): boolean {
  return modelId in imageGenModelOptionsIndex;
}
