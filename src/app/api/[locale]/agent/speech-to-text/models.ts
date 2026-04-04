import { z } from "zod";

import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  PriceLevel,
  SpeedLevel,
} from "../chat/skills/enum";
import { ModelUtility } from "../models/enum";
import {
  ApiProvider,
  defaultFeatures,
  filterRoleModels,
  type ModelDefinition,
  type ModelOptionSttBased,
  type ModelProviderConfigSttBased,
  type ModelProviderEnvAvailability,
  getProviderPrice,
} from "../models/models";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

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
    speed: SpeedLevel.BALANCED,
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
    speed: SpeedLevel.FAST,
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
    ],
  },
};

export type SttModelOption = ModelOptionSttBased & { id: SttModelId };

function buildSttModelOptions(): Record<string, SttModelOption> {
  const result: Record<string, SttModelOption> = {};
  for (const [modelId, def] of Object.entries(sttModelDefinitions)) {
    const sortedProviders = [...def.providers].toSorted(
      (a, b) => getProviderPrice(a) - getProviderPrice(b),
    );
    for (const provider of sortedProviders) {
      if (
        "creditCostPerSecond" in provider &&
        !("defaultDurationSeconds" in provider)
      ) {
        const p = provider as ModelProviderConfigSttBased;
        result[modelId] = {
          id: modelId as SttModelId,
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
        };
      }
    }
  }
  return result;
}

const sttModelOptionsIndex: Record<string, SttModelOption> =
  buildSttModelOptions();

export const sttModelOptions: SttModelOption[] = Object.values(
  sttModelOptionsIndex,
).filter((m): m is SttModelOption => m !== undefined);

export const SttModelIdOptions = Object.values(SttModelId).map((id) => ({
  value: id,
  label: sttModelOptions.find((m) => m.id === id)?.name ?? id,
}));

export function getSttModelById(modelId: SttModelId): SttModelOption {
  return (
    sttModelOptionsIndex[modelId] ??
    sttModelOptionsIndex[SttModelId.OPENAI_WHISPER]!
  );
}

// ============================================================
// STT MODEL SELECTION SCHEMA
// ============================================================

const sharedFilterPropsSchema = z.object({
  intelligenceRange: z
    .object({
      min: z.enum(IntelligenceLevel).optional(),
      max: z.enum(IntelligenceLevel).optional(),
    })
    .optional(),
  priceRange: z
    .object({
      min: z.enum(PriceLevel).optional(),
      max: z.enum(PriceLevel).optional(),
    })
    .optional(),
  contentRange: z
    .object({
      min: z.enum(ContentLevel).optional(),
      max: z.enum(ContentLevel).optional(),
    })
    .optional(),
  speedRange: z
    .object({
      min: z.enum(SpeedLevel).optional(),
      max: z.enum(SpeedLevel).optional(),
    })
    .optional(),
  sortBy: z.enum(ModelSortField).optional(),
  sortDirection: z.enum(ModelSortDirection).optional(),
  sortBy2: z.enum(ModelSortField).optional(),
  sortDirection2: z.enum(ModelSortDirection).optional(),
});

const filtersSelectionSchema = z
  .object({ selectionType: z.literal(ModelSelectionType.FILTERS) })
  .merge(sharedFilterPropsSchema);

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
  env: ModelProviderEnvAvailability,
): SttModelOption[] {
  return filterRoleModels(sttModelOptions, selection, user, env);
}

export function getBestSttModel(
  selection: SttModelSelection,
  user: JwtPayloadType,
  env: ModelProviderEnvAvailability,
): SttModelOption | null {
  return filterSttModels(selection, user, env)[0] ?? null;
}
