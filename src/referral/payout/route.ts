/**
 * Referral Payout Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import {
  payoutAdminEmailTemplate,
  PayoutRepository,
  payoutUserEmailTemplate,
} from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, locale, logger }) =>
      PayoutRepository.getEarnedBalance(user.id, locale, logger),
  },
  [Methods.POST]: {
    email: [
      {
        template: payoutUserEmailTemplate,
        ignoreErrors: false,
      },
      {
        template: payoutAdminEmailTemplate,
        ignoreErrors: true,
      },
    ],
    handler: ({ data, user, locale, logger }) =>
      PayoutRepository.requestPayout(data, user.id, locale, logger),
  },
});
