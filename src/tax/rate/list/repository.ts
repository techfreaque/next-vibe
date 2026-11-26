/**
 * Tax Rate List Repository
 * Queries active tax rates for a company with pagination
 */

import "server-only";

import { and, asc, count, desc, eq, inArray, sql } from "drizzle-orm";
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

import { companies, companyMembers } from "@/companies/db";
import { CompanyAuthRepository } from "@/companies/repository";

import { taxRates } from "../../db";
import { scopedTranslation } from "../../i18n";
import { getCompanyTaxRegime } from "../../regime/policy";
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

      const conditions = [
        companyIdCondition,
        data.rateId
          ? eq(taxRates.id, data.rateId)
          : eq(taxRates.isActive, true),
      ];

      if (data.country) {
        conditions.push(eq(taxRates.country, data.country));
      }

      if (data.type) {
        conditions.push(eq(taxRates.type, data.type));
      }

      // Statutory validity: documents only offer rates legal on their day.
      if (data.validOn) {
        const validOn = data.validOn;
        conditions.push(
          sql`(${taxRates.validFrom} is null or ${taxRates.validFrom} <= ${validOn})`,
          sql`(${taxRates.validTo} is null or ${taxRates.validTo} >= ${validOn})`,
        );
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
        .select({ rate: taxRates, companyName: companies.name })
        .from(taxRates)
        .innerJoin(companies, eq(companies.id, taxRates.companyId))
        .where(where)
        .orderBy(
          asc(companies.name),
          desc(taxRates.isDefault),
          desc(taxRates.rate),
          asc(taxRates.name),
          asc(taxRates.id),
        )
        .limit(pageSize)
        .offset(offset);

      return success({
        ...(data.companyId
          ? {
              salesExemptionNotice: (
                await getCompanyTaxRegime(db, data.companyId, new Date())
              ).notice,
            }
          : {}),
        total: total ?? 0,
        rates: rows.map(({ rate: row, companyName }) => ({
          id: row.id,
          companyId: row.companyId,
          companyName,
          name: row.name,
          code: row.code,
          type: row.type,
          rate: row.rate,
          country: row.country,
          region: row.region,
          validFrom: row.validFrom,
          validTo: row.validTo,
          isDefault: row.isDefault,
          isActive: row.isActive,
          isCompound: row.isCompound,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
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
