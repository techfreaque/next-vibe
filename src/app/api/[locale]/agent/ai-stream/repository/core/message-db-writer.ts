/**
 * MessageDbWriter - Centralized handler for all ASSISTANT message events + DB writes.
 *
 * Each public method emits the WS event(s) AND persists to DB in one call.
 * Callers never touch wsEmit directly for message writes.
 *
 * DB throttle strategy: debounce content updates within THROTTLE_MS window so
 * rapid deltas don't hammer the DB. flush() / flushAll() cancel the timer and
 * write immediately - always called before stream ends or on error. The
 * debounce map + low-level DB writes live in the ThrottleEngine class in
 * db-writer/throttle-engine.ts - a genuinely distinct mechanism the writer
 * delegates to.
 *
 * This class is a thin facade: method bodies live in the db-writer/ modules
 * (text / tools / media / compacting / credits / notifications / embedding
 * sync / throttle), each taking the DbWriterState view of this instance.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import type { ErrorResponseType } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import type { Modality } from "@/app/api/[locale]/agent/models/enum";
import type { CreditsT as ModuleT } from "@/app/api/[locale]/credits/i18n";

import type { MessageMetadata, ToolCall } from "../../../chat/db";
import type { ThreadStreamingState } from "../../../chat/enum";
import type { MessagesWsEmit } from "../../../chat/threads/[threadId]/messages/emitter";
import * as compactingWrites from "./db-writer/compacting";
import {
  deductAndEmitCredits,
  type DeductAndEmitCreditsParams,
} from "./db-writer/credits";
import {
  syncThreadEmbedding,
  syncUploadEmbedding,
} from "./db-writer/embedding-sync";
import * as mediaWrites from "./db-writer/media";
import * as notificationWrites from "./db-writer/notifications";
import type { EmitThreadTitleFn, WriterDeps } from "./db-writer/shared";
import * as textWrites from "./db-writer/text";
import { ThrottleEngine } from "./db-writer/throttle-engine";
import * as toolWrites from "./db-writer/tools";
import type { MessageVariant } from "./modality-resolver";

export type { EmitThreadTitleFn } from "./db-writer/shared";
export { buildThinThreadContent } from "./db-writer/shared";

/** The values every method reaches through `this.deps` (constructor args). */
interface WriterDeps {
  readonly isIncognito: boolean;
  readonly logger: EndpointLogger;
  readonly creditsT: ModuleT;
  readonly locale: CountryLanguage;
  readonly wsEmit: MessagesWsEmit;
  readonly emitTitle: EmitThreadTitleFn;
}

export class MessageDbWriter {
  /** Tracks the last assistant message ID written - used by headless callers */
  lastAssistantMessageId: string | null = null;
  /** Tracks the final text content of the last assistant message - populated even in incognito */
  lastAssistantContent: string | null = null;
  /** Tracks the URL of the last generated media (image/audio/video) - used by headless callers */
  lastGeneratedMediaUrl: string | null = null;
  /** Running total of credits deducted during this stream - used by headless callers to report cost */
  totalCreditsDeducted = 0;
  /** Tracks the thread ID of the last assistant message - used for embedding sync */
  private lastThreadId: string | null = null;

  private readonly deps: WriterDeps;
  private readonly engine: ThrottleEngine;

  constructor(
    isIncognito: boolean,
    logger: EndpointLogger,
    creditsT: ModuleT,
    locale: CountryLanguage,
    readonly wsEmit: MessagesWsEmit,
    emitTitle: EmitThreadTitleFn,
  ) {
    this.deps = {
      isIncognito,
      logger,
      creditsT,
      locale,
      wsEmit,
      emitTitle,
    };
    this.engine = new ThrottleEngine(this.deps);
  }

  // ─── text ──────────────────────────────────────────────────────────────────

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
    this.deps.wsEmit("message-created", {
      urlPathParams: { threadId },
      responseData: {
        streamingState: ThreadStreamingState.STREAMING,
        messages: [
          buildSseMessageRow({
            id: messageId,
            threadId,
            role: ChatMessageRole.ASSISTANT,
            isAI: true,
            content: "",
            parentId,
            sequenceId: sequenceId ?? null,
            model: model ?? null,
            skill: skill ?? null,
          }),
        ],
      },
    });

    // Emit initial CONTENT_DELTA
    if (content) {
      this.emitDelta(messageId, content);
    }

    // Persist to DB
    if (!this.deps.isIncognito) {
      const result = await MessagesRepository.createTextMessage({
        messageId,
        threadId,
        content,
        parentId,
        userId: params.userId,
        model,
        skill: skill,
        sequenceId,
        logger: this.deps.logger,
        locale: this.deps.locale,
      });
      if (!result.success) {
        this.deps.logger.warn(
          "[MessageDbWriter] Failed to create ASSISTANT message",
          {
            messageId,
            error: result.message,
          },
        );
      }
      // Roll any queued messages forward to this new frontier
      this.engine.advanceQueuedMessages(threadId, messageId);
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
    this.engine.scheduleUpdate(messageId, newFullContent);
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
    this.deps.wsEmit("content-done", {
      urlPathParams: { threadId: this.lastThreadId ?? "" },
      responseData: {
        messages: [
          {
            id: messageId,
            content,
            metadata: {
              totalTokens: totalTokens ?? undefined,
              promptTokens: promptTokens ?? undefined,
              completionTokens: completionTokens ?? undefined,
              finishReason: finishReason ?? undefined,
              isStreaming: false,
            },
          },
        ],
      },
    });

    // Always track final content in memory (incognito mode needs this since DB is skipped)
    this.lastAssistantContent = content;

    // DB: flush pending throttled write, then write definitive final content + token metadata
    if (!this.deps.isIncognito) {
      await this.engine.flush(messageId);
      await this.engine.writeContentAndTokens(messageId, content, {
        promptTokens: promptTokens ?? null,
        completionTokens: completionTokens ?? null,
        finishReason,
        cachedInputTokens: cachedInputTokens ?? null,
        timeToFirstToken: timeToFirstToken ?? null,
      });
    }
  }

  /**
   * Emit a lightweight TOKENS_UPDATED SSE event with an estimated completion token count.
   * SSE-only, no DB write. Used mid-stream (during content delta) to give the UI a
   * live approximation before the real count arrives from the API at step finish.
   * Estimate: chars / 4 (rough GPT-style average).
   */
  emitEstimatedTokens(
    messageId: string,
    charCount: number,
    estimatedInputTokens?: number,
  ): void {
    const estimatedTokens = Math.ceil(charCount / 4);
    this.deps.wsEmit("tokens-updated", {
      urlPathParams: { threadId: this.lastThreadId ?? "" },
      responseData: {
        messages: [
          {
            id: messageId,
            metadata: {
              completionTokens: estimatedTokens,
              ...(estimatedInputTokens
                ? { promptTokens: estimatedInputTokens }
                : {}),
            },
          },
        ],
      },
    });
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
    streamingTime: number | null;
    finishReason: string | null;
    creditCost: number;
  }): void {
    this.deps.wsEmit("tokens-updated", {
      urlPathParams: { threadId: this.lastThreadId ?? "" },
      responseData: {
        messages: [
          {
            id: params.messageId,
            metadata: {
              promptTokens: params.promptTokens,
              completionTokens: params.completionTokens,
              totalTokens: params.totalTokens,
              cachedInputTokens: params.cachedInputTokens,
              cacheWriteTokens:
                params.cacheWriteTokens > 0
                  ? params.cacheWriteTokens
                  : undefined,
              timeToFirstToken: params.timeToFirstToken ?? undefined,
              streamingTime: params.streamingTime ?? undefined,
              // Zero carries no information and CLOBBERS: the final cumulative
              // emit (real cost) and a trailing per-step emit (cheap step → 0)
              // race on the same message; appliers jsonb-merge, so an explicit
              // 0 overwrites the real value while `undefined` preserves it.
              creditCost: params.creditCost > 0 ? params.creditCost : undefined,
              finishReason: params.finishReason ?? undefined,
            },
          },
        ],
      },
    });
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
    this.deps.wsEmit("message-created", {
      urlPathParams: { threadId },
      responseData: {
        streamingState: ThreadStreamingState.STREAMING,
        messages: [
          buildSseMessageRow({
            id: messageId,
            threadId,
            role: ChatMessageRole.ASSISTANT,
            isAI: true,
            content: "",
            parentId,
            sequenceId: sequenceId ?? null,
            model: model ?? null,
            skill: skill ?? null,
          }),
        ],
      },
    });

    // DB: insert immediately (even for incognito the SSE is needed - only skip DB)
    if (!this.deps.isIncognito) {
      const result = await MessagesRepository.createTextMessage({
        messageId,
        threadId,
        content: "",
        parentId,
        userId: params.userId,
        model,
        skill: skill,
        sequenceId,
        logger: this.deps.logger,
        locale: this.deps.locale,
      });
      if (!result.success) {
        this.deps.logger.warn(
          "[MessageDbWriter] Failed to create placeholder ASSISTANT message",
          {
            messageId,
            error: result.message,
          },
        );
      }
      // Roll any queued messages forward to this new frontier
      this.engine.advanceQueuedMessages(threadId, messageId);
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
    this.deps.wsEmit("message-created", {
      urlPathParams: { threadId },
      responseData: {
        streamingState: ThreadStreamingState.STREAMING,
        messages: [
          buildSseMessageRow({
            id: messageId,
            threadId,
            role: ChatMessageRole.USER,
            content,
            parentId,
            model: model ?? null,
            skill: skill ?? null,
            metadata: metadata ?? {},
          }),
        ],
      },
    });
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
    this.deps.wsEmit("content-done", {
      urlPathParams: { threadId: this.lastThreadId ?? "" },
      responseData: {
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
      },
    });
  }

  // ─── tools ─────────────────────────────────────────────────────────────────

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
    this.deps.wsEmit("message-created", {
      urlPathParams: { threadId },
      responseData: {
        streamingState: ThreadStreamingState.STREAMING,
        messages: [
          buildSseMessageRow({
            id: toolMessageId,
            threadId,
            role: ChatMessageRole.TOOL,
            isAI: true,
            parentId,
            sequenceId: sequenceId ?? null,
            model: model ?? null,
            skill: skill ?? null,
            metadata: { toolCall },
          }),
        ],
      },
    });

    // DB: create tool message immediately
    if (!this.deps.isIncognito) {
      const createResult = await MessagesRepository.createToolMessage({
        messageId: toolMessageId,
        threadId,
        toolCall,
        parentId,
        userId: params.userId,
        sequenceId,
        model,
        skill: skill,
        logger: this.deps.logger,
        locale: this.deps.locale,
      });
      if (!createResult.success) {
        this.deps.logger.error(
          "[MessageDbWriter] Failed to create tool message",
          {
            messageId: toolMessageId,
            error: createResult.message,
          },
        );
      }
      // Roll any queued messages forward to this new frontier
      this.engine.advanceQueuedMessages(threadId, toolMessageId);
    }
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
    toolLabel?: string;
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
      toolLabel,
      error,
      skipSseEmit,
      user,
    } = params;

    // SSE: MESSAGE_CREATED with updated toolCall (result/error)
    this.deps.wsEmit("message-created", {
      urlPathParams: { threadId },
      responseData: {
        streamingState: ThreadStreamingState.STREAMING,
        messages: [
          buildSseMessageRow({
            id: toolMessageId,
            threadId,
            role: ChatMessageRole.TOOL,
            isAI: true,
            parentId,
            sequenceId: sequenceId ?? null,
            model: model ?? null,
            skill: skill ?? null,
            metadata: { toolCall },
          }),
        ],
      },
    });

    // DB: update tool message with result/error.
    // Skip for wakeUp: handleTaskCompletion already backfilled the real result inline
    // (before execute-tool returned the stub). Writing the stub here would clobber it.
    // For detach: write the {hint, taskId} stub now — handleTaskCompletion will
    // replace it with the final result when the goroutine completes.
    if (!this.deps.isIncognito && toolCall.callbackMode !== "wakeUp") {
      const updateResult = await db
        .update(chatMessages)
        .set({ metadata: { toolCall }, updatedAt: new Date() })
        .where(eq(chatMessages.id, toolMessageId))
        .returning({ id: chatMessages.id });

      if (updateResult.length === 0) {
        this.deps.logger.error(
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
          logger: this.deps.logger,
          locale: this.deps.locale,
        });
        if (!fallbackResult.success) {
          this.deps.logger.error(
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
      this.deps.wsEmit("tool-result", {
        urlPathParams: { threadId },
        responseData: {
          messages: [{ id: toolMessageId, metadata: { toolCall } }],
        },
      });
    }

    // SSE + DB: CREDITS_DEDUCTED if tool consumed credits and succeeded
    if (toolCall.creditsUsed && toolCall.creditsUsed > 0 && !error) {
      await this.deductAndEmitCredits({
        user,
        amount: toolCall.creditsUsed,
        feature: toolLabel ?? toolName,
        type: "tool",
        model,
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
      this.deps.wsEmit("tool-result", {
        urlPathParams: { threadId: this.lastThreadId ?? "" },
        responseData: {
          messages: [
            { id: result.messageId, metadata: { toolCall: result.toolCall } },
          ],
        },
      });
      emitted.add(result.messageId);
    }
    return emitted;
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
    this.deps.wsEmit("tool-result-updated", {
      urlPathParams: { threadId: this.lastThreadId ?? "" },
      responseData: {
        messages: [{ id: messageId, metadata: { toolCall } }],
      },
    });

    // DB: backfill the result into the tool message
    if (!this.deps.isIncognito) {
      try {
        await db
          .update(chatMessages)
          .set({ metadata: { toolCall }, updatedAt: new Date() })
          .where(eq(chatMessages.id, messageId));
      } catch (err) {
        this.deps.logger.warn(
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
    this.deps.wsEmit("tool-result", {
      urlPathParams: { threadId: this.lastThreadId ?? "" },
      responseData: {
        messages: [{ id: toolMessageId, metadata: { toolCall } }],
      },
    });

    // DB: persist partial result so page refresh shows latest state
    if (!this.deps.isIncognito) {
      try {
        await db
          .update(chatMessages)
          .set({ metadata: { toolCall }, updatedAt: new Date() })
          .where(eq(chatMessages.id, toolMessageId));
      } catch (err) {
        this.deps.logger.warn(
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
   * Emits a TOOL_RESULT WS event so the frontend renders the generated media.
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

    if (this.deps.isIncognito) {
      return;
    }

    try {
      const createdAt = new Date();
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
        createdAt,
        updatedAt: createdAt,
      });

      // FULL message-created first: without role/parentId on the wire a
      // mirror can only materialize a parentless stub — a phantom second
      // root that never heals. The row's real createdAt rides along so
      // chain chronology holds on every mirror.
      this.deps.wsEmit("message-created", {
        urlPathParams: { threadId },
        responseData: {
          streamingState: ThreadStreamingState.STREAMING,
          messages: [
            buildSseMessageRow({
              id: messageId,
              threadId,
              role: ChatMessageRole.TOOL,
              isAI: true,
              content: null,
              parentId,
              sequenceId: sequenceId ?? null,
              model: model ?? null,
              skill: skill ?? null,
              metadata: { toolCall },
              createdAt,
              updatedAt: createdAt,
            }),
          ],
        },
      });
      // Emit WS event so the frontend renders the synthetic tool result
      // (e.g. natively-generated image from Gemini appears in chat UI)
      this.deps.wsEmit("tool-result", {
        urlPathParams: { threadId },
        responseData: {
          messages: [{ id: messageId, metadata: { toolCall } }],
        },
      });
    } catch (err) {
      this.deps.logger.warn(
        "[MessageDbWriter] Failed to insert synthetic tool message",
        {
          messageId,
          error: err instanceof Error ? err.message : String(err),
        },
      );
    }
  }

  // ─── media ─────────────────────────────────────────────────────────────────

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
    this.deps.wsEmit("message-created", {
      urlPathParams: { threadId },
      responseData: {
        streamingState: ThreadStreamingState.STREAMING,
        messages: [
          buildSseMessageRow({
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
          }),
        ],
      },
    });

    // DB: insert with metadata
    if (!this.deps.isIncognito) {
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
        this.deps.logger.warn(
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
    this.deps.wsEmit("generated-media-added", {
      urlPathParams: { threadId: this.lastThreadId ?? "" },
      responseData: {
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
      },
    });

    // DB: merge generatedMedia into existing message metadata
    if (!this.deps.isIncognito) {
      try {
        await db
          .update(chatMessages)
          .set({
            metadata: sql`metadata || ${JSON.stringify({ generatedMedia, creditCost: generatedMedia.creditCost })}::jsonb`,
            updatedAt: new Date(),
          })
          .where(eq(chatMessages.id, messageId));
      } catch (err) {
        this.deps.logger.warn(
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
   * Emit STREAMING_STATE_CHANGED SSE event.
   * Used to mark the thread as "streaming" before gap-fill begins so the UI
   * shows an activity indicator during potentially long bridge calls.
   */
  emitStreamingStateChanged(params: {
    threadId: string;
    state: ThreadStreamingState;
  }): void {
    this.deps.wsEmit("streaming-state-changed", {
      responseData: {
        streamingState: params.state,
      },
      urlPathParams: { threadId: params.threadId },
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
    this.deps.wsEmit("gap-fill-started", {
      urlPathParams: { threadId: this.lastThreadId ?? "" },
      responseData: {
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
      },
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
    this.deps.wsEmit("gap-fill-completed", {
      urlPathParams: { threadId: this.lastThreadId ?? "" },
      responseData: {
        messages: [
          {
            id: params.messageId,
            metadata: {
              variants: [params.variant],
              gapFillStatus: null, // clear the "transcribing/analyzing" indicator
            },
          },
        ],
      },
    });

    // Persist variant to DB (non-incognito only)
    if (!this.deps.isIncognito) {
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
        this.deps.logger.warn(
          "[MessageDbWriter] Failed to persist gap-fill variant",
          {
            messageId: params.messageId,
            error: err instanceof Error ? err.message : String(err),
          },
        );
      }
    }
  }

  // ─── compacting ────────────────────────────────────────────────────────────

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
    this.deps.wsEmit("message-created", {
      urlPathParams: { threadId },
      responseData: {
        streamingState: ThreadStreamingState.STREAMING,
        messages: [
          buildSseMessageRow({
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
              isStreaming: true,
              compactedMessageCount: messagesToCompact.length,
              ...(containsMediaReferences && { containsMediaReferences: true }),
            },
            createdAt,
            updatedAt: createdAt,
          }),
        ],
      },
    });

    // DB
    if (!this.deps.isIncognito) {
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
          ...(messagesToCompact.length > 0 && {
            compactedTimeRange: {
              start: messagesToCompact[0]?.createdAt.toISOString() ?? "",
              end:
                messagesToCompact[
                  messagesToCompact.length - 1
                ]?.createdAt.toISOString() ?? "",
            },
            originalMessageIds: messagesToCompact.map((m) => m.id),
          }),
          ...(containsMediaReferences && { containsMediaReferences: true }),
        },
        createdAt,
      });
      // Roll any queued messages forward to this new frontier
      this.engine.advanceQueuedMessages(threadId, messageId);
    }
  }

  /**
   * Mark a compacting message as failed: emits SSE so live clients exit loading state,
   * and updates DB so the next session shows the failed state.
   * Sets metadata.compactingFailed = true and errorMessage so the UI can show a failed state,
   * and the next send can detect it and retry compacting as a sibling.
   */
  async emitCompactingFailed(params: {
    messageId: string;
    errorMessage: string;
  }): Promise<void> {
    const { messageId, errorMessage } = params;

    // SSE: notify live clients immediately so the loading spinner clears
    this.deps.wsEmit("compacting-done", {
      urlPathParams: { threadId: this.lastThreadId ?? "" },
      responseData: {
        messages: [
          {
            id: messageId,
            content: "",
            metadata: {
              isCompacting: true,
              isStreaming: false,
              compactingFailed: true,
            },
          },
        ],
      },
    });

    if (this.deps.isIncognito) {
      return;
    }
    await db
      .update(chatMessages)
      .set({
        metadata: sql`metadata || ${JSON.stringify({ isCompacting: true, isStreaming: false, compactingFailed: true })}::jsonb`,
        errorMessage,
      })
      .where(eq(chatMessages.id, messageId));
  }

  /**
   * Emit COMPACTING_DELTA SSE event.
   */
  emitCompactingDelta(messageId: string, delta: string): void {
    this.deps.wsEmit("compacting-delta", {
      urlPathParams: { threadId: this.lastThreadId ?? "" },
      responseData: {
        messages: [
          { id: messageId, content: delta, metadata: { isStreaming: true } },
        ],
      },
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
    if (!this.deps.isIncognito) {
      await MessagesRepository.updateMessageContent({
        messageId,
        content,
        logger: this.deps.logger,
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
            ...(messagesToCompact.length > 0 && {
              compactedTimeRange: {
                start: messagesToCompact[0]?.createdAt.toISOString() ?? "",
                end:
                  messagesToCompact[
                    messagesToCompact.length - 1
                  ]?.createdAt.toISOString() ?? "",
              },
              originalMessageIds: messagesToCompact.map((m) => m.id),
            }),
          },
        })
        .where(eq(chatMessages.id, messageId));
    }

    // SSE: TOKENS_UPDATED
    this.deps.wsEmit("tokens-updated", {
      urlPathParams: { threadId: params.threadId },
      responseData: {
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
      },
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
    this.deps.wsEmit("compacting-done", {
      urlPathParams: { threadId: params.threadId },
      responseData: {
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
      },
    });
  }

  // ─── credits ───────────────────────────────────────────────────────────────

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
            this.deps.logger,
            this.deps.creditsT,
            this.deps.locale,
          )
        : await CreditRepository.deductCreditsForFeature(
            params.user,
            params.amount,
            params.feature,
            this.deps.logger,
            this.deps.creditsT,
            this.deps.locale,
          );

    if (deductResult.success) {
      this.totalCreditsDeducted += params.amount;
    } else {
      this.deps.logger.error("[MessageDbWriter] Failed to deduct credits", {
        amount: params.amount,
        feature: params.feature,
        model: params.type === "model" ? params.model : (params.model ?? null),
        error: deductResult.message,
      });
    }
  }

  // ─── notifications ─────────────────────────────────────────────────────────

  /**
   * Emit a generic SSE error event.
   * @param parentId - Optional parent message ID so the error appears as a child of a specific message (e.g. a failed compacting bubble).
   */
  emitError(errorResponse: ErrorResponseType, parentId?: string | null): void {
    this.deps.wsEmit("error", {
      urlPathParams: { threadId: this.lastThreadId ?? "" },
      responseData: {
        messages: [
          {
            id: crypto.randomUUID(),
            role: ChatMessageRole.ERROR,
            content: errorResponse.message ?? null,
            parentId: parentId ?? null,
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
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
    });
  }

  /**
   * Emit THREAD_TITLE_UPDATED SSE so the sidebar immediately shows the new title.
   */
  emitThreadTitleUpdated(params: { threadId: string; title: string }): void {
    // Title lives on the thread, not on messages - route directly to sidebar channels.
    this.deps.emitTitle?.(params.threadId, params.title);
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
    this.deps.wsEmit("voice-transcribed", {
      urlPathParams: {
        threadId: params.threadId ?? this.lastThreadId ?? "",
      },
      responseData: {
        messages: [
          {
            id: params.messageId,
            content: params.text,
            metadata: { isTranscribing: false },
          },
        ],
      },
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
    this.deps.wsEmit("files-uploaded", {
      urlPathParams: { threadId: this.lastThreadId ?? "" },
      responseData: {
        messages: [
          {
            id: params.messageId,
            metadata: {
              isUploadingAttachments: false,
              attachments: params.attachments,
            },
          },
        ],
      },
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
    /** Skip DB write regardless of incognito mode (e.g. credit errors) */
    skipDb?: boolean;
  }): Promise<void> {
    const { threadId, errorType, error, parentId, sequenceId, user } = params;
    const errorMessageId = crypto.randomUUID();
    const serializedError = params.content ?? serializeError(error);

    // SSE: MESSAGE_CREATED for the error message
    // The client's MESSAGE_CREATED handler adds this to the chat store with the
    // correct parentId/sequenceId - no additional ERROR event needed.
    this.deps.wsEmit("message-created", {
      urlPathParams: { threadId },
      responseData: {
        streamingState: ThreadStreamingState.STREAMING,
        messages: [
          buildSseMessageRow({
            id: errorMessageId,
            threadId,
            role: ChatMessageRole.ERROR,
            content: serializedError,
            parentId,
            sequenceId: sequenceId ?? null,
            authorId: user.id ?? null,
            errorType: errorType ?? null,
          }),
        ],
      },
    });

    // DB: save error message (skip for incognito and for errors that must not persist, e.g. credit errors)
    if (!this.deps.isIncognito && !params.skipDb) {
      await MessagesRepository.createErrorMessage({
        messageId: errorMessageId,
        threadId,
        content: serializedError,
        errorType,
        parentId,
        user,
        sequenceId,
        logger: this.deps.logger,
      });
    }
  }

  // ─── embedding sync ────────────────────────────────────────────────────────

  /**
   * Sync file uploads to cortex_nodes for vector search.
   */
  syncToolResultEmbedding(
    userId: string,
    toolMessageId: string,
    toolName: string,
  ): Promise<void> {
    return syncToolResultEmbedding(userId, toolMessageId, toolName);
  }

  /**
   * Sync a file upload to cortex_nodes for vector search.
   */
  syncUploadEmbedding(userId: string, userMessageId: string): Promise<void> {
    return syncUploadEmbedding(userId, userMessageId);
  }

  /**
   * Sync the current thread to cortex_nodes for vector search.
   */
  syncThreadEmbedding(): Promise<void> {
    return syncThreadEmbedding(this.lastThreadId);
  }

  // ─── throttle / low-level DB writes ────────────────────────────────────────

  /** Emit a single CONTENT_DELTA SSE event. */
  emitDelta(messageId: string, delta: string): void {
    this.deps.wsEmit("content-delta", {
      urlPathParams: { threadId: this.lastThreadId ?? "" },
      responseData: {
        messages: [{ id: messageId, content: delta }],
      },
    });
  }

  /** Schedule a throttled DB write. */
  scheduleUpdate(messageId: string, content: string): void {
    this.engine.scheduleUpdate(messageId, content);
  }

  /** Cancel timer and write immediately. Removes from pending map. */
  flush(messageId: string): Promise<void> {
    return this.engine.flush(messageId);
  }

  /** Flush all pending messages. Call at stream end. */
  flushAll(): Promise<void> {
    return this.engine.flushAll();
  }

  /**
   * Flush all pending writes then write final content (for tool-call boundaries).
   * Does NOT emit any SSE events.
   */
  flushContent(messageId: string, content: string): Promise<void> {
    return this.engine.flushContent(messageId, content);
  }

  /** Direct DB write without throttling. */
  writeNow(messageId: string, content: string): Promise<void> {
    return this.engine.writeNow(messageId, content);
  }

  /** Write token metadata only (no content update). Used when content was already flushed. */
  writeTokenMetadataOnly(
    messageId: string,
    tokens: {
      promptTokens: number | null;
      completionTokens: number | null;
      finishReason: string | null;
      cachedInputTokens?: number | null;
      cacheWriteTokens?: number | null;
      timeToFirstToken?: number | null;
      streamingTime?: number | null;
      creditCost?: number | null;
    },
  ): Promise<void> {
    return this.engine.writeTokenMetadataOnly(messageId, tokens);
  }

  /** Write final content and token metadata in a single DB update. */
  writeContentAndTokens(
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
    return this.engine.writeContentAndTokens(messageId, content, tokens);
  }
}

/**
 * Throttle engine - the debounced DB write mechanism behind MessageDbWriter.
 *
 * Owns the `pending` debounce map and the low-level DB content writes. Content
 * updates within THROTTLE_MS are coalesced so rapid deltas don't hammer the DB;
 * flush() / flushAll() cancel the timer and write immediately - always called
 * before stream ends or on error.
 */
class ThrottleEngine {
  private readonly pending = new Map<string, PendingWrite>();

  constructor(private readonly deps: WriterDeps) {}

  /**
   * After each new message is committed to DB, advance any queued messages in
   * the thread so their parentId always points to the latest frontier message.
   *
   * This prevents queued messages from branching off a mid-stream point:
   * as tool calls, tool results, and assistant messages are added, every
   * queued message rolls forward with the chain.
   *
   * Fire-and-forget: never blocks the stream. SSE is emitted per queued
   * message so the client updates position live without a page refresh.
   */
  advanceQueuedMessages(threadId: string, newParentId: string): void {
    if (this.deps.isIncognito) {
      return;
    }
    void (async (): Promise<void> => {
      try {
        // Find all queued messages in this thread
        const queued = await db
          .select({ id: chatMessages.id, metadata: chatMessages.metadata })
          .from(chatMessages)
          .where(
            sql`${chatMessages.threadId} = ${threadId}
              AND ${chatMessages.role} = 'user'
              AND ${chatMessages.metadata}->>'isQueued' = 'true'`,
          );
        if (queued.length === 0) {
          return;
        }
        const now = new Date();
        await db
          .update(chatMessages)
          .set({ parentId: newParentId, updatedAt: now })
          .where(
            sql`${chatMessages.threadId} = ${threadId}
              AND ${chatMessages.role} = 'user'
              AND ${chatMessages.metadata}->>'isQueued' = 'true'`,
          );
        // Emit SSE for each queued message so the client tracks live
        for (const q of queued) {
          this.deps.wsEmit("message-created", {
            urlPathParams: { threadId },
            responseData: {
              streamingState: ThreadStreamingState.STREAMING,
              messages: [
                buildSseMessageRow({
                  id: q.id,
                  threadId,
                  role: ChatMessageRole.USER,
                  parentId: newParentId,
                  metadata: q.metadata ?? { isQueued: true },
                  createdAt: now,
                  updatedAt: now,
                }),
              ],
            },
          });
        }
      } catch (err) {
        this.deps.logger.warn(
          "[MessageDbWriter] Failed to advance queued messages",
          {
            threadId,
            newParentId,
            error: err instanceof Error ? err.message : String(err),
          },
        );
      }
    })();
  }

  /** Schedule a throttled DB write. */
  scheduleUpdate(messageId: string, content: string): void {
    if (this.deps.isIncognito) {
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
          this.deps.logger.error(
            "[MessageDbWriter] Throttled update failed",
            err,
            {
              messageId,
            },
          );
        },
      );
    }, THROTTLE_MS);
  }

  /** Cancel timer and write immediately. Removes from pending map. */
  async flush(messageId: string): Promise<void> {
    if (this.deps.isIncognito) {
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
    if (this.deps.isIncognito) {
      return;
    }
    await Promise.all([...this.pending.keys()].map((id) => this.flush(id)));
  }

  /**
   * Flush all pending writes then write final content (for tool-call boundaries).
   * Does NOT emit any SSE events.
   */
  async flushContent(messageId: string, content: string): Promise<void> {
    if (this.deps.isIncognito) {
      return;
    }
    await this.flush(messageId);
    await this.writeNow(messageId, content);
  }

  /** Direct DB write without throttling. */
  async writeNow(messageId: string, content: string): Promise<void> {
    if (this.deps.isIncognito) {
      return;
    }
    try {
      await db
        .update(chatMessages)
        .set({ content: content.trim() || null, updatedAt: new Date() })
        .where(eq(chatMessages.id, messageId));
    } catch (err) {
      this.deps.logger.error(
        "[MessageDbWriter] Failed to update message content",
        {
          messageId,
          error: err instanceof Error ? err.message : String(err),
        },
      );
    }
  }

  /** Build a partial MessageMetadata object from token fields, omitting nulls/zeros. */
  private static buildTokenMetadata(tokens: {
    promptTokens: number | null;
    completionTokens: number | null;
    finishReason: string | null;
    cachedInputTokens?: number | null;
    cacheWriteTokens?: number | null;
    timeToFirstToken?: number | null;
    streamingTime?: number | null;
    creditCost?: number | null;
  }): Partial<MessageMetadata> {
    const meta: Partial<MessageMetadata> = {};
    if (tokens.promptTokens !== null) {
      meta.promptTokens = tokens.promptTokens;
    }
    if (tokens.completionTokens !== null) {
      meta.completionTokens = tokens.completionTokens;
    }
    if (tokens.finishReason) {
      meta.finishReason = tokens.finishReason;
    }
    if (
      tokens.cachedInputTokens !== null &&
      tokens.cachedInputTokens !== undefined
    ) {
      meta.cachedInputTokens = tokens.cachedInputTokens;
    }
    if (
      tokens.cacheWriteTokens !== null &&
      tokens.cacheWriteTokens !== undefined &&
      tokens.cacheWriteTokens > 0
    ) {
      meta.cacheWriteTokens = tokens.cacheWriteTokens;
    }
    if (
      tokens.timeToFirstToken !== null &&
      tokens.timeToFirstToken !== undefined
    ) {
      meta.timeToFirstToken = tokens.timeToFirstToken;
    }
    if (tokens.streamingTime !== null && tokens.streamingTime !== undefined) {
      meta.streamingTime = tokens.streamingTime;
    }
    if (tokens.creditCost !== null && tokens.creditCost !== undefined) {
      meta.creditCost = tokens.creditCost;
    }
    return meta;
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
      streamingTime?: number | null;
      creditCost?: number | null;
    },
  ): Promise<void> {
    if (this.deps.isIncognito) {
      return;
    }
    try {
      const tokenMetadata = ThrottleEngine.buildTokenMetadata(tokens);
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
          metadata: { ...existing?.metadata, ...tokenMetadata },
          updatedAt: new Date(),
        })
        .where(eq(chatMessages.id, messageId));
    } catch (err) {
      this.deps.logger.error(
        "[MessageDbWriter] Failed to write token metadata",
        {
          messageId,
          error: err instanceof Error ? err.message : String(err),
        },
      );
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
    if (this.deps.isIncognito) {
      return;
    }
    try {
      const tokenMetadata = ThrottleEngine.buildTokenMetadata(tokens);

      if (Object.keys(tokenMetadata).length > 0) {
        const [existing] = await db
          .select({ metadata: chatMessages.metadata })
          .from(chatMessages)
          .where(eq(chatMessages.id, messageId));

        await db
          .update(chatMessages)
          .set({
            content: content.trim() || null,
            metadata: { ...existing?.metadata, ...tokenMetadata },
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
      this.deps.logger.error(
        "[MessageDbWriter] Failed to write content and token metadata",
        {
          messageId,
          error: err instanceof Error ? err.message : String(err),
        },
      );
    }
  }
}
