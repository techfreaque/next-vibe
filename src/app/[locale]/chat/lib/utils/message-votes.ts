/**
 * Message voting utilities
 * Pure functions for managing message votes
 */

import type { ChatMessage, ChatThread } from "../storage/types";

/**
 * Vote a message (upvote or downvote)
 *
 * @param thread - Current thread
 * @param messageId - ID of message to vote on
 * @param vote - Vote value (1 = upvote, -1 = downvote, 0 = remove vote)
 * @returns Updated thread with vote applied
 */
export function voteMessage(
  thread: ChatThread,
  messageId: string,
  vote: 1 | -1 | 0,
): ChatThread {
  const message = thread.messages[messageId];
  if (!message) {
    return thread;
  }

  const currentVote = message.metadata?.userVote ?? 0;
  const currentScore = message.metadata?.voteScore ?? 0;

  // Calculate new score by removing old vote and adding new vote
  const newScore = currentScore - currentVote + vote;

  const updatedMessage: ChatMessage = {
    ...message,
    metadata: {
      ...message.metadata,
      userVote: vote,
      voteScore: newScore,
    },
  };

  return {
    ...thread,
    messages: {
      ...thread.messages,
      [messageId]: updatedMessage,
    },
    updatedAt: Date.now(),
  };
}

/**
 * Get vote status for a message
 *
 * @param message - Message to check
 * @returns Object with userVote and voteScore
 */
export function getVoteStatus(message: ChatMessage): {
  userVote: number;
  voteScore: number;
} {
  return {
    userVote: message.metadata?.userVote ?? 0,
    voteScore: message.metadata?.voteScore ?? 0,
  };
}
