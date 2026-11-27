/**
 * Checkout provider availability.
 *
 * Decides which payment providers may open NEW checkouts (subscriptions and
 * credit packs). Existing subscriptions are untouched: renewals, webhooks,
 * cancellations and the billing portal keep running on their provider.
 *
 * Stripe is skipped when either
 * - the operator sets STRIPE_CHECKOUT_PAUSED=true (manual switch), or
 * - the Stripe account reports `charges_enabled: false` (Stripe paused the
 *   account: prod 2026-11-27, every checkout failed with "Your account cannot
 *   currently make live charges"). Checked at most once per
 *   ACCOUNT_CHECK_TTL_MS and fail-open, so a Stripe API hiccup never hides a
 *   working provider.
 *
 * Whop (card) is offered only once the API key and webhook secret of the
 * active WHOP_ENVIRONMENT are set and WHOP_CHECKOUT_PAUSED is not true.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  type ErrorResponseType,
  ErrorResponseTypes,
  fail,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { scopedTranslation as checkoutScopedTranslation } from "../checkout/i18n";
import {
  PaymentProvider,
  PaymentProviderDB,
  type PaymentProviderValue,
} from "../enum";
import { paymentEnv } from "../env";
import { StripeProvider } from "./stripe/repository";
import { isWhopConfigured } from "./whop/config";

const ACCOUNT_CHECK_TTL_MS = 5 * 60 * 1000;

interface StripeAccountState {
  chargesEnabled: boolean;
  checkedAt: number;
}

let stripeAccountState: StripeAccountState | null = null;

/** Drops the cached Stripe account state (tests, manual re-check). */
export function resetCheckoutAvailabilityCache(): void {
  stripeAccountState = null;
}

export interface CheckoutProviderInputs {
  /** STRIPE_CHECKOUT_PAUSED */
  stripePaused: boolean;
  /** Stripe account `charges_enabled`; null when unknown (fail-open). */
  stripeChargesEnabled: boolean | null;
  /** Whop keys present and WHOP_CHECKOUT_PAUSED not set. */
  whopAvailable: boolean;
}

/** Pure decision, exported for tests. Order matches PaymentProviderDB. */
export function resolveCheckoutProviders(
  inputs: CheckoutProviderInputs,
): (typeof PaymentProviderValue)[] {
  const stripeOff =
    inputs.stripePaused || inputs.stripeChargesEnabled === false;
  return PaymentProviderDB.filter((provider) => {
    if (provider === PaymentProvider.STRIPE) {
      return !stripeOff;
    }
    if (provider === PaymentProvider.WHOP) {
      return inputs.whopAvailable;
    }
    return true;
  });
}

/** Whop can open checkouts: configured and not paused by the operator. */
export function isWhopCheckoutAvailable(): boolean {
  return isWhopConfigured() && paymentEnv.WHOP_CHECKOUT_PAUSED !== "true";
}

/**
 * `charges_enabled` describes LIVE mode. With a test key (dev, tests) test
 * charges keep working while the live account is paused, so the account
 * state must not switch card checkout off there. Object so tests can spy.
 */
export const stripeKeyMode = {
  isTest: (): boolean =>
    /^(sk|rk)_test_/.test(paymentEnv.STRIPE_SECRET_KEY ?? ""),
};

async function getStripeChargesEnabled(
  logger: EndpointLogger,
): Promise<boolean | null> {
  const stripe = StripeProvider.getStripe();
  if (!stripe || stripeKeyMode.isTest()) {
    // Unconfigured Stripe fails at checkout with its own "not configured"
    // error; availability only reflects an account-level pause.
    return null;
  }
  const cached = stripeAccountState;
  if (cached && Date.now() - cached.checkedAt < ACCOUNT_CHECK_TTL_MS) {
    return cached.chargesEnabled;
  }
  try {
    const account = await stripe.accounts.retrieveCurrent();
    const chargesEnabled = account.charges_enabled;
    if (!chargesEnabled && cached?.chargesEnabled !== false) {
      logger.warn("Stripe account has charges disabled: card checkout off", {
        disabledReason: account.requirements?.disabled_reason ?? null,
      });
    }
    stripeAccountState = { chargesEnabled, checkedAt: Date.now() };
    return chargesEnabled;
  } catch (error) {
    logger.warn("Stripe account check failed, keeping card checkout on", {
      error: parseError(error).message,
    });
    // Keep the last known state; retry after the TTL instead of per request.
    stripeAccountState = {
      chargesEnabled: cached?.chargesEnabled ?? true,
      checkedAt: Date.now(),
    };
    return cached?.chargesEnabled ?? null;
  }
}

/** Providers that may open a new checkout right now. */
export async function getCheckoutProviders(
  logger: EndpointLogger,
): Promise<(typeof PaymentProviderValue)[]> {
  const stripePaused = paymentEnv.STRIPE_CHECKOUT_PAUSED === "true";
  return resolveCheckoutProviders({
    stripePaused,
    // A manual pause needs no Stripe round trip.
    stripeChargesEnabled: stripePaused
      ? null
      : await getStripeChargesEnabled(logger),
    whopAvailable: isWhopCheckoutAvailable(),
  });
}

/** True once NOWPayments card payments (fiat operations) are switched on. */
export function nowPaymentsAcceptsCards(): boolean {
  return paymentEnv.NOWPAYMENTS_FIAT_ENABLED === "true";
}

/**
 * Guard for checkout repositories: a fail() when `provider` may not open a
 * checkout, null when it may. Runs before any provider call, so no customer
 * or session is created for a paused provider.
 */
export async function checkCheckoutProviderAvailable(
  provider: typeof PaymentProviderValue,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ErrorResponseType | null> {
  const providers = await getCheckoutProviders(logger);
  if (providers.includes(provider)) {
    return null;
  }
  logger.info("Checkout refused: provider paused", { provider });
  const { t } = checkoutScopedTranslation.scopedT(locale);
  return fail({
    message: t("availability.cardPausedError"),
    // The buy UI hides paused providers; reaching this is a stale page or a
    // direct API caller, so it is a client error, not a provider outage.
    errorType: ErrorResponseTypes.BAD_REQUEST,
  });
}
