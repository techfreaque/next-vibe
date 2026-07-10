/**
 * Attachments — file upload/storage, upload-completion events, and document
 * text extraction for AI context. Merged from file-attachment-handler,
 * file-upload-event-handler and document-extractor (one concern, one file).
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { db } from "../../../../system/database";
import { chatMessages } from "../../../chat/db";
import type { AiStreamT } from "../../stream/i18n";
import type { MessageDbWriter } from "../core/message-db-writer";

// ============================================================================
// FILE-ATTACHMENT-HANDLER
// ============================================================================

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
    t: AiStreamT;
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
    const { attachments, threadId, userMessageId, userId, logger, t } = params;

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
          message: t("route.errors.invalidRequestData"),
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

// ============================================================================
// FILE-UPLOAD-EVENT-HANDLER
// ============================================================================

export class FileUploadEventHandler {
  /**
   * Handle file upload promise in background and emit FILES_UPLOADED event when complete
   */
  static attachFileUploadListener(params: {
    fileUploadPromise:
      | Promise<{
          success: boolean;
          userMessageId: string;
          attachments?: Array<{
            id: string;
            url: string;
            filename: string;
            mimeType: string;
            size: number;
          }>;
        }>
      | undefined;
    userMessageId: string | null;
    userId: string | undefined;
    threadId: string;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
  }): void {
    const {
      fileUploadPromise,
      userMessageId,
      userId,
      threadId,
      dbWriter,
      logger,
    } = params;

    if (fileUploadPromise && userMessageId) {
      void fileUploadPromise
        .then((result) => {
          if (result.success && result.attachments) {
            logger.debug(
              "[File Processing] File upload completed - emitting FILES_UPLOADED event",
              {
                messageId: result.userMessageId,
                attachmentCount: result.attachments.length,
              },
            );

            dbWriter.emitFilesUploaded({
              threadId,
              messageId: result.userMessageId,
              attachments: result.attachments,
            });

            logger.debug("[File Processing] FILES_UPLOADED event emitted", {
              messageId: result.userMessageId,
              attachmentCount: result.attachments.length,
            });

            // Fire-and-forget: sync upload to cortex_nodes for vector search
            if (userId && result.attachments?.length) {
              void dbWriter
                .syncUploadEmbedding(userId, threadId, result.attachments)
                .catch(() => undefined);
            }
          } else {
            logger.warn(
              "[File Processing] File upload failed - no event emitted",
              {
                messageId: result.userMessageId,
                success: result.success,
              },
            );
          }
          return undefined;
        })
        .catch((error) => {
          logger.error("[File Processing] File upload promise rejected", {
            error: parseError(error),
            messageId: userMessageId,
          });
        });
    }
  }
}

// ============================================================================
// DOCUMENT-EXTRACTOR
// ============================================================================

/**
 * Extract text from a PDF buffer.
 */
async function extractPdfText(
  buffer: Buffer,
  logger: EndpointLogger,
): Promise<string | null> {
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();
    await parser.destroy();
    return result.text?.trim() || null;
  } catch (error) {
    logger.error("[DocumentExtractor] PDF extraction failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Extract text from a DOCX buffer.
 */
async function extractDocxText(
  buffer: Buffer,
  logger: EndpointLogger,
): Promise<string | null> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value?.trim() || null;
  } catch (error) {
    logger.error("[DocumentExtractor] DOCX extraction failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Extract text from an XLSX buffer (CSV-like output per sheet).
 */
async function extractXlsxText(
  buffer: Buffer,
  logger: EndpointLogger,
): Promise<string | null> {
  try {
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheets: string[] = [];
    for (const name of workbook.SheetNames) {
      const sheet = workbook.Sheets[name];
      if (sheet) {
        const csv = XLSX.utils.sheet_to_csv(sheet);
        if (csv.trim()) {
          sheets.push(`[Sheet: ${name}]\n${csv}`);
        }
      }
    }
    return sheets.length > 0 ? sheets.join("\n\n") : null;
  } catch (error) {
    logger.error("[DocumentExtractor] XLSX extraction failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/** MIME types that can be extracted as documents */
// Legacy .doc (application/msword, OLE binary) is intentionally ABSENT:
// mammoth parses only DOCX, so claiming support meant a guaranteed-failing
// extraction. Unsupported formats take the explicit "couldn't read" path.
const DOCUMENT_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
]);

/**
 * Check if a MIME type is a supported document format.
 */
export function isDocumentMimeType(mimeType: string): boolean {
  return DOCUMENT_MIME_TYPES.has(mimeType);
}

/**
 * Extract text from a document buffer based on MIME type.
 */
export async function extractDocumentText(
  buffer: Buffer,
  mimeType: string,
  logger: EndpointLogger,
): Promise<string | null> {
  switch (mimeType) {
    case "application/pdf":
      return extractPdfText(buffer, logger);
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return extractDocxText(buffer, logger);
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    case "application/vnd.ms-excel":
      return extractXlsxText(buffer, logger);
    default:
      return null;
  }
}
