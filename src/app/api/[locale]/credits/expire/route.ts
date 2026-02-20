/**
 * Credit Expiration Route Handler
 * Called by cron to expire old subscription credits
 */

import "server-only";

import { success } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { CreditRepository } from "../repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ logger }) => {
      const result = await CreditRepository.expireCredits(logger);
      if (!result.success) {
        return result;
      }
      return success({ expiredCount: result.data });
    },
  },
});
