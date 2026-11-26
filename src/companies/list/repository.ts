/**
 * Companies List Repository
 * Lists companies with pagination and the caller’s membership role
 */

import { and, asc, count, eq, isNotNull } from "drizzle-orm";
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
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";

import { companies, companyMembers } from "../db";
import type {
  CompanyListGetRequestOutput,
  CompanyListGetResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class CompaniesListRepository {
  static async listUserCompanies(
    user: JwtPayloadType,
    data: CompanyListGetRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<CompanyListGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    if (user.isPublic) {
      return fail({
        message: t("get.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    const includeAll = data.includeAll === true;
    if (includeAll && !user.roles.includes(UserPermissionRole.ADMIN)) {
      return fail({
        message: t("get.errors.forbidden.description"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    try {
      const membership = and(
        eq(companyMembers.companyId, companies.id),
        eq(companyMembers.userId, user.id),
        eq(companyMembers.isActive, true),
      );
      const where = includeAll ? undefined : isNotNull(companyMembers.id);

      const [{ value: total }] = await db
        .select({ value: count() })
        .from(companies)
        .leftJoin(companyMembers, membership)
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
        .from(companies)
        .leftJoin(companyMembers, membership)
        .where(where)
        .orderBy(asc(companies.name), asc(companies.id))
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
