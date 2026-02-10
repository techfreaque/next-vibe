/**
 * InitialEventsHandler - Handles initial stream events emission
 */

import type { ReadableStreamDefaultController } from "node:stream/web";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { DefaultFolderId } from "../../../chat/config";
import type { ToolCall } from "../../../chat/db";
import type { ChatMessageRole } from "../../../chat/enum";
import { createStreamEvent, formatSSEEvent } from "../../events";

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
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
    toolConfirmationResults: Array<{
      messageId: string;
      sequenceId: string;
      toolCall: ToolCall;
    }>;
    /** Voice transcription metadata (when audio input was transcribed) */
    voiceTranscription?: {
      wasTranscribed: boolean;
      confidence: number | null;
      durationSeconds: number | null;
      creditCost?: number | null;
    } | null;
    /** User message metadata (including attachments) */
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
      controller,
      encoder,
      logger,
      toolConfirmationResults,
      voiceTranscription,
    } = params;

    // Thread is already created client-side before API call
    // No need to emit THREAD_CREATED event (obsolete in Phase 2 architecture)
    logger.debug("Thread handling", {
      threadId,
      isNew: isNewThread,
      note: "Thread already created client-side",
    });

    // Emit VOICE_TRANSCRIBED event if audio was transcribed
    // Voice transcription only happens for "send" operations where userMessageId is not null
    if (voiceTranscription?.wasTranscribed && userMessageId) {
      logger.debug("Emitting VOICE_TRANSCRIBED event", {
        messageId: userMessageId,
        textLength: effectiveContent.length,
        confidence: voiceTranscription.confidence,
      });
      const voiceTranscribedEvent = createStreamEvent.voiceTranscribed({
        messageId: userMessageId,
        text: effectiveContent,
        confidence: voiceTranscription.confidence,
        durationSeconds: voiceTranscription.durationSeconds,
      });
      controller.enqueue(encoder.encode(formatSSEEvent(voiceTranscribedEvent)));
      logger.debug("VOICE_TRANSCRIBED event emitted");

      // Emit CREDITS_DEDUCTED event for STT if credits were consumed
      if (voiceTranscription.creditCost && voiceTranscription.creditCost > 0) {
        const creditEvent = createStreamEvent.creditsDeducted({
          amount: voiceTranscription.creditCost,
          feature: "stt",
          type: "tool",
        });
        controller.enqueue(encoder.encode(formatSSEEvent(creditEvent)));
        logger.debug("CREDITS_DEDUCTED event emitted for STT", {
          amount: voiceTranscription.creditCost,
        });
      }
    }

    // Emit TOOL_RESULT events for batch confirmations to update frontend
    // These are needed to show execution state (success/error) in UI immediately
    if (toolConfirmationResults && toolConfirmationResults.length > 0) {
      logger.debug("✅ Emitting TOOL_RESULT events for batch confirmations", {
        count: toolConfirmationResults.length,
        messageIds: toolConfirmationResults.map((r) => r.messageId),
      });

      // Track message IDs that we've emitted TOOL_RESULT for
      // This prevents duplicate emissions during AI streaming
      const emittedToolResults = new Set<string>();

      for (const result of toolConfirmationResults) {
        const toolResultEvent = createStreamEvent.toolResult({
          messageId: result.messageId,
          toolName: result.toolCall.toolName,
          result: result.toolCall.result,
          error: result.toolCall.error,
          toolCall: result.toolCall,
        });
        controller.enqueue(encoder.encode(formatSSEEvent(toolResultEvent)));
        emittedToolResults.add(result.messageId);

        logger.debug("TOOL_RESULT event emitted for batch confirmation", {
          messageId: result.messageId,
          toolName: result.toolCall.toolName,
          hasResult: !!result.toolCall.result,
          hasError: !!result.toolCall.error,
        });
      }

      // Return this set so it can be used during streaming to prevent duplicate emissions
      return emittedToolResults;
    }
    return undefined;
  }
}
