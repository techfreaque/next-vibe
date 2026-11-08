/**
 * Inference runner for the /v1 surface. Wraps the SAME provider layer chat
 * uses (ProviderFactory + Vercel AI SDK) - no provider call is reimplemented.
 * The interface exists so tests can run the full billing/route path without
 * burning real credits.
 */

import "server-only";

import type { LanguageModel, ModelMessage } from "ai";
import { generateText, streamText } from "ai";
import type { ChatModelOption } from "next-vibe/agent/ai-stream/models";
import { ProviderFactory } from "next-vibe/agent/ai-stream/repository/core/infra";
import { createFixtureDownload } from "next-vibe/agent/shared/fixture-download";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { EndpointLogger } from "next-vibe/logger/types";

export interface InferenceRequest {
  model: ChatModelOption;
  messages: ModelMessage[];
  temperature: number | undefined;
  topP: number | undefined;
  maxOutputTokens: number | undefined;
  stopSequences: string[] | undefined;
  abortSignal: AbortSignal | undefined;
  logger: EndpointLogger;
  toolExecutionContext: ToolExecutionContext;
}

export interface InferenceUsage {
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
}

export type OpenAiFinishReason = "stop" | "length" | "content_filter";

export interface InferenceResult {
  text: string;
  finishReason: OpenAiFinishReason;
  /** undefined when the provider reported no usage (billing falls back to an estimate). */
  usage: InferenceUsage | undefined;
}

export type InferenceStreamEvent =
  | { type: "text"; text: string }
  | { type: "error"; message: string }
  | {
      type: "finish";
      finishReason: OpenAiFinishReason;
      usage: InferenceUsage | undefined;
    };

export interface InferenceRunner {
  generate(request: InferenceRequest): Promise<InferenceResult>;
  stream(request: InferenceRequest): AsyncIterable<InferenceStreamEvent>;
}

function mapFinishReason(reason: string): OpenAiFinishReason {
  if (reason === "length") {
    return "length";
  }
  if (reason === "content-filter") {
    return "content_filter";
  }
  return "stop";
}

interface RawUsage {
  inputTokens: number | undefined;
  outputTokens: number | undefined;
  inputTokenDetails?: { cacheReadTokens?: number | undefined } | undefined;
}

function mapUsage(usage: RawUsage): InferenceUsage | undefined {
  if (usage.inputTokens === undefined && usage.outputTokens === undefined) {
    return undefined;
  }
  return {
    inputTokens: usage.inputTokens ?? 0,
    outputTokens: usage.outputTokens ?? 0,
    cachedInputTokens: usage.inputTokenDetails?.cacheReadTokens ?? 0,
  };
}

function buildCall(request: InferenceRequest): {
  model: LanguageModel;
  messages: ModelMessage[];
  allowSystemInMessages: true;
  experimental_download: ReturnType<typeof createFixtureDownload>;
  abortSignal: AbortSignal | undefined;
  temperature?: number;
  topP?: number;
  maxOutputTokens?: number;
  stopSequences?: string[];
} {
  const provider = ProviderFactory.getProviderForModel(
    request.model,
    request.logger,
    request.toolExecutionContext,
  );
  const supportsTemperature =
    request.model.features.supportsTemperature !== false;
  return {
    model: provider.chat(request.model.providerModel) as LanguageModel,
    messages: request.messages,
    allowSystemInMessages: true,
    experimental_download: createFixtureDownload(
      request.toolExecutionContext,
      request.logger,
    ),
    abortSignal: request.abortSignal,
    ...(supportsTemperature && request.temperature !== undefined
      ? { temperature: request.temperature }
      : {}),
    ...(request.topP !== undefined ? { topP: request.topP } : {}),
    ...(request.maxOutputTokens !== undefined
      ? { maxOutputTokens: request.maxOutputTokens }
      : {}),
    ...(request.stopSequences ? { stopSequences: request.stopSequences } : {}),
  };
}

export const aiSdkRunner: InferenceRunner = {
  async generate(request) {
    const result = await generateText(buildCall(request));
    return {
      text: result.text,
      finishReason: mapFinishReason(result.finishReason),
      usage: mapUsage(result.usage),
    };
  },

  async *stream(request) {
    const result = streamText(buildCall(request));
    for await (const part of result.fullStream) {
      if (part.type === "text-delta") {
        yield { type: "text", text: part.text };
      } else if (part.type === "error") {
        // Surface provider errors to the caller (becomes an SSE error + billing of what ran).
        yield {
          type: "error",
          message:
            part.error instanceof Error
              ? part.error.message
              : String(part.error),
        };
        return;
      } else if (part.type === "finish") {
        yield {
          type: "finish",
          finishReason: mapFinishReason(part.finishReason),
          usage: mapUsage(part.totalUsage),
        };
      }
    }
  },
};
