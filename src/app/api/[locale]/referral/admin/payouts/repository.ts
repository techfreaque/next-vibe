import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";

import { ReferralRepository } from "../../repository";
import type {
  AdminPayoutsGetRequestOutput,
  AdminPayoutsGetResponseOutput,
  AdminPayoutsPostRequestOutput,
  AdminPayoutsPostResponseOutput,
} from "./definition";

export const AdminPayoutsRepository = {
  async listPayouts(
    data: AdminPayoutsGetRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<AdminPayoutsGetResponseOutput>> {
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
    return success({
      items: result.data.requests,
      totalCount: result.data.totalCount,
    });
  },

  async processAction(
    data: AdminPayoutsPostRequestOutput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<AdminPayoutsPostResponseOutput>> {
    const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
    let result;
    if (data.action === "approve") {
      result = await ReferralRepository.approvePayoutRequest(
        data.requestId,
        userId,
        data.adminNotes ?? null,
        logger,
        locale,
      );
    } else if (data.action === "reject") {
      result = await ReferralRepository.rejectPayoutRequest(
        data.requestId,
        userId,
        data.rejectionReason ?? "",
        logger,
        locale,
      );
    } else {
      result = await ReferralRepository.completePayoutRequest(
        data.requestId,
        userId,
        data.adminNotes ?? null,
        logger,
        creditsT,
        locale,
      );
    }
    if (!result.success) {
      return result;
    }
    return success({
      success: true,
      message: "Action completed successfully",
    });
  },
};
