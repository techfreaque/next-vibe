import "server-only";

import {
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { chatModelOptions } from "@/app/api/[locale]/agent/ai-stream/models";
import { imageGenModelOptions } from "@/app/api/[locale]/agent/image-generation/models";
import { getModelPrice } from "@/app/api/[locale]/agent/models/all-models";
import {
  type AnyModelOption,
  modelProviders,
} from "@/app/api/[locale]/agent/models/models";
import { musicGenModelOptions } from "@/app/api/[locale]/agent/music-generation/models";
import { sttModelOptions } from "@/app/api/[locale]/agent/speech-to-text/models";
import { ttsModelOptions } from "@/app/api/[locale]/agent/text-to-speech/models";
import { videoGenModelOptions } from "@/app/api/[locale]/agent/video-generation/models";

import type { WsProviderModelsGetResponseOutput } from "./definition";

type ModelEntry = WsProviderModelsGetResponseOutput["models"][number];

function getProviderDisplayName(providerId: string): string {
  const provider = modelProviders[providerId];
  return provider?.name ?? providerId;
}

function mapModel(model: AnyModelOption, category: string): ModelEntry {
  return {
    id: model.id,
    name: model.name,
    provider: getProviderDisplayName(model.provider),
    category,
    description: model.description,
    contextWindow: model.contextWindow > 0 ? model.contextWindow : null,
    supportsTools: model.supportsTools,
    creditCost: getModelPrice(model),
  };
}

function mapModels(models: AnyModelOption[], category: string): ModelEntry[] {
  return models.filter((m) => !m.adminOnly).map((m) => mapModel(m, category));
}

export class WsProviderModelsRepository {
  static async listModels(): Promise<
    ResponseType<WsProviderModelsGetResponseOutput>
  > {
    const models: ModelEntry[] = [
      ...mapModels(chatModelOptions, "chat"),
      ...mapModels(imageGenModelOptions, "image"),
      ...mapModels(musicGenModelOptions, "music"),
      ...mapModels(videoGenModelOptions, "video"),
      ...mapModels(ttsModelOptions, "tts"),
      ...mapModels(sttModelOptions, "stt"),
    ];

    return success({ models });
  }
}
