/**
 * ToolConfirmationHandler - Handles tool confirmation and execution during setup
 */

import "server-only";

import { and, eq, gt, ne } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import { ConfirmedExecution } from "next-vibe/execute-tool/repository/confirmed";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { ResolvedRelayContext } from "next-vibe/realtime/remote-event-bridge/relay-context";

import { db } from "../../../../database";
import type { ToolExecutionContext } from "../../../chat/config";
import type { ChatMessage, ToolCall } from "../../../chat/db";
import {
  CHAT_MESSAGE_COLUMNS,
  chatDb,
  chatMessages,
  chatThreads,
} from "../../../chat/db";
import { ChatMessageRole, ThreadStreamingState } from "../../../chat/enum";
import { createMessagesEmitter } from "../../../chat/threads/[threadId]/messages/emitter";
import type { AiStreamT } from "../../stream/i18n";
import { buildSseMessageRow } from "../core/db-writer/sse-row";
import { walkToLeafMessage } from "../core/tree-walk";

class ToolConfirmationHandler {
  /**
   * Handle tool confirmation - execute tool and update message in DB/messageHistory
   */
  static async handleToolConfirmation(params: {
    toolConfirmation: {
      messageId: string;
      confirmed: boolean;
      updatedArgs?: Record<string, string | number | boolean | null>;
    };
    messageHistory?: ChatMessage[];
    isIncognito: boolean;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
    t: AiStreamT;
    toolExecutionContext: ToolExecutionContext;
    resolvedRelayContext?: ResolvedRelayContext;
  }): Promise<
    ResponseType<{
      threadId: string;
      toolMessageId: string;
      wakeUpPending?: boolean;
    }>
  > {
    const {
      toolConfirmation,
      messageHistory,
      isIncognito,
      locale,
      logger,
      user,
      t,
      resolvedRelayContext,
    } = params;

    logger.debug("[Tool Confirmation] handleToolConfirmationInSetup called", {
      messageId: toolConfirmation.messageId,
      confirmed: toolConfirmation.confirmed,
      hasUpdatedArgs: !!toolConfirmation.updatedArgs,
    });

    // Find tool message - source depends on mode (incognito: messageHistory, server: DB)
    let toolMessage: ChatMessage | undefined;

    if (isIncognito && messageHistory) {
      toolMessage = messageHistory.find(
        (msg) => msg.id === toolConfirmation.messageId,
      ) as ChatMessage | undefined;
    } else if (!isIncognito) {
      const [dbMessage] = await db
        .select(CHAT_MESSAGE_COLUMNS)
        .from(chatMessages)
        .where(eq(chatMessages.id, toolConfirmation.messageId))
        .limit(1);
      toolMessage = dbMessage as ChatMessage | undefined;
    }

    if (!toolMessage) {
      logger.error("[Tool Confirmation] Message not found", {
        messageId: toolConfirmation.messageId,
        isIncognito,
      });
      return fail({
        message: t("post.toolConfirmation.errors.messageNotFound"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const toolCall = toolMessage.metadata?.toolCall;
    if (!toolCall) {
      logger.error("[Tool Confirmation] ToolCall metadata missing");
      return fail({
        message: t("post.toolConfirmation.errors.toolCallMissing"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    if (toolConfirmation.confirmed) {
      // Re-execute the confirmed call. All execute-tool-specific knowledge
      // (unwrap EXECUTE_TOOL_ALIAS, callbackMode override, { result: ... } strip,
      // wakeUp confirm-race) lives in ConfirmedExecution — this handler keeps only
      // the message-tree persistence below.
      params.toolExecutionContext.currentToolMessageId =
        toolConfirmation.messageId;

      // Write + emit "executing" state before the tool runs so all devices
      // transition from "pending confirmation" to the loading spinner immediately.
      // Without this, DB still has waitingForConfirmation:true and other devices
      // see no state change until the result arrives (which can take seconds).
      if (!isIncognito) {
        const [threadRowEarly] = await db
          .select({ rootFolderId: chatThreads.rootFolderId })
          .from(chatThreads)
          .where(eq(chatThreads.id, toolMessage.threadId))
          .limit(1);
        if (threadRowEarly?.rootFolderId) {
          const executingToolCall: ToolCall = {
            ...toolCall,
            waitingForConfirmation: false,
          };
          await db
            .update(chatMessages)
            .set({
              metadata: {
                ...toolMessage.metadata,
                toolCall: executingToolCall,
              },
              updatedAt: new Date(),
            })
            .where(eq(chatMessages.id, toolConfirmation.messageId));
          const earlyEmitter = createMessagesEmitter(logger, user, {
            threadId: toolMessage.threadId,
            rootFolderId: threadRowEarly.rootFolderId,
            resolvedRelayContext,
          });
          earlyEmitter("tool-result", {
            responseData: {
              messages: [
                {
                  id: toolConfirmation.messageId,
                  metadata: { toolCall: executingToolCall },
                },
              ],
            },
          });
        }
      }

      const confirmed = await ConfirmedExecution.run({
        toolCall,
        toolMessage,
        toolMessageId: toolConfirmation.messageId,
        updatedArgs: toolConfirmation.updatedArgs,
        isIncognito,
        user,
        locale,
        logger,
        toolExecutionContext: params.toolExecutionContext,
      });
      const { toolResult, toolError, baseArgs } = confirmed;

      if (confirmed.wakeUpPending) {
        return {
          success: true,
          data: {
            threadId: toolMessage.threadId,
            toolMessageId: toolConfirmation.messageId,
            wakeUpPending: true,
          },
        };
      }

      const confirmedToolCallBase: Omit<ToolCall, "isDeferred"> = {
        ...toolCall,
        // Keep original args (with original callbackMode='approve') so AI sees what it actually called.
        args: baseArgs,
        result: toolResult,
        error: toolError,
        isConfirmed: true,
        waitingForConfirmation: false,
        originalToolCallId: toolCall.toolCallId,
      };

      if (isIncognito && messageHistory) {
        // Incognito: update in-place (no DB, no parent chain concept)
        const inPlaceToolCall: ToolCall = {
          ...confirmedToolCallBase,
          isDeferred: false, // in-place: no superseding needed
        };
        const msgIndex = messageHistory.findIndex(
          (msg) => msg.id === toolConfirmation.messageId,
        );
        if (msgIndex >= 0) {
          messageHistory[msgIndex].metadata = { toolCall: inPlaceToolCall };
        }
        logger.debug("[Tool Confirmation] Tool executed (incognito in-place)", {
          hasResult: !!toolResult,
          hasError: !!toolError,
        });
        return {
          success: true,
          data: {
            threadId: toolMessage.threadId,
            toolMessageId: toolConfirmation.messageId,
          },
        };
      } else if (!isIncognito) {
        // Same user turn (no newer USER messages): update the original message in-place.
        // Different user turn (user sent a new message after this tool was pending): insert deferred.
        //
        // Important: AI revival messages (from callbackMode=wait/wakeUp completing) are NOT
        // counted as a "new user turn" - they are part of the same user turn even if they have
        // a different sequenceId. Only explicit USER messages constitute a new turn.
        const newerSequenceMessage = toolMessage.sequenceId
          ? await db
              .select({ id: chatMessages.id })
              .from(chatMessages)
              .where(
                and(
                  eq(chatMessages.threadId, toolMessage.threadId),
                  gt(chatMessages.createdAt, toolMessage.createdAt),
                  eq(chatMessages.role, ChatMessageRole.USER),
                ),
              )
              .limit(1)
          : []; // no sequenceId → treat as same user turn (update in-place)

        logger.debug("[Tool Confirmation] newerSequenceMessage check", {
          sequenceId: toolMessage.sequenceId,
          newerCount: newerSequenceMessage.length,
          messageId: toolConfirmation.messageId,
          hasToolResult: !!toolResult,
        });

        if (newerSequenceMessage.length === 0) {
          // Same sequence - update the original message in-place (no superseding needed)
          const inPlaceToolCall: ToolCall = {
            ...confirmedToolCallBase,
            isDeferred: false,
          };
          // Preserve sibling metadata keys - only replace the toolCall object.
          await db
            .update(chatMessages)
            .set({
              metadata: { ...toolMessage.metadata, toolCall: inPlaceToolCall },
              updatedAt: new Date(),
            })
            .where(eq(chatMessages.id, toolConfirmation.messageId));
          // Broadcast the confirmed result — WS for local viewers AND the
          // cross-instance `tool-result` remoteEvent (via resolvedRelayContext)
          // so a MIRROR on the caller updates too. Without this the loop-remote
          // approve mirror stayed stuck at {status:"waiting_for_confirmation"}:
          // the executor ran + wrote the result here, but the caller's copy
          // never learned of it (silent DB update, no event).
          {
            const [threadRowEmit] = await db
              .select({ rootFolderId: chatThreads.rootFolderId })
              .from(chatThreads)
              .where(eq(chatThreads.id, toolMessage.threadId))
              .limit(1);
            if (threadRowEmit?.rootFolderId) {
              createMessagesEmitter(logger, user, {
                threadId: toolMessage.threadId,
                rootFolderId: threadRowEmit.rootFolderId,
                resolvedRelayContext,
              })("tool-result", {
                responseData: {
                  messages: [
                    {
                      id: toolConfirmation.messageId,
                      metadata: { toolCall: inPlaceToolCall },
                    },
                  ],
                },
              });
            }
          }
          logger.debug("[Tool Confirmation] Tool executed - updated in-place", {
            messageId: toolConfirmation.messageId,
          });
          return {
            success: true,
            data: {
              threadId: toolMessage.threadId,
              toolMessageId: toolConfirmation.messageId,
            },
          };
        }

        // Different sequence - find the true current tip of the thread and append there.
        // Walk forward from toolMessage.parentId (the assistant that issued the tool calls)
        // to reach the leaf of whatever chain has grown since (e.g. wakeUp revival messages).
        // This keeps the thread linear: confirm result is appended after the revival, not
        // inserted as a parallel sibling that would create a new branch.
        const deferredToolCall: ToolCall = {
          ...confirmedToolCallBase,
          isDeferred: true, // deferred: supersedes original waiting_for_confirmation placeholder
        };
        const deferredId =
          await ToolConfirmationHandler.insertDeferredConfirmationMessage({
            toolMessage,
            toolCall: deferredToolCall,
            threadId: toolMessage.threadId,
            user,
            logger,
            resolvedRelayContext,
          });
        logger.debug(
          "[Tool Confirmation] Tool executed - deferred confirm message inserted",
          {
            originalMessageId: toolConfirmation.messageId,
            deferredId,
            hasResult: !!toolResult,
            hasError: !!toolError,
          },
        );
        return {
          success: true,
          data: {
            threadId: toolMessage.threadId,
            toolMessageId: deferredId,
          },
        };
      }

      logger.debug("[Tool Confirmation] Tool executed", {
        hasResult: !!toolResult,
        hasError: !!toolError,
      });
    } else {
      const rejectedToolCallBase: Omit<ToolCall, "isDeferred"> = {
        ...toolCall,
        args: toolCall.args,
        isConfirmed: false,
        waitingForConfirmation: false,
        originalToolCallId: toolCall.toolCallId,
        error: fail({
          message: t("errors.userDeclinedTool"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        }),
      };

      if (isIncognito && messageHistory) {
        // Incognito: update in-place
        const inPlaceRejected: ToolCall = {
          ...rejectedToolCallBase,
          isDeferred: false,
        };
        const msgIndex = messageHistory.findIndex(
          (msg) => msg.id === toolConfirmation.messageId,
        );
        if (msgIndex >= 0) {
          messageHistory[msgIndex].metadata = { toolCall: inPlaceRejected };
        }
        logger.debug(
          "[Tool Confirmation] Tool rejected by user (incognito in-place)",
        );
        return {
          success: true,
          data: {
            threadId: toolMessage.threadId,
            toolMessageId: toolConfirmation.messageId,
          },
        };
      } else if (!isIncognito) {
        // Exclude error messages - they belong to prior sequences and should not
        // be counted as evidence that a new sequence has started.
        const newerSequenceMessage = toolMessage.sequenceId
          ? await db
              .select({ id: chatMessages.id })
              .from(chatMessages)
              .where(
                and(
                  eq(chatMessages.threadId, toolMessage.threadId),
                  gt(chatMessages.createdAt, toolMessage.createdAt),
                  ne(chatMessages.sequenceId, toolMessage.sequenceId),
                  ne(chatMessages.role, ChatMessageRole.ERROR),
                ),
              )
              .limit(1)
          : [{ id: "sentinel" }];

        if (newerSequenceMessage.length === 0) {
          // Same sequence - update the original message in-place
          const inPlaceRejected: ToolCall = {
            ...rejectedToolCallBase,
            isDeferred: false,
          };
          // Preserve sibling metadata keys - only replace the toolCall object.
          await db
            .update(chatMessages)
            .set({
              metadata: { ...toolMessage.metadata, toolCall: inPlaceRejected },
              updatedAt: new Date(),
            })
            .where(eq(chatMessages.id, toolConfirmation.messageId));
          logger.debug("[Tool Confirmation] Tool rejected - updated in-place", {
            messageId: toolConfirmation.messageId,
          });
          return {
            success: true,
            data: {
              threadId: toolMessage.threadId,
              toolMessageId: toolConfirmation.messageId,
            },
          };
        }

        // Different sequence - find the true current tip of the thread and append there.
        // Walk forward from toolMessage.parentId (the assistant that issued the tool calls)
        // to reach the leaf of whatever chain has grown since (e.g. wakeUp revival messages).
        // This keeps the thread linear: reject result is appended after the revival, not
        // inserted as a parallel sibling that would create a new branch.
        const deferredRejected: ToolCall = {
          ...rejectedToolCallBase,
          isDeferred: true,
        };
        const deferredId =
          await ToolConfirmationHandler.insertDeferredConfirmationMessage({
            toolMessage,
            toolCall: deferredRejected,
            threadId: toolMessage.threadId,
            user,
            logger,
            resolvedRelayContext,
          });
        logger.debug("[Tool Confirmation] Tool rejected - deferred inserted", {
          originalMessageId: toolConfirmation.messageId,
          deferredId,
        });
        return {
          success: true,
          data: {
            threadId: toolMessage.threadId,
            toolMessageId: deferredId,
          },
        };
      }

      logger.debug("[Tool Confirmation] Tool rejected by user");
    }

    return {
      success: true,
      data: {
        threadId: toolMessage.threadId,
        toolMessageId: toolConfirmation.messageId,
      },
    };
  }

  /**
   * Insert a deferred tool-result message at the current thread leaf and emit
   * WS events so the client has it in cache before any revival stream events.
   *
   * Used by both the confirmed and rejected deferred paths — they build
   * different ToolCall objects but share the exact same insert + emit sequence.
   *
   * Returns the new message's id (deferredId).
   */
  private static async insertDeferredConfirmationMessage(params: {
    toolMessage: ChatMessage;
    toolCall: ToolCall;
    threadId: string;
    user: JwtPayloadType;
    logger: EndpointLogger;
    resolvedRelayContext?: ResolvedRelayContext;
  }): Promise<string> {
    const {
      toolMessage,
      toolCall,
      threadId,
      user,
      logger,
      resolvedRelayContext,
    } = params;

    const [threadRow] = await db
      .select({ rootFolderId: chatThreads.rootFolderId })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);
    const rootFolderId = threadRow?.rootFolderId;

    const deferredParentId = await walkToLeafMessage(
      threadId,
      toolMessage.parentId ?? null,
      toolMessage.parentId ?? toolMessage.id,
    );
    const deferredId = crypto.randomUUID();
    const seqId = toolMessage.sequenceId ?? crypto.randomUUID();

    await db.insert(chatMessages).values({
      id: deferredId,
      threadId,
      role: ChatMessageRole.TOOL,
      content: null,
      parentId: deferredParentId,
      authorId: toolMessage.authorId,
      sequenceId: seqId,
      isAI: true,
      model: toolMessage.model,
      skill: toolMessage.skill,
      metadata: { toolCall },
    });

    // Emit WS so the client has this message in cache before any revival stream events.
    if (!rootFolderId) {
      return deferredId;
    }
    const emitter = createMessagesEmitter(logger, user, {
      threadId,
      rootFolderId,
      resolvedRelayContext,
    });
    emitter("message-created", {
      responseData: {
        messages: [
          buildSseMessageRow({
            id: deferredId,
            threadId,
            role: ChatMessageRole.TOOL,
            parentId: deferredParentId,
            model: toolMessage.model,
            skill: toolMessage.skill,
            sequenceId: seqId,
            metadata: { toolCall },
            isAI: true,
          }),
        ],
        streamingState: ThreadStreamingState.STREAMING,
      },
    });
    emitter("tool-result", {
      responseData: {
        messages: [
          {
            id: deferredId,
            metadata: { toolCall },
          },
        ],
      },
    });

    logger.debug("[Tool Confirmation] Deferred confirmation message inserted", {
      deferredId,
      threadId,
      deferredParentId,
    });

    return deferredId;
  }
}

// ============================================================================
// CONFIRMATION PRE-PROCESSING (merged from tool-confirmation-processor.ts)
// ============================================================================

export class ToolConfirmationProcessor {
  /**
   * Process all tool confirmations and collect results
   */
  static async processAll(params: {
    toolConfirmations: Array<{ messageId: string; confirmed: boolean }>;
    messageHistory: ChatMessage[] | undefined;
    isIncognito: boolean;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
    t: AiStreamT;
    toolExecutionContext: ToolExecutionContext;
    resolvedRelayContext?: ResolvedRelayContext;
  }): Promise<
    ResponseType<
      Array<{
        messageId: string;
        sequenceId: string;
        toolCall: ToolCall;
      }>
    >
  > {
    const {
      toolConfirmations,
      messageHistory,
      isIncognito,
      locale,
      logger,
      user,
      t,
    } = params;

    logger.debug("[Setup] Processing tool confirmations", {
      count: toolConfirmations.length,
      messageIds: toolConfirmations.map((tc) => tc.messageId),
    });

    const results: Array<{
      messageId: string;
      sequenceId: string;
      toolCall: ToolCall;
    }> = [];

    // Process all confirmations and collect results
    for (const toolConfirmation of toolConfirmations) {
      const confirmResult =
        await ToolConfirmationHandler.handleToolConfirmation({
          toolConfirmation,
          messageHistory,
          isIncognito,
          locale,
          logger,
          user,
          t,
          toolExecutionContext: params.toolExecutionContext,
          resolvedRelayContext: params.resolvedRelayContext,
        });

      if (!confirmResult.success) {
        return confirmResult;
      }

      // wakeUpPending=true means the goroutine is still running - resume-stream handles
      // the deferred insertion and revival. Still include the updated tool message so
      // the AI can reason about it (sees wakeUp pending state, responds naturally).
      // The tool message has waitingForConfirmation=false and callbackMode=wakeUp so
      // the context convert stage emits the standard wakeUp placeholder result for the AI.
      if (confirmResult.data.wakeUpPending) {
        logger.debug(
          "[Setup] wakeUpPending tool - including in confirm stream so AI can reason",
          {
            messageId: confirmResult.data.toolMessageId,
          },
        );
        // Fall through to the standard result-push below - same path as non-wakeUp.
      }

      // toolMessageId is either the original (updated in-place) or a new deferred row.
      const toolMessageId = confirmResult.data.toolMessageId;
      const updatedMessage = await chatDb.query.chatMessages.findFirst({
        where: eq(chatMessages.id, toolMessageId),
      });

      if (updatedMessage?.metadata?.toolCall) {
        results.push({
          messageId: toolMessageId,
          sequenceId: updatedMessage.sequenceId ?? crypto.randomUUID(),
          toolCall: updatedMessage.metadata.toolCall,
        });
      }
    }

    logger.debug(
      "[Setup] All tools executed - continuing with AI stream to process results",
      {
        resultsCount: results.length,
      },
    );

    return {
      success: true,
      data: results,
    };
  }
}
