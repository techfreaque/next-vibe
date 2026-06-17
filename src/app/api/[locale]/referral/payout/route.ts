/**
 * Referral Payout Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
