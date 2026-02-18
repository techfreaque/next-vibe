/**
 * InitialEventsHandler - Handles initial stream events emission
 */

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { DefaultFolderId } from "../../../chat/config";
import type { ToolCall } from "../../../chat/db";
import type { ChatMessageRole } from "../../../chat/enum";
import type { MessageDbWriter } from "../core/message-db-writer";

export class InitialEventsHandler {
  /**
   * Emit initial stream events (thread creation and user message)
   */
  static emitInitialEvents(params: {
    isNewThread: boolean;
    threadId: string;
    rootFolderId: DefaultFolderId;
    subFolderId: string | null;
    content: string;
    operation: "send" | "retry" | "edit" | "answer-as-ai";
    userMessageId: string | null;
    effectiveRole: ChatMessageRole;
    effectiveParentMessageId: string | null | undefined;
    messageDepth: number;
    effectiveContent: string;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
    toolConfirmationResults: Array<{
      messageId: string;
      sequenceId: string;
      toolCall: ToolCall;
    }>;
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
  }): Set<string> | undefined {
    const {
      isNewThread,
      threadId,
      userMessageId,
      effectiveContent,
      dbWriter,
      logger,
      toolConfirmationResults,
      voiceTranscription,
    } = params;

    // Thread is already created client-side before API call
    logger.debug("Thread handling", {
      threadId,
      isNew: isNewThread,
      note: "Thread already created client-side",
    });

    // Emit VOICE_TRANSCRIBED + optional CREDITS_DEDUCTED for STT
    if (voiceTranscription?.wasTranscribed && userMessageId) {
      logger.debug("Emitting VOICE_TRANSCRIBED event", {
        messageId: userMessageId,
        textLength: effectiveContent.length,
        confidence: voiceTranscription.confidence,
      });

      dbWriter.emitVoiceTranscribed({
        messageId: userMessageId,
        text: effectiveContent,
        confidence: voiceTranscription.confidence,
        durationSeconds: voiceTranscription.durationSeconds,
        creditCost: voiceTranscription.creditCost,
      });

      logger.debug("VOICE_TRANSCRIBED event emitted");
    }

    // Emit TOOL_RESULT events for batch confirmations
    if (toolConfirmationResults && toolConfirmationResults.length > 0) {
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

    return undefined;
  }
}
