/**
 * Estimate Create Repository
 * Creates a new estimate in DRAFT status with auto-generated number and optional lines
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

import { paymentEstimateLines, paymentEstimates } from "../../db";
import { EstimateStatus } from "../../enum";
import { scopedTranslation } from "./i18n";
import type {
  EstimateCreateRequestOutput,
  EstimateCreateResponseOutput,
} from "./definition";

export class EstimateCreateRepository {
  static async createEstimate(
    userId: string,
    data: EstimateCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<EstimateCreateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      // Require ACCOUNTANT or higher company membership
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        CompanyMemberRole.ACCOUNTANT,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      // Generate estimate number: EST-{YYYY}-{NNNN} per company per year
      const year = new Date().getFullYear();
      const yearPrefix = `EST-${year}-`;

      const [{ value: countThisYear }] = await db
        .select({ value: sql<number>`count(*)::int` })
        .from(paymentEstimates)
        .where(
          sql`${paymentEstimates.companyId} = ${data.companyId}
          AND ${paymentEstimates.estimateNumber} LIKE ${`${yearPrefix}%`}`,
        );

      const nextSeq = (countThisYear ?? 0) + 1;
      const estimateNumber = `${yearPrefix}${String(nextSeq).padStart(4, "0")}`;

      const [estimate] = await db
        .insert(paymentEstimates)
        .values({
          companyId: data.companyId,
          estimateNumber,
          status: EstimateStatus.DRAFT,
          customerId: data.customerId ?? null,
          customerEmail: data.customerEmail ?? null,
          customerName: data.customerName ?? null,
          currency: (data.currency ?? "EUR") as "EUR" | "PLN" | "USD",
          validUntil: data.validUntil ? new Date(data.validUntil) : null,
          title: data.title ?? null,
          notes: data.notes ?? null,
          terms: data.terms ?? null,
          subtotal: 0,
          taxAmount: 0,
          total: 0,
        })
        .returning();

      if (!estimate) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Insert lines if provided
      const lines = data.lines ?? [];
      if (lines.length > 0) {
        const lineValues = lines.map((line, idx) => {
          const qty = line.quantity ?? 1;
          const price = line.unitPrice;
          const rate = line.taxRate ?? 0;
          const taxAmt = qty * price * rate;
          const lineTotal = qty * price + taxAmt;
          return {
            estimateId: estimate.id,
            description: line.description,
            productId: line.productId ?? null,
            quantity: qty,
            unitPrice: price,
            taxRate: rate,
            taxAmount: taxAmt,
            lineTotal,
            sortOrder: line.sortOrder ?? idx,
          };
        });

        await db.insert(paymentEstimateLines).values(lineValues);

        // Recalculate totals
        const subtotal = lineValues.reduce(
          (sum, l) => sum + l.unitPrice * l.quantity,
          0,
        );
        const taxAmount = lineValues.reduce((sum, l) => sum + l.taxAmount, 0);
        const total = lineValues.reduce((sum, l) => sum + l.lineTotal, 0);

        await db
          .update(paymentEstimates)
          .set({ subtotal, taxAmount, total, updatedAt: new Date() })
          .where(eq(paymentEstimates.id, estimate.id));

        estimate.subtotal = subtotal;
        estimate.taxAmount = taxAmount;
        estimate.total = total;
      }

      logger.debug("Estimate created", {
        estimateId: estimate.id,
        estimateNumber,
        companyId: data.companyId,
      });

      return success({
        success: true,
        message: null,
        estimate: {
          id: estimate.id,
          companyId: estimate.companyId,
          estimateNumber: estimate.estimateNumber,
          status: estimate.status,
          currency: estimate.currency,
          subtotal: estimate.subtotal,
          taxAmount: estimate.taxAmount,
          total: estimate.total,
          createdAt: estimate.createdAt.toISOString(),
          updatedAt: estimate.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to create estimate", { error: parsed.message });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
