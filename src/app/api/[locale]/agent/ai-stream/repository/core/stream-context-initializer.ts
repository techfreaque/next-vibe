/**
 * StreamContextInitializer - Initializes stream context for AI streaming
 */

import "server-only";

import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ToolCall } from "../../../chat/db";
import type { WsEmitCallback } from "../../../chat/threads/[threadId]/messages/emitter";
import { StreamContext } from "./stream-context";

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
    wsEmit?: WsEmitCallback | null;
    /** Force a specific sequenceId — used by wakeUp revival to share sequence with deferred tool pair */
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
      sequenceIdOverride,
    } = params;
    const { t: creditsT } = creditsScopedTranslation.scopedT(locale);

    // Calculate initial parent for AI message
    // IMPORTANT: Always prefer userMessageId when available (works for both incognito and server-persisted threads)
    const initialAiParentId = userMessageId ?? effectiveParentMessageId ?? null;

    // Initialize stream context OUTSIDE try block so it's accessible in catch blocks
    const lastConfirmedTool =
      toolConfirmationResults[toolConfirmationResults.length - 1];
    const sequenceId =
      sequenceIdOverride ??
      lastConfirmedTool?.sequenceId ??
      crypto.randomUUID();
    const initialParentForContext =
      lastConfirmedTool?.messageId ?? initialAiParentId;

    const ctx = new StreamContext({
      sequenceId,
      initialParentId: initialParentForContext,
      initialAssistantMessageId: aiMessageId,
      isIncognito,
      logger,
      creditsT,
      locale,
      wsEmit,
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
