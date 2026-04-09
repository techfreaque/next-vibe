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
  type ModelOptionAudioBased,
  type ModelProviderConfigAudioBased,
  type ModelProviderEnvAvailability,
} from "../models/models";
import { MusicDuration } from "./enum";

const ALL_DURATIONS = [
  MusicDuration.SHORT,
  MusicDuration.MEDIUM,
  MusicDuration.LONG,
] as const;

export enum MusicGenModelId {
  MUSICGEN_STEREO = "musicgen-stereo",
  MUSIC_GEN = "music-gen",
  ELEVENLABS_MUSIC = "elevenlabs-music",
  SONAUTO_SONG = "sonauto-song",
  LYRIA_3 = "lyria-3",
  // BEGIN:llm-generated - do not edit manually, updated by price updater
  // END:llm-generated
}

export const musicGenModelDefinitions: Record<
  MusicGenModelId,
  ModelDefinition
> = {
  [MusicGenModelId.MUSICGEN_STEREO]: {
    name: "MusicGen Stereo",
    by: "meta",
    description: "chat.models.descriptions.musicgenStereo",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "music",
    inputs: ["text"], // updated: 2026-04-03 from music-gen-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from music-gen-deterministic
    providers: [
      {
        id: MusicGenModelId.MUSICGEN_STEREO,
        apiProvider: ApiProvider.REPLICATE,
        providerModel: "meta/musicgen",
        creditCostPerClip: 4.4, // updated: 2026-04-07 from replicate-html-p50
        defaultDurationSeconds: 8,
        supportedDurations: ALL_DURATIONS,
      },
      {
        id: MusicGenModelId.MUSICGEN_STEREO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "musicgen-stereo",
        creditCostPerClip: 5.72, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 8,
        supportedDurations: [
          "post.duration.short",
          "post.duration.medium",
          "post.duration.long",
        ],
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
    },
  },

  [MusicGenModelId.MUSIC_GEN]: {
    name: "ModelsLab Music Gen",
    by: "modelsLab",
    description: "chat.models.descriptions.modelsLabMusicGen",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "music",
    inputs: ["text"], // updated: 2026-04-03 from music-gen-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from music-gen-deterministic
    providers: [
      {
        id: MusicGenModelId.MUSIC_GEN,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "music_gen",
        creditCostPerClip: 21, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 30,
        supportedDurations: [MusicDuration.LONG],
        minDurationSeconds: 30,
      },
      {
        id: MusicGenModelId.MUSIC_GEN,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "music-gen",
        creditCostPerClip: 27.3, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 30,
        minDurationSeconds: 30,
        supportedDurations: ["post.duration.long"],
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
    },
  },

  [MusicGenModelId.ELEVENLABS_MUSIC]: {
    name: "ElevenLabs Music",
    by: "elevenLabs",
    description: "chat.models.descriptions.modelsLabElevenlabsMusic",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "music",
    inputs: ["text"], // updated: 2026-04-04 from music-gen-deterministic
    outputs: ["audio"], // updated: 2026-04-04 from music-gen-deterministic
    providers: [
      {
        id: MusicGenModelId.ELEVENLABS_MUSIC,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "music_v1",
        creditCostPerClip: 21, // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 30,
        supportedDurations: ALL_DURATIONS,
      },
      {
        id: MusicGenModelId.ELEVENLABS_MUSIC,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "elevenlabs-music",
        creditCostPerClip: 27.3, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 30,
        supportedDurations: [
          "post.duration.short",
          "post.duration.medium",
          "post.duration.long",
        ],
      },
    ],
    utilities: [ModelUtility.MUSIC_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [MusicGenModelId.SONAUTO_SONG]: {
    name: "Sonauto Song",
    by: "sonauto",
    description: "chat.models.descriptions.modelsLabSonautoSong",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "music",
    inputs: ["text"], // updated: 2026-04-04 from music-gen-deterministic
    outputs: ["audio"], // updated: 2026-04-04 from music-gen-deterministic
    providers: [
      {
        id: MusicGenModelId.SONAUTO_SONG,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "sonauto_song",
        creditCostPerClip: 8, // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 30,
        supportedDurations: ALL_DURATIONS,
      },
      {
        id: MusicGenModelId.SONAUTO_SONG,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "sonauto-song",
        creditCostPerClip: 10.4, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 30,
        supportedDurations: [
          "post.duration.short",
          "post.duration.medium",
          "post.duration.long",
        ],
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
    },
  },

  [MusicGenModelId.LYRIA_3]: {
    name: "Lyria 3",
    by: "google",
    description: "chat.models.descriptions.modelsLabLyria3",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "music",
    inputs: ["text"], // updated: 2026-04-04 from music-gen-deterministic
    outputs: ["audio"], // updated: 2026-04-04 from music-gen-deterministic
    providers: [
      {
        id: MusicGenModelId.LYRIA_3,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "lyria-3",
        creditCostPerClip: 5, // updated: 2026-04-04 from modelslab.com
        defaultDurationSeconds: 30,
        supportedDurations: [MusicDuration.LONG],
      },
      {
        id: MusicGenModelId.LYRIA_3,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "lyria-3",
        creditCostPerClip: 6.5, // updated: 2026-04-07 from unbottled.ai
        defaultDurationSeconds: 30,
        supportedDurations: ["post.duration.long"],
      },
    ],
    utilities: [ModelUtility.MUSIC_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.BRILLIANT,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },
};

export type MusicGenModelOption = ModelOptionAudioBased & {
  id: MusicGenModelId;
};

function buildMusicGenOption(
  modelId: MusicGenModelId,
  def: ModelDefinition,
  provider: ModelProviderConfigAudioBased,
): MusicGenModelOption {
  const p = provider satisfies ModelProviderConfigAudioBased;
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
    creditCostPerClip: p.creditCostPerClip,
    defaultDurationSeconds: p.defaultDurationSeconds,
    supportedDurations: p.supportedDurations,
    minDurationSeconds: p.minDurationSeconds,
  };
}

function buildMusicGenModelOptions(): Record<
  MusicGenModelId,
  MusicGenModelOption
> {
  const result = {} as Record<MusicGenModelId, MusicGenModelOption>;

  for (const modelId of Object.values(MusicGenModelId)) {
    const def = musicGenModelDefinitions[modelId];
    const sortedProviders = [...def.providers].toSorted(
      (a, b) => getProviderPrice(a) - getProviderPrice(b),
    );
    for (const provider of sortedProviders) {
      if (provider.creditCostPerClip !== undefined) {
        result[modelId] = buildMusicGenOption(
          modelId,
          def,
          provider satisfies ModelProviderConfigAudioBased,
        );
        break; // use cheapest provider only
      }
    }
  }

  return result;
}

const musicGenModelOptionsIndex: Record<MusicGenModelId, MusicGenModelOption> =
  buildMusicGenModelOptions();

export const musicGenModelOptions: MusicGenModelOption[] = Object.values(
  musicGenModelOptionsIndex,
);

export const MusicGenModelIdOptions = musicGenModelOptions.map((m) => ({
  value: m.id,
  label: m.name,
}));

export function getMusicGenModelById(
  modelId: MusicGenModelId,
): MusicGenModelOption | undefined {
  return musicGenModelOptionsIndex[modelId];
}

/**
 * Resolve a music gen model option using a specific API provider.
 * Picks the cheapest provider variant for `modelId` that matches `provider`.
 * Falls back to the default (cheapest overall) if no matching provider exists.
 */
export function getMusicGenModelForProvider(
  modelId: MusicGenModelId,
  provider: ApiProvider,
): MusicGenModelOption | undefined {
  const def = musicGenModelDefinitions[modelId];
  if (!def) {
    return undefined;
  }
  const matching = [...def.providers]
    .filter((p) => p.apiProvider === provider)
    .toSorted((a, b) => getProviderPrice(a) - getProviderPrice(b));

  for (const p of matching) {
    if (p.creditCostPerClip !== undefined) {
      const typed = p satisfies ModelProviderConfigAudioBased;
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
        creditCostPerClip: typed.creditCostPerClip,
        defaultDurationSeconds: typed.defaultDurationSeconds,
        supportedDurations: typed.supportedDurations,
        minDurationSeconds: typed.minDurationSeconds,
      };
    }
  }

  // No matching provider - fall back to default
  return getMusicGenModelById(modelId);
}

// ============================================================
// MUSIC GEN MODEL SELECTION SCHEMA
// ============================================================

export const musicGenModelSelectionSchema = z.discriminatedUnion(
  "selectionType",
  [
    z
      .object({
        selectionType: z.literal(ModelSelectionType.MANUAL),
        manualModelId: z.enum(MusicGenModelId),
      })
      .merge(sharedFilterPropsSchema),
    filtersSelectionSchema,
  ],
);
export type MusicGenModelSelection = z.infer<
  typeof musicGenModelSelectionSchema
>;

// ============================================================
// MUSIC GEN MODEL RESOLUTION
// ============================================================

export function filterMusicGenModels(
  selection: MusicGenModelSelection | null | undefined,
  user: JwtPayloadType,
  env: ModelProviderEnvAvailability,
): MusicGenModelOption[] {
  return filterRoleModels(musicGenModelOptions, selection, user, env);
}

export function getBestMusicGenModel(
  selection: MusicGenModelSelection,
  user: JwtPayloadType,
  env: ModelProviderEnvAvailability,
): MusicGenModelOption | null {
  return filterMusicGenModels(selection, user, env)[0] ?? null;
}
