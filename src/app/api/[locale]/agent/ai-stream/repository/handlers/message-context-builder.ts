/**
 * MessageContextBuilder - Builds message context for AI streaming
 */

import "server-only";

import type { ModelMessage } from "ai";
import { eq } from "drizzle-orm";

import {
  getModelById,
  type ModelId,
} from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { db } from "../../../../system/db";
import type { DefaultFolderId } from "../../../chat/config";
import type { ChatMessage, ToolCall } from "../../../chat/db";
import { chatMessages } from "../../../chat/db";
import type { ChatMessageRole } from "../../../chat/enum";
import { fetchMessageHistory } from "../../../chat/threads/[threadId]/messages/repository";
import { MessageConverter } from "./message-converter";

export class MessageContextBuilder {
  /**
   * Strip attachments from messages for non-vision models
   * Operates on ChatMessage objects BEFORE conversion to AI SDK format
   */
  private static stripAttachmentsFromMessages(
    messages: ChatMessage[],
    modelName: string,
  ): {
    totalRemoved: number;
    formats: string[];
    warningMessage: string;
  } {
    let totalRemoved = 0;
    const formatSet = new Set<string>();

    for (const message of messages) {
      if (!message.metadata?.attachments) {
        continue;
      }

      const originalCount = message.metadata.attachments.length;

      // Filter out image and file attachments
      message.metadata.attachments = message.metadata.attachments.filter(
        (attachment) => {
          const mimeType = attachment.mimeType?.toLowerCase() || "";
          const isImage = mimeType.startsWith("image/");
          const isFile =
            mimeType.startsWith("application/") || mimeType.startsWith("text/");

          if (isImage || isFile) {
            totalRemoved++;
            formatSet.add(isImage ? "image" : "file");
            return false;
          }

          return true;
        },
      );

      // If all attachments were removed, remove the attachments array
      if (message.metadata.attachments.length === 0) {
        delete message.metadata.attachments;
      }

      const removedCount =
        originalCount - (message.metadata.attachments?.length || 0);
      if (removedCount > 0) {
        // Optionally clear content if it was only describing the attachment
        // For now, we keep the text content even if attachments are removed
      }
    }

    const formats = [...formatSet];
    const formatList = formats.join(", ");
    const warningMessage = `[IMPORTANT] ${totalRemoved} attachment(s) (${formatList}) were removed from the conversation history because the current model (${modelName}) does not support vision/file analysis. If the user references these attachments or asks questions about them, politely inform them that you cannot analyze ${formatList}s with this model. IMPORTANT: Suggest they switch to a vision-capable model (like Claude Sonnet 4.5, GPT-5, or Gemini) to analyze the attachments, then switch back to continue the conversation if needed.`;

    return {
      totalRemoved,
      formats,
      warningMessage,
    };
  }

  /**
   * Build complete message context for AI streaming
   * Includes: history, current message, and tool confirmation results
   * Force recompile: 2026-01-01
   */
  static async buildMessageContext(params: {
    operation: "send" | "retry" | "edit" | "answer-as-ai";
    threadId: string | null | undefined;
    parentMessageId: string | null | undefined;
    content: string;
    role: ChatMessageRole;
    userId: string | undefined;
    isIncognito: boolean;
    rootFolderId?: DefaultFolderId;
    messageHistory?: ChatMessage[];
    logger: EndpointLogger;
    upcomingResponseContext?: { model: string; character: string | null };
    userMessageMetadata?: {
      attachments?: Array<{
        id: string;
        url: string;
        filename: string;
        mimeType: string;
        size: number;
        data?: string;
      }>;
    };
    hasToolConfirmations?: boolean;
    toolConfirmationResults?: Array<{
      messageId: string;
      sequenceId: string;
      toolCall: ToolCall;
    }>;
  }): Promise<ModelMessage[]> {
    params.logger.debug("[BuildMessageContext] === FUNCTION CALLED ===", {
      operation: params.operation,
      isIncognito: params.isIncognito,
      hasUserId: !!params.userId,
      hasThreadId: !!params.threadId,
      hasUserMessageMetadata: !!params.userMessageMetadata,
      attachmentCount: params.userMessageMetadata?.attachments?.length ?? 0,
    });
    // SECURITY: Reject non-empty messageHistory for non-incognito threads
    // Non-incognito threads must fetch history from database to prevent manipulation
    if (
      !params.isIncognito &&
      params.messageHistory &&
      params.messageHistory.length > 0
    ) {
      params.logger.error(
        "Security violation: messageHistory provided for non-incognito thread",
        {
          operation: params.operation,
          threadId: params.threadId,
          isIncognito: params.isIncognito,
          messageHistoryLength: params.messageHistory.length,
        },
      );
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Security violation should throw immediately
      throw new Error(
        "messageHistory is only allowed for incognito mode. Server-side threads fetch history from database.",
      );
    }

    // Get message history - source depends on mode (incognito: passed, server: DB)
    let history: ChatMessage[] = [];

    if (params.isIncognito && params.messageHistory) {
      // Incognito: use passed message history
      history = params.messageHistory;
      params.logger.debug(
        "[BuildMessageContext] Using passed message history (incognito)",
        {
          operation: params.operation,
          historyLength: history.length,
        },
      );
    } else if (!params.isIncognito && params.threadId) {
      // Server: fetch message history from database
      if (params.operation === "answer-as-ai" && params.parentMessageId) {
        // For answer-as-ai: get all messages up to parent (not just branch)
        const allMessages = await db
          .select()
          .from(chatMessages)
          .where(eq(chatMessages.threadId, params.threadId))
          .orderBy(chatMessages.createdAt);

        const parentIndex = allMessages.findIndex(
          (msg) => msg.id === params.parentMessageId,
        );

        if (parentIndex !== -1) {
          history = allMessages.slice(0, parentIndex + 1);
        } else {
          params.logger.error("Parent message not found in thread", {
            parentMessageId: params.parentMessageId,
            threadId: params.threadId,
          });
        }
      } else {
        // For other operations: fetch history filtered by branch
        history = await fetchMessageHistory(
          params.threadId,
          params.logger,
          params.parentMessageId ?? null,
        );
      }

      // Fetch file data for attachments in server mode
      const { getStorageAdapter } = await import("../../../chat/storage");
      const storage = getStorageAdapter();

      for (const message of history) {
        if (message.metadata?.attachments) {
          for (const attachment of message.metadata.attachments) {
            if (attachment.url && !attachment.data) {
              const base64Data = await storage.readFileAsBase64(
                attachment.id,
                params.threadId,
              );
              if (base64Data) {
                attachment.data = base64Data;
                params.logger.debug(
                  "[BuildMessageContext] Fetched file data for attachment",
                  {
                    attachmentId: attachment.id,
                    filename: attachment.filename,
                  },
                );
              }
            }
          }
        }
      }

      params.logger.debug(
        "[BuildMessageContext] Fetched message history from DB (server)",
        {
          operation: params.operation,
          historyLength: history.length,
        },
      );
    } else {
      params.logger.debug(
        "[BuildMessageContext] No history (new conversation)",
        {
          operation: params.operation,
          hasThreadId: !!params.threadId,
        },
      );
    }

    // ============================================================================
    // STEP 1: Build complete message context (ChatMessage format)
    // ============================================================================
    const contextMessages: ChatMessage[] = [...history];

    // Add current user message to context (unless it's answer-as-ai or tool confirmations)
    const shouldAddCurrentMessage =
      params.operation !== "answer-as-ai" &&
      !params.hasToolConfirmations &&
      params.content.trim();

    if (shouldAddCurrentMessage) {
      const currentMessage: ChatMessage = {
        id: crypto.randomUUID(),
        threadId: params.threadId || "",
        parentId: params.parentMessageId || null,
        depth: 0,
        sequenceId: crypto.randomUUID(),
        role: params.role,
        content: params.content,
        metadata: params.userMessageMetadata || null,
        model: null,
        character: null,
        upvotes: 0,
        downvotes: 0,
        tokens: null,
        edited: false,
        originalId: null,
        authorId: params.userId || null,
        authorName: null,
        authorAvatar: null,
        authorColor: null,
        isAI: false,
        errorType: null,
        errorMessage: null,
        errorCode: null,
        searchVector: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      contextMessages.push(currentMessage);

      params.logger.debug(
        "[BuildMessageContext] Added current message to context",
        {
          role: params.role,
          hasMetadata: !!params.userMessageMetadata,
          attachmentCount: params.userMessageMetadata?.attachments?.length ?? 0,
        },
      );
    }

    params.logger.debug("[BuildMessageContext] Built message context", {
      totalMessages: contextMessages.length,
      isIncognito: params.isIncognito,
    });

    // ============================================================================
    // STEP 2: Process attachments for non-vision models (BEFORE conversion)
    // ============================================================================
    let visionWarningMessage: string | null = null;

    if (params.upcomingResponseContext?.model) {
      const modelConfig = getModelById(
        params.upcomingResponseContext.model as ModelId,
      );

      if (!modelConfig.features.imageInput) {
        const result = this.stripAttachmentsFromMessages(
          contextMessages,
          modelConfig.name,
        );

        if (result.totalRemoved > 0) {
          visionWarningMessage = result.warningMessage;
          params.logger.info(
            "[BuildMessageContext] Removed attachments for non-vision model",
            {
              model: modelConfig.name,
              attachmentsRemoved: result.totalRemoved,
              formats: result.formats.join(", "),
            },
          );
        }
      }
    }

    // ============================================================================
    // STEP 3: Convert to AI SDK format
    // ============================================================================
    const messages =
      contextMessages.length > 0
        ? await MessageConverter.toAiSdkMessages(
            contextMessages,
            params.logger,
            params.rootFolderId,
          )
        : [];

    params.logger.debug("[BuildMessageContext] Converted to AI SDK format", {
      convertedMessages: messages.length,
    });

    // Add vision warning as system message if needed
    if (visionWarningMessage) {
      messages.push({
        role: "system",
        content: visionWarningMessage,
      });
    }

    // ============================================================================
    // STEP 4: Add tool confirmation results (already in AI SDK format)
    // ============================================================================
    // Tool messages are created in DB AFTER buildMessageContext is called (during streaming)
    // So we need to manually add them here from toolConfirmationResults
    if (params.hasToolConfirmations && params.toolConfirmationResults?.length) {
      params.logger.debug(
        "[BuildMessageContext] Adding tool confirmation results",
        {
          count: params.toolConfirmationResults.length,
        },
      );

      const { simpleT } = await import("@/i18n/core/shared");
      const { defaultLocale } = await import("@/i18n/core/config");

      for (const result of params.toolConfirmationResults) {
        const toolCall = result.toolCall;

        // Convert to AI SDK format - BOTH assistant tool-call AND tool result
        // Translate error messages for AI (using default locale for consistency)
        const output = toolCall.error
          ? {
              type: "error-text" as const,
              value:
                toolCall.error.message ===
                "app.api.agent.chat.aiStream.errors.userDeclinedTool"
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

      params.logger.debug(
        "[BuildMessageContext] Added tool confirmation results",
        {
          totalMessages: messages.length,
        },
      );
    }

    // ============================================================================
    // STEP 5: Handle answer-as-ai operation
    // ============================================================================
    // For answer-as-ai operation, add CONTINUE_CONVERSATION_PROMPT as a system message
    // User can optionally provide additional instructions via content
    if (params.operation === "answer-as-ai") {
      const { CONTINUE_CONVERSATION_PROMPT } =
        await import("../system-prompt/generator");
      const systemContent = params.content.trim()
        ? `${CONTINUE_CONVERSATION_PROMPT}\n\nAdditional instructions: ${params.content}`
        : CONTINUE_CONVERSATION_PROMPT;

      messages.push({ role: "system", content: systemContent });
      params.logger.debug(
        "[BuildMessageContext] Added CONTINUE_CONVERSATION_PROMPT",
        {
          hasAdditionalContent: !!params.content.trim(),
        },
      );
    }

    // ============================================================================
    // STEP 6: Add response context metadata (final system message)
    // ============================================================================
    // This tells the model what config will be used for its response
    if (params.upcomingResponseContext) {
      const parts: string[] = [];
      parts.push(`Model:${params.upcomingResponseContext.model}`);
      if (params.upcomingResponseContext.character) {
        parts.push(`Character:${params.upcomingResponseContext.character}`);
      }

      messages.push({
        role: "system",
        content: `[Your response context: ${parts.join(" | ")}]`,
      });

      params.logger.debug("[BuildMessageContext] Added response context", {
        model: params.upcomingResponseContext.model,
        character: params.upcomingResponseContext.character,
      });
    }

    // ============================================================================
    // FINAL: Return complete message context
    // ============================================================================
    params.logger.debug("[BuildMessageContext] Complete", {
      totalMessages: messages.length,
      isIncognito: params.isIncognito,
    });

    return messages;
  }
}
