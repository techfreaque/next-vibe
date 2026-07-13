/**
 * Tax Report Repository
 * Returns tax collected by rate and period.
 * Wave 3: Full implementation after journal entries exist.
 * For now: returns empty array with correct shape.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyAuthRepository } from "@/companies/repository";

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
