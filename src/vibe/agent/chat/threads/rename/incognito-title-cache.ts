/**
 * Incognito Rename Cache
 *
 * Incognito threads have no DB row, so a rename performed mid-turn would be
 * invisible to the thread-rename system-prompt fragment (which reads titles
 * from the DB for server threads). The rename repository records incognito
 * renames here so the mid-loop trailing-prompt refresh sees the new title
 * immediately and stops re-issuing the MANDATORY rename instruction within
 * the same turn. The client's localStorage stays the durable source of truth —
 * it sends the current title/description with every stream request, so a
 * process restart only loses this same-turn shortcut, nothing else.
 */

import "server-only";

const MAX_ENTRIES = 1000;

const cache = new Map<string, { title: string; description: string | null }>();

export function recordIncognitoRename(
  threadId: string,
  title: string,
  description: string | null,
): void {
  // Re-insert so Map iteration order doubles as LRU order.
  cache.delete(threadId);
  cache.set(threadId, { title, description });
  if (cache.size > MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) {
      cache.delete(oldest);
    }
  }
}

export function getIncognitoRename(
  threadId: string,
): { title: string; description: string | null } | null {
  return cache.get(threadId) ?? null;
}
