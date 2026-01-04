/**
 * UserMessageMetadataHandler - Extracts user message metadata for AI input
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { ChatMessage } from "../../../chat/db";

export class UserMessageMetadataHandler {
  /**
   * Extract user message metadata (attachments) for AI input
   * Handles both incognito and server modes
   */
  static async extractMetadata(params: {
    isIncognito: boolean;
    attachments?: File[];
    messageHistory?: ChatMessage[];
    userMessageId: string | null;
    logger: EndpointLogger;
    operation: "send" | "retry" | "edit" | "answer-as-ai";
  }): Promise<
    | {
        attachments?: Array<{
          id: string;
          url: string;
          filename: string;
          mimeType: string;
          size: number;
          data?: string;
        }>;
      }
    | undefined
  > {
    const { isIncognito, attachments, messageHistory, userMessageId, logger, operation } = params;

    if (isIncognito) {
      // Priority 1: Check if attachments are provided as File objects (retry/branch operations)
      if (attachments && attachments.length > 0) {
        const attachmentMetadata = await Promise.all(
          attachments.map(async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            return {
              id: "", // No ID for incognito
              url: "", // No URL for incognito
              filename: file.name,
              mimeType: file.type,
              size: file.size,
              data: buffer.toString("base64"),
            };
          }),
        );

        logger.debug("[Setup] Converted incognito attachments to base64 for AI", {
          attachmentCount: attachmentMetadata.length,
          operation,
        });

        return {
          attachments: attachmentMetadata,
        };
      }
      // Priority 2: Check if the user message with attachments is in messageHistory
      else if (messageHistory && messageHistory.length > 0) {
        const userMessage = messageHistory.find((msg) => msg.id === userMessageId);
        if (userMessage?.metadata?.attachments) {
          logger.debug("[Setup] Extracted user message metadata from messageHistory", {
            messageId: userMessageId,
            attachmentCount: userMessage.metadata.attachments.length,
          });

          return {
            attachments: userMessage.metadata.attachments,
          };
        }
      }
    } else if (!isIncognito && attachments && attachments.length > 0) {
      // For NEW server threads, convert attachments to base64 for immediate AI use
      logger.debug("[Setup] Converting server thread attachments to base64 for AI", {
        attachmentCount: attachments.length,
        isIncognito,
      });

      const attachmentMetadata = await Promise.all(
        attachments.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          return {
            id: "", // Will be updated after upload
            url: "", // Will be updated after upload
            filename: file.name,
            mimeType: file.type,
            size: file.size,
            data: buffer.toString("base64"),
          };
        }),
      );

      logger.debug("[Setup] Converted NEW server thread attachments to base64 for AI", {
        attachmentCount: attachmentMetadata.length,
      });

      return {
        attachments: attachmentMetadata,
      };
    }

    return undefined;
  }
}
