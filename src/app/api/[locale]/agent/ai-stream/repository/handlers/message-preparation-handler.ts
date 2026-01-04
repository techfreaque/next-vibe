/**
 * MessagePreparationHandler - Prepares messages for AI streaming
 */

import "server-only";

import type { ModelMessage } from "ai";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { defaultLocale } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { type DefaultFolderId } from "../../../chat/config";
import type { ToolCall } from "../../../chat/db";
import type { ChatMessage } from "../../../chat/db";
import type { ChatMessageRole } from "../../../chat/enum";
import type { AiStreamPostRequestOutput } from "../../definition";
import { CONTINUE_CONVERSATION_PROMPT } from "../system-prompt/generator";
import { MessageContextBuilder } from "./message-context-builder";
import { MessageConverter } from "./message-converter";

export class MessagePreparationHandler {
  /**
   * Prepare messages for AI streaming by building context, adding current message, and tool results
   */
  static async prepareMessages(params: {
    operation: AiStreamPostRequestOutput["operation"];
    effectiveThreadId: string | null | undefined;
    effectiveParentMessageId: string | null | undefined;
    effectiveContent: string;
    effectiveRole: ChatMessageRole;
    userId: string | undefined;
    isIncognito: boolean;
    rootFolderId: DefaultFolderId;
    messageHistory: ChatMessage[] | undefined;
    userMessageMetadata:
      | {
          attachments?: Array<{
            id: string;
            url: string;
            filename: string;
            mimeType: string;
            size: number;
            data?: string;
          }>;
        }
      | undefined;
    hasToolConfirmations: boolean;
    toolConfirmationResults: Array<{
      messageId: string;
      sequenceId: string;
      toolCall: ToolCall;
    }>;
    systemPrompt: string;
    model: string;
    character: string | null;
    logger: EndpointLogger;
  }): Promise<ModelMessage[]> {
    const {
      operation,
      effectiveThreadId,
      effectiveParentMessageId,
      effectiveContent,
      effectiveRole,
      userId,
      isIncognito,
      rootFolderId,
      messageHistory,
      userMessageMetadata,
      hasToolConfirmations,
      toolConfirmationResults,
      systemPrompt,
      model,
      character,
      logger,
    } = params;

    logger.debug("[Setup] *** ABOUT TO CALL buildMessageContext ***", {
      hasUserMessageMetadata: !!userMessageMetadata,
      userMessageMetadataAttachmentCount: userMessageMetadata?.attachments?.length ?? 0,
      isIncognito,
      userId,
      threadId: effectiveThreadId,
    });

    // Get message history (past messages only)
    const historyMessages = await MessageContextBuilder.buildMessageContext({
      operation,
      threadId: effectiveThreadId,
      parentMessageId: effectiveParentMessageId,
      content: effectiveContent,
      role: effectiveRole,
      userId,
      isIncognito,
      rootFolderId,
      messageHistory,
      logger,
      upcomingResponseContext: { model, character },
      userMessageMetadata,
    });

    // Add new user message from content/attachments (unless it's answer-as-ai or tool confirmations)
    const messages = [...historyMessages];
    if (operation !== "answer-as-ai" && !hasToolConfirmations && effectiveContent.trim()) {
      const currentMessage = await MessageConverter.toAiSdkMessage(
        userMessageMetadata
          ? {
              role: effectiveRole,
              content: effectiveContent,
              metadata: userMessageMetadata,
            }
          : {
              role: effectiveRole,
              content: effectiveContent,
            },
        logger,
      );
      if (currentMessage) {
        // toAiSdkMessage can return a single message or an array - handle both
        if (Array.isArray(currentMessage)) {
          messages.push(...currentMessage);
        } else {
          messages.push(currentMessage);
        }
        logger.debug("[Setup] Added new user message to context", {
          role: effectiveRole,
          hasMetadata: !!userMessageMetadata,
          attachmentCount: userMessageMetadata?.attachments?.length ?? 0,
        });
      }
    }

    // CRITICAL FIX: Add tool confirmation results to message history
    // Tool messages are created in DB AFTER buildMessageContext is called (during streaming)
    // So we need to manually add them here from toolConfirmationResults
    if (hasToolConfirmations && toolConfirmationResults.length > 0) {
      logger.debug("[Setup] Adding tool confirmation results to message history", {
        count: toolConfirmationResults.length,
      });

      for (const result of toolConfirmationResults) {
        const toolCall = result.toolCall;

        // Convert to AI SDK format - BOTH assistant tool-call AND tool result
        // Translate error messages for AI (using default locale for consistency)
        const output = toolCall.error
          ? {
              type: "error-text" as const,
              value:
                toolCall.error.message === "app.api.agent.chat.aiStream.errors.userDeclinedTool"
                  ? simpleT(defaultLocale).t(toolCall.error.message)
                  : JSON.stringify({
                      message: toolCall.error.message,
                      params: toolCall.error.messageParams,
                    }),
            }
          : { type: "json" as const, value: toolCall.result ?? null };

        // Add ASSISTANT message with tool-call
        messages.push({
          role: "assistant",
          content: [
            {
              type: "tool-call",
              toolCallId: toolCall.toolCallId,
              toolName: toolCall.toolName,
              input: toolCall.args,
            },
          ],
        });

        // Add TOOL message with tool-result
        messages.push({
          role: "tool",
          content: [
            {
              type: "tool-result",
              toolCallId: toolCall.toolCallId,
              toolName: toolCall.toolName,
              output,
            },
          ],
        });
      }

      logger.debug("[Setup] Added tool confirmation results to messages", {
        totalMessages: messages.length,
      });
    }

    // Prepend system prompt if not already present
    messages.unshift({ role: "system", content: systemPrompt });

    // For answer-as-ai operation, add CONTINUE_CONVERSATION_PROMPT as the last system message
    // User can optionally provide additional instructions via effectiveContent
    if (operation === "answer-as-ai") {
      const systemContent = effectiveContent.trim()
        ? `${CONTINUE_CONVERSATION_PROMPT}\n\nAdditional instructions: ${effectiveContent}`
        : CONTINUE_CONVERSATION_PROMPT;

      messages.push({ role: "system", content: systemContent });
      logger.debug("[Setup] Added CONTINUE_CONVERSATION_PROMPT for answer-as-ai operation", {
        hasAdditionalContent: !!effectiveContent.trim(),
      });
    }

    return messages;
  }
}
