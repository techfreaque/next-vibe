/**
 * Subscription Stripe sync - integration tests against the real DB with a
 * mocked Stripe fetcher (no network).
 *
 * - past_due row that Stripe shows as canceled -> canceled (dry run writes nothing)
 * - canceled row never downgrades to past_due
 * - in-sync row is reported unchanged
 * - Stripe 404 -> canceled, Stripe id cleared
 * - legacy row without Stripe id and an ended period -> expired in all-mode
 * - missing target -> validation error
 */

import "server-only";

import { eq, inArray } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { PaymentProvider } from "@/payment/enum";
import { subscriptions } from "@/subscription/db";
import {
  BillingInterval,
  SubscriptionPlan,
  SubscriptionStatus,
  type SubscriptionStatusValue,
} from "@/subscription/enum";

import { SubscriptionSyncAction } from "./enum";
import { scopedTranslation } from "./i18n";
import {
  type StripeLookupResult,
  type StripeSubscriptionFetcher,
  type StripeSubscriptionSnapshot,
  SubscriptionSyncStripeRepository,
} from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const t = scopedTranslation.scopedT(defaultLocale).t;
const stamp = Date.now();

const PERIOD_START = Math.floor(Date.UTC(2026, 9, 1) / 1000);
const PERIOD_END = Math.floor(Date.UTC(2026, 10, 1) / 1000);
const CANCELED_AT = Math.floor(Date.UTC(2026, 10, 5) / 1000);

const ids = {
  pastDue: `sub_test_sync_pastdue_${stamp}`,
  keepCanceled: `sub_test_sync_keepcanceled_${stamp}`,
  inSync: `sub_test_sync_insync_${stamp}`,
  missing: `sub_test_sync_missing_${stamp}`,
};

function snapshot(
  id: string,
  status: StripeSubscriptionSnapshot["status"],
  canceled: boolean,
): StripeSubscriptionSnapshot {
  return {
    id,
    status,
    currentPeriodStart: PERIOD_START,
    currentPeriodEnd: PERIOD_END,
    cancelAtPeriodEnd: false,
    cancelAt: null,
    canceledAt: canceled ? CANCELED_AT : null,
    endedAt: canceled ? CANCELED_AT : null,
  };
}

const stripeData: Record<string, StripeLookupResult> = {
  [ids.pastDue]: {
    kind: "found",
    subscription: snapshot(ids.pastDue, "canceled", true),
  },
  [ids.keepCanceled]: {
    kind: "found",
    subscription: snapshot(ids.keepCanceled, "past_due", false),
  },
  [ids.inSync]: {
    kind: "found",
    subscription: snapshot(ids.inSync, "active", false),
  },
  [ids.missing]: { kind: "missing" },
};

const fetchCalls: string[] = [];
const mockFetcher: StripeSubscriptionFetcher = async (id) => {
  fetchCalls.push(id);
  return stripeData[id] ?? { kind: "error", message: `unexpected id ${id}` };
};

const users: Record<string, TestUser> = {};
const rowIds: Record<string, string> = {};

async function insertRow(
  key: string,
  status: typeof SubscriptionStatusValue,
  providerSubscriptionId: string | null,
  periodEnd: Date,
): Promise<void> {
  const created = await createTestUser(`sync-stripe-${key.toLowerCase()}-${stamp}@example.com`);
  expect(created.success).toBe(true);
  if (!created.success) {
    return;
  }
  users[key] = created.data;
  const [row] = await db
    .insert(subscriptions)
    .values({
      userId: created.data.user.id,
      status,
      planId: SubscriptionPlan.SUBSCRIPTION,
      billingInterval: BillingInterval.MONTHLY,
      currentPeriodStart: new Date(PERIOD_START * 1000),
      currentPeriodEnd: periodEnd,
      provider: PaymentProvider.STRIPE,
      providerSubscriptionId,
      paymentFailedAt: new Date(),
    })
    .returning({ id: subscriptions.id });
  rowIds[key] = row.id;
}

async function rowById(
  id: string,
): Promise<typeof subscriptions.$inferSelect | undefined> {
  const [row] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.id, id));
  return row;
}

describe("SubscriptionSyncStripeRepository", () => {
  beforeAll(async () => {
    const periodEnd = new Date(PERIOD_END * 1000);
    await insertRow("pastDue", SubscriptionStatus.PAST_DUE, ids.pastDue, periodEnd);
    await insertRow(
      "keepCanceled",
      SubscriptionStatus.CANCELED,
      ids.keepCanceled,
      periodEnd,
    );
    await insertRow("inSync", SubscriptionStatus.ACTIVE, ids.inSync, periodEnd);
    await insertRow("missing", SubscriptionStatus.PAST_DUE, ids.missing, periodEnd);
    // Legacy test row: "active", no Stripe id, period ended long ago.
    await insertRow(
      "legacy",
      SubscriptionStatus.ACTIVE,
      null,
      new Date("2025-12-21T00:00:00.000Z"),
    );
    // inSync row must match Stripe exactly (no failed-payment stamp either way).
    await db
      .update(subscriptions)
      .set({ paymentFailedAt: null })
      .where(eq(subscriptions.id, rowIds.inSync));
  }, 60_000);

  afterAll(async () => {
    await db
      .delete(subscriptions)
      .where(inArray(subscriptions.id, Object.values(rowIds)));
    for (const user of Object.values(users)) {
      await deleteTestUser(user.user.id);
    }
  }, 60_000);

  it("rejects a call with neither a target nor all=true", async () => {
    const res = await SubscriptionSyncStripeRepository.sync(
      { all: false, dryRun: true },
      logger,
      t,
      mockFetcher,
    );
    expect(res.success).toBe(false);
  });

  it("returns not found for an unknown id", async () => {
    const res = await SubscriptionSyncStripeRepository.sync(
      { subscriptionId: `sub_test_sync_nope_${stamp}`, all: false, dryRun: true },
      logger,
      t,
      mockFetcher,
    );
    expect(res.success).toBe(false);
  });

  it("dry run reports past_due -> canceled but writes nothing", async () => {
    const res = await SubscriptionSyncStripeRepository.sync(
      { subscriptionId: ids.pastDue, all: false, dryRun: true },
      logger,
      t,
      mockFetcher,
    );
    expect(res.success).toBe(true);
    if (!res.success) {
      return;
    }
    expect(res.data.dryRunResult).toBe(true);
    expect(res.data.items).toHaveLength(1);
    const [item] = res.data.items;
    expect(item.action).toBe(SubscriptionSyncAction.UPDATED);
    expect(item.statusBefore).toBe(SubscriptionStatus.PAST_DUE);
    expect(item.statusAfter).toBe(SubscriptionStatus.CANCELED);

    const row = await rowById(rowIds.pastDue);
    expect(row?.status).toBe(SubscriptionStatus.PAST_DUE);
  });

  it("applies past_due -> canceled by our uuid, mirroring Stripe fields", async () => {
    const res = await SubscriptionSyncStripeRepository.sync(
      { subscriptionId: rowIds.pastDue, all: false, dryRun: false },
      logger,
      t,
      mockFetcher,
    );
    expect(res.success).toBe(true);
    const row = await rowById(rowIds.pastDue);
    expect(row?.status).toBe(SubscriptionStatus.CANCELED);
    expect(row?.canceledAt?.getTime()).toBe(CANCELED_AT * 1000);
    expect(row?.endedAt?.getTime()).toBe(CANCELED_AT * 1000);
    expect(row?.currentPeriodEnd?.getTime()).toBe(PERIOD_END * 1000);
    // Re-running is a no-op.
    const again = await SubscriptionSyncStripeRepository.sync(
      { subscriptionId: ids.pastDue, all: false, dryRun: false },
      logger,
      t,
      mockFetcher,
    );
    expect(again.success && again.data.items[0]?.action).toBe(
      SubscriptionSyncAction.UNCHANGED,
    );
  });

  it("never downgrades canceled to past_due", async () => {
    const res = await SubscriptionSyncStripeRepository.sync(
      { subscriptionId: ids.keepCanceled, all: false, dryRun: false },
      logger,
      t,
      mockFetcher,
    );
    expect(res.success).toBe(true);
    if (!res.success) {
      return;
    }
    expect(res.data.items[0]?.action).toBe(SubscriptionSyncAction.UNCHANGED);
    expect(res.data.items[0]?.note).toContain("past_due");
    const row = await rowById(rowIds.keepCanceled);
    expect(row?.status).toBe(SubscriptionStatus.CANCELED);
  });

  it("reports an in-sync row as unchanged", async () => {
    const res = await SubscriptionSyncStripeRepository.sync(
      { subscriptionId: ids.inSync, all: false, dryRun: false },
      logger,
      t,
      mockFetcher,
    );
    expect(res.success && res.data.items[0]?.action).toBe(
      SubscriptionSyncAction.UNCHANGED,
    );
  });

  it("all-mode: cancels Stripe-missing rows and expires the legacy row", async () => {
    fetchCalls.length = 0;
    const dry = await SubscriptionSyncStripeRepository.sync(
      { all: true, dryRun: true },
      logger,
      t,
      // Only our rows answer; any other non-terminal row in the dev DB errors
      // out harmlessly (reported, untouched).
      mockFetcher,
    );
    expect(dry.success).toBe(true);
    if (!dry.success) {
      return;
    }
    const byId = new Map(dry.data.items.map((i) => [i.subscriptionId, i]));
    expect(byId.get(rowIds.missing)?.action).toBe(
      SubscriptionSyncAction.MISSING_IN_STRIPE,
    );
    expect(byId.get(rowIds.legacy)?.action).toBe(SubscriptionSyncAction.EXPIRED);
    // Terminal rows are not scanned.
    expect(byId.has(rowIds.keepCanceled)).toBe(false);
    expect(byId.has(rowIds.pastDue)).toBe(false);
    expect((await rowById(rowIds.legacy))?.status).toBe(
      SubscriptionStatus.ACTIVE,
    );

    // Apply only to our rows: run per row so other dev-DB rows stay untouched.
    for (const id of [rowIds.missing, rowIds.legacy]) {
      const res = await SubscriptionSyncStripeRepository.sync(
        { subscriptionId: id, all: false, dryRun: false },
        logger,
        t,
        mockFetcher,
      );
      expect(res.success).toBe(true);
    }
    const missing = await rowById(rowIds.missing);
    expect(missing?.status).toBe(SubscriptionStatus.CANCELED);
    expect(missing?.providerSubscriptionId).toBeNull();
    const legacy = await rowById(rowIds.legacy);
    expect(legacy?.status).toBe(SubscriptionStatus.CANCELED);
    expect(legacy?.endedAt?.toISOString()).toBe("2025-12-21T00:00:00.000Z");
  });
});
