/**
 * Tax Rate Create Repository
 * Inserts a new tax rate for a company after verifying ADMIN+ membership
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

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

import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { taxRates } from "../../db";
import { scopedTranslation } from "../../i18n";
import type {
  TaxRateCreateRequestOutput,
  TaxRateCreateResponseOutput,
} from "./definition";

export class TaxRateCreateRepository {
  static async create(
    data: TaxRateCreateRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<TaxRateCreateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

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

      // Check for duplicate code within the company
      const existing = await db
        .select({ id: taxRates.id })
        .from(taxRates)
        .where(
          and(
            eq(taxRates.companyId, data.companyId),
            eq(taxRates.code, data.taxCode),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        return fail({
          message: t("rate.create.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const [inserted] = await db
        .insert(taxRates)
        .values({
          companyId: data.companyId,
          name: data.taxName,
          code: data.taxCode,
          type: data.type,
          rate: data.rate,
          country: data.country ?? null,
          region: data.region ?? null,
          isDefault: data.isDefault ?? false,
        })
        .returning({
          id: taxRates.id,
          code: taxRates.code,
          name: taxRates.name,
        });

      if (!inserted) {
        return fail({
          message: t("rate.create.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
        id: inserted.id,
        resultCode: inserted.code,
        resultName: inserted.name,
      });
    } catch (error) {
      logger.error("Failed to create tax rate", parseError(error));
      return fail({
        message: t("rate.create.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
