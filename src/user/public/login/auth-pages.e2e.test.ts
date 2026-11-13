/**
 * E2E: the auth shell (login, signup, reset-password) — one focused card,
 * back link, legal footer, and a layout that fits a 390px phone without
 * sideways scrolling. Requires a server (Atlas dev by default): `vibe dev`.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import type { Page } from "playwright";
import { describe, expect } from "vitest";

import { scopedTranslation as authShellT } from "@/_pages/user/(auth)/i18n";

const { t } = authShellT.scopedT(defaultLocale);

const AUTH_PAGES = [
  "/user/login",
  "/user/signup",
  "/user/reset-password",
] as const;

/** Pixels the page sticks out sideways (evaluated in the browser). */
const OVERFLOW_PROBE =
  "document.documentElement.scrollWidth - window.innerWidth";
const PHONE = { width: 390, height: 844 };
const DESKTOP = { width: 1440, height: 900 };

/** Widest element edge beyond the viewport, 0 when nothing sticks out. */
async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate<number>(OVERFLOW_PROBE);
}

describe("E2E: auth shell", () => {
  const e2e = useE2E("user/public/auth-shell");

  for (const path of AUTH_PAGES) {
    e2e.it(
      `${path} fits a phone with no sideways scroll`,
      async ({ page, gotoReady }) => {
        await page.setViewportSize(PHONE);
        await gotoReady(path, async () => {
          await page.locator("[data-hydrated]").first().waitFor();
        });

        expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
        await page.getByRole("link", { name: t("backToHome"), exact: true }).waitFor();
        await page.getByRole("link", { name: t("terms"), exact: true }).waitFor();
        await page.getByRole("link", { name: t("privacy"), exact: true }).waitFor();

        // Primary action is a real touch target
        const submit = page.locator('[data-testid="endpoint-submit"]').first();
        const box = await submit.boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(40);
      },
    );
  }

  e2e.it(
    "keeps the auth card focused on desktop",
    async ({ page, gotoReady }) => {
      await page.setViewportSize(DESKTOP);
      await gotoReady("/user/login", async () => {
        await page.locator("[data-hydrated]").first().waitFor();
      });
      const form = await page.locator("[data-hydrated]").first().boundingBox();
      // max-w-md column: the form never stretches across a wide screen
      expect(form?.width ?? 0).toBeLessThanOrEqual(460);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    },
  );
});
