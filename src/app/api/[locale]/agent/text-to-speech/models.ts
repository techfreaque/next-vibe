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
  type ModelOptionTtsBased,
} from "../models/models";

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
    ],
  },
};

export type TtsModelOption = ModelOptionTtsBased & { id: TtsModelId };

function buildTtsModelOptions(): Record<string, TtsModelOption> {
  const result: Record<string, TtsModelOption> = {};
  for (const [modelId, def] of Object.entries(ttsModelDefinitions)) {
    const sortedProviders = [...def.providers].toSorted(
      (a, b) => getProviderPrice(a) - getProviderPrice(b),
    );
    for (const provider of sortedProviders) {
      if ("creditCostPerCharacter" in provider) {
        const p = provider;
        result[modelId] = {
          id: modelId as TtsModelId,
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
          creditCostPerCharacter: p.creditCostPerCharacter,
        };
      }
    }
  }
  return result;
}

const ttsModelOptionsIndex: Record<string, TtsModelOption> =
  buildTtsModelOptions();

export const ttsModelOptions: TtsModelOption[] = Object.values(
  ttsModelOptionsIndex,
).filter((m): m is TtsModelOption => m !== undefined);

export const TtsModelIdOptions = Object.values(TtsModelId).map((id) => ({
  value: id,
  label: ttsModelOptions.find((m) => m.id === id)?.name ?? id,
}));

export function getTtsModelById(modelId: TtsModelId): TtsModelOption {
  return ttsModelOptionsIndex[modelId];
}
