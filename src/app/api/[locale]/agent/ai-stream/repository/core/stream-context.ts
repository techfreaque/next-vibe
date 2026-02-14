/**
 * Stream Context - Manages mutable state during streaming
 * Replaces scattered closure variables to prevent memory leaks
 */

import type { ToolCall } from "../../../chat/db";

export interface PendingToolData {
  messageId: string;
  toolCallData: {
    toolCall: ToolCall;
    parentId: string | null;
    depth: number;
  };
}

/**
 * StreamContext - Encapsulates all mutable state during a stream
 * MUST call cleanup() when stream ends to prevent memory leaks
 */
export class StreamContext {
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
  stepHasToolsAwaitingConfirmation = false;

  // Loop control - set to true when model requests to stop the tool loop
  shouldStopLoop = false;

  // Parent chain
  currentParentId: string | null;
  currentDepth: number;

  // Sequence ID (links messages in same AI response)
  readonly sequenceId: string;

  // For error handling
  lastParentId: string | null;
  lastDepth: number;
  lastSequenceId: string | null;

  constructor(params: {
    sequenceId: string;
    initialParentId: string | null;
    initialDepth: number;
    initialAssistantMessageId: string;
  }) {
    this.sequenceId = params.sequenceId;
    this.currentParentId = params.initialParentId;
    this.currentDepth = params.initialDepth;
    this.lastParentId = params.initialParentId;
    this.lastDepth = params.initialDepth;
    this.lastSequenceId = params.sequenceId;
    this.initialAssistantMessageId = params.initialAssistantMessageId;
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
    this.lastDepth = this.currentDepth;
    this.lastSequenceId = this.sequenceId;
  }

  /**
   * Cleanup - MUST be called when stream ends
   */
  cleanup(): void {
    this.currentAssistantContent = "";
    this.currentAssistantMessageId = null;
    this.pendingToolMessages.clear();
  }
}
