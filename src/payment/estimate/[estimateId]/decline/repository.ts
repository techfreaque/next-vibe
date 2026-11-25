/**
 * Estimate Decline Repository
 * Transitions estimate from SENT to DECLINED status
 */

import "server-only";

import { and, eq } from "drizzle-orm";
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

import { getDocumentAccess } from "@/finance/document-company-scope";

import { paymentEstimates } from "../../../db";
import { EstimateStatus } from "../../../enum";
import type { EstimateDeclineResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

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

      return await db.transaction(async (tx) => {
        const access = await getDocumentAccess(
          userId,
          { companyId: estimate.companyId },
          tx,
        );
        if (!access?.canManage) {
          return fail({
            message: t("post.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        const now = new Date();
        const [updated] = await tx
          .update(paymentEstimates)
          .set({
            status: EstimateStatus.DECLINED,
            declinedAt: now,
            updatedAt: now,
          })
          .where(
            and(
              eq(paymentEstimates.id, estimate.id),
              eq(paymentEstimates.companyId, estimate.companyId),
              eq(paymentEstimates.status, EstimateStatus.SENT),
            ),
          )
          .returning({ id: paymentEstimates.id });
        if (!updated) {
          return fail({
            message: t("post.errors.conflict.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        logger.debug("Estimate declined", {
          estimateId: urlPathParams.estimateId,
          userId,
        });

        return success({ success: true, message: null });
      });
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
