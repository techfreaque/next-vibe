import { mkdir } from "node:fs/promises";

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import type { Page, Route } from "playwright";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { scopedTranslation } from "../overview/i18n";

const languages = [
  { locale: "en-US", suffix: "en" },
  { locale: "de-DE", suffix: "de" },
  { locale: "sk-SK", suffix: "sk" },
] as const;

function isMoneyRequest(url: string): boolean {
  const parsed = new URL(url);
  return parsed.pathname.endsWith("/analytics/business/summary") &&
    parsed.searchParams.get("section") === "money";
}

async function saveDesktop(page: Page, state: string, suffix: string): Promise<void> {
  if (process.env["GROWTH_SUMMARY_SHOTS"] !== "1") {
    return;
  }
  const root = "scratchpad/erp/shots/v2/analytics";
  await mkdir(root, { recursive: true });
  for (const theme of ["light", "dark"] as const) {
    await page.evaluate((value) => {
      const key = "theme_v2";
      const oldValue = localStorage.getItem(key);
      localStorage.setItem(key, value);
      window.dispatchEvent(new StorageEvent("storage", { key, oldValue, newValue: value }));
    }, theme);
    await page.locator(`html.${theme}`).waitFor({ state: "attached" });
    await page.screenshot({ path: `${root}/growth-${state}-${suffix}-desktop-${theme}.png` });
  }
}

describe("Growth summary on Atlas", () => {
  const e2e = useE2E("analytics/growth-summary");
  e2e.it("settles the real Growth summary without intercepting catalog or summary requests", async (fixture) => {
    await authAtlas(fixture, await resolveTestAdminUser());
    const { page, baseUrl } = fixture;
    const { t } = scopedTranslation.scopedT("en-US");
    await page.setViewportSize({ width: 1440, height: 900 });
    const requests: { section: string; status: number }[] = [];
    page.on("response", (response) => {
      const url = new URL(response.url());
      const section = url.searchParams.get("section");
      if (section && url.pathname.endsWith("/analytics/business/summary")) {
        requests.push({ section, status: response.status() });
      }
    });
    await page.goto(`${baseUrl}/en-US/tools?cat=analytics`, { waitUntil: "domcontentloaded" });
    for (const key of ["get.widget.kpi.humanLeads", "get.widget.kpi.revenue"] as const) {
      await page.getByRole("button", { name: new RegExp(String(t(key))) }).first().waitFor({ timeout: 60_000 });
    }
    expect(requests.some(({ section, status }) => section === "acquisition" && status === 200)).toBe(true);
    expect(requests.some(({ section, status }) => section === "money" && status === 200)).toBe(true);
    await saveDesktop(page, "live", "en");
  });

  for (const { locale, suffix } of languages) {
    e2e.it(`keeps acquisition visible when revenue is delayed and recovers in ${locale}`, async (fixture) => {
      const { baseUrl, cleanup, page } = fixture;
      await authAtlas(fixture, await resolveTestAdminUser());
      await page.setViewportSize({ width: 1440, height: 900 });
      const { t } = scopedTranslation.scopedT(locale);
      let holdMoney = true;
      let moneyRequests = 0;
      const held: Route[] = [];
      cleanup(async () => {
        await Promise.all(held.map((route) => route.abort().catch(() => undefined)));
      });
      await page.route("**/analytics/business/summary?**", async (route) => {
        if (isMoneyRequest(route.request().url())) {
          moneyRequests++;
          if (holdMoney) {
            if (suffix === "de") {
              await route.fulfill({ status: 503, contentType: "application/json", body: "{}" });
              return;
            }
            held.push(route);
            return;
          }
        }
        await route.continue();
      });

      await page.goto(`${baseUrl}/${locale}/tools?cat=analytics`, { waitUntil: "domcontentloaded" });
      const leads = page.getByRole("button", {
        name: new RegExp(String(t("get.widget.kpi.humanLeads"))),
      }).filter({ visible: true }).first();
      const revenue = page.getByRole("button", {
        name: new RegExp(String(t("get.widget.kpi.revenue"))),
      }).filter({ visible: true }).first();
      const retry = page.getByRole("button", {
        name: t("platformSummary.retry"),
        exact: true,
      }).filter({ visible: true }).first();
      await leads.waitFor({ timeout: 60_000 });
      await retry.waitFor({ timeout: 35_000 });
      expect(await leads.isVisible()).toBe(true);
      expect(await revenue.isVisible()).toBe(false);
      expect(moneyRequests).toBeGreaterThan(0);
      await saveDesktop(page, "money-unavailable", suffix);

      holdMoney = false;
      const recovered = page.waitForResponse((reply) =>
        reply.ok() && isMoneyRequest(reply.url()),
        { timeout: 35_000 },
      );
      await retry.click();
      expect((await recovered).ok()).toBe(true);
      await Promise.all(held.splice(0).map((route) => route.abort().catch(() => undefined)));
      await revenue.waitFor();
      expect(await leads.isVisible()).toBe(true);
      expect(moneyRequests).toBeGreaterThan(1);
      await saveDesktop(page, "loaded", suffix);

      if (suffix === "en") {
        const acquisition = page.waitForResponse((reply) =>
          reply.ok() && new URL(reply.url()).pathname.endsWith("/leads/analytics/acquisition"),
        );
        await leads.click();
        expect((await acquisition).ok()).toBe(true);
        await page.goto(`${baseUrl}/${locale}/tools?cat=analytics`, { waitUntil: "domcontentloaded" });
        await revenue.waitFor();
        const payments = page.waitForResponse((reply) =>
          reply.ok() && new URL(reply.url()).pathname.endsWith("/payment/analytics/revenue"),
        );
        await revenue.click();
        expect((await payments).ok()).toBe(true);
      }
    });
  }
});
