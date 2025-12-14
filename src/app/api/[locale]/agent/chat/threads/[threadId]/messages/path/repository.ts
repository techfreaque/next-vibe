import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { chatMessages, chatThreads } from "../../../../db";
import { validateNotIncognito } from "../../../../validation";
import type {
  PathGetRequestOutput,
  PathGetResponseOutput,
  PathGetUrlVariablesOutput,
} from "./definition";

/**
 * Conversation Path Repository
 * Handles retrieving messages following a specific conversation path
 */
export const pathRepository = {
  /**
   * Get messages following a conversation path
   * Traverses the message tree from root to leaf following branch indices
   */
  async getPath(
    urlPathParams: PathGetUrlVariablesOutput,
    data: PathGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PathGetResponseOutput>> {
    try {
      // Type guard to ensure user has id
      if (!user.id) {
        return fail({
          message:
            "app.api.agent.chat.threads.threadId.messages.path.get.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      const userId = user.id;

      // Verify thread ownership
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(
          and(
            eq(chatThreads.id, urlPathParams.threadId),
            eq(chatThreads.userId, userId),
          ),
        )
        .limit(1);

      if (!thread) {
        return fail({
          message:
            "app.api.agent.chat.threads.threadId.messages.path.get.errors.threadNotFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Reject incognito threads
      const incognitoError = validateNotIncognito(
        thread.rootFolderId,
        locale,
        "app.api.agent.chat.threads.threadId.messages.path.get",
      );
      if (incognitoError) {
        return incognitoError;
      }

      // Get all messages in the thread
      const allMessages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.threadId, urlPathParams.threadId));

      // Find root message (message with no parent)
      const rootMessage = allMessages.find((msg) => !msg.parentId);

      if (!rootMessage) {
        return fail({
          message:
            "app.api.agent.chat.threads.threadId.messages.path.get.errors.noRootMessage.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Build a map of children for each message
      const childrenMap = new Map<string, string[]>();
      for (const msg of allMessages) {
        if (msg.parentId) {
          const siblings = childrenMap.get(msg.parentId) || [];
          siblings.push(msg.id);
          childrenMap.set(msg.parentId, siblings);
        }
      }

      // Build a map of messages by ID for quick lookup
      const messageMap = new Map(allMessages.map((msg) => [msg.id, msg]));

      // Traverse the tree following branch indices
      const path: typeof allMessages = [];
      const branchIndices = data.branchIndices || {};
      let currentId: string | null = rootMessage.id;

      while (currentId) {
        const currentMessage = messageMap.get(currentId);
        if (!currentMessage) {
          break;
        }

        path.push(currentMessage);

        const children = childrenMap.get(currentId);
        if (!children || children.length === 0) {
          break;
        }

        // Use branch index if provided, otherwise use first child (index 0)
        const branchIndex = branchIndices[currentId] ?? 0;
        const validIndex = Math.min(
          Math.max(0, branchIndex),
          children.length - 1,
        );

        currentId = children[validIndex];
      }

      logger.info("Conversation path retrieved successfully", {
        threadId: urlPathParams.threadId,
        pathLength: path.length,
      });

      return success({
        messages: path.map((msg) => ({
          id: msg.id,
          threadId: msg.threadId,
          role: msg.role,
          content: msg.content,
          parentId: msg.parentId,
          depth: msg.depth,
          authorId: msg.authorId,
          isAI: msg.isAI,
          model: msg.model,
          tokens: msg.tokens,
          createdAt: msg.createdAt.toISOString(),
          updatedAt: msg.updatedAt.toISOString(),
        })),
      });
    } catch (error) {
      logger.error("Failed to get conversation path", parseError(error));
      return fail({
        message:
          "app.api.agent.chat.threads.threadId.messages.path.get.errors.getFailed.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  },
};
