/**
 * Module-level pure helpers for the StreamLoop modules.
 */

import "server-only";

import type { JSONValue } from "ai";
import { IMAGE_GEN_ALIAS } from "next-vibe/agent/image-generation/constants";
import { AUDIO_GEN_TOOL_NAME } from "next-vibe/agent/music-generation/constants";
import { VIDEO_GEN_TOOL_NAME } from "next-vibe/agent/video-generation/constants";
import type { WidgetData } from "next-vibe/core/utils/json";

import type { ToolCall } from "../../../chat/db";

export const DEFAULT_TEMPERATURE = 0.7;

/**
 * Injected as a system message on the FINAL permitted step (maxToolCalls cap,
 * paired with toolChoice:"none"). Without it a model that still wants a tool
 * emits its tool-call syntax as raw text instead of answering; with it every
 * stream ends on a real assistant answer — the contract ai-run and headless
 * callers rely on.
 */
export const FINAL_STEP_INSTRUCTIONS =
  "Tool-call limit reached: this is your final turn and tools are disabled. " +
  "Provide your final answer now in plain text, based on the results gathered " +
  "so far. If the task could not be completed, state what you found and what " +
  "remains to be done.";

/**
 * Recursively sort object keys for stable serialization (cache-friendly).
 * TWO string semantics exist and they are NOT interchangeable:
 *   - sortObjectKeys: a string containing JSON is parsed and returned as the
 *     PARSED, key-sorted VALUE (loop-side result dedup/hashing semantics).
 *   - sortObjectKeysPreservingStrings: a string containing JSON is parsed,
 *     key-sorted, and RE-STRINGIFIED — the value's TYPE never changes. This is
 *     the wire-normalization semantics: provider payloads require e.g. tool
 *     message content to STAY a string (an object gets a 400 "Invalid input").
 */
function sortWalk(obj: JSONValue, restringify: boolean): JSONValue {
  if (obj === null) {
    return obj;
  }

  // Handle strings that might contain JSON
  if (typeof obj === "string") {
    if (
      (obj.startsWith("{") && obj.endsWith("}")) ||
      (obj.startsWith("[") && obj.endsWith("]"))
    ) {
      try {
        const parsed = JSON.parse(obj) as JSONValue;
        const sorted = sortWalk(parsed, restringify);
        return restringify ? JSON.stringify(sorted) : sorted;
      } catch {
        return obj;
      }
    }
    return obj;
  }

  if (typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sortWalk(item, restringify));
  }

  const sorted: Record<string, JSONValue> = {};
  for (const key of Object.keys(obj).toSorted()) {
    const value = obj[key];
    if (value !== undefined) {
      sorted[key] = sortWalk(value, restringify);
    }
  }
  return sorted;
}

export function sortObjectKeys(obj: JSONValue): JSONValue {
  return sortWalk(obj, false);
}

export function sortObjectKeysPreservingStrings(obj: JSONValue): JSONValue {
  return sortWalk(obj, true);
}

/**
 * Type guard for tool result values
 */
export function isValidToolResult(
  value: JSONValue,
): value is JSONValue & WidgetData {
  if (value === null) {
    return true;
  }
  if (value === undefined) {
    return false;
  }
  if (typeof value === "string") {
    return true;
  }
  if (typeof value === "number") {
    return true;
  }
  if (typeof value === "boolean") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every((item) => isValidToolResult(item));
  }
  if (typeof value === "object") {
    return Object.values(value).every((v) =>
      v !== undefined ? isValidToolResult(v) : false,
    );
  }
  return false;
}

/**
 * Build a typed ToolCall for a natively-generated media file.
 * The tool call name follows the pattern `image_gen`, `audio_gen`, `video_gen`
 * so the LLM recognises the origin on subsequent turns.
 */
export function buildSyntheticToolCall(
  generatedType: "image" | "audio" | "video",
  mediaType: string,
  mediaUrl: string,
  creditCost: number,
  model: string,
): ToolCall {
  const toolCallId = crypto.randomUUID();
  // args.prompt is intentionally empty for natively-generated media (Gemini file parts).
  // An empty prompt signals to gap-fill that the content is unknown - so on the next turn
  // with a model that cannot see the media natively, the vision bridge kicks in to produce
  // a text description before the AI run starts.
  // args.model IS the resolved chat model — for native gen the chat model AND the
  // image model are the same (e.g. gemini-3.1-flash-image-preview). The real
  // generate_image tool records `model` as an input; the synthetic call must match
  // so the media-gen widget + assertions see the model that actually produced it.
  const args: ToolCall["args"] = { prompt: "", model };
  // The synthetic tool call is rendered by the REAL media-gen widget (toolName =
  // generate_image / generate_video / generate_music). Each of those widgets reads
  // the URL from its OWN typed field — imageUrl / videoUrl / audioUrl — NOT `file`.
  // Emitting only `file` left the widget with nothing to render → "no image in
  // chat". So expose the URL under the tool's canonical field too. `file` stays
  // for gap-fill's empty-text/native-gen signal (gap-fill reads file ∪ *Url).
  const urlField: "imageUrl" | "videoUrl" | "audioUrl" =
    generatedType === "image"
      ? "imageUrl"
      : generatedType === "video"
        ? "videoUrl"
        : "audioUrl";
  const result: ToolCall["result"] = {
    file: mediaUrl,
    [urlField]: mediaUrl,
    // text is intentionally empty for natively-generated media (Gemini file parts).
    // Gap-fill Pass 2 (bridgeMediaUrl) uses vision bridge to populate it on the first
    // non-image-capable turn. An empty text here signals that the bridge is needed.
    text: "",
    mediaType,
    creditCost,
  };
  const toolName =
    generatedType === "image"
      ? IMAGE_GEN_ALIAS
      : generatedType === "video"
        ? VIDEO_GEN_TOOL_NAME
        : AUDIO_GEN_TOOL_NAME;
  return {
    toolCallId,
    toolName,
    args,
    result,
    callbackMode: "wait",
  };
}
