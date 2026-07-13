/**
 * Remote instance folder lifecycle — exactly ONE folder per instance name.
 *
 * `REMOTE/<instanceId>` is the single canonical folder for a peer. Connect and
 * the live sync appliers both resolve it find-or-create by name through the
 * same advisory-locked creator, so reconnects and concurrent mirror writes
 * always converge on the same row. Disconnect leaves the folder (and its
 * mirrored threads) untouched — "disconnected" is derived from the absence of
 * a remoteConnections row, never encoded in the folder name.
 */

import "server-only";

import { and, eq, isNull } from "drizzle-orm";
import { db } from "next-vibe/database";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatFolders } from "@/app/api/[locale]/agent/chat/db";

function topLevelRemoteFolderByName(
  userId: string,
  name: string,
): ReturnType<typeof and> {
  return and(
    eq(chatFolders.userId, userId),
    eq(chatFolders.rootFolderId, DefaultFolderId.REMOTE),
    eq(chatFolders.name, name),
    isNull(chatFolders.parentId),
  );
}

/**
 * Ensure the top-level `REMOTE/<instanceId>` folder exists and return its id.
 * Delegates to the advisory-locked chain creator — the same path the live
 * sync appliers use — so connect racing a sync apply yields one folder.
 * Returns null only when the insert itself fails (caller treats as non-fatal).
 */
export async function ensureInstanceFolder(
  userId: string,
  instanceId: string,
): Promise<string | null> {
  const { ensureFolderChain } =
    await import("@/app/api/[locale]/agent/chat/threads/sync-provider");
  return ensureFolderChain(userId, DefaultFolderId.REMOTE, [instanceId]);
}

/**
 * Rename the instance folder when the peer renames itself:
 * `REMOTE/<oldInstanceId>` → `REMOTE/<newInstanceId>`. No-op when the folder
 * does not exist (nothing was ever synced from that peer).
 */
export async function renameInstanceFolder(
  userId: string,
  oldInstanceId: string,
  newInstanceId: string,
): Promise<void> {
  await db
    .update(chatFolders)
    .set({ name: newInstanceId, updatedAt: new Date() })
    .where(topLevelRemoteFolderByName(userId, oldInstanceId));
}
