/**
 * Subscription Dashboard Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { SubscriptionDashboardRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, logger, locale }) =>
      SubscriptionDashboardRepository.getDashboardForUser(user, logger, locale),
  },
});
