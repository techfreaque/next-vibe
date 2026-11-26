import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { GraphResolution } from "next-vibe/dataflow/enum";
import { scopedTranslation } from "next-vibe/dataflow/i18n";
import { users } from "next-vibe/identity/user/db";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  authAtlas,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { subscriptions } from "@/subscription/db";
import { SubscriptionPlan, SubscriptionStatus } from "@/subscription/enum";
import { paymentRefunds, paymentTransactions } from "../db";
import { PaymentProvider, PaymentStatus, RefundStatus } from "../enum";
import { RevenueSeriesProvider } from "./payments-revenue/enum";
import { scopedTranslation as revenueSeriesTranslation } from "./payments-revenue/i18n";

const seriesResponse = z.object({
  success: z.literal(true),
  data: z.object({
    result: z.array(z.object({ value: z.number() })),
    meta: z.object({ actualResolution: z.string() }),
  }),
});

describe("Payment and subscription chart amounts", () => {
  const e2e = useE2E("payment/data-source-amounts");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(
      "shows the selected period and denominated amounts in " + locale,
      async (fixtures) => {
        const { page } = fixtures;
        await authAtlas(fixtures, await resolveTestAdminUser());
        const userId = randomUUID();
        const transactionId = randomUUID();
        fixtures.cleanup(async () => {
          await db.delete(users).where(eq(users.id, userId));
          expect(
            await db
              .select({ id: users.id })
              .from(users)
              .where(eq(users.id, userId)),
          ).toEqual([]);
        });
        const clock = new Date("1985-06-11T18:00:00Z");
        const createdAt = new Date("1985-06-11T12:00:00Z");
        await db.insert(users).values({
          id: userId,
          email: userId + "@payment-series.test",
          publicName: "E2E payment chart",
          privateName: "E2E payment chart",
          locale,
          password: "disabled",
        });
        await db.insert(subscriptions).values({
          userId,
          status: SubscriptionStatus.ACTIVE,
          planId: SubscriptionPlan.SUBSCRIPTION,
          createdAt,
          endedAt: new Date("1985-06-12T11:00:00Z"),
        });
        await db.insert(paymentTransactions).values(
          [
            { id: transactionId, amount: "36.50", createdAt },
            {
              id: randomUUID(),
              amount: "499.75",
              createdAt: new Date("1985-06-11T19:00:00Z"),
            },
          ].map((row) => ({
            ...row,
            userId,
            provider: PaymentProvider.STRIPE,
            currency: "USD" as const,
            status: PaymentStatus.SUCCEEDED,
            metadata: { type: "subscription" },
          })),
        );
        await db.insert(paymentRefunds).values({
          transactionId,
          userId,
          amount: "4.50",
          currency: "USD",
          createdAt,
          providerRefundId: randomUUID(),
          status: RefundStatus.SUCCEEDED,
        });
        await page.clock.setFixedTime(clock);
        const { t } = scopedTranslation.scopedT(locale);
        const sources = [
          { alias: "payments-revenue", amount: 36.5, money: true },
          { alias: "payments-refund-volume", amount: 4.5, money: true },
          { alias: "subscriptions-mrr", amount: 36.5, money: true },
          { alias: "payments-count", amount: 1, money: false },
          { alias: "payments-refund-count", amount: 1, money: false },
          { alias: "subscriptions-active", amount: 1, money: false },
        ];
        for (const { alias, amount, money } of sources) {
          await fixtures.goto("/tools/" + alias, locale);
          const display = money
            ? formatMoney(amount, "USD", locale)
            : String(amount);
          const latest = page
            .getByText(display, { exact: true })
            .filter({ visible: true })
            .first();
          await latest.waitFor({ timeout: 45_000 });
          const interval = page.getByRole("combobox", {
            name: t("dataSourceWidget.interval"),
          });
          await interval.click();
          const [response] = await Promise.all([
            page.waitForResponse(
              (reply) =>
                new URL(reply.url()).pathname.endsWith(
                  "/data-sources/" + alias,
                ) &&
                reply.request().method() === "POST" &&
                z
                  .object({ resolution: z.literal(GraphResolution.ONE_WEEK) })
                  .safeParse(reply.request().postDataJSON()).success,
            ),
            page
              .getByRole("option", {
                name: t(GraphResolution.ONE_WEEK),
                exact: true,
              })
              .click(),
          ]);
          expect(response.status()).toBe(200);
          const { data } = seriesResponse.parse(await response.json());
          expect(data.meta.actualResolution).toBe(GraphResolution.ONE_WEEK);
          expect(data.result.at(-1)?.value).toBe(amount);
          await latest.waitFor();
          await saveAdminViewMatrix(
            page,
            "analytics",
            alias + "-weekly-" + locale.slice(0, 2),
          );
          if (alias === "payments-revenue") {
            await page
              .getByRole("button", {
                name: t("dataSourceWidget.filters"),
                exact: true,
              })
              .click();
            await page
              .locator('[data-field="provider"]')
              .getByRole("combobox")
              .click();
            const sourceT = revenueSeriesTranslation.scopedT(locale).t;
            await page
              .getByRole("option", {
                name: sourceT(RevenueSeriesProvider.NOWPAYMENTS),
                exact: true,
              })
              .click();
            const [filtered] = await Promise.all([
              page.waitForResponse(
                (reply) =>
                  reply.request().method() === "POST" &&
                  new URL(reply.url()).pathname.endsWith(
                    "/data-sources/payments-revenue",
                  ) &&
                  z
                    .object({
                      provider: z.literal(RevenueSeriesProvider.NOWPAYMENTS),
                    })
                    .safeParse(reply.request().postDataJSON()).success,
              ),
              page
                .getByRole("button", {
                  name: t("dataSourceWidget.applyFilters"),
                  exact: true,
                })
                .click(),
            ]);
            const excluded = seriesResponse.parse(await filtered.json());
            expect(
              excluded.data.result.every((point) => point.value === 0),
            ).toBe(true);
            await page
              .getByText(formatMoney(0, "USD", locale), { exact: true })
              .first()
              .waitFor();
            await saveAdminViewMatrix(
              page,
              "analytics",
              alias + "-provider-filter-" + locale.slice(0, 2),
            );
          }
        }
      },
      270000,
    );
  }
});
