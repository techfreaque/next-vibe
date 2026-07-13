/**
 * Companies List Repository
 * Lists all companies the calling user is a member of with pagination
 */

import { count, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { companies, companyMembers } from "../db";
import type { CompanyMemberRoleDB, CompanyTypeDB } from "../enum";
import type { CompanyListGetRequestOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CompaniesListRepository {
  static async listUserCompanies(
    userId: string,
    data: CompanyListGetRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      total: number;
      companies: Array<{
        id: string;
        name: string;
        type: (typeof CompanyTypeDB)[number];
        role: (typeof CompanyMemberRoleDB)[number];
        isActive: boolean;
        country: string | null;
        currency: string | null;
        email: string | null;
        createdAt: Date;
      }>;
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const where = eq(companyMembers.userId, userId);

      const [{ value: total }] = await db
        .select({ value: count() })
        .from(companyMembers)
        .where(where);

      const page = data.page ?? 1;
      const pageSize = data.pageSize ?? 20;
      const offset = (page - 1) * pageSize;

      const rows = await db
        .select({
          id: companies.id,
          name: companies.name,
          type: companies.type,
          role: companyMembers.role,
          isActive: companies.isActive,
          country: companies.country,
          currency: companies.currency,
          email: companies.email,
          createdAt: companies.createdAt,
        })
        .from(companyMembers)
        .innerJoin(companies, eq(companyMembers.companyId, companies.id))
        .where(where)
        .limit(pageSize)
        .offset(offset);

      return success({ total: total ?? 0, companies: rows });
    } catch (error) {
      logger.error("Error listing user companies", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
