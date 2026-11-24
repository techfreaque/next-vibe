import { objectEntries } from "next-vibe/core/utils/object";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { z } from "zod";

import { CREDIT_VALUE_USD } from "@/products/repository-client";

import type { AgentEnvAvailability } from "../env-availability";
import {
  commercialUse,
  CommercialUseReason,
} from "../models/commercial-use/enum";
import { ModelUtility } from "../models/enum";
import {
  ApiProvider,
  calculateTtsCreditCost,
  chargeForProviderCredits,
  defaultFeatures,
  filterRoleModels,
  getProviderPrice,
  isProviderSellable,
  type ModelDefinition,
  type ModelOptionTtsBased,
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
import { chunkTextForTTS } from "./chunking";

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
  ELEVENLABS_RACHEL_TURBO = "elevenlabs-rachel-turbo",
  ELEVENLABS_JOSH_TURBO = "elevenlabs-josh-turbo",
  ELEVENLABS_BELLA_TURBO = "elevenlabs-bella-turbo",
  ELEVENLABS_ADAM_TURBO = "elevenlabs-adam-turbo",
  KOKORO_BELLA = "kokoro-bella",
  KOKORO_SARAH = "kokoro-sarah",
  KOKORO_NICOLE = "kokoro-nicole",
  KOKORO_ADAM = "kokoro-adam",
  KOKORO_MICHAEL = "kokoro-michael",
  KOKORO_EMMA = "kokoro-emma",
  KOKORO_GEORGE = "kokoro-george",
  VOXTRAL_PAUL = "voxtral-paul",
  INWORLD_MINI_ASHLEY = "inworld-mini-ashley",
  INWORLD_MINI_CRAIG = "inworld-mini-craig",
  XAI_EVE = "xai-eve",
  GEMINI_ZEPHYR = "gemini-zephyr",
  GEMINI_PUCK = "gemini-puck",
}

export const ttsModelDefinitions: Record<TtsModelId, ModelDefinition> = {
  [TtsModelId.OPENAI_ALLOY]: {
    name: "Alloy",
    commercialUse: commercialUse.allowed(CommercialUseReason.PROVIDER_TERMS),
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
        providerModel: "alloy",
        creditCostPerCharacter: 0.0015, // updated: 2026-11-13 from developers.openai.com/api/docs/pricing (tts-1, $15/1M chars)
      },
      {
        id: TtsModelId.OPENAI_ALLOY,
        apiProvider: ApiProvider.EDEN_AI_TTS,
        providerModel: "openai/tts-1:alloy",
        creditCostPerCharacter: 0.0016, // updated: 2026-11-13 from api.edenai.run
      },
      {
        id: TtsModelId.OPENAI_ALLOY,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "openai-alloy",
        creditCostPerCharacter: 0.002, // updated: 2026-11-09 from unbottled.ai
      },
    ],
  },
  [TtsModelId.OPENAI_NOVA]: {
    name: "Nova",
    commercialUse: commercialUse.allowed(CommercialUseReason.PROVIDER_TERMS),
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
        providerModel: "nova",
        creditCostPerCharacter: 0.0015, // updated: 2026-11-13 from developers.openai.com/api/docs/pricing (tts-1, $15/1M chars)
      },
      {
        id: TtsModelId.OPENAI_NOVA,
        apiProvider: ApiProvider.EDEN_AI_TTS,
        providerModel: "openai/tts-1:nova",
        creditCostPerCharacter: 0.0016, // updated: 2026-11-13 from api.edenai.run
      },
      {
        id: TtsModelId.OPENAI_NOVA,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "openai-nova",
        creditCostPerCharacter: 0.002, // updated: 2026-11-09 from unbottled.ai
      },
    ],
  },
  [TtsModelId.OPENAI_ONYX]: {
    name: "Onyx",
    commercialUse: commercialUse.allowed(CommercialUseReason.PROVIDER_TERMS),
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
        providerModel: "onyx",
        creditCostPerCharacter: 0.0015, // updated: 2026-11-13 from developers.openai.com/api/docs/pricing (tts-1, $15/1M chars)
      },
      {
        id: TtsModelId.OPENAI_ONYX,
        apiProvider: ApiProvider.EDEN_AI_TTS,
        providerModel: "openai/tts-1:onyx",
        creditCostPerCharacter: 0.0016, // updated: 2026-11-13 from api.edenai.run
      },
      {
        id: TtsModelId.OPENAI_ONYX,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "openai-onyx",
        creditCostPerCharacter: 0.002, // updated: 2026-11-09 from unbottled.ai
      },
    ],
  },
  [TtsModelId.OPENAI_ECHO]: {
    name: "Echo",
    commercialUse: commercialUse.allowed(CommercialUseReason.PROVIDER_TERMS),
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
        providerModel: "echo",
        creditCostPerCharacter: 0.0015, // updated: 2026-11-13 from developers.openai.com/api/docs/pricing (tts-1, $15/1M chars)
      },
      {
        id: TtsModelId.OPENAI_ECHO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "openai-echo",
        creditCostPerCharacter: 0.002, // updated: 2026-11-09 from unbottled.ai
      },
    ],
  },
  [TtsModelId.OPENAI_SHIMMER]: {
    name: "Shimmer",
    commercialUse: commercialUse.allowed(CommercialUseReason.PROVIDER_TERMS),
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
        providerModel: "shimmer",
        creditCostPerCharacter: 0.0015, // updated: 2026-11-13 from developers.openai.com/api/docs/pricing (tts-1, $15/1M chars)
      },
      {
        id: TtsModelId.OPENAI_SHIMMER,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "openai-shimmer",
        creditCostPerCharacter: 0.002, // updated: 2026-11-09 from unbottled.ai
      },
    ],
  },
  [TtsModelId.OPENAI_FABLE]: {
    name: "Fable",
    commercialUse: commercialUse.allowed(CommercialUseReason.PROVIDER_TERMS),
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
        providerModel: "fable",
        creditCostPerCharacter: 0.0015, // updated: 2026-11-13 from developers.openai.com/api/docs/pricing (tts-1, $15/1M chars)
      },
      {
        id: TtsModelId.OPENAI_FABLE,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "openai-fable",
        creditCostPerCharacter: 0.002, // updated: 2026-11-09 from unbottled.ai
      },
    ],
  },
  [TtsModelId.ELEVENLABS_RACHEL]: {
    name: "Rachel",
    commercialUse: commercialUse.unclear(CommercialUseReason.TERMS_UNCONFIRMED),
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
        providerModel: "eleven_v4:21m00Tcm4TlvDq8ikWAM",
        creditCostPerCharacter: 0.008, // updated: 2026-11-17 from elevenlabs.io/pricing/api (v4, $0.08/1K chars)
      },
      {
        id: TtsModelId.ELEVENLABS_RACHEL,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "elevenlabs-rachel",
        creditCostPerCharacter: 0.0104, // updated: 2026-11-17 from unbottled.ai
      },
    ],
  },
  [TtsModelId.ELEVENLABS_JOSH]: {
    name: "Josh",
    commercialUse: commercialUse.unclear(CommercialUseReason.TERMS_UNCONFIRMED),
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
        providerModel: "eleven_v4:TxGEqnHWrfWFTfGW9XjX",
        creditCostPerCharacter: 0.008, // updated: 2026-11-17 from elevenlabs.io/pricing/api (v4, $0.08/1K chars)
      },
      {
        id: TtsModelId.ELEVENLABS_JOSH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "elevenlabs-josh",
        creditCostPerCharacter: 0.0104, // updated: 2026-11-17 from unbottled.ai
      },
    ],
  },
  [TtsModelId.ELEVENLABS_BELLA]: {
    name: "Bella",
    commercialUse: commercialUse.unclear(CommercialUseReason.TERMS_UNCONFIRMED),
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
        providerModel: "eleven_v4:EXAVITQu4vr4xnSDxMaL",
        creditCostPerCharacter: 0.008, // updated: 2026-11-17 from elevenlabs.io/pricing/api (v4, $0.08/1K chars)
      },
      {
        id: TtsModelId.ELEVENLABS_BELLA,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "elevenlabs-bella",
        creditCostPerCharacter: 0.0104, // updated: 2026-11-17 from unbottled.ai
      },
    ],
  },
  [TtsModelId.ELEVENLABS_ADAM]: {
    name: "Adam",
    commercialUse: commercialUse.unclear(CommercialUseReason.TERMS_UNCONFIRMED),
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
        providerModel: "eleven_v4:pNInz6obpgDQGcFmaJgB",
        creditCostPerCharacter: 0.008, // updated: 2026-11-17 from elevenlabs.io/pricing/api (v4, $0.08/1K chars)
      },
      {
        id: TtsModelId.ELEVENLABS_ADAM,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "elevenlabs-adam",
        creditCostPerCharacter: 0.0104, // updated: 2026-11-17 from unbottled.ai
      },
    ],
  },
  [TtsModelId.ELEVENLABS_RACHEL_TURBO]: {
    name: "Rachel (Turbo)",
    commercialUse: commercialUse.unclear(CommercialUseReason.TERMS_UNCONFIRMED),
    by: "elevenlabs",
    description: "textToSpeech.models.descriptions.elevenlabsRachelTurbo",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-04-03 from tts-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from tts-deterministic
    voiceMeta: { gender: "female", style: "calm", language: "en" },
    utilities: [ModelUtility.TTS, ModelUtility.FAST],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.ELEVENLABS_RACHEL_TURBO,
        apiProvider: ApiProvider.ELEVENLABS,
        providerModel: "eleven_v4_turbo:21m00Tcm4TlvDq8ikWAM",
        creditCostPerCharacter: 0.004, // updated: 2026-11-17 from elevenlabs.io/pricing/api (v4 Turbo, $0.04/1K chars)
      },
      {
        id: TtsModelId.ELEVENLABS_RACHEL_TURBO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "elevenlabs-rachel-turbo",
        creditCostPerCharacter: 0.0052, // updated: 2026-11-17 from unbottled.ai
      },
    ],
  },
  [TtsModelId.ELEVENLABS_JOSH_TURBO]: {
    name: "Josh (Turbo)",
    commercialUse: commercialUse.unclear(CommercialUseReason.TERMS_UNCONFIRMED),
    by: "elevenlabs",
    description: "textToSpeech.models.descriptions.elevenlabsJoshTurbo",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-04-03 from tts-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from tts-deterministic
    voiceMeta: { gender: "male", style: "deep", language: "en" },
    utilities: [ModelUtility.TTS, ModelUtility.FAST],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.ELEVENLABS_JOSH_TURBO,
        apiProvider: ApiProvider.ELEVENLABS,
        providerModel: "eleven_v4_turbo:TxGEqnHWrfWFTfGW9XjX",
        creditCostPerCharacter: 0.004, // updated: 2026-11-17 from elevenlabs.io/pricing/api (v4 Turbo, $0.04/1K chars)
      },
      {
        id: TtsModelId.ELEVENLABS_JOSH_TURBO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "elevenlabs-josh-turbo",
        creditCostPerCharacter: 0.0052, // updated: 2026-11-17 from unbottled.ai
      },
    ],
  },
  [TtsModelId.ELEVENLABS_BELLA_TURBO]: {
    name: "Bella (Turbo)",
    commercialUse: commercialUse.unclear(CommercialUseReason.TERMS_UNCONFIRMED),
    by: "elevenlabs",
    description: "textToSpeech.models.descriptions.elevenlabsBellaTurbo",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-04-03 from tts-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from tts-deterministic
    voiceMeta: { gender: "female", style: "friendly", language: "en" },
    utilities: [ModelUtility.TTS, ModelUtility.FAST],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.ELEVENLABS_BELLA_TURBO,
        apiProvider: ApiProvider.ELEVENLABS,
        providerModel: "eleven_v4_turbo:EXAVITQu4vr4xnSDxMaL",
        creditCostPerCharacter: 0.004, // updated: 2026-11-17 from elevenlabs.io/pricing/api (v4 Turbo, $0.04/1K chars)
      },
      {
        id: TtsModelId.ELEVENLABS_BELLA_TURBO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "elevenlabs-bella-turbo",
        creditCostPerCharacter: 0.0052, // updated: 2026-11-17 from unbottled.ai
      },
    ],
  },
  [TtsModelId.ELEVENLABS_ADAM_TURBO]: {
    name: "Adam (Turbo)",
    commercialUse: commercialUse.unclear(CommercialUseReason.TERMS_UNCONFIRMED),
    by: "elevenlabs",
    description: "textToSpeech.models.descriptions.elevenlabsAdamTurbo",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-04-03 from tts-deterministic
    outputs: ["audio"], // updated: 2026-04-03 from tts-deterministic
    voiceMeta: { gender: "male", style: "authoritative", language: "en" },
    utilities: [ModelUtility.TTS, ModelUtility.FAST],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.ELEVENLABS_ADAM_TURBO,
        apiProvider: ApiProvider.ELEVENLABS,
        providerModel: "eleven_v4_turbo:pNInz6obpgDQGcFmaJgB",
        creditCostPerCharacter: 0.004, // updated: 2026-11-17 from elevenlabs.io/pricing/api (v4 Turbo, $0.04/1K chars)
      },
      {
        id: TtsModelId.ELEVENLABS_ADAM_TURBO,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "elevenlabs-adam-turbo",
        creditCostPerCharacter: 0.0052, // updated: 2026-11-17 from unbottled.ai
      },
    ],
  },
  [TtsModelId.KOKORO_BELLA]: {
    name: "Bella (Kokoro)",
    commercialUse: commercialUse.allowed(CommercialUseReason.OPEN_LICENSE),
    by: "hexgrad",
    description: "textToSpeech.models.descriptions.kokoroBella",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-11-09 from tts-deterministic
    outputs: ["audio"], // updated: 2026-11-09 from tts-deterministic
    voiceMeta: { gender: "female", style: "warm", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.UNCENSORED,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.KOKORO_BELLA,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "Kokoro-82m:af_bella",
        creditCostPerCharacter: 0.00017, // updated: 2026-11-13 from nano-gpt.com/api/v1/audio-models ($0.0017/1K chars)
      },
      {
        id: TtsModelId.KOKORO_BELLA,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kokoro-bella",
        creditCostPerCharacter: 0.0002, // updated: 2026-11-09 from unbottled.ai
      },
    ],
  },
  [TtsModelId.KOKORO_SARAH]: {
    name: "Sarah (Kokoro)",
    commercialUse: commercialUse.allowed(CommercialUseReason.OPEN_LICENSE),
    by: "hexgrad",
    description: "textToSpeech.models.descriptions.kokoroSarah",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-11-09 from tts-deterministic
    outputs: ["audio"], // updated: 2026-11-09 from tts-deterministic
    voiceMeta: { gender: "female", style: "clear", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.UNCENSORED,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.KOKORO_SARAH,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "Kokoro-82m:af_sarah",
        creditCostPerCharacter: 0.00017, // updated: 2026-11-13 from nano-gpt.com/api/v1/audio-models ($0.0017/1K chars)
      },
      {
        id: TtsModelId.KOKORO_SARAH,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kokoro-sarah",
        creditCostPerCharacter: 0.0002, // updated: 2026-11-09 from unbottled.ai
      },
    ],
  },
  [TtsModelId.KOKORO_NICOLE]: {
    name: "Nicole (Kokoro)",
    commercialUse: commercialUse.allowed(CommercialUseReason.OPEN_LICENSE),
    by: "hexgrad",
    description: "textToSpeech.models.descriptions.kokoroNicole",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-11-09 from tts-deterministic
    outputs: ["audio"], // updated: 2026-11-09 from tts-deterministic
    voiceMeta: { gender: "female", style: "soft", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.UNCENSORED,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.KOKORO_NICOLE,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "Kokoro-82m:af_nicole",
        creditCostPerCharacter: 0.00017, // updated: 2026-11-13 from nano-gpt.com/api/v1/audio-models ($0.0017/1K chars)
      },
      {
        id: TtsModelId.KOKORO_NICOLE,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kokoro-nicole",
        creditCostPerCharacter: 0.0002, // updated: 2026-11-09 from unbottled.ai
      },
    ],
  },
  [TtsModelId.KOKORO_ADAM]: {
    name: "Adam (Kokoro)",
    commercialUse: commercialUse.allowed(CommercialUseReason.OPEN_LICENSE),
    by: "hexgrad",
    description: "textToSpeech.models.descriptions.kokoroAdam",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-11-09 from tts-deterministic
    outputs: ["audio"], // updated: 2026-11-09 from tts-deterministic
    voiceMeta: { gender: "male", style: "steady", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.UNCENSORED,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.KOKORO_ADAM,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "Kokoro-82m:am_adam",
        creditCostPerCharacter: 0.00017, // updated: 2026-11-13 from nano-gpt.com/api/v1/audio-models ($0.0017/1K chars)
      },
      {
        id: TtsModelId.KOKORO_ADAM,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kokoro-adam",
        creditCostPerCharacter: 0.0002, // updated: 2026-11-09 from unbottled.ai
      },
    ],
  },
  [TtsModelId.KOKORO_MICHAEL]: {
    name: "Michael (Kokoro)",
    commercialUse: commercialUse.allowed(CommercialUseReason.OPEN_LICENSE),
    by: "hexgrad",
    description: "textToSpeech.models.descriptions.kokoroMichael",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-11-09 from tts-deterministic
    outputs: ["audio"], // updated: 2026-11-09 from tts-deterministic
    voiceMeta: { gender: "male", style: "confident", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.UNCENSORED,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.KOKORO_MICHAEL,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "Kokoro-82m:am_michael",
        creditCostPerCharacter: 0.00017, // updated: 2026-11-13 from nano-gpt.com/api/v1/audio-models ($0.0017/1K chars)
      },
      {
        id: TtsModelId.KOKORO_MICHAEL,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kokoro-michael",
        creditCostPerCharacter: 0.0002, // updated: 2026-11-09 from unbottled.ai
      },
    ],
  },
  [TtsModelId.KOKORO_EMMA]: {
    name: "Emma (Kokoro)",
    commercialUse: commercialUse.allowed(CommercialUseReason.OPEN_LICENSE),
    by: "hexgrad",
    description: "textToSpeech.models.descriptions.kokoroEmma",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-11-09 from tts-deterministic
    outputs: ["audio"], // updated: 2026-11-09 from tts-deterministic
    voiceMeta: { gender: "female", style: "british", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.UNCENSORED,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.KOKORO_EMMA,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "Kokoro-82m:bf_emma",
        creditCostPerCharacter: 0.00017, // updated: 2026-11-13 from nano-gpt.com/api/v1/audio-models ($0.0017/1K chars)
      },
      {
        id: TtsModelId.KOKORO_EMMA,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kokoro-emma",
        creditCostPerCharacter: 0.0002, // updated: 2026-11-09 from unbottled.ai
      },
    ],
  },
  [TtsModelId.KOKORO_GEORGE]: {
    name: "George (Kokoro)",
    commercialUse: commercialUse.allowed(CommercialUseReason.OPEN_LICENSE),
    by: "hexgrad",
    description: "textToSpeech.models.descriptions.kokoroGeorge",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-11-09 from tts-deterministic
    outputs: ["audio"], // updated: 2026-11-09 from tts-deterministic
    voiceMeta: { gender: "male", style: "british", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.UNCENSORED,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.KOKORO_GEORGE,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "Kokoro-82m:bm_george",
        creditCostPerCharacter: 0.00017, // updated: 2026-11-13 from nano-gpt.com/api/v1/audio-models ($0.0017/1K chars)
      },
      {
        id: TtsModelId.KOKORO_GEORGE,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "kokoro-george",
        creditCostPerCharacter: 0.0002, // updated: 2026-11-09 from unbottled.ai
      },
    ],
  },
  [TtsModelId.VOXTRAL_PAUL]: {
    name: "Paul (Voxtral Mini)",
    commercialUse: commercialUse.restricted(
      CommercialUseReason.NON_COMMERCIAL_LICENSE,
    ),
    by: "mistralAI",
    description: "textToSpeech.models.descriptions.voxtralPaul",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"],
    outputs: ["audio"],
    voiceMeta: { gender: "male", style: "neutral", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.VOXTRAL_PAUL,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "voxtral-mini-tts-3-0:en_paul_neutral",
        creditCostPerCharacter: 0.00221, // updated: 2026-11-21 from nano-gpt-api
      },
    ],
  },
  [TtsModelId.INWORLD_MINI_ASHLEY]: {
    name: "Ashley (Inworld)",
    commercialUse: commercialUse.allowed(CommercialUseReason.PROVIDER_TERMS),
    by: "inworld",
    description: "textToSpeech.models.descriptions.inworldAshley",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-11-09 from tts-deterministic
    outputs: ["audio"], // updated: 2026-11-09 from tts-deterministic
    voiceMeta: { gender: "female", style: "lively", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.INWORLD_MINI_ASHLEY,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "inworld-tts-1.5-mini:Ashley",
        creditCostPerCharacter: 0.00102, // updated: 2026-11-13 from nano-gpt.com/api/v1/audio-models ($0.0102/1K chars)
      },
      {
        id: TtsModelId.INWORLD_MINI_ASHLEY,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "inworld-mini-ashley",
        creditCostPerCharacter: 0.0013, // updated: 2026-11-09 from unbottled.ai
      },
    ],
  },
  [TtsModelId.INWORLD_MINI_CRAIG]: {
    name: "Craig (Inworld)",
    commercialUse: commercialUse.allowed(CommercialUseReason.PROVIDER_TERMS),
    by: "inworld",
    description: "textToSpeech.models.descriptions.inworldCraig",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-11-09 from tts-deterministic
    outputs: ["audio"], // updated: 2026-11-09 from tts-deterministic
    voiceMeta: { gender: "male", style: "british", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.INWORLD_MINI_CRAIG,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "inworld-tts-1.5-mini:Craig",
        creditCostPerCharacter: 0.00102, // updated: 2026-11-13 from nano-gpt.com/api/v1/audio-models ($0.0102/1K chars)
      },
      {
        id: TtsModelId.INWORLD_MINI_CRAIG,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "inworld-mini-craig",
        creditCostPerCharacter: 0.0013, // updated: 2026-11-09 from unbottled.ai
      },
    ],
  },
  [TtsModelId.XAI_EVE]: {
    name: "Eve (xAI)",
    commercialUse: commercialUse.unclear(CommercialUseReason.TERMS_UNCONFIRMED),
    by: "xai",
    description: "textToSpeech.models.descriptions.xaiEve",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-11-09 from tts-deterministic
    outputs: ["audio"], // updated: 2026-11-09 from tts-deterministic
    voiceMeta: { gender: "female", style: "expressive", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.QUICK,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.XAI_EVE,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "xai-tts:Eve",
        creditCostPerCharacter: 0.00165, // updated: 2026-11-13 from nano-gpt.com/api/v1/audio-models ($0.0165/1K chars)
      },
      {
        id: TtsModelId.XAI_EVE,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "xai-eve",
        creditCostPerCharacter: 0.0021, // updated: 2026-11-09 from unbottled.ai
      },
    ],
  },
  [TtsModelId.GEMINI_ZEPHYR]: {
    name: "Zephyr (Gemini)",
    commercialUse: commercialUse.allowed(CommercialUseReason.PROVIDER_TERMS),
    by: "google",
    description: "textToSpeech.models.descriptions.geminiZephyr",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-11-09 from tts-deterministic
    outputs: ["audio"], // updated: 2026-11-09 from tts-deterministic
    voiceMeta: { gender: "female", style: "bright", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.GEMINI_ZEPHYR,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "google/gemini-3.8-flash-lite-tts:Zephyr",
        creditCostPerCharacter: 0.003, // updated: 2026-11-13 from nano-gpt.com/api/v1/audio-models ($0.03/1K chars)
      },
      {
        id: TtsModelId.GEMINI_ZEPHYR,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gemini-zephyr",
        creditCostPerCharacter: 0.0039, // updated: 2026-11-09 from unbottled.ai
      },
    ],
  },
  [TtsModelId.GEMINI_PUCK]: {
    name: "Puck (Gemini)",
    commercialUse: commercialUse.allowed(CommercialUseReason.PROVIDER_TERMS),
    by: "google",
    description: "textToSpeech.models.descriptions.geminiPuck",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "volume-2",
    inputs: ["text"], // updated: 2026-11-09 from tts-deterministic
    outputs: ["audio"], // updated: 2026-11-09 from tts-deterministic
    voiceMeta: { gender: "male", style: "upbeat", language: "en" },
    utilities: [ModelUtility.TTS],
    supportsTools: false,
    intelligence: IntelligenceLevel.SMART,
    content: ContentLevel.MAINSTREAM,
    features: {
      ...defaultFeatures,
      streaming: false,
      toolCalling: false,
    },
    providers: [
      {
        id: TtsModelId.GEMINI_PUCK,
        apiProvider: ApiProvider.NANO_GPT,
        providerModel: "google/gemini-3.8-flash-lite-tts:Puck",
        creditCostPerCharacter: 0.003, // updated: 2026-11-13 from nano-gpt.com/api/v1/audio-models ($0.03/1K chars)
      },
      {
        id: TtsModelId.GEMINI_PUCK,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "gemini-puck",
        creditCostPerCharacter: 0.0039, // updated: 2026-11-09 from unbottled.ai
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
        provider.creditCostPerCharacter &&
        isProviderSellable(def, provider)
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
          content: def.content,
          features: def.features,
          weaknesses: def.weaknesses,
          adminOnly: provider.adminOnly,
          inputs: def.inputs,
          outputs: def.outputs,
          voiceMeta: def.voiceMeta,
          commercialUse: def.commercialUse,
          creditCostPerCharacter: provider.creditCostPerCharacter,
        });
      }
    }
  }
  return result;
}

export const ttsModelOptions: TtsModelOption[] = buildTtsModelOptions();

export const TtsModelIdOptions = (
  Object.entries(TtsModelId) as [keyof typeof TtsModelId, TtsModelId][]
).map(([key, id]) => ({
  value: id,
  label: `models.names.${key}` as `models.names.${keyof typeof TtsModelId}`,
}));

export function getTtsModelById(
  modelId: TtsModelId,
): TtsModelOption | undefined {
  return ttsModelOptions.find((m) => m.id === modelId);
}

/**
 * Credits for one TTS request: the provider's real cost when it reported one
 * (Eden AI does), else the voice route's own per-character rate. Standard
 * markup, rounded up to 0.1 credit.
 */
export function calculateTtsCharge(
  option: Pick<ModelOptionTtsBased, "creditCostPerCharacter">,
  characterCount: number,
  providerCostUsd: number | undefined,
): number {
  return providerCostUsd !== undefined && providerCostUsd > 0
    ? chargeForProviderCredits(providerCostUsd / CREDIT_VALUE_USD)
    : calculateTtsCreditCost(option, characterCount);
}

/**
 * Billing for TTS spoken in pieces (call mode / streamed replies). Each chunk
 * adds its upstream cost; addChunk returns only the growth of the rounded
 * total, so a reply split into 20 short chunks costs the same as one request
 * of the same length instead of 20 separate 0.1-credit round-ups.
 */
export class TtsChargeMeter {
  private providerCredits = 0;
  private billed = 0;

  /** Credits to deduct now for this chunk (0 while the total stays put). */
  addChunk(
    option: Pick<ModelOptionTtsBased, "creditCostPerCharacter">,
    characterCount: number,
    providerCostUsd: number | undefined,
  ): number {
    this.providerCredits +=
      providerCostUsd !== undefined && providerCostUsd > 0
        ? providerCostUsd / CREDIT_VALUE_USD
        : option.creditCostPerCharacter * Math.max(0, characterCount);
    const target = chargeForProviderCredits(this.providerCredits);
    const due = Math.round((target - this.billed) * 10) / 10;
    this.billed = target;
    return Math.max(0, due);
  }

  /** Everything billed so far */
  get total(): number {
    return this.billed;
  }
}

/**
 * Price hint for reading `text` aloud with `voiceId` in the chat: the player
 * sends it chunk by chunk (chunkTextForTTS) and each chunk is billed as its own
 * request, so the hint sums the per-chunk charges. Uses the voice's cheapest
 * sellable route, the same rate /models shows.
 */
export function estimateReadAloudCredits(
  text: string,
  voiceId: TtsModelId,
): number {
  const option = getTtsModelById(voiceId);
  if (!option) {
    return 0;
  }
  const total = chunkTextForTTS(text).reduce(
    (sum, chunk) => sum + calculateTtsCreditCost(option, chunk.length),
    0,
  );
  // Snap float noise from summing 0.1 steps (0.30000000000000004).
  return Math.round(total * 10) / 10;
}

// ============================================================
// TTS MODEL SELECTION SCHEMA
// ============================================================

const voiceManualModelSelectionSchema = z
  .object({
    selectionType: z.literal(ModelSelectionType.MANUAL),
    manualModelId: z.enum(TtsModelId),
  })
  .merge(sharedFilterPropsSchema);
export type VoiceManualModelSelection = z.infer<
  typeof voiceManualModelSelectionSchema
>;

/**
 * Voice (TTS) selection — explicit union + `z.ZodType<...>` annotation pins
 * `z.output` to the named type so consumers resolve it shallowly instead of
 * re-deriving the discriminated union (exceeds TS's instantiation-depth limit).
 */
export type VoiceModelSelection =
  | VoiceManualModelSelection
  | FiltersModelSelection;

export const voiceModelSelectionSchema: z.ZodType<VoiceModelSelection> =
  z.discriminatedUnion("selectionType", [
    voiceManualModelSelectionSchema,
    filtersSelectionSchema,
  ]);

// ============================================================
// TTS MODEL RESOLUTION
// ============================================================

export function filterTtsModels(
  selection: VoiceModelSelection | null | undefined,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): TtsModelOption[] {
  return filterRoleModels(ttsModelOptions, selection, user, availability);
}

export function getBestTtsModel(
  selection: VoiceModelSelection,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): TtsModelOption | null {
  return filterTtsModels(selection, user, availability)[0] ?? null;
}
