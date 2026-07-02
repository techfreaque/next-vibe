/**
 * insertDeferredWakeUpMessage
 *
 * Inserts a deferred TOOL message into the thread and emits the matching WS events.
 * Called by the live stream's finally block when a wakeUp signal was received.
 * Keeping insertion here (inside the stream's finally) means only the single live
 * stream ever inserts - no concurrent-insertion race is possible.
 */

import "server-only";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatMessages, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import {
  ChatMessageRole,
  ThreadStreamingState,
} from "@/app/api/[locale]/agent/chat/enum";
import { createMessagesEmitter } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/emitter";

import { walkToLeafMessage } from "./branch-utils";
import { buildSseMessageRow } from "./db-writer/sse-row";
import type { WakeUpPayload } from "./wake-up-channel";

export async function insertDeferredWakeUpMessage(
  threadId: string,
  payload: WakeUpPayload,
  logger: EndpointLogger,
  user: JwtPayloadType,
  sharedSequenceId?: string,
): Promise<{ deferredId: string; deferredSequenceId: string }> {
  const {
    toolMessageId,
    authorId,
    originalToolCall,
    wakeUpResult,
    wakeUpStatus,
    resolvedModel,
    resolvedSkill,
    leafMessageId,
  } = payload;

  const deferredId = crypto.randomUUID();
  const deferredSequenceId = sharedSequenceId ?? crypto.randomUUID();

  const deferredStatus =
    wakeUpStatus === "completed" ? ("completed" as const) : ("failed" as const);

  const deferredToolCall = {
    ...originalToolCall,
    toolCallId: originalToolCall.toolCallId,
    result: wakeUpResult,
    status: deferredStatus,
    originalToolCallId: originalToolCall.toolCallId,
    callbackMode: "wakeUp" as const,
    isDeferred: true,
    // Do NOT propagate isConfirmed - this is an async background result,
    // not a user-confirmation action. Prevents "Confirmed by you" badge.
    isConfirmed: false,
  };

  // Walk from the best-known position to find the actual current leaf.
  // leafMessageId is a hint from the caller (may be the tool message itself or a later message).
  // Always walk forward to find the newest descendant — handles stale hints correctly.
  const chainParentId = await walkToLeafMessage(
    threadId,
    leafMessageId ?? toolMessageId,
    toolMessageId,
  );

  await db.insert(chatMessages).values({
    id: deferredId,
    threadId,
    role: ChatMessageRole.TOOL,
    content: null,
    parentId: chainParentId,
    authorId: authorId ?? undefined,
    sequenceId: deferredSequenceId,
    isAI: true,
    model: resolvedModel,
    skill: resolvedSkill,
    metadata: { toolCall: deferredToolCall },
  });

  const wsEmit = createMessagesEmitter(logger, user);
  wsEmit("message-created", {
    urlPathParams: { threadId },
    responseData: {
      messages: [
        {
          id: deferredId,
          threadId,
          role: ChatMessageRole.TOOL,
          isAI: true,
          parentId: chainParentId,
          content: null,
          model: resolvedModel,
          skill: resolvedSkill,
          sequenceId: deferredSequenceId,
          metadata: { toolCall: deferredToolCall },
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: null,
          authorName: null,
          errorType: null,
          errorCode: null,
          errorMessage: null,
          upvotes: 0,
          downvotes: 0,
          searchVector: null,
        },
      ],
      streamingState: ThreadStreamingState.STREAMING,
    },
  });
  wsEmit("tool-result", {
    urlPathParams: { threadId },
    responseData: {
      messages: [{ id: deferredId, metadata: { toolCall: deferredToolCall } }],
    },
  });

  logger.debug("[WakeUp] Deferred message inserted by live stream", {
    threadId,
    toolMessageId,
    deferredId,
    chainParentId,
  });

  return { deferredId, deferredSequenceId };
}
