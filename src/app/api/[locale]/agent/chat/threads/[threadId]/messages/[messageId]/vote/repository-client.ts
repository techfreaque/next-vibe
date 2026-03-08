/**
 * Vote Message Client Repository
 * Handles vote storage in localStorage for incognito threads.
 * Votes serve as AI feedback — they appear in context messages shown to the AI.
 */

"use client";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import {
  getMessagesForThread,
  updateIncognitoMessage,
} from "@/app/api/[locale]/agent/chat/incognito/storage";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { VotePostResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

const INCOGNITO_USER_ID = "incognito";

export class VoteRepositoryClient {
  static async voteMessage(
    threadId: string,
    messageId: string,
    vote: "up" | "down" | "remove",
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<VotePostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const messages = await getMessagesForThread(threadId);
      const message = messages.find((m) => m.id === messageId);

      if (!message) {
        logger.error("Vote client: message not found", { messageId, threadId });
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      interface VoteDetail {
        userId: string;
        vote: "up" | "down";
        timestamp: number;
      }
      const rawDetails = Array.isArray(message.metadata?.voteDetails)
        ? (message.metadata.voteDetails as VoteDetail[])
        : [];

      // Current vote details, filtered to remove current incognito user's entry
      const currentVoteDetails: VoteDetail[] = rawDetails.filter(
        (v) => v.userId !== INCOGNITO_USER_ID,
      );

      // Find previous vote to calculate delta
      const prevDetail = rawDetails.find((v) => v.userId === INCOGNITO_USER_ID);

      let upvotesDelta = 0;
      let downvotesDelta = 0;

      // Remove previous vote effect
      if (prevDetail?.vote === "up") {
        upvotesDelta -= 1;
      } else if (prevDetail?.vote === "down") {
        downvotesDelta -= 1;
      }

      // Apply new vote
      const newUserVote: "up" | "down" | "none" =
        vote === "remove" ? "none" : vote;

      if (newUserVote === "up") {
        upvotesDelta += 1;
        currentVoteDetails.push({
          userId: INCOGNITO_USER_ID,
          vote: "up",
          timestamp: Date.now(),
        });
      } else if (newUserVote === "down") {
        downvotesDelta += 1;
        currentVoteDetails.push({
          userId: INCOGNITO_USER_ID,
          vote: "down",
          timestamp: Date.now(),
        });
      }

      const newUpvotes = Math.max(0, (message.upvotes ?? 0) + upvotesDelta);
      const newDownvotes = Math.max(
        0,
        (message.downvotes ?? 0) + downvotesDelta,
      );

      await updateIncognitoMessage(messageId, {
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        metadata: {
          ...message.metadata,
          voteDetails: currentVoteDetails,
        },
      });

      logger.debug("Vote client: vote stored in localStorage", {
        messageId,
        vote: newUserVote,
        upvotes: newUpvotes,
        downvotes: newDownvotes,
      });

      return success({
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        userVote: newUserVote,
      });
    } catch (error) {
      logger.error(
        "Vote client: failed to record vote",
        error instanceof Error ? error : new Error(String(error)),
      );
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
