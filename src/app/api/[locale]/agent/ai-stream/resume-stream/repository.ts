/**
 * Resume Stream Repository v3
 * Continues an existing thread after an async remote task completes (callbackMode=wakeUp).
 *
 * isStreaming check:
 * - true  → stream is still live; emit TOOL_RESULT WS event so the UI bubble
 *           updates and the running loop picks up the backfilled result naturally.
 * - false → stream is dead; insert a synthetic ASSISTANT + deferred TOOL message
 *           pair into the thread (same sequenceId, model/character metadata),
 *           emit WS events, then fire a headless "wakeup-resume" stream so the AI
 *           continues the thread seeing the full result in context without any
 *           CONTINUE_CONVERSATION_PROMPT injection.
 *
 * wakeup-resume vs answer-as-ai:
 * - "answer-as-ai" injects CONTINUE_CONVERSATION_PROMPT — wrong for revival
 * - "wakeup-resume" loads DB history normally, finds deferred TOOL as last
 *   context item, and lets the AI respond naturally to it
 *
 * Deferred message chain:
 *   ... → lastAssistantMsg → syntheticAssistant(sequenceId) → deferredTool(sequenceId) → [AI revival]
 *
 * Race safety:
 * - isStreaming is read once. If it flips between read and act the worst outcome
 *   is an extra stream turn or a missed WS event — not data corruption.
 * - Message insertion uses random UUIDs so it is safe to call once.
 */

import "server-only";

import { desc, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import {
  chatMessages,
  chatThreads,
  type ToolCall,
} from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { buildMessagesChannel } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/channel";
import { createStreamEvent } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/events";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import { publishWsEvent } from "@/app/api/[locale]/system/unified-interface/websocket/emitter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { NO_CHARACTER_ID } from "../../chat/characters/constants";
import { resolveFavorite, runHeadlessAiStream } from "../repository/headless";
import type { AiStreamT } from "../stream/i18n";
import type {
  ResumeStreamRequestOutput,
  ResumeStreamResponseOutput,
} from "./definition";

export class ResumeStreamRepository {
  static async resume(
    data: ResumeStreamRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: AiStreamT,
  ): Promise<ResponseType<ResumeStreamResponseOutput>> {
    const {
      threadId,
      favoriteId,
      modelId,
      characterId,
      wakeUpToolMessageId: toolMessageId,
      wakeUpTaskId,
      resumeTaskId,
    } = data;

    try {
      // Read thread state — isStreaming tells us if the live loop is still running.
      const [thread] = await db
        .select({ isStreaming: chatThreads.isStreaming })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      const isLive = thread?.isStreaming === true;

      logger.info("[ResumeStream] State check", {
        threadId,
        toolMessageId,
        isLive,
        threadFound: !!thread,
      });

      // For wakeUp: inject a deferred result message so it appears in the thread UI.
      // Live case:  emit TOOL_RESULT WS event — the running loop already has the
      //             backfilled result in DB and will present it to the AI naturally.
      // Dead case:  insert synthetic ASSISTANT + deferred TOOL messages (same sequenceId,
      //             model/character metadata), emit WS events, then revive with headless
      //             wakeup-resume stream.
      if (toolMessageId) {
        const [existing] = await db
          .select({
            metadata: chatMessages.metadata,
            threadId: chatMessages.threadId,
            authorId: chatMessages.authorId,
          })
          .from(chatMessages)
          .where(eq(chatMessages.id, toolMessageId))
          .limit(1);

        const toolCall = existing?.metadata?.toolCall;
        const effectiveThreadId = existing?.threadId ?? threadId;

        logger.info("[ResumeStream] Tool message lookup", {
          toolMessageId,
          existingFound: !!existing,
          toolCallFound: !!toolCall,
          toolCallStatus: toolCall?.status,
        });

        if (toolCall) {
          if (isLive) {
            // Stream still running — live loop will pick up the backfilled result.
            // Emit TOOL_RESULT WS so the UI bubble updates immediately.
            publishWsEvent(
              {
                channel: buildMessagesChannel(effectiveThreadId),
                event: "tool-result",
                data: createStreamEvent.toolResult({
                  messageId: toolMessageId,
                  toolName: toolCall.toolName,
                  result: toolCall.result,
                  error: toolCall.error,
                  toolCall,
                }).data,
              },
              logger,
            );

            logger.info(
              "[ResumeStream] Stream live — emitted TOOL_RESULT WS, live loop picks up result",
              { threadId, toolMessageId },
            );
            return success({ resumed: false, lastAiMessageId: null });
          }

          // Stream dead — resolve model + character first (needed for message metadata).
          const userId = !user.isPublic ? user.id : undefined;
          let resolvedModel = modelId;
          let resolvedCharacter = characterId ?? NO_CHARACTER_ID;

          if (favoriteId && userId) {
            const resolved = await resolveFavorite(
              favoriteId,
              userId,
              user,
              logger,
              locale,
            );
            if (resolved) {
              resolvedModel = resolvedModel ?? resolved.model;
              resolvedCharacter = characterId ?? resolved.character;
            }
          }

          if (!resolvedModel) {
            logger.error(
              "[ResumeStream] No model resolved — cannot revive stream",
              {
                threadId,
                favoriteId,
                modelId,
              },
            );
            return fail({
              message: t("errors.unexpectedError", {
                error: "No model resolved",
              }),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            });
          }

          // Insert deferred result messages into DB.
          // Chain: lastMsg → syntheticAssistant → deferredTool
          //
          // syntheticAssistant: empty ASSISTANT message carrying model/character metadata
          // so the tool bubble renders under the correct model/character header.
          // deferredTool: the actual wakeUp result, same sequenceId as syntheticAssistant.
          logger.info("[ResumeStream] Inserting deferred tool message pair", {
            toolMessageId,
          });

          const [lastMsg] = await db
            .select({ id: chatMessages.id })
            .from(chatMessages)
            .where(eq(chatMessages.threadId, effectiveThreadId))
            .orderBy(desc(chatMessages.createdAt))
            .limit(1);
          const chainParentId = lastMsg?.id ?? toolMessageId;

          // Shared sequenceId groups syntheticAssistant + deferredTool as one bubble set
          const deferredSequenceId = crypto.randomUUID();
          const syntheticAssistantId = crypto.randomUUID();
          const deferredId = crypto.randomUUID();

          const deferredToolCallId = `deferred_wu_${toolCall.toolCallId}_${Date.now()}`;
          const deferredStatus =
            toolCall.status === "completed"
              ? ("completed" as const)
              : ("failed" as const);

          const deferredToolCall: ToolCall = {
            ...toolCall,
            toolCallId: deferredToolCallId,
            status: deferredStatus,
            originalToolCallId: toolCall.toolCallId,
            // callbackMode preserved — message-converter uses it to suppress args
            callbackMode: "wakeUp",
            isDeferred: true,
            // Include taskId + note so AI context is informative
            remoteTaskId: toolCall.remoteTaskId,
          };

          // 1. Synthetic ASSISTANT message — provides model/character metadata for grouping
          await db.insert(chatMessages).values({
            id: syntheticAssistantId,
            threadId: effectiveThreadId,
            role: ChatMessageRole.ASSISTANT,
            content: null,
            parentId: chainParentId,
            authorId: existing.authorId,
            sequenceId: deferredSequenceId,
            isAI: true,
            model: resolvedModel,
            character: resolvedCharacter,
            metadata: {},
          });

          // 2. Deferred TOOL message — carries the actual async result
          await db.insert(chatMessages).values({
            id: deferredId,
            threadId: effectiveThreadId,
            role: ChatMessageRole.TOOL,
            content: null,
            parentId: syntheticAssistantId,
            authorId: existing.authorId,
            sequenceId: deferredSequenceId,
            isAI: true,
            model: resolvedModel,
            character: resolvedCharacter,
            metadata: { toolCall: deferredToolCall },
          });

          // Notify UI: synthetic assistant + tool result created
          publishWsEvent(
            {
              channel: buildMessagesChannel(effectiveThreadId),
              event: "message-created",
              data: createStreamEvent.messageCreated({
                messageId: syntheticAssistantId,
                threadId: effectiveThreadId,
                role: ChatMessageRole.ASSISTANT,
                parentId: chainParentId,
                content: null,
                model: resolvedModel,
                character: resolvedCharacter,
                sequenceId: deferredSequenceId,
                toolCall: undefined,
              }).data,
            },
            logger,
          );

          publishWsEvent(
            {
              channel: buildMessagesChannel(effectiveThreadId),
              event: "message-created",
              data: createStreamEvent.messageCreated({
                messageId: deferredId,
                threadId: effectiveThreadId,
                role: ChatMessageRole.TOOL,
                parentId: syntheticAssistantId,
                content: null,
                model: resolvedModel,
                character: resolvedCharacter,
                sequenceId: deferredSequenceId,
                toolCall: deferredToolCall,
              }).data,
            },
            logger,
          );

          publishWsEvent(
            {
              channel: buildMessagesChannel(effectiveThreadId),
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

          logger.info(
            "[ResumeStream] Stream dead — inserted deferred wakeUp message pair",
            {
              threadId,
              toolMessageId,
              syntheticAssistantId,
              deferredId,
              deferredToolCallId,
              resolvedModel,
              resolvedCharacter,
            },
          );

          // Fire wakeup-resume headless stream — loads full DB history (deferred TOOL is
          // now last in chain), AI sees the result naturally without any continuation prompt.
          // sequenceIdOverride: share deferredSequenceId so revival AI message groups with
          // the synthetic assistant + deferred tool pair as one visual bubble set.
          // availableTools: [] → no tools → AI writes summary text only, no loop.
          void runHeadlessAiStream({
            model: resolvedModel,
            character: resolvedCharacter,
            prompt: "",
            availableTools: [],
            allowedTools: [],
            wakeUpRevival: true,
            sequenceIdOverride: deferredSequenceId,
            threadMode: "append",
            threadId: effectiveThreadId,
            rootFolderId: DefaultFolderId.CRON,
            user,
            locale,
            logger,
            t,
          })
            .then(async (result) => {
              // stream-finished WS so the client stops the spinner.
              // message-created is emitted by the stream itself via WS emitter.
              publishWsEvent(
                {
                  channel: buildMessagesChannel(threadId),
                  event: "stream-finished",
                  data: createStreamEvent.streamFinished({
                    threadId,
                    reason: "completed",
                  }).data,
                },
                logger,
              );
              logger.info("[ResumeStream] Revival complete", {
                threadId,
                success: result.success,
                lastAiMessageId: result.success
                  ? result.data.lastAiMessageId
                  : null,
              });

              // Cleanup: delete the wakeUp task and this resume-stream task.
              // Both are ephemeral — all context is now in the thread DB.
              const taskIdsToDelete = [wakeUpTaskId, resumeTaskId].filter(
                Boolean,
              ) as string[];
              if (taskIdsToDelete.length > 0) {
                try {
                  await Promise.all(
                    taskIdsToDelete.map((id) =>
                      db.delete(cronTasks).where(eq(cronTasks.id, id)),
                    ),
                  );
                  logger.info("[ResumeStream] Cleaned up cron tasks", {
                    deletedIds: taskIdsToDelete,
                  });
                } catch (cleanupErr) {
                  logger.warn("[ResumeStream] Cleanup failed (non-fatal)", {
                    taskIdsToDelete,
                    error: parseError(cleanupErr).message,
                  });
                }
              }
              return;
            })
            .catch((err) => {
              logger.error("[ResumeStream] Headless revival failed", {
                threadId,
                error: parseError(err).message,
              });
            });

          return success({ resumed: true, lastAiMessageId: null });
        } else {
          logger.warn(
            "[ResumeStream] toolMessageId provided but message/toolCall not found",
            {
              threadId,
              toolMessageId,
            },
          );
        }
      }

      if (isLive) {
        // No toolMessageId path — just bail, live loop handles everything.
        logger.info("[ResumeStream] Stream still live — skipping resume", {
          threadId,
        });
        return success({ resumed: false, lastAiMessageId: null });
      }

      // No toolMessageId + stream dead: nothing to do.
      logger.info("[ResumeStream] No toolMessageId and stream dead — no-op", {
        threadId,
      });
      return success({ resumed: false, lastAiMessageId: null });
    } catch (error) {
      const msg = parseError(error).message;
      logger.error("[ResumeStream] Failed", { threadId, error: msg });
      return fail({
        message: t("errors.unexpectedError", { error: msg }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
