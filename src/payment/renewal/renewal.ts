/**
 * Subscription renewal payments
 *
 * A paid renewal invoice (Stripe `invoice.paid` / `invoice.payment_succeeded`
 * for every billing reason except `subscription_create`, which the checkout
 * flow records) becomes a payment transaction, and the referral chain earns
 * its commission on the amount actually paid, exactly like a first payment:
 * same shares, same hold period, same clawback on refund / dispute.
 *
 * Idempotency: the transaction is keyed by the provider invoice id
 * (`payment_transactions.provider_invoice_id`, UNIQUE) and the earnings by
 * (transaction, earner, level), so Stripe's two events per paid invoice,
 * retries and concurrent deliveries book the renewal exactly once.
 *
 * Refund mapping: invoices no longer carry their payment intent (Stripe API
 * 2025-03-31+); `invoice_payment.paid` does. Whichever of the two events lands
 * second links the payment intent to the transaction, so a later
 * `charge.refunded` maps straight to it.
 */

import "server-only";

import { and, eq, isNull, sql } from "drizzle-orm";
import {
  type CountryLanguage,
  CurrenciesArr,
} from "next-vibe/core/i18n/core/config";
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

import { ProductIds, productsRepository } from "@/products/repository-client";
import { paidMinorToUsdCents } from "@/referral/commission";
import { ReferralRepository } from "@/referral/repository";
import { subscriptions } from "@/subscription/db";
import { subscriptionRenewalSessionKey } from "@/subscription/renewal-key";

import { paymentTransactions, paymentWebhooks } from "../db";
import { CheckoutMode, PaymentProvider, PaymentStatus } from "../enum";
import { scopedTranslation } from "../i18n";

/** Stripe billing reason of the first invoice (recorded by the checkout flow) */
const INITIAL_BILLING_REASON = "subscription_create";

/** Provider event that carries an invoice's payment intent */
const INVOICE_PAYMENT_PAID_EVENT = "invoice_payment.paid";

export interface PaidRenewalInvoice {
  /** Provider invoice id (Stripe `in_...`) */
  invoiceId: string;
  /** Provider subscription id */
  subscriptionId: string;
  billingReason: string | null;
  /** Amount actually paid, smallest currency unit */
  amountPaidMinor: number | null;
  /** ISO currency of amountPaidMinor (any case) */
  currency: string | null;
  /** Provider customer id: owner fallback when the subscription row is missing */
  customerId: string | null;
  /** Payment intent, when the event carries it */
  paymentIntentId: string | null;
}

export interface RenewalRecordResult {
  /** Null when nothing was recorded (initial invoice, $0, unattributable) */
  transactionId: string | null;
  /** Commission base in USD cents (null when not booked) */
  revenueUsdCents: number | null;
}

export class PaymentRenewalRepository {
  /**
   * Record a paid renewal invoice and book its referral commission.
   * Safe to call any number of times, concurrently, for the same invoice.
   * Fails only on a database error (the webhook then stays unprocessed and
   * the provider retries).
   */
  static async recordPaidRenewal(
    invoice: PaidRenewalInvoice,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<RenewalRecordResult>> {
    const none: RenewalRecordResult = {
      transactionId: null,
      revenueUsdCents: null,
    };
    try {
      if (invoice.billingReason === INITIAL_BILLING_REASON) {
        // First invoice: checkout.session.completed records it and books its
        // commission from the checkout amount.
        return success(none);
      }
      const amountPaidMinor = invoice.amountPaidMinor ?? 0;
      if (amountPaidMinor <= 0) {
        logger.debug("Renewal invoice paid nothing - no payment recorded", {
          invoiceId: invoice.invoiceId,
          billingReason: invoice.billingReason,
        });
        return success(none);
      }

      const invoiceCurrency = (invoice.currency ?? "").toUpperCase();
      const currency = CurrenciesArr.find((c) => c === invoiceCurrency);
      if (!currency) {
        logger.error(
          "Renewal not recorded: unsupported invoice currency - review manually",
          {
            invoiceId: invoice.invoiceId,
            subscriptionId: invoice.subscriptionId,
            currency: invoice.currency,
            amountPaidMinor,
          },
        );
        return success(none);
      }

      // Owner: the subscription row, else the provider customer
      const [subscription] = await db
        .select({
          userId: subscriptions.userId,
          provider: subscriptions.provider,
          currentPeriodEnd: subscriptions.currentPeriodEnd,
        })
        .from(subscriptions)
        .where(eq(subscriptions.providerSubscriptionId, invoice.subscriptionId))
        .limit(1);
      let userId = subscription?.userId ?? null;
      if (!userId && invoice.customerId) {
        const [owner] = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.stripeCustomerId, invoice.customerId))
          .limit(1);
        userId = owner?.id ?? null;
      }
      if (!userId) {
        logger.error(
          "Paid renewal could not be attributed to a user - review manually",
          {
            invoiceId: invoice.invoiceId,
            subscriptionId: invoice.subscriptionId,
            customerId: invoice.customerId,
            amountPaidMinor,
            currency,
          },
        );
        return success(none);
      }

      // The renewal credit grant is keyed by subscription + period end; storing
      // that key as the session id lets a refund revoke exactly those credits.
      const creditSessionId = subscription?.currentPeriodEnd
        ? subscriptionRenewalSessionKey(
            invoice.subscriptionId,
            subscription.currentPeriodEnd.getTime(),
          )
        : null;

      const [inserted] = await db
        .insert(paymentTransactions)
        .values({
          userId,
          providerInvoiceId: invoice.invoiceId,
          providerSessionId: creditSessionId,
          providerPaymentIntentId: invoice.paymentIntentId,
          amount: (amountPaidMinor / 100).toFixed(2),
          currency,
          status: PaymentStatus.SUCCEEDED,
          provider: subscription?.provider ?? PaymentProvider.STRIPE,
          mode: CheckoutMode.SUBSCRIPTION,
          metadata: {
            type: "subscription_renewal",
            subscriptionId: invoice.subscriptionId,
            invoiceId: invoice.invoiceId,
            billingReason: invoice.billingReason ?? "",
          },
        })
        .onConflictDoNothing({ target: paymentTransactions.providerInvoiceId })
        .returning({ id: paymentTransactions.id });

      let transactionId = inserted?.id ?? null;
      if (!transactionId) {
        const [existing] = await db
          .select({ id: paymentTransactions.id })
          .from(paymentTransactions)
          .where(eq(paymentTransactions.providerInvoiceId, invoice.invoiceId))
          .limit(1);
        transactionId = existing?.id ?? null;
      }
      if (!transactionId) {
        // Conflict on insert but no row on read: only possible if it was
        // deleted in between. Let the provider retry.
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.server.detail", {
            error: `renewal transaction for ${invoice.invoiceId} vanished`,
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Link the payment intent. Read AFTER the insert: if invoice_payment.paid
      // was handled before this row existed, its event is already in the log.
      const paymentIntentId =
        invoice.paymentIntentId ??
        (await PaymentRenewalRepository.paymentIntentFromWebhookLog(
          invoice.invoiceId,
        ));
      if (paymentIntentId) {
        await PaymentRenewalRepository.linkInvoicePaymentIntent(
          invoice.invoiceId,
          paymentIntentId,
          logger,
        );
      }

      const revenueUsdCents = paidMinorToUsdCents(amountPaidMinor, currency);
      if (revenueUsdCents === null) {
        logger.error(
          "Renewal referral payout skipped: currency has no USD rate - review manually",
          { transactionId, invoiceId: invoice.invoiceId, currency },
        );
        return success({ transactionId, revenueUsdCents: null });
      }

      const payout = await ReferralRepository.applyReferralPayoutOnPayment(
        transactionId,
        userId,
        revenueUsdCents,
        logger,
        locale,
        productsRepository.getProduct(ProductIds.SUBSCRIPTION, locale).credits,
      );
      if (!payout.success) {
        return payout;
      }

      logger.info("Subscription renewal recorded", {
        transactionId,
        invoiceId: invoice.invoiceId,
        subscriptionId: invoice.subscriptionId,
        userId,
        amountPaidMinor,
        currency,
        revenueUsdCents,
        created: Boolean(inserted),
      });
      return success({ transactionId, revenueUsdCents });
    } catch (error) {
      logger.error("Failed to record subscription renewal", parseError(error), {
        invoiceId: invoice.invoiceId,
        subscriptionId: invoice.subscriptionId,
      });
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.server.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Attach a payment intent to the payment that settled this invoice (renewal
   * row, or the checkout row of the first invoice). Never overwrites one.
   */
  static async linkInvoicePaymentIntent(
    invoiceId: string,
    paymentIntentId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    const linked = await db
      .update(paymentTransactions)
      .set({ providerPaymentIntentId: paymentIntentId, updatedAt: new Date() })
      .where(
        and(
          eq(paymentTransactions.providerInvoiceId, invoiceId),
          isNull(paymentTransactions.providerPaymentIntentId),
        ),
      )
      .returning({ id: paymentTransactions.id });
    if (linked.length > 0) {
      logger.debug("Linked payment intent to invoice payment", {
        invoiceId,
        paymentIntentId,
      });
    }
  }

  /**
   * Payment intent of an invoice from an already received
   * `invoice_payment.paid` event (raw bodies are kept in payment_webhooks).
   */
  static async paymentIntentFromWebhookLog(
    invoiceId: string,
  ): Promise<string | null> {
    const object = sql`((${paymentWebhooks.data} #>> '{}')::jsonb -> 'data' -> 'object')`;
    const [row] = await db
      .select({
        paymentIntentId: sql<
          string | null
        >`${object} -> 'payment' ->> 'payment_intent'`,
      })
      .from(paymentWebhooks)
      .where(
        and(
          eq(paymentWebhooks.eventType, INVOICE_PAYMENT_PAID_EVENT),
          sql`${object} ->> 'invoice' = ${invoiceId}`,
        ),
      )
      .limit(1);
    return row?.paymentIntentId ?? null;
  }

  /**
   * Checkout of a subscription: remember its first invoice so the
   * `invoice_payment.paid` of that invoice can link the payment intent
   * (subscription-mode checkout sessions carry none) and a refund of the
   * first payment maps to its transaction.
   */
  static async linkCheckoutInvoice(
    transactionId: string,
    invoiceId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      await db
        .update(paymentTransactions)
        .set({ providerInvoiceId: invoiceId, updatedAt: new Date() })
        .where(
          and(
            eq(paymentTransactions.id, transactionId),
            isNull(paymentTransactions.providerInvoiceId),
          ),
        );
      const paymentIntentId =
        await PaymentRenewalRepository.paymentIntentFromWebhookLog(invoiceId);
      if (paymentIntentId) {
        await PaymentRenewalRepository.linkInvoicePaymentIntent(
          invoiceId,
          paymentIntentId,
          logger,
        );
      }
    } catch (error) {
      // Not fatal: credits and commission are already booked; only refund
      // mapping of this payment falls back to the customer/time match.
      logger.error("Failed to link checkout invoice", parseError(error), {
        transactionId,
        invoiceId,
      });
    }
  }
}
