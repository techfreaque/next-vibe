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

import { and, asc, eq, sql } from "drizzle-orm";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatMessages } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { TtsModelId } from "@/app/api/[locale]/agent/text-to-speech/models";
import { createMessagesEmitter } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/emitter";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { DEFAULT_CHAT_MODEL_ID } from "../../constants";
import type { AiStreamT } from "../../stream/i18n";
import { walkToLeafMessage } from "./branch-utils";

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

  // Find the current leaf of the conversation (the latest message in the branch)
  const leafId = await walkToLeafMessage(
    threadId,
    queuedMessage.parentId,
    queuedMessage.id,
  );

  // Update the queued message: resolve parentId to the true leaf and clear isQueued
  const metadata = queuedMessage.metadata;
  const queuedSettings = metadata?.queuedSettings;
  // Remove queue-specific fields from metadata before re-saving
  const {
    isQueued,
    queuedSettings: savedSettings,
    ...cleanMetadata
  } = metadata ?? {};
  void isQueued;
  void savedSettings;

  // If the leaf is different from the stored parentId, update it
  const resolvedParentId =
    leafId !== queuedMessage.id ? leafId : queuedMessage.parentId;

  await db
    .update(chatMessages)
    .set({
      parentId: resolvedParentId,
      metadata: cleanMetadata,
      updatedAt: new Date(),
    })
    .where(eq(chatMessages.id, queuedMessage.id));

  // Emit message-created with updated parentId so the frontend moves
  // the message to the correct position in the branch tree
  const wsEmit = createMessagesEmitter(threadId, rootFolderId, logger, user);
  wsEmit("message-created", {
    streamingState: "streaming",
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
        metadata: cleanMetadata,
      },
    ],
  });

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
