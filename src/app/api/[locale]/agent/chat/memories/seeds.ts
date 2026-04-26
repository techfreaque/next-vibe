/**
 * Memories Migration Seed
 * Migrates memories from the legacy `memories` table to `cortex_nodes`.
 * Each memory becomes a markdown file at /memories/inbox/{memoryNumber}.md with YAML frontmatter.
 * Also creates scaffold dirs (inbox, identity, expertise, context, life) for each user.
 * Idempotent: skips entries that already exist via onConflictDoNothing.
 */

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { cortexNodes } from "@/app/api/[locale]/agent/cortex/db";
import { CortexNodeType } from "@/app/api/[locale]/agent/cortex/enum";
import { queueEmbedding } from "@/app/api/[locale]/agent/cortex/embeddings/auto-embed";

import { memories, type Memory } from "./db";

/** Run before cortex seeds (priority 60) so migrated memories exist when cortex scaffolds */
export const priority = 70;

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

  const SCAFFOLD_DIRS = [
    "/memories",
    "/memories/inbox",
    "/memories/identity",
    "/memories/expertise",
    "/memories/context",
    "/memories/life",
  ];

  let totalMigrated = 0;
  let totalSkipped = 0;

  for (const [userId, userMemories] of byUser) {
    // Ensure scaffold dirs exist
    for (const dirPath of SCAFFOLD_DIRS) {
      await db
        .insert(cortexNodes)
        .values({
          userId,
          path: dirPath,
          nodeType: CortexNodeType.DIR,
          content: null,
          size: 0,
        })
        .onConflictDoNothing();
    }

    // Migrate each memory into /memories/inbox/
    for (const mem of userMemories) {
      const path = `/memories/inbox/${mem.memoryNumber}.md`;
      const content = renderMemoryMarkdown(mem);
      const size = Buffer.byteLength(content, "utf8");
      const meta = mem.metadata;
      const syncId =
        meta && typeof meta.syncId === "string" ? meta.syncId : undefined;

      const [row] = await db
        .insert(cortexNodes)
        .values({
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
        })
        .onConflictDoNothing()
        .returning({ id: cortexNodes.id });

      if (row) {
        queueEmbedding(row.id, path, content);
        totalMigrated++;
      } else {
        totalSkipped++;
      }
    }
  }

  logger.info(
    `Memories migration: ${totalMigrated} migrated to /memories/inbox/, ${totalSkipped} skipped (already in cortex)`,
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
