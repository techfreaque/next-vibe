/**
 * Message helper utilities
 */

import type { ChatMessage, ChatThread } from "../storage/types";
import { getMessagesInPath } from "../storage/message-tree";

/**
 * Get the last message in a thread
 */
export function getLastMessage(thread: ChatThread): ChatMessage | null {
  const messages = getMessagesInPath(thread);
  return messages.length > 0 ? messages[messages.length - 1] : null;
}

/**
 * Get the last user message in a thread
 */
export function getLastUserMessage(thread: ChatThread): ChatMessage | null {
  const messages = getMessagesInPath(thread);
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") {
      return messages[i];
    }
  }
  return null;
}

/**
 * Get all user messages in a thread
 */
export function getUserMessages(thread: ChatThread): ChatMessage[] {
  return Object.values(thread.messages).filter((m) => m.role === "user");
}

/**
 * Get all assistant messages in a thread
 */
export function getAssistantMessages(thread: ChatThread): ChatMessage[] {
  return Object.values(thread.messages).filter((m) => m.role === "assistant");
}

/**
 * Check if thread has any messages
 */
export function hasMessages(thread: ChatThread): boolean {
  return Object.keys(thread.messages).length > 0;
}

/**
 * Check if thread has any user messages
 */
export function hasUserMessages(thread: ChatThread): boolean {
  return getUserMessages(thread).length > 0;
}

/**
 * Get message count in thread
 */
export function getMessageCount(thread: ChatThread): number {
  return Object.keys(thread.messages).length;
}

/**
 * Get message count in current path
 */
export function getPathMessageCount(thread: ChatThread): number {
  return getMessagesInPath(thread).length;
}

/**
 * Check if message exists in thread
 */
export function hasMessage(thread: ChatThread, messageId: string): boolean {
  return messageId in thread.messages;
}

/**
 * Get message by ID
 */
export function getMessage(
  thread: ChatThread,
  messageId: string
): ChatMessage | null {
  return thread.messages[messageId] || null;
}

/**
 * Get parent message
 */
export function getParentMessage(
  thread: ChatThread,
  messageId: string
): ChatMessage | null {
  const message = getMessage(thread, messageId);
  if (!message || !message.parentId) return null;
  return getMessage(thread, message.parentId);
}

/**
 * Get child messages
 */
export function getChildMessages(
  thread: ChatThread,
  messageId: string
): ChatMessage[] {
  return Object.values(thread.messages).filter(
    (m) => m.parentId === messageId
  );
}

/**
 * Check if message has children
 */
export function hasChildren(thread: ChatThread, messageId: string): boolean {
  return getChildMessages(thread, messageId).length > 0;
}

/**
 * Get message depth (distance from root)
 */
export function getMessageDepth(
  thread: ChatThread,
  messageId: string
): number {
  let depth = 0;
  let currentId: string | null = messageId;

  while (currentId) {
    const message = getMessage(thread, currentId);
    if (!message || !message.parentId) break;
    depth++;
    currentId = message.parentId;
  }

  return depth;
}

/**
 * Get all messages in a branch (from root to message)
 */
export function getBranchMessages(
  thread: ChatThread,
  messageId: string
): ChatMessage[] {
  const messages: ChatMessage[] = [];
  let currentId: string | null = messageId;

  while (currentId) {
    const message = getMessage(thread, currentId);
    if (!message) break;
    messages.unshift(message);
    currentId = message.parentId;
  }

  return messages;
}

/**
 * Generate a title from the first user message
 */
export function generateTitleFromMessage(content: string): string {
  const maxLength = 50;
  const trimmed = content.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  // Try to cut at a word boundary
  const truncated = trimmed.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.7) {
    return truncated.slice(0, lastSpace) + "...";
  }

  return truncated + "...";
}

/**
 * Check if thread needs a title update
 */
export function needsTitleUpdate(thread: ChatThread): boolean {
  const userMessages = getUserMessages(thread);
  return (
    userMessages.length === 1 &&
    (thread.title === "New Chat" || thread.title.startsWith("Chat "))
  );
}

