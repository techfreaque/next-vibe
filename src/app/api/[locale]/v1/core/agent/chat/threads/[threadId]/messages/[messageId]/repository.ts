/**
 * Message by ID Repository
 * Business logic for individual message operations
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import { chatMessages, chatThreads } from "../../../../db";
import { validateNotIncognito } from "../../../../validation";
import type {
  MessageDeleteResponseOutput,
  MessageDeleteUrlVariablesOutput,
  MessageGetResponseOutput,
  MessageGetUrlVariablesOutput,
  MessagePatchRequestOutput,
  MessagePatchResponseOutput,
  MessagePatchUrlVariablesOutput,
} from "./definition";

/**
 * Repository interface
 */
export interface MessageRepositoryInterface {
  getMessage(
    urlVariables: MessageGetUrlVariablesOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageGetResponseOutput>>;

  updateMessage(
    data: MessagePatchRequestOutput,
    urlVariables: MessagePatchUrlVariablesOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessagePatchResponseOutput>>;

  deleteMessage(
    urlVariables: MessageDeleteUrlVariablesOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageDeleteResponseOutput>>;
}

/**
 * Message Repository Implementation
 */
class MessageRepository implements MessageRepositoryInterface {
  /**
   * Get a specific message by ID
   */
  async getMessage(
    urlVariables: MessageGetUrlVariablesOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageGetResponseOutput>> {
    try {
      // Type guard to ensure user has id
      if (!user.id) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      const userId = user.id;

      // Verify thread ownership
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(
          and(
            eq(chatThreads.id, urlVariables.threadId),
            eq(chatThreads.userId, userId),
          ),
        )
        .limit(1);

      if (!thread) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.threadNotFound.title" as const,
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Reject incognito threads
      const incognitoError = validateNotIncognito(
        thread.rootFolderId,
        locale,
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get",
      );
      if (incognitoError) {
        return incognitoError;
      }

      // Get message
      const [message] = await db
        .select()
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.id, urlVariables.messageId),
            eq(chatMessages.threadId, urlVariables.threadId),
          ),
        )
        .limit(1);

      if (!message) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.messageNotFound.title" as const,
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse({
        message: {
          id: message.id,
          threadId: message.threadId,
          role: message.role,
          content: message.content,
          parentId: message.parentId,
          depth: message.depth,
          authorId: message.authorId,
          isAI: message.isAI,
          model: message.model,
          tokens: message.tokens,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
        },
      });
    } catch (error) {
      logger.error("Error getting message:", error);
      return createErrorResponse(
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.server.description" as const,
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Update a message's content
   */
  async updateMessage(
    data: MessagePatchRequestOutput,
    urlVariables: MessagePatchUrlVariablesOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessagePatchResponseOutput>> {
    try {
      // Type guard to ensure user has id
      if (!user.id) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      const userId = user.id;

      // Verify thread ownership
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(
          and(
            eq(chatThreads.id, urlVariables.threadId),
            eq(chatThreads.userId, userId),
          ),
        )
        .limit(1);

      if (!thread) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.threadNotFound.title" as const,
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Reject incognito threads
      const incognitoError = validateNotIncognito(
        thread.rootFolderId,
        locale,
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch",
      );
      if (incognitoError) {
        return incognitoError;
      }

      // Verify message exists and belongs to thread
      const [existingMessage] = await db
        .select()
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.id, urlVariables.messageId),
            eq(chatMessages.threadId, urlVariables.threadId),
          ),
        )
        .limit(1);

      if (!existingMessage) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.messageNotFound.title" as const,
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Update message
      const updateData = data.role
        ? {
            content: data.content,
            role: data.role,
            updatedAt: new Date(),
          }
        : {
            content: data.content,
            updatedAt: new Date(),
          };

      const [updatedMessage] = await db
        .update(chatMessages)
        .set(updateData)
        .where(eq(chatMessages.id, urlVariables.messageId))
        .returning();

      return createSuccessResponse({
        message: {
          id: updatedMessage.id,
          content: updatedMessage.content,
          role: updatedMessage.role,
          updatedAt: updatedMessage.updatedAt,
        },
      });
    } catch (error) {
      logger.error("Error updating message:", error);
      return createErrorResponse(
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.server.description" as const,
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Delete a message
   */
  async deleteMessage(
    urlVariables: MessageDeleteUrlVariablesOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageDeleteResponseOutput>> {
    try {
      // Type guard to ensure user has id
      if (!user.id) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      const userId = user.id;

      // Verify thread ownership
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(
          and(
            eq(chatThreads.id, urlVariables.threadId),
            eq(chatThreads.userId, userId),
          ),
        )
        .limit(1);

      if (!thread) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.threadNotFound.title" as const,
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Reject incognito threads
      const incognitoError = validateNotIncognito(
        thread.rootFolderId,
        locale,
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete",
      );
      if (incognitoError) {
        return incognitoError;
      }

      // Verify message exists
      const [existingMessage] = await db
        .select()
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.id, urlVariables.messageId),
            eq(chatMessages.threadId, urlVariables.threadId),
          ),
        )
        .limit(1);

      if (!existingMessage) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.messageNotFound.title" as const,
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Delete message
      await db
        .delete(chatMessages)
        .where(eq(chatMessages.id, urlVariables.messageId));

      return createSuccessResponse({
        success: true,
      });
    } catch (error) {
      logger.error("Error deleting message:", error);
      return createErrorResponse(
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.server.description" as const,
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

export const messageRepository = new MessageRepository();
