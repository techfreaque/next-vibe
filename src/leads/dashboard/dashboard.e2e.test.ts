import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";

import { eq, max } from "drizzle-orm";
import { getLanguageAndCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { db } from "next-vibe/database";
import { scopedTranslation as helpTranslation } from "next-vibe/help-tool/i18n";
import { leads } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import type { Page } from "playwright";
import { describe, expect } from "vitest";

import { scopedTranslation as detailTranslation } from "../[id]/i18n";
import { category } from "../category";
import dashboard from "./definition";
import { scopedTranslation } from "./i18n";

const { t } = scopedTranslation.scopedT(E2E_LOCALE);
const { t: detailT } = detailTranslation.scopedT(E2E_LOCALE);
const { t: helpT } = helpTranslation.scopedT(E2E_LOCALE);
const categoryLabel = category.label[E2E_LOCALE] ?? category.label["en-US"] ?? "Leads";

function categoryButton(page: Page) {
  return page.locator("#platform-admin-navigation").filter({ visible: true })
    .getByRole("button", { name: categoryLabel, exact: true }).last();
}

async function captureFixture(page: Page, state: "default" | "empty" | "detail"): Promise<void> {
  if (process.env["PEOPLE_OPERATIONS_SHOTS"] !== "1") {
    return;
  }
  const root = "scratchpad/erp/shots/v2/leads";
  await mkdir(root, { recursive: true });
  const theme = (await page.locator("html.dark").count()) ? "dark" : "light";
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: `${root}/workspace-${state}-en-desktop-${theme}.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: `${root}/workspace-${state}-en-phone-${theme}.png` });
  await page.setViewportSize({ width: 1440, height: 900 });
}

describe("E2E: Leads workspace", () => {
  const e2e = useE2E("leads-dashboard");

  e2e.it("opens the dynamic Leads category, drills into its recent record and follows acquisition", async ({
    cleanup, gotoReady, loginAs, page,
  }) => {
    const id = randomUUID();
    const businessName = `Fixture lead ${id.slice(0, 8)}`;
    const { country, language } = getLanguageAndCountryFromLocale(E2E_LOCALE);
    const [clock] = await db.select({ latest: max(leads.createdAt) }).from(leads);
    // Keep the disposable row in the bounded list while other suites seed data.
    const createdAt = new Date(Math.max(Date.now() + 60_000, (clock?.latest?.getTime() ?? 0) + 1));
    cleanup(async () => { await db.delete(leads).where(eq(leads.id, id)); });
    await db.insert(leads).values({
      id, businessName, country, language, createdAt, status: LeadStatus.WEBSITE_USER, source: LeadSource.WEBSITE,
    });
    await loginAs(await resolveTestAdminUser());
    await gotoReady("/tools", () =>
      page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor(),
    );
    await categoryButton(page).click();
    await page.waitForURL((url) => url.searchParams.get("cat") === "leads");
    const name = page.getByText(businessName, { exact: true }).last();
    // A cold catalog read can fail after the sidebar has already updated its URL.
    if (!await name.waitFor({ timeout: 8_000 }).then(() => true, () => false)) {
      await gotoReady("/tools?cat=leads", () => name.waitFor());
    }
    await captureFixture(page, "default");
    await name.click();
    const header = page.getByRole("heading", { name: businessName, exact: true }).last();
    const retry = page.getByRole("button", { name: String(detailT("widget.retryLoad")), exact: true });
    await header.or(retry).first().waitFor();
    if (await retry.isVisible()) {
      await retry.click();
    }
    await header.waitFor();
    expect(await page.getByText(id, { exact: true }).count()).toBe(0);
    await captureFixture(page, "detail");

    const acquisition = page.getByText(String(t("widget.humanLeads")), { exact: true }).last();
    await gotoReady("/tools?cat=leads", () => acquisition.waitFor());
    await acquisition.click();
    await page.locator("#admin-tool-acquisition-report").waitFor();
  });

  e2e.it("opens Leads from navigation with an isolated empty dashboard and finds the dedicated report", async ({
    gotoReady, loginAs, page,
  }) => {
    await loginAs(await resolveTestAdminUser());
    const examples = dashboard.GET.examples.responses;
    const response = dashboard.GET.responseSchema.parse(examples?.empty);
    expect(response.summary?.kpis.every(kpi => kpi.value === 0)).toBe(true);
    expect(response.summary?.recent).toEqual([]);
    const populated = dashboard.GET.responseSchema.parse(examples?.default);
    expect(populated.summary?.kpis[0]?.value).toBe(120);
    await page.route(/\/api\/[^/]+\/leads\/dashboard(?:\?|$)/, (route) =>
      route.fulfill({ json: { success: true, data: response } }),
    );
    await gotoReady("/tools", () =>
      page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor(),
    );
    await categoryButton(page).click();
    await page.getByText(String(t("widget.noAttention")), { exact: true }).waitFor();
    expect(await page.getByText(String(t("widget.recentLeads")), { exact: true }).count()).toBe(0);
    await captureFixture(page, "empty");

    const search = page.getByRole("textbox", { name: String(helpT("catalog.searchLabel")), exact: true }).last();
    await search.fill(String(t("get.titleShort")));
    await search.press("Enter");
    await page.getByText(String(t("get.titleShort")), { exact: true }).last().click();
    await page.getByRole("heading", { name: String(t("get.title")), exact: true }).waitFor();
    await page.getByText(String(t("widget.noLeadsYet")), { exact: true }).waitFor();
  });
});
