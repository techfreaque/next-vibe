import "server-only";

import { and, eq } from "drizzle-orm";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import { chatMessages, chatThreads } from "../../../../../db";
import { validateNotIncognito } from "../../../../../validation";
import type {
  BranchPostRequestOutput,
  BranchPostResponseOutput,
  BranchPostUrlVariablesOutput,
} from "./definition";

/**
 * Branch Message Repository
 * Handles creating new branches from existing messages
 */
export const branchRepository = {
  /**
   * Create a new branch from an existing message
   * Creates a new message with the same parent as the source message
   */
  async createBranch(
    urlVariables: BranchPostUrlVariablesOutput,
    data: BranchPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<BranchPostResponseOutput>> {
    try {
      // Type guard to ensure user has id
      if (!user.id) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.branch.post.errors.unauthorized.title",
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
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.branch.post.errors.threadNotFound.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Reject incognito threads
      const incognitoError = validateNotIncognito(
        thread.rootFolderId,
        locale,
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.branch.post",
      );
      if (incognitoError) {
        return incognitoError;
      }

      // Get the source message to branch from
      const [sourceMessage] = await db
        .select()
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.id, urlVariables.messageId),
            eq(chatMessages.threadId, urlVariables.threadId),
          ),
        )
        .limit(1);

      if (!sourceMessage) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.branch.post.errors.messageNotFound.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Cannot branch from root message (no parent)
      if (!sourceMessage.parentId) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.branch.post.errors.cannotBranchFromRoot.title",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      // Create new message with same parent as source message
      // This creates a sibling branch
      const [newMessage] = await db
        .insert(chatMessages)
        .values({
          threadId: urlVariables.threadId,
          content: data.content,
          role: data.role,
          parentId: sourceMessage.parentId, // Same parent as source
          depth: sourceMessage.depth, // Same depth as source
          authorId: userId,
          isAI: false,
          model: data.model || null,
        })
        .returning();

      // Update thread's updatedAt timestamp
      await db
        .update(chatThreads)
        .set({ updatedAt: new Date() })
        .where(eq(chatThreads.id, urlVariables.threadId));

      logger.info("Branch created successfully", {
        messageId: newMessage.id,
        sourceMessageId: urlVariables.messageId,
        threadId: urlVariables.threadId,
      });

      return createSuccessResponse({
        message: {
          id: newMessage.id,
          threadId: newMessage.threadId,
          role: newMessage.role,
          content: newMessage.content,
          parentId: newMessage.parentId,
          depth: newMessage.depth,
          authorId: newMessage.authorId,
          isAI: newMessage.isAI,
          model: newMessage.model,
          tokens: newMessage.tokens,
          createdAt: newMessage.createdAt,
          updatedAt: newMessage.updatedAt,
        },
      });
    } catch (error) {
      logger.error("Failed to create branch", { error });
      return createErrorResponse(
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.branch.post.errors.createFailed.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  },
};
