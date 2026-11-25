/**
 * Estimate Line Remove Repository
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

import { paymentEstimateLines, paymentEstimates } from "../../../../db";
import { EstimateStatus } from "../../../../enum";
import { refreshEstimateTotals } from "../../../draft";
import type {
  EstimateLineRemoveResponseOutput,
  EstimateLineRemoveUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

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
        const [locked] = await tx
          .select()
          .from(paymentEstimates)
          .where(eq(paymentEstimates.id, estimate.id))
          .for("update");
        if (
          !locked ||
          locked.companyId !== estimate.companyId ||
          locked.status !== EstimateStatus.DRAFT
        ) {
          return fail({
            message: t("post.errors.conflict.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
        const [removed] = await tx
          .delete(paymentEstimateLines)
          .where(
            and(
              eq(paymentEstimateLines.id, urlPathParams.lineId),
              eq(paymentEstimateLines.estimateId, locked.id),
            ),
          )
          .returning({ id: paymentEstimateLines.id });
        if (!removed) {
          return fail({
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        await refreshEstimateTotals(tx, locked.id);
        logger.debug("Estimate line removed", {
          lineId: urlPathParams.lineId,
          estimateId: estimate.id,
        });

        return success({
          success: true,
          message: null,
        });
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
