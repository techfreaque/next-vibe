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

import { UserPermissionRole } from "../identity/roles/enum";
import helpEndpoints from "./definition";
import { scopedTranslation } from "./i18n";
import { localizedLabel } from "./localized-label";

const { t } = scopedTranslation.scopedT(E2E_LOCALE);
const root = "/tools";

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
          name: String(t("admin.workspaces")),
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
      await page
        .getByRole("button", {
          name: String(t("catalog.allTools")),
          exact: true,
        })
        .filter({ visible: true })
        .last()
        .click();
      await page.waitForURL((url) => url.searchParams.get("catalog") === "all");
      expect(new URL(page.url()).searchParams.has("q")).toBe(false);
      await nav.waitFor({ state: "hidden" });
      await page
        .getByRole("button", { name: String(t("erp.home")), exact: true })
        .click();
      await nav.waitFor();
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
      expect(await active.getAttribute("aria-current")).toBe("page");
    },
  );

  e2e.it("rejects orphan and role-denied deep links", async (fixtures) => {
    const { gotoReady, page } = fixtures;
    await authAtlas(fixtures, await resolveTestAdminUser());
    const unavailable = page
      .getByText(String(t("catalog.toolNotFound")), { exact: true })
      .last();
    await gotoReady(`${root}/admin-catalog-orphan-fixture`, () =>
      unavailable.waitFor(),
    );
    expect(await page.locator('[id^="admin-tool-"]').count()).toBe(0);

    await page
      .getByText(t("catalog.toolUnavailableHint"), { exact: true })
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
      .getByRole("heading", { name: t("admin.workspaces"), exact: true })
      .waitFor();

    const preview = new URLSearchParams({
      view: UserPermissionRole.CUSTOMER,
    });
    await gotoReady(`${root}/accounting-dashboard?${preview.toString()}`, () =>
      unavailable.waitFor(),
    );
    expect(await adminNav(page).count()).toBe(0);
    expect(await page.locator("#admin-tool-accounting-dashboard").count()).toBe(
      0,
    );
  });
});
