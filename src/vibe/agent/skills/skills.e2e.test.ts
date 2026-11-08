/**
 * E2E: /skills — the public skill browser (skills GET).
 * Loads on mount, searches server-side, switches source tabs.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import type { Locator, Page } from "playwright";
import { describe, expect } from "vitest";

import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import skillsEndpoints from "./definition";
import { SkillSourceFilter } from "./enum";
import { scopedTranslation } from "./i18n";

const endpoint = skillsEndpoints.GET;
const SKILLS_PAGE = "/skills";
const { t } = scopedTranslation.scopedT(E2E_LOCALE);

function searchBox(page: Page): Locator {
  return page
    .locator(`[data-hydrated] input[placeholder="${t("get.search.placeholder")}"]`)
    .first();
}

/** Ready once the search box is interactive. */
function searchReady(page: Page): () => Promise<void> {
  return () => searchBox(page).waitFor({ state: "visible" });
}

function skillCount(
  sections: { skills: readonly { skillId: string }[] }[],
): number {
  return sections.reduce((sum, section) => sum + section.skills.length, 0);
}

describe("E2E: /skills skill browser", () => {
  const e2e = useE2E("agent/skills");

  e2e.it(
    "renders the built-in skills from server-loaded data on open",
    async ({ gotoReady, page }) => {
      // The list is resolved server-side (no client GET on mount): it must be
      // painted as soon as the search box is interactive.
      await gotoReady(SKILLS_PAGE, searchReady(page));
      await page.getByText(/coder/i).first().waitFor({ state: "visible" });
    },
  );

  e2e.it(
    "searching narrows the list server-side",
    async ({ gotoReady, page, capture }) => {
      await gotoReady(SKILLS_PAGE, searchReady(page));
      const call = await capture(endpoint, async () => {
        await searchBox(page).fill("coder");
      });
      expect(call.response.success, JSON.stringify(call.response)).toBe(true);
      if (!call.response.success) return;
      expect(call.requestBody).toMatchObject({ query: "coder" });
      const skills = call.response.data.sections.flatMap((s) => s.skills);
      expect(skills.some((skill) => skill.skillId.startsWith("coder"))).toBe(
        true,
      );
    },
  );

  e2e.it(
    "the community tab requests community skills",
    async ({ gotoReady, page, capture }) => {
      await gotoReady(SKILLS_PAGE, searchReady(page));
      const call = await capture(endpoint, async () => {
        await page
          .locator("[data-hydrated] button", {
            hasText: t(SkillSourceFilter.COMMUNITY),
          })
          .first()
          .click();
      });
      expect(call.response.success, JSON.stringify(call.response)).toBe(true);
      expect(call.requestBody).toMatchObject({
        sourceFilter: SkillSourceFilter.COMMUNITY,
      });
    },
  );
});
