/**
 * InitialEventsHandler - Handles initial stream events emission
 */

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { ToolCall } from "../../../chat/db";
import type { ModelId } from "../../../models/models";
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
    operation: "send" | "retry" | "edit" | "answer-as-ai";
    effectiveParentMessageId: string | null | undefined;
    messageDepth: number;
    effectiveContent: string;
    model: ModelId;
    character: string | null;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
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
      messageDepth,
      effectiveContent,
      model,
      character,
      dbWriter,
      logger,
      voiceTranscription,
      userMessageMetadata,
    } = params;

    // No user message for answer-as-ai
    if (operation === "answer-as-ai") {
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
      parentId: effectiveParentMessageId ?? null,
      depth: messageDepth,
      model,
      character,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    });

    logger.debug("[InitialEvents] Emitted USER MESSAGE_CREATED", {
      messageId: userMessageId,
      isVoiceMode,
      depth: messageDepth,
      parentId: effectiveParentMessageId,
    });

    // If voice was already transcribed before stream started (rare),
    // emit VOICE_TRANSCRIBED immediately so client fills in the content.
    if (voiceTranscription?.wasTranscribed) {
      dbWriter.emitVoiceTranscribed({
        messageId: userMessageId,
        text: effectiveContent,
        confidence: voiceTranscription.confidence,
        durationSeconds: voiceTranscription.durationSeconds,
        creditCost: voiceTranscription.creditCost,
      });
      logger.debug("[InitialEvents] Emitted VOICE_TRANSCRIBED", {
        messageId: userMessageId,
      });
    }
  }
}
