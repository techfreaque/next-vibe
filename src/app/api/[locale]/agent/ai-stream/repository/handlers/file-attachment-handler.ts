/**
 * FileAttachmentHandler - Handles file attachment processing and upload
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { db } from "../../../../system/db";
import { chatMessages } from "../../../chat/db";

export class FileAttachmentHandler {
  /**
   * Process and upload file attachments to storage adapter
   * Validates file types and uploads files in parallel
   */
  static async processFileAttachments(params: {
    attachments: File[];
    threadId: string;
    userMessageId: string;
    userId: string | undefined;
    logger: EndpointLogger;
  }): Promise<
    ResponseType<
      Array<{
        id: string;
        url: string;
        filename: string;
        mimeType: string;
        size: number;
      }>
    >
  > {
    const { attachments, threadId, userMessageId, userId, logger } = params;

    const { getStorageAdapter } = await import("../../../chat/storage");
    const { isAllowedFileType } =
      await import("../../../chat/incognito/file-utils");
    const storage = getStorageAdapter();

    logger.debug("[File Processing] Uploading file attachments to storage", {
      fileCount: attachments.length,
    });

    const processedAttachments: Array<{
      id: string;
      url: string;
      filename: string;
      mimeType: string;
      size: number;
    }> = [];

    for (const file of attachments) {
      // Validate file type
      if (!isAllowedFileType(file.type)) {
        logger.error("[File Processing] File type not allowed", {
          filename: file.name,
          mimeType: file.type,
        });
        return fail({
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          message: "app.api.shared.errorTypes.validation_error",
          messageParams: {
            issue: `File type not allowed: ${file.type}`,
          },
        });
      }

      const result = await storage.uploadFile(file, {
        filename: file.name,
        mimeType: file.type,
        threadId,
        messageId: userMessageId,
        userId,
      });
      processedAttachments.push({
        id: result.fileId,
        url: result.url,
        filename: result.metadata.originalFilename,
        mimeType: result.metadata.mimeType,
        size: result.metadata.size,
      });
    }

    logger.debug("[File Processing] File attachments uploaded successfully", {
      uploadedCount: processedAttachments.length,
    });

    return {
      success: true,
      data: processedAttachments,
    };
  }

  /**
   * Update message with attachment URLs after upload completes
   */
  static async updateMessageWithAttachments(params: {
    userMessageId: string;
    attachments: Array<{
      id: string;
      url: string;
      filename: string;
      mimeType: string;
      size: number;
    }>;
    logger: EndpointLogger;
  }): Promise<void> {
    const { userMessageId, attachments, logger } = params;

    await db
      .update(chatMessages)
      .set({
        metadata: {
          attachments,
        },
      })
      .where(eq(chatMessages.id, userMessageId));

    logger.debug("[File Processing] Message updated with attachments", {
      messageId: userMessageId,
      attachmentCount: attachments.length,
    });
  }
}
