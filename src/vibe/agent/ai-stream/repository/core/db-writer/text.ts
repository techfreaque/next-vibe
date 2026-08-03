/**
 * Text / streamed-message writing - MESSAGE_CREATED, CONTENT_DELTA,
 * CONTENT_DONE and token-update emits plus their DB persistence.
 * The throttled content writes go through the writer's ThrottleEngine.
 */

import "server-only";

import type { ChatModelId } from "../../../models";

import type { MessageMetadata } from "../../../../chat/db";
import { ChatMessageRole, ThreadStreamingState } from "../../../../chat/enum";
import { MessagesRepository } from "../../../../chat/threads/[threadId]/messages/repository";
import type { DbWriterState } from "./shared";
import { buildSseMessageRow } from "./sse-row";

/** Emit a single CONTENT_DELTA SSE event. */
export function emitDelta(
  w: DbWriterState,
  messageId: string,
  delta: string,
): void {
  w.deps.wsEmit("content-delta", {
    urlPathParams: { threadId: w.lastThreadId ?? "" },
    responseData: {
      messages: [{ id: messageId, content: delta }],
    },
  });
}

/**
 * Create a new ASSISTANT message: emit MESSAGE_CREATED + CONTENT_DELTA SSE,
 * then insert into DB.
 */
export async function emitMessageCreated(
  w: DbWriterState,
  params: {
    messageId: string;
    threadId: string;
    content: string;
    parentId: string | null;
    userId: string | undefined;
    model: ChatModelId;
    skill: string;
    sequenceId: string | null;
  },
): Promise<void> {
  const { messageId, threadId, content, parentId, model, skill, sequenceId } =
    params;

  w.lastAssistantMessageId = messageId;
  w.lastThreadId = threadId;

  // ONE authoritative creation time, shared by the SSE wire AND the DB insert —
  // see createToolMessage.createdAt: wire and DB must agree so a mirror healing
  // from the wire reproduces the origin's message order.
  const createdAt = new Date();

  // Emit MESSAGE_CREATED (always - even incognito needs this for the UI)
  w.deps.wsEmit("message-created", {
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
          createdAt,
        }),
      ],
    },
  });

  // Emit initial CONTENT_DELTA
  if (content) {
    emitDelta(w, messageId, content);
  }

  // Persist to DB
  if (!w.deps.isIncognito) {
    const result = await MessagesRepository.createTextMessage({
      messageId,
      threadId,
      content,
      parentId,
      userId: params.userId,
      model,
      skill: skill,
      sequenceId,
      logger: w.deps.logger,
      locale: w.deps.locale,
      createdAt,
    });
    if (!result.success) {
      // Data loss, not a mere warning: the assistant's reply never lands in
      // the DB and the client never learns why - createTextMessage already
      // logged the underlying cause, this is the stream-context companion.
      w.deps.logger.error(
        "[MessageDbWriter] Failed to create ASSISTANT message - reply not persisted",
        {
          messageId,
          threadId,
          parentId,
          error: result.message,
          errorType: result.errorType?.errorCode,
        },
      );
    }
    // Roll any queued messages forward to this new frontier
    w.engine.advanceQueuedMessages(threadId, messageId);
  }
}

/**
 * Emit CONTENT_DONE SSE, flush + write final content to DB, write token metadata.
 * Call at the end of a message (stream complete or step boundary).
 */
export async function emitContentDone(
  w: DbWriterState,
  params: {
    messageId: string;
    content: string;
    finishReason: string | null;
    totalTokens: number | null;
    promptTokens: number | null;
    completionTokens: number | null;
    cachedInputTokens?: number;
    timeToFirstToken?: number | null;
  },
): Promise<void> {
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
  w.deps.wsEmit("content-done", {
    urlPathParams: { threadId: w.lastThreadId ?? "" },
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
  w.lastAssistantContent = content;

  // DB: flush pending throttled write, then write definitive final content + token metadata
  if (!w.deps.isIncognito) {
    await w.engine.flush(messageId);
    await w.engine.writeContentAndTokens(messageId, content, {
      promptTokens: promptTokens ?? null,
      completionTokens: completionTokens ?? null,
      finishReason,
      cachedInputTokens: cachedInputTokens ?? null,
      timeToFirstToken: timeToFirstToken ?? null,
    });

    // Embed this assistant message at write time — the next step's cortex
    // refresh awaits this promise so its search sees the vector (cortex search
    // reads stored vectors only). The assistant row exists now with final
    // content, so it can carry its own vector like the user message does.
    w.assistantEmbedPromise = (async (): Promise<void> => {
      const { embedAssistantMessageRow } =
        await import("../../../../cortex/embeddings/message-embed");
      await embedAssistantMessageRow(
        messageId,
        content,
        w.toolExecutionContext,
      );
    })();
  }
}

/**
 * Emit a lightweight TOKENS_UPDATED SSE event with an estimated completion token count.
 * SSE-only, no DB write. Used mid-stream (during content delta) to give the UI a
 * live approximation before the real count arrives from the API at step finish.
 * Estimate: chars / 4 (rough GPT-style average).
 */
export function emitEstimatedTokens(
  w: DbWriterState,
  messageId: string,
  charCount: number,
  estimatedInputTokens?: number,
): void {
  const estimatedTokens = Math.ceil(charCount / 4);
  w.deps.wsEmit("tokens-updated", {
    urlPathParams: { threadId: w.lastThreadId ?? "" },
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
export function emitTokensUpdated(
  w: DbWriterState,
  params: {
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
  },
): void {
  w.deps.wsEmit("tokens-updated", {
    urlPathParams: { threadId: w.lastThreadId ?? "" },
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
              params.cacheWriteTokens > 0 ? params.cacheWriteTokens : undefined,
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
export async function emitPlaceholderAssistantMessage(
  w: DbWriterState,
  params: {
    messageId: string;
    threadId: string;
    parentId: string | null;
    userId: string | undefined;
    model: ChatModelId;
    skill: string;
    sequenceId: string | null;
  },
): Promise<void> {
  const { messageId, threadId, parentId, model, skill, sequenceId } = params;

  w.lastAssistantMessageId = messageId;
  w.lastThreadId = threadId;

  // SSE: MESSAGE_CREATED with empty content
  w.deps.wsEmit("message-created", {
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
  if (!w.deps.isIncognito) {
    const result = await MessagesRepository.createTextMessage({
      messageId,
      threadId,
      content: "",
      parentId,
      userId: params.userId,
      model,
      skill: skill,
      sequenceId,
      logger: w.deps.logger,
      locale: w.deps.locale,
    });
    if (!result.success) {
      // Data loss, not a mere warning - see emitMessageCreated above.
      w.deps.logger.error(
        "[MessageDbWriter] Failed to create placeholder ASSISTANT message - reply not persisted",
        {
          messageId,
          threadId,
          parentId,
          error: result.message,
          errorType: result.errorType?.errorCode,
        },
      );
    }
    // Roll any queued messages forward to this new frontier
    w.engine.advanceQueuedMessages(threadId, messageId);
  }
}

/**
 * Emit MESSAGE_CREATED (USER role) SSE so the frontend adds the user message
 * to state with the correct parentId/depth. The DB record already exists
 * (created in setupAiStream); this only emits the SSE event.
 * For incognito the user message is also not in DB so nothing extra needed.
 */
export function emitUserMessageCreated(
  w: DbWriterState,
  params: {
    messageId: string;
    threadId: string;
    content: string;
    parentId: string | null;
    model: ChatModelId;
    skill: string | null;
    metadata?: MessageMetadata;
  },
): void {
  const { messageId, threadId, content, parentId, model, skill, metadata } =
    params;
  w.deps.wsEmit("message-created", {
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
export function emitContentDoneRaw(
  w: DbWriterState,
  params: {
    messageId: string;
    content: string;
    totalTokens: number | null;
    finishReason: string | null;
  },
): void {
  w.deps.wsEmit("content-done", {
    urlPathParams: { threadId: w.lastThreadId ?? "" },
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
