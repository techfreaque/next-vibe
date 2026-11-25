import "server-only";

import { and, asc, eq, gte, inArray, lt, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { companies } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { accountNodes, journalEntries, journalEntryLines } from "../../db";
import { ledgerEntryStatuses, LineType } from "../../enum";
import { scopedTranslation as accountingTranslation } from "../../i18n";
import {
  accountingDay,
  journalLineType,
  nextAccountingDay,
} from "../../shared/journal-validation";
import { encodeJournalCsv, JOURNAL_EXPORT_MAX_ROWS } from "./csv";
import type {
  JournalExportRequestOutput,
  JournalExportResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class JournalExportRepository {
  static async exportJournal(
    data: JournalExportRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<JournalExportResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const { t: accountingT } = accountingTranslation.scopedT(locale);

    const currency = data.currency.trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(currency)) {
      return fail({
        message: t("currencyHint"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    const start = accountingDay(data.dateFrom);
    const lastDay = accountingDay(data.dateTo);
    if (
      !Number.isFinite(start.getTime()) ||
      !Number.isFinite(lastDay.getTime()) ||
      lastDay < start
    ) {
      return fail({
        message: t("invalidDates"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    try {
      const allowed = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        CompanyMemberRole.ACCOUNTANT,
        logger,
        locale,
      );
      if (!allowed.success) {
        return allowed;
      }

      const [company] = await db
        .select({ name: companies.name })
        .from(companies)
        .where(eq(companies.id, data.companyId));
      if (!company) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const rows = await db
        .select({
          entryNumber: journalEntries.entryNumber,
          date: journalEntries.date,
          postedAt: journalEntries.postedAt,
          sourceType: journalEntries.sourceType,
          accountCode: accountNodes.code,
          accountName: accountNodes.name,
          entryDescription: journalEntries.description,
          lineDescription: journalEntryLines.description,
          amount: sql<string>`${journalEntryLines.amount}::text`,
          type: journalEntryLines.type,
        })
        .from(journalEntries)
        .innerJoin(
          journalEntryLines,
          eq(journalEntryLines.journalEntryId, journalEntries.id),
        )
        .innerJoin(
          accountNodes,
          eq(accountNodes.id, journalEntryLines.accountId),
        )
        .where(
          and(
            eq(journalEntries.companyId, data.companyId),
            eq(accountNodes.companyId, data.companyId),
            eq(journalEntryLines.currency, currency),
            inArray(journalEntries.status, ledgerEntryStatuses),
            gte(journalEntries.date, start),
            lt(journalEntries.date, nextAccountingDay(lastDay)),
          ),
        )
        .orderBy(
          asc(journalEntries.date),
          asc(journalEntries.entryNumber),
          asc(journalEntries.id),
          asc(journalEntryLines.sortOrder),
          asc(journalEntryLines.id),
        )
        .limit(JOURNAL_EXPORT_MAX_ROWS + 1);

      if (rows.length > JOURNAL_EXPORT_MAX_ROWS) {
        return fail({
          message: t("tooLarge"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const exportLines = rows.map((row) => ({
        ...row,
        side: journalLineType(row.type),
      }));
      const debitCount = exportLines.filter(
        ({ side }) => side === LineType.DEBIT,
      ).length;
      const creditCount = exportLines.filter(
        ({ side }) => side === LineType.CREDIT,
      ).length;
      if (debitCount + creditCount !== rows.length) {
        return fail({
          message: t("invalidLine"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const csv = encodeJournalCsv(
        [
          t("headerEntry"),
          t("headerDate"),
          t("headerPosted"),
          t("headerSource"),
          t("headerAccountCode"),
          t("headerAccountName"),
          t("headerDescription"),
          t("headerLineDescription"),
          t("headerCurrency"),
          t("headerDebit"),
          t("headerCredit"),
        ],
        exportLines.map((row) => [
          { value: row.entryNumber },
          { value: row.date.toISOString().slice(0, 10) },
          { value: row.postedAt?.toISOString() ?? "" },
          { value: accountingT(row.sourceType) },
          { value: row.accountCode },
          { value: row.accountName },
          { value: row.entryDescription },
          { value: row.lineDescription ?? "" },
          { value: currency },
          {
            value: row.side === LineType.DEBIT ? row.amount : "",
            numeric: true,
          },
          {
            value: row.side === LineType.CREDIT ? row.amount : "",
            numeric: true,
          },
        ]),
      );
      if (csv === null) {
        return fail({
          message: t("tooLarge"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const fromOut = start.toISOString().slice(0, 10);
      const toOut = lastDay.toISOString().slice(0, 10);
      return success({
        companyIdOut: data.companyId,
        companyName: company.name,
        currencyOut: currency,
        fromOut,
        toOut,
        filename: `journal-${fromOut}_${toOut}-${currency}.csv`,
        rowCount: rows.length,
        debitCount,
        creditCount,
        csv,
      });
    } catch (error) {
      logger.error("Failed to export journal", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
