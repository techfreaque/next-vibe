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
  // Current ASSISTANT message
  currentAssistantMessageId: string | null = null;
  currentAssistantContent = "";

  // Reasoning state
  isInReasoningBlock = false;

  // Tool tracking
  pendingToolMessages = new Map<string, PendingToolData>();
  stepHasToolsAwaitingConfirmation = false;

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
  }) {
    this.sequenceId = params.sequenceId;
    this.currentParentId = params.initialParentId;
    this.currentDepth = params.initialDepth;
    this.lastParentId = params.initialParentId;
    this.lastDepth = params.initialDepth;
    this.lastSequenceId = params.sequenceId;
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
