import "server-only";

import { and, eq, gte, inArray, lt, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountType,
  ledgerEntryStatuses,
  LineType,
} from "@/chart-of-accounts/enum";

import { getDocumentAccess } from "../document-company-scope";
import type { FinanceT } from "../i18n";
import { monthRange, reportMonth } from "../report-period";
import { supplierProviderBindings } from "../supplier-evidence/db";
import {
  excludePeriodClosing,
  getMonthlyModelEstimates,
  getMonthlySupplierExpenses,
} from "../supplier-evidence/monthly";
import { ledgerAmountTotal, ledgerUnitsDecimal } from "./amount";
import type { MonthlyProfitRequest, MonthlyProfitResponse } from "./definition";

export class MonthlyProfitRepository {
  static async get(
    data: MonthlyProfitRequest,
    userId: string,
    t: FinanceT,
    logger: EndpointLogger,
  ): Promise<ResponseType<MonthlyProfitResponse>> {
    const { companyId } = data;
    const periodDate = data.from ?? data.to;
    const month =
      data.month ??
      (periodDate ? periodDate.slice(0, 7) : reportMonth(new Date()));
    const monthBounds = monthRange(month);
    const start = data.from ? new Date(data.from) : monthBounds.start;
    const end = data.to ? new Date(data.to) : monthBounds.end;
    if (data.to) {
      end.setUTCDate(end.getUTCDate() + 1);
    }
    if (start >= end) {
      return fail({
        message: t("profit.periodInvalid"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    const period = { start, end };
    try {
      const access = await getDocumentAccess(userId, { companyId });
      if (!access?.companyName) {
        return fail({
          message: t("errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      const [rows, bindings] = await Promise.all([
        db
          .select({
            id: accountNodes.id,
            code: accountNodes.code,
            name: accountNodes.name,
            subtype: accountNodes.subtype,
            type: accountNodes.type,
            currency: journalEntryLines.currency,
            amount: sql<string>`SUM(CASE
            WHEN (${accountNodes.type} = ${AccountType.REVENUE} AND ${journalEntryLines.type} = ${LineType.CREDIT})
              OR (${accountNodes.type} = ${AccountType.EXPENSE} AND ${journalEntryLines.type} = ${LineType.DEBIT})
              THEN ${journalEntryLines.amount} ELSE -${journalEntryLines.amount} END)::text`,
          })
          .from(journalEntryLines)
          .innerJoin(
            journalEntries,
            eq(journalEntryLines.journalEntryId, journalEntries.id),
          )
          .innerJoin(
            accountNodes,
            and(
              eq(journalEntryLines.accountId, accountNodes.id),
              eq(accountNodes.companyId, companyId),
            ),
          )
          .where(
            and(
              eq(journalEntries.companyId, companyId),
              inArray(accountNodes.type, [
                AccountType.REVENUE,
                AccountType.EXPENSE,
              ]),
              inArray(journalEntries.status, ledgerEntryStatuses),
              excludePeriodClosing(),
              gte(journalEntries.date, start),
              lt(journalEntries.date, end),
            ),
          )
          .groupBy(accountNodes.id, journalEntryLines.currency)
          .orderBy(journalEntryLines.currency, accountNodes.code),
        db
          .select({ provider: supplierProviderBindings.provider })
          .from(supplierProviderBindings)
          .where(eq(supplierProviderBindings.companyId, companyId)),
      ]);

      const [currencies, estimates] = await Promise.all([
        Promise.all(
          [...new Set(rows.map((row) => row.currency))].map(
            async (currency) => {
              const currencyRows = rows.filter(
                (row) => row.currency === currency,
              );
              const revenueAccounts = currencyRows.filter(
                (row) => row.type === AccountType.REVENUE,
              );
              const expenseAccounts = currencyRows.filter(
                (row) => row.type === AccountType.EXPENSE,
              );
              const revenue = ledgerAmountTotal(revenueAccounts);
              const expenses = ledgerAmountTotal(expenseAccounts);
              return {
                currency,
                revenue: ledgerUnitsDecimal(revenue),
                expenses: ledgerUnitsDecimal(expenses),
                net: ledgerUnitsDecimal(revenue - expenses),
                revenueAccounts,
                expenseAccounts,
                expenseAreas: expenseAccounts.length
                  ? await getMonthlySupplierExpenses(
                      companyId,
                      currency,
                      period,
                    )
                  : [],
              };
            },
          ),
        ),
        getMonthlyModelEstimates(
          period,
          bindings.map(({ provider }) => provider),
        ),
      ]);
      return success({
        report: {
          companyName: access.companyName,
          month,
          periodFrom: data.from,
          periodTo: data.to,
          currencies,
          estimates,
        },
      });
    } catch (error) {
      logger.error("Monthly profit report failed", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
