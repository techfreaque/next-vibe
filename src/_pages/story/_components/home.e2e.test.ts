/**
 * E2E: story home v2 - one story from hero to FAQ, visible without scroll tricks,
 * phone-safe, old ?tab= deep links land on their new pages.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import type { Page } from "playwright";
import { describe, expect } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { scopedTranslation } from "./i18n";

const { t } = scopedTranslation.scopedT(defaultLocale);

const PHONE = { width: 390, height: 844 };
const DESKTOP = { width: 1440, height: 900 };

async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate<number>(
    "document.documentElement.scrollWidth - window.innerWidth",
  );
}

/** True when the element is rendered visibly (not stuck at opacity 0 by an animation). */
async function isVisiblyRendered(page: Page, text: string): Promise<boolean> {
  const el = page.getByText(text, { exact: false }).first();
  await el.scrollIntoViewIfNeeded();
  return el.evaluate((node) => {
    let n: Element | null = node;
    while (n) {
      if (Number(getComputedStyle(n).opacity) === 0) {
        return false;
      }
      n = n.parentElement;
    }
    return true;
  });
}

describe("E2E: story home", () => {
  const e2e = useE2E("story/home");

  e2e.it(
    "tells the whole story and every section is visible",
    async ({ page, gotoReady }) => {
      await page.setViewportSize(DESKTOP);
      await gotoReady("/story", async () => {
        await page
          .getByRole("heading", { name: t("home.splitHero.header") })
          .waitFor();
      });

      for (const heading of [
        t("home.v2.how.title"),
        t("home.v2.pricing.title"),
        t("home.v2.more.title"),
        t("home.v2.faq.title"),
      ]) {
        await page.getByRole("heading", { name: heading }).waitFor();
      }

      // Regression: sections used to stay at opacity 0 until an observer fired
      expect(await isVisiblyRendered(page, t("home.problem.title"))).toBe(true);
      expect(
        await isVisiblyRendered(
          page,
          t("home.capabilities.models.demo.question"),
        ),
      ).toBe(true);

      // Primary CTA goes straight into the product
      const cta = page
        .locator("section")
        .first()
        .getByRole("link", { name: t("home.splitHero.unbottled.cta") })
        .first();
      expect(await cta.getAttribute("href")).toBe(`/${defaultLocale}/threads`);
    },
  );

  e2e.it(
    "demo tool calls render their real widget with results",
    async ({ page, gotoReady }) => {
      await page.setViewportSize(DESKTOP);
      // Default tab (Travel) renders without a click: its populated widget
      // also proves hydration finished before we start switching tabs.
      await gotoReady("/story", async () => {
        await page
          .getByText("/memories/travel/japan-trip.md", { exact: true })
          .waitFor();
      });

      // Regression: demos stored fake tool names (`memories-search`), so the
      // card fell back to a collapsed generic header with no widget.
      for (const demo of [
        { id: "context", path: "/memories/travel/japan-trip.md" },
        { id: "project", path: "/memories/learning/spanish.md" },
      ] as const) {
        const tab = page.getByRole("button", {
          name: t(`home.capabilities.memory.demos.${demo.id}.tab`),
          exact: true,
        });
        await tab.scrollIntoViewIfNeeded();
        await tab.click();
        // Only the cortex-search widget renders the hit path + its excerpt
        await page.getByText(demo.path, { exact: true }).waitFor();
        await page
          .getByText(
            t(`home.capabilities.memory.demos.${demo.id}.memoryResult`),
            { exact: true },
          )
          .waitFor();
        expect(
          await page.getByText("cortex-search", { exact: true }).count(),
        ).toBe(0);
      }
    },
  );

  e2e.it(
    "FAQ answers are in the page and open on click",
    async ({ page, gotoReady }) => {
      await page.setViewportSize(DESKTOP);
      await gotoReady("/story", async () => {
        await page
          .getByRole("heading", { name: t("home.v2.faq.title") })
          .waitFor();
      });
      const question = page.getByText(t("home.v2.faq.items.account.q"), {
        exact: true,
      });
      await question.scrollIntoViewIfNeeded();
      await question.click();
      const details = page.locator("details", { has: question });
      expect(await details.evaluate((d) => d.hasAttribute("open"))).toBe(true);
    },
  );

  e2e.it(
    "fits a phone with no sideways scroll",
    async ({ page, gotoReady }) => {
      await page.setViewportSize(PHONE);
      await gotoReady("/story", async () => {
        await page
          .getByRole("heading", { name: t("home.splitHero.header") })
          .waitFor();
      });
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
      // Primary action is a real touch target on phones
      const cta = page
        .locator("section")
        .first()
        .getByRole("link", { name: t("home.splitHero.unbottled.cta") })
        .first();
      const box = await cta.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    },
  );

  e2e.it(
    "old ?tab= deep links land on their own pages",
    async ({ page, gotoReady }) => {
      await gotoReady("/story?tab=personal", async () => {
        await page.waitForURL(/\/story\/self-host/, { timeout: 60_000 });
      });
      expect(page.url()).toContain("/story/self-host");
    },
  );
});
