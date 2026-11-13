/**
 * POST /v1/responses - OpenAI Responses API, stateless.
 *
 * Translation only (translate.ts): Responses input/tools in, Response object
 * or Responses SSE out. Identity, model checks, credit pre-flight, inference
 * and billing run through the shared /v1 execution path - the same one chat
 * completions and Anthropic messages use.
 */

import "server-only";

import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { StreamingResponse } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { V1T } from "../i18n";
import {
  CHARS_PER_TOKEN,
  prepareV1Call,
  resolveV1Model,
  runV1Generate,
  runV1Stream,
} from "../shared/execution";
import { gateApiKeyRequest } from "../shared/gate";
import { aiSdkRunner, type InferenceRunner } from "../shared/inference";
import { openAiError, openAiErrorResponse, openAiJson } from "../shared/openai";
import type { V1ResponsesPostRequestOutput } from "./definition";
import {
  convertResponsesInput,
  convertResponsesToolChoice,
  convertResponsesTools,
  finalStatus,
  newResponseId,
  outputItemsFromParts,
  type ResponseEcho,
  responseObject,
  responsesStreamEncoder,
  responsesUsage,
} from "./translate";

export interface ResponsesParams {
  data: V1ResponsesPostRequestOutput;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  request: Request | undefined;
  t: V1T;
  toolExecutionContext: ToolExecutionContext;
  /** Injection point for tests; production uses the AI SDK runner. */
  runner?: InferenceRunner;
}

export class V1ResponsesRepository {
  static async create(params: ResponsesParams): Promise<StreamingResponse> {
    const { data, user, locale, logger, request, t, toolExecutionContext } =
      params;
    const runner = params.runner ?? aiSdkRunner;

    const gate = await gateApiKeyRequest(user, request, t, logger);
    if (!gate.ok) {
      return openAiErrorResponse(gate.error);
    }
    const payer = gate.user;

    if (data.previous_response_id) {
      return openAiError(
        400,
        t("responses.previousResponseUnsupported"),
        "invalid_request_error",
        "unsupported_parameter",
        "previous_response_id",
      );
    }
    const converted = convertResponsesInput(data);
    if (!converted.ok) {
      return openAiError(
        400,
        t("responses.badInputItem", { param: converted.param }),
        "invalid_request_error",
        "invalid_value",
        converted.param,
      );
    }

    const resolved = await resolveV1Model(data.model, payer, t);
    if (!resolved.ok) {
      return openAiErrorResponse(resolved.error);
    }

    const toolSet = convertResponsesTools(data.tools);
    const prepared = await prepareV1Call({
      payer,
      model: resolved.model,
      messages: converted.messages,
      estimatedInputTokens:
        converted.estimatedInputTokens +
        Math.ceil(JSON.stringify(toolSet.tools).length / CHARS_PER_TOKEN),
      tools: toolSet.tools,
      toolChoice: convertResponsesToolChoice(data.tool_choice),
      temperature: data.temperature ?? undefined,
      topP: data.top_p ?? undefined,
      maxOutputTokens: data.max_output_tokens ?? undefined,
      stopSequences: undefined,
      request,
      locale,
      logger,
      t,
      toolExecutionContext,
      logTag: "v1/responses",
    });
    if (!prepared.ok) {
      return openAiErrorResponse(prepared.error);
    }
    const { call } = prepared;

    const echo: ResponseEcho = {
      id: newResponseId(),
      createdAt: Math.floor(Date.now() / 1000),
      model: call.model.id,
      instructions: data.instructions ?? null,
      toolChoice: data.tool_choice ?? "auto",
      tools: data.tools ?? [],
      parallelToolCalls: data.parallel_tool_calls ?? true,
      temperature: data.temperature ?? null,
      topP: data.top_p ?? null,
      maxOutputTokens: data.max_output_tokens ?? null,
      reasoning: data.reasoning ?? null,
      store: false,
    };

    if (data.stream === true) {
      return runV1Stream(
        call,
        runner,
        responsesStreamEncoder(echo, toolSet.kinds),
      );
    }

    const run = await runV1Generate(call, runner, t);
    if (!run.ok) {
      return openAiErrorResponse(run.error);
    }
    const output = outputItemsFromParts(run.result.parts, toolSet.kinds);
    const status =
      run.result.toolCalls.length > 0
        ? "completed"
        : finalStatus(run.result.finishReason);
    return openAiJson(
      responseObject(echo, status, output, {
        usage: responsesUsage(run.totals),
      }),
    );
  }
}
