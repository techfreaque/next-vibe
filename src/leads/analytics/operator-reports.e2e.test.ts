import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { AnalyticsGranularity, AnalyticsRange } from "next-vibe/unified-ui/analytics/enum";
import { scopedTranslation } from "next-vibe/unified-ui/analytics/i18n";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import abuse from "./abuse/definition";
import acquisition from "./acquisition/definition";
import { LeadDimension, TrafficFilter } from "./enum";
import funnel from "./funnel/definition";
import { scopedTranslation as funnelTranslation } from "./funnel/i18n";
import { scopedTranslation as leadAnalyticsTranslation } from "./i18n";

describe("Lead analytics controls", () => {
  const e2e = useE2E("leads/operator-reports");
  for (const { view, endpoint } of [
    { view: "acquisition-report", endpoint: acquisition.GET },
    { view: "funnel-report", endpoint: funnel.GET },
    { view: "abuse-report", endpoint: abuse.GET },
  ]) {
    for (const locale of ["en-US", "de-DE"] as const) {
      e2e.it(`loads, changes the period, changes granularity and refreshes ${view} in ${locale}`, async (fixture) => {
        const { t } = scopedTranslation.scopedT(locale);
        const { page } = fixture;
        const apiPath = `/api/${locale}/${endpoint.path.join("/")}`;
        const waitForReport = (expected: Record<string, string>) =>
          page.waitForResponse((result) => {
            const url = new URL(result.url());
            return url.pathname === apiPath &&
              result.request().method() === "GET" &&
              Object.entries(expected).every(([key, value]) => url.searchParams.get(key) === value);
          }, { timeout: 50_000 });
        await authAtlas(fixture, await resolveTestAdminUser());
        const [initial] = await Promise.all([
          waitForReport({}),
          fixture.goto(`/tools/${view}`, locale),
        ]);
        expect(initial.ok()).toBe(true);
        expect(await initial.json()).toMatchObject({ success: true });
        const refresh = page.getByRole("button", { name: t("analytics.chart.refresh"), exact: true });
        const period = page.getByRole("radio", { name: t("analytics.rangeShort.last7Days"), exact: true });
        await refresh.waitFor();
        if (view !== "funnel-report") {
          await saveAdminReviewScreenshots(page, view, locale);
        }

        const [periodResult] = await Promise.all([
          waitForReport({ range: AnalyticsRange.LAST_7_DAYS }),
          period.click(),
        ]);
        expect(periodResult.ok()).toBe(true);
        expect(await periodResult.json()).toMatchObject({ success: true });
        expect(await period.getAttribute("aria-checked")).toBe("true");

        const day = page.getByRole("radio", { name: t("analytics.granularity.day"), exact: true });
        const [bucketResult] = await Promise.all([
          waitForReport({ granularity: AnalyticsGranularity.DAY }),
          day.click(),
        ]);
        expect(bucketResult.ok()).toBe(true);
        expect(await bucketResult.json()).toMatchObject({ success: true });
        expect(await day.getAttribute("aria-checked")).toBe("true");

        const [refreshed] = await Promise.all([
          waitForReport({
            range: AnalyticsRange.LAST_7_DAYS,
            granularity: AnalyticsGranularity.DAY,
          }),
          refresh.click(),
        ]);
        expect(refreshed.ok()).toBe(true);
        expect(await refreshed.json()).toMatchObject({ success: true });
      });
    }
  }

  for (const locale of ["en-US", "de-DE"] as const) {
    e2e.it(`filters and drills into the saved funnel sample in ${locale}`, async (fixture) => {
      const { page } = fixture;
      const { t } = funnelTranslation.scopedT(locale);
      const { t: sharedT } = leadAnalyticsTranslation.scopedT(locale);
      const apiPath = `/api/${locale}/leads/analytics/funnel`;
      const sample = funnel.GET.responseSchema.parse(funnel.GET.examples.responses?.default);
      await page.route((url) => url.pathname === apiPath, (route) => {
        const query = new URL(route.request().url()).searchParams;
        const byCountry = query.get("dimension") === LeadDimension.COUNTRY;
        return route.fulfill({
          json: {
            success: true,
            data: byCountry
              ? {
                  ...sample,
                  dimensionUsed: LeadDimension.COUNTRY,
                  segments: sample.segments.map((row) => ({ ...row, key: "US" })),
                }
              : sample,
          },
        });
      });
      const waitForReport = (field: string, value: string | null) =>
        page.waitForResponse((result) => {
          const url = new URL(result.url());
          return url.pathname === apiPath && url.searchParams.get(field) === value;
        });
      await authAtlas(fixture, await resolveTestAdminUser());
      await fixture.goto("/tools/funnel-report", locale);
      const dimension = page.getByRole("tab", { name: sharedT("leadAnalytics.dimension.country"), exact: true });
      await dimension.waitFor();
      await saveAdminReviewScreenshots(page, "funnel-report", locale);

      const [grouped] = await Promise.all([waitForReport("dimension", LeadDimension.COUNTRY), dimension.click()]);
      expect(grouped.ok()).toBe(true);
      expect(await dimension.getAttribute("aria-selected")).toBe("true");
      await page.getByRole("button", { name: t("widget.filtersTitle") }).click();
      await page.locator('input[name="country"]').fill("US");
      const [filtered] = await Promise.all([
        waitForReport("country", "US"),
        page.getByRole("button", { name: t("widget.apply"), exact: true }).click(),
      ]);
      expect(filtered.ok()).toBe(true);
      const chip = page.getByRole("button", { name: /US$/u }).first();
      await chip.waitFor();
      const [cleared] = await Promise.all([waitForReport("country", null), chip.click()]);
      expect(cleared.ok()).toBe(true);

      await page.getByRole("button", { name: new RegExp(`^${t("widget.signupRate")}`, "u") }).first().click();
      await page.waitForURL((url) =>
        url.pathname === `/${locale}/tools/leads-list` &&
        url.searchParams.get("arg.traffic") === TrafficFilter.NOT_BOTS,
      );
    });
  }
});
