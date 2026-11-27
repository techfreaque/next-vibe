/**
 * Chart of Accounts: Statutory Statements Repository
 * Reads ledger balances (posted and reversed entries, like the balance sheet)
 * and maps them to the country's statutory layout.
 */

import "server-only";

import { and, eq, gte, inArray, lt, type SQL, sql } from "drizzle-orm";
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

import { companies } from "@/companies/db";
import { CompanyAuthRepository } from "@/companies/repository";
import { excludePeriodClosing } from "@/finance/supplier-evidence/monthly";
import { getCountryProfile } from "@/tax/compliance/profiles";

import { accountNodes, journalEntries, journalEntryLines } from "../../db";
import { ledgerEntryStatuses, LineType } from "../../enum";
import {
  accountingDay,
  nextAccountingDay,
} from "../../shared/journal-validation";
import {
  findLedgerReportCompany,
  resolveLedgerReportCurrency,
} from "../../shared/report-currency";
import { templateAccountLabel } from "../../templates/labels";
import {
  buildCountryStatutoryStatement,
  type SubtypedAccountBalance,
} from "./country-layouts";
import type {
  StatutoryStatementsRequestOutput,
  StatutoryStatementsResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";
import {
  buildMujStatement,
  type StatementLineId,
  type StatementLineValue,
} from "./layout";

const UNITS = 10_000;
const DAY_MS = 86_400_000;

function shiftYears(date: Date, years: number): Date {
  const shifted = new Date(date);
  shifted.setUTCFullYear(shifted.getUTCFullYear() + years);
  return shifted;
}

async function ledgerBalances(
  conditions: SQL[],
): Promise<SubtypedAccountBalance[]> {
  const rows = await db
    .select({
      code: accountNodes.code,
      name: accountNodes.name,
      type: accountNodes.type,
      subtype: accountNodes.subtype,
      units: sql<string>`(sum(case
        when ${journalEntryLines.type} = ${LineType.DEBIT} then ${journalEntryLines.amount}
        else -${journalEntryLines.amount}
      end) * 10000)::numeric(30, 0)`,
    })
    .from(journalEntryLines)
    .innerJoin(
      journalEntries,
      eq(journalEntryLines.journalEntryId, journalEntries.id),
    )
    .innerJoin(accountNodes, eq(journalEntryLines.accountId, accountNodes.id))
    .where(and(...conditions))
    .groupBy(
      accountNodes.code,
      accountNodes.name,
      accountNodes.type,
      accountNodes.subtype,
    )
    .orderBy(accountNodes.code);
  return rows.map((row) => ({
    code: row.code,
    name: row.name,
    type: row.type,
    subtype: row.subtype,
    units: Number(row.units),
  }));
}

export class StatutoryStatementsRepository {
  static async getStatements(
    data: StatutoryStatementsRequestOutput,
    logger: EndpointLogger,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<StatutoryStatementsResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const official = scopedTranslation.scopedT("sk-SK").t;

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
          message: t("widget.selectCompany"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const [companyRow] = await db
        .select({ country: companies.country })
        .from(companies)
        .where(eq(companies.id, company.id));
      const country = companyRow?.country?.trim().toUpperCase() ?? "";
      const layout = getCountryProfile(country).statements;

      // Default: the last completed calendar year, the usual filing period.
      const lastYear = new Date().getUTCFullYear() - 1;
      const from = data.from
        ? new Date(data.from)
        : new Date(Date.UTC(lastYear, 0, 1));
      const to = data.to
        ? new Date(data.to)
        : new Date(Date.UTC(lastYear, 11, 31));
      if (accountingDay(to).getTime() < accountingDay(from).getTime()) {
        return fail({
          message: t("errors.validation.description"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      // Comparative column: balance at the end of the previous period and
      // the same range one year earlier.
      const previousFrom = shiftYears(from, -1);
      const previousTo = new Date(accountingDay(from).getTime() - DAY_MS);

      const companyConditions = [
        eq(journalEntries.companyId, company.id),
        eq(accountNodes.companyId, company.id),
        inArray(journalEntries.status, ledgerEntryStatuses),
      ];
      const reportCurrency = await resolveLedgerReportCurrency(
        company.currency,
        [...companyConditions, lt(journalEntries.date, nextAccountingDay(to))],
        data.currency,
      );
      if (!reportCurrency) {
        return fail({
          message: t("errors.conflict.description"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }
      companyConditions.push(eq(journalEntryLines.currency, reportCurrency));

      const base = {
        reportCompanyId: company.id,
        reportCompanyName: company.name,
        reportCurrency,
        country,
        fromResponse: from,
        toResponse: to,
        previousFromResponse: previousFrom,
        previousToResponse: previousTo,
      };

      const balancesAsOf = (day: Date): Promise<SubtypedAccountBalance[]> =>
        ledgerBalances([
          ...companyConditions,
          lt(journalEntries.date, nextAccountingDay(day)),
        ]);
      const movementsBetween = (
        start: Date,
        end: Date,
      ): Promise<SubtypedAccountBalance[]> =>
        ledgerBalances([
          ...companyConditions,
          excludePeriodClosing(),
          gte(journalEntries.date, accountingDay(start)),
          lt(journalEntries.date, nextAccountingDay(end)),
        ]);

      const [balances, movements, previousBalances, previousMovements] =
        await Promise.all([
          balancesAsOf(to),
          movementsBetween(from, to),
          balancesAsOf(previousTo),
          movementsBetween(previousFrom, shiftYears(to, -1)),
        ]);

      if (layout !== "SK_MUJ") {
        const generic = buildCountryStatutoryStatement(
          layout,
          { balances, movements },
          { balances: previousBalances, movements: previousMovements },
        );
        return success({
          ...base,
          layout,
          available: true,
          balanceSheet: generic.balanceSheet.map((line) => ({
            ...line,
            current: line.current / UNITS,
            previous: line.previous / UNITS,
          })),
          profitLoss: generic.profitLoss.map((line) => ({
            ...line,
            current: line.current / UNITS,
            previous: line.previous / UNITS,
          })),
          unmapped: [],
          difference: generic.difference.current / UNITS,
          previousDifference: generic.difference.previous / UNITS,
          isBalanced:
            generic.difference.current === 0 &&
            generic.difference.previous === 0,
        });
      }

      const statement = buildMujStatement(
        { balances, movements },
        { balances: previousBalances, movements: previousMovements },
      );

      const present = <TId extends StatementLineId>(
        lines: StatementLineValue<TId>[],
      ): StatutoryStatementsResponseOutput["balanceSheet"] =>
        lines.map((line) => ({
          id: line.id,
          row: line.row,
          marker: line.marker,
          kind: line.kind,
          label: t(`lines.${line.id}`),
          officialLabel: official(`lines.${line.id}`),
          current: line.current / UNITS,
          previous: line.previous / UNITS,
        }));

      return success({
        ...base,
        layout,
        available: true,
        balanceSheet: present(statement.balanceSheet),
        profitLoss: present(statement.profitLoss),
        unmapped: statement.unmapped.map((account) => ({
          code: account.code,
          name: templateAccountLabel(
            country,
            account.code,
            account.name,
            locale,
          ),
          statement: account.statement,
          current: account.current / UNITS,
          previous: account.previous / UNITS,
        })),
        difference: statement.difference.current / UNITS,
        previousDifference: statement.difference.previous / UNITS,
        isBalanced:
          statement.difference.current === 0 &&
          statement.difference.previous === 0,
      });
    } catch (error) {
      logger.error("Error preparing statutory statements", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
