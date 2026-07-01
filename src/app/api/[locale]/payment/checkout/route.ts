/**
 * Subscription Checkout API Route
 * Creates Stripe checkout sessions for subscription plans
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { SubscriptionCheckoutRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger, t }) =>
      SubscriptionCheckoutRepository.checkout(data, user, locale, logger, t),
  },
});
