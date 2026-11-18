"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { UserPermissionRoleValue } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";

import { ChatSettingsRepositoryClient } from "../../../../chat/settings/repository-client";
import { formatSkillId, parseSkillId } from "../../../../chat/slugify";
import {
  COMPANION_SKILLS,
  DEFAULT_SKILLS,
  type SkillVariant,
} from "../../../../skills/config";
import type { SkillVariantData } from "../../../../skills/db";
import favoriteCreateDefinitions from "../../../../skills/favorites/create/definition";
import favoritesDefinition from "../../../../skills/favorites/definition";
import favoriteDeleteBatchDefinitions from "../../../../skills/favorites/delete-batch/definition";
import type { ChatModelId } from "../../../models";

/** Built-in variant config or a fetched (community) variant - both seed the same way. */
type SeedVariant = SkillVariant | SkillVariantData;

interface SeedDeps {
  user: JwtPayloadType;
  logger: EndpointLogger;
  locale: CountryLanguage;
}

export interface SeededFavorite {
  /** Favorite id (slug) as the create endpoint returned it */
  id: string;
  /** Merged "skill__variant" id */
  skillId: string;
}

export const COMPANION_IDS: ReadonlySet<string> = new Set(
  COMPANION_SKILLS.map((c) => c.id),
);

/** The companion everyone gets when they skip or pick nothing. */
export const DEFAULT_COMPANION_ID = COMPANION_SKILLS[0]?.id ?? "thea";

export function isCompanionSkillId(skillId: string): boolean {
  return COMPANION_IDS.has(parseSkillId(skillId).skillId);
}

export function defaultVariantOf<T extends SeedVariant>(
  variants: readonly T[],
): T | null {
  return variants.find((v) => v.isDefault) ?? variants[0] ?? null;
}

/**
 * Create one favorite per given variant of a skill. One failed create never
 * aborts the rest: it is logged with context and skipped.
 */
export async function addSkillFavorites({
  skillId,
  icon,
  variants,
  deps,
}: {
  skillId: string;
  icon: IconKey | null;
  variants: readonly SeedVariant[];
  deps: SeedDeps;
}): Promise<SeededFavorite[]> {
  const { user, logger, locale } = deps;
  const created: SeededFavorite[] = [];
  for (const variant of variants) {
    const merged = formatSkillId(skillId, variant.id);
    try {
      const result = await apiClient.mutate(
        favoriteCreateDefinitions.POST,
        logger,
        user,
        {
          skillId: merged,
          icon: icon ?? undefined,
          modelSelection: variant.modelSelection,
          voiceModelSelection: variant.voiceModelSelection ?? undefined,
          sttModelSelection: variant.sttModelSelection ?? undefined,
          imageVisionModelSelection:
            variant.imageVisionModelSelection ?? undefined,
          videoVisionModelSelection:
            variant.videoVisionModelSelection ?? undefined,
          audioVisionModelSelection:
            variant.audioVisionModelSelection ?? undefined,
          imageGenModelSelection: variant.imageGenModelSelection ?? undefined,
          musicGenModelSelection: variant.musicGenModelSelection ?? undefined,
          videoGenModelSelection: variant.videoGenModelSelection ?? undefined,
        },
        undefined,
        locale,
      );
      if (result.success) {
        created.push({ id: result.data.id, skillId: merged });
      } else {
        logger.error("Onboarding: failed to add favorite", {
          component: "CompanionOnboarding",
          operation: "addSkillFavorites",
          skillId: merged,
          errorType: result.errorType.errorKey,
          reason: result.message,
        });
      }
    } catch (error) {
      logger.error("Onboarding: adding favorite threw", parseError(error), {
        component: "CompanionOnboarding",
        operation: "addSkillFavorites",
        skillId: merged,
      });
    }
  }
  return created;
}

/** Every variant of a built-in companion, so all of its modes are one tap away. */
export async function seedCompanion(
  companionId: string,
  deps: SeedDeps,
): Promise<SeededFavorite | null> {
  const companion = COMPANION_SKILLS.find((c) => c.id === companionId);
  if (!companion) {
    return null;
  }
  const created = await addSkillFavorites({
    skillId: companion.id,
    icon: companion.icon,
    variants: companion.variants,
    deps,
  });
  const defaultVariant = defaultVariantOf(companion.variants);
  const defaultComposite = defaultVariant
    ? formatSkillId(companion.id, defaultVariant.id)
    : null;
  return (
    created.find((c) => c.skillId === defaultComposite) ?? created[0] ?? null
  );
}

/** The default variant of each built-in skill, skipping any the user cannot use. */
export async function seedBuiltInSkills(
  skillIds: readonly string[],
  deps: SeedDeps,
): Promise<SeededFavorite[]> {
  const created: SeededFavorite[] = [];
  const userRoles: readonly (typeof UserPermissionRoleValue)[] =
    deps.user.roles;
  for (const skillId of skillIds) {
    const skill = DEFAULT_SKILLS.find((s) => s.id === skillId);
    if (!skill) {
      continue;
    }
    if (
      skill.userRole &&
      skill.userRole.length > 0 &&
      !skill.userRole.some((r) => userRoles.includes(r))
    ) {
      continue;
    }
    const variant = defaultVariantOf(skill.variants);
    if (!variant) {
      continue;
    }
    created.push(
      ...(await addSkillFavorites({
        skillId: skill.id,
        icon: skill.icon,
        variants: [variant],
        deps,
      })),
    );
  }
  return created;
}

export async function removeFavorites(
  ids: readonly string[],
  deps: SeedDeps,
): Promise<void> {
  if (ids.length === 0) {
    return;
  }
  const { user, logger, locale } = deps;
  try {
    const result = await apiClient.mutate(
      favoriteDeleteBatchDefinitions.POST,
      logger,
      user,
      { ids: [...ids] },
      undefined,
      locale,
    );
    if (!result.success) {
      logger.error("Onboarding: failed to remove favorites", {
        component: "CompanionOnboarding",
        operation: "removeFavorites",
        count: ids.length,
        errorType: result.errorType.errorKey,
        reason: result.message,
      });
    }
  } catch (error) {
    logger.error("Onboarding: removing favorites threw", parseError(error), {
      component: "CompanionOnboarding",
      operation: "removeFavorites",
      count: ids.length,
    });
  }
}

/** Pull the real list so every new card shows with its resolved model. */
export async function refreshFavorites(logger: EndpointLogger): Promise<void> {
  await apiClient.refetchEndpoint(favoritesDefinition.GET, logger);
}

/** Same write the chat input selector does; the model follows the favorite. */
export async function activateFavorite(
  favorite: SeededFavorite,
  deps: SeedDeps,
  modelId: ChatModelId | null = null,
): Promise<void> {
  await ChatSettingsRepositoryClient.selectFavorite({
    favoriteId: favorite.id,
    modelId,
    skillId: favorite.skillId,
    logger: deps.logger,
    locale: deps.locale,
    user: deps.user,
  });
}
