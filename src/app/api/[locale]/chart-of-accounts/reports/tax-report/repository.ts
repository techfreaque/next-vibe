/**
 * Chart of Accounts — Tax Report Repository
 * Sums VAT_PAYABLE and VAT_RECEIVABLE account movements within a date range
 */

import "server-only";

import { and, eq, gte, lte, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { accountNodes, journalEntries, journalEntryLines } from "../../db";
import { AccountSubtype, JournalEntryStatus, LineType } from "../../enum";
import { scopedTranslation } from "../../i18n";
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
      fromResponse: Date;
      toResponse: Date;
      vatCollected: number;
      vatReclaimable: number;
      netVatPayable: number;
      lines: TaxLine[];
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

      const entryConditions = [
        eq(journalEntries.companyId, data.companyId),
        eq(journalEntries.status, JournalEntryStatus.POSTED),
        gte(journalEntries.date, fromDate),
        lte(journalEntries.date, toDate),
      ];

      // Query VAT_PAYABLE and VAT_RECEIVABLE accounts
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
        .where(
          and(
            and(...entryConditions),
            sql`${accountNodes.subtype} in (${AccountSubtype.VAT_PAYABLE}, ${AccountSubtype.VAT_RECEIVABLE})`,
          ),
        )
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
