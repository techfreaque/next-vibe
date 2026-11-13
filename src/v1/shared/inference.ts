/**
 * Inference runner for the /v1 surface. Wraps the SAME provider layer chat
 * uses (ProviderFactory + Vercel AI SDK) - no provider call is reimplemented.
 * The interface exists so tests can run the full billing/route path without
 * burning real credits.
 */

import "server-only";

import type { LanguageModel, ModelMessage, ProviderMetadata } from "ai";
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
  /** Part of outputTokens spent on reasoning (0 when unknown). */
  reasoningTokens: number;
}

/**
 * Provider replay data of a reasoning block (signatures, encrypted reasoning).
 * Handed back to the client opaquely and restored as the reasoning part's
 * providerOptions on the next turn.
 */
export type ReasoningReplay = ProviderMetadata;

/** One piece of the model's answer, in the order the model produced it. */
export type InferenceOutputPart =
  | { type: "text"; text: string }
  | { type: "reasoning"; text: string; replay: ReasoningReplay | undefined }
  | ({ type: "tool-call" } & InferenceToolCall);

export type OpenAiFinishReason =
  | "stop"
  | "length"
  | "content_filter"
  | "tool_calls";

export interface InferenceResult {
  text: string;
  toolCalls: InferenceToolCall[];
  /** text, reasoning and tool calls in output order */
  parts: InferenceOutputPart[];
  finishReason: OpenAiFinishReason;
  /** undefined when the provider reported no usage (billing falls back to an estimate). */
  usage: InferenceUsage | undefined;
}

export type InferenceStreamEvent =
  | { type: "text"; text: string }
  | { type: "reasoning"; text: string }
  /** closes the current reasoning block; replay = its provider metadata */
  | { type: "reasoning-end"; replay: ReasoningReplay | undefined }
  | { type: "tool-call-start"; id: string; name: string }
  | { type: "tool-call-delta"; id: string; argumentsDelta: string }
  /** the call's arguments are complete */
  | { type: "tool-call-end"; id: string }
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
  outputTokenDetails?: { reasoningTokens?: number | undefined } | undefined;
}

function mapUsage(usage: RawUsage): InferenceUsage | undefined {
  if (usage.inputTokens === undefined && usage.outputTokens === undefined) {
    return undefined;
  }
  return {
    inputTokens: usage.inputTokens ?? 0,
    outputTokens: usage.outputTokens ?? 0,
    cachedInputTokens: usage.inputTokenDetails?.cacheReadTokens ?? 0,
    reasoningTokens: usage.outputTokenDetails?.reasoningTokens ?? 0,
  };
}

/** Merges per-delta provider metadata of one reasoning block (later wins per key). */
function mergeReplay(
  into: ReasoningReplay | undefined,
  next: ProviderMetadata | undefined,
): ReasoningReplay | undefined {
  if (!next) {
    return into;
  }
  const merged: ReasoningReplay = { ...into };
  for (const [provider, values] of Object.entries(next)) {
    merged[provider] = { ...merged[provider], ...values };
  }
  return merged;
}

export type JsonValue = z.infer<ReturnType<typeof z.json>>;

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
    const parts: InferenceOutputPart[] = [];
    for (const part of result.content) {
      if (part.type === "text" && part.text !== "") {
        parts.push({ type: "text", text: part.text });
      } else if (part.type === "reasoning") {
        parts.push({
          type: "reasoning",
          text: part.text,
          replay: part.providerMetadata,
        });
      } else if (part.type === "tool-call") {
        parts.push({
          type: "tool-call",
          id: part.toolCallId,
          name: part.toolName,
          arguments: JSON.stringify(part.input ?? {}),
        });
      }
    }
    return {
      text: result.text,
      toolCalls: result.toolCalls.map((call) => ({
        id: call.toolCallId,
        name: call.toolName,
        arguments: JSON.stringify(call.input ?? {}),
      })),
      parts,
      finishReason: mapFinishReason(result.finishReason),
      usage: mapUsage(result.usage),
    };
  },

  async *stream(request) {
    const result = streamText(buildCall(request));
    // Providers differ: some stream argument deltas, some only emit the final call.
    const streamedCalls = new Set<string>();
    let replay: ReasoningReplay | undefined;
    let inReasoning = false;
    for await (const part of result.fullStream) {
      if (part.type === "text-delta") {
        yield { type: "text", text: part.text };
      } else if (part.type === "reasoning-start") {
        inReasoning = true;
        replay = mergeReplay(undefined, part.providerMetadata);
      } else if (part.type === "reasoning-delta") {
        replay = mergeReplay(replay, part.providerMetadata);
        if (part.text !== "") {
          yield { type: "reasoning", text: part.text };
        }
      } else if (part.type === "reasoning-end") {
        if (inReasoning) {
          inReasoning = false;
          yield {
            type: "reasoning-end",
            replay: mergeReplay(replay, part.providerMetadata),
          };
          replay = undefined;
        }
      } else if (part.type === "tool-input-start") {
        streamedCalls.add(part.id);
        yield { type: "tool-call-start", id: part.id, name: part.toolName };
      } else if (part.type === "tool-input-delta") {
        yield {
          type: "tool-call-delta",
          id: part.id,
          argumentsDelta: part.delta,
        };
      } else if (part.type === "tool-input-end") {
        yield { type: "tool-call-end", id: part.id };
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
            argumentsDelta: JSON.stringify(part.input ?? {}),
          };
          yield { type: "tool-call-end", id: part.toolCallId };
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
