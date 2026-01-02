/**
 * Message by ID Repository
 * Business logic for individual message operations
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { chatFolders, chatMessages, chatThreads } from "../../../../db";
import {
  canDeleteMessage,
  canReadMessage,
  canWriteMessage,
} from "../../../../permissions/permissions";
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
    urlPathParams: MessageGetUrlVariablesOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageGetResponseOutput>>;

  updateMessage(
    data: MessagePatchRequestOutput,
    urlPathParams: MessagePatchUrlVariablesOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessagePatchResponseOutput>>;

  deleteMessage(
    urlPathParams: MessageDeleteUrlVariablesOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageDeleteResponseOutput>>;
}

/**
 * Message Repository Implementation
 */
export class MessageRepository {
  /**
   * Get a specific message by ID
   */
  static async getMessage(
    urlPathParams: MessageGetUrlVariablesOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageGetResponseOutput>> {
    try {
      // Get thread
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, urlPathParams.threadId))
        .limit(1);

      if (!thread) {
        return fail({
          message:
            "app.api.agent.chat.threads.threadId.messages.messageId.get.errors.threadNotFound.title" as const,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Reject incognito threads
      const incognitoError = validateNotIncognito(
        thread.rootFolderId,
        locale,
        "app.api.agent.chat.threads.threadId.messages.messageId.get",
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
            eq(chatMessages.id, urlPathParams.messageId),
            eq(chatMessages.threadId, urlPathParams.threadId),
          ),
        )
        .limit(1);

      if (!message) {
        return fail({
          message:
            "app.api.agent.chat.threads.threadId.messages.messageId.get.errors.messageNotFound.title" as const,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Get parent folder for permission check
      let folder = null;
      if (thread.folderId) {
        [folder] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, thread.folderId))
          .limit(1);
      }

      // Check if user can read this message
      if (!(await canReadMessage(user, thread, folder, logger))) {
        return fail({
          message:
            "app.api.agent.chat.threads.threadId.messages.messageId.get.errors.forbidden.title" as const,
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      return success({
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
          createdAt: message.createdAt.toISOString(),
          updatedAt: message.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      logger.error("Error getting message:", parseError(error));
      return fail({
        message:
          "app.api.agent.chat.threads.threadId.messages.messageId.get.errors.server.description" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update a message's content
   */
  static async updateMessage(
    data: MessagePatchRequestOutput,
    urlPathParams: MessagePatchUrlVariablesOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessagePatchResponseOutput>> {
    try {
      // Get thread
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, urlPathParams.threadId))
        .limit(1);

      if (!thread) {
        return fail({
          message:
            "app.api.agent.chat.threads.threadId.messages.messageId.patch.errors.threadNotFound.title" as const,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Reject incognito threads
      const incognitoError = validateNotIncognito(
        thread.rootFolderId,
        locale,
        "app.api.agent.chat.threads.threadId.messages.messageId.patch",
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
            eq(chatMessages.id, urlPathParams.messageId),
            eq(chatMessages.threadId, urlPathParams.threadId),
          ),
        )
        .limit(1);

      if (!existingMessage) {
        return fail({
          message:
            "app.api.agent.chat.threads.threadId.messages.messageId.patch.errors.messageNotFound.title" as const,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Get folder if thread has one
      let folder = null;
      if (thread.folderId) {
        const [folderResult] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, thread.folderId))
          .limit(1);
        folder = folderResult || null;
      }

      // Check if user can edit this message
      // User must be the author or have write permission on the thread
      const userId = user.isPublic ? user.leadId : user.id;
      const isAuthor = existingMessage.authorId === userId;
      const hasWritePermission = await canWriteMessage(user, thread, folder, logger);

      if (!isAuthor && !hasWritePermission) {
        return fail({
          message:
            "app.api.agent.chat.threads.threadId.messages.messageId.patch.errors.forbidden.title" as const,
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
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
        .where(eq(chatMessages.id, urlPathParams.messageId))
        .returning();

      return success({
        message: {
          id: updatedMessage.id,
          content: updatedMessage.content,
          role: updatedMessage.role,
          updatedAt: updatedMessage.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      logger.error("Error updating message:", parseError(error));
      return fail({
        message:
          "app.api.agent.chat.threads.threadId.messages.messageId.patch.errors.server.description" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Delete a message
   */
  static async deleteMessage(
    urlPathParams: MessageDeleteUrlVariablesOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageDeleteResponseOutput>> {
    try {
      // Get thread
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, urlPathParams.threadId))
        .limit(1);

      if (!thread) {
        return fail({
          message:
            "app.api.agent.chat.threads.threadId.messages.messageId.delete.errors.threadNotFound.title" as const,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Reject incognito threads
      const incognitoError = validateNotIncognito(
        thread.rootFolderId,
        locale,
        "app.api.agent.chat.threads.threadId.messages.messageId.delete",
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
            eq(chatMessages.id, urlPathParams.messageId),
            eq(chatMessages.threadId, urlPathParams.threadId),
          ),
        )
        .limit(1);

      if (!existingMessage) {
        return fail({
          message:
            "app.api.agent.chat.threads.threadId.messages.messageId.delete.errors.messageNotFound.title" as const,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Get parent folder for permission check
      let folder = null;
      if (thread.folderId) {
        [folder] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, thread.folderId))
          .limit(1);
      }

      // Check if user can delete this message
      if (!(await canDeleteMessage(user, existingMessage, thread, folder, logger))) {
        return fail({
          message:
            "app.api.agent.chat.threads.threadId.messages.messageId.delete.errors.forbidden.title" as const,
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Delete message
      await db.delete(chatMessages).where(eq(chatMessages.id, urlPathParams.messageId));

      return success({
        success: true,
      });
    } catch (error) {
      logger.error("Error deleting message:", parseError(error));
      return fail({
        message:
          "app.api.agent.chat.threads.threadId.messages.messageId.delete.errors.server.description" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
