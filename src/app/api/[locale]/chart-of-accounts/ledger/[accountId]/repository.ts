/**
 * Chart of Accounts — Account Ledger Repository
 * Returns paginated journal entry lines for an account with computed running balance
 */

import "server-only";

import { and, count, eq, gte, lte } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { CountryLanguage } from "@/i18n/core/config";

import { accountNodes, journalEntries, journalEntryLines } from "../../db";
import { JournalEntryStatus, LineType } from "../../enum";
import { scopedTranslation } from "../../i18n";
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
        date: string;
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

      const lineConditions = [
        eq(journalEntryLines.accountId, accountId),
        eq(journalEntries.status, JournalEntryStatus.POSTED),
      ];

      if (data.dateFrom) {
        lineConditions.push(gte(journalEntries.date, data.dateFrom));
      }
      if (data.dateTo) {
        lineConditions.push(lte(journalEntries.date, data.dateTo));
      }

      const where = and(...lineConditions);

      const [{ value: totalCount }] = await db
        .select({ value: count() })
        .from(journalEntryLines)
        .innerJoin(
          journalEntries,
          eq(journalEntryLines.journalEntryId, journalEntries.id),
        )
        .where(where);

      const page = data.page ?? 1;
      const pageSize = data.pageSize ?? 20;
      const offset = (page - 1) * pageSize;

      const rows = await db
        .select({
          id: journalEntryLines.id,
          entryId: journalEntries.id,
          entryNumber: journalEntries.entryNumber,
          date: journalEntries.date,
          lineDescription: journalEntryLines.description,
          type: journalEntryLines.type,
          amount: journalEntryLines.amount,
          currency: journalEntryLines.currency,
          sortOrder: journalEntryLines.sortOrder,
        })
        .from(journalEntryLines)
        .innerJoin(
          journalEntries,
          eq(journalEntryLines.journalEntryId, journalEntries.id),
        )
        .where(where)
        .orderBy(journalEntries.date, journalEntryLines.sortOrder)
        .limit(pageSize)
        .offset(offset);

      // Compute running balance: DEBIT increases balance, CREDIT decreases
      let runningBalance = 0;
      const lines = rows.map((row) => {
        if (row.type === LineType.DEBIT) {
          runningBalance += row.amount;
        } else {
          runningBalance -= row.amount;
        }
        return {
          id: row.id,
          entryId: row.entryId,
          entryNumber: row.entryNumber,
          date: row.date.toISOString(),
          description: row.lineDescription ?? null,
          type: row.type,
          amount: row.amount,
          currency: row.currency,
          runningBalance,
        };
      });

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
