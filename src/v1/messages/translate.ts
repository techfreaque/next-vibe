/**
 * Anthropic Messages API <-> shared /v1 execution. Pure translation, no I/O:
 * request -> model messages + tools, result -> Message object, neutral stream
 * events -> Anthropic SSE (the event sequence Claude Code consumes).
 */

import type { ModelMessage } from "ai";

import type {
  V1ContentEvent,
  V1StreamEncoder,
  V1Totals,
} from "../shared/execution";
import { estimateTokens } from "../shared/tokens";
import type {
  InferenceOutputPart,
  InferenceTool,
  InferenceToolChoice,
  JsonValue,
  OpenAiFinishReason,
  ReasoningReplay,
} from "../shared/inference";
import {
  type AssistantPart,
  imagePartFromUrl,
  orderToolResults,
  parseArgumentsLenient,
  pushAssistantPart,
  pushSystemText,
  pushToolResult,
  pushUserParts,
  reasoningPart,
  safeToolCallId,
  toolOutput,
  type UserPart,
} from "../shared/model-messages";
import {
  decodeReasoningReplay,
  encodeReasoningReplay,
} from "../shared/reasoning-replay";
import type {
  AnthropicContentBlock,
  AnthropicMessage,
  AnthropicSystem,
  AnthropicTool,
  AnthropicToolChoice,
} from "./schema";

export interface AnthropicRequestParts {
  system?: AnthropicSystem | null;
  messages: AnthropicMessage[];
  tools?: AnthropicTool[] | null;
}

/** Tool names a tool search result loaded (tool_reference blocks in history). */
export function referencedToolNames(
  messages: AnthropicMessage[],
): Set<string> {
  const names = new Set<string>();
  for (const message of messages) {
    if (typeof message.content === "string") {
      continue;
    }
    for (const block of message.content) {
      if (block.type !== "tool_result" || !("tool_use_id" in block)) {
        continue;
      }
      if (typeof block.content === "string" || !block.content) {
        continue;
      }
      for (const inner of block.content) {
        if ("tool_name" in inner) {
          names.add(inner.tool_name);
        }
      }
    }
  }
  return names;
}

/**
 * Client tools only; server tools (web_search_*, ...) are skipped. Deferred
 * tools (defer_loading) stay hidden from the model until a tool search result
 * in the history references them, as on the Anthropic API.
 */
export function convertAnthropicTools(
  tools: AnthropicTool[] | null | undefined,
  referenced: Set<string> = new Set(),
): InferenceTool[] {
  const out: InferenceTool[] = [];
  for (const spec of tools ?? []) {
    if ("input_schema" in spec && (!spec.type || spec.type === "custom")) {
      if (spec.defer_loading === true && !referenced.has(spec.name)) {
        continue;
      }
      out.push({
        name: spec.name,
        description: spec.description ?? undefined,
        parameters: spec.input_schema,
      });
    }
  }
  return out;
}

export function convertAnthropicToolChoice(
  choice: AnthropicToolChoice | null | undefined,
): InferenceToolChoice | undefined {
  if (!choice) {
    return undefined;
  }
  if (choice.type === "any") {
    return "required";
  }
  if (choice.type === "none") {
    return "none";
  }
  if (choice.type === "tool" && choice.name) {
    return { toolName: choice.name };
  }
  return "auto";
}

function systemText(system: AnthropicSystem | null | undefined): string {
  if (!system) {
    return "";
  }
  if (typeof system === "string") {
    return system;
  }
  return system
    .map((block) => ("text" in block ? block.text : ""))
    .filter(Boolean)
    .join("\n\n");
}

function imageUrlOf(block: AnthropicContentBlock): string | undefined {
  if (block.type !== "image" || !("source" in block)) {
    return undefined;
  }
  const source = block.source;
  if ("data" in source && "media_type" in source) {
    return `data:${source.media_type};base64,${source.data}`;
  }
  if ("url" in source) {
    return source.url;
  }
  return undefined;
}

/** Replay data of a thinking block's signature: ours, or a real Anthropic one. */
function replayFromSignature(
  signature: string | null | undefined,
): ReasoningReplay | undefined {
  if (!signature) {
    return undefined;
  }
  const decoded = decodeReasoningReplay(signature);
  if (decoded) {
    return decoded.replay;
  }
  return { anthropic: { signature } };
}

export type ConvertedMessages =
  | { ok: true; messages: ModelMessage[]; estimatedInputTokens: number }
  | { ok: false; param: string };

/** system + messages (+ tool definitions for the estimate) -> model messages. */
export function convertAnthropicMessages(
  data: AnthropicRequestParts,
): ConvertedMessages {
  const out: ModelMessage[] = [];
  const toolNames = new Map<string, string>();
  let chars = JSON.stringify(data.tools ?? []).length;
  let images = 0;

  const system = systemText(data.system);
  chars += system.length;
  pushSystemText(out, system);

  for (const [index, message] of data.messages.entries()) {
    const blocks: AnthropicContentBlock[] =
      typeof message.content === "string"
        ? [{ type: "text", text: message.content }]
        : message.content;

    if (message.role === "system") {
      const text = blocks
        .map((block) => ("text" in block ? block.text : ""))
        .filter(Boolean)
        .join("\n\n");
      chars += text.length;
      pushSystemText(out, text);
      continue;
    }

    if (message.role === "assistant") {
      for (const block of blocks) {
        let part: AssistantPart | undefined;
        if (block.type === "text" && "text" in block) {
          chars += block.text.length;
          part = block.text ? { type: "text", text: block.text } : undefined;
        } else if (block.type === "tool_use" && "input" in block) {
          const id = safeToolCallId(block.id);
          toolNames.set(id, block.name);
          chars += block.name.length + JSON.stringify(block.input).length;
          part = {
            type: "tool-call",
            toolCallId: id,
            toolName: block.name,
            input: block.input,
          };
        } else if (block.type === "thinking" && "thinking" in block) {
          // display: "omitted" turns arrive with empty text; ours is in the signature
          const text =
            block.thinking ||
            decodeReasoningReplay(block.signature)?.text ||
            "";
          chars += text.length;
          part = reasoningPart(text, replayFromSignature(block.signature));
        } else if (block.type === "redacted_thinking" && "data" in block) {
          part = reasoningPart("", { anthropic: { redactedData: block.data } });
        }
        if (part) {
          pushAssistantPart(out, part);
        }
      }
      continue;
    }

    // user: tool results first (providers need them right after the calls),
    // then the rest of the turn.
    for (const block of blocks) {
      if (block.type !== "tool_result" || !("tool_use_id" in block)) {
        continue;
      }
      const id = safeToolCallId(block.tool_use_id);
      const pieces: Array<{ text: string } | { imageUrl: string }> = [];
      if (typeof block.content === "string") {
        pieces.push({ text: block.content });
      } else {
        for (const inner of block.content ?? []) {
          if (inner.type === "text" && "text" in inner) {
            pieces.push({ text: inner.text });
          } else if ("tool_name" in inner) {
            pieces.push({ text: `Tool loaded: ${inner.tool_name}` });
          } else {
            const url = imageUrlOf(inner);
            if (url) {
              images += 1;
              pieces.push({ imageUrl: url });
            }
          }
        }
      }
      for (const piece of pieces) {
        chars += "text" in piece ? piece.text.length : 0;
      }
      pushToolResult(out, {
        type: "tool-result",
        toolCallId: id,
        toolName: toolNames.get(id) ?? "tool",
        output: toolOutput(pieces, block.is_error === true),
      });
    }

    const userParts: UserPart[] = [];
    for (const block of blocks) {
      if (block.type === "text" && "text" in block) {
        chars += block.text.length;
        if (block.text) {
          userParts.push({ type: "text", text: block.text });
        }
      } else if (block.type === "image") {
        const url = imageUrlOf(block);
        const image = url ? imagePartFromUrl(url) : undefined;
        if (!image) {
          return { ok: false, param: `messages[${index}].content` };
        }
        images += 1;
        userParts.push(image);
      } else if (block.type === "document" && "source" in block) {
        const source = block.source;
        if ("data" in source && "media_type" in source) {
          images += 1;
          userParts.push({
            type: "file",
            data: { type: "data", data: source.data },
            mediaType: source.media_type,
            ...(block.title ? { filename: block.title } : {}),
          });
        } else if ("data" in source) {
          chars += source.data.length;
          userParts.push({
            type: "text",
            text: block.title
              ? `${block.title}\n\n${source.data}`
              : source.data,
          });
        } else if ("url" in source && URL.canParse(source.url)) {
          userParts.push({
            type: "file",
            data: { type: "url", url: new URL(source.url) },
            mediaType: "application/pdf",
          });
        }
      }
    }
    pushUserParts(out, userParts);
  }

  return {
    ok: true,
    messages: orderToolResults(out),
    estimatedInputTokens: estimateTokens(chars, images),
  };
}

// ---------------------------------------------------------------- output

export function newMessageId(): string {
  return `msg_${crypto.randomUUID().replaceAll("-", "")}`;
}

// eslint-disable-next-line typescript/consistent-type-definitions, @typescript-eslint/consistent-type-definitions -- Must be a type alias: only aliases get the implicit index signature that makes it assignable to WidgetData.
export type AnthropicJson = {
  [key: string]: JsonValue;
};

export type AnthropicStopReason =
  | "end_turn"
  | "max_tokens"
  | "tool_use"
  | "refusal";

export function stopReasonFor(
  finishReason: OpenAiFinishReason,
  hasToolCalls: boolean,
): AnthropicStopReason {
  if (hasToolCalls) {
    return "tool_use";
  }
  if (finishReason === "length") {
    return "max_tokens";
  }
  if (finishReason === "content_filter") {
    return "refusal";
  }
  return "end_turn";
}

export function anthropicUsage(totals: V1Totals): AnthropicJson {
  return {
    input_tokens: Math.max(0, totals.inputTokens - totals.cachedInputTokens),
    output_tokens: totals.outputTokens,
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: totals.cachedInputTokens,
    credits_charged: totals.credits,
  };
}

/** tool_use input must be an object; anything else becomes {}. */
function toolInput(args: string): JsonValue {
  const parsed = parseArgumentsLenient(args);
  return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
    ? parsed
    : {};
}

/**
 * omitThinking (thinking.display = "omitted"): thinking blocks carry no text;
 * the text travels inside the signature so the next turn can replay it.
 */
export function contentBlocksFromParts(
  parts: InferenceOutputPart[],
  omitThinking = false,
): AnthropicJson[] {
  const blocks: AnthropicJson[] = [];
  for (const part of parts) {
    if (part.type === "text") {
      blocks.push({ type: "text", text: part.text });
    } else if (part.type === "reasoning") {
      blocks.push({
        type: "thinking",
        thinking: omitThinking ? "" : part.text,
        signature: encodeReasoningReplay(
          omitThinking ? part.text : undefined,
          part.replay,
        ),
      });
    } else {
      blocks.push({
        type: "tool_use",
        id: safeToolCallId(part.id),
        name: part.name,
        input: toolInput(part.arguments),
      });
    }
  }
  return blocks;
}

export function messageObject(
  id: string,
  model: string,
  content: AnthropicJson[],
  stopReason: AnthropicStopReason | null,
  usage: AnthropicJson,
): AnthropicJson {
  return {
    id,
    type: "message",
    role: "assistant",
    model,
    content,
    stop_reason: stopReason,
    stop_sequence: null,
    usage,
  };
}

function emit(type: string, payload: AnthropicJson): string {
  return `event: ${type}\ndata: ${JSON.stringify({ type, ...payload })}\n\n`;
}

interface PendingCall {
  id: string;
  name: string;
  args: string;
}

/**
 * Anthropic SSE: message_start, ping, per block content_block_start / deltas /
 * content_block_stop (one block open at a time), message_delta (stop_reason +
 * usage), message_stop. Tool calls are buffered and sent as one complete block
 * each, so parallel calls from any provider never interleave.
 */
export function anthropicStreamEncoder(
  model: string,
  estimatedInputTokens: number,
  omitThinking = false,
): V1StreamEncoder {
  const id = newMessageId();
  let nextIndex = 0;
  let open: { kind: "text" | "thinking"; index: number } | undefined;
  /** thinking text of the open block, kept for the signature when omitted */
  let thinkingText = "";
  const pending = new Map<string, PendingCall>();
  let toolCalls = 0;

  const closeOpen = (replay?: ReasoningReplay): string => {
    if (!open) {
      return "";
    }
    const block = open;
    open = undefined;
    const signature =
      block.kind === "thinking"
        ? emit("content_block_delta", {
            index: block.index,
            delta: {
              type: "signature_delta",
              signature: encodeReasoningReplay(
                omitThinking ? thinkingText : undefined,
                replay,
              ),
            },
          })
        : "";
    return signature + emit("content_block_stop", { index: block.index });
  };

  const openBlock = (kind: "text" | "thinking"): string => {
    const index = nextIndex++;
    open = { kind, index };
    thinkingText = "";
    return emit("content_block_start", {
      index,
      content_block:
        kind === "text"
          ? { type: "text", text: "" }
          : { type: "thinking", thinking: "", signature: "" },
    });
  };

  const flushCall = (call: PendingCall): string => {
    pending.delete(call.id);
    toolCalls += 1;
    const index = nextIndex++;
    const input = JSON.stringify(toolInput(call.args));
    return (
      emit("content_block_start", {
        index,
        content_block: {
          type: "tool_use",
          id: safeToolCallId(call.id),
          name: call.name,
          input: {},
        },
      }) +
      emit("content_block_delta", {
        index,
        delta: { type: "input_json_delta", partial_json: input },
      }) +
      emit("content_block_stop", { index })
    );
  };

  const closeAll = (): string => {
    let out = closeOpen();
    for (const call of pending.values()) {
      out += flushCall(call);
    }
    return out;
  };

  const handle = (event: V1ContentEvent): string => {
    if (event.type === "text" || event.type === "reasoning") {
      const kind = event.type === "text" ? "text" : "thinking";
      let out = "";
      if (open?.kind !== kind) {
        out += closeOpen() + openBlock(kind);
      }
      const block = open;
      if (kind === "thinking" && omitThinking) {
        thinkingText += event.text;
        return out;
      }
      return (
        out +
        emit("content_block_delta", {
          index: block?.index ?? 0,
          delta:
            kind === "text"
              ? { type: "text_delta", text: event.text }
              : { type: "thinking_delta", thinking: event.text },
        })
      );
    }
    if (event.type === "reasoning-end") {
      return open?.kind === "thinking" ? closeOpen(event.replay) : "";
    }
    if (event.type === "tool-call-start") {
      pending.set(event.id, { id: event.id, name: event.name, args: "" });
      return "";
    }
    if (event.type === "tool-call-delta") {
      const call = pending.get(event.id);
      if (call) {
        call.args += event.argumentsDelta;
      }
      return "";
    }
    const call = pending.get(event.id);
    return call ? closeOpen() + flushCall(call) : "";
  };

  return {
    start: () =>
      emit("message_start", {
        message: messageObject(id, model, [], null, {
          input_tokens: estimatedInputTokens,
          output_tokens: 1,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 0,
        }),
      }) + emit("ping", {}),
    event: handle,
    finish: (finishReason, totals) => {
      const out = closeAll();
      return (
        out +
        emit("message_delta", {
          delta: {
            stop_reason: stopReasonFor(finishReason, toolCalls > 0),
            stop_sequence: null,
          },
          usage: anthropicUsage(totals),
        }) +
        emit("message_stop", {})
      );
    },
    fail: (message) =>
      closeAll() + emit("error", { error: { type: "api_error", message } }),
    heartbeat: () => emit("ping", {}),
  };
}
