/**
 * Admin Add Credits Repository
 * Handles adding credit packs to user accounts (admin only)
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../i18n";
import { CreditRepository } from "../repository";
import type {
  AdminAddCreditsPostRequestOutput,
  AdminAddCreditsPostResponseOutput,
} from "./definition";

export class AdminAddCreditsRepository {
  static async addCredits(
    data: AdminAddCreditsPostRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<AdminAddCreditsPostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
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
  }
}
