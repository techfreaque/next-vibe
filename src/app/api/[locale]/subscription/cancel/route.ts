/**
 * Subscription Cancel API Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { SubscriptionRepository } from "../repository";
import definitions from "./definition";

export const { DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.DELETE]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) =>
      SubscriptionRepository.cancelSubscription(data, user.id, logger, locale),
  },
});
