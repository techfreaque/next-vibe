/**
 * Chat Messages Repository
 * Business logic for message management operations
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createSuccessResponse,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { chatFolders, chatMessages, chatThreads } from "../../../db";
import { ChatMessageRole } from "../../../enum";
import {
  canReadThread,
  canWriteThread,
} from "../../../permissions/permissions";
import { validateNotIncognito } from "../../../validation";
import type {
  MessageCreateRequestOutput,
  MessageCreateResponseOutput,
  MessageListResponseOutput,
} from "./definition";

/**
 * Messages Repository Interface
 */
export interface MessagesRepositoryInterface {
  listMessages(
    data: { threadId: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageListResponseOutput>>;

  createMessage(
    data: MessageCreateRequestOutput & { threadId: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageCreateResponseOutput>>;
}

/**
 * Messages Repository Implementation
 */
export class MessagesRepositoryImpl implements MessagesRepositoryInterface {
  /**
   * List all messages in a thread
   */
  async listMessages(
    data: { threadId: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageListResponseOutput>> {
    try {
      logger.debug("Listing messages", {
        threadId: data.threadId,
        userId: user.id,
        isPublic: user.isPublic,
      });

      // Get thread (without user filter to allow public access)
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, data.threadId))
        .limit(1);

      if (!thread) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.notFound.title" as const,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Reject incognito threads - they should never be accessed on server
      const incognitoError = validateNotIncognito(
        thread.rootFolderId,
        locale,
        "app.api.v1.core.agent.chat.threads.threadId.messages.get",
      );
      if (incognitoError) {
        return incognitoError;
      }

      // Get folder for permission check
      let folder = null;
      if (thread.folderId) {
        [folder] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, thread.folderId))
          .limit(1);
      }

      // Check read permission using permission system
      if (!(await canReadThread(user, thread, folder, logger))) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.forbidden.title" as const,
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Get all messages in thread
      const messages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.threadId, data.threadId))
        .orderBy(chatMessages.createdAt);

      logger.debug("Messages retrieved", {
        threadId: data.threadId,
        count: messages.length,
      });

      // Map messages to include toolCalls from metadata and sequencing fields
      const mappedMessages = messages.map((msg) => {
        // NEW ARCHITECTURE: For TOOL messages, construct toolCalls array from metadata
        let toolCalls = null;
        if (msg.role === "tool" && msg.metadata) {
          // Check if metadata has toolCall object (new format)
          if (msg.metadata.toolCall) {
            const tc = msg.metadata.toolCall as {
              toolName: string;
              displayName: string;
              icon?: string;
              args: unknown;
              result?: unknown;
              error?: string;
              executionTime?: number;
              widgetMetadata?: unknown;
              creditsUsed?: number;
            };
            toolCalls = [
              {
                toolName: tc.toolName || "",
                displayName: tc.displayName || "",
                icon: tc.icon,
                args: tc.args,
                result: tc.result,
                error: tc.error,
                executionTime: tc.executionTime,
                widgetMetadata: tc.widgetMetadata,
                creditsUsed: tc.creditsUsed,
              },
            ];
          } else {
            // Fallback: try to read from metadata directly (old format)
            toolCalls = [
              {
                toolName: msg.metadata.toolName || "",
                displayName: msg.metadata.displayName || "",
                icon: msg.metadata.icon,
                args: msg.metadata.args,
                result: msg.metadata.result,
                error: msg.metadata.error,
                executionTime: msg.metadata.executionTime,
                widgetMetadata: msg.metadata.widgetMetadata,
                creditsUsed: msg.metadata.creditsUsed,
              },
            ];
          }
        } else if (msg.metadata?.toolCalls) {
          // Legacy: toolCalls array in metadata (will be removed)
          toolCalls = msg.metadata.toolCalls;
        }

        return {
          ...msg,
          sequenceId: msg.sequenceId ?? null,
          sequenceIndex: msg.sequenceIndex ?? 0,
          toolCalls,
          createdAt: msg.createdAt.toISOString(),
          updatedAt: msg.updatedAt.toISOString(),
        };
      });

      return createSuccessResponse({ messages: mappedMessages });
    } catch (error) {
      logger.error("Error listing messages", parseError(error));
      return fail({
        message:
          "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.server.title" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Create a new message in a thread
   * PUBLIC users can respond in PUBLIC threads, but authenticated users are needed for other threads
   */
  async createMessage(
    data: MessageCreateRequestOutput & { threadId: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageCreateResponseOutput>> {
    try {
      // Extract user identifier - use leadId for PUBLIC users, userId for authenticated
      const userIdentifier = user.isPublic ? user.leadId : user.id;

      // SECURITY: Force role to USER for all user-created messages
      // Only the AI stream system can create ASSISTANT/SYSTEM/TOOL/ERROR messages
      if (data.message?.role && data.message.role !== ChatMessageRole.USER) {
        logger.warn("Attempted to create message with non-USER role", {
          attemptedRole: data.message.role,
          userId: userIdentifier,
          isPublic: user.isPublic,
        });

        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.forbidden.title" as const,
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // SECURITY: Force role to USER regardless of input
      const safeRole = ChatMessageRole.USER;

      // SECURITY: PUBLIC users cannot set model
      if (user.isPublic && data.message?.model) {
        logger.warn("PUBLIC user attempted to set model", {
          model: data.message.model,
          leadId: user.leadId,
        });

        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.forbidden.title" as const,
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      logger.debug("Creating message", {
        threadId: data.threadId,
        userIdentifier,
        isPublic: user.isPublic,
        role: safeRole, // Always USER
      });

      // Get thread (without user filter to check permissions)
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, data.threadId))
        .limit(1);

      if (!thread) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Reject incognito threads - they should never be accessed on server
      const incognitoError = validateNotIncognito(
        thread.rootFolderId,
        locale,
        "app.api.v1.core.agent.chat.threads.threadId.messages.post",
      );
      if (incognitoError) {
        return incognitoError;
      }

      // Get folder for permission check
      let folder = null;
      if (thread.folderId) {
        [folder] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, thread.folderId))
          .limit(1);
      }

      // Check write permission using permission system
      if (!(await canWriteThread(user, thread, folder, logger))) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.forbidden.title" as const,
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Calculate depth if parent exists
      let depth = 0;
      if (data.message?.parentId) {
        const [parentMessage] = await db
          .select()
          .from(chatMessages)
          .where(
            and(
              eq(chatMessages.id, data.message.parentId),
              eq(chatMessages.threadId, data.threadId),
            ),
          )
          .limit(1);

        if (!parentMessage) {
          return fail({
            message:
              "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.validation.title",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
            messageParams: {
              error:
                "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.validation.parentNotFound",
            },
          });
        }

        depth = parentMessage.depth + 1;
      }

      // Create message with safe values
      const [message] = await db
        .insert(chatMessages)
        .values({
          threadId: data.threadId,
          role: safeRole, // Always USER
          content: data.message?.content || "",
          parentId: data.message?.parentId || null,
          depth,
          authorId: userIdentifier,
          isAI: false, // Always false for user messages
          model: user.isPublic ? null : data.message?.model || null, // No model for PUBLIC users
        })
        .returning({
          id: chatMessages.id,
          createdAt: chatMessages.createdAt,
        });

      if (!message) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Update thread's updatedAt timestamp
      await db
        .update(chatThreads)
        .set({ updatedAt: new Date() })
        .where(eq(chatThreads.id, data.threadId));

      logger.debug("Message created", {
        messageId: message.id,
        threadId: data.threadId,
      });

      return createSuccessResponse({
        id: message.id,
        createdAt: message.createdAt.toISOString(),
      });
    } catch (error) {
      logger.error("Error creating message", parseError(error));
      return fail({
        message:
          "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}

export const messagesRepository = new MessagesRepositoryImpl();
