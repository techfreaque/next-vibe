/**
 * Compacting writes - the compacting message lifecycle (created / delta /
 * failed / done) with SSE emits, DB persistence and credit deduction.
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";

import { chatMessages } from "../../../../chat/db";
import { ChatMessageRole, ThreadStreamingState } from "../../../../chat/enum";
import { MessagesRepository } from "../../../../chat/threads/[threadId]/messages/repository";
import { deductAndEmitCredits } from "./credits";
import type { DbWriterState } from "./shared";
import { buildSseMessageRow } from "./sse-row";

/**
 * Emit MESSAGE_CREATED SSE for a compacting message and insert to DB.
 */
export async function emitCompactingMessageCreated(
  w: DbWriterState,
  params: {
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
  },
): Promise<void> {
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
  if (!w.deps.isIncognito) {
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
    w.engine.advanceQueuedMessages(threadId, messageId);
  }
}

/**
 * Mark a compacting message as failed: emits SSE so live clients exit loading state,
 * and updates DB so the next session shows the failed state.
 * Sets metadata.compactingFailed = true and errorMessage so the UI can show a failed state,
 * and the next send can detect it and retry compacting as a sibling.
 */
export async function emitCompactingFailed(
  w: DbWriterState,
  params: {
    messageId: string;
    errorMessage: string;
  },
): Promise<void> {
  const { messageId, errorMessage } = params;

  // SSE: notify live clients immediately so the loading spinner clears
  w.deps.wsEmit("compacting-done", {
    urlPathParams: { threadId: w.lastThreadId ?? "" },
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

  if (w.deps.isIncognito) {
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
export function emitCompactingDelta(
  w: DbWriterState,
  messageId: string,
  delta: string,
): void {
  w.deps.wsEmit("compacting-delta", {
    urlPathParams: { threadId: w.lastThreadId ?? "" },
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
export async function emitCompactingDone(
  w: DbWriterState,
  params: {
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
  },
): Promise<void> {
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
  if (!w.deps.isIncognito) {
    await MessagesRepository.updateMessageContent({
      messageId,
      content,
      logger: w.deps.logger,
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
  w.deps.wsEmit("tokens-updated", {
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
  await deductAndEmitCredits(w, {
    user,
    amount: creditCost,
    feature: `compacting-${model}`,
    type: "model",
    model,
  });

  // SSE: COMPACTING_DONE
  w.deps.wsEmit("compacting-done", {
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
