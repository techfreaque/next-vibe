/**
 * Helper functions for flat message view (4chan-style)
 */

import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";

/**
 * Count how many messages are direct replies to this message
 * Uses message structure (parentId) instead of parsing content
 */
export function countReplies(messages: ChatMessage[], messageId: string): number {
  return messages.filter((msg) => msg.parentId === messageId).length;
}

/**
 * Get direct replies to a message (children in the tree)
 */
export function getDirectReplies(messages: ChatMessage[], messageId: string): ChatMessage[] {
  return messages.filter((m) => m.parentId === messageId);
}

/**
 * Count posts by a specific user ID
 */
export function countPostsByUserId(messages: ChatMessage[], userId: string): number {
  return messages.filter((m) => m.authorId === userId).length;
}

/**
 * Get all posts by a specific user ID
 */
export function getPostsByUserId(messages: ChatMessage[], userId: string): ChatMessage[] {
  return messages.filter((m) => m.authorId === userId);
}
