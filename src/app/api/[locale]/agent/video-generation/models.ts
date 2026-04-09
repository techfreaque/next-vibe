import { z } from "zod";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  SpeedLevel,
} from "../chat/skills/enum";
import {
  filtersSelectionSchema,
  sharedFilterPropsSchema,
} from "../models/selection";
import { ModelUtility } from "../models/enum";
import {
  ApiProvider,
  defaultFeatures,
  filterRoleModels,
  getProviderPrice,
  type ModelDefinition,
  type ModelOptionVideoBased,
  type ModelProviderConfigVideoBased,
  type ModelProviderEnvAvailability,
} from "../models/models";

export enum VideoGenModelId {
  WAN_2_7_T2V = "wan-2-7-t2v",
  WAN_2_6_I2V = "wan-2-6-i2v",
  WAN_2_6_I2V_FLASH = "wan-2-6-i2v-flash",
  SEEDANCE_1_5_PRO = "seedance-1-5-pro",
  OMNIHUMAN_1_5 = "omnihuman-1-5",
  VEO_3_1 = "veo-3-1",
  VEO_3_1_FAST = "veo-3-1-fast",
  KLING_V2_5_TURBO_I2V = "kling-v2-5-turbo-i2v",
  KLING_V2_5_TURBO_T2V = "kling-v2-5-turbo-t2v",
  KLING_V2_1_MASTER_T2V = "kling-v2-1-master-t2v",
  KLING_V2_1_MASTER_I2V = "kling-v2-1-master-i2v",
  KLING_3_0_T2V = "kling-3-0-t2v",
  LTX_2_PRO_T2V = "ltx-2-pro-t2v",
  LTX_2_3_PRO_I2V = "ltx-2-3-pro-i2v",
  HAILUO_2_3_T2V = "hailuo-2-3-t2v",
  HAILUO_2_3_I2V = "hailuo-2-3-i2v",
  HAILUO_2_3_FAST_I2V = "hailuo-2-3-fast-i2v",
  SORA_2 = "sora-2",
  SORA_2_PRO = "sora-2-pro",
  GEN4_ALEPH = "gen4-aleph",
  LIPSYNC_2 = "lipsync-2",
  GROK_T2V = "grok-t2v",
  GROK_I2V = "grok-i2v",
  // BEGIN:llm-generated - do not edit manually, updated by price updater
  // END:llm-generated
}

export const videoGenModelDefinitions: Record<
  VideoGenModelId,
  ModelDefinition
> = {
  [VideoGenModelId.WAN_2_7_T2V]: {
    name: "Wan 2.7 T2V",
    by: "alibaba",
    description: "chat.models.descriptions.modelsLabWan27T2V",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-04-04 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-04 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.WAN_2_7_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "wan2.7-t2v",
        creditCostPerSecond: 10, // updated: 2026-04-04 from modelslab.com
        supportedResolutions: ["1080p"], // updated: 2026-04-04 from modelslab.com
        minDurationSeconds: 5, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 15, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["5", "10", "15"], // updated: 2026-04-04 from modelslab.com
        pricingByResolution: { "720p": 10, "1080p": 15 }, // updated: 2026-04-07 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.WAN_2_7_T2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "wan-2-7-t2v",
        creditCostPerSecond: 13, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 5,
        maxDurationSeconds: 15,
        supportedDurations: ["5", "10", "15"],
        supportedResolutions: ["1080p"],
        pricingByResolution: { "720p": 13, "1080p": 19.5 }, // updated: 2026-04-07 from unbottled.ai
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

  [VideoGenModelId.WAN_2_6_I2V]: {
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
        id: VideoGenModelId.WAN_2_6_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "wan2.6-i2v",
        creditCostPerSecond: 10, // updated: 2026-04-04 from modelslab.com
        supportedResolutions: ["1080p"], // updated: 2026-04-04 from modelslab.com
        minDurationSeconds: 5, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 15, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["5", "10", "15"], // updated: 2026-04-04 from modelslab.com
        pricingByResolution: { "720p": 10, "1080p": 15 }, // updated: 2026-04-07 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.WAN_2_6_I2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "wan-2-6-i2v",
        creditCostPerSecond: 13, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 5,
        maxDurationSeconds: 15,
        supportedDurations: ["5", "10", "15"],
        supportedResolutions: ["1080p"],
        pricingByResolution: { "720p": 13, "1080p": 19.5 }, // updated: 2026-04-07 from unbottled.ai
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

  [VideoGenModelId.WAN_2_6_I2V_FLASH]: {
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
        id: VideoGenModelId.WAN_2_6_I2V_FLASH,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "wan2.6-i2v-flash",
        creditCostPerSecond: 5, // updated: 2026-03-31 from modelslab.com
        supportedResolutions: ["1080p"], // updated: 2026-04-04 from modelslab.com
        minDurationSeconds: 5, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 5, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["5"], // updated: 2026-04-04 from modelslab.com
        pricingByResolution: { "720p": 5, "1080p": 7.5 }, // updated: 2026-04-07 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.WAN_2_6_I2V_FLASH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "wan-2-6-i2v-flash",
        creditCostPerSecond: 6.5, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 5,
        maxDurationSeconds: 5,
        supportedDurations: ["5"],
        supportedResolutions: ["1080p"],
        pricingByResolution: { "720p": 6.5, "1080p": 9.75 }, // updated: 2026-04-07 from unbottled.ai
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

  [VideoGenModelId.SEEDANCE_1_5_PRO]: {
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
        id: VideoGenModelId.SEEDANCE_1_5_PRO,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "seedance-1-5-pro",
        creditCostPerSecond: 4.4, // updated: 2026-04-04 from modelslab.com
        supportedAspectRatios: ["16:9", "9:16"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.SEEDANCE_1_5_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "seedance-1-5-pro",
        creditCostPerSecond: 5.72, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        supportedAspectRatios: ["16:9", "9:16"],
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

  [VideoGenModelId.OMNIHUMAN_1_5]: {
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
        id: VideoGenModelId.OMNIHUMAN_1_5,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "omni-human-1.5",
        creditCostPerSecond: 14, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.OMNIHUMAN_1_5,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "omnihuman-1-5",
        creditCostPerSecond: 18.2, // updated: 2026-04-07 from unbottled.ai
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

  [VideoGenModelId.VEO_3_1]: {
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
        id: VideoGenModelId.VEO_3_1,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "veo-3.1",
        creditCostPerSecond: 48, // updated: 2026-03-31 from modelslab.com
        supportedAspectRatios: ["16:9", "9:16"], // updated: 2026-04-04 from modelslab.com
        minDurationSeconds: 3, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 8, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["3", "4", "6", "8"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.VEO_3_1,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "veo-3-1",
        creditCostPerSecond: 62.4, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 3,
        maxDurationSeconds: 8,
        supportedDurations: ["3", "4", "6", "8"],
        supportedAspectRatios: ["16:9", "9:16"],
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

  [VideoGenModelId.VEO_3_1_FAST]: {
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
        id: VideoGenModelId.VEO_3_1_FAST,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "veo-3.1-fast",
        creditCostPerSecond: 24, // updated: 2026-03-31 from modelslab.com
        supportedAspectRatios: ["16:9", "9:16"], // updated: 2026-04-04 from modelslab.com
        minDurationSeconds: 3, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 8, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["3", "4", "6", "8"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.VEO_3_1_FAST,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "veo-3-1-fast",
        creditCostPerSecond: 31.2, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 3,
        maxDurationSeconds: 8,
        supportedDurations: ["3", "4", "6", "8"],
        supportedAspectRatios: ["16:9", "9:16"],
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

  [VideoGenModelId.KLING_V2_5_TURBO_I2V]: {
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
        id: VideoGenModelId.KLING_V2_5_TURBO_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "kling-v2-5-turbo-i2v",
        creditCostPerSecond: 8.4, // updated: 2026-03-31 from modelslab.com
        minDurationSeconds: 5, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 10, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["5", "10"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.KLING_V2_5_TURBO_I2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kling-v2-5-turbo-i2v",
        creditCostPerSecond: 10.92, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 5,
        maxDurationSeconds: 10,
        supportedDurations: ["5", "10"],
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

  [VideoGenModelId.KLING_V2_5_TURBO_T2V]: {
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
        id: VideoGenModelId.KLING_V2_5_TURBO_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "kling-v2-5-turbo-t2v",
        creditCostPerSecond: 8.4, // updated: 2026-03-31 from modelslab.com
        supportedAspectRatios: ["16:9", "9:16", "1:1"], // updated: 2026-04-04 from modelslab.com
        minDurationSeconds: 5, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 10, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["5", "10"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.KLING_V2_5_TURBO_T2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kling-v2-5-turbo-t2v",
        creditCostPerSecond: 10.92, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 5,
        maxDurationSeconds: 10,
        supportedDurations: ["5", "10"],
        supportedAspectRatios: ["16:9", "9:16", "1:1"],
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

  [VideoGenModelId.KLING_V2_1_MASTER_T2V]: {
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
        id: VideoGenModelId.KLING_V2_1_MASTER_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "kling-v2-1-master-t2v",
        creditCostPerSecond: 33.6, // updated: 2026-03-31 from modelslab.com
        minDurationSeconds: 5, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 10, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["5", "10"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.KLING_V2_1_MASTER_T2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kling-v2-1-master-t2v",
        creditCostPerSecond: 43.68, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 5,
        maxDurationSeconds: 10,
        supportedDurations: ["5", "10"],
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

  [VideoGenModelId.KLING_V2_1_MASTER_I2V]: {
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
        id: VideoGenModelId.KLING_V2_1_MASTER_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "kling-v2-1-master-i2v",
        creditCostPerSecond: 33.6, // updated: 2026-03-31 from modelslab.com
        minDurationSeconds: 5, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 10, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["5", "10"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.KLING_V2_1_MASTER_I2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kling-v2-1-master-i2v",
        creditCostPerSecond: 43.68, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 5,
        maxDurationSeconds: 10,
        supportedDurations: ["5", "10"],
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

  [VideoGenModelId.KLING_3_0_T2V]: {
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
        id: VideoGenModelId.KLING_3_0_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "kling-v3-t2v",
        creditCostPerSecond: 10, // updated: 2026-03-31 from modelslab.com
        supportedAspectRatios: ["16:9", "9:16", "1:1"], // updated: 2026-04-04 from modelslab.com
        minDurationSeconds: 5, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 10, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["5", "10"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.KLING_3_0_T2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kling-3-0-t2v",
        creditCostPerSecond: 13, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 5,
        maxDurationSeconds: 10,
        supportedDurations: ["5", "10"],
        supportedAspectRatios: ["16:9", "9:16", "1:1"],
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

  [VideoGenModelId.LTX_2_PRO_T2V]: {
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
        id: VideoGenModelId.LTX_2_PRO_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "ltx-2-pro-t2v",
        creditCostPerSecond: 1.4, // updated: 2026-04-04 from modelslab.com
        supportedResolutions: ["2K", "4K"], // updated: 2026-04-04 from modelslab.com
        minDurationSeconds: 6, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 10, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["6", "8", "10"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.LTX_2_PRO_T2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "ltx-2-pro-t2v",
        creditCostPerSecond: 1.82, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 6,
        maxDurationSeconds: 10,
        supportedDurations: ["6", "8", "10"],
        supportedResolutions: ["2K", "4K"],
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

  [VideoGenModelId.LTX_2_3_PRO_I2V]: {
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
        id: VideoGenModelId.LTX_2_3_PRO_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "ltx-2-3-pro-i2v",
        creditCostPerSecond: 1.4, // updated: 2026-04-04 from modelslab.com
        supportedResolutions: ["2K", "4K"], // updated: 2026-04-04 from modelslab.com
        minDurationSeconds: 6, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 10, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["6", "8", "10"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.LTX_2_3_PRO_I2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "ltx-2-3-pro-i2v",
        creditCostPerSecond: 1.82, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 6,
        maxDurationSeconds: 10,
        supportedDurations: ["6", "8", "10"],
        supportedResolutions: ["2K", "4K"],
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

  [VideoGenModelId.HAILUO_2_3_T2V]: {
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
        id: VideoGenModelId.HAILUO_2_3_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "Hailuo-2.3-t2v",
        creditCostPerSecond: 5.5, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.HAILUO_2_3_T2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "hailuo-2-3-t2v",
        creditCostPerSecond: 7.15, // updated: 2026-04-07 from unbottled.ai
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

  [VideoGenModelId.HAILUO_2_3_I2V]: {
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
        id: VideoGenModelId.HAILUO_2_3_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "Hailuo-2.3-i2v",
        creditCostPerSecond: 5.5, // updated: 2026-03-31 from modelslab.com
        minDurationSeconds: 6, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 10, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["6", "10"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.HAILUO_2_3_I2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "hailuo-2-3-i2v",
        creditCostPerSecond: 7.15, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 6,
        maxDurationSeconds: 10,
        supportedDurations: ["6", "10"],
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

  [VideoGenModelId.HAILUO_2_3_FAST_I2V]: {
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
        id: VideoGenModelId.HAILUO_2_3_FAST_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "Hailuo-2.3-Fast-i2v",
        creditCostPerSecond: 3.8, // updated: 2026-03-31 from modelslab.com
        minDurationSeconds: 6, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 10, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["6", "10"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.HAILUO_2_3_FAST_I2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "hailuo-2-3-fast-i2v",
        creditCostPerSecond: 4.94, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 6,
        maxDurationSeconds: 10,
        supportedDurations: ["6", "10"],
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

  [VideoGenModelId.SORA_2]: {
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
        id: VideoGenModelId.SORA_2,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "sora-2",
        creditCostPerSecond: 12.5, // updated: 2026-03-31 from modelslab.com
        supportedAspectRatios: ["16:9", "9:16"], // updated: 2026-04-04 from modelslab.com
        minDurationSeconds: 4, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 12, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["2", "4", "8", "12"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.SORA_2,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "sora-2",
        creditCostPerSecond: 16.25, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 4,
        maxDurationSeconds: 12,
        supportedDurations: ["2", "4", "8", "12"],
        supportedAspectRatios: ["16:9", "9:16"],
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

  [VideoGenModelId.SORA_2_PRO]: {
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
        id: VideoGenModelId.SORA_2_PRO,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "sora-2-pro-t2v",
        creditCostPerSecond: 36, // updated: 2026-03-31 from modelslab.com
        supportedAspectRatios: ["16:9", "9:16"], // updated: 2026-04-04 from modelslab.com
        minDurationSeconds: 4, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 12, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["2", "4", "8", "12"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.SORA_2_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "sora-2-pro",
        creditCostPerSecond: 46.8, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 4,
        maxDurationSeconds: 12,
        supportedDurations: ["2", "4", "8", "12"],
        supportedAspectRatios: ["16:9", "9:16"],
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

  [VideoGenModelId.GEN4_ALEPH]: {
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
        id: VideoGenModelId.GEN4_ALEPH,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "gen4_aleph",
        creditCostPerSecond: 18, // updated: 2026-03-31 from modelslab.com
        supportedAspectRatios: [
          "16:9",
          "9:16",
          "69:52",
          "1:1",
          "52:69",
          "33:14",
          "53:30",
          "4:3",
        ], // updated: 2026-04-07 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.GEN4_ALEPH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gen4-aleph",
        creditCostPerSecond: 23.4, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        supportedAspectRatios: [
          "16:9",
          "9:16",
          "69:52",
          "1:1",
          "52:69",
          "33:14",
          "53:30",
          "4:3",
        ],
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

  [VideoGenModelId.LIPSYNC_2]: {
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
        id: VideoGenModelId.LIPSYNC_2,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "lipsync-2",
        creditCostPerSecond: 7, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.LIPSYNC_2,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "lipsync-2",
        creditCostPerSecond: 9.1, // updated: 2026-04-07 from unbottled.ai
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

  [VideoGenModelId.GROK_T2V]: {
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
        id: VideoGenModelId.GROK_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "grok-t2v",
        creditCostPerSecond: 6, // updated: 2026-03-31 from modelslab.com
        supportedResolutions: ["720p"], // updated: 2026-04-04 from modelslab.com
        minDurationSeconds: 1, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 15, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["1", "15"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.GROK_T2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "grok-t2v",
        creditCostPerSecond: 7.8, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 1,
        maxDurationSeconds: 15,
        supportedDurations: ["1", "15"],
        supportedResolutions: ["720p"],
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

  [VideoGenModelId.GROK_I2V]: {
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
        id: VideoGenModelId.GROK_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "grok-i2v",
        creditCostPerSecond: 6, // updated: 2026-03-31 from modelslab.com
        minDurationSeconds: 1, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 15, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["1", "15"], // updated: 2026-04-04 from modelslab.com
        supportedResolutions: ["HD"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.GROK_I2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "grok-i2v",
        creditCostPerSecond: 7.8, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 1,
        maxDurationSeconds: 15,
        supportedDurations: ["1", "15"],
        supportedResolutions: ["HD"],
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

function buildVideoGenOption(
  modelId: VideoGenModelId,
  def: ModelDefinition,
  provider: ModelProviderConfigVideoBased,
): VideoGenModelOption {
  const p = provider satisfies ModelProviderConfigVideoBased;
  return {
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
    creditCostPerSecond: p.creditCostPerSecond,
    defaultDurationSeconds: p.defaultDurationSeconds,
    supportedDurations: p.supportedDurations,
    maxDurationSeconds: p.maxDurationSeconds,
    minDurationSeconds: p.minDurationSeconds,
    supportedResolutions: p.supportedResolutions,
    supportedAspectRatios: p.supportedAspectRatios,
    pricingByResolution: p.pricingByResolution,
  };
}

function buildVideoGenModelOptions(): Record<
  VideoGenModelId,
  VideoGenModelOption
> {
  const result = {} as Record<VideoGenModelId, VideoGenModelOption>;

  for (const modelId of Object.values(VideoGenModelId)) {
    const def = videoGenModelDefinitions[modelId];
    const sortedProviders = [...def.providers].toSorted(
      (a, b) => getProviderPrice(a) - getProviderPrice(b),
    );
    for (const provider of sortedProviders) {
      if (
        provider.creditCostPerSecond !== undefined &&
        provider.defaultDurationSeconds !== undefined
      ) {
        result[modelId] = buildVideoGenOption(
          modelId,
          def,
          provider satisfies ModelProviderConfigVideoBased,
        );
        break; // use cheapest provider only
      }
    }
  }

  return result;
}

const videoGenModelOptionsIndex: Record<VideoGenModelId, VideoGenModelOption> =
  buildVideoGenModelOptions();

export const videoGenModelOptions: VideoGenModelOption[] = Object.values(
  videoGenModelOptionsIndex,
);

export const VideoGenModelIdOptions = videoGenModelOptions.map((m) => ({
  value: m.id,
  label: m.name,
}));

export function getVideoGenModelById(
  modelId: VideoGenModelId,
): VideoGenModelOption | undefined {
  return videoGenModelOptionsIndex[modelId];
}

/**
 * Resolve a video gen model option using a specific API provider.
 * Picks the cheapest provider variant for `modelId` that matches `provider`.
 * Falls back to the default (cheapest overall) if no matching provider exists.
 */
export function getVideoGenModelForProvider(
  modelId: VideoGenModelId,
  provider: ApiProvider,
): VideoGenModelOption | undefined {
  const def = videoGenModelDefinitions[modelId];
  if (!def) {
    return undefined;
  }
  const matching = [...def.providers]
    .filter((p) => p.apiProvider === provider)
    .toSorted((a, b) => getProviderPrice(a) - getProviderPrice(b));

  for (const p of matching) {
    if (
      p.creditCostPerSecond !== undefined &&
      p.defaultDurationSeconds !== undefined
    ) {
      const typed = p satisfies ModelProviderConfigVideoBased;
      return {
        id: modelId,
        name: def.name,
        provider: def.by,
        apiProvider: p.apiProvider,
        description: def.description,
        parameterCount: def.parameterCount,
        contextWindow: def.contextWindow,
        icon: def.icon,
        providerModel: p.providerModel,
        utilities: def.utilities,
        supportsTools: def.supportsTools,
        intelligence: def.intelligence,
        speed: def.speed,
        content: def.content,
        features: def.features,
        weaknesses: def.weaknesses,
        adminOnly: p.adminOnly,
        inputs: def.inputs,
        outputs: def.outputs,
        voiceMeta: def.voiceMeta,
        creditCostPerSecond: typed.creditCostPerSecond,
        defaultDurationSeconds: typed.defaultDurationSeconds,
        supportedDurations: typed.supportedDurations,
        maxDurationSeconds: typed.maxDurationSeconds,
        minDurationSeconds: typed.minDurationSeconds,
        supportedResolutions: typed.supportedResolutions,
        supportedAspectRatios: typed.supportedAspectRatios,
        pricingByResolution: typed.pricingByResolution,
      };
    }
  }

  // No matching provider - fall back to default
  return getVideoGenModelById(modelId);
}

// ============================================================
// VIDEO GEN MODEL SELECTION SCHEMA
// ============================================================

export const videoGenModelSelectionSchema = z.discriminatedUnion(
  "selectionType",
  [
    z
      .object({
        selectionType: z.literal(ModelSelectionType.MANUAL),
        manualModelId: z.enum(VideoGenModelId),
      })
      .merge(sharedFilterPropsSchema),
    filtersSelectionSchema,
  ],
);
export type VideoGenModelSelection = z.infer<
  typeof videoGenModelSelectionSchema
>;

// ============================================================
// VIDEO GEN MODEL RESOLUTION
// ============================================================

export function filterVideoGenModels(
  selection: VideoGenModelSelection | null | undefined,
  user: JwtPayloadType,
  env: ModelProviderEnvAvailability,
): VideoGenModelOption[] {
  return filterRoleModels(videoGenModelOptions, selection, user, env);
}

export function getBestVideoGenModel(
  selection: VideoGenModelSelection,
  user: JwtPayloadType,
  env: ModelProviderEnvAvailability,
): VideoGenModelOption | null {
  return filterVideoGenModels(selection, user, env)[0] ?? null;
}
