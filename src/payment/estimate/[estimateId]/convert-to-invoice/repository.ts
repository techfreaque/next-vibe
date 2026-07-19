/**
 * Convert Estimate to Invoice Repository
 * Creates a draft invoice from a SENT or ACCEPTED estimate, sets invoiceId on estimate,
 * marks estimate as CONVERTED.
 */

import "server-only";

import { eq, max } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
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

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import {
  paymentEstimateLines,
  paymentEstimates,
  paymentInvoiceLines,
  paymentInvoices,
} from "../../../db";
import { EstimateStatus, InvoiceStatus } from "../../../enum";
import type {
  EstimateConvertToInvoiceResponseOutput,
  EstimateConvertToInvoiceUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class EstimateConvertToInvoiceRepository {
  static async convertToInvoice(
    userId: string,
    urlPathParams: EstimateConvertToInvoiceUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<EstimateConvertToInvoiceResponseOutput>> {
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

      const allowedStatuses = [EstimateStatus.SENT, EstimateStatus.ACCEPTED];
      if (
        !allowedStatuses.includes(
          estimate.status as (typeof allowedStatuses)[number],
        )
      ) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Generate invoice sequence number
      const [{ value: maxSeq }] = await db
        .select({ value: max(paymentInvoices.invoiceSequenceNumber) })
        .from(paymentInvoices)
        .where(eq(paymentInvoices.companyId, estimate.companyId));

      const nextSeq = (maxSeq ?? 0) + 1;
      const arInvoiceId = `AR-${estimate.companyId.slice(0, 8)}-${String(nextSeq).padStart(6, "0")}`;

      // Validate currency against allowed values; fall back to EUR
      const rawCurrency = estimate.currency;
      const currency = (CurrenciesArr as readonly string[]).includes(
        rawCurrency,
      )
        ? (rawCurrency as (typeof CurrenciesArr)[number])
        : "EUR";

      // Create invoice from estimate
      const [invoice] = await db
        .insert(paymentInvoices)
        .values({
          userId,
          companyId: estimate.companyId,
          providerInvoiceId: arInvoiceId,
          invoiceSequenceNumber: nextSeq,
          currency,
          status: InvoiceStatus.DRAFT,
          amount: String(estimate.total),
          notes: estimate.notes ?? null,
          metadata: estimate.customerId
            ? { customerId: estimate.customerId }
            : null,
        })
        .returning();

      if (!invoice) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Copy estimate lines to invoice lines
      const estimateLineRows = await db
        .select()
        .from(paymentEstimateLines)
        .where(eq(paymentEstimateLines.estimateId, estimate.id))
        .orderBy(paymentEstimateLines.sortOrder);

      if (estimateLineRows.length > 0) {
        await db.insert(paymentInvoiceLines).values(
          estimateLineRows.map((l) => ({
            invoiceId: invoice.id,
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

      // Mark estimate as CONVERTED and set invoiceId
      await db
        .update(paymentEstimates)
        .set({
          status: EstimateStatus.CONVERTED,
          invoiceId: invoice.id,
          updatedAt: new Date(),
        })
        .where(eq(paymentEstimates.id, urlPathParams.estimateId));

      logger.info("Estimate converted to invoice", {
        estimateId: urlPathParams.estimateId,
        invoiceId: invoice.id,
        companyId: estimate.companyId,
      });

      return success({
        success: true,
        message: null,
        invoiceId: invoice.id,
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to convert estimate to invoice", {
        error: parsed.message,
      });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
