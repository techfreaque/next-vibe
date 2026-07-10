import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { z } from "zod";

import type { AgentEnvAvailability } from "../env-availability";
import { type Modality, ModelUtility } from "../models/enum";
import {
  ApiProvider,
  buildModelOptionsIndex,
  defaultFeatures,
  filterRoleModels,
  getModelForProvider,
  getProviderPrice,
  type ModelDefinition,
  type ModelOptionVideoBased,
  type ModelProviderConfigVideoBased,
} from "../models/models";
import type { FiltersModelSelection } from "../models/selection";
import {
  filtersSelectionSchema,
  sharedFilterPropsSchema,
} from "../models/selection";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
} from "../skills/enum";

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
  KLING_V3_STD_T2V = "kling-v3-std-t2v",
  KLING_VIDEO_O1 = "kling-video-o1",
  VEO_3_1_LITE = "veo-3-1-lite",
  SEEDANCE_2 = "seedance-2",
  SEEDANCE_2_FAST = "seedance-2-fast",
  HAPPYHORSE_1_1 = "happyhorse-1-1",
  HAPPYHORSE_1_0 = "happyhorse-1-0",
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
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "alibaba/wan-2.7",
        creditCostPerSecond: 10, // updated: 2026-07-10 from openrouter.ai
        allowedPassthroughParameters: [
          "negative_prompt",
          "prompt_extend",
          "audio",
          "ratio",
          "last_image",
          "video",
          "videos",
          "images",
        ], // updated: 2026-07-10 from openrouter.ai
        supportedSizes: [
          "1280x720",
          "720x1280",
          "1920x1080",
          "1080x1920",
          "720x720",
          "1080x1080",
          "960x720",
          "720x960",
          "1440x1080",
          "1080x1440",
        ], // updated: 2026-07-10 from openrouter.ai
        generateAudio: true, // updated: 2026-07-10 from openrouter.ai
        supportedFrameImages: ["first_frame", "last_frame"], // updated: 2026-07-10 from openrouter.ai
        maxDurationSeconds: 10, // updated: 2026-07-10 from openrouter.ai
        minDurationSeconds: 2, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: ["2", "3", "4", "5", "6", "7", "8", "9", "10"], // updated: 2026-07-10 from openrouter.ai
        supportedResolutions: ["720p", "1080p"], // updated: 2026-07-10 from openrouter.ai
        supportedAspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"], // updated: 2026-07-10 from openrouter.ai
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.WAN_2_7_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "wan2.7-t2v",
        creditCostPerSecond: 10, // updated: 2026-04-04 from modelslab.com
        supportedResolutions: ["1080p"], // updated: 2026-04-04 from modelslab.com
        minDurationSeconds: 5, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 15, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["5", "10", "15"], // updated: 2026-04-04 from modelslab.com
        pricingByResolution: { "720p": 10, "1080p": 15 }, // updated: 2026-07-10 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.WAN_2_7_T2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "wan-2-7-t2v",
        creditCostPerSecond: 13, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 2,
        maxDurationSeconds: 10,
        supportedDurations: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
        supportedResolutions: ["720p", "1080p"],
        supportedAspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
    inputs: ["text"], // updated: 2026-07-10 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.WAN_2_6_I2V,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "alibaba/wan-2.6",
        creditCostPerSecond: 8, // updated: 2026-07-10 from openrouter.ai
        allowedPassthroughParameters: [
          "negative_prompt",
          "enable_prompt_expansion",
          "shot_type",
          "audio",
          "size",
        ], // updated: 2026-07-10 from openrouter.ai
        supportedSizes: ["1280x720", "1080x1920", "720x1280", "1920x1080"], // updated: 2026-07-10 from openrouter.ai
        generateAudio: true, // updated: 2026-07-10 from openrouter.ai
        supportedFrameImages: ["first_frame"], // updated: 2026-07-10 from openrouter.ai
        maxDurationSeconds: 10, // updated: 2026-07-10 from openrouter.ai
        minDurationSeconds: 5, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: ["5", "10"], // updated: 2026-07-10 from openrouter.ai
        supportedResolutions: ["720p", "1080p"], // updated: 2026-07-10 from openrouter.ai
        supportedAspectRatios: ["16:9", "9:16"], // updated: 2026-07-10 from openrouter.ai
        pricingByResolution: { "480p": 4, "720p": 8, "1080p": 12 }, // updated: 2026-07-10 from openrouter.ai
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.WAN_2_6_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "wan2.6-i2v",
        creditCostPerSecond: 10, // updated: 2026-04-04 from modelslab.com
        supportedResolutions: ["1080p"], // updated: 2026-07-10 from modelslab.com
        minDurationSeconds: 5, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 15, // updated: 2026-07-10 from modelslab.com
        supportedDurations: ["5", "10", "15"], // updated: 2026-07-10 from modelslab.com
        pricingByResolution: { "720p": 10, "1080p": 15 }, // updated: 2026-07-10 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.WAN_2_6_I2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "wan-2-6-i2v",
        creditCostPerSecond: 10.4, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 5,
        maxDurationSeconds: 10,
        supportedDurations: ["5", "10"],
        supportedResolutions: ["720p", "1080p"],
        supportedAspectRatios: ["16:9", "9:16"],
        pricingByResolution: { "480p": 5.2, "720p": 10.4, "1080p": 15.6 }, // updated: 2026-07-10 from unbottled.ai
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
    inputs: ["text"], // updated: 2026-07-10 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.WAN_2_6_I2V_FLASH,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "wan2.6-i2v-flash",
        creditCostPerSecond: 10, // updated: 2026-07-02 from modelslab.com
        supportedResolutions: ["1080p"], // updated: 2026-07-10 from modelslab.com
        minDurationSeconds: 5, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 10, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: ["5", "10"], // updated: 2026-07-10 from openrouter.ai
        pricingByResolution: { "720p": 10, "1080p": 15 }, // updated: 2026-07-10 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.WAN_2_6_I2V_FLASH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "wan-2-6-i2v-flash",
        creditCostPerSecond: 13, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 5,
        maxDurationSeconds: 10,
        supportedDurations: ["5", "10"],
        supportedResolutions: ["1080p"],
        pricingByResolution: { "720p": 13, "1080p": 19.5 }, // updated: 2026-07-10 from unbottled.ai
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "bytedance/seedance-1-5-pro",
        creditCostPerSecond: 0, // updated: 2026-07-10 from openrouter-api
        allowedPassthroughParameters: ["watermark", "req_key"], // updated: 2026-07-10 from openrouter.ai
        supportedSizes: [
          "480x480",
          "480x640",
          "480x854",
          "480x1120",
          "640x480",
          "720x720",
          "720x960",
          "720x1280",
          "720x1680",
          "854x480",
          "960x720",
          "1080x1080",
          "1080x1440",
          "1080x1920",
          "1080x2520",
          "1120x480",
          "1280x720",
          "1440x1080",
          "1680x720",
          "1920x1080",
          "2520x1080",
        ], // updated: 2026-07-10 from openrouter.ai
        generateAudio: true, // updated: 2026-07-10 from openrouter.ai
        supportedFrameImages: ["first_frame", "last_frame"], // updated: 2026-07-10 from openrouter.ai
        maxDurationSeconds: 12, // updated: 2026-07-10 from openrouter.ai
        minDurationSeconds: 4, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: ["4", "5", "6", "7", "8", "9", "10", "11", "12"], // updated: 2026-07-10 from openrouter.ai
        supportedResolutions: ["480p", "720p", "1080p"], // updated: 2026-07-10 from openrouter.ai
        supportedAspectRatios: [
          "1:1",
          "3:4",
          "9:16",
          "9:21",
          "4:3",
          "16:9",
          "21:9",
        ], // updated: 2026-07-10 from openrouter.ai
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.SEEDANCE_1_5_PRO,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "seedance-1-5-pro",
        creditCostPerSecond: 3, // updated: 2026-07-02 from modelslab.com
        supportedResolutions: ["720p", "1080p"], // updated: 2026-07-10 from modelslab.com
        supportedAspectRatios: ["16:9", "9:16"], // updated: 2026-07-10 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.SEEDANCE_1_5_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "seedance-1-5-pro",
        creditCostPerSecond: 0, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 4,
        maxDurationSeconds: 12,
        supportedDurations: ["4", "5", "6", "7", "8", "9", "10", "11", "12"],
        supportedResolutions: ["480p", "720p", "1080p"],
        supportedAspectRatios: [
          "1:1",
          "3:4",
          "9:16",
          "9:21",
          "4:3",
          "16:9",
          "21:9",
        ],
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
        creditCostPerSecond: 18.2, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
    // image: ModelsLab img2video accepts init_image for veo-3.1 (verified);
    // the -fast variant rejects it ("init_image is invalid").
    inputs: ["text"], // updated: 2026-07-10 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.VEO_3_1,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/veo-3.1",
        creditCostPerSecond: 40, // updated: 2026-07-10 from openrouter.ai
        allowedPassthroughParameters: [
          "personGeneration",
          "aspectRatio",
          "negativePrompt",
          "conditioningScale",
          "enhancePrompt",
        ], // updated: 2026-07-10 from openrouter.ai
        supportedSizes: [
          "1280x720",
          "1080x1920",
          "1920x1080",
          "720x1280",
          "3840x2160",
          "2160x3840",
        ], // updated: 2026-07-10 from openrouter.ai
        generateAudio: true, // updated: 2026-07-10 from openrouter.ai
        supportedFrameImages: ["first_frame", "last_frame"], // updated: 2026-07-10 from openrouter.ai
        maxDurationSeconds: 8, // updated: 2026-07-10 from openrouter.ai
        minDurationSeconds: 4, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: ["4", "6", "8"], // updated: 2026-07-10 from openrouter.ai
        supportedResolutions: ["720p", "1080p", "4K"], // updated: 2026-07-10 from openrouter.ai
        supportedAspectRatios: ["16:9", "9:16"], // updated: 2026-07-10 from openrouter.ai
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.VEO_3_1,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "veo-3.1",
        creditCostPerSecond: 48, // updated: 2026-03-31 from modelslab.com
        supportedAspectRatios: ["16:9", "9:16"], // updated: 2026-07-10 from modelslab.com
        minDurationSeconds: 3, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 8, // updated: 2026-07-10 from modelslab.com
        supportedDurations: ["3", "4", "6", "8"], // updated: 2026-07-10 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.VEO_3_1,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "veo-3-1",
        creditCostPerSecond: 52, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 4,
        maxDurationSeconds: 8,
        supportedDurations: ["4", "6", "8"],
        supportedResolutions: ["720p", "1080p", "4K"],
        supportedAspectRatios: ["16:9", "9:16"],
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/veo-3.1-fast",
        creditCostPerSecond: 12, // updated: 2026-07-10 from openrouter.ai
        allowedPassthroughParameters: [
          "personGeneration",
          "aspectRatio",
          "negativePrompt",
          "conditioningScale",
          "enhancePrompt",
        ], // updated: 2026-07-10 from openrouter.ai
        supportedSizes: [
          "1280x720",
          "1080x1920",
          "1920x1080",
          "720x1280",
          "3840x2160",
          "2160x3840",
        ], // updated: 2026-07-10 from openrouter.ai
        generateAudio: true, // updated: 2026-07-10 from openrouter.ai
        supportedFrameImages: ["first_frame", "last_frame"], // updated: 2026-07-10 from openrouter.ai
        maxDurationSeconds: 8, // updated: 2026-07-10 from openrouter.ai
        minDurationSeconds: 4, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: ["4", "6", "8"], // updated: 2026-07-10 from openrouter.ai
        supportedResolutions: ["720p", "1080p", "4K"], // updated: 2026-07-10 from openrouter.ai
        supportedAspectRatios: ["16:9", "9:16"], // updated: 2026-07-10 from openrouter.ai
        pricingByResolution: { "4k": 30, "720p": 10 }, // updated: 2026-07-10 from openrouter.ai
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.VEO_3_1_FAST,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "veo-3.1-fast",
        creditCostPerSecond: 24, // updated: 2026-03-31 from modelslab.com
        supportedAspectRatios: ["16:9", "9:16"], // updated: 2026-07-10 from modelslab.com
        minDurationSeconds: 3, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 8, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["3", "4", "6", "8"], // updated: 2026-07-10 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.VEO_3_1_FAST,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "veo-3-1-fast",
        creditCostPerSecond: 15.6, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 4,
        maxDurationSeconds: 8,
        supportedDurations: ["4", "6", "8"],
        supportedResolutions: ["720p", "1080p", "4K"],
        supportedAspectRatios: ["16:9", "9:16"],
        pricingByResolution: { "4k": 39, "720p": 13 }, // updated: 2026-07-10 from unbottled.ai
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
    inputs: ["text"], // updated: 2026-07-10 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.KLING_V2_5_TURBO_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "kling-v2-5-turbo-i2v",
        creditCostPerSecond: 8.4, // updated: 2026-03-31 from modelslab.com
        minDurationSeconds: 5, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 8, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: ["5", "10"], // updated: 2026-07-10 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.KLING_V2_5_TURBO_I2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kling-v2-5-turbo-i2v",
        creditCostPerSecond: 10.92, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 5,
        maxDurationSeconds: 8,
        supportedDurations: ["5", "10"],
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
        supportedAspectRatios: ["16:9", "9:16", "1:1"], // updated: 2026-07-10 from modelslab.com
        minDurationSeconds: 5, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 10, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["5", "10"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.KLING_V2_5_TURBO_T2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kling-v2-5-turbo-t2v",
        creditCostPerSecond: 10.92, // updated: 2026-07-10 from unbottled.ai
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
        creditCostPerSecond: 43.68, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 5,
        maxDurationSeconds: 10,
        supportedDurations: ["5", "10"],
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
    inputs: ["text"], // updated: 2026-07-10 from video-gen-deterministic
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
        creditCostPerSecond: 43.68, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 5,
        maxDurationSeconds: 10,
        supportedDurations: ["5", "10"],
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "kwaivgi/kling-v3.0-pro",
        creditCostPerSecond: 11.2, // updated: 2026-07-10 from openrouter.ai
        allowedPassthroughParameters: ["negative_prompt", "cfg_scale"], // updated: 2026-07-10 from openrouter.ai
        supportedSizes: ["1280x720", "720x1280", "720x720"], // updated: 2026-07-10 from openrouter.ai
        generateAudio: true, // updated: 2026-07-10 from openrouter.ai
        supportedFrameImages: ["first_frame", "last_frame"], // updated: 2026-07-10 from openrouter.ai
        maxDurationSeconds: 15, // updated: 2026-07-10 from openrouter.ai
        minDurationSeconds: 3, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: [
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ], // updated: 2026-07-10 from openrouter.ai
        supportedResolutions: ["720p"], // updated: 2026-07-10 from openrouter.ai
        supportedAspectRatios: ["16:9", "9:16", "1:1"], // updated: 2026-07-10 from openrouter.ai
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.KLING_3_0_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "kling-v3-t2v",
        creditCostPerSecond: 10, // updated: 2026-03-31 from modelslab.com
        supportedAspectRatios: ["16:9", "9:16", "1:1"], // updated: 2026-04-04 from modelslab.com
        minDurationSeconds: 3, // updated: 2026-07-02 from modelslab.com
        maxDurationSeconds: 15, // updated: 2026-07-02 from modelslab.com
        supportedDurations: ["3", "5", "10", "15"], // updated: 2026-07-02 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.KLING_3_0_T2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kling-3-0-t2v",
        creditCostPerSecond: 14.56, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 3,
        maxDurationSeconds: 15,
        supportedDurations: [
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ],
        supportedResolutions: ["720p"],
        supportedAspectRatios: ["16:9", "9:16", "1:1"],
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
        supportedResolutions: ["2K", "4K"], // updated: 2026-07-10 from modelslab.com
        minDurationSeconds: 3, // updated: 2026-07-10 from openrouter.ai
        maxDurationSeconds: 15, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: ["6", "8", "10"], // updated: 2026-07-10 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.LTX_2_PRO_T2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "ltx-2-pro-t2v",
        creditCostPerSecond: 1.82, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 3,
        maxDurationSeconds: 15,
        supportedDurations: ["6", "8", "10"],
        supportedResolutions: ["2K", "4K"],
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
    inputs: ["text"], // updated: 2026-07-10 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.LTX_2_3_PRO_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "ltx-2-3-pro-i2v",
        creditCostPerSecond: 1.92, // updated: 2026-07-02 from modelslab.com
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
        creditCostPerSecond: 2.496, // updated: 2026-07-10 from unbottled.ai
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
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "minimax/hailuo-2.3",
        creditCostPerSecond: 8.17, // updated: 2026-07-10 from openrouter.ai
        allowedPassthroughParameters: ["prompt_optimizer", "fast_pretreatment"], // updated: 2026-07-10 from openrouter.ai
        supportedSizes: ["1920x1080"], // updated: 2026-07-10 from openrouter.ai
        generateAudio: false, // updated: 2026-07-10 from openrouter.ai
        supportedFrameImages: ["first_frame"], // updated: 2026-07-10 from openrouter.ai
        maxDurationSeconds: 10, // updated: 2026-07-10 from openrouter.ai
        minDurationSeconds: 6, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: ["6", "10"], // updated: 2026-07-10 from openrouter.ai
        supportedResolutions: ["1080p"], // updated: 2026-07-10 from openrouter.ai
        supportedAspectRatios: ["16:9"], // updated: 2026-07-10 from openrouter.ai
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.HAILUO_2_3_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "Hailuo-2.3-t2v",
        creditCostPerSecond: 6.7, // updated: 2026-07-02 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.HAILUO_2_3_T2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "hailuo-2-3-t2v",
        creditCostPerSecond: 10.621, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 6,
        maxDurationSeconds: 10,
        supportedDurations: ["6", "10"],
        supportedResolutions: ["1080p"],
        supportedAspectRatios: ["16:9"],
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
    inputs: ["text"], // updated: 2026-07-10 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.HAILUO_2_3_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "Hailuo-2.3-i2v",
        creditCostPerSecond: 6.7, // updated: 2026-07-02 from modelslab.com
        minDurationSeconds: 6, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 10, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["6", "10"], // updated: 2026-07-10 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.HAILUO_2_3_I2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "hailuo-2-3-i2v",
        creditCostPerSecond: 8.71, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 6,
        maxDurationSeconds: 10,
        supportedDurations: ["6", "10"],
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
    inputs: ["text"], // updated: 2026-07-10 from video-gen-deterministic
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
        creditCostPerSecond: 4.94, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 6,
        maxDurationSeconds: 10,
        supportedDurations: ["6", "10"],
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
        supportedAspectRatios: ["16:9"], // updated: 2026-07-10 from openrouter.ai
        minDurationSeconds: 4, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 12, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["2", "4", "8", "12"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.SORA_2,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "sora-2",
        creditCostPerSecond: 16.25, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 4,
        maxDurationSeconds: 12,
        supportedDurations: ["2", "4", "8", "12"],
        supportedAspectRatios: ["16:9"],
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "openai/sora-2-pro",
        creditCostPerSecond: 30, // updated: 2026-07-10 from openrouter.ai
        allowedPassthroughParameters: ["quality", "style"], // updated: 2026-07-10 from openrouter.ai
        supportedSizes: ["1280x720", "1080x1920", "1920x1080", "720x1280"], // updated: 2026-07-10 from openrouter.ai
        generateAudio: true, // updated: 2026-07-10 from openrouter.ai
        maxDurationSeconds: 20, // updated: 2026-07-10 from openrouter.ai
        minDurationSeconds: 4, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: ["4", "8", "12", "16", "20"], // updated: 2026-07-10 from openrouter.ai
        supportedResolutions: ["720p", "1080p"], // updated: 2026-07-10 from openrouter.ai
        supportedAspectRatios: ["16:9", "9:16"], // updated: 2026-07-10 from openrouter.ai
        pricingByResolution: { "720p": 30, "1024p": 50, "1080p": 50 }, // updated: 2026-07-10 from openrouter.ai
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.SORA_2_PRO,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "sora-2-pro-t2v",
        creditCostPerSecond: 36, // updated: 2026-03-31 from modelslab.com
        supportedAspectRatios: ["16:9"], // updated: 2026-07-02 from modelslab.com
        minDurationSeconds: 4, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 12, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["2", "4", "8", "12"], // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.SORA_2_PRO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "sora-2-pro",
        creditCostPerSecond: 39, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 4,
        maxDurationSeconds: 20,
        supportedDurations: ["4", "8", "12", "16", "20"],
        supportedResolutions: ["720p", "1080p"],
        supportedAspectRatios: ["16:9", "9:16"],
        pricingByResolution: { "720p": 39, "1024p": 65, "1080p": 65 }, // updated: 2026-07-10 from unbottled.ai
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
        ], // updated: 2026-07-10 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.GEN4_ALEPH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gen4-aleph",
        creditCostPerSecond: 23.4, // updated: 2026-07-10 from unbottled.ai
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
        creditCostPerSecond: 9.1, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "x-ai/grok-imagine-video",
        creditCostPerSecond: 7, // updated: 2026-07-10 from openrouter.ai
        supportedSizes: [
          "854x480",
          "1280x720",
          "480x854",
          "720x1280",
          "480x480",
          "720x720",
          "640x480",
          "960x720",
          "480x640",
          "720x960",
          "720x480",
          "1080x720",
          "480x720",
          "720x1080",
        ], // updated: 2026-07-10 from openrouter.ai
        supportedFrameImages: ["first_frame"], // updated: 2026-07-10 from openrouter.ai
        maxDurationSeconds: 15, // updated: 2026-07-10 from openrouter.ai
        minDurationSeconds: 1, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ], // updated: 2026-07-10 from openrouter.ai
        supportedResolutions: ["480p", "720p"], // updated: 2026-07-10 from openrouter.ai
        supportedAspectRatios: [
          "16:9",
          "9:16",
          "1:1",
          "4:3",
          "3:4",
          "3:2",
          "2:3",
        ], // updated: 2026-07-10 from openrouter.ai
        pricingByResolution: { "480p": 5, "720p": 7 }, // updated: 2026-07-10 from openrouter.ai
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.GROK_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "grok-t2v",
        creditCostPerSecond: 6, // updated: 2026-03-31 from modelslab.com
        supportedResolutions: ["720p"], // updated: 2026-07-10 from modelslab.com
        minDurationSeconds: 1, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 15, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["1", "15"], // updated: 2026-07-10 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.GROK_T2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "grok-t2v",
        creditCostPerSecond: 9.1, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 1,
        maxDurationSeconds: 15,
        supportedDurations: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ],
        supportedResolutions: ["480p", "720p"],
        supportedAspectRatios: [
          "16:9",
          "9:16",
          "1:1",
          "4:3",
          "3:4",
          "3:2",
          "2:3",
        ],
        pricingByResolution: { "480p": 6.5, "720p": 9.1 }, // updated: 2026-07-10 from unbottled.ai
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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
    inputs: ["text"], // updated: 2026-07-10 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-04-03 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.GROK_I2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "grok-i2v",
        creditCostPerSecond: 6, // updated: 2026-03-31 from modelslab.com
        minDurationSeconds: 1, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 15, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["1", "15"], // updated: 2026-07-10 from modelslab.com
        supportedResolutions: ["HD"], // updated: 2026-07-10 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.GROK_I2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "grok-i2v",
        creditCostPerSecond: 7.8, // updated: 2026-07-10 from unbottled.ai
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
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  // ── OpenRouter-only models ─────────────────────────────────────────────────

  [VideoGenModelId.KLING_V3_STD_T2V]: {
    name: "Kling 3.0 Std",
    by: "klingai",
    description: "chat.models.descriptions.klingV30Std",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-07-10 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-07-10 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.KLING_V3_STD_T2V,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "kwaivgi/kling-v3.0-std",
        creditCostPerSecond: 8.4, // updated: 2026-07-10 from openrouter.ai
        allowedPassthroughParameters: ["negative_prompt", "cfg_scale"], // updated: 2026-07-10 from openrouter.ai
        supportedSizes: ["1280x720", "720x1280", "720x720"], // updated: 2026-07-10 from openrouter.ai
        generateAudio: true, // updated: 2026-07-10 from openrouter.ai
        supportedFrameImages: ["first_frame", "last_frame"], // updated: 2026-07-10 from openrouter.ai
        maxDurationSeconds: 15, // updated: 2026-07-10 from openrouter.ai
        minDurationSeconds: 3, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: [
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ], // updated: 2026-07-10 from openrouter.ai
        supportedResolutions: ["720p"], // updated: 2026-07-10 from openrouter.ai
        supportedAspectRatios: ["16:9", "9:16", "1:1"], // updated: 2026-07-10 from openrouter.ai
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.KLING_V3_STD_T2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kling-v3-std-t2v",
        creditCostPerSecond: 10.92, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 3,
        maxDurationSeconds: 15,
        supportedDurations: [
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ],
        supportedResolutions: ["720p"],
        supportedAspectRatios: ["16:9", "9:16", "1:1"],
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, streaming: false },
  },

  [VideoGenModelId.KLING_VIDEO_O1]: {
    name: "Kling Video O1",
    by: "klingai",
    description: "chat.models.descriptions.klingVideoO1",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-07-10 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-07-10 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.KLING_VIDEO_O1,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "kwaivgi/kling-video-o1",
        creditCostPerSecond: 11.2, // updated: 2026-07-10 from openrouter.ai
        allowedPassthroughParameters: ["negative_prompt"], // updated: 2026-07-10 from openrouter.ai
        supportedSizes: ["1280x720", "720x1280", "720x720"], // updated: 2026-07-10 from openrouter.ai
        generateAudio: true, // updated: 2026-07-10 from openrouter.ai
        supportedFrameImages: ["first_frame", "last_frame"], // updated: 2026-07-10 from openrouter.ai
        maxDurationSeconds: 10, // updated: 2026-07-10 from openrouter.ai
        minDurationSeconds: 5, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: ["5", "10"], // updated: 2026-07-10 from openrouter.ai
        supportedResolutions: ["720p"], // updated: 2026-07-10 from openrouter.ai
        supportedAspectRatios: ["16:9", "9:16", "1:1"], // updated: 2026-07-10 from openrouter.ai
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.KLING_VIDEO_O1,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kling-video-o1",
        creditCostPerSecond: 14.56, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 5,
        maxDurationSeconds: 10,
        supportedDurations: ["5", "10"],
        supportedResolutions: ["720p"],
        supportedAspectRatios: ["16:9", "9:16", "1:1"],
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, streaming: false },
  },

  [VideoGenModelId.VEO_3_1_LITE]: {
    name: "Veo 3.1 Lite",
    by: "google",
    description: "chat.models.descriptions.veo31Lite",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-07-10 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-07-10 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.VEO_3_1_LITE,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/veo-3.1-lite",
        creditCostPerSecond: 8, // updated: 2026-07-10 from openrouter.ai
        allowedPassthroughParameters: [
          "personGeneration",
          "aspectRatio",
          "negativePrompt",
          "conditioningScale",
          "enhancePrompt",
        ], // updated: 2026-07-10 from openrouter.ai
        supportedSizes: ["1280x720", "720x1280", "1920x1080", "1080x1920"], // updated: 2026-07-10 from openrouter.ai
        generateAudio: true, // updated: 2026-07-10 from openrouter.ai
        supportedFrameImages: ["first_frame", "last_frame"], // updated: 2026-07-10 from openrouter.ai
        maxDurationSeconds: 8, // updated: 2026-07-10 from openrouter.ai
        minDurationSeconds: 4, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: ["4", "6", "8"], // updated: 2026-07-10 from openrouter.ai
        supportedResolutions: ["720p", "1080p"], // updated: 2026-07-10 from openrouter.ai
        supportedAspectRatios: ["16:9", "9:16"], // updated: 2026-07-10 from openrouter.ai
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.VEO_3_1_LITE,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "veo-3-1-lite",
        creditCostPerSecond: 10.4, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 4,
        maxDurationSeconds: 8,
        supportedDurations: ["4", "6", "8"],
        supportedResolutions: ["720p", "1080p"],
        supportedAspectRatios: ["16:9", "9:16"],
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, streaming: false },
  },

  [VideoGenModelId.SEEDANCE_2]: {
    enabled: false, // auto-disabled: price not verified
    name: "Seedance 2.0",
    by: "byteDanceSeed",
    description: "chat.models.descriptions.seedance2",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-07-10 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-07-10 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.SEEDANCE_2,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "bytedance/seedance-2.0",
        creditCostPerSecond: 0, // updated: 2026-07-10 from openrouter-api
        allowedPassthroughParameters: ["watermark", "req_key"], // updated: 2026-07-10 from openrouter.ai
        supportedSizes: [
          "480x480",
          "480x640",
          "480x854",
          "640x480",
          "854x480",
          "1120x480",
          "720x720",
          "720x960",
          "720x1280",
          "720x1680",
          "960x720",
          "1280x720",
          "1680x720",
          "1080x1080",
          "1080x1440",
          "1080x1920",
          "1440x1080",
          "1920x1080",
          "2520x1080",
          "3840x2160",
          "2160x3840",
          "2160x2160",
          "2880x2160",
          "2160x2880",
          "5040x2160",
        ], // updated: 2026-07-10 from openrouter.ai
        generateAudio: true, // updated: 2026-07-10 from openrouter.ai
        supportedFrameImages: ["first_frame", "last_frame"], // updated: 2026-07-10 from openrouter.ai
        maxDurationSeconds: 15, // updated: 2026-07-10 from openrouter.ai
        minDurationSeconds: 4, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: [
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ], // updated: 2026-07-10 from openrouter.ai
        supportedResolutions: ["480p", "720p", "1080p", "4K"], // updated: 2026-07-10 from openrouter.ai
        supportedAspectRatios: [
          "1:1",
          "3:4",
          "9:16",
          "4:3",
          "16:9",
          "21:9",
          "9:21",
        ], // updated: 2026-07-10 from openrouter.ai
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.SEEDANCE_2,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "seedance-2",
        creditCostPerSecond: 0, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 4,
        maxDurationSeconds: 15,
        supportedDurations: [
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ],
        supportedResolutions: ["480p", "720p", "1080p", "4K"],
        supportedAspectRatios: [
          "1:1",
          "3:4",
          "9:16",
          "4:3",
          "16:9",
          "21:9",
          "9:21",
        ],
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, streaming: false },
  },

  [VideoGenModelId.SEEDANCE_2_FAST]: {
    enabled: false, // auto-disabled: price not verified
    name: "Seedance 2.0 Fast",
    by: "byteDanceSeed",
    description: "chat.models.descriptions.seedance2Fast",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-07-10 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-07-10 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.SEEDANCE_2_FAST,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "bytedance/seedance-2.0-fast",
        creditCostPerSecond: 0, // updated: 2026-07-10 from openrouter-api
        allowedPassthroughParameters: ["watermark", "req_key"], // updated: 2026-07-10 from openrouter.ai
        supportedSizes: [
          "480x480",
          "480x640",
          "480x854",
          "640x480",
          "854x480",
          "1120x480",
          "720x720",
          "720x960",
          "720x1280",
          "720x1680",
          "960x720",
          "1280x720",
          "1680x720",
        ], // updated: 2026-07-10 from openrouter.ai
        generateAudio: true, // updated: 2026-07-10 from openrouter.ai
        supportedFrameImages: ["first_frame", "last_frame"], // updated: 2026-07-10 from openrouter.ai
        maxDurationSeconds: 15, // updated: 2026-07-10 from openrouter.ai
        minDurationSeconds: 4, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: [
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ], // updated: 2026-07-10 from openrouter.ai
        supportedResolutions: ["480p", "720p"], // updated: 2026-07-10 from openrouter.ai
        supportedAspectRatios: [
          "1:1",
          "3:4",
          "9:16",
          "4:3",
          "16:9",
          "21:9",
          "9:21",
        ], // updated: 2026-07-10 from openrouter.ai
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.SEEDANCE_2_FAST,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "seedance-2-fast",
        creditCostPerSecond: 0, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 4,
        maxDurationSeconds: 15,
        supportedDurations: [
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ],
        supportedResolutions: ["480p", "720p"],
        supportedAspectRatios: [
          "1:1",
          "3:4",
          "9:16",
          "4:3",
          "16:9",
          "21:9",
          "9:21",
        ],
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, streaming: false },
  },

  [VideoGenModelId.HAPPYHORSE_1_1]: {
    name: "HappyHorse 1.1",
    by: "alibaba",
    description: "chat.models.descriptions.happyhorse11",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-07-10 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-07-10 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.HAPPYHORSE_1_1,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "alibaba/happyhorse-1.1",
        creditCostPerSecond: 9.88, // updated: 2026-07-10 from openrouter.ai
        supportedSizes: [
          "1280x720",
          "720x1280",
          "720x720",
          "960x720",
          "720x960",
          "1680x720",
          "720x1680",
          "1920x1080",
          "1080x1920",
          "1080x1080",
          "1440x1080",
          "1080x1440",
          "2520x1080",
          "1080x2520",
        ], // updated: 2026-07-10 from openrouter.ai
        supportedFrameImages: ["first_frame"], // updated: 2026-07-10 from openrouter.ai
        maxDurationSeconds: 15, // updated: 2026-07-10 from openrouter.ai
        minDurationSeconds: 3, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: [
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ], // updated: 2026-07-10 from openrouter.ai
        supportedResolutions: ["720p", "1080p"], // updated: 2026-07-10 from openrouter.ai
        supportedAspectRatios: [
          "16:9",
          "9:16",
          "1:1",
          "4:3",
          "3:4",
          "21:9",
          "9:21",
        ], // updated: 2026-07-10 from openrouter.ai
        pricingByResolution: { "720p": 9.88, "1080p": 12.78 }, // updated: 2026-07-10 from openrouter.ai
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.HAPPYHORSE_1_1,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "happyhorse-1-1",
        creditCostPerSecond: 12.844, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 3,
        maxDurationSeconds: 15,
        supportedDurations: [
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ],
        supportedResolutions: ["720p", "1080p"],
        supportedAspectRatios: [
          "16:9",
          "9:16",
          "1:1",
          "4:3",
          "3:4",
          "21:9",
          "9:21",
        ],
        pricingByResolution: { "720p": 12.844, "1080p": 16.614 }, // updated: 2026-07-10 from unbottled.ai
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, streaming: false },
  },

  [VideoGenModelId.HAPPYHORSE_1_0]: {
    name: "HappyHorse 1.0",
    by: "alibaba",
    description: "chat.models.descriptions.happyhorse10",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "video",
    inputs: ["text"], // updated: 2026-07-10 from video-gen-deterministic
    outputs: ["video"], // updated: 2026-07-10 from video-gen-deterministic
    providers: [
      {
        id: VideoGenModelId.HAPPYHORSE_1_0,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "alibaba/happyhorse-1.0",
        creditCostPerSecond: 9.88, // updated: 2026-07-10 from openrouter.ai
        supportedSizes: [
          "1280x720",
          "720x1280",
          "720x720",
          "960x720",
          "720x960",
          "1680x720",
          "720x1680",
          "1920x1080",
          "1080x1920",
          "1080x1080",
          "1440x1080",
          "1080x1440",
          "2520x1080",
          "1080x2520",
        ], // updated: 2026-07-10 from openrouter.ai
        supportedFrameImages: ["first_frame"], // updated: 2026-07-10 from openrouter.ai
        maxDurationSeconds: 15, // updated: 2026-07-10 from openrouter.ai
        minDurationSeconds: 3, // updated: 2026-07-10 from openrouter.ai
        supportedDurations: [
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ], // updated: 2026-07-10 from openrouter.ai
        supportedResolutions: ["720p", "1080p"], // updated: 2026-07-10 from openrouter.ai
        supportedAspectRatios: [
          "16:9",
          "9:16",
          "1:1",
          "4:3",
          "3:4",
          "21:9",
          "9:21",
        ], // updated: 2026-07-10 from openrouter.ai
        pricingByResolution: { "720p": 9.88, "1080p": 16.94 }, // updated: 2026-07-10 from openrouter.ai
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.HAPPYHORSE_1_0,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "happyhorse-1-0",
        creditCostPerSecond: 12.844, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 3,
        maxDurationSeconds: 15,
        supportedDurations: [
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ],
        supportedResolutions: ["720p", "1080p"],
        supportedAspectRatios: [
          "16:9",
          "9:16",
          "1:1",
          "4:3",
          "3:4",
          "21:9",
          "9:21",
        ],
        pricingByResolution: { "720p": 12.844, "1080p": 22.022 }, // updated: 2026-07-10 from unbottled.ai
      },
    ],
    utilities: [ModelUtility.VIDEO_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.OPEN,
    features: { ...defaultFeatures, streaming: false },
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
    supportedFrameImages: p.supportedFrameImages,
    generateAudio: p.generateAudio,
  };
}

// ============================================================
// VIDEO GEN MODEL RESOLUTION
// ============================================================

/**
 * All (model, provider) combinations sorted cheapest-first.
 * Used by filterVideoGenModels for env-aware provider selection.
 */
function buildVideoGenModelOptionsPool(): VideoGenModelOption[] {
  const pool: VideoGenModelOption[] = [];
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
        pool.push(
          buildVideoGenOption(
            modelId,
            def,
            provider satisfies ModelProviderConfigVideoBased,
          ),
        );
      }
    }
  }
  return pool;
}

const videoGenModelOptionsPool: VideoGenModelOption[] =
  buildVideoGenModelOptionsPool();

const videoGenModelOptionsIndex: Partial<
  Record<VideoGenModelId, VideoGenModelOption>
> = buildModelOptionsIndex(videoGenModelOptionsPool) as Partial<
  Record<VideoGenModelId, VideoGenModelOption>
>;

export const videoGenModelOptions: VideoGenModelOption[] = Object.values(
  videoGenModelOptionsIndex,
).filter((m): m is VideoGenModelOption => m !== undefined);

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
 * Picks the cheapest provider variant for `modelId` that matches `provider` from the pool.
 * Falls back to the default (cheapest overall) if no matching provider exists.
 */
export function getVideoGenModelForProvider(
  modelId: VideoGenModelId,
  provider: ApiProvider,
): VideoGenModelOption | undefined {
  return getModelForProvider(
    modelId,
    provider,
    videoGenModelOptionsPool,
    getVideoGenModelById(modelId),
  );
}

// ============================================================
// VIDEO GEN MODEL SELECTION SCHEMA
// ============================================================

const videoGenManualModelSelectionSchema = z
  .object({
    selectionType: z.literal(ModelSelectionType.MANUAL),
    manualModelId: z.enum(VideoGenModelId),
  })
  .merge(sharedFilterPropsSchema);
export type VideoGenManualModelSelection = z.infer<
  typeof videoGenManualModelSelectionSchema
>;

/**
 * Video-gen selection — explicit union + `z.ZodType<...>` annotation pins
 * `z.output` to the named type so consumers resolve it shallowly instead of
 * re-deriving the discriminated union (exceeds TS's instantiation-depth limit).
 */
export type VideoGenModelSelection =
  | VideoGenManualModelSelection
  | FiltersModelSelection;

export const videoGenModelSelectionSchema: z.ZodType<VideoGenModelSelection> =
  z.discriminatedUnion("selectionType", [
    videoGenManualModelSelectionSchema,
    filtersSelectionSchema,
  ]);

export function filterVideoGenModels(
  selection: VideoGenModelSelection | null | undefined,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): VideoGenModelOption[] {
  const pool = availability.unbottledForce
    ? videoGenModelOptionsPool.filter(
        (m) => m.apiProvider === ApiProvider.UNBOTTLED,
      )
    : videoGenModelOptionsPool;
  return filterRoleModels(pool, selection, user, availability);
}

export function getBestVideoGenModel(
  selection: VideoGenModelSelection,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): VideoGenModelOption | null {
  return filterVideoGenModels(selection, user, availability)[0] ?? null;
}

/**
 * Returns all video gen model options that accept the given input modality.
 * E.g. getVideoGenModelsByInputModality("image") → all I2V models.
 */
export function getVideoGenModelsByInputModality(
  modality: Modality,
): VideoGenModelOption[] {
  return videoGenModelOptions.filter((m) => m.inputs.includes(modality));
}
