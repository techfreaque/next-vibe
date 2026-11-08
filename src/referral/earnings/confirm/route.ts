/**
 * Referral Earnings Confirm Route Handler
 * Called by cron: PENDING earnings past the refund window → CONFIRMED + credited
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { ReferralEarningsConfirmRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ logger, locale }) =>
      ReferralEarningsConfirmRepository.confirm(logger, locale),
  },
});
