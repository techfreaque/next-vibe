/**
 * E2E: /tools — the public tool browser (help-tool GET).
 * Search, category drill-down and URL pagination, driven like a visitor.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import type { Locator, Page } from "playwright";
import { describe, expect } from "vitest";

import { CATEGORY_REGISTRY } from "@/generated/categories/registry";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import helpEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

const endpoint = helpEndpoints.GET;
const TOOLS_PAGE = "/tools";
const { t } = scopedTranslation.scopedT(E2E_LOCALE);

/** The search box, once React owns it (SSR markup is wiped by hydration). */
function searchBox(page: Page): Locator {
  return page
    .locator(
      `[data-hydrated] input[placeholder="${t("aiTools.modal.searchPlaceholder")}"]`,
    )
    .first();
}

/** Ready once the search box is interactive. */
function searchReady(page: Page): () => Promise<void> {
  return () => searchBox(page).waitFor({ state: "visible" });
}

function escapeRegex(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

/**
 * A chip / folder button by its label. Their text is label + count
 * ("All61", "12AI Agent"), so match the label exactly, digits aside —
 * a plain substring would also hit "AI allowed" for "All".
 */
function labelButton(page: Page, label: string): Locator {
  return page
    .locator("[data-hydrated] button", {
      hasText: new RegExp(String.raw`^\d*${escapeRegex(label)}\d*$`),
    })
    .first();
}

describe("E2E: /tools tool browser", () => {
  const e2e = useE2E("help-tool");

  e2e.it(
    "searching filters the list server-side to matching tools",
    async ({ gotoReady, page, capture }) => {
      await gotoReady(TOOLS_PAGE, searchReady(page));

      const call = await capture(endpoint, async () => {
        await searchBox(page).fill("search");
      });
      expect(call.response.success, JSON.stringify(call.response)).toBe(true);
      if (!call.response.success) return;
      expect(call.requestBody).toMatchObject({ query: "search" });

      const tools = call.response.data.tools;
      expect(tools.length).toBeGreaterThan(0);
      expect(tools.some((tool) => tool.name.includes("search"))).toBe(true);
    },
  );

  e2e.it(
    "the All filter groups every tool by category and a category drills in",
    async ({ gotoReady, page, capture }) => {
      await gotoReady(TOOLS_PAGE, searchReady(page));

      const allCall = await capture(endpoint, async () => {
        await labelButton(page, t("aiTools.modal.chipAll")).click();
      });
      expect(allCall.response.success).toBe(true);
      if (!allCall.response.success) return;
      expect(allCall.requestBody).toMatchObject({ statsFilter: "all" });

      const aiCategory = CATEGORY_REGISTRY.find((c) => c.key === "ai");
      expect(aiCategory).toBeDefined();
      if (!aiCategory) return;
      const aiLabel = aiCategory.labels[E2E_LOCALE] ?? aiCategory.label;

      const catCall = await capture(endpoint, async () => {
        await labelButton(page, aiLabel).click();
      });
      expect(catCall.response.success).toBe(true);
      if (!catCall.response.success) return;
      expect(catCall.requestBody).toMatchObject({ category: "ai" });
      const tools = catCall.response.data.tools;
      expect(tools.length).toBeGreaterThan(0);
      expect(tools.every((tool) => tool.category === "ai")).toBe(true);
    },
  );

  e2e.it(
    "a paginated search URL fetches and renders exactly that page",
    async ({ gotoReady, page, capture }) => {
      const pageSize = 3;
      // A filtered URL must fetch its own page — not reuse the default SSR list
      const call = await capture(endpoint, async () => {
        await gotoReady(`${TOOLS_PAGE}?sf=all&q=s&ps=${pageSize}&p=2`, searchReady(page));
      });
      expect(call.response.success, JSON.stringify(call.response)).toBe(true);
      if (!call.response.success) return;
      expect(call.requestBody).toMatchObject({
        statsFilter: "all",
        query: "s",
        page: "2",
        pageSize: String(pageSize),
      });
      const tools = call.response.data.tools;
      expect(tools).toHaveLength(pageSize);
      expect(call.response.data.matchedCount).toBeGreaterThan(pageSize * 2);

      await page
        .getByText(
          t("aiTools.modal.searchResultMany", { count: pageSize }),
          { exact: true },
        )
        .waitFor({ state: "visible" });
      expect(await searchBox(page).inputValue()).toBe("s");
    },
  );

  e2e.it(
    "a visitor's default pinned view paginates server-side — no empty pages",
    async ({ gotoReady, page, capture }) => {
      const pageSize = 2;
      // Regression: the server ignored "pinned" for visitors and paged the full
      // list, then the client filtered that page down to nothing.
      const call = await capture(endpoint, async () => {
        await gotoReady(`${TOOLS_PAGE}?q=s&ps=${pageSize}`, searchReady(page));
      });
      expect(call.response.success, JSON.stringify(call.response)).toBe(true);
      if (!call.response.success) return;
      expect(call.requestBody).toMatchObject({
        query: "s",
        pageSize: String(pageSize),
      });
      const { tools, matchedCount } = call.response.data;
      expect(matchedCount).toBeGreaterThan(0);
      expect(tools).toHaveLength(Math.min(pageSize, matchedCount));

      await page
        .getByText(
          tools.length === 1
            ? t("aiTools.modal.searchResultOne")
            : t("aiTools.modal.searchResultMany", { count: tools.length }),
          { exact: true },
        )
        .waitFor({ state: "visible" });
      expect(
        await page.getByText(t("aiTools.modal.searchNoResults")).count(),
      ).toBe(0);
    },
  );
});
