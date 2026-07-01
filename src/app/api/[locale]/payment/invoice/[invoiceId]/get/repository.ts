/**
 * Invoice Get Repository
 * Retrieves a single invoice with its lines, verifying company membership
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
import { z } from "zod";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";

import { paymentInvoiceLines, paymentInvoices } from "../../../db";
import type {
  InvoiceGetResponseOutput,
  InvoiceGetUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class InvoiceGetRepository {
  static async getInvoice(
    userId: string,
    urlPathParams: InvoiceGetUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoiceGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [invoice] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, urlPathParams.invoiceId))
        .limit(1);

      if (!invoice) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify company membership
      if (invoice.companyId) {
        const authResult = await CompanyAuthRepository.requireMember(
          userId,
          invoice.companyId,
          CompanyMemberRole.VIEWER,
          logger,
          locale,
        );
        if (!authResult.success) {
          return authResult;
        }
      } else if (invoice.userId !== userId) {
        // Fallback: owner check for invoices without companyId
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const lines = await db
        .select()
        .from(paymentInvoiceLines)
        .where(eq(paymentInvoiceLines.invoiceId, invoice.id))
        .orderBy(paymentInvoiceLines.sortOrder);

      const metadataSchema = z.object({ customerId: z.string().optional() });
      const parsedMeta = metadataSchema.safeParse(invoice.metadata);
      const customerId = parsedMeta.success
        ? (parsedMeta.data.customerId ?? null)
        : null;

      return success({
        id: invoice.id,
        companyId: invoice.companyId ?? null,
        customerId,
        invoiceSequenceNumber: invoice.invoiceSequenceNumber ?? null,
        currency: invoice.currency,
        status: invoice.status,
        amount: invoice.amount,
        dueDate: invoice.dueDate ?? null,
        paidAt: invoice.paidAt ?? null,
        notes: invoice.notes ?? null,
        journalEntryId: invoice.journalEntryId ?? null,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        lines: lines.map((l) => ({
          id: l.id,
          description: l.description,
          productId: l.productId ?? null,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          taxRate: l.taxRate ?? null,
          taxAmount: l.taxAmount,
          lineTotal: l.lineTotal,
          sortOrder: l.sortOrder ?? null,
          createdAt: l.createdAt,
          updatedAt: l.updatedAt,
        })),
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to get invoice", { error: parsed.message });
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
