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

/**
 * Build a linear path through the message tree
 * Follows parent-child relationships, selecting branches based on branchIndices
 * Returns the path and information about available branches at each level
 */
export function buildMessagePath(
  messages: ChatMessage[],
  branchIndices: Record<string, number> = {},
): {
  path: ChatMessage[];
  branchInfo: Record<
    string,
    { siblings: ChatMessage[]; currentIndex: number }
  >;
} {
  // Find root message (message with no parent)
  const rootMessage = messages.find((msg) => !msg.parentId);
  if (!rootMessage) {
    return { path: [], branchInfo: {} };
  }

  // Build a map of children for each message (sorted by timestamp)
  const childrenMap = new Map<string, ChatMessage[]>();
  for (const msg of messages) {
    if (msg.parentId) {
      const siblings = childrenMap.get(msg.parentId) || [];
      siblings.push(msg);
      childrenMap.set(msg.parentId, siblings);
    }
  }

  // Sort siblings by timestamp
  for (const [parentId, siblings] of childrenMap.entries()) {
    childrenMap.set(
      parentId,
      siblings.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    );
  }

  // Traverse the tree following branch indices
  const path: ChatMessage[] = [];
  const branchInfo: Record<
    string,
    { siblings: ChatMessage[]; currentIndex: number }
  > = {};
  let currentMessage: ChatMessage | undefined = rootMessage;

  while (currentMessage) {
    path.push(currentMessage);

    const children = childrenMap.get(currentMessage.id);
    if (!children || children.length === 0) {
      break;
    }

    // Store branch info if there are multiple children
    if (children.length > 1) {
      const branchIndex = branchIndices[currentMessage.id] ?? 0;
      const validIndex = Math.min(
        Math.max(0, branchIndex),
        children.length - 1,
      );
      branchInfo[currentMessage.id] = {
        siblings: children,
        currentIndex: validIndex,
      };
      currentMessage = children[validIndex];
    } else {
      // Only one child, follow it
      currentMessage = children[0];
    }
  }

  return { path, branchInfo };
}
