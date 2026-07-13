/**
 * Message Voting Utilities
 * Utilities for handling message upvotes/downvotes
 */

import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";

export interface VoteStatus {
  userVote: "up" | "down" | null;
  voteScore: number;
}

/**
 * Get vote status for a message
 * Calculates the vote score and determines user's current vote from metadata
 */
export function getVoteStatus(
  message: ChatMessage,
  currentUserId?: string,
): VoteStatus {
  const upvotes = message.upvotes ?? 0;
  const downvotes = message.downvotes ?? 0;
  const voteScore = upvotes - downvotes;

  let userVote: "up" | "down" | null = null;

  if (currentUserId && Array.isArray(message.metadata?.voteDetails)) {
    const userVoteDetail = message.metadata.voteDetails.find(
      (v) => v.userId === currentUserId,
    );
    if (userVoteDetail) {
      userVote = userVoteDetail.vote;
    }
  }

  return {
    userVote,
    voteScore,
  };
}
