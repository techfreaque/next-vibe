/**
 * ToolConfirmationHandler - Handles tool confirmation and execution during setup
 */

import "server-only";

import { and, eq, gt, ne } from "drizzle-orm";
import type { JsonValue } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";
import {
  type ErrorResponseType,
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { loadTools } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import { CallbackMode } from "@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import { CronTaskStatus } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { db } from "../../../../system/db";
import { walkToLeafMessage } from "../core/branch-utils";
import type { ToolExecutionContext } from "../../../chat/config";
import type { ChatMessage, ToolCall, ToolCallResult } from "../../../chat/db";
import { chatMessages } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import type { AiStreamT } from "../../stream/i18n";

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
  }): Promise<ResponseType<{ threadId: string; toolMessageId: string }>> {
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

    const toolCall = toolMessage.metadata?.toolCall as ToolCall | undefined;
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
      // If wakeUp: fire-and-forget — confirm returns immediately, revival delivers result.
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
              // wakeUp: keep wakeUp semantics — execute-tool will fire-and-forget.
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
            args: ToolCallResult,
            options: ToolExecuteOptions,
          ) => Promise<ToolCallResult>;
        },
      ];
      let toolResult: ToolCallResult | undefined;
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
              ...(toolResult as Record<string, JsonValue>),
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

      // wakeUp confirm: execute-tool returned {taskId, status:'pending'} immediately
      // (fire-and-forget goroutine running). Skip remote polling — revival delivers result.
      // Insert deferred confirm with pending status; update task row to point toolMessageId
      // to the deferred id so handleTaskCompletion backfills the right message on revival.
      if (
        isWakeUpConfirm &&
        toolResult !== undefined &&
        typeof toolResult === "object" &&
        toolResult !== null &&
        "status" in (toolResult as Record<string, ToolCallResult>) &&
        (toolResult as Record<string, ToolCallResult>).status ===
          CronTaskStatus.PENDING
      ) {
        const pendingTaskId = (toolResult as Record<string, ToolCallResult>)
          .taskId as string | undefined;

        const pendingToolCall: ToolCall = {
          ...toolCall,
          args: finalArgs as ToolCallResult,
          result: undefined,
          error: undefined,
          isConfirmed: true,
          waitingForConfirmation: false,
          isDeferred: true,
          originalToolCallId: toolCall.toolCallId,
          // Mark as wakeUp pending so the UI shows the right state
          status: "pending" as const,
          callbackMode: CallbackMode.WAKE_UP,
        };

        if (!isIncognito) {
          const newerSequenceMessage = toolMessage.sequenceId
            ? await db
                .select({ id: chatMessages.id })
                .from(chatMessages)
                .where(
                  and(
                    eq(chatMessages.threadId, toolMessage.threadId),
                    gt(chatMessages.createdAt, toolMessage.createdAt),
                    ne(chatMessages.sequenceId, toolMessage.sequenceId),
                  ),
                )
                .limit(1)
            : [{ id: "sentinel" }];

          const toolMessageIdToReturn =
            newerSequenceMessage.length === 0
              ? toolConfirmation.messageId
              : crypto.randomUUID();

          if (newerSequenceMessage.length === 0) {
            // Same sequence — update in-place
            await db
              .update(chatMessages)
              .set({ metadata: { toolCall: pendingToolCall } })
              .where(eq(chatMessages.id, toolConfirmation.messageId));
          } else {
            // Different sequence — insert deferred.
            // Walk forward from leafMessageId to find the true current branch tip,
            // so the deferred result is appended to the correct branch even if many
            // messages were added after the original tool call.
            const deferredParentId = await walkToLeafMessage(
              toolMessage.threadId,
              params.streamContext.leafMessageId ?? null,
              toolMessage.parentId ?? toolMessage.id,
            );
            await db.insert(chatMessages).values({
              id: toolMessageIdToReturn,
              threadId: toolMessage.threadId,
              role: "tool" as ChatMessageRole,
              content: null,
              parentId: deferredParentId,
              authorId: toolMessage.authorId,
              sequenceId: toolMessage.sequenceId ?? crypto.randomUUID(),
              isAI: true,
              model: toolMessage.model,
              skill: toolMessage.skill,
              metadata: { toolCall: pendingToolCall },
            });
          }

          // Update the wakeUp task row to point toolMessageId to the correct message
          // so handleTaskCompletion backfills the correct message on revival.
          if (pendingTaskId) {
            try {
              await db
                .update(cronTasks)
                .set({
                  wakeUpToolMessageId: toolMessageIdToReturn,
                  updatedAt: new Date(),
                })
                .where(eq(cronTasks.id, pendingTaskId));
            } catch (updateErr) {
              logger.warn(
                "[Tool Confirmation] Failed to update wakeUp task toolMessageId (non-fatal)",
                {
                  pendingTaskId,
                  toolMessageIdToReturn,
                  error:
                    updateErr instanceof Error
                      ? updateErr.message
                      : String(updateErr),
                },
              );
            }
          }

          logger.info("[Tool Confirmation] wakeUp confirm — revival pending", {
            originalMessageId: toolConfirmation.messageId,
            toolMessageIdToReturn,
            pendingTaskId,
            inPlace: newerSequenceMessage.length === 0,
          });

          return {
            success: true,
            data: {
              threadId: toolMessage.threadId,
              toolMessageId: toolMessageIdToReturn,
            },
          };
        }

        // Incognito wakeUp: update in-place with pending status
        if (isIncognito && messageHistory) {
          const msgIndex = messageHistory.findIndex(
            (msg) => msg.id === toolConfirmation.messageId,
          );
          if (msgIndex >= 0) {
            messageHistory[msgIndex].metadata = { toolCall: pendingToolCall };
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

      // Non-wakeUp pending: remote task (queue path).
      // The execution returned {status:'pending'} immediately — the remote task was just created.
      // Per spec: no polling. The /report path → handleTaskCompletion → resume-stream handles revival.
      // Store the pending result as-is; the stream will be revived with the real result when done.

      const confirmedToolCallBase: Omit<ToolCall, "isDeferred"> = {
        ...toolCall,
        // Keep original args (with original callbackMode='approve') so AI sees what it actually called.
        // finalArgs overrides callbackMode to 'wait' for execution only — don't expose that to AI.
        args: baseArgs as ToolCallResult,
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
        const newerSequenceMessage = toolMessage.sequenceId
          ? await db
              .select({ id: chatMessages.id })
              .from(chatMessages)
              .where(
                and(
                  eq(chatMessages.threadId, toolMessage.threadId),
                  gt(chatMessages.createdAt, toolMessage.createdAt),
                  ne(chatMessages.sequenceId, toolMessage.sequenceId),
                ),
              )
              .limit(1)
          : [{ id: "sentinel" }]; // no sequenceId → treat as different sequence

        if (newerSequenceMessage.length === 0) {
          // Same sequence — update the original message in-place (no superseding needed)
          const inPlaceToolCall: ToolCall = {
            ...confirmedToolCallBase,
            isDeferred: false,
          };
          await db
            .update(chatMessages)
            .set({ metadata: { toolCall: inPlaceToolCall } })
            .where(eq(chatMessages.id, toolConfirmation.messageId));
          logger.debug("[Tool Confirmation] Tool executed — updated in-place", {
            messageId: toolConfirmation.messageId,
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
        }

        // Different sequence — insert a deferred message (supersedes original placeholder).
        // Walk forward from leafMessageId to find the true current branch tip,
        // so the deferred result is appended to the correct branch even if many
        // messages were added after the original tool call.
        const deferredToolCall: ToolCall = {
          ...confirmedToolCallBase,
          isDeferred: true, // deferred: supersedes original waiting_for_confirmation placeholder
        };
        const confirmedDeferredParentId = await walkToLeafMessage(
          toolMessage.threadId,
          params.streamContext.leafMessageId ?? null,
          toolMessage.parentId ?? toolMessage.id,
        );
        const deferredId = crypto.randomUUID();
        await db.insert(chatMessages).values({
          id: deferredId,
          threadId: toolMessage.threadId,
          role: "tool" as ChatMessageRole,
          content: null,
          parentId: confirmedDeferredParentId,
          authorId: toolMessage.authorId,
          sequenceId: toolMessage.sequenceId ?? crypto.randomUUID(),
          isAI: true,
          model: toolMessage.model,
          skill: toolMessage.skill,
          metadata: { toolCall: deferredToolCall },
        });
        logger.debug(
          "[Tool Confirmation] Tool executed — deferred confirm message inserted",
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
        const newerSequenceMessage = toolMessage.sequenceId
          ? await db
              .select({ id: chatMessages.id })
              .from(chatMessages)
              .where(
                and(
                  eq(chatMessages.threadId, toolMessage.threadId),
                  gt(chatMessages.createdAt, toolMessage.createdAt),
                  ne(chatMessages.sequenceId, toolMessage.sequenceId),
                ),
              )
              .limit(1)
          : [{ id: "sentinel" }];

        if (newerSequenceMessage.length === 0) {
          // Same sequence — update the original message in-place
          const inPlaceRejected: ToolCall = {
            ...rejectedToolCallBase,
            isDeferred: false,
          };
          await db
            .update(chatMessages)
            .set({ metadata: { toolCall: inPlaceRejected } })
            .where(eq(chatMessages.id, toolConfirmation.messageId));
          logger.debug("[Tool Confirmation] Tool rejected — updated in-place", {
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

        // Different sequence — insert deferred (supersedes original placeholder).
        // Walk forward from leafMessageId to find the true current branch tip.
        const deferredRejected: ToolCall = {
          ...rejectedToolCallBase,
          isDeferred: true,
        };
        const rejectedDeferredParentId = await walkToLeafMessage(
          toolMessage.threadId,
          params.streamContext.leafMessageId ?? null,
          toolMessage.parentId ?? toolMessage.id,
        );
        const deferredId = crypto.randomUUID();
        await db.insert(chatMessages).values({
          id: deferredId,
          threadId: toolMessage.threadId,
          role: ChatMessageRole.TOOL,
          content: null,
          parentId: rejectedDeferredParentId,
          authorId: toolMessage.authorId,
          sequenceId: toolMessage.sequenceId ?? crypto.randomUUID(),
          isAI: true,
          model: toolMessage.model,
          skill: toolMessage.skill,
          metadata: { toolCall: deferredRejected },
        });
        logger.debug("[Tool Confirmation] Tool rejected — deferred inserted", {
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
