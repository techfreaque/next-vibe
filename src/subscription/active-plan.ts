/**
 * Live plan check (Max, 2026-11-17): credit packs top up a plan, so only a
 * user with a live subscription may buy one. Live = ACTIVE, TRIALING, or
 * PAST_DUE while the payment grace period runs. Card and crypto plans count
 * alike (a crypto plan is a subscription row with provider NOWPAYMENTS).
 */

import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import { db } from "next-vibe/database";

import { subscriptions } from "./db";
import { SubscriptionStatus } from "./enum";

export const LIVE_PLAN_STATUSES = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIALING,
  SubscriptionStatus.PAST_DUE,
] as const;

const RENEWAL_SLACK_MS = 2 * 24 * 60 * 60 * 1000;

export async function hasLivePlan(userId: string): Promise<boolean> {
  const [row] = await db
    .select({
      id: subscriptions.id,
      currentPeriodEnd: subscriptions.currentPeriodEnd,
      gracePeriodEndsAt: subscriptions.gracePeriodEndsAt,
      status: subscriptions.status,
    })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        inArray(subscriptions.status, [...LIVE_PLAN_STATUSES]),
      ),
    )
    .limit(1);
  if (!row) {
    return false;
  }
  const now = Date.now();
  if (row.status === SubscriptionStatus.PAST_DUE) {
    return (
      row.gracePeriodEndsAt !== null && row.gracePeriodEndsAt.getTime() > now
    );
  }
  // A crypto plan has no provider-side renewal: once its period is over it is
  // not live, even if no webhook flipped the status yet. The slack covers a
  // card renewal whose webhook is still on its way.
  return (
    row.currentPeriodEnd === null ||
    row.currentPeriodEnd.getTime() + RENEWAL_SLACK_MS > now
  );
}
