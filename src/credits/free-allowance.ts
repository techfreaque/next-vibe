/**
 * Monthly Free Credit Allowance
 *
 * One cap per pool per calendar month:
 * - Guest pool (public leads, linked via lead_lead_links): FREE_CREDIT_ALLOWANCE.guest
 * - User pool (user + every linked lead): FREE_CREDIT_ALLOWANCE.signedIn
 * - Either pool +FREE_CREDIT_ALLOWANCE.newsletterBonus once it holds a CONFIRMED
 *   newsletter subscription (double opt-in link clicked).
 *
 * Spending is counted per pool per period (credit_transactions.metadata.freeCreditsUsed),
 * so the cap is "allowance - spent" no matter how often the tier changes mid-month:
 * guest -> user carries usage over, unsubscribing lowers the cap, re-subscribing
 * never grants a second bonus.
 */

import "server-only";

import { and, eq, inArray, isNotNull, or } from "drizzle-orm";
import { db } from "next-vibe/database";

import { newsletterSubscriptions } from "@/newsletter/db";
import { NewsletterSubscriptionStatus } from "@/newsletter/enum";

import { FREE_CREDIT_ALLOWANCE } from "../products/constants";

export interface FreeAllowanceInput {
  /** Pool belongs to a signed-in user (USER_POOL) */
  isUserPool: boolean;
  /** Pool holds a confirmed, active newsletter subscription */
  hasConfirmedNewsletter: boolean;
}

/**
 * Monthly free-credit cap for a pool.
 */
export function computeFreeAllowance({
  isUserPool,
  hasConfirmedNewsletter,
}: FreeAllowanceInput): number {
  const base = isUserPool
    ? FREE_CREDIT_ALLOWANCE.signedIn
    : FREE_CREDIT_ALLOWANCE.guest;
  return hasConfirmedNewsletter
    ? base + FREE_CREDIT_ALLOWANCE.newsletterBonus
    : base;
}

/**
 * Free credits still spendable this period.
 * `remainingInWallets` is the stored sum (it can exceed the cap after two pools merge);
 * the cap minus period spending always wins.
 */
export function computeFreeAvailable({
  allowance,
  spentThisPeriod,
  remainingInWallets,
}: {
  allowance: number;
  spentThisPeriod: number;
  remainingInWallets: number;
}): number {
  return Math.max(0, Math.min(remainingInWallets, allowance - spentThisPeriod));
}

/**
 * How many free credits must be added to the pool's wallets so that
 * stored remaining == allowance - spent. 0 when nothing to add.
 * Positive only after the cap rose mid-period (signup, newsletter confirmed).
 */
export function computeFreeTopUp({
  allowance,
  spentThisPeriod,
  remainingInWallets,
}: {
  allowance: number;
  spentThisPeriod: number;
  remainingInWallets: number;
}): number {
  const target = Math.max(0, allowance - spentThisPeriod);
  return Math.max(0, target - remainingInWallets);
}

/**
 * Does the pool hold a confirmed, active newsletter subscription?
 * Matched by the claiming lead (any lead in the pool) or by the pool's user.
 */
export async function poolHasConfirmedNewsletter({
  userId,
  leadIds,
}: {
  userId: string | null;
  leadIds: string[];
}): Promise<boolean> {
  const owners = [
    leadIds.length > 0
      ? inArray(newsletterSubscriptions.leadId, leadIds)
      : undefined,
    userId ? eq(newsletterSubscriptions.userId, userId) : undefined,
  ].filter((c) => c !== undefined);

  if (owners.length === 0) {
    return false;
  }

  const [row] = await db
    .select({ id: newsletterSubscriptions.id })
    .from(newsletterSubscriptions)
    .where(
      and(
        eq(
          newsletterSubscriptions.status,
          NewsletterSubscriptionStatus.SUBSCRIBED,
        ),
        isNotNull(newsletterSubscriptions.confirmedAt),
        or(...owners),
      ),
    )
    .limit(1);

  return row !== undefined;
}
