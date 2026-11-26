import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";

import { and, eq, like } from "drizzle-orm";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
import { AnalyticsRange } from "next-vibe/unified-ui/analytics/enum";
import type { Response } from "playwright";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  authAtlas,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { paymentRefunds, paymentTransactions } from "../../db";
import { PaymentProvider, PaymentStatus, RefundStatus } from "../../enum";
import { scopedTranslation } from "./i18n";

const responseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    kpis: z.object({
      grossRevenueUsd: z.object({
        value: z.number(),
        previous: z.number().nullable(),
      }),
      netRevenueUsd: z.object({ value: z.number() }),
    }),
    revenueByKind: z.object({
      series: z.array(z.object({ values: z.array(z.number()) })),
    }),
  }),
});

describe("Revenue money presentation on Atlas", () => {
  const e2e = useE2E("payment/revenue-presentation");
  e2e.it(
    "matches the real revenue KPI, comparison and legend amounts",
    async ({ gotoReady, loginAs, page }) => {
      await loginAs(await resolveTestAdminUser());
      const { t } = scopedTranslation.scopedT(E2E_LOCALE);
      const usd = new Intl.NumberFormat(E2E_LOCALE, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const grossLabel = page
        .getByText(String(t("widget.kpi.grossRevenueUsd")), { exact: true })
        .first();
      const response = page.waitForResponse(
        (reply) =>
          reply.ok() &&
          new URL(reply.url()).pathname.endsWith("/payment/analytics/revenue"),
        { timeout: 60_000 },
      );
      await gotoReady("/tools?cat=payments", () => grossLabel.waitFor());
      const result = responseSchema.safeParse(await (await response).json());
      expect(result.success).toBe(true);
      if (!result.success) {
        return;
      }
      const { grossRevenueUsd, netRevenueUsd } = result.data.data.kpis;
      const gross = page
        .getByText(usd.format(grossRevenueUsd.value), { exact: true })
        .first();
      await gross.waitFor();
      await page
        .getByText(usd.format(netRevenueUsd.value), { exact: true })
        .first()
        .waitFor();
      if (grossRevenueUsd.previous !== null && grossRevenueUsd.previous !== 0) {
        const comparison = String(
          t("analytics.chart.vsValue", {
            value: usd.format(grossRevenueUsd.previous),
          }),
        );
        await page.getByText(comparison, { exact: true }).first().waitFor();
      }
      const series = result.data.data.revenueByKind.series.find(({ values }) =>
        values.some((value) => value > 0),
      );
      if (series) {
        const total = series.values.reduce((sum, value) => sum + value, 0);
        await page
          .getByRole("button")
          .filter({ hasText: usd.format(total) })
          .first()
          .waitFor();
      }

      if (process.env["REVENUE_PRESENTATION_SHOTS"] === "1") {
        const root = "scratchpad/erp/shots/v2/payments";
        await mkdir(root, { recursive: true });
        const theme = (await page.locator("html.dark").count())
          ? "dark"
          : "light";
        await page.screenshot({
          path: `${root}/payment-landing-precision-en-desktop-${theme}.png`,
        });
        await page.setViewportSize({ width: 390, height: 844 });
        await gross.waitFor();
        await page.screenshot({
          path: `${root}/payment-landing-precision-en-phone-${theme}.png`,
        });
      }
    },
  );
});

describe("Authenticated operating revenue filters", () => {
  const e2e = useE2E("operating-revenue-mobile-presentation");
  e2e.it(
    "shows historical revenue above the fold with keyboard-accessible filters",
    async (fixtures) => {
      const { page, baseUrl } = fixtures;
      await authAtlas(fixtures, await resolveTestAdminUser());
      const fixtureName = "Disposable revenue fixture";
      // A terminated browser run can leave its own historical test rows behind.
      await db
        .delete(users)
        .where(
          and(
            eq(users.publicName, fixtureName),
            eq(users.privateName, fixtureName),
            like(users.email, "%@reporting-fixture.test"),
            eq(users.password, "disabled"),
          ),
        );
      const buyerId = randomUUID();
      const acceptedId = randomUUID();
      fixtures.cleanup(async () => {
        await db.delete(users).where(eq(users.id, buyerId));
        expect(
          await db
            .select({ id: paymentTransactions.id })
            .from(paymentTransactions)
            .where(eq(paymentTransactions.userId, buyerId)),
        ).toEqual([]);
      });
      await db.insert(users).values({
        id: buyerId,
        email: `${buyerId}@reporting-fixture.test`,
        publicName: fixtureName,
        privateName: fixtureName,
        password: "disabled",
        locale: "en-US",
      });
      const day = "1998-07-19";
      const previous = "1998-07-18";
      await db.insert(paymentTransactions).values([
        {
          id: acceptedId,
          userId: buyerId,
          createdAt: new Date(day + "T12:00:00Z"),
          currency: "USD",
          amount: "153.27",
          status: PaymentStatus.SUCCEEDED,
          provider: PaymentProvider.STRIPE,
        },
        {
          userId: buyerId,
          createdAt: new Date(previous + "T12:00:00Z"),
          currency: "USD",
          amount: "39.11",
          status: PaymentStatus.SUCCEEDED,
          provider: PaymentProvider.STRIPE,
        },
      ]);
      await db.insert(paymentRefunds).values({
        transactionId: acceptedId,
        amount: "5.25",
        currency: "USD",
        userId: buyerId,
        providerRefundId: randomUUID(),
        status: RefundStatus.SUCCEEDED,
        createdAt: new Date(day + "T13:00:00Z"),
      });

      for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
        const { t } = scopedTranslation.scopedT(locale);
        const usd = new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        const url = new URL(`/${locale}/tools/revenue-report`, baseUrl);
        url.search = new URLSearchParams({
          range: AnalyticsRange.CUSTOM,
          from: day,
          to: day,
        }).toString();
        await page.setViewportSize({ width: 390, height: 844 });
        const reportRead = (currency?: string): Promise<Response> =>
          page.waitForResponse(
            (reply) => {
              const endpoint = new URL(reply.url());
              return (
                reply.ok() &&
                endpoint.pathname.endsWith("/payment/analytics/revenue") &&
                endpoint.searchParams.get("from") === day &&
                (!currency ||
                  endpoint.searchParams.get("currency") === currency)
              );
            },
            { timeout: 60_000 },
          );
        const loaded = reportRead().catch(() => null);
        let navigation = await page.goto(url.toString(), {
          waitUntil: "commit",
          timeout: 60_000,
        });
        if (navigation && navigation.status() >= 500) {
          navigation = await page.goto(url.toString(), {
            waitUntil: "commit",
            timeout: 60_000,
          });
        }
        expect(navigation?.ok()).toBe(true);
        const received = await loaded;
        if (!received) {
          expect.fail(
            "The selected historical revenue request did not complete",
          );
        }
        const { data } = responseSchema.parse(await received.json());
        expect(data.kpis).toMatchObject({
          grossRevenueUsd: { value: 153.27, previous: 39.11 },
          netRevenueUsd: { value: 148.02 },
        });
        await page
          .getByRole("heading", {
            name: t("widget.operatingTitle"),
            exact: true,
          })
          .waitFor();
        await page
          .getByText(t("widget.currencyBasis"), { exact: true })
          .waitFor();
        await page
          .getByText(usd.format(153.27), { exact: true })
          .first()
          .waitFor();
        await page
          .getByText(usd.format(148.02), { exact: true })
          .first()
          .waitFor();
        await page
          .getByText(
            t("analytics.chart.vsValue", { value: usd.format(39.11) }),
            { exact: true },
          )
          .first()
          .waitFor();
        await page
          .getByText(formatDocDate(day, locale), { exact: true })
          .first()
          .waitFor();
        await page
          .getByText(
            t("analytics.chart.comparedTo", {
              period: formatDocDate(previous, locale),
            }),
            { exact: true },
          )
          .first()
          .waitFor();

        const filters = page.getByRole("button", {
          name: t("widget.filterDisclosure"),
          exact: true,
        });
        expect(await filters.getAttribute("aria-expanded")).toBe("false");
        const gross = page
          .getByText(t("widget.kpi.grossRevenueUsd"), { exact: true })
          .first();
        expect((await gross.boundingBox())?.y ?? 844).toBeLessThan(844);
        const internal = page.getByRole("button", {
          name: t("widget.includeInternal"),
          exact: true,
        });
        expect(await internal.count()).toBe(0);
        await filters.focus();
        await page.keyboard.press("Enter");
        expect(await filters.getAttribute("aria-expanded")).toBe("true");
        const currency = page.getByRole("radiogroup", {
          name: t("widget.filter.currency"),
          exact: true,
        });
        await currency.waitFor();
        await internal.waitFor();
        const filtered = reportRead("USD");
        await currency.getByRole("radio", { name: "USD", exact: true }).click();
        const updated = responseSchema.parse(await (await filtered).json());
        expect(updated.data.kpis.grossRevenueUsd.value).toBe(153.27);
        await filters.click();
        expect(await filters.getAttribute("aria-expanded")).toBe("false");
        await page
          .getByText(`${t("widget.filter.currency")}: USD`, { exact: true })
          .waitFor();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        ).toBe(true);
        if (process.env["REVENUE_PRESENTATION_SHOTS"] === "1") {
          await saveAdminViewMatrix(
            page,
            "payments",
            `operating-revenue-compact-${locale}`,
          );
        }
      }
    },
    180_000,
  );
});
