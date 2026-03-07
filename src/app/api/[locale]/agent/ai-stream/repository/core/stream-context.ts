/**
 * Stream Context - Manages mutable state during streaming
 * Replaces scattered closure variables to prevent memory leaks
 */

import type { ModuleT } from "@/app/api/[locale]/credits/repository";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ToolCall } from "../../../chat/db";
import type { WsEmitCallback } from "../../../chat/threads/[threadId]/messages/emitter";
import { MessageDbWriter } from "./message-db-writer";

export interface PendingToolData {
  messageId: string;
  toolCallData: {
    toolCall: ToolCall;
    parentId: string | null;
  };
}

/**
 * StreamContext - Encapsulates all mutable state during a stream
 * MUST call cleanup() when stream ends to prevent memory leaks
 */
export class StreamContext {
  /** Centralised, throttled DB writer for all assistant message writes */
  readonly dbWriter: MessageDbWriter;
  // Pre-generated ASSISTANT message ID (for cache stability)
  // Used only for the FIRST assistant message in a stream
  private readonly initialAssistantMessageId: string;
  private hasUsedInitialAssistantId = false;

  // Current ASSISTANT message
  currentAssistantMessageId: string | null = null;
  currentAssistantContent = "";

  // Last ASSISTANT message ID (not cleared by finish-step, used for final token reporting)
  lastAssistantMessageId: string | null = null;

  // Reasoning state
  isInReasoningBlock = false;

  // Tool tracking
  pendingToolMessages = new Map<string, PendingToolData>();
  /** All toolCallIds ever seen in this stream — prevents duplicate DB rows
   *  when a provider reuses IDs across steps or retries. */
  allSeenToolCallIds = new Set<string>();
  stepHasToolsAwaitingConfirmation = false;

  // Loop control - set to true when model requests to stop the tool loop
  shouldStopLoop = false;

  // Parent chain
  currentParentId: string | null;

  // Sequence ID (links messages in same AI response)
  readonly sequenceId: string;

  // For error handling
  lastParentId: string | null;
  lastSequenceId: string | null;

  // Locale for translations
  readonly locale: CountryLanguage;

  constructor(params: {
    sequenceId: string;
    initialParentId: string | null;
    initialAssistantMessageId: string;
    isIncognito: boolean;
    logger: EndpointLogger;
    creditsT: ModuleT;
    locale: CountryLanguage;
    wsEmit?: WsEmitCallback | null;
  }) {
    this.sequenceId = params.sequenceId;
    this.currentParentId = params.initialParentId;
    this.lastParentId = params.initialParentId;
    this.lastSequenceId = params.sequenceId;
    this.locale = params.locale;
    this.initialAssistantMessageId = params.initialAssistantMessageId;
    this.dbWriter = new MessageDbWriter(
      params.isIncognito,
      params.logger,
      params.creditsT,
      params.locale,
      params.wsEmit ?? null,
    );
  }

  /**
   * The pre-generated ID for the first ASSISTANT message in this stream.
   * Used as a fallback messageId when the stream aborts before any content is generated.
   */
  get preGeneratedAssistantMessageId(): string {
    return this.initialAssistantMessageId;
  }

  /**
   * Get the next assistant message ID
   *
   * For cache stability, the FIRST assistant message uses the pre-generated ID
   * (which matches the metadata injected in message context).
   * Subsequent assistant messages (in tool loops) get new UUIDs.
   */
  getNextAssistantMessageId(): string {
    if (!this.hasUsedInitialAssistantId) {
      this.hasUsedInitialAssistantId = true;
      return this.initialAssistantMessageId;
    }
    return crypto.randomUUID();
  }

  /**
   * Update error tracking
   */
  updateErrorTracking(): void {
    this.lastParentId = this.currentParentId;
    this.lastSequenceId = this.sequenceId;
  }

  /**
   * Cleanup - MUST be called when stream ends
   * Flushes any pending DB writes before clearing state.
   */
  cleanup(): void {
    // Flush any remaining throttled writes (fire-and-forget; best effort at cleanup)
    void this.dbWriter.flushAll();
    this.currentAssistantContent = "";
    this.currentAssistantMessageId = null;
    this.pendingToolMessages.clear();
  }
}
