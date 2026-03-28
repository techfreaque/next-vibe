/**
 * Referral Payout Route Handler
 */

import "server-only";

import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import { scopedTranslation as referralScopedTranslation } from "../i18n";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { success } from "../../shared/types/response.schema";
import { REFERRAL_CONFIG } from "../config";
import { PayoutCurrency } from "../enum";
import { ReferralRepository } from "../repository";
import definitions from "./definition";
import { payoutAdminEmailTemplate, payoutUserEmailTemplate } from "./email";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, locale, logger }) => {
      const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
      const result = await ReferralRepository.getEarnedBalance(
        user.id,
        logger,
        creditsT,
        locale,
      );
      if (!result.success) {
        return result;
      }
      return {
        success: true as const,
        data: {
          earnedCreditsTotal: result.data.earnedCredits.total,
          earnedCreditsAvailable: result.data.earnedCredits.available,
          earnedCreditsLocked: result.data.earnedCredits.locked,
          payoutHistory: result.data.payoutHistory,
        },
      };
    },
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
    handler: async ({ data, user, locale, logger }) => {
      const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
      const { t: referralT } = referralScopedTranslation.scopedT(locale);
      const result = await ReferralRepository.requestPayout(
        user.id,
        data.amountCents,
        data.currency,
        data.walletAddress ?? null,
        logger,
        creditsT,
        locale,
      );
      if (!result.success) {
        return result;
      }
      return success({
        payoutRequestId: result.data.payoutRequestId,
        message:
          data.currency === PayoutCurrency.CREDITS
            ? referralT("payout.success.creditsConverted")
            : referralT("payout.success.payoutRequested", {
                hours: REFERRAL_CONFIG.CRYPTO_PAYOUT_HOURS,
              }),
      });
    },
  },
});
