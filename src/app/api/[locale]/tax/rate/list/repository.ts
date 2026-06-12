/**
 * Tax Rate List Repository
 * Queries active tax rates for a company with pagination
 */

import "server-only";

import { and, count, eq, inArray } from "drizzle-orm";
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
import { companyMembers } from "@/app/api/[locale]/companies/db";
import { taxRates } from "../../db";
import { scopedTranslation } from "../../i18n";
import type {
  TaxRateListRequestOutput,
  TaxRateListResponseOutput,
} from "./definition";

export class TaxRateListRepository {
  static async list(
    data: TaxRateListRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<TaxRateListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      let companyIdCondition:
        | ReturnType<typeof eq>
        | ReturnType<typeof inArray>;

      if (!data.companyId) {
        // Get all companies the user is an active member of
        const memberRows = await db
          .select({ companyId: companyMembers.companyId })
          .from(companyMembers)
          .where(
            and(
              eq(companyMembers.userId, userId),
              eq(companyMembers.isActive, true),
            ),
          );
        const companyIds = memberRows.map((r) => r.companyId);
        if (companyIds.length === 0) {
          return success({ total: 0, rates: [] });
        }
        companyIdCondition = inArray(taxRates.companyId, companyIds);
      } else {
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
        companyIdCondition = eq(taxRates.companyId, data.companyId);
      }

      const conditions = [companyIdCondition, eq(taxRates.isActive, true)];

      if (data.country) {
        conditions.push(eq(taxRates.country, data.country));
      }

      if (data.type) {
        conditions.push(eq(taxRates.type, data.type));
      }

      const where = and(...conditions);

      const [{ value: total }] = await db
        .select({ value: count() })
        .from(taxRates)
        .where(where);

      const page = data.page ?? 1;
      const pageSize = data.pageSize ?? 20;
      const offset = (page - 1) * pageSize;

      const rows = await db
        .select()
        .from(taxRates)
        .where(where)
        .limit(pageSize)
        .offset(offset);

      return success({
        total: total ?? 0,
        rates: rows.map((row) => ({
          id: row.id,
          name: row.name,
          code: row.code,
          type: row.type,
          rate: row.rate,
          country: row.country,
          region: row.region,
          isDefault: row.isDefault,
          isActive: row.isActive,
          isCompound: row.isCompound,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        })),
      });
    } catch (error) {
      logger.error("Failed to list tax rates", parseError(error));
      return fail({
        message: t("rate.list.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
