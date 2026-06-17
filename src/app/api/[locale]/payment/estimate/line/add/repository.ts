/**
 * Estimate Line Add Repository
 * Handles adding line items to draft estimates
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

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { paymentEstimateLines, paymentEstimates } from "../../../db";
import { EstimateStatus } from "../../../enum";
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

      const quantity = data.quantity ?? 1;
      const unitPrice = data.unitPrice;
      const taxRate = data.taxRate ?? 0;
      const taxAmount = quantity * unitPrice * taxRate;
      const lineTotal = quantity * unitPrice + taxAmount;

      // Get current max sort order for this estimate
      const existingLines = await db
        .select({ sortOrder: paymentEstimateLines.sortOrder })
        .from(paymentEstimateLines)
        .where(eq(paymentEstimateLines.estimateId, data.estimateId));

      const maxSortOrder = existingLines.reduce(
        (max, l) => Math.max(max, l.sortOrder ?? 0),
        -1,
      );

      const [line] = await db
        .insert(paymentEstimateLines)
        .values({
          estimateId: data.estimateId,
          description: data.description,
          productId: data.productId ?? null,
          quantity,
          unitPrice,
          taxRate,
          taxAmount,
          lineTotal,
          sortOrder: maxSortOrder + 1,
        })
        .returning();

      if (!line) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Update estimate totals by summing all lines
      await db
        .update(paymentEstimates)
        .set({
          subtotal: sql`(
            SELECT SUM(unit_price * quantity) FROM payment_estimate_lines
            WHERE estimate_id = ${data.estimateId}
          )`,
          taxAmount: sql`(
            SELECT SUM(tax_amount) FROM payment_estimate_lines
            WHERE estimate_id = ${data.estimateId}
          )`,
          total: sql`(
            SELECT SUM(line_total) FROM payment_estimate_lines
            WHERE estimate_id = ${data.estimateId}
          )`,
          updatedAt: new Date(),
        })
        .where(eq(paymentEstimates.id, data.estimateId));

      logger.debug("Estimate line added", {
        lineId: line.id,
        estimateId: data.estimateId,
        lineTotal,
      });

      return success({
        success: true,
        message: null,
        line: {
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
          createdAt: line.createdAt.toISOString(),
          updatedAt: line.updatedAt.toISOString(),
        },
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
