/**
 * Yearly plans get their monthly credits every month (real DB):
 * - the daily task grants the current month once (tier credits, expiring at
 *   the month end) and never twice,
 * - month 1 belongs to the yearly invoice, so the task skips it,
 * - the backfill lists missed months on a dry run, grants them once as one
 *   pack, and a repeat adds nothing.
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { creditPacks, creditWallets } from "@/credits/db";
import { PaymentProvider } from "@/payment/enum";

import { subscriptions } from "../db";
import { BillingInterval, SubscriptionPlan, SubscriptionStatus } from "../enum";
import { scopedTranslation } from "./i18n";
import { YearlyCreditsRepository } from "./repository";
import { addUtcMonths } from "./slots";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);
const stamp = Date.now();
const now = new Date();
// Month 8 of the period: months 2..7 passed without a monthly grant
const periodStart = addUtcMonths(new Date(now.getTime() - 3 * 86_400_000), -7);
const periodEnd = addUtcMonths(periodStart, 12);

let starter: TestUser;
let pro: TestUser;

async function packTotal(userId: string, prefix: string): Promise<number> {
  const rows = await db
    .select({ amount: creditPacks.originalAmount })
    .from(creditPacks)
    .innerJoin(creditWallets, eq(creditPacks.walletId, creditWallets.id))
    .where(
      and(
        eq(creditWallets.userId, userId),
        sql`${creditPacks.metadata}->>'sessionId' LIKE ${`${prefix}%`}`,
      ),
    );
  return rows.reduce((sum, row) => sum + row.amount, 0);
}

describe("yearly plan monthly credits", () => {
  beforeAll(async () => {
    const a = await createTestUser(`yearly-starter-${stamp}@example.com`);
    const b = await createTestUser(`yearly-pro-${stamp}@example.com`);
    expect(a.success && b.success).toBe(true);
    if (!a.success || !b.success) {
      return;
    }
    starter = a.data;
    pro = b.data;
    for (const [user, plan] of [
      [starter, SubscriptionPlan.SUBSCRIPTION],
      [pro, SubscriptionPlan.PRO],
    ] as const) {
      await db.insert(subscriptions).values({
        userId: user.user.id,
        planId: plan,
        billingInterval: BillingInterval.YEARLY,
        status: SubscriptionStatus.ACTIVE,
        provider: PaymentProvider.STRIPE,
        providerSubscriptionId: `sub_test_yearly_${plan}_${stamp}`,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
      });
    }
  }, 60_000);

  afterAll(async () => {
    for (const user of [starter, pro]) {
      await db
        .delete(subscriptions)
        .where(eq(subscriptions.userId, user.user.id));
      await deleteTestUser(user.user.id);
    }
  }, 60_000);

  it("backfill dry run lists the missed months and grants nothing", async () => {
    const res = await YearlyCreditsRepository.backfill(
      true,
      logger,
      defaultLocale,
      t,
      now,
    );
    expect(res.success, JSON.stringify(res)).toBe(true);
    if (!res.success) {
      return;
    }
    const row = res.data.rows.find((r) => r.userEmail === starter.email);
    expect(row?.currentMonth).toBe(8);
    expect(row?.missedMonths).toBe(6);
    expect(row?.credits).toBe(6 * 800);
    expect(row?.status).toBe("pending");
    const proRow = res.data.rows.find((r) => r.userEmail === pro.email);
    expect(proRow?.credits).toBe(6 * 10_500);
    expect(await packTotal(starter.user.id, "yearly-backfill:")).toBe(0);
  });

  it("daily task grants this month once, at the tier's credits", async () => {
    const first = await YearlyCreditsRepository.grantCurrentMonth(
      logger,
      defaultLocale,
      t,
      now,
    );
    expect(first.success, JSON.stringify(first)).toBe(true);
    expect(await packTotal(starter.user.id, "yearly-month:")).toBe(800);
    expect(await packTotal(pro.user.id, "yearly-month:")).toBe(10_500);

    await YearlyCreditsRepository.grantCurrentMonth(
      logger,
      defaultLocale,
      t,
      now,
    );
    expect(await packTotal(starter.user.id, "yearly-month:")).toBe(800);
  });

  it("month 1 is the invoice's grant: the task skips it", async () => {
    await YearlyCreditsRepository.grantCurrentMonth(
      logger,
      defaultLocale,
      t,
      new Date(periodStart.getTime() + 86_400_000),
    );
    expect(await packTotal(starter.user.id, "yearly-month:")).toBe(800);
  });

  it("backfill grants the missed months once", async () => {
    const res = await YearlyCreditsRepository.backfill(
      false,
      logger,
      defaultLocale,
      t,
      now,
    );
    expect(res.success).toBe(true);
    expect(await packTotal(starter.user.id, "yearly-backfill:")).toBe(4800);
    const again = await YearlyCreditsRepository.backfill(
      false,
      logger,
      defaultLocale,
      t,
      now,
    );
    expect(
      again.success &&
        again.data.rows.find((r) => r.userEmail === starter.email)?.status,
    ).toBe("alreadyGranted");
    expect(await packTotal(starter.user.id, "yearly-backfill:")).toBe(4800);
  });
});
