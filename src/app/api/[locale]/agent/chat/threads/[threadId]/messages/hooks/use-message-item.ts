"use client";

/**
 * useMessageItem — O(1) per-delta subscription to a single message.
 *
 * Uses a per-item React Query cache key (layer 2) seeded by updateMessages.
 * When a streaming delta updates message Y, only message Y's component
 * re-renders — all other message components are unaffected.
 *
 * Replaces useStreamingMessagesStore for per-message live state reads.
 * Components use message.metadata?.isStreaming instead of streamingStore.isStreaming.
 */

import { useQuery } from "@tanstack/react-query";

import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";

import { messageItemQueryKey } from "./update-messages";

/**
 * Subscribe to a single message from the per-item cache.
 *
 * Returns the current ChatMessage (or undefined if not yet seeded).
 * Only re-renders when this specific message's data changes.
 *
 * @param messageId - The message to subscribe to
 */
export function useMessageItem(messageId: string): ChatMessage | undefined {
  return useQuery<ChatMessage | undefined>({
    queryKey: messageItemQueryKey(messageId),
    // enabled: false — never fetches. Data is written exclusively via
    // seedMessageItemCache (called by updateMessages on every write).
    // useQuery here is purely a reactive subscription to the cache entry.
    queryFn: () => Promise.resolve(undefined),
    enabled: false,
    staleTime: Infinity,
    // Only notify observers when data changes — not on isFetching, dataUpdatedAt, etc.
    notifyOnChangeProps: ["data"],
  }).data;
}
