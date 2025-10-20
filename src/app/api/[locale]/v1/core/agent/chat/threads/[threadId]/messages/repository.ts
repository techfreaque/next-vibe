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
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { chatMessages, chatThreads } from "../../../db";
import { ChatMessageRole } from "../../../enum";
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
      // Type guard to ensure user has id
      if (!user.id) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.unauthorized.title" as const,
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      const userId = user.id;

      logger.debug("Listing messages", {
        threadId: data.threadId,
        userId,
      });

      // Verify thread exists and belongs to user
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(
          and(
            eq(chatThreads.id, data.threadId),
            eq(chatThreads.userId, userId),
          ),
        )
        .limit(1);

      if (!thread) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.notFound.title" as const,
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Reject incognito threads - they should never be accessed on server
      if (thread.rootFolderId === "incognito") {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.forbidden.title" as const,
          ErrorResponseTypes.FORBIDDEN,
          {
            message: simpleT(locale).t(
              "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.forbidden.incognitoNotAllowed",
            ),
          },
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

      return createSuccessResponse({ messages });
    } catch (error) {
      logger.error("Error listing messages", error);
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

      // Verify thread exists and belongs to user
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(
          and(
            eq(chatThreads.id, data.threadId),
            eq(chatThreads.userId, userId),
          ),
        )
        .limit(1);

      if (!thread) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Reject incognito threads - they should never be accessed on server
      if (thread.rootFolderId === "incognito") {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.forbidden.title" as const,
          ErrorResponseTypes.FORBIDDEN,
          {
            message: simpleT(locale).t(
              "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.forbidden.incognitoNotAllowed",
            ),
          },
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
      logger.error("Error creating message", error);
      return createErrorResponse(
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }
}

export const messagesRepository = new MessagesRepositoryImpl();
