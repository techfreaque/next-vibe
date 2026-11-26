/**
 * Estimate Duplicate Repository
 * Clones an estimate to a new DRAFT with the same lines and a new estimate number
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

import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { getDocumentAccess } from "@/finance/document-company-scope";
import {
  getLineSettlementPolicy,
  LINE_SETTLEMENT_V1,
} from "@/tax/line-settlement";

import { paymentEstimateLines, paymentEstimates } from "../../../db";
import { EstimateStatus } from "../../../enum";
import { nextEstimateNumber, refreshEstimateTotals } from "../../draft";
import type {
  EstimateDuplicateResponseOutput,
  EstimateDuplicateUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class EstimateDuplicateRepository {
  static async duplicateEstimate(
    userId: string,
    urlPathParams: EstimateDuplicateUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<EstimateDuplicateResponseOutput>> {
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
        await lockLedgerCompany(tx, estimate.companyId);
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
        const [source] = await tx
          .select()
          .from(paymentEstimates)
          .where(eq(paymentEstimates.id, estimate.id))
          .for("share");
        if (!source || source.companyId !== estimate.companyId) {
          return fail({
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        const estimateNumber = await nextEstimateNumber(tx, source.companyId);
        // Clone the estimate
        const [newEstimate] = await tx
          .insert(paymentEstimates)
          .values({
            companyId: source.companyId,
            estimateNumber,
            status: EstimateStatus.DRAFT,
            customerId: source.customerId ?? null,
            customerEmail: source.customerEmail ?? null,
            customerName: source.customerName ?? null,
            currency: source.currency,
            metadata: getLineSettlementPolicy(source.currency, source.metadata)
              ? { lineSettlement: LINE_SETTLEMENT_V1 }
              : null,
            validUntil: source.validUntil ?? null,
            title: source.title,
            notes: source.notes ?? null,
            terms: source.terms ?? null,
            subtotal: source.subtotal,
            taxAmount: source.taxAmount,
            total: source.total,
          })
          .returning();

        if (!newEstimate) {
          return fail({
            message: t("post.errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }

        // Clone lines
        const sourceLines = await tx
          .select()
          .from(paymentEstimateLines)
          .where(eq(paymentEstimateLines.estimateId, source.id))
          .orderBy(paymentEstimateLines.sortOrder);

        if (sourceLines.length > 0) {
          await tx.insert(paymentEstimateLines).values(
            sourceLines.map((l) => ({
              estimateId: newEstimate.id,
              description: l.description,
              productId: l.productId ?? null,
              quantity: l.quantity,
              unitPrice: l.unitPrice,
              taxRate: l.taxRate,
              taxAmount: l.taxAmount,
              lineTotal: l.lineTotal,
              sortOrder: l.sortOrder ?? 0,
            })),
          );
        }

        await refreshEstimateTotals(tx, newEstimate.id);
        logger.info("Estimate duplicated", {
          sourceEstimateId: urlPathParams.estimateId,
          newEstimateId: newEstimate.id,
          estimateNumber,
        });

        return success({
          success: true,
          message: null,
          newEstimateId: newEstimate.id,
          estimateNumber: newEstimate.estimateNumber,
        });
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to duplicate estimate", { error: parsed.message });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
