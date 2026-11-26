import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import type { Page } from "playwright";
import { describe, expect } from "vitest";

import { category } from "../category";
import { errorLogs } from "../error-monitor/db";
import endpoint from "./definition";
import { scopedTranslation } from "./i18n";
import { summarizeOperations } from "./summary";

const { t } = scopedTranslation.scopedT(E2E_LOCALE);
const categoryLabel = category.label[E2E_LOCALE] ?? category.label["en-US"] ?? "System health";

function categoryButton(page: Page) {
  return page.locator("#platform-admin-navigation").filter({ visible: true })
    .getByRole("button", { name: categoryLabel, exact: true }).last();
}

async function captureFixture(page: Page, state: "default" | "empty"): Promise<void> {
  if (process.env["PEOPLE_OPERATIONS_SHOTS"] !== "1") {
    return;
  }
  const root = "scratchpad/erp/shots/v2/serviceHealth";
  await mkdir(root, { recursive: true });
  const theme = (await page.locator("html.dark").count()) ? "dark" : "light";
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: `${root}/operations-summary-${state}-en-desktop-${theme}.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: `${root}/operations-summary-${state}-en-phone-${theme}.png` });
  await page.setViewportSize({ width: 1440, height: 900 });
}

describe("E2E: Operations workspace", () => {
  const e2e = useE2E("operations-summary");

  e2e.it("loads authorized platform health from real data and opens its owning reports", async ({
    capture, cleanup, gotoReady, loginAs, page,
  }) => {
    const fingerprint = `operations-fixture-${randomUUID()}`;
    cleanup(async () => { await db.delete(errorLogs).where(eq(errorLogs.fingerprint, fingerprint)); });
    await db.insert(errorLogs).values({ fingerprint, message: "Synthetic operations fixture", level: "error" });
    await loginAs(await resolveTestAdminUser());
    await gotoReady("/tools", () => page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor());
    const loaded = await capture(endpoint.GET, () => categoryButton(page).click());
    expect(loaded.response.success).toBe(true);
    if (!loaded.response.success) {
      return;
    }
    const errorAlerts = loaded.response.data.summary.attention.filter(({ label }) => label === "errorAlert");
    expect(errorAlerts[0]?.count ?? 0).toBeGreaterThan(0);
    await page.waitForURL((url) => url.searchParams.get("cat") === "serviceHealth");
    await page.getByText(String(t("attention")), { exact: true }).last().waitFor();
    await captureFixture(page, "default");

    const drilldowns = [
      { label: t("errors"), alias: "error-logs" },
      { label: t("tasks"), alias: "task-health" },
      { label: t("connections"), alias: "remote-connections" },
    ];
    for (const { label, alias } of drilldowns) {
      const target = page.getByText(String(label), { exact: true }).last();
      await gotoReady("/tools?cat=serviceHealth", () => target.waitFor());
      await target.click();
      await page.locator(`#admin-tool-${alias}`).waitFor();
    }
  });

  e2e.it("shows a clean isolated health snapshot without changing any live records", async ({
    gotoReady, loginAs, page,
  }) => {
    await loginAs(await resolveTestAdminUser());
    const empty = summarizeOperations("2026-11-25", { errors: 0, tasks: 0, connections: 0 });
    await page.route(/\/api\/[^/]+\/vibe\/logger\/operations-summary(?:\?|$)/, (route) =>
      route.fulfill({ json: { success: true, data: { summary: empty } } }),
    );
    await gotoReady("/tools", () => page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor());
    await categoryButton(page).click();
    await page.getByText(String(t("clear")), { exact: true }).waitFor();
    expect(await page.getByText(String(t("unavailable")), { exact: true }).count()).toBe(0);
    await captureFixture(page, "empty");
  });
});
