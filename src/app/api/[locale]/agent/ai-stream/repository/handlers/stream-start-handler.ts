/**
 * StreamStartHandler - Handles stream initialization and setup
 */

import "server-only";

import type { ModelMessage, ToolResultPart } from "ai";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import type { AgentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import type { VoiceModelSelection } from "@/app/api/[locale]/agent/text-to-speech/models";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";

import type { ToolCall } from "../../../chat/db";
import type { MessagesWsEmit } from "../../../chat/threads/[threadId]/messages/emitter";
import type { EmitThreadTitleFn } from "../core/message-db-writer";
import { StreamContext } from "../core/stream";
import {
  createStreamingTTSHandler,
  type StreamingTTSHandler,
} from "../core/streaming-tts";
import { FileUploadEventHandler } from "./attachments";
import { InitialEventsHandler } from "./initial-events-handler";

export class StreamStartHandler {
  /**
   * Initialize stream context with proper parent/depth tracking
   */
  private static initializeContext(params: {
    userMessageId: string | null;
    effectiveParentMessageId: string | null | undefined;
    toolConfirmationResults: Array<{
      messageId: string;
      sequenceId: string;
      toolCall: ToolCall;
    }>;
    aiMessageId: string;
    isIncognito: boolean;
    logger: EndpointLogger;
    locale: CountryLanguage;
    wsEmit: MessagesWsEmit;
    emitTitle: EmitThreadTitleFn;
    /** Ownership token for the stream's 'streaming' claim (ToolExecutionContext.streamRunId). */
    streamRunId: string | undefined;
    /**
     * Branch LEAF below the last confirmed tool (walkToLeafMessage). With
     * parallel tools the confirmed message is not necessarily the branch tip —
     * a sibling tool that ran without confirmation chains after it, and
     * parenting the phase-2 AI response at the confirmed message would branch
     * the chain. Wins over lastConfirmedTool.messageId when provided.
     */
    confirmationParentLeafId: string | undefined;
    /** Fixture chain of the stream — bound onto the dbWriter for embedding-sync. */
    fixtureContext: FixtureContext | undefined;
    /** Force a specific sequenceId - used by wakeUp revival to share sequence with deferred tool pair */
    sequenceIdOverride?: string;
  }): StreamContext {
    const {
      userMessageId,
      effectiveParentMessageId,
      toolConfirmationResults,
      aiMessageId,
      isIncognito,
      logger,
      locale,
      wsEmit,
      emitTitle,
      streamRunId,
      confirmationParentLeafId,
      streamContext,
      sequenceIdOverride,
    } = params;
    const { t: creditsT } = creditsScopedTranslation.scopedT(locale);

    // Calculate initial parent for AI message
    // IMPORTANT: Always prefer userMessageId when available (works for both incognito and server-persisted threads)
    const initialAiParentId = userMessageId || effectiveParentMessageId || null;

    // Initialize stream context OUTSIDE try block so it's accessible in catch blocks
    const lastConfirmedTool =
      toolConfirmationResults[toolConfirmationResults.length - 1];
    const sequenceId =
      sequenceIdOverride ??
      lastConfirmedTool?.sequenceId ??
      crypto.randomUUID();
    // For tool confirmations: use the last deferred confirm message as parent
    // so the AI response is a CHILD of it (not a sibling).
    // The deferred confirm messages all have parentId = assistantPlaceholder,
    // so the chain is: userMsg → assistantPlaceholder → [tool1, tool2, ...deferred1, deferred2] → AI response.
    // We want AI response to be after the last deferred result, not alongside it.
    // Fall back to effectiveParentMessageId / userMessageId if no confirmations.
    const initialParentForContext =
      confirmationParentLeafId ??
      lastConfirmedTool?.messageId ??
      initialAiParentId ??
      null;

    const ctx = new StreamContext({
      sequenceId,
      initialParentId: initialParentForContext,
      initialAssistantMessageId: aiMessageId,
      isIncognito,
      logger,
      creditsT,
      locale,
      wsEmit,
      emitTitle,
      streamRunId,
      streamContext,
    });

    // Update last known values for error handling (accessible in catch blocks)
    ctx.updateErrorTracking();

    logger.debug("[AI Stream] Sequence ID initialized", {
      sequenceId: ctx.sequenceId,
      isToolContinuation: !!lastConfirmedTool,
      toolMessageId: lastConfirmedTool?.messageId,
      confirmedToolCount: toolConfirmationResults.length,
    });

    return ctx;
  }

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
    wsEmit: MessagesWsEmit;
    emitTitle: EmitThreadTitleFn;
    availability: AgentEnvAvailability;
    /** The stream's fixture chain — TTS provider calls bind record/replay to it. */
    fixtureContext: FixtureContext | undefined;
    /** Ownership token for the stream's 'streaming' claim (ToolExecutionContext.streamRunId). */
    streamRunId: string | undefined;
    /** Branch leaf below the last confirmed tool — see initializeContext. */
    confirmationParentLeafId: string | undefined;
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
      availability,
      streamContext,
      streamRunId,
      confirmationParentLeafId,
    } = params;

    // Initialize stream context (creates MessageDbWriter with controller + encoder)
    const ctx = StreamStartHandler.initializeContext({
      userMessageId,
      effectiveParentMessageId,
      toolConfirmationResults,
      aiMessageId,
      isIncognito,
      logger,
      locale,
      wsEmit,
      emitTitle,
      streamRunId,
      confirmationParentLeafId,
      streamContext,
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
        availability,
        streamContext,
      });
      ttsHandler.setThreadId(threadId);
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
      userId: user.isPublic ? undefined : user.id,
      threadId,
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
