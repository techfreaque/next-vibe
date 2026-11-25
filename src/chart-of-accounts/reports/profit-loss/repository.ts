/**
 * Chart of Accounts — Profit & Loss Repository
 * Groups REVENUE and EXPENSE account movements within a date range
 */

import "server-only";

import { and, eq, gte, inArray, lt, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyAuthRepository } from "@/companies/repository";

import { accountNodes, journalEntries, journalEntryLines } from "../../db";
import {
  AccountSubtype,
  AccountType,
  ledgerEntryStatuses,
  LineType,
} from "../../enum";
import { scopedTranslation } from "../../i18n";
import {
  accountingDay,
  nextAccountingDay,
} from "../../shared/journal-validation";
import {
  findLedgerReportCompany,
  resolveLedgerReportCurrency,
} from "../../shared/report-currency";
import type { ProfitLossRequestOutput } from "./definition";

interface AccountLine {
  accountId: string;
  code: string;
  name: string;
  amount: number;
}

const COGS_SUBTYPES: Set<string> = new Set([AccountSubtype.COGS]);

const OPERATING_EXPENSE_SUBTYPES: Set<string> = new Set([
  AccountSubtype.PAYROLL,
  AccountSubtype.RENT,
  AccountSubtype.UTILITIES,
  AccountSubtype.OPEX,
]);

export class ProfitLossRepository {
  static async getProfitLoss(
    data: ProfitLossRequestOutput,
    logger: EndpointLogger,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      reportCompanyId: string;
      reportCompanyName: string;
      reportCurrency: string;
      fromResponse: Date;
      toResponse: Date;
      revenue: AccountLine[];
      totalRevenue: number;
      expenses: AccountLine[];
      totalExpenses: number;
      grossProfit: number;
      operatingProfit: number;
      netProfit: number;
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    if (data.companyId) {
      const authResult = await CompanyAuthRepository.requireMember(
        user.id,
        data.companyId,
        null,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }
    }

    try {
      const company = await findLedgerReportCompany(user.id, data.companyId);
      if (!company) {
        return fail({
          message: t("profitLoss.widget.selectCompany"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const today = new Date();
      const fromDate = data.from
        ? new Date(data.from)
        : new Date(Date.UTC(today.getUTCFullYear(), 0, 1));
      const toDate = data.to ? new Date(data.to) : today;

      const entryConditions = [
        eq(journalEntries.companyId, company.id),
        eq(accountNodes.companyId, company.id),
        inArray(journalEntries.status, ledgerEntryStatuses),
        gte(journalEntries.date, accountingDay(fromDate)),
        lt(journalEntries.date, nextAccountingDay(toDate)),
        inArray(accountNodes.type, [AccountType.REVENUE, AccountType.EXPENSE]),
      ];

      if (data.periodId) {
        entryConditions.push(eq(journalEntries.periodId, data.periodId));
      }

      // Sum net movement per account (credit - debit for revenue, debit - credit for expense)
      const reportCurrency = await resolveLedgerReportCurrency(
        company.currency,
        entryConditions,
        data.currency,
      );
      if (!reportCurrency) {
        return fail({
          message: t("reports.mixedCurrency"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }
      entryConditions.push(eq(journalEntryLines.currency, reportCurrency));

      const rows = await db
        .select({
          accountId: accountNodes.id,
          code: accountNodes.code,
          name: accountNodes.name,
          type: accountNodes.type,
          subtype: accountNodes.subtype,
          debitTotal: sql<number>`coalesce(sum(case when ${journalEntryLines.type} = ${LineType.DEBIT} then ${journalEntryLines.amount} else 0 end), 0)`,
          creditTotal: sql<number>`coalesce(sum(case when ${journalEntryLines.type} = ${LineType.CREDIT} then ${journalEntryLines.amount} else 0 end), 0)`,
        })
        .from(journalEntryLines)
        .innerJoin(
          journalEntries,
          eq(journalEntryLines.journalEntryId, journalEntries.id),
        )
        .innerJoin(
          accountNodes,
          eq(journalEntryLines.accountId, accountNodes.id),
        )
        .where(and(...entryConditions))
        .groupBy(
          accountNodes.id,
          accountNodes.code,
          accountNodes.name,
          accountNodes.type,
          accountNodes.subtype,
        )
        .orderBy(accountNodes.code);

      const revenue: AccountLine[] = [];
      const expenses: AccountLine[] = [];

      for (const r of rows) {
        const debit = Number(r.debitTotal);
        const credit = Number(r.creditTotal);

        if (r.type === AccountType.REVENUE) {
          // Revenue increases on credit side
          revenue.push({
            accountId: r.accountId,
            code: r.code,
            name: r.name,
            amount: credit - debit,
          });
        } else {
          // Expense increases on debit side
          expenses.push({
            accountId: r.accountId,
            code: r.code,
            name: r.name,
            amount: debit - credit,
          });
        }
      }

      const totalRevenue = revenue.reduce((s, a) => s + a.amount, 0);
      const totalExpenses = expenses.reduce((s, a) => s + a.amount, 0);

      // COGS for gross profit
      const cogsExpenses = rows
        .filter(
          (r) => r.type === AccountType.EXPENSE && COGS_SUBTYPES.has(r.subtype),
        )
        .reduce(
          (s, r) => s + (Number(r.debitTotal) - Number(r.creditTotal)),
          0,
        );

      const grossProfit = totalRevenue - cogsExpenses;

      // Operating expenses (exclude COGS, financial, tax)
      const operatingExpenses = rows
        .filter(
          (r) =>
            r.type === AccountType.EXPENSE &&
            !COGS_SUBTYPES.has(r.subtype) &&
            OPERATING_EXPENSE_SUBTYPES.has(r.subtype),
        )
        .reduce(
          (s, r) => s + (Number(r.debitTotal) - Number(r.creditTotal)),
          0,
        );

      const operatingProfit = grossProfit - operatingExpenses;
      const netProfit = totalRevenue - totalExpenses;

      return success({
        reportCompanyId: company.id,
        reportCompanyName: company.name,
        reportCurrency,
        fromResponse: fromDate,
        toResponse: toDate,
        revenue,
        totalRevenue,
        expenses,
        totalExpenses,
        grossProfit,
        operatingProfit,
        netProfit,
      });
    } catch (error) {
      logger.error("Error computing profit & loss", parseError(error));
      return fail({
        message: t("profitLoss.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
