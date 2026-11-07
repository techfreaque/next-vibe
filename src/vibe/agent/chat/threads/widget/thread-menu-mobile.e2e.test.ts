/**
 * E2E: the thread "…" menu works on a phone.
 * Regression: dropdown menus rendered at z-50, behind the z-200 mobile sidebar
 * overlay, so tapping "…" looked like it did nothing.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { describe, expect } from "vitest";

import { DefaultFolderId } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { isOnTop } from "next-vibe/tooling/testing/e2e/visibility";

import {
  createE2EUser,
  deleteE2EUser,
  seedThread,
  signInAs,
  suppressWelcomeTour,
} from "../../testing/e2e-seed";
import { scopedTranslation as threadsT } from "../i18n";
import { scopedTranslation as chromeT } from "./i18n";

const { t } = threadsT.scopedT(defaultLocale);
const { t: tChrome } = chromeT.scopedT(defaultLocale);

describe("E2E: thread menu on mobile", () => {
  const e2e = useE2E("agent/chat/thread-menu-mobile");

  e2e.it(
    "tapping … opens a usable menu above the sidebar",
    async ({
      page,
      context,
      baseUrl,
      loginAs,
      gotoReady,
      uniqueEmail,
      cleanup,
    }) => {
      const customer = await createE2EUser(uniqueEmail("thread-menu"));
      cleanup(() => deleteE2EUser(customer));
      const title = `E2E mobile menu ${Date.now()}`;
      await seedThread(customer, {
        rootFolderId: DefaultFolderId.PRIVATE,
        title,
      });
      await suppressWelcomeTour(context);
      // Behave like a phone: touch screens always show row actions (no hover)
      await context.addInitScript(() => {
        Object.defineProperty(navigator, "maxTouchPoints", { get: () => 5 });
      });
      await signInAs({ context, baseUrl, loginAs }, customer);

      await page.setViewportSize({ width: 390, height: 844 });
      // Phones start with the sidebar closed (it no longer flashes open on load),
      // so wait for the composer, then open the sidebar like a user would
      await gotoReady(`/threads/${DefaultFolderId.PRIVATE}`, async () => {
        await page
          .locator("[data-hydrated]")
          .first()
          .waitFor({ state: "attached" });
      });
      expect(await page.locator('[data-tour="root-folders"]').count()).toBe(0);
      await page
        .getByRole("button", { name: tChrome("common.toggleSidebar") })
        .first()
        .click();
      await page.locator('[data-tour="root-folders"]').first().waitFor();
      await page.getByText(title, { exact: true }).first().waitFor();
      // Regression: this icon-only trigger had no accessible name
      await page
        // exact: the clickable row itself is role=button and its name contains this label
        .getByRole("button", { name: t("widget.actions.menu"), exact: true })
        .first()
        .click();
      const firstItem = page.getByRole("menuitem").first();
      await firstItem.waitFor();
      expect(await isOnTop(firstItem)).toBe(true);
    },
  );
});
