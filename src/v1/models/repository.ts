/**
 * GET /v1/models - the chat models this API key's user can call.
 */

import "server-only";

import { getEnvAvailability } from "next-vibe/agent/env-availability";
import type { StreamingResponse } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { V1T } from "../i18n";
import { gateApiKeyRequest } from "../shared/gate";
import { listUserCallableModels } from "../shared/models";
import { MODEL_CREATED_AT, openAiJson } from "../shared/openai";

export class V1ModelsRepository {
  static async list(
    user: JwtPayloadType,
    request: Request | undefined,
    t: V1T,
    logger: EndpointLogger,
  ): Promise<StreamingResponse> {
    const gate = await gateApiKeyRequest(user, request, t, logger);
    if (!gate.ok) {
      return gate.response;
    }
    const models = listUserCallableModels(
      gate.user,
      await getEnvAvailability(),
    );
    return openAiJson({
      object: "list",
      data: models.map((m) => ({
        id: m.id,
        object: "model",
        created: MODEL_CREATED_AT,
        owned_by: m.provider,
        name: m.name,
        context_length: m.contextWindow,
        supports_tools: m.supportsTools,
        input_modalities: m.inputs,
        output_modalities: m.outputs,
        pricing: {
          input_credits_per_million_tokens: m.inputTokenCost ?? null,
          output_credits_per_million_tokens: m.outputTokenCost ?? null,
        },
      })),
    });
  }
}
