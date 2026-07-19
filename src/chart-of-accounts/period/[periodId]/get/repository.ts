/**
 * Chart of Accounts — Period Get Repository
 * Retrieves a single accounting period by ID
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
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { accountingPeriods } from "../../../db";
import { scopedTranslation } from "../../../i18n";
import type { CoaPeriodGetResponseOutput } from "./definition";

export class CoaPeriodGetRepository {
  static async getPeriod(
    periodId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CoaPeriodGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [period] = await db
        .select()
        .from(accountingPeriods)
        .where(eq(accountingPeriods.id, periodId))
        .limit(1);

      if (!period) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify company membership
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        period.companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );

      if (!authResult.success) {
        return authResult;
      }

      return success({
        result: {
          id: period.id,
          companyId: period.companyId,
          name: period.name,
          startDate: period.startDate,
          endDate: period.endDate,
          status: period.status,
          closedAt: period.closedAt ?? null,
        },
      });
    } catch (error) {
      logger.error("Error getting accounting period", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
