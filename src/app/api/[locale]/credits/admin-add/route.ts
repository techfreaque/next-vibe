/**
 * Admin Add Credits Route Handler
 * Adds credit packs to a user account (admin only)
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
    handler: async ({ data, logger, t, locale }) => {
      const result = await CreditRepository.addCredits(
        { userId: data.targetUserId },
        data.amount,
        "bonus",
        logger,
        t,
        locale,
      );
      if (!result.success) {
        return result;
      }
      return success({
        message: `Successfully added ${data.amount} bonus credits`,
      });
    },
  },
});
