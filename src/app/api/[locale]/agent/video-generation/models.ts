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
  type ModelOptionVideoBased,
  type ModelProviderConfigVideoBased,
} from "../models/models";

export enum VideoGenModelId {
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
  MODELSLAB_GEN4_ALEPH = "modelslab-gen4-aleph",
  MODELSLAB_LIPSYNC_2 = "modelslab-lipsync-2",
  MODELSLAB_GROK_T2V = "modelslab-grok-t2v",
  MODELSLAB_GROK_I2V = "modelslab-grok-i2v",
  // --- AUTO-GENERATED from chat models with matching output modality ---
  // --- END AUTO-GENERATED ---
}

export const videoGenModelDefinitions: Record<
  VideoGenModelId,
  ModelDefinition
> = {
  [VideoGenModelId.MODELSLAB_WAN_2_5_T2V]: {
    name: "Wan 2.5 T2V",
    by: "alibaba",
    description: "chat.models.descriptions.modelsLabWan25T2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_WAN_2_5_T2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_WAN_2_5_I2V]: {
    name: "Wan 2.5 I2V",
    by: "alibaba",
    description: "chat.models.descriptions.modelsLabWan25I2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_WAN_2_5_I2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_WAN_2_6_T2V]: {
    name: "Wan 2.6 T2V",
    by: "alibaba",
    description: "chat.models.descriptions.modelsLabWan26T2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_WAN_2_6_T2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_WAN_2_6_I2V]: {
    name: "Wan 2.6 I2V",
    by: "alibaba",
    description: "chat.models.descriptions.modelsLabWan26I2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_WAN_2_6_I2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_WAN_2_6_I2V_FLASH]: {
    name: "Wan 2.6 I2V Flash",
    by: "alibaba",
    description: "chat.models.descriptions.modelsLabWan26I2VFlash",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_WAN_2_6_I2V_FLASH,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_SEEDANCE_T2V]: {
    name: "Seedance T2V",
    by: "byteplus",
    description: "chat.models.descriptions.modelsLabSeedanceT2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_SEEDANCE_T2V,
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

  [VideoGenModelId.MODELSLAB_SEEDANCE_I2V]: {
    name: "Seedance I2V",
    by: "byteplus",
    description: "chat.models.descriptions.modelsLabSeedanceI2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_SEEDANCE_I2V,
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

  [VideoGenModelId.MODELSLAB_OMNIHUMAN]: {
    name: "Omnihuman",
    by: "byteplus",
    description: "chat.models.descriptions.modelsLabOmnihuman",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_OMNIHUMAN,
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

  [VideoGenModelId.MODELSLAB_SEEDANCE_1_PRO_I2V]: {
    name: "Seedance 1.0 Pro I2V",
    by: "byteplus",
    description: "chat.models.descriptions.modelsLabSeedance1ProI2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_SEEDANCE_1_PRO_I2V,
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

  [VideoGenModelId.MODELSLAB_SEEDANCE_1_PRO_FAST_I2V]: {
    name: "Seedance 1.0 Pro Fast I2V",
    by: "byteplus",
    description: "chat.models.descriptions.modelsLabSeedance1ProFastI2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_SEEDANCE_1_PRO_FAST_I2V,
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

  [VideoGenModelId.MODELSLAB_SEEDANCE_1_PRO_FAST_T2V]: {
    name: "Seedance 1.0 Pro Fast T2V",
    by: "byteplus",
    description: "chat.models.descriptions.modelsLabSeedance1ProFastT2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_SEEDANCE_1_PRO_FAST_T2V,
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

  [VideoGenModelId.MODELSLAB_OMNIHUMAN_1_5]: {
    name: "Omnihuman 1.5",
    by: "byteplus",
    description: "chat.models.descriptions.modelsLabOmnihuman15",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_OMNIHUMAN_1_5,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_SEEDANCE_1_5_PRO]: {
    name: "Seedance 1.5 Pro",
    by: "byteplus",
    description: "chat.models.descriptions.modelsLabSeedance15Pro",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_SEEDANCE_1_5_PRO,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_VEO_2]: {
    name: "Veo 2",
    by: "google",
    description: "chat.models.descriptions.modelsLabVeo2",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_VEO_2,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_VEO_3]: {
    name: "Veo 3",
    by: "google",
    description: "chat.models.descriptions.modelsLabVeo3",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_VEO_3,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_VEO_3_FAST]: {
    name: "Veo 3 Fast",
    by: "google",
    description: "chat.models.descriptions.modelsLabVeo3Fast",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_VEO_3_FAST,
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

  [VideoGenModelId.MODELSLAB_VEO_3_FAST_PREVIEW]: {
    name: "Veo 3 Fast Preview",
    by: "google",
    description: "chat.models.descriptions.modelsLabVeo3FastPreview",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_VEO_3_FAST_PREVIEW,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_VEO_3_1]: {
    name: "Veo 3.1",
    by: "google",
    description: "chat.models.descriptions.modelsLabVeo31",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_VEO_3_1,
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

  [VideoGenModelId.MODELSLAB_VEO_3_1_FAST]: {
    name: "Veo 3.1 Fast",
    by: "google",
    description: "chat.models.descriptions.modelsLabVeo31Fast",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_VEO_3_1_FAST,
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

  [VideoGenModelId.MODELSLAB_KLING_V2_1_I2V]: {
    name: "Kling V2.1 I2V",
    by: "klingai",
    description: "chat.models.descriptions.modelsLabKlingV21I2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_KLING_V2_1_I2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_KLING_V2_5_TURBO_I2V]: {
    name: "Kling V2.5 Turbo I2V",
    by: "klingai",
    description: "chat.models.descriptions.modelsLabKlingV25TurboI2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_KLING_V2_5_TURBO_I2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_KLING_V2_5_TURBO_T2V]: {
    name: "Kling V2.5 Turbo T2V",
    by: "klingai",
    description: "chat.models.descriptions.modelsLabKlingV25TurboT2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_KLING_V2_5_TURBO_T2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_KLING_V2_MASTER_T2V]: {
    name: "Kling V2 Master T2V",
    by: "klingai",
    description: "chat.models.descriptions.modelsLabKlingV2MasterT2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_KLING_V2_MASTER_T2V,
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

  [VideoGenModelId.MODELSLAB_KLING_V2_MASTER_I2V]: {
    name: "Kling V2 Master I2V",
    by: "klingai",
    description: "chat.models.descriptions.modelsLabKlingV2MasterI2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_KLING_V2_MASTER_I2V,
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

  [VideoGenModelId.MODELSLAB_KLING_V2_1_MASTER_T2V]: {
    name: "Kling V2.1 Master T2V",
    by: "klingai",
    description: "chat.models.descriptions.modelsLabKlingV21MasterT2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_KLING_V2_1_MASTER_T2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_KLING_V2_1_MASTER_I2V]: {
    name: "Kling V2.1 Master I2V",
    by: "klingai",
    description: "chat.models.descriptions.modelsLabKlingV21MasterI2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_KLING_V2_1_MASTER_I2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_KLING_V1_6_MULTI_I2V]: {
    name: "Kling V1.6 Multi I2V",
    by: "klingai",
    description: "chat.models.descriptions.modelsLabKlingV16MultiI2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_KLING_V1_6_MULTI_I2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_KLING_3_0_T2V]: {
    name: "Kling 3.0 T2V",
    by: "klingai",
    description: "chat.models.descriptions.modelsLabKling30T2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_KLING_3_0_T2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_LTX_2_PRO_T2V]: {
    name: "LTX 2 PRO T2V",
    by: "ltx",
    description: "chat.models.descriptions.modelsLabLtx2ProT2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_LTX_2_PRO_T2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_LTX_2_PRO_I2V]: {
    name: "LTX 2 PRO I2V",
    by: "ltx",
    description: "chat.models.descriptions.modelsLabLtx2ProI2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_LTX_2_PRO_I2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_LTX_2_3_PRO_I2V]: {
    name: "LTX 2.3 Pro I2V",
    by: "ltx",
    description: "chat.models.descriptions.modelsLabLtx23ProI2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_LTX_2_3_PRO_I2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_HAILUO_2_3_T2V]: {
    name: "Hailuo 2.3 T2V",
    by: "minimax",
    description: "chat.models.descriptions.modelsLabHailuo23T2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_HAILUO_2_3_T2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_HAILUO_02_T2V]: {
    name: "Hailuo 02 T2V",
    by: "minimax",
    description: "chat.models.descriptions.modelsLabHailuo02T2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_HAILUO_02_T2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_HAILUO_2_3_I2V]: {
    name: "Hailuo 2.3 I2V",
    by: "minimax",
    description: "chat.models.descriptions.modelsLabHailuo23I2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_HAILUO_2_3_I2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_HAILUO_2_3_FAST_I2V]: {
    name: "Hailuo 2.3 Fast I2V",
    by: "minimax",
    description: "chat.models.descriptions.modelsLabHailuo23FastI2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_HAILUO_2_3_FAST_I2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_HAILUO_02_I2V]: {
    name: "Hailuo 02 I2V",
    by: "minimax",
    description: "chat.models.descriptions.modelsLabHailuo02I2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_HAILUO_02_I2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_HAILUO_02_START_END]: {
    name: "Hailuo 02 Start/End",
    by: "minimax",
    description: "chat.models.descriptions.modelsLabHailuo02StartEnd",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_HAILUO_02_START_END,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_SORA_2]: {
    name: "Sora 2",
    by: "openAI",
    description: "chat.models.descriptions.modelsLabSora2",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_SORA_2,
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

  [VideoGenModelId.MODELSLAB_SORA_2_PRO]: {
    name: "Sora 2 Pro",
    by: "openAI",
    description: "chat.models.descriptions.modelsLabSora2Pro",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_SORA_2_PRO,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_GEN4_ALEPH]: {
    name: "Gen4 Aleph",
    by: "runway",
    description: "chat.models.descriptions.modelsLabGen4Aleph",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_GEN4_ALEPH,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_LIPSYNC_2]: {
    name: "Lipsync 2",
    by: "sync",
    description: "chat.models.descriptions.modelsLabLipsync2",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_LIPSYNC_2,
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

  [VideoGenModelId.MODELSLAB_GROK_T2V]: {
    name: "Grok T2V",
    by: "xai",
    description: "chat.models.descriptions.modelsLabGrokT2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_GROK_T2V,
        apiProvider: ApiProvider.MODELSLAB,
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

  [VideoGenModelId.MODELSLAB_GROK_I2V]: {
    name: "Grok I2V",
    by: "xai",
    description: "chat.models.descriptions.modelsLabGrokI2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-03 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.MODELSLAB_GROK_I2V,
        apiProvider: ApiProvider.MODELSLAB,
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
};

export type VideoGenModelOption = ModelOptionVideoBased & {
  id: VideoGenModelId;
};

function buildVideoGenModelOptions(): Record<string, VideoGenModelOption> {
  const result: Record<string, VideoGenModelOption> = {};
  for (const [modelId, def] of Object.entries(videoGenModelDefinitions)) {
    const sortedProviders = [...def.providers].toSorted(
      (a, b) => getProviderPrice(a) - getProviderPrice(b),
    );
    for (const provider of sortedProviders) {
      if (
        "creditCostPerSecond" in provider &&
        "defaultDurationSeconds" in provider
      ) {
        const p = provider as ModelProviderConfigVideoBased;
        result[modelId] = {
          id: modelId as VideoGenModelId,
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
          creditCostPerSecond: p.creditCostPerSecond,
          defaultDurationSeconds: p.defaultDurationSeconds,
        };
      }
    }
  }
  return result;
}

const videoGenModelOptionsIndex: Record<string, VideoGenModelOption> =
  buildVideoGenModelOptions();

export const videoGenModelOptions: VideoGenModelOption[] = Object.values(
  videoGenModelOptionsIndex,
).filter((m): m is VideoGenModelOption => m !== undefined);

export const VideoGenModelIdOptions = Object.values(VideoGenModelId).map(
  (id) => ({
    value: id,
    label: videoGenModelOptions.find((m) => m.id === id)?.name ?? id,
  }),
);

export function getVideoGenModelById(
  modelId: VideoGenModelId,
): VideoGenModelOption {
  return videoGenModelOptionsIndex[modelId];
}

/** Check if a model ID (from any enum) also exists as a video gen model */
export function isVideoGenModelId(modelId: string): boolean {
  return modelId in videoGenModelOptionsIndex;
}
