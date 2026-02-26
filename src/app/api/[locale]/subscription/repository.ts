/**
 * Subscription Repository
 * Business logic for subscription operations - provider-agnostic
 */

import "server-only";

import { desc, eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import type Stripe from "stripe";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as checkoutScopedTranslation } from "../payment/checkout/i18n";
import { SubscriptionCheckoutRepositoryImpl } from "../payment/checkout/repository";
import { PaymentProvider, type PaymentProviderValue } from "../payment/enum";
import { getPaymentProvider } from "../payment/providers";
import { stripe as getStripe } from "../payment/providers/stripe/repository";
import type { WebhookData } from "../payment/providers/types";
import type { JwtPrivatePayloadType } from "../user/auth/types";
import type {
  SubscriptionCancelDeleteRequestOutput,
  SubscriptionCancelDeleteResponseOutput,
} from "./cancel/definition";
import type {
  SubscriptionCreatePostRequestOutput,
  SubscriptionCreatePostResponseOutput,
} from "./create/definition";
import type { NewSubscription } from "./db";
import { subscriptions } from "./db";
import type { SubscriptionGetResponseOutput } from "./definition";
import type {
  BillingIntervalDB,
  SubscriptionPlanDB,
  SubscriptionStatusValue,
} from "./enum";
import { SubscriptionPlan, SubscriptionStatus } from "./enum";
import { scopedTranslation } from "./i18n";
import type {
  SubscriptionUpdatePutRequestOutput,
  SubscriptionUpdatePutResponseOutput,
} from "./update/definition";

/**
 * Map Stripe subscription status to our subscription status.
 * Exhaustive over Stripe.Subscription.Status — adding a new Stripe status will
 * cause a compile error, forcing us to handle it explicitly.
 */
const STRIPE_STATUS_MAP: Record<
  Stripe.Subscription.Status,
  typeof SubscriptionStatusValue
> = {
  active: SubscriptionStatus.ACTIVE,
  trialing: SubscriptionStatus.TRIALING,
  canceled: SubscriptionStatus.CANCELED,
  incomplete_expired: SubscriptionStatus.INCOMPLETE_EXPIRED,
  past_due: SubscriptionStatus.PAST_DUE,
  unpaid: SubscriptionStatus.UNPAID,
  paused: SubscriptionStatus.PAUSED,
  incomplete: SubscriptionStatus.INCOMPLETE,
};

/**
 * Check if a plan ID matches the subscription plan.
 * Handles both legacy prefixed values ('app.api.subscription.enums.plan.subscription')
 * and current short values ('enums.plan.subscription') stored in the DB.
 */
function isSubscriptionPlan(planId: string): boolean {
  return (
    planId === SubscriptionPlan.SUBSCRIPTION ||
    planId.endsWith(`.${SubscriptionPlan.SUBSCRIPTION}`)
  );
}

/**
 * Generate canonical idempotency key for subscription credit grants.
 * Shared across all credit grant paths (invoice handler, subscription.updated, auto-sync)
 * to prevent duplicate grants from different webhook/sync triggers.
 */
function renewalSessionKey(
  providerSubscriptionId: string,
  periodEndMs: number,
): string {
  return `renewal_${providerSubscriptionId}_${periodEndMs}`;
}

/**
 * Calculate current period dates from Stripe subscription
 * Stripe API 2025-12-15.clover removed current_period_start/end from response
 */
function calculateSubscriptionPeriod(subscription: Stripe.Subscription): {
  currentPeriodStart: number;
  currentPeriodEnd: number;
} {
  // Prefer actual period dates from subscription item (most accurate)
  const item = subscription.items.data[0];
  if (item?.current_period_start && item?.current_period_end) {
    return {
      currentPeriodStart: item.current_period_start,
      currentPeriodEnd: item.current_period_end,
    };
  }

  // Fallback: Calculate current period from billing_cycle_anchor + interval
  const anchor =
    subscription.billing_cycle_anchor ||
    subscription.start_date ||
    subscription.created;
  const billingInterval = item?.plan.interval || "month";
  const intervalCount = item?.plan.interval_count || 1;

  const now = Math.floor(Date.now() / 1000);
  let periodStart = anchor;
  let periodEnd = anchor;

  // Advance period-by-period until we find the one containing "now"
  for (let i = 0; i < 120; i++) {
    const d = new Date(periodEnd * 1000);
    if (billingInterval === "month") {
      d.setMonth(d.getMonth() + intervalCount);
    } else if (billingInterval === "year") {
      d.setFullYear(d.getFullYear() + intervalCount);
    } else if (billingInterval === "week") {
      d.setDate(d.getDate() + 7 * intervalCount);
    } else if (billingInterval === "day") {
      d.setDate(d.getDate() + intervalCount);
    } else {
      d.setMonth(d.getMonth() + 1);
    }
    const nextEnd = Math.floor(d.getTime() / 1000);

    if (nextEnd > now) {
      periodStart = periodEnd;
      periodEnd = nextEnd;
      break;
    }
    periodEnd = nextEnd;
  }

  return {
    currentPeriodStart: periodStart,
    currentPeriodEnd: periodEnd,
  };
}

/**
 * Subscription Repository - Static class pattern
 */
export class SubscriptionRepository {
  static async getSubscription(
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const results = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .orderBy(desc(subscriptions.createdAt))
        .limit(1);

      if (results.length === 0) {
        return fail({
          message: t("errors.not_found"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      let subscription = results[0];

      // AUTOMATIC SYNC: Verify subscription with Stripe if it has a provider ID
      // This handles cases where webhooks were missed or subscription changed in Stripe
      if (subscription.providerSubscriptionId) {
        const needsSync =
          subscription.status === SubscriptionStatus.ACTIVE ||
          (subscription.currentPeriodEnd &&
            new Date(subscription.currentPeriodEnd) < new Date());

        if (needsSync) {
          try {
            const stripeResponse = await getStripe.subscriptions.retrieve(
              subscription.providerSubscriptionId,
            );

            const { currentPeriodStart, currentPeriodEnd } =
              calculateSubscriptionPeriod(stripeResponse);

            const newStatus = STRIPE_STATUS_MAP[stripeResponse.status];

            // Update if status or period changed
            const periodChanged =
              subscription.currentPeriodEnd &&
              currentPeriodEnd * 1000 !==
                subscription.currentPeriodEnd.getTime();

            // Check if period advanced forward (renewal happened)
            const periodAdvanced =
              periodChanged &&
              subscription.currentPeriodEnd &&
              currentPeriodEnd * 1000 > subscription.currentPeriodEnd.getTime();

            if (newStatus !== subscription.status || periodChanged) {
              logger.info("Auto-syncing subscription from Stripe", {
                userId,
                oldStatus: subscription.status,
                newStatus,
                periodChanged,
                periodAdvanced,
                oldPeriodEnd: subscription.currentPeriodEnd,
                newPeriodEnd: new Date(currentPeriodEnd * 1000),
              });

              const [updated] = await db
                .update(subscriptions)
                .set({
                  status: newStatus,
                  currentPeriodStart: new Date(currentPeriodStart * 1000),
                  currentPeriodEnd: new Date(currentPeriodEnd * 1000),
                  cancelAtPeriodEnd: stripeResponse.cancel_at_period_end,
                  cancelAt: stripeResponse.cancel_at
                    ? new Date(stripeResponse.cancel_at * 1000)
                    : null,
                  // Clear grace period fields on successful renewal
                  paymentFailedAt: null,
                  gracePeriodEndsAt: null,
                  updatedAt: new Date(),
                })
                .where(eq(subscriptions.id, subscription.id))
                .returning();

              if (updated) {
                subscription = updated;
              }

              // Grant renewal credits if period advanced (missed webhook recovery)
              if (periodAdvanced && newStatus === SubscriptionStatus.ACTIVE) {
                try {
                  const { CreditRepository } =
                    await import("../credits/repository");
                  const { scopedTranslation: creditsScopedTranslation } =
                    await import("../credits/i18n");
                  const { productsRepository, ProductIds } =
                    await import("../products/repository-client");
                  const { t: creditsT } =
                    creditsScopedTranslation.scopedT(locale);

                  const productId = isSubscriptionPlan(subscription.planId)
                    ? ProductIds.SUBSCRIPTION
                    : null;

                  if (productId) {
                    const product = productsRepository.getProduct(
                      productId,
                      locale,
                    );
                    // Credits expire at exact period end — new period credits are pre-granted via invoice.paid
                    const expiresAt = new Date(currentPeriodEnd * 1000);

                    // Canonical idempotency key shared across all credit grant paths
                    // Prevents duplicate grants from invoice handler, subscription.updated, and auto-sync
                    const sessionId = renewalSessionKey(
                      subscription.providerSubscriptionId ?? subscription.id,
                      currentPeriodEnd * 1000,
                    );

                    logger.info(
                      "Auto-granting renewal credits (missed webhook)",
                      {
                        userId,
                        credits: product.credits,
                        expiresAt: expiresAt.toISOString(),
                        sessionId,
                      },
                    );

                    await CreditRepository.addUserCredits(
                      userId,
                      product.credits,
                      "subscription",
                      logger,
                      creditsT,
                      expiresAt,
                      sessionId,
                    );

                    logger.info("Successfully auto-granted renewal credits", {
                      userId,
                      credits: product.credits,
                      sessionId,
                    });
                  }
                } catch (creditError) {
                  logger.error("Failed to auto-grant renewal credits", {
                    error: parseError(creditError),
                    userId,
                  });
                  // Don't fail the whole sync if credit granting fails
                }
              }
            }
          } catch (error) {
            const stripeError = error as { code?: string };
            // If subscription not found in Stripe, mark as canceled
            if (stripeError.code === "resource_missing") {
              logger.warn(
                "Subscription not found in Stripe - marking as canceled",
                {
                  userId,
                  subscriptionId: subscription.providerSubscriptionId,
                },
              );

              const [updated] = await db
                .update(subscriptions)
                .set({
                  status: SubscriptionStatus.CANCELED,
                  canceledAt: new Date(),
                  endedAt: subscription.currentPeriodEnd || new Date(),
                  providerSubscriptionId: null, // Clear invalid subscription ID
                  updatedAt: new Date(),
                })
                .where(eq(subscriptions.id, subscription.id))
                .returning();

              if (updated) {
                subscription = updated;
              }
            } else {
              // Log error but don't fail - return cached subscription
              logger.error("Failed to verify subscription with Stripe", {
                error: parseError(error),
                userId,
              });
            }
          }
        }

        // Safety net: If subscription is active with a valid future period,
        // ensure renewal credits exist. Catches cases where the webhook or
        // auto-sync updated the period but credit granting silently failed.
        if (
          subscription.status === SubscriptionStatus.ACTIVE &&
          subscription.currentPeriodEnd &&
          new Date(subscription.currentPeriodEnd) > new Date() &&
          subscription.providerSubscriptionId
        ) {
          try {
            const { creditPacks } = await import("../credits/db");
            const periodEndMs = subscription.currentPeriodEnd.getTime();
            const expectedSessionId = renewalSessionKey(
              subscription.providerSubscriptionId,
              periodEndMs,
            );

            const [existingPack] = await db
              .select({ id: creditPacks.id })
              .from(creditPacks)
              .where(
                sql`${creditPacks.metadata}->>'sessionId' = ${expectedSessionId}`,
              )
              .limit(1);

            if (!existingPack) {
              const { CreditRepository } =
                await import("../credits/repository");
              const { scopedTranslation: creditsScopedTranslation } =
                await import("../credits/i18n");
              const { productsRepository, ProductIds } =
                await import("../products/repository-client");
              const { t: creditsT } = creditsScopedTranslation.scopedT(locale);

              const productId = isSubscriptionPlan(subscription.planId)
                ? ProductIds.SUBSCRIPTION
                : null;

              if (productId) {
                const product = productsRepository.getProduct(
                  productId,
                  locale,
                );
                const expiresAt = new Date(periodEndMs);

                logger.info("Safety-net: granting missing renewal credits", {
                  userId,
                  credits: product.credits,
                  expiresAt: expiresAt.toISOString(),
                  sessionId: expectedSessionId,
                });

                await CreditRepository.addUserCredits(
                  userId,
                  product.credits,
                  "subscription",
                  logger,
                  creditsT,
                  expiresAt,
                  expectedSessionId,
                );

                logger.info(
                  "Safety-net: successfully granted renewal credits",
                  {
                    userId,
                    credits: product.credits,
                    sessionId: expectedSessionId,
                  },
                );
              }
            }
          } catch (creditError) {
            logger.error("Safety-net credit grant failed", {
              error: parseError(creditError),
              userId,
            });
            // Don't fail the whole request if safety net fails
          }
        }
      }

      return success({
        id: subscription.id,
        plan: subscription.planId,
        billingInterval: subscription.billingInterval,
        status: subscription.status,
        currentPeriodStart:
          subscription.currentPeriodStart?.toISOString() ||
          new Date().toISOString(),
        currentPeriodEnd:
          subscription.currentPeriodEnd?.toISOString() ||
          new Date().toISOString(),
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        cancelAt: subscription.cancelAt?.toISOString(),
        canceledAt: subscription.canceledAt?.toISOString(),
        endedAt: subscription.endedAt?.toISOString(),
        provider: subscription.provider,
        providerSubscriptionId:
          subscription.providerSubscriptionId || undefined,
        createdAt: subscription.createdAt.toISOString(),
        updatedAt: subscription.updatedAt.toISOString(),
      });
    } catch (error) {
      logger.error("Error getting subscription:", parseError(error));
      return fail({
        message: t("errors.database_error"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  static async createSubscription(
    data: SubscriptionCreatePostRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionCreatePostResponseOutput>> {
    logger.debug("Proxying subscription creation to checkout flow", {
      userId: user.id,
      plan: data.plan,
      billingInterval: data.billingInterval,
      provider: data.provider,
    });

    // Create checkout session via checkout repository
    const { t: checkoutT } = checkoutScopedTranslation.scopedT(locale);
    const checkoutRepo = new SubscriptionCheckoutRepositoryImpl();
    return await checkoutRepo.createCheckoutSession(
      {
        planId: data.plan,
        billingInterval: data.billingInterval,
        provider: data.provider,
      },
      user,
      locale,
      logger,
      checkoutT,
    );
  }

  static async updateSubscription(
    data: SubscriptionUpdatePutRequestOutput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionUpdatePutResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const currentSubscription = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .limit(1);

      if (!currentSubscription[0]) {
        return fail({
          message: t("errors.not_found"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: {
            error: t("errors.not_found_description"),
          },
        });
      }

      const updateData: Partial<NewSubscription> = {
        updatedAt: new Date(),
      };

      if (data.plan) {
        updateData.planId = data.plan;
      }
      if (data.billingInterval) {
        updateData.billingInterval = data.billingInterval;
      }

      const results = await db
        .update(subscriptions)
        .set(updateData)
        .where(eq(subscriptions.userId, userId))
        .returning();

      if (results.length === 0) {
        return fail({
          message: t("errors.not_found"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: {
            error: t("errors.not_found_description"),
          },
        });
      }

      const updatedSubscription = results[0];
      return success({
        id: updatedSubscription.id,
        plan: updatedSubscription.planId,
        billingInterval: updatedSubscription.billingInterval,
        status: updatedSubscription.status,
        currentPeriodStart:
          updatedSubscription.currentPeriodStart?.toISOString() ||
          new Date().toISOString(),
        currentPeriodEnd:
          updatedSubscription.currentPeriodEnd?.toISOString() ||
          new Date().toISOString(),
        cancelAtPeriodEnd: updatedSubscription.cancelAtPeriodEnd,
        createdAt: updatedSubscription.createdAt.toISOString(),
        updatedAt: updatedSubscription.updatedAt.toISOString(),
        message: t("put.success.title"),
      });
    } catch (error) {
      logger.error("Error updating subscription:", parseError(error));
      return fail({
        message: t("errors.database_error"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  static async cancelSubscription(
    data: SubscriptionCancelDeleteRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionCancelDeleteResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const currentSubscription = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .limit(1);

      if (!currentSubscription[0]) {
        return fail({
          message: t("errors.not_found"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const subscription = currentSubscription[0];

      // If has provider subscription ID, cancel with provider
      if (subscription.providerSubscriptionId) {
        const provider = getPaymentProvider(subscription.provider || "stripe");
        const cancelResult = await provider.cancelSubscription(
          subscription.providerSubscriptionId,
          logger,
          locale,
        );

        if (!cancelResult.success) {
          return cancelResult;
        }
      }

      // Update local database
      const updateData: Partial<NewSubscription> = {
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
        updatedAt: new Date(),
      };

      if (data.cancelAtPeriodEnd) {
        updateData.canceledAt = new Date();
      } else {
        updateData.status = SubscriptionStatus.CANCELED;
        updateData.canceledAt = new Date();
        updateData.endedAt = new Date();
      }

      const results = await db
        .update(subscriptions)
        .set(updateData)
        .where(eq(subscriptions.userId, userId))
        .returning();

      if (results.length === 0) {
        return fail({
          message: t("errors.not_found"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({
        success: true,
        message: t("cancel.success"),
      });
    } catch (error) {
      logger.error("Error canceling subscription:", parseError(error));
      return fail({
        message: t("errors.cancel_failed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Handle subscription checkout webhook from payment provider
   * Called by payment repository when checkout.session.completed webhook received
   */
  static async handleSubscriptionCheckout(
    session: WebhookData,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<void> {
    try {
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;
      const billingInterval = session.metadata?.billingInterval;
      const providerSubscriptionId = session.subscription;

      if (!userId || !planId || !billingInterval) {
        logger.error("Missing required metadata in checkout session", {
          sessionId: session.id,
          userId,
          planId,
          billingInterval,
        });
        return;
      }

      if (!providerSubscriptionId) {
        logger.error("Missing provider subscription ID", {
          sessionId: session.id,
        });
        return;
      }

      const providerEnum =
        (session.metadata?.provider as typeof PaymentProviderValue) ||
        PaymentProvider.STRIPE;
      const providerKey =
        providerEnum === PaymentProvider.NOWPAYMENTS ? "nowpayments" : "stripe";
      const provider = getPaymentProvider(providerKey);
      const subscriptionResult = await provider.retrieveSubscription(
        providerSubscriptionId,
        logger,
        locale,
      );

      if (!subscriptionResult.success) {
        logger.error("Failed to retrieve subscription from provider", {
          providerSubscriptionId,
          error: subscriptionResult.message,
        });
        return;
      }

      await db
        .insert(subscriptions)
        .values({
          userId: userId,
          planId: planId as (typeof SubscriptionPlanDB)[number],
          billingInterval:
            billingInterval as (typeof BillingIntervalDB)[number],
          status: SubscriptionStatus.ACTIVE,
          provider: providerEnum,
          providerSubscriptionId,
          currentPeriodStart: subscriptionResult.data.currentPeriodStart
            ? new Date(subscriptionResult.data.currentPeriodStart)
            : new Date(),
          currentPeriodEnd: subscriptionResult.data.currentPeriodEnd
            ? new Date(subscriptionResult.data.currentPeriodEnd)
            : null,
        })
        .onConflictDoUpdate({
          target: subscriptions.userId,
          set: {
            status: SubscriptionStatus.ACTIVE,
            providerSubscriptionId,
            currentPeriodStart: subscriptionResult.data.currentPeriodStart
              ? new Date(subscriptionResult.data.currentPeriodStart)
              : new Date(),
            currentPeriodEnd: subscriptionResult.data.currentPeriodEnd
              ? new Date(subscriptionResult.data.currentPeriodEnd)
              : null,
            updatedAt: new Date(),
          },
        });

      // Look up user's locale from DB for credit/product translations
      let userLocale: CountryLanguage = locale;
      if (userId) {
        const { users: usersTable } = await import("../user/db");

        const [userRow] = await db
          .select({ locale: usersTable.locale })
          .from(usersTable)
          .where(eq(usersTable.id, userId))
          .limit(1);
        if (userRow?.locale) {
          userLocale = userRow.locale;
        }
      }

      // Add subscription credits with expiration date
      const { CreditRepository } = await import("../credits/repository");
      const { scopedTranslation: creditsScopedTranslation } =
        await import("../credits/i18n");
      const { productsRepository, ProductIds } =
        await import("../products/repository-client");
      const { t: creditsT } = creditsScopedTranslation.scopedT(userLocale);

      // Map subscription plan to product ID
      const productId =
        planId === SubscriptionPlan.SUBSCRIPTION
          ? ProductIds.SUBSCRIPTION
          : null;

      if (productId) {
        const product = productsRepository.getProduct(productId, userLocale);
        const periodEnd = subscriptionResult.data.currentPeriodEnd
          ? new Date(subscriptionResult.data.currentPeriodEnd)
          : null;
        // Credits expire at exact period end — no grace buffer needed
        const expiresAt = periodEnd;

        // IDEMPOTENCY CHECK: Verify credits haven't been added for this checkout session already
        const { creditPacks } = await import("../credits/db");

        const [existingPack] = await db
          .select()
          .from(creditPacks)
          .where(sql`${creditPacks.metadata}->>'sessionId' = ${session.id}`)
          .limit(1);

        if (existingPack) {
          logger.info("Subscription credits already processed for session", {
            sessionId: session.id,
            packId: existingPack.id,
            userId,
          });
          return; // Idempotent - already processed
        }

        await CreditRepository.addUserCredits(
          userId,
          product.credits,
          "subscription",
          logger,
          creditsT,
          expiresAt ?? undefined,
          session.id, // Pass sessionId for idempotency tracking
        );
        logger.debug("Added subscription credits", {
          userId,
          credits: product.credits,
          expiresAt: expiresAt?.toISOString(),
          sessionId: session.id,
        });
      }

      logger.debug("Subscription checkout processed successfully", {
        userId,
        providerSubscriptionId,
      });
    } catch (error) {
      logger.error("Failed to process subscription checkout", {
        error: parseError(error),
        sessionId: session.id,
      });
    }
  }

  /**
   * Handle invoice.created webhook — pre-grant credits before payment confirmation.
   * This ensures users have credits immediately when a new billing period starts.
   * Idempotency: uses renewalSessionKey() so duplicate webhooks or later invoice.paid
   * events won't double-grant.
   */
  static async handleInvoiceCreated(
    invoice: WebhookData,
    subscriptionId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<void> {
    try {
      const invoiceId = invoice.id;
      const billingReason = invoice.billing_reason;

      logger.info("Processing invoice created for credit pre-grant", {
        invoiceId,
        subscriptionId,
        billingReason,
      });

      // Skip initial checkout invoice — handled separately by checkout flow
      if (billingReason === "subscription_create") {
        logger.info("Skipping credit pre-grant - initial checkout invoice", {
          billingReason,
          invoiceId,
        });
        return;
      }

      // Skip voided or $0 invoices — don't pre-grant credits for non-chargeable invoices
      if (invoice.status === "void" || invoice.status === "uncollectible") {
        logger.info(
          "Skipping credit pre-grant - invoice is void/uncollectible",
          {
            invoiceId,
            status: invoice.status,
          },
        );
        return;
      }
      if (
        invoice.amount_total !== undefined &&
        invoice.amount_total !== null &&
        invoice.amount_total <= 0
      ) {
        logger.info("Skipping credit pre-grant - $0 or negative invoice", {
          invoiceId,
          amountTotal: invoice.amount_total,
        });
        return;
      }

      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.providerSubscriptionId, subscriptionId))
        .limit(1);

      if (!subscription) {
        logger.error("Subscription not found for invoice created", {
          subscriptionId,
          invoiceId,
        });
        return;
      }

      const providerName = subscription.provider || "stripe";
      const provider = getPaymentProvider(providerName);
      const subscriptionResult = await provider.retrieveSubscription(
        subscriptionId,
        logger,
        locale,
      );

      if (!subscriptionResult.success) {
        logger.error("Failed to retrieve subscription for credit pre-grant", {
          subscriptionId,
          error: subscriptionResult.message,
        });
        return;
      }

      // Import credit dependencies
      const { CreditRepository } = await import("../credits/repository");
      const { scopedTranslation: creditsScopedTranslation } =
        await import("../credits/i18n");
      const { productsRepository, ProductIds } =
        await import("../products/repository-client");

      // Look up user's locale for translations
      let userLocale: CountryLanguage = locale;
      {
        const { users: usersTable } = await import("../user/db");

        const [userRow] = await db
          .select({ locale: usersTable.locale })
          .from(usersTable)
          .where(eq(usersTable.id, subscription.userId))
          .limit(1);
        if (userRow?.locale) {
          userLocale = userRow.locale;
        }
      }
      const { t: creditsT } = creditsScopedTranslation.scopedT(userLocale);

      const productId = isSubscriptionPlan(subscription.planId)
        ? ProductIds.SUBSCRIPTION
        : null;

      if (!productId) {
        logger.warn("No product ID found for subscription plan", {
          planId: subscription.planId,
          invoiceId,
        });
        return;
      }

      const product = productsRepository.getProduct(productId, userLocale);
      const periodEnd = subscriptionResult.data.currentPeriodEnd
        ? new Date(subscriptionResult.data.currentPeriodEnd)
        : null;

      if (!periodEnd) {
        logger.error("Cannot pre-grant credits without period end date", {
          subscriptionId,
          invoiceId,
        });
        return;
      }

      const expiresAt = periodEnd;

      // Canonical idempotency key — shared with invoice.paid and subscription.updated
      const renewalSessionId = renewalSessionKey(
        subscriptionId,
        periodEnd.getTime(),
      );

      // Idempotency check
      {
        const { creditPacks } = await import("../credits/db");

        const [existingPack] = await db
          .select()
          .from(creditPacks)
          .where(
            sql`${creditPacks.metadata}->>'sessionId' = ${renewalSessionId}`,
          )
          .limit(1);

        if (existingPack) {
          logger.info("Credits already pre-granted for this period", {
            renewalSessionId,
            packId: existingPack.id,
            userId: subscription.userId,
          });
          return;
        }
      }

      logger.info("Pre-granting subscription credits", {
        userId: subscription.userId,
        credits: product.credits,
        expiresAt: expiresAt?.toISOString(),
        renewalSessionId,
        invoiceId,
      });

      await CreditRepository.addUserCredits(
        subscription.userId,
        product.credits,
        "subscription",
        logger,
        creditsT,
        expiresAt ?? undefined,
        renewalSessionId,
      );

      logger.info("Successfully pre-granted subscription credits", {
        userId: subscription.userId,
        credits: product.credits,
        invoiceId,
      });
    } catch (error) {
      logger.error("Failed to process invoice created", {
        error: parseError(error),
        subscriptionId,
      });
    }
  }

  /**
   * Handle invoice payment succeeded webhook from payment provider
   * Called by payment repository when invoice.payment_succeeded webhook received
   */
  static async handleInvoicePaymentSucceeded(
    invoice: WebhookData,
    subscriptionId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<void> {
    try {
      const invoiceId = invoice.id;
      const billingReason = invoice.billing_reason;

      logger.info("Processing invoice payment", {
        invoiceId,
        subscriptionId,
        billingReason,
      });

      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.providerSubscriptionId, subscriptionId))
        .limit(1);

      if (!subscription) {
        logger.error("Subscription not found for invoice payment", {
          subscriptionId,
          invoiceId,
        });
        return;
      }

      // Detect late payment: subscription was in PAST_DUE or CANCELED state
      const isLatePayment =
        subscription.status === SubscriptionStatus.PAST_DUE ||
        subscription.status === SubscriptionStatus.CANCELED;

      logger.info("Found subscription for invoice", {
        subscriptionId,
        userId: subscription.userId,
        currentStatus: subscription.status,
        isLatePayment,
      });

      const providerName = subscription.provider || "stripe";
      const provider = getPaymentProvider(providerName);
      const subscriptionResult = await provider.retrieveSubscription(
        subscriptionId,
        logger,
        locale,
      );

      if (!subscriptionResult.success) {
        logger.error("Failed to retrieve subscription from provider", {
          subscriptionId,
          error: subscriptionResult.message,
        });
        return;
      }

      // Update subscription period and clear grace period if it was set
      await db
        .update(subscriptions)
        .set({
          currentPeriodStart: subscriptionResult.data.currentPeriodStart
            ? new Date(subscriptionResult.data.currentPeriodStart)
            : new Date(),
          currentPeriodEnd: subscriptionResult.data.currentPeriodEnd
            ? new Date(subscriptionResult.data.currentPeriodEnd)
            : undefined,
          status: SubscriptionStatus.ACTIVE,
          paymentFailedAt: null, // Clear grace period fields
          gracePeriodEndsAt: null,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.providerSubscriptionId, subscriptionId));

      // Add monthly credits for renewal (skip only the initial checkout payment - handled separately)
      // Use deny-list: skip "subscription_create" which is the first invoice at checkout
      // All other billing reasons (subscription_cycle, subscription_update, undefined, etc.) should grant credits
      const isInitialCheckout = billingReason === "subscription_create";
      if (!isInitialCheckout) {
        logger.info("Processing renewal credits", {
          billingReason: billingReason ?? "undefined",
          invoiceId,
        });

        // This is a renewal - add monthly credits with expiration
        const { CreditRepository } = await import("../credits/repository");
        const { scopedTranslation: creditsScopedTranslation } =
          await import("../credits/i18n");
        const { productsRepository, ProductIds } =
          await import("../products/repository-client");

        // Look up user's locale from DB for credit/product translations
        let userLocaleForInvoice: CountryLanguage = locale;
        {
          const { users: usersTable } = await import("../user/db");

          const [userRow] = await db
            .select({ locale: usersTable.locale })
            .from(usersTable)
            .where(eq(usersTable.id, subscription.userId))
            .limit(1);
          if (userRow?.locale) {
            userLocaleForInvoice = userRow.locale;
          }
        }
        const { t: creditsT } =
          creditsScopedTranslation.scopedT(userLocaleForInvoice);

        const productId = isSubscriptionPlan(subscription.planId)
          ? ProductIds.SUBSCRIPTION
          : null;

        if (productId) {
          const product = productsRepository.getProduct(
            productId,
            userLocaleForInvoice,
          );
          const periodEnd = subscriptionResult.data.currentPeriodEnd
            ? new Date(subscriptionResult.data.currentPeriodEnd)
            : null;

          if (!periodEnd) {
            logger.error(
              "Cannot grant renewal credits without period end date",
              {
                subscriptionId,
                invoiceId,
              },
            );
            return;
          }

          // Credits expire at exact period end — no grace buffer needed
          const expiresAt = periodEnd;

          // Canonical idempotency key shared across all credit grant paths
          const renewalSessionId = renewalSessionKey(
            subscriptionId,
            periodEnd.getTime(),
          );

          // IDEMPOTENCY CHECK: Verify credits haven't been added for this period already
          {
            const { creditPacks } = await import("../credits/db");

            const [existingPack] = await db
              .select()
              .from(creditPacks)
              .where(
                sql`${creditPacks.metadata}->>'sessionId' = ${renewalSessionId}`,
              )
              .limit(1);

            if (existingPack) {
              logger.info("Renewal credits already processed for period", {
                renewalSessionId,
                packId: existingPack.id,
                userId: subscription.userId,
              });
              return; // Idempotent - already processed
            }
          }

          // For late payments, revive only the amount that was revoked (not the full pack).
          // This accounts for credits already consumed before revocation.
          let creditsToGrant = product.credits;

          if (isLatePayment) {
            const { creditTransactions: creditTxTable } =
              await import("../credits/db");
            const { CreditTransactionType } = await import("../credits/enum");

            // Look up revoked credits from this grace period only (not all-time).
            // Scope by paymentFailedAt — revocations happen after that timestamp.
            const scopeStart =
              subscription.paymentFailedAt ??
              subscription.currentPeriodEnd ??
              new Date(0);
            const revokedTxs = await db
              .select({ amount: creditTxTable.amount })
              .from(creditTxTable)
              .where(
                sql`${creditTxTable.type} = ${CreditTransactionType.EXPIRY}
                    AND ${creditTxTable.metadata}->>'reason' = 'subscription_grace_period_expired'
                    AND ${creditTxTable.createdAt} >= ${scopeStart}
                    AND ${creditTxTable.walletId} IN (
                      SELECT id FROM credit_wallets WHERE user_id = ${subscription.userId}
                    )`,
              );

            const totalRevoked = revokedTxs.reduce(
              (sum, tx) => sum + Math.abs(tx.amount),
              0,
            );

            if (totalRevoked > 0) {
              creditsToGrant = totalRevoked;
              logger.info("Late payment - reviving revoked credits", {
                userId: subscription.userId,
                totalRevoked,
                originalProductCredits: product.credits,
                scopeStart: scopeStart.toISOString(),
              });
            }
          }

          logger.info("Granting renewal credits", {
            userId: subscription.userId,
            credits: creditsToGrant,
            isLatePayment,
            expiresAt: expiresAt?.toISOString(),
            renewalSessionId,
          });

          await CreditRepository.addUserCredits(
            subscription.userId,
            creditsToGrant,
            "subscription",
            logger,
            creditsT,
            expiresAt ?? undefined,
            renewalSessionId,
          );

          logger.info("Successfully granted renewal credits", {
            userId: subscription.userId,
            credits: creditsToGrant,
            invoiceId,
          });
        } else {
          logger.warn("No product ID found for subscription plan", {
            planId: subscription.planId,
            invoiceId,
          });
        }
      } else {
        logger.info("Skipping credit grant - initial checkout invoice", {
          billingReason,
          invoiceId,
        });
      }

      logger.info("Invoice payment processed successfully", {
        subscriptionId,
        billingReason,
        invoiceId,
      });
    } catch (error) {
      logger.error("Failed to process invoice payment", {
        error: parseError(error),
        subscriptionId,
      });
    }
  }

  /**
   * Handle invoice payment failure
   * Called when invoice.payment_failed webhook is received
   * Sets grace period during which user keeps credits but subscription is in PAST_DUE
   */
  static async handleInvoicePaymentFailed(
    invoice: WebhookData,
    subscriptionId: string,
    logger: EndpointLogger,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
  ): Promise<void> {
    try {
      const invoiceId = invoice.id;

      logger.info("Processing invoice payment failure", {
        invoiceId,
        subscriptionId,
      });

      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.providerSubscriptionId, subscriptionId))
        .limit(1);

      if (!subscription) {
        logger.error("Subscription not found for failed invoice payment", {
          subscriptionId,
          invoiceId,
        });
        return;
      }

      logger.info("Found subscription for failed payment", {
        subscriptionId,
        userId: subscription.userId,
        currentStatus: subscription.status,
      });

      // Set grace period only on first failure (don't reset on Stripe retries)
      const GRACE_PERIOD_DAYS = 7;
      const now = new Date();
      const isFirstFailure = !subscription.paymentFailedAt;

      const gracePeriodEndsAt = isFirstFailure
        ? new Date(now.getTime() + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000)
        : subscription.gracePeriodEndsAt;

      await db
        .update(subscriptions)
        .set({
          status: SubscriptionStatus.PAST_DUE,
          paymentFailedAt: subscription.paymentFailedAt ?? now,
          gracePeriodEndsAt,
          updatedAt: now,
        })
        .where(eq(subscriptions.providerSubscriptionId, subscriptionId));

      logger.info("Set subscription to PAST_DUE with grace period", {
        subscriptionId,
        userId: subscription.userId,
        gracePeriodEndsAt: gracePeriodEndsAt?.toISOString(),
        isFirstFailure,
        gracePeriodDays: GRACE_PERIOD_DAYS,
      });

      // IMPORTANT: User still has access during grace period
      // Credits have already been granted for this period
      // They will expire when the subscription period ends, not when grace period ends
    } catch (error) {
      logger.error("Failed to process invoice payment failure", {
        error: parseError(error),
        subscriptionId,
      });
    }
  }

  /**
   * Handle subscription cancellation
   * Called when customer.subscription.deleted webhook is received
   */
  static async handleSubscriptionCanceled(
    subscriptionId: string,
    logger: EndpointLogger,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
  ): Promise<void> {
    try {
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.providerSubscriptionId, subscriptionId))
        .limit(1);

      if (!subscription) {
        logger.error("Subscription not found for cancellation", {
          subscriptionId,
        });
        return;
      }

      // Mark subscription as canceled with proper timestamps
      const now = new Date();
      await db
        .update(subscriptions)
        .set({
          status: SubscriptionStatus.CANCELED,
          canceledAt: subscription.canceledAt ?? now,
          endedAt: subscription.currentPeriodEnd ?? now,
          updatedAt: now,
        })
        .where(eq(subscriptions.providerSubscriptionId, subscriptionId));

      logger.debug("Subscription canceled successfully", {
        subscriptionId,
        userId: subscription.userId,
      });
    } catch (error) {
      logger.error("Failed to process subscription cancellation", {
        error: parseError(error),
        subscriptionId,
      });
    }
  }

  /**
   * Handle subscription update
   * Called when customer.subscription.updated webhook is received
   */
  static async handleSubscriptionUpdated(
    subscriptionId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<void> {
    try {
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.providerSubscriptionId, subscriptionId))
        .limit(1);

      if (!subscription) {
        logger.error("Subscription not found for update", {
          subscriptionId,
        });
        return;
      }

      // Fetch full subscription from Stripe to get all fields (webhook events may not include all fields)
      const fullSubscription =
        await getStripe.subscriptions.retrieve(subscriptionId);

      const status = STRIPE_STATUS_MAP[fullSubscription.status];

      // Check if period changed (renewal detected)
      const { currentPeriodStart, currentPeriodEnd } =
        calculateSubscriptionPeriod(fullSubscription);

      const oldPeriodEnd = subscription.currentPeriodEnd;
      const newPeriodEnd = new Date(currentPeriodEnd * 1000);
      const periodRenewed =
        oldPeriodEnd && newPeriodEnd.getTime() > oldPeriodEnd.getTime();

      // Update subscription with proper period information
      // Clear grace period fields when subscription is active again
      const isActive = status === SubscriptionStatus.ACTIVE;
      await db
        .update(subscriptions)
        .set({
          status,
          currentPeriodStart: new Date(currentPeriodStart * 1000),
          currentPeriodEnd: newPeriodEnd,
          cancelAtPeriodEnd: fullSubscription.cancel_at_period_end,
          cancelAt: fullSubscription.cancel_at
            ? new Date(fullSubscription.cancel_at * 1000)
            : null,
          ...(isActive
            ? { paymentFailedAt: null, gracePeriodEndsAt: null }
            : {}),
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.providerSubscriptionId, fullSubscription.id));

      // If period renewed, pre-grant credits regardless of payment status.
      // Idempotency key prevents double-granting if invoice.created already handled it.
      if (periodRenewed) {
        logger.info("Subscription period renewed - pre-granting credits", {
          userId: subscription.userId,
          oldPeriodEnd: oldPeriodEnd.toISOString(),
          newPeriodEnd: newPeriodEnd.toISOString(),
        });

        const { CreditRepository } = await import("../credits/repository");
        const { scopedTranslation: creditsScopedTranslation } =
          await import("../credits/i18n");
        const { productsRepository, ProductIds } =
          await import("../products/repository-client");

        // Look up user's locale from DB for credit/product translations
        let userLocaleForUpdate: CountryLanguage = locale;
        {
          const { users: usersTable } = await import("../user/db");

          const [userRow] = await db
            .select({ locale: usersTable.locale })
            .from(usersTable)
            .where(eq(usersTable.id, subscription.userId))
            .limit(1);
          if (userRow?.locale) {
            userLocaleForUpdate = userRow.locale;
          }
        }
        const { t: creditsT } =
          creditsScopedTranslation.scopedT(userLocaleForUpdate);

        const productId = isSubscriptionPlan(subscription.planId)
          ? ProductIds.SUBSCRIPTION
          : null;

        if (productId) {
          const product = productsRepository.getProduct(
            productId,
            userLocaleForUpdate,
          );

          // Canonical idempotency key shared across all credit grant paths
          const renewalSessionId = renewalSessionKey(
            fullSubscription.id,
            newPeriodEnd.getTime(),
          );

          // Check if credits already granted for this period
          const { creditPacks } = await import("../credits/db");

          const [existingPack] = await db
            .select()
            .from(creditPacks)
            .where(
              sql`${creditPacks.metadata}->>'sessionId' = ${renewalSessionId}`,
            )
            .limit(1);

          if (!existingPack) {
            // Credits expire at exact period end — no grace buffer needed
            await CreditRepository.addUserCredits(
              subscription.userId,
              product.credits,
              "subscription",
              logger,
              creditsT,
              newPeriodEnd,
              renewalSessionId,
            );

            logger.info("Granted renewal credits", {
              userId: subscription.userId,
              credits: product.credits,
              expiresAt: newPeriodEnd.toISOString(),
              renewalSessionId,
            });
          } else {
            logger.debug("Renewal credits already granted for this period", {
              userId: subscription.userId,
              renewalSessionId,
            });
          }
        }
      }

      logger.debug("Subscription updated successfully", {
        subscriptionId: fullSubscription.id,
        status,
        cancelAtPeriodEnd: fullSubscription.cancel_at_period_end,
        cancelAt: fullSubscription.cancel_at,
        periodRenewed,
      });
    } catch (error) {
      logger.error("Failed to process subscription update", {
        error: parseError(error),
        subscriptionId,
      });
    }
  }

  /**
   * Sync subscription with Stripe and expire old credits
   * Use this to fix subscription state mismatches
   */
  static async syncSubscriptionWithStripe(
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ message: string; changes: string[] }>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const changes: string[] = [];

      // Get local subscription
      const [localSubscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .limit(1);

      if (!localSubscription) {
        return fail({
          message: t("errors.not_found"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (!localSubscription.providerSubscriptionId) {
        return fail({
          message: t("errors.no_provider_id"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      logger.info("Syncing subscription with Stripe", {
        userId,
        subscriptionId: localSubscription.providerSubscriptionId,
      });

      // Try to fetch subscription from Stripe
      let stripeSubscription: Stripe.Subscription | null = null;
      try {
        stripeSubscription = await getStripe.subscriptions.retrieve(
          localSubscription.providerSubscriptionId,
        );
      } catch (error) {
        const stripeError = parseError(error);
        if (
          stripeError.message.includes("resource_missing") ||
          stripeError.message.includes("No such subscription")
        ) {
          logger.warn(
            "Subscription not found in Stripe - marking as canceled",
            {
              subscriptionId: localSubscription.providerSubscriptionId,
            },
          );

          // Subscription doesn't exist in Stripe - mark as canceled
          await db
            .update(subscriptions)
            .set({
              status: SubscriptionStatus.CANCELED,
              canceledAt: new Date(),
              endedAt: localSubscription.currentPeriodEnd || new Date(),
              providerSubscriptionId: null, // Clear invalid subscription ID
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.id, localSubscription.id));

          changes.push("Marked subscription as canceled (not found in Stripe)");
        } else {
          // Other Stripe errors
          logger.error("Failed to retrieve subscription from Stripe", {
            error: parseError(error),
            subscriptionId: localSubscription.providerSubscriptionId,
          });
          return fail({
            message: t("sync.stripe_error"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
            messageParams: { error: parseError(error).message },
          });
        }
      }

      // Sync status if subscription exists in Stripe
      if (stripeSubscription) {
        const { currentPeriodStart, currentPeriodEnd } =
          calculateSubscriptionPeriod(stripeSubscription);

        const newStatus = STRIPE_STATUS_MAP[stripeSubscription.status];

        // Always update period + status if anything changed (not just status)
        const periodChanged =
          localSubscription.currentPeriodEnd &&
          currentPeriodEnd * 1000 !==
            localSubscription.currentPeriodEnd.getTime();

        if (newStatus !== localSubscription.status || periodChanged) {
          await db
            .update(subscriptions)
            .set({
              status: newStatus,
              currentPeriodStart: new Date(currentPeriodStart * 1000),
              currentPeriodEnd: new Date(currentPeriodEnd * 1000),
              cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
              cancelAt: stripeSubscription.cancel_at
                ? new Date(stripeSubscription.cancel_at * 1000)
                : null,
              canceledAt:
                stripeSubscription.canceled_at && !localSubscription.canceledAt
                  ? new Date(stripeSubscription.canceled_at * 1000)
                  : localSubscription.canceledAt,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.id, localSubscription.id));

          changes.push(
            `Updated subscription status from ${localSubscription.status} to ${newStatus}`,
          );
        }

        // Grant renewal credits if period advanced (with idempotency)
        if (periodChanged) {
          const newPeriodEndMs = currentPeriodEnd * 1000;
          const { productsRepository, ProductIds } =
            await import("../products/repository-client");

          const productId =
            localSubscription.planId === SubscriptionPlan.SUBSCRIPTION
              ? ProductIds.SUBSCRIPTION
              : null;

          if (productId) {
            const product = productsRepository.getProduct(productId, locale);
            const renewalSessionId = renewalSessionKey(
              localSubscription.providerSubscriptionId,
              newPeriodEndMs,
            );

            const { creditPacks: creditPacksTable } =
              await import("../credits/db");
            const [existingPack] = await db
              .select({ id: creditPacksTable.id })
              .from(creditPacksTable)
              .where(
                sql`${creditPacksTable.metadata}->>'sessionId' = ${renewalSessionId}`,
              )
              .limit(1);

            if (!existingPack) {
              const { CreditRepository: CreditRepo } =
                await import("../credits/repository");
              const { scopedTranslation: cScopedTranslation } =
                await import("../credits/i18n");
              const { t: cT } = cScopedTranslation.scopedT(locale);

              await CreditRepo.addUserCredits(
                userId,
                product.credits,
                "subscription",
                logger,
                cT,
                new Date(newPeriodEndMs),
                renewalSessionId,
              );
              changes.push(`Granted ${product.credits} renewal credits`);
            }
          }
        }
      }

      // Expire old credit packs
      const { CreditRepository } = await import("../credits/repository");
      const { scopedTranslation: creditsScopedTranslation } =
        await import("../credits/i18n");
      const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
      const expiryResult = await CreditRepository.expireCredits(
        logger,
        creditsT,
      );

      if (expiryResult.success && expiryResult.data > 0) {
        changes.push(`Expired ${expiryResult.data} credit pack(s)`);
      }

      logger.info("Subscription sync completed", {
        userId,
        changes,
      });

      return success({
        message: t("sync.success"),
        changes,
      });
    } catch (error) {
      logger.error("Failed to sync subscription with Stripe", {
        error: parseError(error),
        userId,
      });
      return fail({
        message: t("sync.failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}

// Type for native repository type checking
export type SubscriptionRepositoryType = Pick<
  typeof SubscriptionRepository,
  keyof typeof SubscriptionRepository
>;
