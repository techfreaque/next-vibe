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
import type { TaxReportRequestOutput } from "./definition";

interface TaxLine {
  taxRateCode: string;
  taxRateName: string;
  netAmount: number;
  taxAmount: number;
  rate: number;
}

export class TaxReportRepository {
  static async getTaxReport(
    data: TaxReportRequestOutput,
    logger: EndpointLogger,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      reportCompanyId: string;
      reportCompanyName: string;
      reportCurrency: string;
      fromResponse: Date;
      toResponse: Date;
      vatCollected: number;
      vatReclaimable: number;
      netVatPayable: number;
      lines: TaxLine[];
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
          code: accountNodes.code,
          name: accountNodes.name,
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
        .where(and(...entryConditions))
        .groupBy(accountNodes.code, accountNodes.name, accountNodes.subtype)
        .orderBy(accountNodes.code);

      let vatCollected = 0;
      let vatReclaimable = 0;

      for (const r of rows) {
        const credit = Number(r.creditTotal);
        const debit = Number(r.debitTotal);

        if (r.subtype === AccountSubtype.VAT_PAYABLE) {
          // VAT collected = credit side (normal balance for liability)
          vatCollected += credit - debit;
        } else if (r.subtype === AccountSubtype.VAT_RECEIVABLE) {
          // VAT reclaimable = debit side (normal balance for asset)
          vatReclaimable += debit - credit;
        }
      }

      const netVatPayable = vatCollected - vatReclaimable;

      // Build tax lines — one per account, derive rate from account name/code heuristic
      // (in a real system this would join to a tax rates table)
      const lines: TaxLine[] = rows.map((r) => {
        const credit = Number(r.creditTotal);
        const debit = Number(r.debitTotal);
        const isPayable = r.subtype === AccountSubtype.VAT_PAYABLE;
        const taxAmount = isPayable ? credit - debit : debit - credit;

        // Derive a naive rate from the account code suffix (e.g. "MwSt 20" → 0.20)
        // Real implementations would join to a rates table
        const rateMatch = /(\d+)/.exec(r.name);
        const rate = rateMatch ? Number(rateMatch[1]) / 100 : 0;
        const netAmount = rate > 0 ? taxAmount / rate : 0;

        return {
          taxRateCode: r.code,
          taxRateName: r.name,
          netAmount,
          taxAmount,
          rate,
        };
      });

      return success({
        reportCompanyId: company.id,
        reportCompanyName: company.name,
        reportCurrency,
        fromResponse: fromDate,
        toResponse: toDate,
        vatCollected,
        vatReclaimable,
        netVatPayable,
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
