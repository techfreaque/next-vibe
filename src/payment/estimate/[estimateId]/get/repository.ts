/**
 * Estimate Get Repository
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

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";

import { paymentEstimateLines, paymentEstimates } from "../../../db";
import type {
  EstimateGetResponseOutput,
  EstimateGetUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class EstimateGetRepository {
  static async getEstimate(
    userId: string,
    urlPathParams: EstimateGetUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<EstimateGetResponseOutput>> {
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
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const lines = await db
        .select()
        .from(paymentEstimateLines)
        .where(eq(paymentEstimateLines.estimateId, estimate.id))
        .orderBy(paymentEstimateLines.sortOrder);

      return success({
        id: estimate.id,
        companyId: estimate.companyId,
        estimateNumber: estimate.estimateNumber,
        status: estimate.status,
        customerId: estimate.customerId ?? null,
        customerEmail: estimate.customerEmail ?? null,
        customerName: estimate.customerName ?? null,
        currency: estimate.currency,
        validUntil: estimate.validUntil ?? null,
        title: estimate.title ?? null,
        notes: estimate.notes ?? null,
        terms: estimate.terms ?? null,
        subtotal: estimate.subtotal,
        taxAmount: estimate.taxAmount,
        total: estimate.total,
        invoiceId: estimate.invoiceId ?? null,
        createdAt: estimate.createdAt,
        updatedAt: estimate.updatedAt,
        lines: lines.map((l) => ({
          id: l.id,
          description: l.description,
          productId: l.productId ?? null,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          taxRate: l.taxRate,
          taxAmount: l.taxAmount,
          lineTotal: l.lineTotal,
          sortOrder: l.sortOrder ?? null,
        })),
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to get estimate", { error: parsed.message });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
