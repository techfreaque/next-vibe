/**
 * Subscription Admin List API Route Handler
 * Handles GET requests for listing subscriptions
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { SubscriptionAdminListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, logger, locale }) =>
      SubscriptionAdminListRepository.listSubscriptions(data, logger, locale),
  },
});
