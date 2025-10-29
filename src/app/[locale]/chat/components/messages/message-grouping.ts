/**
 * Message Grouping Utilities
 * Groups messages that are part of the same AI response sequence
 */

import type { ChatMessage } from "@/app/api/[locale]/v1/core/agent/chat/store";

/**
 * Grouped message sequence
 * Contains a primary message (first in sequence) and optional continuation messages
 */
export interface MessageGroup {
  primary: ChatMessage; // First message in sequence (shows header/avatar)
  continuations: ChatMessage[]; // Subsequent messages in sequence (no header)
  sequenceId: string | null; // Sequence ID (null for non-sequenced messages)
}

/**
 * Group messages by sequence ID
 * Messages with the same sequenceId are grouped together
 * The first message in each group is the primary (shows header)
 * Subsequent messages are continuations (no header)
 */
export function groupMessagesBySequence(
  messages: ChatMessage[],
): MessageGroup[] {
  const groups: MessageGroup[] = [];
  const sequenceMap = new Map<string, MessageGroup>();

  // Sort messages by createdAt to ensure correct order
  const sortedMessages = [...messages].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  );

  for (const message of sortedMessages) {
    // If message has no sequenceId, it's a standalone message
    if (!message.sequenceId) {
      groups.push({
        primary: message,
        continuations: [],
        sequenceId: null,
      });
      continue;
    }

    // Check if we already have a group for this sequence
    const existingGroup = sequenceMap.get(message.sequenceId);

    if (existingGroup) {
      // Add to existing group as continuation
      existingGroup.continuations.push(message);
    } else {
      // Create new group with this message as primary
      const newGroup: MessageGroup = {
        primary: message,
        continuations: [],
        sequenceId: message.sequenceId,
      };
      groups.push(newGroup);
      sequenceMap.set(message.sequenceId, newGroup);
    }
  }

  return groups;
}

/**
 * Check if a message has content after tool calls
 * Used to determine if tool calls should be collapsed by default
 */
export function hasContentAfterToolCalls(group: MessageGroup): boolean {
  // Check if primary message has content
  if (group.primary.content.trim().length > 0) {
    return true;
  }

  // Check if any continuation has content
  return group.continuations.some((msg) => msg.content.trim().length > 0);
}

/**
 * Get all tool calls from a message group
 * Combines tool calls from primary and all continuations
 */
export function getAllToolCallsFromGroup(
  group: MessageGroup,
): Array<NonNullable<ChatMessage["toolCalls"]>[number]> {
  const allToolCalls: Array<NonNullable<ChatMessage["toolCalls"]>[number]> = [];

  // Add tool calls from primary
  if (group.primary.toolCalls) {
    allToolCalls.push(...group.primary.toolCalls);
  }

  // Add tool calls from continuations
  for (const continuation of group.continuations) {
    if (continuation.toolCalls) {
      allToolCalls.push(...continuation.toolCalls);
    }
  }

  return allToolCalls;
}

/**
 * Get combined content from a message group
 * Joins content from primary and all continuations
 */
export function getCombinedContent(group: MessageGroup): string {
  const contents = [group.primary.content];

  for (const continuation of group.continuations) {
    if (continuation.content.trim().length > 0) {
      contents.push(continuation.content);
    }
  }

  return contents.join("\n\n");
}
