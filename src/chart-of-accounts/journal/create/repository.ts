/**
 * Chart of Accounts — Journal Create Repository
 * Validates double-entry balance, generates entry number, inserts entry + lines
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

import { accountingPeriods, journalEntries, journalEntryLines } from "../../db";
import { LineType, PeriodStatus } from "../../enum";
import { scopedTranslation } from "../../i18n";
import {
  accountingDay,
  journalLineType,
  validateJournalLines,
} from "../../shared/journal-validation";
import {
  haveCompanyAccounts,
  journalValidationMessages,
  lockLedgerCompany,
  nextJournalEntryNumber,
} from "../../shared/ledger-write";
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

      const date = new Date(data.date);
      if (!Number.isFinite(date.getTime())) {
        return fail({
          message: t("journalCreate.errorDate"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const result = await db.transaction(async (tx) => {
        const company = await lockLedgerCompany(tx, data.companyId);
        const [period] = await tx
          .select()
          .from(accountingPeriods)
          .where(
            and(
              eq(accountingPeriods.id, data.periodId),
              eq(accountingPeriods.companyId, data.companyId),
            ),
          );

        if (!company || !period) {
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

        const day = accountingDay(date);
        if (
          day < accountingDay(period.startDate) ||
          day > accountingDay(period.endDate)
        ) {
          return fail({
            message: t("journalCreate.errorDate"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const currency = company.currency ?? "EUR";
        const lines = data.lines.map((line) => ({
          ...line,
          currency: line.currency ?? currency,
        }));
        const issue = validateJournalLines(lines, currency);
        if (issue) {
          return fail({
            message: t(journalValidationMessages[issue]),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        if (
          !(await haveCompanyAccounts(
            tx,
            data.companyId,
            lines.map((line) => line.accountId),
          ))
        ) {
          return fail({
            message: t("journalCreate.errorAccount"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const entryNumber = await nextJournalEntryNumber(
          tx,
          data.companyId,
          date,
        );
        const [entry] = await tx
          .insert(journalEntries)
          .values({
            companyId: data.companyId,
            periodId: data.periodId,
            entryNumber,
            date,
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

        await tx.insert(journalEntryLines).values(
          lines.map((line, sortOrder) => ({
            journalEntryId: entry.id,
            accountId: line.accountId,
            type: journalLineType(line.type) ?? LineType.CREDIT,
            amount: line.amount,
            currency: line.currency,
            description: line.description ?? null,
            sortOrder,
          })),
        );

        return success(entry);
      });

      if (result.success) {
        logger.info("Journal entry created", {
          entryId: result.data.id,
          entryNumber: result.data.entryNumber,
          userId: user.id,
        });
      }

      return result;
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
