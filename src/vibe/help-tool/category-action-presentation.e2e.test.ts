import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  getAtlasFixture,
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { CATEGORY_REGISTRY } from "@/generated/categories/registry";
import { scopedTranslation as purchasingTranslation } from "@/purchasing/i18n";
import { scopedTranslation as aiTranslation } from "@/vibe/agent/summary/i18n";

import definitions from "./definition";
import { scopedTranslation } from "./i18n";
import { localizedLabel } from "./localized-label";

const catalogResponse = z.object({
  success: z.literal(true),
  data: definitions.GET.responseSchema,
});

describe("Admin landing actions and destinations", () => {
  const e2e = useE2E("admin-category-action-presentation");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(`separates creation from navigation in ${locale}`, async (fixture) => {
      const { baseUrl, page } = fixture;
      const { headers } = await prepareAtlasCompany(fixture, "Fixture purchasing books");
      const url = `${baseUrl}/api/${locale}/vibe/help-tool`;
      const response = await getAtlasFixture(url, {}, headers);
      expect(response.status).toBe(200);
      const catalog = catalogResponse.parse(await response.json()).data;
      const { t } = scopedTranslation.scopedT(locale);

      for (const [category, primary, expectedDestinations] of [
        ["ai", "skill-create", ["models", "skills", "agent-chat-threads", "task-list"]],
        ["purchasing", "purchasing_order_create_POST", ["purchasing-orders", "purchasing-vendors"]],
      ] as const) {
        const landing = catalog.adminCategoryLandings?.[category];
        const metadata = CATEGORY_REGISTRY.find(({ key }) => key === category);
        expect(landing).toBeDefined();
        expect(metadata).toBeDefined();
        if (!landing || !metadata) {
          return;
        }
        expect(landing.actions.map(({ alias }) => alias)).toEqual([primary]);
        const [action] = landing.actions;
        if (!action) {
          return;
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await fixture.goto(`/tools?cat=${category}`, locale);
        const toolbar = page.locator('#admin-tools-toolbar[data-admin-ready="true"]');
        await toolbar.waitFor();
        const title = landing.heading ?? localizedLabel(metadata.labels, locale) ?? metadata.label;
        if (category === "ai") {
          expect(landing.heading).toBe(locale === "de-DE" ? "KI" : "AI");
        } else {
          const switcher = toolbar.locator("#erp-company-switch");
          if (await switcher.isVisible()) {
            await switcher.click();
            await page.getByRole("menuitemradio").filter({ hasText: "Fixture purchasing books" }).click();
          }
        }
        const heading = page.getByRole("heading", { name: title, exact: true, level: 1 });
        const headerRow = heading.locator("xpath=../../..");
        const cta = headerRow.getByRole("button", { name: action.title, exact: true });
        const destinations = page.getByRole("heading", {
          name: t("admin.destinations"), exact: true,
        }).locator("xpath=..");
        const overviewLabel = category === "ai"
          ? aiTranslation.scopedT(locale).t("models")
          : purchasingTranslation.scopedT(locale).t("dashboard.get.widget.kpiDraft");
        const ready = async (): Promise<void> => {
          await cta.waitFor();
          await page.getByText(overviewLabel, { exact: true }).first().waitFor();
          expect(await headerRow.getByRole("button").count()).toBe(1);
          if (category === "purchasing") {
            const content = heading.locator('xpath=ancestor::div[contains(@class, "max-w-7xl")][1]');
            expect(await content.getByRole("heading", {level:1}).count()).toBe(1);
            expect(await content.getByRole("button", {name: action.title, exact:true}).count()).toBe(1);
          }
          for (const alias of expectedDestinations) {
            const matches = landing.destinations.filter((link) => link.alias === alias);
            expect(matches).toHaveLength(1);
            const [link] = matches;
            if (!link) {
              return;
            }
            await destinations.getByText(link.title, { exact: true }).waitFor();
            expect(await destinations.getByText(link.title, { exact: true }).count()).toBe(1);
            if (category === "ai") {
              const description = metadata.landing?.destinationDescriptions?.[alias];
              expect(link.description).toBe(description && localizedLabel(description, locale));
              expect(link.description).toBeTruthy();
              if (link.description) {
                await destinations.getByText(link.description, { exact: true }).waitFor();
              }
            }
          }
        };
        await ready();
        if (process.env["CATEGORY_ACTION_SHOTS"] === "1") {
          await saveAdminViewMatrix(page, "category-primary-actions", `r26-${category}-${locale.slice(0, 2)}`, ready);
        }
        const route = category === "purchasing" ? "purchasing/order/create/POST" : primary;
        await cta.click();
        await page.waitForURL((location) => location.pathname.endsWith(`/tools/${route}`));
      }
    }, 120_000);
  }
});
