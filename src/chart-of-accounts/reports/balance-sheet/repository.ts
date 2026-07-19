/**
 * Chart of Accounts — Balance Sheet Repository
 * Sums ASSET, LIABILITY, EQUITY account balances as of a date
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
import type { BalanceSheetRequestOutput } from "./definition";

interface BalanceLine {
  accountId: string;
  code: string;
  name: string;
  subtype: string;
  balance: number;
}

export class BalanceSheetRepository {
  static async getBalanceSheet(
    data: BalanceSheetRequestOutput,
    logger: EndpointLogger,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      asOfDateResponse: Date;
      assets: BalanceLine[];
      totalAssets: number;
      liabilities: BalanceLine[];
      totalLiabilities: number;
      equity: BalanceLine[];
      totalEquity: number;
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

      const entryConditions = [
        eq(journalEntries.companyId, data.companyId),
        eq(journalEntries.status, JournalEntryStatus.POSTED),
        lte(journalEntries.date, asOfDate),
      ];

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
        .where(
          and(
            and(...entryConditions),
            sql`${accountNodes.type} in (${AccountType.ASSET}, ${AccountType.LIABILITY}, ${AccountType.EQUITY})`,
          ),
        )
        .groupBy(
          accountNodes.id,
          accountNodes.code,
          accountNodes.name,
          accountNodes.type,
          accountNodes.subtype,
        )
        .orderBy(accountNodes.code);

      const assets: BalanceLine[] = [];
      const liabilities: BalanceLine[] = [];
      const equity: BalanceLine[] = [];

      for (const r of rows) {
        const debit = Number(r.debitTotal);
        const credit = Number(r.creditTotal);

        if (r.type === AccountType.ASSET) {
          // Assets: debit normal
          assets.push({
            accountId: r.accountId,
            code: r.code,
            name: r.name,
            subtype: r.subtype,
            balance: debit - credit,
          });
        } else if (r.type === AccountType.LIABILITY) {
          // Liabilities: credit normal
          liabilities.push({
            accountId: r.accountId,
            code: r.code,
            name: r.name,
            subtype: r.subtype,
            balance: credit - debit,
          });
        } else {
          // Equity: credit normal
          equity.push({
            accountId: r.accountId,
            code: r.code,
            name: r.name,
            subtype: r.subtype,
            balance: credit - debit,
          });
        }
      }

      const totalAssets = assets.reduce((s, a) => s + a.balance, 0);
      const totalLiabilities = liabilities.reduce((s, a) => s + a.balance, 0);
      const totalEquity = equity.reduce((s, a) => s + a.balance, 0);
      const isBalanced =
        Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.0001;

      return success({
        asOfDateResponse: asOfDate,
        assets,
        totalAssets,
        liabilities,
        totalLiabilities,
        equity,
        totalEquity,
        isBalanced,
      });
    } catch (error) {
      logger.error("Error computing balance sheet", parseError(error));
      return fail({
        message: t("balanceSheet.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
