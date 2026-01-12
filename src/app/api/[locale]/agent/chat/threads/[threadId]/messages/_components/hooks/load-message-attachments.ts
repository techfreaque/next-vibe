/**
 * Shared utility for loading message attachments
 */

import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import {
  base64ToFile,
  urlToFile,
} from "@/app/api/[locale]/agent/chat/incognito/file-utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

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
          return await urlToFile(att.url, att.filename, att.mimeType);
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
