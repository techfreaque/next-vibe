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

import {
  chatFolders,
  chatMessages,
  chatThreads,
  type MessageMetadata,
} from "../../../../../db";
import { canVoteMessage } from "../../../../../permissions/utils";
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
    urlVariables: VotePostUrlVariablesOutput,
    data: VotePostRequestOutput,
    user: JwtPayloadType,
    _locale: CountryLanguage,
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
      // Note: We only join with custom folders if the thread has a customFolderId
      const [messageWithThread] = await db
        .select({
          message: chatMessages,
          thread: chatThreads,
          folder: chatFolders,
        })
        .from(chatMessages)
        .innerJoin(chatThreads, eq(chatMessages.threadId, chatThreads.id))
        .leftJoin(chatFolders, eq(chatThreads.customFolderId, chatFolders.id))
        .where(
          and(
            eq(chatMessages.id, urlVariables.messageId),
            eq(chatMessages.threadId, urlVariables.threadId),
          ),
        )
        .limit(1);

      if (!messageWithThread) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.vote.post.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      const { message, thread, folder } = messageWithThread;

      // Reject incognito threads
      if (thread.rootFolderId === "incognito") {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.vote.post.errors.forbidden.title" as const,
          ErrorResponseTypes.FORBIDDEN,
          { message: "Incognito threads cannot be accessed on the server" },
        );
      }

      // Check voting permissions
      // For threads in custom folders, check folder permissions
      // For threads in root folders (folder is null), check based on root folder type
      if (folder) {
        // Custom folder - use folder permissions
        if (!canVoteMessage(userId, null, message, folder)) {
          return createErrorResponse(
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.vote.post.errors.forbidden.title",
            ErrorResponseTypes.FORBIDDEN,
          );
        }
      } else {
        // Root folder - basic permission check
        // Can't vote on your own messages
        if (message.authorId === userId) {
          return createErrorResponse(
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.vote.post.errors.forbidden.title",
            ErrorResponseTypes.FORBIDDEN,
          );
        }
        // For root folders, voting is allowed if you can access the thread
        // (which we already verified by getting the message)
      }

      // Get current metadata
      const currentMetadata = message.metadata || {};
      const voterIds: string[] = currentMetadata.voterIds || [];
      const voteDetails: Array<{
        userId: string;
        vote: "up" | "down";
        timestamp: number;
      }> = currentMetadata.voteDetails || [];

      // Find existing vote by this user
      const existingVoteIndex = voteDetails.findIndex(
        (v: { userId: string; vote: "up" | "down"; timestamp: number }) =>
          v.userId === userId,
      );
      const existingVote =
        existingVoteIndex >= 0 ? voteDetails[existingVoteIndex] : null;

      // Calculate new vote counts
      let upvotes = message.upvotes || 0;
      let downvotes = message.downvotes || 0;

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
      const newVoteDetails: Array<{
        userId: string;
        vote: "up" | "down";
        timestamp: number;
      }> = voteDetails.filter(
        (v: { userId: string; vote: "up" | "down"; timestamp: number }) =>
          v.userId !== userId,
      );
      const newVoterIds: string[] = voterIds.filter(
        (id: string) => id !== userId,
      );

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
      } as MessageMetadata;

      await db
        .update(chatMessages)
        .set({
          upvotes,
          downvotes,
          metadata: newMetadata,
          updatedAt: new Date(),
        })
        .where(eq(chatMessages.id, urlVariables.messageId));

      logger.info("Vote recorded successfully", {
        messageId: urlVariables.messageId,
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
      logger.error("Failed to record vote", { error });
      return createErrorResponse(
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.vote.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  },
};
