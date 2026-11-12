/**
 * Shared utility for loading message attachments
 */

import type { EndpointLogger } from "next-vibe/logger/types";

import type { ChatMessage } from "../../../../db";
import { base64ToFile, urlToFile } from "../../../../incognito/file-utils";

export async function loadMessageAttachments(
  message: ChatMessage,
  logger: EndpointLogger,
): Promise<File[]> {
  if (
    !message.metadata?.attachments ||
    message.metadata.attachments.length === 0
  ) {
    return [];
  }

  try {
    const files = await Promise.all(
      message.metadata.attachments.map(async (att) => {
        if (att.data) {
          return base64ToFile(att.data, att.filename, att.mimeType);
        }
        if (att.url) {
          const file = await urlToFile(att.url, att.filename, att.mimeType);
          if (!file) {
            // urlToFile swallows fetch/HTTP errors - the attachment is dropped
            // from the edited/branched message, so report it.
            logger.warn("Failed to download message attachment", {
              operation: "loadMessageAttachments",
              messageId: message.id,
              threadId: message.threadId,
              attachmentId: att.id,
              mimeType: att.mimeType,
              size: att.size,
            });
          }
          return file;
        }
        return null;
      }),
    );

    const validFiles = files.filter((f): f is File => f !== null);

    if (validFiles.length > 0) {
      logger.debug("Loaded message attachments", {
        messageId: message.id,
        attachmentCount: validFiles.length,
        mode: message.metadata.attachments[0]?.data ? "incognito" : "private",
      });
    }

    return validFiles;
  } catch (error) {
    logger.error("Failed to load message attachments", {
      error: error instanceof Error ? error.message : String(error),
      messageId: message.id,
    });
    return [];
  }
}
