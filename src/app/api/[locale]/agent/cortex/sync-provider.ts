import "server-only";

/**
 * Documents Sync Provider
 * Registers Cortex documents for cross-instance sync via the unified SyncProvider interface.
 */

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/app/api/[locale]/system/db";
import type { SyncProvider } from "@/app/api/[locale]/system/unified-interface/tasks/task-sync/sync-provider";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { cortexNodes } from "./db";
import { CortexNodeType, CortexSyncPolicy } from "./enum";

// ─── Wire Schema ─────────────────────────────────────────────────────────────

const syncedDocumentSchema = z.object({
  syncId: z.string(),
  path: z.string(),
  content: z.string().nullable(),
  size: z.number(),
  frontmatter: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean(), z.null()]),
  ),
  tags: z.array(z.string()),
  /** Stored enum value, e.g. "enums.nodeType.file" or "enums.nodeType.dir" */
  nodeType: z.enum([CortexNodeType.FILE, CortexNodeType.DIR]),
  updatedAt: z.string(),
  isDeleted: z.boolean().optional(),
});

type SyncedDocument = z.infer<typeof syncedDocumentSchema>;

// ─── Provider ────────────────────────────────────────────────────────────────

export const documentsSyncProvider: SyncProvider = {
  key: "documents",

  async getHashEntries(userId) {
    const rows = await db
      .select({ syncId: cortexNodes.syncId, updatedAt: cortexNodes.updatedAt })
      .from(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, userId),
          sql`(${cortexNodes.syncPolicy} IS NULL OR ${cortexNodes.syncPolicy} = ${CortexSyncPolicy.SYNC})`,
          sql`${cortexNodes.syncId} IS NOT NULL`,
        ),
      );

    return rows
      .filter((r): r is typeof r & { syncId: string } => r.syncId !== null)
      .map((r) => ({
        syncId: r.syncId,
        updatedAt: r.updatedAt,
      }));
  },

  async serializeToJson(userId, logger) {
    try {
      const rows = await db
        .select()
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, userId),
            sql`(${cortexNodes.syncPolicy} IS NULL OR ${cortexNodes.syncPolicy} = ${CortexSyncPolicy.SYNC})`,
          ),
        )
        .limit(500);

      const result: SyncedDocument[] = rows
        .filter((r): r is typeof r & { syncId: string } => r.syncId !== null)
        .map((r) => ({
          syncId: r.syncId,
          path: r.path,
          content: r.content,
          size: r.size,
          frontmatter: r.frontmatter,
          tags: r.tags,
          nodeType: r.nodeType,
          updatedAt: r.updatedAt.toISOString(),
        }));

      return JSON.stringify(result);
    } catch (error) {
      logger.error("Failed to serialize documents for sync", parseError(error));
      return "[]";
    }
  },

  async upsertFromJson(json, userId, logger) {
    const remoteDocuments = z
      .array(syncedDocumentSchema)
      .parse(JSON.parse(json));
    let synced = 0;

    for (const remoteDoc of remoteDocuments) {
      try {
        if (remoteDoc.isDeleted) {
          // Tombstone: delete local document with matching syncId
          await db
            .delete(cortexNodes)
            .where(
              and(
                eq(cortexNodes.userId, userId),
                eq(cortexNodes.syncId, remoteDoc.syncId),
              ),
            );
          try {
            const { deleteFromDisk } =
              await import("@/app/api/[locale]/agent/cortex/fs-provider/fs-sync");
            await deleteFromDisk(remoteDoc.path);
          } catch {
            // Best-effort
          }
          synced++;
          continue;
        }

        // Match by syncId OR path (path wins if syncId not found - handles local docs without syncId)
        const [existing] = await db
          .select({ id: cortexNodes.id, updatedAt: cortexNodes.updatedAt })
          .from(cortexNodes)
          .where(
            and(
              eq(cortexNodes.userId, userId),
              sql`(${cortexNodes.syncId} = ${remoteDoc.syncId} OR ${cortexNodes.path} = ${remoteDoc.path})`,
            ),
          )
          .limit(1);

        const remoteTime = new Date(remoteDoc.updatedAt).getTime();

        if (existing) {
          // Last-writer-wins
          if (remoteTime > existing.updatedAt.getTime()) {
            await db
              .update(cortexNodes)
              .set({
                syncId: remoteDoc.syncId,
                path: remoteDoc.path,
                content: remoteDoc.content,
                size: remoteDoc.size,
                frontmatter: remoteDoc.frontmatter,
                tags: remoteDoc.tags,
                nodeType: remoteDoc.nodeType,
                updatedAt: new Date(remoteDoc.updatedAt),
              })
              .where(eq(cortexNodes.id, existing.id));
          }
        } else {
          // Genuinely new document
          await db.insert(cortexNodes).values({
            userId,
            syncId: remoteDoc.syncId,
            path: remoteDoc.path,
            content: remoteDoc.content,
            size: remoteDoc.size,
            frontmatter: remoteDoc.frontmatter,
            tags: remoteDoc.tags,
            nodeType: remoteDoc.nodeType,
            updatedAt: new Date(remoteDoc.updatedAt),
          });
        }

        // Disk write-through
        if (remoteDoc.content !== null) {
          try {
            const { syncToDisk } =
              await import("@/app/api/[locale]/agent/cortex/fs-provider/fs-sync");
            await syncToDisk(remoteDoc.path, remoteDoc.content);
          } catch {
            // Best-effort
          }
        }

        synced++;
      } catch (error) {
        const parsed = parseError(error);
        logger.error("Failed to upsert shared document", {
          syncId: remoteDoc.syncId,
          message: parsed.message,
          name: parsed.name,
        });
      }
    }

    return synced;
  },
};
