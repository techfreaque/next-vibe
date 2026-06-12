import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import type { CountryLanguage } from "@/i18n/core/config";

import { REFERRAL_CONFIG } from "../config";
import { PayoutCurrency } from "../enum";
import { scopedTranslation as referralScopedTranslation } from "../i18n";
import { ReferralRepository } from "../repository";
import type {
  PayoutGetResponseOutput,
  PayoutPostRequestOutput,
  PayoutPostResponseOutput,
} from "./definition";

export const PayoutRepository = {
  async getEarnedBalance(
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PayoutGetResponseOutput>> {
    const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
    const result = await ReferralRepository.getEarnedBalance(
      userId,
      logger,
      creditsT,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({
      earnedCreditsTotal: result.data.earnedCredits.total,
      earnedCreditsAvailable: result.data.earnedCredits.available,
      earnedCreditsLocked: result.data.earnedCredits.locked,
      payoutHistory: result.data.payoutHistory,
    });
  },

  async requestPayout(
    data: PayoutPostRequestOutput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PayoutPostResponseOutput>> {
    const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
    const { t: referralT } = referralScopedTranslation.scopedT(locale);
    const result = await ReferralRepository.requestPayout(
      userId,
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
};

export { payoutAdminEmailTemplate, payoutUserEmailTemplate } from "./email";
