/**
 * MessageContextBuilder - Builds message context for AI streaming
 */

import "server-only";

import type { ModelMessage } from "ai";
import { eq } from "drizzle-orm";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { db } from "../../../../system/db";
import type { DefaultFolderId } from "../../../chat/config";
import type { ChatMessage } from "../../../chat/db";
import { chatMessages } from "../../../chat/db";
import type { ChatMessageRole } from "../../../chat/enum";
import { fetchMessageHistory } from "../../../chat/threads/[threadId]/messages/repository";
import { MessageConverter } from "./message-converter";

export class MessageContextBuilder {
  /**
   * Build message context for AI
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
    if (!params.isIncognito && params.messageHistory && params.messageHistory.length > 0) {
      params.logger.error("Security violation: messageHistory provided for non-incognito thread", {
        operation: params.operation,
        threadId: params.threadId,
        isIncognito: params.isIncognito,
        messageHistoryLength: params.messageHistory.length,
      });
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
      params.logger.debug("[BuildMessageContext] Using passed message history (incognito)", {
        operation: params.operation,
        historyLength: history.length,
      });
    } else if (!params.isIncognito && params.threadId) {
      // Server: fetch message history from database
      if (params.operation === "answer-as-ai" && params.parentMessageId) {
        // For answer-as-ai: get all messages up to parent (not just branch)
        const allMessages = await db
          .select()
          .from(chatMessages)
          .where(eq(chatMessages.threadId, params.threadId))
          .orderBy(chatMessages.createdAt);

        const parentIndex = allMessages.findIndex((msg) => msg.id === params.parentMessageId);

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
              const base64Data = await storage.readFileAsBase64(attachment.id, params.threadId);
              if (base64Data) {
                attachment.data = base64Data;
                params.logger.debug("[BuildMessageContext] Fetched file data for attachment", {
                  attachmentId: attachment.id,
                  filename: attachment.filename,
                });
              }
            }
          }
        }
      }

      params.logger.debug("[BuildMessageContext] Fetched message history from DB (server)", {
        operation: params.operation,
        historyLength: history.length,
      });
    } else {
      params.logger.debug("[BuildMessageContext] No history (new conversation)", {
        operation: params.operation,
        hasThreadId: !!params.threadId,
      });
    }

    // Convert history to AI SDK format (same logic for both modes)
    if (history.length === 0) {
      return [];
    }

    const historyMessages = await MessageConverter.toAiSdkMessages(
      history,
      params.logger,
      params.rootFolderId,
      params.upcomingResponseContext,
    );

    params.logger.debug("[BuildMessageContext] Returning converted history", {
      historyLength: historyMessages.length,
      isIncognito: params.isIncognito,
    });

    return historyMessages;
  }
}
