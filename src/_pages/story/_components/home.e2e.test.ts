/**
 * E2E: story home - intro hero, the four-way split (chat, self-host, build,
 * earn) and the universe tabs below it. Every section must actually render
 * (not stuck at opacity 0), the primary CTA goes into the product, phones get
 * no sideways scroll, and old ?tab= deep links open their tab in place.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import type { Locator, Page } from "playwright";
import { describe, expect } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { scopedTranslation } from "./i18n";

const { t } = scopedTranslation.scopedT(defaultLocale);

const PHONE = { width: 390, height: 844 };
const DESKTOP = { width: 1440, height: 900 };

/** The four split panels, each with the CTA heading of the tab it opens. */
const SIDES = [
  {
    tab: "unbottled",
    title: t("home.splitHero.unbottled.titleLine1"),
    explore: t("home.splitHero.unbottled.ctaExplore"),
    ctaTitle: t("home.ctaUnbottled.title"),
  },
  {
    tab: "personal",
    title: t("home.splitHero.personal.titleLine1"),
    explore: t("home.splitHero.personal.ctaGithub"),
    ctaTitle: t("home.ctaPersonal.title"),
  },
  {
    tab: "nextvibe",
    title: t("home.splitHero.nextvibe.titleLine1"),
    explore: t("home.splitHero.nextvibe.ctaExplore"),
    ctaTitle: t("home.ctaNextvibe.title"),
  },
  {
    tab: "referral",
    title: t("home.splitHero.referral.titleLine1"),
    explore: t("home.splitHero.referral.ctaExplore"),
    ctaTitle: t("home.ctaReferral.title"),
  },
] as const;

async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate<number>(
    "document.documentElement.scrollWidth - window.innerWidth",
  );
}

/** The split hero renders each panel twice (phone stack + desktop grid); pick the visible one. */
function visibleText(page: Page, text: string): Locator {
  return page.getByText(text, { exact: false }).filter({ visible: true }).first();
}

/**
 * True when the element ends up rendered visibly (not stuck at opacity 0 by
 * an animation). Hero entry animations start at opacity 0 and only run once
 * the client hydrates, which takes several seconds on the dev server, so poll
 * instead of sampling once.
 */
async function isVisiblyRendered(page: Page, text: string): Promise<boolean> {
  const el = visibleText(page, text);
  await el.scrollIntoViewIfNeeded();
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    const visible = await el.evaluate((node) => {
      let n: Element | null = node;
      while (n) {
        if (Number(getComputedStyle(n).opacity) === 0) {
          return false;
        }
        n = n.parentElement;
      }
      return true;
    });
    if (visible) {
      return true;
    }
    await page.waitForTimeout(250);
  }
  return false;
}

function heroHeading(page: Page): Locator {
  return page.getByRole("heading", { name: t("home.splitHero.header") });
}

function primaryCta(page: Page): Locator {
  return page
    .getByRole("link", { name: t("home.splitHero.unbottled.cta") })
    .first();
}

describe("E2E: story home", () => {
  const e2e = useE2E("story/home");

  e2e.it(
    "tells the whole story and every section is visible",
    async ({ page, gotoReady }) => {
      await page.setViewportSize(DESKTOP);
      await gotoReady("/story", async () => {
        await heroHeading(page).waitFor();
      });

      expect(await isVisiblyRendered(page, t("home.splitHero.header"))).toBe(
        true,
      );
      for (const side of SIDES) {
        expect(await isVisiblyRendered(page, side.title)).toBe(true);
      }

      // Primary CTA goes straight into the product
      expect(await primaryCta(page).getAttribute("href")).toBe(
        `/${defaultLocale}/threads`,
      );

      // "Explore" opens the unbottled story below the split, in place
      const explore = page
        .getByRole("button", { name: SIDES[0].explore, exact: true })
        .first();
      await explore.scrollIntoViewIfNeeded();
      await explore.click();
      await page.waitForURL(/[?&]tab=unbottled/);
      expect(page.url()).toContain("/story");

      // Regression: sections used to stay at opacity 0 until an observer fired
      expect(await isVisiblyRendered(page, t("home.problem.title"))).toBe(true);
      expect(
        await isVisiblyRendered(
          page,
          t("home.capabilities.models.demo.question"),
        ),
      ).toBe(true);
      expect(await isVisiblyRendered(page, SIDES[0].ctaTitle)).toBe(true);
    },
  );

  e2e.it(
    "demo tool calls render their real widget with results",
    async ({ page, gotoReady }) => {
      await page.setViewportSize(DESKTOP);
      // Default memory demo (Travel) renders without a click: its populated
      // widget also proves hydration finished before we start switching tabs.
      await gotoReady("/story?tab=unbottled", async () => {
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
    "fits a phone with no sideways scroll",
    async ({ page, gotoReady }) => {
      await page.setViewportSize(PHONE);
      await gotoReady("/story", async () => {
        await heroHeading(page).waitFor();
      });
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);

      // Primary action is a real touch target on phones
      const box = await primaryCta(page).boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(40);

      // The opened story below the split must not overflow either
      await gotoReady("/story?tab=unbottled", async () => {
        await page
          .getByRole("heading", { name: t("home.problem.title") })
          .waitFor();
      });
      await page.waitForTimeout(1500);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    },
  );

  e2e.it(
    "old ?tab= deep links open their tab in place",
    async ({ page, gotoReady }) => {
      await page.setViewportSize(DESKTOP);
      for (const side of SIDES) {
        await gotoReady(`/story?tab=${side.tab}`, async () => {
          await page
            .getByRole("heading", { name: side.ctaTitle })
            .waitFor({ timeout: 60_000 });
        });
        expect(page.url()).toContain("/story");
        expect(page.url()).toContain(`tab=${side.tab}`);
        // The tab bar is shown with the deep-linked tab available
        expect(
          await page
            .getByRole("button", { name: t(`home.splitHero.tab.${side.tab}Sub`) })
            .count(),
        ).toBeGreaterThanOrEqual(1);
      }

      // Unknown tab: hero only, no tab content opened
      await gotoReady("/story?tab=nope", async () => {
        await heroHeading(page).waitFor();
      });
      expect(
        await page.getByRole("heading", { name: SIDES[0].ctaTitle }).count(),
      ).toBe(0);
    },
  );
});
