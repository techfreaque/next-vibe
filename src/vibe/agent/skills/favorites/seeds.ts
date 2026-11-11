/**
 * Favorites Seeds — ONE-TIME variants-mode backfill
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ THIS IS A ONE-SHOT SEED. DELETE THIS FILE AFTER IT HAS RUN ONCE ON PROD. │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Counterpart to the `variants_mode` column add (migration
 * 20261111180903_striped_wrecking_crew.sql). The schema change ships as a clean
 * Drizzle migration; this data backfill ships as a TS seed so it rides the normal
 * seed step on the next deploy (no dedicated deploy).
 *
 * What it does (idempotent): for every (user, companion) where the user favorited
 * 2+ KNOWN variants of that companion, set variantsMode = 'all' on those rows and
 * complete any missing variant (incl. newly-introduced ones like thea's "hacker").
 * Users with 0 or 1 variant of a companion are left as-is (stay 'some').
 *
 * The companion -> variant set comes from DEFAULT_SKILLS (the TS source of truth),
 * not a hardcoded list. After this has run once on prod, delete this file and run
 * `vibe gen` so the generated seed index drops it.
 */

import { formatDatabase } from "next-vibe/logger/formatters";
import type { EndpointLogger } from "next-vibe/logger/types";

import { DEFAULT_SKILLS } from "../config";
import { promoteMultiVariantCompanions } from "./variants-mode";

// Run after the core skills/user seeds so favorite rows already exist.
export const priority = 10;

function variantIdsForSkill(skillId: string): string[] {
  return (
    DEFAULT_SKILLS.find((s) => s.id === skillId)?.variants.map((v) => v.id) ??
    []
  );
}

async function runBackfill(logger: EndpointLogger): Promise<void> {
  try {
    const stats = await promoteMultiVariantCompanions({
      logger,
      variantIdsForSkill,
    });
    logger.info(
      formatDatabase(
        `Variants-mode backfill: ${stats.promotedGroups} companion group(s) across ${stats.usersTouched} user(s) promoted to 'all'`,
        "🌱",
      ),
    );
  } catch (error) {
    logger.error(`Variants-mode backfill seed failed: ${String(error)}`);
  }
}

export async function dev(logger: EndpointLogger): Promise<void> {
  await runBackfill(logger);
}

export async function prod(logger: EndpointLogger): Promise<void> {
  await runBackfill(logger);
}

export async function test(): Promise<void> {
  // No test seeds — the variants-mode test suite builds its own fixtures.
}
