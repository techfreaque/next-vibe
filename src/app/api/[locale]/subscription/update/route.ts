/**
 * Subscription Update API Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { SubscriptionRepository } from "../repository";
import definitions from "./definition";

export const { PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PUT]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) =>
      SubscriptionRepository.updateSubscription(data, user.id, locale, logger),
  },
});
