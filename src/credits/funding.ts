/**
 * Funding attribution + spendable-pack rules shared by the deduction walk,
 * the balance check and the usage report.
 *
 * Spendable packs: exactly what deductCredits walks, in this order:
 *   1. SUBSCRIPTION packs with an expiry that has not passed
 *   2. EARNED packs (referral rewards)
 *   3. PERMANENT and BONUS packs without an expiry
 * Only packs on the pool's USER wallet are walked. A wallet `balance` that no
 * pack backs is never spendable, so the pre-generation balance check must use
 * the same rule (CreditRepository.calculatePoolBalance) or a provider call
 * runs for a charge that then fails.
 */

import { and, eq, gte, isNull, not, or, type SQL, sql } from "drizzle-orm";

import { FREE_CREDIT_ALLOWANCE } from "../products/constants";
import { creditPacks } from "./db";
import {
  CreditFundingType,
  type CreditFundingTypeDBValue,
  CreditPackType,
  type CreditPackTypeValue,
} from "./enum";

const NEVER = sql`FALSE`;

/** Spendable subscription packs (walk step 2). */
export function spendableSubscriptionPacks(now: Date | SQL): SQL {
  return (
    and(
      eq(creditPacks.type, CreditPackType.SUBSCRIPTION),
      not(isNull(creditPacks.expiresAt)),
      gte(creditPacks.expiresAt, now),
    ) ?? NEVER
  );
}

/** Spendable referral-earned packs (walk step 3). */
export function spendableEarnedPacks(): SQL {
  return eq(creditPacks.type, CreditPackType.EARNED);
}

/** Spendable permanent / bonus packs (walk step 4). */
export function spendablePermanentPacks(): SQL {
  return (
    and(
      or(
        eq(creditPacks.type, CreditPackType.PERMANENT),
        eq(creditPacks.type, CreditPackType.BONUS),
      ),
      isNull(creditPacks.expiresAt),
    ) ?? NEVER
  );
}

/** Any pack the deduction walk can spend. */
export function spendablePacks(now: Date | SQL): SQL {
  return (
    or(
      spendableSubscriptionPacks(now),
      spendableEarnedPacks(),
      spendablePermanentPacks(),
    ) ?? NEVER
  );
}

/** Idempotency-key prefixes of grants that are referral credits. */
const REFERRAL_SESSION_PREFIXES = ["referral-subscription-bonus:", "payout_"];

/**
 * Funding bucket of a pack (source/metadata as written by addUserCredits,
 * addCredits, addEarnedCredits, the referral payout and the dispute restore).
 */
export function packFundingType(pack: {
  type: CreditPackTypeValue;
  source: string | null;
  sessionId?: string | null;
}): CreditFundingTypeDBValue {
  const session = pack.sessionId ?? "";
  if (REFERRAL_SESSION_PREFIXES.some((prefix) => session.startsWith(prefix))) {
    return CreditFundingType.REFERRAL;
  }
  switch (pack.type) {
    case CreditPackType.SUBSCRIPTION:
      return CreditFundingType.SUBSCRIPTION;
    case CreditPackType.EARNED:
      return CreditFundingType.REFERRAL;
    case CreditPackType.PERMANENT:
      return CreditFundingType.PURCHASED;
    case CreditPackType.BONUS:
      // "bonus" = admin-add (tester credits), "admin_grant" = legacy admin rows.
      return CreditFundingType.ADMIN_GRANT;
    default:
      return CreditFundingType.PACK_UNKNOWN;
  }
}

/**
 * Credits of the pool's monthly free cap that count as the plain allowance;
 * everything above (the signed-in step and the newsletter bonus) is the
 * signup / newsletter bonus. Free credits are fungible, so the convention is
 * fixed: the first FREE_CREDIT_ALLOWANCE.guest credits spent in a period are
 * allowance, the rest are bonus.
 */
export const FREE_ALLOWANCE_BASE = FREE_CREDIT_ALLOWANCE.guest;

function roundCredits(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

/**
 * Split a free debit of `amount` that starts after `spentBefore` free
 * credits of the pool's period into allowance and bonus parts (zero parts
 * dropped, order allowance first).
 */
export function splitFreeDebit(
  spentBefore: number,
  amount: number,
  base: number = FREE_ALLOWANCE_BASE,
): Array<{ fundingType: CreditFundingTypeDBValue; amount: number }> {
  const allowance = roundCredits(
    Math.max(0, Math.min(amount, base - Math.max(0, spentBefore))),
  );
  const bonus = roundCredits(amount - allowance);
  return [
    { fundingType: CreditFundingType.FREE_ALLOWANCE, amount: allowance },
    { fundingType: CreditFundingType.FREE_BONUS, amount: bonus },
  ].filter((part) => part.amount > 0);
}
