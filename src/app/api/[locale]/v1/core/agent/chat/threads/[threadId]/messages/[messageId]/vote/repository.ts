import "server-only";

import { and, eq } from "drizzle-orm";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { chatMessages, chatThreads } from "../../../../../db";
import { canVoteMessage } from "../../../../../permissions/utils";
import { validateNotIncognito } from "../../../../../validation";
import type {
  VotePostRequestOutput,
  VotePostResponseOutput,
  VotePostUrlVariablesOutput,
} from "./definition";

/**
 * Vote Message Repository
 * Handles voting on messages with permission checks
 */
export const voteRepository = {
  /**
   * Vote on a message (upvote, downvote, or remove vote)
   */
  async voteMessage(
    urlPathParams: VotePostUrlVariablesOutput,
    data: VotePostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<VotePostResponseOutput>> {
    try {
      // Type guard to ensure user has id
      if (!user.id) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.vote.post.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      const userId = user.id;

      // Get the message with thread info
      const [messageWithThread] = await db
        .select({
          message: chatMessages,
          thread: chatThreads,
        })
        .from(chatMessages)
        .innerJoin(chatThreads, eq(chatMessages.threadId, chatThreads.id))
        .where(
          and(
            eq(chatMessages.id, urlPathParams.messageId),
            eq(chatMessages.threadId, urlPathParams.threadId),
          ),
        )
        .limit(1);

      if (!messageWithThread) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.vote.post.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      const { message, thread } = messageWithThread;

      // Reject incognito threads
      const incognitoError = validateNotIncognito(
        thread.rootFolderId,
        locale,
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.vote.post",
      );
      if (incognitoError) {
        return incognitoError;
      }

      // Check voting permissions - simplified
      if (!canVoteMessage(userId, null, message)) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.vote.post.errors.forbidden.title",
          ErrorResponseTypes.FORBIDDEN,
        );
      }

      // Get current metadata
      const currentMetadata = message.metadata || {};
      const voterIds: string[] = Array.isArray(currentMetadata.voterIds)
        ? currentMetadata.voterIds
        : [];
      const voteDetails: Array<{
        userId: string;
        vote: "up" | "down";
        timestamp: number;
      }> = Array.isArray(currentMetadata.voteDetails)
        ? (currentMetadata.voteDetails as Array<{
            userId: string;
            vote: "up" | "down";
            timestamp: number;
          }>)
        : [];

      // Find existing vote by this user
      const existingVoteIndex = voteDetails.findIndex(
        (v) => v.userId === userId,
      );
      const existingVote =
        existingVoteIndex >= 0 ? voteDetails[existingVoteIndex] : null;

      // Calculate new vote counts
      let upvotes = message.upvotes;
      let downvotes = message.downvotes;

      // Remove existing vote if any
      if (existingVote) {
        if (existingVote.vote === "up") {
          upvotes = Math.max(0, upvotes - 1);
        } else if (existingVote.vote === "down") {
          downvotes = Math.max(0, downvotes - 1);
        }
      }

      // Apply new vote
      let newVoteType: "up" | "down" | "none" = "none";
      const newVoteDetails = voteDetails.filter((v) => v.userId !== userId);
      const newVoterIds = voterIds.filter((id) => id !== userId);

      if (data.vote === "up") {
        upvotes += 1;
        newVoteType = "up";
        newVoteDetails.push({
          userId,
          vote: "up",
          timestamp: Date.now(),
        });
        newVoterIds.push(userId);
      } else if (data.vote === "down") {
        downvotes += 1;
        newVoteType = "down";
        newVoteDetails.push({
          userId,
          vote: "down",
          timestamp: Date.now(),
        });
        newVoterIds.push(userId);
      }
      // If vote === "remove", we already removed it above

      // Update message with new vote counts and metadata
      const newMetadata = {
        ...currentMetadata,
        voterIds: newVoterIds,
        voteDetails: newVoteDetails,
      };

      await db
        .update(chatMessages)
        .set({
          upvotes,
          downvotes,
          metadata: newMetadata,
          updatedAt: new Date(),
        })
        .where(eq(chatMessages.id, urlPathParams.messageId));

      logger.info("Vote recorded successfully", {
        messageId: urlPathParams.messageId,
        userId,
        vote: data.vote,
        upvotes,
        downvotes,
      });

      return createSuccessResponse({
        upvotes,
        downvotes,
        userVote: newVoteType,
      });
    } catch (error) {
      logger.error("Failed to record vote", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.vote.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  },
};
