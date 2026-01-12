/**
 * Message Metadata Generator
 * Shared utility for generating message metadata on both client and server
 * CRITICAL: This file must be isomorphic (works in both environments)
 */

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { defaultLocale } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

/**
 * Get relative time string from date (compact format)
 */
export function getRelativeTime(date: Date): string {
  const { t } = simpleT(defaultLocale);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) {
    return t("app.api.agent.chat.aiStream.post.systemPrompt.now");
  }
  if (diffMins < 60) {
    return t("app.api.agent.chat.aiStream.post.systemPrompt.minutesAgo", {
      minutes: diffMins,
    });
  }
  if (diffHours < 24) {
    return t("app.api.agent.chat.aiStream.post.systemPrompt.hoursAgo", {
      hours: diffHours,
    });
  }
  return t("app.api.agent.chat.aiStream.post.systemPrompt.daysAgo", {
    days: diffDays,
  });
}

/**
 * Create metadata string for a chat message (compact format)
 * Only includes non-empty fields
 * Context-aware: includes author info for public/shared threads
 */
export function createMessageMetadata(
  message: ChatMessage,
  rootFolderId: DefaultFolderId | undefined,
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

  // Timestamp (relative time)
  const timeAgo = getRelativeTime(message.createdAt);
  parts.push(`Posted:${timeAgo}`);

  // Status indicators (only if present)
  const statusParts: string[] = [];
  if (message.edited) {
    statusParts.push("edited");
  }
  if (message.originalId) {
    statusParts.push("branched");
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
): string {
  const metadata = createMessageMetadata(message, rootFolderId);
  return `[Context: ${metadata}]`;
}
