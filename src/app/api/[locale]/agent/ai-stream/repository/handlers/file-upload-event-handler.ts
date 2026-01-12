/**
 * FileUploadEventHandler - Handles file upload events in background
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { parseError } from "../../../../shared/utils";
import { createStreamEvent, formatSSEEvent } from "../../events";

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
    controller: ReadableStreamDefaultController;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): void {
    const { fileUploadPromise, userMessageId, controller, encoder, logger } =
      params;

    // Handle file upload promise in background (server threads only)
    // When upload completes, emit FILES_UPLOADED event to update UI
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

            // Emit FILES_UPLOADED event to update UI with attachment metadata
            const filesUploadedEvent = createStreamEvent.filesUploaded({
              messageId: result.userMessageId,
              attachments: result.attachments,
            });

            try {
              controller.enqueue(
                encoder.encode(formatSSEEvent(filesUploadedEvent)),
              );
              logger.info("[File Processing] FILES_UPLOADED event emitted", {
                messageId: result.userMessageId,
                attachmentCount: result.attachments.length,
              });
            } catch (error) {
              logger.error(
                "[File Processing] Failed to emit FILES_UPLOADED event",
                {
                  error: parseError(error),
                  messageId: result.userMessageId,
                },
              );
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
