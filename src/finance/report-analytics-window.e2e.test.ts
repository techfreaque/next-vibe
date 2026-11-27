import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import business from "@/analytics/business/overview/definition";
import { scopedTranslation as businessTranslation } from "@/analytics/business/overview/i18n";
import { scopedTranslation } from "@/chart-of-accounts/i18n";
import usage from "@/credits/analytics/usage/definition";
import revenue from "@/payment/analytics/revenue/definition";

import { reportDay, reportPeriodRange } from "./report-period";

describe("E2E: analytics report periods", () => {
  const e2e = useE2E("analytics/report-periods");
  for (const report of [
    { view: "revenue-report", endpoint: revenue.GET },
    { view: "credit-usage-report", endpoint: usage.GET },
    { view: "business-overview", endpoint: business.GET },
  ]) {
    for (const locale of ["en-US", "de-DE"] as const) {
      e2e.it(
        `loads and changes the period for ${report.view} in ${locale}`,
        async (fixture) => {
          const { page, baseUrl } = fixture;
          const { t } = scopedTranslation.scopedT(locale);
          const now = new Date();
          const api = `/api/${locale}/${report.endpoint.path.join("/")}`;
          const waitForReport = (preset: "thisMonth" | "lastMonth") => {
            const period = reportPeriodRange(preset, now);
            return page.waitForResponse(
              (response) => {
                const url = new URL(response.url());
                return (
                  url.origin === new URL(baseUrl).origin &&
                  url.pathname === api &&
                  response.request().method() === "GET" &&
                  url.searchParams.get("from") === reportDay(period.from) &&
                  url.searchParams.get("to") === reportDay(period.to)
                );
              },
              { timeout: 45_000 },
            );
          };
          await authAtlas(fixture, await resolveTestAdminUser());
          const [initial] = await Promise.all([
            waitForReport("thisMonth"),
            fixture.goto(`/tools/${report.view}`, locale),
          ]);
          expect(initial.ok()).toBe(true);
          expect(await initial.json()).toMatchObject({ success: true });
          const { t: businessT } = businessTranslation.scopedT(locale);
          if (report.view === "business-overview") {
            await page
              .getByRole("heading", { name: businessT("get.title"), exact: true })
              .waitFor();
            await page
              .getByRole("button", {
                name: businessT("get.widget.open.acquisition"),
                exact: true,
              })
              .waitFor();
            expect(
              await page
                .getByText(businessT("get.widget.unavailable"), { exact: true })
                .count(),
            ).toBe(0);
          }
          const previousMonth = page.getByRole("radio", {
            name: t("reports.widget.previousMonth"),
            exact: true,
          });
          await previousMonth.waitFor();
          await saveAdminReviewScreenshots(page, report.view, locale);
          const [changed] = await Promise.all([
            waitForReport("lastMonth"),
            previousMonth.click(),
          ]);
          expect(changed.ok()).toBe(true);
          expect(await changed.json()).toMatchObject({ success: true });
          if (report.view === "business-overview") {
            await page
              .getByRole("button", {
                name: businessT("get.widget.open.acquisition"),
                exact: true,
              })
              .click();
            await page.locator("#admin-tool-acquisition-report").waitFor();
          }
        },
      );
    }
  }
});
