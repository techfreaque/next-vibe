import "server-only";

import { chatModelOptions } from "next-vibe/agent/ai-stream/models";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { imageGenModelOptions } from "next-vibe/agent/image-generation/models";
import { getModelPrice } from "next-vibe/agent/models/models";
import {
  type AnyModelOption,
  ApiProvider,
  isModelProviderAvailable,
  modelProviders,
} from "next-vibe/agent/models/models";
import { musicGenModelOptions } from "next-vibe/agent/music-generation/models";
import { sttModelOptions } from "next-vibe/agent/speech-to-text/models";
import { ttsModelOptions } from "next-vibe/agent/text-to-speech/models";
import { videoGenModelOptions } from "next-vibe/agent/video-generation/models";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";

import type {
  WsProviderModelEntry,
  WsProviderModelsGetResponseOutput,
} from "./definition";

function getProviderDisplayName(providerId: string): string {
  const provider = modelProviders[providerId];
  return provider?.name ?? providerId;
}

function mapModel(
  model: AnyModelOption,
  category: string,
): WsProviderModelEntry {
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

function mapModels(
  models: AnyModelOption[],
  category: string,
): WsProviderModelEntry[] {
  return models
    .filter(
      (m) =>
        !m.adminOnly &&
        isModelProviderAvailable(m, getEnvAvailability()) &&
        // Never advertise relay models: a provider serving UNBOTTLED entries
        // would create recursive relay chains (ws-provider/stream/spec.md).
        m.apiProvider !== ApiProvider.UNBOTTLED,
    )
    .map((m) => mapModel(m, category));
}

export class WsProviderModelsRepository {
  static async listModels(): Promise<
    ResponseType<WsProviderModelsGetResponseOutput>
  > {
    const models: WsProviderModelEntry[] = [
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
