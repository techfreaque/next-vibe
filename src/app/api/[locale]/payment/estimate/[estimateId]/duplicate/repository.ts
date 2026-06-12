/**
 * Estimate Duplicate Repository
 * Clones an estimate to a new DRAFT with the same lines and a new estimate number
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

import { paymentEstimateLines, paymentEstimates } from "../../../db";
import { EstimateStatus } from "../../../enum";
import { scopedTranslation } from "./i18n";
import type {
  EstimateDuplicateUrlPathParams,
  EstimateDuplicateResponseOutput,
} from "./definition";

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

      // Generate new estimate number: EST-{YYYY}-{NNNN} per company per year
      const year = new Date().getFullYear();
      const yearPrefix = `EST-${year}-`;

      const [{ value: countThisYear }] = await db
        .select({ value: sql<number>`count(*)::int` })
        .from(paymentEstimates)
        .where(
          sql`${paymentEstimates.companyId} = ${estimate.companyId}
          AND ${paymentEstimates.estimateNumber} LIKE ${`${yearPrefix}%`}`,
        );

      const nextSeq = (countThisYear ?? 0) + 1;
      const estimateNumber = `${yearPrefix}${String(nextSeq).padStart(4, "0")}`;

      // Clone the estimate
      const [newEstimate] = await db
        .insert(paymentEstimates)
        .values({
          companyId: estimate.companyId,
          estimateNumber,
          status: EstimateStatus.DRAFT,
          customerId: estimate.customerId ?? null,
          customerEmail: estimate.customerEmail ?? null,
          customerName: estimate.customerName ?? null,
          currency: estimate.currency,
          validUntil: estimate.validUntil ?? null,
          title: estimate.title ? `${estimate.title} (Copy)` : null,
          notes: estimate.notes ?? null,
          terms: estimate.terms ?? null,
          subtotal: estimate.subtotal,
          taxAmount: estimate.taxAmount,
          total: estimate.total,
        })
        .returning();

      if (!newEstimate) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Clone lines
      const sourceLines = await db
        .select()
        .from(paymentEstimateLines)
        .where(eq(paymentEstimateLines.estimateId, estimate.id))
        .orderBy(paymentEstimateLines.sortOrder);

      if (sourceLines.length > 0) {
        await db.insert(paymentEstimateLines).values(
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
