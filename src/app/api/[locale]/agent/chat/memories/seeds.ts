/**
 * Memories Migration Seed
 * Migrates memories from the legacy `memories` table to `cortex_nodes`.
 * Each memory becomes a markdown file at /memories/{memoryNumber}.md with YAML frontmatter.
 * Idempotent: skips users who already have /memories/ entries in cortex_nodes.
 */

import { and, eq, like, count as drizzleCount } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { cortexNodes } from "@/app/api/[locale]/agent/cortex/db";
import { CortexNodeType } from "@/app/api/[locale]/agent/cortex/enum";

import { memories, type Memory } from "./db";

/** Run after users + cortex schema exist */
export const priority = 50;

/**
 * Render a memory as markdown with YAML frontmatter
 */
function renderMemoryMarkdown(memory: Memory): string {
  const meta = memory.metadata;
  const source =
    meta && typeof meta.source === "string" ? meta.source : "legacy-migration";
  const confidence =
    meta && typeof meta.confidence === "number" ? meta.confidence : 0.8;

  const lines = [
    "---",
    `priority: ${memory.priority}`,
    `tags: [${memory.tags.join(", ")}]`,
    `isPublic: ${memory.isPublic}`,
    `isArchived: ${memory.isArchived}`,
    `isShared: ${memory.isShared}`,
    `source: ${source}`,
    `confidence: ${confidence}`,
    "---",
    "",
    memory.content,
  ];
  return lines.join("\n");
}

/**
 * Migrate all memories from the legacy table to cortex_nodes.
 * Runs on dev/prod — safe to re-run (idempotent).
 */
async function migrateMemories(logger: EndpointLogger): Promise<void> {
  // Get all distinct user IDs that have memories
  const allMemories = await db
    .select()
    .from(memories)
    .orderBy(memories.userId, memories.memoryNumber);

  if (allMemories.length === 0) {
    logger.info("No memories to migrate");
    return;
  }

  // Group by userId
  const byUser = new Map<string, typeof allMemories>();
  for (const mem of allMemories) {
    const existing = byUser.get(mem.userId);
    if (existing) {
      existing.push(mem);
    } else {
      byUser.set(mem.userId, [mem]);
    }
  }

  let totalMigrated = 0;
  let totalSkipped = 0;

  for (const [userId, userMemories] of byUser) {
    // Check if this user already has /memories/ entries in cortex_nodes
    const existingCount = await db
      .select({ count: drizzleCount() })
      .from(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, userId),
          like(cortexNodes.path, "/memories/%"),
          eq(cortexNodes.nodeType, CortexNodeType.FILE),
        ),
      );

    if ((existingCount[0]?.count ?? 0) > 0) {
      totalSkipped += userMemories.length;
      continue;
    }

    // Create /memories/ directory node if it doesn't exist
    const dirExists = await db
      .select({ id: cortexNodes.id })
      .from(cortexNodes)
      .where(
        and(eq(cortexNodes.userId, userId), eq(cortexNodes.path, "/memories")),
      )
      .limit(1);

    if (dirExists.length === 0) {
      await db.insert(cortexNodes).values({
        userId,
        path: "/memories",
        nodeType: CortexNodeType.DIR,
        content: null,
        size: 0,
      });
    }

    // Migrate each memory
    for (const mem of userMemories) {
      const path = `/memories/${mem.memoryNumber}.md`;
      const content = renderMemoryMarkdown(mem);

      const size = Buffer.byteLength(content, "utf8");
      const meta = mem.metadata;
      const syncId =
        meta && typeof meta.syncId === "string" ? meta.syncId : undefined;

      await db.insert(cortexNodes).values({
        userId: mem.userId,
        path,
        nodeType: CortexNodeType.FILE,
        content,
        size,
        frontmatter: {
          priority: mem.priority,
          isPublic: mem.isPublic,
          isArchived: mem.isArchived,
          isShared: mem.isShared,
        },
        tags: mem.tags,
        syncId: syncId ?? undefined,
        createdAt: mem.createdAt,
        updatedAt: mem.updatedAt,
      });
      totalMigrated++;
    }
  }

  logger.info(
    `Memories migration: ${totalMigrated} migrated, ${totalSkipped} skipped (already in cortex)`,
  );
}

export async function dev(logger: EndpointLogger): Promise<void> {
  await migrateMemories(logger);
}

export async function prod(logger: EndpointLogger): Promise<void> {
  await migrateMemories(logger);
}

export async function test(): Promise<void> {
  // No-op in test — test data should use cortex_nodes directly
}
