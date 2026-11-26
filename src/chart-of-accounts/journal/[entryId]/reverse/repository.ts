/**
 * Chart of Accounts — Journal Reverse Repository
 * Creates a reversal entry with mirrored debit/credit lines
 */

import "server-only";

import { eq } from "drizzle-orm";
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

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { journalEntries, journalEntryLines } from "../../../db";
import { JournalEntryStatus } from "../../../enum";
import { scopedTranslation } from "../../../i18n";
import {
  accountingDay,
  validateJournalLines,
} from "../../../shared/journal-validation";
import { writeJournalReversal } from "../../../shared/ledger-reversal";
import {
  findOpenPeriod,
  haveCompanyAccounts,
  journalValidationMessages,
  lockLedgerCompany,
} from "../../../shared/ledger-write";
import type { CoaJournalReverseRequestOutput } from "./definition";
import { describeJournalReversal } from "./i18n/entry-description";
import { hasManagedJournalDocument } from "./managed-document";

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

      const [initialEntry] = await db
        .select({ companyId: journalEntries.companyId })
        .from(journalEntries)
        .where(eq(journalEntries.id, data.entryId));

      if (!initialEntry) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        user.id,
        initialEntry.companyId,
        CompanyMemberRole.ACCOUNTANT,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const reversalDate = data.reversalDate ?? new Date();
      const result = await db.transaction(async (tx) => {
        const company = await lockLedgerCompany(tx, initialEntry.companyId);
        const [entry] = await tx
          .select()
          .from(journalEntries)
          .where(eq(journalEntries.id, data.entryId))
          .for("update");

        if (!company || !entry) {
          return fail({
            message: t("errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        if (entry.reversedById !== null) {
          return fail({
            message: t("journalReverse.errorAlreadyReversed"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        if (entry.status !== JournalEntryStatus.POSTED) {
          return fail({
            message: t("journalReverse.errorNotPosted"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        if (await hasManagedJournalDocument(tx, entry)) {
          return fail({
            message: t("journalReverse.errorManaged"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        if (
          !Number.isFinite(reversalDate.getTime()) ||
          accountingDay(reversalDate) < accountingDay(entry.date)
        ) {
          return fail({
            message: t("journalReverse.errorDate"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const period = await findOpenPeriod(tx, entry.companyId, reversalDate);
        if (!period) {
          return fail({
            message: t("journalReverse.errorNoPeriod"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const originalLines = await tx
          .select()
          .from(journalEntryLines)
          .where(eq(journalEntryLines.journalEntryId, entry.id))
          .orderBy(journalEntryLines.sortOrder);

        const issue = validateJournalLines(
          originalLines,
          originalLines[0]?.currency ?? "EUR",
        );
        if (issue) {
          return fail({
            message: t(journalValidationMessages[issue]),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        if (
          !(await haveCompanyAccounts(
            tx,
            entry.companyId,
            originalLines.map((line) => line.accountId),
            { historical: true },
          ))
        ) {
          return fail({
            message: t("journalCreate.errorAccount"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const reversalEntry = await writeJournalReversal(
          tx,
          entry,
          originalLines,
          {
            periodId: period.id,
            date: reversalDate,
            userId: user.id,
            memo: entry.memo,
            description: describeJournalReversal(
              locale,
              entry.entryNumber,
              entry.description,
            ),
          },
        );
        if (!reversalEntry) {
          return fail({
            message: t("errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }

        return success({
          reversalEntryId: reversalEntry.id,
          reversalEntryNumber: reversalEntry.entryNumber,
        });
      });

      if (result.success) {
        logger.info("Journal entry reversed", {
          originalEntryId: data.entryId,
          reversalEntryId: result.data.reversalEntryId,
          userId: user.id,
        });
      }

      return result;
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
