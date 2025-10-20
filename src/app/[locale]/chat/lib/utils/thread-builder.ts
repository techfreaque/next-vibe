import type { ChatMessage } from "../../types";

/**
 * Get direct replies for a specific message
 */
export function getDirectReplies(
  messages: ChatMessage[],
  messageId: string,
): ChatMessage[] {
  return messages.filter((msg) => msg.parentId === messageId);
}

/**
 * Get root messages (messages with no parent or parent is root)
 */
export function getRootMessages(
  messages: ChatMessage[],
  rootMessageId: string | null,
): ChatMessage[] {
  return messages.filter((msg) => msg.parentId === rootMessageId);
}

/**
 * Sort messages by timestamp (oldest first)
 */
export function sortMessagesByTime(messages: ChatMessage[]): ChatMessage[] {
  return [...messages].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  );
}

