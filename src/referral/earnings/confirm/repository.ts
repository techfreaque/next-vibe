import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";

import { ReferralRepository } from "../../repository";
import type { ReferralEarningsConfirmPostResponseOutput } from "./definition";

export class ReferralEarningsConfirmRepository {
  static async confirm(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ReferralEarningsConfirmPostResponseOutput>> {
    const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
    const result = await ReferralRepository.confirmMaturedEarnings(
      logger,
      creditsT,
    );
    if (!result.success) {
      return result;
    }
    return success<ReferralEarningsConfirmPostResponseOutput>(result.data);
  }
}
