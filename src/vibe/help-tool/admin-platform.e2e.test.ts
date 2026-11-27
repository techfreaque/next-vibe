import { mkdir } from "node:fs/promises";

import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import type { E2ESubmitSent } from "next-vibe/tooling/testing/e2e/endpoint-form";
import {
  type E2EFixtures,
  useE2E,
} from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import type { Page } from "playwright";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { CATEGORY_REGISTRY } from "@/generated/categories/registry";

import { createE2ECreditUser } from "../agent/ai-stream/testing/e2e-credit-user";
import { scopedTranslation as streamTranslation } from "../agent/ai-stream/stream/i18n";
import settings from "../agent/chat/settings/definition";
import { WEB_SEARCH_ALIAS } from "../agent/web-search/constants";
import { scopedTranslation as searchTranslation } from "../agent/web-search/i18n";
import { UserPermissionRole } from "../identity/roles/enum";
import { scopedTranslation as widgetTranslation } from "../unified-ui/hooks/i18n";
import helpEndpoints from "./definition";
import { scopedTranslation } from "./i18n";
import { localizedLabel } from "./localized-label";

const { t } = scopedTranslation.scopedT(E2E_LOCALE);
const root = "/tools";
const smokeDirectory = "scratchpad/codex/unified-nav";

function adminNav(page: Page) {
  return page
    .locator("#platform-admin-navigation")
    .filter({ visible: true })
    .last();
}

function catalogSearch(page: Page) {
  return page
    .getByRole("textbox", {
      name: String(t("catalog.searchLabel")),
      exact: true,
    })
    .filter({ visible: true })
    .last();
}

async function searchWorkspace(
  fixtures: E2EFixtures,
  term: string,
): Promise<E2ESubmitSent<typeof helpEndpoints.GET>> {
  const { page, capture } = fixtures;
  let result = await capture(helpEndpoints.GET, () =>
    catalogSearch(page).fill(term),
  );
  const retry = page
    .getByRole("button", { name: t("catalog.retry"), exact: true })
    .filter({ visible: true })
    .last();
  for (let attempt = 0; result.status === 503 && attempt < 2; attempt++) {
    await retry.waitFor();
    await Bun.sleep(5000);
    result = await capture(helpEndpoints.GET, () => retry.click());
  }
  return result;
}

describe("E2E: whole-platform administration", () => {
  const e2e = useE2E("admin-platform");

  e2e.it(
    "opens a permitted area, searches real catalog metadata and preserves advanced tool browsing",
    async (fixtures) => {
      const { gotoReady, page } = fixtures;
      await authAtlas(fixtures, await resolveTestAdminUser());
      const nav = adminNav(page);
      await gotoReady(root, () =>
        page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor(),
      );
      await nav.waitFor();
      await page
        .getByRole("heading", { name: String(t("admin.title")), exact: true })
        .waitFor();
      await page
        .getByRole("heading", {
          name: String(t("catalog.favorites")),
          exact: true,
        })
        .waitFor();

      const category = CATEGORY_REGISTRY.find(
        ({ key }) => key === "accounting",
      );
      expect(category).toBeDefined();
      if (!category) return;
      const label =
        localizedLabel(category.labels, E2E_LOCALE) ?? category.label;
      const accounting = nav.getByRole("button", { name: label, exact: true });
      await accounting.click();
      await page.waitForURL(
        (url) => url.searchParams.get("cat") === "accounting",
      );
      expect(await accounting.getAttribute("aria-current")).toBe("page");

      const filtered = await searchWorkspace(fixtures, "trial balance");
      expect(filtered.response.success).toBe(true);
      if (filtered.response.success) {
        expect(
          filtered.response.data.tools.some(
            ({ name }) => name === "coa-trial-balance",
          ),
        ).toBe(true);
        expect(
          filtered.response.data.adminCatalogDestinations?.["coa-trial-balance"]
            ?.category,
        ).toBe("accounting");
      }

      const invoiceResults = await searchWorkspace(fixtures, "invoice");
      expect(
        invoiceResults.response.success &&
          invoiceResults.response.data.tools[0]?.name,
      ).toBe("payment-invoice-list");
      const emptySearch = "fixture-unmatched-tulip-directory";
      const noMatches = await searchWorkspace(fixtures, emptySearch);
      expect(noMatches.response.success).toBe(true);
      await page
        .getByText(String(t("catalog.noMatches", { query: emptySearch })), {
          exact: true,
        })
        .waitFor();
      await nav.getByRole("combobox").click();
      await page
        .getByRole("option", { name: t("admin.developer"), exact: true })
        .click();
      await page.waitForURL((url) => url.searchParams.get("catalog") === "all");
      expect(new URL(page.url()).searchParams.has("q")).toBe(false);
      await nav.waitFor();
      await nav
        .getByRole("button", { name: String(t("erp.home")), exact: true })
        .click();
      await nav.waitFor();
    },
  );

  e2e.it(
    "walks the dark desktop sidebar, phone drawer and chat picker",
    async (fixtures) => {
      const { gotoReady, page } = fixtures;
      await authAtlas(fixtures, await resolveTestAdminUser());
      await mkdir(smokeDirectory, { recursive: true });
      await page.emulateMedia({ colorScheme: "dark" });
      await page.addInitScript(() => {
        // oxlint-disable-next-line restricted/no-browser-globals -- browser screenshot setup
        localStorage.setItem("theme_v2", "dark");
      });
      await page.setViewportSize({ width: 1440, height: 900 });
      await gotoReady(root, () =>
        page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor(),
      );
      await adminNav(page).waitFor();
      await page.locator("html.dark").waitFor({ state: "attached" });
      await page
        .getByRole("heading", { name: t("catalog.favorites"), exact: true })
        .waitFor();
      await page
        .locator("#admin-catalog [aria-busy=true]")
        .first()
        .waitFor({ state: "hidden" });
      await page.screenshot({
        path: `${smokeDirectory}/desktop-dark.png`,
        animations: "disabled",
      });

      const category = CATEGORY_REGISTRY.find(
        ({ key }) => key === "usersDirectory",
      );
      expect(category).toBeDefined();
      if (!category) {
        return;
      }
      const label =
        localizedLabel(category.labels, E2E_LOCALE) ?? category.label;
      await adminNav(page)
        .getByRole("button", { name: label, exact: true })
        .click();
      await page.waitForURL(
        (url) => url.searchParams.get("cat") === category.key,
      );
      await page
        .getByRole("navigation", { name: t("catalog.breadcrumbs") })
        .waitFor();
      await page
        .locator("#admin-catalog [aria-busy=true]")
        .first()
        .waitFor({ state: "hidden" });
      await page
        .getByText(t("aiTools.modal.loading"), { exact: true })
        .filter({ visible: true })
        .first()
        .waitFor({ state: "hidden" });
      await page.screenshot({
        path: `${smokeDirectory}/category-desktop-dark.png`,
        animations: "disabled",
      });
      await page.goBack();
      await page
        .getByRole("heading", { name: t("catalog.favorites"), exact: true })
        .waitFor();

      await page.setViewportSize({ width: 390, height: 844 });
      await page
        .getByRole("button", { name: t("catalog.openSidebar"), exact: true })
        .click();
      await adminNav(page).waitFor();
      await page.screenshot({
        path: `${smokeDirectory}/phone-dark.png`,
        animations: "disabled",
      });
      await page.keyboard.press("Escape");
      await adminNav(page).waitFor({ state: "hidden" });
      expect(
        await page
          .locator("body")
          .evaluate((body) => body.scrollWidth <= body.clientWidth + 1),
      ).toBe(true);

      await page.setViewportSize({ width: 1440, height: 900 });
      const { t: streamT } = streamTranslation.scopedT(E2E_LOCALE);
      const composerToolButton = page
        .locator(`[title="${streamT("toolsButton.title")}"]`)
        .filter({ visible: true })
        .first();
      await gotoReady("/threads/private", () => composerToolButton.waitFor());
      await composerToolButton.getByText(/^\d+$/).waitFor();
      await composerToolButton.click();
      const picker = page
        .getByRole("dialog")
        .filter({ has: page.locator("#chat-tool-navigation") });
      await picker.waitFor();
      await picker
        .getByRole("button", { name: t("catalog.allTools"), exact: true })
        .click();
      await picker
        .getByRole("heading", { name: t("catalog.allTools"), exact: true })
        .waitFor();
      await picker
        .getByRole("textbox", { name: t("catalog.searchLabel"), exact: true })
        .fill("web-search");
      await picker
        .getByRole("heading", { name: t("admin.results"), exact: true })
        .waitFor();
      await picker
        .getByRole("button", { name: t("catalog.toolOptions"), exact: true })
        .first()
        .waitFor();
      await page.screenshot({
        path: `${smokeDirectory}/chat-picker-dark.png`,
        animations: "disabled",
      });
      await page.keyboard.press("Escape");
      await picker.waitFor({ state: "hidden" });

      // The model selector embeds the Favorites endpoint independently of the composer picker.
      const modelSelector = page
        .locator('[data-tour="model-selector"]')
        .filter({ visible: true })
        .first();
      await modelSelector.click();
      await page
        .locator("[data-favorite-row]")
        .filter({ visible: true })
        .first()
        .waitFor();
      expect(await page.locator("#chat-tool-navigation").count()).toBe(0);
      await page.keyboard.press("Escape");
      await gotoReady("/skill/devils-advocate", () =>
        page.getByRole("heading", { level: 1 }).first().waitFor(),
      );
      expect(await page.locator("#chat-tool-navigation").count()).toBe(0);
    },
  );

  e2e.it(
    "restores a secondary tool alias with its category selected",
    async (fixtures) => {
      const { gotoReady, page } = fixtures;
      await authAtlas(fixtures, await resolveTestAdminUser());
      const display = page.locator("#admin-tool-leads-import");
      await gotoReady(`${root}/import-leads`, () => display.waitFor());
      const leads = CATEGORY_REGISTRY.find(({ key }) => key === "leads");
      expect(leads).toBeDefined();
      if (!leads) return;
      const label = localizedLabel(leads.labels, E2E_LOCALE) ?? leads.label;
      const active = adminNav(page).getByRole("button", {
        name: label,
        exact: true,
      });
      expect(["page", "true"]).toContain(
        await active.getAttribute("aria-current"),
      );
    },
  );

  e2e.it(
    "hides and restores a tool without invalidating its URL or favorite pin",
    async (fixtures) => {
      const { capture, cleanup, gotoReady, page } = fixtures;
      const viewer = await createE2ECreditUser("unified-tool-navigation", 0);
      cleanup(viewer.remove);
      await authAtlas(fixtures, viewer.user);
      await page.setViewportSize({ width: 1440, height: 900 });
      const { t: searchT } = searchTranslation.scopedT(E2E_LOCALE);
      const toolTitle = searchT("get.titleShort");
      await gotoReady(root, () =>
        page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor(),
      );
      await searchWorkspace(fixtures, WEB_SEARCH_ALIAS);
      const tool = page
        .locator("#admin-catalog")
        .getByRole("button", { name: toolTitle })
        .first();
      await tool.waitFor();
      const options = tool
        .locator("..")
        .getByRole("button", { name: t("catalog.toolOptions") });
      await options.click();
      await page
        .getByRole("menuitem", {
          name: t("catalog.unfavoriteTool"),
          exact: true,
        })
        .waitFor();
      const hidden = await capture(settings.POST, () =>
        page
          .getByRole("menuitem", { name: t("catalog.hideTool"), exact: true })
          .click(),
      );
      expect(hidden.response.success).toBe(true);
      await tool.waitFor({ state: "hidden" });

      await gotoReady(`${root}/${WEB_SEARCH_ALIAS}`, () =>
        page.locator(`#admin-tool-${WEB_SEARCH_ALIAS}`).waitFor(),
      );
      await gotoReady(root, () =>
        page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor(),
      );
      await adminNav(page).getByRole("combobox").click();
      await page
        .getByRole("option", { name: t("catalog.hidden"), exact: true })
        .click();
      const restore = page.getByRole("button", {
        name: t("catalog.restoreTool"),
        exact: true,
      });
      await restore.waitFor();
      const restored = await capture(settings.POST, () => restore.click());
      expect(restored.response.success).toBe(true);
      await restore.waitFor({ state: "hidden" });
      await adminNav(page).getByRole("combobox").click();
      await page
        .getByRole("option", { name: t("catalog.allTools"), exact: true })
        .click();
      await searchWorkspace(fixtures, WEB_SEARCH_ALIAS);
      await tool.waitFor();
      await options.click();
      await page
        .getByRole("menuitem", {
          name: t("catalog.unfavoriteTool"),
          exact: true,
        })
        .waitFor();
    },
  );

  e2e.it("rejects orphan and role-denied deep links", async (fixtures) => {
    const { gotoReady, page } = fixtures;
    await authAtlas(fixtures, await resolveTestAdminUser());
    const { t: widgetT } = widgetTranslation.scopedT(E2E_LOCALE);
    const unavailable = page
      .getByText(widgetT("widgets.toolUnavailable.unknownTitle"), {
        exact: true,
      })
      .last();
    await gotoReady(`${root}/admin-catalog-orphan-fixture`, () =>
      unavailable.waitFor(),
    );
    expect(await page.locator('[id^="admin-tool-"]').count()).toBe(0);

    await page
      .getByText(widgetT("widgets.toolUnavailable.unknownMessage"), {
        exact: true,
      })
      .waitFor();
    expect(
      await adminNav(page)
        .getByRole("button", { name: t("erp.home"), exact: true })
        .getAttribute("aria-current"),
    ).not.toBe("page");
    await page
      .getByRole("button", { name: t("catalog.browse"), exact: true })
      .filter({ visible: true })
      .last()
      .click();
    await page.waitForURL((url) => url.pathname.endsWith("/tools"));
    await page
      .getByRole("heading", { name: t("catalog.favorites"), exact: true })
      .waitFor();

    const preview = new URLSearchParams({
      view: UserPermissionRole.CUSTOMER,
    });
    await gotoReady(`${root}/accounting-dashboard?${preview.toString()}`, () =>
      unavailable.waitFor(),
    );
    await adminNav(page).waitFor();
    await page
      .getByText(
        t("catalog.rolePreview", {
          role: t("get.fields.viewAsRole.options.customer"),
        }),
        { exact: true },
      )
      .waitFor();
    expect(await page.locator("#admin-tool-accounting-dashboard").count()).toBe(
      0,
    );
  });
});
