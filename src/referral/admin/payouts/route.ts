/**
 * Admin Referral Payouts Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { AdminPayoutsRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, locale, logger }) =>
      AdminPayoutsRepository.listPayouts(data, locale, logger),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      AdminPayoutsRepository.processAction(data, user.id, locale, logger),
  },
});
