import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

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
