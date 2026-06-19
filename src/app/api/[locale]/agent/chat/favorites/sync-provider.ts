import "server-only";

/**
 * Favorites Sync Provider
 * Registers chat favorites for cross-instance sync via the unified SyncProvider interface.
 *
 * Dedup key: (skillId, variantId) — same favorite is never duplicated regardless of local UUID.
 * Instance-local fields (useCount, lastUsedAt) are NOT synced.
 * Last-writer-wins on updatedAt; tie → remote wins.
 */
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { IconKeyDB } from "next-vibe-ui/unified/form-fields/icon-field/icons";
import { z } from "zod";

import { chatModelSelectionSchema } from "@/app/api/[locale]/agent/ai-stream/models";
import {
  audioVisionModelSelectionSchema,
  imageVisionModelSelectionSchema,
  videoVisionModelSelectionSchema,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import { imageGenModelSelectionSchema } from "@/app/api/[locale]/agent/image-generation/models";
import { musicGenModelSelectionSchema } from "@/app/api/[locale]/agent/music-generation/models";
import { sttModelSelectionSchema } from "@/app/api/[locale]/agent/speech-to-text/models";
import { voiceModelSelectionSchema } from "@/app/api/[locale]/agent/text-to-speech/models";
import { videoGenModelSelectionSchema } from "@/app/api/[locale]/agent/video-generation/models";
import type { StandardSyncCursor } from "@/app/api/[locale]/remote-connection/db";
import {
  type SyncProvider,
  toStandardCursor,
} from "@/app/api/[locale]/remote-connection/sync-provider";
import { db } from "@/app/api/[locale]/system/db";

import { chatFavorites } from "./db";

// ─── Wire Schema ─────────────────────────────────────────────────────────────

const syncedFavoriteSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  skillId: z.string(),
  variantId: z.string().nullable(),
  customVariantName: z.string().nullable(),
  customIcon: z.enum(IconKeyDB).nullable(),
  voiceModelSelection: voiceModelSelectionSchema.nullable().optional(),
  sttModelSelection: sttModelSelectionSchema.nullable().optional(),
  imageVisionModelSelection: imageVisionModelSelectionSchema
    .nullable()
    .optional(),
  videoVisionModelSelection: videoVisionModelSelectionSchema
    .nullable()
    .optional(),
  audioVisionModelSelection: audioVisionModelSelectionSchema
    .nullable()
    .optional(),
  imageGenModelSelection: imageGenModelSelectionSchema.nullable().optional(),
  musicGenModelSelection: musicGenModelSelectionSchema.nullable().optional(),
  videoGenModelSelection: videoGenModelSelectionSchema.nullable().optional(),
  modelSelection: chatModelSelectionSchema.nullable().optional(),
  position: z.number().int(),
  color: z.string().nullable(),
  compactTrigger: z.number().int().nullable(),
  memoryLimit: z.number().int().nullable(),
  availableTools: z
    .array(z.object({ toolId: z.string(), requiresConfirmation: z.boolean() }))
    .nullable()
    .optional(),
  pinnedTools: z
    .array(z.object({ toolId: z.string(), requiresConfirmation: z.boolean() }))
    .nullable()
    .optional(),
  deniedTools: z
    .array(z.object({ toolId: z.string(), requiresConfirmation: z.boolean() }))
    .nullable()
    .optional(),
  promptAppend: z.string().nullable(),
  subAgentFavoriteId: z.string().uuid().nullable(),
  updatedAt: z.string(),
});

type SyncedFavorite = z.infer<typeof syncedFavoriteSchema>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Natural dedup key: (skillId, variantId) — same favorite regardless of local UUID */
function favoriteKey(skillId: string, variantId: string | null): string {
  return `${skillId}::${variantId ?? ""}`;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export const favoritesSyncProvider: SyncProvider = {
  key: "favorites",
  labelKey: "favorites",

  async getCursor(userId): Promise<StandardSyncCursor> {
    const [row] = await db
      .select({ updatedAt: chatFavorites.updatedAt })
      .from(chatFavorites)
      .where(eq(chatFavorites.userId, userId))
      .orderBy(sql`${chatFavorites.updatedAt} DESC`)
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
      // Serves EVERYTHING newer than the cursor. Rows are ordered ascending
      // by updatedAt so the cursor of the last served item is a valid
      // watermark. Favorites carry no tombstones (deletes are instance-local).
      const rows = await db
        .select()
        .from(chatFavorites)
        .where(
          typedCursor
            ? and(
                eq(chatFavorites.userId, userId),
                // Millisecond-precision compare so a current cursor short-
                // circuits to empty (toISOString is ms, Postgres stores µs).
                // Pass cursor as a raw SQL string literal to avoid pg driver timezone
                // conversion. The DB stores TIMESTAMP WITHOUT TIMEZONE in local time;
                // new Date(cursor) → pg converts to local+offset, skewing comparison.
                sql`date_trunc('milliseconds', ${chatFavorites.updatedAt}) > ${typedCursor.updatedAt}::timestamp`,
              )
            : eq(chatFavorites.userId, userId),
        )
        .orderBy(asc(chatFavorites.updatedAt));

      const items: SyncedFavorite[] = rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        skillId: r.skillId,
        variantId: r.variantId ?? null,
        customVariantName: r.customVariantName ?? null,
        customIcon: r.customIcon ?? null,
        voiceModelSelection: r.voiceModelSelection ?? null,
        sttModelSelection: r.sttModelSelection ?? null,
        imageVisionModelSelection: r.imageVisionModelSelection ?? null,
        videoVisionModelSelection: r.videoVisionModelSelection ?? null,
        audioVisionModelSelection: r.audioVisionModelSelection ?? null,
        imageGenModelSelection: r.imageGenModelSelection ?? null,
        musicGenModelSelection: r.musicGenModelSelection ?? null,
        videoGenModelSelection: r.videoGenModelSelection ?? null,
        modelSelection: r.modelSelection ?? null,
        position: r.position,
        color: r.color ?? null,
        compactTrigger: r.compactTrigger ?? null,
        memoryLimit: r.memoryLimit ?? null,
        availableTools: r.availableTools ?? null,
        pinnedTools: r.pinnedTools ?? null,
        deniedTools: r.deniedTools ?? null,
        promptAppend: r.promptAppend ?? null,
        subAgentFavoriteId: r.subAgentFavoriteId ?? null,
        updatedAt: r.updatedAt.toISOString(),
      }));

      const lastIncluded = items[items.length - 1];
      return {
        json: JSON.stringify(items),
        // Cursor derived from the served items — the batch high-water mark.
        cursor: lastIncluded
          ? { updatedAt: lastIncluded.updatedAt }
          : fallbackCursor,
      };
    } catch (error) {
      logger.error("Failed to serialize favorites for sync", parseError(error));
      // Serve nothing and keep the peer's cursor unchanged — never advance
      // past data that was not delivered.
      return { json: "[]", cursor: fallbackCursor };
    }
  },

  async upsertFromJson(json, userId, logger) {
    const remoteFavorites = z
      .array(syncedFavoriteSchema)
      .parse(JSON.parse(json));
    let synced = 0;

    // Load existing favorites for all incoming skillIds up front,
    // keyed by the (skillId, variantId) natural key
    const remoteSkillIds = remoteFavorites.map((f) => f.skillId);
    const existingRows =
      remoteSkillIds.length > 0
        ? await db
            .select({
              id: chatFavorites.id,
              skillId: chatFavorites.skillId,
              variantId: chatFavorites.variantId,
              updatedAt: chatFavorites.updatedAt,
            })
            .from(chatFavorites)
            .where(
              and(
                eq(chatFavorites.userId, userId),
                inArray(chatFavorites.skillId, remoteSkillIds),
              ),
            )
        : [];
    const existingByKey = new Map(
      existingRows.map((r) => [favoriteKey(r.skillId, r.variantId), r]),
    );

    // New rows are collected and inserted in batches after the loop
    const insertRows: (typeof chatFavorites.$inferInsert)[] = [];

    for (const remoteFav of remoteFavorites) {
      try {
        // Dedup by (skillId, variantId) — natural key, not UUID
        const existing = existingByKey.get(
          favoriteKey(remoteFav.skillId, remoteFav.variantId),
        );

        const remoteTime = new Date(remoteFav.updatedAt).getTime();

        if (existing) {
          // Last-writer-wins; tie → remote wins
          if (remoteTime >= existing.updatedAt.getTime()) {
            await db
              .update(chatFavorites)
              .set({
                slug: remoteFav.slug,
                customVariantName: remoteFav.customVariantName,
                customIcon: remoteFav.customIcon,
                voiceModelSelection: remoteFav.voiceModelSelection,
                sttModelSelection: remoteFav.sttModelSelection,
                imageVisionModelSelection: remoteFav.imageVisionModelSelection,
                videoVisionModelSelection: remoteFav.videoVisionModelSelection,
                audioVisionModelSelection: remoteFav.audioVisionModelSelection,
                imageGenModelSelection: remoteFav.imageGenModelSelection,
                musicGenModelSelection: remoteFav.musicGenModelSelection,
                videoGenModelSelection: remoteFav.videoGenModelSelection,
                modelSelection: remoteFav.modelSelection,
                position: remoteFav.position,
                color: remoteFav.color,
                compactTrigger: remoteFav.compactTrigger,
                memoryLimit: remoteFav.memoryLimit,
                availableTools: remoteFav.availableTools,
                pinnedTools: remoteFav.pinnedTools,
                deniedTools: remoteFav.deniedTools,
                promptAppend: remoteFav.promptAppend,
                subAgentFavoriteId: remoteFav.subAgentFavoriteId,
                updatedAt: new Date(remoteFav.updatedAt),
              })
              .where(eq(chatFavorites.id, existing.id));
          }
        } else {
          // New favorite — insert with remote's UUID for stable dedup
          insertRows.push({
            id: remoteFav.id,
            userId,
            slug: remoteFav.slug,
            skillId: remoteFav.skillId,
            variantId: remoteFav.variantId,
            customVariantName: remoteFav.customVariantName,
            customIcon: remoteFav.customIcon,
            voiceModelSelection: remoteFav.voiceModelSelection,
            sttModelSelection: remoteFav.sttModelSelection,
            imageVisionModelSelection: remoteFav.imageVisionModelSelection,
            videoVisionModelSelection: remoteFav.videoVisionModelSelection,
            audioVisionModelSelection: remoteFav.audioVisionModelSelection,
            imageGenModelSelection: remoteFav.imageGenModelSelection,
            musicGenModelSelection: remoteFav.musicGenModelSelection,
            videoGenModelSelection: remoteFav.videoGenModelSelection,
            modelSelection: remoteFav.modelSelection,
            position: remoteFav.position,
            color: remoteFav.color,
            compactTrigger: remoteFav.compactTrigger,
            memoryLimit: remoteFav.memoryLimit,
            availableTools: remoteFav.availableTools,
            pinnedTools: remoteFav.pinnedTools,
            deniedTools: remoteFav.deniedTools,
            promptAppend: remoteFav.promptAppend,
            subAgentFavoriteId: remoteFav.subAgentFavoriteId,
            updatedAt: new Date(remoteFav.updatedAt),
          });
        }

        synced++;
      } catch (error) {
        logger.error("Failed to upsert synced favorite", {
          id: remoteFav.id,
          ...parseError(error),
        });
      }
    }

    for (let i = 0; i < insertRows.length; i += 1000) {
      const batch = insertRows.slice(i, i + 1000);
      try {
        await db.insert(chatFavorites).values(batch).onConflictDoNothing();
      } catch (error) {
        logger.error("Failed to upsert synced favorite", parseError(error));
      }
    }

    return synced;
  },
};
