/**
 * Chart of Accounts — Period Create Repository
 */

import "server-only";

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
import type { CountryLanguage } from "@/i18n/core/config";

import { accountingPeriods } from "../../db";
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

      const [inserted] = await db
        .insert(accountingPeriods)
        .values({
          companyId: data.companyId,
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
        })
        .returning({
          id: accountingPeriods.id,
          name: accountingPeriods.name,
        });

      logger.info("Accounting period created", {
        companyId: data.companyId,
        name: data.name,
        id: inserted.id,
      });

      return success({ id: inserted.id, name_out: inserted.name });
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
