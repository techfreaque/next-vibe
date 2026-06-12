/**
 * Companies Create Repository
 * Creates a new company and assigns the caller as OWNER
 */

import { parseError } from "next-vibe/shared/utils";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { companies, companyMembers } from "../db";
import { CompanyMemberRole } from "../enum";
import type { CompanyCreateRequestTypeOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CompaniesCreateRepository {
  static async createCompany(
    data: CompanyCreateRequestTypeOutput,
    logger: EndpointLogger,
    userId: string,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<{ result: { id: string; name: string } }>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { details } = data;

      const [company] = await db
        .insert(companies)
        .values({
          name: details.name,
          type: details.type,
          vatNumber: details.vatNumber,
          country: details.country,
          currency: details.currency ?? "EUR",
          email: details.email,
          phone: details.phone,
          website: details.website,
          ownerUserId: userId,
        })
        .returning({ id: companies.id, name: companies.name });

      if (!company) {
        logger.error("Failed to insert company");
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      await db.insert(companyMembers).values({
        companyId: company.id,
        userId,
        role: CompanyMemberRole.OWNER,
        invitedByUserId: userId,
      });

      return success({ result: { id: company.id, name: company.name } });
    } catch (error) {
      logger.error("Error creating company", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
