/**
 * ContentResponse → AI SDK tool-result shaping.
 *
 * Its own module because it is the ONE piece of ./core that exists purely for
 * Platform.AI. Every other surface (CLI, MCP, NEXT_API) returns the
 * ContentResponse untouched, so a deployment without an AI platform declines
 * this file and drops the branch instead of editing an inline block out of the
 * executor's result path — which is also what keeps ./core's "lean by contract"
 * import graph honest.
 */

import "server-only";

import type { ContentBlock } from "../../core/route/response.schema";

/** A tool-result part in the shape the AI SDK expects. */
type AiPart =
  | { type: "text"; text: string }
  | { type: "image-data"; data: string; mediaType: string };

/**
 * Convert mixed content blocks (text + images) to ToolResultOutput
 * `{ type: "content", value: [...] }` so the AI SDK sends image parts as
 * structured image-data (image tokens) instead of serializing the
 * ContentResponse as raw JSON text — which counts base64 as millions of text
 * tokens and causes context overflow.
 *
 * Blocks that are neither text nor image are dropped: the AI SDK has no part
 * type for them, and an empty result is reported as a bare screenshot marker
 * (the only producer of image-only content today).
 */
export function toAiToolResult<TResult>(content: ContentBlock[]): TResult {
  const parts: AiPart[] = [];
  for (const b of content) {
    if (b.type === "text") {
      parts.push({ type: "text", text: b.text });
    } else if (b.type === "image") {
      parts.push({
        type: "image-data",
        data: b.data,
        mediaType: b.mimeType,
      });
    }
  }
  return (
    parts.length > 0
      ? { type: "content", value: parts }
      : { status: "screenshot_taken" }
  ) as TResult;
}
