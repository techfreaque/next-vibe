/**
 * Payment Dashboard Repository
 * Queries KPI summaries for open/overdue invoices, unpaid bills, and drafts
 */

import "server-only";

import { and, count, eq, lt, sql } from "drizzle-orm";
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

import { paymentBills, paymentInvoices } from "../db";
import { InvoiceStatus } from "../enum";
import type {
  PaymentDashboardRequestOutput,
  PaymentDashboardResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class PaymentDashboardRepository {
  static async getDashboard(
    userId: string,
    data: PaymentDashboardRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<PaymentDashboardResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      if (!data.companyId) {
        return success({
          openInvoices: { count: 0, total: 0 },
          overdueInvoices: { count: 0, total: 0 },
          unpaidBills: { count: 0, total: 0 },
          draftInvoices: { count: 0 },
          currency: "EUR",
          recentInvoices: [],
        });
      }

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

      const now = new Date();

      // Open invoices (status = OPEN, not overdue)
      const openInvoicesRows = await db
        .select({
          cnt: count(),
          total: sql<string>`COALESCE(SUM(${paymentInvoices.amount}::numeric), 0)`,
        })
        .from(paymentInvoices)
        .where(
          and(
            eq(paymentInvoices.companyId, data.companyId),
            sql`${paymentInvoices.status} = ${InvoiceStatus.OPEN}`,
          ),
        );

      const openRow = openInvoicesRows[0];
      const openTotal = parseFloat(openRow?.total ?? "0");
      const openCount = openRow?.cnt ?? 0;

      // Overdue invoices (status = OPEN, dueDate < now)
      const overdueRows = await db
        .select({
          cnt: count(),
          total: sql<string>`COALESCE(SUM(${paymentInvoices.amount}::numeric), 0)`,
        })
        .from(paymentInvoices)
        .where(
          and(
            eq(paymentInvoices.companyId, data.companyId),
            sql`${paymentInvoices.status} = ${InvoiceStatus.OPEN}`,
            lt(paymentInvoices.dueDate, now),
          ),
        );

      const overdueRow = overdueRows[0];
      const overdueTotal = parseFloat(overdueRow?.total ?? "0");
      const overdueCount = overdueRow?.cnt ?? 0;

      // Unpaid bills (status not PAID — DRAFT, RECEIVED, APPROVED, DISPUTED)
      const unpaidBillRows = await db
        .select({
          cnt: count(),
          total: sql<string>`COALESCE(SUM(${paymentBills.total}::numeric), 0)`,
        })
        .from(paymentBills)
        .where(
          and(
            eq(paymentBills.companyId, data.companyId),
            sql`${paymentBills.status} != 'PAID'`,
          ),
        );

      const unpaidRow = unpaidBillRows[0];
      const unpaidTotal = parseFloat(unpaidRow?.total ?? "0");
      const unpaidCount = unpaidRow?.cnt ?? 0;

      // Draft invoices
      const draftRows = await db
        .select({ cnt: count() })
        .from(paymentInvoices)
        .where(
          and(
            eq(paymentInvoices.companyId, data.companyId),
            sql`${paymentInvoices.status} = ${InvoiceStatus.DRAFT}`,
          ),
        );

      const draftCount = draftRows[0]?.cnt ?? 0;

      // Detect currency from most recent invoice (fallback EUR)
      const currencyRows = await db
        .select({ currency: paymentInvoices.currency })
        .from(paymentInvoices)
        .where(eq(paymentInvoices.companyId, data.companyId))
        .orderBy(sql`${paymentInvoices.createdAt} DESC`)
        .limit(1);

      const currency = currencyRows[0]?.currency ?? "EUR";

      // Recent invoices (last 5, any status)
      const recentRows = await db
        .select({
          id: paymentInvoices.id,
          invoiceSequenceNumber: paymentInvoices.invoiceSequenceNumber,
          currency: paymentInvoices.currency,
          status: paymentInvoices.status,
          amount: paymentInvoices.amount,
          dueDate: paymentInvoices.dueDate,
          createdAt: paymentInvoices.createdAt,
        })
        .from(paymentInvoices)
        .where(eq(paymentInvoices.companyId, data.companyId))
        .orderBy(sql`${paymentInvoices.createdAt} DESC`)
        .limit(5);

      const recentInvoices = recentRows.map((row) => ({
        id: row.id,
        invoiceSequenceNumber: row.invoiceSequenceNumber ?? null,
        currency: row.currency,
        status: row.status,
        amount: row.amount,
        dueDate: row.dueDate ?? null,
        isOverdue:
          row.status === InvoiceStatus.OPEN &&
          row.dueDate !== null &&
          row.dueDate < now,
        createdAt: row.createdAt,
      }));

      return success({
        openInvoices: { count: openCount, total: openTotal },
        overdueInvoices: { count: overdueCount, total: overdueTotal },
        unpaidBills: { count: unpaidCount, total: unpaidTotal },
        draftInvoices: { count: draftCount },
        currency,
        recentInvoices,
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to load payment dashboard", {
        error: parsed.message,
      });
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
