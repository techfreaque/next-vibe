import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  authAtlas,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { scopedTranslation as revenueCopy } from "@/payment/analytics/revenue/i18n";
import { scopedTranslation as invoiceCopy } from "@/payment/invoice/create/i18n";
import { scopedTranslation } from "../overview/i18n";
import definition from "./definition";

describe("Payments workspace overview", () => {
  const e2e = useE2E("analytics/payment-landing");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(
      "opens revenue from the money tiles in " + locale,
      async (fixture) => {
        const { page } = fixture;
        await authAtlas(fixture, await resolveTestAdminUser());
        const { t } = scopedTranslation.scopedT(locale);
        const sections: string[] = [];
        let reportReads = 0;
        page.on("request", (request) => {
          const url = new URL(request.url());
          if (url.pathname.endsWith("/analytics/business/summary")) {
            sections.push(url.searchParams.get("section") ?? "");
          }
          if (url.pathname.endsWith("/payment/analytics/revenue"))
            reportReads++;
        });
        await page.setViewportSize({ width: 1440, height: 900 });
        const [headline] = await Promise.all([
          page.waitForResponse(
            (reply) =>
              reply.ok() &&
              new URL(reply.url()).pathname.endsWith(
                "/analytics/business/summary",
              ) &&
              new URL(reply.url()).searchParams.get("section") === "payments",
            { timeout: 55000 },
          ),
          fixture.goto("/tools?cat=payments", locale),
        ]);
        const result = z
          .object({
            success: z.literal(true),
            data: definition.GET.responseSchema,
          })
          .parse(await headline.json());
        expect(result.data.summary.kpis.map((tile) => tile.label)).toEqual([
          "get.widget.kpi.payers",
          "platformSummary.grossReceipts",
          "platformSummary.refunds",
          "platformSummary.netReceipts",
        ]);
        expect(result.data.summary.kpis[2]?.invertDelta).toBe(true);
        for (const key of [
          "platformSummary.grossReceipts",
          "platformSummary.refunds",
          "platformSummary.netReceipts",
        ] as const) {
          await page
            .getByRole("button", { name: new RegExp(t(key) + ".*USD") })
            .filter({ visible: true })
            .first()
            .waitFor();
        }
        const revenue = page
          .getByRole("button", {
            name: new RegExp(t("platformSummary.netReceipts") + ".*USD"),
          })
          .filter({ visible: true })
          .first();
        await revenue.waitFor();
        expect(sections).not.toContain("acquisition");
        expect(sections).not.toContain("operations");
        expect(reportReads).toBe(0);
        await saveAdminViewMatrix(
          page,
          "payments",
          "money-landing-" + locale.slice(0, 2),
        );
        const rt = revenueCopy.scopedT(locale).t;
        if (locale === "en-US") {
          let allowRead = false;
          await page.route(
            "**/api/*/payment/analytics/revenue*",
            async (route) => {
              if (allowRead) {
                await route.continue();
                return;
              }
              await new Promise<void>((resolve) => setTimeout(resolve, 400));
              await route.abort("failed");
            },
          );
          await revenue.click();
          await page
            .getByText(rt("get.errors.server.title"), { exact: true })
            .waitFor({ timeout: 55000 });
          allowRead = true;
          await page
            .getByRole("button", {
              name: rt("analytics.chart.refresh"),
              exact: true,
            })
            .filter({ visible: true })
            .last()
            .click();
        } else {
          await revenue.click();
        }
        await page.waitForURL((url) =>
          url.pathname.endsWith("/tools/revenue-report"),
        );
        // The populated report can use the query cache after a retry or repeat navigation.
        await page
          .getByText(rt("widget.kpi.grossRevenueUsd"), { exact: false })
          .filter({ visible: true })
          .first()
          .waitFor({ timeout: 90000 });
        expect(reportReads).toBeGreaterThan(0);
        await fixture.goto("/tools?cat=payments", locale);
        await page
          .locator('#admin-tools-toolbar[data-admin-ready="true"]')
          .waitFor();
        await page
          .getByRole("button", {
            name: new RegExp(t("platformSummary.netReceipts") + ".*USD"),
          })
          .filter({ visible: true })
          .first()
          .waitFor();
        await page
          .getByRole("button", {
            name: invoiceCopy.scopedT(locale).t("post.titleShort"),
            exact: true,
          })
          .filter({ visible: true })
          .last()
          .click();
        await page.waitForURL((url) =>
          url.pathname.endsWith("/tools/payment/invoice/create/POST"),
        );
        await page
          .getByText(invoiceCopy.scopedT(locale).t("post.widget.draftHint"), {
            exact: true,
          })
          .waitFor();
      },
      170000,
    );
  }
});
