import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import type { Route } from "playwright";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  authAtlas,
  postAtlas,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import creditsPurchased from "@/credits/data-sources/credits-purchased/definition";
import { CreditIssueKind } from "@/credits/data-sources/credits-purchased/enum";
import { creditTransactions, creditWallets } from "@/credits/db";
import { CreditTransactionType } from "@/credits/enum";
import { scopedTranslation as helpTranslation } from "@/vibe/help-tool/i18n";
import { GraphResolution } from "../enum";
import { scopedTranslation } from "../i18n";

describe("Admin data-source charts", () => {
  const e2e = useE2E("analytics/data-source-chart");
  e2e.it(
    "distinguishes a failed read from zero points and changes the period and grouping",
    async (fixtures) => {
      const { page } = fixtures;
      await authAtlas(fixtures, await resolveTestAdminUser());
      const id = randomUUID();
      const walletId = randomUUID();
      fixtures.cleanup(async () => {
        await db.delete(leads).where(eq(leads.id, id));
      });
      await db.insert(leads).values({
        id,
        businessName: "E2E Chart Cost Centre",
        country: "US",
        language: "en",
        status: LeadStatus.WEBSITE_USER,
        source: LeadSource.WEBSITE,
      });
      await db.insert(creditWallets).values({ id: walletId, leadId: id });
      const clock = new Date("2004-04-30T18:00:00.000Z");
      await page.clock.setFixedTime(clock);
      const dailyPurchases = [
        { day: "02", amount: 14 },
        { day: "07", amount: 26 },
        { day: "13", amount: 18 },
        { day: "20", amount: 35 },
        { day: "25", amount: 12 },
        { day: "30", amount: 31 },
      ];
      let balance = 0;
      await db.insert(creditTransactions).values(
        dailyPurchases.map(({ day, amount }) => {
          balance += amount;
          return {
            walletId,
            amount,
            balanceAfter: balance,
            type: CreditTransactionType.PURCHASE,
            metadata: { sessionId: randomUUID() },
            createdAt: new Date("2004-04-" + day + "T12:00:00Z"),
          };
        }),
      );
      const path = "credits/data-sources/credits-purchased";
      const result = await postAtlas(fixtures, path, {
        kind: CreditIssueKind.PAID,
        resolution: GraphResolution.ONE_DAY,
        range: { from: "2004-03-31T18:00:00.000Z", to: clock.toISOString() },
      });
      expect(result.status).toBe(200);
      const recorded = z
        .object({
          success: z.literal(true),
          data: creditsPurchased.POST.responseSchema,
        })
        .parse(await result.json());
      expect(
        recorded.data.result
          .filter((point) => point.value > 0)
          .map((point) => point.value),
      ).toEqual(dailyPurchases.map(({ amount }) => amount));
      for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
        const { t } = scopedTranslation.scopedT(locale);
        const retryLabel = helpTranslation.scopedT(locale).t("catalog.retry");
        const held = Promise.withResolvers<Route>();
        let firstRequest = true;
        let simulateEmpty = false;
        let latestGroup = "";
        await page.route(`**/api/${locale}/${path}*`, (route) => {
          const body = z
            .object({ resolution: z.string() })
            .safeParse(route.request().postDataJSON());
          latestGroup = body.success ? body.data.resolution : "";
          if (firstRequest) {
            firstRequest = false;
            held.resolve(route);
            return;
          }
          if (simulateEmpty) {
            return route.fulfill({
              json: { ...recorded, data: { ...recorded.data, result: [] } },
            });
          }
          return route.continue();
        });
        await fixtures.goto("/tools/credits-purchased", locale);
        const loading = page
          .getByText(t("dataSourceWidget.loading"), { exact: true })
          .filter({ visible: true })
          .first();
        const shellRetry = page
          .getByRole("button", { name: retryLabel, exact: true })
          .filter({ visible: true })
          .first();
        await loading.or(shellRetry).first().waitFor({ timeout: 40_000 });
        if (!(await loading.isVisible())) {
          await shellRetry.click();
          await loading.waitFor({ timeout: 40_000 });
        }
        const initialRequest = await held.promise;
        expect(initialRequest.request().method()).toBe("POST");
        await saveAdminViewMatrix(
          page,
          "analytics",
          "credit-chart-loading-" + locale.slice(0, 2),
        );
        await initialRequest.fulfill({
          status: 503,
          json: {
            success: false,
            message: t("dataSourceWidget.loadError"),
            errorType: {
              errorKey: "errorTypes.internal_error",
              errorCode: 503,
            },
          },
        });
        const retry = page
          .getByRole("button", { name: retryLabel, exact: true })
          .filter({ visible: true })
          .first();
        await retry.waitFor();
        expect(
          await page
            .getByText(t("dataSourceWidget.noData"), { exact: true })
            .count(),
        ).toBe(0);
        await saveAdminViewMatrix(
          page,
          "analytics",
          "credit-chart-error-" + locale.slice(0, 2),
        );
        await retry.click();
        await page
          .getByText("31", { exact: true })
          .filter({ visible: true })
          .first()
          .waitFor();
        const periodLabel = new Intl.DateTimeFormat(locale, {
          dateStyle: "medium",
          timeZone: "UTC",
        }).formatRange(new Date("2004-03-31T18:00:00.000Z"), clock);
        await page.getByText(periodLabel, { exact: true }).waitFor();
        await saveAdminViewMatrix(
          page,
          "analytics",
          "credit-chart-ready-" + locale.slice(0, 2),
        );
        await page
          .getByRole("combobox", { name: t("dataSourceWidget.period") })
          .click();
        await page
          .getByRole("option", {
            name: new Intl.NumberFormat(locale, {
              style: "unit",
              unit: "day",
              unitDisplay: "long",
            }).format(7),
            exact: true,
          })
          .click();
        simulateEmpty = true;
        await page
          .getByRole("combobox", { name: t("dataSourceWidget.interval") })
          .click();
        await page
          .getByRole("option", {
            name: t(GraphResolution.ONE_WEEK),
            exact: true,
          })
          .click();
        await page
          .getByText(t("dataSourceWidget.noData"), { exact: true })
          .filter({ visible: true })
          .first()
          .waitFor();
        expect(latestGroup).toBe(GraphResolution.ONE_WEEK);
        const expand = page.getByRole("button", {
          name: t("dataSourceWidget.expandPeriod", {
            period: new Intl.NumberFormat(locale, {
              style: "unit",
              unit: "day",
              unitDisplay: "long",
            }).format(30),
          }),
        });
        await expand.waitFor();
        await saveAdminViewMatrix(
          page,
          "analytics",
          "credit-chart-empty-" + locale.slice(0, 2),
        );
        simulateEmpty = false;
        const recovered = page.waitForResponse((reply) => {
          if (
            !reply.url().includes("/" + path) ||
            reply.request().method() !== "POST"
          ) {
            return false;
          }
          const request = z
            .object({
              resolution: z.string(),
              range: z.object({ from: z.string(), to: z.string() }),
            })
            .safeParse(reply.request().postDataJSON());
          return (
            request.success &&
            request.data.resolution === GraphResolution.ONE_WEEK &&
            Date.parse(request.data.range.to) -
              Date.parse(request.data.range.from) ===
              30 * 86_400_000
          );
        });
        await expand.click();
        const response = await recovered;
        expect(response.ok()).toBe(true);
        const range = z
          .object({ range: z.object({ from: z.string(), to: z.string() }) })
          .parse(response.request().postDataJSON()).range;
        expect(Date.parse(range.to) - Date.parse(range.from)).toBe(
          30 * 86_400_000,
        );
      }
    },
    190000,
  );
});
