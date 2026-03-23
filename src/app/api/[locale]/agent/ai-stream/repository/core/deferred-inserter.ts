/**
 * insertDeferredWakeUpMessage
 *
 * Inserts a deferred TOOL message into the thread and emits the matching WS events.
 * Called by the live stream's finally block when a wakeUp signal was received.
 * Keeping insertion here (inside the stream's finally) means only the single live
 * stream ever inserts - no concurrent-insertion race is possible.
 */

import "server-only";

import { chatMessages } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { buildMessagesChannel } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/channel";
import { createStreamEvent } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/events";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { publishWsEvent } from "@/app/api/[locale]/system/unified-interface/websocket/emitter";

import { walkToLeafMessage } from "./branch-utils";
import type { WakeUpPayload } from "./wake-up-channel";

export async function insertDeferredWakeUpMessage(
  threadId: string,
  payload: WakeUpPayload,
  logger: EndpointLogger,
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

  const chainParentId = await walkToLeafMessage(
    threadId,
    leafMessageId ?? null,
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

  publishWsEvent(
    {
      channel: buildMessagesChannel(threadId),
      event: "message-created",
      data: createStreamEvent.messageCreated({
        messageId: deferredId,
        threadId,
        role: ChatMessageRole.TOOL,
        parentId: chainParentId,
        content: null,
        model: resolvedModel,
        skill: resolvedSkill,
        sequenceId: deferredSequenceId,
        toolCall: deferredToolCall,
      }).data,
    },
    logger,
  );

  publishWsEvent(
    {
      channel: buildMessagesChannel(threadId),
      event: "tool-result",
      data: createStreamEvent.toolResult({
        messageId: deferredId,
        toolName: deferredToolCall.toolName,
        result: deferredToolCall.result,
        error: deferredToolCall.error,
        toolCall: deferredToolCall,
      }).data,
    },
    logger,
  );

  logger.info("[WakeUp] Deferred message inserted by live stream", {
    threadId,
    toolMessageId,
    deferredId,
    chainParentId,
  });

  return { deferredId, deferredSequenceId };
}
