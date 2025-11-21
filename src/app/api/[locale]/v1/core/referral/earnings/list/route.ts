/**
 * Referral Earnings List API Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { referralRepository } from "../../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, logger, locale }) => {
      return await referralRepository.getReferralEarnings(
        user.id,
        data.limit ?? 50,
        data.offset ?? 0,
        locale,
        logger,
      );
    },
  },
});

