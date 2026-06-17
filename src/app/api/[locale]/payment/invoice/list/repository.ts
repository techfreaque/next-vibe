/**
 * Invoice List Repository
 * Paginated list of AR invoices for a company
 */

import "server-only";

import { and, count, eq, inArray, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { z } from "zod";

import { companyMembers } from "@/app/api/[locale]/companies/db";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { paymentInvoiceLines, paymentInvoices } from "../../db";
import { InvoiceStatus } from "../../enum";
import type {
  InvoiceListRequestOutput,
  InvoiceListResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class InvoiceListRepository {
  static async listInvoices(
    userId: string,
    data: InvoiceListRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoiceListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      let companyFilter;

      if (data.companyId) {
        // Require VIEWER+ company membership for specific company
        const authResult = await CompanyAuthRepository.requireMember(
          userId,
          data.companyId,
          CompanyMemberRole.VIEWER,
          logger,
          locale,
        );
        if (!authResult.success) {
          return authResult;
        }
        companyFilter = eq(paymentInvoices.companyId, data.companyId);
      } else {
        // No company filter — scope to all companies the user belongs to
        const memberRows = await db
          .select({ companyId: companyMembers.companyId })
          .from(companyMembers)
          .where(
            and(
              eq(companyMembers.userId, userId),
              eq(companyMembers.isActive, true),
            ),
          );
        const companyIds = memberRows.map((r) => r.companyId);
        if (companyIds.length === 0) {
          return success({ total: 0, invoices: [] });
        }
        companyFilter = inArray(paymentInvoices.companyId, companyIds);
      }

      const where = data.status
        ? and(companyFilter, sql`${paymentInvoices.status} = ${data.status}`)
        : companyFilter;

      const [{ value: total }] = await db
        .select({ value: count() })
        .from(paymentInvoices)
        .where(where);

      const page = data.page ?? 1;
      const pageSize = data.pageSize ?? 20;
      const offset = (page - 1) * pageSize;

      const rows = await db
        .select()
        .from(paymentInvoices)
        .where(where)
        .orderBy(paymentInvoices.createdAt)
        .limit(pageSize)
        .offset(offset);

      // Get line counts for each invoice
      const invoiceIds = rows.map((r) => r.id);
      const lineCounts = new Map<string, number>();

      if (invoiceIds.length > 0) {
        for (const invoiceId of invoiceIds) {
          const [{ value: lc }] = await db
            .select({ value: count() })
            .from(paymentInvoiceLines)
            .where(eq(paymentInvoiceLines.invoiceId, invoiceId));
          lineCounts.set(invoiceId, lc ?? 0);
        }
      }

      const metadataSchema = z.object({ customerId: z.string().optional() });

      const invoiceList = rows
        .filter((row) => {
          // Filter by customerId if provided — stored in metadata.customerId
          if (data.customerId) {
            const parsed = metadataSchema.safeParse(row.metadata);
            return parsed.success && parsed.data.customerId === data.customerId;
          }
          return true;
        })
        .map((row) => {
          const parsed = metadataSchema.safeParse(row.metadata);
          const customerId = parsed.success
            ? (parsed.data.customerId ?? null)
            : null;

          const totalAmount = parseFloat(row.amount ?? "0");
          // amountPaid: for PAID invoices it is the full amount; otherwise 0
          const amountPaid =
            row.status === InvoiceStatus.PAID ? totalAmount : 0;
          const amountDue = Math.max(0, totalAmount - amountPaid);
          const isOverdue =
            row.status === InvoiceStatus.OPEN &&
            row.dueDate !== null &&
            row.dueDate < new Date();

          return {
            id: row.id,
            invoiceSequenceNumber: row.invoiceSequenceNumber ?? null,
            customerId,
            currency: row.currency,
            status: row.status,
            amount: row.amount,
            dueDate: row.dueDate ? row.dueDate.toISOString() : null,
            notes: row.notes ?? null,
            lineCount: lineCounts.get(row.id) ?? 0,
            amountPaid,
            amountDue,
            isOverdue,
            createdAt: row.createdAt.toISOString(),
            updatedAt: row.updatedAt.toISOString(),
          };
        });

      return success({
        total: total ?? 0,
        invoices: invoiceList,
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to list invoices", { error: parsed.message });
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
