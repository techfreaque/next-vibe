/**
 * Message Grouping Utilities
 * Groups messages that are part of the same AI response sequence
 */

import type { ChatMessage } from "../../../../db";

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
  const sortedMessages = [...messages].toSorted(
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
