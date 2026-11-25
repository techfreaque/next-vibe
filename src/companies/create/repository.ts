/**
 * Companies Create Repository
 * Creates a new company and assigns the caller as OWNER
 */

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
import { CompanyMemberRole } from "../enum";
import type {
  CompanyCreatePostResponseOutput,
  CompanyCreateRequestTypeOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class CompaniesCreateRepository {
  static async createCompany(
    data: CompanyCreateRequestTypeOutput,
    logger: EndpointLogger,
    userId: string,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<CompanyCreatePostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { details } = data;

      return await db.transaction(async (tx) => {
        const [company] = await tx
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
          .returning({
            id: companies.id,
            name: companies.name,
            country: companies.country,
          });

        if (!company) {
          logger.error("Failed to insert company");
          return fail({
            message: t("post.errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }

        await tx.insert(companyMembers).values({
          companyId: company.id,
          userId,
          role: CompanyMemberRole.OWNER,
          invitedByUserId: userId,
        });

        return success({ result: company });
      });
    } catch (error) {
      logger.error("Error creating company", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
