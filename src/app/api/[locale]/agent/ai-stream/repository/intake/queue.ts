/**
 * AI Stream queue — enqueue (auto-queue branch) + drain (queue processor) of
 * the same server-side message queue.
 */

import "server-only";

import { and, asc, desc, eq, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRepository } from "next-vibe/identity/user/repository";
import type { EndpointLogger } from "next-vibe/logger/types";

import { DefaultFolderId } from "../../../chat/config";
import {
  CHAT_MESSAGE_COLUMNS,
  chatMessages,
  chatThreads,
} from "../../../chat/db";
import { ChatMessageRole, ThreadStreamingState } from "../../../chat/enum";
import { parseSkillId } from "../../../chat/slugify";
import { createMessagesEmitter } from "../../../chat/threads/[threadId]/messages/emitter";
import { MessagesRepository } from "../../../chat/threads/[threadId]/messages/repository";
import { buildFavoriteConfig } from "../../../skills/favorites/repository";
import { DEFAULT_CHAT_MODEL_ID } from "../../constants";
import type {
  AiStreamPostRequestOutput,
  AiStreamPostResponseOutput,
} from "../../stream/definition";
import type { AiStreamT } from "../../stream/i18n";
import { buildSseMessageRow } from "../core/db-writer/sse-row";
import { QueueRegistry } from "../core/stream";

/**
 * Auto-queue branch: if the thread is already streaming, persist the user
 * message with `isQueued` metadata and return immediately — no AI stream, no
 * credits, no tools. The running stream's prepareStep injects it as the next
 * user turn. Queue detection is entirely server-side via StreamRegistry; the
 * client sends a normal "send".
 *
 * Returns the terminal success response when it queued, or `null` when this
 * request is NOT a queue candidate (caller falls through to the normal path).
 */
export async function runAutoQueueBranch(params: {
  data: AiStreamPostRequestOutput;
  user: JwtPayloadType;
  userId: string | undefined;
  logger: EndpointLogger;
}): Promise<ResponseType<AiStreamPostResponseOutput> | null> {
  const { data, user, userId, logger } = params;

  // Fast reject the non-queue shape before the DB read.
  if (
    !(
      data.operation === "send" &&
      data.threadId &&
      data.userMessageId &&
      data.rootFolderId !== DefaultFolderId.INCOGNITO
    )
  ) {
    return null;
  }

  // A stream is live iff the DB says so (streaming/waiting) — the cross-process
  // truth (was the in-process StreamRegistry.isActive, which only saw this
  // process's streams). Only queue when a stream is actually running for the thread.
  const [threadRow] = await db
    .select({ streamingState: chatThreads.streamingState })
    .from(chatThreads)
    .where(eq(chatThreads.id, data.threadId))
    .limit(1);
  const isStreaming =
    threadRow?.streamingState === ThreadStreamingState.STREAMING ||
    threadRow?.streamingState === ThreadStreamingState.WAITING;
  if (!isStreaming) {
    return null;
  }

  const authorName = userId
    ? await UserRepository.getUserPublicName(userId, logger)
    : null;

  // Embed the queued user message at write time too: it is NOT re-inserted when
  // the queue processor picks it up (only re-parented), so this is its one write
  // — the row must land with its search vector here. The threadId anchors the
  // fixture chain so replay is deterministic.
  const { makeHeadlessContext } =
    await import("@/app/api/[locale]/agent/chat/config");
  const queueEmbedContext = makeHeadlessContext(
    undefined,
    data.threadId,
    data.timezone ?? "UTC",
  );

  await MessagesRepository.createUserMessage({
    messageId: data.userMessageId,
    threadId: data.threadId,
    rootFolderId: data.rootFolderId,
    role: ChatMessageRole.USER,
    content: data.content,
    parentId: data.parentMessageId || null,
    userId,
    authorName,
    logger,
    streamContext: queueEmbedContext,
    extraMetadata: {
      isQueued: true,
      queuedSettings: {
        model: data.model,
        skill: data.skill,
        rootFolderId: data.rootFolderId,
        subFolderId: data.subFolderId ?? null,
        voiceMode: data.voiceMode ?? { enabled: false },
        favoriteConfig: data.favoriteConfig
          ? buildFavoriteConfig({
              ...data.favoriteConfig,
              ...parseSkillId(data.favoriteConfig.skillId),
            })
          : null,
        timezone: data.timezone,
      },
    },
  });

  // Emit message-created so the frontend can confirm persistence.
  const wsEmit = createMessagesEmitter(logger, user, {
    threadId: data.threadId,
    rootFolderId: data.rootFolderId,
  });
  wsEmit("message-created", {
    responseData: {
      // Keep streaming state — the AI is still streaming.
      streamingState: ThreadStreamingState.STREAMING,
      messages: [
        buildSseMessageRow({
          id: data.userMessageId,
          threadId: data.threadId,
          role: ChatMessageRole.USER,
          content: data.content,
          parentId: data.parentMessageId || null,
          metadata: { isQueued: true },
          authorId: userId ?? null,
        }),
      ],
    },
  });

  // Register in-memory so the running stream's prepareStep can inject this
  // message as the next user turn without ending and restarting the stream.
  QueueRegistry.push(data.threadId, {
    id: data.userMessageId,
    content: data.content,
    metadata: { isQueued: true },
    createdAt: new Date(),
  });

  logger.info("[AI Stream] Queued message created", {
    messageId: data.userMessageId,
    threadId: data.threadId,
  });

  return success({
    success: true,
    messageId: data.userMessageId,
    responseThreadId: data.threadId,
  });
}
/**
 * Queue Processor - Server-side queue pickup after stream completion.
 *
 * After an AI stream completes naturally (not aborted), this module checks
 * for queued user messages in the thread and starts the next stream.
 *
 * Queued messages are USER messages with metadata.isQueued = true,
 * processed oldest-first by createdAt.
 */

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
    .select(CHAT_MESSAGE_COLUMNS)
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
  const wsEmit = createMessagesEmitter(logger, user, {
    threadId,
    rootFolderId,
  });
  wsEmit("message-created", {
    responseData: {
      streamingState: ThreadStreamingState.STREAMING,
      messages: [
        buildSseMessageRow({
          id: queuedMessage.id,
          threadId,
          role: ChatMessageRole.USER,
          content: queuedMessage.content,
          parentId: resolvedParentId,
          // Explicitly set isQueued: false so the client cache deep-merge clears
          // the flag (absent keys are not removed by the merge; false overrides true).
          metadata: { ...cleanMetadata, isQueued: false },
          createdAt: dequeueNow,
          updatedAt: dequeueNow,
        }),
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
      voiceMode: queuedSettings?.voiceMode ?? { enabled: false },
      audioInput: { file: null },
      timezone: queuedSettings?.timezone ?? "UTC",
      executionContext: { mode: "local" as const },
    } satisfies AiStreamParams["data"],
    locale,
    logger,
    user,
    request: undefined,
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
