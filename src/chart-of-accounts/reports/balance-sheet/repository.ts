/**
 * Chart of Accounts — Balance Sheet Repository
 * Sums ASSET, LIABILITY, EQUITY account balances as of a date
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
      reportCompanyId: string;
      reportCompanyName: string;
      reportCurrency: string;
      asOfDateResponse: Date;
      assets: BalanceLine[];
      totalAssets: number;
      liabilities: BalanceLine[];
      totalLiabilities: number;
      equity: BalanceLine[];
      unclosedEarnings: number;
      totalEquity: number;
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
          message: t("balanceSheet.widget.selectCompany"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const asOfDate = data.asOfDate ? new Date(data.asOfDate) : new Date();

      const entryConditions = [
        eq(journalEntries.companyId, company.id),
        eq(accountNodes.companyId, company.id),
        inArray(journalEntries.status, ledgerEntryStatuses),
        lt(journalEntries.date, nextAccountingDay(asOfDate)),
      ];

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
          balanceUnits: sql<string>`(sum(case
            when ${journalEntryLines.type} = ${LineType.DEBIT} then ${lineAmountExpr}
            else -${lineAmountExpr}
          end) * 10000)::numeric(30, 0)`,
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

      const assets: BalanceLine[] = [];
      const liabilities: BalanceLine[] = [];
      const equity: BalanceLine[] = [];
      let assetUnits = BigInt(0);
      let liabilityUnits = BigInt(0);
      let equityUnits = BigInt(0);
      let unclosedUnits = BigInt(0);

      for (const row of rows) {
        const units = BigInt(row.balanceUnits);
        const line = {
          accountId: row.accountId,
          code: row.code,
          name: row.foreignSummary
            ? `${row.name} (${row.foreignSummary})`
            : row.name,
          subtype: row.subtype,
          balance:
            Number(row.type === AccountType.ASSET ? units : -units) / 10_000,
        };

        switch (row.type) {
          case AccountType.ASSET:
            assets.push(line);
            assetUnits += units;
            break;
          case AccountType.LIABILITY:
            liabilities.push(line);
            liabilityUnits -= units;
            break;
          case AccountType.EQUITY:
            equity.push(line);
            equityUnits -= units;
            break;
          case AccountType.REVENUE:
          case AccountType.EXPENSE:
            // Closing journal debits/credits cancel these nominal balances.
            unclosedUnits -= units;
            break;
        }
      }

      const combinedEquityUnits = equityUnits + unclosedUnits;
      const totalAssets = Number(assetUnits) / 10_000;
      const totalLiabilities = Number(liabilityUnits) / 10_000;
      const totalEquity = Number(combinedEquityUnits) / 10_000;
      const unclosedEarnings = Number(unclosedUnits) / 10_000;
      const isBalanced = assetUnits === liabilityUnits + combinedEquityUnits;

      return success({
        reportCompanyId: company.id,
        reportCompanyName: company.name,
        reportCurrency,
        asOfDateResponse: asOfDate,
        assets,
        totalAssets,
        liabilities,
        totalLiabilities,
        equity,
        unclosedEarnings,
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
