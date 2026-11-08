/**
 * Payment Clawback
 * Revokes the credits (and referral earnings) granted by a payment that was
 * refunded or charged back. Single entry point for Stripe `charge.refunded`,
 * `charge.dispute.*`, NOWPayments `refunded` and the admin refund endpoint.
 *
 * Rules:
 * - Only the credits granted BY THAT PAYMENT are revoked (its own pack), never
 *   other packs, and a wallet never goes below zero.
 * - Credits already spent cannot be taken back: the shortfall is recorded as
 *   `unrecoveredCredits` on the REFUND credit transaction and logged at error
 *   level so an admin can review it (flag, not debt).
 * - Cumulative + idempotent: the target is `granted × reversedFraction`; what
 *   was already revoked for the same payment is subtracted, so webhook retries,
 *   partial refunds and the admin path never double-revoke.
 */

import "server-only";

import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { creditPacks, creditTransactions, creditWallets } from "@/credits/db";
import { CreditPackType, CreditTransactionType } from "@/credits/enum";
import { ReferralRepository } from "@/referral/repository";

import { withTransaction } from "../../vibe/database/utils/repository-helpers";
import { paymentTransactions } from "../db";
import { PaymentStatus } from "../enum";
import { scopedTranslation } from "../i18n";

/** How far a subscription pack may be from an unmapped charge to be matched */
const UNMAPPED_SUBSCRIPTION_MATCH_MS = 3 * 24 * 60 * 60 * 1000;

export type ReversalKind = "refund" | "dispute";

export interface ChargeReversal {
  kind: ReversalKind;
  /** Stripe payment intent of the charge (null for NOWPayments) */
  paymentIntentId: string | null;
  /** Provider session / invoice id (NOWPayments invoice id) */
  providerSessionId: string | null;
  /** Provider customer id — fallback owner lookup for unmapped charges */
  customerId: string | null;
  /** When the charge was created — fallback subscription-pack match */
  chargeCreatedAt: Date | null;
  /** Cumulative share of the payment reversed so far, 0..1 */
  reversedFraction: number;
  /** Charge / refund / dispute id — logs only */
  sourceRef: string;
}

export interface ChargeReversalResult {
  /** False when the charge could not be tied to any user/payment (logged) */
  mapped: boolean;
  transactionId: string | null;
  userId: string | null;
  revokedCredits: number;
  recoveredCredits: number;
  unrecoveredCredits: number;
  referralCanceledPending: number;
  referralReversedConfirmed: number;
}

interface ReversalTarget {
  userId: string;
  walletId: string;
  /** Idempotency key: payment transaction id, or pack id for unmapped charges */
  key: string;
  transactionId: string | null;
  packIds: string[];
  grantedCredits: number;
}

const roundCredits = (value: number): number => Math.round(value * 100) / 100;

export class PaymentClawbackRepository {
  static async reverseCharge(
    reversal: ChargeReversal,
    logger: EndpointLogger,
  ): Promise<ResponseType<ChargeReversalResult>> {
    const empty: ChargeReversalResult = {
      mapped: false,
      transactionId: null,
      userId: null,
      revokedCredits: 0,
      recoveredCredits: 0,
      unrecoveredCredits: 0,
      referralCanceledPending: 0,
      referralReversedConfirmed: 0,
    };
    try {
      const fraction = Math.min(1, Math.max(0, reversal.reversedFraction));
      const target = await PaymentClawbackRepository.resolveTarget(reversal);
      if (!target) {
        logger.error(
          "Payment reversal could not be mapped to a payment — review manually",
          {
            kind: reversal.kind,
            sourceRef: reversal.sourceRef,
            paymentIntentId: reversal.paymentIntentId,
            providerSessionId: reversal.providerSessionId,
            customerId: reversal.customerId,
            reversedFraction: fraction,
          },
        );
        return success(empty);
      }

      const credit = await withTransaction(logger, async (tx) => {
        // Wallet lock serializes every revoke for this user: the "already
        // revoked" read below can't race a concurrent webhook delivery.
        const [wallet] = await tx
          .select()
          .from(creditWallets)
          .where(eq(creditWallets.id, target.walletId))
          .for("update")
          .limit(1);
        if (!wallet) {
          return { revoked: 0, recovered: 0 };
        }

        const [already] = await tx
          .select({
            total: sql<string>`COALESCE(SUM((${creditTransactions.metadata}->>'revokedCredits')::numeric), 0)`,
          })
          .from(creditTransactions)
          .where(
            and(
              eq(creditTransactions.walletId, wallet.id),
              eq(creditTransactions.type, CreditTransactionType.REFUND),
              sql`${creditTransactions.metadata}->>'originalTransactionId' = ${target.key}`,
            ),
          );
        const alreadyRevoked = Number(already?.total ?? 0);
        const revoke = roundCredits(
          target.grantedCredits * fraction - alreadyRevoked,
        );
        if (revoke <= 0) {
          return { revoked: 0, recovered: 0 };
        }

        let toRecover = revoke;
        let firstPackId: string | null = null;
        for (const packId of target.packIds) {
          if (toRecover <= 0) {
            break;
          }
          const [pack] = await tx
            .select()
            .from(creditPacks)
            .where(eq(creditPacks.id, packId))
            .for("update")
            .limit(1);
          if (!pack || pack.remaining <= 0) {
            continue;
          }
          const take = Math.min(pack.remaining, toRecover);
          await tx
            .update(creditPacks)
            .set({ remaining: pack.remaining - take, updatedAt: new Date() })
            .where(eq(creditPacks.id, pack.id));
          firstPackId = firstPackId ?? pack.id;
          toRecover = roundCredits(toRecover - take);
        }
        const recovered = roundCredits(revoke - toRecover);

        const [updated] = await tx
          .update(creditWallets)
          .set({
            balance: sql`GREATEST(0, ${creditWallets.balance} - ${recovered})`,
            updatedAt: new Date(),
          })
          .where(eq(creditWallets.id, wallet.id))
          .returning({ balance: creditWallets.balance });

        await tx.insert(creditTransactions).values({
          walletId: wallet.id,
          amount: -recovered,
          balanceAfter: updated?.balance ?? 0,
          type: CreditTransactionType.REFUND,
          packId: firstPackId,
          freePeriodId: wallet.freePeriodId,
          metadata: {
            reason: `payment_${reversal.kind}`,
            originalTransactionId: target.key,
            revokedCredits: revoke,
            unrecoveredCredits: toRecover,
          },
        });
        return { revoked: revoke, recovered };
      });

      if (target.transactionId && fraction >= 1) {
        await db
          .update(paymentTransactions)
          .set({ status: PaymentStatus.REFUNDED, updatedAt: new Date() })
          .where(eq(paymentTransactions.id, target.transactionId));
      }

      // Commission on reversed money is not earned — cancel the whole
      // payment's referral earnings on any refund or dispute.
      let referralCanceledPending = 0;
      let referralReversedConfirmed = 0;
      if (target.transactionId) {
        const referral = await ReferralRepository.reverseEarningsForTransaction(
          target.transactionId,
          reversal.kind,
          logger,
        );
        if (!referral.success) {
          return referral;
        }
        referralCanceledPending = referral.data.canceledPending;
        referralReversedConfirmed = referral.data.reversedConfirmed;
      }

      const unrecovered = roundCredits(credit.revoked - credit.recovered);
      if (unrecovered > 0) {
        logger.error(
          "Payment reversal: credits already spent — unrecovered, review manually",
          {
            kind: reversal.kind,
            sourceRef: reversal.sourceRef,
            userId: target.userId,
            transactionId: target.transactionId,
            revokedCredits: credit.revoked,
            unrecoveredCredits: unrecovered,
          },
        );
      }
      logger.info("Payment reversal applied", {
        kind: reversal.kind,
        sourceRef: reversal.sourceRef,
        userId: target.userId,
        transactionId: target.transactionId,
        reversedFraction: fraction,
        revokedCredits: credit.revoked,
        recoveredCredits: credit.recovered,
        referralCanceledPending,
        referralReversedConfirmed,
      });

      return success({
        mapped: true,
        transactionId: target.transactionId,
        userId: target.userId,
        revokedCredits: credit.revoked,
        recoveredCredits: credit.recovered,
        unrecoveredCredits: unrecovered,
        referralCanceledPending,
        referralReversedConfirmed,
      });
    } catch (error) {
      logger.error("Payment reversal failed", parseError(error), {
        kind: reversal.kind,
        sourceRef: reversal.sourceRef,
      });
      const { t } = scopedTranslation.scopedT(defaultLocale);
      return fail({
        message: t("errors.server.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Restore credits revoked by a dispute the merchant won. Idempotent: the
   * restore pack is keyed on the dispute id. Referral earnings stay canceled.
   */
  static async restoreWonDispute(
    reversal: Omit<ChargeReversal, "kind" | "reversedFraction">,
    disputeId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ restoredCredits: number }>> {
    try {
      const target = await PaymentClawbackRepository.resolveTarget({
        ...reversal,
        kind: "dispute",
        reversedFraction: 1,
      });
      if (!target) {
        return success({ restoredCredits: 0 });
      }
      const restoreSessionId = `dispute-won:${disputeId}`;

      const restored = await withTransaction(logger, async (tx) => {
        const [wallet] = await tx
          .select()
          .from(creditWallets)
          .where(eq(creditWallets.id, target.walletId))
          .for("update")
          .limit(1);
        if (!wallet) {
          return 0;
        }
        const [existing] = await tx
          .select({ id: creditPacks.id })
          .from(creditPacks)
          .where(
            sql`${creditPacks.metadata}->>'sessionId' = ${restoreSessionId}`,
          )
          .limit(1);
        if (existing) {
          return 0;
        }
        const [revoked] = await tx
          .select({
            recovered: sql<string>`COALESCE(SUM(-${creditTransactions.amount}), 0)`,
          })
          .from(creditTransactions)
          .where(
            and(
              eq(creditTransactions.walletId, wallet.id),
              eq(creditTransactions.type, CreditTransactionType.REFUND),
              sql`${creditTransactions.metadata}->>'originalTransactionId' = ${target.key}`,
              sql`${creditTransactions.metadata}->>'reason' = 'payment_dispute'`,
            ),
          );
        const amount = roundCredits(Number(revoked?.recovered ?? 0));
        if (amount <= 0) {
          return 0;
        }
        const [pack] = await tx
          .insert(creditPacks)
          .values({
            walletId: wallet.id,
            originalAmount: amount,
            remaining: amount,
            type: CreditPackType.PERMANENT,
            expiresAt: null,
            source: "dispute_won_restore",
            metadata: { sessionId: restoreSessionId, reason: "dispute_won" },
          })
          .returning({ id: creditPacks.id });
        const [updated] = await tx
          .update(creditWallets)
          .set({
            balance: sql`${creditWallets.balance} + ${amount}`,
            updatedAt: new Date(),
          })
          .where(eq(creditWallets.id, wallet.id))
          .returning({ balance: creditWallets.balance });
        await tx.insert(creditTransactions).values({
          walletId: wallet.id,
          amount,
          balanceAfter: updated.balance,
          type: CreditTransactionType.PURCHASE,
          packId: pack.id,
          freePeriodId: wallet.freePeriodId,
          metadata: { sessionId: restoreSessionId },
        });
        return amount;
      });

      if (restored > 0) {
        logger.info("Dispute won — revoked credits restored", {
          disputeId,
          userId: target.userId,
          restoredCredits: restored,
        });
      }
      return success({ restoredCredits: restored });
    } catch (error) {
      logger.error("Dispute restore failed", parseError(error), { disputeId });
      const { t } = scopedTranslation.scopedT(defaultLocale);
      return fail({
        message: t("errors.server.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Map a reversed charge to the user, wallet and packs its payment granted.
   * 1. Payment transaction by payment intent / provider session → its packs
   *    (pack.metadata.sessionId = the checkout session id).
   * 2. Unmapped Stripe charge (subscription renewal, no local transaction):
   *    owner by customer id → the subscription pack granted closest to the
   *    charge time (within UNMAPPED_SUBSCRIPTION_MATCH_MS).
   */
  private static async resolveTarget(
    reversal: ChargeReversal,
  ): Promise<ReversalTarget | null> {
    const transaction = reversal.paymentIntentId
      ? (
          await db
            .select()
            .from(paymentTransactions)
            .where(
              eq(
                paymentTransactions.providerPaymentIntentId,
                reversal.paymentIntentId,
              ),
            )
            .limit(1)
        )[0]
      : reversal.providerSessionId
        ? (
            await db
              .select()
              .from(paymentTransactions)
              .where(
                eq(
                  paymentTransactions.providerSessionId,
                  reversal.providerSessionId,
                ),
              )
              .limit(1)
          )[0]
        : undefined;

    let userId = transaction?.userId ?? null;
    if (!userId && reversal.customerId) {
      const [owner] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.stripeCustomerId, reversal.customerId))
        .limit(1);
      userId = owner?.id ?? null;
    }
    if (!userId) {
      return null;
    }

    const [wallet] = await db
      .select({ id: creditWallets.id })
      .from(creditWallets)
      .where(eq(creditWallets.userId, userId))
      .limit(1);
    if (!wallet) {
      return null;
    }

    // Grants are read from the immutable credit-transaction log: usage
    // deletes fully consumed packs, so packs alone would under-report what a
    // payment granted. Packs that still exist are what can be recovered.
    if (transaction?.providerSessionId) {
      const sessionId = transaction.providerSessionId;
      const [granted] = await db
        .select({
          total: sql<string>`COALESCE(SUM(${creditTransactions.amount}), 0)`,
        })
        .from(creditTransactions)
        .where(
          and(
            eq(creditTransactions.walletId, wallet.id),
            inArray(creditTransactions.type, [
              CreditTransactionType.PURCHASE,
              CreditTransactionType.SUBSCRIPTION,
            ]),
            sql`${creditTransactions.metadata}->>'sessionId' = ${sessionId}`,
          ),
        );
      const packs = await db
        .select({ id: creditPacks.id })
        .from(creditPacks)
        .where(
          and(
            eq(creditPacks.walletId, wallet.id),
            sql`${creditPacks.metadata}->>'sessionId' = ${sessionId}`,
          ),
        );
      return {
        userId,
        walletId: wallet.id,
        key: transaction.id,
        transactionId: transaction.id,
        packIds: packs.map((p) => p.id),
        grantedCredits: Number(granted?.total ?? 0),
      };
    }

    if (transaction) {
      // Payment exists but granted no pack (e.g. grant failed) — still reverse
      // its referral earnings.
      return {
        userId,
        walletId: wallet.id,
        key: transaction.id,
        transactionId: transaction.id,
        packIds: [],
        grantedCredits: 0,
      };
    }

    if (!reversal.chargeCreatedAt) {
      return null;
    }
    const chargeMs = reversal.chargeCreatedAt.getTime();
    const [grant] = await db
      .select({
        id: creditTransactions.id,
        amount: creditTransactions.amount,
        packId: creditTransactions.packId,
      })
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.walletId, wallet.id),
          eq(creditTransactions.type, CreditTransactionType.SUBSCRIPTION),
          gte(
            creditTransactions.createdAt,
            new Date(chargeMs - UNMAPPED_SUBSCRIPTION_MATCH_MS),
          ),
          lte(
            creditTransactions.createdAt,
            new Date(chargeMs + UNMAPPED_SUBSCRIPTION_MATCH_MS),
          ),
        ),
      )
      .orderBy(
        desc(
          sql`-ABS(EXTRACT(EPOCH FROM ${creditTransactions.createdAt}) - ${chargeMs / 1000})`,
        ),
      )
      .limit(1);
    if (!grant) {
      return null;
    }
    return {
      userId,
      walletId: wallet.id,
      key: grant.id,
      transactionId: null,
      packIds: grant.packId ? [grant.packId] : [],
      grantedCredits: grant.amount,
    };
  }
}
