/**
 * Companies Shared Repository
 * Shared authorization helpers for company-scoped operations
 */

import { and, eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import type { CompanyMember } from "./db";
import { companies, companyMembers } from "./db";
import type { CompanyTypeDB } from "./enum";
import { CompanyMemberRole } from "./enum";
import { scopedTranslation } from "./i18n";

const ROLE_ORDER: Record<string, number> = {
  [CompanyMemberRole.OWNER]: 5,
  [CompanyMemberRole.ADMIN]: 4,
  [CompanyMemberRole.ACCOUNTANT]: 3,
  [CompanyMemberRole.MEMBER]: 2,
  [CompanyMemberRole.VIEWER]: 1,
};

export class CompanyAuthRepository {
  /**
   * Verify the caller is an active member of the company.
   * Optionally enforce a minimum role.
   */
  static async requireMember(
    userId: string,
    companyId: string,
    minimumRole: string | null,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<CompanyMember>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [member] = await db
        .select()
        .from(companyMembers)
        .where(
          and(
            eq(companyMembers.userId, userId),
            eq(companyMembers.companyId, companyId),
            eq(companyMembers.isActive, true),
          ),
        )
        .limit(1);

      if (!member) {
        return fail({
          message: t("auth.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      if (minimumRole !== null) {
        const memberRank = ROLE_ORDER[member.role] ?? 0;
        const requiredRank = ROLE_ORDER[minimumRole] ?? 0;
        if (memberRank < requiredRank) {
          return fail({
            message: t("auth.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
      }

      return success(member);
    } catch (error) {
      logger.error("Error verifying company membership", parseError(error));
      return fail({
        message: t("auth.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

export class CompaniesRepository {
  static async getCompanyById(
    companyId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      id: string;
      name: string;
      type: (typeof CompanyTypeDB)[number];
      vatNumber: string | null;
      taxId: string | null;
      country: string | null;
      currency: string | null;
      email: string | null;
      phone: string | null;
      website: string | null;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    const authResult = await CompanyAuthRepository.requireMember(
      userId,
      companyId,
      null,
      logger,
      locale,
    );
    if (!authResult.success) {
      return authResult;
    }

    try {
      const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.id, companyId))
        .limit(1);

      if (!company) {
        return fail({
          message: t("auth.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({
        id: company.id,
        name: company.name,
        type: company.type,
        vatNumber: company.vatNumber ?? null,
        taxId: company.taxId ?? null,
        country: company.country ?? null,
        currency: company.currency ?? null,
        email: company.email ?? null,
        phone: company.phone ?? null,
        website: company.website ?? null,
        isActive: company.isActive,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      });
    } catch (error) {
      logger.error("Error fetching company", parseError(error));
      return fail({
        message: t("auth.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async updateCompany(
    companyId: string,
    userId: string,
    data: {
      name?: string;
      type?: string;
      vatNumber?: string;
      country?: string;
      currency?: string;
      email?: string;
      phone?: string;
      website?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      region?: string;
      postalCode?: string;
      logoUrl?: string;
    },
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<{ result: { id: string; name: string } }>> {
    const { t } = scopedTranslation.scopedT(locale);

    const authResult = await CompanyAuthRepository.requireMember(
      userId,
      companyId,
      CompanyMemberRole.ADMIN,
      logger,
      locale,
    );
    if (!authResult.success) {
      return authResult;
    }

    try {
      const [updated] = await db
        .update(companies)
        .set({
          name: data.name,
          vatNumber: data.vatNumber,
          country: data.country,
          currency: data.currency,
          email: data.email,
          phone: data.phone,
          website: data.website,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          city: data.city,
          region: data.region,
          postalCode: data.postalCode,
          logoUrl: data.logoUrl,
          updatedAt: new Date(),
        })
        .where(eq(companies.id, companyId))
        .returning({ id: companies.id, name: companies.name });

      if (!updated) {
        return fail({
          message: t("auth.errors.patchNotFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({ result: { id: updated.id, name: updated.name } });
    } catch (error) {
      logger.error("Error updating company", parseError(error));
      return fail({
        message: t("auth.errors.patchServer.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
