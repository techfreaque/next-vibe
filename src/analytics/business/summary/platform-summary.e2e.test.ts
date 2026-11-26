import { atlasRequest } from "next-vibe/tooling/testing/e2e/atlas-request";
import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";
import { z } from "zod";

import overview from "../overview/definition";
import { scopedTranslation } from "../overview/i18n";
import definition from "./definition";

describe("Platform summary", () => {
  const e2e = useE2E("analytics/platform-summary");
  e2e.it(
    "uses the same reporting window and amounts as the source reports and opens its acquisition drilldown",
    async (fixtures) => {
      const { page, gotoReady } = fixtures;
      const headers = await authAtlas(fixtures, await resolveTestAdminUser());
      const http = atlasRequest(headers.authorization.slice("Bearer ".length));
      const api = "/api/" + E2E_LOCALE + "/analytics/business/";
      const projection = await http.get(api + "summary");
      expect(projection.ok).toBe(true);
      const summary = z
        .object({
          success: z.literal(true),
          data: definition.GET.responseSchema,
        })
        .parse(await projection.json()).data.summary;
      for (const [section, count] of [
        ["acquisition", 2],
        ["money", 2],
        ["operations", 0],
      ] as const) {
        const part = await http.get(api + "summary", { params: { section } });
        expect(part.ok).toBe(true);
        const body = z
          .object({
            success: z.literal(true),
            data: definition.GET.responseSchema,
          })
          .parse(await part.json());
        expect(body.data.summary.kpis).toHaveLength(count);
        for (const tile of body.data.summary.kpis) {
          expect(tile).toEqual(
            summary.kpis.find((metric) => metric.label === tile.label),
          );
        }
        if (section === "operations") {
          expect(body.data.summary.attention).toEqual(summary.attention);
        }
      }
      const raw = await http.get(api + "overview");
      const report = z
        .object({ success: z.literal(true), data: overview.GET.responseSchema })
        .parse(await raw.json()).data;
      expect(summary.from).toBe(report.window.from.slice(0, 10));
      expect(summary.to).toBe(report.window.to.slice(0, 10));
      const revenue = summary.kpis.find(
        (k) => k.label === "get.widget.kpi.revenue",
      );
      expect(revenue?.value).toBe(report.money?.kpis.revenueUsd.value ?? null);
      expect(revenue?.currency).toBe("USD");
      const acquisition = report.acquisition;
      const money = report.money;
      expect(acquisition).toBeTruthy();
      expect(money).toBeTruthy();
      if (acquisition && money) {
        const compare = [
          {
            label: "get.widget.kpi.humanLeads",
            kpi: acquisition.kpis.humanLeads,
            trend: acquisition.trend.series.find((s) => s.key === "leads")
              ?.values,
          },
          {
            label: "get.widget.kpi.signups",
            kpi: acquisition.kpis.signups,
            trend: acquisition.trend.series.find((s) => s.key === "signups")
              ?.values,
          },
          {
            label: "get.widget.kpi.revenue",
            kpi: money.kpis.revenueUsd,
            trend: money.trend.series.find((s) => s.key === "revenueUsd")
              ?.values,
          },
        ];
        const payerTile = summary.kpis.find(
          (metric) => metric.label === "get.widget.kpi.payers",
        );
        expect(payerTile?.value).toBe(money.kpis.payingCustomers.value);
        expect(payerTile?.previous).toBe(money.kpis.payingCustomers.previous);
        expect(payerTile?.sparkline).toHaveLength(money.trend.buckets.length);
        for (const expected of compare) {
          const actual = summary.kpis.find(
            (metric) => metric.label === expected.label,
          );
          expect(actual?.value).toBe(expected.kpi.value);
          expect(actual?.previous).toBe(expected.kpi.previous);
          expect(actual?.sparkline).toEqual(expected.trend);
        }
      }
      expect(summary.attentionAvailable).toBe(report.ops !== null);
      const { t } = scopedTranslation.scopedT(E2E_LOCALE);
      const leads = page.getByRole("button", {
        name: new RegExp(String(t("get.widget.kpi.humanLeads"))),
      });
      await gotoReady("/tools/platform-summary", () => leads.first().waitFor());
      const destination = page.waitForResponse(
        (response) =>
          response.request().method() === "GET" &&
          response.url().includes("/leads/analytics/acquisition"),
      );
      await leads.first().click();
      expect((await destination).ok()).toBe(true);
    },
  );
  e2e.it(
    "renders independent home metrics and recovers a timed-out revenue query on retry",
    async (fixtures) => {
      const { page, gotoReady } = fixtures;
      await authAtlas(fixtures, await resolveTestAdminUser());
      const { t } = scopedTranslation.scopedT(E2E_LOCALE);
      let paused = true;
      let moneyRequests = 0;
      let held: import("playwright").Route | undefined;
      fixtures.cleanup(async () => {
        await held?.abort().catch(() => undefined);
      });
      await page.route("**/analytics/business/summary?**", async (route) => {
        const section = new URL(route.request().url()).searchParams.get(
          "section",
        );
        if (section === "money") {
          moneyRequests++;
          if (paused) {
            held = route;
            return;
          }
        }
        await route.continue();
      });
      const leads = page
        .getByRole("button", {
          name: new RegExp(String(t("get.widget.kpi.humanLeads"))),
        })
        .filter({ visible: true })
        .first();
      await gotoReady("/tools", () => leads.waitFor({ timeout: 20000 }));
      const retry = page
        .getByRole("button", { name: t("platformSummary.retry"), exact: true })
        .filter({ visible: true })
        .first();
      await retry.waitFor({ timeout: 20000 });
      for (const key of [
        "get.widget.kpi.payers",
        "get.widget.kpi.revenue",
      ] as const) {
        const card = page
          .locator('[aria-live="polite"][aria-busy="false"]')
          .filter({
            has: page.getByText(t(key), { exact: true }),
          })
          .filter({ visible: true });
        expect(
          await card
            .getByRole("button", { name: t("platformSummary.retry") })
            .count(),
        ).toBe(1);
      }
      expect(moneyRequests).toBeGreaterThan(0);
      paused = false;
      const ready = page.waitForResponse(
        (r) =>
          r.request().method() === "GET" &&
          new URL(r.url()).pathname.endsWith("/analytics/business/summary") &&
          new URL(r.url()).searchParams.get("section") === "money",
      );
      await retry.click();
      expect((await ready).ok()).toBe(true);
      await held?.abort().catch(() => undefined);
      held = undefined;
      await page
        .getByRole("button", {
          name: new RegExp(String(t("get.widget.kpi.revenue"))),
        })
        .filter({ visible: true })
        .first()
        .waitFor();
      expect(moneyRequests).toBeGreaterThan(1);
    },
  );
});
