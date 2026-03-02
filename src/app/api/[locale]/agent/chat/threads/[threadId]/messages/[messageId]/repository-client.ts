/**
 * Message by ID Client Repository
 * Client-side operations for individual messages using localStorage (incognito mode)
 * Mirrors server repository structure but runs in browser
 */

"use client";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { parseError } from "../../../../../../shared/utils";
import {
  deleteMessage,
  getMessagesForThread,
  updateIncognitoMessage,
} from "../../../../incognito/storage";
import type {
  MessageDeleteResponseOutput,
  MessageGetResponseOutput,
  MessagePatchResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

/**
 * Chat Message By ID Client Repository
 * Mirrors individual message operations from server, uses localStorage for incognito mode
 */
export class ChatMessageByIdRepositoryClient {
  /**
   * Get a single message by ID
   */
  static async getMessage(
    threadId: string,
    messageId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<MessageGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const messages = await getMessagesForThread(threadId);
      const message = messages.find((m) => m.id === messageId);

      if (!message) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({
        role: message.role,
        content: message.content,
        parentId: message.parentId,
        depth: message.depth,
        authorId: message.authorId,
        isAI: message.isAI,
        model: message.model,
        createdAt: new Date(message.createdAt),
        updatedAt: new Date(message.updatedAt),
      });
    } catch (error) {
      logger.error("Failed to get incognito message", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update a message
   */
  static async updateMessage(
    threadId: string,
    messageId: string,
    data: { content?: string; role?: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<MessagePatchResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const messages = await getMessagesForThread(threadId);
      const existing = messages.find((m) => m.id === messageId);

      if (!existing) {
        return fail({
          message: t("patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const updates: Parameters<typeof updateIncognitoMessage>[1] = {};
      if (data.content !== undefined) {
        updates.content = data.content;
      }
      if (data.role !== undefined) {
        updates.role = data.role as Parameters<
          typeof updateIncognitoMessage
        >[1]["role"];
      }

      await updateIncognitoMessage(messageId, updates);

      logger.debug("Client: updated incognito message", { messageId });

      return success({
        updatedContent: data.content ?? existing.content,
        updatedRole: (data.role ??
          existing.role) as MessagePatchResponseOutput["updatedRole"],
        updatedAt: new Date(),
      });
    } catch (error) {
      logger.error("Failed to update incognito message", parseError(error));
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Delete a message
   */
  static async deleteMessage(
    threadId: string,
    messageId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<MessageDeleteResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const messages = await getMessagesForThread(threadId);
      const message = messages.find((m) => m.id === messageId);

      if (!message) {
        return fail({
          message: t("delete.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      await deleteMessage(messageId);
      logger.debug("Client: deleted incognito message", { messageId });

      return success({
        role: message.role as MessageDeleteResponseOutput["role"],
        content: message.content,
        parentId: message.parentId,
        authorId: message.authorId,
        isAI: message.isAI,
        model: message.model,
        createdAt: new Date(message.createdAt),
      });
    } catch (error) {
      logger.error("Failed to delete incognito message", parseError(error));
      return fail({
        message: t("delete.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
