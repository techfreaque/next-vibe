/**
 * StreamContextInitializer - Initializes stream context for AI streaming
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { EndpointLogger } from "next-vibe/logger/types";

import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";

import type { ToolCall } from "../../../chat/db";
import type { MessagesWsEmit } from "../../../chat/threads/[threadId]/messages/emitter";
import type { EmitThreadTitleFn } from "./message-db-writer";
import { StreamContext } from "./stream";

export class StreamContextInitializer {
  /**
   * Initialize stream context with proper parent/depth tracking
   */
  static initializeContext(params: {
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
      lastConfirmedTool?.messageId ?? initialAiParentId ?? null;

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
}
