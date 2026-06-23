/**
 * Chart of Accounts — Journal Reverse Repository
 * Creates a reversal entry with mirrored debit/credit lines
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

import { journalEntries, journalEntryLines } from "../../../db";
import { JournalEntryStatus, LineType } from "../../../enum";
import { scopedTranslation } from "../../../i18n";
import type { CoaJournalReverseRequestOutput } from "./definition";

export class CoaJournalReverseRepository {
  static async reverseEntry(
    data: CoaJournalReverseRequestOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{ reversalEntryId: string; reversalEntryNumber: string }>
  > {
    try {
      const { t } = scopedTranslation.scopedT(locale);

      const [entry] = await db
        .select()
        .from(journalEntries)
        .where(eq(journalEntries.id, data.entryId))
        .limit(1);

      if (!entry) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify ACCOUNTANT+ membership using the entry's companyId
      const authResult = await CompanyAuthRepository.requireMember(
        user.id,
        entry.companyId,
        CompanyMemberRole.ACCOUNTANT,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      if (entry.status !== JournalEntryStatus.POSTED) {
        return fail({
          message: t("journalReverse.errorNotPosted"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      if (entry.reversedById !== null) {
        return fail({
          message: t("journalReverse.errorAlreadyReversed"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Fetch original lines
      const originalLines = await db
        .select()
        .from(journalEntryLines)
        .where(eq(journalEntryLines.journalEntryId, data.entryId))
        .orderBy(journalEntryLines.sortOrder);

      // Generate reversal entry number
      const [{ value: existingCount }] = await db
        .select({ value: count() })
        .from(journalEntries)
        .where(eq(journalEntries.periodId, entry.periodId));

      const reversalDate = data.reversalDate
        ? new Date(data.reversalDate)
        : new Date();
      const year = reversalDate.getFullYear();
      const entrySeq = existingCount + 1;
      const reversalEntryNumber = `JE-${year}-${String(entrySeq).padStart(4, "0")}`;

      const [reversalEntry] = await db
        .insert(journalEntries)
        .values({
          companyId: entry.companyId,
          periodId: entry.periodId,
          entryNumber: reversalEntryNumber,
          date: reversalDate,
          description: `Reversal of ${entry.entryNumber}: ${entry.description}`,
          memo: entry.memo ?? null,
          status: JournalEntryStatus.POSTED,
          reversalOfId: entry.id,
          postedAt: new Date(),
          postedByUserId: user.id,
          sourceType: entry.sourceType,
        })
        .returning({
          id: journalEntries.id,
          entryNumber: journalEntries.entryNumber,
        });

      if (!reversalEntry) {
        return fail({
          message: t("errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Mirror lines: swap DEBIT ↔ CREDIT
      await db.insert(journalEntryLines).values(
        originalLines.map((line, idx) => ({
          journalEntryId: reversalEntry.id,
          accountId: line.accountId,
          type: line.type === LineType.DEBIT ? LineType.CREDIT : LineType.DEBIT,
          amount: line.amount,
          currency: line.currency,
          description: line.description ?? null,
          sortOrder: idx,
        })),
      );

      // Mark original entry as reversed
      await db
        .update(journalEntries)
        .set({
          reversedById: reversalEntry.id,
          status: JournalEntryStatus.REVERSED,
          updatedAt: new Date(),
        })
        .where(eq(journalEntries.id, data.entryId));

      logger.info("Journal entry reversed", {
        originalEntryId: data.entryId,
        reversalEntryId: reversalEntry.id,
        userId: user.id,
      });

      return success({
        reversalEntryId: reversalEntry.id,
        reversalEntryNumber: reversalEntry.entryNumber,
      });
    } catch (error) {
      logger.error("Error reversing journal entry", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
