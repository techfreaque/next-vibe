/**
 * Favorites Variants-Mode Reconciliation
 *
 * `variantsMode` is logically a per (user, companion) flag, mirrored onto every
 * `chat_favorites` row for that companion so a single-row read is self-describing:
 *   - ALL : the user holds every variant of this companion. When NEW variants are
 *           introduced later, they are auto-added for this user (durable, not a
 *           one-off migration) the next time this companion is reconciled.
 *   - SOME: the user picked an explicit subset. New variants are NOT auto-added.
 *
 * This module is the single source of truth for maintaining that flag + the
 * "all users get new variants" behaviour. The create/update/resolve paths call
 * `reconcileVariantsMode` after any mutation that changes a companion's row set.
 */

import "server-only";

import { and, asc, eq, max, sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { ensureUniqueSlug, generateFavoriteSlug } from "../../chat/slugify";
import { FavoritesCreateRepository } from "./create/repository";
import { chatFavorites } from "./db";
import type { VariantsModeValue } from "./enum";
import { VariantsMode } from "./enum";

/**
 * Reconcile `variantsMode` for one (user, companion) and auto-complete variants
 * when the companion is flagged ALL.
 *
 * Decision:
 *   - If the user currently holds EVERY named variant of this companion, OR any
 *     existing row for this companion is already flagged ALL, the companion is
 *     treated as ALL: every missing variant is inserted as a thin-pointer row and
 *     all of this companion's rows are set to ALL.
 *   - Otherwise the companion is SOME: all of its rows are set to SOME.
 *
 * Idempotent and safe to call repeatedly. Missing-row inserts respect the
 * (userId, slug) unique index via slug-collision suffixing and never duplicate an
 * existing (userId, skillId, variantId).
 */
export async function reconcileVariantsMode(params: {
  userId: string;
  skillId: string;
  variantIds: string[];
  logger: EndpointLogger;
}): Promise<void> {
  const { userId, skillId, variantIds, logger } = params;

  // A companion with 0 or 1 named variant cannot be "all vs some" in any
  // meaningful way; nothing to reconcile.
  if (variantIds.length < 2) {
    return;
  }

  const rows = await db
    .select({
      id: chatFavorites.id,
      variantId: chatFavorites.variantId,
      variantsMode: chatFavorites.variantsMode,
    })
    .from(chatFavorites)
    .where(
      and(eq(chatFavorites.userId, userId), eq(chatFavorites.skillId, skillId)),
    );

  if (rows.length === 0) {
    return;
  }

  const heldVariantIds = new Set(
    rows.map((r) => r.variantId).filter((id): id is string => id !== null),
  );
  const missingVariantIds = variantIds.filter((v) => !heldVariantIds.has(v));

  const alreadyAll = rows.some((r) => r.variantsMode === VariantsMode.ALL);
  const holdsEvery = variantIds.every((v) => heldVariantIds.has(v));
  const shouldBeAll = alreadyAll || holdsEvery;

  const targetMode: typeof VariantsModeValue = shouldBeAll
    ? VariantsMode.ALL
    : VariantsMode.SOME;

  // When ALL, auto-complete any variants the user is missing (this is what makes
  // newly-introduced variants reach every "all" user, durably).
  if (shouldBeAll && missingVariantIds.length > 0) {
    const skillSlug = FavoritesCreateRepository.resolveSkillSlug(skillId);

    const existingSlugRows = await db
      .select({ slug: chatFavorites.slug })
      .from(chatFavorites)
      .where(eq(chatFavorites.userId, userId));
    const existingSlugs = existingSlugRows.map((r) => r.slug);

    const [maxPositionResult] = await db
      .select({ maxPosition: max(chatFavorites.position) })
      .from(chatFavorites)
      .where(eq(chatFavorites.userId, userId));
    let nextPosition = (maxPositionResult?.maxPosition ?? -1) + 1;

    const insertRows: (typeof chatFavorites.$inferInsert)[] = [];
    for (const variantId of missingVariantIds) {
      const baseSlug =
        generateFavoriteSlug({ skillSlug, variantId }) || "favorite";
      const slug = ensureUniqueSlug(baseSlug, existingSlugs);
      // Track locally so sibling inserts in this batch don't collide.
      existingSlugs.push(slug);
      insertRows.push({
        userId,
        slug,
        skillId,
        variantId,
        position: nextPosition,
        variantsMode: VariantsMode.ALL,
      });
      nextPosition += 1;
    }

    try {
      // Thin-pointer rows: identity + slug + position only; model selections stay
      // NULL so each resolves through the skill->variant cascade at read time.
      await db.insert(chatFavorites).values(insertRows).onConflictDoNothing();
    } catch (error) {
      logger.error("Failed to auto-complete variants for favorite", {
        userId,
        skillId,
        error: String(error),
      });
    }
  }

  // Mirror the resolved mode onto every row of this companion that disagrees.
  await db
    .update(chatFavorites)
    .set({ variantsMode: targetMode, updatedAt: new Date() })
    .where(
      and(
        eq(chatFavorites.userId, userId),
        eq(chatFavorites.skillId, skillId),
        sql`${chatFavorites.variantsMode} <> ${targetMode}`,
      ),
    );
}

/**
 * Reconcile variants-mode for EVERY companion the user holds that currently
 * carries an ALL flag — the durable "new variants reach all users" mechanism.
 * Call on favorites read/resolve so a user flagged ALL for a companion picks up
 * variants introduced after their last write, without a one-off migration.
 */
export async function reconcileAllFlaggedCompanions(params: {
  userId: string;
  logger: EndpointLogger;
  variantIdsForSkill: (skillId: string) => string[];
}): Promise<void> {
  const { userId, logger, variantIdsForSkill } = params;

  const allFlagged = await db
    .selectDistinct({ skillId: chatFavorites.skillId })
    .from(chatFavorites)
    .where(
      and(
        eq(chatFavorites.userId, userId),
        eq(chatFavorites.variantsMode, VariantsMode.ALL),
      ),
    )
    .orderBy(asc(chatFavorites.skillId));

  for (const { skillId } of allFlagged) {
    const variantIds = variantIdsForSkill(skillId);
    if (variantIds.length < 2) {
      continue;
    }
    await reconcileVariantsMode({
      userId,
      skillId,
      variantIds,
      logger,
    });
  }
}

/**
 * ONE-TIME backfill: promote existing users who favorited 2+ known variants of a
 * companion to variantsMode = ALL, then complete their missing variants.
 *
 * This is the data-migration counterpart to the schema column add, implemented as
 * a TS seed (not SQL) so it runs through the normal seed step on the next deploy.
 * It is a one-shot: the seed file that calls this is deleted after it has run once
 * on prod. Idempotent — safe to run repeatedly.
 *
 * `variantIdsForSkill` resolves a companion's full variant set from the default-
 * skill definitions (DEFAULT_SKILLS), the single source of truth in TS — no
 * hardcoded companion/variant list.
 */
export async function promoteMultiVariantCompanions(params: {
  logger: EndpointLogger;
  variantIdsForSkill: (skillId: string) => string[];
}): Promise<{ promotedGroups: number; usersTouched: number }> {
  const { logger, variantIdsForSkill } = params;

  // All (user, companion) rows, grouped so we can count known-variant coverage.
  const rows = await db
    .select({
      userId: chatFavorites.userId,
      skillId: chatFavorites.skillId,
      variantId: chatFavorites.variantId,
    })
    .from(chatFavorites);

  // Build (user, skillId) -> set of held named variant ids.
  const held = new Map<string, Set<string>>();
  for (const r of rows) {
    if (r.variantId === null) {
      continue;
    }
    const key = `${r.userId}::${r.skillId}`;
    const set = held.get(key) ?? new Set<string>();
    set.add(r.variantId);
    held.set(key, set);
  }

  let promotedGroups = 0;
  const usersTouched = new Set<string>();

  for (const [key, heldVariants] of held) {
    const sep = key.indexOf("::");
    const userId = key.slice(0, sep);
    const skillId = key.slice(sep + 2);

    const variantIds = variantIdsForSkill(skillId);
    if (variantIds.length < 2) {
      continue;
    }
    // Count only KNOWN variants (unknown/legacy ids don't count toward the rule).
    const knownHeld = variantIds.filter((v) => heldVariants.has(v));
    if (knownHeld.length < 2) {
      continue;
    }

    // Flip this companion's rows to ALL first, so the reconcile treats it as ALL
    // and auto-completes every missing variant (incl. newly-introduced ones).
    await db
      .update(chatFavorites)
      .set({ variantsMode: VariantsMode.ALL, updatedAt: new Date() })
      .where(
        and(
          eq(chatFavorites.userId, userId),
          eq(chatFavorites.skillId, skillId),
          sql`${chatFavorites.variantsMode} <> ${VariantsMode.ALL}`,
        ),
      );
    await reconcileVariantsMode({ userId, skillId, variantIds, logger });

    promotedGroups += 1;
    usersTouched.add(userId);
  }

  return { promotedGroups, usersTouched: usersTouched.size };
}
