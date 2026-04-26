import "server-only";

/**
 * Threads Virtual Mount
 * Renders chat threads as markdown files at /threads/<rootFolder>/<folder>/<thread>.md
 */

import { and, desc, count as drizzleCount, eq, isNull } from "drizzle-orm";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import {
  chatFolders,
  chatMessages,
  chatThreads,
} from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { db } from "@/app/api/[locale]/system/db";

import type { VirtualListEntry, VirtualReadResult } from "./resolver";

const ROOT_FOLDERS: readonly DefaultFolderId[] = [
  DefaultFolderId.PRIVATE,
  DefaultFolderId.SHARED,
  DefaultFolderId.PUBLIC,
  DefaultFolderId.BACKGROUND,
];

function isRootFolder(value: string): value is DefaultFolderId {
  return ROOT_FOLDERS.includes(value as DefaultFolderId);
}

/**
 * Slugify a thread title for use as a filename
 */
function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "untitled"
  );
}

/**
 * Read a thread rendered as markdown.
 * Path formats:
 *   /threads/private/<threadId>.md
 *   /threads/private/<folderId>/<threadId>.md
 */
export async function readThreadPath(
  userId: string,
  path: string,
): Promise<VirtualReadResult | null> {
  // Extract the thread ID from the path - it's always the last segment ending in .md
  const segments = path.split("/").filter(Boolean);
  // threads / rootFolder / [folder /] threadId.md
  if (segments.length < 3) {
    return null;
  }

  const lastSegment = segments[segments.length - 1];
  if (!lastSegment) {
    return null;
  }

  // The threadId is embedded in the filename: could be a UUID or slug-uuid
  // Try to find the thread by matching the end of the filename as UUID
  const uuidMatch = lastSegment.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i,
  );

  if (!uuidMatch) {
    return null;
  }

  const threadId = uuidMatch[1];
  const thread = await db
    .select()
    .from(chatThreads)
    .where(and(eq(chatThreads.id, threadId), eq(chatThreads.userId, userId)))
    .limit(1)
    .then((rows) => rows[0]);

  if (!thread) {
    return null;
  }

  // Fetch messages (most recent 100 for rendering)
  const messages = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.threadId, threadId))
    .orderBy(chatMessages.createdAt)
    .limit(100);

  // Build markdown
  const frontmatterLines = [
    "---",
    `threadId: "${thread.id}"`,
    `title: "${(thread.title ?? "Untitled").replace(/"/g, '\\"')}"`,
  ];

  if (thread.defaultModel) {
    frontmatterLines.push(`model: "${thread.defaultModel}"`);
  }
  if (thread.defaultSkill) {
    frontmatterLines.push(`skill: "${thread.defaultSkill}"`);
  }
  if (thread.tags && thread.tags.length > 0) {
    frontmatterLines.push(`tags: [${thread.tags.join(", ")}]`);
  }
  frontmatterLines.push(
    `status: "${thread.status}"`,
    `rootFolder: "${thread.rootFolderId}"`,
    `created: "${thread.createdAt.toISOString()}"`,
    `updated: "${thread.updatedAt.toISOString()}"`,
    "---",
  );

  const messageLines: string[] = [];
  for (const msg of messages) {
    if (!msg.content && !msg.metadata) {
      continue;
    }

    const timestamp = msg.createdAt
      .toISOString()
      .slice(0, 16)
      .replace("T", " ");

    if (msg.role === ChatMessageRole.USER) {
      messageLines.push(`\n**User** (${timestamp}):\n${msg.content ?? ""}`);
    } else if (msg.role === ChatMessageRole.ASSISTANT) {
      const model = msg.model ? ` [${msg.model}]` : "";
      messageLines.push(
        `\n**Assistant**${model} (${timestamp}):\n${msg.content ?? ""}`,
      );
    } else if (msg.role === ChatMessageRole.TOOL) {
      const toolCall = msg.metadata?.toolCall;
      if (toolCall) {
        const argsStr = toolCall.args
          ? JSON.stringify(toolCall.args, null, 2)
          : "";
        const resultStr = toolCall.result
          ? typeof toolCall.result === "string"
            ? toolCall.result
            : JSON.stringify(toolCall.result, null, 2)
          : "";
        messageLines.push(
          `\n**Tool** \`${toolCall.toolName ?? "unknown"}\` (${timestamp}):\n\`\`\`\n${argsStr}\n\`\`\`\nResult:\n\`\`\`\n${resultStr}\n\`\`\``,
        );
      }
    } else if (msg.role === ChatMessageRole.SYSTEM) {
      messageLines.push(`\n*[System]* (${timestamp}):\n${msg.content ?? ""}`);
    }
  }

  const content = `${frontmatterLines.join("\n")}\n${messageLines.join("\n")}`;

  return {
    content,
    nodeType: "file",
    updatedAt: thread.updatedAt.toISOString(),
  };
}

/**
 * List threads/folders at a virtual path
 */
export async function listThreadPath(
  userId: string,
  path: string,
): Promise<VirtualListEntry[]> {
  if (path === "/threads") {
    // List root folders
    return ROOT_FOLDERS.map((id) => ({
      name: id,
      path: `/threads/${id}`,
      nodeType: "dir" as const,
      size: null,
      updatedAt: new Date().toISOString(),
    }));
  }

  // /threads/<rootFolder>
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 2) {
    const rootFolderSegment = segments[1];
    if (!isRootFolder(rootFolderSegment)) {
      return [];
    }
    const rootFolderId = rootFolderSegment;

    // Get subfolders at root level
    const folders = await db
      .select()
      .from(chatFolders)
      .where(
        and(
          eq(chatFolders.userId, userId),
          eq(chatFolders.rootFolderId, rootFolderId),
          isNull(chatFolders.parentId),
        ),
      )
      .orderBy(chatFolders.sortOrder);

    // Get threads at root level (no folder)
    const threads = await db
      .select()
      .from(chatThreads)
      .where(
        and(
          eq(chatThreads.userId, userId),
          eq(chatThreads.rootFolderId, rootFolderId),
          isNull(chatThreads.folderId),
        ),
      )
      .orderBy(desc(chatThreads.updatedAt));

    const entries: VirtualListEntry[] = [];

    for (const folder of folders) {
      entries.push({
        name: folder.name,
        path: `/threads/${rootFolderId}/${folder.id}`,
        nodeType: "dir",
        size: null,
        updatedAt: folder.updatedAt.toISOString(),
      });
    }

    for (const thread of threads) {
      const slug = slugify(thread.title ?? "untitled");
      entries.push({
        name: `${slug}-${thread.id}.md`,
        path: `/threads/${rootFolderId}/${slug}-${thread.id}.md`,
        nodeType: "file",
        size: null,
        updatedAt: thread.updatedAt.toISOString(),
      });
    }

    return entries;
  }

  // /threads/<rootFolder>/<folderId> - list threads in a subfolder
  if (segments.length === 3) {
    if (!isRootFolder(segments[1])) {
      return [];
    }
    const rootFolderId = segments[1];
    const folderId = segments[2];

    // Get threads in this folder
    const threads = await db
      .select()
      .from(chatThreads)
      .where(
        and(
          eq(chatThreads.userId, userId),
          eq(chatThreads.rootFolderId, rootFolderId),
          eq(chatThreads.folderId, folderId),
        ),
      )
      .orderBy(desc(chatThreads.updatedAt));

    // Get subfolders
    const subfolders = await db
      .select()
      .from(chatFolders)
      .where(
        and(eq(chatFolders.userId, userId), eq(chatFolders.parentId, folderId)),
      )
      .orderBy(chatFolders.sortOrder);

    const entries: VirtualListEntry[] = [];

    for (const folder of subfolders) {
      entries.push({
        name: folder.name,
        path: `/threads/${rootFolderId}/${folderId}/${folder.id}`,
        nodeType: "dir",
        size: null,
        updatedAt: folder.updatedAt.toISOString(),
      });
    }

    for (const thread of threads) {
      const slug = slugify(thread.title ?? "untitled");
      entries.push({
        name: `${slug}-${thread.id}.md`,
        path: `/threads/${rootFolderId}/${folderId}/${slug}-${thread.id}.md`,
        nodeType: "file",
        size: null,
        updatedAt: thread.updatedAt.toISOString(),
      });
    }

    return entries;
  }

  return [];
}

/**
 * Get thread counts by root folder
 */
export async function getThreadCounts(
  userId: string,
): Promise<{ total: number; byRoot: Record<string, number> }> {
  const rows = await db
    .select({
      rootFolderId: chatThreads.rootFolderId,
      count: drizzleCount(),
    })
    .from(chatThreads)
    .where(eq(chatThreads.userId, userId))
    .groupBy(chatThreads.rootFolderId);

  let total = 0;
  const byRoot: Record<string, number> = {};
  for (const row of rows) {
    byRoot[row.rootFolderId] = row.count;
    total += row.count;
  }

  return { total, byRoot };
}
