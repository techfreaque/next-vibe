/**
 * Generated-media (`file` stream part) handling for the StreamLoop.
 */

import "server-only";

import type { GeneratedFile } from "ai";
import { getStorageAdapter } from "../../../chat/storage/index";

import { buildSyntheticToolCall } from "./helpers";
import type { StreamLoopState } from "./state";

/**
 * Process a `file` stream part from a media generation provider
 * (openai-images, replicate-image, fal-ai-image, etc. emit a single `file`
 * part instead of text deltas when generation finishes):
 *  1. Determines the media type (image / audio).
 *  2. Uploads the raw base64 bytes to the storage adapter → gets a permanent URL.
 *  3. Creates an ASSISTANT message with `generatedMedia` metadata so the
 *     frontend can render the result immediately.
 *  4. Emits CONTENT_DONE so the completion handler can flush cleanly.
 */
export async function onFilePart(
  state: StreamLoopState,
  file: GeneratedFile,
): Promise<void> {
  const { ctx, threadId, model, skill, userId, isIncognito, user, logger } =
    state.p;
  const prompt = state.p.ctx.mediaPrompt;
  const creditCost = state.p.ctx.mediaCreditCost;

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
    // Incognito threads have no server-side thread row — the file is owned by
    // the caller's leadId and served only to that lead (browser).
    const uploadResult = await storage.uploadFile(buffer, {
      filename,
      mimeType: mediaType,
      threadId,
      userId: isIncognito ? undefined : userId,
      leadId: isIncognito ? user.leadId : undefined,
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
      error: uploadErr instanceof Error ? uploadErr.message : String(uploadErr),
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
      const syntheticToolCall = buildSyntheticToolCall(
        generatedType,
        mediaType,
        mediaUrl,
        creditCost,
        model,
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
      const syntheticToolCall = buildSyntheticToolCall(
        generatedType,
        mediaType,
        mediaUrl,
        creditCost,
        model,
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
    state.advanceTip(syntheticToolMessageId ?? messageId, {
      clearPendingQueueParent: false,
    });

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

/** Extract the user prompt for generated-media metadata (image/audio models):
 *  walk messages backwards to the last user text part. */
export function extractMediaPrompt(state: StreamLoopState): string {
  const { messages } = state.p;
  let mediaPrompt = "";
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg?.role === "user") {
      const content = msg.content;
      if (typeof content === "string") {
        mediaPrompt = content.trim();
      } else if (Array.isArray(content)) {
        mediaPrompt = content
          .filter((p): p is { type: "text"; text: string } => p.type === "text")
          .map((p) => p.text)
          .join(" ")
          .trim();
      }
      if (mediaPrompt) {
        break;
      }
    }
  }
  return mediaPrompt;
}
