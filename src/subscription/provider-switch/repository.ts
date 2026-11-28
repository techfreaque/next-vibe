/**
 * Subscription Provider Switch Repository
 *
 * Moves a card plan from the paused processor (Stripe) to the configured
 * switch target. Rules live in rules.ts. Flow:
 * 1. getOffer: what the subscription page shows (nothing without a target).
 * 2. startSwitch: stores a PENDING switch row and opens the target's checkout
 *    for the same plan and interval (metadata.switchId).
 * 3. The target's checkout webhook (or success redirect) reaches
 *    SubscriptionRepository.handleSubscriptionCheckout, which calls
 *    applyCheckoutSwitch for the carried-over period, stores the new plan,
 *    then stopOldPlan cancels the Stripe subscription (first caller only).
 */

import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserDetailLevel } from "next-vibe/identity/user/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import type { EndpointLogger } from "next-vibe/logger/types";

import { PaymentProvider, type PaymentProviderValue } from "../../payment/enum";
import { getPaymentProvider } from "../../payment/providers";
import {
  getCheckoutProviders,
  nowPaymentsAcceptsCards,
} from "../../payment/providers/availability";
import { getCryptoMinimumUsd } from "../../payment/providers/nowpayments/min-amounts";
import { StripeProvider } from "../../payment/providers/stripe/repository";
import {
  getTierProductForPlan,
  productsRepository,
} from "../../products/repository-client";
import { type Subscription, subscriptions } from "../db";
import { BillingInterval, SubscriptionStatus } from "../enum";
import { subscriptionProviderSwitches } from "./db";
import type {
  ProviderSwitchGetResponseOutput,
  ProviderSwitchPostResponseOutput,
} from "./definition";
import {
  OldPlanCancelMode,
  type OldPlanCancelModeValue,
  SwitchCarryOver,
  SwitchOfferState,
  SwitchStatus,
} from "./enum";
import type { SubscriptionProviderSwitchT } from "./i18n";
import {
  resolveBillingStartAt,
  resolveOldPlanCancelMode,
  resolveSwitchDeadline,
  resolveSwitchedPeriod,
  SWITCHABLE_STATUSES,
  type SwitchedPeriod,
} from "./rules";
import {
  getActiveSwitchTargets,
  type SubscriptionSwitchTarget,
  type SwitchInterval,
} from "./targets";

/** A Stripe plan that may move, plus the target that takes it. */
interface SwitchCandidate {
  subscription: Subscription & { providerSubscriptionId: string };
  target: SubscriptionSwitchTarget;
  interval: SwitchInterval;
  planSupported: boolean;
}

export interface AppliedSwitch extends SwitchedPeriod {
  /** True for the one caller that must cancel the old plan. */
  cancelOld: boolean;
}

/** True when the subscription still bills on the old card processor. */
export function isSwitchableSubscription(
  subscription: Pick<
    Subscription,
    "provider" | "status" | "providerSubscriptionId"
  >,
): boolean {
  return (
    subscription.provider === PaymentProvider.STRIPE &&
    Boolean(subscription.providerSubscriptionId) &&
    SWITCHABLE_STATUSES.includes(subscription.status)
  );
}

export class ProviderSwitchRepository {
  /** Stripe plan of this user that the active target can take, or null. */
  private static async findCandidate(
    userId: string,
    logger: EndpointLogger,
    provider?: typeof PaymentProviderValue,
  ): Promise<SwitchCandidate | null> {
    const available = getActiveSwitchTargets();
    const target = provider
      ? available.find((entry) => entry.provider === provider)
      : available[0];
    if (!target) {
      return null;
    }
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);
    if (!subscription || !isSwitchableSubscription(subscription)) {
      return null;
    }
    const providerSubscriptionId = subscription.providerSubscriptionId;
    if (!providerSubscriptionId) {
      return null;
    }
    // The target must also be open for new checkouts right now.
    const providers = await getCheckoutProviders(logger);
    if (!providers.includes(target.provider)) {
      return null;
    }
    const tierProductId = getTierProductForPlan(subscription.planId);
    const interval: SwitchInterval =
      subscription.billingInterval === BillingInterval.YEARLY
        ? "year"
        : "month";
    return {
      subscription: { ...subscription, providerSubscriptionId },
      target,
      interval,
      planSupported: tierProductId
        ? target.supportsPlan(tierProductId, interval)
        : false,
    };
  }

  static async getOffer(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    t: SubscriptionProviderSwitchT,
  ): Promise<ResponseType<ProviderSwitchGetResponseOutput>> {
    try {
      const candidate = await ProviderSwitchRepository.findCandidate(
        user.id,
        logger,
      );
      if (!candidate) {
        return success({
          offer: SwitchOfferState.NOT_ELIGIBLE,
          pastDue: false,
        });
      }
      const { subscription, target } = candidate;
      const now = new Date();
      const billingStartAt = resolveBillingStartAt(subscription, now);
      const period = resolveSwitchedPeriod({
        carryOver: target.carryOver,
        billingStartAt,
        billingInterval: subscription.billingInterval,
        now,
      });
      const deadline = resolveSwitchDeadline(subscription);
      return success({
        offer: candidate.planSupported
          ? SwitchOfferState.AVAILABLE
          : SwitchOfferState.PLAN_NOT_SUPPORTED,
        targetProvider: target.provider,
        providers: (await getCheckoutProviders(logger)).filter((entry) =>
          getActiveSwitchTargets().some((option) => option.provider === entry),
        ),
        nowPaymentsAcceptsCards: nowPaymentsAcceptsCards(),
        cryptoMinUsd: await getCryptoMinimumUsd(logger),
        plan: subscription.planId,
        billingInterval: subscription.billingInterval,
        pastDue: subscription.status === SubscriptionStatus.PAST_DUE,
        deadline: deadline ?? undefined,
        billingStartAt,
        firstPeriodEnd: period.periodEnd,
        carryOver: target.carryOver,
      });
    } catch (error) {
      logger.error("Provider switch offer failed", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async startSwitch(
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: SubscriptionProviderSwitchT,
    provider?: typeof PaymentProviderValue,
  ): Promise<ResponseType<ProviderSwitchPostResponseOutput>> {
    try {
      const candidate = await ProviderSwitchRepository.findCandidate(
        user.id,
        logger,
        provider,
      );
      if (!candidate) {
        return fail({
          message: t("errors.conflict.description"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }
      const { subscription, target, interval } = candidate;
      const tierProductId = getTierProductForPlan(subscription.planId);
      if (
        !candidate.planSupported ||
        !tierProductId ||
        !productsRepository.canPurchase(tierProductId)
      ) {
        return fail({
          message: t("errors.unsupportedPlan.description"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      const account = await UserRepository.getUserById(
        user.id,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );
      if (!account.success) {
        return fail({
          message: t("errors.notFound.description"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const paymentProvider = getPaymentProvider(target.provider);
      const customer = await paymentProvider.ensureCustomer(
        user.id,
        account.data.email,
        account.data.publicName || "",
        logger,
        locale,
      );
      if (!customer.success) {
        return customer;
      }

      const billingStartAt = resolveBillingStartAt(subscription, new Date());
      const [switchRow] = await db
        .insert(subscriptionProviderSwitches)
        .values({
          userId: user.id,
          fromProvider: subscription.provider,
          fromSubscriptionId: subscription.providerSubscriptionId,
          toProvider: target.provider,
          carryOver: target.carryOver,
          billingStartAt,
        })
        .returning({ id: subscriptionProviderSwitches.id });
      if (!switchRow) {
        return fail({
          message: t("errors.server.description"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const callbackToken = crypto.randomUUID();
      const appUrl = envClient.NEXT_PUBLIC_APP_URL;
      const session = await paymentProvider.createCheckoutSession(
        {
          userId: user.id,
          productId: tierProductId,
          interval,
          country: getCountryFromLocale(locale),
          locale,
          // Same return pages as a regular plan checkout, so the existing
          // success-redirect handling (NOWPayments) runs unchanged.
          successUrl: `${appUrl}/${locale}/subscription/overview?cbtoken=${callbackToken}&payment=success&type=subscription&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${appUrl}/${locale}/subscription/overview?payment=canceled&type=subscription`,
          metadata: {
            type: "subscription",
            userId: user.id,
            planId: subscription.planId,
            billingInterval: subscription.billingInterval,
            productId: tierProductId,
            interval,
            provider: target.provider,
            switchId: switchRow.id,
            switchBillingStartAt: billingStartAt.toISOString(),
          },
        },
        customer.data.customerId,
        logger,
        callbackToken,
        locale,
      );
      if (!session.success) {
        return session;
      }

      logger.info("Provider switch checkout opened", {
        userId: user.id,
        switchId: switchRow.id,
        toProvider: target.provider,
        billingStartAt: billingStartAt.toISOString(),
      });
      return success({
        checkoutUrl: session.data.checkoutUrl,
        sessionId: session.data.sessionId,
      });
    } catch (error) {
      logger.error("Provider switch checkout failed", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Called by handleSubscriptionCheckout BEFORE it stores the new plan.
   * Returns the carried-over period (identical for every caller of the same
   * switch) or null when the switch row is unknown. The first caller claims
   * the switch and gets cancelOld=true.
   */
  static async applyCheckoutSwitch(
    params: {
      switchId: string;
      userId: string;
      providerSubscriptionId: string | undefined;
      billingInterval: string;
    },
    logger: EndpointLogger,
  ): Promise<AppliedSwitch | null> {
    const [row] = await db
      .select()
      .from(subscriptionProviderSwitches)
      .where(
        and(
          eq(subscriptionProviderSwitches.id, params.switchId),
          eq(subscriptionProviderSwitches.userId, params.userId),
        ),
      )
      .limit(1);
    if (!row) {
      logger.error("Provider switch row not found for paid checkout", {
        switchId: params.switchId,
        userId: params.userId,
      });
      return null;
    }

    if (row.status === SwitchStatus.PENDING) {
      const [current] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, params.userId))
        .limit(1);
      const now = new Date();
      // Still on the old plan: carry its paid time over and stop it. Already
      // moved (a second checkout paid too): stack onto the time already
      // covered so nothing paid is lost, and leave the old plan alone.
      const stillOnOldPlan =
        current?.providerSubscriptionId === row.fromSubscriptionId;
      const coveredUntil =
        !stillOnOldPlan &&
        current?.currentPeriodEnd &&
        current.currentPeriodEnd.getTime() > row.billingStartAt.getTime()
          ? current.currentPeriodEnd
          : row.billingStartAt;
      let cancelMode: typeof OldPlanCancelModeValue | null = null;
      if (stillOnOldPlan && current) {
        const providers = await getCheckoutProviders(logger);
        cancelMode = resolveOldPlanCancelMode(
          current.status,
          !providers.includes(PaymentProvider.STRIPE),
        );
      }
      const period = resolveSwitchedPeriod({
        carryOver: row.carryOver,
        billingStartAt: coveredUntil,
        billingInterval: params.billingInterval,
        now,
      });
      const [claimed] = await db
        .update(subscriptionProviderSwitches)
        .set({
          status: SwitchStatus.COMPLETED,
          toSubscriptionId: params.providerSubscriptionId ?? null,
          cancelMode,
          newPeriodStart: period.periodStart,
          newPeriodEnd: period.periodEnd,
          completedAt: now,
          updatedAt: now,
        })
        .where(
          and(
            eq(subscriptionProviderSwitches.id, row.id),
            eq(subscriptionProviderSwitches.status, SwitchStatus.PENDING),
          ),
        )
        .returning({ id: subscriptionProviderSwitches.id });
      if (claimed) {
        logger.info("Provider switch paid", {
          switchId: row.id,
          userId: row.userId,
          periodEnd: period.periodEnd.toISOString(),
          cancelMode,
        });
        return { ...period, cancelOld: cancelMode !== null };
      }
      // Lost the race: read what the winner stored.
      return ProviderSwitchRepository.storedPeriod(row.id, row.carryOver);
    }

    return ProviderSwitchRepository.storedPeriod(row.id, row.carryOver);
  }

  private static async storedPeriod(
    switchId: string,
    carryOver: string,
  ): Promise<AppliedSwitch | null> {
    const [row] = await db
      .select({
        newPeriodStart: subscriptionProviderSwitches.newPeriodStart,
        newPeriodEnd: subscriptionProviderSwitches.newPeriodEnd,
        billingStartAt: subscriptionProviderSwitches.billingStartAt,
      })
      .from(subscriptionProviderSwitches)
      .where(eq(subscriptionProviderSwitches.id, switchId))
      .limit(1);
    if (!row?.newPeriodStart || !row.newPeriodEnd) {
      return null;
    }
    return {
      periodStart: row.newPeriodStart,
      periodEnd: row.newPeriodEnd,
      grantCreditsNow: !(
        carryOver === SwitchCarryOver.DEFERRED_START &&
        row.newPeriodEnd.getTime() === row.billingStartAt.getTime()
      ),
      cancelOld: false,
    };
  }

  /**
   * Stops the old Stripe plan after the new one is stored. Never refunds:
   * the remaining paid time already moved into the new period.
   */
  static async stopOldPlan(
    switchId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    const [row] = await db
      .select()
      .from(subscriptionProviderSwitches)
      .where(eq(subscriptionProviderSwitches.id, switchId))
      .limit(1);
    if (!row?.cancelMode) {
      return;
    }
    const stripe = StripeProvider.getStripe();
    let cancelError: string | null = null;
    if (!stripe) {
      cancelError = "Stripe is not configured";
    } else {
      try {
        if (row.cancelMode === OldPlanCancelMode.IMMEDIATE) {
          await stripe.subscriptions.cancel(row.fromSubscriptionId, {
            prorate: false,
            invoice_now: false,
          });
        } else {
          await stripe.subscriptions.update(row.fromSubscriptionId, {
            cancel_at_period_end: true,
          });
        }
      } catch (error) {
        cancelError = parseError(error).message;
      }
    }
    if (cancelError) {
      logger.error("Provider switch: old card plan not cancelled", {
        switchId: row.id,
        userId: row.userId,
        fromSubscriptionId: row.fromSubscriptionId,
        cancelMode: row.cancelMode,
        error: cancelError,
      });
      await db
        .update(subscriptionProviderSwitches)
        .set({
          status: SwitchStatus.CANCEL_FAILED,
          cancelError,
          updatedAt: new Date(),
        })
        .where(eq(subscriptionProviderSwitches.id, row.id));
      return;
    }
    logger.info("Provider switch: old card plan cancelled", {
      switchId: row.id,
      userId: row.userId,
      cancelMode: row.cancelMode,
    });
  }

  /**
   * True when a Stripe subscription was moved away by a switch. Its late
   * webhooks (updated / deleted / payment failed) then find no row on
   * purpose and must not be logged as errors.
   */
  static async isMovedAway(providerSubscriptionId: string): Promise<boolean> {
    const [row] = await db
      .select({ id: subscriptionProviderSwitches.id })
      .from(subscriptionProviderSwitches)
      .where(
        and(
          eq(
            subscriptionProviderSwitches.fromSubscriptionId,
            providerSubscriptionId,
          ),
          inArray(subscriptionProviderSwitches.status, [
            SwitchStatus.COMPLETED,
            SwitchStatus.CANCEL_FAILED,
          ]),
        ),
      )
      .limit(1);
    return Boolean(row);
  }
}
