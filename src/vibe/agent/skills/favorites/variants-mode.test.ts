/**
 * Variants-Mode Reconciliation Tests
 *
 * Covers the going-forward behaviour that mirrors the on-deploy migration:
 *  - 2+ held variants of a companion => auto-complete missing + flag ALL
 *  - a user flagged ALL picks up a newly-introduced variant on reconcile
 *  - a single variant stays SOME
 *  - removing one variant of an ALL companion flips it to SOME, so the read
 *    reconcile never re-adds what the user just removed
 */

import { and, eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { chatFavorites } from "./db";
import { VariantsMode } from "./enum";
import {
  markCompanionsSubset,
  promoteMultiVariantCompanions,
  reconcileAllFlaggedCompanions,
} from "./variants-mode";

const SKILL_ID = "thea";
// Keep a stable local copy of the companion's full variant set for the test.
const THEA_VARIANT_IDS = [
  "brilliant",
  "cheap",
  "hacker",
  "oracle",
  "elon-tusk",
  "vision",
  "uncensored",
];

const logger = createEndpointLogger(false, defaultLocale);

describe("variants-mode reconcile", () => {
  let user: JwtPrivatePayloadType;

  beforeAll(async () => {
    user = await resolveTestAdminUser();
  });

  afterEach(async () => {
    // Remove every thea row this test touched for the admin user.
    await db
      .delete(chatFavorites)
      .where(
        and(
          eq(chatFavorites.userId, user.id),
          eq(chatFavorites.skillId, SKILL_ID),
        ),
      );
  });

  async function seed(variantIds: string[]): Promise<void> {
    let pos = 90000;
    for (const variantId of variantIds) {
      await db.insert(chatFavorites).values({
        userId: user.id,
        slug: `vm-test-${SKILL_ID}-${variantId}`,
        skillId: SKILL_ID,
        variantId,
        position: pos,
        variantsMode: VariantsMode.SOME,
      });
      pos += 1;
    }
  }

  async function rows(): Promise<
    { variantId: string | null; variantsMode: string }[]
  > {
    return db
      .select({
        variantId: chatFavorites.variantId,
        variantsMode: chatFavorites.variantsMode,
      })
      .from(chatFavorites)
      .where(
        and(
          eq(chatFavorites.userId, user.id),
          eq(chatFavorites.skillId, SKILL_ID),
        ),
      );
  }

  it("one-time backfill: 2+ held variants => promote ALL + complete missing", async () => {
    // Hold two named variants, missing the rest (incl. hacker). This mirrors a
    // pre-hacker user who picked a couple of thea variants.
    await seed(["brilliant", "cheap"]);

    const stats = await promoteMultiVariantCompanions({
      logger,
      variantIdsForSkill: (skillId) =>
        skillId === SKILL_ID ? THEA_VARIANT_IDS : [],
    });
    expect(stats.promotedGroups).toBeGreaterThanOrEqual(1);

    const result = await rows();
    const heldVariants = new Set(result.map((r) => r.variantId));
    for (const v of THEA_VARIANT_IDS) {
      expect(heldVariants.has(v), `missing variant ${v}`).toBe(true);
    }
    // The newly-introduced variant specifically arrived.
    expect(heldVariants.has("hacker")).toBe(true);
    expect(result.every((r) => r.variantsMode === VariantsMode.ALL)).toBe(true);
  });

  it("one-time backfill is idempotent", async () => {
    await seed(["brilliant", "cheap"]);
    const run = (): Promise<{ promotedGroups: number }> =>
      promoteMultiVariantCompanions({
        logger,
        variantIdsForSkill: (skillId) =>
          skillId === SKILL_ID ? THEA_VARIANT_IDS : [],
      });
    await run();
    const countAfterFirst = (await rows()).length;
    await run();
    const countAfterSecond = (await rows()).length;
    expect(countAfterSecond).toBe(countAfterFirst);
  });

  it("ALL-flagged user picks up a newly-introduced variant on read reconcile", async () => {
    // Simulate a user who was ALL before "hacker" existed: hold the pre-hacker
    // set, already flagged ALL, but missing hacker.
    const preHacker = THEA_VARIANT_IDS.filter((v) => v !== "hacker");
    await seed(preHacker);
    await db
      .update(chatFavorites)
      .set({ variantsMode: VariantsMode.ALL })
      .where(
        and(
          eq(chatFavorites.userId, user.id),
          eq(chatFavorites.skillId, SKILL_ID),
        ),
      );

    await reconcileAllFlaggedCompanions({
      userId: user.id,
      logger,
      variantIdsForSkill: (skillId) =>
        skillId === SKILL_ID ? THEA_VARIANT_IDS : [],
    });

    const result = await rows();
    expect(result.some((r) => r.variantId === "hacker")).toBe(true);
    expect(result.every((r) => r.variantsMode === VariantsMode.ALL)).toBe(true);
  });

  it("single variant stays SOME (not promoted by backfill)", async () => {
    await seed(["brilliant"]);

    await promoteMultiVariantCompanions({
      logger,
      variantIdsForSkill: (skillId) =>
        skillId === SKILL_ID ? THEA_VARIANT_IDS : [],
    });

    const result = await rows();
    // No promotion, no auto-completion, no ALL flag.
    expect(result).toHaveLength(1);
    expect(result[0]?.variantsMode).toBe(VariantsMode.SOME);
  });

  it("removing one variant of an ALL companion is not undone on read", async () => {
    await seed(THEA_VARIANT_IDS);
    await db
      .update(chatFavorites)
      .set({ variantsMode: VariantsMode.ALL })
      .where(
        and(
          eq(chatFavorites.userId, user.id),
          eq(chatFavorites.skillId, SKILL_ID),
        ),
      );
    await db
      .delete(chatFavorites)
      .where(
        and(
          eq(chatFavorites.userId, user.id),
          eq(chatFavorites.skillId, SKILL_ID),
          eq(chatFavorites.variantId, "hacker"),
        ),
      );

    await markCompanionsSubset({ userId: user.id, skillIds: [SKILL_ID] });
    await reconcileAllFlaggedCompanions({
      userId: user.id,
      logger,
      variantIdsForSkill: (skillId) =>
        skillId === SKILL_ID ? THEA_VARIANT_IDS : [],
    });

    const result = await rows();
    expect(result).toHaveLength(THEA_VARIANT_IDS.length - 1);
    expect(result.some((r) => r.variantId === "hacker")).toBe(false);
    expect(result.every((r) => r.variantsMode === VariantsMode.SOME)).toBe(
      true,
    );
  });
});
