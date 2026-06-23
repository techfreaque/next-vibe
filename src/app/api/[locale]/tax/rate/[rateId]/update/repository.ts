/**
 * Tax Rate Update Repository
 * Updates an existing tax rate after verifying ADMIN+ company membership
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
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { taxRates } from "../../../db";
import { scopedTranslation } from "../../../i18n";
import type {
  TaxRateUpdateRequestOutput,
  TaxRateUpdateResponseOutput,
  TaxRateUpdateUrlPathParams,
} from "./definition";

export class TaxRateUpdateRepository {
  static async update(
    urlPathParams: TaxRateUpdateUrlPathParams,
    data: TaxRateUpdateRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<TaxRateUpdateResponseOutput>> {
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
          message: t("rate.update.errors.notFound.title"),
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

      // Build partial update — only update provided fields
      const updateValues: Partial<{
        name: string;
        rate: number;
        isDefault: boolean;
        isActive: boolean;
        updatedAt: Date;
      }> = { updatedAt: new Date() };

      if (data.name !== undefined) {
        updateValues.name = data.name;
      }
      if (data.rate !== undefined) {
        updateValues.rate = data.rate;
      }
      if (data.isDefault !== undefined) {
        updateValues.isDefault = data.isDefault;
      }
      if (data.isActive !== undefined) {
        updateValues.isActive = data.isActive;
      }

      await db
        .update(taxRates)
        .set(updateValues)
        .where(eq(taxRates.id, urlPathParams.rateId));

      return success({ updated: true });
    } catch (error) {
      logger.error("Failed to update tax rate", parseError(error));
      return fail({
        message: t("rate.update.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
