/**
 * Skill Variant Resolver (server-only)
 * Resolves BridgeSkill from skillId + variantId via DB (custom) or config (default).
 */

import "server-only";

import { eq } from "drizzle-orm";

import type { BridgeSkill } from "@/app/api/[locale]/agent/ai-stream/repository/core/modality-resolver";
import { DEFAULT_SKILLS } from "@/app/api/[locale]/agent/chat/skills/config";
import { customSkills } from "@/app/api/[locale]/agent/chat/skills/db";
import { isUuid, parseSkillId } from "@/app/api/[locale]/agent/chat/slugify";
import { db } from "@/app/api/[locale]/system/db";

/**
 * Resolve a BridgeSkill from a raw skillId (supports "slug__variantId" format).
 * Handles both default skills (config) and custom skills (DB).
 * The variantId from the favorite is used as fallback when the skillId doesn't
 * contain an explicit variant (e.g. plain "thea" vs "thea__brilliant").
 *
 * @param rawSkillId - The skill identifier, optionally with variant suffix
 * @param favoriteVariantId - Fallback variant ID from the active favorite
 */
export async function resolveSkillVariant(
  rawSkillId: string | undefined,
  favoriteVariantId: string | null | undefined,
): Promise<BridgeSkill | null> {
  if (!rawSkillId) {
    return null;
  }

  const { skillId, variantId: explicitVariantId } = parseSkillId(rawSkillId);
  const activeVariantId = explicitVariantId ?? favoriteVariantId ?? null;

  if (isUuid(skillId)) {
    // Custom skill: resolve variant-aware model selections from DB
    const [row] = await db
      .select({
        modelSelection: customSkills.modelSelection,
        voiceModelSelection: customSkills.voiceModelSelection,
        sttModelSelection: customSkills.sttModelSelection,
        imageVisionModelSelection: customSkills.imageVisionModelSelection,
        videoVisionModelSelection: customSkills.videoVisionModelSelection,
        audioVisionModelSelection: customSkills.audioVisionModelSelection,
        variants: customSkills.variants,
      })
      .from(customSkills)
      .where(eq(customSkills.id, skillId))
      .limit(1);

    if (!row) {
      return null;
    }

    const variants = row.variants;
    const activeVariant =
      variants && activeVariantId
        ? (variants.find((v) => v.id === activeVariantId) ??
          variants.find((v) => v.isDefault) ??
          variants[0])
        : variants
          ? (variants.find((v) => v.isDefault) ?? variants[0])
          : null;

    return activeVariant
      ? {
          modelSelection:
            activeVariant.modelSelection ?? row.modelSelection ?? undefined,
          voiceModelSelection:
            activeVariant.voiceModelSelection ??
            row.voiceModelSelection ??
            undefined,
          sttModelSelection:
            activeVariant.sttModelSelection ??
            row.sttModelSelection ??
            undefined,
          imageVisionModelSelection:
            activeVariant.imageVisionModelSelection ??
            row.imageVisionModelSelection ??
            undefined,
          videoVisionModelSelection:
            activeVariant.videoVisionModelSelection ??
            row.videoVisionModelSelection ??
            undefined,
          audioVisionModelSelection:
            activeVariant.audioVisionModelSelection ??
            row.audioVisionModelSelection ??
            undefined,
          imageGenModelSelection:
            activeVariant.imageGenModelSelection ?? undefined,
          musicGenModelSelection:
            activeVariant.musicGenModelSelection ?? undefined,
          videoGenModelSelection:
            activeVariant.videoGenModelSelection ?? undefined,
        }
      : {
          modelSelection: row.modelSelection ?? undefined,
          voiceModelSelection: row.voiceModelSelection ?? undefined,
          sttModelSelection: row.sttModelSelection ?? undefined,
          imageVisionModelSelection: row.imageVisionModelSelection ?? undefined,
          videoVisionModelSelection: row.videoVisionModelSelection ?? undefined,
          audioVisionModelSelection: row.audioVisionModelSelection ?? undefined,
          imageGenModelSelection: undefined,
          musicGenModelSelection: undefined,
          videoGenModelSelection: undefined,
        };
  }

  // Default skill: resolve from config
  const defaultSkill = DEFAULT_SKILLS.find((c) => c.id === skillId);
  if (!defaultSkill) {
    return null;
  }

  const activeVariant = activeVariantId
    ? (defaultSkill.variants.find((v) => v.id === activeVariantId) ??
      defaultSkill.variants.find((v) => v.isDefault) ??
      defaultSkill.variants[0])
    : (defaultSkill.variants.find((v) => v.isDefault) ??
      defaultSkill.variants[0]);

  return activeVariant ?? null;
}
