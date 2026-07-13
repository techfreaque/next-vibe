/**
 * Message context pipeline — shape-tool-results stage (media-aware
 * buildToolResultOutput).
 */

import "server-only";

import type { JSONValue } from "ai";
import { IMAGE_GEN_ALIAS } from "next-vibe/agent/image-generation/constants";
import type { Modality } from "next-vibe/agent/models/enum";
import { AUDIO_GEN_TOOL_NAME } from "next-vibe/agent/music-generation/constants";
import { VIDEO_GEN_TOOL_NAME } from "next-vibe/agent/video-generation/constants";
import type { ContentBlock } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { EXECUTE_TOOL_ALIAS } from "next-vibe/execute-tool/constants";
import type { EndpointLogger } from "next-vibe/logger/types";

import { fetchStorageFileAsBase64 } from "../../../chat/storage/url-utils";
import type { ChatModelOption } from "../../models";

// ─── Stage: shape tool results (media-aware buildToolResultOutput) ───

/**
 * Strip internal `$ref: "#/definitions/…"` keys from arbitrary JSON. Tool results
 * (e.g. tool-help returning execute-tool's parameter schema) can embed these
 * refs; some providers (Gemini) reject them. Removes only the internal-definition
 * refs, keeping all other content intact.
 */
function sanitizeJsonSchemaRefs(value: JSONValue): JSONValue {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((v) => sanitizeJsonSchemaRefs(v as JSONValue));
  }
  const result: Record<string, JSONValue> = {};
  for (const [k, v] of Object.entries(value as Record<string, JSONValue>)) {
    if (
      k === "$ref" &&
      typeof v === "string" &&
      v.startsWith("#/definitions/")
    ) {
      continue;
    }
    result[k] = sanitizeJsonSchemaRefs(v as JSONValue);
  }
  return result;
}

/**
 * Legacy incognito results inlined the media as a data: URI. Never let that
 * string into the model context verbatim — a single image is hundreds of
 * thousands of tokens and blows the context window.
 */
function safeUrl(url: string | undefined): string | undefined {
  return url?.startsWith("data:") ? "[inline media omitted]" : url;
}

type ShapedToolResultOutput =
  | {
      type: "json";
      value: JSONValue;
    }
  | {
      type: "content";
      value: Array<
        | { type: "text"; text: string }
        | { type: "image-data"; data: string; mediaType: string }
      >;
    };

/**
 * Build tool result output, detecting ContentResponse to pass images to the AI model
 * When the result contains a ContentResponse (with __isContentResponse marker),
 * we use the AI SDK's `type: 'content'` format with `media` parts so the
 * model can actually "see" images (e.g. screenshots from browser tools).
 *
 * For media tool results (image_gen / video_gen / audio_gen) applies modality-aware logic:
 * - Model supports the media modality → pass file URL (model can see it natively)
 * - Model does not support it → pass only text description (gap-fill ensures text is populated)
 */
export async function buildToolResultOutput(
  logger: EndpointLogger,
  result: WidgetData | undefined,
  toolName?: string,
  modelConfig?: ChatModelOption,
  isCurrentTurn?: boolean,
  /** Fixture-aware fetch for media downloads; defaults to live fetch. */
  // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- live-fetch default for callers without a fixture chain
  fetchImpl: typeof globalThis.fetch = fetch,
): Promise<ShapedToolResultOutput> {
  // Check if result is a ContentResponse (stored as JSON with marker fields)
  if (
    result &&
    typeof result === "object" &&
    !Array.isArray(result) &&
    "__isContentResponse" in result &&
    "content" in result &&
    Array.isArray(result.content)
  ) {
    const blocks = result.content as ContentBlock[];
    const modelSupportsImages = modelConfig?.inputs?.includes("image") ?? false;
    const contentParts: Array<
      | { type: "text"; text: string }
      | { type: "image-data"; data: string; mediaType: string }
    > = [];

    for (const block of blocks) {
      if (block.type === "text") {
        contentParts.push({ type: "text", text: block.text });
      } else if (block.type === "image" && modelSupportsImages) {
        contentParts.push({
          type: "image-data",
          data: block.data,
          mediaType: block.mimeType,
        });
      } else if (block.type === "image_url") {
        if (isCurrentTurn) {
          // Current turn: fetch base64 on-demand so the model can see the image
          const base64 = await fetchStorageFileAsBase64(
            block.url,
            undefined,
            fetchImpl,
          );
          if (base64) {
            contentParts.push({
              type: "image-data",
              data: base64,
              mediaType: block.mimeType,
            });
          } else {
            logger.error("[MessageConverter] Failed to fetch image_url block", {
              url: block.url,
            });
            contentParts.push({
              type: "text",
              text: `[image: ${block.url}]`,
            });
          }
        } else {
          // History turn: stub with URL + hint — model can re-examine via view_image
          contentParts.push({
            type: "text",
            text: `[image: ${block.url}] — use view_image tool to re-examine`,
          });
        }
      }
    }

    if (contentParts.length > 0) {
      return { type: "content", value: contentParts };
    }
    // Only image blocks but model can't see images — minimal placeholder.
    return {
      type: "json",
      value: { status: "screenshot_taken" },
    };
  }

  // Detect a stored ToolResultOutput `{ type: "content", value: [...] }` written
  // by executor.ts when running on the AI platform. Pass it through directly so
  // image-data parts remain as structured content instead of being re-wrapped as JSON text.
  if (
    result &&
    typeof result === "object" &&
    !Array.isArray(result) &&
    "type" in result &&
    result.type === "content" &&
    "value" in result &&
    Array.isArray(result.value)
  ) {
    const modelSupportsImages = modelConfig?.inputs?.includes("image") ?? false;
    const parts = result.value as Array<
      | { type: "text"; text: string }
      | { type: "image-data"; data: string; mediaType: string }
    >;
    const filtered = parts.filter(
      (p) => p.type !== "image-data" || modelSupportsImages,
    );
    if (filtered.length > 0) {
      return {
        type: "content",
        value: filtered as Array<
          | { type: "text"; text: string }
          | { type: "image-data"; data: string; mediaType: string }
        >,
      };
    }
    return { type: "json", value: { status: "screenshot_taken" } };
  }

  // Media tool result modality-aware handling:
  // image_gen / video_gen / audio_gen results carry { file, text, mediaType, creditCost }
  // The model should see the file only if it natively supports that modality;
  // otherwise it sees only the text description (gap-fill guarantees text is populated).
  //
  // Results may arrive in two shapes:
  // 1. Direct call: toolName = "generate_image", result = { imageUrl, creditCost }
  // 2. Via execute-tool: toolName = "execute-tool", result = { result: { imageUrl, creditCost } }
  // We detect both by checking shape after optional unwrapping of the execute-tool `result` key.
  const MEDIA_TOOL_NAMES = [
    IMAGE_GEN_ALIAS,
    VIDEO_GEN_TOOL_NAME,
    AUDIO_GEN_TOOL_NAME,
  ] as const;

  // Unwrap execute-tool wrapper: { result: { imageUrl, ... } } → { imageUrl, ... }
  let effectiveResult = result;
  if (
    toolName === EXECUTE_TOOL_ALIAS &&
    result &&
    typeof result === "object" &&
    !Array.isArray(result) &&
    "result" in result &&
    typeof result.result === "object" &&
    result.result !== null &&
    !Array.isArray(result.result)
  ) {
    effectiveResult = result.result;
  }

  // Detect media result by shape (imageUrl/videoUrl/audioUrl/file) or by tool name
  const isMediaByName =
    toolName !== undefined &&
    MEDIA_TOOL_NAMES.includes(toolName as (typeof MEDIA_TOOL_NAMES)[number]);
  const isMediaByShape =
    effectiveResult !== null &&
    effectiveResult !== undefined &&
    typeof effectiveResult === "object" &&
    !Array.isArray(effectiveResult) &&
    ("imageUrl" in effectiveResult ||
      "videoUrl" in effectiveResult ||
      "audioUrl" in effectiveResult ||
      "file" in effectiveResult);

  if (
    (isMediaByName || isMediaByShape) &&
    effectiveResult &&
    typeof effectiveResult === "object" &&
    !Array.isArray(effectiveResult)
  ) {
    const mediaResult = effectiveResult as {
      file?: string;
      imageUrl?: string;
      videoUrl?: string;
      audioUrl?: string;
      text?: string | null;
      mediaType?: string;
      creditCost?: number;
    };

    // Normalize: generate_image/video/music return { imageUrl / videoUrl / audioUrl }
    // while FilePartHandler (native Gemini gen) stores { file }.
    // Resolve the canonical file URL from whichever field is present.
    const fileUrl =
      mediaResult.file ??
      mediaResult.imageUrl ??
      mediaResult.videoUrl ??
      mediaResult.audioUrl;

    const isInlineData = fileUrl?.startsWith("data:") ?? false;

    // If neither format has a media URL, fall through to generic JSON passthrough.
    if (!fileUrl && !mediaResult.text) {
      return { type: "json", value: (result ?? null) as JSONValue };
    }

    // Determine which modality this tool produces — detect by tool name first,
    // then fall back to field presence (handles execute-tool wrapped results).
    const modality: Modality =
      toolName === IMAGE_GEN_ALIAS ||
      mediaResult.imageUrl !== undefined ||
      mediaResult.file !== undefined
        ? "image"
        : toolName === VIDEO_GEN_TOOL_NAME || mediaResult.videoUrl !== undefined
          ? "video"
          : "audio";

    const modelCanSee = modelConfig?.inputs?.includes(modality) ?? false;

    if (modelCanSee && fileUrl) {
      // Model supports this modality - fetch + base64 encode the file so the model
      // can actually see the generated media (passing a URL string as JSON doesn't
      // let the model see the image). Same pattern as user attachments and assistant
      // generatedMedia handling.
      if (modality === "image") {
        const base64Data = isInlineData
          ? (fileUrl?.split(",")[1] ?? null)
          : await fetchStorageFileAsBase64(fileUrl, undefined, fetchImpl);
        if (base64Data) {
          const mimeType = mediaResult.mediaType ?? "image/png";
          const contentParts: Array<
            | { type: "text"; text: string }
            | { type: "image-data"; data: string; mediaType: string }
          > = [{ type: "image-data", data: base64Data, mediaType: mimeType }];
          // Also surface the canonical URL as text. A vision model sees the
          // pixels but, asked to report the imageUrl, would otherwise have no
          // URL string to cite and tends to hallucinate one (e.g. a sandbox:
          // path). The real URL must be in the result it reads.
          const citeUrl = safeUrl(mediaResult.imageUrl ?? mediaResult.file);
          if (citeUrl) {
            contentParts.push({ type: "text", text: `imageUrl: ${citeUrl}` });
          }
          if (mediaResult.text) {
            contentParts.push({ type: "text", text: mediaResult.text });
          }
          return { type: "content" as const, value: contentParts };
        }
        logger.error(
          "[MessageConverter] Failed to fetch generated image for tool result",
          { url: fileUrl },
        );
      }

      // Fallback for non-image modalities or failed fetch: pass URL as JSON
      return {
        type: "json" as const,
        value: {
          file: safeUrl(fileUrl) ?? null,
          text: mediaResult.text ?? null,
          mediaType: mediaResult.mediaType ?? null,
          creditCost: mediaResult.creditCost ?? null,
        } satisfies JSONValue,
      };
    }

    // Model cannot see the file - pass URL + text so the AI can reference it by URL
    // and also has a text description if gap-fill produced one.
    // Always include the media URL (imageUrl/videoUrl/audioUrl) so the AI can cite it.
    return {
      type: "json" as const,
      value: {
        ...(mediaResult.imageUrl !== undefined && {
          imageUrl: safeUrl(mediaResult.imageUrl),
        }),
        ...(mediaResult.videoUrl !== undefined && {
          videoUrl: safeUrl(mediaResult.videoUrl),
        }),
        ...(mediaResult.audioUrl !== undefined && {
          audioUrl: safeUrl(mediaResult.audioUrl),
        }),
        ...(fileUrl &&
          !mediaResult.imageUrl &&
          !mediaResult.videoUrl &&
          !mediaResult.audioUrl && { file: safeUrl(fileUrl) }),
        text: mediaResult.text ?? null,
        mediaType: mediaResult.mediaType ?? null,
        creditCost: mediaResult.creditCost ?? null,
      } satisfies JSONValue,
    };
  }

  return {
    type: "json",
    value: sanitizeJsonSchemaRefs((result ?? null) as JSONValue),
  };
}
