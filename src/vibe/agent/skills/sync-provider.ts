import "server-only";

/**
 * Skills Sync Provider
 * Registers custom skills for cross-instance sync via the unified SyncProvider interface.
 *
 * Lossless upsert: all columns are serialized and written back to `customSkills` directly.
 * This preserves variants, trustLevel, availableTools, model selections, etc.
 * Community metrics (voteCount, reportCount) are NOT synced — they are instance-local.
 */
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import type { ToolConfigItem } from "next-vibe/agent/chat/settings/definition";
import type { VideoGenModelId } from "next-vibe/agent/video-generation/models";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { StandardSyncCursor } from "next-vibe/remote-connection/db";
import {
  type SyncProvider,
  toStandardCursor,
} from "next-vibe/remote-connection/sync/provider";
import { z } from "zod";

import { customSkills, type NewCustomSkill } from "./db";
import { SkillTrustLevel } from "./enum";
import { type SyncedSkill, syncedSkillSchema } from "./full-event.schema";

export type { SyncedSkill };

// ─── Row → Wire Mapping ────────────────────────────────────────────────────────

/**
 * Map a `customSkills` DB row to the wire-shaped SyncedSkill.
 * Single source of truth for the row→wire projection — reused by
 * serializeFromCursor (pull sync) and by the live CRUD remote events
 * (skill-created-full/skill-updated-full) so both produce identical lossless
 * payloads. Community metrics (voteCount, reportCount) are NOT synced —
 * instance-local.
 */
export function mapSkillRowToSynced(
  r: typeof customSkills.$inferSelect,
  isDeleted?: boolean,
): SyncedSkill {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    tagline: r.tagline,
    icon: r.icon,
    systemPrompt: r.systemPrompt ?? null,
    category: r.category,
    ownershipType: r.ownershipType,
    voiceModelSelection: r.voiceModelSelection ?? null,
    sttModelSelection: r.sttModelSelection ?? null,
    imageVisionModelSelection: r.imageVisionModelSelection ?? null,
    videoVisionModelSelection: r.videoVisionModelSelection ?? null,
    audioVisionModelSelection: r.audioVisionModelSelection ?? null,
    imageGenModelSelection: r.imageGenModelSelection ?? null,
    musicGenModelSelection: r.musicGenModelSelection ?? null,
    videoGenModelId: r.videoGenModelId ?? null,
    variants: r.variants ?? null,
    compactTrigger: r.compactTrigger ?? null,
    memoryLimit: r.memoryLimit ?? null,
    availableTools: r.availableTools ?? null,
    pinnedTools: r.pinnedTools ?? null,
    deniedTools: r.deniedTools ?? null,
    skillType: r.skillType ?? null,
    status: r.status ?? null,
    companionPrompt: r.companionPrompt ?? null,
    trustLevel: r.trustLevel,
    longContent: r.longContent ?? null,
    publishedAt: r.publishedAt?.toISOString() ?? null,
    changeNote: r.changeNote ?? null,
    updatedAt: r.updatedAt.toISOString(),
    ...(isDeleted || r.isDeleted ? { isDeleted: true } : {}),
  };
}

// ─── Provider ────────────────────────────────────────────────────────────────

export const skillsSyncProvider: SyncProvider = {
  key: "skills",
  labelKey: "skills",

  async getCursor(userId): Promise<StandardSyncCursor> {
    const [row] = await db
      .select({ updatedAt: customSkills.updatedAt })
      .from(customSkills)
      .where(eq(customSkills.userId, userId))
      .orderBy(sql`${customSkills.updatedAt} DESC`)
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
      // watermark. Tombstones (isDeleted) travel inline in the same ordered
      // stream.
      const rows = await db
        .select()
        .from(customSkills)
        .where(
          typedCursor
            ? and(
                eq(customSkills.userId, userId),
                // Pass cursor as a raw SQL string literal to avoid pg driver timezone
                // conversion. The DB stores TIMESTAMP WITHOUT TIMEZONE in local time;
                // new Date(cursor) → toISOString() → pg converts to local+offset, making
                // the comparison 2h ahead in CEST and returning 0 rows.
                sql`date_trunc('milliseconds', ${customSkills.updatedAt}) > ${typedCursor.updatedAt}::timestamp`,
              )
            : eq(customSkills.userId, userId),
        )
        .orderBy(asc(customSkills.updatedAt));

      const items = rows.map(
        (r): SyncedSkill => ({
          id: r.id,
          slug: r.slug,
          name: r.name,
          description: r.description,
          tagline: r.tagline,
          icon: r.icon,
          systemPrompt: r.systemPrompt ?? null,
          category: r.category,
          ownershipType: r.ownershipType,
          voiceModelSelection: r.voiceModelSelection ?? null,
          sttModelSelection: r.sttModelSelection ?? null,
          imageVisionModelSelection: r.imageVisionModelSelection ?? null,
          videoVisionModelSelection: r.videoVisionModelSelection ?? null,
          audioVisionModelSelection: r.audioVisionModelSelection ?? null,
          imageGenModelSelection: r.imageGenModelSelection ?? null,
          musicGenModelSelection: r.musicGenModelSelection ?? null,
          videoGenModelId: r.videoGenModelId ?? null,
          variants: r.variants ?? null,
          compactTrigger: r.compactTrigger ?? null,
          memoryLimit: r.memoryLimit ?? null,
          availableTools: r.availableTools ?? null,
          pinnedTools: r.pinnedTools ?? null,
          deniedTools: r.deniedTools ?? null,
          skillType: r.skillType ?? null,
          status: r.status ?? null,
          companionPrompt: r.companionPrompt ?? null,
          trustLevel: r.trustLevel,
          longContent: r.longContent ?? null,
          publishedAt: r.publishedAt?.toISOString() ?? null,
          changeNote: r.changeNote ?? null,
          updatedAt: r.updatedAt.toISOString(),
          ...(r.isDeleted ? { isDeleted: true } : {}),
        }),
      );

      const lastIncluded = items[items.length - 1];
      return {
        json: JSON.stringify(items),
        // Cursor derived from the served items — the batch high-water mark.
        cursor: lastIncluded
          ? { updatedAt: lastIncluded.updatedAt }
          : fallbackCursor,
      };
    } catch (error) {
      logger.error("Failed to serialize skills for sync", parseError(error));
      // Serve nothing and keep the peer's cursor unchanged — never advance
      // past data that was not delivered.
      return { json: "[]", cursor: fallbackCursor };
    }
  },

  async upsertFromJson(json, userId, logger) {
    const remoteSkills = z.array(syncedSkillSchema).parse(JSON.parse(json));
    let synced = 0;

    // Load existing skills for all incoming ids up front
    const remoteIds = remoteSkills.map((s) => s.id);
    const existingRows =
      remoteIds.length > 0
        ? await db
            .select({ id: customSkills.id, updatedAt: customSkills.updatedAt })
            .from(customSkills)
            .where(
              and(
                inArray(customSkills.id, remoteIds),
                eq(customSkills.userId, userId),
              ),
            )
        : [];
    const existingById = new Map(existingRows.map((r) => [r.id, r]));

    // New rows are collected and inserted in batches after the loop
    const insertRows: NewCustomSkill[] = [];

    for (const remoteSkill of remoteSkills) {
      try {
        if (remoteSkill.isDeleted) {
          // Tombstone: delete local skill
          await db
            .delete(customSkills)
            .where(
              and(
                eq(customSkills.id, remoteSkill.id),
                eq(customSkills.userId, userId),
              ),
            );
          existingById.delete(remoteSkill.id);
          synced++;
          continue;
        }

        // Match by UUID
        const existing = existingById.get(remoteSkill.id);

        const remoteTime = new Date(remoteSkill.updatedAt).getTime();

        // Build the full lossless update/insert payload.
        // Community metrics (voteCount, reportCount) are NOT synced — instance-local.
        const skillPayload: Omit<NewCustomSkill, "id" | "slug" | "userId"> = {
          name: remoteSkill.name,
          description: remoteSkill.description,
          tagline: remoteSkill.tagline,
          icon: remoteSkill.icon,
          systemPrompt: remoteSkill.systemPrompt ?? null,
          category: remoteSkill.category,
          ownershipType: remoteSkill.ownershipType,
          voiceModelSelection: remoteSkill.voiceModelSelection ?? null,
          sttModelSelection: remoteSkill.sttModelSelection ?? null,
          imageVisionModelSelection:
            remoteSkill.imageVisionModelSelection ?? null,
          videoVisionModelSelection:
            remoteSkill.videoVisionModelSelection ?? null,
          audioVisionModelSelection:
            remoteSkill.audioVisionModelSelection ?? null,
          imageGenModelSelection: remoteSkill.imageGenModelSelection ?? null,
          musicGenModelSelection: remoteSkill.musicGenModelSelection ?? null,
          videoGenModelId: (remoteSkill.videoGenModelId ??
            null) as VideoGenModelId | null,
          variants: remoteSkill.variants ?? null,
          compactTrigger: remoteSkill.compactTrigger ?? null,
          memoryLimit: remoteSkill.memoryLimit ?? null,
          availableTools: (remoteSkill.availableTools ?? null) as
            | ToolConfigItem[]
            | null,
          pinnedTools: (remoteSkill.pinnedTools ?? null) as
            | ToolConfigItem[]
            | null,
          deniedTools: (remoteSkill.deniedTools ?? null) as
            | ToolConfigItem[]
            | null,
          skillType: remoteSkill.skillType ?? null,
          status: remoteSkill.status ?? null,
          companionPrompt: remoteSkill.companionPrompt ?? null,
          trustLevel: remoteSkill.trustLevel ?? SkillTrustLevel.COMMUNITY,
          longContent: remoteSkill.longContent ?? null,
          publishedAt: remoteSkill.publishedAt
            ? new Date(remoteSkill.publishedAt)
            : null,
          changeNote: remoteSkill.changeNote ?? null,
          updatedAt: new Date(remoteSkill.updatedAt),
        };

        if (existing) {
          // Last-writer-wins; tie → remote wins (deterministic tiebreak per spec)
          if (remoteTime >= existing.updatedAt.getTime()) {
            await db
              .update(customSkills)
              .set(skillPayload)
              .where(eq(customSkills.id, remoteSkill.id));
          }
        } else {
          // New skill — collected for batch insert below
          insertRows.push({
            id: remoteSkill.id,
            slug: remoteSkill.slug,
            userId,
            ...skillPayload,
          });
        }

        synced++;
      } catch (error) {
        logger.error("Failed to upsert shared skill", {
          id: remoteSkill.id,
          ...parseError(error),
        });
      }
    }

    // New skills - onConflictDoNothing handles slug uniqueness violations
    // (another user may already own that slug on this instance).
    for (let i = 0; i < insertRows.length; i += 1000) {
      const batch = insertRows.slice(i, i + 1000);
      try {
        await db.insert(customSkills).values(batch).onConflictDoNothing();
      } catch (error) {
        logger.error("Failed to upsert shared skill", parseError(error));
      }
    }

    return synced;
  },
};
