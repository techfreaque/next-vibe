/**
 * POST /v1/messages/count_tokens - input token estimate for an Anthropic
 * request. Same converter as /v1/messages, so the number matches what the
 * credit pre-flight estimates for the real call.
 */

import "server-only";

import type { StreamingResponse } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { V1T } from "../../i18n";
import { anthropicErrorResponse } from "../../shared/anthropic";
import { v1Error } from "../../shared/errors";
import { gateApiKeyRequest } from "../../shared/gate";
import { openAiJson } from "../../shared/openai";
import { convertAnthropicMessages } from "../translate";
import type { V1CountTokensPostRequestOutput } from "./definition";

export class V1CountTokensRepository {
  static async count(params: {
    data: V1CountTokensPostRequestOutput;
    user: JwtPayloadType;
    request: Request | undefined;
    t: V1T;
    logger: EndpointLogger;
  }): Promise<StreamingResponse> {
    const { data, user, request, t, logger } = params;
    const gate = await gateApiKeyRequest(user, request, t, logger, {
      consumeRateLimit: false,
    });
    if (!gate.ok) {
      return anthropicErrorResponse(gate.error);
    }
    const converted = convertAnthropicMessages(data);
    if (!converted.ok) {
      return anthropicErrorResponse(
        v1Error(
          400,
          t("messages.badContentBlock", { param: converted.param }),
          "invalid_request_error",
          "invalid_value",
          converted.param,
        ),
      );
    }
    return openAiJson({ input_tokens: converted.estimatedInputTokens });
  }
}
