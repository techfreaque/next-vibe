import type { ChatMessage } from "../../lib/storage/types";

/**
 * Message with its direct replies
 */
export interface MessageWithReplies {
  message: ChatMessage;
  replies: MessageWithReplies[];
  depth: number;
}

/**
 * Build a tree structure from flat message list
 * Groups messages by their parent, creating a Reddit-style thread structure
 */
export function buildMessageTree(
  messages: ChatMessage[],
  rootMessageId: string | null = null,
  depth: number = 0
): MessageWithReplies[] {
  // Find all messages that are direct children of the given parent
  const children = messages.filter(
    (msg) => msg.parentId === rootMessageId
  );

  // Recursively build tree for each child
  return children.map((message) => ({
    message,
    replies: buildMessageTree(messages, message.id, depth + 1),
    depth,
  }));
}

/**
 * Get all messages in a flat list from a tree
 */
export function flattenMessageTree(tree: MessageWithReplies[]): ChatMessage[] {
  const result: ChatMessage[] = [];

  function traverse(nodes: MessageWithReplies[]) {
    for (const node of nodes) {
      result.push(node.message);
      if (node.replies.length > 0) {
        traverse(node.replies);
      }
    }
  }

  traverse(tree);
  return result;
}

/**
 * Get direct replies for a specific message
 */
export function getDirectReplies(
  messages: ChatMessage[],
  messageId: string
): ChatMessage[] {
  return messages.filter((msg) => msg.parentId === messageId);
}

/**
 * Count total replies (including nested) for a message
 */
export function countTotalReplies(
  messages: ChatMessage[],
  messageId: string
): number {
  const directReplies = getDirectReplies(messages, messageId);
  let count = directReplies.length;

  for (const reply of directReplies) {
    count += countTotalReplies(messages, reply.id);
  }

  return count;
}

/**
 * Get the depth of a message in the tree
 */
export function getMessageDepth(
  messages: ChatMessage[],
  messageId: string
): number {
  const message = messages.find((m) => m.id === messageId);
  if (!message || !message.parentId) return 0;

  return 1 + getMessageDepth(messages, message.parentId);
}

/**
 * Get root messages (messages with no parent or parent is root)
 */
export function getRootMessages(
  messages: ChatMessage[],
  rootMessageId: string | null
): ChatMessage[] {
  return messages.filter((msg) => msg.parentId === rootMessageId);
}

/**
 * Sort messages by timestamp (oldest first)
 */
export function sortMessagesByTime(messages: ChatMessage[]): ChatMessage[] {
  return [...messages].sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Build a Reddit-style thread structure
 * Returns root messages with their nested replies
 */
export function buildRedditStyleThreads(
  messages: ChatMessage[],
  rootMessageId: string | null = null
): MessageWithReplies[] {
  // Sort messages by timestamp first
  const sortedMessages = sortMessagesByTime(messages);

  // Build tree starting from root
  return buildMessageTree(sortedMessages, rootMessageId, 0);
}

