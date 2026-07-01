/**
 * Queue Processor - Server-side queue pickup after stream completion.
 *
 * After an AI stream completes naturally (not aborted), this module checks
 * for queued user messages in the thread and starts the next stream.
 *
 * Queued messages are USER messages with metadata.isQueued = true,
 * processed oldest-first by createdAt.
 */

import "server-only";

import { and, asc, desc, eq, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatMessages } from "@/app/api/[locale]/agent/chat/db";
import {
  ChatMessageRole,
  ThreadStreamingState,
} from "@/app/api/[locale]/agent/chat/enum";
import { createMessagesEmitter } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/emitter";
import { TtsModelId } from "@/app/api/[locale]/agent/text-to-speech/models";

import { DEFAULT_CHAT_MODEL_ID } from "../../constants";
import type { AiStreamT } from "../../stream/i18n";
import { QueueRegistry } from "./stream-registry";

/**
 * Check for queued messages in a thread and start processing the next one.
 * Called from the stream completion .finally() block.
 *
 * Returns true if a queued message was found and stream was triggered.
 */
export async function processNextQueuedMessage(
  threadId: string,
  logger: EndpointLogger,
  user: JwtPayloadType,
  locale: CountryLanguage,
  aiStreamT: AiStreamT,
  rootFolderId: DefaultFolderId,
  subAgentDepth: number,
): Promise<boolean> {
  // Find the oldest queued message in this thread
  const [queuedMessage] = await db
    .select()
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.threadId, threadId),
        eq(chatMessages.role, ChatMessageRole.USER),
        sql`${chatMessages.metadata}->>'isQueued' = 'true'`,
      ),
    )
    .orderBy(asc(chatMessages.createdAt))
    .limit(1);

  if (!queuedMessage) {
    logger.debug("[Queue] No queued messages found", { threadId });
    return false;
  }

  logger.info("[Queue] Processing queued message", {
    messageId: queuedMessage.id,
    threadId,
  });

  // The queued message's parentId is advanced by advanceQueuedMessages()
  // fire-and-forget during the stream. On slow runs this is already accurate.
  // On fast fixture replay, advanceQueuedMessages may not have committed yet,
  // leaving parentId as null. In that case, find the last non-queued message
  // in the thread to use as parent so the chain stays connected.
  let resolvedParentId = queuedMessage.parentId;
  if (!resolvedParentId) {
    const [lastMsg] = await db
      .select({ id: chatMessages.id })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.threadId, threadId),
          sql`${chatMessages.metadata}->>'isQueued' IS DISTINCT FROM 'true'`,
        ),
      )
      .orderBy(desc(chatMessages.createdAt))
      .limit(1);
    if (lastMsg) {
      resolvedParentId = lastMsg.id;
      logger.debug(
        "[Queue] advanceQueuedMessages race: resolved parent from last thread message",
        {
          resolvedParentId,
          messageId: queuedMessage.id,
        },
      );
    }
  }

  // Remove queue-specific fields from metadata before re-saving
  const metadata = queuedMessage.metadata;
  const queuedSettings = metadata?.queuedSettings;
  const {
    isQueued,
    queuedSettings: savedSettings,
    ...cleanMetadata
  } = metadata ?? {};
  void isQueued;
  void savedSettings;

  const dequeueNow = new Date();
  await db
    .update(chatMessages)
    .set({
      parentId: resolvedParentId,
      metadata: cleanMetadata,
      // Update createdAt to now so the UI (which sorts by createdAt) places this
      // message after the last message in the chain, not at its original enqueue time.
      createdAt: dequeueNow,
      updatedAt: dequeueNow,
    })
    .where(eq(chatMessages.id, queuedMessage.id));

  // Emit message-created with updated parentId so the frontend moves
  // the message to the correct position in the branch tree
  const wsEmit = createMessagesEmitter(logger, user);
  wsEmit("message-created", {
    urlPathParams: { threadId },
    responseData: {
      streamingState: ThreadStreamingState.STREAMING,
      messages: [
        {
          id: queuedMessage.id,
          threadId,
          role: ChatMessageRole.USER,
          isAI: false,
          content: queuedMessage.content,
          parentId: resolvedParentId,
          sequenceId: null,
          model: null,
          skill: null,
          // Explicitly set isQueued: false so the client cache deep-merge clears
          // the flag (absent keys are not removed by the merge; false overrides true).
          metadata: { ...cleanMetadata, isQueued: false },
          createdAt: dequeueNow,
          updatedAt: dequeueNow,
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
    },
  });

  // Drain the in-memory QueueRegistry entry for this message before starting a
  // new stream. Without this, the new stream's prepareStep would find the entry
  // and inject it a second time, causing duplicate processing.
  // QueueRegistry is keyed by threadId; shift until we consume the matching entry
  // or the queue is empty (handles the case where multiple messages were queued).
  {
    let drained = QueueRegistry.shift(threadId);
    while (drained && drained.id !== queuedMessage.id) {
      // This entry was for a different message — it was already cleared from DB
      // by an in-stream prepareStep dequeue. Drop it (DB is the source of truth).
      logger.debug("[Queue] Dropping stale QueueRegistry entry", {
        drainedId: drained.id,
        targetId: queuedMessage.id,
        threadId,
      });
      drained = QueueRegistry.shift(threadId);
    }
    // If drained.id === queuedMessage.id, we consumed our target entry. Good.
    // If queue emptied without finding it, prepareStep already consumed it
    // and updated DB — but we still proceed since DB showed isQueued=true.
  }

  // Start the AI stream for this dequeued message using its saved settings
  const { AiStreamRepository } = await import("../index");
  type AiStreamParams = Parameters<typeof AiStreamRepository.createAiStream>[0];

  const streamResult = await AiStreamRepository.createAiStream({
    data: {
      operation: "send",
      rootFolderId: queuedSettings?.rootFolderId ?? rootFolderId,
      subFolderId: queuedSettings?.subFolderId ?? null,
      threadId,
      userMessageId: queuedMessage.id,
      parentMessageId: resolvedParentId,
      content: queuedMessage.content ?? "",
      role: ChatMessageRole.USER,
      model: queuedSettings?.model ?? DEFAULT_CHAT_MODEL_ID,
      skill: queuedSettings?.skill ?? "default",
      favoriteConfig: queuedSettings?.favoriteConfig ?? null,
      toolConfirmations: null,
      messageHistory: [],
      attachments: null,
      voiceMode: queuedSettings?.voiceMode ?? {
        enabled: false,
        voice: TtsModelId.OPENAI_ALLOY,
      },
      audioInput: { file: null },
      timezone: queuedSettings?.timezone ?? "UTC",
      executionContext: { mode: "local" as const },
    } satisfies AiStreamParams["data"],
    locale,
    logger,
    user,
    request: undefined,
    headless: false,
    t: aiStreamT,
    subAgentDepth,
  });

  if (!streamResult.success) {
    logger.error("[Queue] Failed to start stream for queued message", {
      messageId: queuedMessage.id,
      error: streamResult.message,
    });
    return false;
  }

  logger.info("[Queue] Stream started for dequeued message", {
    messageId: queuedMessage.id,
    threadId,
  });

  return true;
}
