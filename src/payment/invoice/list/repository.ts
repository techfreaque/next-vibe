/**
 * Invoice List Repository
 * Paginated list of AR invoices for a company
 */

import "server-only";

import { and, count, eq, ilike, inArray, or, sql } from "drizzle-orm";
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

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { getDocumentCompanies } from "@/finance/document-company-scope";
import { documentPage, documentSearchPattern } from "@/finance/document-list";

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
      if (data.companyId) {
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
      }

      const selectedCompanies = await getDocumentCompanies(
        userId,
        data.companyId,
      );
      const companyNames = new Map(
        selectedCompanies.map((company) => [company.id, company.name]),
      );
      const hasFilters = Boolean(
        data.companyId || data.status || data.search || data.customerId,
      );
      const pageSize = data.pageSize;
      if (companyNames.size === 0) {
        if (data.companyId) {
          return fail({
            message: t("get.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        return success({
          total: 0,
          invoices: [],
          ...documentPage(0, data.page, pageSize),
          hasFilters,
          selectedCompanyId: null,
          selectedCompanyName: null,
        });
      }

      const pattern = data.search
        ? documentSearchPattern(data.search)
        : undefined;
      const where = and(
        inArray(paymentInvoices.companyId, [...companyNames.keys()]),
        data.status ? eq(paymentInvoices.status, data.status) : undefined,
        data.customerId
          ? sql`${paymentInvoices.metadata}->>'customerId' = ${data.customerId}`
          : undefined,
        pattern
          ? or(
              ilike(paymentInvoices.invoiceNumber, pattern),
              ilike(
                sql`${paymentInvoices.invoiceSequenceNumber}::text`,
                pattern,
              ),
              ilike(
                sql`'INV-' || ${paymentInvoices.invoiceSequenceNumber}::text`,
                pattern,
              ),
              ilike(sql`${paymentInvoices.id}::text`, pattern),
              ilike(sql`${paymentInvoices.metadata}->>'customerId'`, pattern),
            )
          : undefined,
      );
      const [{ value: total }] = await db
        .select({ value: count() })
        .from(paymentInvoices)
        .where(where);
      const pagination = documentPage(total, data.page, pageSize);
      const offset = (pagination.currentPage - 1) * pageSize;

      const rows = await db
        .select({
          id: paymentInvoices.id,
          companyId: paymentInvoices.companyId,
          invoiceNumber: paymentInvoices.invoiceNumber,
          invoiceSequenceNumber: paymentInvoices.invoiceSequenceNumber,
          customerId: sql<string | null>`case
            when jsonb_typeof(${paymentInvoices.metadata}->'customerId') = 'string'
            then ${paymentInvoices.metadata}->>'customerId'
          end`,
          currency: paymentInvoices.currency,
          status: paymentInvoices.status,
          amount: paymentInvoices.amount,
          dueDate: paymentInvoices.dueDate,
          notes: paymentInvoices.notes,
          createdAt: paymentInvoices.createdAt,
          updatedAt: paymentInvoices.updatedAt,
        })
        .from(paymentInvoices)
        .where(where)
        .orderBy(paymentInvoices.createdAt, paymentInvoices.id)
        .limit(pageSize)
        .offset(offset);

      const invoiceIds = rows.map((row) => row.id);
      const counts =
        invoiceIds.length === 0
          ? []
          : await db
              .select({ id: paymentInvoiceLines.invoiceId, value: count() })
              .from(paymentInvoiceLines)
              .where(inArray(paymentInvoiceLines.invoiceId, invoiceIds))
              .groupBy(paymentInvoiceLines.invoiceId);
      const lineCounts = new Map(counts.map(({ id, value }) => [id, value]));
      const now = new Date();
      const invoiceList = rows.map((row) => {
        const totalAmount = Number(row.amount);
        const amountPaid = row.status === InvoiceStatus.PAID ? totalAmount : 0;
        const isOverdue =
          row.status === InvoiceStatus.OPEN &&
          row.dueDate !== null &&
          row.dueDate < now;

        return {
          ...row,
          companyName: companyNames.get(row.companyId ?? "") ?? null,
          lineCount: lineCounts.get(row.id) ?? 0,
          amountPaid,
          amountDue: Math.max(0, totalAmount - amountPaid),
          isOverdue,
        };
      });

      return success({
        total,
        ...pagination,
        hasFilters,
        selectedCompanyId: data.companyId ?? null,
        selectedCompanyName: data.companyId
          ? (companyNames.get(data.companyId) ?? null)
          : null,
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
