/**
 * Tax Rate Delete Repository
 * Soft-deletes (deactivates) a tax rate after verifying ADMIN+ company membership
 */

import "server-only";

import { eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

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
