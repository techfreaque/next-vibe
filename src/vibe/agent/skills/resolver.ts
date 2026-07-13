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
import type { FavoriteConfig } from "./favorites/db";
import { resolveFavoriteConfig } from "./favorites/repository";

/**
 * Raw custom-skill config columns used by the ai-stream setup cascades
 * (compact trigger, tool config, memory limit). null for default skills.
 */
export type CustomSkillConfig = Pick<
  CustomSkill,
  | "compactTrigger"
  | "deniedTools"
  | "availableTools"
  | "pinnedTools"
  | "memoryLimit"
>;

/** Full row selected ONCE per resolution: config columns + bridge-model columns + variants. */
type CustomSkillContextRow = CustomSkillConfig &
  Pick<
    CustomSkill,
    | "voiceModelSelection"
    | "sttModelSelection"
    | "imageVisionModelSelection"
    | "videoVisionModelSelection"
    | "audioVisionModelSelection"
    | "variants"
  >;

/** ONE customSkills fetch for all cascade needs - by UUID or slug. */
async function fetchCustomSkillContextRow(
  skillIdOrSlug: string,
): Promise<CustomSkillContextRow | null> {
  const [row] = await db
    .select({
      compactTrigger: customSkills.compactTrigger,
      deniedTools: customSkills.deniedTools,
      availableTools: customSkills.availableTools,
      pinnedTools: customSkills.pinnedTools,
      memoryLimit: customSkills.memoryLimit,
      voiceModelSelection: customSkills.voiceModelSelection,
      sttModelSelection: customSkills.sttModelSelection,
      imageVisionModelSelection: customSkills.imageVisionModelSelection,
      videoVisionModelSelection: customSkills.videoVisionModelSelection,
      audioVisionModelSelection: customSkills.audioVisionModelSelection,
      variants: customSkills.variants,
    })
    .from(customSkills)
    .where(
      isUuid(skillIdOrSlug)
        ? eq(customSkills.id, skillIdOrSlug)
        : eq(customSkills.slug, skillIdOrSlug),
    )
    .limit(1);
  return row ?? null;
}

/**
 * Build a BridgeSkill from a custom-skill row: resolve the active variant
 * (explicit id → default variant → first variant) with variant fields falling
 * back to row-level model selections.
 */
function buildCustomBridgeSkill(
  row: CustomSkillContextRow,
  activeVariantId: string | null,
): BridgeSkill {
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
          activeVariant.sttModelSelection ?? row.sttModelSelection ?? undefined,
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

/** Build a BridgeSkill from a default (config) skill's variants. */
function buildDefaultBridgeSkill(
  defaultSkill: Skill,
  activeVariantId: string | null,
): BridgeSkill | null {
  const activeVariant = activeVariantId
    ? (defaultSkill.variants.find((v) => v.id === activeVariantId) ??
      defaultSkill.variants.find((v) => v.isDefault) ??
      defaultSkill.variants[0])
    : (defaultSkill.variants.find((v) => v.isDefault) ??
      defaultSkill.variants[0]);
  return activeVariant ?? null;
}

/**
 * Shared skill resolution: default skills from config (no DB round-trip),
 * custom skills via ONE customSkills query (UUID or slug). Returns the raw
 * custom-skill row alongside the BridgeSkill so callers needing the config
 * columns (compactTrigger, tool config, memoryLimit) don't re-query.
 */
async function resolveSkillInternal(
  rawSkillId: string,
  favoriteVariantId: string | null | undefined,
): Promise<{
  skill: BridgeSkill | null;
  customSkillRow: CustomSkillContextRow | null;
}> {
  const { skillId, variantId: explicitVariantId } = parseSkillId(rawSkillId);
  const activeVariantId = explicitVariantId ?? favoriteVariantId ?? null;

  // Default skill: resolve from config
  const defaultSkill = DEFAULT_SKILLS.find((c) => c.id === skillId);
  if (defaultSkill) {
    return {
      skill: buildDefaultBridgeSkill(defaultSkill, activeVariantId),
      customSkillRow: null,
    };
  }

  // Custom skill: resolve variant-aware model selections from DB (UUID or slug)
  const row = await fetchCustomSkillContextRow(skillId);
  if (!row) {
    return { skill: null, customSkillRow: null };
  }
  return {
    skill: buildCustomBridgeSkill(row, activeVariantId),
    customSkillRow: row,
  };
}

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
  return (await resolveSkillInternal(rawSkillId, favoriteVariantId)).skill;
}

/**
 * Everything the favorite → skill cascade consumers need, resolved in
 * ONE favorite query + ONE customSkills query.
 */
export interface SkillFavoriteContext {
  /** Resolved favorite config (null when none / not found). */
  favorite: FavoriteConfig | null;
  /** Variant-aware model selections for the active skill (null when no skill / not found). */
  skill: BridgeSkill | null;
  /** Raw custom-skill config columns (null for default skills / no skill). */
  customSkill: CustomSkillConfig | null;
}

/**
 * Resolve the favorite + skill context shared by ai-stream setup, execute-tool
 * and headless runs.
 *
 * - Favorite: resolved via resolveFavoriteConfig (UUID, "skillSlug__variantId",
 *   or slug), unless a pre-resolved favorite is passed in.
 * - Skill: "slug__variantId", UUID, or slug. Explicit variant in the skillId
 *   wins; otherwise the variant merged into the favorite's skillId is used.
 * - Custom skills: ONE DB query fetches config + bridge columns together.
 */
export async function resolveSkillFavoriteContext(params: {
  favoriteId: string | null | undefined;
  /** Skill identifier: "slug__variantId", UUID, or slug. */
  skillId: string | null | undefined;
  userId: string | undefined;
  /**
   * Pre-resolved favorite (pass null for "resolved, none"). When provided the
   * favorite query is skipped - callers that already loaded the favorite
   * (e.g. stream-setup's loadFavoriteOnce) resolve it exactly ONCE.
   */
  favorite?: FavoriteConfig | null;
}): Promise<SkillFavoriteContext> {
  const favorite =
    params.favorite !== undefined
      ? params.favorite
      : await resolveFavoriteConfig(
          params.favoriteId ?? undefined,
          params.userId,
        );

  // The skill to resolve: an explicit skillId wins, else the FAVORITE's own skill
  // (a favorite is a skill+variant pointer). Without this fallback, a favorite
  // whose own media-selection columns are empty resolved `skill: null` and its
  // variant's media models (e.g. the QA fav's gpt-5-image-MINI) were never read —
  // media-gen then fell back to the platform DEFAULT (gpt-5-image, non-mini).
  const effectiveSkillId = params.skillId ?? favorite?.skillId ?? null;
  if (!effectiveSkillId) {
    return { favorite, skill: null, customSkill: null };
  }

  // The favorite's variant: prefer its own `variantId` column, then fall back to
  // a variant merged into its skillId ("slug__variant"). resolveFavoriteConfig
  // returns the bare skillId (= character_id, NO variant suffix), so parsing it
  // alone yielded null → the skill's DEFAULT variant (budget → deepseek) instead
  // of THIS favorite's variant (native-image → gemini). Reading the column fixes
  // the divergence from the model the stream actually resolves.
  const favoriteVariantId = favorite
    ? (favorite.variantId ?? parseSkillId(favorite.skillId).variantId)
    : null;
  const { skill, customSkillRow } = await resolveSkillInternal(
    effectiveSkillId,
    favoriteVariantId,
  );

  return {
    favorite,
    skill,
    customSkill: customSkillRow
      ? {
          compactTrigger: customSkillRow.compactTrigger,
          deniedTools: customSkillRow.deniedTools,
          availableTools: customSkillRow.availableTools,
          pinnedTools: customSkillRow.pinnedTools,
          memoryLimit: customSkillRow.memoryLimit,
        }
      : null,
  };
}

/**
 * Resolve a favorite to a concrete { model, skill, favoriteConfig } trio.
 * Model cascade: favorite manual/filters selection → skill-variant selection.
 * Returns null when the favorite doesn't exist or no model is resolvable.
 * Shared by the headless adapter and resume-stream's revival path.
 */
export async function resolveFavorite(
  favoriteId: string,
  userId: string,
  user: JwtPayloadType,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<{
  model: ChatModelId;
  skill: string;
  favoriteConfig: FavoriteConfig;
} | null> {
  const favorite = await resolveFavoriteConfig(favoriteId, userId);

  if (!favorite) {
    logger.error("[Headless AI] Favorite not found", {
      favoriteId,
      userId,
      locale,
    });
    return null;
  }

  const skill = favorite.skillId || NO_SKILL_ID;
  const availability = await getInstanceAvailability();

  const sel = favorite.modelSelection;

  if (sel && isManualSelection(sel) && "manualModelId" in sel) {
    return {
      model: sel.manualModelId,
      skill,
      favoriteConfig: favorite,
    };
  }
  if (sel && isFiltersSelection(sel)) {
    const best = getBestChatModel(sel, user, availability);
    if (best) {
      return { model: best.id, skill, favoriteConfig: favorite };
    }
  }

  if (skill !== NO_SKILL_ID) {
    // Skill-variant model resolution via the shared skills-domain resolver.
    // The favorite is already resolved - passed through, never re-queried.
    const { skill: skillVariant } = await resolveSkillFavoriteContext({
      favoriteId,
      skillId: skill,
      userId,
      favorite,
    });
    const varSel = skillVariant?.modelSelection;
    if (varSel && (isManualSelection(varSel) || isFiltersSelection(varSel))) {
      const best = getBestChatModel(varSel, user, availability);
      if (best) {
        return { model: best.id, skill, favoriteConfig: favorite };
      }
    }
  }

  logger.warn(
    "[Headless AI] Favorite has no resolvable model - pass model explicitly",
    {
      favoriteId,
      skillId: skill,
    },
  );
  return null;
}
