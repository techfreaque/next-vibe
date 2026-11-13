/**
 * Subscription Stripe Sync Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { SubscriptionSyncStripeRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, t }) =>
      SubscriptionSyncStripeRepository.sync(data, logger, t),
  },
});
