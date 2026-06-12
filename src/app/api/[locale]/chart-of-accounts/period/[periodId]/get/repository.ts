/**
 * Chart of Accounts — Period Get Repository
 * Retrieves a single accounting period by ID
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
