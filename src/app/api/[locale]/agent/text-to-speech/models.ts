import { z } from "zod";

import { objectEntries } from "../../shared/utils";
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
  type ModelOptionTtsBased,
  type ModelProviderEnvAvailability,
} from "../models/models";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

export enum TtsModelId {
  OPENAI_ALLOY = "openai-alloy",
  OPENAI_NOVA = "openai-nova",
  OPENAI_ONYX = "openai-onyx",
  OPENAI_ECHO = "openai-echo",
  OPENAI_SHIMMER = "openai-shimmer",
  OPENAI_FABLE = "openai-fable",
  ELEVENLABS_RACHEL = "elevenlabs-rachel",
  ELEVENLABS_JOSH = "elevenlabs-josh",
  ELEVENLABS_BELLA = "elevenlabs-bella",
  ELEVENLABS_ADAM = "elevenlabs-adam",
}

export const ttsModelDefinitions: Record<TtsModelId, ModelDefinition> = {
  [TtsModelId.OPENAI_ALLOY]: {
    name: "Alloy",
    by: "openAI",
    description: "textToSpeech.models.descriptions.openaiAlloy",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-04-03 from tts-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from tts-deterministic
    voiceMeta: { gender: "neutral", style: "conversational", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.OPENAI_ALLOY,
        apiProvider: ApiProvider.OPENAI_TTS,
        providerModel: "tts-1",
        creditCostPerCharacter: 0.0015, // updated: 2026-03-31 from platform.openai.com
      },
      {
        id: TtsModelId.OPENAI_ALLOY,
        apiProvider: ApiProvider.EDEN_AI_TTS,
        providerModel: "openai",
        creditCostPerCharacter: 0.0016, // updated: 2026-04-03 from api.edenai.run
      },
      {
        id: TtsModelId.OPENAI_ALLOY,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "openai-alloy",
        creditCostPerCharacter: 0.002, // updated: 2026-04-07 from unbottled.ai
      },
    ],
  },
  [TtsModelId.OPENAI_NOVA]: {
    name: "Nova",
    by: "openAI",
    description: "textToSpeech.models.descriptions.openaiNova",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-04-03 from tts-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from tts-deterministic
    voiceMeta: { gender: "female", style: "warm", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.OPENAI_NOVA,
        apiProvider: ApiProvider.OPENAI_TTS,
        providerModel: "tts-1",
        creditCostPerCharacter: 0.0015, // updated: 2026-03-31 from platform.openai.com
      },
      {
        id: TtsModelId.OPENAI_NOVA,
        apiProvider: ApiProvider.EDEN_AI_TTS,
        providerModel: "openai",
        creditCostPerCharacter: 0.0016, // updated: 2026-04-03 from api.edenai.run
      },
      {
        id: TtsModelId.OPENAI_NOVA,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "openai-nova",
        creditCostPerCharacter: 0.002, // updated: 2026-04-07 from unbottled.ai
      },
    ],
  },
  [TtsModelId.OPENAI_ONYX]: {
    name: "Onyx",
    by: "openAI",
    description: "textToSpeech.models.descriptions.openaiOnyx",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-04-03 from tts-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from tts-deterministic
    voiceMeta: { gender: "male", style: "deep", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.OPENAI_ONYX,
        apiProvider: ApiProvider.OPENAI_TTS,
        providerModel: "tts-1",
        creditCostPerCharacter: 0.0015, // updated: 2026-03-31 from platform.openai.com
      },
      {
        id: TtsModelId.OPENAI_ONYX,
        apiProvider: ApiProvider.EDEN_AI_TTS,
        providerModel: "openai",
        creditCostPerCharacter: 0.0016, // updated: 2026-04-03 from api.edenai.run
      },
      {
        id: TtsModelId.OPENAI_ONYX,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "openai-onyx",
        creditCostPerCharacter: 0.002, // updated: 2026-04-07 from unbottled.ai
      },
    ],
  },
  [TtsModelId.OPENAI_ECHO]: {
    name: "Echo",
    by: "openAI",
    description: "textToSpeech.models.descriptions.openaiEcho",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-04-03 from tts-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from tts-deterministic
    voiceMeta: { gender: "male", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.OPENAI_ECHO,
        apiProvider: ApiProvider.OPENAI_TTS,
        providerModel: "tts-1",
        creditCostPerCharacter: 0.0015, // updated: 2026-03-31 from platform.openai.com
      },
      {
        id: TtsModelId.OPENAI_ECHO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "openai-echo",
        creditCostPerCharacter: 0.002, // updated: 2026-04-07 from unbottled.ai
      },
    ],
  },
  [TtsModelId.OPENAI_SHIMMER]: {
    name: "Shimmer",
    by: "openAI",
    description: "textToSpeech.models.descriptions.openaiShimmer",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-04-03 from tts-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from tts-deterministic
    voiceMeta: { gender: "female", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.OPENAI_SHIMMER,
        apiProvider: ApiProvider.OPENAI_TTS,
        providerModel: "tts-1",
        creditCostPerCharacter: 0.0015, // updated: 2026-03-31 from platform.openai.com
      },
      {
        id: TtsModelId.OPENAI_SHIMMER,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "openai-shimmer",
        creditCostPerCharacter: 0.002, // updated: 2026-04-07 from unbottled.ai
      },
    ],
  },
  [TtsModelId.OPENAI_FABLE]: {
    name: "Fable",
    by: "openAI",
    description: "textToSpeech.models.descriptions.openaiFable",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-04-03 from tts-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from tts-deterministic
    voiceMeta: { gender: "male", style: "expressive", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    speed: SpeedLevel.FAST,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.OPENAI_FABLE,
        apiProvider: ApiProvider.OPENAI_TTS,
        providerModel: "tts-1",
        creditCostPerCharacter: 0.0015, // updated: 2026-03-31 from platform.openai.com
      },
      {
        id: TtsModelId.OPENAI_FABLE,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "openai-fable",
        creditCostPerCharacter: 0.002, // updated: 2026-04-07 from unbottled.ai
      },
    ],
  },
  [TtsModelId.ELEVENLABS_RACHEL]: {
    enabled: false, // auto-disabled: price not verified
    name: "Rachel",
    by: "elevenlabs",
    description: "textToSpeech.models.descriptions.elevenlabsRachel",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-04-03 from tts-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from tts-deterministic
    voiceMeta: { gender: "female", style: "calm", language: "en" },
    utilities: [ModelUtility.TTS, ModelUtility.SMART],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.ELEVENLABS_RACHEL,
        apiProvider: ApiProvider.ELEVENLABS,
        providerModel: "21m00Tcm4TlvDq8ikWAM",
        creditCostPerCharacter: 0.03, // updated: 2026-03-31 from api.elevenlabs.io
      },
      {
        id: TtsModelId.ELEVENLABS_RACHEL,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "elevenlabs-rachel",
        creditCostPerCharacter: 0.039, // updated: 2026-04-07 from unbottled.ai
      },
    ],
  },
  [TtsModelId.ELEVENLABS_JOSH]: {
    enabled: false, // auto-disabled: price not verified
    name: "Josh",
    by: "elevenlabs",
    description: "textToSpeech.models.descriptions.elevenlabsJosh",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-04-03 from tts-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from tts-deterministic
    voiceMeta: { gender: "male", style: "deep", language: "en" },
    utilities: [ModelUtility.TTS, ModelUtility.SMART],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.ELEVENLABS_JOSH,
        apiProvider: ApiProvider.ELEVENLABS,
        providerModel: "TxGEqnHWrfWFTfGW9XjX",
        creditCostPerCharacter: 0.03, // updated: 2026-03-31 from api.elevenlabs.io
      },
      {
        id: TtsModelId.ELEVENLABS_JOSH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "elevenlabs-josh",
        creditCostPerCharacter: 0.039, // updated: 2026-04-07 from unbottled.ai
      },
    ],
  },
  [TtsModelId.ELEVENLABS_BELLA]: {
    enabled: false, // auto-disabled: price not verified
    name: "Bella",
    by: "elevenlabs",
    description: "textToSpeech.models.descriptions.elevenlabsBella",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-04-03 from tts-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from tts-deterministic
    voiceMeta: { gender: "female", style: "friendly", language: "en" },
    utilities: [ModelUtility.TTS, ModelUtility.SMART],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.ELEVENLABS_BELLA,
        apiProvider: ApiProvider.ELEVENLABS,
        providerModel: "EXAVITQu4vr4xnSDxMaL",
        creditCostPerCharacter: 0.03, // updated: 2026-03-31 from api.elevenlabs.io
      },
      {
        id: TtsModelId.ELEVENLABS_BELLA,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "elevenlabs-bella",
        creditCostPerCharacter: 0.039, // updated: 2026-04-07 from unbottled.ai
      },
    ],
  },
  [TtsModelId.ELEVENLABS_ADAM]: {
    enabled: false, // auto-disabled: price not verified
    name: "Adam",
    by: "elevenlabs",
    description: "textToSpeech.models.descriptions.elevenlabsAdam",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-04-03 from tts-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from tts-deterministic
    voiceMeta: { gender: "male", style: "authoritative", language: "en" },
    utilities: [ModelUtility.TTS, ModelUtility.SMART],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    speed: SpeedLevel.BALANCED,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.ELEVENLABS_ADAM,
        apiProvider: ApiProvider.ELEVENLABS,
        providerModel: "pNInz6obpgDQGcFmaJgB",
        creditCostPerCharacter: 0.03, // updated: 2026-03-31 from api.elevenlabs.io
      },
      {
        id: TtsModelId.ELEVENLABS_ADAM,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "elevenlabs-adam",
        creditCostPerCharacter: 0.039, // updated: 2026-04-07 from unbottled.ai
      },
    ],
  },
};

export type TtsModelOption = ModelOptionTtsBased & { id: TtsModelId };

function buildTtsModelOptions(): TtsModelOption[] {
  const result: TtsModelOption[] = [];
  for (const [modelId, def] of objectEntries(ttsModelDefinitions)) {
    const sortedProviders = [...def.providers].toSorted(
      (a, b) => getProviderPrice(a) - getProviderPrice(b),
    );
    for (const provider of sortedProviders) {
      if (
        "creditCostPerCharacter" in provider &&
        provider.creditCostPerCharacter
      ) {
        result.push({
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
          creditCostPerCharacter: provider.creditCostPerCharacter,
        });
      }
    }
  }
  return result;
}

export const ttsModelOptions: TtsModelOption[] = buildTtsModelOptions();

export const TtsModelIdOptions = Object.values(TtsModelId).map((id) => ({
  value: id,
  label: ttsModelOptions.find((m) => m.id === id)?.name ?? id,
}));

// ============================================================
// TTS MODEL SELECTION SCHEMA
// ============================================================

export const voiceModelSelectionSchema = z.discriminatedUnion("selectionType", [
  z
    .object({
      selectionType: z.literal(ModelSelectionType.MANUAL),
      manualModelId: z.enum(TtsModelId),
    })
    .merge(sharedFilterPropsSchema),
  filtersSelectionSchema,
]);
export type VoiceModelSelection = z.infer<typeof voiceModelSelectionSchema>;

// ============================================================
// TTS MODEL RESOLUTION
// ============================================================

export function filterTtsModels(
  selection: VoiceModelSelection | null | undefined,
  user: JwtPayloadType,
  env: ModelProviderEnvAvailability,
): TtsModelOption[] {
  return filterRoleModels(ttsModelOptions, selection, user, env);
}

export function getBestTtsModel(
  selection: VoiceModelSelection,
  user: JwtPayloadType,
  env: ModelProviderEnvAvailability,
): TtsModelOption | null {
  return filterTtsModels(selection, user, env)[0] ?? null;
}
