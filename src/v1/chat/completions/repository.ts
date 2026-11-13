/**
 * POST /v1/chat/completions - OpenAI-compatible chat completions.
 *
 * Identity: API key only (gateApiKeyRequest). Inference: the same provider
 * layer chat uses (inference.ts). Billing: the same credit pipeline as chat -
 * pre-flight balance + free-tier cap gate, then deductCreditsForModelUsage
 * with the real token usage. Streaming bills after the stream ends (or is
 * abandoned) from the usage the provider reported.
 */

import "server-only";

import type { AssistantContent, ModelMessage } from "ai";
import type { ChatModelOption } from "next-vibe/agent/ai-stream/models";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { calculateCreditCost } from "next-vibe/agent/models/models";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  createStreamingResponse,
  type StreamingResponse,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import { creditValidator } from "@/credits/validator";

import type { V1T } from "../../i18n";
import { V1_MAX_OUTPUT_TOKENS } from "../../shared/constants";
import { gateApiKeyRequest } from "../../shared/gate";
import {
  aiSdkRunner,
  type InferenceRequest,
  type InferenceRunner,
  type InferenceTool,
  type InferenceToolCall,
  type InferenceToolChoice,
  type InferenceUsage,
  type OpenAiFinishReason,
} from "../../shared/inference";
import { resolveRequestedModel } from "../../shared/models";
import {
  newCompletionId,
  openAiError,
  openAiErrorBody,
  openAiJson,
} from "../../shared/openai";
import type {
  OpenAiMessage,
  OpenAiToolChoice,
  V1ChatCompletionsPostRequestOutput,
} from "./definition";

const CHARS_PER_TOKEN = 3.5;
const TOKENS_PER_IMAGE = 1_000;
const DEFAULT_ESTIMATED_OUTPUT_TOKENS = 4_096;

export interface CompleteParams {
  data: V1ChatCompletionsPostRequestOutput;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  request: Request | undefined;
  t: V1T;
  toolExecutionContext: ToolExecutionContext;
  /** Injection point for tests; production uses the AI SDK runner. */
  runner?: InferenceRunner;
}

type Converted =
  | { ok: true; messages: ModelMessage[]; estimatedInputTokens: number }
  | { ok: false; message: string; param: string };

const jsonSchema = z.json();

/** Tool-call arguments arrive as a JSON string; the provider layer wants the parsed value. */
function parseArguments(
  raw: string,
): ReturnType<typeof jsonSchema.parse> | undefined {
  if (raw.trim() === "") {
    return {};
  }
  try {
    const parsed = jsonSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}

function convertMessages(messages: OpenAiMessage[], t: V1T): Converted {
  const out: ModelMessage[] = [];
  const toolNames = new Map<string, string>();
  let chars = 0;
  let images = 0;
  for (const [index, msg] of messages.entries()) {
    const param = `messages[${index}]`;
    const content = msg.content ?? "";
    if (msg.role === "tool") {
      if (!msg.tool_call_id) {
        return {
          ok: false,
          message: t("openai.toolMessageNeedsId", { param }),
          param,
        };
      }
      const text =
        typeof content === "string"
          ? content
          : content.map((p) => (p.type === "text" ? p.text : "")).join("");
      chars += text.length;
      out.push({
        role: "tool",
        content: [
          {
            type: "tool-result",
            toolCallId: msg.tool_call_id,
            toolName: toolNames.get(msg.tool_call_id) ?? msg.name ?? "tool",
            output: { type: "text", value: text },
          },
        ],
      });
      continue;
    }
    if (msg.role === "user") {
      if (typeof content === "string") {
        chars += content.length;
        out.push({ role: "user", content });
        continue;
      }
      const parts: Array<
        { type: "text"; text: string } | { type: "image"; image: URL | string }
      > = [];
      for (const part of content) {
        if (part.type === "text") {
          chars += part.text.length;
          parts.push({ type: "text", text: part.text });
          continue;
        }
        const url =
          typeof part.image_url === "string"
            ? part.image_url
            : part.image_url.url;
        images += 1;
        if (url.startsWith("data:")) {
          parts.push({ type: "image", image: url });
        } else if (URL.canParse(url) && /^https?:/.test(url)) {
          parts.push({ type: "image", image: new URL(url) });
        } else {
          return { ok: false, message: t("openai.badImageUrl"), param };
        }
      }
      out.push({ role: "user", content: parts });
      continue;
    }
    const text =
      typeof content === "string"
        ? content
        : content.map((p) => (p.type === "text" ? p.text : "")).join("");
    chars += text.length;
    if (msg.role === "assistant") {
      if (msg.tool_calls && msg.tool_calls.length > 0) {
        const parts: Exclude<AssistantContent, string> = [];
        if (text) {
          parts.push({ type: "text", text });
        }
        for (const call of msg.tool_calls) {
          const input = parseArguments(call.function.arguments);
          if (input === undefined) {
            return {
              ok: false,
              message: t("openai.badToolArguments", {
                name: call.function.name,
              }),
              param: `${param}.tool_calls`,
            };
          }
          chars += call.function.name.length + call.function.arguments.length;
          toolNames.set(call.id, call.function.name);
          parts.push({
            type: "tool-call",
            toolCallId: call.id,
            toolName: call.function.name,
            input,
          });
        }
        out.push({ role: "assistant", content: parts });
      } else {
        out.push({ role: "assistant", content: text });
      }
      continue;
    }
    out.push({ role: "system", content: text });
  }
  return {
    ok: true,
    messages: out,
    estimatedInputTokens:
      Math.ceil(chars / CHARS_PER_TOKEN) + images * TOKENS_PER_IMAGE,
  };
}

function toolChoiceFor(
  choice: OpenAiToolChoice | undefined,
): InferenceToolChoice | undefined {
  if (choice === undefined) {
    return undefined;
  }
  return typeof choice === "string"
    ? choice
    : { toolName: choice.function.name };
}

function toolCallChars(calls: InferenceToolCall[]): number {
  return calls.reduce(
    (sum, call) => sum + call.name.length + call.arguments.length,
    0,
  );
}

function stopSequences(
  stop: string | string[] | undefined,
): string[] | undefined {
  if (stop === undefined) {
    return undefined;
  }
  return typeof stop === "string" ? [stop] : stop;
}

function clientIp(request: Request | undefined): string | undefined {
  return (
    request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request?.headers.get("x-real-ip") ||
    undefined
  );
}

export class V1ChatCompletionsRepository {
  static async complete(params: CompleteParams): Promise<StreamingResponse> {
    const { data, user, locale, logger, request, t, toolExecutionContext } =
      params;
    const runner = params.runner ?? aiSdkRunner;

    // 1. Identity + per-key rate limit
    const gate = await gateApiKeyRequest(user, request, t, logger);
    if (!gate.ok) {
      return gate.response;
    }
    const payer = gate.user;

    // 2. Request validation beyond the schema
    if ((data.n ?? 1) !== 1) {
      return openAiError(
        400,
        t("openai.nUnsupported"),
        "invalid_request_error",
        "unsupported_parameter",
        "n",
      );
    }
    const converted = convertMessages(data.messages, t);
    if (!converted.ok) {
      return openAiError(
        400,
        converted.message,
        "invalid_request_error",
        "invalid_value",
        converted.param,
      );
    }

    // 3. Model: strict resolution against what THIS user may call
    const availability = await getEnvAvailability();
    const model = resolveRequestedModel(data.model, payer, availability);
    if (!model) {
      return openAiError(
        404,
        t("openai.modelNotFound", { model: data.model }),
        "not_found_error",
        "model_not_found",
        "model",
      );
    }

    // 3b. Tools: client-defined functions. The model calls, the client runs.
    const tools: InferenceTool[] = (data.tools ?? []).map((spec) => ({
      name: spec.function.name,
      description: spec.function.description,
      parameters: spec.function.parameters,
    }));
    if (tools.length > 0 && !model.supportsTools) {
      return openAiError(
        400,
        t("openai.toolsUnsupportedByModel"),
        "invalid_request_error",
        "tools_not_supported",
        "tools",
      );
    }
    const toolChoice =
      tools.length > 0 ? toolChoiceFor(data.tool_choice) : undefined;
    if (
      typeof toolChoice === "object" &&
      !tools.some((spec) => spec.name === toolChoice.toolName)
    ) {
      return openAiError(
        400,
        t("openai.toolChoiceUnknown", { name: toolChoice.toolName }),
        "invalid_request_error",
        "invalid_value",
        "tool_choice",
      );
    }
    const estimatedInputTokens =
      converted.estimatedInputTokens +
      Math.ceil(JSON.stringify(data.tools ?? []).length / CHARS_PER_TOKEN);

    // 4. Credits: fail-closed pre-flight (balance + free-tier cap)
    const requestedOutput = data.max_completion_tokens ?? data.max_tokens;
    const maxOutputTokens =
      requestedOutput === undefined
        ? undefined
        : Math.min(requestedOutput, V1_MAX_OUTPUT_TOKENS);
    const estimatedCost = calculateCreditCost(
      model,
      estimatedInputTokens,
      maxOutputTokens ?? DEFAULT_ESTIMATED_OUTPUT_TOKENS,
    );
    const preflight = await V1ChatCompletionsRepository.preflight({
      user: payer,
      model,
      estimatedCost,
      ip: clientIp(request),
      locale,
      logger,
      t,
    });
    if (preflight) {
      return preflight;
    }

    const inference: InferenceRequest = {
      model,
      messages: converted.messages,
      temperature: data.temperature,
      topP: data.top_p,
      maxOutputTokens,
      stopSequences: stopSequences(data.stop),
      abortSignal: request?.signal,
      tools,
      toolChoice,
      logger,
      toolExecutionContext,
    };
    const bill = (
      usage: InferenceUsage | undefined,
      outputChars: number,
    ): Promise<number> =>
      V1ChatCompletionsRepository.bill({
        user: payer,
        model,
        usage,
        estimatedInputTokens: estimatedInputTokens,
        outputChars,
        locale,
        logger,
      });

    if (data.stream === true) {
      return V1ChatCompletionsRepository.streamResponse({
        runner,
        inference,
        bill,
        includeUsage: data.stream_options?.include_usage === true,
        model,
        logger,
        estimatedInputTokens: estimatedInputTokens,
      });
    }

    // 5. Non-streaming
    try {
      const result = await runner.generate(inference);
      const credits = await bill(
        result.usage,
        result.text.length + toolCallChars(result.toolCalls),
      );
      const promptTokens = result.usage?.inputTokens ?? estimatedInputTokens;
      const completionTokens =
        result.usage?.outputTokens ??
        Math.ceil(
          (result.text.length + toolCallChars(result.toolCalls)) /
            CHARS_PER_TOKEN,
        );
      const hasToolCalls = result.toolCalls.length > 0;
      return openAiJson({
        id: newCompletionId(),
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: model.id,
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: hasToolCalls && result.text === "" ? null : result.text,
              ...(hasToolCalls
                ? {
                    tool_calls: result.toolCalls.map((call) => ({
                      id: call.id,
                      type: "function" as const,
                      function: { name: call.name, arguments: call.arguments },
                    })),
                  }
                : {}),
            },
            finish_reason: hasToolCalls ? "tool_calls" : result.finishReason,
          },
        ],
        usage: {
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          total_tokens: promptTokens + completionTokens,
          credits_charged: credits,
        },
      });
    } catch (error) {
      const message = parseError(error).message;
      logger.error("[v1/chat/completions] Inference failed", {
        model: model.id,
        error: message,
      });
      return openAiError(
        502,
        t("openai.upstreamFailed", { error: message }),
        "server_error",
        "upstream_error",
      );
    }
  }

  /** Returns an error response when the call must not run, undefined to proceed. */
  private static async preflight(params: {
    user: JwtPrivatePayloadType;
    model: ChatModelOption;
    estimatedCost: number;
    ip: string | undefined;
    locale: CountryLanguage;
    logger: EndpointLogger;
    t: V1T;
  }): Promise<StreamingResponse | undefined> {
    const { user, model, estimatedCost, ip, locale, logger, t } = params;
    const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
    const validation = await creditValidator.validateUserCredits(
      user,
      model.id,
      estimatedCost,
      logger,
      creditsT,
      locale,
    );
    if (!validation.success) {
      // Fail closed: cannot read the balance -> do not run.
      return openAiError(
        503,
        t("openai.balanceCheckFailed"),
        "server_error",
        "balance_unavailable",
      );
    }
    if (!validation.data.canUseModel) {
      return openAiError(
        402,
        t("openai.insufficientCredits", {
          cost: estimatedCost,
          balance: validation.data.balance,
        }),
        "insufficient_quota",
        "insufficient_credits",
      );
    }
    const cap = await CreditRepository.gateFreeTierCap(
      user,
      ip,
      estimatedCost,
      model.id,
      logger,
      creditsT,
      locale,
    );
    if (!cap.success) {
      return openAiError(
        402,
        cap.message,
        "insufficient_quota",
        "free_tier_cap_reached",
      );
    }
    return undefined;
  }

  /** Charges real usage (estimate only if the provider reported none). Returns credits charged. */
  private static async bill(params: {
    user: JwtPrivatePayloadType;
    model: ChatModelOption;
    usage: InferenceUsage | undefined;
    estimatedInputTokens: number;
    outputChars: number;
    locale: CountryLanguage;
    logger: EndpointLogger;
  }): Promise<number> {
    const { user, model, usage, locale, logger } = params;
    const inputTokens = usage?.inputTokens ?? params.estimatedInputTokens;
    const outputTokens =
      usage?.outputTokens ?? Math.ceil(params.outputChars / CHARS_PER_TOKEN);
    const cost = calculateCreditCost(
      model,
      inputTokens,
      outputTokens,
      usage?.cachedInputTokens ?? 0,
    );
    const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
    const deducted = await CreditRepository.deductCreditsForModelUsage(
      user,
      cost,
      model.id,
      logger,
      creditsT,
      locale,
    );
    if (!deducted.success) {
      logger.error(
        "[v1/chat/completions] Credit deduction failed after generation",
        {
          userId: user.id,
          model: model.id,
          cost,
        },
      );
    }
    return cost;
  }

  private static streamResponse(params: {
    runner: InferenceRunner;
    inference: InferenceRequest;
    bill: (
      usage: InferenceUsage | undefined,
      outputChars: number,
    ) => Promise<number>;
    includeUsage: boolean;
    model: ChatModelOption;
    logger: EndpointLogger;
    estimatedInputTokens: number;
  }): StreamingResponse {
    const { runner, inference, bill, includeUsage, model, logger } = params;
    const id = newCompletionId();
    const created = Math.floor(Date.now() / 1000);
    const encoder = new TextEncoder();
    const abort = new AbortController();
    inference.abortSignal?.addEventListener("abort", () => abort.abort());
    const run: InferenceRequest = { ...inference, abortSignal: abort.signal };

    const chunk = (
      delta: {
        role?: "assistant";
        content?: string;
        tool_calls?: Array<{
          index: number;
          id?: string;
          type?: "function";
          function: { name?: string; arguments: string };
        }>;
      },
      finishReason: OpenAiFinishReason | null,
    ): string =>
      `data: ${JSON.stringify({
        id,
        object: "chat.completion.chunk",
        created,
        model: model.id,
        choices: [{ index: 0, delta, finish_reason: finishReason }],
      })}\n\n`;

    const body = new ReadableStream<Uint8Array>({
      async start(controller): Promise<void> {
        const send = (text: string): void => {
          try {
            controller.enqueue(encoder.encode(text));
          } catch {
            // client went away; the loop below stops via abort
          }
        };
        let outputChars = 0;
        let usage: InferenceUsage | undefined;
        let finishReason: OpenAiFinishReason = "stop";
        let failed: string | undefined;
        // OpenAI addresses streamed calls by their position, not their id.
        const callIndex = new Map<string, number>();
        send(chunk({ role: "assistant", content: "" }, null));
        try {
          for await (const event of runner.stream(run)) {
            if (event.type === "text") {
              outputChars += event.text.length;
              send(chunk({ content: event.text }, null));
            } else if (event.type === "tool-call-start") {
              const index = callIndex.size;
              callIndex.set(event.id, index);
              outputChars += event.name.length;
              send(
                chunk(
                  {
                    tool_calls: [
                      {
                        index,
                        id: event.id,
                        type: "function",
                        function: { name: event.name, arguments: "" },
                      },
                    ],
                  },
                  null,
                ),
              );
            } else if (event.type === "tool-call-delta") {
              const index = callIndex.get(event.id);
              if (index !== undefined) {
                outputChars += event.argumentsDelta.length;
                send(
                  chunk(
                    {
                      tool_calls: [
                        {
                          index,
                          function: { arguments: event.argumentsDelta },
                        },
                      ],
                    },
                    null,
                  ),
                );
              }
            } else if (event.type === "finish") {
              usage = event.usage;
              finishReason = event.finishReason;
            } else {
              failed = event.message;
            }
          }
        } catch (error) {
          failed = parseError(error).message;
        }
        // Bill what ran - even on provider error or client abort.
        const credits = await bill(usage, outputChars);
        if (failed !== undefined) {
          logger.error("[v1/chat/completions] Stream failed", {
            model: model.id,
            error: failed,
          });
          send(
            `data: ${JSON.stringify(openAiErrorBody(failed, "server_error", "upstream_error"))}\n\n`,
          );
        } else {
          send(chunk({}, callIndex.size > 0 ? "tool_calls" : finishReason));
          if (includeUsage) {
            const promptTokens =
              usage?.inputTokens ?? params.estimatedInputTokens;
            const completionTokens =
              usage?.outputTokens ?? Math.ceil(outputChars / CHARS_PER_TOKEN);
            send(
              `data: ${JSON.stringify({
                id,
                object: "chat.completion.chunk",
                created,
                model: model.id,
                choices: [],
                usage: {
                  prompt_tokens: promptTokens,
                  completion_tokens: completionTokens,
                  total_tokens: promptTokens + completionTokens,
                  credits_charged: credits,
                },
              })}\n\n`,
            );
          }
        }
        send("data: [DONE]\n\n");
        try {
          controller.close();
        } catch {
          // already closed by cancel
        }
      },
      cancel(): void {
        abort.abort();
      },
    });

    return createStreamingResponse(
      new Response(body, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      }),
    );
  }
}
