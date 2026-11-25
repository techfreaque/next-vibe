/**
 * Chart of Accounts — Period Close Repository
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

import { accountingPeriods, journalEntries } from "../../../db";
import { JournalEntryStatus, PeriodStatus } from "../../../enum";
import { lockLedgerCompany } from "../../../shared/ledger-write";
import { scopedTranslation } from "./i18n";

export class CoaPeriodCloseRepository {
  static async closePeriod(
    periodId: string,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ closed: boolean }>> {
    try {
      const { t } = scopedTranslation.scopedT(locale);

      const [period] = await db
        .select()
        .from(accountingPeriods)
        .where(eq(accountingPeriods.id, periodId))
        .limit(1);

      if (!period) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify ADMIN+ membership using the period's companyId
      const authResult = await CompanyAuthRepository.requireMember(
        user.id,
        period.companyId,
        CompanyMemberRole.ADMIN,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const result = await db.transaction(async (tx) => {
        const company = await lockLedgerCompany(tx, period.companyId);
        const [current] = await tx
          .select({ status: accountingPeriods.status })
          .from(accountingPeriods)
          .where(eq(accountingPeriods.id, period.id))
          .for("update");

        if (!company || !current) {
          return fail({
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        if (current.status === PeriodStatus.CLOSED) {
          return success({ closed: true });
        }

        if (current.status !== PeriodStatus.OPEN) {
          return fail({
            message: t("post.errors.conflict.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const [draft] = await tx
          .select({ id: journalEntries.id })
          .from(journalEntries)
          .where(
            and(
              eq(journalEntries.periodId, period.id),
              eq(journalEntries.status, JournalEntryStatus.DRAFT),
            ),
          )
          .limit(1);

        if (draft) {
          return fail({
            message: t("post.errors.conflict.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const now = new Date();
        await tx
          .update(accountingPeriods)
          .set({
            status: PeriodStatus.CLOSED,
            closedAt: now,
            closedByUserId: user.id,
            updatedAt: now,
          })
          .where(eq(accountingPeriods.id, period.id));

        return success({ closed: true });
      });

      if (result.success) {
        logger.info("Period closed", {
          periodId: periodId,
          userId: user.id,
        });
      }

      return result;
    } catch (error) {
      logger.error("Error closing period", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
