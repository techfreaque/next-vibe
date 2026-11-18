/**
 * Ensure Default Companion (server)
 *
 * Guarantees a user never ends up with favorites but no companion. Runs after a
 * favorite of a NON-companion skill is created: when the user holds no favorite
 * of any companion skill, every variant of the default companion (Thea) is
 * created through `FavoritesCreateRepository.createFavorite`, the one create
 * path, so each card relays cross-instance, emits `favorite-created` on the
 * list endpoint for the open browser, and the variants-mode reconcile ends at
 * ALL once the set is complete.
 *
 * Idempotent: the companion rows use deterministic slugs (`thea-<variant>`)
 * through createFavorite's forced-slug upsert on (userId, slug), so a
 * concurrent double-add converges on the same rows instead of duplicating.
 * Never touches the active favorite.
 */

import "server-only";

import { and, eq, inArray, max, notInArray } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  ensureUniqueSlug,
  formatSkillId,
  generateFavoriteSlug,
} from "../../chat/slugify";
import { DEFAULT_SKILLS } from "../config";
import type { FavoriteCreateT } from "./create/i18n";
import { FavoritesCreateRepository } from "./create/repository";
import { chatFavorites } from "./db";
import {
  DEFAULT_COMPANION_SKILL_ID,
  getCompanionSkillIds,
  getDefaultCompanionVariants,
  isCompanionSkillId,
} from "./default-companion";
import { VariantsMode } from "./enum";

/**
 * Add the default companion's variants when `addedSkillId` (canonical, plain)
 * is not a companion and the user holds no companion favorite.
 *
 * @returns how many companion favorites were created (0 when nothing to do)
 */
export async function ensureDefaultCompanion(params: {
  addedSkillId: string;
  user: JwtPayloadType;
  logger: EndpointLogger;
  t: FavoriteCreateT;
  locale: CountryLanguage;
}): Promise<number> {
  const { addedSkillId, user, logger, t, locale } = params;
  const userId = user.id;
  if (!userId || isCompanionSkillId(addedSkillId)) {
    return 0;
  }

  try {
    const [existingCompanion] = await db
      .select({ id: chatFavorites.id })
      .from(chatFavorites)
      .where(
        and(
          eq(chatFavorites.userId, userId),
          inArray(chatFavorites.skillId, getCompanionSkillIds()),
        ),
      )
      .limit(1);
    if (existingCompanion) {
      return 0;
    }

    const variants = getDefaultCompanionVariants();
    const companionIcon = DEFAULT_SKILLS.find(
      (skill) => skill.id === DEFAULT_COMPANION_SKILL_ID,
    )?.icon;
    const skillSlug = FavoritesCreateRepository.resolveSkillSlug(
      DEFAULT_COMPANION_SKILL_ID,
    );

    // Another row could in theory own a `thea-<variant>` slug (e.g. a custom
    // variant name). Never upsert over it: that variant gets a suffixed slug.
    // A row that already IS this companion variant (a concurrent ensure got
    // there first) keeps the deterministic slug, so the upsert converges.
    const baseSlugs = variants.map((variant) =>
      generateFavoriteSlug({ skillSlug, variantId: variant.id }),
    );
    const slugOwners = await db
      .select({
        slug: chatFavorites.slug,
        skillId: chatFavorites.skillId,
        variantId: chatFavorites.variantId,
      })
      .from(chatFavorites)
      .where(
        and(
          eq(chatFavorites.userId, userId),
          inArray(chatFavorites.slug, baseSlugs),
        ),
      );
    const takenSlugs = slugOwners.map((row) => row.slug);

    let created = 0;
    for (const [index, variant] of variants.entries()) {
      const baseSlug = baseSlugs[index] ?? skillSlug;
      const owner = slugOwners.find((row) => row.slug === baseSlug);
      const ownedByOther =
        owner !== undefined &&
        (owner.skillId !== DEFAULT_COMPANION_SKILL_ID ||
          owner.variantId !== variant.id);
      const slug = ownedByOther
        ? ensureUniqueSlug(baseSlug, takenSlugs)
        : baseSlug;
      takenSlugs.push(slug);
      const result = await FavoritesCreateRepository.createFavorite(
        {
          skillId: formatSkillId(DEFAULT_COMPANION_SKILL_ID, variant.id),
          icon: companionIcon,
        },
        user,
        logger,
        t,
        locale,
        false,
        slug,
      );
      if (result.success) {
        created += 1;
      } else {
        logger.error("Failed to add default companion variant", {
          userId,
          variantId: variant.id,
          message: result.message,
        });
      }
    }

    logger.debug("Default companion added", {
      userId,
      addedSkillId,
      created,
    });
    return created;
  } catch (error) {
    // The user's own favorite is already stored; a missing companion must not
    // fail that create.
    logger.error("Failed to ensure default companion", parseError(error));
    return 0;
  }
}

/**
 * ONE-TIME backfill for users who already hold favorites but no companion
 * (created before ensureDefaultCompanion existed). Inserts every default
 * companion variant as a thin-pointer row (model selections NULL, they
 * resolve through the skill variant at read time), positioned after the
 * user's existing favorites and flagged variantsMode ALL so variants added
 * later reach them too. Direct inserts, no realtime emit or relay: it runs
 * from a seed with no browser attached. Never touches the active favorite.
 *
 * Idempotent: a user who holds any companion row is skipped, and inserts use
 * deterministic slugs with ON CONFLICT DO NOTHING.
 *
 * @param userIds limit to these users (tests); omitted = every user
 */
export async function backfillDefaultCompanions(params: {
  logger: EndpointLogger;
  userIds?: string[];
}): Promise<{ usersTouched: number; rowsInserted: number }> {
  const { logger, userIds } = params;
  const companionSkillIds = getCompanionSkillIds();
  const variants = getDefaultCompanionVariants();
  const skillSlug = FavoritesCreateRepository.resolveSkillSlug(
    DEFAULT_COMPANION_SKILL_ID,
  );

  const withCompanion = db
    .select({ userId: chatFavorites.userId })
    .from(chatFavorites)
    .where(inArray(chatFavorites.skillId, companionSkillIds));
  const candidates = await db
    .selectDistinct({ userId: chatFavorites.userId })
    .from(chatFavorites)
    .where(
      and(
        notInArray(chatFavorites.userId, withCompanion),
        userIds ? inArray(chatFavorites.userId, userIds) : undefined,
      ),
    );

  let usersTouched = 0;
  let rowsInserted = 0;
  for (const { userId } of candidates) {
    try {
      const slugRows = await db
        .select({ slug: chatFavorites.slug })
        .from(chatFavorites)
        .where(eq(chatFavorites.userId, userId));
      const takenSlugs = slugRows.map((row) => row.slug);
      const [maxPositionResult] = await db
        .select({ maxPosition: max(chatFavorites.position) })
        .from(chatFavorites)
        .where(eq(chatFavorites.userId, userId));
      const firstPosition = (maxPositionResult?.maxPosition ?? -1) + 1;

      const rows = variants.map(
        (variant, index): typeof chatFavorites.$inferInsert => {
          const slug = ensureUniqueSlug(
            generateFavoriteSlug({ skillSlug, variantId: variant.id }),
            takenSlugs,
          );
          takenSlugs.push(slug);
          return {
            userId,
            slug,
            skillId: DEFAULT_COMPANION_SKILL_ID,
            variantId: variant.id,
            position: firstPosition + index,
            variantsMode: VariantsMode.ALL,
          };
        },
      );
      if (rows.length === 0) {
        continue;
      }
      const inserted = await db
        .insert(chatFavorites)
        .values(rows)
        .onConflictDoNothing({
          target: [chatFavorites.userId, chatFavorites.slug],
        })
        .returning({ id: chatFavorites.id });
      if (inserted.length > 0) {
        usersTouched += 1;
        rowsInserted += inserted.length;
      }
    } catch (error) {
      logger.error("Default companion backfill failed for user", {
        userId,
        error: parseError(error).message,
      });
    }
  }
  return { usersTouched, rowsInserted };
}
