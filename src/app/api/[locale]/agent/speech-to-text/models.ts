import { z } from "zod";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
} from "../chat/skills/enum";
import { ModelUtility } from "../models/enum";
import {
  ApiProvider,
  defaultFeatures,
  filterRoleModels,
  getProviderPrice,
  type ModelDefinition,
  type ModelOptionSttBased,
  type ModelProviderConfigSttBased,
} from "../models/models";
import {
  filtersSelectionSchema,
  sharedFilterPropsSchema,
} from "../models/selection";

export enum SttModelId {
  OPENAI_WHISPER = "openai-whisper",
  DEEPGRAM_NOVA_2 = "deepgram-nova-2",
}

export const sttModelDefinitions: Record<SttModelId, ModelDefinition> = {
  [SttModelId.OPENAI_WHISPER]: {
    name: "Whisper",
    by: "openAI",
    description: "speechToText.models.descriptions.openaiWhisper",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "mic",
    inputs: ["audio"], // updated: 2026-04-03 from stt-deterministic
    outputs: ["text"], // updated: 2026-04-03 from stt-deterministic
    utilities: [ModelUtility.STT],
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
        id: SttModelId.OPENAI_WHISPER,
        apiProvider: ApiProvider.OPENAI_STT,
        providerModel: "whisper-1",
        creditCostPerSecond: 0.01, // updated: 2026-04-03 from platform.openai.com
      },
      {
        id: SttModelId.OPENAI_WHISPER,
        apiProvider: ApiProvider.EDEN_AI_STT,
        providerModel: "openai",
        creditCostPerSecond: 0.0106, // updated: 2026-04-03 from api.edenai.run
      },
      {
        id: SttModelId.OPENAI_WHISPER,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "openai-whisper",
        creditCostPerSecond: 0.013, // updated: 2026-04-07 from unbottled.ai
      },
    ],
  },
  [SttModelId.DEEPGRAM_NOVA_2]: {
    name: "Nova-2",
    by: "deepgram",
    description: "speechToText.models.descriptions.deepgramNova2",
    contextWindow: 0,
    parameterCount: undefined,
    icon: "mic",
    inputs: ["audio"], // updated: 2026-04-03 from stt-deterministic
    outputs: ["text"], // updated: 2026-04-03 from stt-deterministic
    utilities: [ModelUtility.STT, ModelUtility.FAST],
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
        id: SttModelId.DEEPGRAM_NOVA_2,
        apiProvider: ApiProvider.DEEPGRAM,
        providerModel: "nova-2",
        creditCostPerSecond: 0.0097, // updated: 2026-03-31 from deepgram.com
      },
      {
        id: SttModelId.DEEPGRAM_NOVA_2,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "deepgram-nova-2",
        creditCostPerSecond: 0.0126, // updated: 2026-04-07 from unbottled.ai
      },
    ],
  },
};

export type SttModelOption = ModelOptionSttBased & { id: SttModelId };

function buildSttOption(
  modelId: SttModelId,
  def: ModelDefinition,
  provider: ModelProviderConfigSttBased,
): SttModelOption {
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
    creditCostPerSecond: provider.creditCostPerSecond,
  };
}

function buildSttModelOptions(): SttModelOption[] {
  const result: SttModelOption[] = [];
  for (const [modelId, def] of Object.entries(sttModelDefinitions)) {
    const sortedProviders = [...def.providers].toSorted(
      (a, b) => getProviderPrice(a) - getProviderPrice(b),
    );
    for (const provider of sortedProviders) {
      if (
        "creditCostPerSecond" in provider &&
        !("defaultDurationSeconds" in provider)
      ) {
        result.push(
          buildSttOption(
            modelId as SttModelId,
            def,
            provider as ModelProviderConfigSttBased,
          ),
        );
      }
    }
  }
  return result;
}

export const sttModelOptions: SttModelOption[] = buildSttModelOptions();

export const SttModelIdOptions = Object.values(SttModelId).map((id) => ({
  value: id,
  label: sttModelOptions.find((m) => m.id === id)?.name ?? id,
}));

// ============================================================
// STT MODEL SELECTION SCHEMA
// ============================================================

export const sttModelSelectionSchema = z.discriminatedUnion("selectionType", [
  z
    .object({
      selectionType: z.literal(ModelSelectionType.MANUAL),
      manualModelId: z.enum(SttModelId),
    })
    .merge(sharedFilterPropsSchema),
  filtersSelectionSchema,
]);
export type SttModelSelection = z.infer<typeof sttModelSelectionSchema>;

// ============================================================
// STT MODEL RESOLUTION
// ============================================================

export function filterSttModels(
  selection: SttModelSelection | null | undefined,
  user: JwtPayloadType,
): SttModelOption[] {
  return filterRoleModels(sttModelOptions, selection, user);
}

export function getBestSttModel(
  selection: SttModelSelection,
  user: JwtPayloadType,
): SttModelOption | null {
  return filterSttModels(selection, user)[0] ?? null;
}
