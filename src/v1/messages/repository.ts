/**
 * POST /v1/messages - Anthropic Messages API.
 *
 * Translation only (translate.ts): Anthropic system/messages/tools in, Message
 * object or Anthropic SSE out, Anthropic error envelopes. Identity, model
 * checks, credit pre-flight, inference and billing run through the shared /v1
 * execution path - the same one chat completions and responses use.
 */

import "server-only";

import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { StreamingResponse } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { V1T } from "../i18n";
import { anthropicErrorResponse } from "../shared/anthropic";
import { v1Error } from "../shared/errors";
import {
  prepareV1Call,
  resolveV1Model,
  runV1Generate,
  runV1Stream,
} from "../shared/execution";
import { gateApiKeyRequest } from "../shared/gate";
import { aiSdkRunner, type InferenceRunner } from "../shared/inference";
import { openAiJson } from "../shared/openai";
import type { V1MessagesPostRequestOutput } from "./definition";
import {
  anthropicStreamEncoder,
  anthropicUsage,
  contentBlocksFromParts,
  convertAnthropicMessages,
  convertAnthropicToolChoice,
  convertAnthropicTools,
  messageObject,
  newMessageId,
  referencedToolNames,
  stopReasonFor,
} from "./translate";

export interface MessagesParams {
  data: V1MessagesPostRequestOutput;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  request: Request | undefined;
  t: V1T;
  toolExecutionContext: ToolExecutionContext;
  /** Injection point for tests; production uses the AI SDK runner. */
  runner?: InferenceRunner;
}

export class V1MessagesRepository {
  static async create(params: MessagesParams): Promise<StreamingResponse> {
    const { data, user, locale, logger, request, t, toolExecutionContext } =
      params;
    const runner = params.runner ?? aiSdkRunner;

    const gate = await gateApiKeyRequest(user, request, t, logger);
    if (!gate.ok) {
      return anthropicErrorResponse(gate.error);
    }
    const payer = gate.user;

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

    const resolved = await resolveV1Model(data.model, payer, t, "anthropic");
    if (!resolved.ok) {
      return anthropicErrorResponse(resolved.error);
    }

    const prepared = await prepareV1Call({
      payer,
      model: resolved.model,
      messages: converted.messages,
      estimatedInputTokens: converted.estimatedInputTokens,
      tools: convertAnthropicTools(
        data.tools,
        referencedToolNames(data.messages),
      ),
      toolChoice: convertAnthropicToolChoice(data.tool_choice),
      temperature: data.temperature ?? undefined,
      topP: data.top_p ?? undefined,
      maxOutputTokens: data.max_tokens ?? undefined,
      stopSequences:
        data.stop_sequences && data.stop_sequences.length > 0
          ? data.stop_sequences
          : undefined,
      request,
      locale,
      logger,
      t,
      toolExecutionContext,
      logTag: "v1/messages",
    });
    if (!prepared.ok) {
      return anthropicErrorResponse(prepared.error);
    }
    const { call } = prepared;

    const omitThinking = data.thinking?.display === "omitted";
    if (data.stream === true) {
      return runV1Stream(
        call,
        runner,
        anthropicStreamEncoder(
          data.model,
          call.estimatedInputTokens,
          omitThinking,
        ),
      );
    }

    const run = await runV1Generate(call, runner, t);
    if (!run.ok) {
      return anthropicErrorResponse(run.error);
    }
    const { result, totals } = run;
    return openAiJson(
      messageObject(
        newMessageId(),
        data.model,
        contentBlocksFromParts(result.parts, omitThinking),
        stopReasonFor(result.finishReason, result.toolCalls.length > 0),
        anthropicUsage(totals),
      ),
    );
  }
}
