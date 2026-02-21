/**
 * ToolConfirmationHandler - Handles tool confirmation and execution during setup
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  type ErrorResponseType,
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { loadTools } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { db } from "../../../../system/db";
import type { ChatMessage, ToolCall, ToolCallResult } from "../../../chat/db";
import { chatMessages } from "../../../chat/db";
import type { ChatMessageRole } from "../../../chat/enum";

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
  }): Promise<ResponseType<{ threadId: string; toolMessageId: string }>> {
    const {
      toolConfirmation,
      messageHistory,
      isIncognito,
      locale,
      logger,
      user,
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
        message:
          "app.api.agent.chat.aiStream.post.toolConfirmation.errors.messageNotFound",
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const toolCall = toolMessage.metadata?.toolCall as ToolCall | undefined;
    if (!toolCall) {
      logger.error("[Tool Confirmation] ToolCall metadata missing");
      return fail({
        message:
          "app.api.agent.chat.aiStream.post.toolConfirmation.errors.toolCallMissing",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    if (toolConfirmation.confirmed) {
      // Execute tool with updated args
      const finalArgs = toolConfirmation.updatedArgs
        ? {
            ...(toolCall.args as Record<
              string,
              string | number | boolean | null
            >),
            ...toolConfirmation.updatedArgs,
          }
        : toolCall.args;

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
          message:
            "app.api.agent.chat.aiStream.post.toolConfirmation.errors.toolNotFound",
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
          logger.debug("[Tool Confirmation] Tool execution completed", {
            toolName: toolCall.toolName,
            hasResult: !!toolResult,
          });
        } else {
          logger.error("[Tool Confirmation] Tool missing execute method", {
            toolName: toolCall.toolName,
          });
          toolError = fail({
            message:
              "app.api.agent.chat.aiStream.errors.toolExecutionError" as const,
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
      } catch (error) {
        logger.error("[Tool Confirmation] Tool execution failed", {
          toolName: toolCall.toolName,
          error: error instanceof Error ? error.message : String(error),
        });
        toolError = fail({
          message:
            "app.api.agent.chat.aiStream.errors.toolExecutionError" as const,
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }

      // Update tool message with result
      const updatedToolCall: ToolCall = {
        ...toolCall,
        args: finalArgs as ToolCallResult,
        result: toolResult,
        error: toolError,
        isConfirmed: true,
        waitingForConfirmation: false,
      };

      // Update tool message with result - persistence differs by mode
      if (isIncognito && messageHistory) {
        // Incognito: update messageHistory array (client will save to localStorage)
        const msgIndex = messageHistory.findIndex(
          (msg) => msg.id === toolConfirmation.messageId,
        );
        if (msgIndex >= 0) {
          messageHistory[msgIndex].metadata = { toolCall: updatedToolCall };
        }
      } else if (!isIncognito) {
        // Server: update DB
        await db
          .update(chatMessages)
          .set({
            metadata: { toolCall: updatedToolCall },
            updatedAt: new Date(),
          })
          .where(eq(chatMessages.id, toolConfirmation.messageId));
      }

      logger.debug("[Tool Confirmation] Tool executed", {
        hasResult: !!toolResult,
        hasError: !!toolError,
      });
    } else {
      // User rejected - update with structured error that includes the input args
      const rejectedToolCall: ToolCall = {
        ...toolCall,
        args: toolCall.args, // Keep original args for display
        isConfirmed: false,
        waitingForConfirmation: false,
        error: fail({
          message:
            "app.api.agent.chat.aiStream.errors.userDeclinedTool" as const,
          errorType: ErrorResponseTypes.FORBIDDEN,
        }),
      };

      // Update tool message with rejection - persistence differs by mode
      if (isIncognito && messageHistory) {
        // Incognito: update messageHistory array (client will save to localStorage)
        const msgIndex = messageHistory.findIndex(
          (msg) => msg.id === toolConfirmation.messageId,
        );
        if (msgIndex >= 0) {
          messageHistory[msgIndex].metadata = { toolCall: rejectedToolCall };
        }
      } else if (!isIncognito) {
        // Server: update DB
        await db
          .update(chatMessages)
          .set({
            metadata: { toolCall: rejectedToolCall },
            updatedAt: new Date(),
          })
          .where(eq(chatMessages.id, toolConfirmation.messageId));
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
