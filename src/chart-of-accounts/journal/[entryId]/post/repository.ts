/**
 * Chart of Accounts — Journal Post Repository
 * Changes DRAFT → POSTED, records postedAt and postedByUserId
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
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import {
  accountingPeriods,
  journalEntries,
  journalEntryLines,
} from "../../../db";
import { JournalEntryStatus, PeriodStatus } from "../../../enum";
import { scopedTranslation } from "../../../i18n";
import {
  accountingDay,
  validateJournalLines,
} from "../../../shared/journal-validation";
import {
  haveCompanyAccounts,
  journalValidationMessages,
  lockLedgerCompany,
} from "../../../shared/ledger-write";

export class CoaJournalPostRepository {
  static async postEntry(
    entryId: string,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ posted: boolean }>> {
    try {
      const { t } = scopedTranslation.scopedT(locale);

      const [initialEntry] = await db
        .select({ companyId: journalEntries.companyId })
        .from(journalEntries)
        .where(eq(journalEntries.id, entryId));

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

      const result = await db.transaction(async (tx) => {
        const company = await lockLedgerCompany(tx, initialEntry.companyId);
        const [entry] = await tx
          .select()
          .from(journalEntries)
          .where(eq(journalEntries.id, entryId))
          .for("update");

        if (!company || !entry) {
          return fail({
            message: t("errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        if (entry.status === JournalEntryStatus.POSTED) {
          return fail({
            message: t("journalPost.errorAlreadyPosted"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        if (entry.status !== JournalEntryStatus.DRAFT) {
          return fail({
            message: t("journalPost.errorNotDraft"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const [period] = await tx
          .select()
          .from(accountingPeriods)
          .where(
            and(
              eq(accountingPeriods.id, entry.periodId),
              eq(accountingPeriods.companyId, entry.companyId),
            ),
          );
        if (!period || period.status !== PeriodStatus.OPEN) {
          return fail({
            message: t("journalCreate.errorPeriodClosed"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const day = accountingDay(entry.date);
        if (
          day < accountingDay(period.startDate) ||
          day > accountingDay(period.endDate)
        ) {
          return fail({
            message: t("journalCreate.errorDate"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const lines = await tx
          .select()
          .from(journalEntryLines)
          .where(eq(journalEntryLines.journalEntryId, entry.id));
        const issue = validateJournalLines(lines, company.currency ?? "EUR");
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
            lines.map((line) => line.accountId),
          ))
        ) {
          return fail({
            message: t("journalCreate.errorAccount"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const now = new Date();
        await tx
          .update(journalEntries)
          .set({
            status: JournalEntryStatus.POSTED,
            postedAt: now,
            postedByUserId: user.id,
            updatedAt: now,
          })
          .where(eq(journalEntries.id, entry.id));

        return success({ posted: true });
      });

      if (result.success) {
        logger.info("Journal entry posted", {
          entryId: entryId,
          userId: user.id,
        });
      }

      return result;
    } catch (error) {
      logger.error("Error posting journal entry", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
