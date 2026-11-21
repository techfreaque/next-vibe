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

import { paymentBills, paymentEstimates, paymentInvoices } from "../db";
import { EstimateStatus, InvoiceStatus } from "../enum";
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
          byCurrency: [],
          estimates: {
            sentCount: 0,
            draftCount: 0,
            sentByCurrency: [],
            recent: [],
          },
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

      // Totals per currency: invoices and bills are never summed across
      // currencies (the single-currency cards above are the first currency).
      const [invoiceTotals, billTotals] = await Promise.all([
        db
          .select({
            currency: paymentInvoices.currency,
            open: sql<string>`COALESCE(SUM(${paymentInvoices.amount}::numeric) FILTER (WHERE ${paymentInvoices.status} = ${InvoiceStatus.OPEN}), 0)`,
            overdue: sql<string>`COALESCE(SUM(${paymentInvoices.amount}::numeric) FILTER (WHERE ${paymentInvoices.status} = ${InvoiceStatus.OPEN} AND ${paymentInvoices.dueDate} < ${now}), 0)`,
          })
          .from(paymentInvoices)
          .where(eq(paymentInvoices.companyId, data.companyId))
          .groupBy(paymentInvoices.currency),
        db
          .select({
            currency: paymentBills.currency,
            unpaid: sql<string>`COALESCE(SUM(${paymentBills.total}::numeric) FILTER (WHERE ${paymentBills.status} != 'PAID'), 0)`,
          })
          .from(paymentBills)
          .where(eq(paymentBills.companyId, data.companyId))
          .groupBy(paymentBills.currency),
      ]);
      const currencies = [
        ...new Set([
          ...invoiceTotals.map((row) => row.currency),
          ...billTotals.map((row) => row.currency),
        ]),
      ];
      const byCurrency = currencies.map((code) => {
        const invoice = invoiceTotals.find((row) => row.currency === code);
        const bill = billTotals.find((row) => row.currency === code);
        return {
          currency: code,
          open: parseFloat(invoice?.open ?? "0"),
          overdue: parseFloat(invoice?.overdue ?? "0"),
          unpaid: parseFloat(bill?.unpaid ?? "0"),
        };
      });

      // Estimates: sent and awaiting an answer, drafts, last 5
      const [estimateCounts, estimateTotals, recentEstimates] =
        await Promise.all([
          db
            .select({
              sent: sql<number>`count(*) filter (where ${paymentEstimates.status} = ${EstimateStatus.SENT})::int`,
              draft: sql<number>`count(*) filter (where ${paymentEstimates.status} = ${EstimateStatus.DRAFT})::int`,
            })
            .from(paymentEstimates)
            .where(eq(paymentEstimates.companyId, data.companyId)),
          db
            .select({
              currency: paymentEstimates.currency,
              total: sql<string>`COALESCE(SUM(${paymentEstimates.total}::numeric), 0)`,
            })
            .from(paymentEstimates)
            .where(
              and(
                eq(paymentEstimates.companyId, data.companyId),
                eq(paymentEstimates.status, EstimateStatus.SENT),
              ),
            )
            .groupBy(paymentEstimates.currency),
          db
            .select({
              id: paymentEstimates.id,
              estimateNumber: paymentEstimates.estimateNumber,
              status: paymentEstimates.status,
              total: paymentEstimates.total,
              currency: paymentEstimates.currency,
              validUntil: paymentEstimates.validUntil,
            })
            .from(paymentEstimates)
            .where(eq(paymentEstimates.companyId, data.companyId))
            .orderBy(sql`${paymentEstimates.createdAt} DESC`)
            .limit(5),
        ]);
      const estimates = {
        sentCount: estimateCounts[0]?.sent ?? 0,
        draftCount: estimateCounts[0]?.draft ?? 0,
        sentByCurrency: estimateTotals.map((row) => ({
          currency: row.currency,
          total: parseFloat(row.total),
        })),
        recent: recentEstimates.map((row) => ({
          ...row,
          total: Number(row.total),
          validUntil: row.validUntil ?? null,
        })),
      };

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
        byCurrency,
        estimates,
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
