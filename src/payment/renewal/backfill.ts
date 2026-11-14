/**
 * One-off replay: renewal invoices paid before renewals were recorded
 * (RENEWAL_RECORDING_START) never booked their referral commission. Replay
 * them from the webhook log through the normal renewal path
 * (PaymentRenewalRepository.recordPaidRenewal), for referred buyers only.
 *
 * - Keyed by the provider invoice id like the live path, so it is safe to run
 *   on every start: recorded invoices are skipped, reruns book nothing.
 * - The payment and its earnings are dated when the invoice was paid. The
 *   normal hold rule (REFERRAL_CONFIG.EARNING_HOLD_DAYS after the payment)
 *   then applies as it would have: earnings past it are confirmed right away
 *   through confirmMaturedEarnings, which grants the credits; younger ones
 *   wait for the confirm cron like any other earning.
 * Other (non-referred) renewals are left alone: nothing is owed on them.
 */

import "server-only";

import { and, eq, gt, inArray, lt, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { referralEarnings, userReferrals } from "@/referral/db";
import { ReferralEarningStatus } from "@/referral/enum";
import { ReferralRepository } from "@/referral/repository";
import { subscriptions } from "@/subscription/db";

import { paymentTransactions, paymentWebhooks } from "../db";
import { PaymentRenewalRepository } from "./renewal";

/** Paid invoices received before this were never recorded as renewals */
export const RENEWAL_RECORDING_START = new Date("2026-11-14T00:00:00Z");

const PAID_INVOICE_EVENTS = ["invoice.paid", "invoice.payment_succeeded"];
const INITIAL_BILLING_REASON = "subscription_create";

export interface RenewalBackfillResult {
  replayed: number;
  confirmed: number;
}

interface LoggedInvoice {
  invoiceId: string;
  subscriptionId: string | null;
  billingReason: string | null;
  amountPaidMinor: number | null;
  currency: string | null;
  customerId: string | null;
  paymentIntentId: string | null;
  paidAtSec: number | null;
  periodEndSec: number | null;
}

/** Paid, non-initial invoices from the webhook log without a recorded payment */
async function unrecordedLoggedRenewals(): Promise<LoggedInvoice[]> {
  const object = sql`((${paymentWebhooks.data} #>> '{}')::jsonb -> 'data' -> 'object')`;
  const rows = await db
    .selectDistinctOn([sql`${object} ->> 'id'`], {
      invoiceId: sql<string>`${object} ->> 'id'`,
      subscriptionId: sql<
        string | null
      >`COALESCE(${object} #>> '{parent,subscription_details,subscription}', ${object} ->> 'subscription')`,
      billingReason: sql<string | null>`${object} ->> 'billing_reason'`,
      amountPaidMinor: sql<
        number | null
      >`(${object} ->> 'amount_paid')::integer`,
      currency: sql<string | null>`${object} ->> 'currency'`,
      customerId: sql<string | null>`${object} ->> 'customer'`,
      paymentIntentId: sql<string | null>`${object} ->> 'payment_intent'`,
      paidAtSec: sql<
        number | null
      >`(${object} #>> '{status_transitions,paid_at}')::bigint`,
      periodEndSec: sql<
        number | null
      >`(${object} #>> '{lines,data,0,period,end}')::bigint`,
    })
    .from(paymentWebhooks)
    .where(
      and(
        inArray(paymentWebhooks.eventType, PAID_INVOICE_EVENTS),
        lt(paymentWebhooks.createdAt, RENEWAL_RECORDING_START),
        sql`${object} ->> 'billing_reason' IS DISTINCT FROM ${INITIAL_BILLING_REASON}`,
        sql`COALESCE((${object} ->> 'amount_paid')::integer, 0) > 0`,
        sql`NOT EXISTS (SELECT 1 FROM ${paymentTransactions} WHERE ${paymentTransactions.providerInvoiceId} = ${object} ->> 'id')`,
      ),
    )
    .orderBy(sql`${object} ->> 'id'`, paymentWebhooks.createdAt);
  return rows.map((r) => ({
    ...r,
    amountPaidMinor:
      r.amountPaidMinor === null ? null : Number(r.amountPaidMinor),
    paidAtSec: r.paidAtSec === null ? null : Number(r.paidAtSec),
    periodEndSec: r.periodEndSec === null ? null : Number(r.periodEndSec),
  }));
}

/** Owner of the invoice the way recordPaidRenewal resolves it */
async function invoiceOwner(invoice: LoggedInvoice): Promise<string | null> {
  if (invoice.subscriptionId) {
    const [sub] = await db
      .select({ userId: subscriptions.userId })
      .from(subscriptions)
      .where(eq(subscriptions.providerSubscriptionId, invoice.subscriptionId))
      .limit(1);
    if (sub?.userId) {
      return sub.userId;
    }
  }
  if (invoice.customerId) {
    const [owner] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.stripeCustomerId, invoice.customerId))
      .limit(1);
    return owner?.id ?? null;
  }
  return null;
}

export async function backfillReferredRenewalCommissions(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<RenewalBackfillResult> {
  const result: RenewalBackfillResult = { replayed: 0, confirmed: 0 };
  try {
    const candidates = await unrecordedLoggedRenewals();
    for (const invoice of candidates) {
      if (!invoice.subscriptionId) {
        continue;
      }
      const ownerId = await invoiceOwner(invoice);
      if (!ownerId) {
        continue;
      }
      const [referred] = await db
        .select({ id: userReferrals.id })
        .from(userReferrals)
        .where(eq(userReferrals.referredUserId, ownerId))
        .limit(1);
      if (!referred) {
        continue;
      }

      const paidAt = invoice.paidAtSec
        ? new Date(invoice.paidAtSec * 1000)
        : undefined;
      const recorded = await PaymentRenewalRepository.recordPaidRenewal(
        {
          invoiceId: invoice.invoiceId,
          subscriptionId: invoice.subscriptionId,
          billingReason: invoice.billingReason,
          amountPaidMinor: invoice.amountPaidMinor,
          currency: invoice.currency,
          customerId: invoice.customerId,
          paymentIntentId: invoice.paymentIntentId,
          paidAt,
          periodEnd: invoice.periodEndSec
            ? new Date(invoice.periodEndSec * 1000)
            : undefined,
        },
        logger,
        locale,
      );
      if (!recorded.success || !recorded.data.transactionId) {
        logger.error("Renewal backfill: invoice not recorded", {
          invoiceId: invoice.invoiceId,
          error: recorded.success ? "not attributable" : recorded.message,
        });
        continue;
      }
      // The commission was earned when the invoice was paid
      if (paidAt) {
        await db
          .update(referralEarnings)
          .set({ createdAt: paidAt })
          .where(
            and(
              eq(referralEarnings.transactionId, recorded.data.transactionId),
              eq(referralEarnings.status, ReferralEarningStatus.PENDING),
              gt(referralEarnings.createdAt, paidAt),
            ),
          );
      }
      result.replayed++;
      logger.info("Renewal backfill: missed renewal commission booked", {
        invoiceId: invoice.invoiceId,
        transactionId: recorded.data.transactionId,
        revenueUsdCents: recorded.data.revenueUsdCents,
      });
    }

    if (result.replayed > 0) {
      const confirmed = await ReferralRepository.confirmMaturedEarnings(
        logger,
        creditsScopedTranslation.scopedT(locale).t,
      );
      if (confirmed.success) {
        result.confirmed = confirmed.data.confirmedCount;
      }
    }
    return result;
  } catch (error) {
    logger.error("Renewal backfill failed", parseError(error));
    return result;
  }
}
