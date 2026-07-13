import "server-only";

import { and, asc, eq, inArray, or, sql } from "drizzle-orm";
import { WidgetDataSchema } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type {
  StandardSyncCursor,
  SyncDomain,
} from "next-vibe/remote-connection/db";
import {
  type SyncProvider,
  toStandardCursor,
} from "next-vibe/remote-connection/sync/provider";
import { z } from "zod";

import { cortexNodes } from "./db";
import { CortexNodeType, CortexSyncPolicy } from "./enum";
import { DOCUMENTS_PREFIX, MEMORIES_PREFIX } from "./repository";

// ─── Wire Schema ─────────────────────────────────────────────────────────────

const syncedNodeSchema = z.object({
  syncId: z.string(),
  path: z.string(),
  content: z.string().nullable(),
  size: z.number(),
  frontmatter: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean(), z.null()]),
  ),
  tags: z
    .union([z.array(z.string()), z.record(z.string(), WidgetDataSchema)])
    .transform((v) => (Array.isArray(v) ? v : [])),
  nodeType: z.enum([CortexNodeType.FILE, CortexNodeType.DIR]),
  updatedAt: z.string(),
  isDeleted: z.boolean().optional(),
});

type SyncedNode = z.infer<typeof syncedNodeSchema>;

// ─── Factory ─────────────────────────────────────────────────────────────────

function nodeFilter(
  userId: string,
  pathPrefix: string,
): ReturnType<typeof and> {
  return and(
    eq(cortexNodes.userId, userId),
    or(
      eq(cortexNodes.path, pathPrefix),
      sql`${cortexNodes.path} LIKE ${`${pathPrefix}/%`}`,
    ),
    or(
      sql`${cortexNodes.syncPolicy} IS NULL`,
      eq(cortexNodes.syncPolicy, CortexSyncPolicy.SYNC),
    ),
    sql`${cortexNodes.syncId} IS NOT NULL`,
  );
}

function makeCortexNodeSyncProvider(
  pathPrefix: string,
  key: SyncDomain,
  labelKey: string,
): SyncProvider {
  const filter = (userId: string): ReturnType<typeof nodeFilter> =>
    nodeFilter(userId, pathPrefix);

  return {
    key,
    labelKey,

    async getCursor(userId): Promise<StandardSyncCursor> {
      const [row] = await db
        .select({ updatedAt: cortexNodes.updatedAt })
        .from(cortexNodes)
        .where(filter(userId))
        .orderBy(sql`${cortexNodes.updatedAt} DESC`)
        .limit(1);

      return {
        updatedAt: row?.updatedAt.toISOString() ?? new Date(0).toISOString(),
      };
    },

    async serializeFromCursor(userId, cursor, logger) {
      const typedCursor = toStandardCursor(cursor);
      const fallbackCursor: StandardSyncCursor = typedCursor ?? {
        updatedAt: new Date(0).toISOString(),
      };
      try {
        // Compare at MILLISECOND precision: the served updatedAt is serialized via
        // toISOString() (ms), but Postgres stores µs. Without truncation the
        // boundary row whose µs tail is non-zero is strictly greater than the
        // returned ms cursor and re-syncs forever. date_trunc keeps the round-trip
        // exact so a current cursor short-circuits to empty.
        // Pass cursor as a raw SQL string literal to avoid pg driver timezone
        // conversion. The DB stores TIMESTAMP WITHOUT TIMEZONE in local time;
        // new Date(cursor) → toISOString() → pg converts to local+offset, making
        // the comparison 2h ahead in CEST and returning 0 rows.
        const where = typedCursor
          ? and(
              filter(userId),
              sql`date_trunc('milliseconds', ${cortexNodes.updatedAt}) > ${typedCursor.updatedAt}::timestamp`,
            )
          : filter(userId);

        const rows = await db
          .select()
          .from(cortexNodes)
          .where(where)
          .orderBy(asc(cortexNodes.updatedAt));

        const items: SyncedNode[] = rows
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
            ...(r.isDeleted ? { isDeleted: true } : {}),
          }));

        const lastIncluded = items[items.length - 1];
        return {
          json: JSON.stringify(items),
          cursor: lastIncluded
            ? { updatedAt: lastIncluded.updatedAt }
            : fallbackCursor,
        };
      } catch (error) {
        logger.error(`Failed to serialize ${key} for sync`, parseError(error));
        return { json: "[]", cursor: fallbackCursor };
      }
    },

    async upsertFromJson(json, userId, logger) {
      const remoteNodes = z.array(syncedNodeSchema).parse(JSON.parse(json));
      let synced = 0;

      const existingRows =
        remoteNodes.length > 0
          ? await db
              .select({
                id: cortexNodes.id,
                syncId: cortexNodes.syncId,
                path: cortexNodes.path,
                updatedAt: cortexNodes.updatedAt,
              })
              .from(cortexNodes)
              .where(
                and(
                  eq(cortexNodes.userId, userId),
                  or(
                    inArray(
                      cortexNodes.syncId,
                      remoteNodes.map((n) => n.syncId),
                    ),
                    inArray(
                      cortexNodes.path,
                      remoteNodes.map((n) => n.path),
                    ),
                  ),
                ),
              )
          : [];

      const existingBySyncId = new Map<
        string,
        { id: string; path: string; updatedAt: Date }
      >();
      const existingByPath = new Map<
        string,
        { id: string; path: string; updatedAt: Date }
      >();
      for (const row of existingRows) {
        if (row.syncId !== null) {
          existingBySyncId.set(row.syncId, row);
        }
        existingByPath.set(row.path, row);
      }

      const insertRows: (typeof cortexNodes.$inferInsert)[] = [];

      for (const remoteNode of remoteNodes) {
        try {
          if (remoteNode.isDeleted) {
            await db
              .delete(cortexNodes)
              .where(
                and(
                  eq(cortexNodes.userId, userId),
                  eq(cortexNodes.syncId, remoteNode.syncId),
                ),
              );
            const deleted = existingBySyncId.get(remoteNode.syncId);
            if (deleted) {
              existingBySyncId.delete(remoteNode.syncId);
              existingByPath.delete(deleted.path);
            }
            synced++;
            continue;
          }

          const existing =
            existingBySyncId.get(remoteNode.syncId) ??
            existingByPath.get(remoteNode.path);

          const remoteTime = new Date(remoteNode.updatedAt).getTime();

          if (existing) {
            // Last-writer-wins; tie → remote wins (deterministic tiebreak per spec)
            if (remoteTime >= existing.updatedAt.getTime()) {
              await db
                .update(cortexNodes)
                .set({
                  syncId: remoteNode.syncId,
                  path: remoteNode.path,
                  content: remoteNode.content,
                  size: remoteNode.size,
                  frontmatter: remoteNode.frontmatter,
                  tags: remoteNode.tags,
                  nodeType: remoteNode.nodeType,
                  updatedAt: new Date(remoteNode.updatedAt),
                })
                .where(eq(cortexNodes.id, existing.id));
            }
          } else {
            insertRows.push({
              userId,
              syncId: remoteNode.syncId,
              path: remoteNode.path,
              content: remoteNode.content,
              size: remoteNode.size,
              frontmatter: remoteNode.frontmatter,
              tags: remoteNode.tags,
              nodeType: remoteNode.nodeType,
              updatedAt: new Date(remoteNode.updatedAt),
            });
          }

          synced++;
        } catch (error) {
          const parsed = parseError(error);
          logger.error(`Failed to upsert ${key} node`, {
            syncId: remoteNode.syncId,
            message: parsed.message,
            name: parsed.name,
          });
        }
      }

      for (let i = 0; i < insertRows.length; i += 1000) {
        const batch = insertRows.slice(i, i + 1000);
        try {
          await db.insert(cortexNodes).values(batch);
        } catch (error) {
          const parsed = parseError(error);
          logger.error(`Failed to batch insert ${key} nodes`, {
            message: parsed.message,
            name: parsed.name,
          });
        }
      }

      return synced;
    },
  };
}

// ─── Providers ───────────────────────────────────────────────────────────────

export const documentsSyncProvider = makeCortexNodeSyncProvider(
  DOCUMENTS_PREFIX,
  "documents",
  "documents",
);

export const memoriesSyncProvider = makeCortexNodeSyncProvider(
  MEMORIES_PREFIX,
  "memories",
  "memories",
);
