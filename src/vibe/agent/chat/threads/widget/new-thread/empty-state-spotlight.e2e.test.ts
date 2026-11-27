/**
 * E2E: the new-thread mode grid ends with "Add a mode". The tile fills the
 * grid's blank cell, opens the existing favorite-create form in a dialog, and
 * saving lists the new mode in the grid as the active one. Guests (favorites
 * in this browser) and signed-in users (server favorites) alike.
 * `ADD_MODE_SHOTS=1` writes desktop + phone, light + dark screenshots to
 * scratchpad/ui/add-variant-tile-1127/.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { mkdir } from "node:fs/promises";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import type { E2EFixtures } from "next-vibe/tooling/testing/e2e/harness";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import type { Locator, Page } from "playwright";
import { describe, expect } from "vitest";

import { scopedTranslation as createT } from "../../../../skills/favorites/create/i18n";
import { STORAGE_KEYS } from "../../../constants";
import { ChatSettingsRepository } from "../../../settings/repository";
import { scopedTranslation as settingsT } from "../../../settings/i18n";
import { scopedTranslation } from "../../i18n";

const { t } = scopedTranslation.scopedT(defaultLocale);
const { t: tCreate } = createT.scopedT(defaultLocale);
const logger = createEndpointLogger(false, defaultLocale);
const SHOTS_DIR = "scratchpad/ui/add-variant-tile-1127";
/** Screenshots reload the page per viewport: allow for a slow dev server. */
const TEST_TIMEOUT_MS = 300_000;
const PHONE = { width: 390, height: 844 };
const DESKTOP = { width: 1280, height: 900 };

function modeGrid(page: Page): Locator {
  // A phone can briefly hold the desktop shell too; the live grid is last.
  return page
    .locator(`[aria-label="${t("widget.emptyState.spotlight.allModes")}"]`)
    .last();
}

function modeRow(page: Page, name: string): Locator {
  return modeGrid(page).getByRole("button", { name: new RegExp(`^${name},`) });
}

function addTile(page: Page): Locator {
  return modeGrid(page).getByRole("button", {
    name: new RegExp(t("widget.emptyState.spotlight.addMode.title")),
  });
}

/** Skip the selector's first-run popup; optionally preselect a skill (guests). */
async function prepare(page: Page, skillId: string | null): Promise<void> {
  await page.addInitScript(
    ([onboardingKey, skill]) => {
      try {
        localStorage.setItem(onboardingKey, "true");
        if (skill) {
          localStorage.setItem(
            "chat-settings-v5",
            JSON.stringify({ selectedSkill: skill }),
          );
        }
      } catch {
        // storage blocked: the test then fails on the grid assertions
      }
    },
    [STORAGE_KEYS.SELECTOR_ONBOARDING_SHOWN, skillId] as const,
  );
}

async function openNewThread(
  fixtures: E2EFixtures,
  folder: "incognito" | "private",
): Promise<void> {
  await fixtures.gotoReady(`/threads/${folder}/new`, async () => {
    // The tile is server-rendered: wait for React before clicking it.
    await fixtures.page.locator("form[data-hydrated]").first().waitFor();
    await addTile(fixtures.page).waitFor();
  });
}

function shotsEnabled(): boolean {
  return process.env["ADD_MODE_SHOTS"] === "1";
}

async function applyTheme(page: Page, theme: "light" | "dark"): Promise<void> {
  await page.emulateMedia({ colorScheme: theme });
  await page.evaluate((mode) => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(mode);
    document.documentElement.style.colorScheme = mode;
  }, theme);
}

/**
 * Desktop + phone, light + dark. Each viewport loads the page fresh, so the
 * phone shot shows the phone layout (closed sidebar), not a resized desktop.
 * Ends back on a fresh desktop load.
 */
async function shots(
  fixtures: E2EFixtures,
  folder: "incognito" | "private",
  name: string,
  /** A mode row that must be listed before shooting (the one just added). */
  row?: string,
): Promise<void> {
  if (!shotsEnabled()) {
    return;
  }
  const { page } = fixtures;
  await mkdir(SHOTS_DIR, { recursive: true });
  for (const viewport of [DESKTOP, PHONE]) {
    await page.setViewportSize(viewport);
    await openNewThread(fixtures, folder);
    if (row) {
      await modeRow(page, row).waitFor();
    }
    for (const theme of ["light", "dark"] as const) {
      await applyTheme(page, theme);
      await addTile(page).scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `${SHOTS_DIR}/${name}-${viewport === PHONE ? "phone" : "desktop"}-${theme}.png`,
        animations: "disabled",
      });
    }
  }
  await page.setViewportSize(DESKTOP);
  await page.emulateMedia({ colorScheme: "light" });
  await openNewThread(fixtures, folder);
}

/** Tile is the last cell; on an even mode count it spans both columns. */
async function expectTileFillsGrid(
  page: Page,
  stockModes: number,
): Promise<void> {
  const cells = modeGrid(page).locator(":scope > button");
  expect(await cells.count()).toBe(stockModes + 1);
  const tile = await addTile(page).boundingBox();
  const first = await cells.first().boundingBox();
  expect(tile).not.toBeNull();
  expect(first).not.toBeNull();
  if (!tile || !first) {
    return;
  }
  if (stockModes % 2 === 1) {
    // Fills the blank right-hand cell: same width and row height as a mode
    expect(Math.abs(tile.width - first.width)).toBeLessThan(2);
    const left = await cells.nth(stockModes - 1).boundingBox();
    expect(left).not.toBeNull();
    if (left) {
      expect(Math.abs(left.y - tile.y)).toBeLessThan(2);
      expect(Math.abs(left.height - tile.height)).toBeLessThan(2);
    }
  }
}

async function addMode(
  page: Page,
  label: string,
  shotName: string,
): Promise<void> {
  await addTile(page).click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  if (shotsEnabled()) {
    await dialog
      .getByText(tCreate("post.customVariantName.label"), { exact: true })
      .waitFor();
    await page.screenshot({
      path: `${SHOTS_DIR}/${shotName}-dialog-desktop.png`,
      animations: "disabled",
    });
  }
  // The form's own "Label" field (custom variant name)
  await dialog
    .getByText(tCreate("post.customVariantName.label"), { exact: true })
    .locator("xpath=following-sibling::input")
    .fill(label);
  await dialog
    .getByRole("button", { name: tCreate("post.addModeButton.label") })
    .click();
  await dialog.waitFor({ state: "detached" });
  const row = modeRow(page, label);
  await row.waitFor();
  expect(await row.getAttribute("aria-current")).toBe("true");
}

async function signIn(
  fixtures: E2EFixtures,
  tag: string,
): Promise<JwtPrivatePayloadType | null> {
  const created = await createTestUser(fixtures.uniqueEmail(tag), "E2E Modes");
  expect(created.success, JSON.stringify(created)).toBe(true);
  if (!created.success) {
    return null;
  }
  const account = created.data;
  fixtures.cleanup(() => deleteTestUser(account.user.id));
  await fixtures.loginAs(account.user);
  return account.user;
}

describe("E2E: add a mode from the new-thread grid", () => {
  const e2e = useE2E("agent/new-thread-add-mode");

  e2e.it(
    "guest: Thea's 7 modes plus the tile, adding selects it",
    async (f) => {
      await f.page.setViewportSize(DESKTOP);
      await prepare(f.page, null);
      await openNewThread(f, "incognito");
      await expectTileFillsGrid(f.page, 7);
      await shots(f, "incognito", "guest-thea");
      await addMode(f.page, "My Thea", "guest-thea");
      // Survives a reload: stored in this browser with its name
      await openNewThread(f, "incognito");
      await modeRow(f.page, "My Thea").waitFor();
      expect(
        await modeRow(f.page, "My Thea").getAttribute("aria-current"),
      ).toBe("true");
      await shots(f, "incognito", "guest-thea-added", "My Thea");
    },
    TEST_TIMEOUT_MS,
  );

  e2e.it(
    "guest: a 5-mode skill gets the tile in its 6th cell",
    async (f) => {
      await f.page.setViewportSize(DESKTOP);
      await prepare(f.page, "coder");
      await openNewThread(f, "incognito");
      await expectTileFillsGrid(f.page, 5);
      await shots(f, "incognito", "guest-coder");
    },
    TEST_TIMEOUT_MS,
  );

  e2e.it(
    "signed in: adding a mode saves a server favorite",
    async (f) => {
      await signIn(f, "add-mode");
      await f.page.setViewportSize(DESKTOP);
      await prepare(f.page, null);
      await openNewThread(f, "private");
      await expectTileFillsGrid(f.page, 7);
      await shots(f, "private", "user-thea");
      await addMode(f.page, "Night shift", "user-thea");
      // Survives a reload: it is a stored favorite, not optimistic state
      await openNewThread(f, "private");
      await modeGrid(f.page)
        .getByRole("button", { name: /^Night shift,/ })
        .waitFor();
      await shots(f, "private", "user-thea-added", "Night shift");
    },
    TEST_TIMEOUT_MS,
  );

  e2e.it(
    "signed in: a 5-mode skill gets the tile in its 6th cell",
    async (f) => {
      const account = await signIn(f, "add-mode-coder");
      if (!account) {
        return;
      }
      await f.page.setViewportSize(DESKTOP);
      await prepare(f.page, null);
      // Accounts keep settings on the server: pick the skill there.
      const saved = await ChatSettingsRepository.upsertSettings(
        { selectedSkill: "coder", activeFavoriteId: null },
        account,
        logger,
        settingsT.scopedT(defaultLocale).t,
      );
      expect(saved.success, JSON.stringify(saved)).toBe(true);
      await openNewThread(f, "private");
      await expectTileFillsGrid(f.page, 5);
      await shots(f, "private", "user-coder");
    },
    TEST_TIMEOUT_MS,
  );
});
