/**
 * Current Lead Referral Code API Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { LeadCurrentReferralRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ user, locale, logger }) =>
      LeadCurrentReferralRepository.getLatestLeadReferralWithLabel(
        user.leadId,
        logger,
        locale,
      ),
  },
});
