/**
 * Chart of Accounts — Trial Balance Repository
 * Sums all posted debits/credits per account up to asOfDate (or within a period)
 */

import "server-only";

import { and, eq, inArray, lt, sql } from "drizzle-orm";
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
import { AccountType, ledgerEntryStatuses, LineType } from "../../enum";
import { scopedTranslation } from "../../i18n";
import { nextAccountingDay } from "../../shared/journal-validation";
import {
  findLedgerReportCompany,
  resolveLedgerReportScope,
} from "../../shared/report-currency";
import type { TrialBalanceRequestOutput } from "./definition";

interface AccountRow {
  accountId: string;
  code: string;
  name: string;
  type: string;
  debitTotal: number;
  creditTotal: number;
  balance: number;
}

const DEBIT_NORMAL_TYPES: Set<string> = new Set([
  AccountType.ASSET,
  AccountType.EXPENSE,
]);

export class TrialBalanceRepository {
  static async getTrialBalance(
    data: TrialBalanceRequestOutput,
    logger: EndpointLogger,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      reportCompanyId: string;
      reportCompanyName: string;
      reportCurrency: string;
      asOfDateResponse: string;
      accounts: AccountRow[];
      totalDebits: number;
      totalCredits: number;
      isBalanced: boolean;
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
          message: t("trialBalance.widget.selectCompany"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const asOfDate = data.asOfDate ? new Date(data.asOfDate) : new Date();

      const asOfDateStr = asOfDate.toISOString().slice(0, 10);

      // Build conditions for journal entries
      const entryConditions = [
        eq(journalEntries.companyId, company.id),
        eq(accountNodes.companyId, company.id),
        inArray(journalEntries.status, ledgerEntryStatuses),
        lt(journalEntries.date, nextAccountingDay(asOfDate)),
      ];

      if (data.periodId) {
        entryConditions.push(eq(journalEntries.periodId, data.periodId));
      }

      // Aggregate debit and credit totals per account (functional currency when multi-currency)
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
          accountId: journalEntryLines.accountId,
          code: accountNodes.code,
          name: accountNodes.name,
          type: accountNodes.type,
          debitUnits: sql<string>`(sum(case when ${journalEntryLines.type} = ${LineType.DEBIT} then ${lineAmountExpr} else 0 end) * 10000)::numeric(30, 0)`,
          creditUnits: sql<string>`(sum(case when ${journalEntryLines.type} = ${LineType.CREDIT} then ${lineAmountExpr} else 0 end) * 10000)::numeric(30, 0)`,
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
          journalEntryLines.accountId,
          accountNodes.code,
          accountNodes.name,
          accountNodes.type,
        )
        .orderBy(accountNodes.code);

      let totalDebitUnits = BigInt(0);
      let totalCreditUnits = BigInt(0);
      const accounts: AccountRow[] = rows.map((r) => {
        const debitUnits = BigInt(r.debitUnits);
        const creditUnits = BigInt(r.creditUnits);
        totalDebitUnits += debitUnits;
        totalCreditUnits += creditUnits;
        const balance = DEBIT_NORMAL_TYPES.has(r.type)
          ? debitUnits - creditUnits
          : creditUnits - debitUnits;

        return {
          accountId: r.accountId,
          code: r.code,
          name: r.foreignSummary ? `${r.name} (${r.foreignSummary})` : r.name,
          type: r.type,
          debitTotal: Number(debitUnits) / 10_000,
          creditTotal: Number(creditUnits) / 10_000,
          balance: Number(balance) / 10_000,
        };
      });

      const totalDebits = Number(totalDebitUnits) / 10_000;
      const totalCredits = Number(totalCreditUnits) / 10_000;
      const isBalanced = totalDebitUnits === totalCreditUnits;

      return success({
        reportCompanyId: company.id,
        reportCompanyName: company.name,
        reportCurrency,
        asOfDateResponse: asOfDateStr,
        accounts,
        totalDebits,
        totalCredits,
        isBalanced,
      });
    } catch (error) {
      logger.error("Error computing trial balance", parseError(error));
      return fail({
        message: t("trialBalance.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
