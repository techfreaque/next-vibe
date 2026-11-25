/**
 * Chart of Accounts — Period Create Repository
 */

import "server-only";

import { and, eq, gte, lt } from "drizzle-orm";
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

import { accountingPeriods } from "../../db";
import {
  accountingDay,
  nextAccountingDay,
} from "../../shared/journal-validation";
import { lockLedgerCompany } from "../../shared/ledger-write";
import type { CoaPeriodCreateRequestOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CoaPeriodCreateRepository {
  static async createPeriod(
    data: CoaPeriodCreateRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ id: string; name_out: string }>> {
    try {
      // Verify ADMIN+ company membership
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        CompanyMemberRole.ADMIN,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const { t } = scopedTranslation.scopedT(locale);
      const startDate = accountingDay(data.startDate);
      const endDate = accountingDay(data.endDate);
      if (
        !Number.isFinite(startDate.getTime()) ||
        !Number.isFinite(endDate.getTime()) ||
        endDate < startDate
      ) {
        return fail({
          message: t("post.errors.validation.description"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const result = await db.transaction(async (tx) => {
        if (!(await lockLedgerCompany(tx, data.companyId))) {
          return fail({
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        const [overlappingPeriod] = await tx
          .select({ id: accountingPeriods.id })
          .from(accountingPeriods)
          .where(
            and(
              eq(accountingPeriods.companyId, data.companyId),
              gte(accountingPeriods.endDate, startDate),
              lt(accountingPeriods.startDate, nextAccountingDay(endDate)),
            ),
          )
          .limit(1);
        if (overlappingPeriod) {
          return fail({
            message: t("post.errors.conflict.description"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const [inserted] = await tx
          .insert(accountingPeriods)
          .values({
            companyId: data.companyId,
            name: data.name,
            startDate,
            endDate,
          })
          .returning({
            id: accountingPeriods.id,
            name: accountingPeriods.name,
          });

        return success({ id: inserted.id, name_out: inserted.name });
      });

      if (result.success) {
        logger.info("Accounting period created", {
          companyId: data.companyId,
          name: data.name,
          id: result.data.id,
        });
      }
      return result;
    } catch (error) {
      logger.error("Error creating period", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
