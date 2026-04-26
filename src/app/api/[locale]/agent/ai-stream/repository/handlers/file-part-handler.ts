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

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { getStorageAdapter } from "@/app/api/[locale]/agent/chat/storage";
import { IMAGE_GEN_ALIAS } from "@/app/api/[locale]/agent/image-generation/constants";
import { AUDIO_GEN_TOOL_NAME } from "@/app/api/[locale]/agent/music-generation/constants";
import { VIDEO_GEN_TOOL_NAME } from "@/app/api/[locale]/agent/video-generation/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { ToolCall } from "../../../chat/db";
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
    model: ChatModelId;
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
      logger.debug("[FilePartHandler] Uploaded generated media", {
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

    if (ctx.currentAssistantMessageId) {
      // LLM already emitted text before this file part (e.g. Gemini native image gen
      // outputs text + image in the same turn). Close any unclosed <think> block first.
      let closedContent = ctx.currentAssistantContent;
      if (/<think>/i.test(closedContent) && !/<\/think>/i.test(closedContent)) {
        closedContent += "</think>";
        ctx.dbWriter.emitDelta(ctx.currentAssistantMessageId, "</think>");
        ctx.currentAssistantContent = closedContent;
      }

      // Do NOT attach media to the text assistant message - the synthetic tool message
      // below is the canonical image bubble. Attaching to both causes duplicate rendering.

      // Write synthetic TOOL message so next turn sees the file URL in tool-result context
      if (mediaUrl) {
        const syntheticToolCall = FilePartHandler.buildSyntheticToolCall(
          generatedType,
          mediaType,
          mediaUrl,
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
        // Track the URL so headless callers (generateViaHeadless) can retrieve it.
        // emitGeneratedMediaMessage sets this automatically for the standalone path,
        // but this branch skips that call - set it explicitly here.
        ctx.dbWriter.lastGeneratedMediaUrl = mediaUrl;
      }

      // Close the message - CONTENT_DONE clears isStreaming on the frontend
      ctx.dbWriter.emitContentDoneRaw({
        messageId: ctx.currentAssistantMessageId,
        content: closedContent,
        totalTokens: 0,
        finishReason: "stop",
      });
    } else {
      // No preceding text - create an assistant message WITHOUT generatedMedia, then a
      // synthetic TOOL message as the canonical image bubble. The synthetic tool is the
      // only place generatedMedia lives; the assistant message must stay clean so that
      // any text the model emits after the file part can be appended without creating a
      // duplicate media bubble on the frontend.
      const messageId = ctx.getNextAssistantMessageId();
      ctx.currentAssistantMessageId = messageId;
      ctx.lastAssistantMessageId = messageId;

      const parentId = ctx.currentParentId;

      // Track URL for headless callers (generateViaHeadless retrieves this).
      if (mediaUrl) {
        ctx.dbWriter.lastGeneratedMediaUrl = mediaUrl;
      }

      // Create a plain assistant message with no generatedMedia
      await ctx.dbWriter.emitMessageCreated({
        messageId,
        threadId,
        content: "",
        parentId,
        userId,
        model,
        skill,
        sequenceId: ctx.sequenceId,
      });

      // Write synthetic TOOL message so next turn sees the file URL in tool-result context.
      // It is a child of the assistant message; the parent pointer advances to the tool
      // message so subsequent text creates a sibling-free chain (avoids branch violations).
      let syntheticToolMessageId: string | null = null;
      if (mediaUrl) {
        syntheticToolMessageId = crypto.randomUUID();
        const syntheticToolCall = FilePartHandler.buildSyntheticToolCall(
          generatedType,
          mediaType,
          mediaUrl,
          creditCost,
        );
        await ctx.dbWriter.emitSyntheticToolMessage({
          messageId: syntheticToolMessageId,
          threadId,
          parentId: messageId,
          userId,
          model,
          skill,
          sequenceId: ctx.sequenceId,
          toolCall: syntheticToolCall,
        });
      }

      // Advance parent pointer to synthetic tool (if present) so text that follows
      // becomes its child rather than a sibling of the tool message.
      ctx.currentParentId = syntheticToolMessageId ?? messageId;
      ctx.lastParentId = syntheticToolMessageId ?? messageId;

      // Close the empty assistant message (clears isStreaming on the frontend).
      ctx.dbWriter.emitContentDoneRaw({
        messageId,
        content: "",
        totalTokens: 0,
        finishReason: "stop",
      });

      // Clear so that any text emitted after the file part creates a fresh assistant message.
      ctx.currentAssistantMessageId = null;
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
    creditCost: number,
  ): ToolCall {
    const toolCallId = crypto.randomUUID();
    // args.prompt is intentionally empty for natively-generated media (Gemini file parts).
    // An empty prompt signals to gap-fill that the content is unknown - so on the next turn
    // with a model that cannot see the media natively, the vision bridge kicks in to produce
    // a text description before the AI run starts.
    const args: ToolCall["args"] = { prompt: "" };
    const result: ToolCall["result"] = {
      file: mediaUrl,
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
}
