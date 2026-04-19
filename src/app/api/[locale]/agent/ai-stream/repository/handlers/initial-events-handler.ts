/**
 * InitialEventsHandler - Handles initial stream events emission
 */

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { ToolCall } from "../../../chat/db";
import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import type { MessageDbWriter } from "../core/message-db-writer";

export class InitialEventsHandler {
  /**
   * Emit TOOL_RESULT events for batch confirmations.
   * Returns the set of emitted message IDs, or undefined if no confirmations.
   * Called immediately on stream start, before the compacting check.
   */
  static emitToolConfirmations(params: {
    threadId: string;
    isNewThread: boolean;
    toolConfirmationResults: Array<{
      messageId: string;
      sequenceId: string;
      toolCall: ToolCall;
    }>;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
  }): Set<string> | undefined {
    const { threadId, isNewThread, toolConfirmationResults, dbWriter, logger } =
      params;

    // Thread is already created client-side before API call
    logger.debug("Thread handling", {
      threadId,
      isNew: isNewThread,
      note: "Thread already created client-side",
    });

    if (!toolConfirmationResults || toolConfirmationResults.length === 0) {
      return undefined;
    }

    logger.debug("✅ Emitting TOOL_RESULT events for batch confirmations", {
      count: toolConfirmationResults.length,
      messageIds: toolConfirmationResults.map((r) => r.messageId),
    });

    const emitted = dbWriter.emitBatchToolResults(
      toolConfirmationResults.map((r) => ({
        messageId: r.messageId,
        toolCall: r.toolCall,
      })),
    );

    for (const r of toolConfirmationResults) {
      logger.debug("TOOL_RESULT event emitted for batch confirmation", {
        messageId: r.messageId,
        toolName: r.toolCall.toolName,
        hasResult: !!r.toolCall.result,
        hasError: !!r.toolCall.error,
      });
    }

    return emitted;
  }

  /**
   * Emit USER MESSAGE_CREATED SSE for a non-compacting stream.
   *
   * Called AFTER shouldTriggerCompacting() returns false, so the parentId is
   * always the true branch parent and the event arrives in correct order.
   *
   * For compacting streams, CompactingHandler emits the user message instead,
   * after the compacting MESSAGE_CREATED, so the chain is always:
   *   compacting → user → AI
   *
   * Voice (STT) mode: emits with empty content + isTranscribing metadata so
   * the UI shows a pending transcription bubble right away.
   */
  static emitUserMessage(params: {
    userMessageId: string;
    threadId: string;
    operation: "send" | "retry" | "edit" | "answer-as-ai" | "wakeup-resume";
    effectiveParentMessageId: string | null | undefined;
    effectiveContent: string;
    model: ChatModelId;
    skill: string | null;
    user: JwtPayloadType;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
    isNewThread?: boolean;
    voiceTranscription?: {
      wasTranscribed: boolean;
      confidence: number | null;
      durationSeconds: number | null;
      creditCost?: number | null;
    } | null;
    userMessageMetadata?: {
      attachments?: Array<{
        id: string;
        url: string;
        filename: string;
        mimeType: string;
        size: number;
        data?: string;
      }>;
    };
  }): void {
    const {
      userMessageId,
      threadId,
      operation,
      effectiveParentMessageId,
      effectiveContent,
      model,
      skill,
      user,
      dbWriter,
      logger,
      isNewThread,
      voiceTranscription,
      userMessageMetadata,
    } = params;

    // No user message for answer-as-ai or wakeup-resume
    if (operation === "answer-as-ai" || operation === "wakeup-resume") {
      return;
    }

    // audio submitted but not yet transcribed
    const isVoiceMode =
      voiceTranscription === undefined || voiceTranscription === null
        ? false
        : !voiceTranscription.wasTranscribed;

    const metadata: Record<string, boolean | number | string | undefined> = {};
    if (isVoiceMode) {
      metadata["isTranscribing"] = true;
    }
    if (userMessageMetadata?.attachments?.length) {
      metadata["isUploadingAttachments"] = true;
    }

    dbWriter.emitUserMessageCreated({
      messageId: userMessageId,
      threadId,
      content: isVoiceMode ? "" : effectiveContent,
      parentId: effectiveParentMessageId || null,
      model,
      skill: skill,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    });

    logger.debug("[InitialEvents] Emitted USER MESSAGE_CREATED", {
      messageId: userMessageId,
      isVoiceMode,
      parentId: effectiveParentMessageId,
    });

    // For new threads in non-voice mode, emit title update immediately so sidebar
    // updates without waiting for a full refetch.
    if (
      isNewThread &&
      !isVoiceMode &&
      effectiveContent &&
      operation === "send"
    ) {
      dbWriter.emitThreadTitleUpdated({
        threadId,
        title: effectiveContent.slice(0, 50),
      });
      logger.debug("[InitialEvents] Emitted THREAD_TITLE_UPDATED", {
        threadId,
      });
    }

    // If voice was already transcribed before stream started (rare),
    // emit VOICE_TRANSCRIBED immediately so client fills in the content.
    if (voiceTranscription?.wasTranscribed) {
      dbWriter.emitVoiceTranscribed({
        messageId: userMessageId,
        text: effectiveContent,
        confidence: voiceTranscription.confidence,
        durationSeconds: voiceTranscription.durationSeconds,
        creditCost: voiceTranscription.creditCost,
        user,
        threadId,
        isNewThread,
      });
      logger.debug("[InitialEvents] Emitted VOICE_TRANSCRIBED", {
        messageId: userMessageId,
      });
    }
  }
}
