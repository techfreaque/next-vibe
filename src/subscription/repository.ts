/**
 * Subscription Repository
 * Business logic for subscription operations - provider-agnostic
 */

import "server-only";

import { and, desc, eq, isNull, lte, or, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type Stripe from "stripe";

import { configScopedTranslation } from "@/env/i18n";
import { scopedTranslation as productsScopedTranslation } from "@/products/i18n";
import {
  getPlanForTierProduct,
  getTierCredits,
  getTierProductForPlan,
  isSubscriptionTierProductId,
  ProductIds,
  productsRepository,
  type SubscriptionTierProductId,
} from "@/products/repository-client";

import { createTrackingContext } from "../messenger/providers/email/smtp-client/components/tracking_context.email";
import { scopedTranslation as checkoutScopedTranslation } from "../payment/checkout/i18n";
import { SubscriptionCheckoutRepository } from "../payment/checkout/repository";
import { paymentTransactions } from "../payment/db";
import { PaymentProvider, type PaymentProviderValue } from "../payment/enum";
import { getPaymentProvider } from "../payment/providers";
import {
  checkCheckoutProviderAvailable,
  getCheckoutProviders,
  nowPaymentsAcceptsCards,
} from "../payment/providers/availability";
import { getCryptoCoinMinimums } from "../payment/providers/nowpayments/min-amounts";
import { StripeProvider } from "../payment/providers/stripe/repository";
import type { WebhookData } from "../payment/providers/types";
import { getEnvAvailability } from "../vibe/agent/env-availability";
import { getAvailableChatModelCount } from "../vibe/agent/models/all-models";
import type {
  SubscriptionCancelDeleteRequestOutput,
  SubscriptionCancelDeleteResponseOutput,
} from "./cancel/definition";
import type {
  SubscriptionCreatePostRequestOutput,
  SubscriptionCreatePostResponseOutput,
} from "./create/definition";
import type { NewSubscription, Subscription } from "./db";
import { subscriptions } from "./db";
import type { SubscriptionGetResponseOutput } from "./definition";
import type { SubscriptionPlanValue, SubscriptionStatusValue } from "./enum";
import {
  BillingInterval,
  BillingIntervalDB,
  SubscriptionPlan,
  SubscriptionStatus,
} from "./enum";
import { scopedTranslation } from "./i18n";
import { subscriptionRenewalSessionKey } from "./renewal-key";
import type {
  SubscriptionUpdatePutRequestOutput,
  SubscriptionUpdatePutResponseOutput,
} from "./update/definition";
import { currentMonthSlot, periodGrantExpiry } from "./yearly-credits/slots";

interface SyncSubscriptionResult {
  message: string;
  changes: string[];
}

/** Card facts from Stripe behind the card-specific payment hints. */
interface CardPaymentHint {
  /** ISO country of the card that paid or failed last, null if unknown. */
  cardCountry: string | null;
  /** A 3DS/OTP step failed and no payment succeeded after it. */
  recentCardAuthFailure: boolean;
}

/**
 * Subscription Repository - Static class pattern
 */
export class SubscriptionRepository {
  /**
   * Map Stripe subscription status to our subscription status.
   * Exhaustive over Stripe.Subscription.Status - adding a new Stripe status will
   * cause a compile error, forcing us to handle it explicitly.
   */
  private static readonly STRIPE_STATUS_MAP: Record<
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
   * Normalize a stored plan id to its canonical short form. Old rows hold
   * legacy prefixed values ('app.api.subscription.enums.plan.subscription');
   * unknown values fall back to the Starter plan so response validation passes.
   */
  private static normalizePlanId(planId: string): typeof SubscriptionPlanValue {
    const tierProductId = getTierProductForPlan(planId);
    return tierProductId
      ? getPlanForTierProduct(tierProductId)
      : SubscriptionPlan.SUBSCRIPTION;
  }

  /**
   * Tier and interval of the price a Stripe subscription bills. Our prices
   * (and the per-checkout prices from before lookup keys) carry
   * metadata.internalProductId; foreign prices return null.
   */
  private static tierFromStripeSubscription(
    subscription: Stripe.Subscription,
  ): {
    productId: SubscriptionTierProductId;
    billingInterval: (typeof BillingIntervalDB)[number];
  } | null {
    const price = subscription.items.data[0]?.price;
    const internalProductId = price?.metadata?.internalProductId;
    if (!price || !internalProductId) {
      return null;
    }
    if (!isSubscriptionTierProductId(internalProductId)) {
      return null;
    }
    return {
      productId: internalProductId,
      billingInterval:
        price.recurring?.interval === "year"
          ? BillingInterval.YEARLY
          : BillingInterval.MONTHLY,
    };
  }

  /**
   * Generate canonical idempotency key for subscription credit grants.
   * Shared by checkout, paid invoices and refund correlation.
   */
  private static renewalSessionKey(
    providerSubscriptionId: string,
    periodEndMs: number,
  ): string {
    return subscriptionRenewalSessionKey(providerSubscriptionId, periodEndMs);
  }

  /**
   * Calculate current period dates from Stripe subscription
   * Stripe API 2025-12-15.clover removed current_period_start/end from response
   */
  private static calculateSubscriptionPeriod(
    subscription: Stripe.Subscription,
  ): {
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
   * Minimum gap between live Stripe verifications of the same subscription.
   * Webhooks keep the DB in sync; the live check is only a missed-webhook
   * safety net, so once per window is plenty.
   */
  private static readonly PROVIDER_SYNC_INTERVAL_MS = 10 * 60 * 1000;
  private static readonly lastProviderSync = new Map<string, number>();
  private static readonly RETRY_URL_CACHE_MS = 5 * 60 * 1000;
  /** Hint lookups never hold a page: a slow Stripe call just omits the hint. */
  private static readonly HINT_TIMEOUT_MS = 2500;
  private static readonly retryUrlCache = new Map<
    string,
    { url: string | null; at: number }
  >();

  private static readonly cardHintCache = new Map<
    string,
    { hint: CardPaymentHint | null; at: number }
  >();

  /**
   * Card country and 3DS outcome of the user's recent Stripe payments, read
   * from Stripe (not IP: Indian cards often browse from elsewhere). Drives the
   * card-specific hints (OTP approval, Indian e-mandates). Only read for users
   * without a healthy plan, cached for a few minutes.
   */
  private static async resolveCardPaymentHint(
    userId: string,
    logger: EndpointLogger,
  ): Promise<CardPaymentHint | null> {
    const cached = SubscriptionRepository.cardHintCache.get(userId);
    if (
      cached &&
      Date.now() - cached.at < SubscriptionRepository.RETRY_URL_CACHE_MS
    ) {
      return cached.hint;
    }
    const stripeClient = StripeProvider.getStripe();
    if (!stripeClient) {
      return null;
    }
    try {
      const { users } = await import("next-vibe/identity/user/db");
      const [user] = await db
        .select({ stripeCustomerId: users.stripeCustomerId })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      if (!user?.stripeCustomerId) {
        SubscriptionRepository.cardHintCache.set(userId, {
          hint: null,
          at: Date.now(),
        });
        return null;
      }
      const since = Math.floor(Date.now() / 1000) - 35 * 24 * 60 * 60;
      const intents = await stripeClient.paymentIntents.list(
        {
          customer: user.stripeCustomerId,
          created: { gte: since },
          limit: 5,
          expand: ["data.payment_method"],
        },
        {
          timeout: SubscriptionRepository.HINT_TIMEOUT_MS,
          maxNetworkRetries: 0,
        },
      );
      let cardCountry: string | null = null;
      let recentCardAuthFailure = false;
      // Newest first: the latest outcome wins, an older 3DS failure followed
      // by a successful payment is no longer a problem.
      for (const intent of intents.data) {
        const failedMethod = intent.last_payment_error?.payment_method;
        const method =
          failedMethod ??
          (typeof intent.payment_method === "object"
            ? intent.payment_method
            : null);
        if (!cardCountry && method?.card?.country) {
          cardCountry = method.card.country;
        }
        if (intent.status === "succeeded") {
          break;
        }
        if (
          intent.last_payment_error?.code ===
          "payment_intent_authentication_failure"
        ) {
          recentCardAuthFailure = true;
        }
      }
      const hint: CardPaymentHint = { cardCountry, recentCardAuthFailure };
      SubscriptionRepository.cardHintCache.set(userId, {
        hint,
        at: Date.now(),
      });
      return hint;
    } catch (error) {
      logger.error("Failed to load recent card payments for hints", {
        error: parseError(error),
        userId,
      });
      SubscriptionRepository.cardHintCache.set(userId, {
        hint: null,
        at: Date.now(),
      });
      return null;
    }
  }

  /**
   * Stripe-hosted page of the subscription's open (failed) invoice. It is the
   * one place a customer can approve a payment their bank held back (3DS, an
   * Indian e-mandate charge above the auto-debit limit) or pay with another
   * card. Only read for PAST_DUE Stripe plans, cached for a few minutes.
   */
  private static async resolveRetryPaymentUrl(
    providerSubscriptionId: string,
    logger: EndpointLogger,
  ): Promise<string | null> {
    const cached = SubscriptionRepository.retryUrlCache.get(
      providerSubscriptionId,
    );
    if (
      cached &&
      Date.now() - cached.at < SubscriptionRepository.RETRY_URL_CACHE_MS
    ) {
      return cached.url;
    }
    const stripeClient = StripeProvider.getStripe();
    if (!stripeClient) {
      return null;
    }
    try {
      const invoices = await stripeClient.invoices.list(
        {
          subscription: providerSubscriptionId,
          status: "open",
          limit: 1,
        },
        {
          timeout: SubscriptionRepository.HINT_TIMEOUT_MS,
          maxNetworkRetries: 0,
        },
      );
      const url = invoices.data[0]?.hosted_invoice_url ?? null;
      SubscriptionRepository.retryUrlCache.set(providerSubscriptionId, {
        url,
        at: Date.now(),
      });
      return url;
    } catch (error) {
      logger.error("Failed to load open invoice for past-due subscription", {
        error: parseError(error),
        providerSubscriptionId,
      });
      return null;
    }
  }

  /**
   * Get the user's latest subscription.
   *
   * `syncWithProvider: false` reads our DB state only (kept current by
   * webhooks) - use it in page/layout loaders that run on every request.
   * With the default `true`, a stale-looking subscription is verified
   * against Stripe at most once per PROVIDER_SYNC_INTERVAL_MS (billing pages,
   * checkout, the subscription endpoint).
   */
  static async getSubscription(
    userId: string | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
    options: { syncWithProvider?: boolean } = {},
  ): Promise<ResponseType<SubscriptionGetResponseOutput>> {
    const result = await SubscriptionRepository.readSubscription(
      userId,
      logger,
      locale,
      options,
    );
    // Live reads tell the buy UI which providers can open a checkout, so a
    // paused Stripe account never reaches a doomed checkout. DB-only loader
    // reads skip the (cached) Stripe account check.
    if (!result.success || options.syncWithProvider === false) {
      return result;
    }
    return success({
      ...result.data,
      checkoutProviders: await getCheckoutProviders(logger),
      nowPaymentsAcceptsCards: nowPaymentsAcceptsCards(),
      cryptoCoins:
        (await getCryptoCoinMinimums(logger, { wait: false })) ?? undefined,
    });
  }

  private static async readSubscription(
    userId: string | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
    options: { syncWithProvider?: boolean },
  ): Promise<ResponseType<SubscriptionGetResponseOutput>> {
    const syncWithProvider = options.syncWithProvider ?? true;
    if (!userId) {
      return success({ hasSubscription: false });
    }
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const results = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .orderBy(desc(subscriptions.createdAt))
        .limit(1);

      if (results.length === 0) {
        // No subscription is a valid state, not an error - the widget renders
        // a subscribe CTA from this response.
        const hint = syncWithProvider
          ? await SubscriptionRepository.resolveCardPaymentHint(userId, logger)
          : null;
        return success({
          hasSubscription: false,
          cardCountry: hint?.cardCountry ?? undefined,
          recentCardAuthFailure: hint?.recentCardAuthFailure || undefined,
        });
      }

      let subscription = results[0];

      // A crypto plan is a one-off invoice with no provider-side renewal:
      // once its period is over it has ended (and a new checkout is allowed).
      if (
        subscription.provider === PaymentProvider.NOWPAYMENTS &&
        subscription.status === SubscriptionStatus.ACTIVE &&
        subscription.currentPeriodEnd &&
        subscription.currentPeriodEnd.getTime() < Date.now()
      ) {
        const [ended] = await db
          .update(subscriptions)
          .set({
            status: SubscriptionStatus.CANCELED,
            endedAt: subscription.currentPeriodEnd,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.id, subscription.id))
          .returning();
        if (ended) {
          subscription = ended;
          logger.info("Crypto plan period ended", {
            userId,
            subscriptionId: subscription.id,
          });
        }
      }

      // AUTOMATIC SYNC: Verify subscription with Stripe if it has a provider ID.
      // Skip for NOWPayments - one-time payments have no recurring subscription to sync.
      if (
        syncWithProvider &&
        subscription.providerSubscriptionId &&
        subscription.provider !== PaymentProvider.NOWPAYMENTS
      ) {
        // Terminal statuses never change on Stripe's side; re-checking them
        // made every page view of a former subscriber hit the Stripe API.
        const isTerminal =
          subscription.status === SubscriptionStatus.CANCELED ||
          subscription.status === SubscriptionStatus.INCOMPLETE_EXPIRED;
        const lastSync =
          SubscriptionRepository.lastProviderSync.get(subscription.id) ?? 0;
        const recentlySynced =
          Date.now() - lastSync <
          SubscriptionRepository.PROVIDER_SYNC_INTERVAL_MS;
        const needsSync =
          !isTerminal &&
          !recentlySynced &&
          (subscription.status === SubscriptionStatus.ACTIVE ||
            (subscription.currentPeriodEnd &&
              new Date(subscription.currentPeriodEnd) < new Date()));

        if (needsSync) {
          SubscriptionRepository.lastProviderSync.set(
            subscription.id,
            Date.now(),
          );
          try {
            const stripeClient = StripeProvider.getStripe();
            if (!stripeClient) {
              logger.warn("Stripe not configured, skipping subscription sync");
            } else {
              const stripeResponse = await stripeClient.subscriptions.retrieve(
                subscription.providerSubscriptionId,
              );

              const { currentPeriodStart, currentPeriodEnd } =
                SubscriptionRepository.calculateSubscriptionPeriod(
                  stripeResponse,
                );

              const newStatus =
                SubscriptionRepository.STRIPE_STATUS_MAP[stripeResponse.status];

              // Update if status or period changed
              const periodChanged =
                subscription.currentPeriodEnd &&
                currentPeriodEnd * 1000 !==
                  subscription.currentPeriodEnd.getTime();

              if (newStatus !== subscription.status || periodChanged) {
                logger.info("Auto-syncing subscription from Stripe", {
                  userId,
                  oldStatus: subscription.status,
                  newStatus,
                  periodChanged,
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
                    ...(newStatus === SubscriptionStatus.ACTIVE
                      ? { paymentFailedAt: null, gracePeriodEndsAt: null }
                      : {}),
                    updatedAt: new Date(),
                  })
                  .where(eq(subscriptions.id, subscription.id))
                  .returning();

                if (updated) {
                  subscription = updated;
                }
              }
            } // end else (stripeClient configured)
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
      }

      const isPastDue = subscription.status === SubscriptionStatus.PAST_DUE;
      const retryPaymentUrl =
        isPastDue &&
        syncWithProvider &&
        subscription.providerSubscriptionId &&
        subscription.provider !== PaymentProvider.NOWPAYMENTS
          ? await SubscriptionRepository.resolveRetryPaymentUrl(
              subscription.providerSubscriptionId,
              logger,
            )
          : null;
      const needsCardHint =
        syncWithProvider &&
        subscription.provider !== PaymentProvider.NOWPAYMENTS &&
        subscription.status !== SubscriptionStatus.ACTIVE &&
        subscription.status !== SubscriptionStatus.TRIALING;
      const cardHint = needsCardHint
        ? await SubscriptionRepository.resolveCardPaymentHint(userId, logger)
        : null;

      return success({
        hasSubscription: true,
        cardCountry: cardHint?.cardCountry ?? undefined,
        recentCardAuthFailure: cardHint?.recentCardAuthFailure || undefined,
        id: subscription.id,
        plan: SubscriptionRepository.normalizePlanId(subscription.planId),
        billingInterval: subscription.billingInterval,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart || new Date(),
        currentPeriodEnd: subscription.currentPeriodEnd || new Date(),
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        cancelAt: subscription.cancelAt?.toISOString(),
        canceledAt: subscription.canceledAt?.toISOString(),
        endedAt: subscription.endedAt?.toISOString(),
        gracePeriodEndsAt:
          isPastDue && subscription.gracePeriodEndsAt
            ? subscription.gracePeriodEndsAt.toISOString()
            : undefined,
        retryPaymentUrl: retryPaymentUrl ?? undefined,
        provider: subscription.provider,
        providerSubscriptionId:
          subscription.providerSubscriptionId || undefined,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
      });
    } catch (error) {
      logger.error("Error getting subscription:", parseError(error));
      return fail({
        message: t("errors.database_error", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
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
      catalogProductId: data.catalogProductId,
    });

    // Validate catalog product if provided
    if (data.catalogProductId) {
      const { catalogProducts } = await import("../products/db");

      const [catalogProduct] = await db
        .select({
          id: catalogProducts.id,
          isSubscription: catalogProducts.isSubscription,
          isActive: catalogProducts.isActive,
        })
        .from(catalogProducts)
        .where(eq(catalogProducts.id, data.catalogProductId))
        .limit(1);

      if (!catalogProduct) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.not_found"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (!catalogProduct.isSubscription || !catalogProduct.isActive) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.not_found"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      logger.debug("Catalog product validated for subscription", {
        catalogProductId: data.catalogProductId,
      });
    }

    // Create checkout session via checkout repository
    const { t: checkoutT } = checkoutScopedTranslation.scopedT(locale);
    const checkoutResult =
      await SubscriptionCheckoutRepository.createCheckoutSession(
        {
          planId: data.plan,
          billingInterval: data.billingInterval,
          provider: data.provider,
          payCurrency: data.payCurrency,
        },
        user,
        locale,
        logger,
        checkoutT,
      );

    // If catalogProductId was provided and checkout succeeded, link the catalog product
    // to the existing subscription record if one exists for this user (additive only).
    if (checkoutResult.success && data.catalogProductId) {
      try {
        const [existingSub] = await db
          .select({ id: subscriptions.id })
          .from(subscriptions)
          .where(eq(subscriptions.userId, user.id))
          .limit(1);

        if (existingSub) {
          await db
            .update(subscriptions)
            .set({
              catalogProductId: data.catalogProductId,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.id, existingSub.id));

          logger.debug("Linked catalog product to existing subscription", {
            userId: user.id,
            catalogProductId: data.catalogProductId,
            subscriptionId: existingSub.id,
          });
        }
      } catch (linkError) {
        // Non-fatal: catalog product linking failed, log and continue
        logger.error("Failed to link catalog product to subscription", {
          error: parseError(linkError),
          userId: user.id,
          catalogProductId: data.catalogProductId,
        });
      }
    }

    return checkoutResult;
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
          message: t("errors.not_found_description"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const current = currentSubscription[0];
      const currentTier =
        getTierProductForPlan(current.planId) ?? ProductIds.SUBSCRIPTION;
      const targetTier = getTierProductForPlan(data.plan);
      if (!targetTier || !productsRepository.canPurchase(targetTier)) {
        return fail({
          message: t("errors.validation.description"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }
      const targetInterval =
        data.billingInterval === BillingInterval.YEARLY ? "year" : "month";
      const currentInterval =
        current.billingInterval === BillingInterval.YEARLY ? "year" : "month";
      const definitions = productsRepository.getProductDefinitions();
      if (!definitions[targetTier].allowedIntervals.includes(targetInterval)) {
        return fail({
          message: t("errors.validation.description"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      const respond = (
        row: typeof current,
        message: string,
      ): ResponseType<SubscriptionUpdatePutResponseOutput> =>
        success({
          id: row.id,
          plan: SubscriptionRepository.normalizePlanId(row.planId),
          billingInterval: row.billingInterval,
          status: row.status,
          currentPeriodStart: row.currentPeriodStart || new Date(),
          currentPeriodEnd: row.currentPeriodEnd || new Date(),
          cancelAtPeriodEnd: row.cancelAtPeriodEnd,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          message,
        });

      // Stripe plans decide "unchanged" against the price Stripe bills (a
      // scheduled downgrade can be taken back), so that check runs inside
      // changeStripeTier.
      if (
        targetTier === currentTier &&
        targetInterval === currentInterval &&
        current.provider !== PaymentProvider.STRIPE
      ) {
        return respond(current, t("errors.tierChange.unchanged"));
      }

      if (
        current.status !== SubscriptionStatus.ACTIVE &&
        current.status !== SubscriptionStatus.TRIALING
      ) {
        return fail({
          message: t("errors.tierChange.notActive"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }
      if (
        current.provider !== PaymentProvider.STRIPE ||
        !current.providerSubscriptionId
      ) {
        return fail({
          message: t("errors.tierChange.cryptoNotSupported"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      const result = await SubscriptionRepository.changeStripeTier({
        subscription: current,
        providerSubscriptionId: current.providerSubscriptionId,
        currentTier,
        targetTier,
        targetInterval,
        locale,
        logger,
      });
      if (!result.success) {
        return result;
      }
      const { row, kind, bonusCredits } = result.data;
      const { t: productsT } = productsScopedTranslation.scopedT(locale);
      const planName = productsT(definitions[targetTier].name);
      const message =
        kind === "unchanged"
          ? t("errors.tierChange.unchanged")
          : kind === "upgrade"
            ? t("errors.tierChange.upgraded", {
                plan: planName,
                credits: bonusCredits,
              })
            : kind === "downgrade"
              ? t("errors.tierChange.downgraded", { plan: planName })
              : t("errors.tierChange.changed", { plan: planName });
      return respond(row, message);
    } catch (error) {
      logger.error("Error updating subscription:", parseError(error));
      return fail({
        message: t("errors.database_error", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }

  /**
   * Switch a Stripe subscription to another tier or interval.
   *
   * - Upgrade (more monthly credits, same interval): Stripe invoices the
   *   prorated difference right away and applies the change only once that
   *   invoice is paid (pending_if_incomplete). The user gets the prorated
   *   credit difference for the rest of the current month (monthly plan: the
   *   period; yearly plan: the current month, later months come from the
   *   yearly-credits task at the new tier).
   * - Downgrade (fewer credits, same interval): no refund, no proration. Stripe
   *   bills the new price from the next renewal; the row keeps the current
   *   (higher) plan until then, and the renewal switches it.
   * - Back to the current plan while a downgrade is pending: the downgrade is
   *   taken back, nothing is charged.
   * - Interval change: Stripe restarts the billing period now with proration.
   *   The new period's credits come from the invoice webhooks, as on renewal.
   *
   * For upgrades and interval changes the row's plan is written before
   * calling Stripe (webhooks for the change read it) and restored when Stripe
   * refuses.
   */
  private static async changeStripeTier(params: {
    subscription: Subscription;
    providerSubscriptionId: string;
    currentTier: SubscriptionTierProductId;
    targetTier: SubscriptionTierProductId;
    targetInterval: "month" | "year";
    locale: CountryLanguage;
    logger: EndpointLogger;
  }): Promise<
    ResponseType<{
      row: Subscription;
      kind: "upgrade" | "downgrade" | "interval" | "changed" | "unchanged";
      bonusCredits: number;
    }>
  > {
    const {
      subscription,
      providerSubscriptionId,
      currentTier,
      targetTier,
      targetInterval,
      locale,
      logger,
    } = params;
    const { t } = scopedTranslation.scopedT(locale);
    const stripe = StripeProvider.getStripe();
    if (!stripe) {
      return fail({
        message: t("errors.tierChange.failed", { error: "Stripe" }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const currentInterval =
      subscription.billingInterval === BillingInterval.YEARLY
        ? "year"
        : "month";
    const intervalChanged = currentInterval !== targetInterval;
    const currentCredits = getTierCredits(currentTier);
    const targetCredits = getTierCredits(targetTier);

    const readRow = async (): Promise<Subscription> => {
      const [row] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, subscription.id))
        .limit(1);
      return row ?? subscription;
    };

    const previous = {
      planId: subscription.planId,
      productId: subscription.productId,
      billingInterval: subscription.billingInterval,
      providerPriceId: subscription.providerPriceId,
      providerProductId: subscription.providerProductId,
    };
    const restore = async (): Promise<void> => {
      await db
        .update(subscriptions)
        .set({ ...previous, updatedAt: new Date() })
        .where(eq(subscriptions.id, subscription.id));
    };

    try {
      const stripeSub = await stripe.subscriptions.retrieve(
        providerSubscriptionId,
      );
      const item = stripeSub.items.data[0];
      if (!item) {
        return fail({
          message: t("errors.tierChange.failed", {
            error: "no subscription item",
          }),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      const billedTier =
        SubscriptionRepository.tierFromStripeSubscription(stripeSub)
          ?.productId ?? currentTier;

      const sameAsRow = targetTier === currentTier && !intervalChanged;
      if (sameAsRow && billedTier === currentTier) {
        return success({
          row: subscription,
          kind: "unchanged",
          bonusCredits: 0,
        });
      }

      const kind: "upgrade" | "downgrade" | "interval" | "changed" = sameAsRow
        ? "changed"
        : intervalChanged
          ? "interval"
          : targetCredits > currentCredits
            ? "upgrade"
            : "downgrade";

      const { stripePriceManager } =
        await import("../payment/providers/stripe/prices");
      const price = await stripePriceManager.ensurePrice(
        targetTier,
        locale,
        targetInterval,
        logger,
      );
      if (!price.success) {
        return price;
      }

      const writesPlanNow = kind === "upgrade" || kind === "interval";
      if (writesPlanNow) {
        // Upgrades charge the prorated difference now; a paused Stripe
        // account would refuse it. Downgrades charge nothing and still run.
        const unavailable = await checkCheckoutProviderAvailable(
          PaymentProvider.STRIPE,
          locale,
          logger,
        );
        if (unavailable) {
          return unavailable;
        }
      }
      if (writesPlanNow) {
        await db
          .update(subscriptions)
          .set({
            planId: getPlanForTierProduct(targetTier),
            productId: targetTier,
            billingInterval:
              targetInterval === "year"
                ? BillingInterval.YEARLY
                : BillingInterval.MONTHLY,
            providerPriceId: price.data.priceId,
            providerProductId: price.data.productId,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.id, subscription.id));
      }

      const updated = writesPlanNow
        ? await stripe.subscriptions.update(providerSubscriptionId, {
            items: [{ id: item.id, price: price.data.priceId }],
            proration_behavior: "always_invoice",
            payment_behavior: "pending_if_incomplete",
          })
        : // Downgrade, or taking a pending downgrade back: no charge, the
          // price bills from the next renewal.
          await stripe.subscriptions.update(providerSubscriptionId, {
            items: [{ id: item.id, price: price.data.priceId }],
            proration_behavior: "none",
          });

      if (updated.pending_update) {
        // Payment needs the customer (3DS) or failed: Stripe kept the old
        // price, so the row goes back too.
        await restore();
        const invoiceId =
          typeof updated.latest_invoice === "string"
            ? updated.latest_invoice
            : updated.latest_invoice?.id;
        const invoice = invoiceId
          ? await stripe.invoices.retrieve(invoiceId)
          : null;
        return fail({
          message: t("errors.tierChange.paymentRequired", {
            url: invoice?.hosted_invoice_url ?? "",
          }),
          errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
        });
      }

      let bonusCredits = 0;
      if (kind === "upgrade") {
        const now = new Date();
        const periodStart = new Date(item.current_period_start * 1000);
        const periodEnd = new Date(item.current_period_end * 1000);
        // Monthly plan: the rest of the period. Yearly plan: the rest of
        // the current month (later months follow at the new tier).
        const creditWindow =
          currentInterval === "year"
            ? currentMonthSlot(periodStart, periodEnd, now)
            : { start: periodStart, end: periodEnd };
        const span = creditWindow
          ? creditWindow.end.getTime() - creditWindow.start.getTime()
          : 0;
        const fraction =
          creditWindow && span > 0
            ? Math.min(
                1,
                Math.max(
                  0,
                  (creditWindow.end.getTime() - now.getTime()) / span,
                ),
              )
            : 0;
        bonusCredits = Math.round((targetCredits - currentCredits) * fraction);
        if (creditWindow && bonusCredits > 0) {
          const { CreditRepository } = await import("../credits/repository");
          const { scopedTranslation: creditsScopedTranslation } =
            await import("../credits/i18n");
          await CreditRepository.addUserCredits(
            subscription.userId,
            bonusCredits,
            "subscription",
            logger,
            creditsScopedTranslation.scopedT(locale).t,
            creditWindow.end,
            `tier-upgrade:${providerSubscriptionId}:${creditWindow.end.getTime()}:${targetTier}`,
          );
        }
      } else if (!writesPlanNow) {
        // The row keeps the current plan until renewal; only the billed
        // price is recorded.
        await db
          .update(subscriptions)
          .set({
            providerPriceId: price.data.priceId,
            providerProductId: price.data.productId,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.id, subscription.id));
      }

      logger.info("Changed subscription tier", {
        userId: subscription.userId,
        providerSubscriptionId,
        from: currentTier,
        billed: billedTier,
        to: targetTier,
        interval: targetInterval,
        kind,
        bonusCredits,
      });

      return success({ row: await readRow(), kind, bonusCredits });
    } catch (error) {
      await restore();
      logger.error("Failed to change subscription tier", {
        error: parseError(error),
        userId: subscription.userId,
        providerSubscriptionId,
        from: currentTier,
        to: targetTier,
      });
      return fail({
        message: t("errors.tierChange.failed", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
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
        const provider = getPaymentProvider(subscription.provider);
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
        message: t("errors.cancel_failed", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
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

      if (!userId || !planId || !billingInterval) {
        logger.error("Missing required metadata in checkout session", {
          sessionId: session.id,
          userId,
          planId,
          billingInterval,
        });
        return;
      }

      const tierProductId = getTierProductForPlan(planId);
      const billingIntervalValue = BillingIntervalDB.find(
        (value) => value === billingInterval,
      );
      if (!tierProductId || !billingIntervalValue) {
        logger.error("Unknown plan or billing interval in checkout session", {
          sessionId: session.id,
          userId,
          planId,
          billingInterval,
        });
        return;
      }
      const planValue = getPlanForTierProduct(tierProductId);

      const providerEnum =
        (session.metadata?.provider as typeof PaymentProviderValue) ||
        PaymentProvider.STRIPE;

      // NOWPayments processes subscriptions as one-time invoices - no recurring
      // subscription object exists. Calculate period dates from billingInterval.
      const isNowPayments = providerEnum === PaymentProvider.NOWPAYMENTS;

      let currentPeriodStart: Date;
      let currentPeriodEnd: Date | null;
      let providerSubscriptionId: string | undefined;

      if (isNowPayments) {
        // One-time invoice: use the session/payment ID as the identifier
        providerSubscriptionId = session.id;
        currentPeriodStart = new Date();
        const isYearly = billingInterval === BillingInterval.YEARLY;
        const periodMs = isYearly
          ? 365 * 24 * 60 * 60 * 1000
          : 30 * 24 * 60 * 60 * 1000;
        currentPeriodEnd = new Date(Date.now() + periodMs);

        logger.info("NOWPayments one-time subscription checkout", {
          sessionId: session.id,
          billingInterval,
          isYearly,
          currentPeriodEnd: currentPeriodEnd.toISOString(),
        });
      } else {
        // Stripe: retrieve subscription from provider for accurate period dates
        providerSubscriptionId = session.subscription;

        if (!providerSubscriptionId) {
          logger.error("Missing provider subscription ID for Stripe checkout", {
            sessionId: session.id,
          });
          return;
        }

        const provider = getPaymentProvider(PaymentProvider.STRIPE);
        const subscriptionResult = await provider.retrieveSubscription(
          providerSubscriptionId,
          logger,
          locale,
        );

        if (!subscriptionResult.success) {
          logger.error("Failed to retrieve subscription from Stripe", {
            providerSubscriptionId,
            error: subscriptionResult.message,
          });
          return;
        }

        currentPeriodStart = subscriptionResult.data.currentPeriodStart
          ? new Date(subscriptionResult.data.currentPeriodStart)
          : new Date();
        currentPeriodEnd = subscriptionResult.data.currentPeriodEnd
          ? new Date(subscriptionResult.data.currentPeriodEnd)
          : null;
      }

      await db
        .insert(subscriptions)
        .values({
          userId: userId,
          planId: planValue,
          billingInterval: billingIntervalValue,
          productId: tierProductId,
          status: SubscriptionStatus.ACTIVE,
          provider: providerEnum,
          providerSubscriptionId,
          currentPeriodStart,
          currentPeriodEnd,
        })
        .onConflictDoUpdate({
          target: subscriptions.userId,
          set: {
            // A returning subscriber may pick a different tier or interval.
            planId: planValue,
            billingInterval: billingIntervalValue,
            productId: tierProductId,
            provider: providerEnum,
            cancelAtPeriodEnd: false,
            cancelAt: null,
            canceledAt: null,
            endedAt: null,
            paymentFailedAt: null,
            gracePeriodEndsAt: null,
            status: SubscriptionStatus.ACTIVE,
            providerSubscriptionId,
            currentPeriodStart,
            currentPeriodEnd,
            updatedAt: new Date(),
          },
        });

      // Look up user's locale from DB for credit/product translations
      let userLocale: CountryLanguage = locale;
      if (userId) {
        const { users: usersTable } =
          await import("next-vibe/identity/user/db");

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
      const { t: creditsT } = creditsScopedTranslation.scopedT(userLocale);

      const product = productsRepository.getProduct(tierProductId, userLocale);
      // currentPeriodEnd is already extracted from Stripe or calculated for NOWPayments above
      const expiresAt = currentPeriodEnd
        ? periodGrantExpiry(
            billingIntervalValue === BillingInterval.YEARLY,
            currentPeriodStart,
            currentPeriodEnd,
          )
        : null;

      // Checkout and the credit ledger share the subscription period key.
      // providerSubscriptionId is set for both Stripe and NOWPayments paths.
      const checkoutSessionId = providerSubscriptionId
        ? SubscriptionRepository.renewalSessionKey(
            providerSubscriptionId,
            (currentPeriodEnd ?? new Date()).getTime(),
          )
        : session.id;

      // IDEMPOTENCY CHECK: Verify credits haven't been added for this checkout session already
      const { creditPacks } = await import("../credits/db");

      const [existingPack] = await db
        .select()
        .from(creditPacks)
        .where(
          sql`${creditPacks.metadata}->>'sessionId' = ${checkoutSessionId}`,
        )
        .limit(1);

      if (existingPack) {
        logger.info("Subscription credits already processed for session", {
          checkoutSessionId,
          packId: existingPack.id,
          userId,
        });
        return; // Idempotent - already processed
      }

      const grant = await CreditRepository.addUserCredits(
        userId,
        product.credits,
        "subscription",
        logger,
        creditsT,
        expiresAt ?? undefined,
        checkoutSessionId,
      );
      if (grant.success && !grant.data.granted) {
        // Webhook and success redirect raced: the winner sends the emails.
        logger.info("Subscription credits granted by a concurrent handler", {
          checkoutSessionId,
          packId: grant.data.packId,
          userId,
        });
        return;
      }
      logger.debug("Added subscription credits", {
        userId,
        credits: product.credits,
        expiresAt: expiresAt?.toISOString(),
        checkoutSessionId,
      });

      // Referral code bonus: one-time credits for the first paid plan.
      const { ReferralRepository } = await import("../referral/repository");
      await ReferralRepository.grantSubscriptionSignupBonus(
        userId,
        logger,
        userLocale,
      );

      // Send confirmation emails (user + admin)
      try {
        const { users: usersTable } =
          await import("next-vibe/identity/user/db");
        const { userLeadLinks } = await import("next-vibe/identity/lead/db");
        const [fullUser] = await db
          .select({
            email: usersTable.email,
            privateName: usersTable.privateName,
            publicName: usersTable.publicName,
          })
          .from(usersTable)
          .where(eq(usersTable.id, userId))
          .limit(1);

        const [leadLink] = await db
          .select({ leadId: userLeadLinks.leadId })
          .from(userLeadLinks)
          .where(eq(userLeadLinks.userId, userId))
          .limit(1);

        if (fullUser) {
          const {
            subscriptionSuccessEmailTemplate,
            adminSubscriptionNotificationEmailTemplate,
          } = await import("./email");
          const { EmailSendingRepository } =
            await import("../messenger/providers/email/smtp-client/email-sending/repository");

          // Get inserted/updated subscription record for email
          const [subRecord] = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.userId, userId))
            .limit(1);

          if (subRecord) {
            const leadId = leadLink?.leadId ?? userId;
            const { t } =
              subscriptionSuccessEmailTemplate.scopedTranslation.scopedT(
                userLocale,
              );
            const tracking = createTrackingContext(userLocale, leadId, userId);
            const { contactClientRepository } =
              await import("../contact/repository-client");
            const adminEmail =
              contactClientRepository.getSupportEmail(userLocale);

            await EmailSendingRepository.sendEmail(
              {
                jsx: subscriptionSuccessEmailTemplate.component({
                  props: {
                    privateName: fullUser.privateName,
                    userId,
                    leadId,
                    planName: t(subRecord.planId),
                    monthlyCredits: getTierCredits(tierProductId),
                    totalModelCount: getAvailableChatModelCount(
                      false,
                      await getEnvAvailability(),
                    ),
                  },
                  t,
                  locale: userLocale,
                  recipientEmail: fullUser.email,
                  tracking,
                }),
                subject: t("email.success.subject", {
                  appName: configScopedTranslation
                    .scopedT(userLocale)
                    .t("appName"),
                }),
                toEmail: fullUser.email,
                toName: fullUser.privateName,
                leadId,
                locale: userLocale,
              },
              logger,
              userLocale,
            );

            const { t: adminT } =
              adminSubscriptionNotificationEmailTemplate.scopedTranslation.scopedT(
                userLocale,
              );
            await EmailSendingRepository.sendEmail(
              {
                jsx: adminSubscriptionNotificationEmailTemplate.component({
                  props: {
                    privateName: fullUser.privateName,
                    publicName: fullUser.publicName,
                    email: fullUser.email,
                    planName: adminT(subRecord.planId),
                    statusName: adminT(subRecord.status),
                  },
                  t: adminT,
                  locale: userLocale,
                  recipientEmail: adminEmail,
                  tracking: createTrackingContext(userLocale),
                }),
                subject: adminT("email.admin_notification.subject", {
                  planName: adminT(subRecord.planId),
                }),
                toEmail: adminEmail,
                toName: adminEmail,
                leadId,
                locale: userLocale,
              },
              logger,
              userLocale,
            );

            logger.info("Sent subscription confirmation emails", { userId });
          }
        }
      } catch (emailError) {
        logger.error("Failed to send subscription emails", {
          error: parseError(emailError),
          userId,
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

  /** A settled invoice grants the period on its billed line, even on a late replay. */
  static async handleInvoicePaymentSucceeded(
    invoice: WebhookData,
    subscriptionId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    const { t } = scopedTranslation.scopedT(locale);
    if (
      invoice.billing_reason === "subscription_create" ||
      invoice.status !== "paid" ||
      !invoice.amount_paid ||
      invoice.amount_paid <= 0
    ) {
      return success();
    }
    // Prorated upgrades have their own credit adjustment; they do not buy a new period.
    if (
      !invoice.billingPeriod &&
      invoice.billing_reason === "subscription_update"
    ) {
      return success();
    }
    try {
      const period = invoice.billingPeriod;
      if (!period || period.end <= period.start) {
        return fail({
          message: t("errors.database_error", {
            error: `Missing billed period for ${invoice.id}`,
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.providerSubscriptionId, subscriptionId))
        .limit(1);
      if (!subscription) {
        return fail({
          message: t("errors.database_error", {
            error: `Missing subscription for ${invoice.id}`,
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      const start = new Date(period.start * 1000);
      const end = new Date(period.end * 1000);
      // A replay may arrive after another plan change. Use the price on the
      // signed invoice, not the price of today's Stripe subscription.
      const price = period.priceId
        ? await StripeProvider.getStripe()?.prices.retrieve(period.priceId)
        : undefined;
      const productId = price?.metadata.internalProductId;
      const tier =
        productId && isSubscriptionTierProductId(productId)
          ? productId
          : getTierProductForPlan(subscription.planId);
      const interval =
        price?.recurring?.interval === "year"
          ? BillingInterval.YEARLY
          : price?.recurring?.interval === "month"
            ? BillingInterval.MONTHLY
            : subscription.billingInterval;
      if (!tier) {
        return fail({
          message: t("errors.database_error", {
            error: `Missing subscription tier for ${invoice.id}`,
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      const { CreditRepository } = await import("../credits/repository");
      const { scopedTranslation: creditsTranslation } =
        await import("../credits/i18n");
      const grant = await CreditRepository.addUserCredits(
        subscription.userId,
        getTierCredits(tier),
        "subscription",
        logger,
        creditsTranslation.scopedT(locale).t,
        periodGrantExpiry(interval === BillingInterval.YEARLY, start, end),
        subscriptionRenewalSessionKey(subscriptionId, end.getTime()),
        invoice.id,
      );
      if (!grant.success) {
        return grant;
      }
      if (end.getTime() > Date.now()) {
        const paidAt = invoice.invoicePaidAt
          ? new Date(invoice.invoicePaidAt * 1000 + 999)
          : undefined;
        await db
          .update(subscriptions)
          .set({
            ...(invoice.billing_reason === "subscription_cycle" &&
              price && {
                planId: getPlanForTierProduct(tier),
                productId: tier,
                billingInterval: interval,
              }),
            currentPeriodStart: start,
            currentPeriodEnd: end,
            status: SubscriptionStatus.ACTIVE,
            paymentFailedAt: null,
            gracePeriodEndsAt: null,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(subscriptions.id, subscription.id),
              or(
                isNull(subscriptions.currentPeriodEnd),
                lte(subscriptions.currentPeriodEnd, end),
              ),
              paidAt
                ? or(
                    isNull(subscriptions.canceledAt),
                    lte(subscriptions.canceledAt, paidAt),
                  )
                : undefined,
              paidAt
                ? or(
                    isNull(subscriptions.paymentFailedAt),
                    lte(subscriptions.paymentFailedAt, paidAt),
                  )
                : undefined,
            ),
          );
      }
      if (invoice.billing_reason === "subscription_cycle") {
        const { GrowthJourneyRepository } =
          await import("@/leads/growth/repository");
        const { FunnelStep } = await import("@/leads/growth/enum");
        await GrowthJourneyRepository.markStep(
          { userId: subscription.userId },
          FunnelStep.RETAINED,
          logger,
        );
      }
      return success();
    } catch (error) {
      logger.error(
        "Failed to grant paid subscription period",
        parseError(error),
        { invoiceId: invoice.id, subscriptionId },
      );
      return fail({
        message: t("errors.database_error", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
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

      // CANCELED is terminal. When Stripe gives up on dunning it sends
      // customer.subscription.deleted and then, ~0.5s later, the final
      // invoice.payment_failed for the same invoice. Without this guard that
      // late event flipped the ended subscription back to PAST_DUE, so it kept
      // counting as a live subscriber (seen on prod for 3 subscriptions).
      if (subscription.status === SubscriptionStatus.CANCELED) {
        logger.info("Ignoring payment failure for a canceled subscription", {
          subscriptionId,
          invoiceId,
        });
        return;
      }

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
        .where(
          and(
            eq(subscriptions.providerSubscriptionId, subscriptionId),
            sql`not exists(select 1 from ${paymentTransactions} where ${paymentTransactions.providerInvoiceId} = ${invoiceId})`,
          ),
        );

      logger.info("Set subscription to PAST_DUE with grace period", {
        subscriptionId,
        userId: subscription.userId,
        gracePeriodEndsAt: gracePeriodEndsAt?.toISOString(),
        isFirstFailure,
        gracePeriodDays: GRACE_PERIOD_DAYS,
      });

      // Existing credits remain available under the grace-period rules.
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
      const stripe = StripeProvider.getStripe();
      if (!stripe) {
        logger.warn("Stripe not configured, cannot sync subscription", {
          subscriptionId,
        });
        return;
      }
      const fullSubscription =
        await stripe.subscriptions.retrieve(subscriptionId);

      const status =
        SubscriptionRepository.STRIPE_STATUS_MAP[fullSubscription.status];

      // Check if period changed (renewal detected)
      const { currentPeriodStart, currentPeriodEnd } =
        SubscriptionRepository.calculateSubscriptionPeriod(fullSubscription);

      const oldPeriodEnd = subscription.currentPeriodEnd;
      const newPeriodEnd = new Date(currentPeriodEnd * 1000);
      const periodRenewed =
        oldPeriodEnd && newPeriodEnd.getTime() > oldPeriodEnd.getTime();

      // Tier follows the price Stripe bills (plan switches, dashboard edits),
      // except a pending downgrade: the row keeps the higher plan the user
      // paid for until the period renews.
      const billedTier =
        SubscriptionRepository.tierFromStripeSubscription(fullSubscription);
      const rowTier =
        getTierProductForPlan(subscription.planId) ?? ProductIds.SUBSCRIPTION;
      const stripeTier =
        billedTier &&
        (periodRenewed ||
          billedTier.billingInterval !== subscription.billingInterval ||
          getTierCredits(billedTier.productId) >= getTierCredits(rowTier))
          ? billedTier
          : null;
      const tierFields = stripeTier
        ? {
            planId: getPlanForTierProduct(stripeTier.productId),
            productId: stripeTier.productId,
            billingInterval: stripeTier.billingInterval,
          }
        : {};
      if (stripeTier && stripeTier.productId !== subscription.productId) {
        logger.info("Subscription tier changed on Stripe", {
          subscriptionId,
          from: subscription.productId,
          to: stripeTier.productId,
        });
      }
      // Update subscription with proper period information
      // Clear grace period fields when subscription is active again
      const isActive = status === SubscriptionStatus.ACTIVE;
      await db
        .update(subscriptions)
        .set({
          ...tierFields,
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
  ): Promise<ResponseType<SyncSubscriptionResult>> {
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
      const stripe = StripeProvider.getStripe();
      try {
        stripeSubscription = stripe
          ? await stripe.subscriptions.retrieve(
              localSubscription.providerSubscriptionId,
            )
          : null;
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
            message: t("sync.stripe_error", {
              error: parseError(error).message,
            }),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
      }

      // Sync status if subscription exists in Stripe
      if (stripeSubscription) {
        const { currentPeriodStart, currentPeriodEnd } =
          SubscriptionRepository.calculateSubscriptionPeriod(
            stripeSubscription,
          );

        const newStatus =
          SubscriptionRepository.STRIPE_STATUS_MAP[stripeSubscription.status];

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
        message: t("sync.failed", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Handle NOWPayments success redirect.
   * Token is encoded in the `type` param as "subscription.TOKEN" — NowPayments
   * preserves the `type` param through the redirect, so the token always arrives.
   * Idempotent via renewalSessionKey.
   */
  static async handleNowPaymentsSuccessRedirect(
    callbackToken: string,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      logger.info("Processing NOWPayments success redirect", {
        userId,
      });

      const { paymentInvoices } = await import("../payment/db");

      const [matchedInvoice] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.callbackToken, callbackToken))
        .limit(1);

      if (!matchedInvoice?.metadata) {
        logger.warn("No invoice found for callback token", {
          userId,
          invoiceFound: matchedInvoice !== undefined,
          invoiceMetadataPresent: Boolean(matchedInvoice?.metadata),
        });
        return;
      }

      if (matchedInvoice.userId !== userId) {
        logger.warn("User mismatch on NOWPayments success redirect", {
          invoiceUserId: matchedInvoice.userId,
          requestUserId: userId,
        });
        return;
      }

      const meta = matchedInvoice.metadata as Record<string, string>;

      if (meta.type !== "subscription") {
        logger.info("Invoice is not a subscription, skipping", {
          type: meta.type,
        });
        return;
      }

      await SubscriptionRepository.handleSubscriptionCheckout(
        { id: matchedInvoice.providerInvoiceId, metadata: { ...meta, userId } },
        logger,
        locale,
      );

      logger.info("NOWPayments success redirect processed", {
        userId,
        invoiceId: matchedInvoice.providerInvoiceId,
      });

      // Growth funnel: first payment (write-once on the user's journey)
      const { GrowthJourneyRepository } =
        await import("@/leads/growth/repository");
      const { FunnelStep, PaidKind } = await import("@/leads/growth/enum");
      await GrowthJourneyRepository.markStep(
        { userId },
        FunnelStep.PAID,
        logger,
        PaidKind.SUBSCRIPTION,
      );
    } catch (error) {
      logger.error("Failed to process NOWPayments success redirect", {
        error: parseError(error),
        userId,
      });
    }
  }
}

// Type for native repository type checking
export type SubscriptionRepositoryType = Pick<
  typeof SubscriptionRepository,
  keyof typeof SubscriptionRepository
>;
