import { randomUUID } from "node:crypto";
import { inArray } from "drizzle-orm";
import { db } from "next-vibe/database";
import { GraphResolution } from "next-vibe/dataflow/enum";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { userRoles, users } from "next-vibe/identity/user/db";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { AnalyticsRange } from "next-vibe/unified-ui/analytics/enum";
import { resolveAnalyticsWindow } from "next-vibe/unified-ui/analytics/window";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  authAtlas,
  getAtlasFixture,
  postAtlas,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { paymentRefunds, paymentTransactions } from "../../db";
import { PaymentProvider, PaymentStatus, RefundStatus } from "../../enum";
import source from "../../data-sources/payments-revenue/definition";
import report from "./definition";
import { scopedTranslation } from "./i18n";
import { RevenueReportRepository } from "./repository";

describe("Operating revenue audience", () => {
  const e2e = useE2E("payment/analytics/operating-revenue");
  e2e.it(
    "separates processor tests, disposable customers and admin payments in the report and chart",
    async (fixture) => {
      const { page, baseUrl } = fixture;
      const headers = await authAtlas(fixture, await resolveTestAdminUser());
      const human = randomUUID(),
        staff = randomUUID(),
        reserved = randomUUID();
      const ids = [human, staff, reserved];
      fixture.cleanup(async () => {
        await db.delete(userRoles).where(inArray(userRoles.userId, ids));
        await db.delete(users).where(inArray(users.id, ids));
      });
      await db.insert(users).values(
        ids.map((id) => ({
          id,
          email:
            id + (id === reserved ? "@example.com" : "@reporting-fixture.test"),
          publicName: "Reporting fixture",
          privateName: "Reporting fixture",
          password: "disabled",
          locale: "en-US" as const,
        })),
      );
      await db
        .insert(userRoles)
        .values({ userId: staff, role: UserPermissionRole.ADMIN });
      const day = "1998-06-19";
      const createdAt = new Date(day + "T12:00:00Z");
      const accepted = randomUUID();
      const sandbox = randomUUID();
      await db.insert(paymentTransactions).values(
        [
          { id: accepted, userId: human, amount: "79.25" },
          {
            id: sandbox,
            userId: human,
            amount: "887.50",
            providerSessionId: "cs_test_" + sandbox,
          },
          {
            userId: human,
            amount: "401.50",
            metadata: { type: "accounting_fixture" },
          },
          { userId: reserved, amount: "260.00" },
          { userId: staff, amount: "12.00" },
        ].map((row) => ({
          ...row,
          currency: "USD" as const,
          provider: PaymentProvider.STRIPE,
          status: PaymentStatus.SUCCEEDED,
          createdAt,
        })),
      );
      await db.insert(paymentRefunds).values(
        [
          { transactionId: accepted, amount: "4.25" },
          { transactionId: sandbox, amount: "59.00" },
        ].map((row) => ({
          ...row,
          userId: human,
          providerRefundId: randomUUID(),
          status: RefundStatus.SUCCEEDED,
          currency: "USD" as const,
          createdAt,
        })),
      );
      const params = { range: AnalyticsRange.CUSTOM, from: day, to: day };
      const reportUrl = baseUrl + "/api/en-US/payment/analytics/revenue";
      const body = z.object({
        success: z.literal(true),
        data: report.GET.responseSchema,
      });
      const transactionReport = await getAtlasFixture(
        reportUrl,
        params,
        headers,
      );
      const data = body.parse(await transactionReport.json()).data;
      expect(data.kpis.grossRevenueUsd.value).toBe(79.25);
      const headline = await RevenueReportRepository.headline(
        resolveAnalyticsWindow(params),
      );
      const settlement = await RevenueReportRepository.headline(
        resolveAnalyticsWindow(params),
        true,
      );
      expect(settlement.refundsUsd).toEqual(data.kpis.refundsUsd);
      expect(settlement.netRevenueUsd).toEqual(data.kpis.netRevenueUsd);
      expect(settlement.refundsUsd?.value).toBe(4.25);
      expect(settlement.netRevenueUsd?.value).toBe(75);
      expect(headline.revenueUsd).toEqual(data.kpis.grossRevenueUsd);
      expect(headline.payingCustomers).toEqual(data.kpis.payingCustomers);
      expect(headline.revenueTrend).toEqual([79.25]);
      expect(headline.payingCustomersTrend).toEqual([1]);
      expect(data.kpis.netRevenueUsd.value).toBe(75);
      expect(data.kpis.payingCustomers.value).toBe(1);
      expect(data.recentPayments.map((payment) => payment.id)).toEqual([
        accepted,
      ]);
      const chart = await postAtlas(
        fixture,
        "payment/data-sources/payments-revenue",
        {
          resolution: GraphResolution.ONE_DAY,
          range: { from: day + "T00:00:00Z", to: day + "T23:59:59Z" },
        },
      );
      const points = z
        .object({ success: z.literal(true), data: source.POST.responseSchema })
        .parse(await chart.json());
      expect(points.data.result.map((point) => point.value)).toEqual([79.25]);
      const { t } = scopedTranslation.scopedT("en-US");
      const gross = page.getByText("$79.25", { exact: true }).first();
      await fixture.gotoReady(
        "/tools/revenue-report?" + new URLSearchParams(params).toString(),
        () => gross.waitFor(),
      );
      const admins = page.getByRole("button", {
        name: t("widget.includeInternal"),
        exact: true,
      });
      await admins.waitFor();
      const changed = page.waitForResponse(
        (reply) =>
          reply.request().method() === "GET" &&
          new URL(reply.url()).pathname.endsWith(
            "/payment/analytics/revenue",
          ) &&
          reply.url().includes("includeInternal=true"),
      );
      await admins.click();
      const included = body.parse(await (await changed).json()).data;
      expect(included.kpis.grossRevenueUsd.value).toBe(91.25);
      expect(included.kpis.netRevenueUsd.value).toBe(87);
      expect(included.recentPayments).toHaveLength(2);
      await page.getByText("$91.25", { exact: true }).first().waitFor();
      await saveAdminViewMatrix(
        page,
        "payments",
        "operating-revenue-verified-en",
      );
      // One customer can pay through two processors on the same day.
      await db.insert(paymentTransactions).values({
        userId: human,
        amount: "2.00",
        currency: "USD",
        provider: PaymentProvider.NOWPAYMENTS,
        status: PaymentStatus.SUCCEEDED,
        createdAt,
      });
      const repeated = await RevenueReportRepository.headline(
        resolveAnalyticsWindow(params),
      );
      expect(repeated.payingCustomersTrend).toEqual([1]);
      expect(repeated.revenueTrend).toEqual([81.25]);
    },
    150000,
  );
});
