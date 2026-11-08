/**
 * Inference runner for the /v1 surface. Wraps the SAME provider layer chat
 * uses (ProviderFactory + Vercel AI SDK) - no provider call is reimplemented.
 * The interface exists so tests can run the full billing/route path without
 * burning real credits.
 */

import "server-only";

import type { LanguageModel, ModelMessage } from "ai";
import {
  generateText,
  jsonSchema,
  streamText,
  tool,
  type JSONSchema7,
  type ToolChoice,
  type ToolSet,
} from "ai";
import type { ChatModelOption } from "next-vibe/agent/ai-stream/models";
import { ProviderFactory } from "next-vibe/agent/ai-stream/repository/core/infra";
import { createFixtureDownload } from "next-vibe/agent/shared/fixture-download";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { z } from "zod";

/** A client-defined function tool: the model may call it, the CLIENT runs it. */
export interface InferenceTool {
  name: string;
  description: string | undefined;
  /** JSON Schema of the arguments; undefined = no arguments. */
  parameters: Record<string, JsonValue> | undefined;
}

export type InferenceToolChoice =
  | "auto"
  | "none"
  | "required"
  | { toolName: string };

export interface InferenceToolCall {
  id: string;
  name: string;
  /** JSON-encoded arguments, as OpenAI returns them. */
  arguments: string;
}

export interface InferenceRequest {
  model: ChatModelOption;
  messages: ModelMessage[];
  temperature: number | undefined;
  topP: number | undefined;
  maxOutputTokens: number | undefined;
  stopSequences: string[] | undefined;
  abortSignal: AbortSignal | undefined;
  tools: InferenceTool[] | undefined;
  toolChoice: InferenceToolChoice | undefined;
  logger: EndpointLogger;
  toolExecutionContext: ToolExecutionContext;
}

export interface InferenceUsage {
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
}

export type OpenAiFinishReason =
  | "stop"
  | "length"
  | "content_filter"
  | "tool_calls";

export interface InferenceResult {
  text: string;
  toolCalls: InferenceToolCall[];
  finishReason: OpenAiFinishReason;
  /** undefined when the provider reported no usage (billing falls back to an estimate). */
  usage: InferenceUsage | undefined;
}

export type InferenceStreamEvent =
  | { type: "text"; text: string }
  | { type: "tool-call-start"; id: string; name: string }
  | { type: "tool-call-delta"; id: string; argumentsDelta: string }
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
  if (reason === "tool-calls") {
    return "tool_calls";
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

type JsonValue = z.infer<ReturnType<typeof z.json>>;

const EMPTY_PARAMETERS: JSONSchema7 = { type: "object", properties: {} };

/** Declared WITHOUT execute: the model's call ends the turn and goes back to the client. */
function buildToolSet(tools: InferenceTool[]): ToolSet {
  const set: ToolSet = {};
  for (const spec of tools) {
    set[spec.name] = tool({
      ...(spec.description ? { description: spec.description } : {}),
      inputSchema: jsonSchema(
        // Client-supplied JSON Schema; providers validate it themselves.
        spec.parameters ? (spec.parameters as JSONSchema7) : EMPTY_PARAMETERS,
      ),
    });
  }
  return set;
}

function mapToolChoice(
  choice: InferenceToolChoice | undefined,
): ToolChoice<ToolSet> | undefined {
  if (choice === undefined) {
    return undefined;
  }
  if (typeof choice === "string") {
    return choice;
  }
  return { type: "tool", toolName: choice.toolName };
}

function buildCall(request: InferenceRequest): {
  model: LanguageModel;
  messages: ModelMessage[];
  allowSystemInMessages: true;
  experimental_download: ReturnType<typeof createFixtureDownload>;
  abortSignal: AbortSignal | undefined;
  tools?: ToolSet;
  toolChoice?: ToolChoice<ToolSet>;
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
    ...(request.tools && request.tools.length > 0
      ? {
          tools: buildToolSet(request.tools),
          ...(request.toolChoice === undefined
            ? {}
            : { toolChoice: mapToolChoice(request.toolChoice) }),
        }
      : {}),
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
      toolCalls: result.toolCalls.map((call) => ({
        id: call.toolCallId,
        name: call.toolName,
        arguments: JSON.stringify(call.input),
      })),
      finishReason: mapFinishReason(result.finishReason),
      usage: mapUsage(result.usage),
    };
  },

  async *stream(request) {
    const result = streamText(buildCall(request));
    // Providers differ: some stream argument deltas, some only emit the final call.
    const streamedCalls = new Set<string>();
    for await (const part of result.fullStream) {
      if (part.type === "text-delta") {
        yield { type: "text", text: part.text };
      } else if (part.type === "tool-input-start") {
        streamedCalls.add(part.id);
        yield { type: "tool-call-start", id: part.id, name: part.toolName };
      } else if (part.type === "tool-input-delta") {
        yield {
          type: "tool-call-delta",
          id: part.id,
          argumentsDelta: part.delta,
        };
      } else if (part.type === "tool-call") {
        if (!streamedCalls.has(part.toolCallId)) {
          yield {
            type: "tool-call-start",
            id: part.toolCallId,
            name: part.toolName,
          };
          yield {
            type: "tool-call-delta",
            id: part.toolCallId,
            argumentsDelta: JSON.stringify(part.input),
          };
        }
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
