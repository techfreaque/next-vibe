/**
 * Card checkout provider pick (client + server safe, no IO).
 *
 * Stripe stays the card provider while it takes charges; Whop takes over
 * when Stripe is paused and Whop is configured. Unknown providers (older
 * server, read still loading) keep Stripe: the server refuses a paused
 * provider anyway.
 */

import { PaymentProvider, type PaymentProviderValue } from "../enum";

export type CardCheckoutProvider =
  | typeof PaymentProvider.STRIPE
  | typeof PaymentProvider.WHOP;

export function resolveCardCheckoutProvider(
  checkoutProviders: readonly (typeof PaymentProviderValue)[] | undefined,
): CardCheckoutProvider | null {
  if (checkoutProviders === undefined) {
    return PaymentProvider.STRIPE;
  }
  if (checkoutProviders.includes(PaymentProvider.STRIPE)) {
    return PaymentProvider.STRIPE;
  }
  if (checkoutProviders.includes(PaymentProvider.WHOP)) {
    return PaymentProvider.WHOP;
  }
  return null;
}
