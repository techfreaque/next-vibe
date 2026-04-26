/**
 * StreamStartHandler - Handles stream initialization and setup
 */

import "server-only";

import type { ModelMessage, ToolResultPart } from "ai";

import type { VoiceModelSelection } from "@/app/api/[locale]/agent/text-to-speech/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ToolCall } from "../../../chat/db";
import type { WsEmitCallback } from "../../../chat/threads/[threadId]/messages/emitter";
import type { EmitThreadTitleFn } from "../core/message-db-writer";
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
   * User MESSAGE_CREATED is NOT emitted here - it happens in index.ts after
   * the compacting check so event ordering is always correct:
   *   [compacting →] user → AI
   */
  static initializeStream(params: {
    userMessageId: string | null;
    aiMessageId: string;
    effectiveParentMessageId: string | null | undefined;
    toolConfirmationResults: Array<{
      messageId: string;
      sequenceId: string;
      toolCall: ToolCall;
    }>;
    voiceMode:
      | {
          enabled: boolean;
          voiceModelSelection: VoiceModelSelection;
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
    locale: CountryLanguage;
    user: JwtPayloadType;
    logger: EndpointLogger;
    wsEmit: WsEmitCallback;
    emitTitle: EmitThreadTitleFn;
    /** Force a specific sequenceId - used by wakeUp revival to share sequence with deferred tool pair */
    sequenceIdOverride?: string;
  }): {
    ctx: StreamContext;
    ttsHandler: StreamingTTSHandler | null;
    emittedToolResultIds: Set<string> | undefined;
  } {
    const {
      userMessageId,
      aiMessageId,
      effectiveParentMessageId,
      toolConfirmationResults,
      voiceMode,
      fileUploadPromise,
      isNewThread,
      isIncognito,
      threadId,
      messages,
      locale,
      user,
      logger,
      wsEmit,
      emitTitle,
      sequenceIdOverride,
    } = params;

    // Initialize stream context (creates MessageDbWriter with controller + encoder)
    const ctx = StreamContextInitializer.initializeContext({
      userMessageId,
      effectiveParentMessageId,
      toolConfirmationResults,
      aiMessageId,
      isIncognito,
      logger,
      locale,
      wsEmit,
      emitTitle,
      sequenceIdOverride,
    });

    // Pre-set stepHasToolsAwaitingConfirmation if the loaded message history already
    // contains a waiting_for_confirmation tool result AND this stream is processing
    // a tool confirmation (toolConfirmationResults is non-empty). This handles wakeUp
    // revival streams where the approve tool's placeholder is in the DB history - the
    // tool-call handler never fires for history messages so the flag would stay false,
    // causing the AI SDK stopWhen predicate to never trigger and spawning extra turns.
    // Do NOT pre-set for fresh user turns: those may have old confirm placeholders in
    // history from previous turns that have already been handled.
    if (toolConfirmationResults.length > 0) {
      const hasHistoryPendingConfirmation = messages.some((msg) => {
        if (msg.role !== "tool") {
          return false;
        }
        const content = msg.content;
        if (!Array.isArray(content)) {
          return false;
        }
        return content.some((part) => {
          if (typeof part !== "object" || part === null) {
            return false;
          }
          const p = part as ToolResultPart;
          if (p.type !== "tool-result") {
            return false;
          }
          const output = p.output;
          if (!output || typeof output !== "object" || Array.isArray(output)) {
            return false;
          }
          const o = output as { type?: string; value?: { status?: string } };
          if (o.type !== "json") {
            return false;
          }
          return o.value?.status === "waiting_for_confirmation";
        });
      });
      if (hasHistoryPendingConfirmation) {
        ctx.stepHasToolsAwaitingConfirmation = true;
        logger.debug(
          "[AI Stream] Pre-set stepHasToolsAwaitingConfirmation=true from history (wakeUp revival with pending approve)",
        );
      }
    }

    // Create streaming TTS handler if voice mode enabled
    let ttsHandler: StreamingTTSHandler | null = null;
    if (voiceMode?.enabled) {
      ttsHandler = createStreamingTTSHandler({
        wsEmit: wsEmit ?? null,
        logger,
        locale,
        voiceModelSelection: voiceMode.voiceModelSelection,
        user,
        enabled: true,
      });
      logger.debug("[AI Stream] Voice mode enabled - streaming TTS active", {
        voiceSelectionType: voiceMode.voiceModelSelection.selectionType,
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
