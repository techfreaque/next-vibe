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

import { db } from "../../../../system/database";
import type { ToolExecutionContext } from "../../../chat/config";
import type { ChatMessage, ToolCall } from "../../../chat/db";
import { chatMessages, chatThreads } from "../../../chat/db";
import { ChatMessageRole, ThreadStreamingState } from "../../../chat/enum";
import { createMessagesEmitter } from "../../../chat/threads/[threadId]/messages/emitter";
import type { AiStreamT } from "../../stream/i18n";
import { buildSseMessageRow } from "../core/db-writer/sse-row";
import { walkToLeafMessage } from "../core/tree-walk";

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
      const isExecuteToolWrapper = toolCall.toolName === EXECUTE_TOOL_ALIAS;
      const originalCallbackMode =
        isExecuteToolWrapper &&
        typeof baseArgs === "object" &&
        baseArgs !== null &&
        !Array.isArray(baseArgs) &&
        "callbackMode" in baseArgs
          ? (baseArgs as Record<string, string | number | boolean | null>)
              .callbackMode
          : null;
      const isWakeUpConfirm = originalCallbackMode === CallbackMode.WAKE_UP;

      // When execute-tool wraps the target tool, unwrap and call the inner tool directly.
      // Keeping execute-tool as the wrapper double-nests the result ({ result: { result: ... } })
      // and in the APPROVE case re-triggers the APPROVE gate inside execute-tool.
      // Exception: wakeUp — execute-tool's local-async handler owns task creation, so the
      // wrapper must stay for the wakeUp path.
      const shouldUnwrapExecuteTool = isExecuteToolWrapper && !isWakeUpConfirm;
      const execToolName = shouldUnwrapExecuteTool
        ? String(
            (baseArgs as Record<string, string | number | boolean | null>)
              .toolName ?? toolCall.toolName,
          )
        : toolCall.toolName;
      const execInput = shouldUnwrapExecuteTool
        ? (((baseArgs as Record<string, WidgetData>).input as Record<
            string,
            WidgetData
          > | null) ?? {})
        : (baseArgs as Record<string, WidgetData>);

      // Set currentToolMessageId so RouteExecuteRepository (wakeUp path) can call
      // handleTaskCompletion with the correct toolMessageId for revival backfill.
      params.streamContext.currentToolMessageId = toolConfirmation.messageId;
      // Signal that this is a confirmed re-execution so execute-tool's requiresConfirmation
      // gate is bypassed — the user already confirmed, we must not halt again.
      params.streamContext.isConfirmedReExecution = true;

      logger.debug("[Tool Confirmation] Executing tool", {
        toolName: execToolName,
        baseArgs,
      });

      let toolResult: WidgetData | undefined;
      let toolError: ErrorResponseType | undefined;

      // Route through RouteExecuteRepository so all callbackMode logic (WAKE_UP,
      // WAIT, requiresConfirmation gate) is handled in one place.
      const execResult = await RouteExecuteRepository.runInProcess({
        toolName: execToolName,
        input: execInput,
        callbackMode: isWakeUpConfirm
          ? CallbackMode.WAKE_UP
          : CallbackMode.WAIT,
        user,
        locale,
        logger,
        streamContext: params.streamContext,
        platform: Platform.AI,
      });

      if (execResult.success) {
        // runInProcess wraps tool results in { result: ... } for AI/MCP display.
        // For direct tool calls (not execute-tool wrapper), unwrap to match what
        // the old loadTools()+tool.execute() path returned — the raw tool output.
        // For execute-tool wrappers (already unwrapped to the inner tool),
        // keep the { result: ... } layer since resolveToolResult will strip it.
        const rawData = execResult.data;
        toolResult =
          !isExecuteToolWrapper &&
          rawData !== null &&
          typeof rawData === "object" &&
          !Array.isArray(rawData) &&
          "result" in (rawData as Record<string, WidgetData>)
            ? ((rawData as Record<string, WidgetData>)["result"] as WidgetData)
            : rawData;
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
        logger.error("[Tool Confirmation] Tool execution failed", {
          toolName: toolCall.toolName,
          message: execResult.message,
        });
        toolError = execResult;
      }

      // wakeUp confirm race: execute-tool returned {taskId, status:'pending'} immediately.
      // detectWakeUpConfirmRace determines whether the goroutine is still running (Case B)
      // or already landed its result (Case A). See handlers/completion.ts for full rationale.
      if (
        isWakeUpConfirm &&
        toolResult !== undefined &&
        typeof toolResult === "object" &&
        toolResult !== null &&
        "status" in toolResult &&
        toolResult.status === CronTaskStatus.PENDING &&
        !isIncognito
      ) {
        const pendingTaskId =
          typeof toolResult.taskId === "string" ? toolResult.taskId : undefined;

        const raceResult = await TaskCompletion.detectWakeUpConfirmRace({
          toolMessage,
          toolCall,
          toolMessageId: toolConfirmation.messageId,
          pendingTaskId,
          user,
          logger,
        });

        if (raceResult.kind === "case-b") {
          return {
            success: true,
            data: {
              threadId: toolMessage.threadId,
              toolMessageId: toolConfirmation.messageId,
              wakeUpPending: true,
            },
          };
        }
        // Case A: fall through to the deferred insertion path below.
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
  }): Promise<string> {
    const { toolMessage, toolCall, threadId, user, logger } = params;

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
    streamContext: ToolExecutionContext;
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
          streamContext: params.streamContext,
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
      const updatedMessage = await db.query.chatMessages.findFirst({
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
