/**
 * Stream Context - Manages mutable state during streaming
 * Replaces scattered closure variables to prevent memory leaks
 */

import type { CreditsT as ModuleT } from "@/app/api/[locale]/credits/i18n";
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
  /** All toolCallIds ever seen in this stream - prevents duplicate DB rows
   *  when a provider reuses IDs across steps or retries. */
  allSeenToolCallIds = new Set<string>();
  /** Set when any approve-mode tool is called. Persists across steps so that
   *  sequential approve tool calls all complete before the stream aborts at
   *  the AI-response turn boundary (finish-step with no pending tools). */
  stepHasToolsAwaitingConfirmation = false;

  // Loop control - set to true when model requests to stop the tool loop
  shouldStopLoop = false;

  /** Set when a wake-up-ready pub/sub signal arrives mid-stream.
   *  Causes the stream to yield at the next finish-step boundary (same as endLoop)
   *  so a headless revival can take over with the deferred result in DB context. */
  shouldYieldForWakeUp = false;

  /** The deferredId from a wake-up-ready signal - set alongside shouldYieldForWakeUp.
   *  Stream cleanup fires runHeadlessAiStream with this as explicitParentMessageId. */
  pendingWakeUpDeferredId: string | null = null;

  // Idempotency guard: set to true after AbortErrorHandler runs
  // Prevents double-execution if both inner and outer catch blocks fire
  abortHandled = false;

  /** Callbacks registered by setup code (e.g. pub/sub unsubscribe).
   *  All are called in cleanup(). */
  private cleanupCallbacks: Array<() => void> = [];

  // Time-to-first-token tracking: set when first text delta arrives
  streamStartTime: number | null = null;

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
   * Register a callback to run when the stream ends.
   * Used to unsubscribe from pub/sub channels set up during stream initialization.
   */
  onCleanup(cb: () => void): void {
    this.cleanupCallbacks.push(cb);
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
    // Run registered cleanup callbacks (e.g. pub/sub unsubscribe)
    for (const cb of this.cleanupCallbacks) {
      try {
        cb();
      } catch {
        // non-fatal
      }
    }
    this.cleanupCallbacks = [];
  }
}
