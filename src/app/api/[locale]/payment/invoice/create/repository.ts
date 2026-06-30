/**
 * Invoice Create Repository
 * Creates a new AR invoice in DRAFT status with auto-incremented sequence number per company
 */

import "server-only";

import { eq, max } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { z } from "zod";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { CurrenciesArr, defaultLocale } from "@/i18n/core/config";

import { paymentInvoices } from "../../db";
import { InvoiceStatus } from "../../enum";
import type {
  InvoiceCreateRequestOutput,
  InvoiceCreateResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class InvoiceCreateRepository {
  static async createInvoice(
    userId: string,
    data: InvoiceCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoiceCreateResponseOutput>> {
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

      // Auto-generate sequence number: MAX(invoiceSequenceNumber) + 1 per company
      const [{ value: maxSeq }] = await db
        .select({ value: max(paymentInvoices.invoiceSequenceNumber) })
        .from(paymentInvoices)
        .where(eq(paymentInvoices.companyId, data.companyId));

      const nextSeq = (maxSeq ?? 0) + 1;

      // providerInvoiceId is NOT NULL — use the AR sequence number as provider ID
      const arInvoiceId = `AR-${data.companyId.slice(0, 8)}-${String(nextSeq).padStart(6, "0")}`;

      // Validate currency is one of the allowed values; fall back to EUR
      const rawCurrency = data.currency ?? "EUR";
      const currency = (CurrenciesArr as readonly string[]).includes(
        rawCurrency,
      )
        ? (rawCurrency as (typeof CurrenciesArr)[number])
        : "EUR";

      const [invoice] = await db
        .insert(paymentInvoices)
        .values({
          userId,
          companyId: data.companyId,
          providerInvoiceId: arInvoiceId,
          invoiceSequenceNumber: nextSeq,
          currency,
          status: InvoiceStatus.DRAFT,
          amount: "0",
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          notes: data.notes ?? null,
          metadata: data.customerId ? { customerId: data.customerId } : null,
        })
        .returning();

      if (!invoice) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.debug("AR invoice created", {
        invoiceId: invoice.id,
        companyId: data.companyId,
        seq: nextSeq,
      });

      const metadataSchema = z.object({ customerId: z.string().optional() });
      const parsedMeta = metadataSchema.safeParse(invoice.metadata);
      const customerId = parsedMeta.success
        ? (parsedMeta.data.customerId ?? null)
        : null;

      return success({
        success: true,
        message: null,
        invoice: {
          id: invoice.id,
          companyId: invoice.companyId ?? null,
          customerId,
          invoiceSequenceNumber: invoice.invoiceSequenceNumber ?? null,
          currency: invoice.currency,
          status: invoice.status,
          dueDate: invoice.dueDate ?? null,
          notes: invoice.notes ?? null,
          amount: invoice.amount,
          createdAt: invoice.createdAt,
          updatedAt: invoice.updatedAt,
        },
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to create AR invoice", { error: parsed.message });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
