/**
 * Tax Report Repository
 * Returns tax collected by rate and period.
 * Wave 3: Full implementation after journal entries exist.
 * For now: returns empty array with correct shape.
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils";

import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { scopedTranslation } from "../i18n";
import type {
  TaxReportRequestOutput,
  TaxReportResponseOutput,
} from "./definition";

export class TaxReportRepository {
  static async getReport(
    data: TaxReportRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<TaxReportResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      // Verify company membership (any active role)
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        null,
        logger,
        locale,
      );

      if (!authResult.success) {
        return authResult;
      }

      // Wave 3: full implementation after journal entries exist.
      // Returning empty array with correct shape.
      return success({ rows: [] });
    } catch (error) {
      logger.error("Failed to generate tax report", parseError(error));
      return fail({
        message: t("report.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
