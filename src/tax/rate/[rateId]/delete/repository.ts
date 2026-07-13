/**
 * Tax Rate Delete Repository
 * Soft-deletes (deactivates) a tax rate after verifying ADMIN+ company membership
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { taxRates } from "../../../db";
import { scopedTranslation } from "../../../i18n";
import type {
  TaxRateDeleteResponseOutput,
  TaxRateDeleteUrlPathParams,
} from "./definition";

export class TaxRateDeleteRepository {
  static async softDelete(
    urlPathParams: TaxRateDeleteUrlPathParams,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<TaxRateDeleteResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      // Fetch the tax rate to get companyId for auth check
      const [existing] = await db
        .select({ id: taxRates.id, companyId: taxRates.companyId })
        .from(taxRates)
        .where(eq(taxRates.id, urlPathParams.rateId))
        .limit(1);

      if (!existing) {
        return fail({
          message: t("rate.delete.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify ADMIN+ company membership
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        existing.companyId,
        CompanyMemberRole.ADMIN,
        logger,
        locale,
      );

      if (!authResult.success) {
        return authResult;
      }

      await db
        .update(taxRates)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(taxRates.id, urlPathParams.rateId));

      return success({ deleted: true });
    } catch (error) {
      logger.error("Failed to deactivate tax rate", parseError(error));
      return fail({
        message: t("rate.delete.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
