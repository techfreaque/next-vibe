import { mkdir } from "node:fs/promises";

import { eq } from "drizzle-orm";
import { Countries, Languages } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { scopedTranslation as leadTranslation } from "next-vibe/identity/lead/i18n";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import type { Page } from "playwright";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { scopedTranslation as listTranslation } from "@/leads/list/i18n";

import { scopedTranslation as uiTranslation } from "../../../../ui/web/i18n";

async function screenshot(
  page: Page,
  locale: string,
  device: string,
): Promise<void> {
  if (process.env["MULTISELECT_SHOTS"] !== "1") {
    return;
  }
  const path = "scratchpad/erp/shots/v2/multiselect-accessibility";
  await mkdir(path, { recursive: true });
  await page.screenshot({
    path: `${path}/lead-source-${locale}-${device}.png`,
    animations: "disabled",
  });
}

describe("Shared multiselect accessibility", () => {
  const e2e = useE2E("multiselect-accessibility");

  e2e.it(
    "filters localized options and keeps keyboard focus on the intended field",
    async (fixtures) => {
      const { page, baseUrl } = fixtures;
      const id = crypto.randomUUID();
      const email = fixtures.uniqueEmail("multiselect");
      const businessName = "E2E Multiselect Bookshop";
      fixtures.cleanup(async () => {
        await db.delete(leads).where(eq(leads.id, id));
      });
      await db.insert(leads).values({
        id,
        email,
        businessName,
        country: Countries.GLOBAL,
        language: Languages.EN,
        status: LeadStatus.NEW,
        source: LeadSource.WEBSITE,
      });
      await authAtlas(fixtures, await resolveTestAdminUser());
      await page.route("**/api/**/leads/list**", async (route) => {
        const url = new URL(route.request().url());
        if (url.searchParams.get("statusFilters.search") !== email) {
          await route.abort();
          return;
        }
        await route.continue();
      });

      for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
        const { t: listT } = listTranslation.scopedT(locale);
        const { t: uiT } = uiTranslation.scopedT(locale);
        const { t: leadT } = leadTranslation.scopedT(locale);
        const website = leadT(LeadSource.WEBSITE);
        const url = new URL(`/${locale}/tools/leads-list`, baseUrl);
        url.searchParams.set("arg.statusFilters.search", email);
        await page.setViewportSize({ width: 390, height: 844 });
        let response = await page.goto(url.toString(), {
          waitUntil: "domcontentloaded",
        });
        for (
          let retry = 0;
          (!response ||
            response.status() === 503 ||
            response.status() === 504) &&
          retry < 3;
          retry++
        ) {
          await Bun.sleep(5000);
          response = await page.reload({ waitUntil: "domcontentloaded" });
        }
        expect(response?.status()).toBe(200);
        await page
          .getByText(businessName, { exact: true })
          .filter({ visible: true })
          .first()
          .waitFor();

        const source = page.getByRole("combobox", {
          name: listT("filters.source.label"),
          exact: true,
        });
        const stage = page.getByRole("combobox", {
          name: listT("filters.currentCampaignStage.label"),
          exact: true,
        });
        expect(await source.count()).toBe(1);
        expect(await stage.count()).toBe(1);
        const ids = await Promise.all(
          [source, stage].map((trigger) =>
            trigger.evaluate((node) => {
              const label =
                node instanceof HTMLButtonElement ? node.labels?.item(0) : null;
              return {
                id: node.id,
                htmlFor: label?.htmlFor,
                matches: document.querySelectorAll(
                  `[id="${CSS.escape(node.id)}"]`,
                ).length,
              };
            }),
          ),
        );
        expect(new Set(ids.map(({ id }) => id)).size).toBe(2);
        for (const { id, htmlFor, matches } of ids) {
          expect(id.length).toBeGreaterThan(0);
          expect(htmlFor).toBe(id);
          expect(matches).toBe(1);
        }

        await source.press("Enter");
        const panelId = await source.getAttribute("aria-controls");
        expect(panelId).toBeTruthy();
        const search = page.getByRole("combobox", {
          name: uiT("ui.multiSelect.search"),
          exact: true,
        });
        await search.waitFor();
        expect(
          await search.evaluate((input) => input === document.activeElement),
        ).toBe(true);
        expect(
          await search.evaluate(
            (input, id) => input.closest('[role="dialog"]')?.id === id,
            panelId,
          ),
        ).toBe(true);
        await search.fill("no-such-option-12345");
        await page
          .getByText(uiT("ui.multiSelect.noResultsFound"), { exact: true })
          .waitFor();
        expect(await page.getByRole("option").count()).toBe(0);
        await screenshot(page, locale, "phone-empty");

        await search.fill(website);
        const option = page.getByRole("option", { name: website, exact: true });
        await option.waitFor();
        await search.press("ArrowDown");
        await search.press("Enter");
        await option.locator('[data-checked="true"]').waitFor();
        expect(await source.getAttribute("aria-expanded")).toBe("true");
        expect(await stage.getAttribute("aria-expanded")).toBe("false");
        const panel = page.getByRole("dialog").filter({ has: search });
        const box = await panel.boundingBox();
        expect(box && box.x >= 0 && box.x + box.width <= 390).toBe(true);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        ).toBe(true);
        await screenshot(page, locale, "phone");
        await page.setViewportSize({ width: 1440, height: 900 });
        await screenshot(page, locale, "desktop");

        await search.press("Escape");
        await panel.waitFor({ state: "hidden" });
        expect(
          await source.evaluate((node) => node === document.activeElement),
        ).toBe(true);
        const remove = page.getByRole("button", {
          name: uiT("ui.multiSelect.remove", { label: website }),
          exact: true,
        });
        await remove.press("Enter");
        await remove.waitFor({ state: "hidden" });
        expect(
          await source.evaluate((node) => node === document.activeElement),
        ).toBe(true);
        expect(await source.getAttribute("aria-expanded")).toBe("false");
        await stage.press("Enter");
        await search.waitFor();
        expect(await stage.getAttribute("aria-controls")).not.toBe(panelId);
        expect(await source.getAttribute("aria-expanded")).toBe("false");
        await search.press("Escape");
      }
    },
    120000,
  );
});
