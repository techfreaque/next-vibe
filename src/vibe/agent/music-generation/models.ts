import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { z } from "zod";

import type { AgentEnvAvailability } from "../env-availability";
import { ModelUtility } from "../models/enum";
import {
  ApiProvider,
  buildModelOptionsIndex,
  defaultFeatures,
  filterRoleModels,
  getProviderPrice,
  type ModelDefinition,
  type ModelOptionAudioBased,
  type ModelProviderConfigAudioBased,
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
  CASSETTE_MUSIC = "cassette-music",
  SONAUTO_SONG = "sonauto-song",
  LYRIA_3 = "lyria-3",
  LYRIA_3_PRO_PREVIEW = "lyria-3-pro-preview",
  LYRIA_3_CLIP_PREVIEW = "lyria-3-clip-preview",
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
        creditCostPerClip: 7.1, // updated: 2026-07-10 from replicate-html-p50
        defaultDurationSeconds: 8,
        supportedDurations: ALL_DURATIONS,
      },
      {
        id: MusicGenModelId.MUSICGEN_STEREO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "musicgen-stereo",
        creditCostPerClip: 9.23, // updated: 2026-07-10 from unbottled.ai
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
        creditCostPerClip: 27.3, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 30,
        minDurationSeconds: 30,
        supportedDurations: ["post.duration.long"],
      },
    ],
    utilities: [ModelUtility.MUSIC_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.OPEN,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [MusicGenModelId.CASSETTE_MUSIC]: {
    enabled: false, // auto-disabled: price not verified
    name: "CassetteAI Music",
    by: "cassetteAi",
    description: "chat.models.descriptions.cassetteMusic",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "music",
    inputs: ["text"], // updated: 2026-07-10 from music-gen-deterministic
    outputs: ["audio"], // updated: 2026-07-10 from music-gen-deterministic
    providers: [
      {
        id: MusicGenModelId.CASSETTE_MUSIC,
        apiProvider: ApiProvider.FAL_AI,
        providerModel: "cassetteai/music-generator",
        creditCostPerClip: 12, // estimate — verify via model-prices sync
        defaultDurationSeconds: 30,
        supportedDurations: ALL_DURATIONS,
      },
      {
        id: MusicGenModelId.CASSETTE_MUSIC,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "cassette-music",
        creditCostPerClip: 15.6, // updated: 2026-07-10 from unbottled.ai
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
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.MAINSTREAM,
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
        creditCostPerClip: 27.3, // updated: 2026-07-10 from unbottled.ai
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
        creditCostPerClip: 10.4, // updated: 2026-07-10 from unbottled.ai
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
        creditCostPerClip: 6.5, // updated: 2026-07-10 from unbottled.ai
        defaultDurationSeconds: 30,
        supportedDurations: ["post.duration.long"],
      },
    ],
    utilities: [ModelUtility.MUSIC_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [MusicGenModelId.LYRIA_3_PRO_PREVIEW]: {
    name: "Lyria 3 Pro Preview",
    by: "google",
    description: "chat.models.descriptions.lyria3ProPreview",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "music",
    inputs: ["text"],
    outputs: ["audio"],
    providers: [
      {
        id: MusicGenModelId.LYRIA_3_PRO_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/lyria-3-pro-preview",
        creditCostPerClip: 8, // updated: 2026-08-16 from openrouter-api ($0.08/song → 8 credits)
        defaultDurationSeconds: 30,
        supportedDurations: [MusicDuration.LONG],
      },
      {
        id: MusicGenModelId.LYRIA_3_PRO_PREVIEW,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "lyria-3-pro-preview",
        creditCostPerClip: 10.4,
        defaultDurationSeconds: 30,
        supportedDurations: ["post.duration.long"],
      },
    ],
    utilities: [ModelUtility.MUSIC_GEN, ModelUtility.CREATIVE],
    supportsTools: false,
    intelligence: IntelligenceLevel.BRILLIANT,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
    },
  },

  [MusicGenModelId.LYRIA_3_CLIP_PREVIEW]: {
    name: "Lyria 3 Clip Preview",
    by: "google",
    description: "chat.models.descriptions.lyria3ClipPreview",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "music",
    inputs: ["text"],
    outputs: ["audio"],
    providers: [
      {
        id: MusicGenModelId.LYRIA_3_CLIP_PREVIEW,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/lyria-3-clip-preview",
        creditCostPerClip: 4, // updated: 2026-08-16 from openrouter-api ($0.04/clip → 4 credits)
        defaultDurationSeconds: 15,
        supportedDurations: [MusicDuration.SHORT, MusicDuration.MEDIUM],
      },
      {
        id: MusicGenModelId.LYRIA_3_CLIP_PREVIEW,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "lyria-3-clip-preview",
        creditCostPerClip: 5.2,
        defaultDurationSeconds: 15,
        supportedDurations: ["post.duration.short", "post.duration.medium"],
      },
    ],
    utilities: [
      ModelUtility.MUSIC_GEN,
      ModelUtility.CREATIVE,
      ModelUtility.FAST,
    ],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
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

// ============================================================
// MUSIC GEN MODEL RESOLUTION
// ============================================================

/**
 * All (model, provider) combinations sorted cheapest-first.
 * Used by filterMusicGenModels for env-aware provider selection.
 */
function buildMusicGenModelOptionsPool(): MusicGenModelOption[] {
  const pool: MusicGenModelOption[] = [];
  for (const modelId of Object.values(MusicGenModelId)) {
    const def = musicGenModelDefinitions[modelId];
    const sortedProviders = [...def.providers].toSorted(
      (a, b) => getProviderPrice(a) - getProviderPrice(b),
    );
    for (const provider of sortedProviders) {
      if (provider.creditCostPerClip !== undefined) {
        pool.push(
          buildMusicGenOption(
            modelId,
            def,
            provider satisfies ModelProviderConfigAudioBased,
          ),
        );
      }
    }
  }
  return pool;
}

const musicGenModelOptionsPool: MusicGenModelOption[] =
  buildMusicGenModelOptionsPool();

const musicGenModelOptionsIndex: Partial<
  Record<MusicGenModelId, MusicGenModelOption>
> = buildModelOptionsIndex(musicGenModelOptionsPool) as Partial<
  Record<MusicGenModelId, MusicGenModelOption>
>;

export const musicGenModelOptions: MusicGenModelOption[] = Object.values(
  musicGenModelOptionsIndex,
).filter((m): m is MusicGenModelOption => m !== undefined);

export const MusicGenModelIdOptions = (
  Object.entries(MusicGenModelId) as [
    keyof typeof MusicGenModelId,
    MusicGenModelId,
  ][]
)
  .filter(([, id]) => musicGenModelOptionsIndex[id] !== undefined)
  .map(([key, id]) => ({
    value: id,
    label:
      `models.names.${key}` as `models.names.${keyof typeof MusicGenModelId}`,
  }));

export function getMusicGenModelById(
  modelId: MusicGenModelId,
): MusicGenModelOption | undefined {
  return musicGenModelOptionsIndex[modelId];
}

// ============================================================
// MUSIC GEN MODEL SELECTION SCHEMA
// ============================================================

const musicGenManualModelSelectionSchema = z
  .object({
    selectionType: z.literal(ModelSelectionType.MANUAL),
    manualModelId: z.enum(MusicGenModelId),
  })
  .merge(sharedFilterPropsSchema);
export type MusicGenManualModelSelection = z.infer<
  typeof musicGenManualModelSelectionSchema
>;

/**
 * Music-gen selection — explicit union + `z.ZodType<...>` annotation pins
 * `z.output` to the named type so consumers resolve it shallowly instead of
 * re-deriving the discriminated union (exceeds TS's instantiation-depth limit).
 */
export type MusicGenModelSelection =
  | MusicGenManualModelSelection
  | FiltersModelSelection;

export const musicGenModelSelectionSchema: z.ZodType<MusicGenModelSelection> =
  z.discriminatedUnion("selectionType", [
    musicGenManualModelSelectionSchema,
    filtersSelectionSchema,
  ]);

export function filterMusicGenModels(
  selection: MusicGenModelSelection | null | undefined,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): MusicGenModelOption[] {
  const pool = availability.unbottledForce
    ? musicGenModelOptionsPool.filter(
        (m) => m.apiProvider === ApiProvider.UNBOTTLED,
      )
    : musicGenModelOptionsPool;
  return filterRoleModels(pool, selection, user, availability);
}

export function getBestMusicGenModel(
  selection: MusicGenModelSelection,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): MusicGenModelOption | null {
  return filterMusicGenModels(selection, user, availability)[0] ?? null;
}
