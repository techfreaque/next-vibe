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
    // SECURITY: Reject messageHistory for non-incognito threads
    // Non-incognito threads must fetch history from database to prevent manipulation
    if (!params.isIncognito && params.messageHistory) {
      params.logger.error("Security violation: messageHistory provided for non-incognito thread", {
        operation: params.operation,
        threadId: params.threadId,
        isIncognito: params.isIncognito,
      });
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Security violation should throw immediately
      throw new Error(
        "messageHistory is only allowed for incognito mode. Server-side threads fetch history from database.",
      );
    }

    if (params.operation === "answer-as-ai") {
      if (params.isIncognito && params.messageHistory) {
        return await MessageConverter.toAiSdkMessages(
          params.messageHistory,
          params.rootFolderId,
          params.upcomingResponseContext,
        );
      }

      if (!params.isIncognito && params.userId && params.threadId && params.parentMessageId) {
        const allMessages = await db
          .select()
          .from(chatMessages)
          .where(eq(chatMessages.threadId, params.threadId))
          .orderBy(chatMessages.createdAt);

        const parentIndex = allMessages.findIndex((msg) => msg.id === params.parentMessageId);

        if (parentIndex !== -1) {
          const contextMessages = allMessages.slice(0, parentIndex + 1);
          return await MessageConverter.toAiSdkMessages(
            contextMessages,
            params.rootFolderId,
            params.upcomingResponseContext,
          );
        }
        params.logger.error("Parent message not found in thread", {
          parentMessageId: params.parentMessageId,
          threadId: params.threadId,
        });
        return [];
      }
      return [];
    } else if (!params.isIncognito && params.userId && params.threadId) {
      // Non-incognito mode: fetch history from database filtered by branch
      const history = await fetchMessageHistory(
        params.threadId,
        params.logger,
        params.parentMessageId ?? null, // Pass parent message ID for branch filtering, convert undefined to null
      );

      // Fetch file data for attachments in history
      const { getStorageAdapter } = await import("../../../chat/storage");
      const storage = getStorageAdapter();

      for (const message of history) {
        if (message.metadata?.attachments) {
          for (const attachment of message.metadata.attachments) {
            // If attachment has URL but no base64 data, fetch from storage
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

      // Return ONLY past messages - new message comes from content/attachments params
      const historyMessages = await MessageConverter.toAiSdkMessages(
        history,
        params.rootFolderId,
        params.upcomingResponseContext,
      );
      params.logger.debug("[BuildMessageContext] Returning history for server mode", {
        historyLength: historyMessages.length,
      });
      return historyMessages;
    } else if (params.isIncognito && params.messageHistory) {
      // Incognito mode: Return ONLY past messages - new message comes from content/attachments params
      params.logger.debug("Using provided message history for incognito mode", {
        operation: params.operation,
        historyLength: params.messageHistory.length,
      });
      const historyMessages = await MessageConverter.toAiSdkMessages(
        params.messageHistory,
        params.rootFolderId,
        params.upcomingResponseContext,
      );
      params.logger.debug("[BuildMessageContext] Returning history for incognito mode", {
        historyLength: historyMessages.length,
      });
      return historyMessages;
    }

    params.logger.debug("[BuildMessageContext] No history (new conversation)", {
      operation: params.operation,
      hasThreadId: !!params.threadId,
    });
    return [];
  }
}
