/**
 * User-message attachment persistence contract.
 *
 * The DB row of a user message NEVER carries file bytes: its
 * `metadata.attachments` holds only id/url/filename/mimeType/size. The base64
 * copy exists in memory for the current AI turn only.
 *
 * The storage upload runs in parallel with the row insert (latency), but the
 * row update that swaps the placeholders for the stored files runs strictly
 * AFTER the insert committed. Before this ordering, a fast upload could finish
 * while the (large) insert was still in flight: the UPDATE matched 0 rows,
 * nothing noticed, and the row kept the inline base64 forever (up to 16 MB of
 * metadata per message on prod, 2026-11).
 */

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

/** Attachment as persisted in `chat_messages.metadata.attachments`. */
export interface StoredAttachment {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

/** In-memory attachment for the current AI turn (carries the bytes). */
export interface InlineAttachment extends StoredAttachment {
  data?: string;
}

export interface AttachmentUploadOutcome {
  success: boolean;
  userMessageId: string;
  attachments?: StoredAttachment[];
}

/** Upload result shape (mirrors ResponseType without importing route code). */
export type AttachmentUploadResult =
  | { success: true; data: StoredAttachment[] }
  | { success: false; message: string };

/**
 * Strip the bytes: what the user-message row may hold while the upload is in
 * flight (or after it failed). Explicit field pick, so no extra key (`data`)
 * can ever ride along into the DB.
 */
export function toStoredAttachments(
  attachments: readonly InlineAttachment[],
): StoredAttachment[] {
  return attachments.map((attachment) => ({
    id: attachment.id,
    url: attachment.url,
    filename: attachment.filename,
    mimeType: attachment.mimeType,
    size: attachment.size,
  }));
}

/**
 * Chain the stored-file swap after BOTH the upload and the row insert.
 *
 * - `uploadPromise` is started by the caller before the insert (parallel).
 * - `rowWritten` resolves once the insert returned (committed).
 * - `persist` writes the stored attachments onto the row and returns the
 *   number of rows it updated; 0 means the row is missing (dropped insert,
 *   deleted thread) and is logged as an error with full context.
 *
 * Never rejects: every failure resolves to `{ success: false }` after an
 * error log carrying messageId, threadId, mime types and sizes.
 */
export function chainAttachmentPersist(params: {
  uploadPromise: Promise<AttachmentUploadResult>;
  rowWritten: Promise<void>;
  persist: (attachments: StoredAttachment[]) => Promise<number>;
  userMessageId: string;
  threadId: string;
  files: ReadonlyArray<{ mimeType: string; size: number }>;
  logger: EndpointLogger;
}): Promise<AttachmentUploadOutcome> {
  const { uploadPromise, rowWritten, persist, userMessageId, threadId, files } =
    params;
  const context = {
    messageId: userMessageId,
    threadId,
    fileCount: files.length,
    mimeTypes: files.map((file) => file.mimeType),
    sizes: files.map((file) => file.size),
  };

  return Promise.all([uploadPromise, rowWritten])
    .then(async ([result]): Promise<AttachmentUploadOutcome> => {
      if (!result.success) {
        params.logger.error(
          "[File Processing] Failed to upload attachments to storage",
          { ...context, errorMessage: result.message },
        );
        return { success: false, userMessageId };
      }
      const updatedRows = await persist(result.data);
      if (updatedRows === 0) {
        params.logger.error(
          "[File Processing] Uploaded attachments but the user message row is missing",
          {
            ...context,
            storedFileIds: result.data.map((attachment) => attachment.id),
          },
        );
        return { success: false, userMessageId };
      }
      return { success: true, userMessageId, attachments: result.data };
    })
    .catch((error): AttachmentUploadOutcome => {
      params.logger.error(
        "[File Processing] Attachment upload or row update threw",
        { ...context, error: parseError(error) },
      );
      return { success: false, userMessageId };
    });
}
