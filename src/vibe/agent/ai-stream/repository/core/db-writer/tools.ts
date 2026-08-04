/**
 * Tool-call / tool-result writing - MESSAGE_CREATED + TOOL_RESULT emits,
 * tool message DB rows, result backfills and synthetic tool messages for
 * natively-generated file parts.
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ErrorResponseType } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";

import { chatMessages, type ToolCall } from "../../../../chat/db";
import { ChatMessageRole, ThreadStreamingState } from "../../../../chat/enum";
import { MessagesRepository } from "../../../../chat/threads/[threadId]/messages/repository";
import type { ChatModelId } from "../../../models";
import { deductAndEmitCredits } from "./credits";
import type { DbWriterState } from "./shared";
import { buildSseMessageRow } from "./sse-row";

/**
 * Emit MESSAGE_CREATED + TOOL_CALL SSE for a new tool message,
 * and create the row in DB immediately.
 */
export async function emitToolCall(
  w: DbWriterState,
  params: {
    toolMessageId: string;
    threadId: string;
    parentId: string | null;
    userId: string | undefined;
    model: ChatModelId;
    skill: string;
    sequenceId: string | null;
    toolCall: ToolCall;
  },
): Promise<void> {
  const {
    toolMessageId,
    threadId,
    parentId,
    model,
    skill,
    sequenceId,
    toolCall,
  } = params;

  // ONE authoritative creation time, shared by the SSE wire AND the DB insert.
  // Parallel tool siblings in a single step are emitted back-to-back; a separate
  // now() in the wire vs the DB row can order two siblings differently, and a
  // mirror healing from the wire time would then invert the parent chain
  // (assertParentTimeOrder). Stamping once keeps wire == DB == origin order.
  const createdAt = new Date();

  // SSE: MESSAGE_CREATED for tool message
  w.deps.wsEmit("message-created", {
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
          createdAt,
        }),
      ],
    },
  });

  // DB: create tool message immediately
  if (!w.deps.isIncognito) {
    const createResult = await MessagesRepository.createToolMessage({
      messageId: toolMessageId,
      threadId,
      toolCall,
      parentId,
      userId: params.userId,
      sequenceId,
      model,
      skill: skill,
      logger: w.deps.logger,
      locale: w.deps.locale,
      createdAt,
    });
    if (!createResult.success) {
      w.deps.logger.error("[MessageDbWriter] Failed to create tool message", {
        messageId: toolMessageId,
        error: createResult.message,
        errorType: createResult.errorType?.errorCode,
      });
    }
    // Roll any queued messages forward to this new frontier
    w.engine.advanceQueuedMessages(threadId, toolMessageId);
  }
}

/**
 * Update tool message in DB with result/error, emit MESSAGE_CREATED (with result)
 * and TOOL_RESULT SSE events. Also emits CREDITS_DEDUCTED if tool had credits.
 */
export async function emitToolResult(
  w: DbWriterState,
  params: {
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
  },
): Promise<void> {
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
  w.deps.wsEmit("message-created", {
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
  // wakeUp: the DISPATCH acknowledgement ({taskId, hint}, status pending) IS the
  // phase-1 result the model must see — its two-phase judgement keys off "the
  // dispatch returned a taskId and no responsePath yet". Write it. The final
  // output never flows through THIS call for wakeUp (it lands on a separate
  // deferred message via revival), so there is nothing to clobber. Only skip when
  // the wakeUp result is NOT a taskId dispatch (defensive: a non-dispatch write
  // here would be the stale/final shape that resume-stream owns).
  const wakeUpResultRec =
    toolCall.result && typeof toolCall.result === "object"
      ? (toolCall.result as Record<string, WidgetData>)
      : undefined;
  const isWakeUpDispatch =
    toolCall.callbackMode === "wakeUp" &&
    typeof wakeUpResultRec?.["taskId"] === "string";
  const skipWakeUpClobber =
    toolCall.callbackMode === "wakeUp" && !isWakeUpDispatch;
  if (!w.deps.isIncognito && !skipWakeUpClobber) {
    const updateResult = await db
      .update(chatMessages)
      .set({ metadata: { toolCall }, updatedAt: new Date() })
      .where(eq(chatMessages.id, toolMessageId))
      .returning({ id: chatMessages.id });

    if (updateResult.length === 0) {
      w.deps.logger.error(
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
        logger: w.deps.logger,
        locale: w.deps.locale,
      });
      if (!fallbackResult.success) {
        w.deps.logger.error(
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
    w.deps.wsEmit("tool-result", {
      urlPathParams: { threadId },
      responseData: {
        messages: [{ id: toolMessageId, metadata: { toolCall } }],
      },
    });
  }

  // SSE + DB: CREDITS_DEDUCTED if tool consumed credits and succeeded
  if (toolCall.creditsUsed && toolCall.creditsUsed > 0 && !error) {
    await deductAndEmitCredits(w, {
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
export function emitBatchToolResults(
  w: DbWriterState,
  toolResults: Array<{
    messageId: string;
    toolCall: ToolCall;
  }>,
): Set<string> {
  const emitted = new Set<string>();
  for (const result of toolResults) {
    w.deps.wsEmit("tool-result", {
      urlPathParams: { threadId: w.lastThreadId ?? "" },
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
export async function emitToolResultUpdated(
  w: DbWriterState,
  params: {
    messageId: string;
    toolCallId: string;
    result: WidgetData;
    toolCall: ToolCall; // full updated toolCall with result
  },
): Promise<void> {
  const { messageId, toolCall } = params;

  // SSE: TOOL_RESULT_UPDATED so frontend can update the pending bubble
  w.deps.wsEmit("tool-result-updated", {
    urlPathParams: { threadId: w.lastThreadId ?? "" },
    responseData: {
      messages: [{ id: messageId, metadata: { toolCall } }],
    },
  });

  // DB: backfill the result into the tool message
  if (!w.deps.isIncognito) {
    try {
      await db
        .update(chatMessages)
        .set({ metadata: { toolCall }, updatedAt: new Date() })
        .where(eq(chatMessages.id, messageId));
    } catch (err) {
      w.deps.logger.warn(
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
export async function emitPartialToolResult(
  w: DbWriterState,
  params: {
    toolMessageId: string;
    toolCall: ToolCall;
  },
): Promise<void> {
  const { toolMessageId, toolCall } = params;

  // WS: TOOL_RESULT event - handler patches toolCall metadata on the message
  w.deps.wsEmit("tool-result", {
    urlPathParams: { threadId: w.lastThreadId ?? "" },
    responseData: {
      messages: [{ id: toolMessageId, metadata: { toolCall } }],
    },
  });

  // DB: persist partial result so page refresh shows latest state
  if (!w.deps.isIncognito) {
    try {
      await db
        .update(chatMessages)
        .set({ metadata: { toolCall }, updatedAt: new Date() })
        .where(eq(chatMessages.id, toolMessageId));
    } catch (err) {
      w.deps.logger.warn(
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
export async function emitSyntheticToolMessage(
  w: DbWriterState,
  params: {
    messageId: string;
    threadId: string;
    parentId: string | null;
    userId: string | undefined;
    model: ChatModelId;
    skill: string;
    sequenceId: string | null;
    toolCall: ToolCall;
  },
): Promise<void> {
  const { messageId, threadId, parentId, model, skill, sequenceId, toolCall } =
    params;

  if (w.deps.isIncognito) {
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
    w.deps.wsEmit("message-created", {
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
    w.deps.wsEmit("tool-result", {
      urlPathParams: { threadId },
      responseData: {
        messages: [{ id: messageId, metadata: { toolCall } }],
      },
    });
  } catch (err) {
    w.deps.logger.warn(
      "[MessageDbWriter] Failed to insert synthetic tool message",
      {
        messageId,
        error: err instanceof Error ? err.message : String(err),
      },
    );
  }
}
