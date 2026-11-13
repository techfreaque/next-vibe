/**
 * E2E: skill favorites — add from the skill page, remove a whole skill, remove
 * one variant. Every flow is checked through the real UI after a page reload
 * AND in the store that owns the data: the chat_favorites table for customers,
 * localStorage for guests (public users never get DB rows).
 *
 * Regression cover for fe5e828be1 ("fix remove-skill delete"): removing a
 * multi-variant skill must remove EVERY variant, not all-but-one.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { and, eq } from "drizzle-orm";
import type { WidgetData } from "next-vibe/core/utils/json";
import { db } from "next-vibe/database";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import type { Locator, Page } from "playwright";
import { describe, expect } from "vitest";
import { z } from "zod";

import { createE2ECreditUser } from "../../ai-stream/testing/e2e-credit-user";
import { STORAGE_KEYS } from "../../chat/constants";
import { parseSkillId } from "../../chat/slugify";
import { scopedTranslation as skillT } from "../[id]/i18n";
import { DEFAULT_SKILLS } from "../config";
import { scopedTranslation as skillsT } from "../i18n";
import { FAVORITES_LIST_ALIAS } from "./constants";
import { chatFavorites } from "./db";
import deleteBatchEndpoints from "./delete-batch/definition";
import { VariantsMode } from "./enum";
import { scopedTranslation as favoritesT } from "./i18n";

const { t: tFav } = favoritesT.scopedT(E2E_LOCALE);
const { t: tSkill } = skillT.scopedT(E2E_LOCALE);
const { t: tSkills } = skillsT.scopedT(E2E_LOCALE);

/** Built-in, non-companion skill with 3 variants (no auto-seeded favorites). */
const SKILL_ID = "devils-advocate";
const SKILL_PAGE = `/skill/${SKILL_ID}`;

interface VariantInfo {
  id: string;
  /** Rendered name - same label on the skill page and in the favorites list */
  label: string;
}

const skill = DEFAULT_SKILLS.find((s) => s.id === SKILL_ID);
const SKILL_NAME = skill ? tSkills(skill.name) : SKILL_ID;
const VARIANTS: VariantInfo[] = (skill?.variants ?? []).map((v) => ({
  id: v.id,
  label: tSkills(v.variantName),
}));

/** Guest favorites as the client repository stores them (fields we assert on). */
const storedFavoritesSchema = z.array(
  z.object({ id: z.string(), skillId: z.string() }),
);
type StoredFavoriteRow = z.infer<typeof storedFavoritesSchema>[number];

type GotoReady = (path: string, ready: () => Promise<void>) => Promise<void>;

/** Atlas dev answers an occasional 500 while other edits re-evaluate SSR modules. */
const NAV_ATTEMPTS = 3;
const NAV_READY_TIMEOUT_MS = 20_000;
/** Each flow does several full page loads on a dev server: double the default budget. */
const TEST_TIMEOUT_MS = 240_000;

/**
 * Full page load of `path` until `ready` holds. Retries on top of gotoReady's
 * HMR handling: a transient dev-server 500 renders an error page, never `ready`.
 */
async function load(
  gotoReady: GotoReady,
  path: string,
  ready: () => Promise<void>,
): Promise<void> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < NAV_ATTEMPTS; attempt++) {
    const ok = await gotoReady(path, ready)
      .then(() => true)
      .catch((error: Error) => {
        lastError = error;
        return false;
      });
    if (ok) {
      return;
    }
  }
  expect.unreachable(`${path} never became ready: ${String(lastError)}`);
}

// ── skill page ──────────────────────────────────────────────────────────────

/** One variant card on the skill page: the innermost block holding its name + action. */
function variantCard(page: Page, variant: VariantInfo): Locator {
  return page
    .locator("[data-hydrated] div.rounded-xl", {
      has: page.getByText(variant.label, { exact: true }),
    })
    .filter({ has: page.getByRole("button") })
    .last();
}

function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

/** A real <button> whose whole label is `label` (Divs with onClick also carry role=button). */
function labelledButton(scope: Locator, label: string): Locator {
  return scope
    .locator("button")
    .filter({ hasText: new RegExp(`^\\s*${escapeRegExp(label)}\\s*$`) });
}

async function openSkillPage(page: Page, gotoReady: GotoReady): Promise<void> {
  const first = VARIANTS[0];
  expect(first, `${SKILL_ID} has no variants`).toBeDefined();
  if (!first) {
    return;
  }
  await load(gotoReady, SKILL_PAGE, async () => {
    const card = variantCard(page, first);
    await labelledButton(card, tSkill("get.quickAdd"))
      .or(labelledButton(card, tSkill("get.useNow")))
      .first()
      .waitFor({ state: "visible", timeout: NAV_READY_TIMEOUT_MS });
  });
}

/** Whether `variant` is already stored (DB for customers, localStorage for guests). */
type VariantStored = (variant: VariantInfo) => Promise<boolean>;

/**
 * Click the variant's "Add" and wait until the card flips to "Use now". A dev
 * full-reload (other edits on Atlas) can swallow the click or its re-render:
 * reload, and click again only if the store shows the add did not land - a
 * blind re-click would create a duplicate favorite.
 */
async function addVariant(
  page: Page,
  gotoReady: GotoReady,
  variant: VariantInfo,
  isStored: VariantStored,
): Promise<void> {
  for (let attempt = 0; attempt < NAV_ATTEMPTS; attempt++) {
    const card = variantCard(page, variant);
    const useNow = labelledButton(card, tSkill("get.useNow"));
    if (!(await isStored(variant))) {
      await labelledButton(card, tSkill("get.quickAdd")).click();
    }
    const shown = await useNow
      .waitFor({ state: "visible", timeout: NAV_READY_TIMEOUT_MS })
      .then(() => true)
      .catch(() => false);
    if (shown) {
      return;
    }
    await openSkillPage(page, gotoReady);
  }
  expect.unreachable(`could not add ${SKILL_ID}__${variant.id}`);
}

// ── favorites list ──────────────────────────────────────────────────────────

/** Fresh full page load of the favorites list (every call is a reload). */
async function openFavorites(page: Page, gotoReady: GotoReady): Promise<void> {
  await load(gotoReady, `/tools/${FAVORITES_LIST_ALIAS}`, async () => {
    // [data-hydrated]: SSR rows render first, but clicks only work once React owns them
    await page
      .locator("[data-hydrated] [data-favorite-row]")
      .or(page.locator("[data-hydrated]").getByText(tFav("get.emptyState")))
      .first()
      .waitFor({ state: "visible", timeout: NAV_READY_TIMEOUT_MS });
  });
}

/** The favorites card for SKILL_ID (header + variant rows), or an empty locator. */
function skillGroup(page: Page): Locator {
  return page
    .locator("div.rounded-xl", {
      has: page.getByText(SKILL_NAME, { exact: true }),
    })
    .filter({ has: page.locator("[data-favorite-row]") })
    .last();
}

/** Ids of the SKILL_ID rows the list renders (expands a collapsed group first). */
async function renderedRowIds(page: Page): Promise<string[]> {
  const group = skillGroup(page);
  if ((await group.count()) === 0) {
    return [];
  }
  // The "N more models" toggle (menus also carry aria-expanded, but with a popup)
  const toggle = group.locator("button[aria-expanded]:not([aria-haspopup])");
  if ((await toggle.count()) > 0) {
    for (let attempt = 0; attempt < NAV_ATTEMPTS; attempt++) {
      if ((await toggle.getAttribute("aria-expanded")) === "true") {
        break;
      }
      await toggle.click();
      await group
        .locator('button[aria-expanded="true"]:not([aria-haspopup])')
        .waitFor({ timeout: 5_000 })
        .catch(() => undefined);
    }
    expect(await toggle.getAttribute("aria-expanded")).toBe("true");
  }
  const ids = await group
    .locator("[data-favorite-row]")
    .evaluateAll((rows) =>
      rows.map((row) => row.getAttribute("data-favorite-row") ?? ""),
    );
  return ids.toSorted();
}

async function removeWholeSkill(page: Page): Promise<void> {
  await skillGroup(page)
    .getByRole("button", { name: tFav("get.actions.menu") })
    .first()
    .click();
  await page
    .getByRole("menuitem", { name: tFav("get.deleteGroup.trigger") })
    .click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: tFav("get.deleteGroup.action") })
    .click();
  await skillGroup(page).waitFor({ state: "detached" });
}

async function removeOneVariant(page: Page, rowId: string): Promise<void> {
  const row = page.locator(`[data-favorite-row="${rowId}"]`);
  await row.hover();
  await row.getByRole("button", { name: tFav("get.actions.menu") }).click();
  await page
    .getByRole("menuitem", { name: tFav("get.deleteVariantAction") })
    .click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: tFav("get.deleteVariantAction") })
    .click();
  await row.waitFor({ state: "detached" });
}

// ── stores ──────────────────────────────────────────────────────────────────

interface DbFavorite {
  slug: string;
  variantId: string | null;
  variantsMode: string;
}

async function dbFavorites(userId: string): Promise<DbFavorite[]> {
  const rows = await db
    .select({
      slug: chatFavorites.slug,
      variantId: chatFavorites.variantId,
      variantsMode: chatFavorites.variantsMode,
    })
    .from(chatFavorites)
    .where(
      and(
        eq(chatFavorites.userId, userId),
        eq(chatFavorites.skillId, SKILL_ID),
      ),
    );
  return rows.toSorted((a, b) => a.slug.localeCompare(b.slug));
}

/** SKILL_ID favorites in the guest's localStorage. */
async function localFavorites(page: Page): Promise<StoredFavoriteRow[]> {
  const raw = await page.evaluate<string | null, string>(
    (key) => window.localStorage.getItem(key),
    STORAGE_KEYS.FAVORITE_CHARACTERS,
  );
  if (!raw) {
    return [];
  }
  const parsed = storedFavoritesSchema.safeParse(JSON.parse(raw));
  expect(parsed.success, `unreadable guest favorites: ${raw}`).toBe(true);
  return (parsed.data ?? [])
    .filter((f) => parseSkillId(f.skillId).skillId === SKILL_ID)
    .toSorted((a, b) => a.id.localeCompare(b.id));
}

const deleteBatchBodySchema = z.object({ ids: z.array(z.string()) });

/** Favorite ids the batch-delete request carried off the wire. */
function sentIds(body: WidgetData): string[] {
  const parsed = deleteBatchBodySchema.safeParse(body);
  expect(
    parsed.success,
    `unexpected delete body: ${JSON.stringify(body)}`,
  ).toBe(true);
  return parsed.data?.ids ?? [];
}

function storedInDb(userId: string): VariantStored {
  return async (variant) =>
    (await dbFavorites(userId)).some((r) => r.variantId === variant.id);
}

function storedLocally(page: Page): VariantStored {
  return async (variant) =>
    (await localFavorites(page)).some(
      (f) => variantIdOf(f.skillId) === variant.id,
    );
}

function variantIdOf(storedSkillId: string): string | null {
  return parseSkillId(storedSkillId).variantId;
}

// ── specs ───────────────────────────────────────────────────────────────────

describe("E2E: skill favorites", () => {
  const e2e = useE2E("agent/skills/favorites");

  e2e.it(
    "customer adds a skill variant and it stays in the favorites list",
    async ({ page, gotoReady, loginAs, cleanup }) => {
      const customer = await createE2ECreditUser("favorites-add", 0);
      cleanup(customer.remove);
      await loginAs(customer.user);
      const [variant] = VARIANTS;
      if (!variant) {
        return;
      }

      await openSkillPage(page, gotoReady);
      await addVariant(page, gotoReady, variant, storedInDb(customer.user.id));

      const rows = await dbFavorites(customer.user.id);
      expect(rows.map((r) => r.variantId)).toEqual([variant.id]);
      // A single explicit pick is a subset, never "all variants"
      expect(rows[0]?.variantsMode).toBe(VariantsMode.SOME);

      await openFavorites(page, gotoReady);
      expect(await renderedRowIds(page)).toEqual(rows.map((r) => r.slug));
      await openFavorites(page, gotoReady);
      expect(await renderedRowIds(page)).toEqual(rows.map((r) => r.slug));
      expect(await dbFavorites(customer.user.id)).toEqual(rows);
    },
    TEST_TIMEOUT_MS,
  );

  e2e.it(
    "customer removes a whole multi-variant skill and every variant is gone",
    async ({ page, gotoReady, loginAs, cleanup, capture }) => {
      const customer = await createE2ECreditUser("favorites-group", 0);
      cleanup(customer.remove);
      await loginAs(customer.user);

      await openSkillPage(page, gotoReady);
      for (const variant of VARIANTS) {
        await addVariant(
          page,
          gotoReady,
          variant,
          storedInDb(customer.user.id),
        );
      }
      const added = await dbFavorites(customer.user.id);
      expect(added.map((r) => r.variantId).toSorted()).toEqual(
        VARIANTS.map((v) => v.id).toSorted(),
      );
      // Holding every variant flips the skill to "all variants"
      expect(added.every((r) => r.variantsMode === VariantsMode.ALL)).toBe(
        true,
      );

      await openFavorites(page, gotoReady);
      expect(await renderedRowIds(page)).toEqual(added.map((r) => r.slug));

      const call = await capture(deleteBatchEndpoints.POST, () =>
        removeWholeSkill(page),
      );
      expect(call.response.success, JSON.stringify(call.response)).toBe(true);
      expect(sentIds(call.requestBody).toSorted()).toEqual(
        added.map((r) => r.slug),
      );

      // Reload twice: the read-time ALL reconcile must not resurrect anything
      for (let pass = 0; pass < 2; pass++) {
        await openFavorites(page, gotoReady);
        expect(await renderedRowIds(page)).toEqual([]);
        expect(await dbFavorites(customer.user.id)).toEqual([]);
      }
    },
    TEST_TIMEOUT_MS,
  );

  e2e.it(
    "customer removes one variant and only that variant is gone",
    async ({ page, gotoReady, loginAs, cleanup, capture }) => {
      const customer = await createE2ECreditUser("favorites-variant", 0);
      cleanup(customer.remove);
      await loginAs(customer.user);

      await openSkillPage(page, gotoReady);
      for (const variant of VARIANTS) {
        await addVariant(
          page,
          gotoReady,
          variant,
          storedInDb(customer.user.id),
        );
      }
      const added = await dbFavorites(customer.user.id);
      expect(added).toHaveLength(VARIANTS.length);
      const [removed, ...kept] = added;
      if (!removed) {
        return;
      }

      await openFavorites(page, gotoReady);
      expect(await renderedRowIds(page)).toEqual(added.map((r) => r.slug));

      const call = await capture(deleteBatchEndpoints.POST, () =>
        removeOneVariant(page, removed.slug),
      );
      expect(call.response.success, JSON.stringify(call.response)).toBe(true);
      expect(sentIds(call.requestBody)).toEqual([removed.slug]);

      const keptSlugs = kept.map((r) => r.slug);
      for (let pass = 0; pass < 2; pass++) {
        await openFavorites(page, gotoReady);
        expect(await renderedRowIds(page)).toEqual(keptSlugs);
        const rows = await dbFavorites(customer.user.id);
        expect(rows.map((r) => r.slug)).toEqual(keptSlugs);
        // An explicit removal leaves a subset - the skill is no longer "all"
        expect(rows.every((r) => r.variantsMode === VariantsMode.SOME)).toBe(
          true,
        );
      }
    },
    TEST_TIMEOUT_MS,
  );

  e2e.it(
    "guest removes a whole multi-variant skill and every variant is gone",
    async ({ page, gotoReady }) => {
      await openSkillPage(page, gotoReady);
      for (const variant of VARIANTS) {
        await addVariant(page, gotoReady, variant, storedLocally(page));
      }
      const added = await localFavorites(page);
      expect(added.map((f) => variantIdOf(f.skillId)).toSorted()).toEqual(
        VARIANTS.map((v) => v.id).toSorted(),
      );

      await openFavorites(page, gotoReady);
      expect(await renderedRowIds(page)).toEqual(added.map((f) => f.id));
      await removeWholeSkill(page);

      for (let pass = 0; pass < 2; pass++) {
        await openFavorites(page, gotoReady);
        expect(await renderedRowIds(page)).toEqual([]);
        expect(await localFavorites(page)).toEqual([]);
      }
    },
    TEST_TIMEOUT_MS,
  );

  e2e.it(
    "guest removes one variant and only that variant is gone",
    async ({ page, gotoReady }) => {
      await openSkillPage(page, gotoReady);
      for (const variant of VARIANTS) {
        await addVariant(page, gotoReady, variant, storedLocally(page));
      }
      const added = await localFavorites(page);
      expect(added).toHaveLength(VARIANTS.length);
      const [removed, ...kept] = added;
      if (!removed) {
        return;
      }

      await openFavorites(page, gotoReady);
      await renderedRowIds(page);
      await removeOneVariant(page, removed.id);

      const keptIds = kept.map((f) => f.id);
      for (let pass = 0; pass < 2; pass++) {
        await openFavorites(page, gotoReady);
        expect(await renderedRowIds(page)).toEqual(keptIds);
        expect((await localFavorites(page)).map((f) => f.id)).toEqual(keptIds);
      }
    },
    TEST_TIMEOUT_MS,
  );
});
