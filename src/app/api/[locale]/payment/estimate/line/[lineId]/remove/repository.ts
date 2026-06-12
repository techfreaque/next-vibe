/**
 * Estimate Line Remove Repository
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
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

import { paymentEstimateLines, paymentEstimates } from "../../../../db";
import { EstimateStatus } from "../../../../enum";
import { scopedTranslation } from "./i18n";
import type {
  EstimateLineRemoveUrlPathParams,
  EstimateLineRemoveResponseOutput,
} from "./definition";

export class EstimateLineRemoveRepository {
  static async removeLine(
    userId: string,
    urlPathParams: EstimateLineRemoveUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<EstimateLineRemoveResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      // Get the line to find its estimate
      const [line] = await db
        .select()
        .from(paymentEstimateLines)
        .where(eq(paymentEstimateLines.id, urlPathParams.lineId))
        .limit(1);

      if (!line) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify estimate and authorization
      const [estimate] = await db
        .select()
        .from(paymentEstimates)
        .where(eq(paymentEstimates.id, line.estimateId))
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
        .delete(paymentEstimateLines)
        .where(eq(paymentEstimateLines.id, urlPathParams.lineId));

      // Recalculate estimate totals
      await db
        .update(paymentEstimates)
        .set({
          subtotal: sql`COALESCE((
            SELECT SUM(unit_price * quantity) FROM payment_estimate_lines
            WHERE estimate_id = ${estimate.id}
          ), 0)`,
          taxAmount: sql`COALESCE((
            SELECT SUM(tax_amount) FROM payment_estimate_lines
            WHERE estimate_id = ${estimate.id}
          ), 0)`,
          total: sql`COALESCE((
            SELECT SUM(line_total) FROM payment_estimate_lines
            WHERE estimate_id = ${estimate.id}
          ), 0)`,
          updatedAt: new Date(),
        })
        .where(eq(paymentEstimates.id, estimate.id));

      logger.debug("Estimate line removed", {
        lineId: urlPathParams.lineId,
        estimateId: estimate.id,
      });

      return success({
        success: true,
        message: null,
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to remove estimate line", { error: parsed.message });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
