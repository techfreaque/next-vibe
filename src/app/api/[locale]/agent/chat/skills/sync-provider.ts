import "server-only";

/**
 * Skills Sync Provider
 * Registers custom skills for cross-instance sync via the unified SyncProvider interface.
 */

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/app/api/[locale]/system/db";
import type { SyncProvider } from "@/app/api/[locale]/system/unified-interface/tasks/task-sync/sync-provider";
import { chatModelSelectionSchema } from "@/app/api/[locale]/agent/ai-stream/models";
import { iconSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { customSkills } from "./db";
import { SkillCategory, SkillOwnershipType } from "./enum";

// ─── Wire Schema ─────────────────────────────────────────────────────────────

const syncedSkillSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  tagline: z.string(),
  icon: iconSchema,
  systemPrompt: z.string().nullable(),
  category: z.enum([
    SkillCategory.COMPANION,
    SkillCategory.ASSISTANT,
    SkillCategory.CODING,
    SkillCategory.CREATIVE,
    SkillCategory.WRITING,
    SkillCategory.ANALYSIS,
    SkillCategory.ROLEPLAY,
    SkillCategory.EDUCATION,
    SkillCategory.CONTROVERSIAL,
    SkillCategory.BACKGROUND,
  ]),
  modelSelection: chatModelSelectionSchema,
  ownershipType: z.enum([
    SkillOwnershipType.SYSTEM,
    SkillOwnershipType.USER,
    SkillOwnershipType.PUBLIC,
  ]),
  updatedAt: z.string(),
  isDeleted: z.boolean().optional(),
});

type SyncedSkill = z.infer<typeof syncedSkillSchema>;

// ─── Provider ────────────────────────────────────────────────────────────────

export const skillsSyncProvider: SyncProvider = {
  key: "skills",

  async getHashEntries(userId) {
    const rows = await db
      .select({ syncId: customSkills.id, updatedAt: customSkills.updatedAt })
      .from(customSkills)
      .where(eq(customSkills.userId, userId));

    return rows.map((r) => ({
      syncId: r.syncId,
      updatedAt: r.updatedAt,
    }));
  },

  async serializeToJson(userId, logger) {
    try {
      const rows = await db
        .select()
        .from(customSkills)
        .where(eq(customSkills.userId, userId))
        .limit(200);

      const result = rows.map(
        (r): SyncedSkill => ({
          id: r.id,
          slug: r.slug,
          name: r.name,
          description: r.description,
          tagline: r.tagline,
          icon: r.icon,
          systemPrompt: r.systemPrompt,
          category: r.category,
          modelSelection: r.modelSelection,
          ownershipType: r.ownershipType,
          updatedAt: r.updatedAt.toISOString(),
        }),
      );

      return JSON.stringify(result);
    } catch (error) {
      logger.error("Failed to serialize skills for sync", parseError(error));
      return "[]";
    }
  },

  async upsertFromJson(json, userId, logger) {
    const remoteSkills = z.array(syncedSkillSchema).parse(JSON.parse(json));
    let synced = 0;

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
          try {
            const { deleteFromDisk } =
              await import("@/app/api/[locale]/agent/cortex/fs-provider/fs-sync");
            await deleteFromDisk(`/skills/${remoteSkill.id}.md`);
          } catch {
            // Best-effort
          }
          synced++;
          continue;
        }

        // Match by UUID
        const [existing] = await db
          .select({ id: customSkills.id, updatedAt: customSkills.updatedAt })
          .from(customSkills)
          .where(
            and(
              eq(customSkills.id, remoteSkill.id),
              eq(customSkills.userId, userId),
            ),
          )
          .limit(1);

        const remoteTime = new Date(remoteSkill.updatedAt).getTime();

        if (existing) {
          // Last-writer-wins
          if (remoteTime > existing.updatedAt.getTime()) {
            await db
              .update(customSkills)
              .set({
                name: remoteSkill.name,
                description: remoteSkill.description,
                tagline: remoteSkill.tagline,
                icon: remoteSkill.icon,
                systemPrompt: remoteSkill.systemPrompt,
                category: remoteSkill.category,
                ownershipType: remoteSkill.ownershipType,
                updatedAt: new Date(remoteSkill.updatedAt),
              })
              .where(eq(customSkills.id, remoteSkill.id));
          }
        } else {
          // New skill
          await db.insert(customSkills).values({
            id: remoteSkill.id,
            slug: remoteSkill.slug,
            userId,
            name: remoteSkill.name,
            description: remoteSkill.description,
            tagline: remoteSkill.tagline,
            icon: remoteSkill.icon,
            systemPrompt: remoteSkill.systemPrompt,
            category: remoteSkill.category,
            modelSelection: remoteSkill.modelSelection,
            ownershipType: remoteSkill.ownershipType,
            updatedAt: new Date(remoteSkill.updatedAt),
          });
        }

        // Disk write-through
        try {
          const { syncToDisk } =
            await import("@/app/api/[locale]/agent/cortex/fs-provider/fs-sync");
          const frontmatter = [
            "---",
            `skillId: "${remoteSkill.id}"`,
            `name: "${remoteSkill.name.replace(/"/g, '\\"')}"`,
            `ownership: "${remoteSkill.ownershipType}"`,
            "---",
          ].join("\n");
          await syncToDisk(
            `/skills/${remoteSkill.id}.md`,
            `${frontmatter}\n\n${remoteSkill.systemPrompt ?? ""}`,
          );
        } catch {
          // Best-effort
        }

        synced++;
      } catch (error) {
        logger.error("Failed to upsert shared skill", {
          id: remoteSkill.id,
          ...parseError(error),
        });
      }
    }

    return synced;
  },
};
