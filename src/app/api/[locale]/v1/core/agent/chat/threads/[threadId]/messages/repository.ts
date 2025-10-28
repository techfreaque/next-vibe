/**
 * Chat Messages Repository
 * Business logic for message management operations
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
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
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.notFound.title" as const,
          ErrorResponseTypes.NOT_FOUND,
        );
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
      if (!canReadThread(user, thread, folder)) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.forbidden.title" as const,
          ErrorResponseTypes.FORBIDDEN,
        );
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

      // Map messages to include toolCalls from metadata
      const mappedMessages = messages.map((msg) => ({
        ...msg,
        toolCalls: msg.metadata?.toolCalls || null,
      }));

      return createSuccessResponse({ messages: mappedMessages });
    } catch (error) {
      logger.error("Error listing messages", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.server.title" as const,
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Create a new message in a thread
   */
  async createMessage(
    data: MessageCreateRequestOutput & { threadId: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageCreateResponseOutput>> {
    try {
      // Public users cannot create messages
      if (user.isPublic) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.forbidden.title" as const,
          ErrorResponseTypes.FORBIDDEN,
        );
      }

      // Type guard to ensure user has id
      if (!user.id) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.unauthorized.title" as const,
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      const userId = user.id;

      logger.debug("Creating message", {
        threadId: data.threadId,
        userId,
        role: data.message?.role,
      });

      // Get thread (without user filter to check permissions)
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, data.threadId))
        .limit(1);

      if (!thread) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
        );
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
      if (!canWriteThread(user, thread, folder)) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.forbidden.title" as const,
          ErrorResponseTypes.FORBIDDEN,
        );
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
          return createErrorResponse(
            "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.validation.title",
            ErrorResponseTypes.VALIDATION_ERROR,
            {
              error:
                "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.validation.parentNotFound",
            },
          );
        }

        depth = parentMessage.depth + 1;
      }

      // Create message
      const [message] = await db
        .insert(chatMessages)
        .values({
          threadId: data.threadId,
          role: data.message?.role || ChatMessageRole.USER,
          content: data.message?.content || "",
          parentId: data.message?.parentId || null,
          depth,
          authorId: userId,
          isAI: data.message?.role === ChatMessageRole.ASSISTANT,
          model: data.message?.model || null,
        })
        .returning({
          id: chatMessages.id,
          createdAt: chatMessages.createdAt,
        });

      if (!message) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.server.title",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
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
        createdAt: message.createdAt,
      });
    } catch (error) {
      logger.error("Error creating message", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }
}

export const messagesRepository = new MessagesRepositoryImpl();
