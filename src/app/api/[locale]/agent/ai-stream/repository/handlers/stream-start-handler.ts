/**
 * StreamStartHandler - Handles stream initialization and setup
 */

import "server-only";

import type { ReadableStreamDefaultController } from "node:stream/web";

import type { ModelMessage } from "ai";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { DefaultFolderId } from "../../../chat/config";
import type { ToolCall } from "../../../chat/db";
import type { ChatMessageRole } from "../../../chat/enum";
import type { TtsVoiceValue } from "../../../text-to-speech/enum";
import type { AiStreamOperation } from "../../definition";
import type { StreamContext } from "../core/stream-context";
import { StreamContextInitializer } from "../core/stream-context-initializer";
import { createStreamingTTSHandler, type StreamingTTSHandler } from "../streaming-tts";
import { FileUploadEventHandler } from "./file-upload-event-handler";
import { InitialEventsHandler } from "./initial-events-handler";

export class StreamStartHandler {
  /**
   * Initialize stream context, TTS handler, and emit initial events
   */
  static initializeStream(params: {
    userMessageId: string | null;
    effectiveParentMessageId: string | null | undefined;
    messageDepth: number;
    toolConfirmationResults: Array<{
      messageId: string;
      sequenceId: string;
      toolCall: ToolCall;
    }>;
    voiceMode:
      | {
          enabled: boolean;
          voice: typeof TtsVoiceValue;
        }
      | null
      | undefined;
    voiceTranscription:
      | {
          wasTranscribed: boolean;
          confidence: number | null;
          durationSeconds: number | null;
        }
      | null
      | undefined;
    userMessageMetadata:
      | {
          attachments?: Array<{
            id: string;
            url: string;
            filename: string;
            mimeType: string;
            size: number;
            data?: string;
          }>;
        }
      | undefined;
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
    isNewThread: boolean;
    threadId: string;
    rootFolderId: DefaultFolderId;
    subFolderId: string | undefined;
    effectiveContent: string;
    operation: AiStreamOperation;
    effectiveRole: ChatMessageRole;
    messages: ModelMessage[];
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    locale: CountryLanguage;
    userId: string | undefined;
    logger: EndpointLogger;
  }): {
    ctx: StreamContext;
    ttsHandler: StreamingTTSHandler | null;
    emittedToolResultIds: Set<string> | undefined;
  } {
    const {
      userMessageId,
      effectiveParentMessageId,
      messageDepth,
      toolConfirmationResults,
      voiceMode,
      voiceTranscription,
      userMessageMetadata,
      fileUploadPromise,
      isNewThread,
      threadId,
      rootFolderId,
      subFolderId,
      effectiveContent,
      operation,
      effectiveRole,
      messages,
      controller,
      encoder,
      locale,
      userId,
      logger,
    } = params;

    // Initialize stream context
    const ctx = StreamContextInitializer.initializeContext({
      userMessageId,
      effectiveParentMessageId,
      messageDepth,
      toolConfirmationResults,
      logger,
    });

    // Create streaming TTS handler if voice mode enabled
    let ttsHandler: StreamingTTSHandler | null = null;
    if (voiceMode?.enabled) {
      ttsHandler = createStreamingTTSHandler({
        controller,
        encoder,
        logger,
        locale,
        voice: voiceMode.voice,
        userId,
        enabled: true,
      });
      logger.info("[AI Stream] Voice mode enabled - streaming TTS active", {
        voice: voiceMode.voice,
        enabled: voiceMode.enabled,
      });
    }

    // Emit initial events and capture which tool results were already emitted
    // This prevents duplicate TOOL_RESULT emissions during streaming
    const emittedToolResultIds = InitialEventsHandler.emitInitialEvents({
      isNewThread,
      threadId,
      rootFolderId,
      subFolderId: subFolderId || null,
      // Use effectiveContent for thread title (includes transcribed text for voice input)
      content: effectiveContent,
      operation,
      userMessageId,
      effectiveRole,
      effectiveParentMessageId,
      messageDepth,
      effectiveContent,
      toolConfirmationResults,
      voiceTranscription,
      userMessageMetadata,
      controller,
      encoder,
      logger,
    });

    // Handle file upload promise in background (server threads only)
    FileUploadEventHandler.attachFileUploadListener({
      fileUploadPromise,
      userMessageId,
      controller,
      encoder,
      logger,
    });

    // Log message structure being sent to AI SDK
    logger.info("[AI Stream] Messages structure for AI SDK", {
      messageCount: messages.length,
      messageRoles: messages.map((m, i) => `${i}:${m.role}`).join(", "),
      lastFiveMessages: messages.slice(-5).map((m, i) => ({
        idx: messages.length - 5 + i,
        role: m.role,
        contentType: typeof m.content,
        contentPreview:
          typeof m.content === "string"
            ? m.content.slice(0, 80)
            : Array.isArray(m.content)
              ? `${m.content.length} parts: ${m.content.map((p) => ("type" in p ? p.type : "unknown")).join(",")}`
              : "unknown",
      })),
    });

    return {
      ctx,
      ttsHandler,
      emittedToolResultIds,
    };
  }
}
