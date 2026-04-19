/**
 * MessageDbWriter - Centralized handler for all ASSISTANT message events + DB writes.
 *
 * Each public method emits the WS event(s) AND persists to DB in one call.
 * Callers never touch wsEmit directly for message writes.
 *
 * DB throttle strategy: debounce content updates within THROTTLE_MS window so
 * rapid deltas don't hammer the DB. flush() / flushAll() cancel the timer and
 * write immediately - always called before stream ends or on error.
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import type { MessageVariant } from "@/app/api/[locale]/agent/ai-stream/repository/core/modality-resolver";
import type {
  AudioVisionModelId,
  ImageVisionModelId,
  VideoVisionModelId,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import type { Modality } from "@/app/api/[locale]/agent/models/enum";
import type { CreditsT as ModuleT } from "@/app/api/[locale]/credits/i18n";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";

import {
  chatMessages,
  type MessageMetadata,
  type ToolCall,
} from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import type { WsEmitCallback } from "../../../chat/threads/[threadId]/messages/emitter";
import { MessagesRepository } from "../../../chat/threads/[threadId]/messages/repository";
import { serializeError } from "../error-utils";

/** Callback for emitting thread-title-updated to sidebar channels. */
export type EmitThreadTitleFn = (threadId: string, title: string) => void;

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
  private readonly pending = new Map<string, PendingWrite>();
  private readonly creditsT: ModuleT;
  private readonly locale: CountryLanguage;

  /** Tracks the last assistant message ID written - used by headless callers */
  lastAssistantMessageId: string | null = null;
  /** Tracks the final text content of the last assistant message - populated even in incognito */
  lastAssistantContent: string | null = null;
  /** Tracks the thread ID of the last assistant message - used for embedding sync */
  private lastThreadId: string | null = null;
  /** Tracks the URL of the last generated media (image/audio/video) - used by headless callers */
  lastGeneratedMediaUrl: string | null = null;
  /** Running total of credits deducted during this stream - used by headless callers to report cost */
  totalCreditsDeducted = 0;

  private readonly emitTitle: EmitThreadTitleFn;

  constructor(
    isIncognito: boolean,
    logger: EndpointLogger,
    creditsT: ModuleT,
    locale: CountryLanguage,
    readonly wsEmit: WsEmitCallback,
    emitTitle: EmitThreadTitleFn,
  ) {
    this.isIncognito = isIncognito;
    this.logger = logger;
    this.creditsT = creditsT;
    this.locale = locale;
    this.emitTitle = emitTitle;
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
    userId: string | undefined;
    model: ChatModelId;
    skill: string;
    sequenceId: string | null;
  }): Promise<void> {
    const { messageId, threadId, content, parentId, model, skill, sequenceId } =
      params;

    this.lastAssistantMessageId = messageId;
    this.lastThreadId = threadId;

    // Emit MESSAGE_CREATED (always - even incognito needs this for the UI)
    this.wsEmit("message-created", {
      streamingState: "streaming",
      messages: [
        {
          id: messageId,
          threadId,
          role: ChatMessageRole.ASSISTANT,
          isAI: true,
          content: "",
          parentId,
          sequenceId: sequenceId ?? null,
          model: model ?? null,
          skill: skill ?? null,
          metadata: {},
        },
      ],
    });

    // Emit initial CONTENT_DELTA
    if (content) {
      this.emitDelta(messageId, content);
    }

    // Persist to DB
    if (!this.isIncognito) {
      const result = await MessagesRepository.createTextMessage({
        messageId,
        threadId,
        content,
        parentId,
        userId: params.userId,
        model,
        skill: skill,
        sequenceId,
        logger: this.logger,
        locale: this.locale,
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
    cachedInputTokens?: number;
    timeToFirstToken?: number | null;
  }): Promise<void> {
    const {
      messageId,
      content,
      finishReason,
      totalTokens,
      promptTokens,
      completionTokens,
      cachedInputTokens,
      timeToFirstToken,
    } = params;

    // SSE: CONTENT_DONE
    this.wsEmit("content-done", {
      messages: [
        {
          id: messageId,
          content,
          metadata: {
            totalTokens: totalTokens ?? undefined,
            finishReason: finishReason ?? undefined,
            isStreaming: false,
          },
        },
      ],
    });

    // Always track final content in memory (incognito mode needs this since DB is skipped)
    this.lastAssistantContent = content;

    // DB: flush pending throttled write, then write definitive final content + token metadata
    if (!this.isIncognito) {
      await this.flush(messageId);
      await this.writeContentAndTokens(messageId, content, {
        promptTokens: promptTokens ?? null,
        completionTokens: completionTokens ?? null,
        finishReason,
        cachedInputTokens: cachedInputTokens ?? null,
        timeToFirstToken: timeToFirstToken ?? null,
      });

      // Fire-and-forget: sync thread embedding for vector search
      void this.syncThreadEmbedding().catch(() => {
        // Intentional no-op: embedding sync is fire-and-forget
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
    cachedInputTokens: number;
    cacheWriteTokens: number;
    timeToFirstToken: number | null;
    finishReason: string | null;
    creditCost: number;
  }): void {
    this.wsEmit("tokens-updated", {
      messages: [
        {
          id: params.messageId,
          metadata: {
            promptTokens: params.promptTokens,
            completionTokens: params.completionTokens,
            totalTokens: params.totalTokens,
            cachedInputTokens: params.cachedInputTokens,
            cacheWriteTokens:
              params.cacheWriteTokens > 0 ? params.cacheWriteTokens : undefined,
            timeToFirstToken: params.timeToFirstToken ?? undefined,
            creditCost: params.creditCost,
            finishReason: params.finishReason ?? undefined,
          },
        },
      ],
    });
  }

  /**
   * Deduct credits in DB then emit CREDITS_DEDUCTED SSE.
   * Returns whether deduction succeeded.
   */
  async deductAndEmitCredits(
    params:
      | {
          user: JwtPayloadType;
          amount: number;
          feature: string;
          type: "model";
          model:
            | ChatModelId
            | ImageVisionModelId
            | VideoVisionModelId
            | AudioVisionModelId;
        }
      | {
          user: JwtPayloadType;
          amount: number;
          feature: string;
          type: "tool";
          model: ChatModelId | undefined;
        },
  ): Promise<void> {
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
            params.model,
            this.logger,
            this.creditsT,
            this.locale,
          )
        : await CreditRepository.deductCreditsForFeature(
            params.user,
            params.amount,
            params.feature,
            this.logger,
            this.creditsT,
            this.locale,
          );

    if (deductResult.success) {
      this.totalCreditsDeducted += params.amount;
    } else {
      this.logger.error("[MessageDbWriter] Failed to deduct credits", {
        amount: params.amount,
        feature: params.feature,
        model: params.type === "model" ? params.model : (params.model ?? null),
        error: deductResult.message,
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
    userId: string | undefined;
    model: ChatModelId;
    skill: string;
    sequenceId: string | null;
  }): Promise<void> {
    const { messageId, threadId, parentId, model, skill, sequenceId } = params;

    this.lastAssistantMessageId = messageId;
    this.lastThreadId = threadId;

    // SSE: MESSAGE_CREATED with empty content
    this.wsEmit("message-created", {
      streamingState: "streaming",
      messages: [
        {
          id: messageId,
          threadId,
          role: ChatMessageRole.ASSISTANT,
          isAI: true,
          content: "",
          parentId,
          sequenceId: sequenceId ?? null,
          model: model ?? null,
          skill: skill ?? null,
          metadata: {},
        },
      ],
    });

    // DB: insert immediately (even for incognito the SSE is needed - only skip DB)
    if (!this.isIncognito) {
      const result = await MessagesRepository.createTextMessage({
        messageId,
        threadId,
        content: "",
        parentId,
        userId: params.userId,
        model,
        skill: skill,
        sequenceId,
        logger: this.logger,
        locale: this.locale,
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
    userId: string | undefined;
    model: ChatModelId;
    skill: string;
    sequenceId: string | null;
    toolCall: ToolCall;
  }): Promise<void> {
    const {
      toolMessageId,
      threadId,
      parentId,
      model,
      skill,
      sequenceId,
      toolCall,
    } = params;

    // SSE: MESSAGE_CREATED for tool message
    this.wsEmit("message-created", {
      streamingState: "streaming",
      messages: [
        {
          id: toolMessageId,
          threadId,
          role: ChatMessageRole.TOOL,
          isAI: true,
          content: null,
          parentId,
          sequenceId: sequenceId ?? null,
          model: model ?? null,
          skill: skill ?? null,
          metadata: { toolCall },
        },
      ],
    });

    // DB: create tool message immediately
    if (!this.isIncognito) {
      const createResult = await MessagesRepository.createToolMessage({
        messageId: toolMessageId,
        threadId,
        toolCall,
        parentId,
        userId: params.userId,
        sequenceId,
        model,
        skill: skill,
        logger: this.logger,
        locale: this.locale,
      });
      if (!createResult.success) {
        this.logger.error("[MessageDbWriter] Failed to create tool message", {
          messageId: toolMessageId,
          error: createResult.message,
        });
      }
    }
  }

  /**
   * Emit TOOL_WAITING SSE (tool requires user confirmation before execution).
   * No-op: tool-waiting is not a declared event on the messages channel.
   * The UI derives waiting state from the tool message's metadata.toolCall field.
   */
  emitToolWaiting(): void {
    // intentional no-op
  }

  /**
   * Update tool message in DB with result/error, emit MESSAGE_CREATED (with result)
   * and TOOL_RESULT SSE events. Also emits CREDITS_DEDUCTED if tool had credits.
   */
  async emitToolResult(params: {
    toolMessageId: string;
    threadId: string;
    parentId: string | null;
    userId: string | undefined;
    model: ChatModelId;
    skill: string;
    sequenceId: string | null;
    toolCall: ToolCall; // updated with result/error
    toolName: string;
    result: WidgetData | undefined;
    error: ErrorResponseType | undefined;
    skipSseEmit?: boolean; // skip TOOL_RESULT SSE if already emitted in batch handler
    user: JwtPayloadType;
  }): Promise<void> {
    const {
      toolMessageId,
      threadId,
      parentId,
      model,
      skill,
      sequenceId,
      toolCall,
      toolName,
      error,
      skipSseEmit,
      user,
    } = params;

    // SSE: MESSAGE_CREATED with updated toolCall (result/error)
    this.wsEmit("message-created", {
      streamingState: "streaming",
      messages: [
        {
          id: toolMessageId,
          threadId,
          role: ChatMessageRole.TOOL,
          isAI: true,
          content: null,
          parentId,
          sequenceId: sequenceId ?? null,
          model: model ?? null,
          skill: skill ?? null,
          metadata: { toolCall },
        },
      ],
    });

    // DB: update tool message with result/error.
    // Skip for wakeUp: handleTaskCompletion already backfilled the real result inline
    // (before execute-tool returned the stub). Writing the stub here would clobber it.
    if (!this.isIncognito && toolCall.callbackMode !== "wakeUp") {
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
        const fallbackResult = await MessagesRepository.createToolMessage({
          messageId: toolMessageId,
          threadId,
          toolCall,
          parentId,
          userId: params.userId,
          sequenceId,
          model,
          skill: skill,
          logger: this.logger,
          locale: this.locale,
        });
        if (!fallbackResult.success) {
          this.logger.error(
            "[MessageDbWriter] Fallback tool message creation also failed",
            {
              messageId: toolMessageId,
              error: fallbackResult.message,
            },
          );
        }
      }
    }

    // SSE: TOOL_RESULT (skip if already emitted in batch confirmation handler)
    if (!skipSseEmit) {
      this.wsEmit("tool-result", {
        messages: [{ id: toolMessageId, metadata: { toolCall } }],
      });
    }

    // SSE + DB: CREDITS_DEDUCTED if tool consumed credits and succeeded
    if (toolCall.creditsUsed && toolCall.creditsUsed > 0 && !error) {
      await this.deductAndEmitCredits({
        user,
        amount: toolCall.creditsUsed,
        feature: toolName,
        type: "tool",
        model,
      });
    }
  }

  /**
   * Emit a generic SSE error event.
   */
  emitError(errorResponse: ErrorResponseType): void {
    this.wsEmit("error", {
      messages: [
        {
          id: crypto.randomUUID(),
          role: ChatMessageRole.ERROR,
          content: errorResponse.message ?? null,
          parentId: null,
          sequenceId: null,
          model: null,
          skill: null,
          metadata: null,
          errorMessage: errorResponse.message ?? null,
          errorCode:
            errorResponse.errorType?.errorCode !== null &&
            errorResponse.errorType?.errorCode !== undefined
              ? String(errorResponse.errorType.errorCode)
              : null,
        },
      ],
    });
  }

  /**
   * Emit THREAD_TITLE_UPDATED SSE so the sidebar immediately shows the new title.
   */
  emitThreadTitleUpdated(params: { threadId: string; title: string }): void {
    // Title lives on the thread, not on messages — route directly to sidebar channels.
    this.emitTitle?.(params.threadId, params.title);
  }

  /**
   * Emit VOICE_TRANSCRIBED SSE and optionally CREDITS_DEDUCTED for STT cost.
   * Also emits THREAD_TITLE_UPDATED when threadId + isNewThread are provided.
   */
  emitVoiceTranscribed(params: {
    messageId: string;
    text: string;
    confidence: number | null;
    durationSeconds: number | null;
    creditCost?: number | null;
    user: JwtPayloadType;
    threadId?: string;
    isNewThread?: boolean;
  }): void {
    this.wsEmit("voice-transcribed", {
      messages: [
        {
          id: params.messageId,
          content: params.text,
          metadata: { isTranscribing: false },
        },
      ],
    });

    // Update sidebar title when STT sets the content for a new thread
    if (params.isNewThread && params.threadId && params.text) {
      this.emitThreadTitleUpdated({
        threadId: params.threadId,
        title: params.text.slice(0, 50),
      });
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
      this.wsEmit("tool-result", {
        messages: [
          { id: result.messageId, metadata: { toolCall: result.toolCall } },
        ],
      });
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
    this.wsEmit("files-uploaded", {
      messages: [
        {
          id: params.messageId,
          metadata: {
            isUploadingAttachments: false,
            attachments: params.attachments,
          },
        },
      ],
    });
  }

  /**
   * Emit MESSAGE_CREATED (USER role) SSE so the frontend adds the user message
   * to state with the correct parentId/depth. The DB record already exists
   * (created in setupAiStream); this only emits the SSE event.
   * For incognito the user message is also not in DB so nothing extra needed.
   */
  emitUserMessageCreated(params: {
    messageId: string;
    threadId: string;
    content: string;
    parentId: string | null;
    model: ChatModelId;
    skill: string | null;
    metadata?: MessageMetadata;
  }): void {
    const { messageId, threadId, content, parentId, model, skill, metadata } =
      params;
    this.wsEmit("message-created", {
      streamingState: "streaming",
      messages: [
        {
          id: messageId,
          threadId,
          role: ChatMessageRole.USER,
          isAI: false,
          content,
          parentId,
          sequenceId: null,
          model: model ?? null,
          skill: skill ?? null,
          metadata: metadata ?? {},
        },
      ],
    });
  }

  /**
   * Emit MESSAGE_CREATED SSE for a compacting message and insert to DB.
   */
  async emitCompactingMessageCreated(params: {
    messageId: string;
    threadId: string;
    parentId: string | null;
    sequenceId: string;
    model: ChatModelId;
    skill: string | null;
    userId: string | undefined;
    messagesToCompact: Array<{ createdAt: Date; id: string }>;
    createdAt: Date;
    containsMediaReferences: boolean;
  }): Promise<void> {
    const {
      messageId,
      threadId,
      parentId,
      sequenceId,
      model,
      skill,
      messagesToCompact,
      createdAt,
      containsMediaReferences,
    } = params;

    // SSE
    this.wsEmit("message-created", {
      streamingState: "streaming",
      messages: [
        {
          id: messageId,
          threadId,
          role: ChatMessageRole.ASSISTANT,
          isAI: true,
          content: "",
          parentId,
          sequenceId: sequenceId ?? null,
          model: model ?? null,
          skill: skill ?? null,
          metadata: {
            isCompacting: true,
            compactedMessageCount: messagesToCompact.length,
            ...(containsMediaReferences && { containsMediaReferences: true }),
          },
        },
      ],
    });

    // DB
    if (!this.isIncognito) {
      await db.insert(chatMessages).values({
        id: messageId,
        threadId,
        role: ChatMessageRole.ASSISTANT,
        content: null,
        parentId,
        sequenceId,
        authorId: params.userId ?? null,
        model,
        skill: skill ?? null,
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
          ...(containsMediaReferences && { containsMediaReferences: true }),
        },
        createdAt,
      });
    }
  }

  /**
   * Mark a compacting message as failed in the DB (no SSE - stream is already dead).
   * Sets metadata.compactingFailed = true and errorMessage so the UI can show a failed state,
   * and the next send can detect it and retry compacting as a sibling.
   */
  async emitCompactingFailed(params: {
    messageId: string;
    errorMessage: string;
  }): Promise<void> {
    if (this.isIncognito) {
      return;
    }
    const { messageId, errorMessage } = params;
    await db
      .update(chatMessages)
      .set({
        metadata: sql`metadata || ${JSON.stringify({ isCompacting: true, compactingFailed: true })}::jsonb`,
        errorMessage,
      })
      .where(eq(chatMessages.id, messageId));
  }

  /**
   * Emit COMPACTING_DELTA SSE event.
   */
  emitCompactingDelta(messageId: string, delta: string): void {
    this.wsEmit("compacting-delta", {
      messages: [
        { id: messageId, content: delta, metadata: { isStreaming: true } },
      ],
    });
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
    model: ChatModelId;
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
      await MessagesRepository.updateMessageContent({
        messageId,
        content,
        logger: this.logger,
      });

      await db
        .update(chatMessages)
        .set({
          metadata: {
            isCompacting: true,
            isStreaming: false,
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
    this.wsEmit("tokens-updated", {
      messages: [
        {
          id: messageId,
          metadata: {
            promptTokens: inputTokens,
            completionTokens: outputTokens,
            totalTokens,
            cachedInputTokens: 0,
            timeToFirstToken: undefined,
            creditCost,
            finishReason: "stop",
          },
        },
      ],
    });

    // DB + SSE: CREDITS_DEDUCTED
    await this.deductAndEmitCredits({
      user,
      amount: creditCost,
      feature: `compacting-${model}`,
      type: "model",
      model,
    });

    // SSE: COMPACTING_DONE
    this.wsEmit("compacting-done", {
      messages: [
        {
          id: messageId,
          content,
          metadata: {
            isCompacting: true,
            compactedMessageCount: messagesToCompact.length,
            isStreaming: false,
          },
        },
      ],
    });
  }

  /**
   * Emit MESSAGE_CREATED SSE for an ERROR message, save to DB.
   * Used by error handlers to show errors in the chat UI.
   *
   * The MESSAGE_CREATED event is sufficient for the client to display the error bubble.
   * Do NOT emit a trailing ERROR SSE here - that would cause a duplicate message
   * because the client's ERROR handler also creates a new chat message.
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
    sequenceId: string | null;
    user: JwtPayloadType;
    content?: TranslatedKeyType;
  }): Promise<void> {
    const { threadId, errorType, error, parentId, sequenceId, user } = params;
    const errorMessageId = crypto.randomUUID();
    const serializedError = params.content ?? serializeError(error);

    // SSE: MESSAGE_CREATED for the error message
    // The client's MESSAGE_CREATED handler adds this to the chat store with the
    // correct parentId/sequenceId - no additional ERROR event needed.
    this.wsEmit("message-created", {
      streamingState: "streaming",
      messages: [
        {
          id: errorMessageId,
          threadId,
          role: ChatMessageRole.ERROR,
          isAI: false,
          content: serializedError,
          parentId,
          sequenceId: sequenceId ?? null,
          model: null,
          skill: null,
          metadata: {},
        },
      ],
    });

    // DB: save error message
    if (!this.isIncognito) {
      await MessagesRepository.createErrorMessage({
        messageId: errorMessageId,
        threadId,
        content: serializedError,
        errorType,
        parentId,
        user,
        sequenceId,
        logger: this.logger,
      });
    }
  }

  /**
   * Create an ASSISTANT message for generated media (image/audio).
   * Emits MESSAGE_CREATED SSE with generatedMedia metadata, inserts to DB.
   */
  async emitGeneratedMediaMessage(params: {
    messageId: string;
    threadId: string;
    parentId: string | null;
    userId: string | undefined;
    model: ChatModelId;
    skill: string;
    sequenceId: string | null;
    generatedMedia: MessageMetadata["generatedMedia"];
  }): Promise<void> {
    const {
      messageId,
      threadId,
      parentId,
      model,
      skill,
      sequenceId,
      generatedMedia,
    } = params;

    this.lastAssistantMessageId = messageId;
    if (generatedMedia?.url) {
      this.lastGeneratedMediaUrl = generatedMedia.url;
    }

    // SSE: MESSAGE_CREATED with generatedMedia metadata
    // Also set top-level creditCost so AssistantMessageActions can display it
    const metadata = {
      generatedMedia,
      creditCost: generatedMedia?.creditCost,
    };
    this.wsEmit("message-created", {
      streamingState: "streaming",
      messages: [
        {
          id: messageId,
          threadId,
          role: ChatMessageRole.ASSISTANT,
          isAI: true,
          content: "",
          parentId,
          sequenceId: sequenceId ?? null,
          model: model ?? null,
          skill: skill ?? null,
          metadata,
        },
      ],
    });

    // DB: insert with metadata
    if (!this.isIncognito) {
      try {
        await db.insert(chatMessages).values({
          id: messageId,
          threadId,
          role: ChatMessageRole.ASSISTANT,
          content: null,
          parentId,
          authorId: params.userId ?? null,
          sequenceId,
          isAI: true,
          model,
          skill,
          metadata,
        });
      } catch (err) {
        this.logger.warn(
          "[MessageDbWriter] Failed to create generated media message",
          {
            messageId,
            error: err instanceof Error ? err.message : String(err),
          },
        );
      }
    }
  }

  /**
   * Attach generated media to an existing assistant message (no new message created).
   * Emits GENERATED_MEDIA_ADDED SSE and updates the DB metadata JSONB.
   * Used when an LLM emits text first, then a file part - both belong in the same bubble.
   */
  async emitGeneratedMediaOnExistingMessage(params: {
    messageId: string;
    generatedMedia: MessageMetadata["generatedMedia"];
  }): Promise<void> {
    const { messageId, generatedMedia } = params;

    if (!generatedMedia) {
      return;
    }
    if (generatedMedia.url) {
      this.lastGeneratedMediaUrl = generatedMedia.url;
    }

    // SSE: GENERATED_MEDIA_ADDED - tells the frontend to attach media to existing message
    this.wsEmit("generated-media-added", {
      messages: [
        {
          id: messageId,
          metadata: {
            generatedMedia: {
              type: generatedMedia.type,
              url: generatedMedia.url,
              prompt: generatedMedia.prompt ?? "",
              modelId: generatedMedia.modelId ?? "",
              mimeType: generatedMedia.mimeType ?? "",
              creditCost: generatedMedia.creditCost ?? 0,
              status: generatedMedia.status ?? "complete",
            },
          },
        },
      ],
    });

    // DB: merge generatedMedia into existing message metadata
    if (!this.isIncognito) {
      try {
        await db
          .update(chatMessages)
          .set({
            metadata: sql`metadata || ${JSON.stringify({ generatedMedia, creditCost: generatedMedia.creditCost })}::jsonb`,
            updatedAt: new Date(),
          })
          .where(eq(chatMessages.id, messageId));
      } catch (err) {
        this.logger.warn(
          "[MessageDbWriter] Failed to attach generated media to existing message",
          {
            messageId,
            error: err instanceof Error ? err.message : String(err),
          },
        );
      }
    }
  }

  /**
   * Emit TOOL_RESULT_UPDATED SSE and update the DB row with the real result.
   * Called when an async job completes and the previously-pending tool result is ready.
   */
  async emitToolResultUpdated(params: {
    messageId: string;
    toolCallId: string;
    result: WidgetData;
    toolCall: ToolCall; // full updated toolCall with result
  }): Promise<void> {
    const { messageId, toolCall } = params;

    // SSE: TOOL_RESULT_UPDATED so frontend can update the pending bubble
    this.wsEmit("tool-result-updated", {
      messages: [{ id: messageId, metadata: { toolCall } }],
    });

    // DB: backfill the result into the tool message
    if (!this.isIncognito) {
      try {
        await db
          .update(chatMessages)
          .set({ metadata: { toolCall }, updatedAt: new Date() })
          .where(eq(chatMessages.id, messageId));
      } catch (err) {
        this.logger.warn(
          "[MessageDbWriter] Failed to update tool result in DB",
          {
            messageId,
            error: err instanceof Error ? err.message : String(err),
          },
        );
      }
    }
  }

  /**
   * Emit a partial tool result to the parent thread's WS channel and persist to DB.
   * The tool message stays in "Executing" state (isPartial=true) but partial result
   * data is available to the widget. Used by long-running tools (e.g. ai-run) to
   * stream intermediate state (like a sub-thread ID) before the tool finishes.
   */
  async emitPartialToolResult(params: {
    toolMessageId: string;
    toolCall: ToolCall;
  }): Promise<void> {
    const { toolMessageId, toolCall } = params;

    // WS: TOOL_RESULT event - handler patches toolCall metadata on the message
    this.wsEmit("tool-result", {
      messages: [{ id: toolMessageId, metadata: { toolCall } }],
    });

    // DB: persist partial result so page refresh shows latest state
    if (!this.isIncognito) {
      try {
        await db
          .update(chatMessages)
          .set({ metadata: { toolCall }, updatedAt: new Date() })
          .where(eq(chatMessages.id, toolMessageId));
      } catch (err) {
        this.logger.warn(
          "[MessageDbWriter] Failed to persist partial tool result",
          {
            messageId: toolMessageId,
            error: err instanceof Error ? err.message : String(err),
          },
        );
      }
    }
  }

  /**
   * Write a synthetic TOOL message row for a natively-generated file part.
   * The LLM emitted a file directly (e.g. Gemini Flash Image); this creates
   * a sibling TOOL message so subsequent turns see the file URL in tool-result context.
   * No SSE is emitted - the message is invisible to the user but visible to the LLM.
   */
  async emitSyntheticToolMessage(params: {
    messageId: string;
    threadId: string;
    parentId: string | null;
    userId: string | undefined;
    model: ChatModelId;
    skill: string;
    sequenceId: string | null;
    toolCall: ToolCall;
  }): Promise<void> {
    const {
      messageId,
      threadId,
      parentId,
      model,
      skill,
      sequenceId,
      toolCall,
    } = params;

    if (this.isIncognito) {
      return;
    }

    try {
      await db.insert(chatMessages).values({
        id: messageId,
        threadId,
        role: ChatMessageRole.TOOL,
        content: null,
        parentId,
        authorId: params.userId ?? null,
        sequenceId,
        isAI: true,
        model,
        skill,
        metadata: { toolCall },
      });
    } catch (err) {
      this.logger.warn(
        "[MessageDbWriter] Failed to insert synthetic tool message",
        {
          messageId,
          error: err instanceof Error ? err.message : String(err),
        },
      );
    }
  }

  /**
   * Emit STREAMING_STATE_CHANGED SSE event.
   * Used to mark the thread as "streaming" before gap-fill begins so the UI
   * shows an activity indicator during potentially long bridge calls.
   */
  emitStreamingStateChanged(params: {
    threadId: string;
    state: "idle" | "streaming" | "aborting" | "waiting";
  }): void {
    this.wsEmit("streaming-state-changed", {
      streamingState: params.state,
    });
  }

  /**
   * Emit GAP_FILL_STARTED SSE event.
   * Called when a modality bridge begins running on a message attachment.
   */
  emitGapFillStarted(params: {
    messageId: string;
    bridgeType: "stt" | "vision" | "translation" | "tts";
    modality: Modality;
  }): void {
    this.wsEmit("gap-fill-started", {
      messages: [
        {
          id: params.messageId,
          metadata: {
            isStreaming: true,
            gapFillStatus: {
              bridgeType: params.bridgeType,
              modality: params.modality,
            },
          },
        },
      ],
    });
  }

  /**
   * Emit GAP_FILL_COMPLETED SSE event and persist the variant to DB.
   * Called when a modality bridge finishes and the text variant is ready.
   */
  async emitGapFillCompleted(params: {
    messageId: string;
    bridgeType: "stt" | "vision" | "translation" | "tts";
    modality: Modality;
    variant: MessageVariant;
  }): Promise<void> {
    this.wsEmit("gap-fill-completed", {
      messages: [
        {
          id: params.messageId,
          metadata: { variants: [params.variant] },
        },
      ],
    });

    // Persist variant to DB (non-incognito only)
    if (!this.isIncognito) {
      try {
        // Append variant to existing variants array in metadata
        await db
          .update(chatMessages)
          .set({
            metadata: sql`jsonb_set(
              COALESCE(metadata, '{}'),
              '{variants}',
              COALESCE(metadata->'variants', '[]') || ${JSON.stringify([params.variant])}::jsonb
            )`,
            updatedAt: new Date(),
          })
          .where(eq(chatMessages.id, params.messageId));
      } catch (err) {
        this.logger.warn(
          "[MessageDbWriter] Failed to persist gap-fill variant",
          {
            messageId: params.messageId,
            error: err instanceof Error ? err.message : String(err),
          },
        );
      }
    }
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
    this.wsEmit("content-done", {
      messages: [
        {
          id: params.messageId,
          content: params.content,
          metadata: {
            totalTokens: params.totalTokens ?? undefined,
            finishReason: params.finishReason ?? undefined,
            isStreaming: false,
          },
        },
      ],
    });
  }

  // ─── Embedding sync ──────────────────────────────────────────────────────

  /**
   * Sync the current thread to cortex_nodes for vector search.
   * Uses dynamic imports to avoid circular dependencies.
   * Fire-and-forget safe - errors are silently caught by the caller.
   */
  private async syncThreadEmbedding(): Promise<void> {
    if (!this.lastThreadId) {
      return;
    }

    const { syncVirtualNodeToEmbedding } =
      await import("@/app/api/[locale]/agent/cortex/embeddings/sync-virtual");
    const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");
    const { desc } = await import("drizzle-orm");

    // Get thread info
    const [thread] = await db
      .select({
        id: chatThreads.id,
        userId: chatThreads.userId,
        title: chatThreads.title,
        rootFolderId: chatThreads.rootFolderId,
      })
      .from(chatThreads)
      .where(eq(chatThreads.id, this.lastThreadId))
      .limit(1);

    if (!thread?.userId) {
      return;
    }

    // Get last 20 messages for context
    const messages = await db
      .select({
        role: chatMessages.role,
        content: chatMessages.content,
      })
      .from(chatMessages)
      .where(eq(chatMessages.threadId, thread.id))
      .orderBy(desc(chatMessages.createdAt))
      .limit(20);

    if (messages.length === 0) {
      return;
    }

    const messageLines = messages
      .toReversed()
      .map((m) => `${m.role}: ${(m.content ?? "").slice(0, 500)}`)
      .join("\n");

    const content = [
      `# ${thread.title ?? "Untitled"}`,
      `Folder: ${thread.rootFolderId}`,
      "",
      messageLines,
    ].join("\n");

    const slug = (thread.title ?? "thread")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .slice(0, 50);

    await syncVirtualNodeToEmbedding(
      thread.userId,
      `/threads/${thread.rootFolderId}/${slug}-${thread.id}.md`,
      content,
    );
  }

  // ─── Low-level helpers (used internally and by flush paths) ───────────────

  /** Emit a single CONTENT_DELTA SSE event. */
  emitDelta(messageId: string, delta: string): void {
    this.logger.debug("[MessageDbWriter] CONTENT_DELTA", {
      messageId,
      deltaLength: delta.length,
    });
    this.wsEmit("content-delta", {
      messages: [{ id: messageId, content: delta }],
    });
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
        (err: Error) => {
          this.logger.error("[MessageDbWriter] Throttled update failed", err, {
            messageId,
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
      cachedInputTokens?: number | null;
      cacheWriteTokens?: number | null;
      timeToFirstToken?: number | null;
      creditCost?: number | null;
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
      if (
        tokens.cachedInputTokens !== null &&
        tokens.cachedInputTokens !== undefined
      ) {
        tokenMetadata.cachedInputTokens = tokens.cachedInputTokens;
      }
      if (
        tokens.cacheWriteTokens !== null &&
        tokens.cacheWriteTokens !== undefined &&
        tokens.cacheWriteTokens > 0
      ) {
        tokenMetadata.cacheWriteTokens = tokens.cacheWriteTokens;
      }
      if (
        tokens.timeToFirstToken !== null &&
        tokens.timeToFirstToken !== undefined
      ) {
        tokenMetadata.timeToFirstToken = tokens.timeToFirstToken;
      }
      if (tokens.creditCost !== null && tokens.creditCost !== undefined) {
        tokenMetadata.creditCost = tokens.creditCost;
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
      cachedInputTokens?: number | null;
      cacheWriteTokens?: number | null;
      timeToFirstToken?: number | null;
      creditCost?: number | null;
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
      if (
        tokens.cachedInputTokens !== null &&
        tokens.cachedInputTokens !== undefined
      ) {
        tokenMetadata.cachedInputTokens = tokens.cachedInputTokens;
      }
      if (
        tokens.cacheWriteTokens !== null &&
        tokens.cacheWriteTokens !== undefined &&
        tokens.cacheWriteTokens > 0
      ) {
        tokenMetadata.cacheWriteTokens = tokens.cacheWriteTokens;
      }
      if (
        tokens.timeToFirstToken !== null &&
        tokens.timeToFirstToken !== undefined
      ) {
        tokenMetadata.timeToFirstToken = tokens.timeToFirstToken;
      }
      if (tokens.creditCost !== null && tokens.creditCost !== undefined) {
        tokenMetadata.creditCost = tokens.creditCost;
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
}
