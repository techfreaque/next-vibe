/**
 * Chart of Accounts — Journal Entry Get Repository
 * Retrieves a single journal entry with all its lines
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { journalEntries, journalEntryLines } from "../../../db";
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
        .select()
        .from(journalEntryLines)
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
          lines: lines.map((line) => ({
            lineId: line.id,
            accountId: line.accountId,
            lineType: line.type,
            amount: line.amount,
            currency: line.currency,
            lineDescription: line.description ?? null,
          })),
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
