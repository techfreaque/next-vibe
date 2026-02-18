/**
 * Message Metadata Generator
 * Shared utility for generating message metadata on both client and server
 * CRITICAL: This file must be isomorphic (works in both environments)
 */

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";

/**
 * Format absolute timestamp for message metadata
 * CACHE-STABLE: Returns absolute timestamp that never changes
 * Format: "Feb 12, 18:23" (localized to user's timezone)
 */
export function formatAbsoluteTimestamp(date: Date, timezone: string): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  });
  return formatter.format(date);
}

/**
 * Create metadata string for a chat message (compact format)
 * Only includes non-empty fields
 * Context-aware: includes author info for public/shared threads
 */
export function createMessageMetadata(
  message: ChatMessage,
  rootFolderId: DefaultFolderId | undefined,
  timezone: string,
): string {
  const parts: string[] = [];

  // Message ID (short fragment for AI reference)
  const shortId = message.id.slice(-8);
  parts.push(`ID:${shortId}`);

  // Model and Character (for assistant messages)
  if (message.role === "assistant" && message.model) {
    parts.push(`Model:${message.model}`);
    if (message.character) {
      parts.push(`Character:${message.character}`);
    }
  }

  // Author information (public/shared threads only)
  if (
    (rootFolderId === "public" || rootFolderId === "shared") &&
    message.authorName
  ) {
    const authorInfo = message.authorId
      ? `${message.authorName}(${message.authorId.slice(-8)})`
      : message.authorName;
    parts.push(`Author:${authorInfo}`);
  }

  // Votes (show if either upvotes or downvotes > 0)
  if (message.upvotes > 0 || message.downvotes > 0) {
    const voteParts: string[] = [];
    if (message.upvotes > 0) {
      voteParts.push(`👍${message.upvotes}`);
    }
    if (message.downvotes > 0) {
      voteParts.push(`👎${message.downvotes}`);
    }
    parts.push(voteParts.join(" "));
  }

  // Timestamp (absolute, cache-stable)
  const timestamp = formatAbsoluteTimestamp(message.createdAt, timezone);
  parts.push(`Posted:${timestamp}`);

  // Status indicators (only if present)
  const statusParts: string[] = [];
  if (message.edited) {
    statusParts.push("edited");
  }

  if (statusParts.length > 0) {
    parts.push(statusParts.join(","));
  }

  return parts.join(" | ");
}

/**
 * Create metadata system message content (compact format)
 * Wraps metadata in standard format
 * Returns empty string if no metadata available
 */
export function createMetadataSystemMessage(
  message: ChatMessage,
  rootFolderId: DefaultFolderId | undefined,
  timezone: string,
): string {
  const metadata = createMessageMetadata(message, rootFolderId, timezone);
  return `[Context: ${metadata}]`;
}
