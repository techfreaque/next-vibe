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
  syncMessageEmbeddings,
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
  lastThreadId: string | null = null;
  /** Stream context of the owning stream (its threadId) - binds embedding-sync
   *  API calls so they record/replay. Passed at construction. */
  streamContext: ToolExecutionContext;

  readonly deps: WriterDeps;
  readonly engine: ThrottleEngine;

  constructor(
    isIncognito: boolean,
    logger: EndpointLogger,
    creditsT: ModuleT,
    locale: CountryLanguage,
    readonly wsEmit: MessagesWsEmit,
    emitTitle: EmitThreadTitleFn,
    streamContext: ToolExecutionContext,
  ) {
    this.streamContext = streamContext;
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
  emitMessageCreated(params: {
    messageId: string;
    threadId: string;
    content: string;
    parentId: string | null;
    userId: string | undefined;
    model: ChatModelId;
    skill: string;
    sequenceId: string | null;
  }): Promise<void> {
    return textWrites.emitMessageCreated(this, params);
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
  emitContentDone(params: {
    messageId: string;
    content: string;
    finishReason: string | null;
    totalTokens: number | null;
    promptTokens: number | null;
    completionTokens: number | null;
    cachedInputTokens?: number;
    timeToFirstToken?: number | null;
  }): Promise<void> {
    return textWrites.emitContentDone(this, params);
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
    textWrites.emitEstimatedTokens(
      this,
      messageId,
      charCount,
      estimatedInputTokens,
    );
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
    textWrites.emitTokensUpdated(this, params);
  }

  /**
   * Emit MESSAGE_CREATED SSE for a placeholder ASSISTANT message (no text content),
   * and create the row in DB immediately so TOOL messages can reference it as parent.
   */
  emitPlaceholderAssistantMessage(params: {
    messageId: string;
    threadId: string;
    parentId: string | null;
    userId: string | undefined;
    model: ChatModelId;
    skill: string;
    sequenceId: string | null;
  }): Promise<void> {
    return textWrites.emitPlaceholderAssistantMessage(this, params);
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
    textWrites.emitUserMessageCreated(this, params);
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
    textWrites.emitContentDoneRaw(this, params);
  }

  // ─── tools ─────────────────────────────────────────────────────────────────

  /**
   * Emit MESSAGE_CREATED + TOOL_CALL SSE for a new tool message,
   * and create the row in DB immediately.
   */
  emitToolCall(params: {
    toolMessageId: string;
    threadId: string;
    parentId: string | null;
    userId: string | undefined;
    model: ChatModelId;
    skill: string;
    sequenceId: string | null;
    toolCall: ToolCall;
  }): Promise<void> {
    return toolWrites.emitToolCall(this, params);
  }

  /**
   * Update tool message in DB with result/error, emit MESSAGE_CREATED (with result)
   * and TOOL_RESULT SSE events. Also emits CREDITS_DEDUCTED if tool had credits.
   */
  emitToolResult(params: {
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
    return toolWrites.emitToolResult(this, params);
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
    return toolWrites.emitBatchToolResults(this, toolResults);
  }

  /**
   * Emit TOOL_RESULT_UPDATED SSE and update the DB row with the real result.
   * Called when an async job completes and the previously-pending tool result is ready.
   */
  emitToolResultUpdated(params: {
    messageId: string;
    toolCallId: string;
    result: WidgetData;
    toolCall: ToolCall; // full updated toolCall with result
  }): Promise<void> {
    return toolWrites.emitToolResultUpdated(this, params);
  }

  /**
   * Emit a partial tool result to the parent thread's WS channel and persist to DB.
   * The tool message stays in "Executing" state (isPartial=true) but partial result
   * data is available to the widget. Used by long-running tools (e.g. ai-run) to
   * stream intermediate state (like a sub-thread ID) before the tool finishes.
   */
  emitPartialToolResult(params: {
    toolMessageId: string;
    toolCall: ToolCall;
  }): Promise<void> {
    return toolWrites.emitPartialToolResult(this, params);
  }

  /**
   * Write a synthetic TOOL message row for a natively-generated file part.
   * The LLM emitted a file directly (e.g. Gemini Flash Image); this creates
   * a sibling TOOL message so subsequent turns see the file URL in tool-result context.
   * Emits a TOOL_RESULT WS event so the frontend renders the generated media.
   */
  emitSyntheticToolMessage(params: {
    messageId: string;
    threadId: string;
    parentId: string | null;
    userId: string | undefined;
    model: ChatModelId;
    skill: string;
    sequenceId: string | null;
    toolCall: ToolCall;
  }): Promise<void> {
    return toolWrites.emitSyntheticToolMessage(this, params);
  }

  // ─── media ─────────────────────────────────────────────────────────────────

  /**
   * Create an ASSISTANT message for generated media (image/audio).
   * Emits MESSAGE_CREATED SSE with generatedMedia metadata, inserts to DB.
   */
  emitGeneratedMediaMessage(params: {
    messageId: string;
    threadId: string;
    parentId: string | null;
    userId: string | undefined;
    model: ChatModelId;
    skill: string;
    sequenceId: string | null;
    generatedMedia: MessageMetadata["generatedMedia"];
  }): Promise<void> {
    return mediaWrites.emitGeneratedMediaMessage(this, params);
  }

  /**
   * Attach generated media to an existing assistant message (no new message created).
   * Emits GENERATED_MEDIA_ADDED SSE and updates the DB metadata JSONB.
   * Used when an LLM emits text first, then a file part - both belong in the same bubble.
   */
  emitGeneratedMediaOnExistingMessage(params: {
    messageId: string;
    generatedMedia: MessageMetadata["generatedMedia"];
  }): Promise<void> {
    return mediaWrites.emitGeneratedMediaOnExistingMessage(this, params);
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
    mediaWrites.emitStreamingStateChanged(this, params);
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
    mediaWrites.emitGapFillStarted(this, params);
  }

  /**
   * Emit GAP_FILL_COMPLETED SSE event and persist the variant to DB.
   * Called when a modality bridge finishes and the text variant is ready.
   */
  emitGapFillCompleted(params: {
    messageId: string;
    bridgeType: "stt" | "vision" | "translation" | "tts";
    modality: Modality;
    variant: MessageVariant;
  }): Promise<void> {
    return mediaWrites.emitGapFillCompleted(this, params);
  }

  // ─── compacting ────────────────────────────────────────────────────────────

  /**
   * Emit MESSAGE_CREATED SSE for a compacting message and insert to DB.
   */
  emitCompactingMessageCreated(params: {
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
    return compactingWrites.emitCompactingMessageCreated(this, params);
  }

  /**
   * Mark a compacting message as failed: emits SSE so live clients exit loading state,
   * and updates DB so the next session shows the failed state.
   * Sets metadata.compactingFailed = true and errorMessage so the UI can show a failed state,
   * and the next send can detect it and retry compacting as a sibling.
   */
  emitCompactingFailed(params: {
    messageId: string;
    errorMessage: string;
  }): Promise<void> {
    return compactingWrites.emitCompactingFailed(this, params);
  }

  /**
   * Emit COMPACTING_DELTA SSE event.
   */
  emitCompactingDelta(messageId: string, delta: string): void {
    compactingWrites.emitCompactingDelta(this, messageId, delta);
  }

  /**
   * Finalize compacting: update DB, emit TOKENS_UPDATED, deduct + emit credits, emit COMPACTING_DONE.
   */
  emitCompactingDone(params: {
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
    return compactingWrites.emitCompactingDone(this, params);
  }

  // ─── credits ───────────────────────────────────────────────────────────────

  /**
   * Deduct credits in DB then emit CREDITS_DEDUCTED SSE.
   * Returns whether deduction succeeded.
   */
  deductAndEmitCredits(params: DeductAndEmitCreditsParams): Promise<void> {
    return deductAndEmitCredits(this, params);
  }

  // ─── notifications ─────────────────────────────────────────────────────────

  /**
   * Emit a generic SSE error event.
   * @param parentId - Optional parent message ID so the error appears as a child of a specific message (e.g. a failed compacting bubble).
   */
  emitError(errorResponse: ErrorResponseType, parentId?: string | null): void {
    notificationWrites.emitError(this, errorResponse, parentId);
  }

  /**
   * Emit THREAD_TITLE_UPDATED SSE so the sidebar immediately shows the new title.
   */
  emitThreadTitleUpdated(params: { threadId: string; title: string }): void {
    notificationWrites.emitThreadTitleUpdated(this, params);
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
    notificationWrites.emitVoiceTranscribed(this, params);
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
    notificationWrites.emitFilesUploaded(this, params);
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
  emitErrorMessage(params: {
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
    return notificationWrites.emitErrorMessage(this, params);
  }

  // ─── embedding sync ────────────────────────────────────────────────────────

  /**
   * Sync file uploads to cortex_nodes for vector search.
   */
  syncUploadEmbedding(
    userId: string,
    threadId: string,
    attachments: Array<{ filename: string; mimeType: string }>,
  ): Promise<void> {
    return syncUploadEmbedding(
      userId,
      threadId,
      attachments,
      this.streamContext,
    );
  }

  /**
   * Sync the current thread stub to cortex_nodes for directory listing.
   */
  syncThreadEmbedding(): Promise<void> {
    return syncThreadEmbedding(this.lastThreadId, this.streamContext);
  }

  // ─── throttle / low-level DB writes ────────────────────────────────────────

  /** Emit a single CONTENT_DELTA SSE event. */
  emitDelta(messageId: string, delta: string): void {
    textWrites.emitDelta(this, messageId, delta);
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
