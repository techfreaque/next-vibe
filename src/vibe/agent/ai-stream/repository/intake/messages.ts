/**
 * AI Stream user-message intake — operation processing (incl. audio
 * transcription) and user-message creation with attachments.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRepository } from "next-vibe/identity/user/repository";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ToolExecutionContext } from "../../../../core/execution-context";
import type { DefaultFolderId } from "../../../../core/execution-context";
import type { ChatMessageRole } from "../../../chat/enum";
import { MessagesRepository } from "../../../chat/threads/[threadId]/messages/repository";
import type { SttModelSelection } from "../../../speech-to-text/models";
import { SpeechToTextRepository } from "../../../speech-to-text/repository";
import type { AiStreamPostRequestOutput } from "../../stream/definition";
import type { AiStreamT } from "../../stream/i18n";
import { FileAttachmentHandler } from "../handlers/attachments";
import {
  type AttachmentUploadOutcome,
  type AttachmentUploadResult,
  chainAttachmentPersist,
  type InlineAttachment,
  toStoredAttachments,
} from "./attachment-upload";

/**
 * Process operation and handle audio transcription if present.
 */
export async function processOperation(params: {
  operation: AiStreamPostRequestOutput["operation"];
  data: AiStreamPostRequestOutput;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  sttModelSelection: SttModelSelection | null;
  /** Fixture thread id of the calling stream — the STT call binds it. */
  toolExecutionContext: ToolExecutionContext;
}): Promise<
  ResponseType<{
    threadId: string;
    parentMessageId: string | null | undefined;
    content: string;
    role: ChatMessageRole;
    voiceTranscription: {
      wasTranscribed: boolean;
      confidence: number | null;
      durationSeconds: number | null;
      creditCost: number | null; // STT credit cost for event emission
    } | null;
  }>
> {
  const {
    operation,
    data,
    user,
    locale,
    logger,
    sttModelSelection,
    toolExecutionContext,
  } = params;

  let voiceTranscription: {
    wasTranscribed: boolean;
    confidence: number | null;
    durationSeconds: number | null;
    creditCost: number | null;
  } | null = null;

  let operationResult: {
    threadId: string;
    parentMessageId: string | null | undefined;
    content: string;
    role: ChatMessageRole;
  };

  switch (operation) {
    case "send":
    case "retry":
    case "edit":
      // Audio input transcription
      if (data.audioInput?.file) {
        logger.debug("[Setup] Audio input detected, transcribing...", {
          operation,
          fileSize: data.audioInput.file.size,
          fileType: data.audioInput.file.type,
        });

        const transcriptionResult =
          await SpeechToTextRepository.transcribeAudio(
            [data.audioInput.file],
            user,
            locale,
            logger,
            sttModelSelection,
            toolExecutionContext,
          );

        if (!transcriptionResult.success) {
          // 4xx = the recording itself (empty / too short): the user gets a
          // clear message and the STT layer already logged it. Provider and
          // server failures (5xx) stay errors.
          const sttErrorCode = transcriptionResult.errorType?.errorCode ?? 500;
          const setupMeta = {
            error: transcriptionResult.message,
            errorType: sttErrorCode,
            operation,
            fileSize: data.audioInput.file.size,
            fileType: data.audioInput.file.type,
          };
          if (
            sttErrorCode < 500 &&
            data.audioInput.file.size < SpeechToTextRepository.MIN_AUDIO_BYTES
          ) {
            // One row per rejected recording: the STT layer's warn ("[STT]
            // Recording empty or too short", same requestId) already holds
            // the sizes and mime types (prod 2026-11-27: 2 rows per tap).
            logger.debug(
              "[Setup] Audio transcription refused (reported by STT)",
              setupMeta,
            );
          } else {
            // Provider and server failures (5xx) stay errors; other 4xx
            // refusals (e.g. insufficient credits) are logged by STT too.
            (sttErrorCode >= 500 ? logger.error : logger.warn).bind(logger)(
              "[Setup] Audio transcription failed",
              setupMeta,
            );
          }
          return transcriptionResult;
        }

        const transcribedText = transcriptionResult.data.response.text;
        const confidence = transcriptionResult.data.response.confidence ?? null;
        const creditCost = transcriptionResult.data.creditCost ?? null;
        logger.debug("[Setup] Audio transcription successful", {
          textLength: transcribedText.length,
          confidence,
          creditCost,
        });

        // Store transcription metadata for VOICE_TRANSCRIBED event and credit emission
        voiceTranscription = {
          wasTranscribed: true,
          confidence,
          durationSeconds: null, // STT response doesn't expose duration here
          creditCost, // Track STT credit cost for CREDITS_DEDUCTED event
        };

        // Use transcribed text as content
        operationResult = {
          threadId: data.threadId,
          parentMessageId: data.parentMessageId,
          content: transcribedText,
          role: data.role,
        };
      } else {
        // No audio - use provided content
        operationResult = {
          threadId: data.threadId,
          parentMessageId: data.parentMessageId,
          content: data.content,
          role: data.role,
        };
      }
      break;

    case "answer-as-ai":
      operationResult = {
        threadId: data.threadId,
        parentMessageId: data.parentMessageId,
        content: data.content,
        role: data.role,
      };
      logger.debug("Answer-as-AI operation", {
        threadId: data.threadId,
        parentMessageId: data.parentMessageId,
      });
      break;

    case "wakeup-resume":
      operationResult = {
        threadId: data.threadId,
        parentMessageId: data.parentMessageId,
        content: data.content,
        role: data.role,
      };
      logger.debug("WakeUp-Resume operation", {
        threadId: data.threadId,
        parentMessageId: data.parentMessageId,
      });
      break;
  }

  return {
    success: true,
    data: {
      threadId: operationResult.threadId,
      parentMessageId: operationResult.parentMessageId,
      content: operationResult.content,
      role: operationResult.role,
      voiceTranscription,
    },
  };
}
/**
 * Create user message with optional file attachments.
 */
export async function createUserMessageWithAttachments(params: {
  userMessageId: string | null;
  operation: "send" | "retry" | "edit" | "answer-as-ai" | "wakeup-resume";
  hasToolConfirmations: boolean;
  isIncognito: boolean;
  threadId: string;
  rootFolderId: DefaultFolderId;
  effectiveRole: ChatMessageRole;
  effectiveContent: string;
  effectiveParentMessageId: string | null | undefined;
  userId: string | undefined;
  user: JwtPayloadType;
  attachments?: File[];
  logger: EndpointLogger;
  t: AiStreamT;
  /** Fixture chain — used to embed the user message at write time. */
  toolExecutionContext?: ToolExecutionContext;
}): Promise<
  ResponseType<{
    userMessageId: string | null;
    /**
     * The parentId the user-message ROW actually received (createUserMessage
     * falls back to the last committed message when the requested parent was
     * never committed). Emits and downstream chain logic must use THIS.
     */
    resolvedParentMessageId?: string | null;
    fileUploadPromise?: Promise<AttachmentUploadOutcome>;
    /** Fired user-message embed — awaited by the cortex search, not by callers. */
    userEmbedPromise?: Promise<void>;
    attachmentMetadata?: InlineAttachment[];
  }>
> {
  const {
    userMessageId,
    operation,
    hasToolConfirmations,
    isIncognito,
    threadId,
    rootFolderId,
    effectiveRole,
    effectiveContent,
    effectiveParentMessageId,
    userId,
    attachments,
    logger,
    t,
  } = params;

  // For "answer-as-ai" and "wakeup-resume", we don't create a user message
  if (operation === "answer-as-ai" || operation === "wakeup-resume") {
    logger.debug("[Setup] ✅ SKIPPING user message creation", {
      operation,
      reason: "no user message for this operation",
    });
    return success({ userMessageId: null });
  }

  // For tool confirmations, we don't create a user message
  if (hasToolConfirmations) {
    logger.debug(
      "[Setup] ✅ SKIPPING user message creation for tool confirmations",
      {
        count: hasToolConfirmations,
        operation,
      },
    );
    return success({ userMessageId });
  }

  logger.debug("[Setup] Creating user message", {
    messageId: userMessageId,
    operation,
    threadId,
  });

  // User message should NOT be in messageHistory for incognito - client creates it with loading state
  // Both modes: API processes voice/attachments and emits events to update the loading message

  // At this point, userMessageId should not be null
  if (!userMessageId) {
    logger.error("userMessageId is required for user message creation");
    return fail({
      message: t("route.errors.invalidJson"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  const authorName = isIncognito
    ? null
    : await UserRepository.getUserPublicName(userId, logger);

  let fileUploadPromise: Promise<AttachmentUploadOutcome> | undefined;

  // In-memory copy WITH the bytes: the current AI turn reads it directly.
  // The DB row only ever gets the byte-free placeholders (toStoredAttachments).
  let attachmentMetadata: InlineAttachment[] = [];

  // Upload started BEFORE the insert (parallel), resolved into the row swap
  // only AFTER the insert returned (chainAttachmentPersist).
  let uploadPromise: Promise<AttachmentUploadResult> | undefined;

  // Process attachments (both modes)
  if (attachments && attachments.length > 0) {
    logger.debug("[File Processing] Processing file attachments", {
      fileCount: attachments.length,
      isIncognito,
    });

    // Convert to base64 immediately for AI (both modes)
    attachmentMetadata = await Promise.all(
      attachments.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return {
          id: "", // Replaced by the stored file id after upload (server mode)
          url: "", // Replaced by the stored file url after upload (server mode)
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          data: buffer.toString("base64"), // For immediate AI use, never persisted
        };
      }),
    );

    // Server mode: Upload to storage in background
    if (!isIncognito) {
      uploadPromise = FileAttachmentHandler.processFileAttachments({
        attachments,
        threadId,
        userMessageId,
        userId,
        logger,
        t,
      });
    }
  }

  // Create user message in DB (server mode only - incognito stores in localStorage)
  let resolvedParentMessageId: string | null = effectiveParentMessageId || null;
  // Fired user-message embed — awaited later by the cortex search, not here.
  let userEmbedPromise: Promise<void> = Promise.resolve();
  if (!isIncognito) {
    const insertPromise = MessagesRepository.createUserMessage({
      messageId: userMessageId,
      threadId,
      rootFolderId,
      role: effectiveRole,
      content: effectiveContent,
      parentId: effectiveParentMessageId || null,
      userId,
      user: params.user,
      authorName,
      logger,
      toolExecutionContext: params.toolExecutionContext,
      attachments:
        attachmentMetadata.length > 0
          ? toStoredAttachments(attachmentMetadata)
          : undefined,
    });
    if (uploadPromise) {
      fileUploadPromise = chainAttachmentPersist({
        uploadPromise,
        rowWritten: insertPromise.then(() => undefined),
        persist: (stored) =>
          FileAttachmentHandler.updateMessageWithAttachments({
            userMessageId,
            attachments: stored,
            logger,
          }),
        userMessageId,
        threadId,
        files: attachmentMetadata,
        logger,
      });
    }
    const { resolvedParentId, embedPromise } = await insertPromise;
    resolvedParentMessageId = resolvedParentId;
    userEmbedPromise = embedPromise;
  }

  return success({
    userMessageId,
    resolvedParentMessageId,
    fileUploadPromise,
    userEmbedPromise,
    attachmentMetadata:
      attachmentMetadata.length > 0 ? attachmentMetadata : undefined,
  });
}
