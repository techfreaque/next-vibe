/**
 * Chart of Accounts — Tax Report Repository
 * Sums VAT_PAYABLE and VAT_RECEIVABLE account movements within a date range
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

import { accountNodes, journalEntries, journalEntryLines } from "../../db";
import { AccountSubtype, ledgerEntryStatuses, LineType } from "../../enum";
import { scopedTranslation } from "../../i18n";
import {
  accountingDay,
  nextAccountingDay,
} from "../../shared/journal-validation";
import {
  findLedgerReportCompany,
  resolveLedgerReportCurrency,
} from "../../shared/report-currency";
import type {
  TaxReportRequestOutput,
  TaxReportResponseOutput,
} from "./definition";

export class TaxReportRepository {
  static async getTaxReport(
    data: TaxReportRequestOutput,
    logger: EndpointLogger,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<TaxReportResponseOutput>> {
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
          message: t("taxReport.widget.selectCompany"),
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
        gte(journalEntries.date, accountingDay(fromDate)),
        lt(journalEntries.date, nextAccountingDay(toDate)),
        inArray(accountNodes.subtype, [
          AccountSubtype.VAT_PAYABLE,
          AccountSubtype.VAT_RECEIVABLE,
        ]),
      ];

      // Query VAT_PAYABLE and VAT_RECEIVABLE accounts
      const reportCurrency = await resolveLedgerReportCurrency(
        company.currency,
        entryConditions,
        data.currency,
      );
      if (!reportCurrency) {
        return fail({
          message: t("reports.mixedCurrency"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }
      entryConditions.push(eq(journalEntryLines.currency, reportCurrency));

      const rows = await db
        .select({
          id: accountNodes.id,
          code: accountNodes.code,
          name: accountNodes.name,
          subtype: accountNodes.subtype,
          debitUnits: sql<string>`(
            SUM(CASE
              WHEN ${journalEntryLines.type} = ${LineType.DEBIT} THEN ${journalEntryLines.amount}
              WHEN ${journalEntryLines.type} = ${LineType.CREDIT} THEN -${journalEntryLines.amount}
              ELSE 0 END) * 10000
          )::bigint::text`,
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
        .groupBy(accountNodes.id)
        .orderBy(accountNodes.code, accountNodes.id);

      let collected = BigInt(0);
      let reclaimable = BigInt(0);
      const lines: NonNullable<TaxReportResponseOutput["lines"]> = rows.map(
        (row) => {
          const debitUnits = BigInt(row.debitUnits);
          const output = row.subtype === AccountSubtype.VAT_PAYABLE;
          const units = output ? -debitUnits : debitUnits;
          if (output) {
            collected += units;
          } else {
            reclaimable += units;
          }
          return {
            accountId: row.id,
            direction: output ? "output" : "input",
            taxRateCode: row.code,
            taxRateName: row.name,
            taxAmount: Number(units) / 10_000,
            netAmount: null,
            rate: null,
          };
        },
      );

      return success({
        reportCompanyId: company.id,
        reportCompanyName: company.name,
        reportCurrency,
        fromResponse: fromDate,
        toResponse: toDate,
        vatCollected: Number(collected) / 10_000,
        vatReclaimable: Number(reclaimable) / 10_000,
        netVatPayable: Number(collected - reclaimable) / 10_000,
        lines,
      });
    } catch (error) {
      logger.error("Error computing tax report", parseError(error));
      return fail({
        message: t("taxReport.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
