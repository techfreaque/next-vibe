/**
 * Estimate Send Repository
 * Transitions estimate from DRAFT to SENT status
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { paymentEstimates } from "../../../db";
import { EstimateStatus } from "../../../enum";
import type { EstimateSendResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export interface EstimateSendUrlPathParams {
  estimateId: string;
}

export class EstimateSendRepository {
  static async sendEstimate(
    userId: string,
    urlPathParams: EstimateSendUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<EstimateSendResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [estimate] = await db
        .select()
        .from(paymentEstimates)
        .where(eq(paymentEstimates.id, urlPathParams.estimateId))
        .limit(1);

      if (!estimate) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        estimate.companyId,
        CompanyMemberRole.ACCOUNTANT,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      if (estimate.status !== EstimateStatus.DRAFT) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      await db
        .update(paymentEstimates)
        .set({ status: EstimateStatus.SENT, updatedAt: new Date() })
        .where(eq(paymentEstimates.id, urlPathParams.estimateId));

      logger.debug("Estimate sent", {
        estimateId: urlPathParams.estimateId,
        userId,
      });

      return success({ success: true, message: null });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to send estimate", { error: parsed.message });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
