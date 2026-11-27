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
import { excludePeriodClosing } from "@/finance/supplier-evidence/monthly";

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
  resolveLedgerReportScope,
} from "../../shared/report-currency";
import type { ProfitLossRequestOutput } from "./definition";

interface AccountLine {
  accountId: string;
  code: string;
  name: string;
  amount: number;
}

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
        excludePeriodClosing(),
        gte(journalEntries.date, accountingDay(fromDate)),
        lt(journalEntries.date, nextAccountingDay(toDate)),
        inArray(accountNodes.type, [AccountType.REVENUE, AccountType.EXPENSE]),
      ];

      if (data.periodId) {
        entryConditions.push(eq(journalEntries.periodId, data.periodId));
      }

      // Sum net movement per account in functional currency when multi-currency
      const scope = await resolveLedgerReportScope(
        company.currency,
        entryConditions,
        data.currency,
      );
      if (!scope) {
        return fail({
          message: t("reports.mixedCurrency"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }
      const reportCurrency = scope.reportCurrency;
      if (scope.filterCurrency) {
        entryConditions.push(
          eq(journalEntryLines.currency, scope.filterCurrency),
        );
      }
      const lineAmountExpr = scope.useFunctionalAmount
        ? sql`coalesce(${journalEntryLines.functionalAmount}, ${journalEntryLines.amount})`
        : journalEntryLines.amount;

      const rows = await db
        .select({
          accountId: accountNodes.id,
          code: accountNodes.code,
          name: accountNodes.name,
          type: accountNodes.type,
          subtype: accountNodes.subtype,
          debitUnits: sql<string>`(
            sum(case
              when ${journalEntryLines.type} = ${LineType.DEBIT} then ${lineAmountExpr}
              when ${journalEntryLines.type} = ${LineType.CREDIT} then -${lineAmountExpr}
              else 0 end) * 10000
          )::numeric(30, 0)`,
          foreignSummary: scope.useFunctionalAmount
            ? sql<
                string | null
              >`string_agg(distinct case when ${journalEntryLines.currency} <> ${reportCurrency} then ${journalEntryLines.currency} else null end, ', ')`
            : sql<string | null>`null`,
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

      let revenueUnits = BigInt(0);
      let expenseUnits = BigInt(0);
      let cogsUnits = BigInt(0);
      let operatingUnits = BigInt(0);
      for (const row of rows) {
        const debit = BigInt(row.debitUnits);
        const isRevenue = row.type === AccountType.REVENUE;
        const units = isRevenue ? -debit : debit;
        const account = {
          accountId: row.accountId,
          code: row.code,
          name: row.foreignSummary
            ? `${row.name} (${row.foreignSummary})`
            : row.name,
          amount: Number(units) / 10_000,
        };
        if (isRevenue) {
          revenueUnits += units;
          revenue.push(account);
          continue;
        }
        expenseUnits += units;
        expenses.push(account);
        if (row.subtype === AccountSubtype.COGS) {
          cogsUnits += units;
        } else if (OPERATING_EXPENSE_SUBTYPES.has(row.subtype)) {
          operatingUnits += units;
        }
      }

      const grossUnits = revenueUnits - cogsUnits;

      return success({
        reportCompanyId: company.id,
        reportCompanyName: company.name,
        reportCurrency,
        fromResponse: fromDate,
        toResponse: toDate,
        revenue,
        totalRevenue: Number(revenueUnits) / 10_000,
        expenses,
        totalExpenses: Number(expenseUnits) / 10_000,
        grossProfit: Number(grossUnits) / 10_000,
        operatingProfit: Number(grossUnits - operatingUnits) / 10_000,
        netProfit: Number(revenueUnits - expenseUnits) / 10_000,
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
