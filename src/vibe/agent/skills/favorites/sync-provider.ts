import "server-only";

/**
 * Favorites Sync Provider
 * Registers chat favorites for cross-instance sync via the unified SyncProvider interface.
 *
 * Dedup key: (skillId, variantId) — same favorite is never duplicated regardless of local UUID.
 * Instance-local fields (useCount, lastUsedAt) are NOT synced.
 * Last-writer-wins on updatedAt; tie → remote wins.
 */
import { and, asc, eq, sql } from "drizzle-orm";
import {
  type ChatModelSelection,
  chatModelSelectionSchema,
} from "next-vibe/agent/ai-stream/models";
import {
  type AudioVisionModelSelection,
  audioVisionModelSelectionSchema,
  type ImageVisionModelSelection,
  imageVisionModelSelectionSchema,
  type VideoVisionModelSelection,
  videoVisionModelSelectionSchema,
} from "next-vibe/agent/ai-stream/vision-models";
import {
  type ImageGenModelSelection,
  imageGenModelSelectionSchema,
} from "next-vibe/agent/image-generation/models";
import {
  type MusicGenModelSelection,
  musicGenModelSelectionSchema,
} from "next-vibe/agent/music-generation/models";
import {
  type SttModelSelection,
  sttModelSelectionSchema,
} from "next-vibe/agent/speech-to-text/models";
import {
  type VoiceModelSelection,
  voiceModelSelectionSchema,
} from "next-vibe/agent/text-to-speech/models";
import {
  type VideoGenModelSelection,
  videoGenModelSelectionSchema,
} from "next-vibe/agent/video-generation/models";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { StandardSyncCursor } from "next-vibe/remote-connection/db";
import {
  type SyncProvider,
  toStandardCursor,
} from "next-vibe/remote-connection/sync/provider";
import {
  type IconKey,
  IconKeyDB,
} from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";
import { z } from "zod";

import { chatFavorites } from "./db";

// ─── Wire schema (the full favorite row for cross-instance remote events) ──────

interface ToolRef {
  toolId: string;
  requiresConfirmation: boolean;
}

const toolRefSchema: z.ZodType<ToolRef> = z.object({
  toolId: z.string(),
  requiresConfirmation: z.boolean(),
});

/**
 * Wire-shaped favorite for cross-instance sync.
 *
 * Declared as an EXPLICIT interface (not `z.infer`) and the schema is annotated
 * `z.ZodType<SyncedFavorite>`. The model-selection fields are deep discriminated
 * unions; letting `z.infer` re-derive them here exceeds TS's instantiation-depth
 * limit and produces a structurally-divergent type, so the same `SyncedFavorite[]`
 * name resolves to two unrelated types (TS2719). Pinning the type keeps every
 * reference identical and shallow.
 */
export interface SyncedFavorite {
  id: string;
  slug: string;
  skillId: string;
  variantId: string | null;
  customVariantName: string | null;
  customIcon: IconKey | null;
  voiceModelSelection?: VoiceModelSelection | null;
  sttModelSelection?: SttModelSelection | null;
  imageVisionModelSelection?: ImageVisionModelSelection | null;
  videoVisionModelSelection?: VideoVisionModelSelection | null;
  audioVisionModelSelection?: AudioVisionModelSelection | null;
  imageGenModelSelection?: ImageGenModelSelection | null;
  musicGenModelSelection?: MusicGenModelSelection | null;
  videoGenModelSelection?: VideoGenModelSelection | null;
  modelSelection?: ChatModelSelection | null;
  position: number;
  color: string | null;
  compactTrigger: number | null;
  memoryLimit: number | null;
  availableTools?: ToolRef[] | null;
  pinnedTools?: ToolRef[] | null;
  deniedTools?: ToolRef[] | null;
  promptAppend: string | null;
  subAgentFavoriteId: string | null;
  updatedAt: string;
}

export const syncedFavoriteSchema: z.ZodType<SyncedFavorite> = z.object({
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
  availableTools: z.array(toolRefSchema).nullable().optional(),
  pinnedTools: z.array(toolRefSchema).nullable().optional(),
  deniedTools: z.array(toolRefSchema).nullable().optional(),
  promptAppend: z.string().nullable(),
  subAgentFavoriteId: z.string().uuid().nullable(),
  updatedAt: z.string(),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Natural dedup key: (skillId, variantId) — same favorite regardless of local UUID */
function favoriteKey(skillId: string, variantId: string | null): string {
  return `${skillId}::${variantId ?? ""}`;
}

/**
 * Map a `chatFavorites` DB row to the wire-shaped SyncedFavorite.
 * Single source of truth for the row→wire projection — reused by
 * serializeFromCursor (pull sync) and the favorite-*-full remote events.
 */
export function mapFavoriteRowToSynced(
  r: typeof chatFavorites.$inferSelect,
): SyncedFavorite {
  return {
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
  };
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

    // Load ALL of the user's favorites up front. Matching precedence:
    //   1. id — sync preserves remote UUIDs on insert, so a previously synced
    //      favorite matches by id even after renames.
    //   2. slug — unique per (user, slug); prevents the LWW update from
    //      copying a remote slug onto the WRONG sibling and violating the
    //      unique index (a user can hold several favorites of the same
    //      skill+variant, e.g. a numbered "my-skill-2/-3/-4" series).
    //   3. (skillId, variantId) natural key — legacy rows that predate
    //      id-preserving sync.
    // Every match is CONSUMED so two remote favorites can never map onto the
    // same local row.
    const existingRows = await db
      .select({
        id: chatFavorites.id,
        slug: chatFavorites.slug,
        skillId: chatFavorites.skillId,
        variantId: chatFavorites.variantId,
        updatedAt: chatFavorites.updatedAt,
      })
      .from(chatFavorites)
      .where(eq(chatFavorites.userId, userId));
    const existingById = new Map(existingRows.map((r) => [r.id, r]));
    const existingBySlug = new Map(existingRows.map((r) => [r.slug, r]));
    const existingByKey = new Map(
      existingRows.map((r) => [favoriteKey(r.skillId, r.variantId), r]),
    );
    const consumeExisting = (row: (typeof existingRows)[number]): void => {
      existingById.delete(row.id);
      if (existingBySlug.get(row.slug)?.id === row.id) {
        existingBySlug.delete(row.slug);
      }
      const key = favoriteKey(row.skillId, row.variantId);
      if (existingByKey.get(key)?.id === row.id) {
        existingByKey.delete(key);
      }
    };

    // New rows are collected and inserted in batches after the loop
    const insertRows: (typeof chatFavorites.$inferInsert)[] = [];

    for (const remoteFav of remoteFavorites) {
      try {
        const existing =
          existingById.get(remoteFav.id) ??
          existingBySlug.get(remoteFav.slug) ??
          existingByKey.get(
            favoriteKey(remoteFav.skillId, remoteFav.variantId),
          );
        if (existing) {
          consumeExisting(existing);
        }

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
          slug: remoteFav.slug,
          skillId: remoteFav.skillId,
          error: String(error),
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
