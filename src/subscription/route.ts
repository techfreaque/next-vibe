/**
 * Subscription API Route Handler
 * Handles GET (read) for subscription overview
 * Create, update, and cancel are in separate subdirectories
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import { SubscriptionRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: { GET: definition.GET },
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, logger, locale }) =>
      SubscriptionRepository.getSubscription(user.id, logger, locale),
  },
});
