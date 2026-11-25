/**
 * Chart of Accounts — Account Ledger Repository
 * Returns paginated journal entry lines for an account with computed running balance
 */

import "server-only";

import { and, count, eq, gte, inArray, lt, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { accountNodes, journalEntries, journalEntryLines } from "../../db";
import { ledgerEntryStatuses, LineType } from "../../enum";
import { scopedTranslation } from "../../i18n";
import {
  accountingDay,
  nextAccountingDay,
} from "../../shared/journal-validation";
import type { CoaLedgerRequestOutput } from "./definition";

export class CoaLedgerRepository {
  static async getLedger(
    accountId: string,
    data: CoaLedgerRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      lines: Array<{
        id: string;
        entryId: string;
        entryNumber: string;
        date: Date;
        description: string | null;
        type: string;
        amount: number;
        currency: string;
        runningBalance: number;
      }>;
      totalCount: number;
    }>
  > {
    try {
      // Look up the account to get its companyId for auth
      const [account] = await db
        .select({ companyId: accountNodes.companyId })
        .from(accountNodes)
        .where(eq(accountNodes.id, accountId))
        .limit(1);

      if (!account) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify VIEWER+ membership using the account's companyId
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        account.companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const movements = db
        .select({
          id: journalEntryLines.id,
          entryId: sql<string>`${journalEntries.id}`.as("entry_id"),
          entryNumber: journalEntries.entryNumber,
          date: journalEntries.date,
          description: journalEntryLines.description,
          type: journalEntryLines.type,
          amount: journalEntryLines.amount,
          currency: journalEntryLines.currency,
          sortOrder: journalEntryLines.sortOrder,
          runningBalance: sql`sum(case
            when ${journalEntryLines.type} = ${LineType.DEBIT} then ${journalEntryLines.amount}
            else -${journalEntryLines.amount}
          end) over (
            partition by ${journalEntryLines.currency}
            order by ${journalEntries.date}, ${journalEntries.id}, ${journalEntryLines.sortOrder}, ${journalEntryLines.id}
            rows unbounded preceding
          )`
            .mapWith(Number)
            .as("running_balance"),
        })
        .from(journalEntryLines)
        .innerJoin(
          journalEntries,
          eq(journalEntryLines.journalEntryId, journalEntries.id),
        )
        .where(
          and(
            eq(journalEntryLines.accountId, accountId),
            eq(journalEntries.companyId, account.companyId),
            inArray(journalEntries.status, ledgerEntryStatuses),
          ),
        )
        .as("ledger_movements");

      // Apply the date filter after calculating the window so the balance carries forward.
      const where = and(
        data.dateFrom
          ? gte(movements.date, accountingDay(data.dateFrom))
          : undefined,
        data.dateTo
          ? lt(movements.date, nextAccountingDay(data.dateTo))
          : undefined,
      );

      const page = data.page ?? 1;
      const pageSize = data.pageSize ?? 20;
      const offset = (page - 1) * pageSize;
      const [{ value: totalCount }] = await db
        .select({ value: count() })
        .from(movements)
        .where(where);
      const lines = await db
        .select({
          id: movements.id,
          entryId: movements.entryId,
          entryNumber: movements.entryNumber,
          date: movements.date,
          description: movements.description,
          type: movements.type,
          amount: movements.amount,
          currency: movements.currency,
          runningBalance: movements.runningBalance,
        })
        .from(movements)
        .where(where)
        .orderBy(
          movements.date,
          movements.entryId,
          movements.sortOrder,
          movements.id,
        )
        .limit(pageSize)
        .offset(offset);

      return success({ lines, totalCount: totalCount ?? 0 });
    } catch (error) {
      logger.error("Error fetching account ledger", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
