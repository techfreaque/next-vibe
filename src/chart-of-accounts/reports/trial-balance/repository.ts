/**
 * Chart of Accounts — Trial Balance Repository
 * Sums all posted debits/credits per account up to asOfDate (or within a period)
 */

import "server-only";

import { and, eq, lte, sql } from "drizzle-orm";
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
import { AccountType, JournalEntryStatus, LineType } from "../../enum";
import { scopedTranslation } from "../../i18n";
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
      asOfDateResponse: string;
      accounts: AccountRow[];
      totalDebits: number;
      totalCredits: number;
      isBalanced: boolean;
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

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

    try {
      const asOfDate = data.asOfDate ? new Date(data.asOfDate) : new Date();

      const asOfDateStr = asOfDate.toISOString().slice(0, 10);

      // Build conditions for journal entries
      const entryConditions = [
        eq(journalEntries.companyId, data.companyId),
        eq(journalEntries.status, JournalEntryStatus.POSTED),
        lte(journalEntries.date, asOfDate),
      ];

      if (data.periodId) {
        entryConditions.push(eq(journalEntries.periodId, data.periodId));
      }

      // Aggregate debit and credit totals per account
      const rows = await db
        .select({
          accountId: journalEntryLines.accountId,
          code: accountNodes.code,
          name: accountNodes.name,
          type: accountNodes.type,
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
          journalEntryLines.accountId,
          accountNodes.code,
          accountNodes.name,
          accountNodes.type,
        )
        .orderBy(accountNodes.code);

      const accounts: AccountRow[] = rows.map((r) => {
        const debitTotal = Number(r.debitTotal);
        const creditTotal = Number(r.creditTotal);
        const balance = DEBIT_NORMAL_TYPES.has(r.type)
          ? debitTotal - creditTotal
          : creditTotal - debitTotal;

        return {
          accountId: r.accountId,
          code: r.code,
          name: r.name,
          type: r.type,
          debitTotal,
          creditTotal,
          balance,
        };
      });

      const totalDebits = accounts.reduce((sum, a) => sum + a.debitTotal, 0);
      const totalCredits = accounts.reduce((sum, a) => sum + a.creditTotal, 0);
      const isBalanced = Math.abs(totalDebits - totalCredits) < 0.0001;

      return success({
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
