/**
 * Estimate Line Add Repository
 * Handles adding line items to draft estimates
 */

import "server-only";

import { eq, max } from "drizzle-orm";
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

import { paymentEstimateLines, paymentEstimates } from "../../../db";
import { EstimateStatus } from "../../../enum";
import {
  estimateLine,
  estimateProductScope,
  refreshEstimateTotals,
} from "../../draft";
import type {
  EstimateLineAddRequestOutput,
  EstimateLineAddResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class EstimateLineAddRepository {
  static async addLine(
    userId: string,
    data: EstimateLineAddRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<EstimateLineAddResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [estimate] = await db
        .select()
        .from(paymentEstimates)
        .where(eq(paymentEstimates.id, data.estimateId))
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
        const [{ last }] = await tx
          .select({ last: max(paymentEstimateLines.sortOrder) })
          .from(paymentEstimateLines)
          .where(eq(paymentEstimateLines.estimateId, estimate.id));
        const values = estimateLine(data, (last ?? -1) + 1);
        if (
          !values ||
          Math.round(locked.total * 10_000) +
            Math.round(values.lineTotal * 10_000) >=
            1_000_000_000_000 ||
          !(await estimateProductScope(
            tx,
            locked.companyId,
            userId,
            data.productId ? [data.productId] : [],
          ))
        ) {
          return fail({
            message: t("post.errors.validation.title"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        const [line] = await tx
          .insert(paymentEstimateLines)
          .values({ ...values, estimateId: locked.id })
          .returning();
        if (!line) {
          return fail({
            message: t("post.errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
        await refreshEstimateTotals(tx, locked.id);
        logger.debug("Estimate line added", {
          lineId: line.id,
          estimateId: data.estimateId,
          lineTotal: line.lineTotal,
        });

        return success({
          success: true,
          message: null,
          line: {
            currency: locked.currency,
            id: line.id,
            estimateId: line.estimateId,
            description: line.description,
            productId: line.productId,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            taxRate: line.taxRate,
            taxAmount: line.taxAmount,
            lineTotal: line.lineTotal,
            sortOrder: line.sortOrder,
            createdAt: line.createdAt,
            updatedAt: line.updatedAt,
          },
        });
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to add estimate line", { error: parsed.message });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
