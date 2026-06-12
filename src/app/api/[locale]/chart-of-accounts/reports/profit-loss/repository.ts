/**
 * Chart of Accounts — Profit & Loss Repository
 * Groups REVENUE and EXPENSE account movements within a date range
 */

import "server-only";

import { and, eq, gte, lte, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import { accountNodes, journalEntries, journalEntryLines } from "../../db";
import {
  AccountSubtype,
  AccountType,
  JournalEntryStatus,
  LineType,
} from "../../enum";
import { scopedTranslation } from "../../i18n";
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
      fromResponse: string;
      toResponse: string;
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
      const today = new Date();
      const fromDate = data.from
        ? new Date(data.from)
        : new Date(today.getFullYear(), 0, 1);
      const toDate = data.to ? new Date(data.to) : today;

      const fromStr = fromDate.toISOString().slice(0, 10);
      const toStr = toDate.toISOString().slice(0, 10);

      const entryConditions = [
        eq(journalEntries.companyId, data.companyId),
        eq(journalEntries.status, JournalEntryStatus.POSTED),
        gte(journalEntries.date, fromDate),
        lte(journalEntries.date, toDate),
      ];

      if (data.periodId) {
        entryConditions.push(eq(journalEntries.periodId, data.periodId));
      }

      // Sum net movement per account (credit - debit for revenue, debit - credit for expense)
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
            sql`${accountNodes.type} in (${AccountType.REVENUE}, ${AccountType.EXPENSE})`,
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
        fromResponse: fromStr,
        toResponse: toStr,
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
