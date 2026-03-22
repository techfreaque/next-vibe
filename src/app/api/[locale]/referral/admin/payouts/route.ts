/**
 * Admin Referral Payouts Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";

import { ReferralRepository } from "../../repository";
import definitions from "./definition";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, locale, logger }) => {
      const result = await ReferralRepository.listPayoutRequests(
        data.status ?? null,
        50,
        0,
        logger,
        locale,
      );
      if (!result.success) {
        return result;
      }
      return {
        success: true as const,
        data: {
          items: result.data.requests,
          totalCount: result.data.totalCount,
        },
      };
    },
  },
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
      let result;
      if (data.action === "approve") {
        result = await ReferralRepository.approvePayoutRequest(
          data.requestId,
          user.id,
          data.adminNotes ?? null,
          logger,
          locale,
        );
      } else if (data.action === "reject") {
        result = await ReferralRepository.rejectPayoutRequest(
          data.requestId,
          user.id,
          data.rejectionReason ?? "",
          logger,
          locale,
        );
      } else {
        result = await ReferralRepository.completePayoutRequest(
          data.requestId,
          user.id,
          data.adminNotes ?? null,
          logger,
          creditsT,
          locale,
        );
      }
      if (!result.success) {
        return result;
      }
      return {
        success: true as const,
        data: {
          success: true,
          message: "Action completed successfully",
        },
      };
    },
  },
});
