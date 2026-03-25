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

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import { getStorageAdapter } from "@/app/api/[locale]/agent/chat/storage";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { MessageMetadata } from "../../../chat/db";
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
    const generatedType: "image" | "audio" = mediaType.startsWith("image/")
      ? "image"
      : "audio";

    // Determine file extension from mediaType
    const ext =
      mediaType.split("/")[1] ?? (generatedType === "image" ? "png" : "mp3");
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

    // Close out the current assistant message (e.g. reasoning) before creating the media message.
    // Without this, the reasoning message stays in isStreaming=true forever because
    // MESSAGE_CREATED forces isStreaming=true and only CONTENT_DONE clears it.
    if (ctx.currentAssistantMessageId) {
      ctx.dbWriter.emitContentDoneRaw({
        messageId: ctx.currentAssistantMessageId,
        content: ctx.currentAssistantContent,
        totalTokens: 0,
        finishReason: "stop",
      });
    }

    // Get message ID for the generated media message
    const messageId = ctx.getNextAssistantMessageId();
    ctx.currentAssistantMessageId = messageId;
    ctx.lastAssistantMessageId = messageId;

    const parentId = ctx.currentParentId;

    // Emit MESSAGE_CREATED SSE + persist to DB via dbWriter
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

    // Update parent chain
    ctx.currentParentId = messageId;
    ctx.lastParentId = messageId;

    // Emit CONTENT_DONE so StreamCompletionHandler fires normally
    ctx.dbWriter.emitContentDoneRaw({
      messageId,
      content: "",
      totalTokens: 0,
      finishReason: "stop",
    });

    // No text content for generated media
    ctx.currentAssistantContent = "";
  }
}
