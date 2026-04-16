/**
 * ToolConfirmationHandler - Handles tool confirmation and execution during setup
 */

import "server-only";

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { and, eq, gt, ne } from "drizzle-orm";
import {
  type ErrorResponseType,
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { CallbackMode } from "@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants";
import { loadTools } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import { CronTaskStatus } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { db } from "../../../../system/db";
import type { ToolExecutionContext } from "../../../chat/config";
import type { ChatMessage, ToolCall } from "../../../chat/db";
import { chatMessages } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import { createMessagesEmitter } from "../../../chat/threads/[threadId]/messages/emitter";
import type { AiStreamT } from "../../stream/i18n";
import { walkToLeafMessage } from "../core/branch-utils";

export class ToolConfirmationHandler {
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
    streamContext: ToolExecutionContext;
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
        .select()
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
      // Execute tool with updated args.
      // For execute-tool: check the original callbackMode before overriding.
      // If wakeUp: fire-and-forget - confirm returns immediately, revival delivers result.
      // Otherwise: override callbackMode to 'wait' so the inner tool executes inline.
      const baseArgs = toolConfirmation.updatedArgs
        ? {
            ...(toolCall.args as Record<
              string,
              string | number | boolean | null
            >),
            ...toolConfirmation.updatedArgs,
          }
        : toolCall.args;

      // Detect original callbackMode BEFORE overriding (needed for wakeUp fire-and-forget path).
      const originalCallbackMode =
        toolCall.toolName === "execute-tool" &&
        typeof baseArgs === "object" &&
        baseArgs !== null &&
        !Array.isArray(baseArgs) &&
        "callbackMode" in baseArgs
          ? (baseArgs as Record<string, string | number | boolean | null>)
              .callbackMode
          : null;
      const isWakeUpConfirm = originalCallbackMode === CallbackMode.WAKE_UP;

      const finalArgs =
        toolCall.toolName === "execute-tool" &&
        typeof baseArgs === "object" &&
        baseArgs !== null &&
        !Array.isArray(baseArgs) &&
        "callbackMode" in baseArgs
          ? {
              ...(baseArgs as Record<string, string | number | boolean | null>),
              // wakeUp: keep wakeUp semantics - execute-tool will fire-and-forget.
              // wait/other: override to wait so the inner tool executes inline.
              callbackMode: isWakeUpConfirm ? CallbackMode.WAKE_UP : "wait",
            }
          : baseArgs;

      // Set currentToolMessageId so RouteExecuteRepository (wakeUp path) can call
      // handleTaskCompletion with the correct toolMessageId for revival backfill.
      params.streamContext.currentToolMessageId = toolConfirmation.messageId;

      // Load and execute tool
      // Note: Tool confirmation already happened - this is executing the confirmed tool
      // Pass toolConfirmationConfig with requiresConfirmation=false to prevent re-checking
      // This signals to the tool that confirmation already happened and it should execute immediately
      const confirmationConfig = new Map<string, boolean>();
      confirmationConfig.set(toolCall.toolName, false); // false = no confirmation needed (already confirmed)

      const toolsResult = await loadTools({
        requestedTools: [toolCall.toolName],
        user,
        locale,
        logger,
        systemPrompt: "",
        toolConfirmationConfig: confirmationConfig,
        streamContext: params.streamContext,
      });

      const toolEntry = Object.entries(toolsResult.tools ?? {}).find(
        ([name]) =>
          name === toolCall.toolName || name.endsWith(`/${toolCall.toolName}`),
      );

      if (!toolEntry) {
        logger.error("[Tool Confirmation] Tool not found", {
          toolName: toolCall.toolName,
        });
        return fail({
          message: t("post.toolConfirmation.errors.toolNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      interface ToolExecuteOptions {
        toolCallId: string;
        messages: Array<{ role: ChatMessageRole; content: string }>;
        abortSignal: AbortSignal;
      }
      const [, tool] = toolEntry as [
        string,
        {
          execute?: (
            args: WidgetData,
            options: ToolExecuteOptions,
          ) => Promise<WidgetData>;
        },
      ];
      let toolResult: WidgetData | undefined;
      let toolError: ErrorResponseType | undefined;

      logger.debug("[Tool Confirmation] Executing tool", {
        toolName: toolCall.toolName,
        hasExecuteMethod: !!tool?.execute,
        finalArgs,
      });

      try {
        if (tool?.execute) {
          toolResult = await tool.execute(finalArgs, {
            toolCallId: toolConfirmation.messageId,
            messages: [],
            abortSignal: AbortSignal.timeout(60000),
          });
          // Inject a hint so the AI understands why the tool ran despite callbackMode="approve"
          if (
            toolResult !== null &&
            typeof toolResult === "object" &&
            !Array.isArray(toolResult)
          ) {
            toolResult = {
              ...(toolResult as Record<string, WidgetData>),
              _hint:
                "This tool required user confirmation (callbackMode=approve). The user confirmed execution, so the result is now available.",
            };
          }
          logger.debug("[Tool Confirmation] Tool execution completed", {
            toolName: toolCall.toolName,
            hasResult: !!toolResult,
          });
        } else {
          logger.error("[Tool Confirmation] Tool missing execute method", {
            toolName: toolCall.toolName,
          });
          toolError = fail({
            message: t("errors.toolExecutionError"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
      } catch (error) {
        logger.error("[Tool Confirmation] Tool execution failed", {
          toolName: toolCall.toolName,
          error: error instanceof Error ? error.message : String(error),
        });
        toolError = fail({
          message: t("errors.toolExecutionError"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }

      // wakeUp confirm: execute-tool returned {taskId, status:'pending'} immediately.
      // Two sub-cases depending on whether the wakeUp result arrived before or after confirm:
      //
      // Case A - wakeUp completed BEFORE confirm (newer sequence exists from revival AI turn):
      //   The deferred result is already in a new sequence. Confirm should insert another
      //   deferred message as the leaf child (handled below in the non-wakeUp deferred path).
      //
      // Case B - confirm fires BEFORE wakeUp completes (no newer sequence yet, goroutine running):
      //   DO NOT touch the tool message - setting isDeferred=true here would race with
      //   resume-stream's idempotency check and cause it to skip the revival entirely.
      //   Just update the task row so handleTaskCompletion backfills the right message,
      //   then return wakeUpPending=true so the confirm stream skips this tool (revival handles it).
      if (
        isWakeUpConfirm &&
        toolResult !== undefined &&
        typeof toolResult === "object" &&
        toolResult !== null &&
        "status" in toolResult &&
        toolResult.status === CronTaskStatus.PENDING
      ) {
        const pendingTaskId =
          typeof toolResult.taskId === "string" ? toolResult.taskId : undefined;

        if (!isIncognito) {
          // Check whether the wakeUp result already landed (newer sequence present).
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
            : [];

          if (newerSequenceMessage.length === 0) {
            // Case B: goroutine still running.
            // Clear waitingForConfirmation so the UI shows the wakeUp state ("Running - result
            // will wake up AI") instead of the stale "Pending Confirmation" badge.
            // Do NOT set isDeferred or result - resume-stream owns that when the task completes.
            const clearedToolCall: ToolCall = {
              ...toolCall,
              waitingForConfirmation: false,
              isConfirmed: true,
            };
            await db
              .update(chatMessages)
              .set({ metadata: { toolCall: clearedToolCall } })
              .where(eq(chatMessages.id, toolConfirmation.messageId));
            // Re-emit message-created so the client updates the existing bubble's badge
            // (waitingForConfirmation=false → shows "Running - result will wake up AI").
            // Do NOT emit tool-result - there is no result yet; resume-stream delivers it later.
            createMessagesEmitter(
              toolMessage.threadId,
              null,
              logger,
              user,
            )("message-created", {
              messages: [
                {
                  id: toolConfirmation.messageId,
                  threadId: toolMessage.threadId,
                  role: ChatMessageRole.TOOL,
                  parentId: toolMessage.parentId ?? null,
                  content: null,
                  model: toolMessage.model,
                  skill: toolMessage.skill,
                  sequenceId: toolMessage.sequenceId ?? null,
                  metadata: { toolCall: clearedToolCall },
                  isAI: true,
                },
              ],
              streamingState: "streaming",
            });

            if (pendingTaskId) {
              try {
                await db
                  .update(cronTasks)
                  .set({
                    wakeUpToolMessageId: toolConfirmation.messageId,
                    updatedAt: new Date(),
                  })
                  .where(eq(cronTasks.id, pendingTaskId));
              } catch (updateErr) {
                logger.warn(
                  "[Tool Confirmation] Failed to update wakeUp task toolMessageId (non-fatal)",
                  {
                    pendingTaskId,
                    toolMessageId: toolConfirmation.messageId,
                    error:
                      updateErr instanceof Error
                        ? updateErr.message
                        : String(updateErr),
                  },
                );
              }
            }

            logger.debug(
              "[Tool Confirmation] wakeUp confirm (Case B) - goroutine running, resume-stream handles revival",
              { toolMessageId: toolConfirmation.messageId, pendingTaskId },
            );

            return {
              success: true,
              data: {
                threadId: toolMessage.threadId,
                toolMessageId: toolConfirmation.messageId,
                wakeUpPending: true,
              },
            };
          }
          // Case A: wakeUp already completed - fall through to the deferred insertion path below.
          logger.debug(
            "[Tool Confirmation] wakeUp confirm (Case A) - wakeUp already landed, inserting confirm deferred after revival",
            { toolMessageId: toolConfirmation.messageId },
          );
        }
      }

      // Non-wakeUp pending: remote task (queue path).
      // The execution returned {status:'pending'} immediately - the remote task was just created.
      // Per spec: no polling. The /report path → handleTaskCompletion → resume-stream handles revival.
      // Store the pending result as-is; the stream will be revived with the real result when done.

      const confirmedToolCallBase: Omit<ToolCall, "isDeferred"> = {
        ...toolCall,
        // Keep original args (with original callbackMode='approve') so AI sees what it actually called.
        // finalArgs overrides callbackMode to 'wait' for execution only - don't expose that to AI.
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
        // Same sequence (no newer messages from a different sequence): update in-place.
        // Different sequence (messages exist after this one in a new sequence): insert deferred.
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
          : []; // no sequenceId → treat as same sequence (update in-place)

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
          await db
            .update(chatMessages)
            .set({ metadata: { toolCall: inPlaceToolCall } })
            .where(eq(chatMessages.id, toolConfirmation.messageId));
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
        const confirmedDeferredParentId = await walkToLeafMessage(
          toolMessage.threadId,
          toolMessage.parentId ?? null,
          toolMessage.parentId ?? toolMessage.id,
        );
        const deferredId = crypto.randomUUID();
        const confirmedSeqId = toolMessage.sequenceId ?? crypto.randomUUID();
        await db.insert(chatMessages).values({
          id: deferredId,
          threadId: toolMessage.threadId,
          role: "tool" as ChatMessageRole,
          content: null,
          parentId: confirmedDeferredParentId,
          authorId: toolMessage.authorId,
          sequenceId: confirmedSeqId,
          isAI: true,
          model: toolMessage.model,
          skill: toolMessage.skill,
          metadata: { toolCall: deferredToolCall },
        });
        // Emit WS so the client has this message in cache before any revival stream events.
        const confirmedEmitter = createMessagesEmitter(
          toolMessage.threadId,
          null,
          logger,
          user,
        );
        confirmedEmitter("message-created", {
          messages: [
            {
              id: deferredId,
              threadId: toolMessage.threadId,
              role: ChatMessageRole.TOOL,
              parentId: confirmedDeferredParentId,
              content: null,
              model: toolMessage.model,
              skill: toolMessage.skill,
              sequenceId: confirmedSeqId,
              metadata: { toolCall: deferredToolCall },
              isAI: true,
            },
          ],
          streamingState: "streaming",
        });
        confirmedEmitter("tool-result", {
          messages: [
            {
              id: deferredId,
              metadata: { toolCall: deferredToolCall },
            },
          ],
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
          await db
            .update(chatMessages)
            .set({ metadata: { toolCall: inPlaceRejected } })
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
        const rejectedDeferredParentId = await walkToLeafMessage(
          toolMessage.threadId,
          toolMessage.parentId ?? null,
          toolMessage.parentId ?? toolMessage.id,
        );
        const deferredId = crypto.randomUUID();
        const rejectedSeqId = toolMessage.sequenceId ?? crypto.randomUUID();
        await db.insert(chatMessages).values({
          id: deferredId,
          threadId: toolMessage.threadId,
          role: ChatMessageRole.TOOL,
          content: null,
          parentId: rejectedDeferredParentId,
          authorId: toolMessage.authorId,
          sequenceId: rejectedSeqId,
          isAI: true,
          model: toolMessage.model,
          skill: toolMessage.skill,
          metadata: { toolCall: deferredRejected },
        });
        // Emit WS so the client has this message in cache before any revival stream events.
        const rejectedEmitter = createMessagesEmitter(
          toolMessage.threadId,
          null,
          logger,
          user,
        );
        rejectedEmitter("message-created", {
          messages: [
            {
              id: deferredId,
              threadId: toolMessage.threadId,
              role: ChatMessageRole.TOOL,
              parentId: rejectedDeferredParentId,
              content: null,
              model: toolMessage.model,
              skill: toolMessage.skill,
              sequenceId: rejectedSeqId,
              metadata: { toolCall: deferredRejected },
              isAI: true,
            },
          ],
          streamingState: "streaming",
        });
        rejectedEmitter("tool-result", {
          messages: [
            {
              id: deferredId,
              metadata: { toolCall: deferredRejected },
            },
          ],
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
}
