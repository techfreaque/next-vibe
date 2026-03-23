"use client";

/**
 * updateMessages - single source of truth for message cache writes.
 *
 * Two-layer cache architecture for O(1) per-delta re-renders:
 *
 * Layer 1: apiClient cache keyed by { threadId, rootFolderId }
 *   - { messages: ChatMessage[] } - the full list, used for path building / branch loading
 *   - All list-level operations (branch navigation, send, retry) read/write here
 *
 * Layer 2: per-message queryClient cache keyed by ['message-item', messageId]
 *   - Single ChatMessage - seeded automatically by updateMessages on every write
 *   - Used by per-message components (streaming indicator, TTS, actions) via useMessageItem()
 *   - O(1) per delta: only the changed message's observer re-renders, not all N messages
 *
 * Usage:
 *   updateMessages(threadId, rootFolderId, logger, (msgs) =>
 *     msgs.map((m) => m.id === id ? { ...m, content: m.content + delta } : m)
 *   );
 */

import { success } from "next-vibe/shared/types/response.schema";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { saveMessage } from "@/app/api/[locale]/agent/chat/incognito/storage";
import {
  apiClient,
  queryClient,
} from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import messagesDefinition from "../definition";

// ─── Per-item cache key ───────────────────────────────────────────────────────

/**
 * React Query cache key for a single message.
 * Kept stable and opaque - use seedMessageItemCache / useMessageItem to interact.
 */
export function messageItemQueryKey(messageId: string): [string, string] {
  return ["message-item", messageId];
}

/**
 * Seed the per-item cache for a single message.
 * Called automatically by updateMessages - not needed externally.
 *
 * Uses replaceEqualDeep (React Query default) so unchanged fields preserve
 * their object references - components using useMessageItem() only re-render
 * when their specific message's data actually changes.
 */
export function seedMessageItemCache(message: ChatMessage): void {
  queryClient.setQueryData(messageItemQueryKey(message.id), message);
}

/**
 * Update the messages cache for a thread, with automatic incognito localStorage sync.
 *
 * @param threadId - The thread whose messages to update
 * @param rootFolderId - Needed for cache key + incognito detection
 * @param logger - Endpoint logger for apiClient calls
 * @param updater - Pure function from old messages array to new messages array
 */
export function updateMessages(
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
  updater: (messages: ChatMessage[]) => ChatMessage[],
): void {
  // Collect updated messages from inside the updater closure for incognito sync.
  // Stored in an array so TypeScript doesn't narrow it to 'never' after the closure.
  const result: ChatMessage[][] = [];

  apiClient.updateEndpointData(
    messagesDefinition.GET,
    logger,
    (old) => {
      const existing = old?.success ? old.data.messages : [];
      const updated = updater(existing);
      result.push(updated);
      return success({
        backgroundTasks: old?.success ? old.data.backgroundTasks : [],
        messages: updated,
      });
    },
    { urlPathParams: { threadId }, requestData: { rootFolderId } },
  );

  if (result.length > 0) {
    // Seed per-item cache for every message in the updated list.
    // React Query's replaceEqualDeep means unchanged messages keep their
    // existing references - only the actually-changed message triggers re-renders.
    for (const msg of result[0]!) {
      seedMessageItemCache(msg);
    }

    // Incognito: persist changed messages to localStorage.
    if (rootFolderId === DefaultFolderId.INCOGNITO) {
      for (const msg of result[0]!) {
        void saveMessage(msg);
      }
    }
  }
}

/**
 * Add or replace a single message in the cache.
 * Convenience wrapper around updateMessages for upsert operations.
 */
export function upsertMessage(
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
  message: ChatMessage,
): void {
  updateMessages(threadId, rootFolderId, logger, (msgs) => {
    const idx = msgs.findIndex((m) => m.id === message.id);
    if (idx === -1) {
      return [...msgs, message];
    }
    const next = [...msgs];
    next[idx] = message;
    return next;
  });
}

/**
 * Patch a single message's fields in the cache.
 * Convenience wrapper for partial updates.
 */
export function patchMessage(
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
  messageId: string,
  patch: Partial<ChatMessage>,
): void {
  updateMessages(threadId, rootFolderId, logger, (msgs) =>
    msgs.map((m) =>
      m.id === messageId ? { ...m, ...patch, updatedAt: new Date() } : m,
    ),
  );
}

/**
 * Remove a message from the cache, re-parenting its children to its parent.
 */
export function removeMessage(
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
  messageId: string,
): void {
  updateMessages(threadId, rootFolderId, logger, (msgs) => {
    const target = msgs.find((m) => m.id === messageId);
    const targetParentId = target?.parentId ?? null;
    return msgs
      .filter((m) => m.id !== messageId)
      .map((m) =>
        m.parentId === messageId ? { ...m, parentId: targetParentId } : m,
      );
  });
}
