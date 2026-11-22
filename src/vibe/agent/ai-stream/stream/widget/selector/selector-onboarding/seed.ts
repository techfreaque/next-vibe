"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { UserPermissionRoleValue } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { getReferrer } from "next-vibe/ui/lib/dom";
import { getCurrentOrigin } from "next-vibe/ui/lib/location";
import { executeQuery } from "next-vibe/unified-ui/hooks/query-executor";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";

import chatSettingsDefinition from "../../../../../chat/settings/definition";
import { ChatSettingsRepositoryClient } from "../../../../../chat/settings/repository-client";
import { formatSkillId, parseSkillId } from "../../../../../chat/slugify";
import type { AgentEnvAvailability } from "../../../../../env-availability";
import skillSingleDefinition from "../../../../../skills/[id]/definition";
import {
  COMPANION_SKILLS,
  DEFAULT_SKILLS,
  type SkillVariant,
} from "../../../../../skills/config";
import type { SkillVariantData } from "../../../../../skills/db";
import favoriteCreateDefinitions from "../../../../../skills/favorites/create/definition";
import favoritesDefinition, {
  type FavoriteCard,
} from "../../../../../skills/favorites/definition";
import { type ChatModelId, getBestChatModel } from "../../../../models";

/** Built-in variant config or a fetched (community) variant - both seed the same way. */
type SeedVariant = SkillVariant | SkillVariantData;

export interface SeedDeps {
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
          component: "SelectorOnboarding",
          operation: "addSkillFavorites",
          skillId: merged,
          errorType: result.errorType.errorKey,
          reason: result.message,
        });
      }
    } catch (error) {
      logger.error("Onboarding: adding favorite threw", parseError(error), {
        component: "SelectorOnboarding",
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

/**
 * Every variant of each built-in specialist (the "Add specialists" chips),
 * skipping skills the user's roles cannot use and ids already seeded.
 */
export async function seedSpecialists(
  skillIds: readonly string[],
  deps: SeedDeps,
): Promise<SeededFavorite[]> {
  const created: SeededFavorite[] = [];
  const userRoles: readonly (typeof UserPermissionRoleValue)[] =
    deps.user.roles;
  const seen = new Set<string>();
  for (const skillId of skillIds) {
    if (seen.has(skillId)) {
      continue;
    }
    seen.add(skillId);
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
    created.push(
      ...(await addSkillFavorites({
        skillId: skill.id,
        icon: skill.icon,
        variants: skill.variants,
        deps,
      })),
    );
  }
  return created;
}

/** Pull the real list so every new card shows with its resolved model. */
export async function refreshFavorites(logger: EndpointLogger): Promise<void> {
  await apiClient.refetchEndpoint(favoritesDefinition.GET, logger);
}

/**
 * Same write the chat input selector does; the model follows the favorite.
 * Then re-read the settings: the optimistic update is skipped while the
 * settings query has no data yet, and a settings read that started before
 * the save (chat just mounted after a skill page) would land afterwards and
 * put the previous companion back. A fresh read after the save wins.
 */
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
  await apiClient.refetchEndpoint(chatSettingsDefinition.GET, deps.logger);
}

/** Skill ids in links are slugs, UUIDs or `<skill>__<variant>`. */
const ARRIVAL_SKILL_PATTERN = /^[\w-]{1,128}$/;

/** The favorite fields the arrival logic reads. */
type FavoriteRef = Pick<FavoriteCard, "id" | "skillId" | "modelId">;

/** A `?skill=` value worth acting on, or null. */
export function parseArrivalSkillParam(raw: string | null): string | null {
  return raw !== null && ARRIVAL_SKILL_PATTERN.test(raw) ? raw : null;
}

/** The skill a visitor arrived with, resolved to the variant to add. */
export interface ArrivalSkill {
  /** The raw `?skill=` value */
  param: string;
  /** Plain skill id (slug or UUID) as linked */
  baseId: string;
  /** Canonical internal id of a custom skill (favorites may store it) */
  internalId: string | null;
  name: string;
  icon: IconKey | null;
  variant: SeedVariant;
  isCompanion: boolean;
}

/** Look the arrival skill up (built-in or community). Null when unusable, logged. */
export async function resolveArrivalSkill(
  param: string,
  deps: SeedDeps,
): Promise<ArrivalSkill | null> {
  const { logger, user, locale } = deps;
  const { skillId: baseId, variantId } = parseSkillId(param);
  try {
    const response = await executeQuery({
      endpoint: skillSingleDefinition.GET,
      logger,
      user,
      locale,
      requestData: undefined,
      pathParams: { id: baseId },
    });
    if (!response.success) {
      const referrerUrl = getReferrer();
      const referrer = referrerUrl ? new URL(referrerUrl) : null;
      const source = !referrer
        ? "unavailable"
        : referrer.origin !== getCurrentOrigin()
          ? "external"
          : /(?:^|\/)skill\//.test(referrer.pathname)
            ? "skill-page"
            : "same-origin";
      logger.warn("Onboarding: arrival skill lookup failed", {
        skillId: param,
        hasVariant: variantId !== null,
        errorKey: response.errorType.errorKey,
        // A proxy may return an HTML 504, with no application status.
        errorCode:
          response.errorType.errorKey === "errorTypes.http_error"
            ? null
            : response.errorType.errorCode,
        source,
      });
      return null;
    }
    const skill = response.data;
    const variant =
      (variantId
        ? skill.variants.find((v) => v.id === variantId)
        : undefined) ?? defaultVariantOf(skill.variants);
    if (!variant) {
      logger.warn("Onboarding: arrival skill has no variant", {
        skillId: param,
      });
      return null;
    }
    return {
      param,
      baseId,
      internalId: skill.internalId,
      name: skill.name ?? baseId,
      icon: skill.icon,
      variant,
      isCompanion: isCompanionSkillId(baseId),
    };
  } catch (error) {
    logger.error("Onboarding: arrival skill lookup threw", parseError(error), {
      component: "SelectorOnboarding",
      skillId: param,
    });
    return null;
  }
}

/** Favorite row of the arrival skill if the user already holds it. */
export function findArrivalFavorite(
  arrival: ArrivalSkill,
  favorites: readonly FavoriteRef[],
): FavoriteRef | null {
  const composite = formatSkillId(arrival.baseId, arrival.variant.id);
  const internalComposite =
    arrival.internalId !== null
      ? formatSkillId(arrival.internalId, arrival.variant.id)
      : null;
  return (
    favorites.find(
      (f) => f.skillId === composite || f.skillId === internalComposite,
    ) ?? null
  );
}

/**
 * Add the arrival skill (unless held) and make it the active one with its own
 * model. A set without a companion gets the default companion from the create
 * path (server for accounts, local repository for guests).
 */
export async function addAndActivateArrival(
  arrival: ArrivalSkill,
  favorites: readonly FavoriteRef[],
  deps: SeedDeps,
  availability: AgentEnvAvailability,
): Promise<SeededFavorite | null> {
  const existing = findArrivalFavorite(arrival, favorites);
  const favorite = existing
    ? { id: existing.id, skillId: existing.skillId }
    : ((
        await addSkillFavorites({
          skillId: arrival.baseId,
          icon: arrival.icon,
          variants: [arrival.variant],
          deps,
        })
      )[0] ?? null);
  if (!favorite) {
    return null;
  }
  const modelId =
    existing?.modelId ??
    getBestChatModel(arrival.variant.modelSelection, deps.user, availability)
      ?.id ??
    null;
  await activateFavorite(favorite, deps, modelId);
  return favorite;
}
