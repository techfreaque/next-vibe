/**
 * E2E: the chat's "who am I talking to" flow, as a first-time guest sees it.
 * - one-screen setup inside the model selector
 * - favorites: every model row visible, active row marked, menus usable
 * - menus render ON TOP of the selector popover (z-index regression)
 * - Share & earn reachable from the favorites menu
 * - empty chat teaches: starters fill the composer, tour is opt-in
 * - phones always show the active character + model in the composer
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { isOnTop } from "next-vibe/tooling/testing/e2e/visibility";
import type { Locator, Page } from "playwright";
import { describe, expect } from "vitest";

import { scopedTranslation as threadsT } from "../../../../chat/threads/i18n";
import { scopedTranslation as skillT } from "../../../../skills/[id]/i18n";
import { scopedTranslation as favoritesT } from "../../../../skills/favorites/i18n";
import { scopedTranslation as streamT } from "../../i18n";

const { t: tStream } = streamT.scopedT(defaultLocale);
const { t: tFav } = favoritesT.scopedT(defaultLocale);
const { t: tThreads } = threadsT.scopedT(defaultLocale);
const { t: tSkill } = skillT.scopedT(defaultLocale);

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

/** Opens the selector and finishes the one-screen setup with defaults. */
async function completeSetup(page: Page): Promise<void> {
  await selectorTrigger(page).click();
  // Guests first see the sign-in gate (signed-in users skip it).
  const signin = page.getByTestId("selector-signin");
  await signin.waitFor();
  await signin
    .getByRole("button", { name: tStream("onboarding.signin.continueAsGuest") })
    .click();
  const setup = page.getByTestId("selector-setup");
  await setup.waitFor();
  await setup
    .getByRole("button", { name: tStream("onboarding.setup.start") })
    .click();
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
    "empty chat: no forced tour, the tour is one click away",
    async ({ page, gotoReady }) => {
      await openChat(page, gotoReady);
      // Tour no longer auto-starts and blocks the page
      await page.waitForTimeout(1500);
      expect(await page.locator("#react-joyride-portal").count()).toBe(0);

      // The tour is still one click away
      await page
        .getByRole("button", {
          name: tThreads("widget.suggestedPrompts.takeTour"),
        })
        .click();
      await page
        .locator("#react-joyride-portal")
        .waitFor({ state: "attached" });
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
