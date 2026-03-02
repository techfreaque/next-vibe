/**
 * Messages Client Repository
 * Client-side operations for messages using localStorage (incognito mode)
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

import { parseError } from "../../../../../shared/utils";
import {
  createIncognitoMessage,
  getMessagesForThread,
} from "../../../incognito/storage";
import type {
  MessageCreateRequestOutput,
  MessageCreateResponseOutput,
  MessageListResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

/**
 * Chat Messages Client Repository
 * Mirrors MessagesRepository but uses localStorage for incognito mode
 */
export class ChatMessagesRepositoryClient {
  /**
   * List messages for a thread (mirrors server listMessages)
   */
  static async listMessages(
    threadId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<MessageListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const messages = await getMessagesForThread(threadId);

      logger.debug("Client: incognito messages", {
        threadId,
        count: messages.length,
      });

      return success({
        messages: messages.map((msg) => ({
          id: msg.id,
          threadId: msg.threadId,
          role: msg.role,
          content: msg.content,
          parentId: msg.parentId,
          depth: msg.depth,
          sequenceId: msg.sequenceId,
          authorId: msg.authorId,
          authorName: msg.authorName,
          isAI: msg.isAI,
          model: msg.model,
          character: msg.character,
          errorType: msg.errorType,
          errorMessage: msg.errorMessage,
          errorCode: msg.errorCode,
          metadata: msg.metadata,
          upvotes: msg.upvotes,
          downvotes: msg.downvotes,
          searchVector: msg.searchVector,
          createdAt: new Date(msg.createdAt),
          updatedAt: new Date(msg.updatedAt),
        })),
      });
    } catch (error) {
      logger.error("Failed to load incognito messages", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Create a message (mirrors server createMessage)
   */
  static async createMessage(
    threadId: string,
    data: MessageCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<MessageCreateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const messageId = data.id ?? crypto.randomUUID();
      const message = await createIncognitoMessage(
        threadId,
        data.role ?? "user",
        data.content,
        data.parentId ?? null,
        data.model ?? null,
        data.character ?? null,
        data.metadata ?? {},
        messageId,
      );

      logger.debug("Client: created incognito message", {
        threadId,
        messageId: message.id,
      });

      return success({
        messageId: message.id,
        createdAt: new Date(message.createdAt),
      });
    } catch (error) {
      logger.error("Failed to create incognito message", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
