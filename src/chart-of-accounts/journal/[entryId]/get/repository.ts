/**
 * Chart of Accounts — Journal Entry Get Repository
 * Retrieves a single journal entry with all its lines
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { accountNodes, journalEntries, journalEntryLines } from "../../../db";
import { scopedTranslation } from "../../../i18n";
import type { CoaJournalEntryGetResponseOutput } from "./definition";

export class CoaJournalEntryGetRepository {
  static async getEntry(
    entryId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CoaJournalEntryGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [entry] = await db
        .select()
        .from(journalEntries)
        .where(eq(journalEntries.id, entryId))
        .limit(1);

      if (!entry) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify company membership
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        entry.companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );

      if (!authResult.success) {
        return authResult;
      }

      const lines = await db
        .select({
          lineId: journalEntryLines.id,
          accountId: journalEntryLines.accountId,
          accountCode: accountNodes.code,
          accountName: accountNodes.name,
          lineType: journalEntryLines.type,
          amount: journalEntryLines.amount,
          currency: journalEntryLines.currency,
          lineDescription: journalEntryLines.description,
        })
        .from(journalEntryLines)
        .leftJoin(
          accountNodes,
          and(
            eq(accountNodes.id, journalEntryLines.accountId),
            eq(accountNodes.companyId, entry.companyId),
          ),
        )
        .where(eq(journalEntryLines.journalEntryId, entryId))
        .orderBy(journalEntryLines.sortOrder);

      return success({
        result: {
          id: entry.id,
          companyId: entry.companyId,
          periodId: entry.periodId,
          entryNumber: entry.entryNumber,
          date: entry.date,
          description: entry.description,
          memo: entry.memo ?? null,
          status: entry.status,
          sourceType: entry.sourceType,
          sourceId: entry.sourceId ?? null,
          postedAt: entry.postedAt ?? null,
          reversalOfId: entry.reversalOfId ?? null,
          lines,
        },
      });
    } catch (error) {
      logger.error("Error getting journal entry", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
