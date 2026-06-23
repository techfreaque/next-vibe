/**
 * Chart of Accounts — Journal Create Repository
 * Validates double-entry balance, generates entry number, inserts entry + lines
 */

import "server-only";

import { count, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { accountingPeriods, journalEntries, journalEntryLines } from "../../db";
import { LineType, PeriodStatus } from "../../enum";
import { scopedTranslation } from "../../i18n";
import type { CoaJournalCreateRequestOutput } from "./definition";

export class CoaJournalCreateRepository {
  static async createEntry(
    data: CoaJournalCreateRequestOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ id: string; entryNumber: string }>> {
    try {
      const { t } = scopedTranslation.scopedT(locale);

      // Verify ACCOUNTANT+ company membership
      const authResult = await CompanyAuthRepository.requireMember(
        user.id,
        data.companyId,
        CompanyMemberRole.ACCOUNTANT,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      // Validate minimum two lines
      if (data.lines.length < 2) {
        return fail({
          message: t("journalCreate.errorEmptyLines"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Validate debits = credits
      let totalDebit = 0;
      let totalCredit = 0;
      for (const line of data.lines) {
        if (line.type === LineType.DEBIT) {
          totalDebit += line.amount;
        } else {
          totalCredit += line.amount;
        }
      }

      if (Math.abs(totalDebit - totalCredit) > 0.0001) {
        return fail({
          message: t("journalCreate.errorNotBalanced"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Check period exists and is open
      const [period] = await db
        .select()
        .from(accountingPeriods)
        .where(eq(accountingPeriods.id, data.periodId))
        .limit(1);

      if (!period) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (period.status !== PeriodStatus.OPEN) {
        return fail({
          message: t("journalCreate.errorPeriodClosed"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Generate entry number: count existing entries in period + 1
      const [{ value: existingCount }] = await db
        .select({ value: count() })
        .from(journalEntries)
        .where(eq(journalEntries.periodId, data.periodId));

      const entrySeq = (existingCount ?? 0) + 1;
      const year = new Date(data.date).getFullYear();
      const entryNumber = `JE-${year}-${String(entrySeq).padStart(4, "0")}`;

      const [entry] = await db
        .insert(journalEntries)
        .values({
          companyId: data.companyId,
          periodId: data.periodId,
          entryNumber,
          date: new Date(data.date),
          description: data.description,
          memo: data.memo ?? null,
        })
        .returning({
          id: journalEntries.id,
          entryNumber: journalEntries.entryNumber,
        });

      if (!entry) {
        return fail({
          message: t("errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      for (const [idx, line] of data.lines.entries()) {
        await db.insert(journalEntryLines).values({
          journalEntryId: entry.id,
          accountId: line.accountId,
          type: line.type === "DEBIT" ? LineType.DEBIT : LineType.CREDIT,
          amount: line.amount,
          currency: line.currency,
          description: line.description ?? null,
          sortOrder: idx,
        });
      }

      logger.info("Journal entry created", {
        entryId: entry.id,
        entryNumber: entry.entryNumber,
        userId: user.id,
      });

      return success({ id: entry.id, entryNumber: entry.entryNumber });
    } catch (error) {
      logger.error("Error creating journal entry", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
