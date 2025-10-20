/**
 * Message Voting Utilities
 * Utilities for handling message upvotes/downvotes
 */

import type { ChatMessage } from "../../types";

export interface VoteStatus {
  userVote: "up" | "down" | null;
  voteScore: number;
}

/**
 * Get vote status for a message
 * Calculates the vote score and determines user's vote
 */
export function getVoteStatus(message: ChatMessage): VoteStatus {
  const upvotes = message.upvotes ?? 0;
  const downvotes = message.downvotes ?? 0;
  const voteScore = upvotes - downvotes;

  // In the new architecture, we don't track individual user votes on the message
  // This would need to be tracked separately in user state if needed
  const userVote = null;

  return {
    userVote,
    voteScore,
  };
}
