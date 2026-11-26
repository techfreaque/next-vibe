/**
 * Invoice List Repository
 * Paginated list of AR invoices for a company
 */

import "server-only";

import { and, count, desc, eq, ilike, inArray, lt, or, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { CurrenciesArr, defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { getInvoiceOpenBalanceParts } from "@/finance/document-balance";
import {
  canManageDocumentsInCompanySelection,
  getDocumentCompanies,
} from "@/finance/document-company-scope";
import { documentPage, documentSearchPattern } from "@/finance/document-list";

import { paymentInvoiceLines, paymentInvoices } from "../../db";
import { InvoiceStatus } from "../../enum";
import type {
  InvoiceListRequestOutput,
  InvoiceListResponseOutput,
} from "./definition";
import { OVERDUE_INVOICE_FILTER } from "./filters";
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
          canCreateInvoice: false,
        });
      }

      const pattern = data.search
        ? documentSearchPattern(data.search)
        : undefined;
      const overdueOnly = data.status === OVERDUE_INVOICE_FILTER;
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const {
        payments,
        credits,
        paymentJoin,
        creditJoin,
        amountPaid: paymentSum,
        openAmount,
      } = getInvoiceOpenBalanceParts(db, data.companyId);
      const customerId = sql<string | null>`case
        when jsonb_typeof(${paymentInvoices.metadata}->'customerId') = 'string'
        then ${paymentInvoices.metadata}->>'customerId'
      end`;
      const customerSnapshot = sql<string | null>`case
        when jsonb_typeof(${paymentInvoices.metadata}->'customerName') = 'string'
        then nullif(btrim(${paymentInvoices.metadata}->>'customerName'), '')
      end`;
      const linkedCustomerName = sql<
        string | null
      >`coalesce(nullif(btrim(${users.publicName}), ''), nullif(btrim(${users.privateName}), ''))`;
      const customerJoin = sql`${users.id}::text = ${customerId}`;
      const selectedStatus =
        data.status === OVERDUE_INVOICE_FILTER
          ? InvoiceStatus.OPEN
          : data.status;
      const where = and(
        inArray(paymentInvoices.companyId, [...companyNames.keys()]),
        data.selection === "credit"
          ? and(
              inArray(paymentInvoices.status, [
                InvoiceStatus.OPEN,
                InvoiceStatus.PAID,
              ]),
              sql`round(${paymentInvoices.amount}, 2) > round(coalesce(${credits.credited}, 0), 2)`,
            )
          : undefined,
        selectedStatus ? eq(paymentInvoices.status, selectedStatus) : undefined,
        overdueOnly
          ? and(lt(paymentInvoices.dueDate, today), sql`${openAmount} > 0`)
          : undefined,
        data.customerId ? sql`${customerId} = ${data.customerId}` : undefined,
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
              ilike(customerId, pattern),
              ilike(linkedCustomerName, pattern),
              ilike(customerSnapshot, pattern),
            )
          : undefined,
      );

      const countRows = db
        .select({ value: count() })
        .from(paymentInvoices)
        .$dynamic();
      if (pattern) {
        countRows.leftJoin(users, customerJoin);
      }
      if (overdueOnly) {
        countRows.leftJoin(payments, paymentJoin);
      }
      if (overdueOnly || data.selection === "credit") {
        countRows.leftJoin(credits, creditJoin);
      }
      const [{ value: total }] = await countRows.where(where);
      const pagination = documentPage(total, data.page, pageSize);
      const offset = (pagination.currentPage - 1) * pageSize;

      const rows = await db
        .select({
          id: paymentInvoices.id,
          companyId: paymentInvoices.companyId,
          invoiceNumber: paymentInvoices.invoiceNumber,
          invoiceSequenceNumber: paymentInvoices.invoiceSequenceNumber,
          customerId,
          customerName: sql<
            string | null
          >`coalesce(${linkedCustomerName}, ${customerSnapshot})`,
          currency: paymentInvoices.currency,
          status: paymentInvoices.status,
          amount: paymentInvoices.amount,
          recordedPayments: paymentSum,
          openAmount,
          dueDate: paymentInvoices.dueDate,
          notes: paymentInvoices.notes,
          createdAt: paymentInvoices.createdAt,
          updatedAt: paymentInvoices.updatedAt,
        })
        .from(paymentInvoices)
        .leftJoin(payments, paymentJoin)
        .leftJoin(credits, creditJoin)
        .leftJoin(users, customerJoin)
        .where(where)
        .orderBy(desc(paymentInvoices.createdAt), desc(paymentInvoices.id))
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
      const invoiceList = rows.map(
        ({ recordedPayments, openAmount: balance, ...row }) => {
          const totalAmount = Number(row.amount);
          const amountPaid =
            row.status === InvoiceStatus.PAID && Number(recordedPayments) === 0
              ? Math.max(0, totalAmount)
              : Number(recordedPayments);
          const amountDue =
            row.status === InvoiceStatus.OPEN ? Number(balance) : 0;
          const isOverdue =
            amountDue > 0 && row.dueDate !== null && row.dueDate < today;

          return {
            ...row,
            companyName: companyNames.get(row.companyId ?? "") ?? null,
            lineCount: lineCounts.get(row.id) ?? 0,
            amountPaid,
            amountDue,
            isOverdue,
          };
        },
      );

      const selectedCompanyId =
        data.companyId ??
        (selectedCompanies.length === 1 ? selectedCompanies[0]?.id : undefined);
      const selectedCompany = selectedCompanies.find(
        (company) => company.id === selectedCompanyId,
      );
      const selectedCompanyCurrency = z
        .enum(CurrenciesArr)
        .safeParse(selectedCompany?.currency);
      const canCreateInvoice = await canManageDocumentsInCompanySelection(
        userId,
        selectedCompanyId,
      );
      return success({
        total,
        ...pagination,
        hasFilters,
        selectedCompanyId: selectedCompanyId ?? null,
        selectedCompanyCurrency: selectedCompanyCurrency.success
          ? selectedCompanyCurrency.data
          : null,
        selectedCompanyName: selectedCompanyId
          ? (companyNames.get(selectedCompanyId) ?? null)
          : null,
        canCreateInvoice,
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
