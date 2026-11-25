/**
 * Payment Dashboard Repository
 * Queries KPI summaries for open/overdue invoices, unpaid bills, and drafts
 */

import "server-only";

import { and, count, eq, inArray, sql } from "drizzle-orm";
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

import { companies } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { getInvoiceOpenBalanceParts } from "@/finance/document-balance";

import { paymentBills, paymentEstimates, paymentInvoices } from "../db";
import { BillStatus, EstimateStatus, InvoiceStatus } from "../enum";
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

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const { payments, credits, paymentJoin, creditJoin, openAmount } =
        getInvoiceOpenBalanceParts(db, data.companyId);
      const unpaidBillStatuses = [
        BillStatus.RECEIVED,
        BillStatus.APPROVED,
        BillStatus.DISPUTED,
      ];
      const [invoiceTotals, billTotals, draftRows, companyRows] =
        await Promise.all([
          db
            .select({
              currency: paymentInvoices.currency,
              openCount: count(),
              overdueCount: sql<number>`count(*) filter (where ${paymentInvoices.dueDate} < ${today})::int`,
              open: sql<string>`COALESCE(SUM(${openAmount}), 0)`,
              overdue: sql<string>`COALESCE(SUM(${openAmount}) FILTER (WHERE ${paymentInvoices.dueDate} < ${today}), 0)`,
            })
            .from(paymentInvoices)
            .leftJoin(payments, paymentJoin)
            .leftJoin(credits, creditJoin)
            .where(
              and(
                eq(paymentInvoices.companyId, data.companyId),
                eq(paymentInvoices.status, InvoiceStatus.OPEN),
                sql`${openAmount} > 0`,
              ),
            )
            .groupBy(paymentInvoices.currency),
          db
            .select({
              currency: paymentBills.currency,
              unpaidCount: count(),
              unpaid: sql<string>`COALESCE(SUM(${paymentBills.total}), 0)`,
            })
            .from(paymentBills)
            .where(
              and(
                eq(paymentBills.companyId, data.companyId),
                inArray(paymentBills.status, unpaidBillStatuses),
              ),
            )
            .groupBy(paymentBills.currency),
          db
            .select({ count: count() })
            .from(paymentInvoices)
            .where(
              and(
                eq(paymentInvoices.companyId, data.companyId),
                eq(paymentInvoices.status, InvoiceStatus.DRAFT),
              ),
            ),
          db
            .select({ currency: companies.currency })
            .from(companies)
            .where(eq(companies.id, data.companyId))
            .limit(1),
        ]);
      const currencies = [
        ...new Set([
          ...invoiceTotals.map((row) => row.currency),
          ...billTotals.map((row) => row.currency),
        ]),
      ].toSorted();
      const byCurrency = currencies.map((code) => {
        const invoice = invoiceTotals.find((row) => row.currency === code);
        const bill = billTotals.find((row) => row.currency === code);
        return {
          currency: code,
          open: Number(invoice?.open ?? 0),
          overdue: Number(invoice?.overdue ?? 0),
          unpaid: Number(bill?.unpaid ?? 0),
        };
      });
      const currency = companyRows[0]?.currency ?? "EUR";
      const baseCurrencyTotals = byCurrency.find(
        (row) => row.currency === currency,
      );

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
          openAmount,
          dueDate: paymentInvoices.dueDate,
          createdAt: paymentInvoices.createdAt,
        })
        .from(paymentInvoices)
        .leftJoin(payments, paymentJoin)
        .leftJoin(credits, creditJoin)
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
          Number(row.openAmount) > 0 &&
          row.dueDate !== null &&
          row.dueDate < today,
        createdAt: row.createdAt,
      }));

      return success({
        openInvoices: {
          count: invoiceTotals.reduce((sum, row) => sum + row.openCount, 0),
          total: baseCurrencyTotals?.open ?? 0,
        },
        overdueInvoices: {
          count: invoiceTotals.reduce((sum, row) => sum + row.overdueCount, 0),
          total: baseCurrencyTotals?.overdue ?? 0,
        },
        unpaidBills: {
          count: billTotals.reduce((sum, row) => sum + row.unpaidCount, 0),
          total: baseCurrencyTotals?.unpaid ?? 0,
        },
        draftInvoices: { count: draftRows[0]?.count ?? 0 },
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
