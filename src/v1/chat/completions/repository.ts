/**
 * POST /v1/chat/completions - OpenAI-compatible chat completions.
 *
 * Translation only: OpenAI messages/tools in, OpenAI JSON/SSE out. Identity,
 * model checks, credit pre-flight, inference and billing run through the
 * shared /v1 execution path (shared/execution.ts), the same one the responses
 * and messages formats use.
 */

import "server-only";

import type { AssistantContent, ModelMessage } from "ai";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { StreamingResponse } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import type { V1T } from "../../i18n";
import {
  CHARS_PER_TOKEN,
  TOKENS_PER_IMAGE,
  prepareV1Call,
  resolveV1Model,
  runV1Generate,
  runV1Stream,
  type V1StreamEncoder,
} from "../../shared/execution";
import { gateApiKeyRequest } from "../../shared/gate";
import { orderToolResults } from "../../shared/model-messages";
import {
  aiSdkRunner,
  type InferenceRunner,
  type InferenceTool,
  type InferenceToolChoice,
  type OpenAiFinishReason,
} from "../../shared/inference";
import {
  newCompletionId,
  openAiError,
  openAiErrorBody,
  openAiErrorResponse,
  openAiJson,
} from "../../shared/openai";
import type {
  OpenAiMessage,
  OpenAiToolChoice,
  V1ChatCompletionsPostRequestOutput,
} from "./definition";

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
    messages: orderToolResults(out),
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

function stopSequences(
  stop: string | string[] | undefined,
): string[] | undefined {
  if (stop === undefined) {
    return undefined;
  }
  return typeof stop === "string" ? [stop] : stop;
}

export class V1ChatCompletionsRepository {
  static async complete(params: CompleteParams): Promise<StreamingResponse> {
    const { data, user, locale, logger, request, t, toolExecutionContext } =
      params;
    const runner = params.runner ?? aiSdkRunner;

    // 1. Identity + per-key rate limit
    const gate = await gateApiKeyRequest(user, request, t, logger);
    if (!gate.ok) {
      return openAiErrorResponse(gate.error);
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

    // 3. Model: resolution against what THIS user may call
    const resolved = await resolveV1Model(data.model, payer, t);
    if (!resolved.ok) {
      return openAiErrorResponse(resolved.error);
    }

    // 4. Tools (client-defined: the model calls, the client runs) + pre-flight
    const tools: InferenceTool[] = (data.tools ?? []).map((spec) => ({
      name: spec.function.name,
      description: spec.function.description,
      parameters: spec.function.parameters,
    }));
    const prepared = await prepareV1Call({
      payer,
      model: resolved.model,
      messages: converted.messages,
      estimatedInputTokens:
        converted.estimatedInputTokens +
        Math.ceil(JSON.stringify(data.tools ?? []).length / CHARS_PER_TOKEN),
      tools,
      toolChoice: toolChoiceFor(data.tool_choice),
      temperature: data.temperature,
      topP: data.top_p,
      maxOutputTokens: data.max_completion_tokens ?? data.max_tokens,
      stopSequences: stopSequences(data.stop),
      request,
      locale,
      logger,
      t,
      toolExecutionContext,
      logTag: "v1/chat/completions",
    });
    if (!prepared.ok) {
      return openAiErrorResponse(prepared.error);
    }
    const { call } = prepared;

    if (data.stream === true) {
      return runV1Stream(
        call,
        runner,
        chatCompletionEncoder(
          call.model.id,
          data.stream_options?.include_usage === true,
        ),
      );
    }

    // 5. Non-streaming
    const run = await runV1Generate(call, runner, t);
    if (!run.ok) {
      return openAiErrorResponse(run.error);
    }
    const { result, totals } = run;
    const hasToolCalls = result.toolCalls.length > 0;
    const reasoning = result.parts
      .map((part) => (part.type === "reasoning" ? part.text : ""))
      .join("");
    return openAiJson({
      id: newCompletionId(),
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: call.model.id,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: hasToolCalls && result.text === "" ? null : result.text,
            ...(reasoning ? { reasoning_content: reasoning } : {}),
            ...(hasToolCalls
              ? {
                  tool_calls: result.toolCalls.map((tc) => ({
                    id: tc.id,
                    type: "function" as const,
                    function: { name: tc.name, arguments: tc.arguments },
                  })),
                }
              : {}),
          },
          finish_reason: hasToolCalls ? "tool_calls" : result.finishReason,
        },
      ],
      usage: {
        prompt_tokens: totals.inputTokens,
        completion_tokens: totals.outputTokens,
        total_tokens: totals.inputTokens + totals.outputTokens,
        credits_charged: totals.credits,
      },
    });
  }
}

/** OpenAI chat.completion.chunk SSE. Tool calls are addressed by position. */
function chatCompletionEncoder(
  modelId: string,
  includeUsage: boolean,
): V1StreamEncoder {
  const id = newCompletionId();
  const created = Math.floor(Date.now() / 1000);
  const callIndex = new Map<string, number>();
  const chunk = (
    delta: {
      role?: "assistant";
      content?: string;
      /** reasoning text, as DeepSeek/OpenRouter-style clients read it */
      reasoning_content?: string;
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
      model: modelId,
      choices: [{ index: 0, delta, finish_reason: finishReason }],
    })}\n\n`;
  return {
    start: () => chunk({ role: "assistant", content: "" }, null),
    event: (event) => {
      if (event.type === "text") {
        return chunk({ content: event.text }, null);
      }
      if (event.type === "reasoning") {
        return chunk({ reasoning_content: event.text }, null);
      }
      if (event.type === "tool-call-start") {
        const index = callIndex.size;
        callIndex.set(event.id, index);
        return chunk(
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
        );
      }
      if (event.type === "tool-call-delta") {
        const index = callIndex.get(event.id);
        return index === undefined
          ? ""
          : chunk(
              {
                tool_calls: [
                  { index, function: { arguments: event.argumentsDelta } },
                ],
              },
              null,
            );
      }
      return "";
    },
    finish: (finishReason, totals) => {
      let out = chunk({}, callIndex.size > 0 ? "tool_calls" : finishReason);
      if (includeUsage) {
        out += `data: ${JSON.stringify({
          id,
          object: "chat.completion.chunk",
          created,
          model: modelId,
          choices: [],
          usage: {
            prompt_tokens: totals.inputTokens,
            completion_tokens: totals.outputTokens,
            total_tokens: totals.inputTokens + totals.outputTokens,
            credits_charged: totals.credits,
          },
        })}\n\n`;
      }
      return `${out}data: [DONE]\n\n`;
    },
    fail: (message) =>
      `data: ${JSON.stringify(openAiErrorBody(message, "server_error", "upstream_error"))}\n\ndata: [DONE]\n\n`,
    heartbeat: () => ": keepalive\n\n",
  };
}
