/**
 * E2E: the chat's "who am I talking to" flow, as a first-time guest sees it.
 * - first-run setup inside the selector: pops up once, guests get the
 *   sign-in step first, skill-page arrival (?skill=) shown on top and added
 * - favorites: every model row visible, active row marked, menus usable
 * - menus render ON TOP of the selector popover (z-index regression)
 * - Share & earn reachable from the favorites menu
 * - empty chat teaches: starters fill the composer
 * - phones always show the active character + model in the composer
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { isOnTop } from "next-vibe/tooling/testing/e2e/visibility";
import type { Locator, Page } from "playwright";
import { describe, expect } from "vitest";

import { scopedTranslation as consentT } from "../../../../models/uncensored-consent/i18n";
import { scopedTranslation as skillT } from "../../../../skills/[id]/i18n";
import { scopedTranslation as favoritesT } from "../../../../skills/favorites/i18n";

const { t: tFav } = favoritesT.scopedT(defaultLocale);
const { t: tSkill } = skillT.scopedT(defaultLocale);
const { t: tConsent } = consentT.scopedT(defaultLocale);

const CHAT_PATH = "/threads/incognito/new";
const PHONE = { width: 390, height: 844 };

function selectorTrigger(page: Page): Locator {
  return page.locator('button[data-tour][aria-haspopup="dialog"]').first();
}

async function openChat(
  page: Page,
  gotoReady: (path: string, ready: () => Promise<void>) => Promise<void>,
): Promise<void> {
  await gotoReady(CHAT_PATH, async () => {
    // The character name + model pair renders client-only: a reliable hydration signal
    await selectorTrigger(page)
      .locator("span.truncate + span")
      .first()
      .waitFor();
  });
}

/** The selector pops the first-run setup on its own; finish it with defaults. */
async function completeSetup(page: Page): Promise<void> {
  // Guests: sign-in step first, continue as guest
  await page.getByTestId("selector-signin-continue").click();
  const setup = page.getByTestId("selector-setup");
  await setup.waitFor();
  // Thea is preselected, specialists optional: one click is enough
  await setup.getByTestId("selector-setup-start").click();
  // The selector stays open on the new favorites list
  await page.locator("[data-favorite-row]").first().waitFor();
}

describe("E2E: chat selector + empty state", () => {
  const e2e = useE2E("agent/chat-selector");

  e2e.it(
    "first run is one screen and lands on a usable favorites list",
    async ({ page, gotoReady }) => {
      await openChat(page, gotoReady);
      await completeSetup(page);

      const rows = page.locator("[data-favorite-row]");
      expect(await rows.count()).toBeGreaterThan(1);
      // Exactly one active model, marked for assistive tech too
      expect(
        await page.locator('[data-favorite-row] [aria-current="true"]').count(),
      ).toBe(1);
    },
  );

  e2e.it(
    "character menu opens on top of the selector and shares the skill",
    async ({ page, gotoReady }) => {
      await openChat(page, gotoReady);
      await completeSetup(page);

      await page
        .getByRole("dialog")
        .getByRole("button", { name: tFav("get.actions.menu") })
        .first()
        .click();
      const shareItem = page.getByRole("menuitem", {
        name: tFav("get.actions.share"),
      });
      await shareItem.waitFor();
      // Regression: dropdowns rendered at z-50 behind the z-400 popover
      expect(await isOnTop(shareItem)).toBe(true);

      await shareItem.click();
      // Guests get the sign-up path inside the share dialog
      const signup = page.getByRole("button", {
        name: tSkill("get.share.signup"),
      });
      await signup.waitFor();
      expect(await isOnTop(signup)).toBe(true);
    },
  );

  e2e.it(
    "first run: guests get the sign-in step, closing it does not pop again",
    async ({ page, gotoReady }) => {
      await openChat(page, gotoReady);
      const signin = page.getByTestId("selector-signin");
      await signin.waitFor();
      expect(
        await signin.locator('a[href*="/user/signup?callbackUrl="]').count(),
      ).toBe(1);

      await page.keyboard.press("Escape");
      await signin.waitFor({ state: "detached" });
      await openChat(page, gotoReady);
      // Shown once per device: a reload does not pop it again
      expect(await signin.count()).toBe(0);
    },
  );

  e2e.it(
    "skill page arrival: the setup shows the skill and adds it",
    async ({ page, gotoReady }) => {
      await gotoReady(`${CHAT_PATH}?skill=4chan`, async () => {
        await page.getByTestId("selector-signin").waitFor();
      });
      await page.getByTestId("selector-signin-continue").click();
      await page.getByTestId("selector-setup-arrival").waitFor();
      await page
        .getByTestId("selector-setup")
        .getByTestId("selector-setup-start")
        .click();
      // 4chan runs an uncensored model: the one-time 18+ dialog waits for the
      // setup, then takes over (closing the selector)
      await page
        .getByRole("button", { name: tConsent("dialog.agree") })
        .click();
      // The arrival skill is the active one
      await selectorTrigger(page).getByText("4chan").waitFor();
      await selectorTrigger(page).click();
      // Companion + the arrival skill both landed in the favorites
      const companionGroup = page.locator(
        '[data-tour="favorites-companion-group"]',
      );
      await companionGroup.getByText("Thea", { exact: true }).waitFor();
      expect(
        await page.locator('[data-favorite-row^="4chan"]').count(),
      ).toBeGreaterThan(0);
    },
  );

  e2e.it(
    "skill link while another companion is active switches to that skill, every time",
    async ({ page, gotoReady }) => {
      // Set up with Hermes as the companion (Hermes is the active one)
      await openChat(page, gotoReady);
      await page.getByTestId("selector-signin-continue").click();
      const setup = page.getByTestId("selector-setup");
      await setup.getByTestId("selector-setup-companion-hermes").click();
      await setup.getByTestId("selector-setup-start").click();
      await page.locator('[data-favorite-row^="hermes"]').first().waitFor();
      await page.keyboard.press("Escape");
      await selectorTrigger(page).getByText("Hermes").waitFor();

      /** Back to Hermes through the selector, like a visitor would. */
      const selectHermes = async (): Promise<void> => {
        await selectorTrigger(page).click();
        const row = page.locator('[data-favorite-row^="hermes"]').first();
        await row.waitFor();
        // The row's select button is the one with text (handle and menu are icons)
        await row.getByRole("button").filter({ hasText: /\w/ }).first().click();
        await selectorTrigger(page).getByText("Hermes").waitFor();
        await page.keyboard.press("Escape");
      };

      // 1) New skill (not in favorites yet): added and active
      await gotoReady(`${CHAT_PATH}?skill=4chan`, async () => {
        await page
          .getByRole("button", { name: tConsent("dialog.agree") })
          .waitFor();
      });
      await page
        .getByRole("button", { name: tConsent("dialog.agree") })
        .click();
      await selectorTrigger(page).getByText("4chan").waitFor();
      expect(await page.getByTestId("selector-setup").count()).toBe(0);

      // 2) Same skill again, now already in favorites: active again
      await selectHermes();
      await gotoReady(`${CHAT_PATH}?skill=4chan`, async () => {
        await selectorTrigger(page).getByText("4chan").waitFor();
      });

      // 3) Another skill: active, Hermes stays in the favorites
      await selectHermes();
      await gotoReady(`${CHAT_PATH}?skill=philosopher`, async () => {
        await selectorTrigger(page).getByText("Philosopher").waitFor();
      });
      // Hermes is still one tap away
      await selectorTrigger(page).click();
      await page.locator('[data-favorite-row^="hermes"]').first().waitFor();
    },
  );

  e2e.it(
    "phones show who you're talking to and never scroll sideways",
    async ({ page, gotoReady }) => {
      await page.setViewportSize(PHONE);
      await openChat(page, gotoReady);
      await completeSetup(page);
      await page.keyboard.press("Escape");

      const trigger = selectorTrigger(page);
      const box = await trigger.boundingBox();
      // Selector has its own row: wide enough for character + model names
      expect(box?.width ?? 0).toBeGreaterThan(120);
      expect((await trigger.innerText()).trim().length).toBeGreaterThan(3);
      expect(
        await page.evaluate<number>(
          "document.documentElement.scrollWidth - window.innerWidth",
        ),
      ).toBeLessThanOrEqual(0);
    },
  );
});
