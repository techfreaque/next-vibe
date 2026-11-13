/**
 * Monthly Free Credit Allowance
 *
 * One cap per pool per calendar month. The user-pool cap is ADDITIVE: a signed-in
 * user keeps its original guest lead's allowance and stacks the signed-in grant on
 * top, because every user began as a guest lead and the two accumulate.
 * - Guest pool (public leads, linked via lead_lead_links): FREE_CREDIT_ALLOWANCE.guest
 *   (20).
 * - User pool (user + every linked lead):
 *   FREE_CREDIT_ALLOWANCE.guest + FREE_CREDIT_ALLOWANCE.signedIn = lead 20 + user 20
 *   = 40 base.
 * - User pool +FREE_CREDIT_ALLOWANCE.newsletterBonus once it holds a CONFIRMED
 *   newsletter subscription (double opt-in link clicked): 40 -> 90. Account first:
 *   guest pools never get the bonus. A guest's confirmed subscription stays on its
 *   lead and starts counting the moment that lead joins a user pool (signup/login).
 *
 * Spending is counted per pool per period (credit_transactions.metadata.freeCreditsUsed),
 * so the cap is "allowance - spent" no matter how often the tier changes mid-month.
 * The lead's 20 stays the SAME 20 it had as a guest: when a guest converts to a
 * user, its pool and period-spend are unchanged, only the ceiling rises (20 -> 40),
 * so any guest spend already made on another device/IP still counts against the 40
 * (and 90 with newsletter). One IP cannot mass-signup to farm fresh credits.
 * Unsubscribing lowers the cap; re-subscribing never grants a second bonus.
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
 * The newsletter bonus is account-only: a guest pool stays at the guest cap.
 */
export function computeFreeAllowance({
  isUserPool,
  hasConfirmedNewsletter,
}: FreeAllowanceInput): number {
  if (!isUserPool) {
    return FREE_CREDIT_ALLOWANCE.guest;
  }
  const base = FREE_CREDIT_ALLOWANCE.guest + FREE_CREDIT_ALLOWANCE.signedIn;
  return hasConfirmedNewsletter
    ? base + FREE_CREDIT_ALLOWANCE.newsletterBonus
    : base;
}

/**
 * Stamped on every free grant made under the current tiers (metadata.tierVersion).
 * Grants without it were made under the pre-2026-11 tiers (account 70, newsletter +20).
 */
export const FREE_GRANT_TIER_VERSION = 2;

/**
 * Tier caps before the 2026-11 change. Only used by computeGrandfatheredFreeCap.
 */
const LEGACY_FREE_CREDIT_ALLOWANCE = {
  guest: 20,
  signedIn: 50,
  newsletterBonus: 20,
} as const;

/** Monthly cap the pool would have had under the pre-2026-11 tiers. */
export function computeLegacyFreeAllowance({
  isUserPool,
  hasConfirmedNewsletter,
}: FreeAllowanceInput): number {
  if (!isUserPool) {
    return LEGACY_FREE_CREDIT_ALLOWANCE.guest;
  }
  const base =
    LEGACY_FREE_CREDIT_ALLOWANCE.guest + LEGACY_FREE_CREDIT_ALLOWANCE.signedIn;
  return hasConfirmedNewsletter
    ? base + LEGACY_FREE_CREDIT_ALLOWANCE.newsletterBonus
    : base;
}

/**
 * Cap for the current period after the 2026-11 tier cut: lower tiers apply from
 * the next monthly refill on, never as a mid-month clawback.
 * What the pool was granted THIS period under the old tiers (grants without
 * tierVersion) stays spendable until that refill, bounded by the old tier cap so
 * merged guest pools never stack past what one pool could have held.
 * New-tier grants never count, so the grace ends by itself after one refill.
 * Safe to delete (with computeLegacyFreeAllowance) from 2027-01 on.
 */
export function computeGrandfatheredFreeCap({
  allowance,
  legacyAllowance,
  legacyGrantedThisPeriod,
}: {
  allowance: number;
  legacyAllowance: number;
  legacyGrantedThisPeriod: number;
}): number {
  return Math.max(
    allowance,
    Math.min(legacyGrantedThisPeriod, legacyAllowance),
  );
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
