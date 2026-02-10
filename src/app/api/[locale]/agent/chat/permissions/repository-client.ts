/**
 * Permissions Repository Client
 * Client-side permission checking utilities
 */

import "server-only";

import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";

/**
 * Permissions Repository Client - Static class pattern
 * All methods are pure functions for permission checking
 */
export class PermissionsRepositoryClient {
  /**
   * Check if user can vote on a message
   * User must be authenticated and not voting on their own message
   */
  static canVoteMessage(userId: string | null, message: ChatMessage): boolean {
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
}
