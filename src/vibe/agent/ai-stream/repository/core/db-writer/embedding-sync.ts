/**
 * Embedding sync - fire-and-forget syncing of uploads, the current thread
 * stub, and per-message embeddings into cortex for vector search.
 * Uses dynamic imports to avoid circular dependencies.
 * Plain functions - MessageDbWriter calls them.
 *
 * Search and gen tool results sync themselves in their own repositories.
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  DefaultFolderId,
  type ToolExecutionContext,
} from "../../../../../core/execution-context";
import { db } from "next-vibe/database";

import { buildThinThreadContent, getMimeTypeFolder } from "./shared";

/**
 * Sync file uploads to cortex_nodes for vector search.
 * Called fire-and-forget from FileUploadEventHandler after upload completes.
 * All data is passed in directly — no DB re-fetch needed.
 */
export async function syncUploadEmbedding(
  userId: string,
  threadId: string,
  attachments: Array<{ filename: string; mimeType: string }>,
  toolExecutionContext: ToolExecutionContext,
): Promise<void> {
  if (attachments.length === 0) {
    return;
  }

  const { readUploadPath } = await import("../../../../cortex/mounts/uploads");
  const { syncVirtualNodeToEmbedding } =
    await import("../../../../cortex/embeddings/sync-virtual");

  const { chatThreads } = await import("../../../../chat/db");
  const [thread] = await db
    .select({ title: chatThreads.title })
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId))
    .limit(1);

  const threadTitle = thread?.title ?? "Untitled";
  const threadSlug = `${threadTitle
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "")
    .slice(0, 50)}-${threadId}`;

  for (const att of attachments) {
    if (!att.filename) {
      continue;
    }
    const typeFolder = getMimeTypeFolder(att.mimeType);
    const safeFilename = att.filename
      .toLowerCase()
      .replaceAll(/[^a-z0-9.]+/g, "-")
      .replaceAll(/^-|-$/g, "")
      .slice(0, 50);
    const path = `/uploads/${typeFolder}/${threadSlug}/${safeFilename}.md`;
    const result = await readUploadPath(userId, path).catch(() => null);
    if (result) {
      await syncVirtualNodeToEmbedding(
        userId,
        path,
        result.content,
        toolExecutionContext,
      ).catch(() => undefined);
    }
  }
}

/**
 * Sync the current thread to cortex_nodes for vector search.
 * Stores a thin reference (title + tags + preview) as a directory stub.
 * Semantic content lives in per-message embeddings on chatMessages.
 * Fire-and-forget safe - errors are silently caught by the caller.
 */
export async function syncThreadEmbedding(
  lastThreadId: string | null,
  toolExecutionContext: ToolExecutionContext,
): Promise<void> {
  if (!lastThreadId) {
    return;
  }

  const { syncVirtualNodeToEmbedding } =
    await import("../../../../cortex/embeddings/sync-virtual");
  const { chatThreads } = await import("../../../../chat/db");

  const [thread] = await db
    .select({
      id: chatThreads.id,
      userId: chatThreads.userId,
      title: chatThreads.title,
      rootFolderId: chatThreads.rootFolderId,
      tags: chatThreads.tags,
      description: chatThreads.description,
    })
    .from(chatThreads)
    .where(eq(chatThreads.id, lastThreadId))
    .limit(1);

  if (!thread?.userId) {
    return;
  }
  // NEVER embed incognito threads — they are ephemeral and must leave no
  // searchable trace in cortex (title/tags included).
  if (thread.rootFolderId === DefaultFolderId.INCOGNITO) {
    return;
  }

  const content = buildThinThreadContent(thread);

  const slug = (thread.title ?? "thread")
    .toLowerCase()
    .replaceAll(/[^a-z0-9-]/g, "-")
    .slice(0, 50);

  await syncVirtualNodeToEmbedding(
    thread.userId,
    `/threads/${thread.rootFolderId}/${slug}-${thread.id}.md`,
    content,
    toolExecutionContext,
  );
}
