/**
 * Message context pipeline — filter stage (attachment strip / variant
 * injection, native-support).
 */

import "server-only";

import type { ChatMessage } from "../../../chat/db";
import type { ChatModelOption } from "../../models";

// ─── Stage: filter (attachment strip / variant injection, native-support) ───

/**
 * Check if model natively supports an attachment's modality.
 * Uses inputs[] array if available, falls back to legacy feature flags.
 */
export function supportsAttachmentNatively(
  attachment: { mimeType: string },
  model: ChatModelOption,
): boolean {
  const mimeType = attachment.mimeType.toLowerCase();

  // Use new inputs[] array if available
  if (model.inputs && model.inputs.length > 0) {
    if (mimeType.startsWith("image/")) {
      return model.inputs.includes("image");
    }
    if (mimeType.startsWith("video/")) {
      return model.inputs.includes("video");
    }
    if (mimeType.startsWith("audio/")) {
      return model.inputs.includes("audio");
    }
    if (mimeType.startsWith("application/pdf")) {
      return model.inputs.includes("text");
    }
    if (mimeType.startsWith("text/")) {
      return model.inputs.includes("text");
    }
    return false;
  }

  // Fallback: use inputs[] array
  if (mimeType.startsWith("image/")) {
    return model.inputs?.includes("image") ?? false;
  }
  if (mimeType.startsWith("application/pdf")) {
    return model.inputs?.includes("text") ?? false;
  }
  return false;
}

/**
 * Strip attachments from messages for non-vision models
 * Operates on ChatMessage objects BEFORE conversion to AI SDK format
 */
export function stripAttachmentsFromMessages(
  messages: ChatMessage[],
  modelName: string,
  model?: ChatModelOption,
): {
  totalRemoved: number;
  formats: string[];
  warningMessage: string;
} {
  let totalRemoved = 0;
  const formatSet = new Set<string>();

  for (const message of messages) {
    if (!message.metadata?.attachments) {
      continue;
    }

    // Filter out image and file attachments that model cannot handle natively.
    // Exception: if a cached text variant exists for this message, inject it as
    // text content instead of dropping. If no variant exists, keep the attachment
    // so GapFillExecutor can bridge it after conversion.
    const cachedTextVariant = message.metadata.variants?.find(
      (v) => v.modality === "text" && v.content,
    );

    message.metadata.attachments = message.metadata.attachments.filter(
      (attachment) => {
        const mimeType = attachment.mimeType?.toLowerCase() || "";

        const nativelySupported = model
          ? supportsAttachmentNatively({ mimeType }, model)
          : false;

        if (nativelySupported) {
          return true;
        }

        const isImage = mimeType.startsWith("image/");
        const isFile =
          mimeType.startsWith("application/") || mimeType.startsWith("text/");

        if (!isImage && !isFile) {
          return true;
        }

        // Has cached text variant → inject into content, then drop the attachment
        if (cachedTextVariant) {
          const description = cachedTextVariant.content;
          message.content = message.content
            ? `${message.content}\n\n[Attachment description: ${description}]`
            : `[Attachment description: ${description}]`;
          totalRemoved++;
          formatSet.add(isImage ? "image" : "file");
          return false;
        }

        // No cached variant → keep attachment so GapFillExecutor can bridge it
        return true;
      },
    );

    // If all attachments were removed, remove the attachments array
    if (message.metadata.attachments.length === 0) {
      delete message.metadata.attachments;
    }
  }

  const formats = [...formatSet];
  const formatList = formats.join(", ");
  const warningMessage = `[IMPORTANT] ${totalRemoved} attachment(s) (${formatList}) were removed from the conversation history because the current model (${modelName}) does not support vision/file analysis. If the user references these attachments or asks questions about them, politely inform them that you cannot analyze ${formatList}s with this model. IMPORTANT: Suggest they switch to a vision-capable model (like Claude Sonnet 4.5, GPT-5, or Gemini) to analyze the attachments, then switch back to continue the conversation if needed.`;

  return {
    totalRemoved,
    formats,
    warningMessage,
  };
}
