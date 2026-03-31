/**
 * FilePartHandler - Handles AI SDK 'file' stream parts from media generation providers.
 *
 * When a custom provider (openai-images, replicate-image, fal-ai-image, etc.) finishes
 * generating an image or audio clip it emits a single `file` stream part instead of
 * text deltas.  This handler:
 *   1. Determines the media type (image / audio).
 *   2. Uploads the raw base64 bytes to the storage adapter → gets a permanent URL.
 *   3. Creates an ASSISTANT message with `generatedMedia` metadata so the frontend
 *      can render the result immediately.
 *   4. Emits CONTENT_DONE so the completion handler can flush cleanly.
 */

import "server-only";

import type { GeneratedFile } from "ai";

import { getStorageAdapter } from "@/app/api/[locale]/agent/chat/storage";
import { IMAGE_GEN_TOOL_NAME } from "@/app/api/[locale]/agent/image-generation/constants";
import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import { AUDIO_GEN_TOOL_NAME } from "@/app/api/[locale]/agent/music-generation/constants";
import { VIDEO_GEN_TOOL_NAME } from "@/app/api/[locale]/agent/video-generation/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { MessageMetadata, ToolCall } from "../../../chat/db";
import type { StreamContext } from "../core/stream-context";

export class FilePartHandler {
  /**
   * Process a `file` stream part:
   *  - upload to storage
   *  - create assistant message with generatedMedia metadata
   *  - emit CONTENT_DONE SSE event
   */
  static async processFilePart(params: {
    file: GeneratedFile;
    ctx: StreamContext;
    threadId: string;
    model: ModelId;
    skill: string;
    userId: string | undefined;
    isIncognito: boolean;
    logger: EndpointLogger;
    prompt: string;
    creditCost: number;
  }): Promise<void> {
    const {
      file,
      ctx,
      threadId,
      model,
      skill,
      userId,
      logger,
      prompt,
      creditCost,
    } = params;

    const mediaType = file.mediaType;
    const generatedType: "image" | "audio" | "video" = mediaType.startsWith(
      "image/",
    )
      ? "image"
      : mediaType.startsWith("video/")
        ? "video"
        : "audio";

    // Determine file extension from mediaType
    const defaultExt =
      generatedType === "image"
        ? "png"
        : generatedType === "video"
          ? "mp4"
          : "mp3";
    const ext = mediaType.split("/")[1] ?? defaultExt;
    const filename = `generated-${generatedType}-${Date.now()}.${ext}`;

    // Decode base64 → Buffer
    const base64Data = file.base64;
    const buffer = Buffer.from(base64Data, "base64");

    // Upload to storage
    let mediaUrl: string | undefined;
    try {
      const storage = getStorageAdapter();
      const uploadResult = await storage.uploadFile(buffer, {
        filename,
        mimeType: mediaType,
        threadId,
        userId,
      });
      mediaUrl = uploadResult.url;
      logger.info("[FilePartHandler] Uploaded generated media", {
        mediaType,
        generatedType,
        url: mediaUrl,
        fileSizeBytes: buffer.length,
        model,
        threadId,
        prompt: prompt.slice(0, 100),
        creditCost,
      });
    } catch (uploadErr) {
      logger.error("[FilePartHandler] Failed to upload generated media", {
        error:
          uploadErr instanceof Error ? uploadErr.message : String(uploadErr),
        mediaType,
        threadId,
      });
      // Continue without URL - generatedMedia.url will be undefined
    }

    const generatedMedia: MessageMetadata["generatedMedia"] = {
      type: generatedType,
      url: mediaUrl,
      prompt,
      modelId: model,
      mimeType: mediaType,
      creditCost,
      status: "complete",
    };

    if (ctx.currentAssistantMessageId) {
      // LLM already emitted text before this file part → attach media to the existing
      // text message (one bubble). Close any unclosed <think> block first.
      let closedContent = ctx.currentAssistantContent;
      if (/<think>/i.test(closedContent) && !/<\/think>/i.test(closedContent)) {
        closedContent += "</think>";
        ctx.dbWriter.emitDelta(ctx.currentAssistantMessageId, "</think>");
        ctx.currentAssistantContent = closedContent;
      }

      // Attach media to the existing message via GENERATED_MEDIA_ADDED SSE + DB merge
      await ctx.dbWriter.emitGeneratedMediaOnExistingMessage({
        messageId: ctx.currentAssistantMessageId,
        generatedMedia,
      });

      // Write synthetic TOOL message so next turn sees the file URL in tool-result context
      if (mediaUrl) {
        const syntheticToolCall = FilePartHandler.buildSyntheticToolCall(
          generatedType,
          mediaType,
          mediaUrl,
          prompt,
          creditCost,
        );
        await ctx.dbWriter.emitSyntheticToolMessage({
          messageId: crypto.randomUUID(),
          threadId,
          parentId: ctx.currentAssistantMessageId,
          userId,
          model,
          skill,
          sequenceId: ctx.sequenceId,
          toolCall: syntheticToolCall,
        });
      }

      // Close the message - CONTENT_DONE clears isStreaming on the frontend
      ctx.dbWriter.emitContentDoneRaw({
        messageId: ctx.currentAssistantMessageId,
        content: closedContent,
        totalTokens: 0,
        finishReason: "stop",
      });
    } else {
      // No preceding text - create a standalone media message (existing behavior)
      const messageId = ctx.getNextAssistantMessageId();
      ctx.currentAssistantMessageId = messageId;
      ctx.lastAssistantMessageId = messageId;

      const parentId = ctx.currentParentId;

      await ctx.dbWriter.emitGeneratedMediaMessage({
        messageId,
        threadId,
        parentId,
        userId,
        model,
        skill,
        sequenceId: ctx.sequenceId,
        generatedMedia,
      });

      // Write synthetic TOOL message so next turn sees the file URL in tool-result context
      if (mediaUrl) {
        const syntheticToolCall = FilePartHandler.buildSyntheticToolCall(
          generatedType,
          mediaType,
          mediaUrl,
          prompt,
          creditCost,
        );
        await ctx.dbWriter.emitSyntheticToolMessage({
          messageId: crypto.randomUUID(),
          threadId,
          parentId: messageId,
          userId,
          model,
          skill,
          sequenceId: ctx.sequenceId,
          toolCall: syntheticToolCall,
        });
      }

      ctx.currentParentId = messageId;
      ctx.lastParentId = messageId;

      ctx.dbWriter.emitContentDoneRaw({
        messageId,
        content: "",
        totalTokens: 0,
        finishReason: "stop",
      });

      ctx.currentAssistantContent = "";
    }
  }

  /**
   * Build a typed ToolCall for a natively-generated media file.
   * The tool call name follows the pattern `image_gen`, `audio_gen`, `video_gen`
   * so the LLM recognises the origin on subsequent turns.
   */
  private static buildSyntheticToolCall(
    generatedType: "image" | "audio" | "video",
    mediaType: string,
    mediaUrl: string,
    prompt: string,
    creditCost: number,
  ): ToolCall {
    const toolCallId = crypto.randomUUID();
    const args: ToolCall["args"] = { prompt };
    const result: ToolCall["result"] = {
      file: mediaUrl,
      // text is always populated — prompt at generation time, fallback if empty
      // so gap-fill only needs to fire for truly unknown content (native LLM file outputs)
      text: prompt || `[generated ${generatedType}]`,
      mediaType,
      creditCost,
    };
    const toolName =
      generatedType === "image"
        ? IMAGE_GEN_TOOL_NAME
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
}
