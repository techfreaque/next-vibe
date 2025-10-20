/**
 * Utility hooks for accessing chat state
 *
 * These hooks provide convenient access to common chat state patterns
 * and help reduce code duplication across components.
 */

import type { ChatMessage, ChatThread } from "../../../lib/storage/types";
import { useChatContext } from "../context";

/**
 * Get the currently active thread
 *
 * @returns The active thread or null if no thread is active
 *
 * @example
 * ```tsx
 * const thread = useActiveThread();
 * if (!thread) return <EmptyState />;
 * ```
 */
export function useActiveThread(): ChatThread | null {
  const context = useChatContext();
  return context.activeThread;
}

/**
 * Get a specific message from the active thread
 *
 * @param messageId - The ID of the message to retrieve
 * @returns The message or undefined if not found
 *
 * @example
 * ```tsx
 * const message = useThreadMessage(messageId);
 * if (!message) return null;
 * ```
 */
export function useThreadMessage(messageId: string): ChatMessage | undefined {
  const context = useChatContext();

  const thread = context.activeThread;
  if (!thread) {
    return undefined;
  }

  return thread.messages[messageId];
}

/**
 * Get all messages in the current conversation path
 *
 * @returns Array of messages in the current path
 *
 * @example
 * ```tsx
 * const messages = useThreadMessages();
 * return messages.map(msg => <MessageBubble key={msg.id} message={msg} />);
 * ```
 */
export function useThreadMessages(): ChatMessage[] {
  const context = useChatContext();
  return context.messages;
}

/**
 * Check if a message exists in the active thread
 *
 * @param messageId - The ID of the message to check
 * @returns True if the message exists
 *
 * @example
 * ```tsx
 * const exists = useHasMessage(messageId);
 * if (!exists) return <MessageDeleted />;
 * ```
 */
export function useHasMessage(messageId: string): boolean {
  const context = useChatContext();

  const thread = context.activeThread;
  if (!thread) {
    return false;
  }

  return messageId in thread.messages;
}

/**
 * Get the parent message of a given message
 *
 * @param messageId - The ID of the message
 * @returns The parent message or undefined if no parent
 *
 * @example
 * ```tsx
 * const parent = useParentMessage(message.id);
 * if (parent) {
 *   // Show context from parent
 * }
 * ```
 */
export function useParentMessage(messageId: string): ChatMessage | undefined {
  const context = useChatContext();

  const thread = context.activeThread;
  if (!thread) {
    return undefined;
  }

  const message = thread.messages[messageId];
  if (!message?.parentId) {
    return undefined;
  }

  return thread.messages[message.parentId];
}

/**
 * Get all child messages (branches) of a given message
 *
 * @param messageId - The ID of the parent message
 * @returns Array of child messages
 *
 * @example
 * ```tsx
 * const branches = useChildMessages(message.id);
 * if (branches.length > 1) {
 *   // Show branch navigator
 * }
 * ```
 */
export function useChildMessages(messageId: string): ChatMessage[] {
  const context = useChatContext();

  const thread = context.activeThread;
  if (!thread) {
    return [];
  }

  return Object.values(thread.messages).filter(
    (msg): msg is ChatMessage => msg.parentId === messageId,
  );
}

/**
 * Check if the current thread is empty (no messages)
 *
 * @returns True if the thread has no messages
 *
 * @example
 * ```tsx
 * const isEmpty = useIsThreadEmpty();
 * if (isEmpty) return <SuggestedPrompts />;
 * ```
 */
export function useIsThreadEmpty(): boolean {
  const context = useChatContext();
  return context.messages.length === 0;
}

/**
 * Get the number of messages in the current thread
 *
 * @returns The message count
 *
 * @example
 * ```tsx
 * const count = useMessageCount();
 * return <div>Messages: {count}</div>;
 * ```
 */
export function useMessageCount(): number {
  const context = useChatContext();
  return context.messages.length;
}
