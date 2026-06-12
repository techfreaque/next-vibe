/**
 * Current Lead Referral Code API Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
