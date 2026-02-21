/**
 * StreamStartHandler - Handles stream initialization and setup
 */

import "server-only";

import type { ReadableStreamDefaultController } from "node:stream/web";

import type { ModelMessage } from "ai";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ToolCall } from "../../../chat/db";
import type { TtsVoiceValue } from "../../../text-to-speech/enum";
import type { StreamContext } from "../core/stream-context";
import { StreamContextInitializer } from "../core/stream-context-initializer";
import {
  createStreamingTTSHandler,
  type StreamingTTSHandler,
} from "../streaming-tts";
import { FileUploadEventHandler } from "./file-upload-event-handler";
import { InitialEventsHandler } from "./initial-events-handler";

export class StreamStartHandler {
  /**
   * Initialize stream context, TTS handler, and emit tool confirmation events.
   *
   * User MESSAGE_CREATED is NOT emitted here — it happens in index.ts after
   * the compacting check so event ordering is always correct:
   *   [compacting →] user → AI
   */
  static initializeStream(params: {
    userMessageId: string | null;
    aiMessageId: string;
    effectiveParentMessageId: string | null | undefined;
    messageDepth: number;
    isHeadless?: boolean;
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
    isIncognito: boolean;
    threadId: string;
    messages: ModelMessage[];
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    locale: CountryLanguage;
    user: JwtPayloadType;
    logger: EndpointLogger;
  }): {
    ctx: StreamContext;
    ttsHandler: StreamingTTSHandler | null;
    emittedToolResultIds: Set<string> | undefined;
  } {
    const {
      userMessageId,
      aiMessageId,
      effectiveParentMessageId,
      messageDepth,
      isHeadless,
      toolConfirmationResults,
      voiceMode,
      fileUploadPromise,
      isNewThread,
      isIncognito,
      threadId,
      messages,
      controller,
      encoder,
      locale,
      user,
      logger,
    } = params;

    // Initialize stream context (creates MessageDbWriter with controller + encoder)
    const ctx = StreamContextInitializer.initializeContext({
      userMessageId,
      effectiveParentMessageId,
      messageDepth,
      toolConfirmationResults,
      aiMessageId,
      isIncognito,
      isHeadless,
      logger,
      controller,
      encoder,
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
        user,
        enabled: true,
      });
      logger.info("[AI Stream] Voice mode enabled - streaming TTS active", {
        voice: voiceMode.voice,
        enabled: voiceMode.enabled,
      });
    }

    // Emit tool confirmation results immediately (before compacting check).
    // User MESSAGE_CREATED is emitted in index.ts after shouldTriggerCompacting().
    const emittedToolResultIds = InitialEventsHandler.emitToolConfirmations({
      threadId,
      isNewThread,
      toolConfirmationResults,
      dbWriter: ctx.dbWriter,
      logger,
    });

    // Handle file upload promise in background
    FileUploadEventHandler.attachFileUploadListener({
      fileUploadPromise,
      userMessageId,
      dbWriter: ctx.dbWriter,
      logger,
    });

    // Log message structure being sent to AI SDK
    logger.debug("[AI Stream] Messages structure for AI SDK", {
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
