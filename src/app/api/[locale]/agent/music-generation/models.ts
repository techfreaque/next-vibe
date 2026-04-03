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
  type ModelOptionAudioBased,
  type ModelProviderConfigAudioBased,
} from "../models/models";

export enum MusicGenModelId {
  MUSICGEN_STEREO = "musicgen-stereo",
  STABLE_AUDIO = "stable-audio",
  UDIO_V2 = "udio-v2",
  MODELSLAB_MUSIC_GEN = "modelslab-music-gen",
  // --- AUTO-GENERATED from chat models with matching output modality ---
  // --- END AUTO-GENERATED ---
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
        creditCostPerClip: 5.1, // updated: 2026-04-03 from replicate-html-p50
        defaultDurationSeconds: 8,
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

  [MusicGenModelId.STABLE_AUDIO]: {
    name: "Stable Audio",
    by: "stabilityAI",
    description: "chat.models.descriptions.stableAudio",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "music",
    inputs: ["text"], // updated: 2026-04-03 from music-gen-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from music-gen-deterministic
    providers: [
      {
        id: MusicGenModelId.STABLE_AUDIO,
        apiProvider: ApiProvider.FAL_AI,
        providerModel: "fal-ai/stable-audio",
        creditCostPerClip: 1, // updated: 2026-03-31 from fal-ai-static
        defaultDurationSeconds: 20,
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

  [MusicGenModelId.UDIO_V2]: {
    name: "Udio v2",
    by: "udio",
    description: "chat.models.descriptions.udioV2",
    parameterCount: undefined,
    contextWindow: 0,
    icon: "music",
    inputs: ["text"], // updated: 2026-04-03 from music-gen-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from music-gen-deterministic
    providers: [
      {
        id: MusicGenModelId.UDIO_V2,
        apiProvider: ApiProvider.FAL_AI,
        providerModel: "fal-ai/udio",
        creditCostPerClip: 5, // updated: 2026-03-31 from fal-ai-static
        defaultDurationSeconds: 30,
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

  [MusicGenModelId.MODELSLAB_MUSIC_GEN]: {
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
        id: MusicGenModelId.MODELSLAB_MUSIC_GEN,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "music_gen",
        creditCostPerClip: 21, // updated: 2026-03-31 from modelslab.com
        defaultDurationSeconds: 30,
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
};

export type MusicGenModelOption = ModelOptionAudioBased & {
  id: MusicGenModelId;
};

function buildMusicGenModelOptions(): Record<string, MusicGenModelOption> {
  const result: Record<string, MusicGenModelOption> = {};
  for (const [modelId, def] of Object.entries(musicGenModelDefinitions)) {
    const sortedProviders = [...def.providers].toSorted(
      (a, b) => getProviderPrice(a) - getProviderPrice(b),
    );
    for (const provider of sortedProviders) {
      if ("creditCostPerClip" in provider) {
        const p = provider as ModelProviderConfigAudioBased;
        result[modelId] = {
          id: modelId as MusicGenModelId,
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
        };
      }
    }
  }
  return result;
}

const musicGenModelOptionsIndex: Record<string, MusicGenModelOption> =
  buildMusicGenModelOptions();

export const musicGenModelOptions: MusicGenModelOption[] = Object.values(
  musicGenModelOptionsIndex,
).filter((m): m is MusicGenModelOption => m !== undefined);

export const MusicGenModelIdOptions = Object.values(MusicGenModelId).map(
  (id) => ({
    value: id,
    label: musicGenModelOptions.find((m) => m.id === id)?.name ?? id,
  }),
);

export function getMusicGenModelById(
  modelId: MusicGenModelId,
): MusicGenModelOption {
  return musicGenModelOptionsIndex[modelId];
}

/** Check if a model ID (from any enum) also exists as a music gen model */
export function isMusicGenModelId(modelId: string): boolean {
  return modelId in musicGenModelOptionsIndex;
}
