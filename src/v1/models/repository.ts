/**
 * GET /v1/models - the chat and media models this API key's user can call, in
 * a shape both OpenAI and Anthropic clients accept. `modality` says which
 * endpoint family a model belongs to (chat, image, video, music, speech,
 * transcription); `endpoints` lists the paths to call it on.
 */

import "server-only";

import { getEnvAvailability } from "next-vibe/agent/env-availability";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { StreamingResponse } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { V1T } from "../i18n";
import { chatTokenPricing } from "../shared/chat-pricing";
import { gateApiKeyRequest } from "../shared/gate";
import {
  listUserMediaModels,
  V1_MODALITY_ENDPOINTS,
} from "../shared/media-models";
import { listUserCallableModels } from "../shared/models";
import {
  MODEL_CREATED_AT,
  openAiErrorResponse,
  openAiJson,
} from "../shared/openai";

const MODEL_CREATED_AT_ISO = new Date(MODEL_CREATED_AT * 1000).toISOString();

export class V1ModelsRepository {
  static async list(
    user: JwtPayloadType,
    request: Request | undefined,
    locale: CountryLanguage,
    t: V1T,
    logger: EndpointLogger,
  ): Promise<StreamingResponse> {
    const gate = await gateApiKeyRequest(user, request, locale, t, logger);
    if (!gate.ok) {
      return openAiErrorResponse(gate.error);
    }
    const availability = await getEnvAvailability();
    const models = listUserCallableModels(gate.user, availability);
    const chatIds = new Set<string>(models.map((m) => m.id));
    // Anthropic clients (Claude Code's model picker) only ever call chat
    // models: media models would be noise there. OpenAI's own list carries
    // its image/audio models, so OpenAI clients get them. A media id that is
    // also a chat model (image-output chat models) is listed once, as chat.
    const anthropicClient = request?.headers.has("anthropic-version") ?? false;
    const media = anthropicClient
      ? []
      : listUserMediaModels(gate.user, availability).filter(
          (m) => !chatIds.has(m.id),
        );
    const ids = [...models.map((m) => m.id), ...media.map((m) => m.id)];
    // One body both SDK families parse: OpenAI reads object/data[].object,
    // Anthropic reads data[].type/display_name/created_at + has_more.
    return openAiJson({
      object: "list",
      has_more: false,
      first_id: ids[0] ?? null,
      last_id: ids.at(-1) ?? null,
      data: [
        ...models.map((m) => ({
          id: m.id,
          object: "model",
          type: "model",
          display_name: m.name,
          created_at: MODEL_CREATED_AT_ISO,
          created: MODEL_CREATED_AT,
          owned_by: m.provider,
          name: m.name,
          modality: "chat",
          endpoints: [...V1_MODALITY_ENDPOINTS.chat],
          context_length: m.contextWindow,
          supports_tools: m.supportsTools,
          input_modalities: m.inputs,
          output_modalities: m.outputs,
          pricing: chatTokenPricing(m),
        })),
        ...media.map((m) => ({
          id: m.id,
          object: "model",
          type: "model",
          display_name: m.name,
          created_at: MODEL_CREATED_AT_ISO,
          created: MODEL_CREATED_AT,
          owned_by: m.ownedBy,
          name: m.name,
          modality: m.modality,
          endpoints: [...m.endpoints],
          input_modalities: m.inputs,
          output_modalities: m.outputs,
          pricing: m.pricing,
        })),
      ],
    });
  }
}
