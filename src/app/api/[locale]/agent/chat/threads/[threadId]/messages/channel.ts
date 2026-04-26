/**
 * Messages WS Channel
 *
 * Shared channel builder for the messages endpoint.
 * Used by both server (emitter) and client (subscriber) to ensure
 * the channel name is derived from a single source of truth.
 *
 * This file is client-safe - no "server-only" imports.
 */

import { buildWsChannel } from "@/app/api/[locale]/system/unified-interface/websocket/channel";

const MESSAGES_PATH = [
  "agent",
  "chat",
  "threads",
  "[threadId]",
  "messages",
] as const;

/**
 * Build the WS channel string for a messages endpoint.
 *
 * @param threadId - Thread ID to scope the channel
 * @returns Channel string like "agent/chat/threads/abc123/messages"
 */
export function buildMessagesChannel(threadId: string): string {
  return buildWsChannel(MESSAGES_PATH, { threadId });
}

const SUPPORT_FEED_PATH = [
  "agent",
  "support",
  "session",
  "[sessionId]",
  "feed",
] as const;

/**
 * Build the WS channel string for a support session feed.
 * Supporters subscribe to this channel to receive live stream events.
 *
 * @param sessionId - Support session ID
 * @returns Channel string like "agent/support/session/abc123/feed"
 */
export function buildSupportFeedChannel(sessionId: string): string {
  return buildWsChannel(SUPPORT_FEED_PATH, { sessionId });
}
