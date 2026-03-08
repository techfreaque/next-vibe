/**
 * Current Lead Referral Code API Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { ReferralRepository } from "../../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ user, locale, logger }) => {
      return await ReferralRepository.getLatestLeadReferralWithLabel(
        user.leadId,
        logger,
        locale,
      );
    },
  },
});
