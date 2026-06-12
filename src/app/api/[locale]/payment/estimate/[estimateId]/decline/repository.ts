/**
 * Estimate Decline Repository
 * Transitions estimate from SENT to DECLINED status
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { paymentEstimates } from "../../../db";
import { EstimateStatus } from "../../../enum";
import { scopedTranslation } from "./i18n";
import type { EstimateDeclineResponseOutput } from "./definition";

export interface EstimateDeclineUrlPathParams {
  estimateId: string;
}

export class EstimateDeclineRepository {
  static async declineEstimate(
    userId: string,
    urlPathParams: EstimateDeclineUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<EstimateDeclineResponseOutput>> {
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

      if (estimate.status !== EstimateStatus.SENT) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      await db
        .update(paymentEstimates)
        .set({ status: EstimateStatus.DECLINED, updatedAt: new Date() })
        .where(eq(paymentEstimates.id, urlPathParams.estimateId));

      logger.debug("Estimate declined", {
        estimateId: urlPathParams.estimateId,
        userId,
      });

      return success({ success: true, message: null });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to decline estimate", { error: parsed.message });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
