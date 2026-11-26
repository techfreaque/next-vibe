import { randomUUID } from "node:crypto";

import { and, eq } from "drizzle-orm";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import type { Route } from "playwright";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  authAtlas,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { creditPacks, creditWallets } from "@/credits/db";
import { CreditPackType } from "@/credits/enum";
import { paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";

import { scopedTranslation as overviewTranslation } from "../admin/overview/i18n";
import { queryPartnerBalances } from "../analytics/queries";
import {
  payoutRequests,
  referralCodes,
  referralEarnings,
  userReferrals,
} from "../db";
import { PayoutCurrency, PayoutStatus, ReferralEarningStatus } from "../enum";
import { scopedTranslation } from "../i18n";
import definitions from "./definition";

describe("Authenticated referral statistics", () => {
  const e2e = useE2E("referral-personal-stats");

  e2e.it(
    "reports measured purchases and spendable earned credits, and opens the program overview",
    async (fixtures) => {
      const { baseUrl, page } = fixtures;
      const account = await createTestUser(
        fixtures.uniqueEmail("referral-admin"),
        "Referral stats fixture",
      );
      if (!account.success) {
        expect.fail(account.message);
      }
      const userId = account.data.user.id;
      fixtures.cleanup(async () => {
        await deleteTestUser(userId);
      });
      const buyer = await createTestUser(
        fixtures.uniqueEmail("referral-buyer"),
        "Referral buyer fixture",
      );
      if (!buyer.success) {
        expect.fail(buyer.message);
      }
      const buyerId = buyer.data.user.id;
      fixtures.cleanup(async () => {
        await deleteTestUser(buyerId);
      });
      await db.insert(userRoles).values({ userId, role: UserRole.ADMIN });
      await authAtlas(fixtures, {
        ...account.data.user,
        roles: [...account.data.user.roles, UserRole.ADMIN],
      });
      const [code] = await db
        .insert(referralCodes)
        .values({
          code: `STATS-${randomUUID()}`,
          ownerUserId: userId,
          label: "Stats test code",
        })
        .returning({ id: referralCodes.id });
      await db.insert(userReferrals).values({
        referrerUserId: userId,
        referredUserId: buyerId,
        referralCodeId: code.id,
      });
      const measuredId = randomUUID();
      const legacyId = randomUUID();
      const canceledId = randomUUID();
      const partialId = randomUUID();
      const payments = [
        { id: measuredId, amount: "123.45", currency: "USD" },
        { id: legacyId, amount: "25.00", currency: "EUR" },
        { id: canceledId, amount: "999.99", currency: "USD" },
        { id: partialId, amount: "25.00", currency: "USD" },
      ] satisfies Pick<
        typeof paymentTransactions.$inferInsert,
        "id" | "amount" | "currency"
      >[];
      await db.insert(paymentTransactions).values(
        payments.map((row) => ({
          ...row,
          userId: buyerId,
          providerSessionId: `test-referral-stats-${row.id}`,
          status: PaymentStatus.SUCCEEDED,
        })),
      );
      const standard = {
        earnerUserId: userId,
        sourceUserId: buyerId,
        currency: PayoutCurrency.CREDITS,
        status: ReferralEarningStatus.CONFIRMED,
        level: 0,
      };
      await db.insert(referralEarnings).values([
        {
          ...standard,
          transactionId: measuredId,
          baseAmountUsdCents: 12345,
          amountCents: 1700,
        },
        {
          ...standard,
          transactionId: measuredId,
          baseAmountUsdCents: 12345,
          amountCents: 300,
          level: 1,
        },
        {
          ...standard,
          transactionId: legacyId,
          baseCredits: 3000,
          amountCents: 500,
          currency: "EUR",
        },
        {
          ...standard,
          transactionId: canceledId,
          baseAmountUsdCents: 99999,
          amountCents: 800,
          status: ReferralEarningStatus.CANCELED,
        },
        {
          ...standard,
          transactionId: partialId,
          baseAmountUsdCents: 2500,
          amountCents: 300,
          originalAmountCents: 600,
          status: ReferralEarningStatus.PENDING,
        },
        {
          ...standard,
          earnerUserId: buyerId,
          sourceUserId: userId,
          transactionId: legacyId,
          amountCents: 4000,
        },
      ]);
      await db
        .insert(creditWallets)
        .values({ userId, freeCreditsRemaining: 0 })
        .onConflictDoNothing();
      const [wallet] = await db
        .select({ id: creditWallets.id })
        .from(creditWallets)
        .where(eq(creditWallets.userId, userId));
      await db.insert(creditPacks).values([
        {
          walletId: wallet.id,
          originalAmount: 2000,
          remaining: 1250,
          type: CreditPackType.EARNED,
        },
        {
          walletId: wallet.id,
          originalAmount: 900,
          remaining: 900,
          type: CreditPackType.BONUS,
        },
      ]);
      await db.insert(payoutRequests).values(
        [
          { amountCents: 300, status: PayoutStatus.PENDING },
          { amountCents: 100, status: PayoutStatus.APPROVED },
          { amountCents: 50, status: PayoutStatus.PROCESSING },
          { amountCents: 900, status: PayoutStatus.COMPLETED },
        ].map((row) => ({ ...row, userId, currency: PayoutCurrency.USDC })),
      );

      const read = () =>
        page.goto(`${baseUrl}/api/en-US/referral/stats`, {
          waitUntil: "domcontentloaded",
          timeout: 60_000,
        });
      const response = await read();
      if (!response?.ok()) {
        expect.fail(
          `Stats request returned ${response?.status() ?? "no response"}`,
        );
      }
      const schema = z.object({
        success: z.literal(true),
        data: definitions.GET.responseSchema,
      });
      expect(schema.parse(await response.json()).data).toMatchObject({
        totalSignupsValue: 1,
        totalRevenueValue: 14845,
        totalRevenueMeasuredPurchases: 2,
        totalRevenuePurchaseCount: 3,
        totalEarnedValue: 2300,
        availableCreditsValue: 800,
        availableCreditsReadyForPayout: false,
      });
      const balances = await queryPartnerBalances([userId, buyerId]);
      expect(balances.get(userId)).toMatchObject({
        availableCents: 1250,
        freeCents: 800,
        openPayoutCents: 450,
      });
      expect(balances.get(buyerId)).toMatchObject({
        availableCents: 0,
        freeCents: 0,
      });

      for (const locale of ["de-DE", "sk-SK", "en-US"] as const) {
        const { t } = scopedTranslation.scopedT(locale);
        const url = `${baseUrl}/${locale}/tools/${endpointToUrlSegment(definitions.GET)}`;
        const navigationResponse = await page.goto(url, {
          waitUntil: "domcontentloaded",
        });
        expect(navigationResponse?.ok()).toBe(true);
        await page
          .getByText(
            t("stats.widget.revenueCoverage", { measured: "2", total: "3" }),
            { exact: true },
          )
          .waitFor();
        await page
          .getByText(t("stats.widget.walletUnits", { amount: "800" }), {
            exact: true,
          })
          .waitFor();
        const revenue = new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "USD",
        }).format(148.45);
        await page.getByText(revenue, { exact: true }).waitFor();
        await page.setViewportSize({ width: 390, height: 844 });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        ).toBe(true);
        if (process.env["REFERRAL_STATS_SHOTS"] === "1") {
          await saveAdminViewMatrix(page, "referral-personal-stats", locale);
        }
        if (locale === "en-US") {
          const overview = page.waitForResponse(
            (reply) =>
              reply.ok() &&
              new URL(reply.url()).pathname.endsWith(
                "/referral/admin/overview",
              ),
          );
          await page
            .getByRole("button", {
              name: t("stats.widget.openOverview"),
              exact: true,
            })
            .click();
          await overview;
          const { t: overviewT } = overviewTranslation.scopedT(locale);
          await page
            .getByText(overviewT("get.title"), { exact: true })
            .filter({ visible: true })
            .last()
            .waitFor();
        }
      }

      await db
        .update(referralEarnings)
        .set({ baseAmountUsdCents: null })
        .where(
          and(
            eq(referralEarnings.earnerUserId, userId),
            eq(referralEarnings.transactionId, measuredId),
          ),
        );
      await db
        .update(referralEarnings)
        .set({ baseAmountUsdCents: null })
        .where(eq(referralEarnings.transactionId, partialId));
      const legacy = await read();
      if (!legacy?.ok()) {
        expect.fail(
          `Legacy stats request returned ${legacy?.status() ?? "no response"}`,
        );
      }
      expect(schema.parse(await legacy.json()).data).toMatchObject({
        totalRevenueValue: 0,
        totalRevenueMeasuredPurchases: 0,
        totalRevenuePurchaseCount: 3,
      });
      await page.goto(
        `${baseUrl}/en-US/tools/${endpointToUrlSegment(definitions.GET)}`,
      );
      const { t } = scopedTranslation.scopedT("en-US");
      await page
        .getByText(t("stats.widget.revenueUnavailable"), { exact: true })
        .waitFor();
    },
  );

  e2e.it(
    "shows delayed, failed and empty reads, and retries into the real empty state",
    async (fixtures) => {
      const { baseUrl, page } = fixtures;
      const account = await createTestUser(
        fixtures.uniqueEmail("empty-referral-admin"),
        "Empty referral fixture",
      );
      if (!account.success) {
        expect.fail(account.message);
      }
      const identity = account.data.user;
      fixtures.cleanup(async () => {
        await deleteTestUser(identity.id);
      });
      await db
        .insert(userRoles)
        .values({ userId: identity.id, role: UserRole.ADMIN });
      await authAtlas(fixtures, {
        ...identity,
        roles: [...identity.roles, UserRole.ADMIN],
      });

      const schema = z.object({
        success: z.literal(true),
        data: definitions.GET.responseSchema,
      });
      const capture = process.env["REFERRAL_STATS_STATE_SHOTS"] === "1";
      const locales = capture
        ? (["de-DE", "sk-SK", "en-US"] as const)
        : (["en-US"] as const);
      const failure = {
        status: 503,
        json: {
          success: false,
          message: "Disposable referral stats outage",
          errorType: { ...ErrorResponseTypes.UNKNOWN_ERROR, errorCode: 503 },
        },
      };
      await page.setViewportSize({ width: 390, height: 844 });
      for (const locale of locales) {
        const { t } = scopedTranslation.scopedT(locale);
        const api = `**/api/${locale}/referral/stats*`;
        const held = Promise.withResolvers<Route>();
        let holdNext = true;
        let unavailable = true;
        await page.route(api, async (route) => {
          if (holdNext) {
            holdNext = false;
            held.resolve(route);
            return;
          }
          if (unavailable) {
            await route.fulfill(failure);
            return;
          }
          await route.continue();
        });
        const url = `${baseUrl}/${locale}/tools/${endpointToUrlSegment(definitions.GET)}`;
        const navigation = await page.goto(url, {
          waitUntil: "domcontentloaded",
        });
        expect(navigation?.ok()).toBe(true);
        const loading = page.getByText(t("stats.widget.loading"), {
          exact: true,
        });
        await loading.waitFor();
        const heldRequest = await held.promise;
        if (capture) {
          await saveAdminViewMatrix(
            page,
            "referral-personal-stats",
            `loading-${locale}`,
          );
        }
        await heldRequest.fulfill(failure);
        const retry = page.getByRole("button", {
          name: t("stats.widget.retry"),
          exact: true,
        });
        await retry.waitFor();
        await page
          .getByRole("heading", {
            name: t("stats.widget.loadError"),
            exact: true,
          })
          .waitFor();
        if (capture) {
          await saveAdminViewMatrix(
            page,
            "referral-personal-stats",
            `error-${locale}`,
          );
        }
        unavailable = false;
        const recovered = page.waitForResponse(
          (reply) =>
            reply.ok() &&
            new URL(reply.url()).pathname.endsWith("/referral/stats"),
        );
        await retry.click();
        const data = schema.parse(await (await recovered).json()).data;
        expect(data).toMatchObject({
          totalSignupsValue: 0,
          totalRevenuePurchaseCount: 0,
          totalEarnedValue: 0,
          availableCreditsValue: 0,
        });
        await page
          .getByRole("heading", {
            name: t("stats.widget.emptyTitle"),
            exact: true,
          })
          .waitFor();
        const overview = page.getByRole("button", {
          name: t("stats.widget.openOverview"),
          exact: true,
        });
        await overview.waitFor();
        expect(
          await page
            .getByText(t("stats.fields.totalRevenue"), { exact: true })
            .count(),
        ).toBe(0);
        if (capture) {
          await saveAdminViewMatrix(
            page,
            "referral-personal-stats",
            `empty-${locale}`,
          );
        }
        await page.unroute(api);
        if (locale === "en-US") {
          const destination = page.waitForResponse(
            (reply) =>
              reply.ok() &&
              new URL(reply.url()).pathname.endsWith(
                "/referral/admin/overview",
              ),
          );
          await overview.click();
          await destination;
          await page.waitForURL((target) =>
            target.pathname.endsWith("/tools/referral-overview"),
          );
        }
      }
    },
  );
});
