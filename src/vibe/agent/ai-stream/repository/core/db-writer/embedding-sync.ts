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
import { db } from "next-vibe/database";

import {
  DefaultFolderId,
  type ToolExecutionContext,
} from "@/app/api/[locale]/agent/chat/config";

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
  streamContext: ToolExecutionContext,
): Promise<void> {
  if (!attachments.length) {
    return;
  }

  const { readUploadPath } =
    await import("@/app/api/[locale]/agent/cortex/mounts/uploads");
  const { syncVirtualNodeToEmbedding } =
    await import("@/app/api/[locale]/agent/cortex/embeddings/sync-virtual");

  const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");
  const [thread] = await db
    .select({ title: chatThreads.title })
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId))
    .limit(1);

  const threadTitle = thread?.title ?? "Untitled";
  const threadSlug = `${threadTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50)}-${threadId}`;

  for (const att of attachments) {
    if (!att.filename) {
      continue;
    }
    const typeFolder = getMimeTypeFolder(att.mimeType);
    const safeFilename = att.filename
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50);
    const path = `/uploads/${typeFolder}/${threadSlug}/${safeFilename}.md`;
    const result = await readUploadPath(userId, path).catch(() => null);
    if (result) {
      await syncVirtualNodeToEmbedding(
        userId,
        path,
        result.content,
        streamContext,
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
  streamContext: ToolExecutionContext,
): Promise<void> {
  if (!lastThreadId) {
    return;
  }

  const { syncVirtualNodeToEmbedding } =
    await import("@/app/api/[locale]/agent/cortex/embeddings/sync-virtual");
  const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");

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
    .replace(/[^a-z0-9-]/g, "-")
    .slice(0, 50);

  await syncVirtualNodeToEmbedding(
    thread.userId,
    `/threads/${thread.rootFolderId}/${slug}-${thread.id}.md`,
    content,
    streamContext,
  );
}
