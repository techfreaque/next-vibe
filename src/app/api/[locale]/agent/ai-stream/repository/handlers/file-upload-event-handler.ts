/**
 * FileUploadEventHandler - Handles file upload events in background
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { parseError } from "../../../../shared/utils";
import type { MessageDbWriter } from "../core/message-db-writer";

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
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
  }): void {
    const { fileUploadPromise, userMessageId, dbWriter, logger } = params;

    if (fileUploadPromise && userMessageId) {
      void fileUploadPromise
        .then((result) => {
          if (result.success && result.attachments) {
            logger.info(
              "[File Processing] File upload completed - emitting FILES_UPLOADED event",
              {
                messageId: result.userMessageId,
                attachmentCount: result.attachments.length,
              },
            );

            dbWriter.emitFilesUploaded({
              messageId: result.userMessageId,
              attachments: result.attachments,
            });

            logger.info("[File Processing] FILES_UPLOADED event emitted", {
              messageId: result.userMessageId,
              attachmentCount: result.attachments.length,
            });
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
