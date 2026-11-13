/**
 * Builders shared by the /v1 request translators: assemble AI SDK model
 * messages from a flat item list (Responses input items, Anthropic content
 * blocks) the way providers expect them - consecutive assistant pieces in one
 * assistant message, consecutive tool results in one tool message.
 */

import type {
  AssistantContent,
  ModelMessage,
  ToolContent,
  UserContent,
} from "ai";
import { z } from "zod";

import type { JsonValue, ReasoningReplay } from "./inference";

export type AssistantPart = Exclude<AssistantContent, string>[number];
export type ToolResultPart = ToolContent[number];
export type UserPart = Exclude<UserContent, string>[number];
export type ToolResultOutput = Extract<
  ToolResultPart,
  { type: "tool-result" }
>["output"];

const jsonSchema = z.json();

/**
 * Tool-call arguments as the model produced them. Invalid JSON is passed on
 * as the raw string rather than failing the whole conversation: the model
 * emitted it, the client already ran (or rejected) it, history must replay.
 */
export function parseArgumentsLenient(raw: string): JsonValue {
  if (raw.trim() === "") {
    return {};
  }
  try {
    const parsed = jsonSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : raw;
  } catch {
    return raw;
  }
}

export function pushAssistantPart(
  out: ModelMessage[],
  part: AssistantPart,
): void {
  const last = out.at(-1);
  if (last?.role === "assistant" && Array.isArray(last.content)) {
    last.content.push(part);
    return;
  }
  if (last?.role === "assistant" && typeof last.content === "string") {
    last.content = [
      ...(last.content ? [{ type: "text" as const, text: last.content }] : []),
      part,
    ];
    return;
  }
  out.push({ role: "assistant", content: [part] });
}

export function pushToolResult(
  out: ModelMessage[],
  part: ToolResultPart,
): void {
  const last = out.at(-1);
  if (last?.role === "tool") {
    last.content.push(part);
    return;
  }
  out.push({ role: "tool", content: [part] });
}

export function pushUserParts(out: ModelMessage[], parts: UserPart[]): void {
  if (parts.length === 0) {
    return;
  }
  const last = out.at(-1);
  if (last?.role === "user" && Array.isArray(last.content)) {
    last.content.push(...parts);
    return;
  }
  out.push({ role: "user", content: parts });
}

/**
 * System text. Providers like Anthropic only accept system content before the
 * conversation starts, so instructions that arrive mid-conversation (Codex
 * developer messages after a model switch) go in as a user turn.
 */
export function pushSystemText(out: ModelMessage[], text: string): void {
  if (text === "") {
    return;
  }
  if (out.every((m) => m.role === "system")) {
    out.push({ role: "system", content: text });
    return;
  }
  pushUserParts(out, [{ type: "text", text }]);
}

export function reasoningPart(
  text: string,
  replay: ReasoningReplay | undefined,
): AssistantPart {
  return {
    type: "reasoning",
    text,
    ...(replay ? { providerOptions: replay } : {}),
  };
}

/** http(s) or data: image URL -> user image part; undefined when unusable. */
export function imagePartFromUrl(url: string): UserPart | undefined {
  if (url.startsWith("data:")) {
    return { type: "image", image: url };
  }
  if (URL.canParse(url) && /^https?:/.test(url)) {
    return { type: "image", image: new URL(url) };
  }
  return undefined;
}

/** Splits a data: URL into media type + base64 payload. */
export function splitDataUrl(
  url: string,
): { mediaType: string; data: string } | undefined {
  const match = /^data:([^;,]+)(?:;[^,]*)?;base64,([\s\S]*)$/.exec(url);
  return match?.[1] && match[2] !== undefined
    ? { mediaType: match[1], data: match[2] }
    : undefined;
}

/** Tool output built from text pieces + images (Responses / Anthropic results). */
export function toolOutput(
  pieces: Array<{ text: string } | { imageUrl: string }>,
  isError: boolean,
): ToolResultOutput {
  const hasImage = pieces.some((p) => "imageUrl" in p);
  if (!hasImage) {
    const text = pieces.map((p) => ("text" in p ? p.text : "")).join("");
    return isError
      ? { type: "error-text", value: text }
      : { type: "text", value: text };
  }
  const value: Extract<ToolResultOutput, { type: "content" }>["value"] = [];
  for (const piece of pieces) {
    if ("text" in piece) {
      value.push({ type: "text", text: piece.text });
      continue;
    }
    const data = splitDataUrl(piece.imageUrl);
    if (data) {
      value.push({
        type: "file",
        data: { type: "data", data: data.data },
        mediaType: data.mediaType,
      });
    } else if (URL.canParse(piece.imageUrl)) {
      value.push({
        type: "file",
        data: { type: "url", url: new URL(piece.imageUrl) },
        mediaType: "image",
      });
    }
  }
  return { type: "content", value };
}

/** Tool ids some providers reject (".", ":") are normalized consistently. */
export function safeToolCallId(id: string): string {
  return /^[a-zA-Z0-9_-]+$/.test(id)
    ? id
    : id.replaceAll(/[^a-zA-Z0-9_-]/g, "_");
}

/** Model-facing stand-in when a client sent a tool call without its result. */
export const MISSING_TOOL_RESULT_TEXT =
  "No result: the client sent no output for this tool call (cancelled or interrupted).";

/**
 * Providers require every tool call to be answered by its result directly
 * after the assistant turn. Clients do not always send history that way:
 * Codex inserts user notes between a call and its output, interrupted calls
 * have no output, results can outlive their call after compaction. This pass
 * moves user/system turns that arrive while calls are open to after the
 * results, answers calls that never got a result, and drops results whose
 * call is not in the history.
 */
export function orderToolResults(messages: ModelMessage[]): ModelMessage[] {
  const out: ModelMessage[] = [];
  const pending = new Map<string, string>();
  let deferred: ModelMessage[] = [];

  const answerPending = (): void => {
    for (const [toolCallId, toolName] of pending) {
      pushToolResult(out, {
        type: "tool-result",
        toolCallId,
        toolName,
        output: { type: "text", value: MISSING_TOOL_RESULT_TEXT },
      });
    }
    pending.clear();
  };
  const flushDeferred = (): void => {
    out.push(...deferred);
    deferred = [];
  };

  for (const message of messages) {
    if (message.role === "assistant") {
      answerPending();
      flushDeferred();
      out.push(message);
      if (Array.isArray(message.content)) {
        for (const part of message.content) {
          if (part.type === "tool-call") {
            pending.set(part.toolCallId, part.toolName);
          }
        }
      }
      continue;
    }
    if (message.role === "tool") {
      for (const part of message.content) {
        if (part.type !== "tool-result") {
          continue;
        }
        if (pending.has(part.toolCallId)) {
          pending.delete(part.toolCallId);
          pushToolResult(out, part);
        }
      }
      if (pending.size === 0) {
        flushDeferred();
      }
      continue;
    }
    if (pending.size > 0) {
      deferred.push(message);
    } else {
      out.push(message);
    }
  }
  answerPending();
  flushDeferred();
  return out;
}
