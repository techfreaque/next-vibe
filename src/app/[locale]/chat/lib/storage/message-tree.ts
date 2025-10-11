/**
 * Message Tree Operations
 *
 * This module provides pure functions for managing a tree-structured conversation.
 * All functions follow these principles:
 * - Immutability: Never modify input objects, always return new objects
 * - No side effects: Functions only transform data, no I/O or external state
 * - Type safety: All inputs and outputs are strongly typed
 *
 * The message tree structure:
 * - Messages are stored in a flat map (thread.messages) for O(1) lookup
 * - Each message has a parentId and childrenIds array forming the tree
 * - currentPath tracks the active conversation branch
 * - branchIndices stores which branch was selected at each branching point
 */

import type {
  ChatMessage,
  ChatThread,
  ConversationPath,
  NewMessageInput,
} from "./types";

/**
 * Generate a unique ID for messages
 *
 * Format: msg-{timestamp}-{random}
 * - timestamp: milliseconds since epoch for chronological ordering
 * - random: 7-character alphanumeric string for uniqueness
 *
 * @returns A unique message ID string
 *
 * @example
 * const id = generateMessageId(); // "msg-1234567890-abc123d"
 */
export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a new message with defaults
 *
 * This is a pure function that creates a ChatMessage object from input data.
 * Missing optional fields are filled with defaults.
 *
 * @param input - Partial message data
 * @returns Complete ChatMessage object with all required fields
 *
 * @example
 * const message = createMessage({
 *   role: "user",
 *   content: "Hello!",
 *   parentId: "msg-123"
 * });
 */
export function createMessage(input: NewMessageInput): ChatMessage {
  return {
    id: input.id || generateMessageId(),
    timestamp: input.timestamp || Date.now(),
    childrenIds: input.childrenIds || [],
    role: input.role,
    content: input.content,
    parentId: input.parentId,
    model: input.model,
    tone: input.tone,
    error: input.error,
    metadata: input.metadata,
  };
}

/**
 * Get all messages in the current conversation path
 *
 * Returns messages in order from root to current leaf, following the active branch.
 * This is the sequence of messages that forms the current conversation.
 *
 * @param thread - The chat thread
 * @param path - Optional path to use (defaults to thread.currentPath)
 * @returns Array of messages in path order, filtered to remove any undefined entries
 *
 * @example
 * const messages = getMessagesInPath(thread);
 * // Returns: [rootMessage, childMessage, grandchildMessage, ...]
 */
export function getMessagesInPath(
  thread: ChatThread,
  path?: ConversationPath,
): ChatMessage[] {
  const activePath = path || thread.currentPath;
  return activePath.messageIds
    .map((id) => thread.messages[id])
    .filter((msg): msg is ChatMessage => msg !== undefined);
}

/**
 * Get the current leaf message (last message in active path)
 *
 * The leaf message is the most recent message in the current conversation branch.
 * This is typically where new messages will be added.
 *
 * @param thread - The chat thread
 * @returns The leaf message, or null if path is empty
 *
 * @example
 * const leaf = getCurrentLeafMessage(thread);
 * if (leaf) {
 *   console.log("Last message:", leaf.content);
 * }
 */
export function getCurrentLeafMessage(thread: ChatThread): ChatMessage | null {
  const path = thread.currentPath;
  if (path.messageIds.length === 0) {
    return null;
  }
  const lastId = path.messageIds[path.messageIds.length - 1];
  return thread.messages[lastId] || null;
}

/**
 * Add a message to the thread and update the current path
 *
 * This function:
 * 1. Creates a new message from the input
 * 2. Updates the parent's childrenIds array (if parent exists)
 * 3. Adds the message to the thread's message map
 * 4. Extends the current path to include the new message
 *
 * This is a pure function - it returns a new thread object without modifying the input.
 *
 * @param thread - The chat thread to add the message to
 * @param message - The message data to add
 * @returns A new thread object with the message added
 *
 * @example
 * const updatedThread = addMessageToThread(thread, {
 *   role: "user",
 *   content: "Hello!",
 *   parentId: lastMessage.id
 * });
 */
export function addMessageToThread(
  thread: ChatThread,
  message: NewMessageInput,
): ChatThread {
  const newMessage = createMessage(message);

  // Update parent's children list if parent exists
  const updatedMessages = { ...thread.messages };
  if (newMessage.parentId && updatedMessages[newMessage.parentId]) {
    const parent = updatedMessages[newMessage.parentId];
    updatedMessages[newMessage.parentId] = {
      ...parent,
      childrenIds: [...parent.childrenIds, newMessage.id],
    };
  }

  // Add new message
  updatedMessages[newMessage.id] = newMessage;

  // Update current path to include new message
  const newPath: ConversationPath = {
    messageIds: [...thread.currentPath.messageIds, newMessage.id],
    branchIndices: { ...thread.currentPath.branchIndices },
  };

  return {
    ...thread,
    messages: updatedMessages,
    currentPath: newPath,
    updatedAt: Date.now(),
  };
}

/**
 * Create a branch from a specific message
 *
 * This is used when editing a message or creating an alternative response.
 * Instead of replacing the existing message, this creates a new branch.
 *
 * The function:
 * 1. Creates a new message as a child of the parent
 * 2. Adds it to the parent's childrenIds array
 * 3. Updates the current path to follow this new branch
 * 4. Records the branch index in branchIndices
 *
 * This preserves the original message and allows switching between branches.
 *
 * @param thread - The chat thread
 * @param parentMessageId - ID of the message to branch from
 * @param newMessage - The new message data for the branch
 * @returns A new thread object with the branch created
 * @throws Error if parent message not found or not in current path
 *
 * @example
 * // Create an alternative response to a user message
 * const branched = createBranchFromMessage(thread, userMessageId, {
 *   role: "assistant",
 *   content: "Alternative response"
 * });
 */
export function createBranchFromMessage(
  thread: ChatThread,
  parentMessageId: string,
  newMessage: NewMessageInput,
): ChatThread {
  const newMsg = createMessage({
    ...newMessage,
    parentId: parentMessageId,
  });

  // Update parent's children list
  const updatedMessages = { ...thread.messages };
  const parent = updatedMessages[parentMessageId];
  if (!parent) {
    throw new Error(`Parent message ${parentMessageId} not found`);
  }

  updatedMessages[parentMessageId] = {
    ...parent,
    childrenIds: [...parent.childrenIds, newMsg.id],
  };

  // Add new message
  updatedMessages[newMsg.id] = newMsg;

  // Update path to use this new branch
  const parentIndex = thread.currentPath.messageIds.indexOf(parentMessageId);
  if (parentIndex === -1) {
    throw new Error(`Parent message ${parentMessageId} not in current path`);
  }

  const newPath: ConversationPath = {
    messageIds: [
      ...thread.currentPath.messageIds.slice(0, parentIndex + 1),
      newMsg.id,
    ],
    branchIndices: {
      ...thread.currentPath.branchIndices,
      [parentMessageId]: parent.childrenIds.length, // Index of the new branch
    },
  };

  return {
    ...thread,
    messages: updatedMessages,
    currentPath: newPath,
    updatedAt: Date.now(),
  };
}

/**
 * Switch to a different branch at a specific message
 *
 * When a message has multiple children (branches), this function switches
 * the current path to follow a different branch.
 *
 * The function:
 * 1. Validates the message and branch index
 * 2. Builds a new path up to the branching point
 * 3. Follows the selected branch to its leaf
 * 4. Uses stored branch indices for subsequent branching points
 *
 * This allows users to explore different conversation branches.
 *
 * @param thread - The chat thread
 * @param messageId - ID of the message where branching occurs
 * @param branchIndex - Index of the branch to switch to (0-based)
 * @returns A new thread object with updated current path
 * @throws Error if message not found, invalid branch index, or message not in path
 *
 * @example
 * // Switch to the second branch (index 1) at a message
 * const switched = switchBranch(thread, messageId, 1);
 */
export function switchBranch(
  thread: ChatThread,
  messageId: string,
  branchIndex: number,
): ChatThread {
  const message = thread.messages[messageId];
  if (!message) {
    throw new Error(`Message ${messageId} not found`);
  }

  if (branchIndex < 0 || branchIndex >= message.childrenIds.length) {
    throw new Error(`Invalid branch index ${branchIndex}`);
  }

  const messageIndex = thread.currentPath.messageIds.indexOf(messageId);
  if (messageIndex === -1) {
    throw new Error(`Message ${messageId} not in current path`);
  }

  // Build new path up to this message, then follow the selected branch
  const newBranchId = message.childrenIds[branchIndex];
  const newPath: ConversationPath = {
    messageIds: [
      ...thread.currentPath.messageIds.slice(0, messageIndex + 1),
      newBranchId,
    ],
    branchIndices: {
      ...thread.currentPath.branchIndices,
      [messageId]: branchIndex,
    },
  };

  // Continue following the path to the leaf
  let currentId = newBranchId;
  while (currentId) {
    const current = thread.messages[currentId];
    if (!current || current.childrenIds.length === 0) {
      break;
    }

    // Use stored branch index or default to 0
    const storedIndex = newPath.branchIndices[currentId] || 0;
    const nextIndex = Math.min(storedIndex, current.childrenIds.length - 1);
    const nextId = current.childrenIds[nextIndex];

    newPath.messageIds.push(nextId);
    newPath.branchIndices[currentId] = nextIndex;
    currentId = nextId;
  }

  return {
    ...thread,
    currentPath: newPath,
  };
}

/**
 * Get branch information for a message
 *
 * Returns metadata about the branches at a specific message.
 * Useful for UI components that display branch navigation.
 *
 * @param thread - The chat thread
 * @param messageId - ID of the message to get branch info for
 * @returns Object containing:
 *   - hasBranches: true if message has multiple children
 *   - branchCount: total number of branches (children)
 *   - currentBranchIndex: index of the currently active branch
 *   - branches: array of branch info with id and preview text
 *
 * @example
 * const info = getBranchInfo(thread, messageId);
 * if (info.hasBranches) {
 *   console.log(`${info.branchCount} branches available`);
 *   console.log(`Currently on branch ${info.currentBranchIndex + 1}`);
 * }
 */
export function getBranchInfo(
  thread: ChatThread,
  messageId: string,
): {
  hasBranches: boolean;
  branchCount: number;
  currentBranchIndex: number;
  branches: Array<{ id: string; preview: string }>;
} {
  const message = thread.messages[messageId];
  if (!message) {
    return {
      hasBranches: false,
      branchCount: 0,
      currentBranchIndex: 0,
      branches: [],
    };
  }

  const branchCount = message.childrenIds.length;
  const currentBranchIndex = thread.currentPath.branchIndices[messageId] || 0;

  const branches = message.childrenIds.map((childId) => {
    const child = thread.messages[childId];
    return {
      id: childId,
      preview: child ? child.content.substring(0, 50) : "",
    };
  });

  return {
    hasBranches: branchCount > 1,
    branchCount,
    currentBranchIndex,
    branches,
  };
}

/**
 * Delete a message and all its descendants
 *
 * This function performs a cascading delete:
 * 1. Collects the message and all its descendants using BFS
 * 2. Removes all collected messages from the thread
 * 3. Updates the parent's childrenIds to remove the deleted message
 * 4. Truncates the current path if it included any deleted messages
 * 5. Cleans up branchIndices for deleted messages
 *
 * This ensures the tree remains consistent after deletion.
 *
 * @param thread - The chat thread
 * @param messageId - ID of the message to delete (along with its descendants)
 * @returns A new thread object with the message branch deleted
 *
 * @example
 * // Delete a message and all its replies
 * const updated = deleteMessageBranch(thread, messageId);
 */
export function deleteMessageBranch(
  thread: ChatThread,
  messageId: string,
): ChatThread {
  const message = thread.messages[messageId];
  if (!message) {
    return thread;
  }

  // Collect all descendant IDs using breadth-first search
  const toDelete = new Set<string>([messageId]);
  const queue = [messageId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const current = thread.messages[currentId];
    if (current) {
      current.childrenIds.forEach((childId) => {
        toDelete.add(childId);
        queue.push(childId);
      });
    }
  }

  // Remove from messages
  const updatedMessages = { ...thread.messages };
  toDelete.forEach((id) => {
    delete updatedMessages[id];
  });

  // Update parent's children list
  if (message.parentId && updatedMessages[message.parentId]) {
    const parent = updatedMessages[message.parentId];
    updatedMessages[message.parentId] = {
      ...parent,
      childrenIds: parent.childrenIds.filter((id) => id !== messageId),
    };
  }

  // Update path if it included deleted messages
  const newPath = { ...thread.currentPath };
  const deletedIndex = newPath.messageIds.findIndex((id) => toDelete.has(id));
  if (deletedIndex !== -1) {
    newPath.messageIds = newPath.messageIds.slice(0, deletedIndex);

    // Clean up branchIndices for deleted messages
    const newBranchIndices: Record<string, number> = {};
    for (const [msgId, branchIdx] of Object.entries(newPath.branchIndices)) {
      if (!toDelete.has(msgId)) {
        newBranchIndices[msgId] = branchIdx;
      }
    }
    newPath.branchIndices = newBranchIndices;
  }

  return {
    ...thread,
    messages: updatedMessages,
    currentPath: newPath,
    updatedAt: Date.now(),
  };
}

/**
 * Generate a title for a thread based on its first user message
 *
 * Creates a human-readable title by taking the first 50 characters
 * of the first user message in the thread.
 *
 * @param thread - The chat thread
 * @returns A title string (max 50 chars + "..." if truncated)
 *
 * @example
 * const title = generateThreadTitle(thread);
 * // Returns: "How do I implement a binary search tree in..."
 */
export function generateThreadTitle(thread: ChatThread): string {
  const messages = getMessagesInPath(thread);
  const firstUserMessage = messages.find((msg) => msg.role === "user");

  if (!firstUserMessage) {
    return "New Chat";
  }

  // Take first 50 characters of the message
  const title = firstUserMessage.content.substring(0, 50);
  return title.length < firstUserMessage.content.length ? `${title}...` : title;
}

