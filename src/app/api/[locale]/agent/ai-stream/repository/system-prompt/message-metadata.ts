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
  rootFolderId: DefaultFolderId,
  timezone: string,
): string {
  const parts: string[] = [];

  // Message ID (short fragment for AI reference)
  const shortId = message.id.slice(-8);
  parts.push(`ID:${shortId}`);

  // Model and Skill (for assistant messages)
  if (message.role === "assistant" && message.model) {
    parts.push(`Model:${message.model}`);
    if (message.skill) {
      parts.push(`Skill:${message.skill}`);
    }
  }

  // Author information (public/shared threads only)
  if (
    (rootFolderId === "public" || rootFolderId === "shared") &&
    message.authorId
  ) {
    const authorShortId = message.authorId.slice(-8);
    const authorLabel = message.authorName
      ? `${message.authorName}(${authorShortId})`
      : authorShortId;
    parts.push(`Author:${authorLabel}`);
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

  return parts.join(" | ");
}

/**
 * Prefix for all context metadata lines injected into the messages array.
 * Used for constructing and identifying context lines — never match raw strings.
 */
export const CONTEXT_LINE_PREFIX = "[Context: ";

/**
 * Check whether a system message content string is a context metadata line.
 */
export function isContextLine(content: string): boolean {
  return content.startsWith(CONTEXT_LINE_PREFIX);
}

/**
 * Create metadata system message content (compact format)
 * Wraps metadata in standard format
 * Returns empty string if no metadata available
 */
export function createMetadataSystemMessage(
  message: ChatMessage,
  rootFolderId: DefaultFolderId,
  timezone: string,
): string {
  const metadata = createMessageMetadata(message, rootFolderId, timezone);
  return `${CONTEXT_LINE_PREFIX}${metadata}]`;
}
