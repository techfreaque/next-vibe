import { DateRangePreset } from "next-vibe/core/core-utils/stats-filtering.schema";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { scopedTranslation as searchTranslation } from "../search/i18n";
import definition from "./definition";
import { scopedTranslation } from "./i18n";

describe("Lead statistics controls", () => {
  const e2e = useE2E("leads/stats-operator");
  for (const { locale, source } of [
    { locale: "en-US", source: "saved" },
    { locale: "de-DE", source: "saved" },
    { locale: "en-US", source: "live" },
  ] as const) {
    e2e.it(`filters and refreshes ${source} statistics and opens lead search in ${locale}`, async (fixture) => {
      const { page } = fixture;
      const { t } = scopedTranslation.scopedT(locale);
      const { t: searchT } = searchTranslation.scopedT(locale);
      const apiPath = `/api/${locale}/leads/stats`;
      if (source === "saved") {
        const example = definition.GET.responseSchema.parse({
          ...definition.GET.examples.responses?.default,
          historicalData: {},
        });
        const stats = definition.GET.responseSchema.parse({
          ...example,
          totalLeads: 120,
          newLeads: 120,
          activeLeads: 96,
          campaignRunningLeads: 42,
          signedUpLeads: 18,
          convertedLeads: 18,
          subscriptionConfirmedLeads: 12,
          unsubscribedLeads: 6,
          conversionRate: 0.15,
          signupRate: 0.15,
          averageOpenRate: 0.42,
          averageClickRate: 0.12,
          leadsCreatedToday: 3,
          leadsCreatedThisWeek: 27,
          leadsCreatedThisMonth: 120,
          groupedStats: {
            ...example.groupedStats,
            byStatus: [
              { category: LeadStatus.NEW, value: 54, percentage: 45 },
              { category: LeadStatus.CAMPAIGN_RUNNING, value: 42, percentage: 35 },
              { category: LeadStatus.SIGNED_UP, value: 18, percentage: 15 },
              { category: LeadStatus.UNSUBSCRIBED, value: 6, percentage: 5 },
            ],
            bySource: [
              { category: LeadSource.WEBSITE, value: 90, percentage: 75 },
              { category: LeadSource.CSV_IMPORT, value: 30, percentage: 25 },
            ],
            byCountry: [
              { category: "US", value: 80, percentage: 66.7 },
              { category: "DE", value: 40, percentage: 33.3 },
            ],
          },
        });
        await page.route((url) => url.pathname === apiPath, (route) =>
          route.fulfill({ json: { success: true, data: stats } }),
        );
      }
      const waitForStats = (preset?: typeof DateRangePreset.LAST_7_DAYS) =>
        page.waitForResponse((result) => {
          const url = new URL(result.url());
          return url.pathname === apiPath &&
            (!preset || url.searchParams.get("dateRangePreset") === preset);
        }, { timeout: 45_000 });
      await authAtlas(fixture, await resolveTestAdminUser());
      const [initial] = await Promise.all([waitForStats(), fixture.goto("/tools/leads-stats", locale)]);
      expect(initial.ok()).toBe(true);
      expect(await initial.json()).toMatchObject({ success: true });
      await page.getByRole("heading", { name: t("widget.title"), exact: true }).waitFor();
      if (source === "saved") {
        const unsubscribeRate = new Intl.NumberFormat(locale, {
          style: "percent",
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(0.05);
        await page.getByText(t("widget.unsubscribeRate"), { exact: true })
          .locator("xpath=../..")
          .getByText(unsubscribeRate, { exact: true })
          .waitFor();
        await saveAdminReviewScreenshots(page, "leads-stats", locale);
      }

      const filtersToggle = page.getByRole("button", { name: t("widget.filters"), exact: true });
      const filtersId = await filtersToggle.getAttribute("aria-controls");
      expect(filtersId).toBeTruthy();
      await filtersToggle.click();
      const filters = page.locator(`[id="${filtersId}"]`);
      const range = filters.getByRole("combobox", { name: t("dateRangePreset.label"), exact: true });
      await range.click();
      await page.getByRole("option", { name: t("dateRange.last7Days"), exact: true }).click();
      const apply = filters.getByRole("button", { name: t("widget.applyFilters"), exact: true });
      const [filtered] = await Promise.all([waitForStats(DateRangePreset.LAST_7_DAYS), apply.click()]);
      expect(filtered.ok()).toBe(true);
      expect(await filtered.json()).toMatchObject({ success: true });

      const refresh = page.getByRole("button", { name: t("widget.refresh"), exact: true });
      const [refreshed] = await Promise.all([waitForStats(DateRangePreset.LAST_7_DAYS), refresh.click()]);
      expect(refreshed.ok()).toBe(true);
      await page.getByRole("button", { name: t("widget.searchLeads"), exact: true }).click();
      await page.getByRole("heading", { name: searchT("get.title"), exact: true }).waitFor();
    });
  }
});
