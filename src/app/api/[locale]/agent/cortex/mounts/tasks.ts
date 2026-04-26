import "server-only";

/**
 * Tasks Virtual Mount
 * Renders cron tasks as markdown files at /tasks/<taskId>.md
 */

import { count as drizzleCount, eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";

import type { VirtualListEntry, VirtualReadResult } from "./resolver";

/**
 * Read a cron task as markdown
 * Path: /tasks/<taskId>
 */
export async function readTaskPath(
  userId: string,
  path: string,
): Promise<VirtualReadResult | null> {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) {
    return null;
  }

  const taskId = segments[1].replace(/\.md$/, "");

  const rows = await db
    .select()
    .from(cronTasks)
    .where(eq(cronTasks.id, taskId))
    .limit(1);

  const task = rows[0];
  if (!task) {
    return null;
  }

  // Only allow reading own tasks
  if (task.userId !== userId) {
    return null;
  }

  const frontmatterLines = [
    "---",
    `taskId: "${task.id}"`,
    `name: "${(task.displayName ?? "Unnamed").replace(/"/g, '\\"')}"`,
    `status: "${task.lastExecutionStatus ?? "pending"}"`,
    `enabled: ${task.enabled}`,
  ];

  if (task.schedule) {
    frontmatterLines.push(`cron: "${task.schedule}"`);
  }

  frontmatterLines.push(`created: "${task.createdAt.toISOString()}"`, "---");

  const body = task.description ?? "";
  const content = `${frontmatterLines.join("\n")}\n\n${body}`;

  return {
    content,
    nodeType: "file",
    updatedAt: task.updatedAt.toISOString(),
  };
}

/**
 * List tasks
 */
export async function listTaskPath(
  userId: string,
  path: string,
): Promise<VirtualListEntry[]> {
  if (path !== "/tasks") {
    return [];
  }

  const rows = await db
    .select()
    .from(cronTasks)
    .where(eq(cronTasks.userId, userId))
    .orderBy(cronTasks.displayName);

  return rows.map((t) => ({
    name: `${t.id}.md`,
    path: `/tasks/${t.id}`,
    nodeType: "file" as const,
    size: t.description ? Buffer.byteLength(t.description, "utf8") : 0,
    updatedAt: t.updatedAt.toISOString(),
  }));
}

export interface VirtualSearchHit {
  path: string;
  excerpt: string;
  updatedAt: Date;
}

/**
 * Direct keyword search across cron tasks — one DB query.
 */
export async function searchTasks(
  userId: string,
  query: string,
  limit: number,
): Promise<VirtualSearchHit[]> {
  const rows = await db
    .select({
      id: cronTasks.id,
      displayName: cronTasks.displayName,
      description: cronTasks.description,
      updatedAt: cronTasks.updatedAt,
    })
    .from(cronTasks)
    .where(eq(cronTasks.userId, userId))
    .limit(limit * 10); // fetch more, filter client-side since ilike on two cols

  const lq = query.toLowerCase();
  const hits: VirtualSearchHit[] = [];
  for (const t of rows) {
    const text = `${t.displayName ?? ""} ${t.description ?? ""}`.toLowerCase();
    if (!text.includes(lq)) {
      continue;
    }
    const excerpt = (t.description ?? t.displayName ?? "").slice(0, 150);
    hits.push({
      path: `/tasks/${t.id}`,
      excerpt,
      updatedAt: t.updatedAt,
    });
    if (hits.length >= limit) {
      break;
    }
  }
  return hits;
}

/**
 * Get task count
 */
export async function getTaskCount(userId: string): Promise<number> {
  const rows = await db
    .select({ count: drizzleCount() })
    .from(cronTasks)
    .where(eq(cronTasks.userId, userId));

  return rows[0]?.count ?? 0;
}
