/**
 * Notifications - error events/messages, thread-title updates, voice
 * transcription and file-upload SSE emits with their DB persistence.
 */

import "server-only";

import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import type { ErrorResponseType } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";

import { ChatMessageRole, ThreadStreamingState } from "../../../../chat/enum";
import { MessagesRepository } from "../../../../chat/threads/[threadId]/messages/repository";
import { serializeError } from "../../errors/error-utils";
import type { DbWriterState } from "./shared";
import { buildSseMessageRow } from "./sse-row";

/**
 * Emit a generic SSE error event.
 * @param parentId - Optional parent message ID so the error appears as a child of a specific message (e.g. a failed compacting bubble).
 */
export function emitError(
  w: DbWriterState,
  errorResponse: ErrorResponseType,
  parentId?: string | null,
): void {
  w.deps.wsEmit("error", {
    urlPathParams: { threadId: w.lastThreadId ?? "" },
    responseData: {
      messages: [
        {
          id: crypto.randomUUID(),
          role: ChatMessageRole.ERROR,
          content: errorResponse.message ?? null,
          parentId: parentId ?? null,
          sequenceId: null,
          model: null,
          skill: null,
          metadata: null,
          errorMessage: errorResponse.message ?? null,
          errorCode:
            errorResponse.errorType?.errorCode !== null &&
            errorResponse.errorType?.errorCode !== undefined
              ? String(errorResponse.errorType.errorCode)
              : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
  });
}

/**
 * Emit THREAD_TITLE_UPDATED SSE so the sidebar immediately shows the new title.
 */
export function emitThreadTitleUpdated(
  w: DbWriterState,
  params: { threadId: string; title: string },
): void {
  // Title lives on the thread, not on messages - route directly to sidebar channels.
  w.deps.emitTitle?.(params.threadId, params.title);
}

/**
 * Emit VOICE_TRANSCRIBED SSE and optionally CREDITS_DEDUCTED for STT cost.
 * Also emits THREAD_TITLE_UPDATED when threadId + isNewThread are provided.
 */
export function emitVoiceTranscribed(
  w: DbWriterState,
  params: {
    messageId: string;
    text: string;
    confidence: number | null;
    durationSeconds: number | null;
    creditCost?: number | null;
    user: JwtPayloadType;
    threadId?: string;
    isNewThread?: boolean;
  },
): void {
  w.deps.wsEmit("voice-transcribed", {
    urlPathParams: {
      threadId: params.threadId ?? w.lastThreadId ?? "",
    },
    responseData: {
      messages: [
        {
          id: params.messageId,
          content: params.text,
          metadata: { isTranscribing: false },
        },
      ],
    },
  });
}

/**
 * Emit FILES_UPLOADED SSE event.
 */
export function emitFilesUploaded(
  w: DbWriterState,
  params: {
    threadId: string;
    messageId: string;
    attachments: Array<{
      id: string;
      url: string;
      filename: string;
      mimeType: string;
      size: number;
    }>;
  },
): void {
  w.deps.wsEmit("files-uploaded", {
    urlPathParams: { threadId: params.threadId },
    responseData: {
      messages: [
        {
          id: params.messageId,
          metadata: {
            isUploadingAttachments: false,
            attachments: params.attachments,
          },
        },
      ],
    },
  });
}

/**
 * Emit MESSAGE_CREATED SSE for an ERROR message, save to DB.
 * Used by error handlers to show errors in the chat UI.
 *
 * The MESSAGE_CREATED event is sufficient for the client to display the error bubble.
 * Do NOT emit a trailing ERROR SSE here - that would cause a duplicate message
 * because the client's ERROR handler also creates a new chat message.
 *
 * Pass `content` to override the default serialized ErrorResponseType content.
 * When `content` is a plain translation key string, the bubble renders it without
 * an error type label or error code (clean informational message).
 */
export async function emitErrorMessage(
  w: DbWriterState,
  params: {
    threadId: string;
    errorType: string;
    error: ErrorResponseType;
    parentId: string | null;
    sequenceId: string | null;
    user: JwtPayloadType;
    content?: TranslatedKeyType;
    /** Skip DB write regardless of incognito mode (e.g. credit errors) */
    skipDb?: boolean;
  },
): Promise<void> {
  const { threadId, errorType, error, parentId, sequenceId, user } = params;
  const errorMessageId = crypto.randomUUID();
  const serializedError = params.content ?? serializeError(error);

  // SSE: MESSAGE_CREATED for the error message
  // The client's MESSAGE_CREATED handler adds this to the chat store with the
  // correct parentId/sequenceId - no additional ERROR event needed.
  w.deps.wsEmit("message-created", {
    urlPathParams: { threadId },
    responseData: {
      streamingState: ThreadStreamingState.STREAMING,
      messages: [
        buildSseMessageRow({
          id: errorMessageId,
          threadId,
          role: ChatMessageRole.ERROR,
          content: serializedError,
          parentId,
          sequenceId: sequenceId ?? null,
          authorId: user.id ?? null,
          errorType: errorType ?? null,
        }),
      ],
    },
  });

  // DB: save error message (skip for incognito and for errors that must not persist, e.g. credit errors)
  if (!w.deps.isIncognito && !params.skipDb) {
    await MessagesRepository.createErrorMessage({
      messageId: errorMessageId,
      threadId,
      content: serializedError,
      errorType,
      parentId,
      user,
      sequenceId,
      logger: w.deps.logger,
    });
  }
}
