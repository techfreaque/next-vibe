import "server-only";

import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";

import type { AgentEnvAvailability } from "../../../env-availability";
import { getEnvAvailability } from "../../../env-availability";
import { imageGenModelOptions } from "../../../image-generation/models";
import { getModelPrice } from "../../../models/models";
import {
  type AnyModelOption,
  ApiProvider,
  isModelProviderAvailable,
  modelProviders,
} from "../../../models/models";
import { musicGenModelOptions } from "../../../music-generation/models";
import { sttModelOptions } from "../../../speech-to-text/models";
import { ttsModelOptions } from "../../../text-to-speech/models";
import { videoGenModelOptions } from "../../../video-generation/models";
import { chatModelOptions } from "../../models";
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
  availability: AgentEnvAvailability,
): WsProviderModelEntry[] {
  return models
    .filter(
      (m) =>
        !m.adminOnly &&
        isModelProviderAvailable(m, availability) &&
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
    const availability = await getEnvAvailability();
    const models: WsProviderModelEntry[] = [
      ...mapModels(chatModelOptions, "chat", availability),
      ...mapModels(imageGenModelOptions, "image", availability),
      ...mapModels(musicGenModelOptions, "music", availability),
      ...mapModels(videoGenModelOptions, "video", availability),
      ...mapModels(ttsModelOptions, "tts", availability),
      ...mapModels(sttModelOptions, "stt", availability),
    ];

    return success({ models });
  }
}
