/**
 * Chat Permission Utilities
 * Simplified permissions based on current DB schema
 */

import "server-only";

import type { ChatMessage } from "@/app/api/[locale]/v1/core/agent/chat/db";

/**
 * Check if user can vote on a message
 * Simplified: user must be authenticated and not voting on their own message
 */
export function canVoteMessage(
  userId: string | null,
  _leadId: string | null,
  message: ChatMessage,
): boolean {
  // Must be authenticated to vote
  if (!userId) {
    return false;
  }

  // Can't vote on your own messages
  if (message.authorId === userId) {
    return false;
  }

  return true;
}
