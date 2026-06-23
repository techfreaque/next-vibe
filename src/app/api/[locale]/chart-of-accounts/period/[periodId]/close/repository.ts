/**
 * Chart of Accounts — Period Close Repository
 */

import "server-only";

import { and, eq } from "drizzle-orm";
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

import { accountingPeriods, journalEntries } from "../../../db";
import { JournalEntryStatus, PeriodStatus } from "../../../enum";
import type { CoaPeriodCloseRequestOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CoaPeriodCloseRepository {
  static async closePeriod(
    data: CoaPeriodCloseRequestOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ closed: boolean }>> {
    try {
      const { t } = scopedTranslation.scopedT(locale);

      const [period] = await db
        .select()
        .from(accountingPeriods)
        .where(eq(accountingPeriods.id, data.periodId))
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

      // Check for DRAFT entries in this period
      const draftEntries = await db
        .select({ id: journalEntries.id })
        .from(journalEntries)
        .where(
          and(
            eq(journalEntries.periodId, data.periodId),
            eq(journalEntries.status, JournalEntryStatus.DRAFT),
          ),
        )
        .limit(1);

      if (draftEntries.length > 0) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      await db
        .update(accountingPeriods)
        .set({
          status: PeriodStatus.CLOSED,
          closedAt: new Date(),
          closedByUserId: user.id,
          updatedAt: new Date(),
        })
        .where(eq(accountingPeriods.id, data.periodId));

      logger.info("Period closed", {
        periodId: data.periodId,
        userId: user.id,
      });

      return success({ closed: true });
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
