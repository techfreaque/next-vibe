/**
 * Branch-aware parent resolution utilities.
 *
 * When inserting deferred messages (wakeUp revival, approve confirmation),
 * the deferred result must be appended to the *current tip* of the branch
 * that was active when the tool was called — not a stale leafMessageId and
 * not the global latest message (which may be on a different branch).
 *
 * walkToLeafMessage walks forward from a given message ID following the
 * latest child at each level, until it reaches a node with no children.
 * That node is the true current branch tip.
 */

import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { chatMessages } from "@/app/api/[locale]/agent/chat/db";
import { db } from "@/app/api/[locale]/system/db";

/**
 * Walk forward from `startId` through the latest child chain until we
 * reach a leaf (no children). Returns the leaf message ID.
 *
 * Falls back to `startId` if no children exist (it's already the leaf).
 * Falls back to `fallback` if `startId` is undefined/null.
 */
export async function walkToLeafMessage(
  threadId: string,
  startId: string | null | undefined,
  fallback: string,
): Promise<string> {
  if (!startId) {
    return fallback;
  }

  let currentId = startId;
  // Safety cap: at most 200 hops (threads should never be deeper than this).
  for (let i = 0; i < 200; i++) {
    const [child] = await db
      .select({ id: chatMessages.id })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.threadId, threadId),
          eq(chatMessages.parentId, currentId),
        ),
      )
      .orderBy(desc(chatMessages.createdAt))
      .limit(1);

    if (!child) {
      break;
    }
    currentId = child.id;
  }

  return currentId;
}
