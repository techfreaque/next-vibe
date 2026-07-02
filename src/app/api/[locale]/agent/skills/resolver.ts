/**
 * Skill / Favorite Resolver (server-only)
 * SKILLS-domain resolution shared by ai-stream and execute-tool:
 * - resolveSkillVariant: BridgeSkill from skillId + variantId via DB (custom) or config (default)
 * - resolveSkillFavoriteContext: favorite + variant-aware skill + raw custom-skill config
 *   columns in ONE favorite query + ONE customSkills query.
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { getBestChatModel } from "@/app/api/[locale]/agent/ai-stream/models";
import type { BridgeSkill } from "@/app/api/[locale]/agent/ai-stream/repository/core/modality-resolver";
import { isUuid, parseSkillId } from "@/app/api/[locale]/agent/chat/slugify";
import { getInstanceAvailability } from "@/app/api/[locale]/agent/env-availability";

import type { Skill } from "./config";
import { DEFAULT_SKILLS } from "./config";
import { NO_SKILL_ID } from "./constants";
import { isFiltersSelection, isManualSelection } from "./create/definition";
import type { CustomSkill } from "./db";
import { customSkills } from "./db";

/**
 * Resolve a BridgeSkill from a raw skillId (supports "slug__variantId" format).
 * Handles both default skills (config) and custom skills (DB, by UUID or slug).
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
          modelSelection: activeVariant.modelSelection ?? undefined,
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
          modelSelection: undefined,
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
