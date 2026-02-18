/**
 * MessageDbWriter - Centralized handler for all ASSISTANT message SSE events + DB writes.
 *
 * Each public method emits the SSE event(s) AND persists to DB in one call.
 * Callers never touch controller.enqueue or createStreamEvent directly for message writes.
 *
 * DB throttle strategy: debounce content updates within THROTTLE_MS window so
 * rapid deltas don't hammer the DB. flush() / flushAll() cancel the timer and
 * write immediately - always called before stream ends or on error.
 */

import "server-only";

import type { ReadableStreamDefaultController } from "node:stream/web";

import { eq } from "drizzle-orm";
import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import {
  chatMessages,
  type MessageMetadata,
  type ToolCall,
  type ToolCallResult,
} from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import {
  createErrorMessage,
  createTextMessage,
  createToolMessage,
  updateMessageContent,
} from "../../../chat/threads/[threadId]/messages/repository";
import { serializeError } from "../../error-utils";
import { createStreamEvent, formatSSEEvent } from "../../events";

/** Throttle window in ms - coalesces content updates to same message */
const THROTTLE_MS = 300;

interface PendingWrite {
  messageId: string;
  content: string;
  timer: ReturnType<typeof setTimeout> | null;
  inflightPromise: Promise<void> | null;
}

export class MessageDbWriter {
  private readonly isIncognito: boolean;
  private readonly logger: EndpointLogger;
  private readonly controller: ReadableStreamDefaultController<Uint8Array>;
  private readonly encoder: TextEncoder;
  private readonly pending = new Map<string, PendingWrite>();

  constructor(
    isIncognito: boolean,
    logger: EndpointLogger,
    controller: ReadableStreamDefaultController<Uint8Array>,
    encoder: TextEncoder,
  ) {
    this.isIncognito = isIncognito;
    this.logger = logger;
    this.controller = controller;
    this.encoder = encoder;
  }

  // ─── High-level methods (SSE + DB in one call) ────────────────────────────

  /**
   * Create a new ASSISTANT message: emit MESSAGE_CREATED + CONTENT_DELTA SSE,
   * then insert into DB.
   */
  async emitMessageCreated(params: {
    messageId: string;
    threadId: string;
    content: string;
    parentId: string | null;
    depth: number;
    userId: string | undefined;
    model: ModelId;
    character: string;
    sequenceId: string | null;
  }): Promise<void> {
    const {
      messageId,
      threadId,
      content,
      parentId,
      depth,
      model,
      character,
      sequenceId,
    } = params;

    // Emit MESSAGE_CREATED (always - even incognito needs this for the UI)
    const messageEvent = createStreamEvent.messageCreated({
      messageId,
      threadId,
      role: ChatMessageRole.ASSISTANT,
      content: "",
      parentId,
      depth,
      model,
      character,
      sequenceId,
    });
    this.enqueue(messageEvent);

    // Emit initial CONTENT_DELTA
    if (content) {
      this.emitDelta(messageId, content);
    }

    // Persist to DB
    if (!this.isIncognito) {
      const result = await createTextMessage({
        messageId,
        threadId,
        content,
        parentId,
        depth,
        userId: params.userId,
        model,
        character,
        sequenceId,
        logger: this.logger,
      });
      if (!result.success) {
        this.logger.warn(
          "[MessageDbWriter] Failed to create ASSISTANT message",
          {
            messageId,
            error: result.message,
          },
        );
      }
    }
  }

  /**
   * Emit a CONTENT_DELTA SSE event and schedule a throttled DB update.
   * Call this for every subsequent delta after the message is created.
   */
  emitDeltaAndSchedule(
    messageId: string,
    delta: string,
    newFullContent: string,
  ): void {
    this.emitDelta(messageId, delta);
    this.scheduleUpdate(messageId, newFullContent);
  }

  /**
   * Emit CONTENT_DONE SSE, flush + write final content to DB, write token metadata.
   * Call at the end of a message (stream complete or step boundary).
   */
  async emitContentDone(params: {
    messageId: string;
    content: string;
    finishReason: string | null;
    totalTokens: number | null;
    promptTokens: number | null;
    completionTokens: number | null;
  }): Promise<void> {
    const {
      messageId,
      content,
      finishReason,
      totalTokens,
      promptTokens,
      completionTokens,
    } = params;

    // SSE: CONTENT_DONE
    const doneEvent = createStreamEvent.contentDone({
      messageId,
      content,
      totalTokens,
      finishReason,
    });
    this.enqueue(doneEvent);

    // DB: flush pending throttled write, then write definitive final content + token metadata
    if (!this.isIncognito) {
      await this.flush(messageId);
      await this.writeContentAndTokens(messageId, content, {
        promptTokens: promptTokens ?? null,
        completionTokens: completionTokens ?? null,
        finishReason,
      });
    }
  }

  /**
   * Emit TOKENS_UPDATED SSE event. No DB write (tokens already written in emitContentDone).
   */
  emitTokensUpdated(params: {
    messageId: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    finishReason: string | null;
    creditCost: number;
  }): void {
    const tokensEvent = createStreamEvent.tokensUpdated(params);
    this.enqueue(tokensEvent);
  }

  /**
   * Deduct credits in DB then emit CREDITS_DEDUCTED SSE.
   * Returns whether deduction succeeded.
   */
  async deductAndEmitCredits(params: {
    user: JwtPayloadType;
    amount: number;
    feature: string;
    type: "model" | "tool";
    model?: ModelId;
  }): Promise<void> {
    if (params.amount <= 0) {
      return;
    }

    const { CreditRepository } =
      await import("@/app/api/[locale]/credits/repository");
    const deductResult =
      params.type === "model"
        ? await CreditRepository.deductCreditsForModelUsage(
            params.user,
            params.amount,
            params.model ?? (params.feature as ModelId),
            this.logger,
          )
        : await CreditRepository.deductCreditsForFeature(
            params.user,
            params.amount,
            params.feature,
            this.logger,
          );

    if (deductResult.success) {
      const creditEvent = createStreamEvent.creditsDeducted({
        amount: params.amount,
        feature: params.feature,
        type: params.type,
        partial: deductResult.partialDeduction,
      });
      this.enqueue(creditEvent);
    } else {
      this.logger.error("[MessageDbWriter] Failed to deduct credits", {
        amount: params.amount,
        feature: params.feature,
      });
    }
  }

  /**
   * Flush all pending writes then write final content (for tool-call boundaries).
   * Does NOT emit any SSE events.
   */
  async flushContent(messageId: string, content: string): Promise<void> {
    if (this.isIncognito) {
      return;
    }
    await this.flush(messageId);
    await this.writeNow(messageId, content);
  }

  /**
   * Emit MESSAGE_CREATED SSE for a placeholder ASSISTANT message (no text content),
   * and create the row in DB immediately so TOOL messages can reference it as parent.
   */
  async emitPlaceholderAssistantMessage(params: {
    messageId: string;
    threadId: string;
    parentId: string | null;
    depth: number;
    userId: string | undefined;
    model: ModelId;
    character: string;
    sequenceId: string | null;
  }): Promise<void> {
    const {
      messageId,
      threadId,
      parentId,
      depth,
      model,
      character,
      sequenceId,
    } = params;

    // SSE: MESSAGE_CREATED with empty content
    const messageEvent = createStreamEvent.messageCreated({
      messageId,
      threadId,
      role: ChatMessageRole.ASSISTANT,
      content: "",
      parentId,
      depth,
      model,
      character,
      sequenceId,
    });
    this.enqueue(messageEvent);

    // DB: insert immediately (even for incognito the SSE is needed - only skip DB)
    if (!this.isIncognito) {
      const result = await createTextMessage({
        messageId,
        threadId,
        content: "",
        parentId,
        depth,
        userId: params.userId,
        model,
        character,
        sequenceId,
        logger: this.logger,
      });
      if (!result.success) {
        this.logger.warn(
          "[MessageDbWriter] Failed to create placeholder ASSISTANT message",
          {
            messageId,
            error: result.message,
          },
        );
      }
    }
  }

  /**
   * Emit CONTENT_DELTA SSE for a reasoning close tag or tool boundary delta.
   * Alias of emitDelta exposed for callers that want an explicit name.
   */
  emitClosingDelta(messageId: string, delta: string): void {
    this.emitDelta(messageId, delta);
  }

  /**
   * Emit MESSAGE_CREATED + TOOL_CALL SSE for a new tool message,
   * and create the row in DB immediately.
   */
  async emitToolCall(params: {
    toolMessageId: string;
    threadId: string;
    parentId: string | null;
    depth: number;
    userId: string | undefined;
    model: ModelId;
    character: string;
    sequenceId: string | null;
    toolCall: ToolCall;
  }): Promise<void> {
    const {
      toolMessageId,
      threadId,
      parentId,
      depth,
      model,
      character,
      sequenceId,
      toolCall,
    } = params;

    // SSE: MESSAGE_CREATED for tool message
    const toolMessageEvent = createStreamEvent.messageCreated({
      messageId: toolMessageId,
      threadId,
      role: ChatMessageRole.TOOL,
      content: null,
      parentId,
      depth,
      sequenceId,
      toolCall,
      model,
      character,
    });
    this.enqueue(toolMessageEvent);

    // SSE: TOOL_CALL for real-time UX
    const toolCallEvent = createStreamEvent.toolCall({
      messageId: toolMessageId,
      toolName: toolCall.toolName,
      args: toolCall.args,
    });
    this.enqueue(toolCallEvent);

    // DB: create tool message immediately
    if (!this.isIncognito) {
      await createToolMessage({
        messageId: toolMessageId,
        threadId,
        toolCall,
        parentId,
        depth,
        userId: params.userId,
        sequenceId,
        model,
        character,
        logger: this.logger,
      });
    }
  }

  /**
   * Emit TOOL_WAITING SSE (tool requires user confirmation before execution).
   */
  emitToolWaiting(params: {
    toolMessageId: string;
    toolName: string;
    toolCallId: string;
  }): void {
    const waitingEvent = createStreamEvent.toolWaiting({
      messageId: params.toolMessageId,
      toolName: params.toolName,
      toolCallId: params.toolCallId,
    });
    this.enqueue(waitingEvent);
  }

  /**
   * Update tool message in DB with result/error, emit MESSAGE_CREATED (with result)
   * and TOOL_RESULT SSE events. Also emits CREDITS_DEDUCTED if tool had credits.
   */
  async emitToolResult(params: {
    toolMessageId: string;
    threadId: string;
    parentId: string | null;
    depth: number;
    userId: string | undefined;
    model: ModelId;
    character: string;
    sequenceId: string | null;
    toolCall: ToolCall; // updated with result/error
    toolName: string;
    result: ToolCallResult | undefined;
    error: ErrorResponseType | undefined;
    skipSseEmit?: boolean; // skip TOOL_RESULT SSE if already emitted in batch handler
    user: JwtPayloadType;
  }): Promise<void> {
    const {
      toolMessageId,
      threadId,
      parentId,
      depth,
      model,
      character,
      sequenceId,
      toolCall,
      toolName,
      result,
      error,
      skipSseEmit,
      user,
    } = params;

    // SSE: MESSAGE_CREATED with updated toolCall (result/error)
    const toolMessageEvent = createStreamEvent.messageCreated({
      messageId: toolMessageId,
      threadId,
      role: ChatMessageRole.TOOL,
      content: null,
      parentId,
      depth,
      model,
      character,
      sequenceId,
      toolCall,
    });
    this.enqueue(toolMessageEvent);

    // DB: update tool message with result/error
    if (!this.isIncognito) {
      const updateResult = await db
        .update(chatMessages)
        .set({ metadata: { toolCall }, updatedAt: new Date() })
        .where(eq(chatMessages.id, toolMessageId))
        .returning({ id: chatMessages.id });

      if (updateResult.length === 0) {
        this.logger.error(
          "[MessageDbWriter] CRITICAL: Tool message update failed - message not found in DB",
          {
            messageId: toolMessageId,
            toolName,
          },
        );
        // Fallback: create if update failed
        await createToolMessage({
          messageId: toolMessageId,
          threadId,
          toolCall,
          parentId,
          depth,
          userId: params.userId,
          sequenceId,
          model,
          character,
          logger: this.logger,
        });
      }
    }

    // SSE: TOOL_RESULT (skip if already emitted in batch confirmation handler)
    if (!skipSseEmit) {
      const toolResultEvent = createStreamEvent.toolResult({
        messageId: toolMessageId,
        toolName,
        result,
        error,
        toolCall,
      });
      this.enqueue(toolResultEvent);
    }

    // SSE + DB: CREDITS_DEDUCTED if tool consumed credits and succeeded
    if (toolCall.creditsUsed && toolCall.creditsUsed > 0 && !error) {
      await this.deductAndEmitCredits({
        user,
        amount: toolCall.creditsUsed,
        feature: toolName,
        type: "tool",
      });
    }
  }

  /**
   * Emit a generic SSE error event.
   */
  emitError(errorResponse: ErrorResponseType): void {
    const errorEvent = createStreamEvent.error(errorResponse);
    this.enqueue(errorEvent);
  }

  /**
   * Emit VOICE_TRANSCRIBED SSE and optionally CREDITS_DEDUCTED for STT cost.
   */
  emitVoiceTranscribed(params: {
    messageId: string;
    text: string;
    confidence: number | null;
    durationSeconds: number | null;
    creditCost?: number | null;
    user?: JwtPayloadType;
  }): void {
    const voiceEvent = createStreamEvent.voiceTranscribed({
      messageId: params.messageId,
      text: params.text,
      confidence: params.confidence,
      durationSeconds: params.durationSeconds,
    });
    this.enqueue(voiceEvent);

    // Emit CREDITS_DEDUCTED for STT cost immediately (no DB deduction here - done upstream)
    if (params.creditCost && params.creditCost > 0) {
      const creditEvent = createStreamEvent.creditsDeducted({
        amount: params.creditCost,
        feature: "stt",
        type: "tool",
      });
      this.enqueue(creditEvent);
    }
  }

  /**
   * Emit TOOL_RESULT SSE events for a batch of pre-confirmed tool calls.
   * Returns the set of message IDs emitted (to prevent duplicate emission during streaming).
   */
  emitBatchToolResults(
    toolResults: Array<{
      messageId: string;
      toolCall: ToolCall;
    }>,
  ): Set<string> {
    const emitted = new Set<string>();
    for (const result of toolResults) {
      const event = createStreamEvent.toolResult({
        messageId: result.messageId,
        toolName: result.toolCall.toolName,
        result: result.toolCall.result,
        error: result.toolCall.error,
        toolCall: result.toolCall,
      });
      this.enqueue(event);
      emitted.add(result.messageId);
    }
    return emitted;
  }

  /**
   * Emit FILES_UPLOADED SSE event.
   */
  emitFilesUploaded(params: {
    messageId: string;
    attachments: Array<{
      id: string;
      url: string;
      filename: string;
      mimeType: string;
      size: number;
    }>;
  }): void {
    const event = createStreamEvent.filesUploaded(params);
    this.enqueue(event);
  }

  /**
   * Emit MESSAGE_CREATED SSE for a compacting message and insert to DB.
   */
  async emitCompactingMessageCreated(params: {
    messageId: string;
    threadId: string;
    parentId: string | null;
    depth: number;
    sequenceId: string;
    model: ModelId;
    character: string | null;
    userId: string | undefined;
    messagesToCompact: Array<{ createdAt: Date; id: string }>;
    createdAt: Date;
  }): Promise<void> {
    const {
      messageId,
      threadId,
      parentId,
      depth,
      sequenceId,
      model,
      character,
      messagesToCompact,
      createdAt,
    } = params;

    // SSE
    const event = createStreamEvent.messageCreated({
      messageId,
      threadId,
      role: ChatMessageRole.ASSISTANT,
      content: "",
      parentId,
      depth,
      sequenceId,
      model,
      character,
      metadata: {
        isCompacting: true,
        compactedMessageCount: messagesToCompact.length,
      },
    });
    this.enqueue(event);

    // DB
    if (!this.isIncognito) {
      await db.insert(chatMessages).values({
        id: messageId,
        threadId,
        role: ChatMessageRole.ASSISTANT,
        content: null,
        parentId,
        depth,
        sequenceId,
        authorId: params.userId ?? null,
        model,
        character: character ?? null,
        isAI: true,
        metadata: {
          isCompacting: true,
          compactedMessageCount: messagesToCompact.length,
          compactedTimeRange: {
            start: messagesToCompact[0]?.createdAt.toISOString() ?? "",
            end:
              messagesToCompact[
                messagesToCompact.length - 1
              ]?.createdAt.toISOString() ?? "",
          },
          originalMessageIds: messagesToCompact.map((m) => m.id),
        },
        createdAt,
      });
    }
  }

  /**
   * Emit COMPACTING_DELTA SSE event.
   */
  emitCompactingDelta(messageId: string, delta: string): void {
    const event = createStreamEvent.compactingDelta({ messageId, delta });
    this.enqueue(event);
  }

  /**
   * Finalize compacting: update DB, emit TOKENS_UPDATED, deduct + emit credits, emit COMPACTING_DONE.
   */
  async emitCompactingDone(params: {
    messageId: string;
    threadId: string;
    content: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    uncachedInputTokens: number;
    model: ModelId;
    messagesToCompact: Array<{ createdAt: Date; id: string }>;
    user: JwtPayloadType;
    creditCost: number;
  }): Promise<void> {
    const {
      messageId,
      content,
      inputTokens,
      outputTokens,
      totalTokens,
      messagesToCompact,
      model,
      user,
      creditCost,
    } = params;

    // DB: update content + token metadata
    if (!this.isIncognito) {
      await updateMessageContent({ messageId, content, logger: this.logger });

      await db
        .update(chatMessages)
        .set({
          metadata: {
            isCompacting: true,
            compactedMessageCount: messagesToCompact.length,
            promptTokens: inputTokens,
            completionTokens: outputTokens,
            compactedTimeRange: {
              start: messagesToCompact[0]?.createdAt.toISOString() ?? "",
              end:
                messagesToCompact[
                  messagesToCompact.length - 1
                ]?.createdAt.toISOString() ?? "",
            },
            originalMessageIds: messagesToCompact.map((m) => m.id),
          },
        })
        .where(eq(chatMessages.id, messageId));
    }

    // SSE: TOKENS_UPDATED
    const tokensEvent = createStreamEvent.tokensUpdated({
      messageId,
      promptTokens: inputTokens,
      completionTokens: outputTokens,
      totalTokens,
      finishReason: "stop",
      creditCost,
    });
    this.enqueue(tokensEvent);

    // DB + SSE: CREDITS_DEDUCTED
    await this.deductAndEmitCredits({
      user,
      amount: creditCost,
      feature: `compacting-${model}`,
      type: "model",
      model,
    });

    // SSE: COMPACTING_DONE
    const doneEvent = createStreamEvent.compactingDone({
      messageId,
      content,
      metadata: {
        isCompacting: true,
        compactedMessageCount: messagesToCompact.length,
      },
    });
    this.enqueue(doneEvent);
  }

  /**
   * Emit MESSAGE_CREATED SSE for an ERROR message, save to DB, then emit ERROR SSE.
   * Used by error handlers to show errors in the chat UI.
   *
   * Pass `content` to override the default serialized ErrorResponseType content.
   * When `content` is a plain translation key string, the bubble renders it without
   * an error type label or error code (clean informational message).
   */
  async emitErrorMessage(params: {
    threadId: string;
    errorType: string;
    error: ErrorResponseType;
    parentId: string | null;
    depth: number;
    sequenceId: string | null;
    userId: string | undefined;
    content?: string;
  }): Promise<void> {
    const { threadId, errorType, error, parentId, depth, sequenceId, userId } =
      params;
    const errorMessageId = crypto.randomUUID();
    const serializedError = params.content ?? serializeError(error);

    // SSE: MESSAGE_CREATED for the error message
    const errorMessageEvent = createStreamEvent.messageCreated({
      messageId: errorMessageId,
      threadId,
      role: ChatMessageRole.ERROR,
      content: serializedError,
      parentId,
      depth,
      sequenceId,
      model: null,
      character: null,
    });
    this.enqueue(errorMessageEvent);

    // DB: save error message
    if (!this.isIncognito) {
      await createErrorMessage({
        messageId: errorMessageId,
        threadId,
        content: serializedError,
        errorType,
        parentId,
        depth,
        userId,
        sequenceId,
        logger: this.logger,
      });
    }

    // SSE: ERROR event
    this.emitError(error);
  }

  /**
   * Emit a CONTENT_DONE SSE event only (no DB writes).
   * Use for fallback/empty stop events where there is no DB message to update.
   */
  emitContentDoneRaw(params: {
    messageId: string;
    content: string;
    totalTokens: number | null;
    finishReason: string | null;
  }): void {
    const doneEvent = createStreamEvent.contentDone(params);
    this.enqueue(doneEvent);
  }

  /**
   * Close the SSE controller (ends the stream to the client).
   */
  closeController(): void {
    try {
      this.controller.close();
    } catch {
      // Already closed - ignore
    }
  }

  // ─── Low-level helpers (used internally and by flush paths) ───────────────

  /** Emit a single CONTENT_DELTA SSE event. */
  emitDelta(messageId: string, delta: string): void {
    this.logger.debug("[MessageDbWriter] CONTENT_DELTA", {
      messageId,
      deltaLength: delta.length,
    });
    const deltaEvent = createStreamEvent.contentDelta({ messageId, delta });
    this.enqueue(deltaEvent);
  }

  /** Schedule a throttled DB write. */
  scheduleUpdate(messageId: string, content: string): void {
    if (this.isIncognito) {
      return;
    }

    const existing = this.pending.get(messageId);
    if (existing) {
      if (existing.timer !== null) {
        clearTimeout(existing.timer);
        existing.timer = null;
      }
      existing.content = content;
    } else {
      this.pending.set(messageId, {
        messageId,
        content,
        timer: null,
        inflightPromise: null,
      });
    }

    const state = this.pending.get(messageId)!;
    state.timer = setTimeout(() => {
      state.timer = null;
      state.inflightPromise = this.writeNow(messageId, state.content).catch(
        (err: unknown) => {
          this.logger.error("[MessageDbWriter] Throttled update failed", {
            messageId,
            error: err instanceof Error ? err.message : String(err),
          });
        },
      );
    }, THROTTLE_MS);
  }

  /** Cancel timer and write immediately. Removes from pending map. */
  async flush(messageId: string): Promise<void> {
    if (this.isIncognito) {
      return;
    }
    const state = this.pending.get(messageId);
    if (!state) {
      return;
    }
    if (state.timer !== null) {
      clearTimeout(state.timer);
      state.timer = null;
    }
    if (state.inflightPromise) {
      await state.inflightPromise;
    }
    await this.writeNow(messageId, state.content);
    this.pending.delete(messageId);
  }

  /** Flush all pending messages. Call at stream end. */
  async flushAll(): Promise<void> {
    if (this.isIncognito) {
      return;
    }
    await Promise.all([...this.pending.keys()].map((id) => this.flush(id)));
  }

  /** Direct DB write without throttling. */
  async writeNow(messageId: string, content: string): Promise<void> {
    if (this.isIncognito) {
      return;
    }
    try {
      await db
        .update(chatMessages)
        .set({ content: content.trim() || null, updatedAt: new Date() })
        .where(eq(chatMessages.id, messageId));
    } catch (err) {
      this.logger.error("[MessageDbWriter] Failed to update message content", {
        messageId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  /** Write token metadata only (no content update). Used when content was already flushed. */
  async writeTokenMetadataOnly(
    messageId: string,
    tokens: {
      promptTokens: number | null;
      completionTokens: number | null;
      finishReason: string | null;
    },
  ): Promise<void> {
    if (this.isIncognito) {
      return;
    }
    try {
      const tokenMetadata: Partial<MessageMetadata> = {};
      if (tokens.promptTokens !== null) {
        tokenMetadata.promptTokens = tokens.promptTokens;
      }
      if (tokens.completionTokens !== null) {
        tokenMetadata.completionTokens = tokens.completionTokens;
      }
      if (tokens.finishReason) {
        tokenMetadata.finishReason = tokens.finishReason;
      }

      if (Object.keys(tokenMetadata).length === 0) {
        return;
      }

      const [existing] = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(eq(chatMessages.id, messageId));

      await db
        .update(chatMessages)
        .set({
          metadata: { ...(existing?.metadata ?? {}), ...tokenMetadata },
          updatedAt: new Date(),
        })
        .where(eq(chatMessages.id, messageId));
    } catch (err) {
      this.logger.error("[MessageDbWriter] Failed to write token metadata", {
        messageId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  /** Write final content and token metadata in a single DB update. */
  async writeContentAndTokens(
    messageId: string,
    content: string,
    tokens: {
      promptTokens: number | null;
      completionTokens: number | null;
      finishReason: string | null;
    },
  ): Promise<void> {
    if (this.isIncognito) {
      return;
    }
    try {
      const tokenMetadata: Partial<MessageMetadata> = {};
      if (tokens.promptTokens !== null) {
        tokenMetadata.promptTokens = tokens.promptTokens;
      }
      if (tokens.completionTokens !== null) {
        tokenMetadata.completionTokens = tokens.completionTokens;
      }
      if (tokens.finishReason) {
        tokenMetadata.finishReason = tokens.finishReason;
      }

      if (Object.keys(tokenMetadata).length > 0) {
        const [existing] = await db
          .select({ metadata: chatMessages.metadata })
          .from(chatMessages)
          .where(eq(chatMessages.id, messageId));

        await db
          .update(chatMessages)
          .set({
            content: content.trim() || null,
            metadata: { ...(existing?.metadata ?? {}), ...tokenMetadata },
            updatedAt: new Date(),
          })
          .where(eq(chatMessages.id, messageId));
      } else {
        await db
          .update(chatMessages)
          .set({ content: content.trim() || null, updatedAt: new Date() })
          .where(eq(chatMessages.id, messageId));
      }
    } catch (err) {
      this.logger.error(
        "[MessageDbWriter] Failed to write content and token metadata",
        {
          messageId,
          error: err instanceof Error ? err.message : String(err),
        },
      );
    }
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private enqueue(
    event: ReturnType<
      (typeof createStreamEvent)[keyof typeof createStreamEvent]
    >,
  ): void {
    try {
      this.controller.enqueue(this.encoder.encode(formatSSEEvent(event)));
    } catch (err) {
      this.logger.debug("[MessageDbWriter] Controller closed, skipping event", {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
