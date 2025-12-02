/**
 * Message Metadata Generator
 * Shared utility for generating message metadata on both client and server
 * CRITICAL: This file must be isomorphic (works in both environments)
 */

/* eslint-disable i18next/no-literal-string */

import type { DefaultFolderId } from "@/app/api/[locale]/v1/core/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/v1/core/agent/chat/db";

/**
 * Get relative time string from date
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) {
    return "just now";
  }
  if (diffMins === 1) {
    return "1 minute ago";
  }
  if (diffMins < 60) {
    return `${diffMins} minutes ago`;
  }
  if (diffHours === 1) {
    return "1 hour ago";
  }
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }
  if (diffDays === 1) {
    return "1 day ago";
  }
  return `${diffDays} days ago`;
}

/**
 * Create metadata string for a chat message
 * Injects structured context for AI models
 * Context-aware: includes author info for public/shared threads
 */
export function createMessageMetadata(
  message: ChatMessage,
  rootFolderId: DefaultFolderId | undefined,
): string {
  const parts: string[] = [];

  // Message ID (short fragment for AI reference)
  const shortId = message.id.slice(-8);
  parts.push(`Message ID: ${shortId}`);

  // Model and Persona (for assistant messages)
  if (message.role === "assistant" && message.model) {
    parts.push(`Model: ${message.model}`);
    if (message.persona) {
      parts.push(`Persona: ${message.persona}`);
    }
  }

  // Author information (public/shared threads only)
  if (
    (rootFolderId === "public" || rootFolderId === "shared") &&
    message.authorName
  ) {
    const authorInfo = message.authorId
      ? `${message.authorName} (${message.authorId.slice(-8)})`
      : message.authorName;
    parts.push(`Author: ${authorInfo}`);
  }

  // Votes (show if either upvotes or downvotes > 0)
  if (message.upvotes > 0 || message.downvotes > 0) {
    const voteParts: string[] = [];
    if (message.upvotes > 0) {
      voteParts.push(`👍 ${message.upvotes}`);
    }
    if (message.downvotes > 0) {
      voteParts.push(`👎 ${message.downvotes}`);
    }
    parts.push(voteParts.join(" | "));
  }

  // Timestamp (relative time)
  const timeAgo = getRelativeTime(message.createdAt);
  parts.push(`Posted: ${timeAgo}`);

  // Status indicators
  const statusParts: string[] = [];
  if (message.edited) {
    statusParts.push("edited");
  }
  if (message.originalId) {
    statusParts.push("branched");
  }
  if (statusParts.length > 0) {
    parts.push(`Status: ${statusParts.join(", ")}`);
  }

  return parts.join(" | ");
}

/**
 * Create metadata system message content
 * Wraps metadata in standard format
 */
export function createMetadataSystemMessage(
  message: ChatMessage,
  rootFolderId: DefaultFolderId | undefined,
): string {
  const metadata = createMessageMetadata(message, rootFolderId);
  return `[Message Context: ${metadata}]`;
}
